'use client';
// modules/Checkout/DeliveryForm/index.jsx
import { useState, useEffect } from 'react';
import { useAuthStore }        from '@/store/authStore';
import { SHIPPING_RATES, shippingCostFor } from '@/lib/shipping';
import { S } from './styles';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Rates moved to lib/shipping.js — the old table here held pseudo-USD figures
// (0 / 18 / 35, free_above 200) that three different files interpreted three
// different ways. Re-exported so existing `import { SHIPPING_RATES } from
// '@/modules/Checkout/DeliveryForm'` call sites keep working.
export { SHIPPING_RATES, shippingCostFor };

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli',
  'Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry',
];

// Canonical field order — drives which error we scroll to first, so the page
// always jumps to the topmost problem rather than an arbitrary one.
export const ADDRESS_FIELDS = [
  ['firstName', 'First name'],
  ['lastName',  'Last name'],
  ['email',     'Email address'],
  ['phone',     'Phone number'],
  ['address',   'Street address'],
  ['city',      'City'],
  ['state',     'State'],
  ['pin',       'PIN code'],
];

/**
 * Validate EVERY field and return a { field: message } map.
 *
 * The old validateAddress() bailed on the first problem and returned a lone
 * string, which is why the shopper had to hunt: the message appeared next to
 * the button at the bottom, named a field they couldn't see, and revealed only
 * one issue at a time — fix it, submit, discover the next one.
 */
export function validateAddressFields(addr = {}) {
  const errors = {};

  for (const [key, label] of ADDRESS_FIELDS) {
    if (!String(addr[key] ?? '').trim()) errors[key] = `${label} is required`;
  }

  if (!errors.pin && !/^\d{6}$/.test(String(addr.pin || '')))
    errors.pin = 'PIN code must be exactly 6 digits';

  if (!errors.phone && !/^\d{10}$/.test(String(addr.phone || '').replace(/\D/g, '')))
    errors.phone = 'Phone must be 10 digits';

  if (!errors.email && !/\S+@\S+\.\S+/.test(String(addr.email || '')))
    errors.email = 'Enter a valid email address';

  return errors;
}

/** Kept for existing callers — returns the first message, or null. */
export function validateAddress(addr) {
  const errors = validateAddressFields(addr);
  const first  = ADDRESS_FIELDS.find(([k]) => errors[k]);
  return first ? errors[first[0]] : null;
}

/**
 * Scroll to the first invalid field, focus it, and flag it.
 * Uses block:'center' so it clears any sticky header without hard-coding an
 * offset, and waits a frame so the error markup is painted before we measure.
 */
export function focusFirstError(errors = {}, root = null) {
  const first = ADDRESS_FIELDS.find(([k]) => errors[k]);
  if (!first) return null;
  const key = first[0];

  requestAnimationFrame(() => {
    const scope = root || document;
    const wrap  = scope.querySelector(`[data-field="${key}"]`);
    const input = wrap?.querySelector('input, select, textarea');
    if (!wrap) return;

    wrap.scrollIntoView({
      behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        ? 'auto' : 'smooth',
      block: 'center',
    });

    // Focus after the scroll settles — focusing first makes the browser jump
    // instantly and fight the smooth scroll.
    setTimeout(() => {
      input?.focus({ preventScroll: true });
      wrap.classList.remove('df-shake');
      void wrap.offsetWidth;          // force reflow so the animation re-runs
      wrap.classList.add('df-shake');
      setTimeout(() => wrap.classList.remove('df-shake'), 600);
    }, 320);
  });

  return key;
}

export default function DeliveryForm({ addr, onAddr, shipping, onShipping, cartTotal, onNext, onBack }) {
  const { token }                = useAuthStore();

  // Which fields the shopper has interacted with, and whether they've tried to
  // submit. Errors stay hidden until a field is blurred or Continue is pressed —
  // showing "First name is required" on an untouched empty form is hostile.
  const [touched,     setTouched]     = useState({});
  const [showErrors,  setShowErrors]  = useState(false);

  const errors     = validateAddressFields(addr);
  const errorCount = Object.keys(errors).length;

  const shown    = (k) => ((touched[k] || showErrors) ? errors[k] : null);
  const touch    = (k) => setTouched((t) => ({ ...t, [k]: true }));
  const fieldCls = (k, base = 'df-field') => `${base}${shown(k) ? ' has-err' : ''}`;

  const change = (k, v) => {
    onAddr(k, v);
    // Clear the "submitted" flag once the form is clean so the summary banner
    // doesn't linger after everything's fixed.
    if (showErrors) {
      const next = validateAddressFields({ ...addr, [k]: v });
      if (!Object.keys(next).length) setShowErrors(false);
    }
  };

  // Called by the Continue button instead of letting the parent validate.
  const handleNext = () => {
    if (errorCount > 0) {
      setShowErrors(true);
      setTouched(Object.fromEntries(ADDRESS_FIELDS.map(([k]) => [k, true])));
      focusFirstError(errors);
      return;
    }
    onNext?.();
  };
  // NOTE: there used to be `const USD_TO_INR = 84;` here, applied to the shipping
  // price on DISPLAY only. CheckoutClient added the raw rate.price to the
  // Razorpay amount, so Express *showed* ₹1,512 (18 × 84) and *charged* ₹18.
  // Rates now live in lib/shipping.js as real rupee amounts — no conversion.
  const [backendAddrs, setBackendAddrs] = useState([]);

  // Load saved addresses from backend
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/api/user/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { if (d.data?.length) setBackendAddrs(d.data); })
      .catch(() => {});
  }, [token]);

  const removeAddr = (index) => {
    try {
      const updated = backendAddrs.filter((_, i) => i !== index);
      localStorage.setItem('fameo_saved_addresses', JSON.stringify(updated));
      // Force re-read from parent
      window.dispatchEvent(new Event('storage'));
    } catch (_) {}
  };

  return (
    <>
      <style>{S}</style>

      {/* Saved addresses */}
      {backendAddrs.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <p className="df-saved-title">Saved Addresses</p>
          <div className="df-saved-list">
            {backendAddrs.map((a, i) => (
              <div
                key={i}
                className={`df-saved-card${addr.address === a.address && addr.pin === a.pin ? ' selected' : ''}`}
                onClick={() => onAddr('__fill__', a)}
              >
                <div className="df-saved-text">
                  <span className="df-saved-name">{a.firstName} {a.lastName}</span><br />
                  {a.address}, {a.city}<br />
                  {a.state} — {a.pin} · {a.phone}
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'6px' }}>
                  <button className="df-saved-use" onClick={(e) => { e.stopPropagation(); onAddr('__fill__', a); }}>
                    Use
                  </button>
                  <button className="df-saved-del" onClick={(e) => { e.stopPropagation(); removeAddr(i); }} title="Remove">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="df-or-divider">— or enter a new address —</div>
        </div>
      )}

      <h2 className="df-sec-title">Delivery Address</h2>

      {/* Error summary — every problem at once, each chip jumps to its field.
          Previously a single message sat next to the button naming a field the
          shopper couldn't see, and only revealed one issue at a time. */}
      {showErrors && errorCount > 0 && (
        <div className="df-summary" role="alert">
          <div className="df-summary-title">
            ⚠ {errorCount} {errorCount === 1 ? 'field needs' : 'fields need'} attention
          </div>
          <div className="df-summary-list">
            {ADDRESS_FIELDS.filter(([k]) => errors[k]).map(([k, l]) => (
              <button
                key={k}
                type="button"
                className="df-summary-chip"
                onClick={() => focusFirstError({ [k]: errors[k] })}
              >
                {l} ↗
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Name */}
      <div className="df-g2">
        {[['firstName','First Name'],['lastName','Last Name']].map(([k,l]) => (
          <div key={k} className={fieldCls(k)} data-field={k}>
            <label className="df-label">{l} *</label>
            <input className="df-inp" placeholder={l} value={addr[k]}
              aria-invalid={!!shown(k)}
              onBlur={() => touch(k)}
              onChange={(e) => change(k, e.target.value)} />
            {shown(k) && <span className="df-err">{shown(k)}</span>}
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="df-g2">
        {[['email','Email Address'],['phone','Phone Number']].map(([k,l]) => (
          <div key={k} className={fieldCls(k)} data-field={k}>
            <label className="df-label">{l} *</label>
            <input className="df-inp" placeholder={l} value={addr[k]}
              aria-invalid={!!shown(k)}
              onBlur={() => touch(k)}
              onChange={(e) => change(k, e.target.value)} />
            {shown(k) && <span className="df-err">{shown(k)}</span>}
          </div>
        ))}
      </div>

      {/* Address */}
      <div className={fieldCls('address')} data-field="address">
        <label className="df-label">Street Address *</label>
        <input className="df-inp" placeholder="House / Flat / Street / Area"
          value={addr.address}
          aria-invalid={!!shown('address')}
          onBlur={() => touch('address')}
          onChange={(e) => change('address', e.target.value)} />
        {shown('address') && <span className="df-err">{shown('address')}</span>}
      </div>

      {/* City / State / PIN */}
      <div className="df-g3">
        <div className={fieldCls('city', 'df-field-0')} data-field="city">
          <label className="df-label">City *</label>
          <input className="df-inp" placeholder="City"
            value={addr.city}
            aria-invalid={!!shown('city')}
            onBlur={() => touch('city')}
            onChange={(e) => change('city', e.target.value)} />
          {shown('city') && <span className="df-err">{shown('city')}</span>}
        </div>
        <div className={fieldCls('state', 'df-field-0')} data-field="state">
          <label className="df-label">State *</label>
          <select className="df-select" value={addr.state}
            aria-invalid={!!shown('state')}
            onBlur={() => touch('state')}
            onChange={(e) => change('state', e.target.value)}>
            {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
          {shown('state') && <span className="df-err">{shown('state')}</span>}
        </div>
        <div className={fieldCls('pin', 'df-field-0')} data-field="pin">
          <label className="df-label">PIN Code *</label>
          <input className="df-inp" placeholder="6-digit PIN" maxLength={6}
            value={addr.pin}
            aria-invalid={!!shown('pin')}
            onBlur={() => touch('pin')}
            onChange={(e) => change('pin', e.target.value.replace(/\D/g,'').slice(0,6))} />
          {shown('pin') && <span className="df-err">{shown('pin')}</span>}
        </div>
      </div>

      {/* Shipping */}
      <h2 className="df-sec-title df-sec-title-gap">Shipping Method</h2>
      <div className="df-ship-opts">
        {SHIPPING_RATES.map((rate) => {
          // Same helper CheckoutClient uses to build the Razorpay amount, so the
          // price shown here is exactly the price charged.
          const cost = shippingCostFor(rate, cartTotal);
          return (
            <div
              key={rate.id}
              className={`df-ship-opt${shipping.id === rate.id ? ' sel' : ''}`}
              onClick={() => onShipping(rate)}
            >
              <div className="df-ship-radio" />
              <div className="df-ship-info">
                <div className="df-ship-label">{rate.label}</div>
                <div className="df-ship-days">{rate.days}</div>
              </div>
              <div className={`df-ship-price${cost === 0 ? ' free' : ''}`}>
                {cost === 0 ? 'FREE' : `₹${cost.toLocaleString('en-IN')}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Nav */}
      <div className="df-nav">
        <button className="df-btn-secondary" onClick={onBack}>← Back to Bag</button>
        <button className="df-btn-primary" onClick={handleNext}>Continue to Payment →</button>
      </div>
    </>
  );
}
