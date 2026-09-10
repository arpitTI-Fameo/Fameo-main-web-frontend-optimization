'use client';
import { S } from './styles';

// modules/Checkout/CheckoutSteps/index.jsx
// Step indicator bar — Delivery → Payment → Review
// Props:
//   current — 0 | 1 | 2  (active step index)

const STEPS = ['Delivery', 'Payment', 'Review'];

export default function CheckoutSteps({ current }) {
  return (
    <>
      <style>{S}</style>
      <div className="cs-wrap">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`cs-step${current === i ? ' active' : ''}${current > i ? ' done' : ''}`}
          >
            <div className="cs-num">{current > i ? '✓' : i + 1}</div>
            <span className="cs-label">{label}</span>
            {i < STEPS.length - 1 && <div className="cs-line" />}
          </div>
        ))}
      </div>
    </>
  );
}
