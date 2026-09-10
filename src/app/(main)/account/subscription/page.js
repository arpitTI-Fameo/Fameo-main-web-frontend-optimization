



// 'use client';
// // app/(main)/account/subscription/page.js
// // Account → Subscription. Membership + Payment info + payment history (invoices)
// // + Cancel. Robust against missing fields so the Cancel button and history always
// // render whenever the user actually has a paid membership.
 
// import { useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuthStore } from '@/store/authStore';
// import {
//   getCurrent as svcGetCurrent,
//   getInvoices as svcGetInvoices,
//   getInvoice as svcGetInvoice,
//   cancelSmart as svcCancelSmart,
//   setAutoRenew as svcSetAutoRenew,
//   SessionExpiredError,
// } from '@/services/subscription.service';
 
// // NOTE: subscription reads/writes now go through services/subscription.service.js,
// // which targets the WEB backend (fameo-server). That backend owns the Mongo
// // subscription record AND pushes every membership change to the app/products
// // backend (syncUserPlan → /users/sync-creator). So calling the web backend here
// // keeps web and app in sync automatically — no direct app-backend call needed.
 
// const PLAN_COLORS = { free:'#9898a8', pro:'#7c9ec9', popular:'#d4a0c0', elite:'#e8457a' };
// const PLAN_ICONS  = { free:'○', pro:'✦', popular:'◈', elite:'★' };
 
// const fmtINR   = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
// const fmtDate  = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }) : '—';
// const fmtShort = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—';
 
// const S = `
//   @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Jost:wght@200;300;400;500&display=swap');
//   .sb-page { max-width:760px; margin:0 auto; padding:56px 24px 96px; font-family:'Jost',sans-serif; color:#181820; }
//   .sb-h { font-family:'Cormorant Garamond',serif; font-size:clamp(28px,4vw,42px); font-weight:300; margin-bottom:4px; }
//   .sb-h em { font-style:italic; color:#e8457a; }
//   .sb-sub { font-size:11px; font-weight:300; letter-spacing:.22em; text-transform:uppercase; color:#9898a8; margin-bottom:36px; }
 
//   .sb-label { font-size:14px; font-weight:300; color:#6a6a78; margin:0 0 10px 2px; }
//   .sb-card { border:1px solid rgba(0,0,0,.12); border-radius:6px; background:#fff; margin-bottom:30px; overflow:hidden; }
 
//   .sb-plan { padding:22px 24px; display:flex; align-items:center; gap:14px; }
//   .sb-plan-ico { font-size:26px; line-height:1; }
//   .sb-plan-name { font-size:19px; font-weight:500; line-height:1.2; }
//   .sb-plan-desc { font-size:13.5px; font-weight:300; color:#6a6a78; margin-top:3px; }
//   .sb-badge { margin-left:auto; font-size:9px; font-weight:400; letter-spacing:.16em; text-transform:uppercase; padding:5px 11px; border-radius:20px; white-space:nowrap; }
//   .sb-badge.on  { background:#e8f8f0; color:#2eaa68; }
//   .sb-badge.off { background:#fdeef3; color:#e8457a; }
 
//   .sb-row { display:flex; align-items:center; justify-content:space-between; gap:14px;
//             padding:18px 24px; border-top:1px solid rgba(0,0,0,.09);
//             font-size:15px; font-weight:400; background:none;
//             border-left:none; border-right:none; border-bottom:none;
//             width:100%; text-align:left; font-family:'Jost',sans-serif; color:#181820; }
//   button.sb-row { cursor:pointer; transition:background .15s; }
//   button.sb-row:hover { background:#faf8f9; }
//   .sb-row .chev { color:#9898a8; font-size:17px; line-height:1; flex-shrink:0; }
//   .sb-row.static { cursor:default; }
 
//   .sb-next { padding:22px 24px; }
//   .sb-next-t { font-size:16px; font-weight:500; margin-bottom:6px; }
//   .sb-next-d { font-size:14.5px; font-weight:300; color:#3a3a44; }
//   .sb-pay-line { display:flex; align-items:center; gap:10px; margin-top:12px; flex-wrap:wrap; }
//   .sb-brand { font-size:10px; font-weight:500; letter-spacing:.08em; color:#1a1f71; background:#eef1fb; border:1px solid #d8def5; border-radius:3px; padding:3px 7px; }
//   .sb-mask { font-size:14px; font-weight:400; letter-spacing:.04em; color:#3a3a44; }
//   .sb-muted { font-size:13px; font-weight:300; color:#9898a8; }
 
//   .sb-inv-wrap { border-top:1px solid rgba(0,0,0,.09); background:#fbfbfc; }
//   .sb-inv { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:15px 24px; border-bottom:1px solid rgba(0,0,0,.05); }
//   .sb-inv:last-child { border-bottom:none; }
//   .sb-inv-l .d { font-size:14px; font-weight:400; }
//   .sb-inv-l .n { font-size:11px; font-weight:300; color:#9898a8; margin-top:2px; letter-spacing:.03em; }
//   .sb-inv-r { display:flex; align-items:center; gap:14px; flex-shrink:0; }
//   .sb-inv-amt { font-size:14px; font-weight:400; }
//   .sb-inv-st { font-size:9px; font-weight:400; letter-spacing:.12em; text-transform:uppercase; padding:3px 8px; border-radius:14px; background:#e8f8f0; color:#2eaa68; }
//   .sb-inv-st.bad { background:#fdeef3; color:#e8457a; }
//   .sb-inv-btn { font-size:10px; font-weight:400; letter-spacing:.14em; text-transform:uppercase; color:#e8457a; background:none; border:none; cursor:pointer; padding:0; font-family:'Jost',sans-serif; }
//   .sb-inv-btn:hover { text-decoration:underline; }
//   .sb-inv-empty { padding:22px 24px; font-size:13.5px; font-weight:300; color:#9898a8; }
 
//   .sb-cancel { width:100%; padding:18px; border:1px solid rgba(0,0,0,.12); border-radius:6px; background:#fff;
//                font-family:'Jost',sans-serif; font-size:15px; font-weight:400; color:#d0304f; cursor:pointer; transition:background .15s; }
//   .sb-cancel:hover { background:#fdf3f5; }
//   .sb-autorenew { display:flex; align-items:center; gap:16px; padding:18px 24px; border:1px solid rgba(0,0,0,.12);
//                   border-radius:6px; background:#fff; margin-bottom:16px; }
//   .sb-autorenew-txt { flex:1; min-width:0; }
//   .sb-autorenew-ttl { font-size:15px; font-weight:400; color:#181820; }
//   .sb-autorenew-sub { font-size:12.5px; font-weight:300; color:#6a6a78; margin-top:3px; line-height:1.4; }
//   .sb-switch { flex:none; width:46px; height:26px; border-radius:20px; border:none; cursor:pointer; padding:0;
//                background:#d8d8e0; position:relative; transition:background .2s; }
//   .sb-switch.on { background:#2eaa68; }
//   .sb-switch:disabled { opacity:.55; cursor:default; }
//   .sb-switch-knob { position:absolute; top:3px; left:3px; width:20px; height:20px; border-radius:50%;
//                     background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.3); transition:transform .2s; }
//   .sb-switch.on .sb-switch-knob { transform:translateX(20px); }
 
//   .sb-empty { text-align:center; padding:44px 24px; border:1px dashed rgba(0,0,0,.14); border-radius:6px; margin-bottom:30px; }
//   .sb-empty p { font-size:14px; font-weight:300; color:#9898a8; margin-bottom:16px; }
 
//   .btn { padding:11px 20px; border:1.5px solid; font-family:'Jost',sans-serif; font-size:10px; font-weight:400;
//          letter-spacing:.18em; text-transform:uppercase; cursor:pointer; border-radius:3px; background:transparent; transition:all .2s; }
//   .btn-dark { background:#181820; color:#fff; border-color:#181820; }
//   .btn-dark:hover { background:#e8457a; border-color:#e8457a; }
//   .btn-ghost { color:#181820; border-color:rgba(0,0,0,.16); }
//   .btn-ghost:hover { border-color:#181820; }
//   .btn-danger { color:#e8457a; border-color:rgba(232,69,122,.4); }
//   .btn-danger:hover { background:#e8457a; color:#fff; border-color:#e8457a; }
//   .btn:disabled { opacity:.5; cursor:not-allowed; }
 
//   .modal-bg { position:fixed; inset:0; background:rgba(20,20,28,.55); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; }
//   .modal { background:#fff; border-radius:8px; max-width:440px; width:100%; padding:30px; }
//   .modal h3 { font-family:'Cormorant Garamond',serif; font-size:25px; font-weight:400; margin-bottom:8px; }
//   .modal p { font-size:13.5px; font-weight:300; color:#6a6a78; line-height:1.65; margin-bottom:22px; }
//   .modal-row { display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap; }
 
//   .msg-err { padding:12px 16px; background:rgba(232,69,122,.06); border:1px solid rgba(232,69,122,.18); border-radius:4px; font-size:13.5px; color:#e8457a; margin-bottom:20px; }
//   .msg-ok  { padding:12px 16px; background:#e8f8f0; border:1px solid #b0e8cc; border-radius:4px; font-size:13.5px; color:#2eaa68; margin-bottom:20px; }
//   .loading { text-align:center; padding:60px; color:#9898a8; font-weight:300; }
 
//   @media(max-width:520px){
//     .sb-inv { flex-direction:column; align-items:flex-start; gap:8px; }
//     .sb-inv-r { width:100%; justify-content:space-between; }
//   }
// `;
 
// export default function SubscriptionPage() {
//   const router = useRouter();
//   const { token, updateMembership, logout } = useAuthStore();
 
//   const [sub,      setSub]      = useState(null);
//   const [invoices, setInvoices] = useState([]);
//   const [loading,  setLoading]  = useState(true);
//   const [error,    setError]    = useState('');
//   const [success,  setSuccess]  = useState('');
//   const [showCancel,  setShowCancel]  = useState(false);
//   const [cancelling,  setCancelling]  = useState(false);
//   const [autoRenewBusy, setAutoRenewBusy] = useState(false);
//   const [showHistory, setShowHistory] = useState(false);
 
//   const load = useCallback(async () => {
//     if (!token) { router.push('/login?redirect=/account/subscription'); return; }
//     setLoading(true);
//     try {
//       // Both come from the web backend (fameo-server). It owns the Mongo record
//       // and pushes every change to the app, so reading here is the synced truth.
//       const [current, invoiceList] = await Promise.all([
//         svcGetCurrent(),
//         svcGetInvoices().catch(() => []),
//       ]);
//       setSub(current || null);
//       setInvoices(Array.isArray(invoiceList) ? invoiceList : []);
//     } catch (e) {
//       if (e instanceof SessionExpiredError) {
//         logout();
//         router.push('/login?reason=session_expired&redirect=/account/subscription');
//         return;
//       }
//       setError('Could not load your subscription. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }, [token]);
 
//   useEffect(() => { load(); }, [load]);
 
//   const handleCancel = async (atCycleEnd) => {
//     setCancelling(true);
//     setError(''); setSuccess('');
//     try {
//       // Cancel via the shared backend. The app will see the cancellation on its
//       // next read. `cancel_reason` is optional per the collection; we pass a
//       // marker so the backend can distinguish immediate vs end-of-cycle intent.
//       // cancelSmart routes recurring subs to /subscribe/cancel (which stops the
//       // Razorpay auto-debit) and one-time subs to /cancel. Either way the web
//       // backend downgrades and pushes the change to the app.
//       const result = await svcCancelSmart({
//         subscription: sub,
//         atCycleEnd,
//         reason: atCycleEnd ? 'cancel_at_cycle_end' : 'cancel_immediately',
//       });
 
//       if (!atCycleEnd) updateMembership('free');
//       setSuccess(result?.message || 'Your subscription has been cancelled.');
//       setShowCancel(false);
//       await load();
//     } catch (e) {
//       if (e instanceof SessionExpiredError) {
//         logout();
//         router.push('/login?reason=session_expired&redirect=/account/subscription');
//         return;
//       }
//       setError(e.message);
//     } finally {
//       setCancelling(false);
//     }
//   };
 
//   // Toggle auto-renew on the shared backend. Reflected in the app on its next read.
//   const handleAutoRenew = async (nextValue) => {
//     setError(''); setSuccess('');
//     const isRecurring = sub?.isRecurring === true || !!sub?.razorpaySubscriptionId;
 
//     // For a recurring (auto-debit) sub, turning auto-renew OFF must actually
//     // stop the Razorpay mandate — a flag flip alone would keep charging. So we
//     // route "off" through cancel-at-cycle-end. Turning it back ON isn't possible
//     // once the mandate is cancelled, so we guide the user to re-subscribe.
//     if (isRecurring && nextValue === false) {
//       setShowCancel(true); // reuse the cancel confirmation (it offers end-of-cycle)
//       return;
//     }
//     if (isRecurring && nextValue === true) {
//       setError('To re-enable auto-debit, please start a new subscription.');
//       return;
//     }
 
//     setAutoRenewBusy(true);
//     setSub(prev => prev ? { ...prev, autoRenew: nextValue, auto_renew: nextValue } : prev);
//     try {
//       await svcSetAutoRenew({ autoRenew: nextValue });
//       setSuccess(nextValue ? 'Auto-renew turned on.' : 'Auto-renew turned off.');
//       await load();
//     } catch (e) {
//       setSub(prev => prev ? { ...prev, autoRenew: !nextValue, auto_renew: !nextValue } : prev);
//       if (e instanceof SessionExpiredError) {
//         logout();
//         router.push('/login?reason=session_expired&redirect=/account/subscription');
//         return;
//       }
//       setError(e.message);
//     } finally {
//       setAutoRenewBusy(false);
//     }
//   };
 
//   const openInvoice = async (id) => {
//     try {
//       const invoice = await svcGetInvoice(id);
//       printInvoice(invoice);
//     } catch (e) {
//       if (e instanceof SessionExpiredError) {
//         logout();
//         router.push('/login?reason=session_expired&redirect=/account/subscription');
//         return;
//       }
//       setError(e.message);
//     }
//   };
 
//   if (loading) {
//     return (
//       <>
//         <style>{S}</style>
//         <div className="sb-page"><div className="loading">◈ Loading your subscription…</div></div>
//       </>
//     );
//   }
 
//   // Robust active detection: treat as active if the backend flags it active, OR
//   // there's a subscription id / paid tier present. Prevents the whole card
//   // (and Cancel + history) from disappearing on a slightly different shape.
//   const hasPaidTier = sub?.membershipType && sub.membershipType !== 'free';
//   const isActive  = Boolean((sub?.active || sub?.subscriptionId || sub?.razorpaySubscriptionId) && hasPaidTier);
//   const tier      = sub?.membershipType || 'free';
//   const recurring = sub?.isRecurring !== false;
//   const willEnd   = sub?.autoRenew === false;
//   const nextDate  = sub?.nextChargeAt || sub?.expiresAt;
//   const months    = sub?.durationMonths || 1;
 
//   return (
//     <>
//       <style>{S}</style>
//       <div className="sb-page">
//         <h1 className="sb-h">My <em>Subscription</em></h1>
//         <p className="sb-sub">Membership · Billing · Invoices</p>
 
//         {error   && <div className="msg-err">⚠ {error}</div>}
//         {success && <div className="msg-ok">✓ {success}</div>}
 
//         {!isActive ? (
//           <>
//             <div className="sb-empty">
//               <p>You don’t have an active membership.</p>
//               <button className="btn btn-dark" onClick={() => router.push('/plans')}>Browse plans</button>
//             </div>
 
//             {/* Show past invoices even when not currently subscribed. */}
//             <div className="sb-label">Payment history</div>
//             <div className="sb-card">
//               {invoices.length === 0 ? (
//                 <div className="sb-inv-empty">No invoices yet.</div>
//               ) : (
//                 <div className="sb-inv-wrap" style={{ borderTop:'none' }}>
//                   {invoices.map((inv) => (
//                     <div className="sb-inv" key={inv.id}>
//                       <div className="sb-inv-l">
//                         <div className="d">{fmtShort(inv.paidAt)} · {inv.planName}</div>
//                         <div className="n">{inv.invoiceNumber}{inv.billingPeriod ? ` · ${inv.billingPeriod}` : ''}</div>
//                       </div>
//                       <div className="sb-inv-r">
//                         <span className="sb-inv-amt">{fmtINR(inv.amount)}</span>
//                         <span className={`sb-inv-st ${inv.status !== 'paid' ? 'bad' : ''}`}>{inv.status}</span>
//                         <button className="sb-inv-btn" onClick={() => openInvoice(inv.id)}>Invoice</button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           <>
//             {/* ── Membership ────────────────────────────────── */}
//             <div className="sb-label">Membership</div>
//             <div className="sb-card">
//               <div className="sb-plan">
//                 <span className="sb-plan-ico" style={{ color: PLAN_COLORS[tier] }}>{PLAN_ICONS[tier]}</span>
//                 <div>
//                   <div className="sb-plan-name">{sub.planName || tier} plan</div>
//                   <div className="sb-plan-desc">
//                     {recurring
//                       ? `Billed automatically every ${months} month${months > 1 ? 's' : ''}.`
//                       : 'One-time payment. No automatic renewal.'}
//                   </div>
//                 </div>
//                 <span className={`sb-badge ${willEnd ? 'off' : 'on'}`}>
//                   {willEnd ? 'Ends soon' : 'Active'}
//                 </span>
//               </div>
//               <button className="sb-row" onClick={() => router.push('/plans')}>
//                 <span>Change plan</span>
//                 <span className="chev">›</span>
//               </button>
//             </div>
 
//             {/* ── Payment info ──────────────────────────────── */}
//             <div className="sb-label">Payment info</div>
//             <div className="sb-card">
//               <div className="sb-next">
//                 <div className="sb-next-t">
//                   {willEnd ? 'Access until' : (recurring ? 'Next payment' : 'Expires')}
//                 </div>
//                 <div className="sb-next-d">{fmtDate(nextDate)}</div>
 
//                 {!willEnd && recurring && (
//                   <div className="sb-pay-line">
//                     <span className="sb-brand">RAZORPAY</span>
//                     <span className="sb-mask">Auto-debit · {fmtINR(sub.amountPaid)}</span>
//                   </div>
//                 )}
//                 {willEnd && (
//                   <div className="sb-muted" style={{ marginTop:10 }}>
//                     Auto-debit is off. You won’t be charged again.
//                   </div>
//                 )}
//               </div>
 
//               <div className="sb-row static">
//                 <span>Payment method</span>
//                 <span className="sb-muted">Managed by Razorpay</span>
//               </div>
 
//               <button className="sb-row" onClick={() => setShowHistory(v => !v)}>
//                 <span>View payment history</span>
//                 <span className="chev">{showHistory ? '⌃' : '›'}</span>
//               </button>
 
//               {showHistory && (
//                 <div className="sb-inv-wrap">
//                   {invoices.length === 0 ? (
//                     <div className="sb-inv-empty">No invoices yet. They’ll appear here after each payment.</div>
//                   ) : (
//                     invoices.map((inv) => (
//                       <div className="sb-inv" key={inv.id}>
//                         <div className="sb-inv-l">
//                           <div className="d">{fmtShort(inv.paidAt)} · {inv.planName}</div>
//                           <div className="n">
//                             {inv.invoiceNumber}{inv.billingPeriod ? ` · ${inv.billingPeriod}` : ''}
//                           </div>
//                         </div>
//                         <div className="sb-inv-r">
//                           <span className="sb-inv-amt">{fmtINR(inv.amount)}</span>
//                           <span className={`sb-inv-st ${inv.status !== 'paid' ? 'bad' : ''}`}>{inv.status}</span>
//                           <button className="sb-inv-btn" onClick={() => openInvoice(inv.id)}>Invoice</button>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               )}
//             </div>
 
//             {/* ── Auto-renew toggle (syncs to the app via the shared API) ── */}
//             <div className="sb-autorenew">
//               <div className="sb-autorenew-txt">
//                 <div className="sb-autorenew-ttl">Auto-renew</div>
//                 <div className="sb-autorenew-sub">
//                   {willEnd
//                     ? 'Off — your membership ends at the end of the current period.'
//                     : 'On — your membership renews automatically.'}
//                 </div>
//               </div>
//               <button
//                 type="button"
//                 role="switch"
//                 aria-checked={!willEnd}
//                 className={`sb-switch${!willEnd ? ' on' : ''}`}
//                 disabled={autoRenewBusy}
//                 onClick={() => handleAutoRenew(willEnd)}
//               >
//                 <span className="sb-switch-knob" />
//               </button>
//             </div>
 
//             {/* ── Cancel (always available while active) ────── */}
//             <button className="sb-cancel" onClick={() => setShowCancel(true)}>
//               {willEnd ? 'End membership now' : 'Cancel Membership'}
//             </button>
//           </>
//         )}
//       </div>
 
//       {/* Cancel confirmation modal */}
//       {showCancel && (
//         <div className="modal-bg" onClick={() => !cancelling && setShowCancel(false)}>
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <h3>{willEnd ? 'End membership now?' : 'Cancel membership?'}</h3>
//             <p>
//               {willEnd
//                 ? 'Your membership is already set to stop at the end of the current cycle. You can end it immediately and lose access now.'
//                 : 'You can stop future auto-debits at the end of the current billing cycle (keep access until then), or cancel immediately and lose access now.'}
//             </p>
//             <div className="modal-row">
//               <button className="btn btn-ghost" disabled={cancelling} onClick={() => setShowCancel(false)}>
//                 {willEnd ? 'Keep access' : 'Keep plan'}
//               </button>
//               {!willEnd && (
//                 <button className="btn btn-ghost" disabled={cancelling} onClick={() => handleCancel(true)}>At cycle end</button>
//               )}
//               <button className="btn btn-danger" disabled={cancelling} onClick={() => handleCancel(false)}>
//                 {cancelling ? 'Cancelling…' : (willEnd ? 'End now' : 'Cancel now')}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
 
// // Opens a clean printable invoice in a new window.
// function printInvoice(inv) {
//   const fmtINR  = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
//   const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—';
//   const w = window.open('', '_blank', 'width=760,height=900');
//   if (!w) return;
//   w.document.write(`
//     <html><head><title>${inv.invoiceNumber}</title>
//     <style>
//       *{box-sizing:border-box;margin:0;padding:0;}
//       body{font-family:'Jost',Arial,sans-serif;color:#181820;padding:48px;max-width:720px;margin:0 auto;}
//       .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #181820;padding-bottom:20px;margin-bottom:28px;}
//       .brand{font-size:30px;font-weight:700;letter-spacing:2px;color:#e8457a;}
//       .meta{text-align:right;font-size:12px;color:#6a6a78;line-height:1.7;}
//       .meta b{color:#181820;}
//       .row{display:flex;justify-content:space-between;gap:40px;margin-bottom:28px;}
//       .blk h4{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#9898a8;margin-bottom:6px;}
//       .blk p{font-size:13px;line-height:1.6;}
//       table{width:100%;border-collapse:collapse;margin:24px 0;}
//       th{text-align:left;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#9898a8;padding:10px 8px;border-bottom:1px solid #ddd;}
//       td{font-size:13px;padding:14px 8px;border-bottom:1px solid #eee;}
//       .total{text-align:right;font-size:20px;font-weight:600;margin-top:12px;}
//       .paid{display:inline-block;margin-top:8px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#2eaa68;border:1px solid #2eaa68;padding:4px 12px;border-radius:20px;}
//       .foot{margin-top:40px;font-size:11px;color:#9898a8;border-top:1px solid #eee;padding-top:16px;text-align:center;}
//       @media print{.noprint{display:none;}}
//       .noprint{margin-top:30px;text-align:center;}
//       .pbtn{padding:10px 24px;background:#181820;color:#fff;border:none;border-radius:3px;cursor:pointer;letter-spacing:.1em;text-transform:uppercase;font-size:11px;}
//     </style></head><body>
//       <div class="top">
//         <div><div class="brand">FAMEO</div><div style="font-size:11px;color:#9898a8;margin-top:4px;">Tax Invoice</div></div>
//         <div class="meta">
//           <div><b>${inv.invoiceNumber}</b></div>
//           <div>Date: ${fmtDate(inv.paidAt)}</div>
//           ${inv.paymentId ? `<div>Payment: ${inv.paymentId}</div>` : ''}
//         </div>
//       </div>
//       <div class="row">
//         <div class="blk"><h4>Billed To</h4>
//           <p>${inv.billedTo?.name || '—'}<br>${inv.billedTo?.email || ''}<br>${inv.billedTo?.phone || ''}</p>
//         </div>
//         <div class="blk" style="text-align:right;"><h4>From</h4>
//           <p>${inv.seller?.name || 'Fameo'}<br>${inv.seller?.support || ''}</p>
//         </div>
//       </div>
//       <table>
//         <thead><tr><th>Description</th><th>Period</th><th style="text-align:right;">Amount</th></tr></thead>
//         <tbody>
//           <tr>
//             <td>${inv.planName} membership (${(inv.membershipType||'').toUpperCase()})</td>
//             <td>${fmtDate(inv.periodStart)} – ${fmtDate(inv.periodEnd)}${inv.billingPeriod ? `<br><span style="color:#9898a8;font-size:11px;">${inv.billingPeriod}</span>` : ''}</td>
//             <td style="text-align:right;">${fmtINR(inv.amount)}</td>
//           </tr>
//         </tbody>
//       </table>
//       <div class="total">Total: ${fmtINR(inv.amount)}</div>
//       <div style="text-align:right;"><span class="paid">${inv.status || 'paid'}</span></div>
//       <div class="foot">Thank you for being a Fameo member. This is a computer-generated invoice.</div>
//       <div class="noprint"><button class="pbtn" onclick="window.print()">Print / Save as PDF</button></div>
//     </body></html>
//   `);
//   w.document.close();
// }




 
'use client';
// app/(main)/account/subscription/page.js
// Account → Subscription. Membership + Payment info + payment history (invoices)
// + Cancel. Robust against missing fields so the Cancel button and history always
// render whenever the user actually has a paid membership.
 
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import {
  getCurrent as svcGetCurrent,
  getTransactions as svcGetTransactions,
  cancelSubscription as svcCancel,
  setAutoRenew as svcSetAutoRenew,
  SessionExpiredError,
} from '@/services/subscription.service';
 
// Subscriptions go through the web backend, which proxies to the central
// subscription API (shared with the app) and verifies Razorpay on writes.
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
 
const PLAN_COLORS = { free:'#9898a8', pro:'#7c9ec9', popular:'#d4a0c0', elite:'#e8457a' };
const PLAN_ICONS  = { free:'○', pro:'✦', popular:'◈', elite:'★' };
 
const fmtINR   = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const fmtDate  = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }) : '—';
const fmtShort = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—';
 
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Jost:wght@200;300;400;500&display=swap');
  .sb-page { max-width:760px; margin:0 auto; padding:56px 24px 96px; font-family:'Jost',sans-serif; color:#181820; }
  .sb-h { font-family:'Cormorant Garamond',serif; font-size:clamp(28px,4vw,42px); font-weight:300; margin-bottom:4px; }
  .sb-h em { font-style:italic; color:#e8457a; }
  .sb-sub { font-size:11px; font-weight:300; letter-spacing:.22em; text-transform:uppercase; color:#9898a8; margin-bottom:36px; }
 
  .sb-label { font-size:14px; font-weight:300; color:#6a6a78; margin:0 0 10px 2px; }
  .sb-card { border:1px solid rgba(0,0,0,.12); border-radius:6px; background:#fff; margin-bottom:30px; overflow:hidden; }
 
  .sb-plan { padding:22px 24px; display:flex; align-items:center; gap:14px; }
  .sb-plan-ico { font-size:26px; line-height:1; }
  .sb-plan-name { font-size:19px; font-weight:500; line-height:1.2; }
  .sb-plan-desc { font-size:13.5px; font-weight:300; color:#6a6a78; margin-top:3px; }
  .sb-badge { margin-left:auto; font-size:9px; font-weight:400; letter-spacing:.16em; text-transform:uppercase; padding:5px 11px; border-radius:20px; white-space:nowrap; }
  .sb-badge.on  { background:#e8f8f0; color:#2eaa68; }
  .sb-badge.off { background:#fdeef3; color:#e8457a; }
 
  .sb-row { display:flex; align-items:center; justify-content:space-between; gap:14px;
            padding:18px 24px; border-top:1px solid rgba(0,0,0,.09);
            font-size:15px; font-weight:400; background:none;
            border-left:none; border-right:none; border-bottom:none;
            width:100%; text-align:left; font-family:'Jost',sans-serif; color:#181820; }
  button.sb-row { cursor:pointer; transition:background .15s; }
  button.sb-row:hover { background:#faf8f9; }
  .sb-row .chev { color:#9898a8; font-size:17px; line-height:1; flex-shrink:0; }
  .sb-row.static { cursor:default; }
 
  .sb-next { padding:22px 24px; }
  .sb-next-t { font-size:16px; font-weight:500; margin-bottom:6px; }
  .sb-next-d { font-size:14.5px; font-weight:300; color:#3a3a44; }
  .sb-pay-line { display:flex; align-items:center; gap:10px; margin-top:12px; flex-wrap:wrap; }
  .sb-brand { font-size:10px; font-weight:500; letter-spacing:.08em; color:#1a1f71; background:#eef1fb; border:1px solid #d8def5; border-radius:3px; padding:3px 7px; }
  .sb-mask { font-size:14px; font-weight:400; letter-spacing:.04em; color:#3a3a44; }
  .sb-muted { font-size:13px; font-weight:300; color:#9898a8; }
 
  .sb-inv-wrap { border-top:1px solid rgba(0,0,0,.09); background:#fbfbfc; }
  .sb-inv { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:15px 24px; border-bottom:1px solid rgba(0,0,0,.05); }
  .sb-inv:last-child { border-bottom:none; }
  .sb-inv-l .d { font-size:14px; font-weight:400; }
  .sb-inv-l .n { font-size:11px; font-weight:300; color:#9898a8; margin-top:2px; letter-spacing:.03em; }
  .sb-inv-r { display:flex; align-items:center; gap:14px; flex-shrink:0; }
  .sb-inv-amt { font-size:14px; font-weight:400; }
  .sb-inv-st { font-size:9px; font-weight:400; letter-spacing:.12em; text-transform:uppercase; padding:3px 8px; border-radius:14px; background:#e8f8f0; color:#2eaa68; }
  .sb-inv-st.bad { background:#fdeef3; color:#e8457a; }
  .sb-inv-btn { font-size:10px; font-weight:400; letter-spacing:.14em; text-transform:uppercase; color:#e8457a; background:none; border:none; cursor:pointer; padding:0; font-family:'Jost',sans-serif; }
  .sb-inv-btn:hover { text-decoration:underline; }
  .sb-inv-empty { padding:22px 24px; font-size:13.5px; font-weight:300; color:#9898a8; }
 
  .sb-cancel { width:100%; padding:18px; border:1px solid rgba(0,0,0,.12); border-radius:6px; background:#fff;
               font-family:'Jost',sans-serif; font-size:15px; font-weight:400; color:#d0304f; cursor:pointer; transition:background .15s; }
  .sb-cancel:hover { background:#fdf3f5; }
  .sb-resume { width:100%; padding:18px; border:1px solid rgba(46,170,104,.4); border-radius:6px; background:#f2fbf6;
               font-family:'Jost',sans-serif; font-size:15px; font-weight:500; color:#1d7f4e; cursor:pointer; transition:background .15s; margin-bottom:14px; }
  .sb-resume:hover { background:#e7f7ee; }
  .sb-autorenew { display:flex; align-items:center; gap:16px; padding:18px 24px; border:1px solid rgba(0,0,0,.12);
                  border-radius:6px; background:#fff; margin-bottom:14px; }
  .sb-autorenew-txt { flex:1; min-width:0; }
  .sb-autorenew-ttl { font-size:15px; font-weight:400; color:#181820; }
  .sb-autorenew-sub { font-size:12.5px; font-weight:300; color:#6a6a78; margin-top:3px; line-height:1.45; }
  .sb-switch { flex:none; width:46px; height:26px; border-radius:20px; border:none; cursor:pointer; padding:0;
               background:#d8d8e0; position:relative; transition:background .2s; }
  .sb-switch.on { background:#2eaa68; }
  .sb-switch-knob { position:absolute; top:3px; left:3px; width:20px; height:20px; border-radius:50%;
                    background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.3); transition:transform .2s; }
  .sb-switch.on .sb-switch-knob { transform:translateX(20px); }
 
  .sb-empty { text-align:center; padding:44px 24px; border:1px dashed rgba(0,0,0,.14); border-radius:6px; margin-bottom:30px; }
  .sb-empty p { font-size:14px; font-weight:300; color:#9898a8; margin-bottom:16px; }
 
  .btn { padding:11px 20px; border:1.5px solid; font-family:'Jost',sans-serif; font-size:10px; font-weight:400;
         letter-spacing:.18em; text-transform:uppercase; cursor:pointer; border-radius:3px; background:transparent; transition:all .2s; }
  .btn-dark { background:#181820; color:#fff; border-color:#181820; }
  .btn-dark:hover { background:#e8457a; border-color:#e8457a; }
  .btn-ghost { color:#181820; border-color:rgba(0,0,0,.16); }
  .btn-ghost:hover { border-color:#181820; }
  .btn-danger { color:#e8457a; border-color:rgba(232,69,122,.4); }
  .btn-danger:hover { background:#e8457a; color:#fff; border-color:#e8457a; }
  .btn:disabled { opacity:.5; cursor:not-allowed; }
 
  .modal-bg { position:fixed; inset:0; background:rgba(20,20,28,.55); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; }
  .modal { background:#fff; border-radius:8px; max-width:440px; width:100%; padding:30px; }
  .modal h3 { font-family:'Cormorant Garamond',serif; font-size:25px; font-weight:400; margin-bottom:8px; }
  .modal p { font-size:13.5px; font-weight:300; color:#6a6a78; line-height:1.65; margin-bottom:22px; }
  .modal-row { display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap; }
 
  .msg-err { padding:12px 16px; background:rgba(232,69,122,.06); border:1px solid rgba(232,69,122,.18); border-radius:4px; font-size:13.5px; color:#e8457a; margin-bottom:20px; }
  .msg-ok  { padding:12px 16px; background:#e8f8f0; border:1px solid #b0e8cc; border-radius:4px; font-size:13.5px; color:#2eaa68; margin-bottom:20px; }
  .loading { text-align:center; padding:60px; color:#9898a8; font-weight:300; }
 
  @media(max-width:520px){
    .sb-inv { flex-direction:column; align-items:flex-start; gap:8px; }
    .sb-inv-r { width:100%; justify-content:space-between; }
  }
`;
 
export default function SubscriptionPage() {
  const router = useRouter();
  const { token, updateMembership, logout } = useAuthStore();
 
  const [sub,      setSub]      = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [showCancel,  setShowCancel]  = useState(false);
  const [cancelling,  setCancelling]  = useState(false);
  const [showHistory, setShowHistory] = useState(false);
 
  const authHeaders = { 'Content-Type':'application/json', Authorization:`Bearer ${token}` };
 
  const load = useCallback(async () => {
    if (!token) { router.push('/login?redirect=/account/subscription'); return; }
    setLoading(true);
    try {
      // Both come from the web backend → central API (the synced source of truth).
      const [current, txns] = await Promise.all([
        svcGetCurrent(),
        svcGetTransactions().catch(() => []),
      ]);
      setSub(current || null);
      setInvoices(Array.isArray(txns) ? txns : []);
    } catch (e) {
      if (e instanceof SessionExpiredError) {
        logout();
        router.push('/login?reason=session_expired&redirect=/account/subscription');
        return;
      }
      setError('Could not load your subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token]);
 
  useEffect(() => { load(); }, [load]);
  // Option 2 sync: /current reads live from the central store the app also
  // writes to, so re-fetching pulls any app-side change. Refresh when the user
  // returns to this tab or refocuses the window, so an already-open page updates
  // after they change their plan in the app.
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === 'visible') load(); };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [load]);
 
  const handleCancel = async () => {
    setCancelling(true);
    setError(''); setSuccess('');
    try {
      // This backend cancel takes { cancel_reason }; it downgrades and syncs
      // the change to the app.
      const result = await svcCancel({ subscriptionId: sub?.subscription_id ?? sub?.subscriptionId, reason: 'User cancelled from web' });
      updateMembership('free');
      setSuccess(result?.message || 'Subscription cancelled. You keep access until it expires.');
      setShowCancel(false);
      await load();
    } catch (e) {
      if (e instanceof SessionExpiredError) {
        logout();
        router.push('/login?reason=session_expired&redirect=/account/subscription');
        return;
      }
      setError(e.message);
    } finally {
      setCancelling(false);
    }
  };
 
  const handleAutoRenew = async (nextValue) => {
    setError(''); setSuccess('');
    setSub(prev => prev ? { ...prev, autoRenew: nextValue } : prev); // optimistic
    try {
      await svcSetAutoRenew({ subscriptionId: sub?.subscription_id ?? sub?.subscriptionId, autoRenew: nextValue });
      setSuccess(nextValue ? 'Auto-renew turned on.' : 'Auto-renew turned off.');
      await load();
    } catch (e) {
      setSub(prev => prev ? { ...prev, autoRenew: !nextValue } : prev);
      if (e instanceof SessionExpiredError) {
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
  const subId     = sub?.subscription_id ?? sub?.subscriptionId ?? null;
  const planCode  = (sub?.plan?.plan_code || sub?.membershipType || sub?.planCode || 'free').toLowerCase();
  const planLabel = sub?.plan?.plan_name || sub?.planName || planCode;
  const hasPaidTier = planCode && planCode !== 'free' && subId !== 'free';
  const cancelled = sub?.is_cancelled === true || sub?.status === 'cancelled';
  const daysLeft   = sub?.days_remaining ?? null;
  // A cancelled subscription still grants access until it expires. So "active"
  // means: a paid plan that hasn't expired yet — NOT status === 'active' only.
  // (status is 'cancelled' the moment they cancel, but access continues.)
  const notExpired = daysLeft == null ? true : Number(daysLeft) > 0;
  const isActive  = Boolean(
    hasPaidTier &&
    (sub?.status === 'active' || cancelled ? notExpired : (sub?.active ?? true))
  );
  const tier      = planCode;
  const recurring = false;
  const willEnd   = cancelled || sub?.auto_renew === false || sub?.autoRenew === false;
  const nextDate  = sub?.expires_at || sub?.expiresAt || sub?.nextChargeAt;
  const months    = sub?.billing_duration_months || sub?.durationMonths || 1;
  const amountPaid = sub?.amount_paid ?? sub?.amountPaid ?? 0;
 
  return (
    <>
      <style>{S}</style>
      <div className="sb-page">
        <h1 className="sb-h">My <em>Subscription</em></h1>
        <p className="sb-sub">Membership · Billing · Invoices</p>
 
        {error   && <div className="msg-err">⚠ {error}</div>}
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
                <div className="sb-inv-wrap" style={{ borderTop:'none' }}>
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
                  <div className="sb-muted" style={{ marginTop:10 }}>
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
 
// Opens a clean printable invoice in a new window.
function printInvoice(inv) {
  const fmtINR  = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—';
  const w = window.open('', '_blank', 'width=760,height=900');
  if (!w) return;
  w.document.write(`
    <html><head><title>${inv.invoiceNumber}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Jost',Arial,sans-serif;color:#181820;padding:48px;max-width:720px;margin:0 auto;}
      .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #181820;padding-bottom:20px;margin-bottom:28px;}
      .brand{font-size:30px;font-weight:700;letter-spacing:2px;color:#e8457a;}
      .meta{text-align:right;font-size:12px;color:#6a6a78;line-height:1.7;}
      .meta b{color:#181820;}
      .row{display:flex;justify-content:space-between;gap:40px;margin-bottom:28px;}
      .blk h4{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#9898a8;margin-bottom:6px;}
      .blk p{font-size:13px;line-height:1.6;}
      table{width:100%;border-collapse:collapse;margin:24px 0;}
      th{text-align:left;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#9898a8;padding:10px 8px;border-bottom:1px solid #ddd;}
      td{font-size:13px;padding:14px 8px;border-bottom:1px solid #eee;}
      .total{text-align:right;font-size:20px;font-weight:600;margin-top:12px;}
      .paid{display:inline-block;margin-top:8px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#2eaa68;border:1px solid #2eaa68;padding:4px 12px;border-radius:20px;}
      .foot{margin-top:40px;font-size:11px;color:#9898a8;border-top:1px solid #eee;padding-top:16px;text-align:center;}
      @media print{.noprint{display:none;}}
      .noprint{margin-top:30px;text-align:center;}
      .pbtn{padding:10px 24px;background:#181820;color:#fff;border:none;border-radius:3px;cursor:pointer;letter-spacing:.1em;text-transform:uppercase;font-size:11px;}
    </style></head><body>
      <div class="top">
        <div><div class="brand">FAMEO</div><div style="font-size:11px;color:#9898a8;margin-top:4px;">Tax Invoice</div></div>
        <div class="meta">
          <div><b>${inv.invoiceNumber}</b></div>
          <div>Date: ${fmtDate(inv.paidAt)}</div>
          ${inv.paymentId ? `<div>Payment: ${inv.paymentId}</div>` : ''}
        </div>
      </div>
      <div class="row">
        <div class="blk"><h4>Billed To</h4>
          <p>${inv.billedTo?.name || '—'}<br>${inv.billedTo?.email || ''}<br>${inv.billedTo?.phone || ''}</p>
        </div>
        <div class="blk" style="text-align:right;"><h4>From</h4>
          <p>${inv.seller?.name || 'Fameo'}<br>${inv.seller?.support || ''}</p>
        </div>
      </div>
      <table>
        <thead><tr><th>Description</th><th>Period</th><th style="text-align:right;">Amount</th></tr></thead>
        <tbody>
          <tr>
            <td>${inv.planName} membership (${(inv.membershipType||'').toUpperCase()})</td>
            <td>${fmtDate(inv.periodStart)} – ${fmtDate(inv.periodEnd)}${inv.billingPeriod ? `<br><span style="color:#9898a8;font-size:11px;">${inv.billingPeriod}</span>` : ''}</td>
            <td style="text-align:right;">${fmtINR(inv.amount)}</td>
          </tr>
        </tbody>
      </table>
      <div class="total">Total: ${fmtINR(inv.amount)}</div>
      <div style="text-align:right;"><span class="paid">${inv.status || 'paid'}</span></div>
      <div class="foot">Thank you for being a Fameo member. This is a computer-generated invoice.</div>
      <div class="noprint"><button class="pbtn" onclick="window.print()">Print / Save as PDF</button></div>
    </body></html>
  `);
  w.document.close();
}