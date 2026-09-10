"use client";
// app/admin/content/page.js
// Permission-aware Content OS — changes reflect LIVE on resources page via Socket.io

import { useState, useEffect, useCallback } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";
import { S } from './styles';
import { MODULES } from './constants';
import ContentOSHeader from './ContentOSHeader';
import ContentOSFilters from './ContentOSFilters';
import ContentOSTable from './ContentOSTable';

export default function ContentOS() {
    const { user } = useAdminAuthStore();
    const role = user?.role;

    // ── Permission flags per role
    const canCreate = ["superAdmin", "contentManager", "moduleMaster"].includes(role);
    const canEdit = ["superAdmin", "contentManager", "moduleMaster"].includes(role);
    const canPublish = ["superAdmin", "contentManager"].includes(role);
    const canDelete = role === "superAdmin";
    const canArchive = ["superAdmin", "contentManager"].includes(role);
    const canApprove = ["superAdmin", "contentManager"].includes(role);
    const isReadOnly = role === "supportAgent";
    const isMM = role === "moduleMaster";

    // moduleMaster sees only assigned modules
    const assignedModules = isMM ? (user?.assignedModules || []) : null;

    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ status: "all", module: "all", search: "" });
    const [selected, setSelected] = useState(new Set());
    const [toast, setToast] = useState(null);

    const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

    const fetchTopics = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (filter.status !== "all") params.set("status", filter.status);
            if (filter.module !== "all") params.set("moduleId", filter.module);
            if (filter.search) params.set("search", filter.search);
            if (assignedModules?.length) params.set("moduleIds", assignedModules.join(","));
            const data = await api.get(`/admin/content?${params}`);
            setTopics(data?.data?.topics || []);
        } catch {
            setTopics([
                { _id: "t1", title: "Creator vs Influencer", moduleId: 0, status: "published", level: "b", readTime: "8 min", updatedAt: new Date().toISOString(), createdByName: "Admin" },
                { _id: "t2", title: "Choosing a Niche", moduleId: 0, status: "published", level: "b", readTime: "12 min", updatedAt: new Date().toISOString(), createdByName: "Admin" },
                { _id: "t3", title: "Instagram Algorithm", moduleId: 3, status: "draft", level: "i", readTime: "18 min", updatedAt: new Date().toISOString(), createdByName: "Kiran M." },
                { _id: "t4", title: "Brand Deal Rate Card", moduleId: 5, status: "review", level: "i", readTime: "10 min", updatedAt: new Date().toISOString(), createdByName: "Priya S." },
                { _id: "t5", title: "YouTube SEO", moduleId: 3, status: "draft", level: "i", readTime: "22 min", updatedAt: new Date().toISOString(), createdByName: "Arjun R." },
                { _id: "t6", title: "Old Algorithm 2022", moduleId: 3, status: "archived", level: "b", readTime: "6 min", updatedAt: new Date().toISOString(), createdByName: "Admin" },
            ]);
        }
        setLoading(false);
    }, [filter, JSON.stringify(assignedModules)]);

    useEffect(() => { fetchTopics(); }, [fetchTopics]);

    // Live sync — when any topic changes status, refetch
    useSocket({
        "topic:published": fetchTopics,
        "topic:archived": fetchTopics,
        "topic:deleted": fetchTopics,
        "topic:updated": fetchTopics,
    });

    const changeStatus = async (id, status) => {
        try {
            await api.patch(`/admin/content/${id}/status`, { status });
            setTopics(ts => ts.map(t => t._id === id ? { ...t, status } : t));
            const msg =
                status === "published" ? "Published live ◉ — visible on Learner Hub instantly" :
                    status === "archived" ? "Archived — removed from Learner Hub" :
                        status === "review" ? "Submitted for review" : "Updated";
            showToast(msg);
        } catch { showToast("Failed to update", false); }
    };

    const deleteTopic = async (id) => {
        if (!confirm("Permanently delete? Cannot be undone.")) return;
        try {
            await api.delete(`/admin/content/${id}`);
            setTopics(ts => ts.filter(t => t._id !== id));
            showToast("Deleted");
        } catch { showToast("Delete failed", false); }
    };

    const bulkAction = async (action) => {
        await Promise.all([...selected].map(id => changeStatus(id, action)));
        setSelected(new Set());
        showToast(`Bulk ${action} complete`);
    };

    const filtered = topics.filter(t => {
        if (filter.status !== "all" && t.status !== filter.status) return false;
        if (filter.module !== "all" && t.moduleId !== parseInt(filter.module)) return false;
        if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
        if (assignedModules && !assignedModules.includes(t.moduleId)) return false;
        return true;
    });

    // Available modules for this role
    const visibleModules = assignedModules
        ? MODULES.filter(m => assignedModules.includes(m.id))
        : MODULES;

    const accent = { superAdmin: "#C9A96E", contentManager: "#b89fd4", moduleMaster: "#7eb8d8", supportAgent: "#7ec87e" }[role] || "#C9A96E";

    return (
        <div style={S.page}>
            {toast && <div style={{ ...S.toast, background: toast.ok ? "#7ec87e" : "#d49090" }}>{toast.msg}</div>}

            <ContentOSHeader
                isReadOnly={isReadOnly}
                isMM={isMM}
                visibleModules={visibleModules}
                canPublish={canPublish}
                canCreate={canCreate}
                accent={accent}
            />

            {/* Role banner for read-only */}
            {isReadOnly && (
                <div style={S.readOnlyBanner}>
                    ◎ Support Agent — read-only view. Content editing is not available for your role.
                </div>
            )}

            <ContentOSFilters
                filter={filter}
                setFilter={setFilter}
                visibleModules={visibleModules}
                selected={selected}
                setSelected={setSelected}
                canPublish={canPublish}
                bulkAction={bulkAction}
            />

            <ContentOSTable
                isReadOnly={isReadOnly}
                canEdit={canEdit}
                isMM={isMM}
                canApprove={canApprove}
                canPublish={canPublish}
                canArchive={canArchive}
                canDelete={canDelete}
                selected={selected}
                setSelected={setSelected}
                filtered={filtered}
                loading={loading}
                user={user}
                role={role}
                assignedModules={assignedModules}
                changeStatus={changeStatus}
                deleteTopic={deleteTopic}
            />

            <div style={S.foot}>
                <span>Showing {filtered.length} of {topics.length} topics</span>
                {canPublish && <span style={{ color: "#7ec87e", fontWeight: 500 }}>◉ Published topics go live on Learner Hub via Socket.io — no refresh needed</span>}
                {isReadOnly && <span style={{ color: "#aaa" }}>◎ Read-only — contact Content Manager to make changes</span>}
            </div>
        </div>
    );
}
