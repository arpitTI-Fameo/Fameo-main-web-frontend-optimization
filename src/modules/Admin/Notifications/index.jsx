"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";
import { S } from './styles';
import { EMPTY } from './constants';

import NotificationsHeader from './NotificationsHeader';
import NotificationsCompose from './NotificationsCompose';
import NotificationsHistory from './NotificationsHistory';

export function Notifications() {
  const { user } = useAdminAuthStore();
  const [sent, setSent] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const loadNotifications = useCallback(async () => {
    try {
      const data = await api.get("/admin/notifications");
      setSent(data?.data?.notifications || data?.data || []);
    } catch {
      setSent([
        { _id: "n1", title: "New module dropped: Scaling & Career Growth", type: "newContent", audience: "all", sentAt: new Date(Date.now() - 86400000).toISOString(), openRate: 34 },
        { _id: "n2", title: "Brand Deal template pack now live", type: "product", audience: "moduleFollowers", sentAt: new Date(Date.now() - 172800000).toISOString(), openRate: 28 },
        { _id: "n3", title: "Platform update: Q&A now available", type: "platformUpdate", audience: "all", sentAt: new Date(Date.now() - 259200000).toISOString(), openRate: 41 },
      ]);
    }
  }, []);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  // Live — refresh when another admin sends a notification
  useSocket({ "notification:sent": loadNotifications });

  const send = async () => {
    if (!form.title || !form.body) return alert("Title and body required");
    setSending(true);
    try {
      const data = await api.post("/notifications", form);
      if (data?.data) setSent(prev => [data.data, ...prev]);
      setForm(EMPTY);
      showToast("Notification sent to learners ◉");
    } catch { showToast("Send failed", false); }
    setSending(false);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={S.page}>
      {toast && <div style={{ ...S.toast, background: toast.ok ? "#7ec87e" : "#d49090" }}>{toast.msg}</div>}

      <NotificationsHeader />

      <div style={S.layout}>
        <NotificationsCompose form={form} set={set} send={send} sending={sending} />
        <NotificationsHistory sent={sent} />
      </div>
    </div>
  );
}

export default Notifications;
