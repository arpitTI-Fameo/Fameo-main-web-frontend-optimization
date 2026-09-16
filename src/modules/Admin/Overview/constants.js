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

export function greeting() { 
  const h = new Date().getHours(); 
  return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening"; 
}
