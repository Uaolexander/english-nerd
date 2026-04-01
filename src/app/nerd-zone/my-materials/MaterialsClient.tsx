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
    label: "Games",
    tags: ["Speaking", "Group activity", "All levels"],
    description: "10 engaging speaking games and 200 prompts — Never Have I Ever, This or That, Would You Rather, Tell Me a Story and more. Perfect for playing with friends or using in class.",
  },
  {
    slug: "common-mistakes",
    title: "100 Most Common English Mistakes",
    emoji: "❌",
    accent: "#f87171",
    accentClass: "bg-red-400",
    label: "Grammar",
    tags: ["Grammar", "Word choice", "Prepositions"],
    description: "A practical guide to the 100 mistakes English learners make most often. Covers grammar, word choice, prepositions and more — great for self-study and for teachers.",
  },
  {
    slug: "irregular-verbs",
    title: "Irregular Verbs",
    emoji: "🔁",
    accent: "#38bdf8",
    accentClass: "bg-sky-400",
    label: "Verbs",
    tags: ["Grammar", "Printable", "B1–B2"],
    description: "25 key irregular verbs with exercises. Printable in colour or black-and-white. Includes a 'Find the Mistake' drill to sharpen accuracy.",
  },
  {
    slug: "look-think-speak",
    title: "Look, Think, Speak!",
    emoji: "🖼️",
    accent: "#a78bfa",
    accentClass: "bg-violet-400",
    label: "Speaking",
    tags: ["Speaking", "Vocabulary", "Description"],
    description: "Picture-description tasks with vocabulary hints and model answers. Learners describe what they see using guided vocabulary — ideal for teachers and students.",
  },
  {
    slug: "never-have-i-ever",
    title: "Never Have I Ever",
    emoji: "🃏",
    accent: "#fb923c",
    accentClass: "bg-orange-400",
    label: "Games",
    tags: ["Speaking", "Group activity", "Printable"],
    description: "75 'Never Have I Ever' cards to print, cut out and play. A natural way to spark real English conversation — perfect for classes and friend groups alike.",
  },
];

export default function MaterialsClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [showModal, setShowModal] = useState(false);

  function handleClick(e: React.MouseEvent, slug: string) {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowModal(true);
      return;
    }
    window.location.href = `/api/materials/download?slug=${slug}`;
    e.preventDefault();
  }

  return (
    <>
      {/* Material rows */}
      <div className="mt-8 space-y-4">
        {MATERIALS.map((m) => (
          <a
            key={m.slug}
            href={`/api/materials/download?slug=${m.slug}`}
            onClick={(e) => handleClick(e, m.slug)}
            className="group flex items-stretch gap-0 overflow-hidden rounded-2xl border border-white/10 bg-[#121216] transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-2xl hover:shadow-black/50 cursor-pointer"
          >
            {/* Left — A4 cover image */}
            <div
              className="relative w-[100px] shrink-0 overflow-hidden sm:w-[130px]"
              style={{ background: `linear-gradient(135deg, ${m.accent}22 0%, ${m.accent}06 100%)`, aspectRatio: "210/297" }}
            >
              <ImageWithFallback
                src={`/topics/nerd-zone/materials/${m.slug}.jpg`}
                alt={m.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute right-0 top-0 h-full w-[3px]" style={{ background: m.accent, opacity: 0.5 }} />
            </div>

            {/* Right — content */}
            <div className="flex flex-1 items-center justify-between gap-4 px-5 py-5 sm:px-7 sm:py-6 min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-black text-black ${m.accentClass}`}>
                    {m.label}
                  </span>
                </div>
                <h2 className="text-lg font-black text-white leading-snug sm:text-xl">{m.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/50 line-clamp-2 sm:text-[15px]">
                  {m.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {m.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/8 bg-white/4 px-2.5 py-0.5 text-[11px] font-medium text-white/35">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action icon */}
              <div className={`shrink-0 flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                isLoggedIn
                  ? "bg-[#F5DA20]/10 border-[#F5DA20]/20 text-[#F5DA20] group-hover:bg-[#F5DA20] group-hover:text-black group-hover:border-transparent"
                  : "bg-white/4 border-white/10 text-white/30 group-hover:bg-white/8 group-hover:text-white/50"
              }`}>
                {isLoggedIn ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                )}
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
            {/* Top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-[#F5DA20] to-amber-400" />

            <div className="px-7 py-8 text-center">
              {/* Lock icon */}
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
