"use client";
// app/admin/login/page.js

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { S } from './styles';
import LoginForm from './LoginForm';
import LoginRoles from './LoginRoles';

// SAST C-1. This table used to carry an `email` and `pw` for each role, and a
// `quickLogin` button that submitted them. Being in a client component, all four
// production admin passwords were compiled into the public JavaScript bundle —
// readable by any visitor via DevTools → Sources, no authentication required.
//
// What remains is descriptive UI only: labels and colours for the access-level
// legend. No credential, and no code path that submits one, belongs in a file
// that ships to the browser.
//
// ⚠️ Deleting this does NOT undo the exposure. Those four passwords were public
// for as long as the bundle was served. Rotate them in the database and review
// admin sign-in logs before treating this as closed.

export function AdminLogin() {
    const router = useRouter();
    const { login, user, loading, error, clearError } = useAdminAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hydrated, setHydrated] = useState(false);

    // Wait for Zustand to load persisted state before redirecting
    useEffect(() => { setHydrated(true); }, []);

    // Only redirect after hydration — prevents false redirect when store is empty on first render
    useEffect(() => {
        if (hydrated && user) router.replace("/admin");
    }, [user, router, hydrated]);

    // Show nothing until hydrated — avoids black flash
    if (!hydrated) return null;

    const submit = async (e) => {
        e?.preventDefault();
        clearError();
        const res = await login(email, password);
        if (res?.success) router.replace("/admin");
    };

    return (
        <div style={S.page}>
            <div style={S.glow1} /><div style={S.glow2} />
            <div style={S.card}>
                <div style={S.logoWrap}>
                    <span style={S.logo}>Fameo <span style={{ color: "#C9A96E" }}>Admin</span></span>
                    <p style={S.logoSub}>Creator Learning Platform</p>
                </div>

                <LoginForm 
                    submit={submit} 
                    loading={loading} 
                    email={email} 
                    setEmail={setEmail} 
                    password={password} 
                    setPassword={setPassword} 
                    error={error} 
                />

                <LoginRoles />

            </div>
        </div>
    );
}
