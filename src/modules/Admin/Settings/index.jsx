"use client";

import { useState, useEffect } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { S } from './styles';
import { FLAG_META } from './constants';

import SettingsHeader from './SettingsHeader';
import SettingsFlags from './SettingsFlags';
import SettingsIntegrations from './SettingsIntegrations';

export function Settings() {
  const { user } = useAdminAuthStore();
  const router = useRouter();
  const [flags, setFlags] = useState({});
  const [integrations, setInteg] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    if (user && user.role !== "superAdmin") { router.push("/admin"); return; }
    api.get("/admin/settings")
      .then(d => { setFlags(d.data?.features || {}); setInteg(d.data?.integrations || {}); })
      .catch(() => {
        setFlags({ progressTracking: true, moduleFollowing: true, qaComments: true, shopAndCTAs: true, contentApprovalWorkflow: true, moduleGlossary: false, liveSessionScheduling: false, learnerRegistration: true });
        setInteg({ razorpay: { connected: true, keyId: "rzp_live_xxx" }, cloudflareR2: { connected: true, bucketName: "fameo-media" }, sendgrid: { connected: false, apiKey: "" }, firebase: { connected: true } });
      })
      .finally(() => setLoading(false));
  }, [user, router]);

  if (user?.role !== "superAdmin") return null;

  const showNotif = (msg) => { setNotif(msg); setTimeout(() => setNotif(null), 3000); };

  const toggleFlag = async (key) => {
    const next = { ...flags, [key]: !flags[key] };
    setFlags(next);
    setSaving(s => ({ ...s, [key]: true }));
    try {
      await api.patch("/admin/settings/features", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [key]: next[key] }) });
      showNotif(`${FLAG_META[key]?.label} ${next[key] ? "enabled" : "disabled"} — live instantly`);
    } catch { showNotif("Save failed"); }
    setSaving(s => ({ ...s, [key]: false }));
  };

  return (
    <div style={S.page}>
      {notif && <div style={S.toast}>{notif}</div>}
      
      <SettingsHeader />

      {loading ? <div style={S.empty}>Loading…</div> : <>
        <SettingsFlags flags={flags} toggleFlag={toggleFlag} saving={saving} />
        <SettingsIntegrations integrations={integrations} />
      </>}
    </div>
  );
}

export default Settings;
