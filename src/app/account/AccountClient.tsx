"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  email: string;
  fullName: string;
  avatarUrl: string;
  createdAt: string;
  provider: string;
};

type Tab = "profile" | "security";

function initials(name: string, email: string) {
  if (name.trim()) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function memberSince(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function AccountClient({ email, fullName, avatarUrl, createdAt, provider }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<Tab>("profile");

  // Profile state
  const [name, setName] = useState(fullName);
  const [avatar, setAvatar] = useState(avatarUrl);
  const [avatarPreview, setAvatarPreview] = useState(avatarUrl);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Security state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [securitySaving, setSecuritySaving] = useState(false);
  const [securityMsg, setSecurityMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Logout
  const [loggingOut, setLoggingOut] = useState(false);

  // ── Avatar upload ──────────────────────────────────────────────────────────

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    setAvatarUploading(true);
    setProfileMsg(null);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `avatars/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setProfileMsg({ type: "err", text: `Upload failed: ${uploadError.message}` });
      setAvatarPreview(avatar);
      setAvatarUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = urlData.publicUrl;

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    });

    if (updateError) {
      setProfileMsg({ type: "err", text: updateError.message });
    } else {
      setAvatar(publicUrl);
      setProfileMsg({ type: "ok", text: "Photo updated." });
    }
    setAvatarUploading(false);
  }

  // ── Save profile ───────────────────────────────────────────────────────────

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name.trim() },
    });

    if (error) {
      setProfileMsg({ type: "err", text: error.message });
    } else {
      setProfileMsg({ type: "ok", text: "Profile saved." });
      router.refresh();
    }
    setProfileSaving(false);
  }

  // ── Change password ────────────────────────────────────────────────────────

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setSecurityMsg(null);

    if (newPassword !== confirmPassword) {
      setSecurityMsg({ type: "err", text: "Passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      setSecurityMsg({ type: "err", text: "Password must be at least 6 characters." });
      return;
    }

    setSecuritySaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setSecurityMsg({ type: "err", text: error.message });
    } else {
      setSecurityMsg({ type: "ok", text: "Password updated successfully." });
      setNewPassword("");
      setConfirmPassword("");
    }
    setSecuritySaving(false);
  }

  // ── Logout ─────────────────────────────────────────────────────────────────

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/session/logout", { method: "POST" });
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const userInitials = initials(name, email);
  const isOAuth = provider !== "email";

  // ── UI ─────────────────────────────────────────────────────────────────────

  return (
    <main className="relative min-h-screen bg-[#0B0B0D] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-[#F5DA20]/4 blur-[160px]" />
        <div className="absolute top-1/2 -right-48 h-[400px] w-[400px] rounded-full bg-violet-500/4 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-12 sm:px-6">

        {/* Breadcrumb */}
        <div className="text-sm text-white/40">
          <a href="/" className="hover:text-white/80 transition">Home</a>
          <span className="mx-2 text-white/20">/</span>
          <span className="text-white/70">Account</span>
        </div>

        {/* ── Hero card ─────────────────────────────────────────────── */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-5">

              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="h-[72px] w-[72px] overflow-hidden rounded-2xl border border-white/15 ring-2 ring-[#F5DA20]/20 sm:h-20 sm:w-20">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F5DA20] to-amber-500 text-xl font-black text-black">
                      {userInitials}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-[#1c1c24] shadow-lg transition hover:bg-[#28283a] disabled:opacity-50"
                  aria-label="Change photo"
                >
                  {avatarUploading ? (
                    <svg className="h-3 w-3 animate-spin text-white/60" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                  ) : (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  )}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>

              {/* Name + email + badges */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-black text-white sm:text-2xl">
                  {name.trim() || "No name yet"}
                </h1>
                <p className="mt-0.5 text-sm text-white/65 truncate">{email}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/8 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Active
                  </span>
                  <span className="rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/65">
                    Free plan
                  </span>
                  {isOAuth && (
                    <span className="rounded-full border border-[#4285F4]/30 bg-[#4285F4]/8 px-2.5 py-1 text-[11px] font-bold text-[#4285F4]">
                      Google
                    </span>
                  )}
                </div>
              </div>

              {/* Sign out */}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="shrink-0 flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-white/45 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white/80 disabled:opacity-40"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                {loggingOut ? "…" : "Sign out"}
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 divide-x divide-white/8 border-t border-white/8">
            {[
              { label: "Member since", value: memberSince(createdAt) },
              { label: "Plan", value: "Free" },
              { label: "Status", value: "Active", highlight: true },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="px-4 py-4 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35">{label}</p>
                <p className={`mt-1 text-sm font-black ${highlight ? "text-emerald-400" : "text-white"}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────── */}
        <div className="mt-6 flex gap-1 rounded-2xl border border-white/8 bg-black/30 p-1">
          {([
            {
              key: "profile" as const,
              label: "Profile",
              icon: (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              ),
            },
            {
              key: "security" as const,
              label: "Security",
              icon: (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              ),
            },
          ]).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition ${
                tab === t.key
                  ? "bg-[#F5DA20] text-black shadow"
                  : "text-white/55 hover:text-white/85"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Profile tab ───────────────────────────────────────────── */}
        {tab === "profile" && (
          <form onSubmit={handleProfileSave} className="mt-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-7">

              <p className="mb-5 text-[11px] font-black uppercase tracking-widest text-white/30">
                Profile information
              </p>

              <div className="space-y-5">

                {/* Display name */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/60">
                    Display name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#F5DA20]/60 focus:ring-2 focus:ring-[#F5DA20]/12"
                  />
                  <p className="mt-1.5 text-xs text-white/40">Shown across the site.</p>
                </div>

                {/* Email — read only */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/60">
                    Email address
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3.5">
                    <svg className="h-4 w-4 shrink-0 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span className="text-sm text-white/75 truncate">{email}</span>
                    <span className="ml-auto shrink-0 rounded-full border border-white/12 bg-white/6 px-2.5 py-0.5 text-[10px] font-bold text-white/40">
                      Locked
                    </span>
                  </div>
                </div>

                {/* Photo upload */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-white/60">
                    Profile photo
                  </label>
                  <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-black/20 p-4">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F5DA20] to-amber-500 text-sm font-black text-black">
                          {userInitials}
                        </div>
                      )}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        disabled={avatarUploading}
                        className="rounded-xl border border-white/12 bg-white/6 px-4 py-2 text-xs font-bold text-white/75 transition hover:bg-white/12 hover:text-white disabled:opacity-40"
                      >
                        {avatarUploading ? "Uploading…" : "Change photo"}
                      </button>
                      <p className="mt-1 text-xs text-white/35">JPG, PNG or WebP · max 5 MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback */}
            {profileMsg && (
              <div className={`mt-4 flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold ${
                profileMsg.type === "ok"
                  ? "border-emerald-400/25 bg-emerald-400/8 text-emerald-300"
                  : "border-red-400/25 bg-red-400/8 text-red-300"
              }`}>
                {profileMsg.type === "ok" ? (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                )}
                {profileMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={profileSaving}
              className="mt-4 flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-6 py-3.5 text-sm font-black text-black transition hover:opacity-90 disabled:opacity-50"
            >
              {profileSaving ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  Saving…
                </>
              ) : "Save changes"}
            </button>
          </form>
        )}

        {/* ── Security tab ──────────────────────────────────────────── */}
        {tab === "security" && (
          <div className="mt-5 space-y-4">

            {/* Login method info */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-7">
              <p className="mb-4 text-[11px] font-black uppercase tracking-widest text-white/30">
                Login method
              </p>
              {isOAuth ? (
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#4285F4]/25 bg-[#4285F4]/8">
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Google account</p>
                    <p className="mt-0.5 text-xs text-white/55">
                      Password is managed by Google.{" "}
                      <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="text-[#4285F4] hover:underline">
                        Change it there →
                      </a>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/6">
                    <svg className="h-4 w-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Email & password</p>
                    <p className="mt-0.5 text-xs text-white/55 truncate">{email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Change password — only for email users */}
            {!isOAuth && (
              <form onSubmit={handlePasswordChange}>
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-7">
                  <p className="mb-5 text-[11px] font-black uppercase tracking-widest text-white/30">
                    Change password
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-white/60">
                        New password
                      </label>
                      <div className="relative">
                        <input
                          type={showNew ? "text" : "password"}
                          required
                          minLength={6}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3.5 pr-12 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#F5DA20]/60 focus:ring-2 focus:ring-[#F5DA20]/12"
                        />
                        <button type="button" onClick={() => setShowNew(v => !v)} tabIndex={-1}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition">
                          {showNew
                            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          }
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-white/60">
                        Confirm new password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirm ? "text" : "password"}
                          required
                          minLength={6}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          className="w-full rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3.5 pr-12 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#F5DA20]/60 focus:ring-2 focus:ring-[#F5DA20]/12"
                        />
                        <button type="button" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition">
                          {showConfirm
                            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {securityMsg && (
                  <div className={`mt-4 flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold ${
                    securityMsg.type === "ok"
                      ? "border-emerald-400/25 bg-emerald-400/8 text-emerald-300"
                      : "border-red-400/25 bg-red-400/8 text-red-300"
                  }`}>
                    {securityMsg.type === "ok" ? (
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    )}
                    {securityMsg.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={securitySaving}
                  className="mt-4 flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-6 py-3.5 text-sm font-black text-black transition hover:opacity-90 disabled:opacity-50"
                >
                  {securitySaving ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                      Saving…
                    </>
                  ) : "Update password"}
                </button>
              </form>
            )}

            {/* Sign out all devices */}
            <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-6 sm:p-7">
              <p className="mb-1 text-[11px] font-black uppercase tracking-widest text-white/30">
                Sessions
              </p>
              <p className="mt-3 text-sm font-semibold text-white">Sign out everywhere</p>
              <p className="mt-1 text-xs text-white/50 leading-relaxed">
                End all active sessions on every device. You&apos;ll need to log in again.
              </p>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="mt-4 flex items-center gap-2 rounded-xl border border-rose-300/15 bg-rose-300/[0.05] px-4 py-2.5 text-xs font-bold text-rose-200/70 transition hover:border-rose-300/25 hover:bg-rose-300/[0.09] hover:text-rose-100/90 disabled:opacity-40"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                {loggingOut ? "Signing out…" : "Sign out of all devices"}
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
