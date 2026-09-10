"use client";

import { S } from "../styles";

export default function Field({ label, value }) {
  return (
    <div style={S.field}>
      <span style={S.fieldLabel}>{label}</span>
      <span style={S.fieldValue}>{value || <span style={S.empty}>\u2014</span>}</span>
    </div>
  );
}
