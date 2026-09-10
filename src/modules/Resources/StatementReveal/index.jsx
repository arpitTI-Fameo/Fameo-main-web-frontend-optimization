'use client';
// modules/Resources/StatementReveal/index.jsx

import { STATEMENT_WORDS } from '../constants';

export default function StatementReveal({ stRef }) {
    return (
    <section className="rp-statement">
      <h2 ref={stRef}>
        {STATEMENT_WORDS.map(([w, acc], i) => (
          <span key={i}>
            <span className={`rp-w${acc ? " accent" : ""}`}>{w}</span>
            {i < STATEMENT_WORDS.length - 1 ? " " : ""}
          </span>
        ))}
      </h2>
      <p>New resources added every month</p>
    </section>
    );
}
