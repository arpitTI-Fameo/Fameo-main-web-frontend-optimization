'use client';
// modules/Resources/CourseDetail/Footer/index.jsx

import { ROUTES } from '@/constants/routes';

export default function Footer() {
  return (
    <footer className="cx-footer">
      <div>© 2026 <b className="brand">Fameo</b> · Trendlance Innovations Pvt. Ltd. · Built in Hyderabad 🇮🇳</div>
      <div className="links">
        <a href={ROUTES.SUPPORT}>Support</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a>
      </div>
      <div><span className="love">♥</span> Made with love for creators</div>
    </footer>
  );
}
