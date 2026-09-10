// 'use client';
// import { useState, useEffect } from 'react';
// import '@/app/community.css';

// import CommunitySidebar from './CommunitySidebar';
// import CommunityTopbar from './CommunityTopbar';
// import CommunityHome from './pages/CommunityHome';
// import CommunitySpaces from './pages/CommunitySpaces';
// import CommunityFeedback from './pages/CommunityFeedback';
// import CommunityEvents from './pages/CommunityEvents';
// import CommunityModeration from './pages/CommunityModeration';
// import CommunityProfile from './pages/CommunityProfile';
// import PostModal from './modals/PostModal';
// import SubmitFeedbackModal from './modals/SubmitFeedbackModal';
// import ReportModal from './modals/ReportModal';
// import OnboardingModal from './modals/OnboardingModal';
// import { ToastContainer } from './ui/Toast';

// // Map sidebar nav IDs to page component keys
// const PAGE_MAP = {
//   home: 'home',
//   spaces: 'spaces',
//   feedback: 'feedback',
//   events: 'events',
//   safety: 'safety',
// };

// export default function CommunityLayout({ initialPage, searchParams }) {
//   const [activePage, setActivePage] = useState(initialPage || 'home');
//   const [profileStack, setProfileStack] = useState([]); // { userId, userName }[]
//   const [showOnboarding, setShowOnboarding] = useState(false);

//   // Modals
//   const [postModalOpen, setPostModalOpen] = useState(false);
//   const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
//   const [reportModal, setReportModal] = useState(null); // { targetType, targetName, targetId }

//   // Mock current user
//   const currentUser = {
//     name: 'Priya Sharma', initial: 'P',
//     gradient: 'linear-gradient(135deg,#e0488a,#a855f7)',
//     niche: 'Fashion · 48K followers',
//   };

//   // Check onboarding on mount
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const done = localStorage.getItem('fameo_community_onboarded');
//       if (!done) setShowOnboarding(true);
//     }
//   }, []);

//   // Auto-open feedback modal from ?open=submit query param
//   useEffect(() => {
//     if (searchParams?.get?.('open') === 'submit') {
//       setActivePage('feedback');
//       setFeedbackModalOpen(true);
//     }
//   }, [searchParams]);

//   // Mobile hamburger visibility
//   useEffect(() => {
//     const hamburger = document.getElementById('cm-hamburger');
//     if (hamburger) hamburger.style.display = window.innerWidth < 900 ? 'flex' : 'none';
//   }, []);

//   function navigate(pageId) {
//     if (pageId.startsWith('space-')) {
//       setActivePage('spaces');
//       return;
//     }
//     if (pageId === 'profile-self') {
//       setProfileStack([{ userId: 'priya_sharma', userName: 'Priya Sharma' }]);
//       return;
//     }
//     setActivePage(pageId);
//     setProfileStack([]);
//     closeMobileOverlay();
//   }

//   function openProfile(userId, userName) {
//     setProfileStack(prev => [...prev, { userId, userName }]);
//   }

//   function popProfile() {
//     setProfileStack(prev => prev.slice(0, -1));
//   }

//   function openReport(targetType, targetName, targetId) {
//     setReportModal({ targetType, targetName, targetId });
//   }

//   function closeMobileOverlay() {
//     const overlay = document.getElementById('cm-mob-overlay');
//     const sidebar = document.getElementById('cm-sidebar');
//     overlay?.classList.remove('open');
//     if (sidebar) sidebar.style.transform = '';
//   }

//   // Determine what to render as main content
//   const topProfile = profileStack[profileStack.length - 1];

//   function renderMain() {
//     // Profile view (stacked on top of any page)
//     if (topProfile) {
//       return (
//         <CommunityProfile
//           userId={topProfile.userId}
//           userName={topProfile.userName}
//           onBack={popProfile}
//           onProfileClick={openProfile}
//           onReport={openReport}
//         />
//       );
//     }

//     switch (activePage) {
//       case 'home':
//         return <CommunityHome onNavigate={navigate} onProfileClick={openProfile} onReport={openReport} />;
//       case 'spaces':
//         return <CommunitySpaces onProfileClick={openProfile} onReport={openReport} />;
//       case 'feedback':
//         return <CommunityFeedback onProfileClick={openProfile} onOpenSubmitModal={() => setFeedbackModalOpen(true)} />;
//       case 'events':
//         return <CommunityEvents onProfileClick={openProfile} />;
//       case 'safety':
//         return <CommunityModeration onProfileClick={openProfile} />;
//       default:
//         return <CommunityHome onNavigate={navigate} onProfileClick={openProfile} onReport={openReport} />;
//     }
//   }

//   const mainPageId = topProfile ? activePage : activePage;

//   return (
//     <div className="cm-root" style={{ fontFamily: 'var(--cm-font)', background: 'var(--cm-bg)', color: 'var(--cm-text)', minHeight: '100vh' }}>
//       {/* Sidebar */}
//       <CommunitySidebar activePage={activePage} onNavigate={navigate} user={currentUser} />

//       {/* Mobile overlay backdrop */}
//       <div
//         id="cm-mob-overlay"
//         style={{ display: 'none' }}
//         onClick={closeMobileOverlay}
//       />

//       {/* Main content area */}
//       <div style={{
//         marginLeft: 'var(--cm-nav-width)',
//         minHeight: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//       }}>
//         {/* Topbar */}
//         <CommunityTopbar
//           activePage={topProfile ? '_profile' : activePage}
//           onNavigate={navigate}
//           onOpenPostModal={() => setPostModalOpen(true)}
//           onOpenFeedbackModal={() => {
//             setActivePage('feedback');
//             setFeedbackModalOpen(true);
//           }}
//           isLive={true}
//         />

//         {/* Page content */}
//         <div style={{ flex: 1 }}>
//           {renderMain()}
//         </div>
//       </div>

//       {/* ── Modals ── */}

//       {postModalOpen && (
//         <PostModal
//           onClose={() => setPostModalOpen(false)}
//           onSubmit={() => {
//             window.showToast?.('✦ Discussion posted successfully!', 'success');
//           }}
//         />
//       )}

//       {feedbackModalOpen && (
//         <SubmitFeedbackModal
//           onClose={() => setFeedbackModalOpen(false)}
//           onSubmit={() => {
//             window.showToast?.('◎ Submitted for peer review. You\'ll be notified when feedback arrives.', 'success');
//           }}
//         />
//       )}

//       {reportModal && (
//         <ReportModal
//           targetType={reportModal.targetType}
//           targetName={reportModal.targetName}
//           onClose={() => setReportModal(null)}
//           onSubmit={() => {
//             window.showToast?.('🚩 Report submitted. We\'ll review within 24h.', 'info');
//           }}
//         />
//       )}

//       {showOnboarding && (
//         <OnboardingModal
//           onComplete={(niches) => {
//             setShowOnboarding(false);
//             window.showToast?.('Welcome to Fameo Community! ✦', 'success');
//           }}
//         />
//       )}

//       {/* Toast container */}
//       <ToastContainer />

//       {/* Mobile responsive styles */}
//       <style>{`
//         @media (max-width: 900px) {
//           #cm-hamburger { display: flex !important; }
//           #cm-sidebar {
//             transform: translateX(-100%);
//             z-index: 200;
//           }
//           #cm-mob-overlay {
//             display: block !important;
//             position: fixed;
//             inset: 0;
//             background: rgba(0,0,0,0.6);
//             z-index: 100;
//             opacity: 0;
//             pointer-events: none;
//             transition: opacity .25s;
//           }
//           #cm-mob-overlay.open {
//             opacity: 1;
//             pointer-events: auto;
//           }
//           [style*="margin-left: var(--cm-nav-width)"] {
//             margin-left: 0 !important;
//           }
//         }
//         @media (max-width: 1100px) {
//           .cm-events-grid { grid-template-columns: repeat(2, 1fr) !important; }
//         }
//         @media (max-width: 760px) {
//           .cm-feedback-grid { grid-template-columns: 1fr !important; }
//           .cm-events-grid { grid-template-columns: 1fr !important; }
//         }
//       `}</style>
//     </div>
//   );
// }

// 'use client';
// // components/community/CommunityLayout.js
// // The master orchestrator for the community section.
// // Manages: active page, profile navigation stack, all modal states,
// // mobile sidebar, onboarding check, toast system, notification state.

// import { useState, useEffect, useCallback, useRef } from 'react';
// import CommunitySidebar from './CommunitySidebar';
// import CommunityTopbar from './CommunityTopbar';
// import CommunityHome from './pages/CommunityHome';
// import CommunitySpaces from './pages/CommunitySpaces';
// import CommunityFeedback from './pages/CommunityFeedback';
// import CommunityEvents from './pages/CommunityEvents';
// import CommunityProfile from './pages/CommunityModerationAndProfile';
// import { PostModal, SubmitFeedbackModal, ReportModal, OnboardingModal } from './modals/Modals';
// import { ToastContainer, showToast as globalShowToast } from './ui/Toast';
// import '@/app/community.css';

// export default function CommunityLayout({ initialPage = 'home', searchParams = {} }) {
//   // ── Navigation ────────────────────────────────────────────────────────────
//   const [activePage, setActivePage]           = useState(initialPage);
//   const [profileStack, setProfileStack]       = useState([]); // [{userId, name, niche}]
//   const [sidebarOpen, setSidebarOpen]         = useState(false);

//   // ── Modal states ──────────────────────────────────────────────────────────
//   const [postModalOpen, setPostModalOpen]         = useState(false);
//   const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
//   const [reportModalOpen, setReportModalOpen]     = useState(false);
//   const [reportTarget, setReportTarget]           = useState(null);
//   const [onboardingOpen, setOnboardingOpen]       = useState(false);

//   // ── Onboarding check ─────────────────────────────────────────────────────
//   useEffect(() => {
//     const done = typeof window !== 'undefined' && localStorage.getItem('fameo_onboarded');
//     if (!done) {
//       const t = setTimeout(() => setOnboardingOpen(true), 600);
//       return () => clearTimeout(t);
//     }
//   }, []);

//   // ── Handle ?open=submit query param ──────────────────────────────────────
//   useEffect(() => {
//     if (searchParams?.open === 'submit') {
//       setFeedbackModalOpen(true);
//     }
//   }, [searchParams]);

//   // ── Close mobile sidebar on page change ──────────────────────────────────
//   const navigate = useCallback((page) => {
//     setActivePage(page);
//     setSidebarOpen(false);
//     setProfileStack([]);
//   }, []);

//   // ── Profile stack (push/pop for in-community profile viewing) ─────────────
//   const openProfile = useCallback((userId, name, niche) => {
//     setProfileStack(prev => [...prev, { userId, name, niche }]);
//     setActivePage('profile');
//     setSidebarOpen(false);
//   }, []);

//   const closeProfile = useCallback(() => {
//     setProfileStack(prev => {
//       const next = prev.slice(0, -1);
//       if (next.length === 0) setActivePage('home');
//       return next;
//     });
//   }, []);

//   // ── Open report modal ────────────────────────────────────────────────────
//   const openReport = useCallback((target) => {
//     setReportTarget(target);
//     setReportModalOpen(true);
//   }, []);

//   // ── Onboarding complete ──────────────────────────────────────────────────
//   const completeOnboarding = useCallback(() => {
//     if (typeof window !== 'undefined') localStorage.setItem('fameo_onboarded', '1');
//     setOnboardingOpen(false);
//   }, []);

//   // ── Current profile context ──────────────────────────────────────────────
//   const currentProfile = profileStack[profileStack.length - 1] || null;

//   // ── Shared props passed down to all pages ────────────────────────────────
//   const pageProps = {
//     onNavigate:    navigate,
//     onOpenProfile: openProfile,
//     onOpenReport:  openReport,
//     onOpenPost:    () => setPostModalOpen(true),
//     onOpenFeedback:() => setFeedbackModalOpen(true),
//     showToast:     globalShowToast,
//   };

//   return (
//     <div className="cm-root">
//       {/* Toast container (global) */}
//       <ToastContainer />

//       <div className="cm-app">

//         {/* ── Mobile overlay ─────────────────────────────────────────── */}
//         {sidebarOpen && (
//           <div
//             onClick={() => setSidebarOpen(false)}
//             style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:180 }}
//           />
//         )}

//         {/* ── Sidebar ────────────────────────────────────────────────── */}
//         <CommunitySidebar
//           activePage={activePage}
//           onNavigate={navigate}
//           onOpenProfile={openProfile}
//           sidebarOpen={sidebarOpen}
//         />

//         {/* ── Main content ───────────────────────────────────────────── */}
//         <div className="cm-main">

//           {/* Topbar */}
//           <CommunityTopbar
//             activePage={activePage}
//             onNavigate={navigate}
//             onOpenPost={() => setPostModalOpen(true)}
//             onOpenFeedback={() => setFeedbackModalOpen(true)}
//             onHamburger={() => setSidebarOpen(v => !v)}
//           />

//           {/* Pages */}
//           {activePage === 'home' && (
//             <CommunityHome {...pageProps} />
//           )}
//           {activePage === 'spaces' && (
//             <CommunitySpaces {...pageProps} />
//           )}
//           {activePage === 'feedback' && (
//             <CommunityFeedback {...pageProps} />
//           )}
//           {activePage === 'events' && (
//             <CommunityEvents {...pageProps} />
//           )}
//           {(activePage === 'moderation' || activePage === 'safety') && (
//             <CommunityProfile
//               page={activePage}
//               onNavigate={navigate}
//               showToast={globalShowToast}
//               {...pageProps}
//             />
//           )}
//           {activePage === 'profile' && currentProfile && (
//             <CommunityProfile
//               page="profile"
//               profile={currentProfile}
//               onBack={closeProfile}
//               showToast={globalShowToast}
//               {...pageProps}
//             />
//           )}
//         </div>
//       </div>

//       {/* ── Modals ─────────────────────────────────────────────────────────── */}
//       {postModalOpen && (
//         <PostModal
//           onClose={() => setPostModalOpen(false)}
//           onSuccess={(msg) => { setPostModalOpen(false); globalShowToast(msg || '✦ Discussion posted!', 'success'); }}
//           showToast={globalShowToast}
//         />
//       )}
//       {feedbackModalOpen && (
//         <SubmitFeedbackModal
//           onClose={() => setFeedbackModalOpen(false)}
//           onSuccess={() => { setFeedbackModalOpen(false); globalShowToast('◎ Submitted! You\'ll receive feedback within 24h.', 'success'); }}
//           showToast={globalShowToast}
//         />
//       )}
//       {reportModalOpen && (
//         <ReportModal
//           target={reportTarget}
//           onClose={() => { setReportModalOpen(false); setReportTarget(null); }}
//           onSuccess={() => { setReportModalOpen(false); setReportTarget(null); globalShowToast('🚩 Report submitted. We\'ll review within 24h.', 'info'); }}
//           showToast={globalShowToast}
//         />
//       )}
//       {onboardingOpen && (
//         <OnboardingModal
//           onComplete={completeOnboarding}
//         />
//       )}
//     </div>
//   );
// }

'use client';
// components/community/CommunityLayout.js
// Master orchestrator — now includes Chat and Podcast pages.
// Navigation flow:
//   Sidebar nav item click  → setActivePage(id)
//   Profile avatar click    → pushes to profileStack → activePage='profile'
//   Chat nav click          → activePage='chat'   → renders ChatPage
//   Podcast nav click       → activePage='podcast'→ renders PodcastPage
//   "Message" on profile    → activePage='chat' + targetUser set

import { useState, useEffect, useCallback } from 'react';
import CommunitySidebar from './CommunitySidebar';
import CommunityTopbar from './CommunityTopbar';
import CommunityHome from './pages/CommunityHome';
import CommunitySpaces from './pages/CommunitySpaces';
import CommunityFeedback from './pages/CommunityFeedback';
import CommunityEvents from './pages/CommunityEvents';
import CommunityModerationAndProfile from './pages/CommunityModerationAndProfile';
import { PostModal, SubmitFeedbackModal, ReportModal, OnboardingModal } from './modals/Modals';
import { ToastContainer, showToast as globalShowToast } from './ui/Toast';
import ChatPage from './chat/ChatPage';
import PodcastPage from './podcast/PodcastPage';
import '@/app/community.css';
// SAST H-5 (extended). This read localStorage's `fameo_token` — the ADMIN
// key set by adminAuthStore, not the creator session. Regular users sent an
// empty Bearer token; admins leaked their admin JWT to community endpoints.
import { useAuthStore } from '@/store/authStore';

// Current user — in production pull from your authStore / session
const MOCK_USER = {
  _id:   'user_priya',
  id:    'user_priya',
  name:  'Priya Sharma',
  token: useAuthStore.getState().token || '',
};

export default function CommunityLayout({ initialPage = 'home', searchParams = {} }) {

  // ── Navigation state ──────────────────────────────────────────────────────
  const [activePage, setActivePage]   = useState(initialPage);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Profile drill-down stack  [{userId, name, niche}]
  const [profileStack, setProfileStack] = useState([]);

  // Chat — when navigating from profile "Message" button
  const [chatTarget, setChatTarget] = useState(null); // {userId, name}

  // ── Modal states ──────────────────────────────────────────────────────────
  const [postModal,     setPostModal]     = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [reportModal,   setReportModal]   = useState(false);
  const [reportTarget,  setReportTarget]  = useState(null);
  const [onboarding,    setOnboarding]    = useState(false);

  // ── Onboarding ────────────────────────────────────────────────────────────
  useEffect(() => {
    const done = typeof window !== 'undefined' && localStorage.getItem('fameo_onboarded');
    if (!done) {
      const t = setTimeout(() => setOnboarding(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  // ── ?open=submit query param ──────────────────────────────────────────────
  useEffect(() => {
    if (searchParams?.open === 'submit') setFeedbackModal(true);
    if (searchParams?.page) navigate(searchParams.page);
  }, [searchParams]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const navigate = useCallback((page) => {
    setActivePage(page);
    setSidebarOpen(false);
    setProfileStack([]);
    setChatTarget(null);
  }, []);

  // ── Profile stack ────────────────────────────────────────────────────────
  const openProfile = useCallback((userId, name, niche) => {
    setProfileStack(prev => [...prev, { userId, name, niche }]);
    setActivePage('profile');
    setSidebarOpen(false);
  }, []);

  const closeProfile = useCallback(() => {
    setProfileStack(prev => {
      const next = prev.slice(0, -1);
      if (next.length === 0) setActivePage('home');
      return next;
    });
  }, []);

  // ── Open DM from profile ──────────────────────────────────────────────────
  // Called by profile pages "Message" button
  const openDM = useCallback((userId, name) => {
    setChatTarget({ userId, name });
    setActivePage('chat');
    setSidebarOpen(false);
    setProfileStack([]);
  }, []);

  // ── Report ────────────────────────────────────────────────────────────────
  const openReport = useCallback((target) => {
    setReportTarget(target);
    setReportModal(true);
  }, []);

  const currentProfile = profileStack[profileStack.length - 1] || null;

  // Shared props for all page components
  const pageProps = {
    onNavigate:    navigate,
    onOpenProfile: openProfile,
    onOpenReport:  openReport,
    onOpenPost:    () => setPostModal(true),
    onOpenFeedback:() => setFeedbackModal(true),
    onOpenDM:      openDM,
    showToast:     globalShowToast,
    currentUser:   MOCK_USER,
  };

  // Pages that should NOT show the community topbar
  const noTopbar = ['chat', 'podcast'];

  return (
    <div className="cm-root">
      <ToastContainer />

      <div className="cm-app">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:180 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <CommunitySidebar
          activePage={activePage}
          onNavigate={navigate}
          onOpenProfile={openProfile}
          sidebarOpen={sidebarOpen}
          user={MOCK_USER}
        />

        {/* Main */}
        <div className="cm-main">

          {/* Topbar — hidden for Chat and Podcast (they have their own) */}
          {!noTopbar.includes(activePage) && (
            <CommunityTopbar
              activePage={activePage}
              onNavigate={navigate}
              onOpenPost={() => setPostModal(true)}
              onOpenFeedback={() => setFeedbackModal(true)}
              onHamburger={() => setSidebarOpen(v => !v)}
            />
          )}

          {/* ── PAGES ── */}

          {activePage === 'home' && (
            <CommunityHome {...pageProps} />
          )}

          {activePage === 'spaces' && (
            <CommunitySpaces {...pageProps} />
          )}

          {activePage === 'feedback' && (
            <CommunityFeedback {...pageProps} />
          )}

          {activePage === 'events' && (
            <CommunityEvents {...pageProps} />
          )}

          {(activePage === 'moderation' || activePage === 'safety') && (
            <CommunityModerationAndProfile
              page={activePage}
              onNavigate={navigate}
              showToast={globalShowToast}
              {...pageProps}
            />
          )}

          {activePage === 'profile' && currentProfile && (
            <CommunityModerationAndProfile
              page="profile"
              profile={currentProfile}
              onBack={closeProfile}
              onOpenDM={openDM}
              showToast={globalShowToast}
              {...pageProps}
            />
          )}

          {/* ── CHAT ── */}
          {activePage === 'chat' && (
            <ChatPage
              currentUser={MOCK_USER}
              targetUserId={chatTarget?.userId}
              targetUserName={chatTarget?.name}
              onBack={() => navigate('home')}
            />
          )}

          {/* ── PODCAST ── */}
          {activePage === 'podcast' && (
            <PodcastPage
              currentUser={MOCK_USER}
              onBack={() => navigate('home')}
            />
          )}

        </div>
      </div>

      {/* ── Modals ── */}
      {postModal && (
        <PostModal
          onClose={() => setPostModal(false)}
          onSuccess={msg => { setPostModal(false); globalShowToast(msg || '✦ Discussion posted!', 'success'); }}
          showToast={globalShowToast}
        />
      )}
      {feedbackModal && (
        <SubmitFeedbackModal
          onClose={() => setFeedbackModal(false)}
          onSuccess={() => { setFeedbackModal(false); globalShowToast("◎ Submitted! You'll receive feedback within 24h.", 'success'); }}
          showToast={globalShowToast}
        />
      )}
      {reportModal && (
        <ReportModal
          target={reportTarget}
          onClose={() => { setReportModal(false); setReportTarget(null); }}
          onSuccess={() => { setReportModal(false); setReportTarget(null); globalShowToast('🚩 Report submitted.', 'info'); }}
          showToast={globalShowToast}
        />
      )}
      {onboarding && (
        <OnboardingModal
          onComplete={() => {
            if (typeof window !== 'undefined') localStorage.setItem('fameo_onboarded', '1');
            setOnboarding(false);
          }}
        />
      )}
    </div>
  );
}