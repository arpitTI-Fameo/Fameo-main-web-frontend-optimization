'use client';
// modules/Resources/CommunityFan/index.jsx

import { COMMUNITY, FAN } from '../constants';

export default function CommunityFan() {
    return (
    <section className="rp-section rp-community">
      <div>
        <div className="rp-eyebrow rp-reveal">Community</div>
        <h2 className="rp-reveal">Explore the<br />creator community</h2>
        <div className="rp-com-rows" data-stagger>
          {COMMUNITY.map(([ic, h, p]) => (
            <div key={h} className="rp-com-row" data-child>
              <div className="ico">{ic}</div>
              <div><h4>{h}</h4><p>{p}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div className="rp-fan">
        {FAN.map((f, i) => (
          <div key={i} className="rp-fan-card">
            <img src={f.img} alt="" draggable="false" />
            <div className="cap">
              <div className="dot" />
              <div><b>Fameo Creator</b><br /><span>{f.cap}</span></div>
            </div>
          </div>
        ))}
      </div>
    </section>
    );
}
