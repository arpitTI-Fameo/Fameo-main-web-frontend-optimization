"use client";

import { S } from "../styles";

export default function Section({ title, children }) {
  return (
    <div style={S.section}>
      <div style={S.sectionLabel}>{title}</div>
      <div style={S.grid}>{children}</div>
    </div>
  );
}
