"use client";

export default function Verified({ ok }) {
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
