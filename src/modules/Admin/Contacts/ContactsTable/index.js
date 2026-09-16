import { S } from '../styles';
import { daysAgo } from '@/utils/relativeTime';

const ROLE_COLOR = { learner: "#7eb8d8", creator: "#C9A96E", brand: "#b89fd4", educator: "#7ec87e" };

export default function ContactsTable({ loading, users, showEmail }) {
    return (
        <div style={S.table}>
            <div style={S.thead}>
                <span style={{ flex: 2 }}>Name</span>
                {showEmail && <span style={{ flex: 2 }}>Email</span>}
                <span style={{ flex: 1 }}>Role</span>
                <span style={{ flex: 1 }}>Orders</span>
                <span style={{ flex: 1 }}>Joined</span>
                <span style={{ flex: 1 }}>Status</span>
            </div>

            {loading ? <div style={S.empty}>Loading…</div> :
                users.length === 0 ? <div style={S.empty}>No users found</div> :
                    users.map(u => (
                        <div key={u._id} style={S.trow}>
                            <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                                <div style={{ ...S.avatar, background: (ROLE_COLOR[u.role] || "#aaa") + "22", color: ROLE_COLOR[u.role] || "#aaa" }}>
                                    {u.name?.charAt(0).toUpperCase()}
                                </div>
                                <span style={S.name}>{u.name}</span>
                            </div>
                            {showEmail && <span style={{ flex: 2, fontSize: 12, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</span>}
                            <span style={{ flex: 1 }}>
                                <span style={{ ...S.rolePill, background: (ROLE_COLOR[u.role] || "#aaa") + "22", color: ROLE_COLOR[u.role] || "#888" }}>{u.role}</span>
                            </span>
                            <span style={{ flex: 1, fontSize: 12, color: "#888" }}>{u.orderCount || 0}</span>
                            <span style={{ flex: 1, fontSize: 11, color: "#bbb" }}>{daysAgo(u.createdAt)}</span>
                            <span style={{ flex: 1 }}>
                                <span style={{ ...S.statusDot, background: u.isActive ? "#7ec87e" : "#d49090", color: u.isActive ? "#3a7c3a" : "#9a3030" }}>
                                    {u.isActive ? "Active" : "Inactive"}
                                </span>
                            </span>
                        </div>
                    ))
            }
        </div>
    );
}
