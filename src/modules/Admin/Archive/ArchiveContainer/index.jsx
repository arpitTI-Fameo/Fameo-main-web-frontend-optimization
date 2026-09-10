"use client";
// modules/Admin/Archive/ArchiveContainer/index.jsx

import { useState, useEffect, useCallback } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";

import Toast from "../Toast";
import ArchiveCard from "../ArchiveCard";
import { S } from "../styles";

export default function ArchiveContainer() {
    const { user } = useAdminAuthStore();
    const isSuperAdmin = user?.role === "superAdmin";
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const showToast = (msg, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    };

    const loadArchive = useCallback(async () => {
        try {
            const data = await api.get("/admin/archive");
            setItems(data?.data?.topics || data?.data || []);
        } catch {
            setItems([
                { _id: "t1", title: "Old Algorithm Guide 2022", moduleId: 3, level: "b", readTime: "6 min", updatedAt: new Date(Date.now() - 2592000000).toISOString(), createdByName: "Admin" },
                { _id: "t2", title: "Outdated Brand Rate Guide", moduleId: 5, level: "i", readTime: "8 min", updatedAt: new Date(Date.now() - 5184000000).toISOString(), createdByName: "Priya S." },
                { _id: "t3", title: "Deprecated Studio Setup v1", moduleId: 2, level: "b", readTime: "10 min", updatedAt: new Date(Date.now() - 7776000000).toISOString(), createdByName: "Kiran M." },
            ]);
        }
        setLoading(false);
    }, []);

    useEffect(() => { loadArchive(); }, [loadArchive]);

    // Live — when a topic is archived from Content OS, refresh list
    useSocket({ "topic:archived": loadArchive });

    const restore = async (id) => {
        try {
            await api.patch(`/admin/archive/${id}/restore`, {});
            setItems(prev => prev.filter(i => i._id !== id));
            showToast("Topic restored and published live ◉");
        } catch { showToast("Restore failed", false); }
    };

    const permanentDelete = async (id) => {
        if (!confirm("Permanently delete? This cannot be undone and removes all version history.")) return;
        try {
            await api.delete(`/admin/content/${id}`);
            setItems(prev => prev.filter(i => i._id !== id));
            showToast("Permanently deleted");
        } catch { showToast("Delete failed", false); }
    };

    return (
        <div style={S.page}>
            <Toast toast={toast} />

            <div style={S.header}>
                <div>
                    <h1 style={S.heading}>Archive</h1>
                    <p style={S.sub}>Archived topics. Restore to publish live, or permanently delete.</p>
                </div>
                <span style={S.count}>{items.length} archived</span>
            </div>

            {loading ? <div style={S.empty}>Loading…</div> :
                items.length === 0 ? <div style={S.empty}>Archive is empty</div> :
                    <div style={S.list}>
                        {items.map(item => (
                            <ArchiveCard
                                key={item._id}
                                item={item}
                                isSuperAdmin={isSuperAdmin}
                                restore={restore}
                                permanentDelete={permanentDelete}
                            />
                        ))}
                    </div>
            }
        </div>
    );
}
