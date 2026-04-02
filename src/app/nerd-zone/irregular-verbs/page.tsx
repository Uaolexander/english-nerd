import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Irregular Verbs — Nerd Zone — English Nerd",
  description:
    "Top 50 essential irregular verb forms. Know these and you'll handle almost any English text.",
  alternates: { canonical: "/nerd-zone/irregular-verbs" },
};

const VERBS: [string, string, string][] = [
  ["be",         "was / were",     "been"],
  ["begin",      "began",          "begun"],
  ["break",      "broke",          "broken"],
  ["bring",      "brought",        "brought"],
  ["build",      "built",          "built"],
  ["buy",        "bought",         "bought"],
  ["catch",      "caught",         "caught"],
  ["choose",     "chose",          "chosen"],
  ["come",       "came",           "come"],
  ["do",         "did",            "done"],
  ["drink",      "drank",          "drunk"],
  ["eat",        "ate",            "eaten"],
  ["fall",       "fell",           "fallen"],
  ["feel",       "felt",           "felt"],
  ["find",       "found",          "found"],
  ["fly",        "flew",           "flown"],
  ["forget",     "forgot",         "forgotten"],
  ["get",        "got",            "gotten"],
  ["give",       "gave",           "given"],
  ["go",         "went",           "gone"],
  ["have",       "had",            "had"],
  ["hear",       "heard",          "heard"],
  ["keep",       "kept",           "kept"],
  ["know",       "knew",           "known"],
  ["learn",      "learned / learnt", "learned / learnt"],
  ["leave",      "left",           "left"],
  ["lose",       "lost",           "lost"],
  ["make",       "made",           "made"],
  ["meet",       "met",            "met"],
  ["pay",        "paid",           "paid"],
  ["put",        "put",            "put"],
  ["read",       "read",           "read"],
  ["run",        "ran",            "run"],
  ["say",        "said",           "said"],
  ["see",        "saw",            "seen"],
  ["sell",       "sold",           "sold"],
  ["send",       "sent",           "sent"],
  ["sit",        "sat",            "sat"],
  ["sleep",      "slept",          "slept"],
  ["speak",      "spoke",          "spoken"],
  ["spend",      "spent",          "spent"],
  ["stand",      "stood",          "stood"],
  ["take",       "took",           "taken"],
  ["teach",      "taught",         "taught"],
  ["tell",       "told",           "told"],
  ["think",      "thought",        "thought"],
  ["understand", "understood",     "understood"],
  ["wear",       "wore",           "worn"],
  ["win",        "won",            "won"],
  ["write",      "wrote",          "written"],
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

        {/* Hero */}
        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-14">

          {/* Left: text + download */}
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

            {/* Stats row */}
            <div className="mt-5 flex flex-wrap gap-3">
              {[
                { icon: "🔁", value: "50", label: "verbs" },
                { icon: "📋", value: "3", label: "forms each" },
                { icon: "⭐", value: "A2–C1", label: "levels" },
              ].map(({ icon, value, label }) => (
                <div key={label} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                  <span className="text-base">{icon}</span>
                  <span className="text-sm font-black text-slate-900">{value}</span>
                  <span className="text-xs text-slate-400">{label}</span>
                </div>
              ))}
            </div>

            {/* Download button */}
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
          <div className="w-full max-w-[220px] shrink-0 self-start lg:mt-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/topics/nerd-zone/irregular-verbs-50.jpg"
                alt="Irregular Verbs PDF cover"
                style={{ aspectRatio: "210/297" }}
                className="w-full object-cover"
                onError={undefined}
              />
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-400">A4 · Printable PDF</p>
          </div>

        </div>

        {/* Table */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Table header */}
          <div className="grid grid-cols-[2rem_1fr_1fr_1fr] border-b border-slate-100 bg-slate-50 px-5 py-3.5 gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">#</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Base form</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Past Simple</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-600">Past Participle</span>
          </div>

          <div className="divide-y divide-slate-50">
            {VERBS.map(([base, past, participle], i) => (
              <div
                key={base}
                className={`grid grid-cols-[2rem_1fr_1fr_1fr] items-center gap-3 px-5 py-3 transition hover:bg-amber-50/60 ${
                  i % 2 === 1 ? "bg-slate-50/50" : ""
                }`}
              >
                <span className="text-[11px] font-bold text-slate-300">{i + 1}</span>
                <span className="text-sm font-black text-slate-900">{base}</span>
                <span className="text-sm font-semibold text-emerald-700">{past}</span>
                <span className="text-sm font-semibold text-sky-700">{participle}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4">
          <p className="text-sm font-semibold text-amber-900">
            💡 Tip:{" "}
            <span className="font-normal text-amber-800">
              Don&apos;t try to memorise all 50 at once. Start with the top 20 (be, go, have, do, make, say, get, come, know, take, give, find, think, see, tell, become, leave, feel, put, bring) — these cover 80% of everyday English.
            </span>
          </p>
        </div>

        {/* Bottom nav */}
        <div className="mt-10 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a
            href="/nerd-zone"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Back to Nerd Zone
          </a>

          {isLoggedIn && (
            <a
              href="/api/materials/download?slug=irregular-verbs-50"
              className="inline-flex items-center gap-2 rounded-xl border border-[#F5DA20] bg-[#F5DA20]/10 px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-[#F5DA20]/20 transition"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3v13M5 14l7 7 7-7"/><path d="M3 21h18"/></svg>
              Download PDF
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
