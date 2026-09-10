import { S } from '../styles';
import { PRIORITY_COLOR, STATUS_COLOR, timeAgo } from '../constants';

export default function TicketsTab({
  searchQuery, setSearch, filterStatus, setFilter,
  loading, filteredTickets, active, setActive,
  updateStatus, reply, setReply, sendReply, sending
}) {
  return (
    <div>
      <div style={S.filters}>
        <input style={S.search} placeholder="Search tickets…" value={searchQuery}
          onChange={e => setSearch(e.target.value)} />
        <select style={S.select} value={filterStatus} onChange={e => setFilter(e.target.value)}>
          <option value="open">Open</option>
          <option value="inProgress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
          <option value="all">All</option>
        </select>
      </div>

      <div style={S.layout}>
        <div style={S.ticketList}>
          {loading ? <div style={S.empty}>Loading…</div> :
            filteredTickets.length === 0 ? <div style={S.empty}>No tickets</div> :
              filteredTickets.map(t => (
                <div key={t._id} onClick={() => setActive(t)}
                  style={{ ...S.ticket, background: active?._id === t._id ? "#fef9f0" : "#fff", borderLeft: active?._id === t._id ? "3px solid #C9A96E" : "3px solid transparent" }}>
                  <div style={S.ticketTop}>
                    <span style={S.ticketSubject}>{t.subject}</span>
                    <span style={{ ...S.priorityDot, background: PRIORITY_COLOR[t.priority] || "#aaa" }} title={t.priority} />
                  </div>
                  <p style={S.ticketMeta}>{t.learnerName} · {timeAgo(t.created)}</p>
                  <span style={{ ...S.statusBadge, background: (STATUS_COLOR[t.status] || "#aaa") + "22", color: STATUS_COLOR[t.status] || "#aaa" }}>
                    {t.status}
                  </span>
                </div>
              ))
          }
        </div>

        <div style={S.ticketDetail}>
          {!active ? (
            <div style={S.emptyDetail}>
              <span style={{ fontSize: 24, marginBottom: 8 }}>◎</span>
              <span>Select a ticket to view details</span>
            </div>
          ) : (
            <>
              <div style={S.detailHeader}>
                <div>
                  <h2 style={S.detailTitle}>{active.subject}</h2>
                  <p style={S.detailMeta}>
                    From <strong>{active.learnerName}</strong>
                    {active.learnerEmail && ` — ${active.learnerEmail}`}
                    {" · "}{timeAgo(active.created)}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {active.status === "open" && (
                    <button style={S.inProgressBtn} onClick={() => updateStatus(active._id, "inProgress")}>
                      → In Progress
                    </button>
                  )}
                  {active.status !== "resolved" && (
                    <button style={S.resolveBtn} onClick={() => updateStatus(active._id, "resolved")}>
                      ✓ Resolve
                    </button>
                  )}
                  {active.status !== "closed" && (
                    <button style={S.closeBtn} onClick={() => updateStatus(active._id, "closed")}>
                      Close
                    </button>
                  )}
                </div>
              </div>

              <div style={S.messages}>
                {(active.messages || []).length === 0 ? (
                  <p style={{ fontSize: 13, color: "#bbb", textAlign: "center", padding: "20px 0" }}>No messages yet</p>
                ) : (active.messages || []).map((m, i) => (
                  <div key={i} style={{ ...S.message, alignSelf: m.from === "admin" ? "flex-end" : "flex-start" }}>
                    <div style={{ ...S.messageBubble, background: m.from === "admin" ? "#1a1208" : "#f5f5f2", color: m.from === "admin" ? "#F0E8D6" : "#1a1208" }}>
                      {m.text}
                    </div>
                    <span style={S.messageTime}>{m.from === "admin" ? "You" : "Learner"} · {timeAgo(m.time)}</span>
                  </div>
                ))}
              </div>

              {active.status !== "resolved" && active.status !== "closed" && (
                <div style={S.replyBox}>
                  <textarea style={S.replyInput} value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Type your reply…" rows={3} />
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                    <button style={S.replyBtn} disabled={sending || !reply.trim()} onClick={sendReply}>
                      {sending ? "Sending…" : "Send Reply →"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
