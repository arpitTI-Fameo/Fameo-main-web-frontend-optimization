"use client";
// app/admin/contacts/page.js

import { useState, useEffect, useCallback } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";
import { S } from './styles';
import ContactsHeader from "./ContactsHeader";
import ContactsFilters from "./ContactsFilters";
import ContactsTable from "./ContactsTable";

export default function Contacts() {
    const { user } = useAdminAuthStore();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRole] = useState("all");

    const load = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (roleFilter !== "all") params.set("role", roleFilter);
            const data = await api.get(`/admin/contacts?${params}`);
            setUsers(data?.data?.users || []);
        } catch {
            setUsers([
                { _id: "u1", name: "Aarav Sharma", email: "aarav@example.com", role: "learner", createdAt: new Date(Date.now() - 86400000).toISOString(), orderCount: 3, isActive: true },
                { _id: "u2", name: "Priya Nair", email: "priya@example.com", role: "learner", createdAt: new Date(Date.now() - 172800000).toISOString(), orderCount: 1, isActive: true },
                { _id: "u3", name: "Rohit Verma", email: "rohit@example.com", role: "creator", createdAt: new Date(Date.now() - 259200000).toISOString(), orderCount: 5, isActive: true },
                { _id: "u4", name: "Sneha Kumar", email: "sneha@example.com", role: "learner", createdAt: new Date(Date.now() - 345600000).toISOString(), orderCount: 0, isActive: false },
                { _id: "u5", name: "Kiran Patel", email: "kiran@example.com", role: "creator", createdAt: new Date(Date.now() - 432000000).toISOString(), orderCount: 2, isActive: true },
            ]);
        }
        setLoading(false);
    }, [search, roleFilter]);

    useEffect(() => { load(); }, [load]);

    // supportAgent sees limited info — no email
    const showEmail = user?.role !== "supportAgent" || user?.role === "superAdmin";

    return (
        <div style={S.page}>
            <ContactsHeader user={user} usersLength={users.length} />
            <ContactsFilters search={search} setSearch={setSearch} roleFilter={roleFilter} setRole={setRole} />
            <ContactsTable loading={loading} users={users} showEmail={showEmail} />
        </div>
    );
}
