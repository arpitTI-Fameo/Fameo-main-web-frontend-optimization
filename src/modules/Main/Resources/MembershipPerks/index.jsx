'use client';
// modules/Resources/MembershipPerks/index.jsx

import { PERKS } from '../constants';

export default function MembershipPerks() {
    return (
    <section className="rp-section rp-mem">
      <div>
        <h2 className="rp-reveal">What&apos;s in every Fameo membership?</h2>
        <div className="rp-btns rp-reveal">
          <a className="rp-btn rp-btn-primary" href="/plans">Get Fameo <span className="arr">→</span></a>
          <a className="rp-btn rp-btn-ghost" href="/plans">♥ Gift</a>
        </div>
      </div>
      <div className="rp-perks" data-stagger>
        {PERKS.map(([ic, label]) => (
          <div key={label} className="rp-perk" data-child>
            <div className="pico">{ic}</div>{label}
          </div>
        ))}
      </div>
    </section>
    );
}
