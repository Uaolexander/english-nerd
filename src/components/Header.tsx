"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { searchContent } from "@/content";
import type { SearchItem } from "@/content";
import HeaderSearch from "@/components/HeaderSearch";
import AuthButton from "@/components/AuthButton";

const grammarLevels = [
  { lvl: "A1", label: "Beginner",           color: "bg-[#F5DA20]",   textColor: "text-black", lessons: 21 },
  { lvl: "A2", label: "Elementary",          color: "bg-emerald-400", textColor: "text-black", lessons: 21 },
  { lvl: "B1", label: "Intermediate",        color: "bg-violet-400",  textColor: "text-white", lessons: 22 },
  { lvl: "B2", label: "Upper-Intermediate",  color: "bg-orange-400",  textColor: "text-black", lessons: 19 },
  { lvl: "C1", label: "Advanced",            color: "bg-sky-400",     textColor: "text-black", lessons: 18 },
];

const tensesList = [
  { slug: "present-simple",              title: "Present Simple",              level: "A1", color: "bg-[#F5DA20]",   textColor: "text-black" },
  { slug: "present-continuous",          title: "Present Continuous",          level: "A1", color: "bg-[#F5DA20]",   textColor: "text-black" },
  { slug: "past-simple",                 title: "Past Simple",                 level: "A2", color: "bg-emerald-400", textColor: "text-black" },
  { slug: "past-continuous",             title: "Past Continuous",             level: "A2", color: "bg-emerald-400", textColor: "text-black" },
  { slug: "present-perfect",             title: "Present Perfect",             level: "B1", color: "bg-violet-400",  textColor: "text-white" },
  { slug: "present-perfect-continuous",  title: "Present Perfect Continuous",  level: "B1", color: "bg-violet-400",  textColor: "text-white" },
  { slug: "past-perfect",                title: "Past Perfect",                level: "B1", color: "bg-violet-400",  textColor: "text-white" },
  { slug: "past-perfect-continuous",     title: "Past Perfect Continuous",     level: "B2", color: "bg-orange-400",  textColor: "text-black" },
  { slug: "future-simple",               title: "Future Simple (will)",        level: "A2", color: "bg-emerald-400", textColor: "text-black" },
  { slug: "be-going-to",                 title: "Be going to",                 level: "A2", color: "bg-emerald-400", textColor: "text-black" },
  { slug: "future-continuous",           title: "Future Continuous",           level: "B2", color: "bg-orange-400",  textColor: "text-black" },
  { slug: "future-perfect",              title: "Future Perfect",              level: "B2", color: "bg-orange-400",  textColor: "text-black" },
  { slug: "future-perfect-continuous",   title: "Future Perfect Continuous",   level: "C1", color: "bg-sky-400",     textColor: "text-black" },
];

// ─── MobileSearch helpers ─────────────────────────────────────────────────────

function getMobileCategory(item: SearchItem): "test" | "grammar" | "tense" {
  if (item.badge === "Test" || item.href.startsWith("/tests")) return "test";
  if (item.href.startsWith("/tenses")) return "tense";
  return "grammar";
}

function MobileResultIcon({ cat }: { cat: "test" | "grammar" | "tense" }) {
  if (cat === "test") return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="2"/><path d="M7 8h10M7 12h10M7 16h6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
    </span>
  );
  if (cat === "tense") return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-700">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </span>
  );
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#F5DA20] to-amber-400">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" stroke="black" strokeWidth="2" strokeLinejoin="round"/><path d="M7 8h7M7 12h7M7 16h4" stroke="black" strokeWidth="2" strokeLinecap="round"/></svg>
    </span>
  );
}

const MOBILE_QUICK_PICKS = [
  { label: "Tests", items: [
    { title: "Grammar Test",    href: "/tests/grammar",    badge: "Test" },
    { title: "Vocabulary Test", href: "/tests/vocabulary", badge: "Test" },
    { title: "Tenses Test",     href: "/tests/tenses",     badge: "Test" },
  ]},
  { label: "Popular", items: [
    { title: "Present Perfect", href: "/grammar/b1/present-perfect", badge: "B1" },
    { title: "Past Simple",     href: "/grammar/a2/past-simple",     badge: "A2" },
    { title: "Future Simple",   href: "/tenses/future-simple",       badge: "A2" },
  ]},
];

// ─── MobileSearch ────────────────────────────────────────────────────────────

function MobileSearch({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(-1);
  const results: SearchItem[] = searchContent(q);

  const grouped: Record<string, SearchItem[]> = {};
  for (const r of results) {
    const cat = getMobileCategory(r);
    const label = cat === "test" ? "Tests" : cat === "tense" ? "Tenses" : "Grammar";
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(r);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, -1)); }
    else if (e.key === "Enter" && cursor >= 0 && results[cursor]) {
      e.preventDefault();
      window.location.href = results[cursor].href;
      onClose();
    }
  }

  return (
    <div onKeyDown={handleKeyDown}>
      {/* Input */}
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/40" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
          <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          autoFocus
          value={q}
          onChange={(e) => { setQ(e.target.value); setCursor(-1); }}
          placeholder="Search lessons, topics, tenses…"
          className="w-full bg-transparent text-sm font-medium text-white placeholder:text-white/30 outline-none"
        />
        {q && (
          <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="text-white/30 hover:text-white/60 transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        )}
      </div>

      {/* Results */}
      <div className="mt-2 max-h-[50vh] overflow-y-auto">
        {q.trim() ? (
          results.length > 0 ? (
            Object.entries(grouped).map(([label, items]) => (
              <div key={label} className="mb-1">
                <div className="px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-white/25">{label}</div>
                {items.map((r, i) => {
                  const globalIdx = results.indexOf(r);
                  return (
                    <a key={r.href} href={r.href} onClick={onClose} onTouchEnd={onClose}
                      onMouseEnter={() => setCursor(globalIdx)}
                      className={`flex items-center gap-3 rounded-xl px-2 py-2 transition-colors ${cursor === globalIdx ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/7"}`}
                    >
                      <MobileResultIcon cat={getMobileCategory(r)} />
                      <span className="flex-1 text-sm font-semibold truncate">{r.title}</span>
                      {r.badge && (
                        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-black text-[#F5DA20]">{r.badge}</span>
                      )}
                    </a>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="py-6 text-center">
              <div className="text-xl mb-1">🔍</div>
              <div className="text-sm font-semibold text-white/50">No results for &ldquo;{q}&rdquo;</div>
              <div className="mt-1 text-xs text-white/25">Try: passive voice, conditionals</div>
            </div>
          )
        ) : (
          MOBILE_QUICK_PICKS.map((section) => (
            <div key={section.label} className="mb-1">
              <div className="px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-white/25">{section.label}</div>
              {section.items.map((item) => (
                <a key={item.href} href={item.href} onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 text-white/80 hover:bg-white/7 transition-colors"
                >
                  <MobileResultIcon cat={getMobileCategory({ ...item, keywords: [] })} />
                  <span className="flex-1 text-sm font-semibold">{item.title}</span>
                  <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-black text-[#F5DA20]">{item.badge}</span>
                </a>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {q.trim() && (
        <div className="mt-1 border-t border-white/8 pt-2 text-right text-[11px] text-white/25">
          {results.length} result{results.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}

// ─── MobileAccordion ─────────────────────────────────────────────────────────

function MobileAccordion({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-[15px] font-semibold text-white/80 hover:bg-white/10 hover:text-white"
      >
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="ml-2 mt-1 flex flex-col gap-0.5 border-l border-white/10 pl-2">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Dropdown shell ───────────────────────────────────────────────────────────

function DropdownShell({ width, children }: { width: string; children: React.ReactNode }) {
  return (
    <div className={`pointer-events-none invisible absolute left-0 top-full ${width} translate-y-1 scale-[0.98] opacity-0 transition duration-200 ease-out group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100`}>
      <div className="relative pt-2 before:absolute before:left-0 before:top-0 before:h-2 before:w-full before:content-['']">
        <div className="rounded-2xl border border-white/10 bg-black/95 p-3 shadow-2xl backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  function toggleSection(section: string) {
    setExpandedSection((prev) => (prev === section ? null : section));
  }

  function closeAll() {
    setMenuOpen(false);
    setExpandedSection(null);
    setMobileSearchOpen(false);
  }

  useEffect(() => {
    closeAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function isActive(section: string) {
    if (section === "Grammar") return pathname.startsWith("/grammar");
    if (section === "Tenses") return pathname.startsWith("/tenses");
    if (section === "Tests") return pathname.startsWith("/tests");
    if (section === "Vocabulary") return pathname.startsWith("/vocabulary");
    if (section === "Listening") return pathname.startsWith("/listening");
    if (section === "Reading") return pathname.startsWith("/reading");
    if (section === "NerdZone") return pathname.startsWith("/nerd-zone");
    return false;
  }

  const navItemClass = (section: string) =>
    `relative hover:text-white transition pb-0.5 ${
      isActive(section)
        ? "text-white after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-[#F5DA20]"
        : "text-white/70"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0B0B0D] border-b border-white/10" style={{ paddingLeft: "env(safe-area-inset-left)", paddingRight: "env(safe-area-inset-right)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">

          {/* LEFT: video logo + brand */}
          <Link href="/" className="flex items-center gap-3" onClick={closeAll}>
            <div className="h-14 w-14 overflow-hidden rounded-2xl bg-[#F5DA20] p-1 shadow-lg">
              <video
                src="/logo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover rounded-xl"
              />
            </div>
            <div className="text-xl font-black tracking-tight text-white">
              English <span className="text-[#F5DA20]">Nerd</span>
            </div>
          </Link>

          {/* CENTER: desktop nav */}
          <nav className="hidden min-[1100px]:flex flex-1 items-center justify-center gap-5 text-[16px] font-semibold">

            {/* Grammar */}
            <div className="group relative">
              <Link href="/grammar/a1" className={navItemClass("Grammar")}>Grammar</Link>
              <DropdownShell width="w-80">
                <div className="flex flex-col gap-1.5">
                  {grammarLevels.map(({ lvl, label, color, textColor, lessons }) => (
                    <a
                      key={lvl}
                      href={`/grammar/${lvl.toLowerCase()}`}
                      className="group/btn flex w-full items-center gap-3.5 rounded-2xl px-3 py-2.5 text-white/80 transition hover:bg-white/8 hover:text-white"
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color} ${textColor} text-sm font-black tracking-tight shadow-sm`}>
                        {lvl}
                      </span>
                      <span className="flex flex-1 flex-col leading-tight">
                        <span className="text-sm font-extrabold text-white">{label}</span>
                        <span className="text-xs text-white/40 group-hover/btn:text-white/55">{lessons} lessons</span>
                      </span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0 text-white/20 transition group-hover/btn:text-white/60">
                        <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  ))}
                </div>
              </DropdownShell>
            </div>

            {/* Tenses */}
            <div className="group relative">
              <Link href="/tenses" className={navItemClass("Tenses")}>Tenses</Link>
              <DropdownShell width="w-96">
                <div className="flex max-h-[480px] flex-col gap-0.5 overflow-y-auto pr-1">
                  {tensesList.map(({ slug, title, level, color, textColor }) => (
                    <Link
                      key={slug}
                      href={`/tenses/${slug}`}
                      className="group/btn flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-white/80 transition hover:bg-white/8 hover:text-white"
                    >
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color} ${textColor} text-[10px] font-black tracking-tight shadow-sm`}>
                        {level}
                      </span>
                      <span className="flex-1 text-sm font-semibold leading-tight">{title}</span>
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0 text-white/15 transition group-hover/btn:text-white/50">
                        <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  ))}
                </div>
              </DropdownShell>
            </div>

            {/* Vocabulary */}
            <div className="group relative">
              <Link href="/vocabulary" className={navItemClass("Vocabulary")}>Vocabulary</Link>
              <DropdownShell width="w-72">
                <div className="flex flex-col gap-1.5">
                  {grammarLevels.map(({ lvl, label, color, textColor }) => (
                    <a
                      key={lvl}
                      href={`/vocabulary/${lvl.toLowerCase()}`}
                      className="group/btn flex w-full items-center gap-3.5 rounded-2xl px-3 py-2.5 text-white/80 transition hover:bg-white/8 hover:text-white"
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color} ${textColor} text-sm font-black tracking-tight shadow-sm`}>
                        {lvl}
                      </span>
                      <span className="flex flex-1 flex-col leading-tight">
                        <span className="text-sm font-extrabold text-white">{label}</span>
                      </span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0 text-white/20 transition group-hover/btn:text-white/60">
                        <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  ))}
                </div>
              </DropdownShell>
            </div>

            {/* Listening */}
            <div className="group relative">
              <Link href="/listening" className={navItemClass("Listening")}>Listening</Link>
              <DropdownShell width="w-72">
                <div className="flex flex-col gap-1.5">
                  {grammarLevels.map(({ lvl, label, color, textColor }) => (
                    <a
                      key={lvl}
                      href={`/listening/${lvl.toLowerCase()}`}
                      className="group/btn flex w-full items-center gap-3.5 rounded-2xl px-3 py-2.5 text-white/80 transition hover:bg-white/8 hover:text-white"
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color} ${textColor} text-sm font-black tracking-tight shadow-sm`}>
                        {lvl}
                      </span>
                      <span className="flex flex-1 flex-col leading-tight">
                        <span className="text-sm font-extrabold text-white">{label}</span>
                      </span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0 text-white/20 transition group-hover/btn:text-white/60">
                        <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  ))}
                </div>
              </DropdownShell>
            </div>

            {/* Reading */}
            <div className="group relative">
              <Link href="/reading" className={navItemClass("Reading")}>Reading</Link>
              <DropdownShell width="w-72">
                <div className="flex flex-col gap-1.5">
                  {grammarLevels.map(({ lvl, label, color, textColor }) => (
                    <a
                      key={lvl}
                      href={`/reading/${lvl.toLowerCase()}`}
                      className="group/btn flex w-full items-center gap-3.5 rounded-2xl px-3 py-2.5 text-white/80 transition hover:bg-white/8 hover:text-white"
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color} ${textColor} text-sm font-black tracking-tight shadow-sm`}>
                        {lvl}
                      </span>
                      <span className="flex flex-1 flex-col leading-tight">
                        <span className="text-sm font-extrabold text-white">{label}</span>
                      </span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0 text-white/20 transition group-hover/btn:text-white/60">
                        <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  ))}
                </div>
              </DropdownShell>
            </div>

            {/* Tests */}
            <div className="group relative">
              <Link href="/tests" className={navItemClass("Tests")}>Tests</Link>
              <DropdownShell width="w-72">
                <div className="flex flex-col gap-1.5">
                  <Link href="/tests/grammar" className="group/btn flex items-center gap-3.5 rounded-2xl px-3 py-2.5 text-white/80 transition hover:bg-white/8 hover:text-white">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="1.8"/>
                        <path d="M7 8h10M7 12h10M7 16h6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                        <circle cx="19" cy="16" r="3.5" fill="white"/>
                        <path d="M17.5 16l1 1.2 2-2" stroke="#2563eb" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="flex flex-1 flex-col leading-tight">
                      <span className="text-sm font-extrabold text-white">Grammar test</span>
                      <span className="text-xs text-white/40 group-hover/btn:text-white/55">A1 → C1 · 60 questions</span>
                    </span>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0 text-white/15 transition group-hover/btn:text-white/50">
                      <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>

                  <Link href="/tests/vocabulary" className="group/btn flex items-center gap-3.5 rounded-2xl px-3 py-2.5 text-white/80 transition hover:bg-white/8 hover:text-white">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F5DA20] to-amber-400 shadow-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M4 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" stroke="black" strokeWidth="1.8" strokeLinejoin="round"/>
                        <path d="M17 7h1.5A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5H17" stroke="black" strokeWidth="1.8" strokeLinecap="round"/>
                        <path d="M7 8h7M7 12h7M7 16h4" stroke="black" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <span className="flex flex-1 flex-col leading-tight">
                      <span className="text-sm font-extrabold text-white">Vocabulary test</span>
                      <span className="text-xs text-white/40 group-hover/btn:text-white/55">A1 → C2 · 90 words</span>
                    </span>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0 text-white/15 transition group-hover/btn:text-white/50">
                      <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>

                  <Link href="/tests/tenses" className="group/btn flex items-center gap-3.5 rounded-2xl px-3 py-2.5 text-white/80 transition hover:bg-white/8 hover:text-white">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 shadow-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8"/>
                        <path d="M12 7v5l3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 12h1.5M19.5 12H21M12 3v1.5M12 19.5V21" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <span className="flex flex-1 flex-col leading-tight">
                      <span className="text-sm font-extrabold text-white">Tenses test</span>
                      <span className="text-xs text-white/40 group-hover/btn:text-white/55">A1 → C1 · 34 questions</span>
                    </span>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0 text-white/15 transition group-hover/btn:text-white/50">
                      <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </DropdownShell>
            </div>
            {/* Nerd Zone */}
            <Link href="/nerd-zone" className={`relative pb-0.5 transition ${isActive("NerdZone") ? "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-[#F5DA20]" : ""} group`}>
              <span className="text-[#F5DA20] transition">Nerd</span>{" "}
              <span className="text-white transition">Zone</span>
            </Link>

          </nav>

          {/* RIGHT: desktop search + CTA */}
          <div className="hidden min-[1100px]:flex items-center gap-3">
            <HeaderSearch />
            <AuthButton
              variant="avatar"
              className="inline-flex items-center justify-center rounded-xl bg-[#F5DA20] px-4 py-2 text-sm font-bold text-black hover:opacity-90"
            />
          </div>

          {/* Mobile right: search + hamburger */}
          <div className="flex min-[1100px]:hidden items-center gap-2">
            <button
              type="button"
              aria-label="Search"
              onClick={() => { setMobileSearchOpen((v) => !v); setMenuOpen(false); }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => { setMenuOpen((v) => !v); setMobileSearchOpen(false); }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
                  <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar (below header) */}
        {mobileSearchOpen && (
          <div className="min-[1100px]:hidden border-t border-white/10 px-4 py-3">
            <MobileSearch onClose={() => setMobileSearchOpen(false)} />
          </div>
        )}
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm min-[1100px]:hidden"
          onClick={closeAll}
          aria-hidden="true"
        />
      )}

      {/* Slide-in drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[300px] bg-[#0E0F13] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out min-[1100px]:hidden overflow-y-auto ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <span className="text-base font-black text-white">
            English <span className="text-[#F5DA20]">Nerd</span>
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeAll}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Drawer nav */}
        <nav className="px-3 py-4 flex flex-col gap-1">
          <MobileAccordion label="Grammar" isOpen={expandedSection === "Grammar"} onToggle={() => toggleSection("Grammar")}>
            {grammarLevels.map(({ lvl, label, color, textColor, lessons }) => (
              <Link key={lvl} href={`/grammar/${lvl.toLowerCase()}`} onClick={closeAll}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/80 hover:bg-white/10 hover:text-white">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color} ${textColor} text-xs font-black shadow-sm`}>{lvl}</span>
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-extrabold text-white">{lvl} — {label}</span>
                  <span className="text-xs text-white/40">{lessons} lessons</span>
                </span>
              </Link>
            ))}
          </MobileAccordion>

          <MobileAccordion label="Tenses" isOpen={expandedSection === "Tenses"} onToggle={() => toggleSection("Tenses")}>
            {tensesList.map(({ slug, title, level, color, textColor }) => (
              <Link key={slug} href={`/tenses/${slug}`} onClick={closeAll}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/80 hover:bg-white/10 hover:text-white">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color} ${textColor} text-[10px] font-black shadow-sm`}>{level}</span>
                <span className="text-sm font-semibold text-white">{title}</span>
              </Link>
            ))}
          </MobileAccordion>

          {(["Vocabulary", "Listening", "Reading"] as const).map((section) => (
            <MobileAccordion key={section} label={section} isOpen={expandedSection === section} onToggle={() => toggleSection(section)}>
              {grammarLevels.map(({ lvl, label, color, textColor }) => (
                <Link key={lvl} href={`/${section.toLowerCase()}/${lvl.toLowerCase()}`} onClick={closeAll}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/80 hover:bg-white/10 hover:text-white">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color} ${textColor} text-xs font-black shadow-sm`}>{lvl}</span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-sm font-extrabold text-white">{lvl} — {label}</span>
                  </span>
                </Link>
              ))}
            </MobileAccordion>
          ))}

          <Link href="/nerd-zone" onClick={closeAll}
            className={`group flex items-center rounded-xl px-4 py-3 text-[15px] font-semibold hover:bg-white/10 ${isActive("NerdZone") ? "bg-white/5" : ""}`}>
            <span className="text-[#F5DA20] transition">Nerd</span>
            <span className="text-white transition">&nbsp;Zone</span>
          </Link>

          <MobileAccordion label="Tests" isOpen={expandedSection === "Tests"} onToggle={() => toggleSection("Tests")}>
            <Link href="/tests/grammar" onClick={closeAll}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/80 hover:bg-white/10 hover:text-white">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" stroke="white" strokeWidth="1.8"/><path d="M7 8h10M7 12h10M7 16h6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/><circle cx="19" cy="16" r="3.5" fill="white"/><path d="M17.5 16l1 1.2 2-2" stroke="#2563eb" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-extrabold text-white">Grammar test</span>
                <span className="text-xs text-white/40">A1 → C1 · 60 questions</span>
              </span>
            </Link>
            <Link href="/tests/vocabulary" onClick={closeAll}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/80 hover:bg-white/10 hover:text-white">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#F5DA20] to-amber-400 shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" stroke="black" strokeWidth="1.8" strokeLinejoin="round"/><path d="M17 7h1.5A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5H17" stroke="black" strokeWidth="1.8" strokeLinecap="round"/><path d="M7 8h7M7 12h7M7 16h4" stroke="black" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-extrabold text-white">Vocabulary test</span>
                <span className="text-xs text-white/40">A1 → C2 · 90 words</span>
              </span>
            </Link>
            <Link href="/tests/tenses" onClick={closeAll}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/80 hover:bg-white/10 hover:text-white">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8"/><path d="M12 7v5l3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 12h1.5M19.5 12H21M12 3v1.5M12 19.5V21" stroke="white" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-extrabold text-white">Tenses test</span>
                <span className="text-xs text-white/40">A1 → C1 · 34 questions</span>
              </span>
            </Link>
          </MobileAccordion>

          <div className="pt-4 px-1">
            <AuthButton className="flex w-full items-center justify-center rounded-xl bg-[#F5DA20] px-4 py-3 text-sm font-bold text-black hover:opacity-90" />
          </div>
        </nav>
      </div>
    </>
  );
}
