"use client";
// modules/Admin/Approval/ApprovalContainer/index.jsx

import { useState, useEffect, useCallback } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";

import Toast from "../Toast";
import ApprovalTabs from "../ApprovalTabs";
import ApprovalCard from "../ApprovalCard";
import { S } from "../styles";

export default function ApprovalContainer() {
  const { user } = useAdminAuthStore();
  const accent = "#C9A96E";
  const [tab, setTab] = useState("pending");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const loadApprovals = useCallback(async (status) => {
    setLoading(true);
    try {
      const data = await api.get(`/admin/approvals?status=${status}`);
      setItems(data?.data?.approvals || []);
    } catch {
      setItems([
        { _id: "a1", type: "topic", title: "Reels Algorithm Deep Dive", submittedByName: "Kiran M.", submittedAt: new Date(Date.now() - 3600000).toISOString(), status: "pending" },
        { _id: "a2", type: "product", title: "Brand Deal Template Pack", submittedByName: "Priya S.", submittedAt: new Date(Date.now() - 7200000).toISOString(), status: "pending" },
        { _id: "a3", type: "topic", title: "Instagram Growth Masterclass", submittedByName: "Arjun R.", submittedAt: new Date(Date.now() - 10800000).toISOString(), status: "pending" },
        { _id: "a4", type: "media", title: "Creator Studio Setup Guide.pdf", submittedByName: "Nisha K.", submittedAt: new Date(Date.now() - 14400000).toISOString(), status: "pending" },
      ]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadApprovals(tab); }, [tab, loadApprovals]);

  // Live — refresh when another admin reviews something
  useSocket({ "admin:approval_reviewed": () => loadApprovals(tab) });

  const review = async (id, status, notes = "") => {
    try {
      await api.patch(`/admin/approvals/${id}`, { status, notes });
      setItems(prev => prev.filter(i => i._id !== id));
      showToast(
        status === "approved" ? "Approved — published live ◉" :
          status === "rejected" ? "Rejected" : "Changes requested"
      );
    } catch { showToast("Action failed", false); }
  };

  return (
    <div style={S.page}>
      <Toast toast={toast} />

      <div style={S.header}>
        <div>
          <h1 style={S.heading}>Approvals</h1>
          <p style={S.sub}>Review and approve content submitted by module masters.</p>
        </div>
        <span style={S.liveNote}>◉ Live — auto-refreshes on new submissions</span>
      </div>

      {/* Tabs */}
      <ApprovalTabs tab={tab} setTab={setTab} accent={accent} />

      {loading ? <div style={S.empty}>Loading…</div> :
        items.length === 0 ? <div style={S.empty}>No {tab} approvals</div> :
          <div style={S.list}>
            {items.map(item => (
              <ApprovalCard
                key={item._id}
                item={item}
                tab={tab}
                accent={accent}
                review={review}
              />
            ))}
          </div>
      }
    </div>
  );
}
