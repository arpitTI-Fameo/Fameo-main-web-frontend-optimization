'use client';
// modules/Account/AccountNav/index.jsx
// Left-hand navigation shared by every /account page. Styled to match the
// existing profile page (gold accents, DM Sans, 1.5px #ece8de rules).

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { INK, GOLD, LINE, MUTED, FONT_BODY } from '../AccountUI';

const ITEMS = [
  { href: '/account/profile',      label: 'Profile',      icon: '◐' },
  { href: '/account/wallet',       label: 'Wallet',       icon: '◈' },
  { href: '/account/referrals',    label: 'Referrals',    icon: '◇' },
  { href: '/account/products',     label: 'Products',     icon: '◎' },
  { href: '/account/subscription', label: 'Subscription', icon: '★' },
  { href: '/account/settings',     label: 'Settings',     icon: '⚙' },
];

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Account" style={S.nav}>
      <div style={S.label}>My account</div>
      <div style={S.list}>
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              style={{
                ...S.item,
                background: active ? GOLD + '18' : 'transparent',
                color: active ? INK : MUTED,
                fontWeight: active ? 600 : 500,
                borderColor: active ? GOLD + '55' : 'transparent',
              }}
            >
              <span style={{ ...S.icon, color: active ? GOLD : '#b8b0a2' }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

const S = {
  nav: {
    fontFamily: FONT_BODY,
    position: 'sticky',
    top: 24,
  },
  label: {
    fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase',
    color: MUTED, fontWeight: 600,
    padding: '0 12px 10px',
    borderBottom: `1.5px solid ${LINE}`,
    marginBottom: 10,
  },
  list: { display: 'flex', flexDirection: 'column', gap: 2 },
  item: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 12px',
    borderRadius: 8,
    border: '1.5px solid transparent',
    fontSize: 13.5,
    textDecoration: 'none',
    transition: 'background .15s, color .15s',
  },
  icon: { fontSize: 13, width: 14, textAlign: 'center', flexShrink: 0 },
};
