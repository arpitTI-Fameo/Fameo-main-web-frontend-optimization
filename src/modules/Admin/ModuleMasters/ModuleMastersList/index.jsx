import { S } from '../styles';
import { MODULES } from '../constants';
import { timeAgoNumeric } from '@/utils/relativeTime';

export default function ModuleMastersList({ loading, masters, updateModules, revoke }) {
    if (loading) return <div style={S.empty}>Loading…</div>;
    
    return (
        <div style={S.list}>
            {masters.map(m => (
                <div key={m._id} style={S.card}>
                    <div style={S.cardLeft}>
                        <div style={S.avatar}>{m.name.charAt(0)}</div>
                        <div>
                            <p style={S.masterName}>{m.name}</p>
                            <p style={S.masterEmail}>{m.email}</p>
                            <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                                {(m.assignedModules || []).map(id => (
                                    <span key={id} style={S.modTag}>{MODULES[id]}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div style={S.cardRight}>
                        <p style={S.lastSeen}>Active {timeAgoNumeric(m.lastSeen)}</p>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button style={S.editBtn} onClick={() => {
                                const mods = prompt("Enter module IDs (comma separated 0-7):", m.assignedModules?.join(","));
                                if (mods !== null) updateModules(m._id, mods.split(",").map(Number).filter(n => !isNaN(n)));
                            }}>Edit Modules</button>
                            <button style={S.revokeBtn} onClick={() => revoke(m._id)}>Revoke</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
