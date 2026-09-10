// app/(main)/account/layout.js
// Shared frame for every /account/* page: sidebar on the left, page on the
// right. Existing pages (profile, subscription, orders…) keep their own
// internal markup — this only adds the surrounding navigation.

import AccountNav from '@/modules/Account/AccountNav';
import './account.css';

export const metadata = {
  title: 'My account · Fameo',
};

export default function AccountLayout({ children }) {
  return (
    // <div className="fa-page">
    <div className="fa-wrap">

      <aside className="fa-side">
        <AccountNav />
      </aside>
      <div className="fa-body">{children}</div>
    </div>
  // </div>
    
  );
}
