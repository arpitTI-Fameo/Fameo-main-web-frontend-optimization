'use client';
// modules/Account/Subscription/index.jsx
// Account → Subscription. Membership + Payment info + payment history (invoices)
// + Cancel. Robust against missing fields so the Cancel button and history always
// render whenever the user actually has a paid membership.

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

// Subscriptions go through the web backend, which proxies to the central
// subscription API (shared with the app) and verifies Razorpay on writes.

const PLAN_COLORS = { free: '#9898a8', pro: '#7c9ec9', popular: '#d4a0c0', elite: '#e8457a' };
const PLAN_ICONS = { free: '○', pro: '✦', popular: '◈', elite: '★' };
import { S, printInvoice } from './styles';
import { fmtINR, fmtDate, fmtShort } from './helpers';
import { useCurrentSubscription, useSubscriptionHistory, useCancelSubscriptionMutation, useSetAutoRenewMutation } from '@/lib/hooks/main/useSubscription';


export default function Subscription() {
  const router = useRouter();
  const { token, updateMembership, logout } = useAuthStore();

  const currentQuery = useCurrentSubscription();
  const historyQuery = useSubscriptionHistory();
  const cancelMutation = useCancelSubscriptionMutation();
  const autoRenewMutation = useSetAutoRenewMutation();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!token) { router.push('/login?redirect=/account/subscription'); }
  }, [token, router]);

  const sub = currentQuery.data || null;
  const invoices = historyQuery.data || [];
  const loading = currentQuery.isPending || historyQuery.isPending;
  const cancelling = cancelMutation.isPending;

  const handleCancel = async () => {
    setError(''); setSuccess('');
    try {
      const result = await cancelMutation.mutateAsync({ subscriptionId: sub?.subscription_id ?? sub?.subscriptionId, reason: 'User cancelled from web' });
      updateMembership('free');
      setSuccess(result?.message || 'Subscription cancelled. You keep access until it expires.');
      setShowCancel(false);
    } catch (e) {
      if (e.status === 401) {
        logout();
        router.push('/login?reason=session_expired&redirect=/account/subscription');
        return;
      }
      setError(e.message);
    }
  };

  const handleAutoRenew = async (nextValue) => {
    setError(''); setSuccess('');
    try {
      await autoRenewMutation.mutateAsync({ subscriptionId: sub?.subscription_id ?? sub?.subscriptionId, autoRenew: nextValue });
      setSuccess(nextValue ? 'Auto-renew turned on.' : 'Auto-renew turned off.');
    } catch (e) {
      if (e.status === 401) {
        logout();
        router.push('/login?reason=session_expired&redirect=/account/subscription');
        return;
      }
      setError(e.message);
    }
  };

  if (loading) {
    return (
      <>
        <style>{S}</style>
        <div className="sb-page"><div className="loading">◈ Loading your subscription…</div></div>
      </>
    );
  }

  // Robust active detection: treat as active if the backend flags it active, OR
  // there's a subscription id / paid tier present. Prevents the whole card
  // (and Cancel + history) from disappearing on a slightly different shape.
  // Central API (PDF) shape: { subscription_id, plan:{plan_code,plan_name},
  // status, is_cancelled, auto_renew, expires_at, days_remaining, amount_paid,
  // billing_duration_months }. Legacy fallbacks kept so nothing breaks if an
  // older shape shows up.
  // This backend's /current shape: { active, subscriptionId, membershipType,
  // planCode, planName, durationMonths, amountPaid, startedAt, expiresAt,
  // autoRenew, isRecurring, nextChargeAt, discountRate, appSyncStatus }.
  // Central /current shape (PDF): { subscription_id, plan:{plan_code,plan_name},
  // status, is_cancelled, auto_renew, expires_at, days_remaining, amount_paid,
  // billing_duration_months }. Legacy web-backend fields kept as fallbacks.
  const subId = sub?.subscription_id ?? sub?.subscriptionId ?? null;
  const planCode = (sub?.plan?.plan_code || sub?.membershipType || sub?.planCode || 'free').toLowerCase();
  const planLabel = sub?.plan?.plan_name || sub?.planName || planCode;
  const hasPaidTier = planCode && planCode !== 'free' && subId !== 'free';
  const cancelled = sub?.is_cancelled === true || sub?.status === 'cancelled';
  const daysLeft = sub?.days_remaining ?? null;
  // A cancelled subscription still grants access until it expires. So "active"
  // means: a paid plan that hasn't expired yet — NOT status === 'active' only.
  // (status is 'cancelled' the moment they cancel, but access continues.)
  const notExpired = daysLeft == null ? true : Number(daysLeft) > 0;
  const isActive = Boolean(
    hasPaidTier &&
    (sub?.status === 'active' || cancelled ? notExpired : (sub?.active ?? true))
  );
  const tier = planCode;
  const recurring = false;
  const willEnd = cancelled || sub?.auto_renew === false || sub?.autoRenew === false;
  const nextDate = sub?.expires_at || sub?.expiresAt || sub?.nextChargeAt;
  const months = sub?.billing_duration_months || sub?.durationMonths || 1;
  const amountPaid = sub?.amount_paid ?? sub?.amountPaid ?? 0;

  return (
    <>
      <style>{S}</style>
      <div className="sb-page">
        <h1 className="sb-h">My <em>Subscription</em></h1>
        <p className="sb-sub">Membership · Billing · Invoices</p>

        {error && <div className="msg-err">⚠ {error}</div>}
        {success && <div className="msg-ok">✓ {success}</div>}

        {!isActive ? (
          <>
            <div className="sb-empty">
              <p>You don’t have an active membership.</p>
              <button className="btn btn-dark" onClick={() => router.push('/plans')}>Browse plans</button>
            </div>

            {/* Show past invoices even when not currently subscribed. */}
            <div className="sb-label">Payment history</div>
            <div className="sb-card">
              {invoices.length === 0 ? (
                <div className="sb-inv-empty">No invoices yet.</div>
              ) : (
                <div className="sb-inv-wrap" style={{ borderTop: 'none' }}>
                  {invoices.map((inv) => (
                    <div className="sb-inv" key={inv.id}>
                      <div className="sb-inv-l">
                        <div className="d">{fmtShort(inv.paidAt)} · {inv.planName}</div>
                        <div className="n">{inv.invoiceNumber}{inv.billingPeriod ? ` · ${inv.billingPeriod}` : ''}</div>
                      </div>
                      <div className="sb-inv-r">
                        <span className="sb-inv-amt">{fmtINR(inv.amount)}</span>
                        <span className={`sb-inv-st ${inv.status !== 'paid' ? 'bad' : ''}`}>{inv.status}</span>
                        <button className="sb-inv-btn" onClick={() => printInvoice(inv)}>Invoice</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* ── Membership ────────────────────────────────── */}
            <div className="sb-label">Membership</div>
            <div className="sb-card">
              <div className="sb-plan">
                <span className="sb-plan-ico" style={{ color: PLAN_COLORS[tier] }}>{PLAN_ICONS[tier]}</span>
                <div>
                  <div className="sb-plan-name">{sub.planName || tier} plan</div>
                  <div className="sb-plan-desc">
                    {recurring
                      ? `Billed automatically every ${months} month${months > 1 ? 's' : ''}.`
                      : 'One-time payment. No automatic renewal.'}
                  </div>
                </div>
                <span className={`sb-badge ${willEnd ? 'off' : 'on'}`}>
                  {willEnd ? 'Ends soon' : 'Active'}
                </span>
              </div>
              <button className="sb-row" onClick={() => router.push('/plans')}>
                <span>Change plan</span>
                <span className="chev">›</span>
              </button>
            </div>

            {/* ── Payment info ──────────────────────────────── */}
            <div className="sb-label">Payment info</div>
            <div className="sb-card">
              <div className="sb-next">
                <div className="sb-next-t">
                  {willEnd ? 'Access until' : (recurring ? 'Next payment' : 'Expires')}
                </div>
                <div className="sb-next-d">{fmtDate(nextDate)}</div>

                {!willEnd && recurring && (
                  <div className="sb-pay-line">
                    <span className="sb-brand">RAZORPAY</span>
                    <span className="sb-mask">Auto-debit · {fmtINR(amountPaid)}</span>
                  </div>
                )}
                {willEnd && (
                  <div className="sb-muted" style={{ marginTop: 10 }}>
                    Auto-debit is off. You won’t be charged again.
                  </div>
                )}
              </div>

              <div className="sb-row static">
                <span>Payment method</span>
                <span className="sb-muted">Managed by Razorpay</span>
              </div>

              <button className="sb-row" onClick={() => setShowHistory(v => !v)}>
                <span>View payment history</span>
                <span className="chev">{showHistory ? '⌃' : '›'}</span>
              </button>

              {showHistory && (
                <div className="sb-inv-wrap">
                  {invoices.length === 0 ? (
                    <div className="sb-inv-empty">No invoices yet. They’ll appear here after each payment.</div>
                  ) : (
                    invoices.map((inv) => (
                      <div className="sb-inv" key={inv.id}>
                        <div className="sb-inv-l">
                          <div className="d">{fmtShort(inv.paidAt)} · {inv.planName}</div>
                          <div className="n">
                            {inv.invoiceNumber}{inv.billingPeriod ? ` · ${inv.billingPeriod}` : ''}
                          </div>
                        </div>
                        <div className="sb-inv-r">
                          <span className="sb-inv-amt">{fmtINR(inv.amount)}</span>
                          <span className={`sb-inv-st ${inv.status !== 'paid' ? 'bad' : ''}`}>{inv.status}</span>
                          <button className="sb-inv-btn" onClick={() => printInvoice(inv)}>Invoice</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* ── Auto-renew (this backend uses the autoRenew field) ── */}
            <div className="sb-autorenew">
              <div className="sb-autorenew-txt">
                <div className="sb-autorenew-ttl">Auto-renew</div>
                <div className="sb-autorenew-sub">
                  {willEnd
                    ? 'Off — your membership ends when the current period expires.'
                    : 'On — your membership renews at the end of the period.'}
                </div>
              </div>
              <button
                type="button" role="switch" aria-checked={!willEnd}
                className={`sb-switch${!willEnd ? ' on' : ''}`}
                onClick={() => handleAutoRenew(willEnd)}
              >
                <span className="sb-switch-knob" />
              </button>
            </div>

            {/* ── Cancel ── */}
            <button className="sb-cancel" onClick={() => setShowCancel(true)}>
              {willEnd ? 'End membership now' : 'Cancel Membership'}
            </button>
          </>
        )}
      </div>

      {/* Cancel confirmation modal */}
      {showCancel && (
        <div className="modal-bg" onClick={() => !cancelling && setShowCancel(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{willEnd ? 'End membership now?' : 'Cancel membership?'}</h3>
            <p>
              {willEnd
                ? 'Your membership is already set to stop at the end of the current cycle. You can end it immediately and lose access now.'
                : 'You can stop future auto-debits at the end of the current billing cycle (keep access until then), or cancel immediately and lose access now.'}
            </p>
            <div className="modal-row">
              <button className="btn btn-ghost" disabled={cancelling} onClick={() => setShowCancel(false)}>
                Keep plan
              </button>
              <button className="btn btn-danger" disabled={cancelling} onClick={() => handleCancel()}>
                {cancelling ? 'Cancelling…' : 'Cancel subscription'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

