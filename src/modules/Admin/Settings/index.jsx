"use client";

import { useState } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useAdminSettings, useUpdateAdminFeatureFlagMutation } from "@/lib/hooks/admin/useOverview";
import { useRouter } from "next/navigation";
import { S } from './styles';
import { FLAG_META } from './constants';

import SettingsHeader from './SettingsHeader';
import SettingsFlags from './SettingsFlags';
import SettingsIntegrations from './SettingsIntegrations';

export function Settings() {
  const { user } = useAdminAuthStore();
  const router = useRouter();
  const [saving, setSaving] = useState({});
  const [notif, setNotif] = useState(null);

  const settingsQuery = useAdminSettings({ enabled: user?.role === "superAdmin" });
  const updateFeatureFlagMutation = useUpdateAdminFeatureFlagMutation();

  if (user?.role !== "superAdmin") return null;

  const loading = settingsQuery.isPending;
  const flags = settingsQuery.error ? { progressTracking: true, moduleFollowing: true, qaComments: true, shopAndCTAs: true, contentApprovalWorkflow: true, moduleGlossary: false, liveSessionScheduling: false, learnerRegistration: true } : (settingsQuery.data?.data?.features || {});
  const integrations = settingsQuery.error ? { razorpay: { connected: true, keyId: "rzp_live_xxx" }, cloudflareR2: { connected: true, bucketName: "fameo-media" }, sendgrid: { connected: false, apiKey: "" }, firebase: { connected: true } } : (settingsQuery.data?.data?.integrations || {});

  const showNotif = (msg) => { setNotif(msg); setTimeout(() => setNotif(null), 3000); };

  const toggleFlag = async (key) => {
    const next = { [key]: !flags[key] };
    setSaving(s => ({ ...s, [key]: true }));
    try {
      await updateFeatureFlagMutation.toggleFlag(next);
      settingsQuery.refetch();
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
