'use client';
// modules/Resources/ResourcesFaq/index.jsx

import { FAQS } from '../constants';

export default function ResourcesFaq({ openFaq, setOpenFaq }) {
    return (
    <section className="rp-section rp-faq-wrap">
      <div className="rp-eyebrow rp-reveal">Questions</div>
      <h2 className="rp-reveal">Frequently asked questions</h2>
      <div>
        {FAQS.map(([q, a], i) => {
          const open = openFaq === i;
          return (
            <div key={i} className={`rp-faq${open ? " open" : ""}`}>
              <button className="rp-faq-q" onClick={() => setOpenFaq(open ? -1 : i)}>
                {q}<span className="chev">▼</span>
              </button>
              <div className="rp-faq-a" style={{ maxHeight: open ? "260px" : "0" }}>
                <p>{a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
    );
}
