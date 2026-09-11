"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAdminProducts, useSaveProductMutation, useUpdateProductStatusMutation } from "@/lib/hooks/admin/useProducts";
import { S } from './styles';

import ProductsHeader from './ProductsHeader';
import ProductsModal from './ProductsModal';
import ProductsList from './ProductsList';

export function Products() {
  const { user }   = useAuthStore();
  const [form, setForm]         = useState(null); // null = closed, {} = new/edit
  const [saving, setSaving]     = useState(false);
  const [notif, setNotif]       = useState(null);

  const productsQuery = useAdminProducts();
  const saveMutation = useSaveProductMutation();
  const updateStatusMutation = useUpdateProductStatusMutation();

  const loading = productsQuery.isPending;
  const products = productsQuery.error ? [
    { _id:"p1", name:"Reels Masterclass",          price:"₹1,499", type:"course",   status:"published", purchases:234, description:"Master Reels from hook to CTA." },
    { _id:"p2", name:"Brand Deal Template Pack",   price:"₹799",   type:"template", status:"published", purchases:187, description:"10 email templates that convert." },
    { _id:"p3", name:"Creator Finance Guide",      price:"₹499",   type:"ebook",    status:"draft",     purchases:0,   description:"Tax & finance for Indian creators." },
  ] : (productsQuery.data?.data?.data || productsQuery.data?.data || []);



  const showNotif = (msg, ok=true) => { setNotif({msg,ok}); setTimeout(()=>setNotif(null),3000); };

  const save = async () => {
    setSaving(true);
    try {
      const isNew = !form._id;
      await saveMutation.saveProduct({ id: form._id, form });
      productsQuery.refetch();
      setForm(null);
      showNotif(isNew ? "Product created" : "Product updated");
    } catch { showNotif("Save failed", false); }
    setSaving(false);
  };

  const toggleStatus = async (id, current) => {
    const status = current==="published" ? "draft" : "published";
    try {
      await updateStatusMutation.updateStatus({ id, status });
      productsQuery.refetch();
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
