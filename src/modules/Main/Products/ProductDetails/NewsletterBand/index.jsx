'use client';
// modules/Main/Products/ProductDetails/NewsletterBand/index.jsx
// The dark band above the footer.
//
// There is no newsletter service in the repo yet, so submitting only flips the
// button to its done state — deliberately local. When the endpoint exists it
// belongs in lib/services, called through a hook, and this component keeps
// taking an onSubmit prop instead of growing a fetch.

import { useState } from 'react';

import { DETAIL_NEWSLETTER } from '../constants';

import { S } from './styles';

export default function NewsletterBand({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    onSubmit?.(email);
    setDone(true);
    setEmail('');
  };

  return (
    <>
      <style>{S}</style>
      <section className="pnb-band" aria-labelledby="pdp-news-title">
        <div className="pdp-inner">
          <div className="pnb-inner">
            <h2 className="pnb-title" id="pdp-news-title">{DETAIL_NEWSLETTER.title}</h2>
            <p className="pnb-sub">{DETAIL_NEWSLETTER.subtitle}</p>

            <form className="pnb-form" onSubmit={submit}>
              <label className="pnb-label" htmlFor="pdp-news-email">
                {DETAIL_NEWSLETTER.placeholder}
              </label>
              <input
                id="pdp-news-email"
                className="pnb-input"
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setDone(false); }}
                placeholder={DETAIL_NEWSLETTER.placeholder}
                autoComplete="email"
              />
              <button type="submit" className="pnb-cta" disabled={done}>
                {done ? DETAIL_NEWSLETTER.done : DETAIL_NEWSLETTER.cta}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
