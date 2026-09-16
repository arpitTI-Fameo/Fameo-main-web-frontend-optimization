'use client';
// hooks/useAuthCta.js
//
// The home page has three places that shout LOGIN / SIGN UP at the visitor:
// the top nav, the floating pill over the scroll hero, and the outro's top
// row. All three are acquisition CTAs — and all three are dead weight once
// somebody is signed in. Worse than dead weight: being asked to sign up while
// already signed in reads as "the site doesn't know who I am."
//
// This hook gives each of those places the same answer to "what goes here
// instead", without forcing them to share markup — the pill, the outro and the
// nav all have very different visual languages and should keep them.
//
// The swap, in short:
//   LOGIN   → who you are   (avatar + first name, links to the profile)
//   SIGN UP → what's next   (the next commercial step for this account)
//
// "What's next" is derived from the account rather than hardcoded, so the
// button keeps earning its place instead of becoming furniture:
//   • no profile photo  → finish setting up (an empty profile is the single
//                         biggest reason a creator doesn't get found)
//   • free plan         → see plans (this is the slot SIGN UP used to occupy,
//                         so it stays a conversion slot)
//   • paying member     → straight into the account
//
// Usage:
//   const { hydrated, isLoggedIn, firstName, initials, photo, cta } = useAuthCta();
//   if (!hydrated) return <span className="…-skeleton" />;
//   return isLoggedIn
//     ? <><MyChip name={firstName} /><MyButton href={cta.href}>{cta.label}</MyButton></>
//     : <><Login /><SignUp /></>;

import { useAuthStore } from '@/store/authStore';
import { useAuthHydrated } from '@/lib/hooks/custome/useAuthHydrated';
import { useProfilePhoto } from '@/lib/hooks/custome/useProfilePhoto';
import { ROUTES } from '@/constants/routes';

const firstNameOf = (name = '') => (name.trim().split(/\s+/)[0] || 'there');

const initialsOf = (name = '') => {
  const p = name.trim().split(/\s+/).filter(Boolean);
  return p.length ? (p[0][0] + (p[1]?.[0] || '')).toUpperCase() : 'F';
};

export function useAuthCta() {
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const photo = useProfilePhoto(user);

  const isLoggedIn = Boolean(user);
  const tier = user?.membership?.type || 'free';

  let cta;
  if (!isLoggedIn) {
    cta = { label: 'SIGN UP', href: ROUTES.REGISTER };
  } else if (!photo) {
    cta = { label: 'FINISH PROFILE', href: ROUTES.ACCOUNT_PROFILE };
  } else if (tier === 'free') {
    cta = { label: 'SEE PLANS', href: ROUTES.PLANS };
  } else {
    cta = { label: 'MY PROFILE', href: ROUTES.ACCOUNT_PROFILE };
  }

  return {
    hydrated,          // false until the persisted store has been read
    isLoggedIn,
    user,
    tier,
    photo,             // https URL or null
    firstName: isLoggedIn ? firstNameOf(user.name) : '',
    initials: isLoggedIn ? initialsOf(user.name) : '',
    cta,               // { label, href }
    profileHref: ROUTES.ACCOUNT_PROFILE,
    loginHref: ROUTES.LOGIN,
  };
}

export default useAuthCta;