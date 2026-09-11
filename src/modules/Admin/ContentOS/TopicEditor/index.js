"use client";
// app/admin/content/[id]/edit/page.js  — [id]="new" for new topics

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useAdminContentById, useSaveContentMutation } from "@/lib/hooks/admin/useContent";
import { S } from './styles';
import { MODULES } from '../constants';

import TopicEditorTopBar from './TopicEditorTopBar';
import TopicEditorPane from './TopicEditorPane';
import TopicPreviewPane from './TopicPreviewPane';

const EMPTY = { title: "", shortDesc: "", moduleId: 0, level: "b", readTime: "5 min", body: "", checklist: [""], takeaways: [""], status: "draft", mediaIds: [], productId: "" };

export default function TopicEditor({ params }) {
    const { id } = use(params);
    const isNew = id === "new";
    const router = useRouter();
    const { user } = useAdminAuthStore();

    const isMM = user?.role === "moduleMaster";
    const canPublish = ["superAdmin", "contentManager"].includes(user?.role);
    const canSubmitForReview = isMM;
    const assignedModules = isMM ? (user?.assignedModules || []) : null;

    // Modules this role can assign topics to
    const availableModules = assignedModules
        ? MODULES.filter(m => assignedModules.includes(m.id))
        : MODULES;

    const [topic, setTopic] = useState(EMPTY);
    const [showPicker, setShowPicker] = useState(false);
    const [attachedMedia, setAttachedMedia] = useState({});  // id → {name,type} for display
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [preview, setPreview] = useState(false);
    const [tab, setTab] = useState("content");
    const [toast, setToast] = useState(null);

    const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

    const contentQuery = useAdminContentById(id, { enabled: !isNew });
    const saveMutation = useSaveContentMutation();

    useEffect(() => {
        if (isNew) {
            // Default moduleId to first assigned module for moduleMaster
            if (assignedModules?.length) setTopic(t => ({ ...t, moduleId: assignedModules[0] }));
            setLoading(false);
            return;
        }
        if (contentQuery.isSuccess || contentQuery.isError) {
            const t = contentQuery.data?.data?.topic || EMPTY;
            // Block moduleMaster from editing outside assigned modules
            if (isMM && assignedModules && !assignedModules.includes(t.moduleId)) {
                alert("You don't have access to edit this topic.");
                router.replace("/admin/content");
                return;
            }
            if (contentQuery.isSuccess) setTopic(t);
            setLoading(false);
        }
    }, [isNew, contentQuery.isSuccess, contentQuery.isError, contentQuery.data]);

    const set = (k, v) => setTopic(t => ({ ...t, [k]: v }));
    const setArr = (k, i, v) => setTopic(t => { const a = [...t[k]]; a[i] = v; return { ...t, [k]: a }; });
    const addArr = (k) => setTopic(t => ({ ...t, [k]: [...t[k], ""] }));
    const remArr = (k, i) => setTopic(t => ({ ...t, [k]: t[k].filter((_, j) => j !== i) }));

    const save = async (overrideStatus) => {
        if (!topic.title.trim()) { showToast("Title is required", false); return; }
        setSaving(true);
        const payload = { ...topic };
        if (overrideStatus) payload.status = overrideStatus;
        try {
            const saved_ = await saveMutation.saveContent({ id, isNew, form: payload });
            const savedTopic = saved_?.data?.topic;
            if (savedTopic) setTopic(savedTopic);
            setSaved(true); setTimeout(() => setSaved(false), 2000);
            if (isNew && savedTopic?._id) router.replace(`/admin/content/${savedTopic._id}/edit`);
            showToast(
                overrideStatus === "published" ? "Published live ◉ — visible on Learner Hub instantly" :
                    overrideStatus === "review" ? "Submitted for review — awaiting approval" :
                        "Draft saved"
            );
        } catch (e) { showToast(e.message || "Save failed", false); }
        setSaving(false);
    };

    if (loading) return (
        <div style={{ padding: 40, fontFamily: "'DM Sans',sans-serif", color: "#aaa", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#C9A96E" }}>◈</span> Loading topic…
        </div>
    );

    return (
        <div style={S.page}>
            {toast && <div style={{ ...S.toast, background: toast.ok ? "#7ec87e" : "#d49090" }}>{toast.msg}</div>}

            <TopicEditorTopBar
                topic={topic}
                router={router}
                saved={saved}
                preview={preview}
                setPreview={setPreview}
                save={save}
                saving={saving}
                canSubmitForReview={canSubmitForReview}
                canPublish={canPublish}
            />

            <div style={{ ...S.layout, gridTemplateColumns: preview ? "1fr 1fr" : "1fr" }}>
                <TopicEditorPane
                    topic={topic}
                    set={set}
                    setArr={setArr}
                    addArr={addArr}
                    remArr={remArr}
                    tab={tab}
                    setTab={setTab}
                    availableModules={availableModules}
                    isMM={isMM}
                    attachedMedia={attachedMedia}
                    setAttachedMedia={setAttachedMedia}
                    showPicker={showPicker}
                    setShowPicker={setShowPicker}
                />

                {preview && (
                    <TopicPreviewPane topic={topic} />
                )}
            </div>
        </div>
    );
}
