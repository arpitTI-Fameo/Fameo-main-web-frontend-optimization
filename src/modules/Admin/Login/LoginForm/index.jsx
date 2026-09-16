import { S } from '../styles';

export default function LoginForm({ submit, loading, register, error }) {
    return (
        <>
            {error && <div style={S.err}>✕ {error}</div>}

            <form onSubmit={submit} style={S.form}>
                <div style={S.field}>
                    <label style={S.label}>Email</label>
                    <input style={S.input} type="email" {...register("email")}
                        placeholder="admin@fameo.in" required autoComplete="email" />
                </div>
                <div style={S.field}>
                    <label style={S.label}>Password</label>
                    <input style={S.input} type="password" {...register("password")}
                        placeholder="••••••••" required autoComplete="current-password" />
                </div>
                <button type="submit" disabled={loading} style={{ ...S.submit, opacity: loading ? 0.7 : 1 }}>
                    {loading ? "Signing in…" : "Sign In →"}
                </button>
            </form>
        </>
    );
}
