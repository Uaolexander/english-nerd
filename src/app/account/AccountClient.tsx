"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// ── Types ──────────────────────────────────────────────────────────────────

export type ProgressStats = {
  totalCompleted: number;
  avgScore: number | null;
  topicsMastered: number;
  recentActivity: Array<{
    id: string;
    category: string;
    level: string | null;
    slug: string;
    exercise_no: number | null;
    score: number;
    completed_at: string;
  }>;
  byLevel: Record<string, { completed: number; avgScore: number }>;
};

type Props = {
  email: string;
  fullName: string;
  avatarUrl: string;
  createdAt: string;
  provider: string;
  stats: ProgressStats;
};

type Tab = "profile" | "security" | "progress";

// ── Helpers ────────────────────────────────────────────────────────────────

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

function slugToTitle(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const LEVEL_TOTALS: Record<string, number> = {
  a1: 76, // 19 topics × 4
  a2: 80, // 20 topics × 4
  b1: 84, // 21 topics × 4
  b2: 72, // 18 topics × 4
  c1: 72, // 18 topics × 4
};

const LEVEL_LABELS: Record<string, string> = {
  a1: "A1 — Beginner",
  a2: "A2 — Elementary",
  b1: "B1 — Intermediate",
  b2: "B2 — Upper-Int.",
  c1: "C1 — Advanced",
};

const LEVEL_COLORS: Record<string, { bar: string; text: string; bg: string }> = {
  a1: { bar: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  a2: { bar: "bg-sky-500",     text: "text-sky-700",     bg: "bg-sky-50"     },
  b1: { bar: "bg-violet-500",  text: "text-violet-700",  bg: "bg-violet-50"  },
  b2: { bar: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50"   },
  c1: { bar: "bg-rose-500",    text: "text-rose-700",    bg: "bg-rose-50"    },
};

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-500";
}

function scoreBg(score: number) {
  if (score >= 80) return "bg-emerald-50 border-emerald-100 text-emerald-700";
  if (score >= 50) return "bg-amber-50 border-amber-100 text-amber-700";
  return "bg-red-50 border-red-100 text-red-700";
}

// ── Component ──────────────────────────────────────────────────────────────

export default function AccountClient({ email, fullName, avatarUrl, createdAt, provider, stats }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<Tab>("profile");

  // Profile
  const [name, setName] = useState(fullName);
  const [avatar, setAvatar] = useState(avatarUrl);
  const [avatarPreview, setAvatarPreview] = useState(avatarUrl);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Security
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [securitySaving, setSecuritySaving] = useState(false);
  const [securityMsg, setSecurityMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Logout
  const [loggingOut, setLoggingOut] = useState(false);

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
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
    if (uploadError) { setProfileMsg({ type: "err", text: `Upload failed: ${uploadError.message}` }); setAvatarPreview(avatar); setAvatarUploading(false); return; }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const { error: updateError } = await supabase.auth.updateUser({ data: { avatar_url: urlData.publicUrl } });
    if (updateError) { setProfileMsg({ type: "err", text: updateError.message }); } else { setAvatar(urlData.publicUrl); setProfileMsg({ type: "ok", text: "Photo updated." }); }
    setAvatarUploading(false);
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault(); setProfileSaving(true); setProfileMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { full_name: name.trim() } });
    if (error) { setProfileMsg({ type: "err", text: error.message }); } else { setProfileMsg({ type: "ok", text: "Profile saved." }); router.refresh(); }
    setProfileSaving(false);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault(); setSecurityMsg(null);
    if (newPassword !== confirmPassword) { setSecurityMsg({ type: "err", text: "Passwords do not match." }); return; }
    if (newPassword.length < 6) { setSecurityMsg({ type: "err", text: "Password must be at least 6 characters." }); return; }
    setSecuritySaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { setSecurityMsg({ type: "err", text: error.message }); } else { setSecurityMsg({ type: "ok", text: "Password updated successfully." }); setNewPassword(""); setConfirmPassword(""); }
    setSecuritySaving(false);
  }

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

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#F6F6F7]">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-1.5 text-xs text-slate-400">
          <a href="/" className="hover:text-slate-600 transition">Home</a>
          <span>/</span>
          <span className="text-slate-600">Account</span>
        </div>

        {/* ── Profile header card ─────────────────────────────────────── */}
        <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] px-6 py-5 sm:px-7">
          <div className="flex items-center gap-4 sm:gap-5">

            {/* Avatar */}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <div className="shrink-0 h-16 w-16 sm:h-[72px] sm:w-[72px] overflow-hidden rounded-2xl ring-2 ring-slate-100 shadow-sm">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-600 text-xl font-black text-white">
                  {userInitials}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-slate-900 leading-none sm:text-2xl truncate">
                {name.trim() || <span className="text-slate-400 font-semibold">No name yet</span>}
              </h1>
              <p className="mt-1 text-sm text-slate-400 truncate">{email}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                </span>
                <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Free</span>
                <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium text-slate-400">Since {memberSince(createdAt)}</span>
                {isOAuth && <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">Google</span>}
              </div>
            </div>

            {/* Sign out */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="shrink-0 flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              {loggingOut ? "…" : "Sign out"}
            </button>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────── */}
        <div className="mt-8 flex gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-black/[0.04]">
          {([
            { key: "profile"  as const, label: "Profile",  icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
            { key: "progress" as const, label: "Progress", icon: "M3 3v18h18M18 9l-5 5-4-4-4 4" },
            { key: "security" as const, label: "Security", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition ${
                tab === t.key ? "bg-[#F5DA20] text-black shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={t.icon} />
              </svg>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════ PROFILE TAB ══════════════ */}
        {tab === "profile" && (
          <form onSubmit={handleProfileSave} className="mt-5 space-y-4">
            <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] p-6 sm:p-7">
              <p className="mb-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Profile information</p>
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">Display name</label>
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-300 shadow-sm outline-none transition focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/25"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">Shown across the site.</p>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">Email address</label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <svg className="h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <span className="text-sm text-slate-700 truncate">{email}</span>
                    <span className="ml-auto shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-400">Locked</span>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">Profile photo</label>
                  <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                      {avatarPreview
                        ? <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
                        : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-600 text-sm font-black text-white">{userInitials}</div>
                      }
                    </div>
                    <div>
                      <button type="button" onClick={() => fileRef.current?.click()} disabled={avatarUploading}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40">
                        {avatarUploading ? "Uploading…" : "Change photo"}
                      </button>
                      <p className="mt-1 text-xs text-slate-400">JPG, PNG or WebP · max 5 MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {profileMsg && (
              <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold ${profileMsg.type === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                {profileMsg.type === "ok"
                  ? <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                }
                {profileMsg.text}
              </div>
            )}

            <button type="submit" disabled={profileSaving}
              className="flex items-center gap-2 rounded-xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black shadow-sm transition hover:opacity-90 disabled:opacity-50">
              {profileSaving ? <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving…</> : "Save changes"}
            </button>
          </form>
        )}

        {/* ══════════════ PROGRESS TAB ══════════════ */}
        {tab === "progress" && (
          <div className="mt-5 space-y-4">

            {stats.totalCompleted === 0 ? (
              /* ── Empty state ── */
              <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] p-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5DA20]/15 text-3xl">📊</div>
                <h2 className="text-lg font-black text-slate-900">No activity yet</h2>
                <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
                  Complete exercises and tests to see your progress, scores, and learning stats here.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a href="/grammar/a1" className="rounded-xl bg-[#F5DA20] px-5 py-2.5 text-sm font-black text-black transition hover:opacity-90">Start Grammar A1</a>
                  <a href="/tenses" className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50">Explore Tenses</a>
                </div>
              </div>
            ) : (
              <>
                {/* ── 4 stat cards ── */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Exercises done",    value: stats.totalCompleted,             suffix: "",  icon: "✅", color: "text-slate-900" },
                    { label: "Average score",     value: stats.avgScore ?? 0,              suffix: "%", icon: "📈", color: scoreColor(stats.avgScore ?? 0) },
                    { label: "Topics mastered",   value: stats.topicsMastered,             suffix: "",  icon: "🏆", color: "text-amber-600" },
                    { label: "Levels active",     value: Object.values(stats.byLevel).filter(l => l.completed > 0).length, suffix: "/5", icon: "🎯", color: "text-violet-600" },
                  ].map(({ label, value, suffix, icon, color }) => (
                    <div key={label} className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] p-4">
                      <div className="text-lg mb-1">{icon}</div>
                      <div className={`text-2xl font-black ${color}`}>{value}{suffix}</div>
                      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</div>
                    </div>
                  ))}
                </div>

                {/* ── Progress by level + Recent activity ── */}
                <div className="grid gap-4 sm:grid-cols-2">

                  {/* By level */}
                  <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] p-5">
                    <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Grammar progress</p>
                    <div className="space-y-3">
                      {(["a1", "a2", "b1", "b2", "c1"] as const).map((lvl) => {
                        const data = stats.byLevel[lvl] ?? { completed: 0, avgScore: 0 };
                        const total = LEVEL_TOTALS[lvl];
                        const pct = Math.min(100, Math.round((data.completed / total) * 100));
                        const colors = LEVEL_COLORS[lvl];
                        return (
                          <a key={lvl} href={`/grammar/${lvl}`} className="block group">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition">{LEVEL_LABELS[lvl]}</span>
                              <span className={`text-[10px] font-black ${data.completed > 0 ? colors.text : "text-slate-300"}`}>
                                {data.completed}/{total}
                              </span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full transition-all duration-700 ${data.completed > 0 ? colors.bar : ""}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent activity */}
                  <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] p-5">
                    <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Recent activity</p>
                    {stats.recentActivity.length === 0 ? (
                      <p className="text-sm text-slate-400">No activity yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {stats.recentActivity.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            {/* Score badge */}
                            <span className={`shrink-0 rounded-lg border px-2 py-0.5 text-[11px] font-black tabular-nums ${scoreBg(item.score)}`}>
                              {item.score}%
                            </span>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-slate-800 truncate">
                                {slugToTitle(item.slug)}
                                {item.exercise_no != null && <span className="ml-1 text-slate-400">· Ex {item.exercise_no}</span>}
                              </div>
                              <div className="text-[10px] text-slate-400 capitalize">
                                {item.category}{item.level ? ` · ${item.level.toUpperCase()}` : ""}
                              </div>
                            </div>
                            {/* Time */}
                            <span className="shrink-0 text-[10px] text-slate-300">{timeAgo(item.completed_at)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Best scores banner ── */}
                {stats.recentActivity.some(a => a.score === 100) && (
                  <div className="rounded-2xl bg-gradient-to-r from-[#F5DA20]/20 to-amber-50 border border-[#F5DA20]/40 px-5 py-4 flex items-center gap-3">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="text-sm font-black text-slate-900">Perfect score!</p>
                      <p className="text-xs text-slate-500">You got 100% on at least one exercise. Keep it up!</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ══════════════ SECURITY TAB ══════════════ */}
        {tab === "security" && (
          <div className="mt-5 space-y-4">

            {/* Login method */}
            <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] p-6 sm:p-7">
              <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Login method</p>
              {isOAuth ? (
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
                    <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Google account</p>
                    <p className="mt-0.5 text-xs text-slate-500">Password is managed by Google. <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Change it there →</a></p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                    <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Email & password</p>
                    <p className="mt-0.5 text-xs text-slate-500 truncate">{email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Change password */}
            {!isOAuth && (
              <form onSubmit={handlePasswordChange}>
                <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] p-6 sm:p-7">
                  <p className="mb-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Change password</p>
                  <div className="space-y-4">
                    {[
                      { label: "New password",     val: newPassword,     set: setNewPassword,     show: showNew,    setShow: setShowNew    },
                      { label: "Confirm password", val: confirmPassword, set: setConfirmPassword, show: showConfirm, setShow: setShowConfirm },
                    ].map(({ label, val, set, show, setShow }) => (
                      <div key={label}>
                        <label className="mb-2 block text-xs font-semibold text-slate-600">{label}</label>
                        <div className="relative">
                          <input
                            type={show ? "text" : "password"} required minLength={6} value={val} onChange={(e) => set(e.target.value)}
                            placeholder="At least 6 characters"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 placeholder-slate-300 shadow-sm outline-none transition focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/25"
                          />
                          <button type="button" onClick={() => setShow(v => !v)} tabIndex={-1} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                            {show
                              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            }
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {securityMsg && (
                  <div className={`mt-4 flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold ${securityMsg.type === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                    {securityMsg.type === "ok"
                      ? <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    }
                    {securityMsg.text}
                  </div>
                )}
                <button type="submit" disabled={securitySaving}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black shadow-sm transition hover:opacity-90 disabled:opacity-50">
                  {securitySaving ? <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving…</> : "Update password"}
                </button>
              </form>
            )}

            {/* Sessions */}
            <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] p-6 sm:p-7">
              <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Sessions</p>
              <p className="mt-3 text-sm font-bold text-slate-900">Sign out everywhere</p>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">End all active sessions on every device.</p>
              <button onClick={handleLogout} disabled={loggingOut}
                className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-40">
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
