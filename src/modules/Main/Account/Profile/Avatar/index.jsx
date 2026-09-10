"use client";

import { useState } from "react";

import { GOLD } from "../styles";
import { initials } from "../helpers";

export default function Avatar({ profile, size = 120 }) {
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
