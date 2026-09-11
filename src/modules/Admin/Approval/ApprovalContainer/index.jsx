"use client";
// modules/Admin/Approval/ApprovalContainer/index.jsx

import { useState } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useAdminApprovals, useReviewApprovalMutation } from "@/lib/hooks/admin/useApprovals";
import { useSocket } from "@/lib/hooks/custome/useSocket";

import Toast from "../Toast";
import ApprovalTabs from "../ApprovalTabs";
import ApprovalCard from "../ApprovalCard";
import { S } from "../styles";

export default function ApprovalContainer() {
  const { user } = useAdminAuthStore();
  const accent = "#C9A96E";
  const [tab, setTab] = useState("pending");
  const [toast, setToast] = useState(null);

  const approvalsQuery = useAdminApprovals(tab);
  const reviewMutation = useReviewApprovalMutation();

  const loading = approvalsQuery.isPending;
  const items = approvalsQuery.error ? [
    { _id: "a1", type: "topic", title: "Reels Algorithm Deep Dive", submittedByName: "Kiran M.", submittedAt: new Date(Date.now() - 3600000).toISOString(), status: "pending" },
    { _id: "a2", type: "product", title: "Brand Deal Template Pack", submittedByName: "Priya S.", submittedAt: new Date(Date.now() - 7200000).toISOString(), status: "pending" },
    { _id: "a3", type: "topic", title: "Instagram Growth Masterclass", submittedByName: "Arjun R.", submittedAt: new Date(Date.now() - 10800000).toISOString(), status: "pending" },
    { _id: "a4", type: "media", title: "Creator Studio Setup Guide.pdf", submittedByName: "Nisha K.", submittedAt: new Date(Date.now() - 14400000).toISOString(), status: "pending" },
  ] : (approvalsQuery.data?.data?.approvals || approvalsQuery.data?.data || []);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // Live — refresh when another admin reviews something
  useSocket({ "admin:approval_reviewed": approvalsQuery.refetch });

  const review = async (id, status, notes = "") => {
    try {
      await reviewMutation.reviewApproval({ id, form: { status, notes } });
      approvalsQuery.refetch();
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
