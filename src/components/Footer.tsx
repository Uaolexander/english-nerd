"use client";

import { useIsPro } from "@/lib/ProContext";

export default function Footer() {
  const isPro = useIsPro();

  return (
    <footer className="border-t border-white/8 bg-[#0B0B0D] px-6 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Pro banner — hidden for Pro users */}
        {!isPro && (
        <div className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/4 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <svg className="h-3.5 w-3.5 shrink-0 text-[#F5DA20]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <p className="text-xs text-white/40">No ads · Progress dashboard · Certificates · Priority access</p>
          </div>
          <a
            href="/pro"
            className="shrink-0 rounded-lg border border-[#F5DA20]/30 px-3.5 py-1.5 text-xs font-black text-[#F5DA20] transition hover:bg-[#F5DA20]/10"
          >
            Upgrade to Pro
          </a>
        </div>
        )}

        {/* Top: brand + nav columns spread full width */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-5">

          {/* Brand — takes 2 cols on mobile, 1 on sm+ */}
          <div className="col-span-2 sm:col-span-1">
            <a href="/" className="text-base font-black text-white hover:text-[#F5DA20] transition">
              English <span className="text-[#F5DA20]">Nerd</span>
            </a>
            <p className="mt-2 text-sm text-white/35 leading-relaxed">
              Modern English learning.
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
            <a href="https://www.teacherspayteachers.com/store/english-nerd-ua" target="_blank" rel="noopener noreferrer" className="text-sm text-[#F5DA20]/50 hover:text-[#F5DA20] transition">Shop on TPT →</a>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-white/6 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span className="text-xs text-white/20">© 2026 English Nerd. All rights reserved.</span>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {/* Pinterest */}
            <a href="https://pin.it/1QIuVSaoc" target="_blank" rel="noopener noreferrer" aria-label="Pinterest"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 hover:text-white transition hover:bg-white/8">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/englishnerd.cc?igsh=ZW05djBvZGVxYzBv&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 hover:text-white transition hover:bg-white/8">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
            {/* Threads */}
            <a href="https://www.threads.com/@englishnerd.cc?igshid=NTc4MTIwNjQ2YQ==" target="_blank" rel="noopener noreferrer" aria-label="Threads"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 hover:text-white transition hover:bg-white/8">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <circle cx="12" cy="12" r="4"/>
                <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>
              </svg>
            </a>
            {/* Telegram */}
            <a href="https://t.me/englishnerd" target="_blank" rel="noopener noreferrer" aria-label="Telegram"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 hover:text-white transition hover:bg-white/8">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
          </div>

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
