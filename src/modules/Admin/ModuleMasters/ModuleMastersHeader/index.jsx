import { S } from '../styles';

export default function ModuleMastersHeader({ setForm }) {
    return (
        <div style={S.header}>
            <div>
                <h1 style={S.heading}>Module Masters</h1>
                <p style={S.sub}>Invite instructors and assign them to specific modules.</p>
            </div>
            <button onClick={() => setForm({ name: "", email: "", assignedModules: [] })} style={S.inviteBtn}>+ Invite Master</button>
        </div>
    );
}
