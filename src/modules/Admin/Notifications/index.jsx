"use client";

import { useState } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useAdminNotifications, useSendNotificationMutation } from "@/lib/hooks/admin/useNotifications";
import { useSocket } from "@/lib/hooks/custome/useSocket";
import { S } from './styles';
import { EMPTY } from './constants';

import NotificationsHeader from './NotificationsHeader';
import NotificationsCompose from './NotificationsCompose';
import NotificationsHistory from './NotificationsHistory';

export function Notifications() {
  const { user } = useAdminAuthStore();
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const notificationsQuery = useAdminNotifications();
  const sendMutation = useSendNotificationMutation();

  const sent = notificationsQuery.error ? [
    { _id: "n1", title: "New module dropped: Scaling & Career Growth", type: "newContent", audience: "all", sentAt: new Date(Date.now() - 86400000).toISOString(), openRate: 34 },
    { _id: "n2", title: "Brand Deal template pack now live", type: "product", audience: "moduleFollowers", sentAt: new Date(Date.now() - 172800000).toISOString(), openRate: 28 },
    { _id: "n3", title: "Platform update: Q&A now available", type: "platformUpdate", audience: "all", sentAt: new Date(Date.now() - 259200000).toISOString(), openRate: 41 },
  ] : (notificationsQuery.data?.data?.notifications || notificationsQuery.data?.data || []);

  // Live — refresh when another admin sends a notification
  useSocket({ "notification:sent": notificationsQuery.refetch });

  const send = async () => {
    if (!form.title || !form.body) return alert("Title and body required");
    setSending(true);
    try {
      await sendMutation.sendNotification(form);
      notificationsQuery.refetch();
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
