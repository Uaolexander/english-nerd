"use client";

import { useState } from "react";
import ImageWithFallback from "@/components/ImageWithFallback";

type Tag = { label: string };

const TAG_STYLES: Record<string, string> = {
  "Speaking":       "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Grammar":        "bg-red-100 text-red-700 border-red-200",
  "Printable":      "bg-violet-100 text-violet-700 border-violet-200",
  "Self-study":     "bg-sky-100 text-sky-700 border-sky-200",
  "All levels":     "bg-amber-100 text-amber-700 border-amber-200",
  "Vocabulary":     "bg-purple-100 text-purple-700 border-purple-200",
  "Group activity": "bg-teal-100 text-teal-700 border-teal-200",
  "For teachers":   "bg-orange-100 text-orange-700 border-orange-200",
};

type Material = {
  slug: string;
  title: string;
  emoji: string;
  accent: string;
  accentClass: string;
  label: string;
  labelStyle: string;
  tags: string[];
  description: string;
  free?: boolean; // true = free for all logged-in users
};

const MATERIALS: Material[] = [
  {
    slug: "common-mistakes",
    title: "100 Most Common English Mistakes",
    emoji: "❌",
    accent: "#f87171",
    accentClass: "bg-red-400",
    label: "Grammar",
    labelStyle: "bg-red-400",
    tags: ["Grammar", "Self-study"],
    description: "The 100 mistakes learners make most — grammar, word choice, prepositions and more.",
    free: true,
  },
  {
    slug: "speaking-games",
    title: "Speak Up: Speaking Games",
    emoji: "🎲",
    accent: "#34d399",
    accentClass: "bg-emerald-400",
    label: "Games",
    labelStyle: "bg-emerald-400",
    tags: ["Speaking", "Group activity", "All levels", "For teachers"],
    description: "10 games and 200 prompts — Never Have I Ever, This or That, Would You Rather and more.",
  },
  {
    slug: "irregular-verbs",
    title: "Irregular Verbs",
    emoji: "🔁",
    accent: "#38bdf8",
    accentClass: "bg-sky-400",
    label: "Verbs",
    labelStyle: "bg-sky-400",
    tags: ["Grammar", "Printable", "For teachers"],
    description: "25 key irregular verbs with exercises. Printable in colour or black-and-white.",
  },
  {
    slug: "look-think-speak",
    title: "Look, Think, Speak!",
    emoji: "🖼️",
    accent: "#a78bfa",
    accentClass: "bg-violet-400",
    label: "Speaking",
    labelStyle: "bg-violet-400",
    tags: ["Speaking", "Vocabulary", "For teachers"],
    description: "Picture-description tasks with vocabulary hints and model answers.",
  },
  {
    slug: "never-have-i-ever",
    title: "Never Have I Ever",
    emoji: "🃏",
    accent: "#fb923c",
    accentClass: "bg-orange-400",
    label: "Games",
    labelStyle: "bg-orange-400",
    tags: ["Speaking", "Group activity", "Printable", "For teachers"],
    description: "75 cards to print, cut and play. Spark real English conversation.",
  },
];

type ModalType = "login" | "pro" | null;

export default function MaterialsClient({
  isLoggedIn,
  isPro,
}: {
  isLoggedIn: boolean;
  isPro: boolean;
}) {
  const [modal, setModal] = useState<ModalType>(null);

  function handleClick(e: React.MouseEvent, m: Material) {
    e.preventDefault();
    if (!isLoggedIn) { setModal("login"); return; }
    if (!m.free && !isPro) { setModal("pro"); return; }
    window.location.href = `/api/materials/download?slug=${m.slug}`;
  }

  return (
    <>
      {/* Free card highlight strip */}
      <div className="mt-8 mb-3 flex items-center gap-2">
        <span className="rounded-full bg-emerald-100 border border-emerald-200 px-3 py-0.5 text-[11px] font-black text-emerald-700">
          FREE for members
        </span>
        <span className="text-xs text-slate-400">— 1 material available with a free account</span>
      </div>

      {/* First card — FREE */}
      <div className="mb-6">
        {MATERIALS.filter((m) => m.free).map((m) => (
          <a
            key={m.slug}
            href={`/api/materials/download?slug=${m.slug}`}
            onClick={(e) => handleClick(e, m)}
            className="group relative flex overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white shadow-[0_2px_16px_rgba(52,211,153,0.12)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(52,211,153,0.2)] cursor-pointer"
          >
            {/* Cover image — A4 ratio, constrained width */}
            <div
              className="relative w-36 shrink-0 overflow-hidden sm:w-44"
              style={{ aspectRatio: "210/297", background: `linear-gradient(145deg, ${m.accent}30 0%, ${m.accent}10 100%)` }}
            >
              <ImageWithFallback
                src={`/topics/nerd-zone/materials/${m.slug}.jpg`}
                alt={m.title}
                className="h-full w-full object-cover"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-black text-black shadow-lg ${m.accentClass}`}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download
                </div>
              </div>
              {/* Label badge */}
              <div className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-black text-black shadow-sm ${m.labelStyle}`}>
                {m.label}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-black leading-snug text-slate-900 sm:text-xl">{m.title}</h2>
                  <span className="shrink-0 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">
                    FREE
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{m.description}</p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {m.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${TAG_STYLES[tag] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}
                  >
                    {tag}
                  </span>
                ))}
                <span className="ml-auto text-xs font-semibold text-emerald-600">
                  {isLoggedIn ? "Download PDF →" : "Log in to download →"}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Pro strip */}
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#F5DA20] px-3 py-0.5 text-[11px] font-black text-black">
          <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          PRO
        </span>
        <span className="text-xs text-slate-400">— {MATERIALS.filter((m) => !m.free).length} premium materials, Pro subscribers only</span>
      </div>

      {/* Pro cards grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 sm:gap-5">
        {MATERIALS.filter((m) => !m.free).map((m) => {
          const locked = !isPro;
          return (
            <a
              key={m.slug}
              href={locked ? "/pro" : `/api/materials/download?slug=${m.slug}`}
              onClick={locked ? (e) => { e.preventDefault(); if (!isLoggedIn) setModal("login"); else setModal("pro"); } : (e) => handleClick(e, m)}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)] cursor-pointer"
            >
              {/* Cover image — A4 ratio */}
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: "210/297", background: `linear-gradient(145deg, ${m.accent}25 0%, ${m.accent}08 100%)` }}
              >
                <ImageWithFallback
                  src={`/topics/nerd-zone/materials/${m.slug}.jpg`}
                  alt={m.title}
                  className="h-full w-full object-cover"
                />

                {/* Hover overlay */}
                <div className={`absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${locked ? "bg-black/50" : "bg-black/40"}`}>
                  {locked ? (
                    <div className="flex flex-col items-center gap-2 px-3 text-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5DA20] shadow-lg">
                        <svg className="h-4 w-4 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      </div>
                      <span className="text-xs font-black text-white leading-tight">Upgrade to Pro</span>
                    </div>
                  ) : (
                    <div className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-black text-black shadow-lg ${m.accentClass}`}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download
                    </div>
                  )}
                </div>

                {/* Label badge */}
                <div className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-black text-black shadow-sm ${m.labelStyle}`}>
                  {m.label}
                </div>

                {/* PRO badge */}
                <div className="absolute top-2 right-2 flex items-center gap-0.5 rounded-full bg-black/75 px-2 py-0.5 text-[9px] font-black text-[#F5DA20] backdrop-blur-sm">
                  <svg className="h-2 w-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  PRO
                </div>

                {/* Fallback emoji */}
                <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center text-5xl opacity-15 select-none">
                  {m.emoji}
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col p-4">
                <h2 className="text-sm font-black leading-snug text-slate-900">{m.title}</h2>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400 line-clamp-2">
                  {m.description}
                </p>
                <div className="mt-auto pt-3 flex flex-wrap gap-1">
                  {m.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${TAG_STYLES[tag] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          );
        })}

        {/* Coming soon */}
        <div className="relative flex flex-col overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-slate-50/60">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "210/297" }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-slate-400">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-[11px] font-black text-slate-500">Coming soon</span>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-4">
            <h2 className="text-sm font-black leading-snug text-slate-400">More on the way</h2>
            <p className="mt-1 text-[11px] text-slate-400">New PDFs being prepared.</p>
          </div>
        </div>
      </div>

      {/* ── Login modal ────────────────────────────────────────────────────── */}
      {modal === "login" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="h-1 w-full bg-gradient-to-r from-[#F5DA20] to-amber-400" />
            <div className="px-7 py-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5DA20]/15 text-[#b8a200]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h2 className="text-xl font-black text-slate-900">Members only</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Create a free account or log in to download this material.
              </p>
              <div className="mt-7 flex flex-col gap-3">
                <a href="/register" className="w-full rounded-2xl bg-[#F5DA20] py-3 text-sm font-black text-black hover:opacity-90 transition">
                  Create free account
                </a>
                <a href="/login?next=/nerd-zone/my-materials" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
                  Log in
                </a>
              </div>
              <button onClick={() => setModal(null)} className="mt-5 text-xs text-slate-400 hover:text-slate-600 transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Pro modal ──────────────────────────────────────────────────────── */}
      {modal === "pro" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="h-1.5 w-full bg-[#F5DA20]" />
            <div className="px-7 py-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5DA20]">
                <svg className="h-7 w-7 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h2 className="text-xl font-black text-slate-900">Pro material</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                This PDF is available for Pro subscribers. Upgrade to get all materials plus no ads, certificates, and more.
              </p>
              <ul className="mt-5 space-y-2 text-left">
                {["All 5 PDF materials", "No ads on the entire site", "Streak Freeze protection", "Grammar certificates", "Priority access to new content"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F5DA20] text-[10px] font-black text-black">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="/pro" className="mt-7 block w-full rounded-2xl bg-[#F5DA20] py-3 text-sm font-black text-black hover:opacity-90 transition">
                Get Pro →
              </a>
              <button onClick={() => setModal(null)} className="mt-4 text-xs text-slate-400 hover:text-slate-600 transition">Maybe later</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
