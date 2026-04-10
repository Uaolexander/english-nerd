"use client";

/**
 * TeacherTour — spotlight product tour for new teachers.
 * Highlights real DOM elements using data-tour="…" attributes.
 * Renders 4 dim panels + a glow ring + a floating tooltip card.
 */

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { createPortal } from "react-dom";

type Plan = "starter" | "solo" | "plus";

const THEME: Record<Plan, { hex: string; label: string; badgeBg: string; badgeText: string }> = {
  starter: { hex: "#38BDF8", label: "Starter",  badgeBg: "bg-sky-500/15 border-sky-500/30",    badgeText: "text-sky-400" },
  solo:    { hex: "#F5DA20", label: "Solo",     badgeBg: "bg-yellow-400/15 border-yellow-400/30", badgeText: "text-[#F5DA20]" },
  plus:    { hex: "#8B5CF6", label: "Plus",     badgeBg: "bg-violet-500/15 border-violet-500/30", badgeText: "text-violet-400" },
};

interface TourStep {
  id: string;
  target?: string;          // data-tour="…" attribute; omit for centered card
  title: string;
  desc: string;
  detail?: string;          // extra plan-specific line
  tip?: string;
  tooltipSide?: "top" | "bottom" | "left" | "right"; // hint for initial placement
  clickOnActivate?: boolean; // programmatically click target to switch sub-tabs
  plansOnly?: Plan[];
  padding?: number;          // spotlight padding (default 8)
}

function buildSteps(plan: Plan, studentLimit: number): TourStep[] {
  const all: TourStep[] = [
    {
      id: "teacher-tab",
      target: "teacher-tab-btn",
      title: "Your Teacher Dashboard",
      desc: "Everything for managing your students lives here. Click this tab any time to come back.",
      tip: "The dashboard is also accessible at /teacher directly.",
      tooltipSide: "bottom",
      padding: 6,
    },
    {
      id: "inner-tabs",
      target: "teacher-inner-tabs",
      title: "Three Sections Inside",
      desc: "Students, Classes, and Assignments — these three tabs cover everything you need to run your teaching workflow.",
      tooltipSide: "bottom",
      padding: 4,
    },
    {
      id: "invite-form",
      target: "teacher-invite-form",
      title: "Invite Your Students",
      desc: "Type a student's email and hit Invite. They'll get a unique link — they can create an account right from that link.",
      detail: `You can have up to ${studentLimit} students on your ${THEME[plan].label} plan.`,
      tip: "Students without an account can still receive the link — they'll be guided through registration.",
      tooltipSide: "bottom",
      padding: 8,
    },
    {
      id: "classes-tab",
      target: "teacher-classes-tab-btn",
      title: "Organize into Classes",
      desc: "Group students by level, schedule, or any way that suits you. Assign work to an entire class at once instead of selecting students individually.",
      tip: "One student can be in multiple classes at the same time.",
      tooltipSide: "bottom",
      clickOnActivate: true,
      plansOnly: ["solo", "plus"],
    },
    {
      id: "assignments-tab",
      target: "teacher-assignments-tab-btn",
      title: "Create Assignments",
      desc: "Assign any grammar lesson, vocabulary test, or custom homework. Set a deadline and choose your target: everyone, a class, or specific students.",
      tip: "Students see their open assignments directly in their account page.",
      tooltipSide: "bottom",
      clickOnActivate: true,
    },
    {
      id: "analytics",
      target: "teacher-students-tab-btn",
      title: "Track Student Progress",
      desc: "Each student row shows their completion count, average score, and last activity. Click a student's name for a question-by-question breakdown.",
      tip: "Scores are colour-coded: green ≥80%, amber ≥50%, red <50%.",
      tooltipSide: "bottom",
      clickOnActivate: true,
    },
    {
      id: "done",
      title: "You're All Set! 🎉",
      desc: "Your Teacher Dashboard is ready. Start by inviting your first student — everything else follows naturally.",
      tip: "Need help? Reach out at hello@englishnerd.cc",
    },
  ];

  return all.filter((s) => !s.plansOnly || s.plansOnly.includes(plan));
}

// ── Rect helper ──────────────────────────────────────────────────────────────

interface Rect { top: number; left: number; width: number; height: number; }

function getRect(target: string): Rect | null {
  const el = document.querySelector(`[data-tour="${target}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

// ── Tooltip position ─────────────────────────────────────────────────────────

interface TooltipPos { top: number; left: number; arrowSide: "top" | "bottom" | "left" | "right" | "none"; }

const TOOLTIP_W = 340;
const TOOLTIP_H = 220; // rough estimate

function getTooltipW() {
  if (typeof window === "undefined") return TOOLTIP_W;
  return Math.min(TOOLTIP_W, window.innerWidth - 24);
}

function computeTooltipPos(rect: Rect, hint: TourStep["tooltipSide"], pad: number): TooltipPos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isMobile = vw < 520;
  const tw = getTooltipW();
  const margin = 12;
  const arrowH = 10;

  // Mobile: always anchor to bottom of screen (bottom sheet style)
  if (isMobile) {
    return { top: 0, left: 0, arrowSide: "none" }; // rendered differently on mobile
  }

  // Desktop: try preferred side, fall back
  const sides: Array<TourStep["tooltipSide"]> = [hint ?? "bottom", "bottom", "top", "right", "left"];
  for (const side of sides) {
    if (side === "bottom") {
      const top = rect.top + rect.height + pad + arrowH;
      if (top + TOOLTIP_H > vh - margin) continue;
      let left = rect.left + rect.width / 2 - tw / 2;
      left = Math.max(margin, Math.min(left, vw - tw - margin));
      return { top, left, arrowSide: "top" };
    }
    if (side === "top") {
      const top = rect.top - pad - arrowH - TOOLTIP_H;
      if (top < margin) continue;
      let left = rect.left + rect.width / 2 - tw / 2;
      left = Math.max(margin, Math.min(left, vw - tw - margin));
      return { top, left, arrowSide: "bottom" };
    }
    if (side === "right") {
      const left = rect.left + rect.width + pad + arrowH;
      if (left + tw > vw - margin) continue;
      const top = Math.max(margin, Math.min(rect.top + rect.height / 2 - TOOLTIP_H / 2, vh - TOOLTIP_H - margin));
      return { top, left, arrowSide: "left" };
    }
    if (side === "left") {
      const left = rect.left - pad - arrowH - tw;
      if (left < margin) continue;
      const top = Math.max(margin, Math.min(rect.top + rect.height / 2 - TOOLTIP_H / 2, vh - TOOLTIP_H - margin));
      return { top, left, arrowSide: "right" };
    }
  }
  // fallback: centered
  return { top: vh / 2 - TOOLTIP_H / 2, left: vw / 2 - tw / 2, arrowSide: "none" };
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  plan: Plan;
  studentLimit: number;
  userEmail: string;
  onDone: () => void;
}

export default function TeacherTour({ plan, studentLimit, userEmail, onDone }: Props) {
  const t = THEME[plan];
  const steps = buildSteps(plan, studentLimit);
  const total = steps.length;

  const [idx, setIdx]       = useState(0);
  const [rect, setRect]     = useState<Rect | null>(null);
  const [tipPos, setTipPos] = useState<TooltipPos>({ top: 80, left: 80, arrowSide: "none" });
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const measureTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track mobile breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 520);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const step = steps[idx];
  const pad  = step.padding ?? 8;

  function finish() {
    localStorage.setItem(`teacher_tour_done_${userEmail}`, "1");
    onDone();
  }

  // Measure target element after scroll + small settle delay
  const measure = useCallback(() => {
    if (!step.target) { setRect(null); return; }
    if (measureTimer.current) clearTimeout(measureTimer.current);
    measureTimer.current = setTimeout(() => {
      const r = getRect(step.target!);
      if (!r) { setRect(null); return; }
      setRect(r);
      const pos = computeTooltipPos(r, step.tooltipSide, pad);
      setTipPos(pos);
      setVisible(true);
    }, 320);
  }, [step, pad]);

  // When step changes: optionally click target, scroll to it, then measure
  useEffect(() => {
    setVisible(false);
    setRect(null);

    if (!step.target) {
      // Centered final card
      setRect(null);
      measureTimer.current = setTimeout(() => setVisible(true), 120);
      return;
    }

    const el = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
    if (!el) { measure(); return; }

    if (step.clickOnActivate) el.click();

    el.scrollIntoView({ behavior: "instant", block: "center" });
    measure();

    return () => { if (measureTimer.current) clearTimeout(measureTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  // Re-measure on resize
  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  // Keyboard
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "Enter") {
      if (idx < total - 1) setIdx((i) => i + 1); else finish();
    }
    if (e.key === "ArrowLeft" && idx > 0) setIdx((i) => i - 1);
    if (e.key === "Escape") finish();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, total]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (typeof document === "undefined") return null;

  const sp = rect ? {
    top:    Math.max(0, rect.top    - pad),
    left:   Math.max(0, rect.left   - pad),
    right:  Math.min(window.innerWidth,  rect.left + rect.width  + pad),
    bottom: Math.min(window.innerHeight, rect.top  + rect.height + pad),
  } : null;

  const isLast = idx === total - 1;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[9980]">
      <style>{`
        @keyframes tour-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tour-tip-in  { from { opacity: 0; transform: translateY(8px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .tour-panel  { transition: all 0.38s cubic-bezier(.22,1,.36,1); background: rgba(0,0,0,0.72); }
        .tour-ring   { transition: all 0.38s cubic-bezier(.22,1,.36,1); }
        .tour-tip    { transition: top 0.38s cubic-bezier(.22,1,.36,1), left 0.38s cubic-bezier(.22,1,.36,1); }
        .tour-tip-in { animation: tour-tip-in 0.3s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      {/* ── 4 dim panels ── */}
      {sp ? (
        <>
          {/* top */}
          <div className="tour-panel pointer-events-auto fixed left-0 right-0 top-0"
            style={{ height: sp.top }} onClick={finish} />
          {/* bottom — on mobile leave space for the bottom sheet */}
          <div className="tour-panel pointer-events-auto fixed left-0 right-0 bottom-0"
            style={{ top: sp.bottom, bottom: isMobile ? 160 : 0 }} onClick={finish} />
          {/* left */}
          <div className="tour-panel pointer-events-auto fixed left-0"
            style={{ top: sp.top, height: sp.bottom - sp.top, width: sp.left }} onClick={finish} />
          {/* right */}
          <div className="tour-panel pointer-events-auto fixed right-0"
            style={{ top: sp.top, height: sp.bottom - sp.top, left: sp.right }} onClick={finish} />
        </>
      ) : (
        /* full dim for final card */
        <div className="tour-panel pointer-events-auto fixed inset-0" />
      )}

      {/* ── Spotlight ring ── */}
      {sp && (
        <div
          className="tour-ring pointer-events-none fixed rounded-xl"
          style={{
            top:    sp.top    - 2,
            left:   sp.left   - 2,
            width:  sp.right  - sp.left + 4,
            height: sp.bottom - sp.top  + 4,
            boxShadow: `0 0 0 2px ${t.hex}, 0 0 0 4px ${t.hex}30, 0 0 30px ${t.hex}40`,
          }}
        />
      )}

      {/* ── Tooltip card ── */}
      {visible && (() => {
        const tw = getTooltipW();
        const cardContent = (
          <div
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c1e] shadow-2xl"
            style={{ boxShadow: `0 0 0 1px ${t.hex}20, 0 20px 60px rgba(0,0,0,0.6)` }}
          >
            {/* Coloured top strip */}
            <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${t.hex}, ${t.hex}80)` }} />

            <div className="p-4 sm:p-5">
              {/* Header row */}
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className={`mb-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black ${t.badgeBg} ${t.badgeText}`}>
                    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                    </svg>
                    Teacher {t.label} · {idx + 1}/{total}
                  </div>
                  <h3 className="text-sm font-black text-white leading-tight sm:text-base">{step.title}</h3>
                </div>
                <button
                  onClick={finish}
                  className="mt-0.5 shrink-0 rounded-full p-1.5 text-white/50 transition hover:bg-white/8 hover:text-white/60"
                  aria-label="Close tour"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Description */}
              <p className="text-[12px] leading-relaxed text-white/60 sm:text-[13px]">{step.desc}</p>

              {/* Plan-specific detail */}
              {step.detail && (
                <div className="mt-2 flex items-start gap-2 rounded-xl bg-white/[0.05] px-3 py-2">
                  <span className="mt-px text-xs" style={{ color: t.hex }}>★</span>
                  <p className="text-[11px] leading-snug text-white/50 sm:text-[12px]">{step.detail}</p>
                </div>
              )}

              {/* Tip — hide on mobile to save space */}
              {step.tip && !isMobile && (
                <div className="mt-2 flex items-start gap-2">
                  <span className="text-sm">💡</span>
                  <p className="text-[11px] leading-snug text-white/50">{step.tip}</p>
                </div>
              )}

              {/* Progress dots + nav */}
              <div className="mt-3 flex items-center justify-between sm:mt-4">
                <div className="flex gap-1.5">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIdx(i)}
                      className="rounded-full transition-all duration-200"
                      style={{
                        width: i === idx ? 16 : 5,
                        height: 5,
                        backgroundColor: i === idx ? t.hex : "rgba(255,255,255,0.2)",
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>

                {/* Nav buttons */}
                <div className="flex items-center gap-2">
                  {idx > 0 && (
                    <button
                      onClick={() => setIdx((i) => i - 1)}
                      className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-semibold text-white/50 transition hover:text-white/60 sm:px-3"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                      Back
                    </button>
                  )}
                  <button
                    onClick={isLast ? finish : () => setIdx((i) => i + 1)}
                    className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black text-black transition hover:opacity-90 sm:py-2"
                    style={{ backgroundColor: t.hex }}
                  >
                    {isLast ? "Start! →" : (
                      <>
                        Next
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

        // Mobile: fixed bottom sheet
        if (isMobile) {
          return (
            <div className="tour-tip-in pointer-events-auto fixed bottom-0 left-0 right-0 z-[9999] px-3 pb-4 safe-area-bottom">
              {cardContent}
            </div>
          );
        }

        // Desktop: floating positioned tooltip
        return (
          <div
            className="tour-tip tour-tip-in pointer-events-auto fixed z-[9999]"
            style={{
              top:  rect ? tipPos.top  : "50%",
              left: rect ? tipPos.left : "50%",
              transform: rect ? "none" : "translate(-50%, -50%)",
              width: tw,
            }}
          >
            {/* Arrow */}
            {rect && tipPos.arrowSide !== "none" && (
              <div
                className="pointer-events-none absolute"
                style={{
                  ...(tipPos.arrowSide === "top"    && { top: -8,  left: "50%", transform: "translateX(-50%)" }),
                  ...(tipPos.arrowSide === "bottom" && { bottom: -8, left: "50%", transform: "translateX(-50%) rotate(180deg)" }),
                  ...(tipPos.arrowSide === "left"   && { left: -8, top: "50%",  transform: "translateY(-50%) rotate(-90deg)" }),
                  ...(tipPos.arrowSide === "right"  && { right: -8, top: "50%", transform: "translateY(-50%) rotate(90deg)" }),
                }}
              >
                <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
                  <path d="M8 0L16 9H0L8 0Z" fill="#1c1c1e" />
                </svg>
              </div>
            )}
            {cardContent}
          </div>
        );
      })()}
    </div>,
    document.body
  );
}
