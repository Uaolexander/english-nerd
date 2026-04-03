"use client";

import { useIsPro } from "@/lib/ProContext";

/**
 * Ad placeholder component. Renders nothing for Pro users.
 *
 * variant:
 *  "sidebar-dark"   — 300×600, dark-glass style (grammar / tenses pages)
 *  "sidebar-light"  — 300×600, light style (vocabulary level pages)
 *  "sidebar-account"— 300×600, white card style (account / dashboard)
 *  "sidebar-test"   — 300×600, light-glass style (test pages)
 *  "mobile-dark"    — 320×90 banner shown only on mobile (grammar / tenses)
 *  "inline-light"   — 300×250 inline (vocabulary right column)
 */
type Variant =
  | "sidebar-dark"
  | "sidebar-light"
  | "sidebar-account"
  | "sidebar-test"
  | "mobile-dark"
  | "inline-light";

export default function AdUnit({ variant }: { variant: Variant }) {
  const isPro = useIsPro();

  // Pro users: for sidebar variants preserve the grid cell (empty aside),
  // for non-sidebar variants render nothing.
  if (isPro) {
    // sidebar-dark / sidebar-light: preserve 3-column lg grid so center section stays centred
    if (variant === "sidebar-dark" || variant === "sidebar-light") {
      return <aside className="hidden lg:block" aria-hidden />;
    }
    // All other variants: render nothing — consuming component adjusts its own grid
    return null;
  }

  if (variant === "sidebar-dark") {
    return (
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
          <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
          <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">
            300 × 600
          </div>
        </div>
      </aside>
    );
  }

  if (variant === "sidebar-light") {
    return (
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
            Advertisement
          </p>
          <div className="flex h-[600px] items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-xs text-slate-300">
            300 × 600
          </div>
        </div>
      </aside>
    );
  }

  if (variant === "sidebar-account") {
    return (
      <aside className="hidden xl:block">
        <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-3.5">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-300">
            Advertisement
          </p>
          <div className="flex h-[600px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-300">
            300 × 600
          </div>
        </div>
      </aside>
    );
  }

  if (variant === "sidebar-test") {
    return (
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/70 backdrop-blur p-4">
          <div className="text-xs font-semibold text-black/35">ADVERTISEMENT</div>
          <div className="mt-3 h-[600px] rounded-xl border border-black/8 bg-black/[0.02] flex items-center justify-center text-black/25 text-sm">
            300 × 600
          </div>
        </div>
      </aside>
    );
  }

  if (variant === "mobile-dark") {
    return (
      <div className="mt-8 lg:hidden rounded-2xl border border-black/10 bg-white/60 p-4">
        <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
        <div className="mt-3 h-[90px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">
          320 × 90
        </div>
      </div>
    );
  }

  if (variant === "inline-light") {
    return (
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
          Advertisement
        </p>
        <div className="flex h-[250px] items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-xs text-slate-300">
          300 × 250
        </div>
      </div>
    );
  }

  return null;
}
