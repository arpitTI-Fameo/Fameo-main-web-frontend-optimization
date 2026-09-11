"use client";
// app/admin/contacts/page.js

import { useState } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useAdminContacts } from "@/lib/hooks/admin/useContacts";
import { S } from './styles';
import ContactsHeader from "./ContactsHeader";
import ContactsFilters from "./ContactsFilters";
import ContactsTable from "./ContactsTable";

export default function Contacts() {
    const { user } = useAdminAuthStore();
    const [search, setSearch] = useState("");
    const [roleFilter, setRole] = useState("all");
    
    const contactsQuery = useAdminContacts(search, roleFilter);

    const loading = contactsQuery.isPending;
    const users = contactsQuery.error ? [
        { _id: "u1", name: "Aarav Sharma", email: "aarav@example.com", role: "learner", createdAt: new Date(Date.now() - 86400000).toISOString(), orderCount: 3, isActive: true },
        { _id: "u2", name: "Priya Nair", email: "priya@example.com", role: "learner", createdAt: new Date(Date.now() - 172800000).toISOString(), orderCount: 1, isActive: true },
        { _id: "u3", name: "Rohit Verma", email: "rohit@example.com", role: "creator", createdAt: new Date(Date.now() - 259200000).toISOString(), orderCount: 5, isActive: true },
        { _id: "u4", name: "Sneha Kumar", email: "sneha@example.com", role: "learner", createdAt: new Date(Date.now() - 345600000).toISOString(), orderCount: 0, isActive: false },
        { _id: "u5", name: "Kiran Patel", email: "kiran@example.com", role: "creator", createdAt: new Date(Date.now() - 432000000).toISOString(), orderCount: 2, isActive: true },
    ] : (contactsQuery.data?.data?.users || []);

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
