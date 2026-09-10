'use client';
// modules/Account/Settings/index.jsx
// Settings — notification preferences and account actions.
// Toggles are local state for now; wire them to your preferences endpoint
// alongside the other calls in services/portal.service.js.

import { useState } from 'react';
import Link from 'next/link';

import {
  PageTitle, Section, Card, Button, Toast,
  INK, GOLD, LINE, MUTED, FAINT,
} from '@/modules/Main/Account/AccountUI';

const PREFS = [
  { id: 'referral', label: 'Referral activity', sub: 'When a friend registers or subscribes', on: true },
  { id: 'wallet',   label: 'Wallet updates',    sub: 'When rewards are held or released',     on: true },
  { id: 'billing',  label: 'Billing reminders', sub: 'Upcoming renewals and receipts',        on: true },
  { id: 'product',  label: 'Product news',      sub: 'New features and occasional offers',    on: false },
];
import Toggle from './Toggle';

export default function Settings() {
  const [prefs, setPrefs] = useState(
    Object.fromEntries(PREFS.map((p) => [p.id, p.on]))
  );
  const [toast, setToast] = useState('');

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const toggle = (id, value) => {
    setPrefs((prev) => ({ ...prev, [id]: value }));
    flash('Preference saved');
  };

  return (
    <div>
      <PageTitle
        eyebrow="Preferences"
        title="Settings"
        subtitle="Control what Fameo sends you and manage your account"
      />

      {/* Notifications */}
      <Section title="Notifications">
        <Card style={{ padding: '6px 18px' }}>
          {PREFS.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '15px 0',
                borderBottom: i === PREFS.length - 1 ? 'none' : `1px solid ${LINE}`,
              }}
            >
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={S.rowTitle}>{p.label}</span>
                <span style={S.rowSub}>{p.sub}</span>
              </span>
              <Toggle on={prefs[p.id]} onChange={(v) => toggle(p.id, v)} label={p.label} />
            </div>
          ))}
        </Card>
      </Section>

      {/* Account */}
      <Section title="Account">
        <Card>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/account/profile" style={S.linkBtn}>Edit profile</Link>
            <Button variant="ghost" onClick={() => flash('Password reset link sent')}>
              Change password
            </Button>
          </div>
          <p style={S.note}>
            Your email and mobile are verified on the profile page. Contact
            support to change a verified contact detail.
          </p>
        </Card>
      </Section>

      {/* Danger zone */}
      <Section title="Danger zone">
        <Card style={{ borderColor: '#e6d2d2' }}>
          <span style={S.rowTitle}>Delete account</span>
          <span style={S.rowSub}>
            Permanently removes your profile, wallet balance and referral history.
            This cannot be undone.
          </span>
          <Button
            variant="danger"
            style={{ marginTop: 14 }}
            onClick={() => flash('Account deletion requires confirmation by support')}
          >
            Request account deletion
          </Button>
        </Card>
      </Section>

      <Toast message={toast} />
    </div>
  );
}

const S = {
  rowTitle: { display: 'block', fontSize: 13.5, color: INK, fontWeight: 500 },
  rowSub:   { display: 'block', fontSize: 11.5, color: FAINT, marginTop: 3, lineHeight: 1.5 },
  note:     { fontSize: 11.5, color: MUTED, margin: '14px 0 0', lineHeight: 1.6 },
  linkBtn:  {
    display: 'inline-flex', alignItems: 'center',
    padding: '10px 18px', borderRadius: 10,
    border: `1.5px solid ${LINE}`, color: INK,
    fontSize: 12.5, fontWeight: 600, textDecoration: 'none',
  },
};
