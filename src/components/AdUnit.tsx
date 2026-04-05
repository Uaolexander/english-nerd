"use client";

import { useIsPro } from "@/lib/ProContext";
import { useIsStudent } from "@/lib/StudentContext";
import { useIsTeacher } from "@/lib/TeacherContext";

type Variant =
  | "sidebar-dark"
  | "sidebar-light"
  | "sidebar-account"
  | "sidebar-test"
  | "mobile-dark"
  | "inline-light";

/* ── Shared feature list ─────────────────────────────────────────────────── */
const FEATURES = [
  "SpeedRound on every lesson",
  "PDF worksheets & answer keys",
  "Progress dashboard",
  "Ad-free experience",
];

/* ── Dark sidebar (grammar / tenses pages) ───────────────────────────────── */
function SidebarDark() {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        <a href="/pro" className="group block rounded-2xl overflow-hidden border border-[#F5DA20]/20 bg-gradient-to-b from-[#F5DA20]/10 to-[#0B0B0D] p-6 transition hover:border-[#F5DA20]/40">
          {/* Top accent */}
          <div className="h-1 w-full rounded-full bg-gradient-to-r from-[#F5DA20] via-amber-400 to-[#F5DA20] mb-5" />

          {/* Crown */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5DA20]/15 border border-[#F5DA20]/25">
            <span className="text-2xl">👑</span>
          </div>

          <p className="text-[10px] font-black uppercase tracking-widest text-[#F5DA20]/60 mb-1">Upgrade</p>
          <h3 className="text-lg font-black text-white leading-tight mb-1">Go PRO.<br/>Learn faster.</h3>
          <p className="text-xs text-white/40 mb-5">Everything unlocked, no limits.</p>

          {/* Features */}
          <ul className="space-y-2.5 mb-6">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-white/55">
                <svg className="h-3.5 w-3.5 shrink-0 text-[#F5DA20]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          {/* Price + CTA */}
          <div className="mb-4">
            <div className="flex items-end gap-1">
              <span className="text-3xl font-black text-white">$2.50</span>
              <span className="mb-1 text-xs text-white/35">/ mo</span>
            </div>
            <p className="text-[10px] text-white/30">Billed as $29.99/year</p>
          </div>

          <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5DA20] py-3 text-sm font-black text-black transition group-hover:bg-[#ffe033]">
            Get PRO →
          </div>

          <p className="mt-3 text-center text-[10px] text-white/20">🛡 7-day money-back guarantee</p>
        </a>
      </div>
    </aside>
  );
}

/* ── Light sidebar (vocabulary pages) ───────────────────────────────────── */
function SidebarLight() {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        <a href="/pro" className="group block rounded-2xl overflow-hidden border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-6 transition hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100">
          {/* Top accent */}
          <div className="h-1 w-full rounded-full bg-gradient-to-r from-[#F5DA20] via-amber-400 to-[#F5DA20] mb-5" />

          {/* Crown */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 border border-amber-200">
            <span className="text-2xl">👑</span>
          </div>

          <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Upgrade to PRO</p>
          <h3 className="text-lg font-black text-slate-800 leading-tight mb-1">Learn smarter.<br/>No limits.</h3>
          <p className="text-xs text-slate-400 mb-5">Everything unlocked from day one.</p>

          {/* Features */}
          <ul className="space-y-2.5 mb-6">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-slate-500">
                <svg className="h-3.5 w-3.5 shrink-0 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          {/* Price + CTA */}
          <div className="mb-4">
            <div className="flex items-end gap-1">
              <span className="text-3xl font-black text-slate-800">$2.50</span>
              <span className="mb-1 text-xs text-slate-400">/ mo</span>
            </div>
            <p className="text-[10px] text-slate-400">Billed as $29.99/year · Save 50%</p>
          </div>

          <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5DA20] py-3 text-sm font-black text-black transition group-hover:bg-[#ffe033]">
            Get PRO →
          </div>

          <p className="mt-3 text-center text-[10px] text-slate-300">🛡 7-day money-back guarantee</p>
        </a>
      </div>
    </aside>
  );
}

/* ── Account sidebar ─────────────────────────────────────────────────────── */
function SidebarAccount() {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24">
        <a href="/pro" className="group block rounded-2xl overflow-hidden border border-amber-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-amber-300">
          <div className="h-1 w-full rounded-full bg-gradient-to-r from-[#F5DA20] via-amber-400 to-[#F5DA20] mb-4" />

          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-100">
            <span className="text-xl">👑</span>
          </div>

          <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-0.5">PRO Plan</p>
          <h3 className="text-base font-black text-slate-800 mb-1">Unlock everything</h3>
          <p className="text-xs text-slate-400 mb-4">SpeedRound, PDFs, certificates & more.</p>

          <ul className="space-y-2 mb-5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-slate-500">
                <svg className="h-3 w-3 shrink-0 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          <div className="mb-3">
            <span className="text-2xl font-black text-slate-800">$2.50</span>
            <span className="text-xs text-slate-400"> / mo · $29.99/yr</span>
          </div>

          <div className="flex w-full items-center justify-center rounded-xl bg-[#F5DA20] py-2.5 text-sm font-black text-black transition group-hover:bg-[#ffe033]">
            Upgrade to PRO →
          </div>
        </a>
      </div>
    </aside>
  );
}

/* ── Test sidebar ────────────────────────────────────────────────────────── */
function SidebarTest() {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        <a href="/pro" className="group block rounded-2xl overflow-hidden border border-black/10 bg-white/80 backdrop-blur p-6 transition hover:shadow-lg hover:border-amber-300">
          <div className="h-1 w-full rounded-full bg-gradient-to-r from-[#F5DA20] via-amber-400 to-[#F5DA20] mb-5" />

          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 border border-amber-100">
            <span className="text-xl">👑</span>
          </div>

          <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Go PRO</p>
          <h3 className="text-base font-black text-slate-800 mb-1">Smarter learning,<br/>zero ads.</h3>
          <p className="text-xs text-slate-400 mb-5">PDF worksheets, SpeedRound & more.</p>

          <ul className="space-y-2 mb-5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-slate-500">
                <svg className="h-3 w-3 shrink-0 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          <div className="mb-4">
            <span className="text-2xl font-black text-slate-800">$2.50</span>
            <span className="text-xs text-slate-400"> / mo</span>
            <p className="text-[10px] text-slate-300 mt-0.5">Billed as $29.99/year</p>
          </div>

          <div className="flex w-full items-center justify-center rounded-xl bg-[#F5DA20] py-3 text-sm font-black text-black transition group-hover:bg-[#ffe033]">
            Get PRO →
          </div>
        </a>
      </div>
    </aside>
  );
}

/* ── Mobile banner (320×90) ──────────────────────────────────────────────── */
function MobileDark() {
  return (
    <div className="mt-8 lg:hidden">
      <a href="/pro" className="group flex items-center gap-4 rounded-2xl border border-[#F5DA20]/20 bg-gradient-to-r from-[#F5DA20]/10 to-transparent px-5 py-4 transition hover:border-[#F5DA20]/40">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5DA20]/15 border border-[#F5DA20]/25">
          <span className="text-xl">👑</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-white leading-tight">Go PRO — $2.50/mo</p>
          <p className="text-xs text-white/40 truncate">SpeedRound · PDFs · Ad-free</p>
        </div>
        <div className="shrink-0 rounded-lg bg-[#F5DA20] px-3 py-2 text-xs font-black text-black transition group-hover:bg-[#ffe033]">
          Upgrade →
        </div>
      </a>
    </div>
  );
}

/* ── Inline light (300×250, nerd-zone / reading) ─────────────────────────── */
function InlineLight() {
  return (
    <a href="/pro" className="group block rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 transition hover:shadow-lg hover:border-amber-300">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 border border-amber-200">
          <span className="text-2xl">👑</span>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">PRO Plan</p>
          <h3 className="text-base font-black text-slate-800 leading-tight">Unlock the full<br/>English Nerd experience</h3>
        </div>
      </div>

      <ul className="space-y-2 mb-5">
        {FEATURES.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-slate-500">
            <svg className="h-3 w-3 shrink-0 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-xl font-black text-slate-800">$2.50</span>
          <span className="text-xs text-slate-400"> / mo · $29.99/yr</span>
        </div>
        <div className="rounded-xl bg-[#F5DA20] px-4 py-2 text-sm font-black text-black transition group-hover:bg-[#ffe033]">
          Get PRO →
        </div>
      </div>
    </a>
  );
}

/* ── Main export ─────────────────────────────────────────────────────────── */
export default function AdUnit({ variant }: { variant: Variant }) {
  const isPro = useIsPro();
  const isStudent = useIsStudent();
  const isTeacher = useIsTeacher();

  // PRO, Teacher, and Student users see no ads
  if (isPro || isStudent || isTeacher) {
    if (variant === "sidebar-dark" || variant === "sidebar-light" || variant === "sidebar-test" || variant === "sidebar-account") {
      return <aside className="hidden lg:block" aria-hidden />;
    }
    return null;
  }

  if (variant === "sidebar-dark")    return <SidebarDark />;
  if (variant === "sidebar-light")   return <SidebarLight />;
  if (variant === "sidebar-account") return <SidebarAccount />;
  if (variant === "sidebar-test")    return <SidebarTest />;
  if (variant === "mobile-dark")     return <MobileDark />;
  if (variant === "inline-light")    return <InlineLight />;

  return null;
}
