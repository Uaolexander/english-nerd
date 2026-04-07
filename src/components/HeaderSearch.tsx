"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { searchContent, getSearchCategory } from "@/content";
import type { SearchItem } from "@/content";

interface HeaderSearchProps {
  onClose?: () => void;
  autoFocus?: boolean;
}

type Category = ReturnType<typeof getSearchCategory>;

const CATEGORY_LABEL: Record<Category, string> = {
  test:      "Tests",
  grammar:   "Grammar",
  tense:     "Tenses",
  vocab:     "Vocabulary",
  reading:   "Reading",
  listening: "Listening",
  nerd:      "Nerd Zone",
  action:    "Quick Actions",
  other:     "Other",
};

function ResultIcon({ cat }: { cat: Category }) {
  const base = "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg";
  if (cat === "test") return (
    <span className={`${base} bg-gradient-to-br from-sky-400 to-blue-600`}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="2"/>
        <path d="M7 8h10M7 12h10M7 16h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </span>
  );
  if (cat === "tense") return (
    <span className={`${base} bg-gradient-to-br from-violet-500 to-purple-700`}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
        <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
  if (cat === "grammar") return (
    <span className={`${base} bg-gradient-to-br from-[#F5DA20] to-amber-400`}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M4 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M7 8h7M7 12h7M7 16h4" stroke="black" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </span>
  );
  if (cat === "vocab") return (
    <span className={`${base} bg-gradient-to-br from-emerald-400 to-teal-600`}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
  if (cat === "reading") return (
    <span className={`${base} bg-gradient-to-br from-rose-400 to-pink-600`}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
  if (cat === "listening") return (
    <span className={`${base} bg-gradient-to-br from-cyan-400 to-sky-600`}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" stroke="white" strokeWidth="2"/>
      </svg>
    </span>
  );
  if (cat === "nerd") return (
    <span className={`${base} bg-gradient-to-br from-orange-400 to-red-500`}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
  if (cat === "action") return (
    <span className={`${base} bg-gradient-to-br from-slate-500 to-slate-700`}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
        <polyline points="12 8 16 12 12 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="8" y1="12" x2="16" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </span>
  );
  // fallback
  return (
    <span className={`${base} bg-gradient-to-br from-[#F5DA20] to-amber-400`}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M4 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" stroke="black" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M7 8h7M7 12h7M7 16h4" stroke="black" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </span>
  );
}

const QUICK_PICKS = [
  { label: "Tests", items: [
    { title: "Grammar Test", href: "/tests/grammar", badge: "Test" },
    { title: "Vocabulary Test", href: "/tests/vocabulary", badge: "Test" },
    { title: "Tenses Test", href: "/tests/tenses", badge: "Test" },
  ]},
  { label: "Popular Lessons", items: [
    { title: "Present Perfect", href: "/grammar/b1/present-perfect", badge: "B1" },
    { title: "Past Simple", href: "/grammar/a2/past-simple-regular", badge: "A2" },
    { title: "Conditionals", href: "/grammar/b1/zero-first-conditional", badge: "B1" },
  ]},
  { label: "Quick Actions", items: [
    { title: "Enter Promo / Voucher Code", href: "/redeem", badge: "Action" },
    { title: "My Account & Dashboard", href: "/account", badge: "Action" },
  ]},
];

function groupResults(results: SearchItem[]) {
  const ORDER: Category[] = ["action", "test", "grammar", "tense", "vocab", "reading", "listening", "nerd", "other"];
  const groups: Record<string, SearchItem[]> = {};
  for (const r of results) {
    const cat = getSearchCategory(r);
    const label = CATEGORY_LABEL[cat];
    if (!groups[label]) groups[label] = [];
    groups[label].push(r);
  }
  // Sort groups by predefined order
  return Object.fromEntries(
    ORDER
      .map((cat) => [CATEGORY_LABEL[cat], groups[CATEGORY_LABEL[cat]]] as [string, SearchItem[]])
      .filter(([, items]) => items?.length > 0)
  );
}

export default function HeaderSearch({ onClose, autoFocus }: HeaderSearchProps = {}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(autoFocus ?? false);
  const [cursor, setCursor] = useState(-1);

  const results: SearchItem[] = searchContent(q);

  const openDropdown = useCallback(() => {
    setOpen(true);
    setCursor(-1);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setQ("");
    setCursor(-1);
    onClose?.();
  }, [onClose]);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        open ? closeDropdown() : openDropdown();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openDropdown, closeDropdown]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") { closeDropdown(); return; }
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, -1)); }
    else if (e.key === "Enter" && cursor >= 0 && results[cursor]) {
      e.preventDefault();
      window.location.href = results[cursor].href;
      closeDropdown();
    }
  }

  const grouped = groupResults(results);

  return (
    <div
      className="relative"
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) closeDropdown(); }}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger button */}
      <button
        type="button"
        aria-label="Search"
        onClick={() => (open ? closeDropdown() : openDropdown())}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
          <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[440px] overflow-hidden rounded-2xl border border-white/12 bg-[#0E0F13]/98 shadow-2xl shadow-black/50 backdrop-blur-2xl">

          {/* Input row */}
          <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/40">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              ref={inputRef}
              value={q}
              autoFocus={autoFocus}
              onChange={(e) => { setQ(e.target.value); setCursor(-1); }}
              placeholder="Search lessons, reading, voucher, PRO…"
              className="flex-1 bg-transparent text-sm font-medium text-white placeholder:text-white/30 outline-none"
            />
            {q && (
              <button type="button" onClick={() => setQ("")} className="text-white/30 hover:text-white/60 transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={closeDropdown}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-bold text-white/40 hover:bg-white/10 hover:text-white/60 transition"
            >
              Esc
            </button>
          </div>

          {/* Results or quick picks */}
          <div className="max-h-[420px] overflow-y-auto p-2">
            {q.trim() ? (
              results.length > 0 ? (
                Object.entries(grouped).map(([label, items]) => (
                  <div key={label} className="mb-1">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white/25">{label}</div>
                    {items.map((r) => {
                      const globalIdx = results.indexOf(r);
                      const cat = getSearchCategory(r);
                      return (
                        <Link
                          key={r.href + r.title}
                          href={r.href}
                          tabIndex={0}
                          onClick={() => { setOpen(false); setQ(""); onClose?.(); }}
                          onMouseEnter={() => setCursor(globalIdx)}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
                            cursor === globalIdx ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/7 hover:text-white"
                          }`}
                        >
                          <ResultIcon cat={cat} />
                          <span className="flex-1 text-sm font-semibold leading-tight truncate">{r.title}</span>
                          {r.badge && r.badge !== "Action" && (
                            <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-black text-[#F5DA20]">
                              {r.badge}
                            </span>
                          )}
                          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="shrink-0 text-white/20">
                            <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </Link>
                      );
                    })}
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <div className="text-2xl mb-2">🔍</div>
                  <div className="text-sm font-semibold text-white/60">No results for &ldquo;{q}&rdquo;</div>
                  <div className="mt-1 text-xs text-white/30">Try: passive voice, conditionals, phrasal verbs, voucher</div>
                </div>
              )
            ) : (
              QUICK_PICKS.map((section) => (
                <div key={section.label} className="mb-1">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white/25">{section.label}</div>
                  {section.items.map((item) => {
                    const cat = getSearchCategory({ ...item, keywords: [] });
                    return (
                      <Link
                        key={item.href + item.title}
                        href={item.href}
                        onClick={() => { setOpen(false); setQ(""); onClose?.(); }}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-white/80 hover:bg-white/7 hover:text-white transition-colors"
                      >
                        <ResultIcon cat={cat} />
                        <span className="flex-1 text-sm font-semibold">{item.title}</span>
                        {item.badge !== "Action" && (
                          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-black text-[#F5DA20]">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer hint */}
          <div className="border-t border-white/8 px-4 py-2 flex items-center justify-between">
            <span className="text-[11px] text-white/25">↑↓ navigate · Enter to open · ⌘K toggle</span>
            <span className="text-[11px] text-white/25">{q.trim() ? `${results.length} result${results.length !== 1 ? "s" : ""}` : "Quick picks"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
