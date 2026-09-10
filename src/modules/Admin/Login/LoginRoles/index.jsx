import { S } from '../styles';
import { ROLES } from '../constants';

export default function LoginRoles() {
    return (
        <div style={S.rolesBlock}>
            <p style={S.rolesTitle}>Access Levels</p>
            <div style={S.rolesGrid}>
                {ROLES.map(r => (
                    <div key={r.role} style={{ ...S.roleChip, borderColor: r.color + "44" }}>
                        <span style={{ ...S.roleDot, background: r.color }} />
                        <div>
                            <span style={{ ...S.roleChipName, color: r.color }}>{r.label}</span>
                            <span style={S.roleChipDesc}>{r.desc}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
