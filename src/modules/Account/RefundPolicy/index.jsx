'use client';
// app/(main)/refund-policy/page.js
// Refund & Cancellation Policy — live copy for Fameo.
// Content mirrors the hosted refund-policy.html. Have a lawyer review any edits.

const LAST_UPDATED = 'July 2, 2026';

const LEGAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
  .lp * { box-sizing: border-box; }
  .lp {
    font-family: 'Schibsted Grotesk', sans-serif; color: #1A1A1A;
    background: #F2EFE9; min-height: 100vh;
    padding: 140px 24px 100px;
  }
  .lp-inner { max-width: 760px; margin: 0 auto; }
  .lp-kicker {
    font-family: 'Space Mono', monospace; font-size: 11px;
    letter-spacing: .18em; text-transform: uppercase; color: #8B8781;
    margin-bottom: 16px;
  }
  .lp-title {
    font-size: clamp(34px, 5vw, 56px); font-weight: 600;
    letter-spacing: -0.03em; line-height: 1.05; margin-bottom: 14px;
  }
  .lp-updated { font-size: 13px; color: #8B8781; margin-bottom: 8px; }
  .lp-intro {
    font-size: 16px; line-height: 1.7; color: #3d3a34;
    padding: 22px 0 8px; border-bottom: 1px solid rgba(26,26,26,.1); margin-bottom: 40px;
  }
  .lp h2 {
    font-size: 22px; font-weight: 600; letter-spacing: -0.01em;
    margin: 44px 0 14px; display: flex; align-items: baseline; gap: 12px;
  }
  .lp h2 .num {
    font-family: 'Space Mono', monospace; font-size: 13px;
    color: #D53B7E; font-weight: 700; flex-shrink: 0;
  }
  .lp h3 { font-size: 16px; font-weight: 600; margin: 24px 0 8px; }
  .lp p { font-size: 15px; line-height: 1.75; color: #2a2822; margin-bottom: 14px; }
  .lp ul { margin: 0 0 16px; padding-left: 20px; }
  .lp li { font-size: 15px; line-height: 1.7; color: #2a2822; margin-bottom: 8px; }
  .lp strong { font-weight: 600; color: #1A1A1A; }
  .lp a.inline { color: #D53B7E; text-decoration: underline; text-underline-offset: 2px; }
  .lp-callout {
    background: #fff; border: 1px solid rgba(213,59,126,.18);
    border-left: 3px solid #D53B7E; border-radius: 8px;
    padding: 18px 20px; margin: 18px 0 24px;
  }
  .lp-callout p { margin: 0; font-size: 14.5px; }
  .lp-foot {
    margin-top: 56px; padding-top: 24px;
    border-top: 1px solid rgba(26,26,26,.1);
    font-size: 13px; color: #8B8781;
  }
  .lp-foot a { color: #D53B7E; text-decoration: none; }
  .lp-foot a:hover { text-decoration: underline; }
`;

export default function RefundPolicy() {
  return (
    <div className="lp">
      <style>{LEGAL_CSS}</style>
      <div className="lp-inner">
        <div className="lp-kicker">Legal</div>
        <h1 className="lp-title">Refund &amp; Cancellation Policy</h1>
        <div className="lp-updated">Last updated: {LAST_UPDATED}</div>

        <p className="lp-intro">
          This policy explains how cancellations and refunds work for Fameo
          memberships (subscriptions) and for physical products purchased through
          our store. By subscribing to a plan or placing an order, you agree to
          the terms below.
        </p>

        {/* ─── Memberships ─────────────────────────────────────────── */}
        <h2><span className="num">01</span> Membership Subscriptions</h2>

        <h3>Recurring billing</h3>
        <p>
          Fameo paid memberships (Pro, Popular, Elite) are billed on an
          <strong> automatic recurring basis</strong> through Razorpay. When you
          subscribe, you authorise us to charge your selected payment method at
          the start of each billing cycle (for example, every month) until you
          cancel. The applicable amount and billing frequency are shown to you at
          checkout before you confirm.
        </p>

        <h3>No refunds on subscription payments</h3>
        <div className="lp-callout">
          <p>
            <strong>Membership fees are non-refundable.</strong> We do not provide
            refunds or credits for partially used billing periods, unused
            features, or amounts already charged.
          </p>
        </div>
        <p>
          Instead of refunds, you can <strong>cancel at any time</strong>. When you
          cancel, your membership stays active until the end of the billing period
          you have already paid for, and you will not be charged again.
        </p>

        <h3>How to cancel</h3>
        <p>
          You can cancel your membership yourself at any time:
        </p>
        <ul>
          <li>Go to <strong>Account → Subscription</strong>.</li>
          <li>Select <strong>Cancel subscription</strong>.</li>
          <li>
            Choose <strong>&ldquo;At cycle end&rdquo;</strong> to keep access until your
            current period ends and stop all future charges, or
            <strong> &ldquo;Cancel now&rdquo;</strong> to end your membership immediately.
          </li>
        </ul>
        <p>
          Cancelling stops future auto-debits. If you choose &ldquo;Cancel
          now,&rdquo; access ends right away and no refund is issued for the
          remainder of the period.
        </p>

        <h3>Exceptions</h3>
        <p>
          We may, at our sole discretion, issue a refund in cases of a
          <strong> duplicate charge</strong>, a <strong>technical billing error on
          our side</strong>, or where a refund is <strong>required by applicable
          law</strong>. To request a review, contact us within
          <strong> 7 days</strong> of the charge at{' '}
          <a className="inline" href="mailto:support@fameo.com">support@fameo.com</a>{' '}
          with your registered email and the payment reference.
        </p>

        <h3>Failed or disputed auto-debits</h3>
        <p>
          If a scheduled auto-debit fails, we may retry the charge as permitted by
          Razorpay and your bank. If payment cannot be collected, your membership
          may be paused or downgraded to the free tier until payment succeeds.
        </p>

        {/* ─── Products ────────────────────────────────────────────── */}
        <h2><span className="num">02</span> Physical Products &amp; Store Orders</h2>
        <p>
          Physical products purchased through the Fameo store may be returned
          within a limited window, subject to the conditions below.
        </p>

        <h3>Return window</h3>
        <p>
          You may request a return within <strong>14 days</strong> of delivery
          (the &ldquo;return window&rdquo;). Requests made after this window may
          not be accepted.
        </p>

        <h3>Conditions for return</h3>
        <ul>
          <li>The item must be <strong>unused, unworn, and in its original condition</strong> with all tags and packaging intact.</li>
          <li>Proof of purchase (order number or receipt) is required.</li>
          <li>Certain items may be <strong>non-returnable</strong> for hygiene, safety, or customisation reasons (for example, personalised or digital goods).</li>
        </ul>

        <h3>Damaged, defective, or wrong items</h3>
        <p>
          If you receive an item that is damaged, defective, or not what you
          ordered, contact us within <strong>7 days</strong> of delivery with
          photos and your order number. We will arrange a replacement or refund at
          no additional cost to you.
        </p>

        <h3>How refunds are processed</h3>
        <p>
          Once your returned item is received and inspected, we will notify you of
          the outcome. Approved refunds are issued to your{' '}
          <strong>original payment method</strong> via Razorpay and typically
          reflect within <strong>5&ndash;10 business days</strong>, depending on
          your bank. Original shipping charges may be non-refundable, and return
          shipping costs may be borne by you unless the item was damaged,
          defective, or incorrect.
        </p>

        <h3>How to start a return</h3>
        <p>
          Email{' '}
          <a className="inline" href="mailto:support@fameo.com">support@fameo.com</a>{' '}
          or visit <strong>Account → My Orders</strong> to raise a return request.
          Please include your order number and the reason for the return.
        </p>

        {/* ─── General ─────────────────────────────────────────────── */}
        <h2><span className="num">03</span> General</h2>
        <ul>
          <li>All amounts are in <strong>Indian Rupees (INR)</strong> unless stated otherwise.</li>
          <li>Refunds, where applicable, are made only to the original payment method.</li>
          <li>We reserve the right to refuse a refund or return that does not meet the conditions in this policy or that we reasonably believe is fraudulent or abusive.</li>
          <li>We may update this policy from time to time. The version in effect at the time of your purchase applies to that purchase.</li>
        </ul>

        <h2><span className="num">04</span> Contact Us</h2>
        <p>
          Questions about a cancellation, return, or refund? Reach us at:
        </p>
        <p>
           <strong>Trendlance Innovations Private Limited</strong><br />
  CIN: U62013TS2025PTC207315<br />
  5-11/100/144, Shankar Green Homes,<br />
  Ameenpur, Sangareddy, Hyderabad, Telangana - 502032<br />

          Email: <a className="inline" href="mailto:support@fameo.com">support@fameo.com</a>
        </p>

        <div className="lp-foot">
          See also our{' '}
          <a href="https://uat.fameo.info/privacy-policy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>,{' '}
          <a href="https://uat.fameo.info/terms-and-conditions.html" target="_blank" rel="noopener noreferrer">Terms of Service</a>, and{' '}
          <a href="https://uat.fameo.info/cookie-policy.html" target="_blank" rel="noopener noreferrer">Cookie Policy</a>.
        </div>
      </div>
    </div>
  );
}
