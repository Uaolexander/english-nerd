"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";

type Tense =
  | "Present Simple"
  | "Present Continuous"
  | "Present Perfect"
  | "Present Perfect Continuous"
  | "Past Simple"
  | "Past Continuous"
  | "Past Perfect"
  | "Past Perfect Continuous"
  | "Future Simple"
  | "Be going to"
  | "Future Continuous"
  | "Future Perfect"
  | "Future Perfect Continuous";

type Q = {
  id: string;
  tense: Tense;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const TENSE_META: Record<Tense, { level: string; color: string; dot: string; href: string }> = {
  "Present Simple":               { level: "A1", color: "bg-[#F5DA20]",   dot: "bg-[#F5DA20]",   href: "/tenses/present-simple" },
  "Present Continuous":           { level: "A1", color: "bg-[#F5DA20]",   dot: "bg-[#F5DA20]",   href: "/tenses/present-continuous" },
  "Past Simple":                  { level: "A2", color: "bg-emerald-400", dot: "bg-emerald-400", href: "/tenses/past-simple" },
  "Be going to":                  { level: "A2", color: "bg-emerald-400", dot: "bg-emerald-400", href: "/tenses/be-going-to" },
  "Future Simple":                { level: "A2", color: "bg-emerald-400", dot: "bg-emerald-400", href: "/tenses/future-simple" },
  "Past Continuous":              { level: "A2", color: "bg-emerald-400", dot: "bg-emerald-400", href: "/tenses/past-continuous" },
  "Present Perfect":              { level: "B1", color: "bg-violet-400",  dot: "bg-violet-400",  href: "/tenses/present-perfect" },
  "Past Perfect":                 { level: "B1", color: "bg-violet-400",  dot: "bg-violet-400",  href: "/tenses/past-perfect" },
  "Present Perfect Continuous":   { level: "B1", color: "bg-violet-400",  dot: "bg-violet-400",  href: "/tenses/present-perfect-continuous" },
  "Future Continuous":            { level: "B2", color: "bg-orange-400",  dot: "bg-orange-400",  href: "/tenses/future-continuous" },
  "Past Perfect Continuous":      { level: "B2", color: "bg-orange-400",  dot: "bg-orange-400",  href: "/tenses/past-perfect-continuous" },
  "Future Perfect":               { level: "B2", color: "bg-orange-400",  dot: "bg-orange-400",  href: "/tenses/future-perfect" },
  "Future Perfect Continuous":    { level: "C1", color: "bg-cyan-400",    dot: "bg-cyan-400",    href: "/tenses/future-perfect-continuous" },
};

const QUESTIONS: Q[] = [
  // ── Present Simple ──────────────────────────────────────────────────────────
  { id: "ps1", tense: "Present Simple", prompt: "She ___ coffee every morning.", options: ["drink", "drinks", "is drinking"], correctIndex: 1, explanation: "Habits → Present Simple. 3rd person singular: drinks." },
  { id: "ps2", tense: "Present Simple", prompt: "Water ___ at 100°C.", options: ["boil", "boils", "is boiling"], correctIndex: 1, explanation: "Facts → Present Simple. boils." },
  { id: "ps3", tense: "Present Simple", prompt: "The train ___ at 9 am tomorrow. (timetable)", options: ["leaves", "will leave", "is leaving"], correctIndex: 0, explanation: "Fixed schedules/timetables → Present Simple. leaves." },
  { id: "ps4", tense: "Present Simple", prompt: "___ he speak any foreign languages?", options: ["Do", "Does", "Is"], correctIndex: 1, explanation: "Questions in Present Simple: Does + he + base verb." },

  // ── Present Continuous ───────────────────────────────────────────────────────
  { id: "pc1", tense: "Present Continuous", prompt: "Look! It ___ outside.", options: ["rains", "is raining", "rained"], correctIndex: 1, explanation: "Action happening right now → Present Continuous." },
  { id: "pc2", tense: "Present Continuous", prompt: "I ___ my friend for lunch tomorrow. (arrangement)", options: ["meet", "will meet", "am meeting"], correctIndex: 2, explanation: "Personal future arrangement → Present Continuous." },
  { id: "pc3", tense: "Present Continuous", prompt: "She ___ for a new job these days.", options: ["looks", "is looking", "looked"], correctIndex: 1, explanation: "Temporary situation around now → Present Continuous." },

  // ── Present Perfect ──────────────────────────────────────────────────────────
  { id: "pp1", tense: "Present Perfect", prompt: "I ___ never been to Japan.", options: ["have", "had", "am"], correctIndex: 0, explanation: "Life experience → Present Perfect: have never been." },
  { id: "pp2", tense: "Present Perfect", prompt: "She ___ just finished the report.", options: ["had", "has", "is"], correctIndex: 1, explanation: "Recent action with present result → has just finished." },
  { id: "pp3", tense: "Present Perfect", prompt: "They ___ here since 2010.", options: ["live", "lived", "have lived"], correctIndex: 2, explanation: "Situation starting in past, still true now → have lived (since)." },
  { id: "pp4", tense: "Present Perfect", prompt: "___ you ever tried sushi?", options: ["Have", "Did", "Do"], correctIndex: 0, explanation: "Experience question → Have you ever...?" },

  // ── Present Perfect Continuous ───────────────────────────────────────────────
  { id: "ppc1", tense: "Present Perfect Continuous", prompt: "She ___ for two hours and is exhausted.", options: ["studies", "has been studying", "studied"], correctIndex: 1, explanation: "Duration of activity up to now → has been studying." },
  { id: "ppc2", tense: "Present Perfect Continuous", prompt: "My hands are dirty because I ___ in the garden.", options: ["work", "worked", "have been working"], correctIndex: 2, explanation: "Continuous activity causing a present result → have been working." },
  { id: "ppc3", tense: "Present Perfect Continuous", prompt: "How long ___ you ___ here?", options: ["have / been working", "did / work", "are / working"], correctIndex: 0, explanation: "Duration question up to now → How long have you been working?" },

  // ── Past Simple ──────────────────────────────────────────────────────────────
  { id: "pasi1", tense: "Past Simple", prompt: "We ___ to the cinema last night.", options: ["go", "went", "have gone"], correctIndex: 1, explanation: "Completed action at specific past time → Past Simple: went." },
  { id: "pasi2", tense: "Past Simple", prompt: "She ___ her keys, so she couldn't get in.", options: ["loses", "lost", "has lost"], correctIndex: 1, explanation: "Completed past action → lost." },
  { id: "pasi3", tense: "Past Simple", prompt: "___ you call him yesterday?", options: ["Have", "Did", "Do"], correctIndex: 1, explanation: "Past Simple question: Did + base verb." },
  { id: "pasi4", tense: "Past Simple", prompt: "He ___ understand the question at all.", options: ["didn't", "doesn't", "hadn't"], correctIndex: 0, explanation: "Past Simple negative: didn't + base verb." },

  // ── Past Continuous ──────────────────────────────────────────────────────────
  { id: "paco1", tense: "Past Continuous", prompt: "I ___ TV when she called.", options: ["watched", "was watching", "have watched"], correctIndex: 1, explanation: "Action in progress interrupted by another → was watching." },
  { id: "paco2", tense: "Past Continuous", prompt: "While she ___, he was reading a book.", options: ["cooked", "cooks", "was cooking"], correctIndex: 2, explanation: "Two simultaneous past actions → was cooking / was reading." },
  { id: "paco3", tense: "Past Continuous", prompt: "At 8 pm last night, they ___ dinner.", options: ["had", "were having", "have had"], correctIndex: 1, explanation: "Action in progress at specific past moment → were having." },

  // ── Past Perfect ─────────────────────────────────────────────────────────────
  { id: "patp1", tense: "Past Perfect", prompt: "By the time I arrived, she ___ already left.", options: ["has", "had", "was"], correctIndex: 1, explanation: "Action completed before another past action → had left." },
  { id: "patp2", tense: "Past Perfect", prompt: "He said he ___ seen that film before.", options: ["has", "had", "was"], correctIndex: 1, explanation: "Reported past event (backshift) → had seen." },
  { id: "patp3", tense: "Past Perfect", prompt: "If she ___ harder, she would have passed.", options: ["studied", "had studied", "would study"], correctIndex: 1, explanation: "Third conditional → If + Past Perfect: had studied." },

  // ── Past Perfect Continuous ──────────────────────────────────────────────────
  { id: "patpc1", tense: "Past Perfect Continuous", prompt: "She was tired because she ___ all day.", options: ["was working", "had been working", "has been working"], correctIndex: 1, explanation: "Duration of activity before a past moment → had been working." },
  { id: "patpc2", tense: "Past Perfect Continuous", prompt: "He ___ for 20 minutes when the bus finally arrived.", options: ["waited", "has been waiting", "had been waiting"], correctIndex: 2, explanation: "How long before a past event → had been waiting." },

  // ── Future Simple (will) ──────────────────────────────────────────────────────
  { id: "fs1", tense: "Future Simple", prompt: "It's cold in here. I ___ close the window.", options: ["am going to", "'ll", "am closing"], correctIndex: 1, explanation: "Spontaneous decision → 'll (will)." },
  { id: "fs2", tense: "Future Simple", prompt: "I think it ___ rain tomorrow.", options: ["is going to", "will", "is"], correctIndex: 1, explanation: "Opinion/prediction without evidence → will." },
  { id: "fs3", tense: "Future Simple", prompt: "Don't worry. I ___ help you with that.", options: ["am going to", "will", "am helping"], correctIndex: 1, explanation: "Promise → will." },

  // ── Be going to ──────────────────────────────────────────────────────────────
  { id: "bgt1", tense: "Be going to", prompt: "We ___ visit Paris next summer. (plan)", options: ["will", "are going to", "are"], correctIndex: 1, explanation: "Pre-decided plan/intention → are going to." },
  { id: "bgt2", tense: "Be going to", prompt: "Look at those clouds! It ___ rain.", options: ["will", "is going to", "rains"], correctIndex: 1, explanation: "Prediction based on evidence (clouds) → is going to." },
  { id: "bgt3", tense: "Be going to", prompt: "She ___ have a baby. She told me last week.", options: ["will", "is going to", "has"], correctIndex: 1, explanation: "Known future plan → is going to." },

  // ── Future Continuous ─────────────────────────────────────────────────────────
  { id: "fc1", tense: "Future Continuous", prompt: "This time tomorrow I ___ on the beach.", options: ["will lie", "will be lying", "am lying"], correctIndex: 1, explanation: "Action in progress at a future moment → will be lying." },
  { id: "fc2", tense: "Future Continuous", prompt: "___ you be using the car tonight? (polite)", options: ["Will", "Are", "Do"], correctIndex: 0, explanation: "Polite question about future plans → Will you be using?" },

  // ── Future Perfect ────────────────────────────────────────────────────────────
  { id: "fp1", tense: "Future Perfect", prompt: "By next year, she ___ her degree.", options: ["will finish", "will have finished", "finishes"], correctIndex: 1, explanation: "Action completed before a future point → will have finished." },
  { id: "fp2", tense: "Future Perfect", prompt: "They ___ the project by Friday.", options: ["will complete", "will have completed", "complete"], correctIndex: 1, explanation: "Completed before a deadline → will have completed." },

  // ── Future Perfect Continuous ─────────────────────────────────────────────────
  { id: "fpc1", tense: "Future Perfect Continuous", prompt: "By June, I ___ here for ten years.", options: ["will work", "will have been working", "will be working"], correctIndex: 1, explanation: "Duration of activity up to a future point → will have been working." },
];

const LETTER = ["A", "B", "C"] as const;

function ScoreBar({ percent, color }: { percent: number; color: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/8">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

export default function TensesTestClient() {
  const questions = useMemo(() => QUESTIONS, []);
  const total = questions.length;

  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const score = useMemo(() => {
    let correct = 0;
    for (const q of questions) {
      if (answers[q.id] === q.correctIndex) correct++;
    }
    return { correct, total, percent: Math.round((correct / total) * 100) };
  }, [answers, questions, total]);

  const { save } = useProgress();
  useEffect(() => {
    if (submitted) save(undefined, score.percent, score.total);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const tenseStats = useMemo(() => {
    return (Object.keys(TENSE_META) as Tense[]).map((tense) => {
      const qs = questions.filter((q) => q.tense === tense);
      const correct = qs.filter((q) => answers[q.id] === q.correctIndex).length;
      const percent = qs.length ? Math.round((correct / qs.length) * 100) : 0;
      return { tense, correct, total: qs.length, percent, meta: TENSE_META[tense] };
    });
  }, [answers, questions]);

  function pick(qId: string, optionIndex: number) {
    setAnswers((prev) => {
      if (prev[qId] !== undefined) return prev;
      return { ...prev, [qId]: optionIndex };
    });
  }

  function retake() {
    setAnswers({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function showResults() {
    window.scrollTo({ top: 0, behavior: "instant" });
    setSubmitted(true);
  }

  const answeredCount = Object.keys(answers).length;

  // ── RESULTS ─────────────────────────────────────────────────────────────────
  if (submitted) {
    const weak = tenseStats.filter((t) => t.percent < 60).sort((a, b) => a.percent - b.percent);
    const strong = tenseStats.filter((t) => t.percent >= 80);
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#FFFDF0] via-white to-[#FAFAF8] text-[#0F0F12]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-2 text-sm text-black/45">
            <a href="/" className="hover:text-black/75 transition">Home</a>
            <span className="mx-2 text-black/25">/</span>
            <a href="/tests" className="hover:text-black/75 transition">Tests</a>
            <span className="mx-2 text-black/25">/</span>
            <span className="text-black/65">Tenses Test — Results</span>
          </div>

          <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
            Your <span className="rounded-lg bg-[#F5DA20] px-2 py-0.5 text-[#0F0F12]">Tenses Results</span>
          </h1>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
            <section>
              {/* Score summary */}
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Score", value: `${score.correct}/${score.total}` },
                  { label: "Percentage", value: `${score.percent}%` },
                  { label: "Tenses to review", value: `${weak.length}` },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                    <p className="text-3xl font-black">{value}</p>
                    <p className="mt-1 text-sm text-black/45">{label}</p>
                  </div>
                ))}
              </div>

              {/* Per-tense breakdown */}
              <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-black">Tense by tense breakdown</h2>
                <p className="mt-1 text-sm text-black/45">Click any tense to go to its practice page.</p>
                <div className="mt-5 flex flex-col gap-3">
                  {tenseStats.map(({ tense, correct, total: t, percent, meta }) => (
                    <a key={tense} href={meta.href} className="group flex items-center gap-4 rounded-xl border border-black/8 bg-black/[0.01] px-4 py-3 hover:bg-black/5 transition">
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${meta.dot}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-black/80 group-hover:text-black truncate">{tense}</span>
                          <span className={`shrink-0 text-xs font-black ${percent >= 80 ? "text-emerald-600" : percent >= 50 ? "text-amber-600" : "text-rose-600"}`}>
                            {correct}/{t}
                          </span>
                        </div>
                        <div className="mt-1.5">
                          <ScoreBar percent={percent} color={percent >= 80 ? "bg-emerald-400" : percent >= 50 ? "bg-amber-400" : "bg-rose-400"} />
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full border border-black/10 bg-black/5 px-2 py-0.5 text-[10px] font-black text-black/40">{meta.level}</span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-black/20 group-hover:text-black/50">
                        <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Weak areas CTA */}
              {weak.length > 0 && (
                <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-6">
                  <h2 className="text-base font-black text-rose-800">Focus on these tenses</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {weak.map(({ tense, meta }) => (
                      <a key={tense} href={meta.href} className="rounded-full border border-rose-300 bg-white px-3 py-1.5 text-sm font-bold text-rose-700 hover:bg-rose-100 transition">
                        {tense} →
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {strong.length > 0 && (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <h2 className="text-base font-black text-emerald-800">You're strong here 🎉</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {strong.map(({ tense }) => (
                      <span key={tense} className="rounded-full border border-emerald-300 bg-white px-3 py-1 text-sm font-semibold text-emerald-700">{tense}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Review answers */}
              <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-black">Review all questions</h2>
                <div className="mt-4 flex flex-col gap-4">
                  {questions.map((q, i) => {
                    const given = answers[q.id];
                    const isCorrect = given === q.correctIndex;
                    return (
                      <div key={q.id} className={`rounded-xl border p-4 ${isCorrect ? "border-emerald-200 bg-emerald-50/50" : "border-rose-200 bg-rose-50/50"}`}>
                        <div className="flex items-start gap-3">
                          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${isCorrect ? "bg-emerald-400 text-white" : "bg-rose-400 text-white"}`}>
                            {isCorrect ? "✓" : "✗"}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-black/80">{i + 1}. {q.prompt}</p>
                            <p className="mt-1 text-xs text-black/55">
                              Correct: <span className="font-bold text-emerald-700">{q.options[q.correctIndex]}</span>
                              {!isCorrect && given !== null && given !== undefined && (
                                <> · Your answer: <span className="font-bold text-rose-600">{q.options[given]}</span></>
                              )}
                            </p>
                            <p className="mt-1 text-xs text-black/40">{q.explanation}</p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black text-black ${TENSE_META[q.tense].color}`}>{q.tense}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={retake} className="rounded-2xl bg-[#F5DA20] px-7 py-3 text-sm font-black text-black hover:opacity-90 transition">
                  Retake test →
                </button>
                <a href="/tenses" className="rounded-2xl border border-black/10 bg-white px-7 py-3 text-sm font-semibold text-black/50 hover:bg-black/5 transition">
                  Back to Tenses
                </a>
              </div>
            </section>

            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/70 backdrop-blur p-4">
                <div className="text-xs font-semibold text-black/35">ADVERTISEMENT</div>
                <div className="mt-3 h-[600px] rounded-xl border border-black/8 bg-black/[0.02] flex items-center justify-center text-black/25 text-sm">
                  300 × 600
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    );
  }

  // ── QUESTION (scroll) ────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFFDF0] via-white to-[#FAFAF8] text-[#0F0F12]">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 border-b border-black/8 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-sm font-black text-[#0F0F12]">English Tenses Test</span>
            <div className="mt-0.5 flex items-center gap-3">
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
                  style={{ width: `${Math.round((answeredCount / total) * 100)}%` }}
                />
              </div>
              <span className="text-xs text-black/40">{answeredCount}/{total}</span>
            </div>
          </div>
          <button
            onClick={showResults}
            disabled={answeredCount === 0}
            className="shrink-0 rounded-xl bg-[#F5DA20] px-5 py-2 text-sm font-black text-black hover:opacity-90 disabled:opacity-30 transition"
          >
            See results →
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-2 text-sm text-black/45">
          <a href="/" className="hover:text-black/75 transition">Home</a>
          <span className="mx-2 text-black/25">/</span>
          <a href="/tests" className="hover:text-black/75 transition">Tests</a>
          <span className="mx-2 text-black/25">/</span>
          <span className="text-black/65">Tenses Test</span>
        </div>
        <h1 className="mt-1 text-3xl font-black tracking-tight md:text-5xl">
          English{" "}
          <span className="rounded-lg bg-[#F5DA20] px-2 py-0.5 text-[#0F0F12]">Tenses Test</span>
        </h1>
        <p className="mt-3 max-w-2xl text-black/55">
          Choose the correct verb form for each sentence. <b className="text-black">Free</b>, no registration, no paywall. Answer as many as you can — then hit <b className="text-black">See results</b> to get a full breakdown by tense.
        </p>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <section className="flex flex-col gap-4">
            {questions.map((q, i) => {
              const selected = answers[q.id];
              const isAnswered = selected !== undefined;
              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 ${
                    isAnswered
                      ? selected === q.correctIndex
                        ? "border-emerald-200"
                        : "border-rose-200"
                      : "border-black/10"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                      isAnswered
                        ? selected === q.correctIndex ? "bg-emerald-400 text-white" : "bg-rose-400 text-white"
                        : "bg-black/8 text-black/40"
                    }`}>
                      {isAnswered ? (selected === q.correctIndex ? "✓" : "✗") : i + 1}
                    </span>
                    <p className="text-base font-bold leading-snug text-[#0F0F12]">{q.prompt}</p>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    {q.options.map((opt, oi) => {
                      const isChosen = selected === oi;
                      const isTheCorrect = q.correctIndex === oi;
                      let cls = "border-black/10 bg-black/[0.02] text-black/70 hover:border-black/20 hover:bg-black/5";
                      let dotCls = "bg-black/8 text-black/40";
                      if (isAnswered) {
                        if (isTheCorrect) { cls = "border-emerald-400 bg-emerald-50 text-emerald-900"; dotCls = "bg-emerald-400 text-white"; }
                        else if (isChosen) { cls = "border-rose-400 bg-rose-50 text-rose-900"; dotCls = "bg-rose-400 text-white"; }
                        else { cls = "border-black/6 bg-black/[0.01] text-black/25"; }
                      }
                      return (
                        <button
                          key={oi}
                          type="button"
                          onClick={() => pick(q.id, oi)}
                          disabled={isAnswered}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${cls} disabled:cursor-default`}
                        >
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${dotCls}`}>
                            {isAnswered && isTheCorrect ? "✓" : isAnswered && isChosen ? "✗" : LETTER[oi]}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div className={`mt-3 rounded-xl px-4 py-2.5 text-sm ${
                      selected === q.correctIndex
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                        : "bg-rose-50 text-rose-800 border border-rose-100"
                    }`}>
                      <span className="font-black">{selected === q.correctIndex ? "Correct! " : "Incorrect. "}</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={showResults}
              disabled={answeredCount === 0}
              className="mt-2 w-full rounded-2xl bg-[#F5DA20] py-4 text-sm font-black text-black hover:opacity-90 disabled:opacity-30 transition"
            >
              See results →
            </button>
          </section>

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/70 backdrop-blur p-4">
              <div className="text-xs font-semibold text-black/35">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/8 bg-black/[0.02] flex items-center justify-center text-black/25 text-sm">
                300 × 600
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
