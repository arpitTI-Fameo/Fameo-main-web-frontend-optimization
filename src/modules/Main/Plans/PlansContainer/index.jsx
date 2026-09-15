'use client';
// modules/Plans/PlansContainer/index.jsx
// Full Razorpay payment flow for subscriptions
// Design: PREMIUM EDITORIAL — Fraunces (headings) · Schibsted Grotesk (body)
// · Space Mono (labels) · Poppins (NUMBERS). Rounded cards, gradient icon
// chips, unified rounded duration pills (1 / 3 / 6 / 12 months). Free hidden.
// All backend/payment logic is unchanged.

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { PLANS } from '@/constants/membership';
import { purchasePlan, newCheckoutAttemptId } from '@/lib/services/main/subscription.api';
import { useQuoteMarketingCouponMutation, usePlans, useCurrentSubscription } from '@/lib/hooks/main/useSubscription';
import { S } from '../styles'
import { IcCheck, IcShield, IcRefresh, IcLock, IcArrow } from '../icons'
import { PRICES, FROM_LABELS } from '../constants';
import { inr } from '../helpers';
import DurationSelector from '../DurationSelector';

export default function PlansContainer() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, token, updateMembership, logout } = useAuthStore();

    const isUpgrade = searchParams.get('upgrade') === 'true';
    const fromPage = searchParams.get('from') || '';
    const fromLabel = FROM_LABELS[fromPage] || 'this feature';

    const [duration, setDuration] = useState(1);
    const [current, setCurrent] = useState('free');
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState('');
    const [confirmed, setConfirmed] = useState(null); // { plan, paymentId, amount }
    const [countdown, setCountdown] = useState(5);

    // Plans now come from the backend (Plan collection). PLANS stays as a
    // fallback so the page still renders if the API is unreachable.
    const [plans, setPlans] = useState(PLANS);

    // One idempotency key per checkout ATTEMPT (§4). Reused when the user retries
    // after dismissing Checkout, so the backend reuses the open order instead of
    // creating a second one. Cleared on success or when the selection changes.
    const attemptKey = useRef({ billingId: null, key: null });

    // Campaign-coupon checkout modal.
    const [checkoutPlan, setCheckoutPlan] = useState(null); // plan being checked out
    const [couponInput, setCouponInput] = useState('');
    const [coupon, setCoupon] = useState(null);  // applied quote data
    const [couponBusy, setCouponBusy] = useState(false);
    const [couponError, setCouponError] = useState('');

    // Fetch live plans. The proxy → central /plans now requires auth, so send the
    // token when present; the static PLANS fallback covers the logged-out view.
    // We MERGE backend data (prices, features, billing_options) with the static
    // PLANS design metadata (icon, color, appPlanCode, popular) matched by code,
    // so the backend drives pricing while YOUR design stays intact.
    const { data: plansData } = usePlans({ enabled: !!token });
    const { data: curData, refetch: refreshCurrent, error: curError } = useCurrentSubscription({ enabled: !!token });
    const quoteCouponMutation = useQuoteMarketingCouponMutation();

    useEffect(() => {
        if (!plansData) return;
        const d = Array.isArray(plansData) ? plansData : plansData.data;
        if (!Array.isArray(d) || !d.length) return;
        
        const codeOf = (p) => (p?.plan_code || p?.code || p?.id || '').toString().toLowerCase();
        const merged = d.map((apiPlan) => {
            const design = (PLANS || []).find((sp) => codeOf(sp) === codeOf(apiPlan)) || {};
            return {
                ...design,
                ...apiPlan,
                id: design.id || apiPlan.id,
                backendPlanId: apiPlan.id,
                name: apiPlan.plan_name || apiPlan.name || design.name,
                icon: apiPlan.icon || design.icon,
                color: apiPlan.color || design.color,
                appPlanCode: apiPlan.plan_code || design.appPlanCode,
                popular: design.popular ?? apiPlan.popular,
                features: Array.isArray(apiPlan.features) ? apiPlan.features : design.features,
                notIncluded: design.notIncluded,
                discountRate: design.discountRate ?? apiPlan.discountRate,
                discountLabel: design.discountLabel ?? apiPlan.discountLabel,
                pricingTiers: apiPlan.pricingTiers || design.pricingTiers,
            };
        });
        
        const mergedCodes = new Set(merged.map((m) => codeOf(m)));
        const staticOnly = (PLANS || []).filter((sp) => !mergedCodes.has(codeOf(sp)));
        const ORDER = { free: 0, pro: 1, popular: 2, elite: 3 };
        const full = [...staticOnly, ...merged].sort(
            (a, b) => (ORDER[codeOf(a)] ?? 99) - (ORDER[codeOf(b)] ?? 99)
        );
        setPlans(full);
    }, [plansData]);

    useEffect(() => {
        if (!curData) return;
        const cur = curData?.data || curData;
        const code = (cur?.plan?.plan_code || cur?.membershipType || 'free').toLowerCase();
        const isFree = code === 'free' || cur?.subscription_id === 'free';
        setCurrent(isFree ? 'free' : code);
    }, [curData]);

    useEffect(() => {
        if (curError?.name === 'SessionExpiredError' || curError?.message === 'SESSION_EXPIRED') {
            logout(); router.push('/login?reason=session_expired');
        }
    }, [curError, logout, router]);

    // Option 2 sync: refresh the current plan when the user returns to this tab,
    // so a plan changed in the app shows here without a manual reload.
    useEffect(() => {
        const onFocus = () => { if (document.visibilityState === 'visible') refreshCurrent(); };
        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onFocus);
        return () => {
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onFocus);
        };
    }, [refreshCurrent]);

    // Countdown after confirmation → redirect to cart
    useEffect(() => {
        if (!confirmed) return;
        if (countdown <= 0) {
            router.push(fromPage || '/cart');
            return;
        }
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [confirmed, countdown]);

    const campaignEligible = (plan) =>
        ['popular', 'elite'].includes(planCodeOf(plan));

    // Card button opens the checkout modal (does NOT pay yet).
    const openCheckout = (plan) => {
        if (!token) { router.push('/login?redirect=/plans'); return; }
        if (planCodeOf(plan) === 'free') return;
        if (isCurrentPlan(plan)) return;
        setError('');
        setCoupon(null); setCouponInput(''); setCouponError('');
        attemptKey.current = { identity: null, key: null };
        setCheckoutPlan(plan);
    };

    const closeCheckout = () => {
        setCheckoutPlan(null);
        setCoupon(null); setCouponInput(''); setCouponError('');
    };

    // Validate + preview the campaign coupon (display only).
    const applyCoupon = async () => {
        const plan = checkoutPlan;
        const code = couponInput.trim();
        if (!plan || !code) return;
        const chosen = billingOptionFor(plan) || (plan.billing_options || [])[0];
        if (!chosen) { setCouponError('No billing option for this plan.'); return; }
        setCouponBusy(true); setCouponError('');
        try {
            const data = await quoteCouponMutation.mutateAsync({ billing_id: chosen.id, coupon_code: code });
            if (!data?.valid) { setCoupon(null); setCouponError('Coupon is not valid for this plan.'); return; }
            setCoupon(data);
        } catch (err) {
            setCoupon(null);
            setCouponError(err?.message || 'Coupon is invalid, paused, expired, or exhausted.');
        } finally {
            setCouponBusy(false);
        }
    };

    const removeCoupon = () => { setCoupon(null); setCouponInput(''); setCouponError(''); };

    // Pay button in the modal. Prices come from the order, never computed here.
    const handleConfirmPay = async () => {
        const plan = checkoutPlan;
        if (!plan || !token) return;

        const chosen = billingOptionFor(plan) || (plan.billing_options || [])[0];
        if (!chosen) { setError('This plan has no billing option available. Please refresh and try again.'); return; }

        // Only send a coupon the API confirmed as valid in the quote.
        const couponCode = coupon?.valid ? (coupon.coupon_code || couponInput.trim()) : '';

        // Idempotency identity = billing + coupon; changing either starts a new attempt.
        const identity = `${chosen.id}:${couponCode}`;
        if (attemptKey.current.identity !== identity || !attemptKey.current.key) {
            attemptKey.current = { identity, key: newCheckoutAttemptId() };
        }

        setLoading(plan.id); setError('');
        try {
            const { order, verification, alreadyCompleted } = await purchasePlan({
                billing_id: chosen.id,
                idempotency_key: attemptKey.current.key,
                marketing_coupon_code: couponCode || undefined,
                user,
                description: `${nameOf(plan)} Plan`,
            });

            attemptKey.current = { identity: null, key: null };

            if (alreadyCompleted) {
                setError('This payment was already completed. Refreshing your subscription…');
                refreshCurrent(); closeCheckout(); return;
            }

            const code = (plan.plan_code || plan.id || '').toString().toLowerCase();
            setCurrent(code); updateMembership(code); refreshCurrent();

            // Campaign coupon takes priority over referral in the display.
            const isCampaign = !!(order?.coupon_code) || order?.discount_source === 'MARKETING';
            setConfirmed({
                plan,
                paymentId: verification?.payment_ref || verification?.subscription_id
                    || order?.subscription_id || order?.razorpay_order_id || '',
                original: order?.original_price ?? chosen.price,
                discountPct: Number(order?.discount_percent ?? order?.referral_discount_percent) || 0,
                discountAmt: Number(order?.discount_amount ?? order?.referral_discount_amount) || 0,
                discountLabel: isCampaign ? `Coupon ${order?.coupon_code || couponCode}` : 'Referral discount',
                amount: order?.payable_price ?? chosen.price,
                duration: chosen.duration_months ?? duration,
            });
            setCountdown(5);
            closeCheckout();
        } catch (err) {
            if (err?.name === 'SessionExpiredError' || err?.message === 'SESSION_EXPIRED') {
                logout(); router.push('/login?reason=session_expired&redirect=/plans'); return;
            }
            setError(err.message || 'Could not complete the subscription.');
        } finally {
            setLoading(null);
        }
    };

    // The billing option for the selected duration — the unit the whole checkout
    // works in. Its `id` is the billing_id sent to the order endpoint (§3).
    const billingOptionFor = (plan) =>
        (plan?.billing_options || []).find(
            (o) => Number(o.duration_months) === Number(duration)
        ) || null;

    // Same, but for an arbitrary duration (used by the price-in-tab display).
    const billingOptionForMonths = (plan, months) =>
        (plan?.billing_options || []).find(
            (o) => Number(o.duration_months) === Number(months)
        ) || null;

    // Original (pre-discount) price. Falls back to the static tables only when
    // the backend hasn't supplied billing options.
    const getPrice = (plan) => {
        if (plan.id === 'free' || plan.plan_code === 'FREE') return 0;
        const opt = billingOptionFor(plan);
        if (opt?.price != null) return opt.price;
        const tier = plan.pricingTiers?.find(t => t.months === duration);
        return tier?.price ?? PRICES[plan.id]?.[duration] ?? plan.price_monthly ?? plan.base_price_monthly;
    };

    // What the user actually pays, straight from the API (§3). Never computed.
    const getPayable = (plan) => {
        if (plan.id === 'free' || plan.plan_code === 'FREE') return 0;
        const opt = billingOptionFor(plan);
        return opt?.payable_price != null ? opt.payable_price : getPrice(plan);
    };

    // Representative total shown under each duration tab. Uses the "most chosen"
    // plan (popular) if present, else the first paid plan. Display only.
    const tabPrice = (months) => {
        const paid = plans.filter((p) => planCodeOf(p) !== 'free');
        const lead = paid.find((p) => p.popular) || paid.find((p) => planCodeOf(p) === 'popular') || paid[0];
        if (!lead) return null;
        const opt = billingOptionForMonths(lead, months);
        if (opt?.payable_price != null) return opt.payable_price;
        if (opt?.price != null) return opt.price;
        const tier = lead.pricingTiers?.find((t) => t.months === months);
        if (tier?.price != null) return tier.price;
        const fb = PRICES[lead.id]?.[months];
        return fb != null ? fb : null;
    };

    // A plan is "current" when its code matches the user's membership type. The
    // backend plan may expose its code as `plan_code`, `code`, or (legacy) a slug
    // `id`. Normalise all of them before comparing to `current`.
    const planCodeOf = (plan) =>
        (plan?.plan_code || plan?.code || plan?.membershipType || plan?.id || '')
            .toString().toLowerCase();
    // Plan display name across shapes: central API uses `plan_name`, the static
    // PLANS + web backend use `name`. Fall back to a title-cased code, never blank.
    const nameOf = (plan) => {
        const n = plan?.name || plan?.plan_name;
        if (n) return n;
        const c = planCodeOf(plan);
        return c ? c.charAt(0).toUpperCase() + c.slice(1) : 'Plan';
    };
    const isCurrentPlan = (plan) =>
        current && current !== 'free' && planCodeOf(plan) === String(current).toLowerCase();

    // Referral pricing arrives ON the billing option itself (§3).
    const hasReferral = (plan) => {
        const opt = billingOptionFor(plan);
        return Boolean(opt?.referral_eligible) && Number(opt?.referral_discount_amount) > 0;
    };

    // The coupon the backend linked to this user, for the banner.
    const referralInfo = () => {
        for (const plan of plans) {
            for (const opt of plan?.billing_options || []) {
                if (opt?.referral_eligible && Number(opt?.referral_discount_percent) > 0) {
                    return { code: opt.referral_coupon_code, percent: Number(opt.referral_discount_percent) };
                }
            }
        }
        return null;
    };

    const referralActiveNow = () => plans.some((p) => hasReferral(p));

    const toFeatureArray = (val) => {
        if (Array.isArray(val)) {
            return val
                .map((f) => (typeof f === 'string' ? f : (f?.label || f?.name || f?.title || f?.text || '')))
                .filter(Boolean);
        }
        if (val && typeof val === 'object') {
            return Object.values(val)
                .map((f) => (typeof f === 'string' ? f : (f?.label || f?.name || '')))
                .filter(Boolean);
        }
        if (typeof val === 'string') {
            return val.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
        }
        return [];
    };
    const staticPlanFor = (plan) =>
        (PLANS || []).find((p) => planCodeOf(p) === planCodeOf(plan));
    const featureList = (plan) => {
        const fromApi = toFeatureArray(plan?.features);
        if (fromApi.length) return fromApi;
        return toFeatureArray(staticPlanFor(plan)?.features);
    };
    const notIncludedList = (plan) => {
        const fromApi = toFeatureArray(plan?.notIncluded);
        if (fromApi.length) return fromApi;
        return toFeatureArray(staticPlanFor(plan)?.notIncluded);
    };

    const getBtnLabel = (plan) => {
        if (planCodeOf(plan) === 'free') return 'Free Plan';
        if (isCurrentPlan(plan)) return '✓ Current Plan';
        if (loading === plan.id) return 'Opening payment…';
        if (current && current !== 'free') return `Upgrade to ${nameOf(plan)}`;
        return `Continue with ${nameOf(plan)}`;
    };

    const getBtnClass = (plan) => {
        if (planCodeOf(plan) === 'free') return 'plan-btn btn-free';
        if (isCurrentPlan(plan)) return 'plan-btn btn-active';
        return 'plan-btn btn-primary';
    };

    // Plans to render — Free is hidden on the web storefront.
    const visiblePlans = plans.filter((p) => planCodeOf(p) !== 'free');

    // ── Confirmation screen ───────────────────────────────────────────────────
    if (confirmed) {
        return (
            <>
                <style>{S}</style>
                <div className="plans-page">
                    <div className="conf-wrap">
                        <div className="conf-icon">🎉</div>
                        <h1 className="conf-title">
                            Welcome to <em>{nameOf(confirmed.plan)}</em>
                        </h1>
                        <p className="conf-sub">Subscription activated successfully</p>

                        <div className="conf-card">
                            <div className="conf-row">
                                <span>Plan</span>
                                <span style={{ color: confirmed.plan.color }}>{confirmed.plan.icon} {nameOf(confirmed.plan)}</span>
                            </div>
                            <div className="conf-row">
                                <span>Duration</span>
                                <span>{confirmed.duration} month{confirmed.duration > 1 ? 's' : ''}</span>
                            </div>
                            {confirmed.discountAmt > 0 && (
                                <>
                                    <div className="conf-row">
                                        <span>Original price</span>
                                        <span style={{ textDecoration: 'line-through', color: 'var(--faint)' }}>
                                            ₹{inr(confirmed.original)}
                                        </span>
                                    </div>
                                    <div className="conf-row">
                                        <span>{confirmed.discountLabel || 'Referral discount'} ({confirmed.discountPct}%)</span>
                                        <span style={{ color: '#2E9E63' }}>−₹{inr(confirmed.discountAmt)}</span>
                                    </div>
                                </>
                            )}
                            <div className="conf-row">
                                <span>Amount paid</span>
                                <span>₹{inr(confirmed.amount)}</span>
                            </div>
                            {confirmed.plan.discountRate > 0 && (
                                <div className="conf-row">
                                    <span>Product discount</span>
                                    <span style={{ color: '#2E9E63' }}>{confirmed.plan.discountLabel} on all products ✓</span>
                                </div>
                            )}
                            <div className="conf-row">
                                <span>Payment ID</span>
                                <span style={{ fontSize: '11px' }}>{confirmed.paymentId}</span>
                            </div>
                        </div>

                        <p className="conf-countdown">
                            Redirecting to {fromPage ? fromLabel : 'cart'} in {countdown}s…
                        </p>
                        <a href={fromPage || '/cart'} className="conf-btn">
                            Go now <IcArrow />
                        </a>
                    </div>
                </div>
            </>
        );
    }

    // ── Main plans grid ───────────────────────────────────────────────────────
    return (
        <>
            <style>{S}</style>
            <div className="plans-page">
                <div className="plans-head">
                    <span className="plans-eyebrow">Membership</span>
                    <h1 className="plans-title">Choose Your <em>Plan</em></h1>

                </div>

                {isUpgrade && (
                    <div className="upgrade-notice">
                        <h3>Upgrade required to access <em>{fromLabel}</em></h3>
                        <p>Choose Popular or Elite to unlock full access</p>
                    </div>
                )}

                {(() => {
                    const ref = referralInfo();
                    if (!ref) return null;
                    const activeNow = referralActiveNow();
                    return (
                        <div className="referral-benefit">
                            <span className="rb-tag">Referral</span>
                            <div className="rb-body">
                                <div className="rb-title">
                                    <em>{ref.percent}% off</em> your first paid plan
                                </div>
                                {ref.code && <div className="rb-meta">{ref.code}</div>}
                                <p className="rb-note">
                                    {activeNow
                                        ? 'Already applied to the eligible plans below.'
                                        : `Your coupon doesn't cover ${duration} month${duration > 1 ? 's' : ''}. Try another duration to use it.`}
                                </p>
                            </div>
                        </div>
                    );
                })()}

                {error && <div className="msg-error">⚠ {error}</div>}

                {/* Duration selector — price shown under each label */}
                <DurationSelector duration={duration} setDuration={setDuration} tabPrice={tabPrice} />

                {/* Cancel / auto-renew notice */}
                {/* <div className="cancel-notice">
          <IcShield s={15} />
          Cancel anytime · Auto-renews unless cancelled 24h before the term ends
        </div> */}

                <div className="plans-grid">
                    {visiblePlans.map((plan) => {
                        const isElite = planCodeOf(plan) === 'elite';
                        const isPremium = plan.popular || isElite;
                        const opt = billingOptionFor(plan);
                        const showRef = hasReferral(plan);
                        const current_ = isCurrentPlan(plan);
                        return (
                            <div
                                key={plan.id}
                                className={`plan-card${isPremium ? ' premium' : ''}${plan.popular ? ' popular' : ''}${isElite ? ' elite' : ''}${current_ ? ' is-current' : ''}`}
                            >
                                {plan.popular && <div className="most-chosen">Most Chosen</div>}

                                <div className="card-head">
                                    {plan.icon && <div className="plan-chip">{plan.icon}</div>}
                                    <div className="card-head-txt">
                                        <h2 className="plan-name">{nameOf(plan)}</h2>
                                        {plan.appPlanCode && <p className="plan-code">{plan.appPlanCode}</p>}
                                    </div>
                                </div>

                                {current_ && (
                                    <div className="current-tag"><IcCheck s={12} /> Your current plan</div>
                                )}

                                <div className="plan-price-wrap">
                                    <div className="plan-price">
                                        <span className="cur">₹</span>
                                        <span className="amt">{inr(getPayable(plan))}</span>
                                        <span className="per">/ {duration} mo</span>
                                    </div>
                                    <p className="plan-term">
                                        Billed once for {duration} month{duration > 1 ? 's' : ''}
                                    </p>

                                    {showRef && (
                                        <>
                                            <div className="plan-was">
                                                <s>₹{inr(getPrice(plan))}</s>
                                                <span className="plan-was-off">−{opt.referral_discount_percent}% referral</span>
                                            </div>
                                            <p className="plan-price-note">
                                                You save ₹{inr(opt.referral_discount_amount)} with your referral
                                            </p>
                                        </>
                                    )}

                                    {plan.discountRate > 0 && (
                                        <div className="plan-discount-tag">
                                            <span style={{ color: plan.color }}>{plan.icon}</span>
                                            {plan.discountLabel} off all products
                                        </div>
                                    )}
                                </div>

                                {isPremium && (
                                    <div className="feat-chip"><IcCheck s={10} /> All features included</div>
                                )}

                                <ul className="plan-features">
                                    {featureList(plan).map((f, i) => (
                                        <li key={`${f}-${i}`} className="plan-feat">
                                            <span className="feat-check"><IcCheck s={11} /></span>
                                            {f}
                                        </li>
                                    ))}
                                    {notIncludedList(plan).map((f, i) => (
                                        <li key={`ni-${f}-${i}`} className="plan-feat feat-no">
                                            <span className="feat-check">✕</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={getBtnClass(plan)}
                                    onClick={() => openCheckout(plan)}
                                    disabled={current_ || !!loading}
                                >
                                    {getBtnLabel(plan)}
                                    {!current_ && loading !== plan.id && <IcArrow />}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {checkoutPlan && (() => {
                    const plan = checkoutPlan;
                    const chosen = billingOptionFor(plan) || (plan.billing_options || [])[0];
                    const original = coupon?.valid ? (coupon.original_price ?? getPrice(plan)) : getPrice(plan);
                    const payable = coupon?.valid ? coupon.payable_price : getPayable(plan);
                    const refShown = !coupon?.valid && hasReferral(plan);
                    const showBox = campaignEligible(plan);
                    return (
                        <div className="co-overlay" onClick={closeCheckout}>
                            <div className="co-panel" onClick={(e) => e.stopPropagation()}>
                                <button className="co-close" onClick={closeCheckout}>✕</button>
                                <p className="co-eyebrow">Checkout</p>
                                <h3 className="co-title">
                                    {nameOf(plan)} <em>· {duration} month{duration > 1 ? 's' : ''}</em>
                                </h3>

                                <div className="co-rows">
                                    <div className="co-row"><span>Original price</span><span>₹{inr(original)}</span></div>

                                    {coupon?.valid && (
                                        <div className="co-row co-disc">
                                            <span>Coupon {coupon.coupon_code} ({coupon.discount_percent}%)</span>
                                            <span>−₹{inr(coupon.discount_amount)}</span>
                                        </div>
                                    )}
                                    {refShown && (
                                        <div className="co-row co-disc">
                                            <span>Referral discount ({chosen?.referral_discount_percent}%)</span>
                                            <span>−₹{inr(chosen?.referral_discount_amount)}</span>
                                        </div>
                                    )}

                                    <div className="co-row co-total"><span>You pay</span><span>₹{inr(payable)}</span></div>
                                </div>

                                {coupon?.valid && coupon.replaces_referral_discount && (
                                    <p className="co-note">Campaign coupon applied. Discounts cannot be combined.</p>
                                )}

                                {showBox && !coupon?.valid && (
                                    <div className="co-coupon">
                                        <input
                                            className="co-input"
                                            placeholder="Campaign coupon code"
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                                            disabled={couponBusy}
                                        />
                                        <button className="co-apply" onClick={applyCoupon} disabled={couponBusy || !couponInput.trim()}>
                                            {couponBusy ? '…' : 'Apply'}
                                        </button>
                                    </div>
                                )}
                                {showBox && coupon?.valid && (
                                    <button className="co-remove" onClick={removeCoupon}>Remove coupon</button>
                                )}
                                {couponError && <p className="co-err">{couponError}</p>}

                                <button className="co-pay" onClick={handleConfirmPay} disabled={loading === plan.id}>
                                    {loading === plan.id
                                        ? 'Processing…'
                                        : (Number(payable) === 0 ? 'Activate for free' : `Pay ₹${inr(payable)}`)}
                                </button>
                                <p className="co-secure"><IcLock s={11} /> Secured by Razorpay · Cancel anytime</p>
                            </div>
                        </div>
                    );
                })()}

                {/* Trust row */}

                <br></br>
                <br></br>
                <br></br>
            </div>
        </>
    );
}
