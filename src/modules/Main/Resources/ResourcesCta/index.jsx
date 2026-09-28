'use client';
// modules/Resources/ResourcesCta/index.jsx
import { ROUTES } from '@/constants/routes';

export default function ResourcesCta() {
    return (
    <section className="rp-cta">
      <h2 className="rp-reveal">Your fame is a craft.<br /><em>Master it.</em></h2>
      <p className="rp-reveal">Join the verified creator community learning to build careers that last.</p>
      <a className="rp-btn rp-btn-primary rp-reveal" href={ROUTES.PLANS}>Join the community <span className="arr">→</span></a>
    </section>
    );
}
