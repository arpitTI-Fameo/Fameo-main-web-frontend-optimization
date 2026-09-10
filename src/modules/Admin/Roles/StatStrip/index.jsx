"use client";
// modules/Admin/Roles/StatStrip/index.jsx

import Stat from './Stat';
import { S } from '../styles';
import { ROLES } from '../constants';

export default function StatStrip({ total, totalActive, totalInactive }) {
  return (
    <div style={S.statStrip}>
      <Stat n={total} label="Total users" />
      <div style={S.statDiv} />
      <Stat n={totalActive} label="Active" tone="#3a7c3a" />
      <div style={S.statDiv} />
      <Stat n={totalInactive} label="Disabled" tone={totalInactive ? "#9a3030" : "#b8b0a2"} />
      <div style={S.statDiv} />
      <Stat n={ROLES.length} label="Roles" />
    </div>
  );
}
