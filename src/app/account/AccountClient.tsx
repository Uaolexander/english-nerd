"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { containsProfanity } from "@/lib/profanity";
import AdUnit from "@/components/AdUnit";
import ProExpiredModal from "@/components/ProExpiredModal";
import ProWelcomeModal from "@/components/ProWelcomeModal";
import TeacherWelcomeModal from "@/components/TeacherWelcomeModal";
import TeacherTour from "@/components/TeacherTour";
import StudentTour from "@/components/StudentTour";
import ProTour from "@/components/ProTour";
import DashboardTab from "./DashboardTab";
import type { WeakTopic } from "./DashboardTab";
import type { TopicRec } from "@/lib/getRecommendations";
import { searchIndex } from "@/content/index";

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

export type TeacherData = {
  plan: "starter" | "solo" | "plus";
  studentLimit: number;
  isInGracePeriod: boolean;
  subscriptionExpiresAt: string | null;
  students: Array<{
    linkId: string; studentId: string | null; email: string;
    status: "pending" | "active" | "pending_student"; joinedAt: string | null; inviteToken: string;
    totalCompleted: number; avgScore: number | null; lastActivity: string | null;
    nickname: string | null; studentName: string | null; studentAvatarUrl: string | null; notes: string | null;
  }>;
  classes: Array<{ id: string; name: string; description: string | null; emoji: string; createdAt: string; memberIds: string[] }>;
  assignments: Array<{
    id: string; title: string; category: string; level: string | null; slug: string;
    exerciseNo: number | null; dueDate: string | null; prompt: string | null; minWords: number | null; createdAt: string;
    targetStudentIds: string[]; targetClassIds: string[];
  }>;
};

export type StudentAssignment = {
  id: string; title: string; category: string; level: string | null;
  slug: string; exerciseNo: number | null; dueDate: string | null;
  prompt: string | null; minWords: number | null;
  essayStatus?: "submitted" | "reviewed" | null;
  essayGrade?: string | null;
  essayFeedback?: string | null;
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
  isTeacher: boolean;
  teacherData: TeacherData | null;
  isStudent: boolean;
  teacherInfo: { name: string; email: string; avatarUrl: string; linkId: string } | null;
  pendingTeacherInvite: { linkId: string; teacherName: string; teacherEmail: string; teacherAvatarUrl: string } | null;
  studentAssignments: StudentAssignment[];
  completedExerciseKeys: string[];
  streak: number;
  weekly: { day: string; label: string; count: number }[];
  maxWeekly: number;
  overallPct: number;
  currentLevel: string | null;
  recs: TopicRec[];
  freezeCount: number;
  canUseFreeze: boolean;
  weakTopics: WeakTopic[];
  proExpiresAt: string | null;
  siteUrl: string;
};

type Tab = "dashboard" | "teacher" | "student" | "profile" | "security";

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

function dueDateLabel(iso: string): { text: string; color: string } {
  const diff = new Date(iso).getTime() - Date.now();
  const days = Math.ceil(diff / 86400000);
  if (days < 0) return { text: `Overdue by ${Math.abs(days)}d`, color: "text-red-500 font-semibold" };
  if (days === 0) return { text: "Due today", color: "text-red-500 font-semibold" };
  if (days === 1) return { text: "Due tomorrow", color: "text-amber-500 font-semibold" };
  if (days <= 3) return { text: `Due in ${days} days`, color: "text-amber-500 font-semibold" };
  return { text: `Due ${new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`, color: "text-slate-400" };
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
  const [downloadError, setDownloadError] = useState(false);

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
              <p style="font-size:13px;color:rgba(0,0,0,0.45);margin-bottom:22px;margin-top:0;font-style:italic;text-align:center;">has successfully completed the English Grammar Level Test</p>
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
      setDownloadError(true);
      setTimeout(() => setDownloadError(false), 4000);
    } finally {
      setDownloading(false);
    }
  }

  const issuedDate = new Date(cert.issuedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div>
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
      {downloadError && <p className="mt-1.5 text-xs text-red-500 font-semibold">Download failed. Please try again.</p>}
    </div>
  );
}

// ── NewAssignmentModal ──────────────────────────────────────────────────────

type ParsedExercise = { category: string; level: string | null; slug: string; title: string };

const CATEGORY_COLORS: Record<string, string> = {
  grammar: "bg-violet-500", tenses: "bg-sky-500", vocabulary: "bg-amber-500",
};
const LEVEL_COLORS_ASSIGN: Record<string, string> = {
  a1: "bg-emerald-500", a2: "bg-teal-500", b1: "bg-violet-500", b2: "bg-amber-500", c1: "bg-rose-500",
};

function parseExerciseUrl(raw: string): ParsedExercise | null {
  let pathname = raw.trim();
  try { pathname = new URL(raw.trim()).pathname; } catch { /* treat as pathname */ }
  pathname = pathname.replace(/\/$/, "");

  // /grammar/b1/past-continuous  OR  /vocabulary/a1/animals
  const gcMatch = pathname.match(/^\/(grammar|vocabulary)\/([a-z0-9]+)\/([a-z0-9-]+)/);
  if (gcMatch) {
    const [, cat, level, slug] = gcMatch;
    const item = searchIndex.find((i) => i.href.startsWith(`/${cat}/${level}/${slug}`));
    return { category: cat, level, slug, title: item?.title ?? slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") };
  }
  // /tenses/present-simple
  const tMatch = pathname.match(/^\/tenses\/([a-z0-9-]+)/);
  if (tMatch) {
    const slug = tMatch[1];
    const item = searchIndex.find((i) => i.href === `/tenses/${slug}`);
    return { category: "tenses", level: null, slug, title: item?.title ?? slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") };
  }
  return null;
}

// Assignable topics from searchIndex (grammar + tenses + vocabulary only)
const ASSIGNABLE = searchIndex.filter((i) =>
  /^\/(grammar|tenses|vocabulary)\//.test(i.href) &&
  !i.href.split("/").at(-1)?.match(/^(a1|a2|b1|b2|c1)$/)  // exclude level-overview pages
);

function getTopicsForLevel(category: string, level: string) {
  return ASSIGNABLE.filter((i) => {
    if (category === "tenses") return i.href.startsWith("/tenses/");
    return i.href.startsWith(`/${category}/${level}/`);
  });
}

function NewAssignmentModal({
  students, classes: teacherClasses, onClose, onCreated, prefilledStudentId,
}: {
  students: TeacherData["students"];
  classes: TeacherData["classes"];
  onClose: () => void;
  onCreated: (a: TeacherData["assignments"][0]) => void;
  prefilledStudentId?: string;
}) {
  const activeStudents = students.filter((s) => s.status === "active" && s.studentId);

  // Assignment type
  const [assignmentType, setAssignmentType] = useState<"exercise" | "essay" | "homework" | "quiz">("exercise");

  // Quiz fields
  type QuizQ = { id: string; text: string; options: [string, string, string, string]; correct: number };
  const newQ = (): QuizQ => ({ id: Math.random().toString(36).slice(2), text: "", options: ["", "", "", ""], correct: 0 });
  const [quizTitle, setQuizTitle] = useState("");
  const [quizInstructions, setQuizInstructions] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<QuizQ[]>([newQ(), newQ()]);

  function addQuestion() { setQuizQuestions((p) => [...p, newQ()]); }
  function removeQuestion(id: string) { setQuizQuestions((p) => p.filter((q) => q.id !== id)); }
  function updateQuestion(id: string, patch: Partial<QuizQ>) {
    setQuizQuestions((p) => p.map((q) => q.id === id ? { ...q, ...patch } : q));
  }
  function updateOption(id: string, idx: number, val: string) {
    setQuizQuestions((p) => p.map((q) => {
      if (q.id !== id) return q;
      const opts = [...q.options] as [string, string, string, string];
      opts[idx] = val;
      return { ...q, options: opts };
    }));
  }

  // Homework fields
  const [hwTitle, setHwTitle] = useState("");
  const [hwInstructions, setHwInstructions] = useState("");
  const [hwResourceUrl, setHwResourceUrl] = useState("");
  const [hwSubmitType, setHwSubmitType] = useState<"done" | "text">("done");
  const [hwHasMinWords, setHwHasMinWords] = useState(false);
  const [hwMinWords, setHwMinWords] = useState("100");

  // Exercise selection
  const [findMode, setFindMode] = useState<"url" | "browse">("browse");
  const [urlInput, setUrlInput] = useState("");
  const [parsed, setParsed] = useState<ParsedExercise | null>(null);
  const [parseError, setParseError] = useState("");

  // Browse state
  const [browseCategory, setBrowseCategory] = useState("grammar");
  const [browseLevel, setBrowseLevel] = useState("b1");
  const [browseSlug, setBrowseSlug] = useState("");

  // Essay fields
  const [essayTitle, setEssayTitle] = useState("");
  const [essayPrompt, setEssayPrompt] = useState("");
  const [hasMinWords, setHasMinWords] = useState(false);
  const [essayMinWords, setEssayMinWords] = useState("200");

  // Details
  const [title, setTitle] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [hasDueDate, setHasDueDate] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [targetStudentIds, setTargetStudentIds] = useState<string[]>(prefilledStudentId ? [prefilledStudentId] : []);
  const [targetClassIds, setTargetClassIds] = useState<string[]>([]);
  const [assignTo, setAssignTo] = useState<"everyone" | "students" | "classes">(prefilledStudentId ? "students" : "everyone");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Auto-parse URL as user types
  useEffect(() => {
    if (!urlInput.trim()) { setParsed(null); setParseError(""); return; }
    const result = parseExerciseUrl(urlInput);
    if (result) { setParsed(result); setParseError(""); setTitle(result.title); }
    else { setParsed(null); setParseError("Couldn't recognise this URL. Paste a link like /grammar/b1/past-continuous"); }
  }, [urlInput]);

  // When browse selection changes, update parsed
  useEffect(() => {
    if (findMode !== "browse" || !browseSlug) { if (findMode === "browse") setParsed(null); return; }
    const topics = getTopicsForLevel(browseCategory, browseLevel);
    const item = topics.find((t) => t.href.endsWith(`/${browseSlug}`));
    if (!item) return;
    const parts = item.href.split("/");
    const cat = parts[1];
    const level = browseCategory === "tenses" ? null : parts[2];
    const slug = parts[parts.length - 1];
    setParsed({ category: cat, level, slug, title: item.title });
    setTitle(item.title);
  }, [browseCategory, browseLevel, browseSlug, findMode]);

  // Reset slug when category/level changes
  useEffect(() => { setBrowseSlug(""); }, [browseCategory, browseLevel]);

  const browseTopics = getTopicsForLevel(browseCategory, browseLevel);

  function toggleStudent(id: string) {
    setTargetStudentIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  }
  function toggleClass(id: string) {
    setTargetClassIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setSaveError("");

    let targets: { studentId?: string; classId?: string }[] = [];
    if (assignTo === "students") targets = targetStudentIds.map((id) => ({ studentId: id }));
    else if (assignTo === "classes") targets = targetClassIds.map((id) => ({ classId: id }));
    const effectiveDueDate = hasDueDate && dueDate ? dueDate : undefined;

    if (assignmentType === "quiz") {
      const body = {
        title: quizTitle.trim(),
        category: "quiz",
        prompt: JSON.stringify({ questions: quizQuestions.map(({ text, options, correct }) => ({ text, options, correct })) }),
        dueDate: effectiveDueDate,
        targets,
      };
      const res = await fetch("/api/teacher/assignments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json() as { ok: boolean; assignment?: TeacherData["assignments"][0]; error?: string };
      if (data.ok && data.assignment) { onCreated(data.assignment); onClose(); }
      else { setSaveError(data.error ?? "Failed to create quiz."); setSaving(false); }
      return;
    }

    if (assignmentType === "homework") {
      const promptData = hwResourceUrl.trim()
        ? JSON.stringify({ text: hwInstructions.trim(), url: hwResourceUrl.trim() })
        : hwInstructions.trim();
      const body = {
        title: hwTitle.trim(),
        category: "homework",
        prompt: promptData || undefined,
        minWords: hwSubmitType === "text" ? (hwHasMinWords ? parseInt(hwMinWords) : 0) : undefined,
        dueDate: effectiveDueDate,
        targets,
      };
      const res = await fetch("/api/teacher/assignments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json() as { ok: boolean; assignment?: TeacherData["assignments"][0]; error?: string };
      if (data.ok && data.assignment) { onCreated(data.assignment); onClose(); }
      else { setSaveError(data.error ?? "Failed to create assignment."); setSaving(false); }
      return;
    }

    if (assignmentType === "essay") {
      const body = {
        title: essayTitle.trim(),
        category: "essay",
        prompt: essayPrompt.trim() || undefined,
        minWords: hasMinWords ? parseInt(essayMinWords) : undefined,
        dueDate: effectiveDueDate,
        targets,
      };
      const res = await fetch("/api/teacher/assignments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json() as { ok: boolean; assignment?: TeacherData["assignments"][0]; error?: string };
      if (data.ok && data.assignment) { onCreated(data.assignment); onClose(); }
      else { setSaveError(data.error ?? "Failed to create assignment."); setSaving(false); }
      return;
    }

    if (!parsed) return;
    // Create one assignment per selected exercise (or one without exercise_no if all/none selected)
    const exerciseNums = selectedExercises.length === 0 || selectedExercises.length === 4 ? [undefined] : selectedExercises;
    let lastError = "";
    for (let i = 0; i < exerciseNums.length; i++) {
      const exNo = exerciseNums[i];
      const isLast = i === exerciseNums.length - 1;
      const body = {
        title: title.trim() || parsed.title,
        category: parsed.category,
        level: parsed.level || undefined,
        slug: parsed.slug,
        exerciseNo: exNo,
        dueDate: effectiveDueDate,
        targets,
        skipEmail: !isLast, // only send email on the last assignment in the batch
      };
      const res = await fetch("/api/teacher/assignments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json() as { ok: boolean; assignment?: TeacherData["assignments"][0]; error?: string };
      if (data.ok && data.assignment) {
        onCreated(data.assignment);
      } else {
        lastError = data.error ?? "Failed to create assignment.";
      }
    }
    if (lastError) {
      setSaveError(lastError);
      setSaving(false);
    } else {
      onClose();
    }
  }

  const canSubmit = (
    assignmentType === "essay" ? !!essayTitle.trim() :
    assignmentType === "homework" ? !!hwTitle.trim() && !!hwInstructions.trim() :
    assignmentType === "quiz" ? (
      !!quizTitle.trim() && quizQuestions.length >= 1 &&
      quizQuestions.every((q) => q.text.trim() && q.options.every((o) => o.trim()))
    ) :
    !!parsed
  )
    && (assignTo !== "students" || targetStudentIds.length > 0)
    && (assignTo !== "classes" || targetClassIds.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full sm:max-w-lg max-h-[90dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 backdrop-blur px-6 py-4">
          <div>
            <h2 className="text-base font-black text-slate-900">New Assignment</h2>
            <p className="text-xs text-slate-400">
              {assignmentType === "homework" ? "Create a custom task for your students" : assignmentType === "essay" ? "Assign a writing task to your students" : assignmentType === "quiz" ? "Build a multiple-choice quiz for your students" : "Pick an exercise and assign it to your students"}
            </p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* ── Assignment type toggle ── */}
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
            {([
              { id: "exercise" as const, label: "📝 Exercise" },
              { id: "essay" as const, label: "✍️ Essay" },
              { id: "homework" as const, label: "📋 Homework" },
              { id: "quiz" as const, label: "🧠 Quiz" },
            ]).map((t) => (
              <button key={t.id} type="button" onClick={() => setAssignmentType(t.id)}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${assignmentType === t.id ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Exercise mode ── */}
          {assignmentType === "exercise" && (
            <>
              {/* Step 1: Find exercise */}
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Step 1 — Choose Exercise</p>

                {/* Mode toggle */}
                <div className="mb-4 flex gap-1 rounded-xl bg-slate-100 p-1">
                  {(["url", "browse"] as const).map((m) => (
                    <button key={m} type="button" onClick={() => setFindMode(m)}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${findMode === m ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"}`}>
                      {m === "url" ? "🔗 Paste URL" : "📚 Browse Topics"}
                    </button>
                  ))}
                </div>

                {findMode === "url" ? (
                  <div>
                    <div className="relative">
                      <input
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://englishnerd.cc/grammar/b1/past-continuous"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition"
                      />
                      {urlInput && (
                        <button type="button" onClick={() => setUrlInput("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      )}
                    </div>
                    {parseError && <p className="mt-2 text-xs text-red-500">{parseError}</p>}
                    {!urlInput && <p className="mt-2 text-xs text-slate-400">Open any exercise on the site, copy the URL, and paste it here.</p>}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Category</label>
                      <div className="flex gap-1.5">
                        {(["grammar", "tenses", "vocabulary"] as const).map((cat) => (
                          <button key={cat} type="button" onClick={() => setBrowseCategory(cat)}
                            className={`flex-1 rounded-xl py-2 text-xs font-bold capitalize transition ${browseCategory === cat ? "bg-violet-600 text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                    {browseCategory !== "tenses" && (
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Level</label>
                        <div className="flex gap-1.5">
                          {(["a1", "a2", "b1", "b2", "c1"] as const).map((l) => (
                            <button key={l} type="button" onClick={() => setBrowseLevel(l)}
                              className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${browseLevel === l ? "bg-violet-600 text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                              {l.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="mb-1 block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Topic</label>
                      <select value={browseSlug} onChange={(e) => setBrowseSlug(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400">
                        <option value="">— Select a topic —</option>
                        {browseTopics.map((t) => {
                          const slug = t.href.split("/").at(-1) ?? "";
                          return <option key={slug} value={slug}>{t.title}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                )}

                {/* Exercise preview card */}
                {parsed && (
                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white ${parsed.level ? (LEVEL_COLORS_ASSIGN[parsed.level] ?? "bg-slate-500") : (CATEGORY_COLORS[parsed.category] ?? "bg-slate-500")}`}>
                      {parsed.level ? parsed.level.toUpperCase() : parsed.category.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800">{parsed.title}</p>
                      <p className="text-xs text-slate-400 capitalize">{parsed.category}{parsed.level ? ` · ${parsed.level.toUpperCase()}` : ""}</p>
                    </div>
                    <svg className="h-5 w-5 shrink-0 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Step 2: Details */}
              {parsed && (
                <>
                  <div className="border-t border-slate-100" />
                  <div>
                    <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Step 2 — Details</p>
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Title</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={parsed.title}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition" />
                      </div>

                      <div>
                        <label className="mb-2 block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                          Exercises <span className="text-slate-300 normal-case font-normal">(leave unchecked = all)</span>
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4].map((n) => {
                            const checked = selectedExercises.includes(n);
                            return (
                              <button key={n} type="button"
                                onClick={() => setSelectedExercises((p) => checked ? p.filter((x) => x !== n) : [...p, n])}
                                className={`flex-1 rounded-xl border py-2 text-xs font-bold transition ${checked ? "border-violet-400 bg-violet-50 text-violet-700" : "border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:text-violet-500"}`}>
                                Ex {n}
                              </button>
                            );
                          })}
                        </div>
                        {selectedExercises.length > 0 && selectedExercises.length < 4 && (
                          <p className="mt-1.5 text-[11px] text-violet-500">Will create {selectedExercises.length} separate assignment{selectedExercises.length > 1 ? "s" : ""}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 flex cursor-pointer items-center gap-2">
                          <input type="checkbox" checked={hasDueDate} onChange={(e) => setHasDueDate(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 accent-violet-600" />
                          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Set due date</span>
                        </label>
                        {hasDueDate && (
                          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                            min={new Date().toISOString().slice(0, 10)}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400" />
                        )}
                      </div>

                      <div>
                        <label className="mb-2 block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Assign to</label>
                        <div className="flex gap-2 mb-3">
                          {([
                            { id: "everyone" as const, label: "Everyone" },
                            { id: "students" as const, label: "Students", disabled: activeStudents.length === 0 },
                            { id: "classes" as const, label: "Classes", disabled: teacherClasses.length === 0 },
                          ]).map((opt) => (
                            <button key={opt.id} type="button"
                              disabled={opt.disabled}
                              onClick={() => setAssignTo(opt.id)}
                              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${assignTo === opt.id ? "bg-violet-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"} disabled:opacity-40 disabled:cursor-not-allowed`}>
                              {opt.label}
                            </button>
                          ))}
                        </div>

                        {assignTo === "students" && activeStudents.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {activeStudents.map((s) => {
                              const selected = targetStudentIds.includes(s.studentId!);
                              return (
                                <button key={s.studentId} type="button" onClick={() => toggleStudent(s.studentId!)}
                                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${selected ? "bg-violet-100 text-violet-700 ring-1 ring-violet-300" : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"}`}>
                                  <div className="relative h-6 w-6 shrink-0">
                                    <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-black overflow-hidden ${selected ? "bg-violet-200 text-violet-700" : "bg-slate-200 text-slate-500"}`}>
                                      {s.studentAvatarUrl ? (
                                        <>
                                          <span className="absolute inset-0 flex items-center justify-center rounded-full">{s.studentName ? initials(s.studentName, s.email) : s.email.slice(0, 2).toUpperCase()}</span>
                                          <img src={s.studentAvatarUrl} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover relative rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                        </>
                                      ) : (s.studentName ? initials(s.studentName, s.email) : s.email.slice(0, 2).toUpperCase())}
                                    </div>
                                  </div>
                                  {s.studentName || s.email.split("@")[0]}
                                  {selected && <svg className="h-3 w-3 text-violet-500 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {assignTo === "classes" && teacherClasses.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {teacherClasses.map((c) => {
                              const selected = targetClassIds.includes(c.id);
                              return (
                                <button key={c.id} type="button" onClick={() => toggleClass(c.id)}
                                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${selected ? "bg-violet-100 text-violet-700 ring-1 ring-violet-300" : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"}`}>
                                  <span className="text-sm leading-none">{c.emoji}</span>
                                  {c.name}
                                  <span className="text-[10px] opacity-60">({c.memberIds.length})</span>
                                  {selected && <svg className="h-3 w-3 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {assignTo === "everyone" && (
                          <p className="text-xs text-slate-400">All your active students will see this assignment.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ── Quiz mode ── */}
          {assignmentType === "quiz" && (
            <div className="space-y-5">
              {/* Quiz title */}
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Quiz Title <span className="text-red-400">*</span>
                </label>
                <input value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="e.g. Present Simple — Quick Check"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
              </div>

              {/* Instructions */}
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Instructions <span className="text-slate-300 normal-case font-normal">(optional)</span>
                </label>
                <input value={quizInstructions} onChange={(e) => setQuizInstructions(e.target.value)}
                  placeholder="e.g. Choose the correct answer for each question."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
              </div>

              {/* Questions */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Questions <span className="ml-1 rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-600">{quizQuestions.length}</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Click a letter to mark correct answer</span>
                </div>

                <div className="space-y-3">
                  {quizQuestions.map((q, qi) => (
                    <div key={q.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                      {/* Question header */}
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-black text-white">{qi + 1}</span>
                        <input
                          value={q.text}
                          onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                          placeholder={`Question ${qi + 1}…`}
                          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                        />
                        {quizQuestions.length > 1 && (
                          <button type="button" onClick={() => removeQuestion(q.id)}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-400 transition">
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        )}
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-2 gap-2">
                        {(["A", "B", "C", "D"] as const).map((letter, oi) => {
                          const isCorrect = q.correct === oi;
                          return (
                            <div key={oi} className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 transition ${isCorrect ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                              <button
                                type="button"
                                onClick={() => updateQuestion(q.id, { correct: oi })}
                                title="Mark as correct"
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-black transition ${isCorrect ? "bg-emerald-500 text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-600"}`}
                              >
                                {isCorrect ? "✓" : letter}
                              </button>
                              <input
                                value={q.options[oi]}
                                onChange={(e) => updateOption(q.id, oi, e.target.value)}
                                placeholder={`Option ${letter}…`}
                                className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-300"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <button type="button" onClick={addQuestion}
                  className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-200 py-3 text-sm font-bold text-indigo-400 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add Question
                </button>
              </div>

              {/* Due date */}
              <div>
                <label className="mb-1 flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={hasDueDate} onChange={(e) => setHasDueDate(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-indigo-600" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Set due date</span>
                </label>
                {hasDueDate && (
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
                )}
              </div>

              {/* Assign to */}
              <div>
                <label className="mb-2 block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Assign to</label>
                <div className="flex gap-2 mb-3">
                  {([
                    { id: "everyone" as const, label: "Everyone" },
                    { id: "students" as const, label: "Students", disabled: activeStudents.length === 0 },
                    { id: "classes" as const, label: "Classes", disabled: teacherClasses.length === 0 },
                  ]).map((opt) => (
                    <button key={opt.id} type="button" disabled={opt.disabled} onClick={() => setAssignTo(opt.id)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${assignTo === opt.id ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"} disabled:opacity-40 disabled:cursor-not-allowed`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {assignTo === "students" && activeStudents.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activeStudents.map((s) => {
                      const sel = targetStudentIds.includes(s.studentId!);
                      return (
                        <button key={s.studentId} type="button" onClick={() => toggleStudent(s.studentId!)}
                          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${sel ? "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300" : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"}`}>
                          <div className="relative h-6 w-6 shrink-0">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-black overflow-hidden ${sel ? "bg-indigo-200 text-indigo-700" : "bg-slate-200 text-slate-500"}`}>
                              {s.studentAvatarUrl ? (
                                <>
                                  <span className="absolute inset-0 flex items-center justify-center rounded-full">{s.studentName ? initials(s.studentName, s.email) : s.email.slice(0, 2).toUpperCase()}</span>
                                  <img src={s.studentAvatarUrl} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover relative rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                </>
                              ) : (s.studentName ? initials(s.studentName, s.email) : s.email.slice(0, 2).toUpperCase())}
                            </div>
                          </div>
                          {s.nickname || s.studentName || s.email.split("@")[0]}
                          {sel && <svg className="h-3 w-3 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </button>
                      );
                    })}
                  </div>
                )}
                {assignTo === "classes" && teacherClasses.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {teacherClasses.map((c) => {
                      const sel = targetClassIds.includes(c.id);
                      return (
                        <button key={c.id} type="button" onClick={() => toggleClass(c.id)}
                          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${sel ? "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300" : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"}`}>
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                          {c.name} <span className="opacity-60">({c.memberIds.length})</span>
                          {sel && <svg className="h-3 w-3 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </button>
                      );
                    })}
                  </div>
                )}
                {assignTo === "everyone" && <p className="text-xs text-slate-400">All your active students will see this assignment.</p>}
              </div>
            </div>
          )}

          {/* ── Homework mode ── */}
          {assignmentType === "homework" && (
            <div className="space-y-4">
              {/* Tip */}
              <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p className="text-xs text-amber-700 leading-relaxed">Use <strong>Custom Homework</strong> for any task not on the platform — watching a video, reading an article, drilling vocabulary, etc. Students can mark it done or submit a written response.</p>
              </div>

              {/* Title */}
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Homework Title <span className="text-red-400">*</span>
                </label>
                <input value={hwTitle} onChange={(e) => setHwTitle(e.target.value)}
                  placeholder="e.g. Watch: TED Talk on body language"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition" />
              </div>

              {/* Instructions */}
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Instructions <span className="text-red-400">*</span>
                </label>
                <textarea value={hwInstructions} onChange={(e) => setHwInstructions(e.target.value)}
                  rows={4} placeholder="Describe what the student needs to do. Be specific — include steps, what to focus on, and how to complete it."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition" />
              </div>

              {/* Resource URL */}
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Resource Link <span className="text-slate-300 normal-case font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  <input value={hwResourceUrl} onChange={(e) => setHwResourceUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition" />
                </div>
              </div>

              {/* Submission type */}
              <div>
                <label className="mb-2 block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Student submits</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { val: "done" as const, label: "Mark as Done", desc: "Student taps a button to confirm completion", icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
                    { val: "text" as const, label: "Written Response", desc: "Student writes a short text answer", icon: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
                  ]).map(({ val, label, desc, icon }) => (
                    <button key={val} type="button" onClick={() => setHwSubmitType(val)}
                      className={`flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition ${hwSubmitType === val ? "border-amber-400 bg-amber-50 text-amber-700" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${hwSubmitType === val ? "bg-amber-100" : "bg-slate-100"}`}>{icon}</div>
                      <div>
                        <p className="text-xs font-black">{label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                {hwSubmitType === "text" && (
                  <div className="mt-3">
                    <label className="mb-1 flex cursor-pointer items-center gap-2">
                      <input type="checkbox" checked={hwHasMinWords} onChange={(e) => setHwHasMinWords(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 accent-amber-500" />
                      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Set minimum word count</span>
                    </label>
                    {hwHasMinWords && (
                      <div className="mt-2 flex items-center gap-2">
                        <input type="number" value={hwMinWords} onChange={(e) => setHwMinWords(e.target.value)}
                          min="1" max="2000"
                          className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400" />
                        <span className="text-sm text-slate-400">words minimum</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Due date */}
              <div>
                <label className="mb-1 flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={hasDueDate} onChange={(e) => setHasDueDate(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-amber-500" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Set due date</span>
                </label>
                {hasDueDate && (
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400" />
                )}
              </div>

              {/* Assign to */}
              <div>
                <label className="mb-2 block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Assign to</label>
                <div className="flex gap-2 mb-3">
                  {([
                    { id: "everyone" as const, label: "Everyone" },
                    { id: "students" as const, label: "Students", disabled: activeStudents.length === 0 },
                    { id: "classes" as const, label: "Classes", disabled: teacherClasses.length === 0 },
                  ]).map((opt) => (
                    <button key={opt.id} type="button" disabled={opt.disabled} onClick={() => setAssignTo(opt.id)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${assignTo === opt.id ? "bg-amber-500 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"} disabled:opacity-40 disabled:cursor-not-allowed`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {assignTo === "students" && activeStudents.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activeStudents.map((s) => {
                      const sel = targetStudentIds.includes(s.studentId!);
                      return (
                        <button key={s.studentId} type="button" onClick={() => toggleStudent(s.studentId!)}
                          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${sel ? "bg-amber-100 text-amber-700 ring-1 ring-amber-300" : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"}`}>
                          <div className="relative h-6 w-6 shrink-0">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-black overflow-hidden ${sel ? "bg-amber-200 text-amber-700" : "bg-slate-200 text-slate-500"}`}>
                              {s.studentAvatarUrl ? (
                                <>
                                  <span className="absolute inset-0 flex items-center justify-center rounded-full">{s.studentName ? initials(s.studentName, s.email) : s.email.slice(0, 2).toUpperCase()}</span>
                                  <img src={s.studentAvatarUrl} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover relative rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                </>
                              ) : (s.studentName ? initials(s.studentName, s.email) : s.email.slice(0, 2).toUpperCase())}
                            </div>
                          </div>
                          {s.nickname || s.studentName || s.email.split("@")[0]}
                          {sel && <svg className="h-3 w-3 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </button>
                      );
                    })}
                  </div>
                )}
                {assignTo === "classes" && teacherClasses.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {teacherClasses.map((c) => {
                      const sel = targetClassIds.includes(c.id);
                      return (
                        <button key={c.id} type="button" onClick={() => toggleClass(c.id)}
                          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${sel ? "bg-amber-100 text-amber-700 ring-1 ring-amber-300" : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"}`}>
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                          {c.name} <span className="opacity-60">({c.memberIds.length})</span>
                          {sel && <svg className="h-3 w-3 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </button>
                      );
                    })}
                  </div>
                )}
                {assignTo === "everyone" && <p className="text-xs text-slate-400">All your active students will see this assignment.</p>}
              </div>
            </div>
          )}

          {/* ── Essay mode ── */}
          {assignmentType === "essay" && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Topic / Title <span className="text-red-400">*</span>
                </label>
                <input value={essayTitle} onChange={(e) => setEssayTitle(e.target.value)}
                  placeholder="e.g. My favourite season"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition" />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Prompt / Instructions <span className="text-slate-300 normal-case font-normal">(optional)</span>
                </label>
                <textarea value={essayPrompt} onChange={(e) => setEssayPrompt(e.target.value)}
                  rows={3} placeholder="e.g. Describe your favourite season and explain why you like it."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition" />
              </div>

              <div>
                <label className="mb-1 flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={hasMinWords} onChange={(e) => setHasMinWords(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-violet-600" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Minimum word count</span>
                </label>
                {hasMinWords && (
                  <div className="mt-2 flex items-center gap-2">
                    <input type="number" value={essayMinWords} onChange={(e) => setEssayMinWords(e.target.value)}
                      min="1" max="5000"
                      className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400" />
                    <span className="text-sm text-slate-400">words</span>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={hasDueDate} onChange={(e) => setHasDueDate(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-violet-600" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Set due date</span>
                </label>
                {hasDueDate && (
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400" />
                )}
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Assign to</label>
                <div className="flex gap-2 mb-3">
                  {([
                    { id: "everyone" as const, label: "Everyone" },
                    { id: "students" as const, label: "Students", disabled: activeStudents.length === 0 },
                    { id: "classes" as const, label: "Classes", disabled: teacherClasses.length === 0 },
                  ]).map((opt) => (
                    <button key={opt.id} type="button"
                      disabled={opt.disabled}
                      onClick={() => setAssignTo(opt.id)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${assignTo === opt.id ? "bg-violet-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"} disabled:opacity-40 disabled:cursor-not-allowed`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {assignTo === "students" && activeStudents.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activeStudents.map((s) => {
                      const sel = targetStudentIds.includes(s.studentId!);
                      return (
                        <button key={s.studentId} type="button" onClick={() => toggleStudent(s.studentId!)}
                          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${sel ? "bg-violet-100 text-violet-700 ring-1 ring-violet-300" : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"}`}>
                          <div className="relative h-6 w-6 shrink-0">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-black overflow-hidden ${sel ? "bg-violet-200 text-violet-700" : "bg-slate-200 text-slate-500"}`}>
                              {s.studentAvatarUrl ? (
                                <>
                                  <span className="absolute inset-0 flex items-center justify-center rounded-full">{s.studentName ? initials(s.studentName, s.email) : s.email.slice(0, 2).toUpperCase()}</span>
                                  <img src={s.studentAvatarUrl} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover relative rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                </>
                              ) : (s.studentName ? initials(s.studentName, s.email) : s.email.slice(0, 2).toUpperCase())}
                            </div>
                          </div>
                          {s.nickname || s.studentName || s.email.split("@")[0]}
                          {sel && <svg className="h-3 w-3 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </button>
                      );
                    })}
                  </div>
                )}
                {assignTo === "classes" && teacherClasses.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {teacherClasses.map((c) => {
                      const sel = targetClassIds.includes(c.id);
                      return (
                        <button key={c.id} type="button" onClick={() => toggleClass(c.id)}
                          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${sel ? "bg-violet-100 text-violet-700 ring-1 ring-violet-300" : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"}`}>
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                          </svg>
                          {c.name} <span className="opacity-60 text-[10px]">({c.memberIds.length})</span>
                          {sel && <svg className="h-3 w-3 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        </button>
                      );
                    })}
                  </div>
                )}
                {assignTo === "everyone" && (
                  <p className="text-xs text-slate-400">All your active students will see this assignment.</p>
                )}
              </div>
            </div>
          )}

          {/* Error */}
          {saveError && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{saveError}</div>
          )}

          {/* Footer */}
          <div className="flex gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={!canSubmit || saving}
              className="flex-1 rounded-xl bg-violet-600 py-3 text-sm font-black text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed">
              {saving ? "Creating…" : "Create Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Student detail types ────────────────────────────────────────────────────

type StudentProgressRow = {
  id: string; category: string; level: string | null; slug: string;
  exerciseNo: number | null; score: number; questionsTotal: number | null; completedAt: string;
};
type StudentAnswerRow = {
  progressId: string; questionIndex: number; questionText: string | null;
  userAnswer: string | null; correctAnswer: string | null; isCorrect: boolean;
};

// ── TestBreakdown ────────────────────────────────────────────────────────────

function TestBreakdown({ slug, answers }: { slug: string; answers: { questionText: string | null; correctAnswer: string | null; isCorrect: boolean }[] }) {
  if (slug === "vocabulary") {
    const bands = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
    const bandIncrement: Record<string, number> = { A1: 1000, A2: 1000, B1: 1000, B2: 2000, C1: 2000, C2: 2000 };
    const bandBar: Record<string, string> = { A1: "bg-emerald-400", A2: "bg-teal-400", B1: "bg-sky-400", B2: "bg-violet-400", C1: "bg-orange-400", C2: "bg-rose-400" };
    const bandBadge: Record<string, string> = { A1: "bg-emerald-100 text-emerald-700", A2: "bg-teal-100 text-teal-700", B1: "bg-sky-100 text-sky-700", B2: "bg-violet-100 text-violet-700", C1: "bg-orange-100 text-orange-700", C2: "bg-rose-100 text-rose-700" };
    const stats: Record<string, { known: number; total: number }> = {};
    for (const b of bands) stats[b] = { known: 0, total: 0 };
    for (const a of answers) {
      const band = a.correctAnswer ?? "";
      if (stats[band]) { stats[band].total++; if (a.isCorrect) stats[band].known++; }
    }
    let vocabEst = 0;
    for (const b of bands) {
      const s = stats[b];
      vocabEst += s.total ? Math.round((s.known / s.total) * bandIncrement[b]) : 0;
    }
    vocabEst = Math.min(vocabEst, 12000);
    const totalKnown = Object.values(stats).reduce((acc, s) => acc + s.known, 0);
    const totalWords = Object.values(stats).reduce((acc, s) => acc + s.total, 0);
    return (
      <div className="border-t border-slate-50 px-5 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Vocabulary Breakdown</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{totalKnown}/{totalWords} words known</span>
            <span className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-1 text-sm font-black text-amber-700">~{vocabEst.toLocaleString()} words</span>
          </div>
        </div>
        <div className="space-y-2.5">
          {bands.map((band) => {
            const s = stats[band];
            if (s.total === 0) return null;
            const pct = Math.round((s.known / s.total) * 100);
            return (
              <div key={band} className="flex items-center gap-3">
                <span className={`flex-none w-8 rounded-md text-center py-0.5 text-[10px] font-black ${bandBadge[band]}`}>{band}</span>
                <div className="flex-1 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full transition-all duration-500 ${bandBar[band]}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="flex-none w-20 text-right text-xs font-semibold text-slate-500">{s.known}/{s.total} · {pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (slug === "grammar" || slug === "tenses") {
    const groupMap: Record<string, { correct: number; total: number }> = {};
    for (const a of answers) {
      const match = /^\[([^\]]+)\]/.exec(a.questionText ?? "");
      const key = match?.[1] ?? "Other";
      if (!groupMap[key]) groupMap[key] = { correct: 0, total: 0 };
      groupMap[key].total++;
      if (a.isCorrect) groupMap[key].correct++;
    }
    const rows = Object.entries(groupMap)
      .map(([name, v]) => ({ name, ...v, percent: v.total ? Math.round((v.correct / v.total) * 100) : 0 }))
      .sort((a, b) => a.percent - b.percent);
    const weak = rows.filter((r) => r.percent < 60);
    const strong = rows.filter((r) => r.percent >= 80);
    const label = slug === "grammar" ? "Grammar" : "Tenses";
    return (
      <div className="border-t border-slate-50 px-5 py-5 space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label} Breakdown</p>
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.name} className="flex items-center gap-3">
              <span className="flex-none w-36 truncate text-xs font-semibold text-slate-700">{r.name}</span>
              <div className="flex-1 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${r.percent >= 80 ? "bg-emerald-400" : r.percent >= 60 ? "bg-amber-400" : "bg-red-400"}`}
                  style={{ width: `${r.percent}%` }}
                />
              </div>
              <span className={`flex-none w-16 text-right text-xs font-black ${r.percent >= 80 ? "text-emerald-600" : r.percent >= 60 ? "text-amber-600" : "text-red-500"}`}>
                {r.correct}/{r.total} · {r.percent}%
              </span>
            </div>
          ))}
        </div>
        {(weak.length > 0 || strong.length > 0) && (
          <div className="flex gap-3 flex-wrap">
            {weak.length > 0 && (
              <div className="flex-1 min-w-0 rounded-xl bg-red-50 border border-red-100 px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1.5">Needs Practice</p>
                <div className="flex flex-wrap gap-1.5">
                  {weak.map((r) => (
                    <span key={r.name} className="rounded-lg bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">{r.name}</span>
                  ))}
                </div>
              </div>
            )}
            {strong.length > 0 && (
              <div className="flex-1 min-w-0 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1.5">Strong Areas</p>
                <div className="flex flex-wrap gap-1.5">
                  {strong.map((r) => (
                    <span key={r.name} className="rounded-lg bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">{r.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}

// ── StudentDetailPanel ──────────────────────────────────────────────────────

const LEVEL_BADGE: Record<string, string> = {
  a1: "bg-emerald-500", a2: "bg-sky-500", b1: "bg-violet-500", b2: "bg-amber-500", c1: "bg-rose-500",
};

function StudentDetailPanel({
  student, assignments: allAssignments, classes: allClasses, onBack, onOpenAssignment, onNewAssignment, initialNotes, linkId,
}: {
  student: { id: string; name: string | null; email: string; avatarUrl: string | null };
  assignments: TeacherData["assignments"];
  classes: TeacherData["classes"];
  onBack: () => void;
  onOpenAssignment: (a: TeacherData["assignments"][0]) => void;
  onNewAssignment: () => void;
  initialNotes: string | null;
  linkId: string;
}) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<StudentProgressRow[]>([]);
  const [answers, setAnswers] = useState<StudentAnswerRow[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [detailTab, setDetailTab] = useState<"progress" | "assignments">("progress");
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [notesSaving, setNotesSaving] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [weakOpen, setWeakOpen] = useState(false);
  const weakLsKey = `eng_teacher_dismissed_weak_${student.id}`;
  const [dismissedWeak, setDismissedWeak] = useState<Set<string>>(() => {
    try {
      const saved: string[] = JSON.parse(localStorage.getItem(`eng_teacher_dismissed_weak_${student.id}`) ?? "[]");
      return new Set(saved);
    } catch { return new Set(); }
  });
  const notesTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function dismissWeakTopic(key: string) {
    setDismissedWeak((prev) => {
      const next = new Set([...prev, key]);
      try { localStorage.setItem(weakLsKey, JSON.stringify(Array.from(next))); } catch { /* ignore */ }
      return next;
    });
  }

  function restoreWeakTopics() {
    setDismissedWeak(new Set());
    try { localStorage.removeItem(weakLsKey); } catch { /* ignore */ }
  }

  // Fetch on mount
  useEffect(() => {
    fetch(`/api/teacher/students/${student.id}/progress`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) { setProgress(data.progress); setAnswers(data.answers); }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student.id]);

  function handleNotesChange(val: string) {
    setNotes(val);
    setNotesSaved(false);
    if (notesTimerRef.current) clearTimeout(notesTimerRef.current);
    notesTimerRef.current = setTimeout(async () => {
      setNotesSaving(true);
      await fetch("/api/teacher/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentLinkId: linkId, notes: val }),
      });
      setNotesSaving(false);
      setNotesSaved(true);
    }, 900);
  }

  const totalCompleted = progress.length;
  const avgScore = totalCompleted ? Math.round(progress.reduce((s, r) => s + r.score, 0) / totalCompleted) : null;
  const bestScore = totalCompleted ? Math.max(...progress.map((r) => r.score)) : null;
  const topicsMastered = (() => {
    const best: Record<string, number> = {};
    for (const r of progress) { const k = `${r.category}:${r.level}:${r.slug}`; best[k] = Math.max(best[k] ?? 0, r.score); }
    return Object.values(best).filter((s) => s >= 80).length;
  })();
  const studentWeakTopics = (() => {
    const best: Record<string, number> = {};
    for (const r of progress) {
      const k = `${r.category}:${r.level ?? ""}:${r.slug}`;
      best[k] = Math.max(best[k] ?? 0, r.score);
    }
    return Object.entries(best)
      .filter(([, score]) => score < 70)
      .map(([key, bestScore]) => {
        const [category, level, slug] = key.split(":");
        return { category, level: level || null, slug, bestScore, href: `/${category}${level ? `/${level}` : ""}/${slug}` };
      })
      .sort((a, b) => a.bestScore - b.bestScore)
      .slice(0, 8);
  })();
  const answersByProgress = answers.reduce<Record<string, StudentAnswerRow[]>>((acc, a) => {
    (acc[a.progressId] ??= []).push(a); return acc;
  }, {});
  const categories = Array.from(new Set(progress.map((r) => r.category)));
  const levels = Array.from(new Set(progress.map((r) => r.level).filter(Boolean))) as string[];
  const filtered = progress.filter((r) => {
    if (filterCategory !== "all" && r.category !== filterCategory) return false;
    if (filterLevel !== "all" && r.level !== filterLevel) return false;
    return true;
  });

  const displayName = student.name || student.email;
  const avatarInitials = student.name ? initials(student.name, student.email) : student.email.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-4">
      {/* Back + student header */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/[0.04]">
        <button onClick={onBack} className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-violet-600 transition">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          All students
        </button>
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-base font-black text-violet-600 overflow-hidden">
              {student.avatarUrl ? (
                <>
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-violet-100 text-base font-black text-violet-600">{avatarInitials}</span>
                  <img src={student.avatarUrl} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover relative rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </>
              ) : avatarInitials}
            </div>
          </div>
          <div>
            <p className="text-base font-black text-slate-900">{displayName}</p>
            {student.name && <p className="text-sm text-slate-400">{student.email}</p>}
          </div>
        </div>
      </div>

      {/* Private notes */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-50 px-4 py-2.5">
          <svg className="h-3.5 w-3.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Private notes</p>
          {notesSaving && <svg className="ml-auto h-3.5 w-3.5 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>}
          {notesSaved && !notesSaving && (
            <span className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Saved
            </span>
          )}
        </div>
        <textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          rows={2}
          placeholder="Add private notes about this student — only you can see these…"
          className="w-full resize-none bg-transparent px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 outline-none"
        />
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-black/[0.04]">
        {([
          { key: "progress" as const, label: "Progress" },
          { key: "assignments" as const, label: "Assignments" },
        ]).map((t) => (
          <button key={t.key} onClick={() => setDetailTab(t.key)}
            className={`flex-1 rounded-xl py-2 text-sm font-bold transition ${detailTab === t.key ? "bg-[#F5DA20] text-black shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-12 text-center text-sm text-slate-400 shadow-sm ring-1 ring-black/[0.04]">
          Loading…
        </div>
      ) : (
        <>
          {detailTab === "progress" && <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Completed", value: totalCompleted },
              { label: "Avg Score", value: avgScore !== null ? `${avgScore}%` : "—" },
              { label: "Best Score", value: bestScore !== null ? `${bestScore}%` : "—" },
              { label: "Mastered", value: topicsMastered },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-black/[0.04]">
                <p className={`text-2xl font-black ${stat.label === "Avg Score" && avgScore !== null ? scoreColor(avgScore) : "text-slate-800"}`}>{stat.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Weak Areas */}
          {(() => {
            const visible = studentWeakTopics.filter((t) => !dismissedWeak.has(`${t.category}:${t.level ?? ""}:${t.slug}`));
            const hiddenCnt = studentWeakTopics.length - visible.length;
            if (studentWeakTopics.length === 0) return null;
            return (
              <div className="rounded-2xl border border-rose-100 bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setWeakOpen((v) => !v)}
                  className="flex w-full items-center gap-2.5 px-4 py-3 text-left transition hover:bg-rose-50/40"
                >
                  <svg className="h-4 w-4 text-rose-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <p className="text-sm font-black text-slate-900">Weak Areas</p>
                  <div className="ml-auto flex items-center gap-2">
                    {hiddenCnt > 0 && (
                      <span
                        role="button"
                        onClick={(e) => { e.stopPropagation(); restoreWeakTopics(); }}
                        className="text-[11px] font-semibold text-slate-400 hover:text-violet-600 transition cursor-pointer"
                      >
                        {hiddenCnt} hidden · Restore
                      </span>
                    )}
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-600">{visible.length} &lt;70%</span>
                    <svg className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${weakOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </button>
                {weakOpen && visible.length > 0 && (
                  <div className="divide-y divide-slate-50 border-t border-rose-50">
                    {visible.map((t) => {
                      const key = `${t.category}:${t.level ?? ""}:${t.slug}`;
                      const catColor: Record<string, string> = { grammar: "bg-violet-500", tenses: "bg-sky-500", vocabulary: "bg-amber-500", reading: "bg-emerald-500" };
                      const scoreCls = t.bestScore < 40 ? "text-rose-600 bg-rose-50 border-rose-200" : t.bestScore < 60 ? "text-amber-600 bg-amber-50 border-amber-200" : "text-orange-600 bg-orange-50 border-orange-200";
                      return (
                        <div key={key} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/60 transition-colors group">
                          <span className={`h-2 w-2 shrink-0 rounded-full ${catColor[t.category] ?? "bg-slate-400"}`} />
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">{t.slug.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</p>
                            <p className="text-[11px] text-slate-400">{t.category}{t.level ? ` · ${t.level.toUpperCase()}` : ""}</p>
                          </div>
                          <span className={`shrink-0 rounded-lg border px-2.5 py-0.5 text-xs font-black ${scoreCls}`}>{t.bestScore}%</span>
                          <a href={t.href} target="_blank" rel="noopener noreferrer"
                            className="shrink-0 rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-600 transition">
                            Open
                          </a>
                          <button
                            onClick={() => dismissWeakTopic(key)}
                            title="Hide this topic"
                            className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition"
                          >
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Filters */}
          {progress.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400">
                <option value="all">All categories</option>
                {categories.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
              <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400">
                <option value="all">All levels</option>
                {levels.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
              </select>
              <span className="ml-auto self-center text-sm text-slate-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            </div>
          )}

          {/* Progress list */}
          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center text-sm text-slate-400 shadow-sm ring-1 ring-black/[0.04]">
              No exercises completed yet.
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((row) => {
                const rowAnswers = answersByProgress[row.id] ?? [];
                const isExpanded = expandedId === row.id;
                const href = `/${row.category}${row.level ? `/${row.level}` : ""}/${row.slug}`;
                return (
                  <div key={row.id} className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-4">
                      {row.level && (
                        <span className={`hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[10px] font-black text-white ${LEVEL_BADGE[row.level] ?? "bg-slate-400"}`}>
                          {row.level.toUpperCase()}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-semibold text-slate-800">
                          {slugToTitle(row.slug)}
                          {row.exerciseNo && <span className="text-slate-400"> · Ex. {row.exerciseNo}</span>}
                        </p>
                        <p className="text-xs text-slate-400">
                          {row.category} · {timeAgo(row.completedAt)}{row.questionsTotal ? ` · ${row.questionsTotal} questions` : ""}
                        </p>
                      </div>
                      <span className={`rounded-xl border px-3 py-1 text-sm font-black ${scoreBg(row.score)}`}>{row.score}%</span>
                      <div className="flex items-center gap-2">
                        <a href={href} target="_blank" rel="noopener noreferrer"
                          className="hidden sm:flex rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition">
                          Open
                        </a>
                        {rowAnswers.length > 0 && (
                          <button onClick={() => setExpandedId(isExpanded ? null : row.id)}
                            className="rounded-lg border border-violet-200 bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600 hover:bg-violet-100 transition">
                            {isExpanded ? "Hide" : "Details"}
                          </button>
                        )}
                      </div>
                    </div>
                    {isExpanded && rowAnswers.length > 0 && (
                      row.category === "test" ? (
                        <TestBreakdown slug={row.slug} answers={rowAnswers} />
                      ) : (
                        <div className="border-t border-slate-50 px-5 py-4">
                          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            Answers ({rowAnswers.filter((a) => a.isCorrect).length}/{rowAnswers.length} correct)
                          </p>
                          <div className="space-y-2">
                            {rowAnswers.map((a) => (
                              <div key={a.questionIndex} className={`flex items-start gap-3 rounded-xl px-4 py-3 ${a.isCorrect ? "bg-emerald-50" : "bg-red-50"}`}>
                                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white ${a.isCorrect ? "bg-emerald-500" : "bg-red-400"}`}>
                                  {a.isCorrect ? "✓" : "✗"}
                                </span>
                                <div className="flex-1 min-w-0">
                                  {a.questionText && <p className="text-sm font-semibold text-slate-700 mb-1">{a.questionText}</p>}
                                  <div className="flex flex-wrap gap-3 text-xs">
                                    {a.userAnswer && <span className={`font-semibold ${a.isCorrect ? "text-emerald-700" : "text-red-600"}`}>Student: {a.userAnswer}</span>}
                                    {!a.isCorrect && a.correctAnswer && <span className="text-emerald-700 font-semibold">Correct: {a.correctAnswer}</span>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          )}
          </>}

          {detailTab === "assignments" && (() => {
            const studentClasses = allClasses.filter((c) => c.memberIds.includes(student.id)).map((c) => c.id);
            const studentAssignments = allAssignments.filter((a) => {
              if (a.targetStudentIds.length === 0 && a.targetClassIds.length === 0) return true;
              if (a.targetStudentIds.includes(student.id)) return true;
              return a.targetClassIds.some((id) => studentClasses.includes(id));
            });
            if (studentAssignments.length === 0) {
              return (
                <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-black/[0.04] space-y-3">
                  <p className="text-sm text-slate-400">No assignments for this student yet.</p>
                  <button
                    onClick={onNewAssignment}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-700 transition"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Assignment
                  </button>
                </div>
              );
            }
            // Build a map of progress keys for completion check
            const progressKeys = new Set(progress.map((r) =>
              `${r.category}:${r.level ?? ""}:${r.slug}`
            ));
            return (
              <div className="space-y-2">
                <div className="flex justify-end">
                  <button
                    onClick={onNewAssignment}
                    className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-3.5 py-2 text-sm font-bold text-white hover:bg-violet-700 transition"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Assignment
                  </button>
                </div>
                {studentAssignments.map((a) => {
                  const isEssay = a.category === "essay";
                  const key = `${a.category}:${a.level ?? ""}:${a.slug}`;
                  const isDone = !isEssay && progressKeys.has(key);
                  const due = a.dueDate ? new Date(a.dueDate) : null;
                  const isOverdue = due && due < new Date();
                  const catColor = a.category === "grammar" ? "bg-violet-500" : a.category === "tenses" ? "bg-sky-500" : isEssay ? "bg-rose-500" : "bg-amber-500";
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => onOpenAssignment(a)}
                      className="group w-full flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-black/[0.04] text-left transition hover:ring-violet-200 hover:shadow-md"
                    >
                      <div className={`flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-xl text-white ${isDone ? "bg-emerald-500" : catColor}`}>
                        {isDone ? (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : isEssay ? (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        ) : (
                          <>
                            <span className="text-[8px] font-black uppercase leading-none opacity-75">{a.category.slice(0, 3)}</span>
                            <span className="text-[10px] font-black leading-none">{a.level ? a.level.toUpperCase() : "ALL"}</span>
                          </>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {a.title}
                          {!isEssay && a.exerciseNo && <span className="ml-1.5 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">Ex. {a.exerciseNo}</span>}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs">
                          {isEssay && <span className="text-rose-500 font-semibold">Essay</span>}
                          {!isEssay && <span className={isDone ? "text-emerald-600 font-semibold" : "text-slate-400"}>{isDone ? "Completed" : "Not done"}</span>}
                          {due && <><span className="text-slate-200">·</span><span className={isOverdue ? "text-red-500 font-semibold" : "text-slate-400"}>{isOverdue ? "Overdue" : "Due"} {due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span></>}
                        </div>
                      </div>
                      <span className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-violet-500 group-hover:flex">
                        Results
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}

// ── AssignmentResultsModal ──────────────────────────────────────────────────

type EssaySubmission = {
  submissionId: string; content: string; wordCount: number; submittedAt: string;
  status: string; teacherFeedback: string | null; teacherGrade: string | null; feedbackAt: string | null;
};

type AssignmentStudentResult = {
  studentId: string; email: string; name: string | null; avatarUrl: string | null;
  nickname: string | null; completed: boolean; score: number | null;
  questionsTotal: number | null; completedAt: string | null;
  answers: Array<{
    questionIndex: number; questionText: string | null;
    userAnswer: string | null; correctAnswer: string | null; isCorrect: boolean;
  }>;
  essay: EssaySubmission | null;
};

function AssignmentResultsModal({
  assignment, students: teacherStudents, onClose,
}: {
  assignment: TeacherData["assignments"][0];
  students: TeacherData["students"];
  onClose: () => void;
}) {
  const [results, setResults] = useState<AssignmentStudentResult[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  const isEssay = assignment.category === "essay";
  const href = isEssay ? null : `/${assignment.category}${assignment.level ? `/${assignment.level}` : ""}/${assignment.slug}${assignment.exerciseNo ? `#ex${assignment.exerciseNo}` : ""}`;
  const catColor = assignment.category === "grammar" ? "from-violet-500 to-violet-600" : assignment.category === "tenses" ? "from-sky-500 to-sky-600" : isEssay ? "from-rose-500 to-rose-600" : "from-amber-500 to-amber-600";

  useEffect(() => {
    fetch(`/api/teacher/assignments/results?assignmentId=${assignment.id}`)
      .then((r) => r.json())
      .then((d) => { if (d.ok) setResults(d.students); })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment.id]);

  const completed = (results ?? []).filter((s) => s.completed);
  const pending = (results ?? []).filter((s) => !s.completed);
  const avgScore = completed.length ? Math.round(completed.reduce((s, r) => s + (r.score ?? 0), 0) / completed.length) : null;
  const due = assignment.dueDate ? new Date(assignment.dueDate) : null;
  const isOverdue = due && due < new Date();

  function displayName(s: AssignmentStudentResult) {
    return s.nickname || s.name || s.email.split("@")[0];
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        style={{ height: "min(88dvh, 720px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className={`shrink-0 bg-gradient-to-br ${catColor} px-5 py-5`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                {isEssay ? (
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">
                  {isEssay ? "Writing Assignment" : `${assignment.category.charAt(0).toUpperCase() + assignment.category.slice(1)}${assignment.level ? ` · ${assignment.level.toUpperCase()}` : ""}${assignment.exerciseNo ? ` · Ex. ${assignment.exerciseNo}` : ""}`}
                </p>
                <p className="text-base font-black text-white leading-snug">{assignment.title}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {!isEssay && href && (
                <a href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/30">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Open page
                </a>
              )}
              <button onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Stats row */}
          {!loading && results && (
            <div className="mt-4 flex gap-3">
              <div className="flex-1 rounded-2xl bg-white/15 px-3.5 py-2.5">
                <p className="text-[10px] font-black uppercase tracking-wide text-white/60">Completed</p>
                <p className="text-xl font-black text-white">{completed.length}<span className="text-sm font-semibold text-white/60"> / {results.length}</span></p>
              </div>
              {!isEssay && avgScore !== null && (
                <div className="flex-1 rounded-2xl bg-white/15 px-3.5 py-2.5">
                  <p className="text-[10px] font-black uppercase tracking-wide text-white/60">Avg. score</p>
                  <p className="text-xl font-black text-white">{avgScore}<span className="text-sm font-semibold text-white/60">%</span></p>
                </div>
              )}
              {due && (
                <div className="flex-1 rounded-2xl bg-white/15 px-3.5 py-2.5">
                  <p className="text-[10px] font-black uppercase tracking-wide text-white/60">Due</p>
                  <p className={`text-sm font-black ${isOverdue ? "text-red-200" : "text-white"}`}>
                    {due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {isOverdue && <span className="ml-1 text-[10px] font-semibold opacity-80">overdue</span>}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <svg className="h-8 w-8 animate-spin text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                <p className="text-sm text-slate-400">Loading results…</p>
              </div>
            </div>
          ) : results && results.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <svg className="h-7 w-7 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                </svg>
              </div>
              <p className="font-bold text-slate-600">No students assigned</p>
              <p className="text-sm text-slate-400">This assignment has no target students yet.</p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {/* Completed */}
              {completed.length > 0 && (
                <>
                  <p className="px-1 pt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Completed · {completed.length}
                  </p>
                  {completed.map((s) => (
                    <StudentResultRow
                      key={s.studentId} result={s} isEssay={isEssay}
                      expanded={expandedStudent === s.studentId}
                      onToggle={() => setExpandedStudent(expandedStudent === s.studentId ? null : s.studentId)}
                      displayName={displayName(s)}
                    />
                  ))}
                </>
              )}

              {/* Pending */}
              {pending.length > 0 && (
                <>
                  <p className="px-1 pt-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Not done yet · {pending.length}
                  </p>
                  {pending.map((s) => (
                    <StudentResultRow
                      key={s.studentId} result={s} isEssay={isEssay}
                      expanded={false} onToggle={() => {}}
                      displayName={displayName(s)}
                    />
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StudentResultRow({
  result, isEssay, expanded, onToggle, displayName, onFeedbackSaved,
}: {
  result: AssignmentStudentResult; isEssay: boolean;
  expanded: boolean; onToggle: () => void; displayName: string;
  onFeedbackSaved?: (submissionId: string, feedback: string, grade: string) => void;
}) {
  const hasAnswers = result.answers.length > 0;
  const correct = hasAnswers
    ? result.answers.filter((a) => a.isCorrect).length
    : (result.questionsTotal !== null && result.score !== null ? Math.round(result.score / 100 * result.questionsTotal) : null);
  const wrong = hasAnswers
    ? result.answers.filter((a) => !a.isCorrect).length
    : (result.questionsTotal !== null && correct !== null ? result.questionsTotal - correct : null);
  const scoreColor = result.score === null ? "" : result.score >= 80 ? "text-emerald-600 bg-emerald-50" : result.score >= 50 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";

  const [feedbackText, setFeedbackText] = useState(result.essay?.teacherFeedback ?? "");
  const [gradeText, setGradeText] = useState(result.essay?.teacherGrade ?? "");
  const [savingFeedback, setSavingFeedback] = useState(false);
  const [feedbackSaved, setFeedbackSaved] = useState(
    !!(result.essay?.teacherFeedback || result.essay?.teacherGrade)
  );
  const [feedbackError, setFeedbackError] = useState(false);

  const canExpand = result.completed && (isEssay ? !!result.essay : hasAnswers);

  async function handleSaveFeedback() {
    if (!result.essay) return;
    setSavingFeedback(true);
    setFeedbackError(false);
    try {
      const res = await fetch("/api/teacher/essays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: result.essay.submissionId, feedback: feedbackText, grade: gradeText }),
      });
      const json = await res.json();
      if (json.ok) {
        setFeedbackSaved(true);
        onFeedbackSaved?.(result.essay.submissionId, feedbackText, gradeText);
      } else {
        setFeedbackError(true);
      }
    } catch {
      setFeedbackError(true);
    } finally {
      setSavingFeedback(false);
    }
  }

  return (
    <div className={`overflow-hidden rounded-2xl bg-white ring-1 transition ${result.completed ? "ring-black/[0.06]" : "ring-slate-100"}`}>
      <button
        type="button"
        onClick={canExpand ? onToggle : undefined}
        className={`flex w-full items-center gap-3 px-4 py-3.5 text-left ${canExpand ? "hover:bg-slate-50 cursor-pointer" : "cursor-default"}`}
      >
        {/* Avatar */}
        <div className="relative h-9 w-9 shrink-0">
          <div className={`flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-black overflow-hidden ${result.completed ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-400"}`}>
            {result.avatarUrl ? (
              <>
                <span className="absolute inset-0 flex items-center justify-center rounded-full">
                  {(result.name ? result.name.split(" ").map((w) => w[0]).join("").slice(0, 2) : result.email.slice(0, 2)).toUpperCase()}
                </span>
                <img src={result.avatarUrl} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover relative rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </>
            ) : (result.name ? result.name.split(" ").map((w) => w[0]).join("").slice(0, 2) : result.email.slice(0, 2)).toUpperCase()}
          </div>
          <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white ${result.completed ? "bg-emerald-500" : "bg-slate-300"}`} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-bold text-slate-800">{displayName}</p>
          <p className="text-xs text-slate-400">
            {result.completed
              ? result.completedAt ? new Date(result.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Submitted"
              : "Not submitted yet"}
          </p>
        </div>

        {result.completed && !isEssay && result.score !== null && (
          <div className="flex shrink-0 items-center gap-2">
            {correct !== null && wrong !== null && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="flex items-center gap-0.5 font-semibold text-emerald-600">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {correct}
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-0.5 font-semibold text-red-500">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  {wrong}
                </span>
              </div>
            )}
            <span className={`rounded-lg px-2.5 py-1 text-xs font-black ${scoreColor}`}>{result.score}%</span>
          </div>
        )}
        {result.completed && isEssay && (
          <div className="shrink-0 flex items-center gap-1.5">
            {result.essay?.teacherGrade && (
              <span className="rounded-lg bg-violet-100 px-2.5 py-1 text-xs font-black text-violet-700">{result.essay.teacherGrade}</span>
            )}
            <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${result.essay?.status === "reviewed" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
              {result.essay?.status === "reviewed" ? "Reviewed" : "Submitted"}
            </span>
          </div>
        )}
        {canExpand && (
          <svg className={`h-4 w-4 shrink-0 text-slate-300 transition-transform ${expanded ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        )}
      </button>

      {/* Expanded: exercise answers */}
      {expanded && !isEssay && result.answers.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3 space-y-2">
          {result.answers.map((a) => (
            <div key={a.questionIndex} className={`flex gap-3 rounded-xl px-3 py-2.5 text-sm ${a.isCorrect ? "bg-emerald-50 ring-1 ring-emerald-100" : "bg-red-50 ring-1 ring-red-100"}`}>
              <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${a.isCorrect ? "bg-emerald-500" : "bg-red-500"}`}>
                {a.isCorrect
                  ? <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                }
              </div>
              <div className="flex-1 min-w-0">
                {a.questionText && <p className="text-xs text-slate-500 mb-0.5 leading-snug">{a.questionText}</p>}
                <p className={`font-semibold ${a.isCorrect ? "text-emerald-700" : "text-red-700"}`}>{a.userAnswer || "—"}</p>
                {!a.isCorrect && a.correctAnswer && (
                  <p className="mt-0.5 text-xs text-slate-500">Correct: <span className="font-semibold text-emerald-700">{a.correctAnswer}</span></p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Expanded: essay view + feedback form */}
      {expanded && isEssay && result.essay && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-4 space-y-4">
          {/* Essay text */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Student&apos;s essay</p>
              <span className="text-[11px] text-slate-400">{result.essay.wordCount} words</span>
            </div>
            <div className="max-h-48 overflow-y-auto rounded-xl bg-white ring-1 ring-slate-100 px-4 py-3 text-sm leading-7 text-slate-700 whitespace-pre-wrap">
              {result.essay.content}
            </div>
          </div>

          {/* Feedback form */}
          <div className="rounded-xl bg-white ring-1 ring-slate-100 p-4 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your feedback</p>
            <textarea
              value={feedbackText}
              onChange={(e) => { setFeedbackText(e.target.value); setFeedbackSaved(false); setFeedbackError(false); }}
              rows={3}
              placeholder="Write your comments, corrections, suggestions…"
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition"
            />
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  value={gradeText}
                  onChange={(e) => { setGradeText(e.target.value); setFeedbackSaved(false); setFeedbackError(false); }}
                  placeholder="Grade (e.g. A, B+, 85)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition"
                />
              </div>
              <button
                onClick={handleSaveFeedback}
                disabled={savingFeedback || feedbackSaved || (!feedbackText.trim() && !gradeText.trim())}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black text-white shadow-sm transition disabled:opacity-40 ${feedbackError ? "bg-red-500 hover:bg-red-600" : feedbackSaved ? "bg-emerald-500" : "bg-violet-600 hover:bg-violet-700"}`}
              >
                {savingFeedback ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                ) : feedbackSaved ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : feedbackError ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                )}
                {savingFeedback ? "Saving…" : feedbackSaved ? "Saved!" : feedbackError ? "Error — retry" : "Send feedback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ConfirmModal ────────────────────────────────────────────────────────────

function ConfirmModal({
  icon, title, description, confirmLabel, confirmClass, onCancel, onConfirm, disabled,
}: {
  icon: "delete" | "unlink";
  title: string;
  description: string;
  confirmLabel: string;
  confirmClass: string;
  onCancel: () => void;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/[0.06]"
        style={{ animation: "scale-in 0.15s ease both" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex h-13 w-13 items-center justify-center rounded-2xl bg-red-50">
          {icon === "delete" ? (
            <svg className="h-7 w-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          ) : (
            <svg className="h-7 w-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <line x1="17" y1="8" x2="23" y2="14"/><line x1="23" y1="8" x2="17" y2="14"/>
            </svg>
          )}
        </div>
        <h3 className="mb-2 text-lg font-black text-slate-900">{title}</h3>
        <p className="mb-6 text-sm leading-relaxed text-slate-500">{description}</p>
        <div className="flex gap-2.5">
          <button onClick={onCancel} disabled={disabled}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={disabled}
            className={`flex-1 rounded-xl py-3 text-sm font-black text-white shadow-sm transition disabled:opacity-50 ${confirmClass}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── ActivityItem type ───────────────────────────────────────────────────────
type ActivityItem = {
  id: string;
  type: "exercise" | "essay_submitted" | "essay_reviewed";
  studentId: string;
  studentName: string;
  studentAvatar: string | null;
  title: string;
  score: number | null;
  time: string;
};

// ── TeacherTab ─────────────────────────────────────────────────────────────

function TeacherTab({ teacherData, siteUrl }: { teacherData: TeacherData; siteUrl: string }) {
  const [innerTab, setInnerTab] = useState<"students" | "classes" | "assignments">("students");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteMsg, setInviteMsg] = useState<{ type: "ok" | "err"; text: string; url?: string } | null>(null);
  const [students, setStudents] = useState(teacherData.students);
  const [classes, setClasses] = useState(teacherData.classes);
  const [assignments, setAssignments] = useState(teacherData.assignments);
  const [selectedAssignment, setSelectedAssignment] = useState<TeacherData["assignments"][0] | null>(null);
  const [confirmDeleteClass, setConfirmDeleteClass] = useState<{ id: string; name: string } | null>(null);
  const [deletingClass, setDeletingClass] = useState(false);
  const [confirmDeleteAssignment, setConfirmDeleteAssignment] = useState<{ id: string; title: string } | null>(null);
  const [deletingAssignment, setDeletingAssignment] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<{ id: string; dueDate: string } | null>(null);
  const [savingDeadline, setSavingDeadline] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<{ linkId: string; label: string } | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string | null; email: string; avatarUrl: string | null } | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [newClassName, setNewClassName] = useState("");
  const [creatingClass, setCreatingClass] = useState(false);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [addingToClass, setAddingToClass] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [prefilledStudentId, setPrefilledStudentId] = useState<string | undefined>(undefined);
  const [assignmentSentCount, setAssignmentSentCount] = useState(0);
  const [emojiPickerFor, setEmojiPickerFor] = useState<string | null>(null);
  const [renamingStudent, setRenamingStudent] = useState<{ linkId: string; value: string } | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [confirmInfoStudent, setConfirmInfoStudent] = useState<string | null>(null);
  const [assignmentFilterStudent, setAssignmentFilterStudent] = useState<string>("all");
  const [assignmentFilterStatus, setAssignmentFilterStatus] = useState<"all" | "unreviewed">("all");
  const [studentSort, setStudentSort] = useState<"name" | "activity" | "score">("activity");
  const [studentSearch, setStudentSearch] = useState("");
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [copyingAssignment, setCopyingAssignment] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, { completedCount: number; unreviewedCount: number }>>({});
  const [seenAssignments, setSeenAssignments] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/teacher/assignments/summaries")
      .then((r) => r.json())
      .then((d) => { if (d.ok) setSummaries(d.summaries); })
      .catch(() => {});
    try {
      const raw = localStorage.getItem("seen_assignments");
      if (raw) setSeenAssignments(new Set(JSON.parse(raw) as string[]));
    } catch { /* ignore */ }
  }, []);

  function loadActivity() {
    if (activityLoading) return;
    setActivityLoading(true);
    setShowActivity(true);
    fetch("/api/teacher/activity")
      .then((r) => r.json())
      .then((d) => { if (d.ok) setActivities(d.activities); })
      .catch(() => {})
      .finally(() => setActivityLoading(false));
  }

  async function handleExportPDF() {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const W = 210, ml = 14, mr = 14, cw = W - ml - mr;
    const Y = "#F5DA20", BK = "#111111", GR = "#888888", LG = "#F7F7F7";

    const catColors: Record<string, [string, string]> = {
      grammar: ["#7C3AED", "#EDE9FE"],
      tenses:  ["#0EA5E9", "#E0F2FE"],
      vocabulary: ["#F59E0B", "#FEF3C7"],
      essay:   ["#F43F5E", "#FFF1F2"],
    };

    function pageHeader(page: number, total: number) {
      // Yellow top bar
      pdf.setFillColor(Y);
      pdf.rect(0, 0, W, 3, "F");
      // Light header bg
      pdf.setFillColor("#FAFAFA");
      pdf.rect(0, 3, W, 13, "F");
      pdf.setDrawColor("#E5E7EB");
      pdf.setLineWidth(0.3);
      pdf.line(0, 16, W, 16);
      // Brand
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(BK);
      pdf.text("English Nerd", ml, 11);
      // Dot separator
      pdf.setFillColor("#CCCCCC");
      pdf.circle(ml + 27.5, 10, 0.7, "F");
      // Subtitle
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.setTextColor(GR);
      pdf.text("Assignments Report", ml + 31, 11);
      // Page number
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7.5);
      pdf.setTextColor(GR);
      pdf.text(`${page} / ${total}`, W - mr, 11, { align: "right" });
    }

    function pageFooter() {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor("#BBBBBB");
      pdf.text(
        `Generated ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · english-nerd.com`,
        W / 2, 291, { align: "center" }
      );
      pdf.setDrawColor("#EEEEEE");
      pdf.setLineWidth(0.3);
      pdf.line(ml, 288, W - mr, 288);
    }

    // ── Collect data ──────────────────────────────────────────────────────────
    const totalSubs = Object.values(summaries).reduce((s, v) => s + v.completedCount, 0);
    const toReview  = Object.values(summaries).reduce((s, v) => s + v.unreviewedCount, 0);

    // Estimate pages (approx 7 assignments per page)
    const ROWS_PER_PAGE = 7;
    const totalPages = Math.max(1, Math.ceil(assignments.length / ROWS_PER_PAGE));
    let page = 1;

    pageHeader(page, totalPages);

    // ── Title block ───────────────────────────────────────────────────────────
    let y = 24;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.setTextColor(BK);
    pdf.text("Assignments Report", ml, y);

    y += 7;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(GR);
    pdf.text(
      `${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`,
      ml, y
    );

    // ── Stats row ─────────────────────────────────────────────────────────────
    y += 7;
    const stats = [
      { label: "Assignments", value: String(assignments.length) },
      { label: "Total submissions", value: String(totalSubs) },
      { label: "Needs review", value: String(toReview) },
      { label: "Active students", value: String(activeStudents.length) },
    ];
    const boxW = cw / stats.length - 2;
    stats.forEach((s, i) => {
      const bx = ml + i * (boxW + 2.7);
      pdf.setFillColor(LG);
      pdf.roundedRect(bx, y, boxW, 13, 2, 2, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(BK);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdf.text(s.value, bx + boxW / 2, y + 7, { align: "center", baseline: "middle" } as any);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(6.5);
      pdf.setTextColor(GR);
      pdf.text(s.label.toUpperCase(), bx + boxW / 2, y + 11.5, { align: "center" });
    });

    // ── Table header ──────────────────────────────────────────────────────────
    y += 19;
    pdf.setFillColor("#F3F4F6");
    pdf.rect(ml, y, cw, 7, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.setTextColor(GR);
    const cols = { cat: ml + 2, title: ml + 18, target: ml + 108, due: ml + 138, subs: ml + 163 };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdf.text("CAT", cols.cat, y + 4, { baseline: "middle" } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdf.text("ASSIGNMENT", cols.title, y + 4, { baseline: "middle" } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdf.text("ASSIGNED TO", cols.target, y + 4, { baseline: "middle" } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdf.text("DUE DATE", cols.due, y + 4, { baseline: "middle" } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdf.text("DONE", cols.subs, y + 4, { baseline: "middle" } as any);
    y += 7;

    // ── Assignment rows ───────────────────────────────────────────────────────
    assignments.forEach((a, idx) => {
      // New page
      if (idx > 0 && idx % ROWS_PER_PAGE === 0) {
        pageFooter();
        pdf.addPage();
        page++;
        pageHeader(page, totalPages);
        y = 24;
      }

      const rowH = 12;
      // Zebra
      if (idx % 2 === 0) {
        pdf.setFillColor("#FBFBFB");
        pdf.rect(ml, y, cw, rowH, "F");
      }

      // Category color dot
      const [dotColor] = catColors[a.category] ?? ["#94A3B8", "#F8FAFC"];
      pdf.setFillColor(dotColor);
      pdf.circle(cols.cat + 3, y + rowH / 2, 3, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(6);
      pdf.setTextColor("#FFFFFF");
      const catAbbr = a.category === "essay" ? "ES" : a.category.slice(0, 2).toUpperCase();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdf.text(catAbbr, cols.cat + 3, y + rowH / 2, { align: "center", baseline: "middle" } as any);

      // Level badge
      if (a.level) {
        pdf.setFillColor("#E5E7EB");
        pdf.roundedRect(cols.cat + 8, y + 3, 9, 5.5, 1, 1, "F");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(6.5);
        pdf.setTextColor("#6B7280");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(a.level.toUpperCase(), cols.cat + 12.5, y + 6, { align: "center", baseline: "middle" } as any);
      }

      // Title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8.5);
      pdf.setTextColor(BK);
      const titleMaxW = 85;
      const titleStr = pdf.getTextWidth(a.title) > titleMaxW
        ? a.title.slice(0, Math.floor(a.title.length * titleMaxW / pdf.getTextWidth(a.title))) + "…"
        : a.title;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdf.text(titleStr, cols.title, y + rowH / 2, { baseline: "middle" } as any);
      if (a.exerciseNo) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);
        pdf.setTextColor(GR);
        const titleW = pdf.getTextWidth(titleStr);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(`Ex. ${a.exerciseNo}`, cols.title + titleW + 2, y + rowH / 2, { baseline: "middle" } as any);
      }

      // Target
      const targetCount = a.targetStudentIds.length + a.targetClassIds.length;
      const targetLabel = targetCount === 0 ? "Everyone"
        : a.targetStudentIds.length === 1
          ? (students.find((s) => s.studentId === a.targetStudentIds[0])?.nickname ||
             students.find((s) => s.studentId === a.targetStudentIds[0])?.studentName ||
             students.find((s) => s.studentId === a.targetStudentIds[0])?.email || "1 student")
          : a.targetStudentIds.length > 1 ? `${a.targetStudentIds.length} students`
          : a.targetClassIds.length === 1 ? (classes.find((c) => c.id === a.targetClassIds[0])?.name || "1 class")
          : `${a.targetClassIds.length} classes`;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor("#374151");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pdf.text(String(targetLabel).slice(0, 22), cols.target, y + rowH / 2, { baseline: "middle" } as any);

      // Due date
      if (a.dueDate) {
        const dl = dueDateLabel(a.dueDate);
        const isOverdue = new Date(a.dueDate) < new Date();
        pdf.setFont("helvetica", isOverdue ? "bold" : "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(isOverdue ? "#EF4444" : "#374151");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text(dl.text, cols.due, y + rowH / 2, { baseline: "middle" } as any);
      } else {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor("#D1D5DB");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.text("—", cols.due, y + rowH / 2, { baseline: "middle" } as any);
      }

      // Submissions
      const sum = summaries[a.id];
      const done = sum?.completedCount ?? 0;
      const unrev = sum?.unreviewedCount ?? 0;
      if (sum) {
        // Green circle if done > 0
        if (done > 0) {
          pdf.setFillColor(unrev > 0 ? "#F59E0B" : "#10B981");
          pdf.circle(cols.subs + 3, y + rowH / 2, 3, "F");
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(6.5);
          pdf.setTextColor("#FFFFFF");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pdf.text(String(done), cols.subs + 3, y + rowH / 2, { align: "center", baseline: "middle" } as any);
          if (unrev > 0) {
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(7);
            pdf.setTextColor("#F59E0B");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pdf.text(`${unrev} to review`, cols.subs + 8, y + rowH / 2, { baseline: "middle" } as any);
          }
        } else {
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(7.5);
          pdf.setTextColor("#D1D5DB");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pdf.text("—", cols.subs + 3, y + rowH / 2, { baseline: "middle" } as any);
        }
      }

      // Row separator
      pdf.setDrawColor("#F3F4F6");
      pdf.setLineWidth(0.2);
      pdf.line(ml, y + rowH, W - mr, y + rowH);

      y += rowH;
    });

    pageFooter();
    pdf.save(`assignments-${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  async function handleCopyAssignment(a: TeacherData["assignments"][0]) {
    setCopyingAssignment(a.id);
    try {
      const res = await fetch("/api/teacher/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${a.title} (copy)`,
          category: a.category,
          level: a.level,
          slug: a.slug,
          exerciseNo: a.exerciseNo,
          dueDate: null,
          prompt: a.prompt,
          minWords: a.minWords,
          targets: [],
        }),
      });
      const data = await res.json() as { ok: boolean; assignment?: TeacherData["assignments"][0] };
      if (data.ok && data.assignment) {
        setAssignments((p) => [data.assignment!, ...p]);
      }
    } finally {
      setCopyingAssignment(null);
    }
  }

  function markAssignmentSeen(id: string) {
    setSeenAssignments((prev) => {
      const next = new Set(prev);
      next.add(id);
      try { localStorage.setItem("seen_assignments", JSON.stringify(Array.from(next))); } catch { /* ignore */ }
      return next;
    });
  }

  const activeStudents = students.filter((s) => s.status === "active" && s.studentId);

  function timeAgo(iso: string | null) {
    if (!iso) return "—";
    const diff = Date.now() - new Date(iso).getTime();
    const d = Math.floor(diff / 86400000);
    if (d === 0) return "today";
    if (d === 1) return "yesterday";
    if (d < 7) return `${d}d ago`;
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function scoreColor(s: number | null) { return s === null ? "text-slate-400" : s >= 80 ? "text-emerald-600" : s >= 50 ? "text-amber-600" : "text-red-500"; }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault(); setInviting(true); setInviteMsg(null);
    const res = await fetch("/api/teacher/invite", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: inviteEmail }) });
    const data = await res.json();
    if (data.ok) { setInviteMsg({ type: "ok", text: data.status === "active" ? "Student added!" : data.status === "pending_student" ? "Invite sent! The student will see a confirmation in their Account page." : "Invite link created.", url: data.inviteUrl }); setInviteEmail(""); window.location.reload(); }
    else setInviteMsg({ type: "err", text: data.error });
    setInviting(false);
  }

  async function handleRemove(linkId: string) {
    setRemoving(linkId);
    const res = await fetch("/api/teacher/students", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentLinkId: linkId }) });
    if ((await res.json()).ok) setStudents((p) => p.filter((s) => s.linkId !== linkId));
    setRemoving(null);
  }

  async function handleRename(linkId: string, nickname: string) {
    setRenaming(true);
    const res = await fetch("/api/teacher/students", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentLinkId: linkId, nickname }) });
    if ((await res.json()).ok) {
      setStudents((p) => p.map((s) => s.linkId === linkId ? { ...s, nickname: nickname.trim() || null } : s));
      setRenamingStudent(null);
    }
    setRenaming(false);
  }

  const CLASS_EMOJIS = ["🦊","🐻","🐼","🐨","🦁","🐯","🐸","🐬","🦋","🦄","🦅","🐙","🦀","🐢","🦕","🐳","🦭","🦉","🐝","🦜","🦩","🐊","🦔","🐺","🦇","🐲","🦑","🦈","🐡","🦃"];

  async function handleCreateClass(e: React.FormEvent) {
    e.preventDefault(); setCreatingClass(true);
    const emoji = CLASS_EMOJIS[Math.floor(Math.random() * CLASS_EMOJIS.length)];
    const res = await fetch("/api/teacher/classes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newClassName.trim(), emoji }) });
    const data = await res.json();
    if (data.ok) { setClasses((p) => [{ ...data.class, memberIds: [], emoji: data.class.emoji ?? emoji, createdAt: data.class.created_at }, ...p]); setNewClassName(""); }
    setCreatingClass(false);
  }

  async function handleUpdateEmoji(classId: string, emoji: string) {
    await fetch("/api/teacher/classes", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ classId, emoji }) });
    setClasses((p) => p.map((c) => c.id === classId ? { ...c, emoji } : c));
  }

  async function handleAddToClass(classId: string, studentId: string) {
    setAddingToClass(studentId);
    const res = await fetch("/api/teacher/classes/members", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ classId, studentId }) });
    if ((await res.json()).ok) setClasses((p) => p.map((c) => c.id === classId ? { ...c, memberIds: [...c.memberIds, studentId] } : c));
    setAddingToClass(null);
  }

  async function handleRemoveFromClass(classId: string, studentId: string) {
    await fetch(`/api/teacher/classes/members?classId=${classId}&studentId=${studentId}`, { method: "DELETE" });
    setClasses((p) => p.map((c) => c.id === classId ? { ...c, memberIds: c.memberIds.filter((id) => id !== studentId) } : c));
  }

  async function doDeleteClass(classId: string) {
    setDeletingClass(true);
    const res = await fetch(`/api/teacher/classes?classId=${classId}`, { method: "DELETE" });
    if ((await res.json()).ok) setClasses((p) => p.filter((c) => c.id !== classId));
    setDeletingClass(false);
    setConfirmDeleteClass(null);
  }

  async function doDeleteAssignment(id: string) {
    setDeletingAssignment(true);
    const res = await fetch(`/api/teacher/assignments?assignmentId=${id}`, { method: "DELETE" });
    if ((await res.json()).ok) {
      setAssignments((p) => p.filter((a) => a.id !== id));
      // Refresh activity feed if it's been loaded
      if (activities.length > 0 || showActivity) {
        fetch("/api/teacher/activity")
          .then((r) => r.json())
          .then((d) => { if (d.ok) setActivities(d.activities); })
          .catch(() => {});
      }
    }
    setDeletingAssignment(false);
    setConfirmDeleteAssignment(null);
  }

  async function handleEditDeadline(assignmentId: string, dueDate: string | null) {
    setSavingDeadline(true);
    try {
      const res = await fetch("/api/teacher/assignments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId, dueDate: dueDate || null }),
      });
      if ((await res.json()).ok) {
        setAssignments((prev) => prev.map((a) => a.id === assignmentId ? { ...a, dueDate: dueDate || null } : a));
        setEditingDeadline(null);
      }
    } finally {
      setSavingDeadline(false);
    }
  }

  const innerTabs = [
    { id: "students" as const, label: "Students", count: activeStudents.length },
    { id: "classes" as const, label: "Classes", count: classes.length },
    { id: "assignments" as const, label: "Assignments", count: assignments.length },
  ];

  if (selectedStudent) {
    return (
      <>
        {showAssignModal && (
          <NewAssignmentModal
            students={students}
            classes={classes}
            prefilledStudentId={prefilledStudentId}
            onClose={() => { setShowAssignModal(false); setPrefilledStudentId(undefined); }}
            onCreated={(a) => {
              setAssignments((p) => [a, ...p]);
              setAssignmentSentCount((n) => n + 1);
              setShowAssignModal(false);
              setPrefilledStudentId(undefined);
            }}
          />
        )}
        {assignmentSentCount > 0 && (
          <AssignmentSentToast key={assignmentSentCount} count={assignmentSentCount} />
        )}
        {confirmRemove && (
          <ConfirmModal
            icon="unlink"
            title="Remove student?"
            description={`${confirmRemove.label} will lose access to your assignments. Their progress is preserved — you can re-invite them later.`}
            confirmLabel={removing === confirmRemove.linkId ? "Removing…" : "Remove student"}
            confirmClass="bg-red-500 hover:bg-red-600"
            onCancel={() => setConfirmRemove(null)}
            onConfirm={async () => { const { linkId } = confirmRemove; setConfirmRemove(null); await handleRemove(linkId); }}
            disabled={removing === confirmRemove.linkId}
          />
        )}
        <StudentDetailPanel
          student={selectedStudent}
          assignments={assignments}
          classes={classes}
          onBack={() => setSelectedStudent(null)}
          onOpenAssignment={(a) => { setSelectedStudent(null); setSelectedAssignment(a); markAssignmentSeen(a.id); }}
          onNewAssignment={() => { setPrefilledStudentId(selectedStudent.id); setShowAssignModal(true); }}
          initialNotes={students.find((s) => s.studentId === selectedStudent.id)?.notes ?? null}
          linkId={students.find((s) => s.studentId === selectedStudent.id)?.linkId ?? ""}
        />
      </>
    );
  }

  return (
    <>
    <div className="space-y-4">
      {confirmRemove && (
        <ConfirmModal
          icon="unlink"
          title="Remove student?"
          description={`${confirmRemove.label} will lose access to your assignments. Their progress is preserved — you can re-invite them later.`}
          confirmLabel={removing === confirmRemove.linkId ? "Removing…" : "Remove student"}
          confirmClass="bg-red-500 hover:bg-red-600"
          onCancel={() => setConfirmRemove(null)}
          onConfirm={async () => { const { linkId } = confirmRemove; setConfirmRemove(null); await handleRemove(linkId); }}
          disabled={removing === confirmRemove.linkId}
        />
      )}

      {teacherData.isInGracePeriod && teacherData.subscriptionExpiresAt && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 flex items-start justify-between gap-4">
          <div>
            <p className="font-black">Subscription expired</p>
            <p className="mt-0.5 text-amber-700">Your data is safe. Grace period ends {new Date(new Date(teacherData.subscriptionExpiresAt).getTime() + 7 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — renew to restore full access.</p>
          </div>
          <a href="/pro" className="shrink-0 rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-white hover:bg-amber-600 transition whitespace-nowrap">
            Renew now →
          </a>
        </div>
      )}

      {/* Inner tabs */}
      <div data-tour="teacher-inner-tabs" className="flex gap-1 rounded-2xl bg-slate-100 p-1">
        {innerTabs.map((t) => (
          <button key={t.id} data-tour={`teacher-${t.id}-tab-btn`} onClick={() => setInnerTab(t.id)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs sm:text-sm font-bold transition ${innerTab === t.id ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}>
            {t.label}
            {t.count > 0 && <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${innerTab === t.id ? "bg-violet-100 text-violet-700" : "bg-slate-200 text-slate-500"}`}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Students */}
      {innerTab === "students" && (
        <div className="space-y-4">
          <div data-tour="teacher-invite-form" className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/[0.04]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-800">Invite a Student</p>
              <span className="text-xs text-slate-400"><span className={`font-bold ${activeStudents.length >= teacherData.studentLimit ? "text-red-500" : "text-slate-700"}`}>{activeStudents.length}</span> / {teacherData.studentLimit}</span>
            </div>
            <form onSubmit={handleInvite} className="flex gap-2">
              <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="student@email.com" required className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
              <button type="submit" disabled={inviting || activeStudents.length >= teacherData.studentLimit} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-50">{inviting ? "…" : "Invite"}</button>
            </form>
            {inviteMsg && (
              <div className={`mt-2 rounded-xl p-2.5 text-sm ${inviteMsg.type === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                {inviteMsg.text}
                {inviteMsg.url && <div className="mt-1 flex gap-2"><code className="flex-1 truncate rounded bg-white border border-emerald-200 px-2 py-0.5 text-xs">{inviteMsg.url}</code><button onClick={() => navigator.clipboard.writeText(inviteMsg.url!)} className="text-xs font-bold text-emerald-700">Copy</button></div>}
              </div>
            )}
            {activeStudents.length >= teacherData.studentLimit && !inviteMsg && (
              <div className="mt-2 flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5 text-xs text-amber-700">
                <svg className="h-3.5 w-3.5 shrink-0 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>Student limit reached ({teacherData.studentLimit}/{teacherData.studentLimit}). <a href="/pro" className="font-bold underline hover:text-amber-900 transition">Upgrade your plan</a> to invite more.</span>
              </div>
            )}
          </div>
          {students.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative flex-1 min-w-[160px]">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search students…"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
                {studentSearch && (
                  <button onClick={() => setStudentSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
              {/* Sort */}
              {activeStudents.length > 1 && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] font-bold text-slate-400">Sort:</span>
                  {([["activity", "Active"], ["score", "Score"], ["name", "Name"]] as const).map(([val, label]) => (
                    <button key={val} onClick={() => setStudentSort(val)}
                      className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition ${studentSort === val ? "bg-violet-600 text-white" : "bg-white text-slate-500 ring-1 ring-black/[0.06] hover:ring-violet-300"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden">
            {students.length === 0 ? <div className="p-10 text-center text-sm text-slate-400">No students yet.</div> : (
              <div className="divide-y divide-slate-50">
                {[...students].filter((s) => {
                  if (!studentSearch.trim()) return true;
                  const q = studentSearch.toLowerCase();
                  return (s.nickname || s.studentName || s.email || "").toLowerCase().includes(q);
                }).sort((a, b) => {
                  if (studentSort === "name") return (a.nickname || a.studentName || a.email).localeCompare(b.nickname || b.studentName || b.email);
                  if (studentSort === "score") return (b.avgScore ?? -1) - (a.avgScore ?? -1);
                  // activity: last active desc, then pending at bottom
                  if (a.status !== "active" && b.status === "active") return 1;
                  if (a.status === "active" && b.status !== "active") return -1;
                  return (b.lastActivity ?? "").localeCompare(a.lastActivity ?? "");
                }).map((s) => (
                  <div key={s.linkId} className="flex items-center gap-3 px-5 py-4">
                    <div className="relative h-9 w-9 shrink-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-black text-violet-600 overflow-hidden">
                        {s.studentAvatarUrl ? (
                          <>
                            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-violet-100 text-sm font-black text-violet-600">
                              {s.studentName ? initials(s.studentName, s.email) : s.email.slice(0, 2).toUpperCase()}
                            </span>
                            <img src={s.studentAvatarUrl} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover relative rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          </>
                        ) : (
                          s.studentName ? initials(s.studentName, s.email) : s.email.slice(0, 2).toUpperCase()
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      {renamingStudent?.linkId === s.linkId ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleRename(s.linkId, renamingStudent.value); }} className="flex items-center gap-1.5">
                          <input
                            autoFocus
                            value={renamingStudent.value}
                            onChange={(e) => setRenamingStudent({ linkId: s.linkId, value: e.target.value })}
                            placeholder={s.studentName || s.email.split("@")[0]}
                            className="w-36 rounded-lg border border-violet-300 bg-white px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-violet-100"
                            disabled={renaming}
                          />
                          <button type="submit" disabled={renaming} className="rounded-lg bg-violet-600 px-2 py-1 text-xs font-bold text-white hover:bg-violet-700 disabled:opacity-50">{renaming ? "…" : "Save"}</button>
                          <button type="button" onClick={() => setRenamingStudent(null)} className="rounded-lg px-1.5 py-1 text-xs text-slate-400 hover:text-slate-600">✕</button>
                        </form>
                      ) : (
                        <div className="flex items-center gap-1.5 min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">{s.nickname || s.studentName || s.email}</p>
                          {s.status === "active" && (
                            <button type="button" onClick={() => setRenamingStudent({ linkId: s.linkId, value: s.nickname ?? "" })} title="Rename" className="shrink-0 text-slate-300 hover:text-violet-400 transition">
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                      {renamingStudent?.linkId !== s.linkId && (
                        <p className="truncate text-xs text-slate-400">
                          {s.nickname ? <span className="text-violet-400 font-semibold mr-1">{s.studentName || s.email}</span> : (s.studentName && <>{s.email} · </>)}
                          {s.status === "pending" ? <span className="text-amber-500 font-semibold">Pending</span>
                            : s.status === "pending_student" ? <span className="text-fuchsia-600 font-semibold">Waiting for student to confirm</span>
                            : <>Active · {timeAgo(s.lastActivity)}</>}
                        </p>
                      )}
                    </div>
                    {s.status === "active" && (
                      <div className="hidden sm:flex gap-4 text-center">
                        <div><p className="text-sm font-black text-slate-800">{s.totalCompleted}</p><p className="text-[10px] text-slate-400 uppercase tracking-wide">Done</p></div>
                        <div><p className={`text-sm font-black ${s.avgScore !== null ? scoreColor(s.avgScore) : "text-slate-400"}`}>{s.avgScore !== null ? `${s.avgScore}%` : "—"}</p><p className="text-[10px] text-slate-400 uppercase tracking-wide">Avg</p></div>
                      </div>
                    )}
                    <div className="flex gap-1.5">
                      {s.status === "active" && s.studentId && <button onClick={() => setSelectedStudent({ id: s.studentId!, name: s.studentName, email: s.email, avatarUrl: s.studentAvatarUrl })} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition">View</button>}
                      {s.status === "pending" && <button onClick={() => { navigator.clipboard.writeText(`${siteUrl}/teacher/join?token=${s.inviteToken}`); setCopiedToken(s.inviteToken); setTimeout(() => setCopiedToken(null), 2000); }} className="rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-600 hover:bg-violet-100 transition">{copiedToken === s.inviteToken ? "Copied!" : "Copy link"}</button>}
                      {s.status === "pending_student" && (
                        <button
                          title="How the student confirms"
                          onClick={() => setConfirmInfoStudent(s.studentName || s.email)}
                          className="inline-flex items-center gap-1 rounded-lg border border-fuchsia-200 bg-fuchsia-50 px-2.5 py-1 text-xs font-semibold text-fuchsia-600 hover:bg-fuchsia-100 transition"
                        >
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                          </svg>
                          How to confirm?
                        </button>
                      )}
                      <button onClick={() => setConfirmRemove({ linkId: s.linkId, label: s.studentName || s.email })} disabled={removing === s.linkId} className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-red-50 hover:text-red-500 transition disabled:opacity-40">{removing === s.linkId ? "…" : "✕"}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Classes */}
      {innerTab === "classes" && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/[0.04]">
            <p className="mb-3 text-sm font-bold text-slate-800">Create a Class</p>
            <form onSubmit={handleCreateClass} className="flex gap-2">
              <input type="text" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} placeholder="e.g. Morning Group A" required className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
              <button type="submit" disabled={creatingClass} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-50">{creatingClass ? "…" : "Create"}</button>
            </form>
          </div>
          {classes.length === 0 ? <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-400 shadow-sm">No classes yet.</div> : classes.map((cls) => {
            const members = activeStudents.filter((s) => cls.memberIds.includes(s.studentId!));
            const nonMembers = activeStudents.filter((s) => !cls.memberIds.includes(s.studentId!));
            return (
              <div key={cls.id} className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4">
                  {/* Emoji icon with picker */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setEmojiPickerFor(emojiPickerFor === cls.id ? null : cls.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-xl hover:bg-violet-100 transition"
                      title="Change icon"
                    >
                      {cls.emoji}
                    </button>
                    {emojiPickerFor === cls.id && (
                      <div className="absolute left-0 top-12 z-20 w-56 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/[0.08]">
                        <div className="flex flex-wrap gap-1">
                          {CLASS_EMOJIS.map((e) => (
                            <button key={e} type="button" onClick={() => { handleUpdateEmoji(cls.id, e); setEmojiPickerFor(null); }}
                              className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg transition hover:bg-violet-50 ${cls.emoji === e ? "bg-violet-100 ring-1 ring-violet-300" : ""}`}>
                              {e}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800">{cls.name}</p>
                    <p className="text-xs text-slate-400">{members.length} student{members.length !== 1 ? "s" : ""}</p>
                  </div>
                  <button onClick={() => setExpandedClass(expandedClass === cls.id ? null : cls.id)} className="rounded-lg px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition">{expandedClass === cls.id ? "Collapse" : "Manage"}</button>
                  <button onClick={() => setConfirmDeleteClass({ id: cls.id, name: cls.name })} className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-red-50 hover:text-red-500 transition">✕</button>
                </div>
                {expandedClass === cls.id && (
                  <div className="border-t border-slate-50 px-5 py-4 space-y-3">
                    {members.length > 0 && (
                      <div className="space-y-1.5">
                        {members.map((s) => {
                          const displayName = s.nickname || s.studentName || s.email;
                          const sub = s.nickname ? (s.studentName || s.email) : s.studentName ? s.email : null;
                          return (
                            <div key={s.studentId} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
                              <div className="relative h-7 w-7 shrink-0">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-[10px] font-black text-violet-600 overflow-hidden">
                                  {s.studentAvatarUrl ? (
                                    <>
                                      <span className="absolute inset-0 flex items-center justify-center rounded-full bg-violet-100 text-[10px] font-black text-violet-600">{s.studentName ? initials(s.studentName, s.email) : s.email.slice(0, 2).toUpperCase()}</span>
                                      <img src={s.studentAvatarUrl} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover relative rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                    </>
                                  ) : (s.studentName ? initials(s.studentName, s.email) : s.email.slice(0, 2).toUpperCase())}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-700">{displayName}</p>
                                {sub && <p className="truncate text-xs text-slate-400">{sub}</p>}
                              </div>
                              <button onClick={() => handleRemoveFromClass(cls.id, s.studentId!)} className="shrink-0 text-xs text-slate-400 hover:text-red-500 transition">Remove</button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {nonMembers.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Add students</p>
                        {nonMembers.map((s) => {
                          const displayName = s.nickname || s.studentName || s.email;
                          const sub = s.nickname ? (s.studentName || s.email) : s.studentName ? s.email : null;
                          return (
                            <div key={s.studentId} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
                              <div className="relative h-7 w-7 shrink-0">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[10px] font-black text-slate-500 overflow-hidden">
                                  {s.studentAvatarUrl ? (
                                    <>
                                      <span className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-200 text-[10px] font-black text-slate-500">{s.studentName ? initials(s.studentName, s.email) : s.email.slice(0, 2).toUpperCase()}</span>
                                      <img src={s.studentAvatarUrl} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover relative rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                    </>
                                  ) : (s.studentName ? initials(s.studentName, s.email) : s.email.slice(0, 2).toUpperCase())}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-600">{displayName}</p>
                                {sub && <p className="truncate text-xs text-slate-400">{sub}</p>}
                              </div>
                              <button onClick={() => handleAddToClass(cls.id, s.studentId!)} disabled={addingToClass === s.studentId} className="shrink-0 text-xs font-bold text-violet-600 hover:text-violet-800 transition disabled:opacity-40">{addingToClass === s.studentId ? "…" : "Add"}</button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {members.length === 0 && nonMembers.length === 0 && <p className="text-sm text-slate-400">No active students to add yet.</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Assignments */}
      {innerTab === "assignments" && (
        <div className="space-y-4">
          {showAssignModal && (
            <NewAssignmentModal
              students={students}
              classes={classes}
              prefilledStudentId={prefilledStudentId}
              onClose={() => { setShowAssignModal(false); setPrefilledStudentId(undefined); }}
              onCreated={(a) => {
                setAssignments((p) => [a, ...p]);
                setAssignmentSentCount((n) => n + 1);
              }}
            />
          )}
          <div className="flex items-center gap-2 flex-wrap">
            {activeStudents.length > 0 && (
              <select
                value={assignmentFilterStudent}
                onChange={(e) => setAssignmentFilterStudent(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
              >
                <option value="all">All students</option>
                {activeStudents.map((s) => (
                  <option key={s.studentId} value={s.studentId!}>
                    {s.nickname || s.studentName || s.email}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={() => setAssignmentFilterStatus((p) => p === "unreviewed" ? "all" : "unreviewed")}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition ${assignmentFilterStatus === "unreviewed" ? "border-amber-400 bg-amber-50 text-amber-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Needs review
            </button>
            <div className="ml-auto flex items-center gap-2">
              {/* Activity feed toggle */}
              <button
                onClick={() => showActivity ? setShowActivity(false) : loadActivity()}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition ${showActivity ? "border-violet-400 bg-violet-50 text-violet-700" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                Activity
              </button>
              <button onClick={() => setShowAssignModal(true)} className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700 shadow-sm shadow-violet-200">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New Assignment
              </button>
            </div>
          </div>
          {/* Stats summary */}
          {Object.keys(summaries).length > 0 && (() => {
            const totalSubs = Object.values(summaries).reduce((s, v) => s + v.completedCount, 0);
            const toReview = Object.values(summaries).reduce((s, v) => s + v.unreviewedCount, 0);
            const activeCount = assignments.length;
            return (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Assignments", value: activeCount, icon: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11", color: "text-violet-600 bg-violet-50" },
                  { label: "Submissions", value: totalSubs, icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8", color: "text-emerald-600 bg-emerald-50" },
                  { label: "To review", value: toReview, icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10", color: toReview > 0 ? "text-amber-600 bg-amber-50" : "text-slate-400 bg-slate-50" },
                ].map(({ label, value, icon, color }) => (
                  <div key={label} className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/[0.04]">
                    <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl ${color}`}>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={icon}/></svg>
                    </div>
                    <p className="text-xl font-black text-slate-800">{value}</p>
                    <p className="text-[11px] text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Activity feed panel */}
          {showActivity && (
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
                <svg className="h-4 w-4 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <p className="text-sm font-black text-slate-700">Recent Activity</p>
                <button onClick={() => setShowActivity(false)} className="ml-auto text-slate-300 hover:text-slate-500">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              {activityLoading ? (
                <div className="flex items-center justify-center py-10">
                  <svg className="h-5 w-5 animate-spin text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                </div>
              ) : activities.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-slate-400">No activity yet. Students haven&apos;t completed anything.</p>
              ) : (
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {activities.map((act) => (
                    <div key={act.id} className="flex items-center gap-3 px-5 py-3">
                      <div className="relative h-8 w-8 shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[11px] font-black text-slate-500 overflow-hidden">
                          {act.studentAvatar ? (
                            <img src={act.studentAvatar} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          ) : act.studentName.slice(0, 2).toUpperCase()}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-white text-white ${act.type === "exercise" ? "bg-emerald-500" : act.type === "essay_submitted" ? "bg-rose-500" : "bg-violet-500"}`}>
                          {act.type === "exercise" ? (
                            <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          ) : act.type === "essay_submitted" ? (
                            <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          ) : (
                            <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          )}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700">
                          <span className="font-bold">{act.studentName}</span>
                          {act.type === "exercise" && " completed "}
                          {act.type === "essay_submitted" && " submitted essay "}
                          {act.type === "essay_reviewed" && " essay reviewed — "}
                          <span className="font-semibold">{act.title}</span>
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        {act.score !== null && (
                          <span className={`rounded-lg px-2 py-0.5 text-xs font-black ${act.score >= 80 ? "bg-emerald-50 text-emerald-600" : act.score >= 50 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-500"}`}>{act.score}%</span>
                        )}
                        <span className="text-[11px] text-slate-400 whitespace-nowrap">{timeAgo(act.time)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {assignments.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-black/[0.04]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
                <svg className="h-7 w-7 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <p className="text-sm font-bold text-slate-600">No assignments yet</p>
              <p className="mt-1 text-xs text-slate-400">Create your first assignment to get students practising.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {assignments.filter((a) => {
                if (assignmentFilterStatus === "unreviewed" && !(summaries[a.id]?.unreviewedCount > 0)) return false;
                if (assignmentFilterStudent === "all") return true;
                if (a.targetStudentIds.length === 0 && a.targetClassIds.length === 0) return true; // everyone
                if (a.targetStudentIds.includes(assignmentFilterStudent)) return true;
                const studentClasses = classes.filter((c) => c.memberIds.includes(assignmentFilterStudent)).map((c) => c.id);
                return a.targetClassIds.some((id) => studentClasses.includes(id));
              }).map((a) => {
                const now = new Date();
                const due = a.dueDate ? new Date(a.dueDate) : null;
                const isOverdue = due && due < now;
                const isDueSoon = due && !isOverdue && (due.getTime() - now.getTime()) < 2 * 86_400_000;
                const href = `/${a.category}${a.level ? `/${a.level}` : ""}/${a.slug}${a.exerciseNo ? `#ex${a.exerciseNo}` : ""}`;
                const isEssayAssign = a.category === "essay";
                const catColor = a.category === "grammar" ? "bg-violet-500" : a.category === "tenses" ? "bg-sky-500" : isEssayAssign ? "bg-rose-500" : "bg-amber-500";
                const targetCount = a.targetStudentIds.length + a.targetClassIds.length;
                const targetLabel = targetCount === 0 ? "Everyone"
                  : a.targetStudentIds.length > 0
                  ? a.targetStudentIds.length === 1
                    ? (students.find((s) => s.studentId === a.targetStudentIds[0])?.studentName || students.find((s) => s.studentId === a.targetStudentIds[0])?.email || "1 student")
                    : `${a.targetStudentIds.length} students`
                  : a.targetClassIds.length === 1
                  ? (classes.find((c) => c.id === a.targetClassIds[0])?.name || "1 class")
                  : `${a.targetClassIds.length} classes`;

                const summary = summaries[a.id];
                const completedCount = summary?.completedCount ?? 0;
                const unreviewedCount = summary?.unreviewedCount ?? 0;
                const isNew = completedCount > 0 && !seenAssignments.has(a.id);
                const hasNewEssays = unreviewedCount > 0;
                // Status color: amber=needs review, emerald=has completions, default otherwise
                const statusAccent = hasNewEssays ? "border-l-4 border-l-amber-400" : completedCount > 0 ? "border-l-4 border-l-emerald-400" : "";

                return (
                  <div key={a.id} className={`group rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden transition hover:ring-violet-200 hover:shadow-md ${statusAccent}`}>
                    <button
                      type="button"
                      onClick={() => { setSelectedAssignment(a); markAssignmentSeen(a.id); }}
                      className="flex w-full items-center gap-3 px-5 py-4 text-left"
                    >
                      <div className={`flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-xl text-white ${catColor}`}>
                        {isEssayAssign ? (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        ) : (
                          <>
                            <span className="text-[9px] font-black uppercase leading-none opacity-75">{a.category.slice(0, 3)}</span>
                            <span className="text-[11px] font-black leading-none">{a.level ? a.level.toUpperCase() : "ALL"}</span>
                          </>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-bold text-slate-800">
                            {a.title}
                            {!isEssayAssign && a.exerciseNo && <span className="ml-1.5 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">Ex. {a.exerciseNo}</span>}
                            {isEssayAssign && <span className="ml-1.5 rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">Essay</span>}
                          </p>
                          {hasNewEssays && (
                            <span className="shrink-0 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-black text-amber-700">
                              {unreviewedCount} to review
                            </span>
                          )}
                          {isNew && !hasNewEssays && (
                            <span className="shrink-0 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-black text-amber-700">New</span>
                          )}
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                            </svg>
                            {targetLabel}
                          </span>
                          {summary && (
                            <>
                              <span>·</span>
                              {completedCount > 0 ? (
                                <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-600">
                                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                  {completedCount}
                                </span>
                              ) : (
                                <span className="text-slate-300">No submissions</span>
                              )}
                            </>
                          )}
                          {a.dueDate && (() => {
                            const dl = dueDateLabel(a.dueDate);
                            return <><span>·</span><span className={dl.color}>{dl.text}</span></>;
                          })()}
                        </div>
                      </div>
                      {/* Results hint */}
                      <span className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-violet-500 group-hover:flex">
                        Results
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </span>
                    </button>
                    {/* Footer: copy + deadline + delete */}
                    <div className="flex items-center border-t border-slate-50 px-4 py-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopyAssignment(a); }}
                        disabled={copyingAssignment === a.id}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-300 hover:bg-violet-50 hover:text-violet-500 transition disabled:opacity-50"
                      >
                        {copyingAssignment === a.id ? (
                          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                        ) : (
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        )}
                        {copyingAssignment === a.id ? "Copying…" : "Copy"}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingDeadline({ id: a.id, dueDate: a.dueDate ?? "" }); }}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-300 hover:bg-sky-50 hover:text-sky-500 transition"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        Deadline
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteAssignment({ id: a.id, title: a.title }); }}
                        className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-300 hover:bg-red-50 hover:text-red-400 transition"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
    {assignmentSentCount > 0 && (
      <AssignmentSentToast key={assignmentSentCount} count={assignmentSentCount} />
    )}

    {selectedAssignment && (
      <AssignmentResultsModal
        assignment={selectedAssignment}
        students={students}
        onClose={() => {
          setSelectedAssignment(null);
          fetch("/api/teacher/assignments/summaries").then((r) => r.json()).then((d) => { if (d.ok) setSummaries(d.summaries); }).catch(() => {});
        }}
      />
    )}

    {confirmDeleteClass && (
      <ConfirmModal
        icon="delete"
        title="Delete class?"
        description={`"${confirmDeleteClass.name}" will be permanently deleted. Students won't be removed from your account.`}
        confirmLabel={deletingClass ? "Deleting…" : "Delete class"}
        confirmClass="bg-red-500 hover:bg-red-600"
        onCancel={() => setConfirmDeleteClass(null)}
        onConfirm={() => doDeleteClass(confirmDeleteClass.id)}
        disabled={deletingClass}
      />
    )}

    {confirmDeleteAssignment && (
      <ConfirmModal
        icon="delete"
        title="Delete assignment?"
        description={`"${confirmDeleteAssignment.title}" will be permanently deleted and students won't see it anymore.`}
        confirmLabel={deletingAssignment ? "Deleting…" : "Delete assignment"}
        confirmClass="bg-red-500 hover:bg-red-600"
        onCancel={() => setConfirmDeleteAssignment(null)}
        onConfirm={() => doDeleteAssignment(confirmDeleteAssignment.id)}
        disabled={deletingAssignment}
      />
    )}

    {editingDeadline && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditingDeadline(null)}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative w-full max-w-xs overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="h-1.5 bg-gradient-to-r from-sky-400 to-sky-500" />
          <div className="px-6 py-6">
            <p className="text-base font-black text-slate-900 mb-1">Edit Deadline</p>
            <p className="text-xs text-slate-400 mb-4">Set or clear the due date for this assignment.</p>
            <input
              type="date"
              value={editingDeadline.dueDate}
              onChange={(e) => setEditingDeadline((prev) => prev ? { ...prev, dueDate: e.target.value } : null)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleEditDeadline(editingDeadline.id, null)}
                disabled={savingDeadline}
                className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-400 hover:bg-slate-50 transition disabled:opacity-40"
              >
                Clear date
              </button>
              <button
                onClick={() => handleEditDeadline(editingDeadline.id, editingDeadline.dueDate)}
                disabled={savingDeadline || !editingDeadline.dueDate}
                className="flex-[2] rounded-xl bg-sky-500 py-2 text-xs font-black text-white hover:bg-sky-600 transition disabled:opacity-40"
              >
                {savingDeadline ? "Saving…" : "Save deadline"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {confirmInfoStudent && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setConfirmInfoStudent(null)}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div
          className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl"
          style={{ animation: "fade-in-up 0.15s ease, scale-in 0.15s ease" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-1.5 bg-gradient-to-r from-amber-400 to-[#F5DA20]" />
          <div className="px-6 py-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50">
              <svg className="h-6 w-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3 className="text-base font-black text-slate-900">How to confirm?</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Ask <span className="font-semibold text-slate-800">{confirmInfoStudent}</span> to open their{" "}
              <span className="font-semibold text-slate-800">Account page</span> on this site.
            </p>
            <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3 flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-white text-[11px] font-black">1</div>
              <p className="text-sm text-slate-700">Log in to <span className="font-semibold">englishnerd.cc</span></p>
            </div>
            <div className="mt-2 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3 flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-white text-[11px] font-black">2</div>
              <p className="text-sm text-slate-700">Click their avatar / name → <span className="font-semibold">Account</span></p>
            </div>
            <div className="mt-2 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3 flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-white text-[11px] font-black">3</div>
              <p className="text-sm text-slate-700">A <span className="font-semibold">Student</span> tab will appear — click it and accept your invite</p>
            </div>
            <button
              onClick={() => setConfirmInfoStudent(null)}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-amber-400 to-[#F5DA20] py-3 text-sm font-black text-amber-900 transition hover:opacity-90"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

function AssignmentSentToast({ count }: { count: number }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(t);
  }, []);
  if (!visible || typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div
        className="flex items-center gap-3 rounded-2xl bg-slate-900 px-6 py-4 shadow-2xl shadow-black/40 ring-1 ring-white/10"
        style={{ animation: "scale-in 0.2s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500">
          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-white">
            {count > 1 ? `${count} assignments sent!` : "Assignment sent!"}
          </p>
          <p className="text-xs text-white/50">Students will be notified by email</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── QuizModal ───────────────────────────────────────────────────────────────

type QuizQuestion = { text: string; options: [string, string, string, string]; correct: number };

function parseQuizPrompt(prompt: string | null): { questions: QuizQuestion[]; instructions?: string } {
  if (!prompt) return { questions: [] };
  try {
    const p = JSON.parse(prompt);
    if (Array.isArray(p.questions)) return p as { questions: QuizQuestion[]; instructions?: string };
  } catch { /* ignore */ }
  return { questions: [] };
}

function QuizModal({
  assignment, onClose, onDone,
}: { assignment: StudentAssignment; onClose: () => void; onDone: (id: string) => void }) {
  const { questions, instructions } = parseQuizPrompt(assignment.prompt);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [submitted, setSubmitted] = useState(!!assignment.essayStatus);
  const [result, setResult] = useState<{ score: number; correct: number; total: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const answeredCount = answers.filter((a) => a !== null).length;
  const allAnswered = answeredCount === questions.length;
  const due = assignment.dueDate ? new Date(assignment.dueDate) : null;
  const isOverdue = due && due < new Date();
  const isReviewed = assignment.essayStatus === "reviewed";
  const isPending = assignment.essayStatus === "submitted";

  async function handleSubmit() {
    if (!allAnswered) return;
    const correct = answers.filter((a, i) => a === questions[i].correct).length;
    const score = Math.round((correct / questions.length) * 100);
    setSubmitting(true); setError("");
    const res = await fetch("/api/student/essays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assignmentId: assignment.id,
        content: JSON.stringify({ type: "quiz", answers, score, correct, total: questions.length }),
      }),
    });
    const data = await res.json() as { ok: boolean; error?: string };
    if (data.ok) {
      setResult({ score, correct, total: questions.length });
      setSubmitted(true);
      onDone(assignment.id);
    } else {
      setError(data.error ?? "Something went wrong.");
    }
    setSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full sm:max-w-xl max-h-[90dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Indigo accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-slate-100 bg-white/95 backdrop-blur px-6 py-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Quiz · {questions.length} question{questions.length !== 1 ? "s" : ""}</p>
            <p className="text-base font-black text-slate-900 leading-snug truncate">{assignment.title}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {result && <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[11px] font-black text-indigo-700">{result.score}%</span>}
            {isPending && !result && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-black text-amber-700">Submitted</span>}
            {isReviewed && <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-black text-emerald-700">Reviewed</span>}
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Meta */}
          {(due || instructions) && (
            <div className="space-y-2">
              {instructions && <p className="text-sm text-slate-500 leading-relaxed">{instructions}</p>}
              {due && (
                <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm ${isOverdue ? "bg-red-50 text-red-600" : "bg-indigo-50 text-indigo-700"}`}>
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span className="font-semibold">{isOverdue ? "Overdue — " : "Due "}{due.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                </div>
              )}
            </div>
          )}

          {/* Result screen */}
          {result && (
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-6 text-center">
              <div className={`text-5xl font-black ${result.score >= 80 ? "text-emerald-600" : result.score >= 60 ? "text-amber-500" : "text-red-500"}`}>
                {result.score}%
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-600">{result.correct} / {result.total} correct</p>
              {result.score >= 80 && <p className="mt-2 text-xs font-bold text-emerald-600">Excellent work!</p>}
              {result.score >= 60 && result.score < 80 && <p className="mt-2 text-xs font-bold text-amber-600">Good effort — review the mistakes!</p>}
              {result.score < 60 && <p className="mt-2 text-xs font-bold text-red-500">Keep practising — you&apos;ll get there!</p>}
            </div>
          )}

          {/* Teacher feedback */}
          {isReviewed && (assignment.essayGrade || assignment.essayFeedback) && (
            <div className="space-y-2">
              {assignment.essayGrade && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Grade:</span>
                  <span className="rounded-lg bg-emerald-100 px-3 py-0.5 text-sm font-black text-emerald-700">{assignment.essayGrade}</span>
                </div>
              )}
              {assignment.essayFeedback && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Teacher feedback</p>
                  <p className="text-sm text-emerald-800 leading-relaxed">{assignment.essayFeedback}</p>
                </div>
              )}
            </div>
          )}

          {/* Questions */}
          {questions.length > 0 && (
            <div className="space-y-4">
              {questions.map((q, qi) => (
                <div key={qi} className={`rounded-2xl border p-5 space-y-3 ${result ? "border-slate-100 bg-white" : "border-slate-200 bg-white"}`}>
                  {/* Question text */}
                  <div className="flex items-start gap-3">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white ${result ? (answers[qi] === q.correct ? "bg-emerald-500" : "bg-red-400") : "bg-indigo-600"}`}>
                      {result ? (answers[qi] === q.correct ? "✓" : "✗") : qi + 1}
                    </span>
                    <p className="pt-0.5 text-sm font-semibold text-slate-800 leading-relaxed">{q.text}</p>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pl-10">
                    {q.options.map((opt, oi) => {
                      const isSelected = answers[qi] === oi;
                      const isCorrectOpt = q.correct === oi;
                      const showResult = !!result;
                      let cls = "border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50";
                      if (showResult) {
                        if (isCorrectOpt) cls = "border-emerald-400 bg-emerald-50 text-emerald-800";
                        else if (isSelected && !isCorrectOpt) cls = "border-red-300 bg-red-50 text-red-700 line-through";
                        else cls = "border-slate-100 bg-white text-slate-400";
                      } else if (isSelected) {
                        cls = "border-indigo-400 bg-indigo-50 text-indigo-800 font-semibold";
                      }

                      return (
                        <button
                          key={oi}
                          type="button"
                          disabled={submitted || !!result}
                          onClick={() => {
                            if (submitted || result) return;
                            setAnswers((prev) => { const n = [...prev]; n[qi] = oi; return n; });
                          }}
                          className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-sm transition ${cls} disabled:cursor-default`}
                        >
                          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-black ${
                            showResult
                              ? isCorrectOpt ? "bg-emerald-500 text-white" : isSelected ? "bg-red-400 text-white" : "bg-slate-100 text-slate-400"
                              : isSelected ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
                          }`}>
                            {["A","B","C","D"][oi]}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submit */}
          {!submitted && !result && questions.length > 0 && (
            <div className="space-y-3">
              {!allAnswered && (
                <p className="text-center text-xs text-slate-400">{answeredCount} of {questions.length} answered</p>
              )}
              {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || submitting}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-black text-white shadow-md shadow-indigo-200 transition hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting…" : `Submit Quiz${allAnswered ? ` (${questions.length}/${questions.length})` : ""}`}
              </button>
            </div>
          )}

          {/* Already submitted (no local result yet) */}
          {submitted && !result && !isReviewed && (
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-indigo-50 border border-indigo-100 py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <svg className="h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-sm font-black text-indigo-800">Quiz submitted!</p>
              <p className="text-xs text-indigo-500">Your teacher will review your results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── HomeworkModal ───────────────────────────────────────────────────────────

function parseHwPrompt(prompt: string | null): { text: string; url?: string } {
  if (!prompt) return { text: "" };
  try {
    const p = JSON.parse(prompt);
    if (typeof p === "object" && p.text !== undefined) return p as { text: string; url?: string };
  } catch { /* plain text */ }
  return { text: prompt };
}

function HomeworkModal({
  assignment,
  onClose,
  onDone,
}: {
  assignment: StudentAssignment;
  onClose: () => void;
  onDone: (id: string) => void;
}) {
  const hw = parseHwPrompt(assignment.prompt);
  const isMarkDone = assignment.minWords === null || assignment.minWords === undefined;
  const minW = assignment.minWords ?? 0;

  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(!!assignment.essayStatus);
  const [error, setError] = useState("");

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minMet = minW === 0 ? text.trim().length > 0 : wordCount >= minW;

  const isReviewed = assignment.essayStatus === "reviewed";
  const isPending = assignment.essayStatus === "submitted" && !isReviewed;

  const due = assignment.dueDate ? new Date(assignment.dueDate) : null;
  const isOverdue = due && due < new Date();

  async function handleMarkDone() {
    setSubmitting(true); setError("");
    const res = await fetch("/api/student/essays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId: assignment.id, content: "✓" }),
    });
    const data = await res.json() as { ok: boolean; error?: string };
    if (data.ok) { setSubmitted(true); onDone(assignment.id); }
    else setError(data.error ?? "Something went wrong.");
    setSubmitting(false);
  }

  async function handleSubmitText(e: React.FormEvent) {
    e.preventDefault();
    if (!minMet) return;
    setSubmitting(true); setError("");
    const res = await fetch("/api/student/essays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId: assignment.id, content: text }),
    });
    const data = await res.json() as { ok: boolean; error?: string };
    if (data.ok) { setSubmitted(true); onDone(assignment.id); }
    else setError(data.error ?? "Something went wrong.");
    setSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full sm:max-w-lg max-h-[90dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Amber accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-400" />

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-slate-100 bg-white/95 backdrop-blur px-6 py-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
              <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Homework</p>
            <p className="text-base font-black text-slate-900 leading-snug truncate">{assignment.title}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isReviewed && <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-black text-emerald-700">Reviewed</span>}
            {isPending && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-black text-amber-700">Pending review</span>}
            {submitted && !isPending && !isReviewed && <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-black text-emerald-700">Done ✓</span>}
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Meta row */}
          {(due || isOverdue) && (
            <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm ${isOverdue ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span className="font-semibold">
                {isOverdue ? "Overdue — " : "Due "}{due?.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
            </div>
          )}

          {/* Instructions */}
          {hw.text && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-3">Instructions</p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{hw.text}</p>
            </div>
          )}

          {/* Resource link */}
          {hw.url && (
            <a
              href={hw.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-amber-300 hover:bg-amber-50/40 group"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 group-hover:bg-amber-200 transition">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-500 mb-0.5">Resource</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{hw.url.replace(/^https?:\/\//, "")}</p>
              </div>
              <svg className="h-4 w-4 text-slate-400 group-hover:text-amber-500 transition shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          )}

          {/* Teacher feedback */}
          {isReviewed && (
            <div className="space-y-2">
              {assignment.essayGrade && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Grade:</span>
                  <span className="rounded-lg bg-emerald-100 px-3 py-0.5 text-sm font-black text-emerald-700">{assignment.essayGrade}</span>
                </div>
              )}
              {assignment.essayFeedback && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Feedback from teacher</p>
                  <p className="text-sm text-emerald-800 leading-relaxed">{assignment.essayFeedback}</p>
                </div>
              )}
            </div>
          )}

          {/* Action area */}
          {!submitted && !isPending && (
            isMarkDone ? (
              <div className="space-y-3">
                {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
                <button
                  onClick={handleMarkDone}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-sm font-black text-white shadow-md shadow-amber-200 transition hover:from-amber-600 hover:to-orange-600 disabled:opacity-50"
                >
                  {submitting ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                  {submitting ? "Marking…" : "Mark as Done"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitText} className="space-y-3">
                <div>
                  <label className="mb-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    <span>Your Response {minW > 0 && <span className="text-slate-400 normal-case font-normal">({minW} words min)</span>}</span>
                    <span className={`font-black ${minW > 0 ? (wordCount >= minW ? "text-emerald-600" : "text-slate-400") : "text-slate-400"}`}>
                      {wordCount} word{wordCount !== 1 ? "s" : ""}
                    </span>
                  </label>
                  <textarea
                    value={text} onChange={(e) => setText(e.target.value)}
                    rows={6}
                    placeholder="Write your response here…"
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 transition"
                  />
                  {minW > 0 && (
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-amber-400 transition-all duration-300" style={{ width: `${Math.min((wordCount / minW) * 100, 100)}%` }} />
                    </div>
                  )}
                </div>
                {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={!minMet || submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-sm font-black text-white shadow-md shadow-amber-200 transition hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting…" : "Submit Response"}
                </button>
              </form>
            )
          )}

          {/* Done state */}
          {(submitted || isPending) && !isReviewed && (
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-100 py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <svg className="h-6 w-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-sm font-black text-emerald-800">{isMarkDone ? "Marked as done!" : "Response submitted!"}</p>
              <p className="text-xs text-emerald-600">{isPending ? "Your teacher will review it soon." : "Great work — keep it up!"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── AssignmentPreviewModal ──────────────────────────────────────────────────

function AssignmentPreviewModal({ assignment, onClose }: { assignment: StudentAssignment; onClose: () => void }) {
  const isEssay = assignment.category === "essay";
  const catColor = assignment.category === "grammar" ? "bg-violet-500" : assignment.category === "tenses" ? "bg-sky-500" : assignment.category === "essay" ? "bg-rose-500" : "bg-amber-500";
  const due = assignment.dueDate ? new Date(assignment.dueDate) : null;
  const isOverdue = due && due < new Date();

  const startHref = isEssay ? null : (() => {
    const base = `/${assignment.category}${assignment.level ? `/${assignment.level}` : ""}/${assignment.slug}`;
    const param = assignment.exerciseNo ? `?assigned=${assignment.exerciseNo}` : "";
    return base + param;
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Top accent */}
        <div className={`h-1 w-full ${catColor}`} />

        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-2xl text-white ${catColor}`}>
              {isEssay ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              ) : (
                <>
                  <span className="text-[9px] font-black uppercase leading-none opacity-75">{assignment.category.slice(0, 3)}</span>
                  <span className="text-[11px] font-black leading-none">{assignment.level ? assignment.level.toUpperCase() : "ALL"}</span>
                </>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                {isEssay ? "Writing Assignment" : `${assignment.category.charAt(0).toUpperCase() + assignment.category.slice(1)}${assignment.level ? ` · ${assignment.level.toUpperCase()}` : ""}`}
              </p>
              <p className="text-base font-black text-slate-900 leading-snug">{assignment.title}</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 rounded-2xl bg-slate-50 p-4">
            {!isEssay && assignment.exerciseNo && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Do:</span>
                <span className="rounded-lg bg-violet-100 px-2.5 py-0.5 text-xs font-black text-violet-700">Exercise {assignment.exerciseNo}</span>
              </div>
            )}
            {!isEssay && !assignment.exerciseNo && (
              <p className="text-sm text-slate-500">Complete <span className="font-semibold text-slate-800">all exercises</span> on this page.</p>
            )}
            {isEssay && assignment.prompt && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Instructions</p>
                <p className="text-sm text-slate-700 leading-relaxed">{assignment.prompt}</p>
              </div>
            )}
            {isEssay && assignment.minWords && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Minimum:</span>
                <span className="font-semibold text-slate-800">{assignment.minWords} words</span>
              </div>
            )}
            {due && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Due:</span>
                <span className={`font-semibold ${isOverdue ? "text-red-500" : "text-slate-800"}`}>
                  {due.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  {isOverdue && " — overdue"}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50">
              Close
            </button>
            {!isEssay && startHref && (
              <a href={startHref} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-black text-white shadow-md shadow-violet-200 transition hover:bg-violet-700">
                Start
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── EssayWriterModal ────────────────────────────────────────────────────────

type EssaySubmissionState = {
  submissionId: string;
  content: string;
  wordCount: number;
  submittedAt: string;
  status: string;
  teacherFeedback: string | null;
  teacherGrade: string | null;
  feedbackAt: string | null;
};

function EssayWriterModal({ assignment, onClose }: { assignment: StudentAssignment; onClose: () => void }) {
  const storageKey = `essay_draft_${assignment.id}`;
  const [text, setText] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(storageKey) ?? "";
  });
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("idle");
  const [showPrompt, setShowPrompt] = useState(true);
  const [submission, setSubmission] = useState<EssaySubmissionState | null>(null);
  const [loadingSubmission, setLoadingSubmission] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(true);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minWords = assignment.minWords ?? 0;
  const progress = minWords > 0 ? Math.min(wordCount / minWords, 1) : 0;
  const reachedMin = minWords === 0 || wordCount >= minWords;

  // Load existing submission on mount
  useEffect(() => {
    fetch(`/api/student/essays?assignmentId=${assignment.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.submission) {
          setSubmission(data.submission);
          // Pre-fill textarea with submitted content if draft is empty
          if (typeof window !== "undefined") {
            const draft = localStorage.getItem(storageKey);
            if (!draft) setText(data.submission.content ?? "");
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingSubmission(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment.id]);

  function handleChange(val: string) {
    setText(val);
    setSaveStatus("saving");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem(storageKey, val);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    }, 800);
  }

  useEffect(() => () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); }, []);

  async function handleSubmit() {
    if (!text.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/student/essays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId: assignment.id, content: text }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "Failed to submit");
      // Clear draft from localStorage
      localStorage.removeItem(storageKey);
      setJustSubmitted(true);
      setSubmission({
        submissionId: "",
        content: text,
        wordCount,
        submittedAt: new Date().toISOString(),
        status: "submitted",
        teacherFeedback: null,
        teacherGrade: null,
        feedbackAt: null,
      });
    } catch (e) {
      setSubmitError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  const due = assignment.dueDate ? new Date(assignment.dueDate) : null;
  const isOverdue = due && due < new Date();
  const isDueSoon = due && !isOverdue && (due.getTime() - Date.now()) < 2 * 86_400_000;

  const isReviewed = submission?.status === "reviewed";
  const isSubmitted = !!submission;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        style={{ height: "min(90dvh, 740px)", animation: "fade-in-up 0.15s ease, scale-in 0.15s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Gradient header ── */}
        <div className="shrink-0 bg-gradient-to-br from-amber-400 via-[#F5DA20] to-amber-300 px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/10">
                <svg className="h-5 w-5 text-amber-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-800/70">Writing assignment</p>
                <p className="text-base font-black text-amber-950 leading-tight">{assignment.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isReviewed && submission?.teacherGrade && (
                <span className="rounded-full bg-black/15 px-3 py-1 text-sm font-black text-amber-950">
                  {submission.teacherGrade}
                </span>
              )}
              {isReviewed && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-black text-white">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Reviewed
                </span>
              )}
              {isSubmitted && !isReviewed && (
                <span className="inline-flex items-center gap-1 rounded-full bg-black/15 px-2.5 py-1 text-[11px] font-black text-amber-900">
                  Submitted
                </span>
              )}
              <button onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/10 text-amber-900 transition hover:bg-black/20">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {due && (
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${isOverdue ? "bg-red-500 text-white" : isDueSoon ? "bg-orange-500/20 text-orange-800" : "bg-black/10 text-amber-900"}`}>
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {isOverdue ? "Overdue · " : "Due · "}
                {due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
            {minWords > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/10 px-2.5 py-1 text-[11px] font-bold text-amber-900">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
                min {minWords} words
              </span>
            )}
            {/* Save status */}
            <span className="ml-auto">
              {saveStatus === "saving" && (
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-800/60">
                  <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Saving…
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Saved
                </span>
              )}
            </span>
          </div>
        </div>

        {/* ── Teacher feedback banner (reviewed) ── */}
        {isReviewed && submission?.teacherFeedback && (
          <div className="shrink-0 border-b-2 border-emerald-200 bg-emerald-50 px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="h-4 w-4 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700">Teacher feedback</span>
              {submission.feedbackAt && (
                <span className="ml-auto text-[10px] text-slate-400">
                  {new Date(submission.feedbackAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{submission.teacherFeedback}</p>
          </div>
        )}
        {isReviewed && !submission?.teacherFeedback && (
          <div className="shrink-0 border-b border-emerald-100 bg-emerald-50 px-5 py-3">
            <p className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Your work has been reviewed</p>
          </div>
        )}

        {/* ── Instructions collapsible ── */}
        {assignment.prompt && (
          <div className="shrink-0 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setShowPrompt((p) => !p)}
              className="flex w-full items-center gap-2 px-5 py-2.5 text-left transition hover:bg-slate-50"
            >
              <svg className="h-3.5 w-3.5 shrink-0 text-fuchsia-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span className="flex-1 text-[11px] font-black uppercase tracking-widest text-slate-400">Instructions</span>
              <svg className={`h-3.5 w-3.5 text-slate-400 transition-transform ${showPrompt ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {showPrompt && (
              <div className="px-5 pb-3">
                <p className="text-sm leading-relaxed text-slate-600">{assignment.prompt}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Just submitted success state ── */}
        {justSubmitted ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
              <svg className="h-8 w-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <p className="text-lg font-black text-slate-800">Essay submitted!</p>
              <p className="mt-1 text-sm text-slate-500">Your teacher will review it and send feedback.</p>
            </div>
            <button onClick={onClose} className="mt-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-black text-white hover:bg-emerald-600 transition">
              Close
            </button>
          </div>
        ) : loadingSubmission ? (
          <div className="flex flex-1 items-center justify-center">
            <svg className="h-6 w-6 animate-spin text-fuchsia-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          </div>
        ) : (
          <>
            {/* ── Textarea ── */}
            <textarea
              value={text}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Start writing your essay here…"
              className="flex-1 resize-none bg-slate-50/50 px-5 py-4 text-[15px] leading-7 text-slate-800 outline-none placeholder-slate-300 sm:px-6"
              autoFocus
            />

            {/* ── Footer: word count + progress + submit ── */}
            <div className="shrink-0 border-t border-slate-100 bg-white px-5 py-3 sm:px-6">
              {minWords > 0 && (
                <div className="mb-2.5 flex items-center gap-3">
                  <div className="relative flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${reachedMin ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gradient-to-r from-fuchsia-500 to-violet-500"}`}
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  <span className={`text-[11px] font-black tabular-nums ${reachedMin ? "text-emerald-600" : "text-slate-400"}`}>
                    {Math.round(progress * 100)}%
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`text-sm font-black tabular-nums shrink-0 ${reachedMin ? "text-emerald-600" : wordCount > 0 ? "text-slate-800" : "text-slate-400"}`}>
                    {wordCount} {wordCount === 1 ? "word" : "words"}
                  </span>
                  {minWords > 0 && !reachedMin && (
                    <span className="text-xs text-slate-400 shrink-0">/ {minWords} min</span>
                  )}
                  {reachedMin && minWords > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-black text-emerald-600 shrink-0">
                      <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Minimum reached!
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {submitError && (
                    <span className="text-[11px] text-red-500">{submitError}</span>
                  )}
                  {isSubmitted && !justSubmitted && (
                    <span className="text-[11px] text-slate-400">Re-submit to update</span>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !text.trim() || !reachedMin}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                        Sending…
                      </>
                    ) : isSubmitted ? (
                      <>
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        Re-submit
                      </>
                    ) : (
                      <>
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                        Submit to teacher
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── AssignmentNotificationPopup ─────────────────────────────────────────────

function AssignmentNotificationPopup({
  assignments, onView, onDismiss,
}: {
  assignments: StudentAssignment[];
  onView: () => void;
  onDismiss: () => void;
}) {
  const count = assignments.length;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onDismiss} />
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Rainbow top bar */}
        <div className="h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500" />

        <div className="px-6 pb-6 pt-5">
          {/* Bell icon */}
          <div className="mb-5 flex justify-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-xl shadow-violet-200">
              <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white">{count}</span>
            </div>
          </div>

          <h2 className="text-center text-xl font-black text-slate-900">
            {count === 1 ? "New assignment!" : `${count} new assignments!`}
          </h2>
          <p className="mt-1.5 text-center text-sm text-slate-400">
            Your teacher just sent you {count === 1 ? "something new to work on" : "some new tasks to work on"}.
          </p>

          {/* Assignment previews */}
          <div className="mt-5 space-y-2">
            {assignments.slice(0, 3).map((a) => {
              const isEssay = a.category === "essay";
              const catColor = a.category === "grammar" ? "bg-violet-500" : a.category === "tenses" ? "bg-sky-500" : isEssay ? "bg-rose-500" : "bg-amber-500";
              return (
                <div key={a.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3.5 py-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${catColor}`}>
                    {isEssay ? (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    ) : (
                      <span className="text-[9px] font-black">{a.level ? a.level.toUpperCase() : a.category.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700">{a.title}</p>
                  {isEssay && <span className="ml-auto shrink-0 rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">Essay</span>}
                </div>
              );
            })}
            {count > 3 && (
              <p className="text-center text-xs text-slate-400">+{count - 3} more assignment{count - 3 > 1 ? "s" : ""}</p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-5 flex gap-2.5">
            <button onClick={onDismiss}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50">
              Not now
            </button>
            <button onClick={onView}
              className="flex-[2] rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:opacity-90 active:scale-[0.98]">
              View assignments →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── StudentTab ──────────────────────────────────────────────────────────────

function StudentTab({
  teacherInfo, pendingTeacherInvite, studentAssignments, completedSet,
}: {
  teacherInfo: { name: string; email: string; avatarUrl: string; linkId: string } | null;
  pendingTeacherInvite: { linkId: string; teacherName: string; teacherEmail: string; teacherAvatarUrl: string } | null;
  studentAssignments: StudentAssignment[];
  completedSet: Set<string>;
}) {
  const router = useRouter();
  const [previewAssignment, setPreviewAssignment] = useState<StudentAssignment | null>(null);
  const [essayAssignment, setEssayAssignment] = useState<StudentAssignment | null>(null);
  const [homeworkAssignment, setHomeworkAssignment] = useState<StudentAssignment | null>(null);
  const [quizAssignment, setQuizAssignment] = useState<StudentAssignment | null>(null);
  const [completedHomework, setCompletedHomework] = useState<Set<string>>(new Set());
  const [confirmUnlink, setConfirmUnlink] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const [pendingAction, setPendingAction] = useState<"accept" | "reject" | null>(null);
  const [pendingDone, setPendingDone] = useState(false);
  const [assignFilter, setAssignFilter] = useState<"all" | "todo" | "done">("all");

  async function handleUnlink() {
    if (!teacherInfo) return;
    setUnlinking(true);
    await fetch("/api/student/teacher-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "unlink", linkId: teacherInfo.linkId }),
    });
    setUnlinking(false);
    setConfirmUnlink(false);
    router.refresh();
  }

  async function handlePendingAction(action: "accept" | "reject") {
    if (!pendingTeacherInvite) return;
    setPendingAction(action);
    await fetch("/api/student/teacher-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, linkId: pendingTeacherInvite.linkId }),
    });
    setPendingAction(null);
    setPendingDone(true);
    setTimeout(() => router.refresh(), 800);
  }

  return (
    <div className="space-y-4">
      {/* Pending teacher invite banner */}
      {pendingTeacherInvite && !pendingDone && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-violet-200">
          <div className="h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
          <div className="px-5 py-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative h-10 w-10 shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-black text-violet-700 overflow-hidden">
                  {pendingTeacherInvite.teacherAvatarUrl ? (
                    <>
                      <span className="absolute inset-0 flex items-center justify-center rounded-full">{initials(pendingTeacherInvite.teacherName, pendingTeacherInvite.teacherEmail)}</span>
                      <img src={pendingTeacherInvite.teacherAvatarUrl} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover relative rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </>
                  ) : initials(pendingTeacherInvite.teacherName, pendingTeacherInvite.teacherEmail)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-violet-500 mb-0.5">Teacher invite</p>
                <p className="truncate text-sm font-bold text-slate-800">{pendingTeacherInvite.teacherName || "Your teacher"}</p>
              </div>
            </div>
            <p className="mb-3 text-sm text-slate-600 leading-relaxed">
              <span className="font-semibold">{pendingTeacherInvite.teacherName || "Your teacher"}</span> wants to add you as their student. Accept to see their assignments.
            </p>
            <div className="flex gap-2">
              <button onClick={() => handlePendingAction("reject")} disabled={pendingAction !== null}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-slate-50 disabled:opacity-50">
                {pendingAction === "reject" ? "…" : "Decline"}
              </button>
              <button onClick={() => handlePendingAction("accept")} disabled={pendingAction !== null}
                className="flex-[2] rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2.5 text-sm font-black text-white shadow-md shadow-violet-200 transition hover:opacity-90 disabled:opacity-50">
                {pendingAction === "accept" ? "Accepting…" : "Accept invitation →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher card */}
      {teacherInfo && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-200 text-sm font-black text-amber-800 overflow-hidden">
                {teacherInfo.avatarUrl ? (
                  <>
                    <span className="absolute inset-0 flex items-center justify-center rounded-full bg-amber-200 text-sm font-black text-amber-800">{initials(teacherInfo.name, teacherInfo.email)}</span>
                    <img src={teacherInfo.avatarUrl} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover relative rounded-full" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </>
                ) : initials(teacherInfo.name, teacherInfo.email)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-0.5">Your teacher</p>
              <p className="truncate text-sm font-bold text-slate-800">{teacherInfo.name || "Your teacher"}</p>
            </div>
            <button onClick={() => setConfirmUnlink(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <line x1="17" y1="8" x2="23" y2="14"/><line x1="23" y1="8" x2="17" y2="14"/>
              </svg>
              Unlink
            </button>
          </div>
        </div>
      )}

      {/* Unlink confirmation modal */}
      {confirmUnlink && teacherInfo && (
        <ConfirmModal
          icon="unlink"
          title="Unlink teacher?"
          description={`You will no longer see assignments from ${teacherInfo.name || teacherInfo.email}. You can be re-added later.`}
          confirmLabel={unlinking ? "Unlinking…" : "Unlink"}
          confirmClass="bg-red-500 hover:bg-red-600"
          onCancel={() => setConfirmUnlink(false)}
          onConfirm={handleUnlink}
          disabled={unlinking}
        />
      )}

      {/* Assignments */}
      {studentAssignments.length > 0 && (() => {
        const totalCount = studentAssignments.length;
        const doneCount = studentAssignments.filter((a) => {
          if (a.category === "essay") return !!a.essayStatus;
          return completedSet.has(`${a.category}:${a.level ?? ""}:${a.slug}:${a.exerciseNo ?? ""}`);
        }).length;
        const pct = totalCount > 0 ? Math.round(doneCount / totalCount * 100) : 0;
        return (
          <div data-tour="student-assignments" className="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-black/[0.04]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-slate-700">Your assignments</p>
              <span className="text-sm font-black text-slate-800">{doneCount}<span className="font-normal text-slate-400"> / {totalCount}</span></span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            {doneCount === totalCount && totalCount > 0 && (
              <p className="mt-2 text-xs font-semibold text-emerald-600">All done! Great work.</p>
            )}
          </div>
        );
      })()}

      {studentAssignments.length > 0 && (
        <div className="flex gap-1.5">
          {(["all", "todo", "done"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setAssignFilter(f)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${assignFilter === f ? "bg-slate-800 text-white" : "bg-white text-slate-500 ring-1 ring-black/[0.06] hover:ring-slate-300"}`}
            >
              {f === "all" ? "All" : f === "todo" ? "To do" : "Done"}
            </button>
          ))}
        </div>
      )}

      {studentAssignments.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-black/[0.04]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
            <svg className="h-7 w-7 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <p className="text-sm font-bold text-slate-600">No assignments yet</p>
          <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto">Your teacher hasn&apos;t set any assignments yet. In the meantime, practise on your own:</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <a href="/grammar" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 hover:border-[#F5DA20] hover:bg-[#F5DA20]/10 transition">Grammar →</a>
            <a href="/vocabulary" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 hover:border-[#F5DA20] hover:bg-[#F5DA20]/10 transition">Vocabulary →</a>
            <a href="/tests/grammar" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 hover:border-[#F5DA20] hover:bg-[#F5DA20]/10 transition">Level Test →</a>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {[...studentAssignments].sort((a, b) => {
            const now = Date.now();
            const getScore = (x: StudentAssignment) => {
              const isDone = x.category === "essay" ? !!x.essayStatus
                : x.category === "homework" || x.category === "quiz" ? !!x.essayStatus
                : completedSet.has(`${x.category}:${x.level ?? ""}:${x.slug}:${x.exerciseNo ?? ""}`);
              if (isDone) return 100;
              if (!x.dueDate) return 50;
              const diff = new Date(x.dueDate).getTime() - now;
              if (diff < 0) return 0; // overdue
              if (diff < 2 * 86_400_000) return 10; // due soon
              return 30;
            };
            return getScore(a) - getScore(b);
          }).filter((a) => {
            if (assignFilter === "all") return true;
            const isSelfSubmit = a.category === "essay" || a.category === "homework" || a.category === "quiz";
            const done = isSelfSubmit
              ? (!!a.essayStatus || completedHomework.has(a.id))
              : completedSet.has(`${a.category}:${a.level ?? ""}:${a.slug}:${a.exerciseNo ?? ""}`);
            return assignFilter === "done" ? done : !done;
          }).map((a) => {
            const isEssay = a.category === "essay";
            const isHw = a.category === "homework";
            const isQuiz = a.category === "quiz";
            const key = `${a.category}:${a.level ?? ""}:${a.slug}:${a.exerciseNo ?? ""}`;
            const isDone = !isEssay && !isHw && !isQuiz && completedSet.has(key);
            const hwDone = isHw && (!!a.essayStatus || completedHomework.has(a.id));
            const hwReviewed = isHw && a.essayStatus === "reviewed";
            const hwPending = isHw && a.essayStatus === "submitted" && !hwReviewed;
            const quizDone = isQuiz && (!!a.essayStatus || completedHomework.has(a.id));
            const quizReviewed = isQuiz && a.essayStatus === "reviewed";
            const quizPending = isQuiz && a.essayStatus === "submitted" && !quizReviewed;
            const essayDone = isEssay && !!a.essayStatus;
            const essayReviewed = isEssay && a.essayStatus === "reviewed";
            const due = a.dueDate ? new Date(a.dueDate) : null;
            const isOverdue = due && due < new Date();
            const isDueSoon = due && !isOverdue && (due.getTime() - Date.now()) < 2 * 86_400_000;
            const catColor = isEssay ? "bg-rose-500" : isHw ? "bg-amber-500" : isQuiz ? "bg-indigo-600" : a.category === "grammar" ? "bg-violet-500" : a.category === "tenses" ? "bg-sky-500" : "bg-amber-500";
            const anyDone = isDone || essayReviewed || hwDone || quizDone;
            const iconBg = anyDone ? "bg-emerald-500" : catColor;

            function openAssignment() {
              if (isEssay) setEssayAssignment(a);
              else if (isHw) setHomeworkAssignment(a);
              else if (isQuiz) setQuizAssignment(a);
              else setPreviewAssignment(a);
            }

            const quizData = isQuiz ? parseQuizPrompt(a.prompt) : null;

            return (
              <div key={a.id} className={`rounded-2xl bg-white shadow-sm ring-1 overflow-hidden ${anyDone ? "ring-emerald-100" : isHw ? "ring-amber-100" : isQuiz ? "ring-indigo-100" : "ring-black/[0.04]"}`}>
              <button type="button" onClick={openAssignment}
                className="w-full flex items-center gap-3 px-5 py-4 text-left transition hover:bg-slate-50">
                <div className={`flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl text-white ${iconBg}`}>
                  {anyDone ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : isEssay ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  ) : isHw ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
                  ) : isQuiz ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  ) : (
                    <>
                      <span className="text-[9px] font-black uppercase leading-none opacity-75">{a.category.slice(0, 3)}</span>
                      <span className="text-[11px] font-black leading-none">{a.level ? a.level.toUpperCase() : "ALL"}</span>
                    </>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">
                    {a.title}
                    {!isEssay && !isHw && !isQuiz && a.exerciseNo && <span className="ml-1.5 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">Ex. {a.exerciseNo}</span>}
                    {isEssay && !essayDone && <span className="ml-1.5 rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">Essay</span>}
                    {isHw && !hwDone && <span className="ml-1.5 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-600">Homework</span>}
                    {isQuiz && !quizDone && <span className="ml-1.5 rounded-md bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600">{quizData?.questions.length ?? 0}Q Quiz</span>}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs">
                    {!isEssay && !isHw && !isQuiz && <span className={isDone ? "text-emerald-600 font-semibold" : "text-slate-400"}>{isDone ? "Completed" : "Not done yet"}</span>}
                    {isEssay && !essayDone && <span className="text-slate-400">Writing task</span>}
                    {isEssay && essayDone && !essayReviewed && <span className="text-amber-600 font-semibold">Submitted · waiting for review</span>}
                    {essayReviewed && a.essayGrade && <span className="rounded-md bg-violet-100 px-1.5 py-0.5 font-black text-violet-700">{a.essayGrade}</span>}
                    {essayReviewed && !a.essayFeedback && !a.essayGrade && <span className="text-emerald-600 font-semibold">Reviewed</span>}
                    {isHw && !hwDone && !hwPending && <span className="text-slate-400">{(a.minWords === null || a.minWords === undefined) ? "Mark as done" : "Written response"}</span>}
                    {hwPending && <span className="text-amber-600 font-semibold">Submitted · waiting for review</span>}
                    {hwDone && !hwPending && <span className="text-emerald-600 font-semibold">Done ✓</span>}
                    {hwReviewed && a.essayGrade && <span className="rounded-md bg-violet-100 px-1.5 py-0.5 font-black text-violet-700">{a.essayGrade}</span>}
                    {isQuiz && !quizDone && !quizPending && <span className="text-slate-400">Multiple choice</span>}
                    {quizPending && <span className="text-amber-600 font-semibold">Submitted · waiting for review</span>}
                    {quizDone && !quizPending && <span className="text-emerald-600 font-semibold">Done ✓</span>}
                    {quizReviewed && a.essayGrade && <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 font-black text-indigo-700">{a.essayGrade}</span>}
                    {due && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span className={isOverdue ? "text-red-500 font-semibold" : isDueSoon ? "text-amber-500 font-semibold" : "text-slate-400"}>
                          {isOverdue ? "Overdue" : "Due"} {due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <svg className="h-4 w-4 shrink-0 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              {/* Essay/homework feedback shown directly on card */}
              {(essayReviewed || hwReviewed) && a.essayFeedback && (
                <button
                  type="button"
                  onClick={openAssignment}
                  className="w-full border-t border-emerald-100 bg-emerald-50 px-5 py-3 text-left transition hover:bg-emerald-100"
                >
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">Teacher feedback</p>
                  <p className="text-sm leading-relaxed text-slate-700 line-clamp-3 whitespace-pre-wrap">{a.essayFeedback}</p>
                </button>
              )}
              </div>
            );
          })}
          {studentAssignments.filter((a) => {
            if (assignFilter === "all") return true;
            const isSelfSubmit = a.category === "essay" || a.category === "homework" || a.category === "quiz";
            const done = isSelfSubmit
              ? (!!a.essayStatus || completedHomework.has(a.id))
              : completedSet.has(`${a.category}:${a.level ?? ""}:${a.slug}:${a.exerciseNo ?? ""}`);
            return assignFilter === "done" ? done : !done;
          }).length === 0 && (
            <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-400 shadow-sm ring-1 ring-black/[0.04]">
              {assignFilter === "done" ? "No completed assignments yet." : "All assignments are done!"}
            </div>
          )}
        </div>
      )}

      {previewAssignment && (
        <AssignmentPreviewModal assignment={previewAssignment} onClose={() => setPreviewAssignment(null)} />
      )}

      {essayAssignment && (
        <EssayWriterModal assignment={essayAssignment} onClose={() => setEssayAssignment(null)} />
      )}

      {homeworkAssignment && (
        <HomeworkModal
          assignment={homeworkAssignment}
          onClose={() => setHomeworkAssignment(null)}
          onDone={(id) => setCompletedHomework((prev) => new Set([...prev, id]))}
        />
      )}

      {quizAssignment && (
        <QuizModal
          assignment={quizAssignment}
          onClose={() => setQuizAssignment(null)}
          onDone={(id) => setCompletedHomework((prev) => new Set([...prev, id]))}
        />
      )}
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

export default function AccountClient({ email, fullName, avatarUrl, createdAt, provider, stats, certificates, isPro, hadProBefore, isTeacher, teacherData, isStudent, teacherInfo, pendingTeacherInvite, studentAssignments, completedExerciseKeys, streak, weekly, maxWeekly, overallPct, currentLevel, recs, freezeCount, canUseFreeze, weakTopics, proExpiresAt, siteUrl }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<Tab>(isTeacher ? "teacher" : (isStudent || pendingTeacherInvite) ? "student" : "dashboard");

  // New-assignment notification popup (show once per browser, tracked via localStorage)
  const [newAssignmentPopup, setNewAssignmentPopup] = useState<StudentAssignment[]>([]);
  useEffect(() => {
    if (!isStudent || studentAssignments.length === 0) return;
    const storageKey = `seen_assignments_${email}`;
    const seen: string[] = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    const unseen = studentAssignments.filter((a) => !seen.includes(a.id));
    if (unseen.length > 0) {
      setNewAssignmentPopup(unseen);
      localStorage.setItem(storageKey, JSON.stringify(studentAssignments.map((a) => a.id)));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const [showTeacherWelcome, setShowTeacherWelcome] = useState(false);
  const [teacherWelcomePlan, setTeacherWelcomePlan] = useState<"starter" | "solo" | "plus">("solo");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showStudentTour, setShowStudentTour] = useState(false);
  const [showProTour, setShowProTour] = useState(false);

  // Show tour once for new teachers
  useEffect(() => {
    if (!isTeacher || !teacherData) return;
    const key = `teacher_tour_done_${email}`;
    const legacyKey = `teacher_onboarding_done_${email}`;
    if (!localStorage.getItem(key) && !localStorage.getItem(legacyKey)) {
      localStorage.setItem(key, "1");
      setShowOnboarding(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTeacher]);

  // Show tour once for new students
  useEffect(() => {
    if (!isStudent || isTeacher) return;
    const key = `student_tour_done_${email}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, "1");
      setShowStudentTour(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStudent]);

  // Show tour once for new PRO users
  useEffect(() => {
    if (!isPro || isTeacher || isStudent) return;
    const key = `pro_tour_done_${email}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, "1");
      setShowProTour(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPro]);

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
      const data = await res.json() as { ok: boolean; message?: string; error?: string; isTeacher?: boolean; plan?: string };
      if (data.ok) {
        setPromoCode("");
        if (data.isTeacher) {
          setTeacherWelcomePlan((data.plan as "starter" | "solo" | "plus") ?? "solo");
          setShowTeacherWelcome(true);
        } else {
          setShowWelcome(true);
        }
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
    {showTeacherWelcome && <TeacherWelcomeModal plan={teacherWelcomePlan} onClose={() => { setShowTeacherWelcome(false); router.refresh(); }} />}
    {showOnboarding && teacherData && !showTeacherWelcome && (
      <TeacherTour
        plan={teacherData.plan}
        studentLimit={teacherData.studentLimit}
        userEmail={email}
        onDone={() => setShowOnboarding(false)}
      />
    )}
    {showStudentTour && !showOnboarding && (
      <StudentTour userEmail={email} hasAssignments={studentAssignments.length > 0} onDone={() => setShowStudentTour(false)} />
    )}
    {showProTour && !showOnboarding && !showStudentTour && !showWelcome && (
      <ProTour userEmail={email} onDone={() => setShowProTour(false)} />
    )}

    {/* ── New assignment notification ───────────────────────────────────── */}
    {newAssignmentPopup.length > 0 && (
      <AssignmentNotificationPopup
        assignments={newAssignmentPopup}
        onView={() => { setNewAssignmentPopup([]); setTab("student"); }}
        onDismiss={() => setNewAssignmentPopup([])}
      />
    )}

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
        <div className={`grid gap-5 ${isPro || isTeacher || isStudent ? "xl:grid-cols-[1fr_256px]" : "xl:grid-cols-[220px_1fr_256px]"}`}>

          {/* ══ LEFT: AdSense ══ */}
          {!isPro && !isTeacher && !isStudent && <AdUnit variant="sidebar-account" />}

          {/* ══ CENTER ══ */}
          <div className="min-w-0 space-y-4">

        {/* ── Profile header card ─────────────────────────────────────── */}
        <div data-tour="pro-header-card" className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden">
          {/* Top accent strip */}
          {isTeacher ? (
            <div className="teacher-shine relative flex h-10 items-center justify-center gap-2.5 overflow-hidden bg-gradient-to-r from-violet-600 via-violet-500 to-violet-600">
              <svg aria-hidden="true" className="h-3.5 w-3.5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white">Teacher {teacherData?.plan === "plus" ? "Plus" : teacherData?.plan === "starter" ? "Starter" : "Solo"}</span>
              <svg aria-hidden="true" className="h-3.5 w-3.5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
            </div>
          ) : isPro ? (
            <div data-tour="pro-banner" className="pro-shine relative flex h-10 items-center justify-center gap-2.5 overflow-hidden bg-gradient-to-r from-amber-400 via-[#F5DA20] to-amber-400">
              <svg aria-hidden="true" className="h-3.5 w-3.5 text-amber-800" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" />
              </svg>
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-900">PRO Member</span>
              <svg aria-hidden="true" className="h-3.5 w-3.5 text-amber-800" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" />
              </svg>
            </div>
          ) : isStudent ? (
            <div className="pro-shine relative flex h-10 items-center justify-center gap-2.5 overflow-hidden bg-gradient-to-r from-amber-400 via-[#F5DA20] to-amber-400">
              <svg aria-hidden="true" className="h-3.5 w-3.5 text-amber-800" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
              </svg>
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-900">Student</span>
              <svg aria-hidden="true" className="h-3.5 w-3.5 text-amber-800" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
              </svg>
            </div>
          ) : (
            <div className="h-1.5 w-full bg-gradient-to-r from-[#F5DA20] via-amber-300 to-[#F5DA20]" />
          )}
          <div className="flex items-center gap-4 px-5 py-5 sm:gap-6 sm:px-7">

            {/* Avatar */}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            {/* Outer wrapper is relative (for badge), inner div is overflow-hidden (for image) */}
            <div className="relative shrink-0 h-16 w-16 sm:h-[76px] sm:w-[76px]">
              <div className={`h-full w-full overflow-hidden rounded-full shadow-md ${
                isTeacher ? "ring-4 ring-violet-500" :
                isPro ? "ring-4 ring-[#F5DA20] pro-avatar-ring" :
                isStudent ? "ring-4 ring-[#F5DA20] pro-avatar-ring" :
                "ring-4 ring-[#F5DA20]/30"
              }`}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" referrerPolicy="no-referrer" className="h-full w-full object-cover" onError={() => setAvatarPreview("")} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-600 text-xl font-black text-white">
                    {userInitials}
                  </div>
                )}
              </div>
              {isTeacher ? (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-700 ring-2 ring-white shadow-sm">
                  <svg aria-hidden="true" className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                  </svg>
                </span>
              ) : isPro ? (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#F5DA20] to-amber-500 ring-2 ring-white shadow-sm">
                  <svg aria-hidden="true" className="h-3 w-3 text-amber-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" />
                  </svg>
                </span>
              ) : isStudent ? (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 ring-2 ring-white shadow-sm">
                  <svg aria-hidden="true" className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                  </svg>
                </span>
              ) : null}
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
                {isTeacher ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white shadow-sm">
                    <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                    </svg>
                    Teacher {teacherData?.plan === "plus" ? "Plus" : teacherData?.plan === "starter" ? "Starter" : "Solo"}
                  </span>
                ) : isPro ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-[#F5DA20] px-3 py-1 text-[11px] font-black uppercase tracking-wide text-amber-900 shadow-sm">
                    <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" />
                    </svg>
                    PRO
                  </span>
                ) : isStudent ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-[#F5DA20] px-3 py-1 text-[11px] font-black uppercase tracking-wide text-amber-900 shadow-sm">
                    <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                    </svg>
                    Student
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
            { key: "dashboard" as const, label: "Dashboard", icon: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z", show: true },
            { key: "teacher"   as const, label: "Teacher",   icon: "M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z", show: isTeacher },
            { key: "student"   as const, label: "Student",   icon: "M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 4h5v8l-2.5-1.5L6 12V4z", show: isStudent || !!pendingTeacherInvite },
            { key: "profile"   as const, label: "Profile",   icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", show: true },
            { key: "security"  as const, label: "Security",  icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", show: true },
          ]).filter((t) => t.show).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              {...(t.key === "teacher" ? { "data-tour": "teacher-tab-btn" } : t.key === "dashboard" ? { "data-tour": "dashboard-tab-btn" } : t.key === "student" ? { "data-tour": "student-tab-btn" } : {})}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition ${
                tab === t.key
                  ? t.key === "teacher"
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-[#F5DA20] text-black shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill={t.key === "teacher" && tab === "teacher" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={t.icon} />
              </svg>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════ STUDENT TAB ══════════════ */}
        {tab === "student" && (() => {
          const completedSet = new Set(completedExerciseKeys);
          return (
            <StudentTab
              teacherInfo={teacherInfo}
              pendingTeacherInvite={pendingTeacherInvite}
              studentAssignments={studentAssignments}
              completedSet={completedSet}
            />
          );
        })()}

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
            isPro={isPro || isStudent || isTeacher}
            recs={recs}
            freezeCount={freezeCount}
            canUseFreeze={canUseFreeze}
            weakTopics={weakTopics}
          />

          {/* ── Certificates ────────────────────────────────────────── */}
          <div data-tour="certificates-section" className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] p-6 sm:p-7">
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

        {/* ══════════════ TEACHER TAB ══════════════ */}
        {tab === "teacher" && isTeacher && teacherData && (
          <TeacherTab teacherData={teacherData} siteUrl={siteUrl} />
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
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                      {avatarPreview
                        ? <img src={avatarPreview} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" onError={() => setAvatarPreview("")} />
                        : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-600 text-sm font-black text-white">{userInitials}</div>
                      }
                      {avatarUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                          <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                        </div>
                      )}
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
                <p className="text-xs text-slate-400">Enter your promo code to unlock access</p>
              </div>
              {isPro && (
                <div className="ml-auto flex flex-col items-end">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-[#F5DA20] px-3 py-1 text-[11px] font-black uppercase tracking-wide text-amber-900">
                    <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z"/></svg>
                    PRO Active
                  </span>
                  {isPro && proExpiresAt && (
                    <p className="mt-0.5 text-xs text-amber-700">
                      Active until {new Date(proExpiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  )}
                </div>
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
