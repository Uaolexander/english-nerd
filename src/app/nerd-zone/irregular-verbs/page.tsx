import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Irregular Verbs — Nerd Zone — English Nerd",
  description:
    "Top 50 essential irregular verb forms. Know these and you'll handle almost any English text.",
  alternates: { canonical: "/nerd-zone/irregular-verbs" },
};

const VERBS: [string, string, string][] = [
  ["be",         "was / were",       "been"],
  ["begin",      "began",            "begun"],
  ["break",      "broke",            "broken"],
  ["bring",      "brought",          "brought"],
  ["build",      "built",            "built"],
  ["buy",        "bought",           "bought"],
  ["catch",      "caught",           "caught"],
  ["choose",     "chose",            "chosen"],
  ["come",       "came",             "come"],
  ["do",         "did",              "done"],
  ["drink",      "drank",            "drunk"],
  ["eat",        "ate",              "eaten"],
  ["fall",       "fell",             "fallen"],
  ["feel",       "felt",             "felt"],
  ["find",       "found",            "found"],
  ["fly",        "flew",             "flown"],
  ["forget",     "forgot",           "forgotten"],
  ["get",        "got",              "gotten"],
  ["give",       "gave",             "given"],
  ["go",         "went",             "gone"],
  ["have",       "had",              "had"],
  ["hear",       "heard",            "heard"],
  ["keep",       "kept",             "kept"],
  ["know",       "knew",             "known"],
  ["learn",      "learned / learnt", "learned / learnt"],
  ["leave",      "left",             "left"],
  ["lose",       "lost",             "lost"],
  ["make",       "made",             "made"],
  ["meet",       "met",              "met"],
  ["pay",        "paid",             "paid"],
  ["put",        "put",              "put"],
  ["read",       "read",             "read"],
  ["run",        "ran",              "run"],
  ["say",        "said",             "said"],
  ["see",        "saw",              "seen"],
  ["sell",       "sold",             "sold"],
  ["send",       "sent",             "sent"],
  ["sit",        "sat",              "sat"],
  ["sleep",      "slept",            "slept"],
  ["speak",      "spoke",            "spoken"],
  ["spend",      "spent",            "spent"],
  ["stand",      "stood",            "stood"],
  ["take",       "took",             "taken"],
  ["teach",      "taught",           "taught"],
  ["tell",       "told",             "told"],
  ["think",      "thought",          "thought"],
  ["understand", "understood",       "understood"],
  ["wear",       "wore",             "worn"],
  ["win",        "won",              "won"],
  ["write",      "wrote",            "written"],
];

export default async function IrregularVerbsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          {[["Home", "/"], ["Nerd Zone", "/nerd-zone"]].map(([label, href]) => (
            <span key={href} className="flex items-center gap-1.5">
              <a href={href} className="hover:text-slate-700 transition">{label}</a>
              <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          ))}
          <span className="text-slate-700 font-medium">Irregular Verbs</span>
        </nav>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="mt-6 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">

          {/* Left */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-full bg-sky-100 px-3 py-0.5 text-[11px] font-black text-sky-700">Grammar</span>
              <span className="rounded-full bg-[#F5DA20] px-3 py-0.5 text-[11px] font-black text-black">Top 50</span>
              <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">All levels</span>
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
              Irregular{" "}
              <span className="relative inline-block">
                Verbs
                <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
              </span>
            </h1>

            <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
              The 50 most essential verb forms in English. Master these and you&apos;ll understand almost any sentence you read or hear.
            </p>

            {/* Stats — color-coded for each column */}
            <div className="mt-6 flex flex-wrap gap-2">
              <div className="flex items-center gap-2.5 rounded-xl bg-white border border-slate-200 px-4 py-2.5 shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <span className="text-sm font-black text-slate-900">Base form</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-black text-emerald-800">Past Simple</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-sky-50 border border-sky-200 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                <span className="text-sm font-black text-sky-800">Past Participle</span>
              </div>
            </div>

            {/* Download */}
            <div className="mt-6">
              {isLoggedIn ? (
                <a
                  href="/api/materials/download?slug=irregular-verbs-50"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-[#F5DA20] px-6 py-3.5 text-sm font-black text-black shadow-md hover:opacity-90 transition"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3v13M5 14l7 7 7-7"/><path d="M3 21h18"/></svg>
                  Download PDF
                </a>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <a
                    href="/login?next=/nerd-zone/irregular-verbs"
                    className="inline-flex items-center gap-2.5 rounded-2xl bg-[#F5DA20] px-6 py-3.5 text-sm font-black text-black shadow-md hover:opacity-90 transition"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Log in to download PDF
                  </a>
                  <a
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm"
                  >
                    Create free account
                  </a>
                </div>
              )}
              <p className="mt-2 text-xs text-slate-400">Free for all registered users · PDF · 4 pages</p>
            </div>
          </div>

          {/* Right: cover image */}
          <div className="shrink-0 self-start">
            <div className="relative w-[190px]">
              {/* Shadow card behind */}
              <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-2xl bg-[#F5DA20]/30" />
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/topics/nerd-zone/irregular-verbs-50.jpg"
                  alt="Irregular Verbs PDF cover"
                  style={{ aspectRatio: "210/297" }}
                  className="w-full object-cover"
                />
              </div>
              <div className="mt-2.5 flex items-center justify-center gap-1.5">
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-500">PDF</span>
                <span className="text-[10px] text-slate-400">A4 · Printable</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Table ─────────────────────────────────────────────────────── */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Sticky header */}
          <div className="sticky top-0 z-10 grid grid-cols-[2.5rem_1fr_1fr_1fr] gap-0 border-b-2 border-slate-200 bg-white">
            <div className="px-4 py-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">#</span>
            </div>
            <div className="flex items-center gap-2 border-l border-slate-100 px-4 py-4">
              <span className="h-2 w-2 rounded-full bg-slate-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Base form</span>
            </div>
            <div className="flex items-center gap-2 border-l border-emerald-100 bg-emerald-50/60 px-4 py-4">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Past Simple</span>
            </div>
            <div className="flex items-center gap-2 border-l border-sky-100 bg-sky-50/60 px-4 py-4">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-700">Past Participle</span>
            </div>
          </div>

          {/* Rows */}
          <div>
            {VERBS.map(([base, past, participle], i) => (
              <div
                key={base}
                className={`group grid grid-cols-[2.5rem_1fr_1fr_1fr] gap-0 border-b border-slate-50 transition-colors hover:bg-[#F5DA20]/8 last:border-0 ${
                  i % 2 === 1 ? "bg-slate-50/40" : "bg-white"
                }`}
              >
                {/* Number */}
                <div className="flex items-center px-4 py-3.5">
                  <span className="text-[11px] font-bold text-slate-300 group-hover:text-slate-400">{i + 1}</span>
                </div>

                {/* Base form */}
                <div className="flex items-center border-l border-slate-50 px-4 py-3.5 group-hover:border-[#F5DA20]/20">
                  <span className="text-sm font-black text-slate-900">{base}</span>
                </div>

                {/* Past Simple */}
                <div className="flex items-center border-l border-emerald-50 bg-emerald-50/30 px-4 py-3.5 group-hover:bg-emerald-50/60">
                  <span className="inline-flex rounded-lg bg-emerald-100 px-2.5 py-1 text-sm font-semibold text-emerald-800">
                    {past}
                  </span>
                </div>

                {/* Past Participle */}
                <div className="flex items-center border-l border-sky-50 bg-sky-50/30 px-4 py-3.5 group-hover:bg-sky-50/60">
                  <span className="inline-flex rounded-lg bg-sky-100 px-2.5 py-1 text-sm font-semibold text-sky-800">
                    {participle}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Table footer */}
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">50 irregular verbs · sorted alphabetically</span>
            {isLoggedIn && (
              <a
                href="/api/materials/download?slug=irregular-verbs-50"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#F5DA20] px-3 py-1.5 text-xs font-black text-black hover:opacity-90 transition"
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3v13M5 14l7 7 7-7"/><path d="M3 21h18"/></svg>
                Download PDF
              </a>
            )}
          </div>
        </div>

        {/* ── Tip ─────────────────────────────────────────────────────── */}
        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">
            💡
          </div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">
              Don&apos;t try to memorise all 50 at once. Start with the top 20 — <em>be, go, have, do, make, say, get, come, know, take, give, find, think, see, tell, become, leave, feel, put, bring</em> — they cover 80% of everyday English.
            </p>
          </div>
        </div>

        {/* ── Bottom nav ───────────────────────────────────────────────── */}
        <div className="mt-10 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a
            href="/nerd-zone"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Back to Nerd Zone
          </a>

          {!isLoggedIn && (
            <a
              href="/login?next=/nerd-zone/irregular-verbs"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F5DA20] px-4 py-2.5 text-sm font-bold text-black hover:opacity-90 transition shadow-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3v13M5 14l7 7 7-7"/><path d="M3 21h18"/></svg>
              Log in to download PDF
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
