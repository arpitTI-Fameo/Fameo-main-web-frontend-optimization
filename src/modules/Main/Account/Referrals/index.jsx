'use client';
// app/(main)/account/referrals/page.js
// Referrals — coupon tiers and the friend journey tracker. Copying a code
// records the share through the service layer.

import { useState } from 'react';

import { usePortalData } from '@/hooks/usePortalData';
import { getReferrals, shareCoupon } from '@/services/portal.service';
import InviteModal from '@/modules/Main/Account/InviteModal';
import {
  PageTitle, Section, Card, StatTile, Chip, StatusChip, Button, Table, tdStyle,
  SkeletonTiles, Skeleton, ErrorBox, Empty, Toast,
  inr, INK, GOLD, LINE, MUTED, FAINT,
  GREEN, GREEN_BG, AMBER, AMBER_BG, SLATE, SLATE_BG,
} from '@/modules/Main/Account/AccountUI';

// Tier letter → chip colours.
const TIER_STYLE = {
  A: { bg: GREEN_BG, fg: GREEN },
  B: { bg: AMBER_BG, fg: AMBER },
  C: { bg: SLATE_BG, fg: SLATE },
};

export default function Referrals() {
  const { data, loading, error, refetch } = usePortalData(getReferrals);
  const [toast, setToast]   = useState('');
  const [busy, setBusy]     = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  // Copy the code, then record the share.
  const handleShare = async (coupon) => {
    setBusy(coupon.id);
    try {
      await navigator.clipboard?.writeText(coupon.code);
      await shareCoupon(coupon.id);
      flash(`Copied ${coupon.code} — share it with a friend`);
      refetch();
    } catch {
      flash('Could not share that coupon. Try again.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <PageTitle
        eyebrow="Rewards"
        title="Referrals"
        subtitle="Share coupons, track friends, earn wallet rewards"
        action={!loading && !error ? (
          <Button variant="gold" onClick={() => setInviteOpen(true)}>
            Invite a friend
          </Button>
        ) : null}
      />

      {error && <ErrorBox message={error} onRetry={refetch} />}

      {/* ── Summary ─────────────────────────────────────────────────── */}
      {!error && (
        <Section title="Summary">
          {loading ? <SkeletonTiles count={4} /> : (
            <div className="fa-grid-4">
              <StatTile label="Total coupons" value={data.summary.total} />
              <StatTile label="Remaining"     value={data.summary.remaining} />
              <StatTile label="Subscribed"    value={data.summary.subscribed} color={GREEN} />
              <StatTile label="Total earned"  value={inr(data.summary.totalEarned)} color={GOLD} />
            </div>
          )}
        </Section>
      )}

      {/* ── Tiers ───────────────────────────────────────────────────── */}
      {!loading && !error && (
        <Section title="Your coupons by tier">
          <div className="fa-grid-3">
            {data.tiers.map((t) => {
              const st = TIER_STYLE[t.code] || TIER_STYLE.C;
              return (
                <Card key={t.code} style={{ textAlign: 'center' }}>
                  <Chip bg={st.bg} fg={st.fg}>Tier {t.code}</Chip>
                  <div style={S.tierBig}>{t.remaining} left</div>
                  <div style={S.tierMeta}>{t.discount}% off · {t.durations}</div>
                  <div style={S.tierEarn}>You earn {t.earnRate}%</div>
                </Card>
              );
            })}
          </div>
        </Section>
      )}

      {/* ── Journey tracker ─────────────────────────────────────────── */}
      {!error && (
        <Section title="Friend journey tracker">
          <Card style={{ padding: '16px 18px 4px' }}>
            {loading ? (
              [0, 1, 2, 3].map((i) => (
                <Skeleton key={i} height={20} style={{ marginBottom: 14 }} />
              ))
            ) : data.coupons.length === 0 ? (
              <Empty>You don&apos;t have any coupons yet.</Empty>
            ) : (
              <Table head={['Coupon', 'Tier', 'Status', 'Friend', 'Stage', 'Reward', '']}>
                {data.coupons.map((c, i) => {
                  const st = TIER_STYLE[c.tier] || TIER_STYLE.C;
                  const last = i === data.coupons.length - 1;
                  const cell = last ? { ...tdStyle, borderBottom: 'none' } : tdStyle;
                  return (
                    <tr key={c.id}>
                      <td style={{ ...cell, fontFamily: 'ui-monospace,Menlo,monospace', fontSize: 11.5 }}>
                        {c.code}
                      </td>
                      <td style={cell}>
                        <Chip bg={st.bg} fg={st.fg}>{c.tier}·{c.discount}%</Chip>
                      </td>
                      <td style={cell}><StatusChip status={c.status} /></td>
                      <td style={cell}>{c.friend || '—'}</td>
                      <td style={{ ...cell, color: MUTED }}>{c.stage}</td>
                      <td style={{
                        ...cell, fontWeight: 600,
                        color: c.rewardStatus === 'paid' ? GREEN : AMBER,
                      }}>
                        {c.reward
                          ? `${inr(c.reward)} ${c.rewardStatus === 'paid' ? 'paid' : 'hold'}`
                          : '—'}
                      </td>
                      <td style={cell}>
                        <Button
                          variant="ghost"
                          onClick={() => handleShare(c)}
                          disabled={busy === c.id}
                          style={{ padding: '6px 12px', fontSize: 11.5 }}
                        >
                          {busy === c.id ? '…' : 'Copy'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </Table>
            )}
          </Card>
        </Section>
      )}

      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        tiers={data?.tiers || []}
        coupons={data?.coupons || []}
        onShared={(msg) => { flash(msg); refetch(); }}
      />

      <Toast message={toast} />
    </div>
  );
}

const S = {
  tierBig: {
    fontFamily: "'Cormorant Garamond',serif",
    fontSize: 28, fontWeight: 600, color: INK,
    margin: '10px 0 4px', lineHeight: 1,
  },
  tierMeta: { fontSize: 12, color: MUTED },
  tierEarn: {
    fontSize: 11, color: GOLD, fontWeight: 600,
    marginTop: 8, paddingTop: 8, borderTop: `1px solid ${LINE}`,
  },
};
