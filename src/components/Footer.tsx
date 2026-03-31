export default function Footer() {
  return (
    <footer className="border-t border-white/8 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Top: brand + nav columns spread full width */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-5">

          {/* Brand — takes 2 cols on mobile, 1 on sm+ */}
          <div className="col-span-2 sm:col-span-1">
            <a href="/" className="text-base font-black text-white hover:text-[#F5DA20] transition">
              English <span className="text-[#F5DA20]">Nerd</span>
            </a>
            <p className="mt-2 text-sm text-white/35 leading-relaxed">
              Modern English learning. Free forever.
            </p>
          </div>

          {/* Grammar */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/25">Grammar</span>
            <a href="/grammar/a1" className="text-sm text-white/50 hover:text-white transition">A1 — Beginner</a>
            <a href="/grammar/a2" className="text-sm text-white/50 hover:text-white transition">A2 — Elementary</a>
            <a href="/grammar/b1" className="text-sm text-white/50 hover:text-white transition">B1 — Intermediate</a>
            <a href="/grammar/b2" className="text-sm text-white/50 hover:text-white transition">B2 — Upper-Int.</a>
            <a href="/grammar/c1" className="text-sm text-white/50 hover:text-white transition">C1 — Advanced</a>
          </div>

          {/* Tenses */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/25">Tenses</span>
            <a href="/tenses/present-simple" className="text-sm text-white/50 hover:text-white transition">Present Simple</a>
            <a href="/tenses/past-simple" className="text-sm text-white/50 hover:text-white transition">Past Simple</a>
            <a href="/tenses/present-perfect" className="text-sm text-white/50 hover:text-white transition">Present Perfect</a>
            <a href="/tenses/future-simple" className="text-sm text-white/50 hover:text-white transition">Future Simple</a>
            <a href="/tenses" className="text-sm text-[#F5DA20]/50 hover:text-[#F5DA20] transition">All 12 tenses →</a>
          </div>

          {/* Tests */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/25">Tests</span>
            <a href="/tests/grammar" className="text-sm text-white/50 hover:text-white transition">Grammar test</a>
            <a href="/tests/vocabulary" className="text-sm text-white/50 hover:text-white transition">Vocabulary test</a>
            <a href="/tests/tenses" className="text-sm text-white/50 hover:text-white transition">Tenses test</a>
          </div>

          {/* Learn */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/25">Learn</span>
            <a href="/vocabulary" className="text-sm text-white/50 hover:text-white transition">Vocabulary</a>
            <a href="/listening" className="text-sm text-white/50 hover:text-white transition">Listening</a>
            <a href="/reading" className="text-sm text-white/50 hover:text-white transition">Reading</a>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-white/6 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-xs text-white/20">© 2026 English Nerd. All rights reserved.</span>
          <div className="flex flex-wrap gap-5 text-xs text-white/35">
            <a href="/about" className="hover:text-white transition">About</a>
            <a href="/contact" className="hover:text-white transition">Contact</a>
            <a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
