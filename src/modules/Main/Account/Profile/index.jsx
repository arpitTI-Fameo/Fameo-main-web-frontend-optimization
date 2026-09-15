"use client";

import { useState, useEffect } from "react";
import AccountDashboard from "@/modules/Main/Account/AccountDashboard";

import { S, GOLD } from "./styles";
import { pickPhoto } from "./helpers";
import Avatar from "./Avatar";
import Verified from "./Verified";
import Field from "./Field";
import Section from "./Section";
import { useProfile } from '@/lib/hooks/main/useUser';

export default function Profile({ initialData }) {
  const { data: json, isLoading: loading, error: apiError } = useProfile({ initialData });
  const [profile, setProfile] = useState(null);
  
  const error = apiError?.message || "";

  useEffect(() => {
    if (!json) return;
    try {
      const entry = Array.isArray(json?.data) ? json.data[0] : json?.data;
      const up = entry?.user_profile || entry || {};
      const registration = entry?.registration || {};
      const merged = {
        ...up,
        profile_picture: pickPhoto(up, registration, entry),
        documents: registration.documents || up.documents || [],
        recommended_tier: registration.recommended_tier || null,
      };
      
      if (typeof window !== "undefined") {
        if (merged.profile_picture) localStorage.setItem("fameo_profile_photo", merged.profile_picture);
        else localStorage.removeItem("fameo_profile_photo");
      }
      setProfile(merged);
    } catch (e) {
      console.error("Failed to parse profile:", e);
    }
  }, [json]);

  if (loading) {
    return (
      <div style={S.centered}>
        <span style={{ color: GOLD }}>\u25c8</span> Loading your profile\u2026
      </div>
    );
  }

  if (error) {
    return (
      <div style={S.centered}>
        <p style={{ fontSize: 14, color: "#9a3030", marginBottom: 4 }}>{error}</p>
        <p style={{ fontSize: 12.5, color: "#8a8275" }}>Try refreshing the page or logging in again.</p>
      </div>
    );
  }

  const p = profile || {};
  const location = [p.city, p.state, p.pincode].filter(Boolean).join(", ");

  return (
    <div style={S.page}>
      {/* Wallet, referrals, activity and account status. Mock-backed for now —
          see services/portal.service.js to point it at the API. */}
      <AccountDashboard />

      {/* Hero \u2014 avatar + identity */}
      <div style={S.hero}>
        <Avatar profile={p} />
        <div style={{ minWidth: 0 }}>
          <span style={S.eyebrow}>{p.primary_content_category || "Creator"}</span>
          <h1 style={S.name}>{p.full_name || p.username || "Your profile"}</h1>
          {p.username && <p style={S.username}>@{p.username}</p>}
          <div style={S.badgeRow}>
            <Verified ok={p.email_verified} />
            <Verified ok={p.mobile_verified} />
            {p.profile_is_active && (
              <span style={{ ...S.statusChip, background: "#6cae6c22", color: "#2f7030" }}>Active</span>
            )}
            {p.recommended_tier && (
              <span style={{ ...S.statusChip, background: GOLD + "22", color: "#8a6a1e", textTransform: "capitalize" }}>
                {p.recommended_tier} tier
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Contact */}
      <Section title="Contact">
        <Field label="Email" value={p.email} />
        <Field label="Mobile" value={p.mobile_number ? `${p.mobile_country_code || ""} ${p.mobile_number}` : ""} />
        <Field label="Location" value={location} />
      </Section>

      {/* Personal */}
      <Section title="Personal">
        <Field label="First name" value={p.first_name} />
        <Field label="Last name" value={p.last_name} />
        <Field label="Date of birth" value={p.date_of_birth} />
        <Field label="Gender" value={p.gender ? p.gender.replace(/_/g, " ") : ""} />
      </Section>

      {/* Creator details */}
      <Section title="Creator">
        <Field label="Primary platform" value={p.primary_platform} />
        <Field label="Instagram" value={p.instagram_username ? `@${p.instagram_username}` : ""} />
        <Field label="YouTube" value={p.youtube_channel_link} />
        <Field label="Content category" value={p.primary_content_category} />
      </Section>

      {/* Documents */}
      {Array.isArray(p.documents) && p.documents.length > 0 && (
        <Section title="Documents">
          <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 8 }}>
            {p.documents.map((doc, i) => (
              <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer" style={S.docRow}>
                <span style={S.docIcon}>\u25c7</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={S.docName}>{doc.filename || doc.tag}</span>
                  <span style={S.docTag}>{(doc.tag || "").replace(/_/g, " ")}</span>
                </span>
                <span style={S.docOpen}>Open \u2197</span>
              </a>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

