'use client';
// components/checkout/DeliveryForm.js
import { useState, useEffect } from 'react';
import { useAuthStore }        from '@/store/authStore';
import { SHIPPING_RATES, shippingCostFor } from '@/lib/shipping';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Rates moved to lib/shipping.js — the old table here held pseudo-USD figures
// (0 / 18 / 35, free_above 200) that three different files interpreted three
// different ways. Re-exported so existing `import { SHIPPING_RATES } from
// '@/components/checkout/DeliveryForm'` call sites keep working.
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

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
  .df-sec-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:400; color:#181820; margin-bottom:18px; padding-bottom:12px; border-bottom:1px solid rgba(0,0,0,0.08); }
  .df-sec-title-gap { margin-top:28px; }
  .df-g2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }
  .df-g3 { display:grid; grid-template-columns:2fr 1fr 1fr; gap:12px; margin-bottom:12px; }
  .df-field { display:flex; flex-direction:column; gap:5px; margin-bottom:12px; }
  .df-field-0 { display:flex; flex-direction:column; gap:5px; }
  .df-label { font-family:'Jost',sans-serif; font-size:9px; font-weight:400; letter-spacing:.22em; text-transform:uppercase; color:#9898a8; }
  .df-inp { padding:11px 13px; border:1.5px solid rgba(0,0,0,0.08); background:#fafafa; font-family:'Jost',sans-serif; font-size:13px; color:#181820; outline:none; transition:border-color .2s; width:100%; border-radius:2px; box-sizing:border-box; }
  .df-inp:focus { border-color:#E8405A; background:#fff; }

  /* ── Field-level errors ── */
  .df-field.has-err .df-inp,
  .df-field-0.has-err .df-inp,
  .df-field.has-err .df-select,
  .df-field-0.has-err .df-select {
    border-color:#E05050; background:#fff7f7;
  }
  .df-field.has-err .df-label,
  .df-field-0.has-err .df-label { color:#C03A3A; }
  .df-err {
    font-family:'Jost',sans-serif; font-size:10.5px; font-weight:300;
    color:#C03A3A; display:flex; align-items:center; gap:4px;
    animation: dfErrIn .26s cubic-bezier(.22,1,.36,1);
  }
  .df-err::before { content:'!'; font-weight:600; font-size:9px;
    width:12px; height:12px; border-radius:50%; background:#E05050; color:#fff;
    display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  @keyframes dfErrIn { from { opacity:0; transform:translateY(-3px); } to { opacity:1; transform:none; } }

  /* Shake applied by focusFirstError() */
  .df-shake { animation: dfShake .5s cubic-bezier(.36,.07,.19,.97); }
  @keyframes dfShake {
    10%,90% { transform:translateX(-2px); }
    20%,80% { transform:translateX(3px);  }
    30%,50%,70% { transform:translateX(-5px); }
    40%,60% { transform:translateX(5px);  }
  }

  /* ── Error summary banner ── */
  .df-summary {
    border:1px solid rgba(224,80,80,.3); background:#fff5f5;
    border-radius:3px; padding:13px 15px; margin-bottom:20px;
    animation: dfErrIn .3s cubic-bezier(.22,1,.36,1);
  }
  .df-summary-title {
    font-family:'Jost',sans-serif; font-size:9px; font-weight:500;
    letter-spacing:.2em; text-transform:uppercase; color:#C03A3A;
    margin-bottom:9px; display:flex; align-items:center; gap:6px;
  }
  .df-summary-list { display:flex; flex-wrap:wrap; gap:7px; }
  .df-summary-chip {
    font-family:'Jost',sans-serif; font-size:10.5px; font-weight:300;
    color:#8a2b2b; background:#fff; border:1px solid rgba(224,80,80,.28);
    border-radius:2px; padding:4px 9px; cursor:pointer;
    transition:all .18s;
  }
  .df-summary-chip:hover {
    background:#E05050; color:#fff; border-color:#E05050;
  }

  @media (prefers-reduced-motion: reduce) {
    .df-shake, .df-err, .df-summary { animation:none !important; }
  }
  .df-inp::placeholder { color:#9898a8; font-size:12px; }
  .df-select { padding:11px 13px; border:1.5px solid rgba(0,0,0,0.08); background:#fafafa; font-family:'Jost',sans-serif; font-size:13px; color:#181820; outline:none; transition:border-color .2s; width:100%; border-radius:2px; appearance:none; cursor:pointer; background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239898a8' stroke-width='1.2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 13px center; box-sizing:border-box; }
  .df-select:focus { border-color:#E8405A; }

  /* Saved addresses */
  .df-saved-list { display:flex; flex-direction:column; gap:8px; margin-bottom:20px; }
  .df-saved-title { font-family:'Jost',sans-serif; font-size:9px; font-weight:400; letter-spacing:.22em; text-transform:uppercase; color:#9898a8; margin-bottom:8px; }
  .df-saved-card { display:flex; align-items:flex-start; justify-content:space-between; padding:12px 14px; background:rgba(46,170,104,.04); border:1px solid rgba(46,170,104,.15); border-radius:3px; gap:10px; cursor:pointer; transition:border-color .2s; }
  .df-saved-card:hover { border-color:rgba(46,170,104,.4); }
  .df-saved-card.selected { border-color:#2eaa68; background:rgba(46,170,104,.08); }
  .df-saved-text { font-size:12px; font-weight:300; color:#444450; flex:1; line-height:1.6; }
  .df-saved-name { font-weight:400; color:#181820; }
  .df-saved-use { font-family:'Jost',sans-serif; font-size:9px; font-weight:400; letter-spacing:.16em; text-transform:uppercase; color:#2eaa68; background:none; border:none; cursor:pointer; white-space:nowrap; padding:0; }
  .df-saved-del { font-size:11px; color:#c0c0d0; background:none; border:none; cursor:pointer; padding:0; margin-left:4px; }
  .df-saved-del:hover { color:#E8405A; }
  .df-or-divider { text-align:center; font-size:10px; color:#9898a8; letter-spacing:.14em; text-transform:uppercase; margin:12px 0 16px; }

  /* Shipping */
  .df-ship-opts { display:flex; flex-direction:column; gap:8px; margin-bottom:24px; }
  .df-ship-opt { display:flex; align-items:center; gap:14px; padding:14px 16px; border:1.5px solid rgba(0,0,0,0.08); border-radius:3px; cursor:pointer; transition:all .2s; background:#fafafa; }
  .df-ship-opt:hover { border-color:#9898a8; }
  .df-ship-opt.sel { border-color:#E8405A; background:#fde8f0; }
  .df-ship-radio { width:16px; height:16px; border-radius:50%; border:1.5px solid rgba(0,0,0,0.08); flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:border-color .18s; }
  .df-ship-opt.sel .df-ship-radio { border-color:#E8405A; }
  .df-ship-radio::after { content:''; width:8px; height:8px; border-radius:50%; background:#E8405A; opacity:0; transition:opacity .18s; }
  .df-ship-opt.sel .df-ship-radio::after { opacity:1; }
  .df-ship-info { flex:1; }
  .df-ship-label { font-size:12px; font-weight:400; color:#181820; }
  .df-ship-days  { font-size:10px; font-weight:300; color:#9898a8; margin-top:2px; }
  .df-ship-price { font-family:'Cormorant Garamond',serif; font-size:17px; font-weight:400; color:#181820; }
  .df-ship-price.free { color:#2eaa68; font-size:13px; font-family:'Jost',sans-serif; letter-spacing:.1em; }

  /* Nav */
  .df-nav { display:flex; gap:12px; margin-top:24px; }
  .df-btn-primary { font-family:'Jost',sans-serif; font-size:10px; font-weight:400; letter-spacing:.22em; text-transform:uppercase; padding:13px 28px; background:#181820; color:#fff; border:1.5px solid #181820; cursor:pointer; transition:all .25s; display:inline-flex; align-items:center; gap:8px; border-radius:3px; }
  .df-btn-primary:hover { background:#E8405A; border-color:#E8405A; }
  .df-btn-secondary { font-family:'Jost',sans-serif; font-size:10px; font-weight:300; letter-spacing:.2em; text-transform:uppercase; padding:13px 22px; background:transparent; color:#9898a8; border:1.5px solid rgba(0,0,0,0.08); cursor:pointer; transition:all .25s; border-radius:3px; }
  .df-btn-secondary:hover { border-color:#181820; color:#181820; }
`;

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