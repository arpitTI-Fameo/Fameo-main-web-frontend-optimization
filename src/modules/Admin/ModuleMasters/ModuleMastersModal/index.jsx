import { S } from '../styles';
import { MODULES } from '../constants';

export default function ModuleMastersModal({ form, setForm, invite }) {
    if (!form) return null;
    
    return (
        <div style={S.overlay}>
            <div style={S.modal}>
                <h2 style={S.modalTitle}>Invite Module Master</h2>
                {[["name", "Full name"], ["email", "Email address"]].map(([k, l]) => (
                    <div key={k} style={{ marginBottom: 14 }}>
                        <label style={S.label}>{l}</label>
                        <input style={S.input} value={form[k] || ""} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={l} />
                    </div>
                ))}
                <label style={S.label}>Assign Modules</label>
                <div style={S.modGrid}>
                    {MODULES.map((m, i) => (
                        <label key={i} style={S.modCheck}>
                            <input type="checkbox" checked={form.assignedModules?.includes(i) || false}
                                onChange={e => {
                                    const mods = e.target.checked ? [...(form.assignedModules || []), i] : (form.assignedModules || []).filter(x => x !== i);
                                    setForm(f => ({ ...f, assignedModules: mods }));
                                }} />
                            <span style={{ fontSize: 12, color: "#555" }}>{m}</span>
                        </label>
                    ))}
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
                    <button onClick={() => setForm(null)} style={S.cancelBtn}>Cancel</button>
                    <button onClick={invite} style={S.saveBtn}>Send Invite</button>
                </div>
            </div>
        </div>
    );
}
