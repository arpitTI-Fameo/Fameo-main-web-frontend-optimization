"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { S } from './styles';

import ProductsHeader from './ProductsHeader';
import ProductsModal from './ProductsModal';
import ProductsList from './ProductsList';

export function Products() {
  const { user }   = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(null); // null = closed, {} = new/edit
  const [saving, setSaving]     = useState(false);
  const [notif, setNotif]       = useState(null);

  useEffect(() => {
    fetch("/api/admin/products")
      .then(r => r.json())
      .then(d => setProducts(d.data || []))
      .catch(() => setProducts([
        { _id:"p1", name:"Reels Masterclass",          price:"₹1,499", type:"course",   status:"published", purchases:234, description:"Master Reels from hook to CTA." },
        { _id:"p2", name:"Brand Deal Template Pack",   price:"₹799",   type:"template", status:"published", purchases:187, description:"10 email templates that convert." },
        { _id:"p3", name:"Creator Finance Guide",      price:"₹499",   type:"ebook",    status:"draft",     purchases:0,   description:"Tax & finance for Indian creators." },
      ]))
      .finally(() => setLoading(false));
  }, []);

  const showNotif = (msg, ok=true) => { setNotif({msg,ok}); setTimeout(()=>setNotif(null),3000); };

  const save = async () => {
    setSaving(true);
    try {
      const isNew = !form._id;
      const url   = isNew ? "/api/admin/products" : `/api/admin/products/${form._id}`;
      const method= isNew ? "POST" : "PUT";
      const res   = await fetch(url, { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      const data  = await res.json();
      if (isNew) setProducts(prev => [data.data, ...prev]);
      else setProducts(prev => prev.map(p => p._id===form._id ? data.data : p));
      setForm(null);
      showNotif(isNew ? "Product created" : "Product updated");
    } catch { showNotif("Save failed", false); }
    setSaving(false);
  };

  const toggleStatus = async (id, current) => {
    const status = current==="published" ? "draft" : "published";
    try {
      await fetch(`/api/admin/products/${id}/status`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({status}) });
      setProducts(prev => prev.map(p => p._id===id ? {...p,status} : p));
      showNotif(status==="published" ? "Product published live" : "Product unpublished");
    } catch { showNotif("Update failed", false); }
  };

  return (
    <div style={S.page}>
      {notif && <div style={{...S.toast,background:notif.ok?"#7ec87e":"#d49090"}}>{notif.msg}</div>}

      <ProductsHeader setForm={setForm} />

      <ProductsModal form={form} setForm={setForm} save={save} saving={saving} />

      <ProductsList 
        loading={loading} 
        products={products} 
        setForm={setForm} 
        toggleStatus={toggleStatus} 
      />
    </div>
  );
}

export default Products;
