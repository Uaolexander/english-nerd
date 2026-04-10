"use client";

/**
 * TeacherHintBanner — non-intrusive popup that appears when a visitor is likely a teacher.
 *
 * Two signals feed into a score:
 *  1. Email domain matches known school/edu patterns (set in localStorage by RegisterClient)
 *  2. Behavioral: browses 3+ different grammar levels in the same session + has return visits
 *
 * Score ≥ 60 → show the banner (after a 4-second delay).
 * Dismissed permanently via localStorage.
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { useIsTeacher } from "@/lib/TeacherContext";
import { useIsPro } from "@/lib/ProContext";
import { useIsStudent } from "@/lib/StudentContext";

const TEACHER_DOMAINS = [
  "sch", "school", "edu", "gymnasium", "lyceum", "lycée", "college",
  "teacher", "npu", "dpu", "kpu", "university", "ac.uk", "k12",
  "pedahohika", "педагог",
];

const KEY_DISMISSED   = "teacher_hint_dismissed";
const KEY_VISITS      = "teacher_hint_visits";
const KEY_LAST_VISIT  = "teacher_hint_last_visit";
const KEY_LIKELY      = "likely_teacher"; // set by RegisterClient
const SESSION_LEVELS  = "visited_levels"; // set by LevelTracker

const SCORE_THRESHOLD = 60;

function isTeacherDomain(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return TEACHER_DOMAINS.some((w) => domain.includes(w));
}

function computeScore(): number {
  try {
    let score = 0;

    // Signal 1 — known school email (set at registration or login)
    if (localStorage.getItem(KEY_LIKELY) === "1") score += 100;

    // Signal 2 — browsed multiple grammar levels in this session
    const levels = JSON.parse(sessionStorage.getItem(SESSION_LEVELS) ?? "[]") as string[];
    if (levels.length >= 3) score += 50;
    else if (levels.length >= 2) score += 25;

    // Signal 3 — return visits (incremented once per calendar day)
    const visits = parseInt(localStorage.getItem(KEY_VISITS) ?? "0", 10);
    if (visits >= 3) score += 30;
    else if (visits >= 2) score += 15;

    return score;
  } catch {
    return 0;
  }
}

function trackVisit() {
  try {
    const today = new Date().toDateString();
    if (localStorage.getItem(KEY_LAST_VISIT) !== today) {
      const v = parseInt(localStorage.getItem(KEY_VISITS) ?? "0", 10);
      localStorage.setItem(KEY_VISITS, String(v + 1));
      localStorage.setItem(KEY_LAST_VISIT, today);
    }
  } catch { /* ignore */ }
}

function trackLevelVisit() {
  try {
    const path = window.location.pathname;
    const m = path.match(/\/(a1|a2|b1|b2|c1)(\/|$)/i);
    if (!m) return;
    const lvl = m[1].toUpperCase();
    const existing = JSON.parse(sessionStorage.getItem(SESSION_LEVELS) ?? "[]") as string[];
    if (!existing.includes(lvl)) {
      sessionStorage.setItem(SESSION_LEVELS, JSON.stringify([...existing, lvl]));
    }
  } catch { /* ignore */ }
}

export default function TeacherHintBanner() {
  const [show, setShow]       = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTeacher = useIsTeacher();
  const isPro     = useIsPro();
  const isStudent = useIsStudent();

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isTeacher || isPro || isStudent) return;

    try {
      if (localStorage.getItem(KEY_DISMISSED)) return;
    } catch { return; }

    trackVisit();
    trackLevelVisit();

    // If logged in — also check email domain
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const email = data.user.email ?? "";
        if (isTeacherDomain(email)) {
          try { localStorage.setItem(KEY_LIKELY, "1"); } catch { /* ignore */ }
        }
      }

      // Compute score for everyone (logged-in or not)
      const score = computeScore();
      if (score >= SCORE_THRESHOLD) {
        timerRef.current = setTimeout(() => {
          // Mark as shown immediately so it never appears on future visits
          try { localStorage.setItem(KEY_DISMISSED, "1"); } catch { /* ignore */ }
          setShow(true);
        }, 4000);
      }
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTeacher, isPro, isStudent]);

  function dismiss() {
    setShow(false);
    try { localStorage.setItem(KEY_DISMISSED, "1"); } catch { /* ignore */ }
  }

  if (!mounted || !show || typeof document === "undefined") return null;

  const HEX = "#7C3AED"; // violet-700

  const cardContent = (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c1e] shadow-2xl"
      style={{ boxShadow: `0 0 0 1px ${HEX}30, 0 24px 64px rgba(0,0,0,0.7)` }}
    >
      {/* Top accent stripe */}
      <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${HEX}, #a855f7)` }} />

      <div className="p-4 sm:p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white"
              style={{ background: `linear-gradient(135deg, ${HEX}, #a855f7)` }}
            >
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor" style={{ height: 18, width: 18 }}>
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
            </div>
            <div>
              <div
                className="mb-0.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-black"
                style={{ borderColor: `${HEX}40`, color: "#a78bfa", backgroundColor: `${HEX}15` }}
              >
                For Teachers
              </div>
              <h3 className="text-sm font-black text-white leading-tight">Are you an English teacher?</h3>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="mt-0.5 shrink-0 rounded-full p-1.5 text-white/50 transition hover:bg-white/8 hover:text-white/60"
            aria-label="Dismiss"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <p className="mt-2.5 text-[12px] leading-relaxed text-white/55 sm:text-[13px]">
          Manage your class, assign grammar and vocabulary tasks, and track every student&apos;s progress — all in one place.
        </p>

        {/* Perks list */}
        <div className="mt-2.5 flex flex-col gap-1">
          {[
            "Assign exercises to individual students",
            "Track scores, streaks & weak topics",
            "Downloadable progress certificates",
          ].map((perk) => (
            <div key={perk} className="flex items-center gap-1.5">
              <svg className="h-3 w-3 shrink-0" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="6" fill={`${HEX}30`} />
                <path d="M3.5 6l1.8 1.8L8.5 4.5" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[11px] text-white/55">{perk}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-3.5 flex items-center gap-3">
          <a
            href="/pro#teacher"
            className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black text-white transition hover:opacity-90"
            style={{ backgroundColor: HEX }}
            onClick={dismiss}
          >
            See Teacher Plans
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </a>
          <button
            onClick={dismiss}
            className="text-xs text-white/45 transition hover:text-white/50"
          >
            Not a teacher
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile: bottom sheet
  if (isMobile) {
    return createPortal(
      <div
        className="pointer-events-auto fixed bottom-0 left-0 right-0 z-[9970] px-3 pt-0"
        style={{ animation: "teacher-hint-slide 0.4s cubic-bezier(.22,1,.36,1) both", paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))' }}
      >
        <style>{`
          @keyframes teacher-hint-slide {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        {cardContent}
      </div>,
      document.body
    );
  }

  // Desktop: bottom-right corner
  return createPortal(
    <div
      className="pointer-events-auto fixed bottom-6 right-6 z-[9970] w-[340px]"
      style={{ animation: "teacher-hint-slide 0.4s cubic-bezier(.22,1,.36,1) both" }}
    >
      <style>{`
        @keyframes teacher-hint-slide {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {cardContent}
    </div>,
    document.body
  );
}
