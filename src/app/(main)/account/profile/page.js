
// "use client";
// // app/(main)/account/profile/page.js
// // My Profile — calls the UAT web-profile endpoint DIRECTLY using the UAT token
// // stored at login. The profile picture is the hero; if it's missing or fails to
// // load, we fall back to the user's initials so the avatar is never broken.

// import { useState, useEffect } from "react";

// // Direct UAT endpoint — identifies the user from the UAT bearer token.
// const PROFILE_URL = "https://uat-api.fameo.info/api/v1/user-config/web-profile";

// const INK  = "#1a1208";
// const GOLD = "#C9A96E";

// // The UAT token stored at login (separate from the Fameo JWT).
// function getAppToken() {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("fameo_app_token");
// }

// // Pick a browser-usable image. The app's profile_picture is often a local
// // device path (/data/user/0/com.fameo.app...) that can't load on web, so prefer
// // an http(s) URL: remote profile_picture, then the registration selfie.
// function pickPhoto(profile, registration, entry) {
//   const isWeb = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
//   return [profile?.profile_picture, entry?.profile_picture, registration?.selfie_image_url]
//     .find(isWeb) || null;
// }

// // Derive initials from a name (or email) for the avatar fallback.
// function initials(profile) {
//   const name = profile?.full_name || profile?.username || profile?.email || "";
//   const parts = name.trim().split(/[\s._@]+/).filter(Boolean);
//   if (parts.length === 0) return "?";
//   if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
//   return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
// }

// function Avatar({ profile, size = 120 }) {
//   const [errored, setErrored] = useState(false);
//   const url = profile?.profile_picture;
//   const showImg = url && !errored;

//   return (
//     <div style={{
//       width: size, height: size, borderRadius: "50%",
//       flexShrink: 0, overflow: "hidden",
//       border: `2px solid ${GOLD}55`,
//       background: showImg ? "#f4f1e9" : GOLD + "1e",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       boxShadow: "0 6px 20px rgba(26,18,8,.12)",
//     }}>
//       {showImg ? (
//         <img
//           src={url}
//           alt={profile?.full_name || "Profile picture"}
//           onError={() => setErrored(true)}
//           style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
//         />
//       ) : (
//         <span style={{
//           fontFamily: "'Cormorant Garamond',serif",
//           fontSize: size * 0.4, fontWeight: 600, color: GOLD,
//           fontVariantNumeric: "tabular-nums",
//         }}>
//           {initials(profile)}
//         </span>
//       )}
//     </div>
//   );
// }

// function Verified({ ok }) {
//   return (
//     <span style={{
//       display: "inline-flex", alignItems: "center", gap: 5,
//       fontSize: 10.5, letterSpacing: ".04em", fontWeight: 600,
//       padding: "3px 9px", borderRadius: 20,
//       background: ok ? "#6cae6c22" : "#c0b9aa22",
//       color:      ok ? "#2f7030"   : "#8a8275",
//     }}>
//       <span style={{ fontSize: 11 }}>{ok ? "\u2713" : "\u25cb"}</span>
//       {ok ? "Verified" : "Not verified"}
//     </span>
//   );
// }

// function Field({ label, value }) {
//   return (
//     <div style={S.field}>
//       <span style={S.fieldLabel}>{label}</span>
//       <span style={S.fieldValue}>{value || <span style={S.empty}>\u2014</span>}</span>
//     </div>
//   );
// }

// export default function ProfilePage() {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState("");

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const token = getAppToken();
//         if (!token) {
//           throw new Error("You're not logged in — please log in again.");
//         }
//         const res = await fetch(PROFILE_URL, {
//           method: "GET",
//           headers: {
//             accept: "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const json = await res.json();
//         if (!res.ok || json?.success === false) {
//           throw new Error(json?.message || `Request failed (${res.status})`);
//         }

//         // Shape: { data: [ { user_profile: {...}, registration: {...}, profile_picture } ] }
//         const entry        = Array.isArray(json?.data) ? json.data[0] : json?.data;
//         const up           = entry?.user_profile || entry || {};
//         const registration = entry?.registration || {};
//         const merged = {
//           ...up,
//           profile_picture: pickPhoto(up, registration, entry),
//           documents:       registration.documents || up.documents || [],
//           recommended_tier: registration.recommended_tier || null,
//         };
//         // Cache the photo so the navbar avatar can show it everywhere.
//         if (typeof window !== "undefined") {
//           if (merged.profile_picture) localStorage.setItem("fameo_profile_photo", merged.profile_picture);
//           else localStorage.removeItem("fameo_profile_photo");
//         }
//         if (!cancelled) setProfile(merged);
//       } catch (e) {
//         if (!cancelled) setError(e.message || "Couldn't load your profile");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();
//     return () => { cancelled = true; };
//   }, []);

//   if (loading) {
//     return (
//       <div style={S.centered}>
//         <span style={{ color: GOLD }}>\u25c8</span> Loading your profile\u2026
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={S.centered}>
//         <p style={{ fontSize: 14, color: "#9a3030", marginBottom: 4 }}>{error}</p>
//         <p style={{ fontSize: 12.5, color: "#8a8275" }}>Try refreshing the page or logging in again.</p>
//       </div>
//     );
//   }

//   const p = profile || {};
//   const location = [p.city, p.state, p.pincode].filter(Boolean).join(", ");

//   return (
//     <div style={S.page}>
//       {/* Hero \u2014 avatar + identity */}
//       <div style={S.hero}>
//         <Avatar profile={p} />
//         <div style={{ minWidth: 0 }}>
//           <span style={S.eyebrow}>{p.primary_content_category || "Creator"}</span>
//           <h1 style={S.name}>{p.full_name || p.username || "Your profile"}</h1>
//           {p.username && <p style={S.username}>@{p.username}</p>}
//           <div style={S.badgeRow}>
//             <Verified ok={p.email_verified} />
//             <Verified ok={p.mobile_verified} />
//             {p.profile_is_active && (
//               <span style={{ ...S.statusChip, background: "#6cae6c22", color: "#2f7030" }}>Active</span>
//             )}
//             {p.recommended_tier && (
//               <span style={{ ...S.statusChip, background: GOLD + "22", color: "#8a6a1e", textTransform: "capitalize" }}>
//                 {p.recommended_tier} tier
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Contact */}
//       <Section title="Contact">
//         <Field label="Email"  value={p.email} />
//         <Field label="Mobile" value={p.mobile_number ? `${p.mobile_country_code || ""} ${p.mobile_number}` : ""} />
//         <Field label="Location" value={location} />
//       </Section>

//       {/* Personal */}
//       <Section title="Personal">
//         <Field label="First name" value={p.first_name} />
//         <Field label="Last name"  value={p.last_name} />
//         <Field label="Date of birth" value={p.date_of_birth} />
//         <Field label="Gender" value={p.gender ? p.gender.replace(/_/g, " ") : ""} />
//       </Section>

//       {/* Creator details */}
//       <Section title="Creator">
//         <Field label="Primary platform" value={p.primary_platform} />
//         <Field label="Instagram" value={p.instagram_username ? `@${p.instagram_username}` : ""} />
//         <Field label="YouTube"   value={p.youtube_channel_link} />
//         <Field label="Content category" value={p.primary_content_category} />
//       </Section>

//       {/* Documents */}
//       {Array.isArray(p.documents) && p.documents.length > 0 && (
//         <Section title="Documents">
//           <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 8 }}>
//             {p.documents.map((doc, i) => (
//               <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer" style={S.docRow}>
//                 <span style={S.docIcon}>\u25c7</span>
//                 <span style={{ flex: 1, minWidth: 0 }}>
//                   <span style={S.docName}>{doc.filename || doc.tag}</span>
//                   <span style={S.docTag}>{(doc.tag || "").replace(/_/g, " ")}</span>
//                 </span>
//                 <span style={S.docOpen}>Open \u2197</span>
//               </a>
//             ))}
//           </div>
//         </Section>
//       )}
//     </div>
//   );
// }

// function Section({ title, children }) {
//   return (
//     <div style={S.section}>
//       <div style={S.sectionLabel}>{title}</div>
//       <div style={S.grid}>{children}</div>
//     </div>
//   );
// }

// const S = {
//   page:        { maxWidth: 880, margin: "0 auto", padding: "36px 32px", fontFamily: "'DM Sans',sans-serif", color: INK },
//   centered:    { minHeight: "50vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'DM Sans',sans-serif", color: "#8a8275", fontSize: 14 },

//   hero:        { display: "flex", alignItems: "center", gap: 24, padding: "4px 0 28px", borderBottom: "1.5px solid #ece8de", marginBottom: 28 },
//   eyebrow:     { display: "block", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: GOLD, fontWeight: 600, marginBottom: 6 },
//   name:        { fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontWeight: 500, color: INK, margin: 0, lineHeight: 1.05 },
//   username:    { fontSize: 13.5, color: "#7a7264", margin: "4px 0 0" },
//   badgeRow:    { display: "flex", flexWrap: "wrap", gap: 7, marginTop: 12 },
//   statusChip:  { fontSize: 10.5, letterSpacing: ".04em", fontWeight: 600, padding: "3px 9px", borderRadius: 20 },

//   section:     { marginBottom: 26 },
//   sectionLabel:{ fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "#8a8275", fontWeight: 600, marginBottom: 12 },
//   grid:        { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 },

//   field:       { background: "#fff", border: "1.5px solid #ece8de", borderRadius: 10, padding: "12px 14px" },
//   fieldLabel:  { display: "block", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#a8a092", fontWeight: 600, marginBottom: 5 },
//   fieldValue:  { display: "block", fontSize: 14, color: INK, fontWeight: 500, wordBreak: "break-word" },
//   empty:       { color: "#c8c2b4" },

//   docRow:      { display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: "#fff", border: "1.5px solid #ece8de", borderRadius: 10, textDecoration: "none" },
//   docIcon:     { fontSize: 16, color: GOLD },
//   docName:     { display: "block", fontSize: 13.5, color: INK, fontWeight: 500 },
//   docTag:      { display: "block", fontSize: 11, color: "#8a8275", textTransform: "capitalize", marginTop: 1 },
//   docOpen:     { fontSize: 11.5, color: GOLD, fontWeight: 600, whiteSpace: "nowrap" },
// };

"use client";

import { useState, useEffect } from "react";
import AccountDashboard from "@/components/account/AccountDashboard";

// Direct UAT endpoint — identifies the user from the UAT bearer token.
const PROFILE_URL = "https://uat-api.fameo.info/api/v1/user-config/web-profile";

const INK  = "#1a1208";
const GOLD = "#C9A96E";

// The UAT token stored at login (separate from the Fameo JWT).
function getAppToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fameo_app_token");
}

// Pick a browser-usable image. The app's profile_picture is often a local
// device path (/data/user/0/com.fameo.app...) that can't load on web, so prefer
// an http(s) URL: remote profile_picture, then the registration selfie.
function pickPhoto(profile, registration, entry) {
  const isWeb = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
  return [profile?.profile_picture, entry?.profile_picture, registration?.selfie_image_url]
    .find(isWeb) || null;
}

// Derive initials from a name (or email) for the avatar fallback.
function initials(profile) {
  const name = profile?.full_name || profile?.username || profile?.email || "";
  const parts = name.trim().split(/[\s._@]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function Avatar({ profile, size = 120 }) {
  const [errored, setErrored] = useState(false);
  const url = profile?.profile_picture;
  const showImg = url && !errored;

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      flexShrink: 0, overflow: "hidden",
      border: `2px solid ${GOLD}55`,
      background: showImg ? "#f4f1e9" : GOLD + "1e",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 6px 20px rgba(26,18,8,.12)",
    }}>
      {showImg ? (
        <img
          src={url}
          alt={profile?.full_name || "Profile picture"}
          onError={() => setErrored(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <span style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: size * 0.4, fontWeight: 600, color: GOLD,
          fontVariantNumeric: "tabular-nums",
        }}>
          {initials(profile)}
        </span>
      )}
    </div>
  );
}

function Verified({ ok }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 10.5, letterSpacing: ".04em", fontWeight: 600,
      padding: "3px 9px", borderRadius: 20,
      background: ok ? "#6cae6c22" : "#c0b9aa22",
      color:      ok ? "#2f7030"   : "#8a8275",
    }}>
      <span style={{ fontSize: 11 }}>{ok ? "\u2713" : "\u25cb"}</span>
      {ok ? "Verified" : "Not verified"}
    </span>
  );
}

function Field({ label, value }) {
  return (
    <div style={S.field}>
      <span style={S.fieldLabel}>{label}</span>
      <span style={S.fieldValue}>{value || <span style={S.empty}>\u2014</span>}</span>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = getAppToken();
        if (!token) {
          throw new Error("You're not logged in — please log in again.");
        }
        const res = await fetch(PROFILE_URL, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || `Request failed (${res.status})`);
        }

        // Shape: { data: [ { user_profile: {...}, registration: {...}, profile_picture } ] }
        const entry        = Array.isArray(json?.data) ? json.data[0] : json?.data;
        const up           = entry?.user_profile || entry || {};
        const registration = entry?.registration || {};
        const merged = {
          ...up,
          profile_picture: pickPhoto(up, registration, entry),
          documents:       registration.documents || up.documents || [],
          recommended_tier: registration.recommended_tier || null,
        };
        // Cache the photo so the navbar avatar can show it everywhere.
        if (typeof window !== "undefined") {
          if (merged.profile_picture) localStorage.setItem("fameo_profile_photo", merged.profile_picture);
          else localStorage.removeItem("fameo_profile_photo");
        }
        if (!cancelled) setProfile(merged);
      } catch (e) {
        if (!cancelled) setError(e.message || "Couldn't load your profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

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
        <Field label="Email"  value={p.email} />
        <Field label="Mobile" value={p.mobile_number ? `${p.mobile_country_code || ""} ${p.mobile_number}` : ""} />
        <Field label="Location" value={location} />
      </Section>

      {/* Personal */}
      <Section title="Personal">
        <Field label="First name" value={p.first_name} />
        <Field label="Last name"  value={p.last_name} />
        <Field label="Date of birth" value={p.date_of_birth} />
        <Field label="Gender" value={p.gender ? p.gender.replace(/_/g, " ") : ""} />
      </Section>

      {/* Creator details */}
      <Section title="Creator">
        <Field label="Primary platform" value={p.primary_platform} />
        <Field label="Instagram" value={p.instagram_username ? `@${p.instagram_username}` : ""} />
        <Field label="YouTube"   value={p.youtube_channel_link} />
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

function Section({ title, children }) {
  return (
    <div style={S.section}>
      <div style={S.sectionLabel}>{title}</div>
      <div style={S.grid}>{children}</div>
    </div>
  );
}

const S = {
  page:        { maxWidth: 880, margin: "0 auto", padding: "36px 32px", fontFamily: "'DM Sans',sans-serif", color: INK },
  centered:    { minHeight: "50vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'DM Sans',sans-serif", color: "#8a8275", fontSize: 14 },

  hero:        { display: "flex", alignItems: "center", gap: 24, padding: "4px 0 28px", borderBottom: "1.5px solid #ece8de", marginBottom: 28 },
  eyebrow:     { display: "block", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: GOLD, fontWeight: 600, marginBottom: 6 },
  name:        { fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontWeight: 500, color: INK, margin: 0, lineHeight: 1.05 },
  username:    { fontSize: 13.5, color: "#7a7264", margin: "4px 0 0" },
  badgeRow:    { display: "flex", flexWrap: "wrap", gap: 7, marginTop: 12 },
  statusChip:  { fontSize: 10.5, letterSpacing: ".04em", fontWeight: 600, padding: "3px 9px", borderRadius: 20 },

  section:     { marginBottom: 26 },
  sectionLabel:{ fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "#8a8275", fontWeight: 600, marginBottom: 12 },
  grid:        { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 },

  field:       { background: "#fff", border: "1.5px solid #ece8de", borderRadius: 10, padding: "12px 14px" },
  fieldLabel:  { display: "block", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#a8a092", fontWeight: 600, marginBottom: 5 },
  fieldValue:  { display: "block", fontSize: 14, color: INK, fontWeight: 500, wordBreak: "break-word" },
  empty:       { color: "#c8c2b4" },

  docRow:      { display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: "#fff", border: "1.5px solid #ece8de", borderRadius: 10, textDecoration: "none" },
  docIcon:     { fontSize: 16, color: GOLD },
  docName:     { display: "block", fontSize: 13.5, color: INK, fontWeight: 500 },
  docTag:      { display: "block", fontSize: 11, color: "#8a8275", textTransform: "capitalize", marginTop: 1 },
  docOpen:     { fontSize: 11.5, color: GOLD, fontWeight: 600, whiteSpace: "nowrap" },
};