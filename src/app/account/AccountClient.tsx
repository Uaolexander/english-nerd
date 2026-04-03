"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { containsProfanity } from "@/lib/profanity";
import AdUnit from "@/components/AdUnit";
import ProExpiredModal from "@/components/ProExpiredModal";
import ProWelcomeModal from "@/components/ProWelcomeModal";
import DashboardTab from "./DashboardTab";
import type { TopicRec } from "@/lib/getRecommendations";

// ── Types ──────────────────────────────────────────────────────────────────

export type CertificateRecord = {
  id: string;
  level: string;
  scorePercent: number;
  scoreCorrect: number;
  scoreTotal: number;
  holderName: string;
  issuedAt: string;
};

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
  byLevel: Record<string, { completed: number; avgScore: number; pct: number }>;
  testResults: { grammar?: number; tenses?: number; vocabulary?: number };
};

type Props = {
  email: string;
  fullName: string;
  avatarUrl: string;
  createdAt: string;
  provider: string;
  stats: ProgressStats;
  certificates: CertificateRecord[];
  isPro: boolean;
  hadProBefore: boolean;
  streak: number;
  weekly: { day: string; label: string; count: number }[];
  maxWeekly: number;
  overallPct: number;
  currentLevel: string | null;
  recs: TopicRec[];
  freezeCount: number;
  canUseFreeze: boolean;
};

type Tab = "dashboard" | "profile" | "security";

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

const LEVEL_COLORS: Record<string, { bar: string; text: string; bg: string; badge: string }> = {
  a1: { bar: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", badge: "bg-emerald-500" },
  a2: { bar: "bg-sky-500",     text: "text-sky-700",     bg: "bg-sky-50",     badge: "bg-sky-500"     },
  b1: { bar: "bg-violet-500",  text: "text-violet-700",  bg: "bg-violet-50",  badge: "bg-violet-500"  },
  b2: { bar: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50",   badge: "bg-amber-500"   },
  c1: { bar: "bg-rose-500",    text: "text-rose-700",    bg: "bg-rose-50",    badge: "bg-rose-500"    },
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

// ── CertificateRow: renders one saved certificate + re-download button ─────

const CERT_LEVEL_COLORS: Record<string, string> = {
  A1: "bg-emerald-100 text-emerald-800",
  A2: "bg-sky-100 text-sky-800",
  B1: "bg-violet-100 text-violet-800",
  B2: "bg-amber-100 text-amber-800",
  C1: "bg-rose-100 text-rose-800",
};

const BAND_LABEL_SHORT: Record<string, string> = {
  A1: "Beginner", A2: "Elementary", B1: "Intermediate",
  B2: "Upper-Intermediate", C1: "Advanced", C2: "Mastery",
};

const BAND_BG_HEX: Record<string, string> = {
  A1: "#6ee7b7", A2: "#5eead4", B1: "#7dd3fc",
  B2: "#c4b5fd", C1: "#fdba74", C2: "#fda4af",
};

function CertificateRow({ cert, onDelete }: { cert: CertificateRecord; onDelete: () => void }) {
  const [downloading, setDownloading] = useState(false);

  const isVocab = cert.scoreTotal >= 1000;

  async function reDownload() {
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const container = document.createElement("div");
      container.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:794px;height:562px;z-index:-1;";

      const issuedDate = new Date(cert.issuedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
      const levelLabel = BAND_LABEL_SHORT[cert.level] ?? "";

      if (isVocab) {
        const accentColor = BAND_BG_HEX[cert.level] ?? "#F5DA20";
        container.innerHTML = `
          <div id="cert-dl" style="width:794px;height:562px;background:#fff;position:relative;font-family:Georgia,'Times New Roman',serif;overflow:hidden;">
            <div style="position:absolute;top:0;left:0;right:0;height:8px;background:#F5DA20;"></div>
            <div style="position:absolute;bottom:0;left:0;right:0;height:8px;background:#F5DA20;"></div>
            <div style="position:absolute;top:0;left:0;width:8px;bottom:0;background:#F5DA20;"></div>
            <div style="position:absolute;top:0;right:0;width:8px;bottom:0;background:#F5DA20;"></div>
            <div style="position:absolute;top:28px;left:28px;right:28px;bottom:28px;border:1px solid rgba(0,0,0,0.08);border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 60px;">
              <div style="position:absolute;top:28px;left:0;right:0;text-align:center;font-size:13px;font-weight:700;letter-spacing:3px;color:rgba(0,0,0,0.35);text-transform:uppercase;">EnglishNerd</div>
              <p style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:rgba(0,0,0,0.35);margin-bottom:12px;margin-top:0;">Vocabulary Certificate</p>
              <p style="font-size:14px;color:rgba(0,0,0,0.45);margin-bottom:10px;margin-top:0;font-style:italic;">This certifies that</p>
              <div style="font-size:38px;font-weight:700;color:#0F0F12;letter-spacing:-0.5px;text-align:center;margin-bottom:14px;line-height:1.1;">${cert.holderName}</div>
              <p style="font-size:13px;color:rgba(0,0,0,0.45);margin-bottom:22px;margin-top:0;font-style:italic;text-align:center;">has demonstrated an estimated active vocabulary of</p>
              <div style="display:flex;align-items:center;gap:20px;margin-bottom:22px;">
                <div style="background:#F5DA20;border-radius:10px;padding:10px 28px;display:flex;flex-direction:column;align-items:center;">
                  <span style="font-size:32px;font-weight:700;color:#0F0F12;line-height:1;">~${cert.scoreCorrect.toLocaleString()}</span>
                  <span style="font-size:11px;font-weight:700;color:rgba(0,0,0,0.6);letter-spacing:1px;text-transform:uppercase;margin-top:4px;">words</span>
                </div>
                <div style="width:1px;height:60px;background:rgba(0,0,0,0.1);"></div>
                <div style="display:flex;flex-direction:column;gap:6px;">
                  <div style="display:flex;flex-direction:column;align-items:flex-start;">
                    <span style="display:inline-block;background:${accentColor};border-radius:6px;padding:2px 10px;font-size:22px;font-weight:700;color:#0F0F12;">${cert.level}</span>
                    <span style="font-size:10px;color:rgba(0,0,0,0.4);text-transform:uppercase;letter-spacing:1px;margin-top:4px;">level</span>
                  </div>
                  <div style="display:flex;flex-direction:column;align-items:flex-start;">
                    <span style="font-size:14px;font-weight:700;color:#0F0F12;">${levelLabel}</span>
                    <span style="font-size:10px;color:rgba(0,0,0,0.4);text-transform:uppercase;letter-spacing:1px;">proficiency</span>
                  </div>
                </div>
              </div>
              <div style="width:120px;height:1px;background:rgba(0,0,0,0.12);margin-bottom:16px;"></div>
              <div style="text-align:center;">
                <p style="font-size:11px;color:rgba(0,0,0,0.35);margin-bottom:4px;margin-top:0;">${issuedDate}</p>
                <p style="font-size:9px;color:rgba(0,0,0,0.2);margin-top:0;letter-spacing:0.5px;">englishnerd.cc · This is an informal assessment, not an official CEFR certificate.</p>
              </div>
            </div>
          </div>`;
      } else {
        container.innerHTML = `
          <div id="cert-dl" style="width:794px;height:562px;background:#fff;position:relative;font-family:Georgia,'Times New Roman',serif;overflow:hidden;">
            <div style="position:absolute;top:0;left:0;right:0;height:8px;background:#F5DA20;"></div>
            <div style="position:absolute;bottom:0;left:0;right:0;height:8px;background:#F5DA20;"></div>
            <div style="position:absolute;top:0;left:0;width:8px;bottom:0;background:#F5DA20;"></div>
            <div style="position:absolute;top:0;right:0;width:8px;bottom:0;background:#F5DA20;"></div>
            <div style="position:absolute;top:28px;left:28px;right:28px;bottom:28px;border:1px solid rgba(0,0,0,0.08);border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 60px;">
              <div style="position:absolute;top:28px;left:0;right:0;text-align:center;font-size:13px;font-weight:700;letter-spacing:3px;color:rgba(0,0,0,0.35);text-transform:uppercase;">EnglishNerd</div>
              <p style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:rgba(0,0,0,0.35);margin-bottom:12px;margin-top:0;">Certificate of Achievement</p>
              <p style="font-size:14px;color:rgba(0,0,0,0.45);margin-bottom:10px;margin-top:0;font-style:italic;">This certifies that</p>
              <div style="font-size:38px;font-weight:700;color:#0F0F12;letter-spacing:-0.5px;text-align:center;margin-bottom:14px;line-height:1.1;">${cert.holderName}</div>
              <p style="font-size:13px;color:rgba(0,0,0,0.45);margin-bottom:22px;margin-top:0;font-style:italic;text-align:center;">has successfully completed the English Grammar Placement Test</p>
              <div style="display:flex;align-items:center;gap:16px;margin-bottom:22px;">
                <div style="background:#F5DA20;border-radius:10px;padding:10px 28px;display:flex;flex-direction:column;align-items:center;">
                  <span style="font-size:32px;font-weight:700;color:#0F0F12;line-height:1;">${cert.level}</span>
                  <span style="font-size:11px;font-weight:700;color:rgba(0,0,0,0.6);letter-spacing:1px;text-transform:uppercase;margin-top:4px;">${levelLabel}</span>
                </div>
                <div style="width:1px;height:60px;background:rgba(0,0,0,0.1);"></div>
                <div style="display:flex;flex-direction:column;gap:6px;">
                  <div style="display:flex;flex-direction:column;align-items:flex-start;">
                    <span style="font-size:22px;font-weight:700;color:#0F0F12;">${cert.scoreCorrect}/${cert.scoreTotal}</span>
                    <span style="font-size:10px;color:rgba(0,0,0,0.4);text-transform:uppercase;letter-spacing:1px;">correct answers</span>
                  </div>
                  <div style="display:flex;flex-direction:column;align-items:flex-start;">
                    <span style="font-size:22px;font-weight:700;color:#0F0F12;">${cert.scorePercent}%</span>
                    <span style="font-size:10px;color:rgba(0,0,0,0.4);text-transform:uppercase;letter-spacing:1px;">score</span>
                  </div>
                </div>
              </div>
              <div style="width:120px;height:1px;background:rgba(0,0,0,0.12);margin-bottom:16px;"></div>
              <div style="text-align:center;">
                <p style="font-size:11px;color:rgba(0,0,0,0.35);margin-bottom:4px;margin-top:0;">${issuedDate}</p>
                <p style="font-size:9px;color:rgba(0,0,0,0.2);margin-top:0;letter-spacing:0.5px;">englishnerd.cc · This is an informal assessment, not an official CEFR certificate.</p>
              </div>
            </div>
          </div>`;
      }

      document.body.appendChild(container);
      const el = container.querySelector("#cert-dl") as HTMLElement;
      const canvas = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: "#ffffff" });
      document.body.removeChild(container);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
      const fileName = isVocab
        ? `EnglishNerd_Vocabulary_${cert.holderName.replace(/\s+/g, "_")}.pdf`
        : `EnglishNerd_Certificate_${cert.holderName.replace(/\s+/g, "_")}.pdf`;
      pdf.save(fileName);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  }

  const issuedDate = new Date(cert.issuedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3.5">
      {/* Level badge */}
      <div className="shrink-0 flex flex-col items-center gap-0.5">
        <span className={`rounded-xl px-3 py-1.5 text-base font-black ${CERT_LEVEL_COLORS[cert.level] ?? "bg-slate-100 text-slate-700"}`}>
          {cert.level}
        </span>
        {isVocab && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">vocab</span>}
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 truncate">{cert.holderName}</p>
        {isVocab
          ? <p className="text-xs text-slate-400">{issuedDate} · ~{cert.scoreCorrect.toLocaleString()} words</p>
          : <p className="text-xs text-slate-400">{issuedDate} · {cert.scorePercent}% ({cert.scoreCorrect}/{cert.scoreTotal})</p>
        }
      </div>
      {/* Download */}
      <button
        onClick={reDownload}
        disabled={downloading}
        className="shrink-0 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-[#F5DA20] hover:bg-[#F5DA20]/10 hover:text-slate-900 disabled:opacity-40"
      >
        {downloading ? (
          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
        ) : (
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        )}
        {downloading ? "…" : "PDF"}
      </button>
      {/* Delete */}
      <button
        onClick={onDelete}
        title="Delete certificate"
        className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

export default function AccountClient({ email, fullName, avatarUrl, createdAt, provider, stats, certificates, isPro, hadProBefore, streak, weekly, maxWeekly, overallPct, currentLevel, recs, freezeCount, canUseFreeze }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<Tab>("dashboard");

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

  // Reset progress
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Delete account
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Promo code
  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMsg, setPromoMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  async function handlePromoRedeem(e: React.FormEvent) {
    e.preventDefault();
    if (!promoCode.trim() || promoLoading) return;
    setPromoLoading(true);
    setPromoMsg(null);
    try {
      const res = await fetch("/api/redeem-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim() }),
      });
      const data = await res.json() as { ok: boolean; message?: string; error?: string };
      if (data.ok) {
        setPromoCode("");
        setShowWelcome(true);
      } else {
        setPromoMsg({ type: "err", text: data.error ?? "Something went wrong." });
      }
    } catch (err) {
      console.error("[promo] fetch error:", err);
      setPromoMsg({ type: "err", text: "Could not reach the server. Please try again." });
    } finally {
      setPromoLoading(false);
    }
  }

  // Certificates
  const [certList, setCertList] = useState(certificates);
  const [deleteCertId, setDeleteCertId] = useState<string | null>(null);
  const [deletingCert, setDeletingCert] = useState(false);

  async function handleDeleteCert() {
    if (!deleteCertId) return;
    setDeletingCert(true);
    try {
      await fetch("/api/certificates/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteCertId }),
      });
      setCertList((prev) => prev.filter((c) => c.id !== deleteCertId));
    } finally {
      setDeletingCert(false);
      setDeleteCertId(null);
    }
  }

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
    const trimmed = name.trim();
    if (containsProfanity(trimmed)) {
      setProfileMsg({ type: "err", text: "This name is not allowed. Please choose a different one." });
      setProfileSaving(false);
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { full_name: trimmed } });
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

  async function handleResetProgress() {
    setResetting(true);
    await fetch("/api/progress/reset", { method: "POST" });
    window.location.reload();
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    const res = await fetch("/api/account/delete", { method: "DELETE" });
    if (res.ok) {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } else {
      setDeleting(false);
      setDeleteConfirm(false);
    }
  }

  const userInitials = initials(name, email);
  const isOAuth = provider !== "email";

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
    {/* ── PRO expired re-engagement modal ──────────────────────────────── */}
    {!isPro && hadProBefore && <ProExpiredModal userKey={email} />}

    {/* ── PRO welcome celebration modal ────────────────────────────────── */}
    {showWelcome && <ProWelcomeModal onClose={() => { setShowWelcome(false); router.refresh(); }} />}

    {/* ── Delete certificate confirmation modal ────────────────────────── */}
    {deleteCertId && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteCertId(null)} />
        <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl ring-1 ring-black/[0.06] p-7">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <svg className="h-7 w-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </div>
          <h2 className="text-lg font-black text-slate-900">Delete this certificate?</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            The certificate will be permanently removed from your account. You can always generate a new one by retaking the test.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setDeleteCertId(null)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteCert}
              disabled={deletingCert}
              className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-black text-white transition hover:bg-red-600 disabled:opacity-50"
            >
              {deletingCert ? "Deleting…" : "Yes, delete"}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ── Reset confirmation modal ─────────────────────────────────────── */}
    {resetConfirm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setResetConfirm(false)} />
        <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl ring-1 ring-black/[0.06] p-7">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <svg className="h-7 w-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2 className="text-lg font-black text-slate-900">Reset all progress?</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            This will permanently delete all your completed exercises, scores, and statistics. <span className="font-semibold text-slate-700">This action cannot be undone.</span>
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setResetConfirm(false)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleResetProgress}
              disabled={resetting}
              className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-black text-white transition hover:bg-red-600 disabled:opacity-50"
            >
              {resetting ? "Resetting…" : "Yes, reset"}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ── Delete account confirmation modal ──────────────────────────── */}
    {deleteConfirm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(false)} />
        <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl ring-1 ring-black/[0.06] p-7">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <svg className="h-7 w-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
            </svg>
          </div>
          <h2 className="text-lg font-black text-slate-900">Delete your account?</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            This will permanently delete your account, all progress, scores, and certificates.{" "}
            <span className="font-semibold text-slate-700">This action cannot be undone.</span>
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setDeleteConfirm(false)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-black text-white transition hover:bg-red-600 disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Yes, delete"}
            </button>
          </div>
        </div>
      </div>
    )}

    <main className="min-h-screen bg-[#F6F6F7]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">

        {/* Breadcrumb */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <a href="/" className="hover:text-slate-600 transition">Home</a>
            <span>/</span>
            <span className="text-slate-600">My Account</span>
          </div>
        </div>

        {/* ── 3-column grid ─────────────────────────────────────────── */}
        <div className={`grid gap-5 ${isPro ? "xl:grid-cols-[1fr_256px]" : "xl:grid-cols-[220px_1fr_256px]"}`}>

          {/* ══ LEFT: AdSense ══ */}
          <AdUnit variant="sidebar-account" />

          {/* ══ CENTER ══ */}
          <div className="min-w-0 space-y-4">

        {/* ── Profile header card ─────────────────────────────────────── */}
        <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden">
          {/* Top accent strip / PRO banner */}
          {isPro ? (
            <div className="pro-shine relative flex h-10 items-center justify-center gap-2.5 overflow-hidden bg-gradient-to-r from-amber-400 via-[#F5DA20] to-amber-400">
              <svg aria-hidden="true" className="h-3.5 w-3.5 text-amber-800" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" />
              </svg>
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-900">PRO Member</span>
              <svg aria-hidden="true" className="h-3.5 w-3.5 text-amber-800" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" />
              </svg>
            </div>
          ) : (
            <div className="h-1.5 w-full bg-gradient-to-r from-[#F5DA20] via-amber-300 to-[#F5DA20]" />
          )}
          <div className="flex items-center gap-4 px-5 py-5 sm:gap-6 sm:px-7">

            {/* Avatar */}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <div className={`relative shrink-0 h-16 w-16 sm:h-[76px] sm:w-[76px] overflow-hidden rounded-full shadow-md ${isPro ? "ring-4 ring-[#F5DA20] pro-avatar-ring" : "ring-4 ring-[#F5DA20]/30"}`}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-600 text-xl font-black text-white">
                  {userInitials}
                </div>
              )}
              {isPro && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#F5DA20] to-amber-500 ring-2 ring-white shadow-sm">
                  <svg aria-hidden="true" className="h-3 w-3 text-amber-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" />
                  </svg>
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-slate-900 leading-tight sm:text-2xl truncate">
                {name.trim() || <span className="text-slate-400 font-medium italic">No name yet</span>}
              </h1>
              <p className="mt-0.5 text-sm text-slate-400 truncate">{email}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                </span>
                {isPro ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-[#F5DA20] px-3 py-1 text-[11px] font-black uppercase tracking-wide text-amber-900 shadow-sm">
                    <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" />
                    </svg>
                    PRO
                  </span>
                ) : (
                  <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Free plan</span>
                )}
{isOAuth && <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">Google</span>}
              </div>
            </div>

            {/* Sign out */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="shrink-0 flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
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
            { key: "dashboard" as const, label: "Dashboard", icon: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z" },
            { key: "profile"   as const, label: "Profile",   icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
            { key: "security"  as const, label: "Security",  icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
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

        {/* ══════════════ DASHBOARD TAB ══════════════ */}
        {tab === "dashboard" && (
          <div className="space-y-4">
          <DashboardTab
            streak={streak}
            totalCompleted={stats.totalCompleted}
            avgScore={stats.avgScore ?? 0}
            topicsMastered={stats.topicsMastered}
            overallPct={overallPct}
            currentLevel={currentLevel}
            byLevel={stats.byLevel}
            weekly={weekly}
            maxWeekly={maxWeekly}
            recentActivity={stats.recentActivity.map((r) => ({
              category: r.category,
              level: r.level,
              slug: r.slug,
              score: r.score,
              completed_at: r.completed_at,
            }))}
            isPro={isPro}
            recs={recs}
            freezeCount={freezeCount}
            canUseFreeze={canUseFreeze}
          />

          {/* ── Certificates ────────────────────────────────────────── */}
          <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] p-6 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">My Certificates</p>
                <p className="mt-0.5 text-xs text-slate-400">Download or delete your saved certificates</p>
              </div>
              <div className="flex items-center gap-2">
                <a href="/tests/grammar" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:border-[#F5DA20] hover:bg-[#F5DA20]/10 hover:text-slate-800">
                  Grammar test →
                </a>
                <a href="/tests/vocabulary" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:border-[#F5DA20] hover:bg-[#F5DA20]/10 hover:text-slate-800">
                  Vocabulary test →
                </a>
              </div>
            </div>

            {certList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 mb-3">
                  <svg className="h-6 w-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M8 8v4l-3 7h14l-3-7V8"/><path d="M9 21h6"/>
                  </svg>
                </div>
                <p className="text-sm font-bold text-slate-500">No certificates yet</p>
                <p className="mt-1 text-xs text-slate-400">Complete a grammar or vocabulary test and download your certificate.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {certList.map((cert) => (
                  <CertificateRow
                    key={cert.id}
                    cert={cert}
                    onDelete={() => setDeleteCertId(cert.id)}
                  />
                ))}
              </div>
            )}
          </div>

          </div>
        )}

        {/* ══════════════ PROFILE TAB ══════════════ */}
        {tab === "profile" && (
          <div className="space-y-4">
          <form onSubmit={handleProfileSave} className="space-y-4">
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

          {/* ── Promo Code ─────────────────────────────────────────────── */}
          <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden">
            <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4 sm:px-7">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F5DA20] to-amber-400 shadow-sm">
                <svg aria-hidden="true" className="h-4 w-4 text-amber-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">Promo Code</p>
                <p className="text-xs text-slate-400">Activate PRO for free with a valid code</p>
              </div>
              {isPro && (
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-[#F5DA20] px-3 py-1 text-[11px] font-black uppercase tracking-wide text-amber-900">
                  <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z"/></svg>
                  PRO Active
                </span>
              )}
            </div>
            <form onSubmit={handlePromoRedeem} className="p-6 sm:p-7">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoMsg(null); }}
                  placeholder="e.g. YKO-STAR"
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={20}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm uppercase text-slate-900 placeholder-slate-300 shadow-sm outline-none transition focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/25"
                />
                <button
                  type="submit"
                  disabled={promoLoading || !promoCode.trim()}
                  className="shrink-0 flex items-center gap-2 rounded-xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black shadow-sm transition hover:opacity-90 disabled:opacity-40"
                >
                  {promoLoading
                    ? <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    : "Activate"
                  }
                </button>
              </div>
              {promoMsg && (
                <div className={`mt-3 flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm font-semibold ${promoMsg.type === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                  {promoMsg.type === "ok"
                    ? <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  }
                  {promoMsg.text}
                </div>
              )}
            </form>
          </div>

          </div>
        )}

        {/* ══════════════ SECURITY TAB ══════════════ */}
        {tab === "security" && (
          <div className="space-y-4">

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

            {/* Danger zone */}
            <div className="rounded-3xl border border-red-200 bg-red-50/50 shadow-sm p-6 sm:p-7">
              <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-red-400">Danger zone</p>
              <p className="mt-3 text-sm font-bold text-slate-900">Delete account</p>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Permanently delete your account and all associated data — progress, scores, and certificates. This cannot be undone.
              </p>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="mt-4 flex items-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 hover:border-red-400"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
                Delete my account
              </button>
            </div>

          </div>
        )}

          </div>
          {/* ══ RIGHT: Recommendations ══ */}
          <aside className="hidden xl:block">
            <div className="sticky top-24 space-y-3">
              <p className="px-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">Recommended for you</p>
              {recs.map((rec) => (
                <a
                  key={rec.slug}
                  href={rec.href}
                  className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                    <img
                      src={rec.img}
                      alt={rec.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md ${rec.badge}`}>
                      {rec.level}
                    </span>
                  </div>
                  <div className="px-4 py-3.5">
                    <p className="text-sm font-bold leading-snug text-slate-800 group-hover:text-slate-900 transition">
                      {rec.title}
                    </p>
                    {rec.reason && (
                      <p className="mt-1.5 text-[11px] leading-snug text-amber-600 font-semibold">
                        {rec.reason}
                      </p>
                    )}
                  </div>
                </a>
              ))}
              <a
                href="/nerd-zone"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
              >
                Browse all topics
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            </div>
          </aside>

        </div>
      </div>
    </main>
    </>
  );
}
