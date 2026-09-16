import { S } from '../styles';
import { DEFAULT_LOCALE } from '@/constants/locale';

export default function LookupTab({
  lookupQuery, setLookupQ, lookupLearner, looking, lookupResult, setTab, setSearch
}) {
  return (
    <div style={S.lookupSection}>
      <p style={{ fontSize: 13, color: "#aaa", marginBottom: 16 }}>
        Search learner profiles by name or email to diagnose support issues.
      </p>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input style={{ ...S.search, flex: 1 }} placeholder="Name or email…"
          value={lookupQuery} onChange={e => setLookupQ(e.target.value)}
          onKeyDown={e => e.key === "Enter" && lookupLearner()} />
        <button style={S.lookupBtn} onClick={lookupLearner} disabled={looking}>
          {looking ? "Searching…" : "Search"}
        </button>
      </div>

      {lookupResult && (
        lookupResult.length === 0 ? <p style={{ fontSize: 13, color: "#bbb" }}>No learners found</p> :
          lookupResult.map(u => (
            <div key={u._id} style={S.learnerCard}>
              <div style={S.learnerAvatar}>
                {u.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={S.learnerName}>{u.name}</p>
                <p style={S.learnerEmail}>{u.email}</p>
                <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                  <span style={S.learnerStat}>Joined {new Date(u.createdAt).toLocaleDateString(DEFAULT_LOCALE)}</span>
                  <span style={S.learnerStat}>Orders: {u.orderCount || 0}</span>
                  <span style={S.learnerStat}>Role: {u.role}</span>
                </div>
              </div>
              <button style={S.ticketForLearnerBtn}
                onClick={() => { setTab("tickets"); setSearch(u.name); }}>
                View Tickets →
              </button>
            </div>
          ))
      )}
    </div>
  );
}
