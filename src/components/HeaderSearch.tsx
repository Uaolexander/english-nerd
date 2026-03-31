"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { searchContent } from "@/content";
import type { SearchItem } from "@/content";

interface HeaderSearchProps {
  onClose?: () => void;
  autoFocus?: boolean;
}

function getCategory(item: SearchItem): "test" | "grammar" | "tense" | "other" {
  if (item.badge === "Test" || item.href.startsWith("/tests")) return "test";
  if (item.href.startsWith("/tenses")) return "tense";
  if (item.href.startsWith("/grammar")) return "grammar";
  return "other";
}

function ResultIcon({ category }: { category: ReturnType<typeof getCategory> }) {
  if (category === "test") return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="2"/>
        <path d="M7 8h10M7 12h10M7 16h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </span>
  );
  if (category === "tense") return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-700">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
        <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#F5DA20] to-amber-400">
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
  { label: "Popular lessons", items: [
    { title: "Present Perfect", href: "/grammar/b1/present-perfect", badge: "B1" },
    { title: "Past Simple", href: "/grammar/a2/past-simple", badge: "A2" },
    { title: "Conditionals", href: "/grammar/b1/first-conditional", badge: "B1" },
  ]},
];

function groupResults(results: SearchItem[]) {
  const groups: Record<string, SearchItem[]> = {};
  for (const r of results) {
    const cat = getCategory(r);
    const label = cat === "test" ? "Tests" : cat === "tense" ? "Tenses" : cat === "grammar" ? "Grammar" : "Other";
    if (!groups[label]) groups[label] = [];
    groups[label].push(r);
  }
  return groups;
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
        <div className="absolute right-0 top-full mt-2 w-[420px] overflow-hidden rounded-2xl border border-white/12 bg-[#0E0F13]/98 shadow-2xl shadow-black/50 backdrop-blur-2xl">

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
              placeholder="Search lessons, topics, tenses…"
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
          <div className="max-h-[400px] overflow-y-auto p-2">
            {q.trim() ? (
              results.length > 0 ? (
                Object.entries(grouped).map(([label, items]) => (
                  <div key={label} className="mb-1">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white/25">{label}</div>
                    {items.map((r, i) => {
                      const globalIdx = results.indexOf(r);
                      return (
                        <Link
                          key={r.href}
                          href={r.href}
                          tabIndex={0}
                          onClick={() => { setOpen(false); setQ(""); onClose?.(); }}
                          onMouseEnter={() => setCursor(globalIdx)}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
                            cursor === globalIdx ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/7 hover:text-white"
                          }`}
                        >
                          <ResultIcon category={getCategory(r)} />
                          <span className="flex-1 text-sm font-semibold leading-tight truncate">{r.title}</span>
                          {r.badge && (
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
                  <div className="mt-1 text-xs text-white/30">Try: passive voice, conditionals, phrasal verbs</div>
                </div>
              )
            ) : (
              QUICK_PICKS.map((section) => (
                <div key={section.label} className="mb-1">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white/25">{section.label}</div>
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => { setOpen(false); setQ(""); onClose?.(); }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-white/80 hover:bg-white/7 hover:text-white transition-colors"
                    >
                      <ResultIcon category={getCategory({ ...item, keywords: [] })} />
                      <span className="flex-1 text-sm font-semibold">{item.title}</span>
                      <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-black text-[#F5DA20]">
                        {item.badge}
                      </span>
                    </Link>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Footer hint */}
          <div className="border-t border-white/8 px-4 py-2 flex items-center justify-between">
            <span className="text-[11px] text-white/25">↑↓ navigate · Enter to open</span>
            <span className="text-[11px] text-white/25">{q.trim() ? `${results.length} result${results.length !== 1 ? "s" : ""}` : "Quick picks"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
