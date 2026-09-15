"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useLoginMutation } from '@/lib/hooks/auth/useAuth';
import { toUserMessage } from "@/lib/api/errors";
import { safeRedirect } from "@/lib/security/safeRedirect";
import { CSS } from "../styles";
import { BUBBLES, SPARKLES, PARTICLES } from "../decor";
import LoginHeader from "../LoginHeader";
import LoginForm from "../LoginForm";


export default function LoginContainer() {
  const params = useSearchParams();
  const router = useRouter();
  const { login, user } = useAuthStore();
  const loginMutation = useLoginMutation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [localError, setLocalError] = useState("");

  const isPending = loginMutation.isPending;
  const error = localError || (loginMutation.error ? toUserMessage(loginMutation.error) : "");

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
    setLocalError("");
    loginMutation.reset();
    if (!form.username || !form.password)
      return setLocalError("Username and password are required");
    
    try {
      // Posts to our own /api/auth/login, which calls upstream server-side and
      // returns ONLY a Set-Cookie. The session token never reaches this code —
      // that is the point of the httpOnly cookie (defect #4).
      const data = await loginMutation.mutateAsync({
        username: form.username,
        password: form.password,
      });

      const user = data?.user ?? null;

      if (typeof window !== "undefined") {
        // No credential is written here any more. The session token and the app
        // token are both httpOnly cookies set by /api/auth/login; `fameo_user`
        // is the user OBJECT, read by the socket hooks for their handshake
        // payload, and `fameo_just_logged_in` is a one-shot UI flag.
        if (user) sessionStorage.setItem("fameo_user", JSON.stringify(user));
        sessionStorage.setItem("fameo_just_logged_in", "1");
      }

      login(user, null);
      // Never navigate to a raw query-string value — that is an open redirect.
      // safeRedirect() reduces it to a same-origin path or falls back to "/".
      window.location.assign(safeRedirect(params.get("redirect")));
    } catch (err) {
      // Error is handled by loginMutation.error
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
        {[1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className="lg-ring-c" />)}
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
            left: b.left,
            top: b.top,
            width: b.size + 'px',
            height: b.size + 'px',
            '--bop': b.opacity,
            animationDuration: b.dur + 's',
            animationDelay: b.delay + 's',
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
          loading={isPending}
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
