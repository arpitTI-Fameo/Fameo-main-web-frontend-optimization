import { S } from '../styles';

export default function LoginForm({ submit, loading, email, setEmail, password, setPassword, error }) {
    return (
        <>
            {error && <div style={S.err}>✕ {error}</div>}

            <form onSubmit={submit} style={S.form}>
                <div style={S.field}>
                    <label style={S.label}>Email</label>
                    <input style={S.input} type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="admin@fameo.in" required autoComplete="email" />
                </div>
                <div style={S.field}>
                    <label style={S.label}>Password</label>
                    <input style={S.input} type="password" value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••" required autoComplete="current-password" />
                </div>
                <button type="submit" disabled={loading} style={{ ...S.submit, opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Signing in…" : "Sign In →"}
                </button>
            </form>
        </>
    );
}
