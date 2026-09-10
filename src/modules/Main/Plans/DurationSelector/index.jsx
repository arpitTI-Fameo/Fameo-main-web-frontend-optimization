'use client';

import { DURATIONS } from '../constants';
import { inr } from '../helpers';

export default function DurationSelector({ duration, setDuration, tabPrice }) {
    return (
        <div className="duration-wrap">
            <div className="duration-tabs">
                {DURATIONS.map(d => {
                    const p = tabPrice(d.months);
                    return (
                        <button
                            key={d.months}
                            className={`dur-btn${duration === d.months ? ' active' : ''}`}
                            onClick={() => setDuration(d.months)}
                        >
                            {d.badge && <span className="dur-save">{d.badge}</span>}
                            <span className="dur-label">{d.label}</span>
                            <span className="dur-price">{p != null ? `₹${inr(p)}` : '—'}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
