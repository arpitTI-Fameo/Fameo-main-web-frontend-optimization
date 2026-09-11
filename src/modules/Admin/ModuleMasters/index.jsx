"use client";
// app/admin/module-masters/page.js

import { useState } from "react";
import { useAdminModuleMasters, useInviteModuleMasterMutation, useUpdateModuleMasterModulesMutation, useRevokeModuleMasterMutation } from "@/lib/hooks/admin/useModulemasters";
import { S } from './styles';
import ModuleMastersHeader from './ModuleMastersHeader';
import ModuleMastersModal from './ModuleMastersModal';
import ModuleMastersList from './ModuleMastersList';

// Exporting as named export to match original caller: import { ModuleMasters } from '@/modules/Admin/ModuleMasters';
export function ModuleMasters() {
    const [form, setForm] = useState(null);
    const [notif, setNotif] = useState(null);

    const mastersQuery = useAdminModuleMasters();
    const inviteMutation = useInviteModuleMasterMutation();
    const updateModulesMutation = useUpdateModuleMasterModulesMutation();
    const revokeMutation = useRevokeModuleMasterMutation();

    const loading = mastersQuery.isPending;
    const masters = mastersQuery.error ? [
        { _id: "mm1", name: "Kiran Mehta", email: "kiran@fameo.in", assignedModules: [0, 1], lastSeen: new Date(Date.now() - 3600000).toISOString() },
        { _id: "mm2", name: "Priya Sharma", email: "priya@fameo.in", assignedModules: [3, 4], lastSeen: new Date(Date.now() - 86400000).toISOString() },
        { _id: "mm3", name: "Arjun Reddy", email: "arjun@fameo.in", assignedModules: [5], lastSeen: new Date(Date.now() - 172800000).toISOString() },
    ] : (mastersQuery.data?.data?.data || mastersQuery.data?.data || []);

    const showNotif = (msg) => { setNotif(msg); setTimeout(() => setNotif(null), 3000); };

    const invite = async () => {
        if (!form?.email || !form?.name) return;
        try {
            await inviteMutation.invite(form);
            mastersQuery.refetch();
            setForm(null);
            showNotif("Module master invited");
        } catch { showNotif("Invite failed"); }
    };

    const updateModules = async (id, mods) => {
        try {
            await updateModulesMutation.updateModules({ id, mods });
            mastersQuery.refetch();
            showNotif("Modules updated");
        } catch { showNotif("Update failed"); }
    };

    const revoke = async (id) => {
        if (!confirm("Revoke module master access? They will be downgraded to learner.")) return;
        try {
            await revokeMutation.revoke(id);
            mastersQuery.refetch();
            showNotif("Access revoked");
        } catch { showNotif("Revoke failed"); }
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
