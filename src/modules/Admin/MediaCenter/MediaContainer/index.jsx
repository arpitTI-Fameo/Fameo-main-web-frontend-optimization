"use client";
// modules/Admin/MediaCenter/MediaContainer/index.jsx

import { useState, useEffect, useRef, useCallback } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";

import Toast from "../Toast";
import MediaHeader from "../MediaHeader";
import MediaFilters from "../MediaFilters";
import MediaCard from "../MediaCard";
import { S } from "../styles";

export default function MediaContainer() {
    const { user } = useAdminAuthStore();
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState(null);
    const fileRef = useRef(null);

    const showToast = (msg, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    };

    const loadMedia = useCallback(async () => {
        try {
            const data = await api.get("/admin/media");
            setMedia(data?.data?.media || data?.data || []);
        } catch {
            setMedia([
                { _id: "m1", name: "Creator Setup Guide.mp4", type: "video", sizeBytes: 52428800, uploadedByRole: "moduleMaster", uploadedAt: new Date(Date.now() - 86400000).toISOString(), url: "#", attachedTopics: ["t1", "t2"] },
                { _id: "m2", name: "Brand Deal Template.pdf", type: "pdf", sizeBytes: 1048576, uploadedByRole: "contentManager", uploadedAt: new Date(Date.now() - 172800000).toISOString(), url: "#", attachedTopics: ["t3"] },
                { _id: "m3", name: "Studio Thumbnail.png", type: "image", sizeBytes: 204800, uploadedByRole: "moduleMaster", uploadedAt: new Date(Date.now() - 259200000).toISOString(), url: "#", attachedTopics: [] },
                { _id: "m4", name: "Analytics Dashboard.png", type: "graphic", sizeBytes: 307200, uploadedByRole: "superAdmin", uploadedAt: new Date(Date.now() - 345600000).toISOString(), url: "#", attachedTopics: ["t4"] },
            ]);
        }
        setLoading(false);
    }, []);

    useEffect(() => { loadMedia(); }, [loadMedia]);

    // Live — refresh when media is uploaded from another session
    useSocket({ "media:uploaded": loadMedia, "media:deleted": loadMedia });

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const form = new FormData();
            form.append("file", file);
            const data = await api.upload("/media/upload", form);
            if (data?.data) setMedia(prev => [data.data, ...prev]);
            showToast("File uploaded successfully ◉");
        } catch (err) { showToast(err.message || "Upload failed", false); }
        setUploading(false);
        e.target.value = "";
    };

    const deleteMedia = async (id) => {
        if (!confirm("Delete this file? It will be removed from all attached topics.")) return;
        try {
            await api.delete(`/media/${id}`);
            setMedia(prev => prev.filter(m => m._id !== id));
            showToast("File deleted");
        } catch { showToast("Delete failed", false); }
    };

    const filtered = media.filter(m => {
        if (filter !== "all" && m.type !== filter) return false;
        if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    return (
        <div style={S.page}>
            <Toast toast={toast} />

            <MediaHeader
                total={media.length}
                fileRef={fileRef}
                uploading={uploading}
                handleUpload={handleUpload}
            />

            {/* Filters */}
            <MediaFilters
                filter={filter}
                setFilter={setFilter}
                search={search}
                setSearch={setSearch}
                count={filtered.length}
            />

            {/* Grid */}
            {loading ? <div style={S.empty}>Loading…</div> :
                filtered.length === 0 ? <div style={S.empty}>No files found</div> :
                    <div style={S.grid}>
                        {filtered.map(m => (
                            <MediaCard key={m._id} item={m} deleteMedia={deleteMedia} />
                        ))}
                    </div>
            }
        </div>
    );
}
