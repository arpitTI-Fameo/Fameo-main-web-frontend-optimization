"use client";
// components/MainFooter.jsx

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "@/app/assets/logo_fameo_2.png";
import { ROUTES } from "@/constants/routes";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&display=swap');

  :root{
    --ft-p1:#8F2793;
    --ft-p2:#D53B7E;
    --ft-p3:#A33A8E;
    --ft-grad:linear-gradient(135deg,#8F2793 0%,#A33A8E 50%,#D53B7E 100%);
    --ft-grad-btn:linear-gradient(135deg,#8F2793 0%,#D53B7E 100%);
    --ft-ink:#1a0a1e;
    --ft-line:rgba(163,58,142,0.14);
    --ft-muted:rgba(255,255,255,0.45);
    --ft-muted2:rgba(255,255,255,0.25);
  }

  /* ── Root ── */
  .ft-root{
    background:#0f0614;
    position:relative;overflow:hidden;
    font-family:'DM Sans',sans-serif;
  }

  .ft-topline{
    position:absolute;top:0;left:0;right:0;
    height:2px;background:var(--ft-grad);
    z-index:2;pointer-events:none;
  }

  .ft-glow1{
    position:absolute;top:-120px;left:-80px;
    width:480px;height:480px;border-radius:50%;
    background:radial-gradient(circle,rgba(143,39,147,0.18) 0%,transparent 65%);
    pointer-events:none;
  }
  .ft-glow2{
    position:absolute;bottom:-100px;right:-60px;
    width:420px;height:420px;border-radius:50%;
    background:radial-gradient(circle,rgba(213,59,126,0.14) 0%,transparent 65%);
    pointer-events:none;
  }
  .ft-glow3{
    position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);
    width:600px;height:300px;border-radius:50%;
    background:radial-gradient(ellipse,rgba(163,58,142,0.07) 0%,transparent 70%);
    pointer-events:none;
  }

  .ft-inner{
    position:relative;z-index:1;
    max-width:1280px;margin:0 auto;
    padding:72px 52px 0;
  }

  .ft-top{
    display:grid;
    grid-template-columns:1.1fr 1fr;
    gap:80px;
    padding-bottom:56px;
    border-bottom:1px solid rgba(163,58,142,0.14);
  }

  .ft-brand-logo{
    height:34px;width:auto;display:block;
    object-fit:contain;margin-bottom:20px;
  }
  .ft-brand-desc{
    font-size:13px;font-weight:300;line-height:1.8;
    color:rgba(255,255,255,0.45);
    max-width:340px;margin-bottom:28px;
  }

  .ft-socials{display:flex;gap:10px}
  .ft-social{
    width:36px;height:36px;border-radius:8px;
    border:1px solid rgba(163,58,142,0.22);
    display:flex;align-items:center;justify-content:center;
    color:rgba(255,255,255,0.45);font-size:14px;
    text-decoration:none;
    transition:border-color .2s,color .2s,background .2s;
  }
  .ft-social:hover{
    border-color:var(--ft-p2);
    color:#fff;
    background:rgba(213,59,126,0.12);
  }

  .ft-nl-label{
    font-size:9px;letter-spacing:.28em;text-transform:uppercase;
    font-weight:600;color:var(--ft-p2);margin-bottom:12px;display:block;
  }
  .ft-nl-heading{
    font-family:'Syne',sans-serif;
    font-size:clamp(22px,2.4vw,30px);font-weight:700;
    color:#fff;line-height:1.15;letter-spacing:-.01em;
    margin-bottom:10px;
  }
  .ft-nl-sub{
    font-size:13px;font-weight:300;color:rgba(255,255,255,0.4);
    line-height:1.65;margin-bottom:22px;max-width:340px;
  }
  .ft-nl-form{
    display:flex;gap:0;max-width:380px;
  }
  .ft-nl-input{
    flex:1;padding:12px 18px;
    background:rgba(255,255,255,0.05);
    border:1px solid rgba(163,58,142,0.22);
    border-right:none;
    border-radius:6px 0 0 6px;
    color:#fff;font-size:13px;
    font-family:'DM Sans',sans-serif;
    outline:none;
    transition:border-color .2s,background .2s;
  }
  .ft-nl-input::placeholder{color:rgba(255,255,255,0.22)}
  .ft-nl-input:focus{
    border-color:rgba(213,59,126,0.5);
    background:rgba(255,255,255,0.07);
  }
  .ft-nl-btn{
    padding:12px 22px;
    background:var(--ft-grad-btn);
    border:none;border-radius:0 6px 6px 0;
    color:#fff;font-size:10px;font-weight:700;
    letter-spacing:.14em;text-transform:uppercase;
    cursor:pointer;font-family:'DM Sans',sans-serif;
    white-space:nowrap;
    transition:filter .2s,box-shadow .2s;
    position:relative;overflow:hidden;
  }
  .ft-nl-btn::before{
    content:'';position:absolute;inset:0;
    background:linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 55%);
    pointer-events:none;
  }
  .ft-nl-btn:hover{
    filter:brightness(1.1);
    box-shadow:0 4px 20px rgba(213,59,126,0.45);
  }
  .ft-nl-note{
    font-size:10px;color:rgba(255,255,255,0.2);
    margin-top:10px;letter-spacing:.02em;
  }

  .ft-links{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:40px;
    padding:52px 0;
    border-bottom:1px solid rgba(163,58,142,0.1);
  }

  .ft-col-heading{
    font-family:'Syne',sans-serif;
    font-size:9px;font-weight:700;
    letter-spacing:.28em;text-transform:uppercase;
    color:rgba(255,255,255,0.3);
    margin-bottom:20px;display:block;
  }
  .ft-col-links{display:flex;flex-direction:column;gap:1px}
  .ft-col-link{
    font-size:13px;font-weight:400;
    color:rgba(255,255,255,0.48);
    text-decoration:none;
    padding:5px 0;
    display:inline-flex;align-items:center;gap:0;
    transition:color .18s;
    position:relative;
  }
  .ft-col-link::after{
    content:'';
    position:absolute;bottom:4px;left:0;
    width:0;height:1px;
    background:var(--ft-grad);
    transition:width .22s cubic-bezier(.22,1,.36,1);
  }
  .ft-col-link:hover{color:#fff}
  .ft-col-link:hover::after{width:100%}

  .ft-badge{
    font-size:7px;letter-spacing:.1em;text-transform:uppercase;
    font-weight:700;padding:2px 7px;border-radius:3px;
    margin-left:8px;line-height:1.5;flex-shrink:0;
  }
  .ft-badge-new{background:rgba(213,59,126,0.2);color:#D53B7E}
  .ft-badge-beta{background:rgba(143,39,147,0.2);color:#A33A8E}

  .ft-bottom{
    display:flex;align-items:center;justify-content:space-between;
    padding:24px 0 32px;gap:20px;flex-wrap:wrap;
  }
  .ft-copy{
    font-size:11px;color:rgba(255,255,255,0.22);
    letter-spacing:.04em;line-height:1.6;
  }
  .ft-copy strong{color:rgba(255,255,255,0.4);font-weight:500;}
  .ft-copy a{
    color:rgba(213,59,126,0.7);text-decoration:none;
    transition:color .15s;
  }
  .ft-copy a:hover{color:var(--ft-p2)}

  .ft-legal{display:flex;gap:20px;flex-wrap:wrap;align-items:center;}
  .ft-legal-link{
    font-size:10px;letter-spacing:.08em;
    color:rgba(255,255,255,0.22);
    background:none;border:none;cursor:pointer;
    font-family:'DM Sans',sans-serif;
    padding:0;
    transition:color .15s;
  }
  .ft-legal-link:hover{color:rgba(255,255,255,0.55)}

  .ft-made{
    display:flex;align-items:center;gap:6px;
    font-size:10px;color:rgba(255,255,255,0.18);letter-spacing:.06em;
  }
  .ft-heart{
    font-size:12px;
    background:var(--ft-grad);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
    background-clip:text;
  }

  /* ════════════════════════════════════════════
     POLICY MODAL
  ════════════════════════════════════════════ */

  /* Backdrop */
  .pm-backdrop{
    position:fixed;inset:0;z-index:9999;
    background:rgba(8,2,18,0.82);
    backdrop-filter:blur(10px);
    -webkit-backdrop-filter:blur(10px);
    display:flex;align-items:flex-end;justify-content:center;
    padding:0;
    animation:pm-bg-in .25s ease both;
  }
  @keyframes pm-bg-in{
    from{opacity:0;}
    to{opacity:1;}
  }

  /* On wider screens: centered dialog */
  @media(min-width:640px){
    .pm-backdrop{align-items:center;padding:24px;}
  }

  /* Sheet / dialog */
  .pm-sheet{
    position:relative;
    width:100%;
    max-width:820px;
    height:92dvh;
    max-height:820px;
    background:#100418;
    border:1px solid rgba(163,58,142,0.2);
    border-radius:20px 20px 0 0;
    display:flex;flex-direction:column;
    overflow:hidden;
    box-shadow:
      0 0 0 1px rgba(213,59,126,0.06),
      0 -8px 60px rgba(100,20,80,0.4),
      0 40px 100px rgba(0,0,0,0.6);
    animation:pm-sheet-in .32s cubic-bezier(.22,1,.36,1) both;
  }
  @media(min-width:640px){
    .pm-sheet{
      border-radius:20px;
      height:88dvh;
      animation:pm-sheet-center-in .3s cubic-bezier(.22,1,.36,1) both;
    }
  }
  @keyframes pm-sheet-in{
    from{opacity:0;transform:translateY(48px);}
    to{opacity:1;transform:translateY(0);}
  }
  @keyframes pm-sheet-center-in{
    from{opacity:0;transform:scale(0.96) translateY(16px);}
    to{opacity:1;transform:scale(1) translateY(0);}
  }

  /* Closing animation */
  .pm-sheet.closing{
    animation:pm-sheet-out .22s cubic-bezier(.55,0,1,.45) forwards;
  }
  .pm-backdrop.closing{
    animation:pm-bg-out .24s ease forwards;
  }
  @keyframes pm-sheet-out{
    to{opacity:0;transform:translateY(32px);}
  }
  @keyframes pm-bg-out{
    to{opacity:0;}
  }

  /* Top accent line */
  .pm-topline{
    position:absolute;top:0;left:0;right:0;
    height:2px;background:var(--ft-grad);
    z-index:2;border-radius:20px 20px 0 0;
  }

  /* Drag handle (mobile) */
  .pm-handle{
    width:36px;height:4px;border-radius:2px;
    background:rgba(163,58,142,0.3);
    margin:14px auto 0;
    flex-shrink:0;
  }
  @media(min-width:640px){.pm-handle{display:none;}}

  /* Header */
  .pm-header{
    display:flex;align-items:center;gap:14px;
    padding:16px 24px 14px;
    border-bottom:1px solid rgba(163,58,142,0.12);
    flex-shrink:0;
    background:#100418;
  }

  /* Icon badge */
  .pm-icon{
    width:38px;height:38px;border-radius:10px;
    background:rgba(143,39,147,0.15);
    border:1px solid rgba(163,58,142,0.25);
    display:flex;align-items:center;justify-content:center;
    flex-shrink:0;font-size:16px;
  }

  .pm-title-block{flex:1;min-width:0;}
  .pm-eyebrow{
    font-size:8px;letter-spacing:.28em;text-transform:uppercase;
    font-weight:600;color:var(--ft-p2);margin-bottom:2px;display:block;
  }
  .pm-title{
    font-family:'Syne',sans-serif;
    font-size:clamp(15px,2.2vw,18px);font-weight:700;
    color:#fff;line-height:1.2;letter-spacing:-.01em;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  }

  /* Header actions */
  .pm-actions{display:flex;align-items:center;gap:8px;flex-shrink:0;}

  .pm-action-btn{
    height:34px;
    display:flex;align-items:center;gap:6px;
    padding:0 13px;
    border-radius:7px;
    border:1px solid rgba(163,58,142,0.22);
    background:rgba(255,255,255,0.03);
    color:rgba(255,255,255,0.42);
    font-family:'DM Sans',sans-serif;
    font-size:10px;font-weight:500;letter-spacing:.06em;
    cursor:pointer;
    text-decoration:none;
    white-space:nowrap;
    transition:border-color .18s,color .18s,background .18s;
  }
  .pm-action-btn:hover{
    border-color:rgba(213,59,126,0.4);
    color:rgba(255,255,255,0.75);
    background:rgba(213,59,126,0.07);
  }
  .pm-action-btn svg{flex-shrink:0;}

  /* Close button */
  .pm-close{
    width:34px;height:34px;border-radius:8px;
    border:1px solid rgba(163,58,142,0.2);
    background:rgba(255,255,255,0.03);
    display:flex;align-items:center;justify-content:center;
    cursor:pointer;
    color:rgba(255,255,255,0.35);
    transition:border-color .18s,color .18s,background .18s;
    flex-shrink:0;
  }
  .pm-close:hover{
    border-color:rgba(213,59,126,0.5);
    color:#fff;
    background:rgba(213,59,126,0.12);
  }
  .pm-close svg{pointer-events:none;}



  /* Loading bar */
  .pm-loading-bar{
    height:2px;
    background:rgba(163,58,142,0.1);
    flex-shrink:0;
    overflow:hidden;
  }
  .pm-loading-bar-fill{
    height:100%;
    background:var(--ft-grad);
    border-radius:2px;
    transform:translateX(-100%);
    animation:pm-load 1.4s ease-in-out infinite;
  }
  .pm-loading-bar-fill.done{
    animation:none;
    transform:translateX(0);
    opacity:0;
    transition:opacity .3s;
  }
  @keyframes pm-load{
    0%{transform:translateX(-100%);}
    60%{transform:translateX(20%);}
    100%{transform:translateX(110%);}
  }

  /* iframe wrapper */
  .pm-iframe-wrap{
    flex:1;position:relative;overflow:hidden;
  }
  .pm-iframe{
    width:100%;height:100%;
    border:none;display:block;
    background:#fff;
  }

  /* Spinner overlay while loading */
  .pm-spinner-overlay{
    position:absolute;inset:0;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:14px;
    background:#100418;
    z-index:5;
    transition:opacity .3s,visibility .3s;
  }
  .pm-spinner-overlay.hidden{
    opacity:0;visibility:hidden;
  }
  .pm-spinner{
    width:36px;height:36px;
    border:2.5px solid rgba(163,58,142,0.15);
    border-top-color:var(--ft-p2);
    border-radius:50%;
    animation:pm-spin .75s linear infinite;
  }
  @keyframes pm-spin{to{transform:rotate(360deg);}}
  .pm-spinner-text{
    font-size:11px;color:rgba(255,255,255,0.3);
    letter-spacing:.1em;text-transform:uppercase;
    font-weight:400;
  }

  /* Ambient inner glow */
  .pm-inner-glow{
    position:absolute;top:-60px;right:-60px;
    width:260px;height:260px;border-radius:50%;
    background:radial-gradient(circle,rgba(143,39,147,0.12) 0%,transparent 65%);
    pointer-events:none;z-index:0;
  }

  /* ── Responsive ── */
  @media(max-width:1100px){
    .ft-inner{padding:60px 32px 0}
    .ft-top{gap:48px}
  }
  @media(max-width:860px){
    .ft-top{grid-template-columns:1fr;gap:40px}
    .ft-links{grid-template-columns:1fr 1fr;gap:32px}
  }
  @media(max-width:560px){
    .ft-inner{padding:48px 20px 0}
    .ft-links{grid-template-columns:1fr 1fr;gap:24px}
    .ft-nl-form{flex-direction:column}
    .ft-nl-input{border-right:1px solid rgba(163,58,142,0.22);border-radius:6px}
    .ft-nl-btn{border-radius:6px;text-align:center}
    .ft-bottom{flex-direction:column;align-items:flex-start;gap:12px}
    .pm-header{padding:14px 16px 12px;}
    .pm-urlbar{padding:8px 16px;}
    .pm-action-btn span{display:none;}
    .pm-action-btn{padding:0 10px;}
  }
`;

/* ── Link data ── */
const COLS = [
  {
    heading: "Platform",
    links: [
      { label: "Home",            href: "/" },
      { label: "Products",        href: "/products" },
      { label: "Resources",       href: "/resources" },
      { label: "Community",       href: "/community" },
      { label: "Talent Hire",     href: "/talent-hire" },
    ],
  },
  {
    heading: "Creators",
    links: [
      { label: "Creator Hub",     href: "/resources",  badge:"new",  badgeClass:"ft-badge-new" },
      { label: "Learning Center", href: "/resources",  badge:"new",  badgeClass:"ft-badge-new" },
      { label: "Brand Deals",     href: "/products" },
      { label: "Fameo Community", href: "/community",  badge:"beta", badgeClass:"ft-badge-beta" },
      { label: "Talent Network",  href: "/talent-hire" },
    ],
  },
  {
    heading: "Company",
    links: [
      // { label: "About Fameo",     href: "/about" },
      // { label: "Careers",         href: "/careers" },
      // { label: "Blog",            href: "/blog" },
      // { label: "Press Kit",       href: "/press" },
      { label: "Contact Us",      href: ROUTES.SUPPORT },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Login",           href: "/login" },
      { label: "Register",        href: "/register" },
      { label: "My Profile",      href: "/account/profile" },
      { label: "My Orders",       href: "/account/orders" },
      { label: "Settings",        href: "/account/settings" },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com", icon: "📸" },
  { label: "Twitter/X", href: "https://x.com",         icon: "𝕏"  },
  { label: "LinkedIn",  href: "https://linkedin.com",  icon: "in" },
  { label: "YouTube",   href: "https://youtube.com",   icon: "▶"  },
];

const LEGAL_LINKS = [
{ label: 'Privacy Policy',   href: 'https://uat.fameo.info/privacy-policy.html',       icon: '🔒' },
  { label: 'Terms of Service', href: 'https://uat.fameo.info/terms-and-conditions.html', icon: '📋' },
  { label: 'Cookie Policy',    href: 'https://uat.fameo.info/cookie-policy.html',        icon: '🍪' },



  // {
  //   label: "Refund Policy",
  //   href: "http://ec2-13-201-9-253.ap-south-1.compute.amazonaws.com/refund-policy.html",
  //   icon: "↩",
  // },
];

/* ── Policy Modal ── */
function PolicyModal({ policy, onClose }) {
  const [loaded, setLoaded] = useState(false);
  const [closing, setClosing] = useState(false);

  /* Lock body scroll */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 240);
  }, [onClose]);

  /* Escape key */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  return (
    <div
      className={`pm-backdrop${closing ? " closing" : ""}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={policy.label}
    >
      <div className={`pm-sheet${closing ? " closing" : ""}`}>
        {/* Top accent */}
        <div className="pm-topline" aria-hidden="true" />
        <div className="pm-inner-glow" aria-hidden="true" />

        {/* Drag handle (mobile only) */}
        <div className="pm-handle" aria-hidden="true" />

        {/* Header */}
        <div className="pm-header">
          <div className="pm-icon">{policy.icon}</div>
          <div className="pm-title-block">
            <span className="pm-eyebrow">Legal · Fameo</span>
            <div className="pm-title">{policy.label}</div>
          </div>
          <div className="pm-actions">
            {/* Open in new tab */}
            {/* <a
              href={policy.href}
              target="_blank"
              rel="noopener noreferrer"
              className="pm-action-btn"
              title="Open in new tab"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M7 1h4m0 0v4m0-4L5.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Open</span>
            </a> */}
            {/* Close */}
            <button
              className="pm-close"
              onClick={handleClose}
              aria-label="Close"
              title="Close (Esc)"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Loading bar */}
        <div className="pm-loading-bar">
          <div className={`pm-loading-bar-fill${loaded ? " done" : ""}`} />
        </div>

        {/* iframe */}
        <div className="pm-iframe-wrap">
          {/* Spinner until iframe loads */}
          <div className={`pm-spinner-overlay${loaded ? " hidden" : ""}`}>
            <div className="pm-spinner" />
            <span className="pm-spinner-text">Loading document…</span>
          </div>
          <iframe
            className="pm-iframe"
            src={`${process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://uat.fameo.info'}${new URL(policy.href, 'https://uat.fameo.info').pathname}`}
            title={policy.label}
            onLoad={() => setLoaded(true)}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );
}

/* ── Main Footer ── */
export default function MainFooter() {
  const [activePolicy, setActivePolicy] = useState(null);
  const router = useRouter();

  return (
    <>
      <style>{S}</style>

      {/* Policy modal — rendered at root level */}
      {activePolicy && (
        <PolicyModal
          policy={activePolicy}
          onClose={() => setActivePolicy(null)}
        />
      )}

      <footer className="ft-root" role="contentinfo">
        <div className="ft-topline" aria-hidden="true" />
        <div className="ft-glow1"  aria-hidden="true" />
        <div className="ft-glow2"  aria-hidden="true" />
        <div className="ft-glow3"  aria-hidden="true" />

        <div className="ft-inner">

          {/* ── TOP: brand + newsletter ── */}
          {/* <div className="ft-top">
            {/* Brand */}
            <div>
              {/* <img src={logo.src} alt="Fameo" className="ft-brand-logo" /> */}
              {/* <p className="ft-brand-desc">
                India's premier creator-brand collaboration platform. Connecting
                verified creators with brands that matter — powered by data,
                driven by authenticity.
              </p> */}
              {/* <div className="ft-socials">
                {SOCIALS.map(s => (
                  <a key={s.label} href={s.href} className="ft-social"
                    aria-label={s.label} target="_blank" rel="noopener noreferrer">
                    {s.icon}
                  </a>
                ))}
              </div> 
            </div> */}

            {/* Newsletter */}
            {/* <div>
              <span className="ft-nl-label">Creator Intelligence</span>
              <h3 className="ft-nl-heading">
                New resources,<br />every fortnight.
              </h3>
              <p className="ft-nl-sub">
                Join 12,000+ creators receiving curated frameworks, brand deal
                insights, and platform updates directly to their inbox.
              </p>
              <div className="ft-nl-form">
                <input
                  className="ft-nl-input"
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address for newsletter"
                />
                <button className="ft-nl-btn">Subscribe</button>
              </div>
              <p className="ft-nl-note">No spam. Unsubscribe anytime.</p>
            </div> */}
          </div>

          {/* ── LINK GRID ── */}
           {/* <div className="ft-links">
            {COLS.map(col => (
              <div key={col.heading}>
                <span className="ft-col-heading">{col.heading}</span>
                <div className="ft-col-links">
                  {col.links.map(link => (
                    <Link key={link.label} href={link.href} className="ft-col-link">
                      {link.label}
                      {link.badge && (
                        <span className={`ft-badge ${link.badgeClass}`}>
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div> */}

          {/* ── BOTTOM BAR ── */}
          <div className="ft-bottom">
            <p className="ft-copy">
              © {new Date().getFullYear()}{" "}
              <strong>Fameo</strong> · Trendlance Innovations Pvt. Ltd. · Built
              in{" "}
              <a href="https://www.hyderabad.gov.in" target="_blank" rel="noopener noreferrer">
                Hyderabad 🇮🇳
              </a>
            </p>

            {/* Legal links → open modal */}
            <div className="ft-legal">
              <button
                onClick={() => router.push(ROUTES.SUPPORT)}
                className="ft-legal-link"
              >
                Support
              </button>
              {LEGAL_LINKS.map(l => (
                <button
                  key={l.label}
                  onClick={() => setActivePolicy(l)}
                  className="ft-legal-link"
                >
                  {l.label}
                </button>
              ))}
            </div>

            <div className="ft-made">
              <span className="ft-heart">♥</span>
              <span>Made with love for creators</span>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}