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
import CommunityHome from './CommunityHome';
import CommunitySpaces from './CommunitySpaces';
import CommunityFeedback from './CommunityFeedback';
import CommunityEvents from './CommunityEvents';
import CommunityModerationAndProfile from './CommunityModerationAndProfile';
import { PostModal, SubmitFeedbackModal, ReportModal, OnboardingModal } from './Modals';
import { ToastContainer, showToast as globalShowToast } from './Toast';
import ChatPage from './ChatPage';
import PodcastPage from './PodcastPage';
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

export default function Community({ initialPage = 'home', searchParams = {} }) {

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
