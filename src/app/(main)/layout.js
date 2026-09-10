// app/(main)/layout.js

import MainNav from '@/components/Layout/Navbar';
import SessionWatcher from '@/components/SessionWatcher';
import MainFooter from '@/components/Layout/Footer';
import WelcomeBanner from '@/components/ui/WelcomeBanner';

export default function MainLayout({ children }) {
  return (
    <>
      <SessionWatcher />
      <MainNav />
      <WelcomeBanner />
      {children}
      <MainFooter />
    </>
  );
}