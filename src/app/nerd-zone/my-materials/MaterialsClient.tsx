"use client";

import { useState } from "react";
import ImageWithFallback from "@/components/ImageWithFallback";

type Tag = {
  label: string;
  color: string;
};

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

const MATERIALS = [
  {
    slug: "speaking-games",
    title: "Speak Up: Speaking Games",
    emoji: "🎲",
    accent: "#34d399",
    accentClass: "bg-emerald-400",
    label: "Games",
    labelStyle: "bg-emerald-400",
    tags: ["Speaking", "Group activity", "All levels", "For teachers"],
    description: "10 games and 200 prompts — Never Have I Ever, This or That, Would You Rather, Tell Me a Story and more.",
  },
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

export default function MaterialsClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [showModal, setShowModal] = useState(false);

  function handleClick(e: React.MouseEvent, slug: string) {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }
    window.location.href = `/api/materials/download?slug=${slug}`;
  }

  return (
    <>
      {/* Cards grid */}
      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6">
        {MATERIALS.map((m) => (
          <a
            key={m.slug}
            href={`/api/materials/download?slug=${m.slug}`}
            onClick={(e) => handleClick(e, m.slug)}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:border-slate-300 cursor-pointer"
          >
            {/* Cover image — A4 ratio */}
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "210/297", background: `linear-gradient(145deg, ${m.accent}30 0%, ${m.accent}10 100%)` }}
            >
              <ImageWithFallback
                src={`/topics/nerd-zone/materials/${m.slug}.jpg`}
                alt={m.title}
                className="h-full w-full object-cover"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black text-black shadow-lg ${m.accentClass}`}>
                  {isLoggedIn ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      Log in
                    </>
                  )}
                </div>
              </div>

              {/* Label badge */}
              <div className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-black text-black shadow-sm ${m.labelStyle}`}>
                {m.label}
              </div>

              {/* Fallback emoji */}
              <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center text-5xl opacity-20 select-none">
                {m.emoji}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <h2 className="text-sm font-black leading-snug text-slate-900 sm:text-base">{m.title}</h2>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500 line-clamp-2 sm:text-xs sm:leading-relaxed">
                {m.description}
              </p>

              {/* Tags */}
              <div className="mt-auto pt-3 flex flex-wrap gap-1.5">
                {m.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:text-[11px] ${TAG_STYLES[tag] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 w-full bg-gradient-to-r from-[#F5DA20] to-amber-400" />

            <div className="px-7 py-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5DA20]/15 text-[#b8a200]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>

              <h2 className="text-xl font-black text-slate-900">Members only</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                This material is available to registered users only. Create a free account or log in to download it.
              </p>

              <div className="mt-7 flex flex-col gap-3">
                <a
                  href="/register"
                  className="w-full rounded-2xl bg-[#F5DA20] py-3 text-sm font-black text-black hover:opacity-90 transition"
                >
                  Create free account
                </a>
                <a
                  href="/login?next=/nerd-zone/my-materials"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Log in
                </a>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="mt-5 text-xs text-slate-400 hover:text-slate-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
