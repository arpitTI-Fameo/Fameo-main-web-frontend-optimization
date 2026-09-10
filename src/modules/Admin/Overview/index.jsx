"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";
import { COURSES } from "@/constants/courses";
import { S } from './styles';
import { ROLE_ACCENT } from './constants';

import OverviewHeader from './OverviewHeader';
import StatCards from './StatCards';
import CourseCatalog from './CourseCatalog';
import PendingApprovals from './PendingApprovals';
import MySubmissions from './MySubmissions';
import ActivityFeed from './ActivityFeed';
import OverviewFeatureFlags from './OverviewFeatureFlags';

export function Overview() {
  const { user } = useAdminAuthStore();
  const role = user?.role;
  const accent = ROLE_ACCENT[role] || "#C9A96E";

  const canApprove = ["superAdmin", "contentManager"].includes(role);
  const canCreate = ["superAdmin", "contentManager", "moduleMaster"].includes(role);
  const isSA = role === "superAdmin";
  const isSupport = role === "supportAgent";
  const isMM = role === "moduleMaster";

  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [activity, setActivity] = useState([]);
  const [flags, setFlags] = useState({});
  const [flagSaving, setFlagSaving] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

  const canEditCourses = ["superAdmin", "contentManager"].includes(role);
  const [catalog, setCatalog] = useState([]);

  const loadCatalog = useCallback(async () => {
    if (!canEditCourses) return;
    try {
      const data = await api.get("/courses/admin/list");
      const dbCourses = data?.data?.courses || [];
      const dbSlugs = new Set(dbCourses.map(c => c.slug));
      const staticOnly = COURSES
        .filter(c => !dbSlugs.has(c.slug))
        .map(c => ({
          ...c,
          _id: c.id,
          isPublished: false,
          isFeatured: false,
          enrolledCount: c.enrolled || 0,
          totalLessons: c.lessons || 0,
          _static: true,
        }));
      setCatalog([...dbCourses, ...staticOnly]);
    } catch {
      setCatalog(COURSES.map(c => ({ ...c, _id: c.id, isPublished: false, isFeatured: false, _static: true })));
    }
  }, [canEditCourses]);

  useEffect(() => { loadCatalog(); }, [loadCatalog]);

  const migrateCourse = async (course, { silent = false } = {}) => {
    try {
      const { _static, _id, updatedAt, ...payload } = course;
      const data = await api.post("/courses/admin", {
        ...payload,
        courseId: course.id || course.slug,
        enrolled: course.enrolled || course.enrolledCount || 0,
        lessons: course.lessons || course.totalLessons || 0,
        rating: course.rating || 0,
        reviews: course.reviews || course.reviewCount || 0,
        isPublished: false,
      });
      if (!silent) { showToast("Course saved to database ◉"); loadCatalog(); }
      return data?.data?.course || null;
    } catch (e) {
      if (e.message?.includes("already exists")) {
        try {
          const list = await api.get("/courses/admin/list");
          const found = (list?.data?.courses || []).find(c => c.slug === course.slug);
          if (!silent) loadCatalog();
          return found || null;
        } catch { return null; }
      }
      if (!silent) showToast("Couldn't save course", false);
      return null;
    }
  };

  const togglePublishCourse = async (course) => {
    let target = course;
    if (course._static) {
      target = await migrateCourse(course, { silent: true });
      if (!target?._id) { showToast("Couldn't save course to DB", false); return; }
    }
    try {
      const data = await api.patch(`/courses/admin/${target._id}/toggle-publish`, {});
      showToast(data?.data?.isPublished ? "Published live ◉" : "Unpublished");
    } catch { showToast("Failed", false); return; }
    loadCatalog();
  };

  const toggleFeatureCourse = async (course) => {
    let target = course;
    if (course._static) {
      target = await migrateCourse(course, { silent: true });
      if (!target?._id) { showToast("Couldn't save course to DB", false); return; }
    }
    try {
      await api.patch(`/courses/admin/${target._id}/feature`, {});
      showToast("Featured status updated");
    } catch { showToast("Failed", false); return; }
    loadCatalog();
  };

  const loadData = useCallback(async () => {
    try {
      const calls = [
        api.get("/admin/stats"),
        api.get("/admin/activity?limit=8"),
      ];
      if (canApprove) calls.push(api.get("/admin/approvals?status=pending&limit=5"));
      if (isSA) calls.push(api.get("/admin/settings"));

      const results = await Promise.all(calls);
      setStats(results[0]?.data);
      setActivity(results[1]?.data?.activity || []);
      if (canApprove) setPending(results[2]?.data?.approvals || []);
      if (isSA && results[3]) setFlags(results[3]?.data?.features || {});
    } catch {
      setStats({ totalTopics: 48, publishedTopics: 34, draftTopics: 9, pendingApprovals: 3, totalLearners: 1240, activeLearners: 387, revenue: "₹2,84,000" });
      if (canApprove) setPending([
        { _id: "1", title: "Reels Algorithm Deep Dive", submittedByName: "Kiran M.", type: "topic", submittedAt: new Date(Date.now() - 3600000).toISOString() },
        { _id: "2", title: "Brand Deal Template Pack", submittedByName: "Priya S.", type: "product", submittedAt: new Date(Date.now() - 7200000).toISOString() },
      ]);
      setActivity([
        { action: "Published", target: "Creator Foundations — Lesson 3", user: "Admin", time: "2m ago", color: "#7ec87e" },
        { action: "Approved", target: "Monetization Template Pack", user: "Admin", time: "14m ago", color: "#C9A96E" },
        { action: "Archived", target: "Old Brand Deal Guide", user: "Kiran M.", time: "1h ago", color: "#d49090" },
        { action: "Enrolled", target: "45 new learners today", user: "system", time: "2h ago", color: "#7eb8d8" },
      ]);
      if (isSA) setFlags({ progressTracking: true, moduleFollowing: true, qaComments: true, shopAndCTAs: true, contentApprovalWorkflow: true, moduleGlossary: false, liveSessionScheduling: false, learnerRegistration: true });
    }
    setLoading(false);
  }, [user, canApprove, isSA]);

  useEffect(() => { loadData(); }, [loadData]);

  useSocket({
    "topic:published": loadData,
    "topic:archived": loadData,
    "course:published": loadCatalog,
    "course:unpublished": loadCatalog,
    "course:updated": loadCatalog,
    "course:deleted": loadCatalog,
    "settings:updated": (data) => { if (data?.features) setFlags(data.features); },
  });

  const approveItem = async (id) => {
    try {
      await api.patch(`/admin/approvals/${id}`, { status: "approved" });
      setPending(p => p.filter(x => x._id !== id));
      showToast("Approved — published live ◉");
    } catch { showToast("Failed", false); }
  };

  const rejectItem = async (id) => {
    try {
      await api.patch(`/admin/approvals/${id}`, { status: "rejected" });
      setPending(p => p.filter(x => x._id !== id));
      showToast("Rejected");
    } catch { showToast("Failed", false); }
  };

  const toggleFlag = async (key) => {
    const next = { ...flags, [key]: !flags[key] };
    setFlags(next);
    setFlagSaving(s => ({ ...s, [key]: true }));
    try {
      await api.patch("/admin/settings/features", { [key]: next[key] });
      showToast(`${key} ${next[key] ? "enabled" : "disabled"} — live instantly`);
    } catch { showToast("Save failed", false); }
    setFlagSaving(s => ({ ...s, [key]: false }));
  };

  if (loading) return <div style={S.loading}><span style={{ color: accent, fontSize: 20 }}>◈</span> Loading…</div>;

  const statCards = [
    ...(isSupport ? [] : [
      { label: "Published Topics", value: stats?.publishedTopics, sub: `${stats?.draftTopics || 0} drafts`, accent: "#7ec87e", href: "/admin/content" },
    ]),
    ...(canApprove ? [
      { label: "Pending Approvals", value: stats?.pendingApprovals, sub: "need review", accent: "#C9A96E", href: "/admin/approval" },
    ] : []),
    ...(isSupport ? [
      { label: "Open Tickets", value: stats?.openTickets || "—", sub: "need response", accent: "#7ec87e", href: "/admin/support" },
      { label: "Total Learners", value: stats?.totalLearners || "—", sub: "registered users", accent: "#7eb8d8", href: "/admin/contacts" },
    ] : [
      { label: "Active Learners", value: stats?.activeLearners, sub: `of ${stats?.totalLearners?.toLocaleString() || 0} total`, accent: "#7eb8d8", href: "/admin/contacts" },
    ]),
    ...(isSA ? [{ label: "Revenue (MTD)", value: stats?.revenue, sub: "this month", accent: "#b89fd4", href: "/admin/revenue" }] : []),
  ];

  const roleSub = {
    superAdmin: "Here's what's happening on Fameo right now.",
    contentManager: "Your content queue and activity feed.",
    moduleMaster: "Your assigned modules and submission status.",
    supportAgent: "Your open tickets and learner queue.",
  }[role] || "Here's what's happening on Fameo right now.";

  return (
    <div style={S.page}>
      {toast && <div style={{ ...S.toast, background: toast.ok ? "#7ec87e" : "#d49090" }}>{toast.msg}</div>}

      <OverviewHeader 
        user={user} roleSub={roleSub} canCreate={canCreate} 
        isSA={isSA} isSupport={isSupport} role={role} accent={accent} 
      />

      <StatCards statCards={statCards} />

      {(isSA || role === "contentManager") && (
        <CourseCatalog 
          catalog={catalog} canEditCourses={canEditCourses} 
          accent={accent} togglePublishCourse={togglePublishCourse} 
          toggleFeatureCourse={toggleFeatureCourse} 
        />
      )}

      {isSupport && (
        <ActivityFeed activity={activity} />
      )}

      {isMM && (
        <div style={S.twoCol}>
          <MySubmissions pending={pending} accent={accent} />
          <ActivityFeed activity={activity} />
        </div>
      )}

      {canApprove && (
        <div style={S.twoCol}>
          <PendingApprovals pending={pending} accent={accent} approveItem={approveItem} rejectItem={rejectItem} />
          <ActivityFeed activity={activity} />
        </div>
      )}

      {isSA && (
        <OverviewFeatureFlags 
          flags={flags} flagSaving={flagSaving} 
          toggleFlag={toggleFlag} accent={accent} 
        />
      )}
    </div>
  );
}

export default Overview;
