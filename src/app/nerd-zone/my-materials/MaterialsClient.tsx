"use client";

import { useState } from "react";
import ImageWithFallback from "@/components/ImageWithFallback";

const MATERIALS = [
  {
    slug: "speaking-games",
    title: "Speak Up: Speaking Games",
    emoji: "🎲",
    accent: "#34d399",
    accentClass: "bg-emerald-400",
    accentText: "text-emerald-400",
    label: "Games",
    tags: ["Speaking", "All levels"],
    description: "10 games, 200 prompts. Never Have I Ever, This or That, Would You Rather and more.",
  },
  {
    slug: "common-mistakes",
    title: "100 Most Common English Mistakes",
    emoji: "❌",
    accent: "#f87171",
    accentClass: "bg-red-400",
    accentText: "text-red-400",
    label: "Grammar",
    tags: ["Grammar", "Self-study"],
    description: "The 100 mistakes learners make most — grammar, word choice, prepositions.",
  },
  {
    slug: "irregular-verbs",
    title: "Irregular Verbs",
    emoji: "🔁",
    accent: "#38bdf8",
    accentClass: "bg-sky-400",
    accentText: "text-sky-400",
    label: "Verbs",
    tags: ["Grammar", "Printable"],
    description: "25 key irregular verbs with exercises. Colour or black-and-white.",
  },
  {
    slug: "look-think-speak",
    title: "Look, Think, Speak!",
    emoji: "🖼️",
    accent: "#a78bfa",
    accentClass: "bg-violet-400",
    accentText: "text-violet-400",
    label: "Speaking",
    tags: ["Speaking", "Vocabulary"],
    description: "Picture-description tasks with vocabulary hints and model answers.",
  },
  {
    slug: "never-have-i-ever",
    title: "Never Have I Ever",
    emoji: "🃏",
    accent: "#fb923c",
    accentClass: "bg-orange-400",
    accentText: "text-orange-400",
    label: "Games",
    tags: ["Speaking", "Printable"],
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
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
        {MATERIALS.map((m) => (
          <a
            key={m.slug}
            href={`/api/materials/download?slug=${m.slug}`}
            onClick={(e) => handleClick(e, m.slug)}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121216] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/60 cursor-pointer"
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

              {/* Hover overlay with download button */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black text-black ${m.accentClass}`}>
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
              <div className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-black text-black shadow-sm ${m.accentClass}`}>
                {m.label}
              </div>

              {/* Fallback emoji (shown only when no image) */}
              <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center text-5xl opacity-30 select-none">
                {m.emoji}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col p-4">
              <h2 className="text-sm font-black leading-snug text-white sm:text-base">{m.title}</h2>
              <p className="mt-1.5 text-[11px] leading-relaxed text-white/45 line-clamp-2 sm:text-xs">
                {m.description}
              </p>

              {/* Tags */}
              <div className="mt-auto pt-3 flex flex-wrap gap-1.5">
                {m.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[10px] font-medium text-white/30">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#18191F] shadow-2xl shadow-black/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 w-full bg-gradient-to-r from-[#F5DA20] to-amber-400" />

            <div className="px-7 py-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#F5DA20]/20 bg-[#F5DA20]/10 text-[#F5DA20]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>

              <h2 className="text-xl font-black text-white">Members only</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
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
                  className="w-full rounded-2xl border border-white/12 bg-white/5 py-3 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white transition"
                >
                  Log in
                </a>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="mt-5 text-xs text-white/30 hover:text-white/60 transition"
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
