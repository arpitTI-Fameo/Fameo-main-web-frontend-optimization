"use client";

import { useState, useEffect } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useAdminStats, useAdminActivity, useAdminSettings, useUpdateAdminFeatureFlagMutation } from "@/lib/hooks/admin/useOverview";
import { useAdminApprovals, useReviewApprovalMutation } from "@/lib/hooks/admin/useApprovals";
import { useAdminCourses, useCreateAdminCourseMutation, useTogglePublishAdminCourseMutation, useToggleFeatureAdminCourseMutation } from "@/lib/hooks/admin/useCourses";
import { useSocket } from "@/lib/hooks/custome/useSocket";
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

  const [flagSaving, setFlagSaving] = useState({});
  const [toast, setToast] = useState(null);

  const canEditCourses = ["superAdmin", "contentManager"].includes(role);

  const statsQuery = useAdminStats();
  const activityQuery = useAdminActivity(8);
  const approvalsQuery = useAdminApprovals("pending", { enabled: canApprove });
  const settingsQuery = useAdminSettings({ enabled: isSA });
  const coursesQuery = useAdminCourses({ enabled: canEditCourses });

  const createCourseMutation = useCreateAdminCourseMutation();
  const togglePublishCourseMutation = useTogglePublishAdminCourseMutation();
  const toggleFeatureCourseMutation = useToggleFeatureAdminCourseMutation();
  const updateFeatureFlagMutation = useUpdateAdminFeatureFlagMutation();
  const reviewApprovalMutation = useReviewApprovalMutation();

  const loading = statsQuery.isPending || activityQuery.isPending || (canApprove && approvalsQuery.isPending) || (isSA && settingsQuery.isPending);

  const stats = statsQuery.error ? { totalTopics: 48, publishedTopics: 34, draftTopics: 9, pendingApprovals: 3, totalLearners: 1240, activeLearners: 387, revenue: "₹2,84,000" } : statsQuery.data?.data;
  const activity = activityQuery.error ? [
    { action: "Published", target: "Creator Foundations — Lesson 3", user: "Admin", time: "2m ago", color: "#7ec87e" },
    { action: "Approved", target: "Monetization Template Pack", user: "Admin", time: "14m ago", color: "#C9A96E" },
    { action: "Archived", target: "Old Brand Deal Guide", user: "Kiran M.", time: "1h ago", color: "#d49090" },
    { action: "Enrolled", target: "45 new learners today", user: "system", time: "2h ago", color: "#7eb8d8" },
  ] : (activityQuery.data?.data?.activity || []);
  const pending = approvalsQuery.error ? [
    { _id: "1", title: "Reels Algorithm Deep Dive", submittedByName: "Kiran M.", type: "topic", submittedAt: new Date(Date.now() - 3600000).toISOString() },
    { _id: "2", title: "Brand Deal Template Pack", submittedByName: "Priya S.", type: "product", submittedAt: new Date(Date.now() - 7200000).toISOString() },
  ] : (approvalsQuery.data?.data?.approvals || approvalsQuery.data?.data || []);
  const flags = settingsQuery.error ? { progressTracking: true, moduleFollowing: true, qaComments: true, shopAndCTAs: true, contentApprovalWorkflow: true, moduleGlossary: false, liveSessionScheduling: false, learnerRegistration: true } : (settingsQuery.data?.data?.features || {});

  let catalog = [];
  if (canEditCourses) {
    const dbCourses = coursesQuery.data?.data?.courses || coursesQuery.data?.data || [];
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
    catalog = coursesQuery.error ? COURSES.map(c => ({ ...c, _id: c.id, isPublished: false, isFeatured: false, _static: true })) : [...dbCourses, ...staticOnly];
  }

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };



  const migrateCourse = async (course, { silent = false } = {}) => {
    try {
      const { _static, _id, updatedAt, ...payload } = course;
      const data = await createCourseMutation.createCourse({
        ...payload,
        courseId: course.id || course.slug,
        enrolled: course.enrolled || course.enrolledCount || 0,
        lessons: course.lessons || course.totalLessons || 0,
        rating: course.rating || 0,
        reviews: course.reviews || course.reviewCount || 0,
        isPublished: false,
      });
      if (!silent) { showToast("Course saved to database ◉"); coursesQuery.refetch(); }
      return data?.data?.course || null;
    } catch (e) {
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
      const data = await togglePublishCourseMutation.togglePublish(target._id);
      showToast(data?.data?.isPublished ? "Published live ◉" : "Unpublished");
    } catch { showToast("Failed", false); return; }
    coursesQuery.refetch();
  };

  const toggleFeatureCourse = async (course) => {
    let target = course;
    if (course._static) {
      target = await migrateCourse(course, { silent: true });
      if (!target?._id) { showToast("Couldn't save course to DB", false); return; }
    }
    try {
      await toggleFeatureCourseMutation.toggleFeature(target._id);
      showToast("Featured status updated");
    } catch { showToast("Failed", false); return; }
    coursesQuery.refetch();
  };



  const refetchAll = () => {
    statsQuery.refetch();
    activityQuery.refetch();
    if (canApprove) approvalsQuery.refetch();
    if (isSA) settingsQuery.refetch();
  };

  useSocket({
    "topic:published": refetchAll,
    "topic:archived": refetchAll,
    "course:published": () => coursesQuery.refetch(),
    "course:unpublished": () => coursesQuery.refetch(),
    "course:updated": () => coursesQuery.refetch(),
    "course:deleted": () => coursesQuery.refetch(),
    "settings:updated": () => settingsQuery.refetch(),
  });

  const approveItem = async (id) => {
    try {
      await reviewApprovalMutation.reviewApproval({ id, form: { status: "approved" } });
      approvalsQuery.refetch();
      showToast("Approved — published live ◉");
    } catch { showToast("Failed", false); }
  };

  const rejectItem = async (id) => {
    try {
      await reviewApprovalMutation.reviewApproval({ id, form: { status: "rejected" } });
      approvalsQuery.refetch();
      showToast("Rejected");
    } catch { showToast("Failed", false); }
  };

  const toggleFlag = async (key) => {
    const next = { ...flags, [key]: !flags[key] };
    setFlagSaving(s => ({ ...s, [key]: true }));
    try {
      await updateFeatureFlagMutation.toggleFlag({ [key]: next[key] });
      settingsQuery.refetch();
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
