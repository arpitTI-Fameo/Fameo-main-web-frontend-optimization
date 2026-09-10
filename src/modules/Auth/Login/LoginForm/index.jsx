export default function LoginForm({ form, setForm, loading, error, isSessionExpired, handleLogin }) {
  return (
    <div className="lg-body">
      <p className="lg-subtitle">Sign in with your Fameo app credentials to continue.</p>

      {isSessionExpired && (
        <div className="lg-session-msg">
          🔒 Your session has expired. Please sign in again.
        </div>
      )}
      {error && <div className="lg-error">{error}</div>}

      {/* Username */}
      <div className="lg-field">
        <label className="lg-label">Username</label>
        <span className="lg-field-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M2.5 13.5c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5"
              stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </span>
        <input
          type="text"
          className="lg-input"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          autoComplete="username"
        />
      </div>

      {/* Password */}
      <div className="lg-field">
        <label className="lg-label">Password</label>
        <span className="lg-field-icon">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <rect x="3" y="7.5" width="10" height="7" rx="1.5"
              stroke="currentColor" strokeWidth="1.4"/>
            <path d="M5.5 7.5V5a2.5 2.5 0 0 1 5 0v2.5"
              stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            <circle cx="8" cy="11" r="1" fill="currentColor"/>
          </svg>
        </span>
        <input
          type="password"
          className="lg-input"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          autoComplete="current-password"
        />
      </div>

      <button className="lg-btn" onClick={handleLogin} disabled={loading}>
        {loading
          ? <><div className="lg-spinner" /> Signing in…</>
          : "Sign In →"
        }
      </button>
    </div>
  );
}
