'use client';

// modules/Support/index.jsx
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import emailjs from '@emailjs/browser';
import { supportSchema, firstSupportError } from './schema';
import { S } from './styles';
import { MailIcon, ClockIcon, CalendarIcon, CheckIcon, ChevronIcon, PlusIcon } from './icons';
import { DEFAULT_LOCALE } from '@/constants/locale';

/* ════════════════════════════════════════════════════════════════════════════
   CONFIG  — edit these values
   ════════════════════════════════════════════════════════════════════════════ */
const SUPPORT_CONFIG = {
  // Get these from https://dashboard.emailjs.com  (Account ▸ API Keys / Email Services / Email Templates)
  emailjs: {
    publicKey: 'gkY_2ufD6D0rgYD7p',   // e.g. 'aB12cD34efGh56'
    serviceId: 'service_dnbsvxt',   // e.g. 'service_xxxxxxx'
    templateId: 'template_0j9tnzf', // e.g. 'template_xxxxxxx'
  },
  // A REAL, monitored inbox. Apple checks that support actually reaches someone.
  supportEmail: 'support@fameo.info',
  responseTime: 'within 24 hours',
  supportHours: 'Mon–Sat · 10:00–19:00 IST',
  appName: 'Fameo',
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

/* The form's starting values, and what a successful send resets it back to. */
const DEFAULT_VALUES = {
  name: '',
  email: '',
  category: CATEGORIES[0],
  subject: '',
  message: '',
  website: '', // honeypot — leave empty
};

/* ════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════════════════════ */
export default function SupportCenter() {
  /* React Hook Form owns the fields; zod owns the rules. 'onSubmit' for both
     modes matches how this form has always behaved — one message, on submit,
     never while typing. */
  /** @type {import('react-hook-form').UseFormReturn<import('./schema').SupportValues>} */
  const { register, handleSubmit, reset, getValues } = useForm({
    resolver: zodResolver(supportSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
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
      try { emailjs.init({ publicKey }); } catch (_) { }
    }
  }, [emailjsConfigured, publicKey]);

  /* When a request is submitted, bring the confirmation into view. */
  useEffect(() => {
    if (status === 'sent' && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [status]);

  const buildMailto = (values) => {
    const subject = `[${values.category}] ${values.subject || 'Support request'}`;
    const body =
      `Name: ${values.name}\n` +
      `Email: ${values.email}\n` +
      `Category: ${values.category}\n\n` +
      `${values.message}`;
    return `mailto:${SUPPORT_CONFIG.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const onValid = async (values) => {
    // If EmailJS isn't configured yet, open the user's mail client as a fallback,
    // then still show the "Request submitted" confirmation.
    if (!emailjsConfigured) {
      try { window.location.href = buildMailto(values); } catch (_) { }
      reset(DEFAULT_VALUES);
      setStatus('sent');
      return;
    }

    setStatus('sending');
    setErrorMsg('');
    try {
      await emailjs.send(serviceId, templateId, {
        from_name: values.name,
        from_email: values.email,
        reply_to: values.email,
        category: values.category,
        subject: values.subject || `${values.category} support request`,
        message: values.message,
        to_name: `${SUPPORT_CONFIG.appName} Support`,
        time: new Date().toLocaleString(DEFAULT_LOCALE, { dateStyle: 'medium', timeStyle: 'short' }),
      }, { publicKey });
      setStatus('sent');
      reset(DEFAULT_VALUES);
    } catch (err) {
      setStatus('error');
      setErrorMsg('We couldn’t send your message just now. Please email us directly at ' + SUPPORT_CONFIG.supportEmail + '.');
    }
  };

  /* One message at a time, in field order — the same thing the old
     early-returning validate() put into this same .sc-error line. */
  const onInvalid = (fieldErrors) => {
    setStatus('error');
    setErrorMsg(firstSupportError(fieldErrors));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // The honeypot stays ahead of validation: a bot that fills it is ignored
    // in silence, never told why.
    if (getValues('website')) return;
    return handleSubmit(onValid, onInvalid)();
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
              <form className="sc-form" onSubmit={onSubmit} noValidate>
                {/* honeypot */}
                <input
                  type="text"
                  className="sc-hp"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register('website')}
                  aria-hidden="true"
                />

                <div className="sc-row">
                  <label className="sc-field">
                    <span className="sc-label">Your name</span>
                    <input
                      type="text"
                      {...register('name')}
                      placeholder="Jane Creator"
                      autoComplete="name"
                      required
                    />
                  </label>
                  <label className="sc-field">
                    <span className="sc-label">Email address</span>
                    <input
                      type="email"
                      {...register('email')}
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
                      <select {...register('category')}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronIcon />
                    </div>
                  </label>
                  <label className="sc-field">
                    <span className="sc-label">Subject <span className="sc-opt">(optional)</span></span>
                    <input
                      type="text"
                      {...register('subject')}
                      placeholder="Short summary"
                    />
                  </label>
                </div>

                <label className="sc-field">
                  <span className="sc-label">How can we help?</span>
                  <textarea
                    rows={6}
                    {...register('message')}
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
