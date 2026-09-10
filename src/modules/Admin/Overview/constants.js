export const ROLE_ACCENT = { 
  superAdmin: "#C9A96E", 
  moduleMaster: "#7eb8d8", 
  contentManager: "#b89fd4", 
  supportAgent: "#7ec87e" 
};

export const FLAG_LABELS = {
  progressTracking: "Progress Tracking", moduleFollowing: "Module Following",
  qaComments: "Q&A Comments", shopAndCTAs: "Shop & CTAs",
  contentApprovalWorkflow: "Approval Workflow", moduleGlossary: "Module Glossary",
  liveSessionScheduling: "Live Sessions", learnerRegistration: "Learner Registration",
};

export function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (d < 1) return "just now"; if (d < 60) return `${d}m ago`;
  if (d < 1440) return `${Math.floor(d / 60)}h ago`; return `${Math.floor(d / 1440)}d ago`;
}

export function greeting() { 
  const h = new Date().getHours(); 
  return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening"; 
}
