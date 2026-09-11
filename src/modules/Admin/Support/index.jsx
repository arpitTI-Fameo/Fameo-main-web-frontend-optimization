"use client";

import { useState } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useAdminSupportTickets, useAdminSupportFaqs, useReplySupportTicketMutation, useUpdateSupportTicketStatusMutation, useCreateSupportFaqMutation } from "@/lib/hooks/admin/useSupport";
import { getAdminContacts } from "@/lib/services/admin/contacts.service";
import { useSocket } from "@/lib/hooks/custome/useSocket";
import { S } from './styles';

import SupportHeader from './SupportHeader';
import SupportTabs from './SupportTabs';
import TicketsTab from './TicketsTab';
import LookupTab from './LookupTab';
import FaqTab from './FaqTab';

export function Support() {
  const { user } = useAdminAuthStore();
  const role = user?.role;

  const [active, setActive] = useState(null);
  const [reply, setReply] = useState("");
  const [tab, setTab] = useState("tickets"); // tickets | faq | lookup
  const [filterStatus, setFilter] = useState("open");
  const [searchQuery, setSearch] = useState("");
  const [lookupResult, setLookup] = useState(null);
  const [lookupQuery, setLookupQ] = useState("");
  const [looking, setLooking] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

  const ticketsQuery = useAdminSupportTickets(filterStatus);
  const faqsQuery = useAdminSupportFaqs({ enabled: tab === "faq" });
  const replyMutation = useReplySupportTicketMutation();
  const updateStatusMutation = useUpdateSupportTicketStatusMutation();
  const addFaqMutation = useCreateSupportFaqMutation();

  const loading = ticketsQuery.isPending;
  const tickets = ticketsQuery.error ? [
    { _id: "s1", subject: "Can't access Module 3", learnerName: "Aarav Sharma", learnerEmail: "aarav@example.com", status: "open", priority: "high", created: new Date(Date.now() - 3600000).toISOString(), messages: [{ from: "learner", text: "I paid but can't access module 3.", time: new Date(Date.now() - 3600000).toISOString() }] },
    { _id: "s2", subject: "Video not loading", learnerName: "Priya Nair", learnerEmail: "priya@example.com", status: "open", priority: "medium", created: new Date(Date.now() - 7200000).toISOString(), messages: [{ from: "learner", text: "Videos freeze at 2 minutes.", time: new Date(Date.now() - 7200000).toISOString() }] },
    { _id: "s3", subject: "Certificate not received", learnerName: "Rohit Verma", learnerEmail: "rohit@example.com", status: "resolved", priority: "low", created: new Date(Date.now() - 86400000).toISOString(), messages: [] },
    { _id: "s4", subject: "Wrong price shown", learnerName: "Sneha Kumar", learnerEmail: "sneha@example.com", status: "open", priority: "high", created: new Date(Date.now() - 172800000).toISOString(), messages: [{ from: "learner", text: "The checkout shows ₹4999 but the landing page says ₹2999.", time: new Date(Date.now() - 172800000).toISOString() }] },
    { _id: "s5", subject: "Progress not saving", learnerName: "Ravi Patel", learnerEmail: "ravi@example.com", status: "inProgress", priority: "medium", created: new Date(Date.now() - 259200000).toISOString(), messages: [] },
  ] : (ticketsQuery.data?.data?.tickets || ticketsQuery.data?.data || []);

  const faqs = faqsQuery.error ? [
    { _id: "f1", question: "How do I access my enrolled courses?", answer: "Go to Resources → My Courses. All your enrolled courses appear there with progress tracking.", category: "Access" },
    { _id: "f2", question: "Can I download videos for offline viewing?", answer: "Currently, videos are streaming only. Offline downloads are on our roadmap for Q3 2025.", category: "Content" },
    { _id: "f3", question: "How do I get my certificate?", answer: "Complete all lessons in a course and click 'Claim Certificate' on the course completion screen.", category: "Certificates" },
  ] : (faqsQuery.data?.data?.faqs || faqsQuery.data?.data || []);

  // Live — new ticket arrives
  useSocket({ "support:ticket_created": ticketsQuery.refetch, "support:ticket_updated": ticketsQuery.refetch });

  const sendReply = async () => {
    if (!reply.trim() || !active) return;
    setSending(true);
    try {
      await replyMutation.reply({ id: active._id, message: reply });
      setActive(prev => ({ ...prev, messages: [...(prev.messages || []), { from: "admin", text: reply, time: new Date().toISOString() }] }));
      setReply("");
      showToast("Reply sent");
    } catch {
      showToast("Send failed", false);
    }
    setSending(false);
  };

  const updateStatus = async (id, status) => {
    try {
      await updateStatusMutation.updateStatus({ id, status });
      ticketsQuery.refetch();
      if (active?._id === id) setActive(prev => ({ ...prev, status }));
      showToast(status === "resolved" ? "Ticket resolved" : `Status: ${status}`);
    } catch { showToast("Update failed", false); }
  };

  const lookupLearner = async () => {
    if (!lookupQuery.trim()) return;
    setLooking(true);
    try {
      const data = await getAdminContacts(`search=${encodeURIComponent(lookupQuery)}&limit=5`);
      setLookup(data?.data?.users || []);
    } catch {
      setLookup([{ _id: "u1", name: "Aarav Sharma", email: "aarav@example.com", role: "learner", createdAt: new Date().toISOString(), orderCount: 2 }]);
    }
    setLooking(false);
  };

  const addFaq = async () => {
    if (!newFaq.question || !newFaq.answer) return alert("Question and answer required");
    try {
      await addFaqMutation.addFaq(newFaq);
      faqsQuery.refetch();
      setNewFaq({ question: "", answer: "" });
      showToast("FAQ added");
    } catch { showToast("Failed", false); }
  };

  const filteredTickets = tickets.filter(t => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (searchQuery && !t.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.learnerName?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const openCount = tickets.filter(t => t.status === "open").length;

  return (
    <div style={S.page}>
      {toast && <div style={{ ...S.toast, background: toast.ok ? "#7ec87e" : "#d49090" }}>{toast.msg}</div>}

      <SupportHeader openCount={openCount} />

      <SupportTabs tab={tab} setTab={setTab} openCount={openCount} />

      {tab === "tickets" && (
        <TicketsTab
          searchQuery={searchQuery} setSearch={setSearch} filterStatus={filterStatus} setFilter={setFilter}
          loading={loading} filteredTickets={filteredTickets} active={active} setActive={setActive}
          updateStatus={updateStatus} reply={reply} setReply={setReply} sendReply={sendReply} sending={sending}
        />
      )}

      {tab === "lookup" && (
        <LookupTab
          lookupQuery={lookupQuery} setLookupQ={setLookupQ} lookupLearner={lookupLearner}
          looking={looking} lookupResult={lookupResult} setTab={setTab} setSearch={setSearch}
        />
      )}

      {tab === "faq" && (
        <FaqTab
          newFaq={newFaq} setNewFaq={setNewFaq} addFaq={addFaq} faqs={faqs}
        />
      )}
    </div>
  );
}

export default Support;
