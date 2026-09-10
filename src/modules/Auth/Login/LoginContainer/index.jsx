"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { CSS } from "../styles";
import { BUBBLES, SPARKLES, PARTICLES } from "../decor";
import LoginHeader from "../LoginHeader";
import LoginForm from "../LoginForm";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LoginContainer() {
  const params            = useSearchParams();
  const router            = useRouter();
  const { login, user }   = useAuthStore();
  const [form, setForm]   = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Compute this AFTER mount so server and first client render agree (both
  // false), avoiding a hydration mismatch. It flips to true on the client only.
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsSessionExpired(
      new URLSearchParams(window.location.search).get("reason") === "session_expired"
    );
  }, []);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const handleLogin = async () => {
    setError("");
    if (!form.username || !form.password)
      return setError("Username and password are required");
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/api/auth/app-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      const token    = data?.data?.token;
      const appToken = data?.data?.appToken;
      const user     = data?.data?.user;
      if (typeof window !== "undefined") {
        if (token)    localStorage.setItem("fameo_token", token);
        if (appToken) localStorage.setItem("fameo_app_token", appToken);
        if (user)     sessionStorage.setItem("fameo_user", JSON.stringify(user));
        sessionStorage.setItem("fameo_just_logged_in", "1");   // ← add this
      }
      login(user, token);
      const dest = params.get("redirect") || "/";
      window.location.assign(dest);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg-root">
      <style>{CSS}</style>

      {/* Ambient blurred orbs */}
      <div className="lg-orb lg-orb-1" />
      <div className="lg-orb lg-orb-2" />
      <div className="lg-orb lg-orb-3" />
      <div className="lg-orb lg-orb-4" />
      <div className="lg-orb lg-orb-5" />

      {/* Noise grain */}
      <div className="lg-noise" />

      {/* 7 concentric pulsing rings */}
      <div className="lg-rings-wrap">
        {[1,2,3,4,5,6,7].map(i => <div key={i} className="lg-ring-c" />)}
      </div>

      {/* Spinning corner arc circles */}
      <div className="lg-corner lg-corner-tl" />
      <div className="lg-corner lg-corner-br" />
      <div className="lg-corner lg-corner-tr" />
      <div className="lg-corner lg-corner-bl" />

      {/* ── BUBBLES ─────────────────────────────────────────────────────── */}
      {BUBBLES.map((b, i) => (
        <div
          key={i}
          className="lg-bubble"
          style={{
            left:            b.left,
            top:             b.top,
            width:           b.size + 'px',
            height:          b.size + 'px',
            '--bop':         b.opacity,
            animationDuration:  b.dur + 's',
            animationDelay:     b.delay + 's',
          }}
        />
      ))}

      {/* Sparkle twinkle dots */}
      {SPARKLES.map((s, i) => (
        <div key={i} className="lg-sparkle" style={{
          top: s.top, left: s.left,
          width: s.size + 'px', height: s.size + 'px',
          background: i % 2 === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(212,90,121,0.85)',
          boxShadow: i % 2 === 0
            ? `0 0 ${s.size * 4}px rgba(255,255,255,0.75)`
            : `0 0 ${s.size * 4}px rgba(212,90,121,0.75)`,
          animationDelay: s.delay + 's',
          animationDuration: s.dur + 's',
        }} />
      ))}

      {/* Rising particles */}
      {PARTICLES.map((p, i) => (
        <div key={i} className="lg-particle" style={{
          left: p.left,
          width: p.size + 'px', height: p.size + 'px',
          background: p.color,
          boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          animationDelay: p.delay + 's',
          animationDuration: p.dur + 's',
        }} />
      ))}

      {/* ── Card ──────────────────────────────────────────────────────── */}
      <div className="lg-card">

        <LoginHeader />

        <div className="lg-divider" />

        <LoginForm
          form={form}
          setForm={setForm}
          loading={loading}
          error={error}
          isSessionExpired={isSessionExpired}
          handleLogin={handleLogin}
        />

        {/* Footer */}
        <div className="lg-footer">
          <p className="lg-hint">Use the same credentials from your Fameo mobile app.</p>
          <Link href="/" className="lg-back">← Back to Fameo</Link>
        </div>
      </div>
    </div>
  );
}
