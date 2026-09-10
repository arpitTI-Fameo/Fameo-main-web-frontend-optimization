
"use client";
// app/admin/login/page.js

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/adminAuthStore";

// SAST C-1. This table used to carry an `email` and `pw` for each role, and a
// `quickLogin` button that submitted them. Being in a client component, all four
// production admin passwords were compiled into the public JavaScript bundle —
// readable by any visitor via DevTools → Sources, no authentication required.
//
// What remains is descriptive UI only: labels and colours for the access-level
// legend. No credential, and no code path that submits one, belongs in a file
// that ships to the browser.
//
// ⚠️ Deleting this does NOT undo the exposure. Those four passwords were public
// for as long as the bundle was served. Rotate them in the database and review
// admin sign-in logs before treating this as closed.
const ROLES = [
  { role: "superAdmin",     label: "Super Admin",     color: "#C9A96E", desc: "Full access"              },
  { role: "contentManager", label: "Content Manager", color: "#b89fd4", desc: "All content, no revenue"  },
  { role: "moduleMaster",   label: "Module Master",   color: "#7eb8d8", desc: "Assigned modules only"    },
  { role: "supportAgent",   label: "Support Agent",   color: "#7ec87e", desc: "Support & learner lookup" },
];

export default function AdminLogin() {
  const router = useRouter();
  const { login, user, loading, error, clearError } = useAdminAuthStore();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // Wait for Zustand to load persisted state before redirecting
  useEffect(() => { setHydrated(true); }, []);

  // Only redirect after hydration — prevents false redirect when store is empty on first render
  useEffect(() => {
    if (hydrated && user) router.replace("/admin");
  }, [user, router, hydrated]);

  // Show nothing until hydrated — avoids black flash
  if (!hydrated) return null;

  const submit = async (e) => {
    e?.preventDefault();
    clearError();
    const res = await login(email, password);
    if (res?.success) router.replace("/admin");
  };

  return (
    <div style={S.page}>
      <div style={S.glow1} /><div style={S.glow2} />
      <div style={S.card}>
        <div style={S.logoWrap}>
          <span style={S.logo}>Fameo <span style={{ color: "#C9A96E" }}>Admin</span></span>
          <p style={S.logoSub}>Creator Learning Platform</p>
        </div>

        {error && <div style={S.err}>✕ {error}</div>}

        <form onSubmit={submit} style={S.form}>
          <div style={S.field}>
            <label style={S.label}>Email</label>
            <input style={S.input} type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@fameo.in" required autoComplete="email" />
          </div>
          <div style={S.field}>
            <label style={S.label}>Password</label>
            <input style={S.input} type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required autoComplete="current-password" />
          </div>
          <button type="submit" disabled={loading} style={{ ...S.submit, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <div style={S.rolesBlock}>
          <p style={S.rolesTitle}>Access Levels</p>
          <div style={S.rolesGrid}>
            {ROLES.map(r => (
              <div key={r.role} style={{ ...S.roleChip, borderColor: r.color + "44" }}>
                <span style={{ ...S.roleDot, background: r.color }} />
                <div>
                  <span style={{ ...S.roleChipName, color: r.color }}>{r.label}</span>
                  <span style={S.roleChipDesc}>{r.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const S = {
  page:        { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0c0c12", fontFamily: "'DM Sans',sans-serif", padding: 20, position: "relative", overflow: "hidden" },
  glow1:       { position: "fixed", top: "10%", left: "20%", width: 400, height: 400, background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)", pointerEvents: "none" },
  glow2:       { position: "fixed", bottom: "10%", right: "20%", width: 300, height: 300, background: "radial-gradient(circle, rgba(126,184,216,0.05) 0%, transparent 70%)", pointerEvents: "none" },
  card:        { position: "relative", zIndex: 1, background: "#14141c", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "40px 36px", width: "100%", maxWidth: 440 },
  logoWrap:    { textAlign: "center", marginBottom: 32 },
  logo:        { fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "#F0E8D6" },
  logoSub:     { fontSize: 11, color: "rgba(240,232,214,0.3)", letterSpacing: ".12em", textTransform: "uppercase", marginTop: 6 },
  err:         { background: "#d4909022", border: "1px solid #d4909055", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#d49090", marginBottom: 20, display: "flex", gap: 8, alignItems: "center" },
  form:        { display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 },
  field:       { display: "flex", flexDirection: "column", gap: 6 },
  label:       { fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(240,232,214,0.35)" },
  input:       { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "11px 14px", fontSize: 14, color: "#F0E8D6", outline: "none", fontFamily: "'DM Sans',sans-serif" },
  submit:      { background: "#C9A96E", border: "none", borderRadius: 8, padding: 13, fontSize: 13, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#1a1200", cursor: "pointer", marginTop: 4, transition: "opacity .2s" },
  rolesBlock:  { borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, marginBottom: 20 },
  rolesTitle:  { fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(240,232,214,0.2)", marginBottom: 12 },
  rolesGrid:   { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  roleChip:    { display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 10px", border: "1px solid", borderRadius: 7 },
  roleDot:     { width: 6, height: 6, borderRadius: "50%", flexShrink: 0, marginTop: 4 },
  roleChipName:{ display: "block", fontSize: 11, fontWeight: 500 },
  roleChipDesc:{ display: "block", fontSize: 10, color: "rgba(240,232,214,0.28)", marginTop: 1 },
  devBlock:    { borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 },
  devToggle:   { fontSize: 10, color: "rgba(240,232,214,0.25)", background: "none", border: "none", cursor: "pointer", letterSpacing: ".06em", width: "100%", textAlign: "center", marginBottom: 10 },
  devGrid:     { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 },
  devBtn:      { fontSize: 11, padding: "7px 10px", border: "1px solid", borderRadius: 6, background: "transparent", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: ".04em", transition: "opacity .2s" },
};