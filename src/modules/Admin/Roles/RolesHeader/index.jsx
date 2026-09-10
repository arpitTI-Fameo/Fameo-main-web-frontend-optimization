"use client";
// modules/Admin/Roles/RolesHeader/index.jsx

import { S } from '../styles';

export default function RolesHeader({ onCreate }) {
  return (
    <div style={S.header}>
      <div>
        <span style={S.eyebrow}>◈ Super Admin</span>
        <h1 style={S.heading}>Roles &amp; Users</h1>
      </div>
      <button onClick={onCreate} style={S.newBtn}>
        + Create user
      </button>
    </div>
  );
}
