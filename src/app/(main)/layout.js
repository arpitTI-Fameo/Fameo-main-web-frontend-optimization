// // app/(main)/layout.js
// import MainNav        from '@/components/navbar/MainNav';
// import SessionWatcher from '@/components/SessionWatcher';
// import MainFooter from '@/components/navbar/MainFooter';

// export default function MainLayout({ children }) {
//   return (
//     <>
//       <SessionWatcher />
//       <MainNav />
//       {children}
//       <MainFooter />
//     </>
//   );
// }




import MainNav       from '@/components/navbar/MainNav';
import SessionWatcher from '@/components/SessionWatcher';
import MainFooter    from '@/components/navbar/MainFooter';
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