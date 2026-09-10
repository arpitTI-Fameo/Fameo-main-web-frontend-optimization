'use client';
// modules/Account/InviteModal/index.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Step 2 of the referral journey: pick a tier, read the qualification warning,
// then copy or share the invite link.
//
// Opens from the "Invite a friend" button on /account/referrals. Tiers come
// from the same referrals payload as the rest of the page, so when the API is
// connected this fills in automatically.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useMemo } from 'react';

import { shareCoupon } from '@/services/portal.service';
import {
  Button, Chip,
  INK, GOLD, LINE, MUTED, FAINT, GREEN, AMBER, AMBER_BG,
  FONT_BODY, FONT_DISPLAY,
} from '../AccountUI';

// Friendly names for each tier, matching the walkthrough.
const TIER_COPY = {
  A: { name: 'Short-term invite', blurb: 'Best for friends testing the water.' },
  B: { name: 'Value invite',      blurb: 'A balance of discount and earnings.' },
  C: { name: 'Committed invite',  blurb: 'Longest commitment — you earn most.' },
};

// Invite links land on the registration flow, which reads the code off the URL.
// Format and host follow the Integration Guide (§5.4 shareUrl example):
//   https://www.fameo.vip/register?referral=FAMEO-AB12CD34
// NEXT_PUBLIC_SITE_URL overrides the host for staging/preview environments.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fameo.vip';

// Prefer the shareUrl the referral API returns (portal.service carries it
// through on each coupon) so the backend stays the source of truth; build the
// link locally only when it hasn't sent one.
const inviteLink = (coupon) => {
  if (!coupon) return `${SITE_URL}/register?referral=…`;
  if (coupon.shareUrl) return coupon.shareUrl;
  return `${SITE_URL}/register?referral=${encodeURIComponent(coupon.code)}`;
};

export default function InviteModal({ open, onClose, tiers = [], coupons = [], onShared }) {
  const [tierCode, setTierCode] = useState(null);
  const [copied, setCopied]     = useState(false);
  const [busy, setBusy]         = useState(false);

  // Only tiers with coupons left can be picked.
  const available = useMemo(
    () => tiers.filter((t) => t.remaining > 0),
    [tiers]
  );

  // Default to the first tier that still has coupons.
  useEffect(() => {
    if (open && available.length > 0) {
      setTierCode((cur) => (cur && available.some((t) => t.code === cur) ? cur : available[0].code));
      setCopied(false);
    }
  }, [open, available]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  const tier = available.find((t) => t.code === tierCode) || available[0];

  // Pick an unused coupon from the chosen tier for the share link.
  const coupon = coupons.find(
    (c) => c.tier === tierCode && (c.status === 'shared' || !c.friend)
  ) || coupons.find((c) => c.tier === tierCode);

  const link = inviteLink(coupon);

  // Use the API's own wording when it sends some, and make sure the link is in
  // there either way — WhatsApp/Telegram send the text, not a separate URL.
  const baseMessage =
    coupon?.shareMessage ||
    `Join me on Fameo — here's ${tier?.discount}% off your first plan.`;
  const message = baseMessage.includes(link) ? baseMessage : `${baseMessage} ${link}`;

  // Copy the link and record the share.
  const handleCopy = async () => {
    setBusy(true);
    try {
      await navigator.clipboard?.writeText(link);
      setCopied(true);
      if (coupon) await shareCoupon(coupon.id);
      onShared?.(`Invite link copied — ${tier?.discount}% off`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShared?.('Could not copy the link. Try again.');
    } finally {
      setBusy(false);
    }
  };

  // Hand off to an external app, recording the share as we go.
  const handleShareVia = async (channel) => {
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
      email:    `mailto:?subject=${encodeURIComponent('Join me on Fameo')}&body=${encodeURIComponent(message)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Join me on Fameo')}`,
    };

    // Native share sheet where the browser supports it.
    if (channel === 'more' && navigator.share) {
      try {
        await navigator.share({ title: 'Join me on Fameo', text: message, url: link });
      } catch { /* user dismissed the sheet */ }
    } else if (urls[channel]) {
      window.open(urls[channel], '_blank', 'noopener,noreferrer');
    } else {
      await handleCopy();
      return;
    }

    if (coupon) {
      try { await shareCoupon(coupon.id); } catch { /* non-blocking */ }
    }
    onShared?.('Invite shared');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Invite a friend"
      style={S.overlay}
      onClick={onClose}
    >
      <div style={S.sheet} onClick={(e) => e.stopPropagation()}>

        {/* ── Header ──────────────────────────────────────────────── */}
        <div style={S.head}>
          <div>
            <span style={S.eyebrow}>Step 2 of 6</span>
            <h2 style={S.title}>Which invite fits your friend?</h2>
            <p style={S.sub}>
              Pick based on how committed they are. You earn more on longer commitments.
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" style={S.close}>✕</button>
        </div>

        {/* ── Tier picker ─────────────────────────────────────────── */}
        {available.length === 0 ? (
          <div style={S.noneLeft}>
            You&apos;ve used all your invites. New coupons are issued each billing cycle.
          </div>
        ) : (
          <>
            <div style={S.tiers}>
              {available.map((t) => {
                const selected = t.code === tierCode;
                const copy = TIER_COPY[t.code] || {};
                return (
                  <button
                    key={t.code}
                    onClick={() => setTierCode(t.code)}
                    aria-pressed={selected}
                    style={{
                      ...S.tier,
                      borderColor: selected ? GOLD : LINE,
                      borderWidth: selected ? 2 : 1.5,
                      background: selected ? GOLD + '12' : '#fff',
                    }}
                  >
                    <span style={S.tierName}>{copy.name || `Tier ${t.code}`}</span>
                    <span style={S.tierOff}>{t.discount}%</span>
                    <span style={S.tierDur}>{t.durations}</span>
                    <span style={S.tierEarn}>You earn {t.earnRate}%</span>
                    <span style={S.tierLeft}>{t.remaining} left</span>
                  </button>
                );
              })}
            </div>

            {/* ── Qualification warning ───────────────────────────── */}
            <div style={S.qual}>
              <strong>Before you share:</strong> your invite is marked used the
              moment your friend registers — even if they aren&apos;t approved.
              Only share with verified public figures, creators, or professionals
              who will pass KYC.
            </div>

            {/* ── Share link ──────────────────────────────────────── */}
            <div style={S.shareBox}>
              <span style={S.shareLink}>{link}</span>
              <Button
                variant={copied ? 'gold' : 'ghost'}
                onClick={handleCopy}
                disabled={busy || !coupon}
                style={{ padding: '7px 14px', fontSize: 11.5, flexShrink: 0 }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </Button>
            </div>

            {/* ── Share targets ───────────────────────────────────── */}
            <div style={S.shareBtns}>
              {[
                { id: 'whatsapp', label: 'WhatsApp' },
                { id: 'email',    label: 'Email' },
                { id: 'telegram', label: 'Telegram' },
                { id: 'more',     label: 'More' },
              ].map((c) => (
                <Button
                  key={c.id}
                  variant="ghost"
                  onClick={() => handleShareVia(c.id)}
                  disabled={!coupon}
                  style={{ padding: '8px 14px', fontSize: 11.5 }}
                >
                  {c.label}
                </Button>
              ))}
            </div>

            <p style={S.footnote}>
              Sharing marks this coupon as used. Track what happens next in the
              friend journey tracker below.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const S = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 200,
    background: 'rgba(26,18,8,.42)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20,
    animation: 'fa-fade .16s ease-out',
  },
  sheet: {
    background: '#fff',
    border: `1.5px solid ${LINE}`,
    borderRadius: 14,
    width: '100%', maxWidth: 620,
    maxHeight: '90vh', overflowY: 'auto',
    padding: '24px 26px 26px',
    fontFamily: FONT_BODY,
    boxShadow: '0 24px 60px rgba(26,18,8,.22)',
  },
  head: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', gap: 16, marginBottom: 20,
  },
  eyebrow: {
    display: 'block', fontSize: 10, letterSpacing: '.18em',
    textTransform: 'uppercase', color: GOLD, fontWeight: 600, marginBottom: 6,
  },
  title: {
    fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 500,
    color: INK, margin: 0, lineHeight: 1.1,
  },
  sub: { fontSize: 12.5, color: MUTED, margin: '7px 0 0', lineHeight: 1.5 },
  close: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 16, color: FAINT, padding: 4, lineHeight: 1, flexShrink: 0,
  },

  tiers: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: 10, marginBottom: 16,
  },
  tier: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    borderStyle: 'solid', borderRadius: 12,
    padding: '14px 10px', cursor: 'pointer',
    fontFamily: FONT_BODY, textAlign: 'center',
    transition: 'border-color .15s, background .15s',
  },
  tierName: { fontSize: 11.5, fontWeight: 600, color: INK },
  tierOff: {
    fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 600,
    color: GOLD, margin: '6px 0 2px', lineHeight: 1,
  },
  tierDur: { fontSize: 10, color: FAINT },
  tierEarn: {
    fontSize: 10, color: GREEN, fontWeight: 600,
    marginTop: 8, paddingTop: 8,
    borderTop: `1px solid ${LINE}`, width: '100%',
  },
  tierLeft: { fontSize: 10, color: FAINT, marginTop: 4 },

  qual: {
    background: AMBER_BG,
    borderLeft: `3px solid ${GOLD}`,
    padding: '11px 14px', marginBottom: 16,
    fontSize: 11.5, color: AMBER, lineHeight: 1.6,
  },

  shareBox: {
    background: '#fbfaf7',
    border: `1.5px solid ${LINE}`,
    borderRadius: 10,
    padding: '10px 12px', marginBottom: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 12,
  },
  shareLink: {
    fontFamily: 'ui-monospace,Menlo,monospace',
    fontSize: 11.5, color: INK, wordBreak: 'break-all',
  },
  shareBtns: { display: 'flex', gap: 8, flexWrap: 'wrap' },

  footnote: {
    fontSize: 11, color: FAINT, lineHeight: 1.6,
    margin: '16px 0 0', paddingTop: 14,
    borderTop: `1px solid ${LINE}`,
  },
  noneLeft: {
    padding: '28px 16px', textAlign: 'center',
    fontSize: 12.5, color: MUTED, lineHeight: 1.6,
  },
};