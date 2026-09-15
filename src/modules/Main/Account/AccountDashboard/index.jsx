'use client';
// modules/Account/AccountDashboard/index.jsx
// ─────────────────────────────────────────────────────────────────────────────
// The dashboard strip shown at the top of /account/profile: wallet snapshot,
// referral coupons, recent activity and account status.
//
// Runs on mock data via services/portal.service.js. When the API is ready,
// change that one file — nothing here needs touching.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';

import { useWallet, useReferrals, useActivity } from '@/lib/hooks/main/usePortal';
import { useProfile } from '@/lib/hooks/main/useUser';
import {
  Card, Section, StatTile, Chip, Button, linkButtonStyle,
  Skeleton, SkeletonTiles, ErrorBox, Empty,
  inr, INK, GOLD, LINE, MUTED, FAINT,
  GREEN, GREEN_BG, AMBER, AMBER_BG, SLATE, SLATE_BG,
} from '../AccountUI';

import { S } from './styles'

// Activity icon + tint per activity type.
const ACTIVITY_STYLE = {
  referral: { icon: '◈', bg: GREEN_BG, fg: GREEN },
  wallet: { icon: '◆', bg: SLATE_BG, fg: SLATE },
  share: { icon: '◇', bg: AMBER_BG, fg: AMBER },
  views: { icon: '◉', bg: GOLD + '22', fg: AMBER },
};

const AMOUNT_COLOR = { success: GREEN, warning: AMBER, danger: '#9a3030' };

export default function AccountDashboard() {
  const walletQuery = useWallet();
  const referralsQuery = useReferrals();
  const activityQuery = useActivity(4);
  const portalQuery = useProfile();

  const loading = walletQuery.isPending || referralsQuery.isPending || activityQuery.isPending || portalQuery.isPending;
  const error = walletQuery.error?.message || referralsQuery.error?.message || activityQuery.error?.message || portalQuery.error?.message;

  const refetch = () => {
    walletQuery.refetch();
    referralsQuery.refetch();
    activityQuery.refetch();
    portalQuery.refetch();
  };

  if (error) {
    return (
      <Section title="Overview">
        <ErrorBox message={error} onRetry={refetch} />
      </Section>
    );
  }

  const wallet = walletQuery.data;
  const referrals = referralsQuery.data;
  const activity = activityQuery.data;
  const portal = portalQuery.data;

  return (
    <>
      {/* ── Summary tiles ───────────────────────────────────────────── */}
      <Section title="Overview">
        {loading ? <SkeletonTiles count={4} /> : (
          <div className="fa-grid-4">
            <StatTile label="Wallet balance" value={inr(wallet.available)} color={GOLD} />
            <StatTile label={`In ${wallet.holdDays}-day hold`} value={inr(wallet.onHold)} color={AMBER} />
            <StatTile label="Coupons left" value={referrals.summary.remaining} />
            <StatTile label="Friends joined" value={referrals.summary.subscribed} color={GREEN} />
          </div>
        )}
      </Section>

      {/* ── Wallet + coupons ────────────────────────────────────────── */}
      <div className="fa-grid-2" style={{ marginBottom: 26 }}>

        {/* Wallet */}
        <Card>
          <div style={S.cardHead}>
            <span style={S.cardTitle}>Wallet</span>
            <Link href="/account/wallet" style={S.link}>View all →</Link>
          </div>

          {loading ? (
            <>
              <Skeleton height={30} width="55%" style={{ marginBottom: 10 }} />
              <Skeleton height={12} width="70%" />
            </>
          ) : (
            <>
              <div style={S.bigAmount}>{inr(wallet.available)}</div>
              <p style={S.caption}>available to spend · no expiry</p>

              <div style={S.split}>
                <div style={S.splitCell}>
                  <div style={{ ...S.splitVal, color: AMBER }}>{inr(wallet.onHold)}</div>
                  <div style={S.splitLab}>In {wallet.holdDays}-day hold</div>
                </div>
                <div style={{ ...S.splitCell, borderLeft: `1px solid ${LINE}` }}>
                  <div style={S.splitVal}>{inr(wallet.lifetimeEarned)}</div>
                  <div style={S.splitLab}>Lifetime earned</div>
                </div>
              </div>

              <Link href="/account/products" style={{ ...linkButtonStyle('primary', true), marginTop: 14 }}>
                Browse products to spend
              </Link>
            </>
          )}
        </Card>

        {/* Referral coupons */}
        <Card>
          <div style={S.cardHead}>
            <span style={S.cardTitle}>Referral coupons</span>
            <Link href="/account/referrals" style={S.link}>View all →</Link>
          </div>

          {loading ? (
            <>
              <Skeleton height={30} width="45%" style={{ marginBottom: 10 }} />
              <Skeleton height={12} width="65%" />
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div style={S.bigAmount}>{referrals.summary.remaining}</div>
                  <p style={S.caption}>coupons remaining</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ ...S.bigAmount, color: GREEN }}>
                    {referrals.summary.subscribed}
                  </div>
                  <p style={S.caption}>friends subscribed</p>
                </div>
              </div>

              <div className="fa-grid-3" style={{ gap: 8 }}>
                {referrals.tiers.map((t) => (
                  <div key={t.code} style={S.tier}>
                    <div style={S.tierName}>{t.code} · {t.discount}%</div>
                    <div style={S.tierVal}>{t.remaining} left</div>
                  </div>
                ))}
              </div>

              <Link href="/account/referrals" style={{ ...linkButtonStyle('gold', true), marginTop: 14 }}>
                Invite a friend
              </Link>
            </>
          )}
        </Card>
      </div>

      {/* ── Activity + status ───────────────────────────────────────── */}
      <div className="fa-grid-2" style={{ marginBottom: 26 }}>

        {/* Recent activity */}
        <Card>
          <div style={S.cardHead}>
            <span style={S.cardTitle}>Recent activity</span>
          </div>

          {loading ? (
            [0, 1, 2].map((i) => (
              <Skeleton key={i} height={38} style={{ marginBottom: 10 }} />
            ))
          ) : activity.length === 0 ? (
            <Empty>No activity yet.</Empty>
          ) : (
            activity.map((a, i) => {
              const st = ACTIVITY_STYLE[a.type] || ACTIVITY_STYLE.views;
              return (
                <div
                  key={a.id}
                  style={{
                    ...S.actRow,
                    borderBottom: i === activity.length - 1 ? 'none' : `1px solid ${LINE}`,
                  }}
                >
                  <span style={{ ...S.actIcon, background: st.bg, color: st.fg }}>
                    {st.icon}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={S.actTitle}>{a.title}</span>
                    <span style={S.actSub}>{a.subtitle}</span>
                  </span>
                  <span style={{ textAlign: 'right', flexShrink: 0 }}>
                    {a.amountLabel && (
                      <span style={{
                        display: 'block', fontSize: 12.5, fontWeight: 600,
                        color: AMOUNT_COLOR[a.amountTone] || INK,
                      }}>
                        {a.amountLabel}
                      </span>
                    )}
                    <span style={S.actTime}>{a.time}</span>
                  </span>
                </div>
              );
            })
          )}
        </Card>

        {/* Account status */}
        <Card>
          <div style={S.cardHead}>
            <span style={S.cardTitle}>Account status</span>
          </div>

          {loading ? (
            [0, 1, 2].map((i) => (
              <Skeleton key={i} height={34} style={{ marginBottom: 10 }} />
            ))
          ) : (
            <>
              {portal.checks.map((c, i) => {
                const done = c.status === 'done';
                return (
                  <div
                    key={c.id}
                    style={{
                      ...S.checkRow,
                      borderBottom: i === portal.checks.length - 1 ? 'none' : `1px solid ${LINE}`,
                    }}
                  >
                    <span style={{
                      ...S.checkIcon,
                      background: done ? GREEN_BG : AMBER_BG,
                      color: done ? GREEN : AMBER,
                    }}>
                      {done ? '✓' : '○'}
                    </span>
                    <span>
                      <span style={S.checkTitle}>{c.label}</span>
                      <span style={S.checkSub}>{c.sub}</span>
                    </span>
                  </div>
                );
              })}

              <div style={{ borderTop: `1.5px solid ${LINE}`, marginTop: 12, paddingTop: 12 }}>
                <div style={S.kv}>
                  <span style={S.kvLabel}>Plan</span>
                  <Chip bg={GOLD + '22'} fg={AMBER}>{portal.billing.planLabel}</Chip>
                </div>
                <div style={{ ...S.kv, marginTop: 8 }}>
                  <span style={S.kvLabel}>Next billing</span>
                  <span style={S.kvValue}>
                    {inr(portal.billing.nextAmount)} on {portal.billing.nextDate}
                  </span>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
}

