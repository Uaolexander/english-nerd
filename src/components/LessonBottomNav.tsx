interface LessonBottomNavProps {
  backHref: string;
  backLabel: string;
  nextHref?: string;
  nextLabel?: string;
  nextDescription?: string;
}

export default function LessonBottomNav({
  backHref,
  backLabel,
  nextHref,
  nextLabel,
  nextDescription,
}: LessonBottomNavProps) {
  return (
    <div className="mt-12 border-t border-black/8 pt-8">
      <div className="flex items-stretch justify-between gap-4">

        {/* Back */}
        <a
          href={backHref}
          className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-black/5 hover:text-slate-900"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {backLabel}
        </a>

        {/* Next */}
        {nextHref && (
          <a
            href={nextHref}
            className="group flex items-center gap-4 rounded-2xl bg-[#F5DA20] px-6 py-3 text-black transition hover:opacity-90 shadow-md shadow-[#F5DA20]/20"
          >
            <div className="text-right">
              <div className="text-[11px] font-bold uppercase tracking-widest text-black/40">Up next</div>
              <div className="text-sm font-black leading-tight">{nextLabel}</div>
              {nextDescription && (
                <div className="text-[11px] text-black/50 mt-0.5">{nextDescription}</div>
              )}
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        )}

      </div>
    </div>
  );
}
