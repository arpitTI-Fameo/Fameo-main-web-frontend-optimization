'use client';
// modules/Resources/ResourcesHero/index.jsx

import { GOALS, PORTRAITS } from '../constants';

export default function ResourcesHero({ goalCat, pickGoal }) {
    return (
    <header className="rp-hero">
      <div className="rp-hero-left">
        <div className="rp-kicker">Fameo · Learning Center</div>
        <h1 className="rp-h1">
          <span className="line"><span>Creator</span></span>
          <span className="line"><span><em>Knowledge</em> Hub</span></span>
        </h1>
        <p className="rp-sub">
          Level up your creator craft with resources for every stage — from
          influencer strategy and brand partnerships to scaling a lasting career.
        </p>
        <div className="rp-goal">
          <div className="rp-goal-t">What do you want to master today?</div>
          <div className="rp-goal-list">
            {GOALS.map(([label, cat]) => (
              <div
                key={cat}
                className={`rp-goal-item${goalCat === cat ? " on" : ""}`}
                onClick={() => pickGoal(cat)}
              >
                <div className="box" />
                {label}
                <span className="go">→</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rp-hero-art">
        {[["up", PORTRAITS.slice(0, 5)], ["down", PORTRAITS.slice(5, 10)]].map(([dir, imgs]) => (
          <div key={dir} className={`rp-mos-col ${dir}`}>
            <div className="rp-mos-inner">
              {[...imgs, ...imgs].map((u, i) => (
                <img key={`${dir}-${i}`} src={u} alt="Fameo creator" loading="lazy" draggable="false" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </header>
    );
}
