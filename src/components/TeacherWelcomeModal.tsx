"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

const COLORS = ["#8B5CF6", "#A78BFA", "#F5DA20", "#34D399", "#60A5FA", "#F97316", "#EC4899"];
const SHAPES = ["square", "circle", "triangle"] as const;
type Piece = { id: number; color: string; shape: (typeof SHAPES)[number]; left: number; delay: number; duration: number; size: number; rotate: number; drift: number };

function makeConfetti(count = 80): Piece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i, color: COLORS[i % COLORS.length], shape: SHAPES[i % SHAPES.length],
    left: Math.random() * 100, delay: Math.random() * 1.4,
    duration: 2.5 + Math.random() * 2.5, size: 7 + Math.random() * 9,
    rotate: Math.random() * 720, drift: (Math.random() - 0.5) * 120,
  }));
}

function ConfettiPiece({ p }: { p: Piece }) {
  const style: React.CSSProperties = {
    position: "fixed", top: "-20px", left: `${p.left}%`,
    width: p.size, height: p.shape === "triangle" ? 0 : p.size,
    backgroundColor: p.shape === "triangle" ? "transparent" : p.color,
    borderRadius: p.shape === "circle" ? "50%" : "2px",
    borderLeft: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : undefined,
    borderRight: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : undefined,
    borderBottom: p.shape === "triangle" ? `${p.size}px solid ${p.color}` : undefined,
    animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
    zIndex: 60, pointerEvents: "none",
    ["--drift" as string]: `${p.drift}px`, ["--rotate" as string]: `${p.rotate}deg`,
  };
  return <div style={style} />;
}

const PLAN_CONFIG = {
  starter: {
    studentLimit: 5,
    label: "Starter",
    topBar: "from-sky-500 via-sky-400 to-sky-500",
    heroBg: "from-sky-50 to-white",
    ringOuter: "bg-sky-400/30",
    ringInner: "bg-sky-400/15",
    iconGradient: "from-sky-500 to-sky-700",
    iconShadow: "shadow-sky-400/40",
    subtitle: "text-sky-600",
    itemBg: "bg-sky-100",
    ctaGradient: "from-sky-600 to-sky-500",
    ctaShadow: "shadow-sky-400/30",
  },
  solo: {
    studentLimit: 15,
    label: "Solo",
    topBar: "from-[#F5DA20] via-amber-400 to-[#F5DA20]",
    heroBg: "from-amber-50 to-white",
    ringOuter: "bg-amber-400/30",
    ringInner: "bg-amber-400/15",
    iconGradient: "from-amber-400 to-amber-600",
    iconShadow: "shadow-amber-400/40",
    subtitle: "text-amber-600",
    itemBg: "bg-amber-100",
    ctaGradient: "from-[#F5DA20] to-amber-400",
    ctaShadow: "shadow-amber-400/30",
  },
  plus: {
    studentLimit: 40,
    label: "Plus",
    topBar: "from-violet-500 via-purple-400 to-violet-500",
    heroBg: "from-violet-50 to-white",
    ringOuter: "bg-violet-400/30",
    ringInner: "bg-violet-400/15",
    iconGradient: "from-violet-500 to-violet-700",
    iconShadow: "shadow-violet-400/40",
    subtitle: "text-violet-600",
    itemBg: "bg-violet-100",
    ctaGradient: "from-violet-600 to-violet-500",
    ctaShadow: "shadow-violet-400/30",
  },
} as const;

const BASE_FEATURES = [
  { icon: "👩‍🏫", label: "Teacher Dashboard access" },
  { icon: "📊", label: "Full student progress analytics" },
  { icon: "📋", label: "Assign exercises with deadlines" },
  { icon: "🏫", label: "Create classes and groups" },
  { icon: "🔍", label: "See where students go wrong" },
  { icon: "🚫", label: "Ad-free for your students" },
];

export default function TeacherWelcomeModal({ onClose, plan }: { onClose: () => void; plan?: "starter" | "solo" | "plus" }) {
  const cfg = PLAN_CONFIG[plan ?? "solo"];
  const [pieces] = useState(() => makeConfetti(80));
  const [visibleItems, setVisibleItems] = useState(0);
  const [iconPopped, setIconPopped] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const UNLOCKED = [
    { icon: "👥", label: `Up to ${cfg.studentLimit} students` },
    ...BASE_FEATURES,
  ];

  useEffect(() => {
    const t = setTimeout(() => setIconPopped(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (visibleItems >= UNLOCKED.length) return;
    timerRef.current = setTimeout(() => setVisibleItems((v) => v + 1), visibleItems === 0 ? 700 : 160);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [visibleItems]);

  if (typeof document === "undefined") return null;
  return createPortal(<>
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(110vh) translateX(var(--drift)) rotate(var(--rotate)); opacity: 0; }
        }
        @keyframes icon-pop {
          0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
          60%  { transform: scale(1.25) rotate(8deg); opacity: 1; }
          80%  { transform: scale(0.92) rotate(-3deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes shine-ring-v {
          0%   { transform: scale(0.85); opacity: 0.6; }
          50%  { transform: scale(1.15); opacity: 0.15; }
          100% { transform: scale(0.85); opacity: 0.6; }
        }
        @keyframes slide-up { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes item-in  { from { transform: translateX(-12px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .icon-pop    { animation: icon-pop 0.6s cubic-bezier(.34,1.56,.64,1) both; }
        .shine-ring-v { animation: shine-ring-v 2.2s ease-in-out infinite; }
        .modal-card-t { animation: slide-up 0.45s cubic-bezier(.22,1,.36,1) both; }
        .item-in-t    { animation: item-in 0.35s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      {pieces.map((p) => <ConfettiPiece key={p.id} p={p} />)}

      <div className="fixed inset-0 z-[9999] overflow-y-auto" onClick={onClose}>
        <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
        <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="modal-card-t w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>

          {/* Top bar — plan colour */}
          <div className={`h-1.5 w-full bg-gradient-to-r ${cfg.topBar}`} />

          <button onClick={onClose} className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-slate-400 transition hover:bg-black/10">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Hero */}
          <div className={`flex flex-col items-center bg-gradient-to-b ${cfg.heroBg} px-7 pb-6 pt-10`}>
            <div className="relative flex h-24 w-24 items-center justify-center">
              <div className={`shine-ring-v absolute inset-0 rounded-full ${cfg.ringOuter}`} />
              <div className={`shine-ring-v absolute inset-2 rounded-full ${cfg.ringInner}`} style={{ animationDelay: "0.4s" }} />
              <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${cfg.iconGradient} shadow-xl ${cfg.iconShadow} ${iconPopped ? "icon-pop" : "opacity-0"}`}>
                <svg className="h-9 w-9 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                </svg>
              </div>
            </div>

            <h2 className="mt-5 text-center text-2xl font-black text-slate-900">Teacher Access Activated! 🎓</h2>
            <p className={`mt-1.5 text-center text-sm font-semibold ${cfg.subtitle}`}>You now have a Teacher {cfg.label} account</p>
            <p className="mt-2 text-center text-sm text-slate-500 leading-relaxed">
              Your Teacher Dashboard is ready. Here&apos;s everything you can now do:
            </p>
          </div>

          {/* Features */}
          <div className="px-7 pb-2">
            <ul className="space-y-2.5">
              {UNLOCKED.map((item, i) => (
                <li key={item.label} className={`item-in-t flex items-center gap-3 ${i < visibleItems ? "opacity-100" : "opacity-0"}`} style={{ animationDelay: `${i * 0.16 + 0.7}s` }}>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${cfg.itemBg} text-base`}>{item.icon}</span>
                  <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                  <svg className="ml-auto h-4 w-4 shrink-0 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="px-7 pb-8 pt-6">
            <a href="/account" onClick={onClose} className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${cfg.ctaGradient} px-5 py-3.5 text-sm font-black ${plan === "solo" ? "text-black" : "text-white"} shadow-lg ${cfg.ctaShadow} transition hover:opacity-90`}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
              Open Teacher Dashboard
            </a>
            <button onClick={onClose} className="mt-3 w-full text-center text-sm text-slate-400 transition hover:text-slate-600">
              Stay on this page
            </button>
          </div>
        </div>
        </div>
      </div>
    </>, document.body);
}
