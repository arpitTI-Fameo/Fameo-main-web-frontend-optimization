'use client';
// modules/Resources/MembershipPricing/index.jsx

import { MEMBER_IMG } from '../constants';

export default function MembershipPricing() {
    return (
    <section className="rp-section rp-member">
      <div className="rp-mv">
        <div className="rp-mv-img"><img src={MEMBER_IMG} alt="" draggable="false" /></div>
        <div className="rp-price">
          <div className="rp-price-ico">◈</div>
          <h4>Get access to the exclusive Fameo membership</h4>
          <div className="rp-tier">Basic <span>Free</span></div>
          <div className="rp-tier hot">Pro <span>₹499/month</span></div>
          <div className="rp-tier">Elite <span>₹999/month</span></div>
          <a href="/plans"><button className="rp-pc-btn">Unlock Membership</button></a>
        </div>
      </div>
      <div className="rp-mc">
        <div className="rp-eyebrow rp-reveal">Membership</div>
        <h2 className="rp-reveal">One membership. Every course. Zero limits.</h2>
        <p className="rp-reveal">
          Every course, playbook, and toolkit — plus the verified community that holds you accountable.
        </p>
        <div className="rp-benefits" data-stagger>
          {[
            "All 8 courses and original playbooks",
            "Playbooks, toolkits & checklists included",
            "Learn on desktop, tablet, or mobile",
            "New resources added every month",
            "Verified creator community access",
          ].map(b => (
            <div key={b} className="rp-benefit" data-child>
              <div className="chk">✓</div>{b}
            </div>
          ))}
        </div>
      </div>
    </section>
    );
}
