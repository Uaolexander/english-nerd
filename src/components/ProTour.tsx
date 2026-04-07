"use client";

/**
 * ProTour — spotlight product tour for new PRO subscribers.
 * Highlights real DOM elements using data-tour="…" attributes.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

const HEX = "#F5DA20"; // PRO yellow

interface TourStep {
  id: string;
  target?: string;
  title: string;
  desc: string;
  tip?: string;
  tooltipSide?: "top" | "bottom" | "left" | "right";
  clickOnActivate?: boolean;
  padding?: number;
}

const STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to PRO! ⭐",
    desc: "You've unlocked full access to English Nerd. Let's quickly show you everything that's now available.",
  },
  {
    id: "pro-banner",
    target: "pro-banner",
    title: "You're a PRO Member",
    desc: "This golden bar marks your account as PRO. No ads, no limits — everything is unlocked for you.",
    tooltipSide: "bottom",
    padding: 4,
  },
  {
    id: "dashboard-tab",
    target: "dashboard-tab-btn",
    title: "Full Analytics Dashboard",
    desc: "Your Dashboard now shows detailed analytics: streak tracking, weak topics, scores by category, and personalised recommendations.",
    tip: "Free users only see a blurred preview of this data.",
    tooltipSide: "bottom",
    clickOnActivate: true,
    padding: 6,
  },
  {
    id: "certificates",
    target: "certificates-section",
    title: "Download Certificates",
    desc: "Complete a grammar or vocabulary test and download a signed certificate. Share it on LinkedIn or keep it for your portfolio.",
    tip: "Certificates include your score, date, and level — all in a professional PDF format.",
    tooltipSide: "top",
    padding: 8,
  },
  {
    id: "done",
    title: "You're All Set! 🎓",
    desc: "Explore Nerd Zone for advanced reading, hit the grammar and vocabulary tests, and build your streak. Everything is yours now.",
    tip: "Need help? Contact us at hello@englishnerd.cc",
  },
];

interface Rect { top: number; left: number; width: number; height: number; }
interface TooltipPos { top: number; left: number; arrowSide: "top" | "bottom" | "left" | "right" | "none"; }

const TOOLTIP_W = 340;
const TOOLTIP_H = 220;

function getTooltipW() {
  if (typeof window === "undefined") return TOOLTIP_W;
  return Math.min(TOOLTIP_W, window.innerWidth - 24);
}

function getRect(target: string): Rect | null {
  const el = document.querySelector(`[data-tour="${target}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

function computeTooltipPos(rect: Rect, hint: TourStep["tooltipSide"], pad: number): TooltipPos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (vw < 520) return { top: 0, left: 0, arrowSide: "none" };
  const tw = getTooltipW();
  const margin = 12;
  const arrowH = 10;
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
  return { top: vh / 2 - TOOLTIP_H / 2, left: vw / 2 - tw / 2, arrowSide: "none" };
}

interface Props { userEmail: string; onDone: () => void; }

export default function ProTour({ userEmail, onDone }: Props) {
  const steps = STEPS;
  const total = steps.length;

  const [idx, setIdx]       = useState(0);
  const [rect, setRect]     = useState<Rect | null>(null);
  const [tipPos, setTipPos] = useState<TooltipPos>({ top: 80, left: 80, arrowSide: "none" });
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const measureTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 520);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const step = steps[idx];
  const pad  = step.padding ?? 8;

  function finish() {
    localStorage.setItem(`pro_tour_done_${userEmail}`, "1");
    onDone();
  }

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

  useEffect(() => {
    setVisible(false);
    setRect(null);
    if (!step.target) {
      measureTimer.current = setTimeout(() => setVisible(true), 120);
      return;
    }
    const el = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
    if (!el) { measure(); return; }
    if (step.clickOnActivate) el.click();
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    measure();
    return () => { if (measureTimer.current) clearTimeout(measureTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

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

      {/* 4 dim panels */}
      {sp ? (
        <>
          <div className="tour-panel pointer-events-auto fixed left-0 right-0 top-0" style={{ height: sp.top }} onClick={finish} />
          <div className="tour-panel pointer-events-auto fixed left-0 right-0 bottom-0" style={{ top: sp.bottom, bottom: isMobile ? 160 : 0 }} onClick={finish} />
          <div className="tour-panel pointer-events-auto fixed left-0" style={{ top: sp.top, height: sp.bottom - sp.top, width: sp.left }} onClick={finish} />
          <div className="tour-panel pointer-events-auto fixed right-0" style={{ top: sp.top, height: sp.bottom - sp.top, left: sp.right }} onClick={finish} />
        </>
      ) : (
        <div className="tour-panel pointer-events-auto fixed inset-0" />
      )}

      {/* Spotlight ring */}
      {sp && (
        <div
          className="tour-ring pointer-events-none fixed rounded-xl"
          style={{
            top:    sp.top    - 2,
            left:   sp.left   - 2,
            width:  sp.right  - sp.left + 4,
            height: sp.bottom - sp.top  + 4,
            boxShadow: `0 0 0 2px ${HEX}, 0 0 0 4px ${HEX}30, 0 0 30px ${HEX}40`,
          }}
        />
      )}

      {/* Tooltip card */}
      {visible && (() => {
        const tw = getTooltipW();
        const cardContent = (
          <div
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c1e] shadow-2xl"
            style={{ boxShadow: `0 0 0 1px ${HEX}20, 0 20px 60px rgba(0,0,0,0.6)` }}
          >
            <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${HEX}, ${HEX}80)` }} />
            <div className="p-4 sm:p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-black bg-yellow-400/15 border-yellow-400/30 text-[#F5DA20]">
                    <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z"/>
                    </svg>
                    PRO · {idx + 1}/{total}
                  </div>
                  <h3 className="text-sm font-black text-white leading-tight sm:text-base">{step.title}</h3>
                </div>
                <button
                  onClick={finish}
                  className="mt-0.5 shrink-0 rounded-full p-1.5 text-white/30 transition hover:bg-white/8 hover:text-white/60"
                  aria-label="Close tour"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <p className="text-[12px] leading-relaxed text-white/60 sm:text-[13px]">{step.desc}</p>
              {step.tip && !isMobile && (
                <div className="mt-2 flex items-start gap-2">
                  <span className="text-sm">💡</span>
                  <p className="text-[11px] leading-snug text-white/35">{step.tip}</p>
                </div>
              )}
              <div className="mt-3 flex items-center justify-between sm:mt-4">
                <div className="flex gap-1.5">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIdx(i)}
                      className="rounded-full transition-all duration-200"
                      style={{ width: i === idx ? 16 : 5, height: 5, backgroundColor: i === idx ? HEX : "rgba(255,255,255,0.2)", flexShrink: 0 }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {idx > 0 && (
                    <button onClick={() => setIdx((i) => i - 1)} className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-semibold text-white/30 transition hover:text-white/60 sm:px-3">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                      Back
                    </button>
                  )}
                  <button
                    onClick={isLast ? finish : () => setIdx((i) => i + 1)}
                    className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black text-black transition hover:opacity-90 sm:py-2"
                    style={{ backgroundColor: HEX }}
                  >
                    {isLast ? "Start! →" : (
                      <>Next <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

        if (isMobile) {
          return (
            <div className="tour-tip-in pointer-events-auto fixed bottom-0 left-0 right-0 z-[9999] px-3 pb-4 safe-area-bottom">
              {cardContent}
            </div>
          );
        }

        return (
          <div
            className="tour-tip tour-tip-in pointer-events-auto fixed z-[9999]"
            style={{ top: rect ? tipPos.top : "50%", left: rect ? tipPos.left : "50%", transform: rect ? "none" : "translate(-50%, -50%)", width: tw }}
          >
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
