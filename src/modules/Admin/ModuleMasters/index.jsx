"use client";
// app/admin/module-masters/page.js

import { useState, useEffect } from "react";
import { S } from './styles';
import ModuleMastersHeader from './ModuleMastersHeader';
import ModuleMastersModal from './ModuleMastersModal';
import ModuleMastersList from './ModuleMastersList';

// Exporting as named export to match original caller: import { ModuleMasters } from '@/modules/Admin/ModuleMasters';
export function ModuleMasters() {
    const [masters, setMasters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(null);
    const [notif, setNotif] = useState(null);

    useEffect(() => {
        fetch("/api/admin/module-masters")
            .then(r => r.json()).then(d => setMasters(d.data || []))
            .catch(() => setMasters([
                { _id: "mm1", name: "Kiran Mehta", email: "kiran@fameo.in", assignedModules: [0, 1], lastSeen: new Date(Date.now() - 3600000).toISOString() },
                { _id: "mm2", name: "Priya Sharma", email: "priya@fameo.in", assignedModules: [3, 4], lastSeen: new Date(Date.now() - 86400000).toISOString() },
                { _id: "mm3", name: "Arjun Reddy", email: "arjun@fameo.in", assignedModules: [5], lastSeen: new Date(Date.now() - 172800000).toISOString() },
            ]))
            .finally(() => setLoading(false));
    }, []);

    const showNotif = (msg) => { setNotif(msg); setTimeout(() => setNotif(null), 3000); };

    const invite = async () => {
        if (!form?.email || !form?.name) return;
        try {
            const res = await fetch("/api/admin/module-masters", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            const data = await res.json();
            setMasters(prev => [data.data, ...prev]);
            setForm(null);
            showNotif("Module master invited");
        } catch { showNotif("Invite failed"); }
    };

    const updateModules = async (id, mods) => {
        try {
            await fetch(`/api/admin/module-masters/${id}/modules`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ moduleIds: mods }) });
            setMasters(prev => prev.map(m => m._id === id ? { ...m, assignedModules: mods } : m));
            showNotif("Modules updated");
        } catch { showNotif("Update failed"); }
    };

    const revoke = async (id) => {
        if (!confirm("Revoke module master access? They will be downgraded to learner.")) return;
        await fetch(`/api/admin/module-masters/${id}`, { method: "DELETE" });
        setMasters(prev => prev.filter(m => m._id !== id));
        showNotif("Access revoked");
    };

    return (
        <div style={S.page}>
            {notif && <div style={S.toast}>{notif}</div>}
            
            <ModuleMastersHeader setForm={setForm} />
            
            <ModuleMastersModal form={form} setForm={setForm} invite={invite} />
            
            <ModuleMastersList 
                loading={loading} 
                masters={masters} 
                updateModules={updateModules} 
                revoke={revoke} 
            />
        </div>
    );
}

// Keeping default export just in case it is imported dynamically anywhere else
export default ModuleMasters;
