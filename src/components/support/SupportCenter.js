// 'use client';

// // components/support/SupportCenter.js
// // ─────────────────────────────────────────────────────────────────────────────
// // FAMEO — Support Center
// // A self-contained support page that lets users find answers (FAQ) and send a
// // support request via EmailJS (no backend required). Brand-matched to the Fameo
// // footer / policy design system.
// //
// // ▸ SET YOUR EmailJS KEYS BELOW (SUPPORT_CONFIG.emailjs). Until they are set,
// //   the form gracefully falls back to opening the user's mail app with a
// //   pre-filled message, so the page still works for support out of the box.
// // ─────────────────────────────────────────────────────────────────────────────

// import { useEffect, useRef, useState } from 'react';

// /* ════════════════════════════════════════════════════════════════════════════
//    CONFIG  — edit these values
//    ════════════════════════════════════════════════════════════════════════════ */
// const SUPPORT_CONFIG = {
//   // Get these from https://dashboard.emailjs.com  (Account ▸ API Keys / Email Services / Email Templates)
//   emailjs: {
//     publicKey:  'YOUR_PUBLIC_KEY',   // e.g. 'aB12cD34efGh56'
//     serviceId:  'service_dnbsvxt',   // e.g. 'service_xxxxxxx'
//     templateId: 'template_0j9tnzf',  // e.g. 'template_xxxxxxx'
//   },
//   // A REAL, monitored inbox. Apple checks that support actually reaches someone.
//   supportEmail: 'support@fameo.info',
//   responseTime: 'within 24 hours',
//   supportHours: 'Mon–Sat · 10:00–19:00 IST',
//   appName:      'Fameo',
// };

// const CATEGORIES = [
//   'Account & Login',
//   'Payments & Orders',
//   'Courses & Resources',
//   'Community',
//   'Verification',
//   'Report a problem',
//   'Other',
// ];

// const FAQS = [
//   {
//     q: 'I didn’t receive my login OTP. What should I do?',
//     a: 'OTPs can take up to a minute to arrive. Check your spam/promotions folder and confirm the phone number or email on your account is correct. If it still doesn’t arrive, request a new code after 60 seconds, or contact us using the form below and we’ll verify your account manually.',
//   },
//   {
//     q: 'How do I update my profile or account details?',
//     a: 'Open the app, go to Account ▸ Profile, and edit your name, photo, and contact details. Changes save instantly. If a field is locked (for example, a verified handle), send us a request and we’ll help.',
//   },
//   {
//     q: 'Where can I see my orders or purchases?',
//     a: 'Go to Account ▸ Orders to view your purchase history and order status. If a charge appears but your order isn’t showing, contact us with the order date and amount and we’ll trace it.',
//   },
//   {
//     q: 'A payment failed or I was charged twice.',
//     a: 'Failed payments are not captured and any pending hold is released by your bank, usually within 3–5 business days. If you see a duplicate charge, send us the transaction reference using the form below and we’ll investigate and refund any error promptly.',
//   },
//   {
//     q: 'How do I access the courses and resources I unlocked?',
//     a: 'Unlocked content lives under Resources in the app. If something you purchased isn’t appearing, log out and back in to refresh your library; if it’s still missing, reach out and include the course name.',
//   },
//   {
//     q: 'How does verification work?',
//     a: 'Fameo is a verified community. Verification confirms you’re a genuine creator, public figure, or professional. Submit your request in-app under Account ▸ Verification; our team reviews submissions and responds by email.',
//   },
//   {
//     q: 'How do I delete my account and data?',
//     a: 'You can request account deletion any time. Email us at the address below (or use the form and choose “Account & Login”) from your registered address with the subject “Delete my account”. We’ll permanently remove your account and associated personal data and confirm by email.',
//   },
//   {
//     q: 'How do I report a bug, abuse, or inappropriate content?',
//     a: 'Use the form below and choose “Report a problem”, or email us directly. Please include screenshots, the username or content involved, and the steps to reproduce so we can act quickly.',
//   },
// ];

// /* ════════════════════════════════════════════════════════════════════════════
//    COMPONENT
//    ════════════════════════════════════════════════════════════════════════════ */
// export default function SupportCenter() {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     category: CATEGORIES[0],
//     subject: '',
//     message: '',
//     website: '', // honeypot — leave empty
//   });
//   const [status, setStatus] = useState('idle'); // idle | sending | sent | error
//   const [errorMsg, setErrorMsg] = useState('');
//   const [openFaq, setOpenFaq] = useState(0);
//   const sdkReady = useRef(false);
//   const cardRef = useRef(null);

//   const { publicKey, serviceId, templateId } = SUPPORT_CONFIG.emailjs;
//   const emailjsConfigured =
//     publicKey && serviceId && templateId &&
//     !publicKey.startsWith('YOUR_') &&
//     !serviceId.startsWith('YOUR_') &&
//     !templateId.startsWith('YOUR_');

//   /* Load the EmailJS browser SDK from CDN (no npm install needed). */
//   useEffect(() => {
//     if (!emailjsConfigured) return;
//     if (typeof window === 'undefined') return;
//     if (window.emailjs) { sdkReady.current = true; return; }

//     const script = document.createElement('script');
//     script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
//     script.async = true;
//     script.onload = () => {
//       try { window.emailjs.init({ publicKey }); sdkReady.current = true; } catch (_) {}
//     };
//     document.body.appendChild(script);
//     return () => { /* leave the script cached for the session */ };
//   }, [emailjsConfigured, publicKey]);

//   const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

//   /* When a request is submitted, bring the confirmation into view. */
//   useEffect(() => {
//     if (status === 'sent' && cardRef.current) {
//       cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     }
//   }, [status]);

//   const buildMailto = () => {
//     const subject = `[${form.category}] ${form.subject || 'Support request'}`;
//     const body =
//       `Name: ${form.name}\n` +
//       `Email: ${form.email}\n` +
//       `Category: ${form.category}\n\n` +
//       `${form.message}`;
//     return `mailto:${SUPPORT_CONFIG.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
//   };

//   const validate = () => {
//     if (!form.name.trim()) return 'Please enter your name.';
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.';
//     if (!form.message.trim()) return 'Please describe how we can help.';
//     return '';
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (form.website) return; // honeypot tripped — silently ignore bots

//     const v = validate();
//     if (v) { setStatus('error'); setErrorMsg(v); return; }

//     // If EmailJS isn't configured yet, open the user's mail client as a fallback,
//     // then still show the "Request submitted" confirmation.
//     if (!emailjsConfigured || !window.emailjs) {
//       try { window.location.href = buildMailto(); } catch (_) {}
//       setForm({ name: '', email: '', category: CATEGORIES[0], subject: '', message: '', website: '' });
//       setStatus('sent');
//       return;
//     }

//     setStatus('sending');
//     setErrorMsg('');
//     try {
//       await window.emailjs.send(serviceId, templateId, {
//         from_name: form.name,
//         from_email: form.email,
//         reply_to: form.email,
//         category: form.category,
//         subject: form.subject || `${form.category} support request`,
//         message: form.message,
//         to_name: `${SUPPORT_CONFIG.appName} Support`,
//         time: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
//       }, { publicKey });
//       setStatus('sent');
//       setForm({ name: '', email: '', category: CATEGORIES[0], subject: '', message: '', website: '' });
//     } catch (err) {
//       setStatus('error');
//       setErrorMsg('We couldn’t send your message just now. Please email us directly at ' + SUPPORT_CONFIG.supportEmail + '.');
//     }
//   };

//   return (
//     <div className="sc-root">
//       <style>{S}</style>

//       {/* ambient atmosphere */}
//       <span className="sc-topline" aria-hidden />
//       <span className="sc-glow sc-glow1" aria-hidden />
//       <span className="sc-glow sc-glow2" aria-hidden />

//       <div className="sc-inner">

//         {/* ── HERO ───────────────────────────────────────────── */}
//         <header className="sc-hero">
//           <span className="sc-eyebrow">Support Center</span>
//           <h1 className="sc-h1">How can we help?</h1>
//           <p className="sc-lead">
//             Questions about your account, a payment, your courses, or the app?
//             Search the common answers below, or send us a message — a real person
//             on the {SUPPORT_CONFIG.appName} team will get back to you.
//           </p>

//           <div className="sc-hero-actions">
//             <a className="sc-btn-primary" href={`mailto:${SUPPORT_CONFIG.supportEmail}`}>
//               <MailIcon /> Email support
//             </a>
//             <a className="sc-btn-ghost" href="#contact-form">
//               Send a request
//             </a>
//           </div>
//         </header>

//         {/* ── CHANNELS ───────────────────────────────────────── */}
//         <section className="sc-channels" aria-label="Ways to reach support">
//           <div className="sc-channel">
//             <span className="sc-channel-icon"><MailIcon /></span>
//             <span className="sc-channel-label">Email us</span>
//             <a className="sc-channel-value" href={`mailto:${SUPPORT_CONFIG.supportEmail}`}>
//               {SUPPORT_CONFIG.supportEmail}
//             </a>
//           </div>
//           <div className="sc-channel">
//             <span className="sc-channel-icon"><ClockIcon /></span>
//             <span className="sc-channel-label">Typical response</span>
//             <span className="sc-channel-value">{SUPPORT_CONFIG.responseTime}</span>
//           </div>
//           <div className="sc-channel">
//             <span className="sc-channel-icon"><CalendarIcon /></span>
//             <span className="sc-channel-label">Support hours</span>
//             <span className="sc-channel-value">{SUPPORT_CONFIG.supportHours}</span>
//           </div>
//         </section>

//         {/* ── FORM (signature) ───────────────────────────────── */}
//         <section id="contact-form" className="sc-form-wrap" aria-label="Contact support">
//           <div className="sc-form-card" ref={cardRef}>
//             <span className="sc-card-topline" aria-hidden />
//             <div className="sc-form-head">
//               <span className="sc-eyebrow">Get in touch</span>
//               <h2 className="sc-h2">Send us a message</h2>
//               <p className="sc-form-sub">
//                 Tell us what’s going on. The more detail you share, the faster we can help.
//               </p>
//             </div>

//             {status === 'sent' ? (
//               <div className="sc-success" role="status">
//                 <span className="sc-success-tick"><CheckIcon /></span>
//                 <h3>Request submitted</h3>
//                 <p>
//                   Thanks — your support request has been submitted. We’ll reply to
//                   your email {SUPPORT_CONFIG.responseTime}. Please check your inbox
//                   (and your spam folder).
//                 </p>
//                 <button className="sc-btn-ghost" onClick={() => setStatus('idle')}>
//                   Submit another request
//                 </button>
//               </div>
//             ) : (
//               <form className="sc-form" onSubmit={handleSubmit} noValidate>
//                 {/* honeypot */}
//                 <input
//                   type="text"
//                   className="sc-hp"
//                   tabIndex={-1}
//                   autoComplete="off"
//                   value={form.website}
//                   onChange={update('website')}
//                   aria-hidden="true"
//                 />

//                 <div className="sc-row">
//                   <label className="sc-field">
//                     <span className="sc-label">Your name</span>
//                     <input
//                       type="text"
//                       value={form.name}
//                       onChange={update('name')}
//                       placeholder="Jane Creator"
//                       autoComplete="name"
//                       required
//                     />
//                   </label>
//                   <label className="sc-field">
//                     <span className="sc-label">Email address</span>
//                     <input
//                       type="email"
//                       value={form.email}
//                       onChange={update('email')}
//                       placeholder="you@email.com"
//                       autoComplete="email"
//                       required
//                     />
//                   </label>
//                 </div>

//                 <div className="sc-row">
//                   <label className="sc-field">
//                     <span className="sc-label">Topic</span>
//                     <div className="sc-select">
//                       <select value={form.category} onChange={update('category')}>
//                         {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
//                       </select>
//                       <ChevronIcon />
//                     </div>
//                   </label>
//                   <label className="sc-field">
//                     <span className="sc-label">Subject <span className="sc-opt">(optional)</span></span>
//                     <input
//                       type="text"
//                       value={form.subject}
//                       onChange={update('subject')}
//                       placeholder="Short summary"
//                     />
//                   </label>
//                 </div>

//                 <label className="sc-field">
//                   <span className="sc-label">How can we help?</span>
//                   <textarea
//                     rows={6}
//                     value={form.message}
//                     onChange={update('message')}
//                     placeholder="Describe your question or issue. Include any order IDs, usernames, or screenshots you can."
//                     required
//                   />
//                 </label>

//                 {status === 'error' && (
//                   <p className="sc-error" role="alert">{errorMsg}</p>
//                 )}

//                 <div className="sc-form-foot">
//                   <button className="sc-submit" type="submit" disabled={status === 'sending'}>
//                     {status === 'sending' ? 'Submitting…' : 'Submit request'}
//                   </button>
//                   <span className="sc-foot-note">
//                     Prefer email? Write to{' '}
//                     <a href={`mailto:${SUPPORT_CONFIG.supportEmail}`}>{SUPPORT_CONFIG.supportEmail}</a>
//                   </span>
//                 </div>
//               </form>
//             )}
//           </div>
//         </section>

//         {/* ── FAQ ────────────────────────────────────────────── */}
//         <section className="sc-faq" aria-label="Frequently asked questions">
//           <div className="sc-faq-head">
//             <span className="sc-eyebrow">Answers</span>
//             <h2 className="sc-h2">Frequently asked</h2>
//           </div>
//           <div className="sc-faq-list">
//             {FAQS.map((item, i) => {
//               const open = openFaq === i;
//               return (
//                 <div key={i} className={`sc-faq-item ${open ? 'open' : ''}`}>
//                   <button
//                     className="sc-faq-q"
//                     onClick={() => setOpenFaq(open ? -1 : i)}
//                     aria-expanded={open}
//                   >
//                     <span>{item.q}</span>
//                     <span className="sc-faq-mark" aria-hidden><PlusIcon /></span>
//                   </button>
//                   <div className="sc-faq-a" hidden={!open}>
//                     <p>{item.a}</p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>

//         {/* ── CLOSING ────────────────────────────────────────── */}
//         <section className="sc-closing">
//           <h2 className="sc-h2">Still need a hand?</h2>
//           <p>
//             We’re happy to help with anything that isn’t answered above. Email us and
//             we’ll reply {SUPPORT_CONFIG.responseTime}.
//           </p>
//           <a className="sc-btn-primary" href={`mailto:${SUPPORT_CONFIG.supportEmail}`}>
//             <MailIcon /> {SUPPORT_CONFIG.supportEmail}
//           </a>
//         </section>

//       </div>
//     </div>
//   );
// }

// /* ── Inline icons (no external deps) ──────────────────────────────────────── */
// function MailIcon()    { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>); }
// function ClockIcon()   { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>); }
// function CalendarIcon(){ return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>); }
// function CheckIcon()   { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>); }
// function ChevronIcon() { return (<svg className="sc-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>); }
// function PlusIcon()    { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>); }

// /* ════════════════════════════════════════════════════════════════════════════
//    STYLES  — scoped with the sc- prefix; mirrors the Fameo footer design system
//    ════════════════════════════════════════════════════════════════════════════ */
// const S = `
//   @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

//   :root{
//     --sc-p1:#8F2793; --sc-p2:#D53B7E; --sc-p3:#A33A8E;
//     --sc-grad:linear-gradient(135deg,#8F2793 0%,#A33A8E 50%,#D53B7E 100%);
//     --sc-grad-btn:linear-gradient(135deg,#8F2793 0%,#D53B7E 100%);
//     --sc-line:rgba(163,58,142,0.18);
//   }

//   .sc-root{
//     position:relative; overflow:hidden;
//     background:#0f0614; color:#fff;
//     font-family:'DM Sans',sans-serif;
//     min-height:100vh;
//   }
//   .sc-topline{ position:absolute; top:0; left:0; right:0; height:2px;
//     background:var(--sc-grad); z-index:2; pointer-events:none; }
//   .sc-glow{ position:absolute; border-radius:50%; pointer-events:none; z-index:0; }
//   .sc-glow1{ top:-140px; left:-100px; width:520px; height:520px;
//     background:radial-gradient(circle,rgba(143,39,147,0.20) 0%,transparent 65%); }
//   .sc-glow2{ top:520px; right:-120px; width:480px; height:480px;
//     background:radial-gradient(circle,rgba(213,59,126,0.16) 0%,transparent 65%); }

//   .sc-inner{
//     position:relative; z-index:1;
//     max-width:920px; margin:0 auto;
//     padding:clamp(104px,12vw,150px) 22px 96px;
//   }

//   .sc-eyebrow{
//     display:inline-block;
//     font-size:10px; letter-spacing:.3em; text-transform:uppercase;
//     font-weight:600; color:var(--sc-p2); margin-bottom:14px;
//   }

//   /* ── Hero ── */
//   .sc-hero{ text-align:center; margin-bottom:56px; }
//   .sc-h1{
//     font-family:'Syne',sans-serif; font-weight:800;
//     font-size:clamp(34px,6vw,58px); line-height:1.04;
//     letter-spacing:-.02em; margin:0 0 18px;
//     background:linear-gradient(180deg,#fff 30%,rgba(255,255,255,0.72) 100%);
//     -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
//   }
//   .sc-lead{
//     font-size:clamp(14px,1.6vw,16px); font-weight:300; line-height:1.75;
//     color:rgba(255,255,255,0.6); max-width:560px; margin:0 auto;
//   }
//   .sc-hero-actions{ display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-top:30px; }

//   .sc-btn-primary{
//     display:inline-flex; align-items:center; gap:9px;
//     padding:13px 24px; border-radius:9px; border:none;
//     background:var(--sc-grad-btn); color:#fff;
//     font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; letter-spacing:.02em;
//     text-decoration:none; cursor:pointer;
//     transition:filter .2s, box-shadow .2s, transform .2s;
//   }
//   .sc-btn-primary:hover{ filter:brightness(1.08); box-shadow:0 8px 30px rgba(213,59,126,0.4); transform:translateY(-1px); }

//   .sc-btn-ghost{
//     display:inline-flex; align-items:center; gap:8px;
//     padding:13px 22px; border-radius:9px;
//     border:1px solid var(--sc-line); background:rgba(255,255,255,0.03);
//     color:rgba(255,255,255,0.78);
//     font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
//     text-decoration:none; cursor:pointer;
//     transition:border-color .2s, color .2s, background .2s;
//   }
//   .sc-btn-ghost:hover{ border-color:rgba(213,59,126,0.45); color:#fff; background:rgba(213,59,126,0.08); }

//   /* ── Channels ── */
//   .sc-channels{
//     display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:64px;
//   }
//   .sc-channel{
//     display:flex; flex-direction:column; align-items:flex-start; gap:8px;
//     padding:22px; border-radius:14px;
//     border:1px solid var(--sc-line); background:rgba(255,255,255,0.025);
//   }
//   .sc-channel-icon{
//     width:38px; height:38px; border-radius:10px; margin-bottom:4px;
//     display:flex; align-items:center; justify-content:center;
//     background:rgba(143,39,147,0.16); border:1px solid rgba(163,58,142,0.28);
//     color:var(--sc-p2);
//   }
//   .sc-channel-label{ font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:rgba(255,255,255,0.4); font-weight:600; }
//   .sc-channel-value{ font-size:14px; font-weight:500; color:#fff; text-decoration:none; word-break:break-word; }
//   a.sc-channel-value:hover{ color:var(--sc-p2); }

//   /* ── Form ── */
//   .sc-form-wrap{ margin-bottom:72px; scroll-margin-top:96px; }
//   .sc-form-card{
//     position:relative; overflow:hidden;
//     border:1px solid rgba(163,58,142,0.2); border-radius:20px;
//     background:#100418;
//     padding:clamp(26px,4vw,44px);
//     box-shadow:0 30px 90px rgba(0,0,0,0.5);
//   }
//   .sc-card-topline{ position:absolute; top:0; left:0; right:0; height:2px; background:var(--sc-grad); }
//   .sc-form-head{ margin-bottom:26px; }
//   .sc-h2{
//     font-family:'Syne',sans-serif; font-weight:700;
//     font-size:clamp(22px,3vw,30px); line-height:1.15; letter-spacing:-.01em;
//     margin:0 0 10px; color:#fff;
//   }
//   .sc-form-sub{ font-size:14px; font-weight:300; color:rgba(255,255,255,0.5); margin:0; line-height:1.6; }

//   .sc-form{ display:flex; flex-direction:column; gap:18px; }
//   .sc-row{ display:grid; grid-template-columns:1fr 1fr; gap:18px; }
//   .sc-field{ display:flex; flex-direction:column; gap:8px; }
//   .sc-label{ font-size:12px; font-weight:500; color:rgba(255,255,255,0.62); letter-spacing:.01em; }
//   .sc-opt{ color:rgba(255,255,255,0.3); font-weight:400; }

//   .sc-field input,
//   .sc-field textarea,
//   .sc-select select{
//     width:100%;
//     padding:13px 15px;
//     background:rgba(255,255,255,0.04);
//     border:1px solid rgba(163,58,142,0.22);
//     border-radius:10px;
//     color:#fff; font-size:14px; font-family:'DM Sans',sans-serif;
//     outline:none;
//     transition:border-color .18s, background .18s, box-shadow .18s;
//   }
//   .sc-field textarea{ resize:vertical; min-height:130px; line-height:1.6; }
//   .sc-field input::placeholder,
//   .sc-field textarea::placeholder{ color:rgba(255,255,255,0.28); }
//   .sc-field input:focus,
//   .sc-field textarea:focus,
//   .sc-select select:focus{
//     border-color:rgba(213,59,126,0.55);
//     background:rgba(255,255,255,0.06);
//     box-shadow:0 0 0 3px rgba(213,59,126,0.12);
//   }

//   .sc-select{ position:relative; }
//   .sc-select select{ appearance:none; -webkit-appearance:none; cursor:pointer; padding-right:40px; }
//   .sc-select option{ background:#160a1e; color:#fff; }
//   .sc-chev{ position:absolute; right:14px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,0.45); pointer-events:none; }

//   /* honeypot — visually hidden */
//   .sc-hp{ position:absolute; left:-9999px; width:1px; height:1px; opacity:0; }

//   .sc-error{
//     margin:0; font-size:13px; color:#ff9bbf;
//     background:rgba(213,59,126,0.1); border:1px solid rgba(213,59,126,0.3);
//     padding:11px 14px; border-radius:9px;
//   }

//   .sc-form-foot{ display:flex; align-items:center; gap:18px; flex-wrap:wrap; margin-top:4px; }
//   .sc-submit{
//     padding:14px 30px; border:none; border-radius:10px;
//     background:var(--sc-grad-btn); color:#fff;
//     font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; letter-spacing:.02em;
//     cursor:pointer;
//     transition:filter .2s, box-shadow .2s, transform .2s;
//   }
//   .sc-submit:hover:not(:disabled){ filter:brightness(1.08); box-shadow:0 8px 30px rgba(213,59,126,0.4); transform:translateY(-1px); }
//   .sc-submit:disabled{ opacity:.6; cursor:wait; }
//   .sc-foot-note{ font-size:12.5px; color:rgba(255,255,255,0.42); }
//   .sc-foot-note a{ color:var(--sc-p2); text-decoration:none; }
//   .sc-foot-note a:hover{ text-decoration:underline; }

//   /* success */
//   .sc-success{ text-align:center; padding:18px 8px 6px; }
//   .sc-success-tick{
//     width:58px; height:58px; border-radius:50%; margin:0 auto 18px;
//     display:flex; align-items:center; justify-content:center;
//     background:rgba(143,39,147,0.15); border:1px solid rgba(213,59,126,0.4);
//     color:var(--sc-p2);
//   }
//   .sc-success h3{ font-family:'Syne',sans-serif; font-size:22px; font-weight:700; margin:0 0 10px; color:#fff; }
//   .sc-success p{ font-size:14px; color:rgba(255,255,255,0.6); line-height:1.65; max-width:420px; margin:0 auto 22px; }

//   /* ── FAQ ── */
//   .sc-faq{ margin-bottom:72px; }
//   .sc-faq-head{ text-align:center; margin-bottom:30px; }
//   .sc-faq-list{ display:flex; flex-direction:column; gap:10px; }
//   .sc-faq-item{
//     border:1px solid var(--sc-line); border-radius:13px;
//     background:rgba(255,255,255,0.025); overflow:hidden;
//     transition:border-color .2s, background .2s;
//   }
//   .sc-faq-item.open{ border-color:rgba(213,59,126,0.35); background:rgba(213,59,126,0.05); }
//   .sc-faq-q{
//     width:100%; display:flex; align-items:center; justify-content:space-between; gap:16px;
//     padding:18px 20px; background:none; border:none; cursor:pointer; text-align:left;
//     color:#fff; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500;
//   }
//   .sc-faq-mark{
//     flex-shrink:0; width:28px; height:28px; border-radius:8px;
//     display:flex; align-items:center; justify-content:center;
//     border:1px solid var(--sc-line); color:var(--sc-p2);
//     transition:transform .25s ease, background .2s;
//   }
//   .sc-faq-item.open .sc-faq-mark{ transform:rotate(45deg); background:rgba(213,59,126,0.12); }
//   .sc-faq-a{ padding:0 20px 20px; }
//   .sc-faq-a p{ margin:0; font-size:14px; font-weight:300; line-height:1.75; color:rgba(255,255,255,0.62); max-width:680px; }

//   /* ── Closing ── */
//   .sc-closing{ text-align:center; border-top:1px solid var(--sc-line); padding-top:52px; }
//   .sc-closing p{ font-size:14px; color:rgba(255,255,255,0.55); line-height:1.7; max-width:480px; margin:0 auto 24px; }

//   /* ── Responsive ── */
//   @media (max-width:680px){
//     .sc-channels{ grid-template-columns:1fr; }
//     .sc-row{ grid-template-columns:1fr; }
//     .sc-form-foot{ flex-direction:column; align-items:stretch; }
//     .sc-submit{ width:100%; }
//     .sc-foot-note{ text-align:center; }
//   }

//   @media (prefers-reduced-motion:reduce){
//     .sc-btn-primary, .sc-btn-ghost, .sc-submit, .sc-faq-mark{ transition:none; }
//   }
// `;

'use client';

// components/support/SupportCenter.js
// ─────────────────────────────────────────────────────────────────────────────
// FAMEO — Support Center
// A self-contained support page that lets users find answers (FAQ) and send a
// support request via EmailJS (no backend required). Brand-matched to the Fameo
// footer / policy design system.
//
// ▸ SET YOUR EmailJS KEYS BELOW (SUPPORT_CONFIG.emailjs). Until they are set,
//   the form gracefully falls back to opening the user's mail app with a
//   pre-filled message, so the page still works for support out of the box.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

/* ════════════════════════════════════════════════════════════════════════════
   CONFIG  — edit these values
   ════════════════════════════════════════════════════════════════════════════ */
const SUPPORT_CONFIG = {
  // Get these from https://dashboard.emailjs.com  (Account ▸ API Keys / Email Services / Email Templates)
  emailjs: {
    publicKey:  'gkY_2ufD6D0rgYD7p',   // e.g. 'aB12cD34efGh56'
    serviceId:  'service_dnbsvxt',   // e.g. 'service_xxxxxxx'
    templateId: 'template_0j9tnzf', // e.g. 'template_xxxxxxx'
  },
  // A REAL, monitored inbox. Apple checks that support actually reaches someone.
  supportEmail: 'support@fameo.info',
  responseTime: 'within 24 hours',
  supportHours: 'Mon–Sat · 10:00–19:00 IST',
  appName:      'Fameo',
};

const CATEGORIES = [
  'Account & Login',
  'Payments & Orders',
  'Courses & Resources',
  'Community',
  'Verification',
  'Report a problem',
  'Other',
];

const FAQS = [
  {
    q: 'I didn’t receive my login OTP. What should I do?',
    a: 'OTPs can take up to a minute to arrive. Check your spam/promotions folder and confirm the phone number or email on your account is correct. If it still doesn’t arrive, request a new code after 60 seconds, or contact us using the form below and we’ll verify your account manually.',
  },
  {
    q: 'How do I update my profile or account details?',
    a: 'Open the app, go to Account ▸ Profile, and edit your name, photo, and contact details. Changes save instantly. If a field is locked (for example, a verified handle), send us a request and we’ll help.',
  },
  {
    q: 'Where can I see my orders or purchases?',
    a: 'Go to Account ▸ Orders to view your purchase history and order status. If a charge appears but your order isn’t showing, contact us with the order date and amount and we’ll trace it.',
  },
  {
    q: 'A payment failed or I was charged twice.',
    a: 'Failed payments are not captured and any pending hold is released by your bank, usually within 3–5 business days. If you see a duplicate charge, send us the transaction reference using the form below and we’ll investigate and refund any error promptly.',
  },
  {
    q: 'How do I access the courses and resources I unlocked?',
    a: 'Unlocked content lives under Resources in the app. If something you purchased isn’t appearing, log out and back in to refresh your library; if it’s still missing, reach out and include the course name.',
  },
  {
    q: 'How does verification work?',
    a: 'Fameo is a verified community. Verification confirms you’re a genuine creator, public figure, or professional. Submit your request in-app under Account ▸ Verification; our team reviews submissions and responds by email.',
  },
  {
    q: 'How do I delete my account and data?',
    a: 'You can request account deletion any time. Email us at the address below (or use the form and choose “Account & Login”) from your registered address with the subject “Delete my account”. We’ll permanently remove your account and associated personal data and confirm by email.',
  },
  {
    q: 'How do I report a bug, abuse, or inappropriate content?',
    a: 'Use the form below and choose “Report a problem”, or email us directly. Please include screenshots, the username or content involved, and the steps to reproduce so we can act quickly.',
  },
];

/* ════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════════════════════ */
export default function SupportCenter() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: CATEGORIES[0],
    subject: '',
    message: '',
    website: '', // honeypot — leave empty
  });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');
  const [openFaq, setOpenFaq] = useState(0);
  const cardRef = useRef(null);

  const { publicKey, serviceId, templateId } = SUPPORT_CONFIG.emailjs;
  const emailjsConfigured =
    publicKey && serviceId && templateId &&
    !publicKey.startsWith('YOUR_') &&
    !serviceId.startsWith('YOUR_') &&
    !templateId.startsWith('YOUR_');

  /* Initialise the EmailJS SDK (bundled via npm, served from our own origin
     so it complies with the app's Content-Security-Policy). */
  useEffect(() => {
    if (emailjsConfigured) {
      try { emailjs.init({ publicKey }); } catch (_) {}
    }
  }, [emailjsConfigured, publicKey]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  /* When a request is submitted, bring the confirmation into view. */
  useEffect(() => {
    if (status === 'sent' && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [status]);

  const buildMailto = () => {
    const subject = `[${form.category}] ${form.subject || 'Support request'}`;
    const body =
      `Name: ${form.name}\n` +
      `Email: ${form.email}\n` +
      `Category: ${form.category}\n\n` +
      `${form.message}`;
    return `mailto:${SUPPORT_CONFIG.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.';
    if (!form.message.trim()) return 'Please describe how we can help.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.website) return; // honeypot tripped — silently ignore bots

    const v = validate();
    if (v) { setStatus('error'); setErrorMsg(v); return; }

    // If EmailJS isn't configured yet, open the user's mail client as a fallback,
    // then still show the "Request submitted" confirmation.
    if (!emailjsConfigured) {
      try { window.location.href = buildMailto(); } catch (_) {}
      setForm({ name: '', email: '', category: CATEGORIES[0], subject: '', message: '', website: '' });
      setStatus('sent');
      return;
    }

    setStatus('sending');
    setErrorMsg('');
    try {
      await emailjs.send(serviceId, templateId, {
        from_name: form.name,
        from_email: form.email,
        reply_to: form.email,
        category: form.category,
        subject: form.subject || `${form.category} support request`,
        message: form.message,
        to_name: `${SUPPORT_CONFIG.appName} Support`,
        time: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      }, { publicKey });
      setStatus('sent');
      setForm({ name: '', email: '', category: CATEGORIES[0], subject: '', message: '', website: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg('We couldn’t send your message just now. Please email us directly at ' + SUPPORT_CONFIG.supportEmail + '.');
    }
  };

  return (
    <div className="sc-root">
      <style>{S}</style>

      {/* ambient atmosphere */}
      <span className="sc-topline" aria-hidden />
      <span className="sc-glow sc-glow1" aria-hidden />
      <span className="sc-glow sc-glow2" aria-hidden />

      <div className="sc-inner">

        {/* ── HERO ───────────────────────────────────────────── */}
        <header className="sc-hero">
          <span className="sc-eyebrow">Support Center</span>
          <h1 className="sc-h1">How can we help?</h1>
          <p className="sc-lead">
            Questions about your account, a payment, your courses, or the app?
            Search the common answers below, or send us a message — a real person
            on the {SUPPORT_CONFIG.appName} team will get back to you.
          </p>

          <div className="sc-hero-actions">
            <a className="sc-btn-primary" href={`mailto:${SUPPORT_CONFIG.supportEmail}`}>
              <MailIcon /> Email support
            </a>
            <a className="sc-btn-ghost" href="#contact-form">
              Send a request
            </a>
          </div>
        </header>

        {/* ── CHANNELS ───────────────────────────────────────── */}
        <section className="sc-channels" aria-label="Ways to reach support">
          <div className="sc-channel">
            <span className="sc-channel-icon"><MailIcon /></span>
            <span className="sc-channel-label">Email us</span>
            <a className="sc-channel-value" href={`mailto:${SUPPORT_CONFIG.supportEmail}`}>
              {SUPPORT_CONFIG.supportEmail}
            </a>
          </div>
          <div className="sc-channel">
            <span className="sc-channel-icon"><ClockIcon /></span>
            <span className="sc-channel-label">Typical response</span>
            <span className="sc-channel-value">{SUPPORT_CONFIG.responseTime}</span>
          </div>
          <div className="sc-channel">
            <span className="sc-channel-icon"><CalendarIcon /></span>
            <span className="sc-channel-label">Support hours</span>
            <span className="sc-channel-value">{SUPPORT_CONFIG.supportHours}</span>
          </div>
        </section>

        {/* ── FORM (signature) ───────────────────────────────── */}
        <section id="contact-form" className="sc-form-wrap" aria-label="Contact support">
          <div className="sc-form-card" ref={cardRef}>
            <span className="sc-card-topline" aria-hidden />
            <div className="sc-form-head">
              <span className="sc-eyebrow">Get in touch</span>
              <h2 className="sc-h2">Send us a message</h2>
              <p className="sc-form-sub">
                Tell us what’s going on. The more detail you share, the faster we can help.
              </p>
            </div>

            {status === 'sent' ? (
              <div className="sc-success" role="status">
                <span className="sc-success-tick"><CheckIcon /></span>
                <h3>Request submitted</h3>
                <p>
                  Thanks — your support request has been submitted. We’ll reply to
                  your email {SUPPORT_CONFIG.responseTime}. Please check your inbox
                  (and your spam folder).
                </p>
                <button className="sc-btn-ghost" onClick={() => setStatus('idle')}>
                  Submit another request
                </button>
              </div>
            ) : (
              <form className="sc-form" onSubmit={handleSubmit} noValidate>
                {/* honeypot */}
                <input
                  type="text"
                  className="sc-hp"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={update('website')}
                  aria-hidden="true"
                />

                <div className="sc-row">
                  <label className="sc-field">
                    <span className="sc-label">Your name</span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={update('name')}
                      placeholder="Jane Creator"
                      autoComplete="name"
                      required
                    />
                  </label>
                  <label className="sc-field">
                    <span className="sc-label">Email address</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={update('email')}
                      placeholder="you@email.com"
                      autoComplete="email"
                      required
                    />
                  </label>
                </div>

                <div className="sc-row">
                  <label className="sc-field">
                    <span className="sc-label">Topic</span>
                    <div className="sc-select">
                      <select value={form.category} onChange={update('category')}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronIcon />
                    </div>
                  </label>
                  <label className="sc-field">
                    <span className="sc-label">Subject <span className="sc-opt">(optional)</span></span>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={update('subject')}
                      placeholder="Short summary"
                    />
                  </label>
                </div>

                <label className="sc-field">
                  <span className="sc-label">How can we help?</span>
                  <textarea
                    rows={6}
                    value={form.message}
                    onChange={update('message')}
                    placeholder="Describe your question or issue. Include any order IDs, usernames, or screenshots you can."
                    required
                  />
                </label>

                {status === 'error' && (
                  <p className="sc-error" role="alert">{errorMsg}</p>
                )}

                <div className="sc-form-foot">
                  <button className="sc-submit" type="submit" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Submitting…' : 'Submit request'}
                  </button>
                  <span className="sc-foot-note">
                    Prefer email? Write to{' '}
                    <a href={`mailto:${SUPPORT_CONFIG.supportEmail}`}>{SUPPORT_CONFIG.supportEmail}</a>
                  </span>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────── */}
        <section className="sc-faq" aria-label="Frequently asked questions">
          <div className="sc-faq-head">
            <span className="sc-eyebrow">Answers</span>
            <h2 className="sc-h2">Frequently asked</h2>
          </div>
          <div className="sc-faq-list">
            {FAQS.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className={`sc-faq-item ${open ? 'open' : ''}`}>
                  <button
                    className="sc-faq-q"
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    aria-expanded={open}
                  >
                    <span>{item.q}</span>
                    <span className="sc-faq-mark" aria-hidden><PlusIcon /></span>
                  </button>
                  <div className="sc-faq-a" hidden={!open}>
                    <p>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CLOSING ────────────────────────────────────────── */}
        <section className="sc-closing">
          <h2 className="sc-h2">Still need a hand?</h2>
          <p>
            We’re happy to help with anything that isn’t answered above. Email us and
            we’ll reply {SUPPORT_CONFIG.responseTime}.
          </p>
          <a className="sc-btn-primary" href={`mailto:${SUPPORT_CONFIG.supportEmail}`}>
            <MailIcon /> {SUPPORT_CONFIG.supportEmail}
          </a>
        </section>

      </div>
    </div>
  );
}

/* ── Inline icons (no external deps) ──────────────────────────────────────── */
function MailIcon()    { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>); }
function ClockIcon()   { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>); }
function CalendarIcon(){ return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>); }
function CheckIcon()   { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>); }
function ChevronIcon() { return (<svg className="sc-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>); }
function PlusIcon()    { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>); }

/* ════════════════════════════════════════════════════════════════════════════
   STYLES  — scoped with the sc- prefix; mirrors the Fameo footer design system
   ════════════════════════════════════════════════════════════════════════════ */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  :root{
    --sc-p1:#8F2793; --sc-p2:#D53B7E; --sc-p3:#A33A8E;
    --sc-grad:linear-gradient(135deg,#8F2793 0%,#A33A8E 50%,#D53B7E 100%);
    --sc-grad-btn:linear-gradient(135deg,#8F2793 0%,#D53B7E 100%);
    --sc-line:rgba(163,58,142,0.18);
  }

  .sc-root{
    position:relative; overflow:hidden;
    background:#0f0614; color:#fff;
    font-family:'DM Sans',sans-serif;
    min-height:100vh;
  }
  .sc-topline{ position:absolute; top:0; left:0; right:0; height:2px;
    background:var(--sc-grad); z-index:2; pointer-events:none; }
  .sc-glow{ position:absolute; border-radius:50%; pointer-events:none; z-index:0; }
  .sc-glow1{ top:-140px; left:-100px; width:520px; height:520px;
    background:radial-gradient(circle,rgba(143,39,147,0.20) 0%,transparent 65%); }
  .sc-glow2{ top:520px; right:-120px; width:480px; height:480px;
    background:radial-gradient(circle,rgba(213,59,126,0.16) 0%,transparent 65%); }

  .sc-inner{
    position:relative; z-index:1;
    max-width:920px; margin:0 auto;
    padding:clamp(104px,12vw,150px) 22px 96px;
  }

  .sc-eyebrow{
    display:inline-block;
    font-size:10px; letter-spacing:.3em; text-transform:uppercase;
    font-weight:600; color:var(--sc-p2); margin-bottom:14px;
  }

  /* ── Hero ── */
  .sc-hero{ text-align:center; margin-bottom:56px; }
  .sc-h1{
    font-family:'Syne',sans-serif; font-weight:800;
    font-size:clamp(34px,6vw,58px); line-height:1.04;
    letter-spacing:-.02em; margin:0 0 18px;
    background:linear-gradient(180deg,#fff 30%,rgba(255,255,255,0.72) 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
  .sc-lead{
    font-size:clamp(14px,1.6vw,16px); font-weight:300; line-height:1.75;
    color:rgba(255,255,255,0.6); max-width:560px; margin:0 auto;
  }
  .sc-hero-actions{ display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-top:30px; }

  .sc-btn-primary{
    display:inline-flex; align-items:center; gap:9px;
    padding:13px 24px; border-radius:9px; border:none;
    background:var(--sc-grad-btn); color:#fff;
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; letter-spacing:.02em;
    text-decoration:none; cursor:pointer;
    transition:filter .2s, box-shadow .2s, transform .2s;
  }
  .sc-btn-primary:hover{ filter:brightness(1.08); box-shadow:0 8px 30px rgba(213,59,126,0.4); transform:translateY(-1px); }

  .sc-btn-ghost{
    display:inline-flex; align-items:center; gap:8px;
    padding:13px 22px; border-radius:9px;
    border:1px solid var(--sc-line); background:rgba(255,255,255,0.03);
    color:rgba(255,255,255,0.78);
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
    text-decoration:none; cursor:pointer;
    transition:border-color .2s, color .2s, background .2s;
  }
  .sc-btn-ghost:hover{ border-color:rgba(213,59,126,0.45); color:#fff; background:rgba(213,59,126,0.08); }

  /* ── Channels ── */
  .sc-channels{
    display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:64px;
  }
  .sc-channel{
    display:flex; flex-direction:column; align-items:flex-start; gap:8px;
    padding:22px; border-radius:14px;
    border:1px solid var(--sc-line); background:rgba(255,255,255,0.025);
  }
  .sc-channel-icon{
    width:38px; height:38px; border-radius:10px; margin-bottom:4px;
    display:flex; align-items:center; justify-content:center;
    background:rgba(143,39,147,0.16); border:1px solid rgba(163,58,142,0.28);
    color:var(--sc-p2);
  }
  .sc-channel-label{ font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:rgba(255,255,255,0.4); font-weight:600; }
  .sc-channel-value{ font-size:14px; font-weight:500; color:#fff; text-decoration:none; word-break:break-word; }
  a.sc-channel-value:hover{ color:var(--sc-p2); }

  /* ── Form ── */
  .sc-form-wrap{ margin-bottom:72px; scroll-margin-top:96px; }
  .sc-form-card{
    position:relative; overflow:hidden;
    border:1px solid rgba(163,58,142,0.2); border-radius:20px;
    background:#100418;
    padding:clamp(26px,4vw,44px);
    box-shadow:0 30px 90px rgba(0,0,0,0.5);
  }
  .sc-card-topline{ position:absolute; top:0; left:0; right:0; height:2px; background:var(--sc-grad); }
  .sc-form-head{ margin-bottom:26px; }
  .sc-h2{
    font-family:'Syne',sans-serif; font-weight:700;
    font-size:clamp(22px,3vw,30px); line-height:1.15; letter-spacing:-.01em;
    margin:0 0 10px; color:#fff;
  }
  .sc-form-sub{ font-size:14px; font-weight:300; color:rgba(255,255,255,0.5); margin:0; line-height:1.6; }

  .sc-form{ display:flex; flex-direction:column; gap:18px; }
  .sc-row{ display:grid; grid-template-columns:1fr 1fr; gap:18px; }
  .sc-field{ display:flex; flex-direction:column; gap:8px; }
  .sc-label{ font-size:12px; font-weight:500; color:rgba(255,255,255,0.62); letter-spacing:.01em; }
  .sc-opt{ color:rgba(255,255,255,0.3); font-weight:400; }

  .sc-field input,
  .sc-field textarea,
  .sc-select select{
    width:100%;
    padding:13px 15px;
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(163,58,142,0.22);
    border-radius:10px;
    color:#fff; font-size:14px; font-family:'DM Sans',sans-serif;
    outline:none;
    transition:border-color .18s, background .18s, box-shadow .18s;
  }
  .sc-field textarea{ resize:vertical; min-height:130px; line-height:1.6; }
  .sc-field input::placeholder,
  .sc-field textarea::placeholder{ color:rgba(255,255,255,0.28); }
  .sc-field input:focus,
  .sc-field textarea:focus,
  .sc-select select:focus{
    border-color:rgba(213,59,126,0.55);
    background:rgba(255,255,255,0.06);
    box-shadow:0 0 0 3px rgba(213,59,126,0.12);
  }

  .sc-select{ position:relative; }
  .sc-select select{ appearance:none; -webkit-appearance:none; cursor:pointer; padding-right:40px; }
  .sc-select option{ background:#160a1e; color:#fff; }
  .sc-chev{ position:absolute; right:14px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,0.45); pointer-events:none; }

  /* honeypot — visually hidden */
  .sc-hp{ position:absolute; left:-9999px; width:1px; height:1px; opacity:0; }

  .sc-error{
    margin:0; font-size:13px; color:#ff9bbf;
    background:rgba(213,59,126,0.1); border:1px solid rgba(213,59,126,0.3);
    padding:11px 14px; border-radius:9px;
  }

  .sc-form-foot{ display:flex; align-items:center; gap:18px; flex-wrap:wrap; margin-top:4px; }
  .sc-submit{
    padding:14px 30px; border:none; border-radius:10px;
    background:var(--sc-grad-btn); color:#fff;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; letter-spacing:.02em;
    cursor:pointer;
    transition:filter .2s, box-shadow .2s, transform .2s;
  }
  .sc-submit:hover:not(:disabled){ filter:brightness(1.08); box-shadow:0 8px 30px rgba(213,59,126,0.4); transform:translateY(-1px); }
  .sc-submit:disabled{ opacity:.6; cursor:wait; }
  .sc-foot-note{ font-size:12.5px; color:rgba(255,255,255,0.42); }
  .sc-foot-note a{ color:var(--sc-p2); text-decoration:none; }
  .sc-foot-note a:hover{ text-decoration:underline; }

  /* success */
  .sc-success{ text-align:center; padding:18px 8px 6px; }
  .sc-success-tick{
    width:58px; height:58px; border-radius:50%; margin:0 auto 18px;
    display:flex; align-items:center; justify-content:center;
    background:rgba(143,39,147,0.15); border:1px solid rgba(213,59,126,0.4);
    color:var(--sc-p2);
  }
  .sc-success h3{ font-family:'Syne',sans-serif; font-size:22px; font-weight:700; margin:0 0 10px; color:#fff; }
  .sc-success p{ font-size:14px; color:rgba(255,255,255,0.6); line-height:1.65; max-width:420px; margin:0 auto 22px; }

  /* ── FAQ ── */
  .sc-faq{ margin-bottom:72px; }
  .sc-faq-head{ text-align:center; margin-bottom:30px; }
  .sc-faq-list{ display:flex; flex-direction:column; gap:10px; }
  .sc-faq-item{
    border:1px solid var(--sc-line); border-radius:13px;
    background:rgba(255,255,255,0.025); overflow:hidden;
    transition:border-color .2s, background .2s;
  }
  .sc-faq-item.open{ border-color:rgba(213,59,126,0.35); background:rgba(213,59,126,0.05); }
  .sc-faq-q{
    width:100%; display:flex; align-items:center; justify-content:space-between; gap:16px;
    padding:18px 20px; background:none; border:none; cursor:pointer; text-align:left;
    color:#fff; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500;
  }
  .sc-faq-mark{
    flex-shrink:0; width:28px; height:28px; border-radius:8px;
    display:flex; align-items:center; justify-content:center;
    border:1px solid var(--sc-line); color:var(--sc-p2);
    transition:transform .25s ease, background .2s;
  }
  .sc-faq-item.open .sc-faq-mark{ transform:rotate(45deg); background:rgba(213,59,126,0.12); }
  .sc-faq-a{ padding:0 20px 20px; }
  .sc-faq-a p{ margin:0; font-size:14px; font-weight:300; line-height:1.75; color:rgba(255,255,255,0.62); max-width:680px; }

  /* ── Closing ── */
  .sc-closing{ text-align:center; border-top:1px solid var(--sc-line); padding-top:52px; }
  .sc-closing p{ font-size:14px; color:rgba(255,255,255,0.55); line-height:1.7; max-width:480px; margin:0 auto 24px; }

  /* ── Responsive ── */
  @media (max-width:680px){
    .sc-channels{ grid-template-columns:1fr; }
    .sc-row{ grid-template-columns:1fr; }
    .sc-form-foot{ flex-direction:column; align-items:stretch; }
    .sc-submit{ width:100%; }
    .sc-foot-note{ text-align:center; }
  }

  @media (prefers-reduced-motion:reduce){
    .sc-btn-primary, .sc-btn-ghost, .sc-submit, .sc-faq-mark{ transition:none; }
  }
`;