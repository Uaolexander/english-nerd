"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import { useIsPro } from "@/lib/ProContext";
import VocabCertificateModal from "./VocabCertificateModal";

type Band = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type WordItem = {
  id: string;
  word: string;
  band: Band;
};

type Step = {
  id: "step1" | "step2" | "step3";
  title: string;
  subtitle: string;
  words: WordItem[];
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

const bandOrder: Band[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

const bandIncrement: Record<Band, number> = {
  A1: 1000,
  A2: 1000,
  B1: 1000,
  B2: 2000,
  C1: 2000,
  C2: 2000,
};

const BAND_COLOR: Record<Band, string> = {
  A1: "bg-emerald-100 text-emerald-700 border-emerald-200",
  A2: "bg-teal-100 text-teal-700 border-teal-200",
  B1: "bg-sky-100 text-sky-700 border-sky-200",
  B2: "bg-violet-100 text-violet-700 border-violet-200",
  C1: "bg-orange-100 text-orange-700 border-orange-200",
  C2: "bg-rose-100 text-rose-700 border-rose-200",
};

const BAND_BAR: Record<Band, string> = {
  A1: "bg-emerald-400",
  A2: "bg-teal-400",
  B1: "bg-sky-400",
  B2: "bg-violet-400",
  C1: "bg-orange-400",
  C2: "bg-rose-400",
};

function bandFromEstimate(estimate: number): Band {
  if (estimate < 800) return "A1";
  if (estimate < 1600) return "A2";
  if (estimate < 2600) return "B1";
  if (estimate < 4200) return "B2";
  if (estimate < 6000) return "C1";
  return "C2";
}

const BAND_LABEL: Record<Band, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper-Intermediate",
  C1: "Advanced",
  C2: "Proficient",
};

export default function VocabularyTestClient() {
  const steps: Step[] = useMemo(
    () => [
      {
        id: "step1",
        title: "Step 1 — common words",
        subtitle: "Tick the words you know well (don't guess).",
        words: [
          { id: "w1", word: "book", band: "A1" },
          { id: "w2", word: "family", band: "A1" },
          { id: "w3", word: "friend", band: "A1" },
          { id: "w4", word: "money", band: "A1" },
          { id: "w5", word: "morning", band: "A1" },
          { id: "w6", word: "market", band: "A1" },
          { id: "w7", word: "kitchen", band: "A1" },
          { id: "w8", word: "weather", band: "A1" },
          { id: "w9", word: "ticket", band: "A1" },
          { id: "w10", word: "student", band: "A1" },
          { id: "w11", word: "quiet", band: "A2" },
          { id: "w12", word: "healthy", band: "A2" },
          { id: "w13", word: "promise", band: "A2" },
          { id: "w14", word: "celebrate", band: "A2" },
          { id: "w15", word: "decide", band: "A2" },
          { id: "w16", word: "borrow", band: "A2" },
          { id: "w17", word: "return", band: "A2" },
          { id: "w18", word: "visitor", band: "A2" },
          { id: "w19", word: "notice", band: "A2" },
          { id: "w20", word: "message", band: "A2" },
          { id: "w21", word: "improve", band: "B1" },
          { id: "w22", word: "schedule", band: "B1" },
          { id: "w23", word: "recommend", band: "B1" },
          { id: "w24", word: "support", band: "B1" },
          { id: "w25", word: "opinion", band: "B1" },
          { id: "w26", word: "manage", band: "B1" },
          { id: "w27", word: "prefer", band: "B1" },
          { id: "w28", word: "prepare", band: "B1" },
          { id: "w29", word: "discover", band: "B1" },
          { id: "w30", word: "experience", band: "B1" },
        ],
      },
      {
        id: "step2",
        title: "Step 2 — less common words",
        subtitle: "Keep ticking only the words you know well.",
        words: [
          { id: "w31", word: "efficient", band: "B1" },
          { id: "w32", word: "challenge", band: "B1" },
          { id: "w33", word: "approach", band: "B1" },
          { id: "w34", word: "determine", band: "B2" },
          { id: "w35", word: "reliable", band: "B2" },
          { id: "w36", word: "maintain", band: "B2" },
          { id: "w37", word: "consequence", band: "B2" },
          { id: "w38", word: "persuade", band: "B2" },
          { id: "w39", word: "negotiate", band: "B2" },
          { id: "w40", word: "contribute", band: "B2" },
          { id: "w41", word: "essential", band: "B2" },
          { id: "w42", word: "feature", band: "B2" },
          { id: "w43", word: "strategy", band: "B2" },
          { id: "w44", word: "estimate", band: "B2" },
          { id: "w45", word: "sufficient", band: "B2" },
          { id: "w46", word: "substantial", band: "C1" },
          { id: "w47", word: "inevitable", band: "C1" },
          { id: "w48", word: "coherent", band: "C1" },
          { id: "w49", word: "intricate", band: "C1" },
          { id: "w50", word: "ambiguous", band: "C1" },
          { id: "w51", word: "constraint", band: "C1" },
          { id: "w52", word: "contemplate", band: "C1" },
          { id: "w53", word: "prevail", band: "C1" },
          { id: "w54", word: "notion", band: "C1" },
          { id: "w55", word: "discrepancy", band: "C1" },
          { id: "w56", word: "meticulous", band: "C2" },
          { id: "w57", word: "ubiquitous", band: "C2" },
          { id: "w58", word: "esoteric", band: "C2" },
          { id: "w59", word: "conundrum", band: "C2" },
          { id: "w60", word: "quintessential", band: "C2" },
        ],
      },
      {
        id: "step3",
        title: "Step 3 — advanced words",
        subtitle: "These are difficult. It's normal to tick only a few.",
        words: [
          { id: "w61", word: "comprehensive", band: "B2" },
          { id: "w62", word: "allocate", band: "B2" },
          { id: "w63", word: "implement", band: "B2" },
          { id: "w64", word: "sustainable", band: "B2" },
          { id: "w65", word: "pragmatic", band: "C1" },
          { id: "w66", word: "endeavor", band: "C1" },
          { id: "w67", word: "tremendous", band: "C1" },
          { id: "w68", word: "scrutinize", band: "C1" },
          { id: "w69", word: "articulate", band: "C1" },
          { id: "w70", word: "resilient", band: "C1" },
          { id: "w71", word: "implication", band: "C1" },
          { id: "w72", word: "profound", band: "C1" },
          { id: "w73", word: "arbitrary", band: "C1" },
          { id: "w74", word: "diminish", band: "C1" },
          { id: "w75", word: "consolidate", band: "C1" },
          { id: "w76", word: "inadvertent", band: "C2" },
          { id: "w77", word: "circumvent", band: "C2" },
          { id: "w78", word: "parsimonious", band: "C2" },
          { id: "w79", word: "obfuscate", band: "C2" },
          { id: "w80", word: "ameliorate", band: "C2" },
          { id: "w81", word: "antithetical", band: "C2" },
          { id: "w82", word: "intransigent", band: "C2" },
          { id: "w83", word: "perspicacious", band: "C2" },
          { id: "w84", word: "recalcitrant", band: "C2" },
          { id: "w85", word: "vociferous", band: "C2" },
          { id: "w86", word: "fastidious", band: "C2" },
          { id: "w87", word: "equivocal", band: "C2" },
          { id: "w88", word: "anachronistic", band: "C2" },
          { id: "w89", word: "lugubrious", band: "C2" },
          { id: "w90", word: "sesquipedalian", band: "C2" },
        ],
      },
    ],
    []
  );

  const totalSteps = steps.length;
  const totalWords = steps.reduce((acc, s) => acc + s.words.length, 0);

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [showCertModal, setShowCertModal] = useState(false);

  const step = steps[stepIndex];

  const selectedCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected]
  );

  const { save } = useProgress();
  const isPro = useIsPro();
  useEffect(() => {
    if (finished) save(undefined, Math.round((selectedCount / totalWords) * 100), totalWords);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const stepSelectedCount = useMemo(
    () => step.words.filter((w) => selected[w.id]).length,
    [step.words, selected]
  );

  const bandStats = useMemo(() => {
    const stats = new Map<Band, { known: number; total: number }>();
    for (const b of bandOrder) stats.set(b, { known: 0, total: 0 });

    for (const s of steps) {
      for (const w of s.words) {
        const bucket = stats.get(w.band)!;
        bucket.total += 1;
        if (selected[w.id]) bucket.known += 1;
      }
    }

    const rows = bandOrder.map((b) => {
      const v = stats.get(b)!;
      const percent = v.total ? Math.round((v.known / v.total) * 100) : 0;
      const estimate = Math.round((percent / 100) * bandIncrement[b]);
      return { band: b, known: v.known, total: v.total, percent, estimate };
    });

    const weakest = [...rows]
      .filter((r) => r.total > 0)
      .sort((a, b) => a.percent - b.percent);

    return { rows, weakest };
  }, [selected, steps]);

  const estimatedVocabulary = useMemo(() => {
    const sum = bandStats.rows.reduce((acc, r) => acc + r.estimate, 0);
    return clamp(sum, 0, 12000);
  }, [bandStats.rows]);

  const suggestedBand = useMemo(
    () => bandFromEstimate(estimatedVocabulary),
    [estimatedVocabulary]
  );

  const lessonBand = suggestedBand === "C2" ? "C1" : suggestedBand;

  const samplePercent = clamp(Math.round((selectedCount / totalWords) * 100), 0, 100);
  const circumference = 2 * Math.PI * 40;
  const ringDash = circumference - (samplePercent / 100) * circumference;

  const weakestBands = bandStats.weakest.slice(0, 3);

  function toggle(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleAll() {
    const allOn = step.words.every((w) => selected[w.id]);
    const patch: Record<string, boolean> = {};
    for (const w of step.words) patch[w.id] = !allOn;
    setSelected((prev) => ({ ...prev, ...patch }));
  }

  function clearStep() {
    const patch: Record<string, boolean> = {};
    for (const w of step.words) patch[w.id] = false;
    setSelected((prev) => ({ ...prev, ...patch }));
  }

  function start() {
    setStarted(true);
    setFinished(false);
    setStepIndex(0);
    setSelected({});
  }

  function next() {
    if (stepIndex < totalSteps - 1) setStepIndex((x) => x + 1);
  }

  function prev() {
    if (stepIndex > 0) setStepIndex((x) => x - 1);
  }

  function finish() {
    setFinished(true);
  }

  const progressPct = Math.round(((stepIndex + 1) / totalSteps) * 100);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFFDF0] via-white to-[#FAFAF8] text-[#0F0F12]">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Breadcrumb */}
        <div className="mb-2 text-sm text-black/45">
          <a href="/" className="hover:text-black/75 transition-colors">Home</a>
          <span className="mx-2 text-black/25">/</span>
          <a href="/tests" className="hover:text-black/75 transition-colors">Tests</a>
          <span className="mx-2 text-black/25">/</span>
          <span className="text-black/65">Vocabulary Size Test</span>
        </div>

        <h1 className="mt-1 text-3xl md:text-5xl font-black tracking-tight">
          Vocabulary{" "}
          <span className="rounded-lg bg-[#F5DA20] px-2 py-0.5 text-[#0F0F12]">
            Size Test
          </span>
        </h1>
        <p className="mt-3 max-w-3xl text-black/55">
          Tick the words you know. Get an instant estimate —{" "}
          <b className="text-black">free</b>, no registration, no paywall.
        </p>

        {/* ── LANDING ─────────────────────────────────────── */}
        {!started ? (
          <div className={`mt-10 grid gap-8 ${!isPro ? "lg:grid-cols-[1fr_360px]" : ""}`}>
            <section className="rounded-2xl border border-black/10 bg-white/90 backdrop-blur p-7 shadow-sm">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-black text-black/65">
                <span className="inline-block h-2 w-2 rounded-full bg-[#F5DA20]" />
                Free · No sign-up · Instant results
              </div>

              <h2 className="mt-4 text-2xl md:text-3xl font-black">
                How many English words do you know?
              </h2>

              <p className="mt-3 max-w-2xl text-black/55">
                You&apos;ll see three lists. Tick only the words you know well — don&apos;t
                guess. At the end you&apos;ll get an approximate vocabulary size and a
                breakdown by difficulty band.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <InfoCard title="Steps" text="3 short lists" />
                <InfoCard title="Words" text="90 total" />
                <InfoCard title="Result" text="Estimate + breakdown" />
              </div>

              {/* Band preview */}
              <div className="mt-6 rounded-xl border border-black/8 bg-black/[0.02] p-4">
                <div className="mb-3 text-xs font-bold text-black/35 uppercase tracking-wide">
                  Difficulty bands covered
                </div>
                <div className="flex flex-wrap gap-2">
                  {bandOrder.map((b) => (
                    <span key={b} className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${BAND_COLOR[b]}`}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={start}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#F5DA20] px-7 py-3.5 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
                >
                  Start vocabulary test
                </button>
                <a
                  href="/tests/grammar"
                  className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-7 py-3.5 text-sm font-semibold text-black/50 hover:bg-black/5 transition"
                >
                  Try grammar test instead
                </a>
              </div>

              <p className="mt-4 text-xs text-black/30">
                Note: This is a quick estimate, not an official exam result.
              </p>
            </section>

            <AdUnit variant="sidebar-test" />
          </div>

        /* ── QUESTION STEPS ───────────────────────────────── */
        ) : !finished ? (
          <div className={`mt-10 grid gap-8 ${!isPro ? "lg:grid-cols-[1fr_360px]" : ""}`}>
            <section className="rounded-2xl border border-black/10 bg-white/90 backdrop-blur overflow-hidden shadow-sm">

              {/* Header */}
              <div className="border-b border-black/8 bg-white/95 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-black text-[#0F0F12]">{step.title}</div>
                    <div className="mt-0.5 text-xs text-black/45">
                      Step {stepIndex + 1} of {totalSteps} · {selectedCount} words known so far
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={prev}
                      disabled={stepIndex === 0}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-bold disabled:opacity-40 hover:bg-black/5 transition"
                    >
                      ←
                    </button>

                    {stepIndex < totalSteps - 1 ? (
                      <button
                        onClick={next}
                        className="rounded-xl bg-[#F5DA20] px-5 py-2 text-sm font-black text-black hover:opacity-90 transition"
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        onClick={finish}
                        className="rounded-xl bg-[#F5DA20] px-5 py-2 text-sm font-black text-black hover:opacity-90 transition"
                      >
                        See results ✓
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-1.5 w-full rounded-full bg-black/8">
                  <div
                    className="h-1.5 rounded-full bg-[#F5DA20] transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {/* Step dots */}
                <div className="mt-3 flex gap-2">
                  {steps.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => setStepIndex(i)}
                      className={`h-2 rounded-full transition-all duration-200 ${
                        i === stepIndex
                          ? "w-8 bg-[#0F0F12]"
                          : i < stepIndex
                          ? "w-2 bg-black/40"
                          : "w-2 bg-black/12"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-black/55 text-sm">{step.subtitle}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={toggleAll}
                      className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-black/50 hover:bg-black/5 transition"
                    >
                      {step.words.every((w) => selected[w.id]) ? "Deselect all" : "Select all"}
                    </button>
                    {stepSelectedCount > 0 && (
                      <button
                        onClick={clearStep}
                        className="rounded-lg border border-black/8 bg-white px-3 py-1.5 text-xs font-bold text-black/35 hover:bg-black/5 transition"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {step.words.map((w) => {
                    const on = !!selected[w.id];
                    return (
                      <label
                        key={w.id}
                        className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 cursor-pointer transition-all select-none ${
                          on
                            ? "border-[#F5DA20] bg-[#FFFBE6] shadow-sm"
                            : "border-black/10 bg-white hover:border-black/20 hover:bg-slate-50"
                        }`}
                      >
                        {/* Hidden native checkbox — makes label clickable */}
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={on}
                          onChange={() => toggle(w.id)}
                        />

                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="text-base font-black text-[#0F0F12] truncate">
                            {w.word}
                          </span>
                        </div>

                        {/* Custom checkbox visual */}
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
                          on
                            ? "border-[#DAB700] bg-[#F5DA20]"
                            : "border-black/15 bg-white"
                        }`}>
                          {on && (
                            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                              <path
                                d="M1 5l3.5 3.5L11 1"
                                stroke="#000"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setStarted(false);
                      setFinished(false);
                      setStepIndex(0);
                      setSelected({});
                    }}
                    className="rounded-2xl border border-black/10 bg-white px-5 py-2.5 text-sm font-bold text-black/50 hover:bg-black/5 transition"
                  >
                    Restart
                  </button>
                  <div className="text-sm text-black/40">
                    <b className="text-[#0F0F12]">{stepSelectedCount}</b> / {step.words.length} ticked on this step
                  </div>
                </div>
              </div>
            </section>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                {/* Live counter card */}
                <div className="rounded-2xl border border-black/10 bg-white/90 backdrop-blur p-5 shadow-sm">
                  <div className="text-xs font-bold text-black/35 uppercase tracking-wide mb-4">
                    Known so far
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
                        <circle cx="44" cy="44" r="40" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="7" />
                        <circle
                          cx="44" cy="44" r="40"
                          fill="none"
                          stroke="#F5DA20"
                          strokeWidth="7"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={ringDash}
                          className="transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-black text-[#0F0F12]">{samplePercent}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[#0F0F12]">{selectedCount}</div>
                      <div className="text-xs text-black/45">of {totalWords} words</div>
                    </div>
                  </div>
                </div>

                <AdUnit variant="sidebar-test" />
              </div>
            </aside>
          </div>

        /* ── RESULTS ─────────────────────────────────────── */
        ) : (
          <div className={`mt-10 grid gap-8 ${!isPro ? "lg:grid-cols-[1fr_360px]" : ""}`}>
            <section className="rounded-2xl border border-black/10 bg-white/90 backdrop-blur overflow-hidden shadow-sm">

              {/* Results hero */}
              <div className="border-b border-black/8 bg-white/95 p-6 md:p-8">
                <div className="flex flex-wrap items-start gap-8">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-black/45 mb-2">Estimated vocabulary size</div>
                    <div className="flex items-end gap-3 flex-wrap">
                      <span className="text-7xl font-black leading-none text-[#0F0F12]">
                        {estimatedVocabulary.toLocaleString()}
                      </span>
                      <span className="text-xl font-semibold text-black/40 mb-1">words</span>
                    </div>

                    <div className="mt-4 flex items-center gap-3 flex-wrap">
                      <span className={`rounded-full border px-3 py-1 text-sm font-bold ${BAND_COLOR[suggestedBand]}`}>
                        {suggestedBand}
                      </span>
                      <span className="text-base font-semibold text-black/55">
                        {BAND_LABEL[suggestedBand]}
                      </span>
                    </div>

                    <p className="mt-3 text-xs text-black/35 max-w-sm">
                      Based on {selectedCount} of {totalWords} sampled words. A guide, not an official certificate.
                    </p>
                  </div>

                  {/* SVG ring */}
                  <div className="relative shrink-0">
                    <svg width="120" height="120" viewBox="0 0 88 88" className="-rotate-90">
                      <circle cx="44" cy="44" r="40" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="7" />
                      <circle
                        cx="44" cy="44" r="40"
                        fill="none"
                        stroke="#F5DA20"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={ringDash}
                        className="transition-all duration-700"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-[#0F0F12]">{samplePercent}%</span>
                      <span className="text-[9px] text-black/40 mt-0.5">of sample</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={start}
                    className="inline-flex items-center justify-center rounded-2xl bg-[#F5DA20] px-6 py-2.5 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
                  >
                    Retake test
                  </button>
                  <a
                    href="/tests/grammar"
                    className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-6 py-2.5 text-sm font-bold text-black/50 hover:bg-black/5 transition"
                  >
                    Try grammar test →
                  </a>
                  {isPro ? (
                    <button
                      onClick={() => setShowCertModal(true)}
                      className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl px-6 py-2.5 text-sm font-black text-[#0F0F12] shadow-[0_0_0_2px_#F5DA20] transition-all duration-300 hover:shadow-[0_0_0_3px_#F5DA20,0_4px_20px_rgba(245,218,32,0.35)] hover:scale-[1.03] active:scale-[0.98]"
                      style={{ background: "linear-gradient(135deg, #F5DA20 0%, #FFE55C 50%, #F5DA20 100%)", backgroundSize: "200% 100%" }}
                    >
                      <span className="shimmer-auto pointer-events-none absolute inset-0 w-1/3 skew-x-[-20deg] bg-white/40" />
                      <span className="absolute inset-0 rounded-2xl ring-2 ring-[#F5DA20]/60 animate-ping opacity-40" />
                      <svg className="relative h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4"/><path d="M8 8v4l-3 7h14l-3-7V8"/><path d="M9 21h6"/>
                      </svg>
                      <span className="relative">Get Certificate</span>
                    </button>
                  ) : (
                    <a
                      href="/pro"
                      className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-2.5 text-sm font-bold text-black/50 transition hover:border-[#F5DA20] hover:text-black"
                    >
                      <svg className="h-4 w-4 text-[#b8a200]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      Get Certificate — Pro only
                    </a>
                  )}
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-10">

                {/* Focus areas + Next steps */}
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-black/10 bg-white p-5">
                    <div className="text-sm font-black text-[#0F0F12]">Focus areas</div>
                    <p className="mt-1.5 text-xs text-black/50">
                      These bands had the lowest ratio — focus here to grow fastest.
                    </p>
                    <div className="mt-4 space-y-4">
                      {weakestBands.map((b) => (
                        <div key={b.band}>
                          <div className="flex items-center justify-between text-sm mb-1.5">
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${BAND_COLOR[b.band]}`}>
                              {b.band}
                            </span>
                            <span className="text-black/45 text-xs">
                              {b.known}/{b.total} · {b.percent}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-black/8">
                            <div
                              className={`h-1.5 rounded-full transition-all ${BAND_BAR[b.band]}`}
                              style={{ width: `${b.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/10 bg-white p-5">
                    <div className="text-sm font-black text-[#0F0F12]">Next steps</div>
                    <p className="mt-1.5 text-xs text-black/50">
                      Use your estimate as a guide — build vocabulary by level and topic.
                    </p>
                    <div className="mt-4 space-y-2">
                      <a
                        href={`/grammar/${lessonBand.toLowerCase()}`}
                        className="flex items-center gap-3 rounded-xl border border-black/8 bg-slate-50 px-4 py-3 text-sm font-semibold text-black/60 hover:bg-black/5 transition"
                      >
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold shrink-0 ${BAND_COLOR[lessonBand]}`}>
                          {lessonBand}
                        </span>
                        Browse {lessonBand} lessons →
                      </a>
                      <a
                        href="/tests/grammar"
                        className="flex items-center gap-3 rounded-xl border border-black/8 bg-slate-50 px-4 py-3 text-sm font-semibold text-black/60 hover:bg-black/5 transition"
                      >
                        <span className="text-base shrink-0">📝</span>
                        Take grammar placement test →
                      </a>
                    </div>
                  </div>
                </div>

                {/* Band breakdown */}
                <div>
                  <h3 className="text-xl font-black text-[#0F0F12]">Band breakdown</h3>
                  <p className="mt-2 text-black/50 text-sm">
                    Your &ldquo;known&rdquo; ratio by difficulty band, plus an estimated word count for each.
                  </p>
                  <div className="mt-5 grid gap-2.5">
                    {bandStats.rows.map((r) => (
                      <div key={r.band} className="rounded-2xl border border-black/10 bg-white p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold shrink-0 ${BAND_COLOR[r.band]}`}>
                              {r.band}
                            </span>
                            <span className="font-bold text-[#0F0F12] text-sm">
                              ~{r.estimate.toLocaleString()} words estimated
                            </span>
                          </div>
                          <div className="text-xs text-black/40">
                            {r.known}/{r.total} ticked · {r.percent}%
                          </div>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-black/8">
                          <div
                            className={`h-1.5 rounded-full transition-all ${BAND_BAR[r.band]}`}
                            style={{ width: `${r.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Words ticked */}
                <div>
                  <h3 className="text-xl font-black text-[#0F0F12]">Words you ticked</h3>
                  <p className="mt-2 text-black/50 text-sm">
                    {selectedCount} word{selectedCount !== 1 ? "s" : ""} selected across all steps.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {steps
                      .flatMap((s) => s.words)
                      .filter((w) => selected[w.id])
                      .map((w) => (
                        <span
                          key={w.id}
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${BAND_COLOR[w.band]}`}
                          title={`Band ${w.band}`}
                        >
                          {w.word}
                        </span>
                      ))}
                    {!selectedCount && (
                      <span className="text-sm text-black/45">
                        You didn&apos;t tick any words.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <AdUnit variant="sidebar-test" />
          </div>
        )}
      </div>

      {showCertModal && finished && (
        <VocabCertificateModal
          band={suggestedBand}
          estimatedVocabulary={estimatedVocabulary}
          onClose={() => setShowCertModal(false)}
        />
      )}
    </main>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-bold text-black/45">{title}</div>
      <div className="mt-2 text-sm font-black text-[#0F0F12]">{text}</div>
    </div>
  );
}
