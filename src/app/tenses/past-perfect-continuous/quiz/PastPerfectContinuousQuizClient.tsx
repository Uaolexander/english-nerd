"use client";
import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { PASTPERFCONT_SPEED_QUESTIONS, PASTPERFCONT_PDF_CONFIG } from "../pastPerfContSharedData";
import TenseRecommendations from "@/components/TenseRecommendations";

type MCQ = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};
type ExSet = {
  no: 1 | 2 | 3 | 4;
  title: string;
  instructions: string;
  questions: MCQ[];
};

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Set 1 — Mixed Forms (Affirmative / Negative / Questions)",
    instructions:
      "Choose the correct Past Perfect Continuous form. The set mixes affirmative (had been + -ing), negative (hadn't been + -ing), and question forms (Had … been + -ing?).",
    questions: [
      {
        id: "q1-1",
        prompt: "She ___ waiting for an hour when he finally arrived.",
        options: ["had been waiting", "has been waiting", "was waiting", "had waited"],
        correctIndex: 0,
        explanation: "Past Perfect Continuous: had been waiting — duration up to a past moment.",
      },
      {
        id: "q1-2",
        prompt: "He ___ working all morning, so he felt refreshed after the break.",
        options: ["had been working", "hadn't been working", "was working", "had worked"],
        correctIndex: 1,
        explanation: "hadn't been working — negative PPC; the break made him feel refreshed because he had NOT been working (he was resting).",
      },
      {
        id: "q1-3",
        prompt: "___ they playing football when you arrived at the park?",
        options: ["Were", "Had they been", "Did they be", "Have they been"],
        correctIndex: 1,
        explanation: "Had they been playing? — PPC question: Had + subject + been + -ing.",
      },
      {
        id: "q1-4",
        prompt: "The children ___ sleeping when the storm began.",
        options: ["had been sleeping", "hadn't been sleeping", "had slept", "were sleeping"],
        correctIndex: 0,
        explanation: "had been sleeping — ongoing action in progress before the storm began.",
      },
      {
        id: "q1-5",
        prompt: "___ she studying before the exam, or did she just guess?",
        options: ["Was", "Had she been", "Has she been", "Did she been"],
        correctIndex: 1,
        explanation: "Had she been studying? — PPC question form.",
      },
      {
        id: "q1-6",
        prompt: "They ___ arguing before I walked in — the room was completely calm.",
        options: ["had been arguing", "hadn't been arguing", "were arguing", "had argued"],
        correctIndex: 1,
        explanation: "hadn't been arguing — the calm room suggests no argument had been taking place.",
      },
      {
        id: "q1-7",
        prompt: "I ___ running for about 20 minutes when it started to rain.",
        options: ["was running", "had been running", "had run", "have been running"],
        correctIndex: 1,
        explanation: "had been running — duration of activity before another past event.",
      },
      {
        id: "q1-8",
        prompt: "___ you living abroad before you moved back home?",
        options: ["Were", "Did", "Had you been", "Have you been"],
        correctIndex: 2,
        explanation: "Had you been living? — PPC question: Had + subject + been + -ing.",
      },
      {
        id: "q1-9",
        prompt: "He ___ eating well, so his energy levels were very low.",
        options: ["had been eating", "hadn't been eating", "was eating", "didn't eat"],
        correctIndex: 1,
        explanation: "hadn't been eating well — the negative PPC explains the low energy levels.",
      },
      {
        id: "q1-10",
        prompt: "We ___ talking for hours when the café finally closed.",
        options: ["were talking", "had been talking", "had talked", "have been talking"],
        correctIndex: 1,
        explanation: "had been talking — ongoing duration that led up to a past moment.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Set 2 — Duration & Result",
    instructions:
      "Choose the best form to describe a visible result or duration before a past event. Pay attention to context clues like 'because', 'so', time expressions.",
    questions: [
      {
        id: "q2-1",
        prompt: "Her eyes were red. She ___ crying.",
        options: ["was", "has been", "had been", "had"],
        correctIndex: 2,
        explanation: "had been crying — the red eyes are a visible result of a past continuous action.",
      },
      {
        id: "q2-2",
        prompt: "Why were you so tired? ___ you running?",
        options: ["Were", "Had you been", "Have you been", "Did you be"],
        correctIndex: 1,
        explanation: "Had you been running? — PPC question asking about a past ongoing activity.",
      },
      {
        id: "q2-3",
        prompt: "He was covered in paint. He ___ decorating all day.",
        options: ["had decorated", "was decorating", "had been decorating", "decorated"],
        correctIndex: 2,
        explanation: "had been decorating — the paint is evidence of a prolonged past activity.",
      },
      {
        id: "q2-4",
        prompt: "The ground was wet because it ___ raining.",
        options: ["had rained", "had been raining", "was raining", "has been raining"],
        correctIndex: 1,
        explanation: "had been raining — continuous rain in the past explains the wet ground.",
      },
      {
        id: "q2-5",
        prompt: "She ___ waiting for the bus for 30 minutes when it finally came.",
        options: ["was waiting", "had waited", "has been waiting", "had been waiting"],
        correctIndex: 3,
        explanation: "had been waiting — duration (30 minutes) leading up to a past completed event.",
      },
      {
        id: "q2-6",
        prompt: "His hands were shaking. ___ he holding something heavy?",
        options: ["Was", "Has", "Had he been", "Did he been"],
        correctIndex: 2,
        explanation: "Had he been holding? — PPC question asking about the cause of a past result.",
      },
      {
        id: "q2-7",
        prompt: "I was exhausted because I ___ working since 6 a.m.",
        options: ["worked", "was working", "had been working", "have been working"],
        correctIndex: 2,
        explanation: "had been working — PPC with 'since' explains the cause of past exhaustion.",
      },
      {
        id: "q2-8",
        prompt: "The kitchen smelled great because she ___ baking all morning.",
        options: ["had baked", "baked", "was baking", "had been baking"],
        correctIndex: 3,
        explanation: "had been baking — continuous activity explains the lingering smell.",
      },
      {
        id: "q2-9",
        prompt: "How long ___ they been arguing before you stepped in?",
        options: ["have", "were", "had", "did"],
        correctIndex: 2,
        explanation: "How long had they been arguing? — PPC question with 'how long'.",
      },
      {
        id: "q2-10",
        prompt: "My back hurt because I ___ sitting at my desk for 5 hours.",
        options: ["sat", "was sitting", "had sat", "had been sitting"],
        correctIndex: 3,
        explanation: "had been sitting — duration of activity explains the past result (back pain).",
      },
    ],
  },
  3: {
    no: 3,
    title: "Set 3 — Past Perfect Continuous vs Past Perfect",
    instructions:
      "Choose between 'had been + -ing' (ongoing duration/process) and 'had + past participle' (completed result). Read the context carefully.",
    questions: [
      {
        id: "q3-1",
        prompt: "By noon, he ___ the report. (completed action, specific result)",
        options: ["had been finishing", "had finished", "was finishing", "finished"],
        correctIndex: 1,
        explanation: "had finished — Past Perfect for a completed action with a specific result.",
      },
      {
        id: "q3-2",
        prompt: "By noon, she ___ on the phone for 3 hours. (duration)",
        options: ["talked", "had talked", "had been talking", "was talking"],
        correctIndex: 2,
        explanation: "had been talking — PPC for an ongoing activity with emphasis on duration.",
      },
      {
        id: "q3-3",
        prompt: "She was nervous because she ___ never spoken in public before. (experience, not duration)",
        options: ["had been speaking", "had spoken", "was speaking", "spoke"],
        correctIndex: 1,
        explanation: "had never spoken — Past Perfect for experience/result, not duration.",
      },
      {
        id: "q3-4",
        prompt: "He was sweating because he ___ for an hour. (duration explains result)",
        options: ["had run", "ran", "had been running", "was running"],
        correctIndex: 2,
        explanation: "had been running — PPC; the hour of running caused the sweating.",
      },
      {
        id: "q3-5",
        prompt: "They ___ three cups of coffee by the time the meeting started. (completed quantity)",
        options: ["had been drinking", "have drunk", "had drunk", "drank"],
        correctIndex: 2,
        explanation: "had drunk — Past Perfect for a completed number/quantity ('three cups').",
      },
      {
        id: "q3-6",
        prompt: "I was tired because I ___ all night. (continuous activity causing past result)",
        options: ["hadn't slept", "had been studying", "had studied", "didn't study"],
        correctIndex: 1,
        explanation: "had been studying — PPC; the ongoing activity caused the tiredness.",
      },
      {
        id: "q3-7",
        prompt: "By the time I got there, she ___ two chapters. (countable result)",
        options: ["had been reading", "had read", "was reading", "read"],
        correctIndex: 1,
        explanation: "had read — Past Perfect; 'two chapters' is a completed countable result.",
      },
      {
        id: "q3-8",
        prompt: "The floor was wet because someone ___ mopping it. (process in progress)",
        options: ["had mopped", "mopped", "had been mopping", "was mopped"],
        correctIndex: 2,
        explanation: "had been mopping — PPC; the ongoing process explains the wet floor.",
      },
      {
        id: "q3-9",
        prompt: "She ___ the letter, so she knew exactly what to say. (completed = result)",
        options: ["had been reading", "was reading", "had read", "read"],
        correctIndex: 2,
        explanation: "had read — Past Perfect; reading was completed, giving her knowledge.",
      },
      {
        id: "q3-10",
        prompt: "The team ___ for the match since January. (duration up to a past point)",
        options: ["had trained", "trained", "was training", "had been training"],
        correctIndex: 3,
        explanation: "had been training — PPC with 'since' for duration up to a past point.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Set 4 — Mixed Hard (All Forms + Common Errors)",
    instructions:
      "Choose the correct form. Options include Past Simple, Past Continuous, Past Perfect, and Past Perfect Continuous. Pay attention to time expressions and context.",
    questions: [
      {
        id: "q4-1",
        prompt: "She ___ all day, so her voice was hoarse.",
        options: ["was singing", "has been singing", "had been singing", "had sung"],
        correctIndex: 2,
        explanation: "had been singing — PPC; continuous past activity explains the hoarse voice.",
      },
      {
        id: "q4-2",
        prompt: "He hadn't been sleeping well, so he ___ very tired.",
        options: ["was", "has been", "had been", "is"],
        correctIndex: 0,
        explanation: "was — Past Simple for the resulting state at a past moment.",
      },
      {
        id: "q4-3",
        prompt: "___ they been waiting long when you got there?",
        options: ["Have", "Were", "Did", "Had"],
        correctIndex: 3,
        explanation: "Had they been waiting? — PPC question: Had + subject + been + -ing.",
      },
      {
        id: "q4-4",
        prompt: "By the time the ambulance arrived, the doctors ___ treating the patient for 20 minutes.",
        options: ["were treating", "have been treating", "had treated", "had been treating"],
        correctIndex: 3,
        explanation: "had been treating — PPC for duration (20 minutes) up to a past moment.",
      },
      {
        id: "q4-5",
        prompt: "She said she ___ trying to reach him all morning.",
        options: ["has been", "was", "had been", "is"],
        correctIndex: 2,
        explanation: "had been trying — PPC in reported speech (backshift of 'has been trying').",
      },
      {
        id: "q4-6",
        prompt: "I couldn't concentrate because the neighbours ___ drilling for hours.",
        options: ["drilled", "were drilling", "had drilled", "had been drilling"],
        correctIndex: 3,
        explanation: "had been drilling — PPC; the ongoing noise explains the inability to concentrate.",
      },
      {
        id: "q4-7",
        prompt: "How long ___ you been learning English before you took the exam?",
        options: ["have", "were", "had", "did"],
        correctIndex: 2,
        explanation: "How long had you been learning? — PPC question with 'how long'.",
      },
      {
        id: "q4-8",
        prompt: "The phone battery died because he ___ streaming videos.",
        options: ["streamed", "had streamed", "was streaming", "had been streaming"],
        correctIndex: 3,
        explanation: "had been streaming — PPC; continuous activity drained the battery.",
      },
      {
        id: "q4-9",
        prompt: "She ___ playing tennis competitively since childhood, but she retired last year.",
        options: ["had been playing", "was playing", "played", "has been playing"],
        correctIndex: 0,
        explanation: "had been playing — PPC with 'since' for duration up to a past point (retirement).",
      },
      {
        id: "q4-10",
        prompt: "They ___ argue — they were actually laughing when I came in.",
        options: ["had been arguing", "hadn't been arguing", "were arguing", "argued"],
        correctIndex: 1,
        explanation: "hadn't been arguing — negative PPC; the laughter contradicts any argument.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Mixed Forms",
  2: "Duration + Result",
  3: "PPC vs PP",
  4: "Mixed Hard",
};

export default function PastPerfectContinuousQuizClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const isPro = useIsPro();
  const current = SETS[exNo];

  const { save } = useProgress();

  async function handlePDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(PASTPERFCONT_PDF_CONFIG); } finally { setPdfLoading(false); }
  }

  useEffect(() => {
    if (checked && score) {
      save(exNo, score.percent, score.total);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const score = useMemo(() => {
    if (!checked) return null;
    let correct = 0;
    for (const q of current.questions) {
      if (answers[q.id] === q.correctIndex) correct++;
    }
    const total = current.questions.length;
    return { correct, total, percent: Math.round((correct / total) * 100) };
  }, [checked, current, answers]);

  function reset() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked(false);
    setAnswers({});
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setAnswers({});
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/past-perfect-continuous">Past Perfect Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Multiple Choice</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Perfect Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">
              Quiz
            </span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">
            Medium
          </span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">
            B2
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          40 multiple-choice questions across four sets: mixed forms (had been / hadn&apos;t been / Had … been?),
          duration and result, PPC vs Past Perfect, and mixed hard.
        </p>

        {/* Layout */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          {/* Left column */}
          {isPro ? (
            <div className=""><SpeedRound gameId="pastperfcont-quiz" subject="Past Perfect Continuous" questions={PASTPERFCONT_SPEED_QUESTIONS} variant="sidebar" /></div>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}

          {/* Main content */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button
                onClick={() => setTab("exercises")}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}
              >
                Exercises
              </button>
              <button
                onClick={() => setTab("explanation")}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}
              >
                Explanation
              </button>
              <PDFButton onDownload={handlePDF} loading={pdfLoading} />
              <div className="ml-auto hidden sm:flex items-center gap-2">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => switchSet(n)}
                    title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {tab === "exercises" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-black text-slate-900">{current.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">{current.instructions}</p>
                    <div className="mt-3 flex sm:hidden items-center gap-2">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3, 4] as const).map((n) => (
                        <button
                          key={n}
                          onClick={() => switchSet(n)}
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 space-y-5">
                    {current.questions.map((q, idx) => {
                      const chosen = answers[q.id] ?? null;
                      const isCorrect = checked && chosen === q.correctIndex;
                      const isWrong = checked && chosen !== null && chosen !== q.correctIndex;
                      const noAnswer = checked && chosen === null;
                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => (
                                  <label
                                    key={oi}
                                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition ${chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"} ${checked ? "cursor-default" : ""}`}
                                  >
                                    <input
                                      type="radio"
                                      name={q.id}
                                      disabled={checked}
                                      checked={chosen === oi}
                                      onChange={() => setAnswers((p) => ({ ...p, [q.id]: oi }))}
                                      className="accent-[#F5DA20]"
                                    />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && (
                                    <div className="text-emerald-700 font-semibold">✅ Correct</div>
                                  )}
                                  {isWrong && (
                                    <div className="text-red-700 font-semibold">❌ Wrong</div>
                                  )}
                                  {noAnswer && (
                                    <div className="text-amber-700 font-semibold">⚠ No answer</div>
                                  )}
                                  <div className="mt-1.5 text-slate-600">
                                    <b className="text-slate-900">Correct answer:</b>{" "}
                                    {q.options[q.correctIndex]} — {q.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex flex-wrap gap-3 items-center">
                      {!checked ? (
                        <button
                          onClick={() => {
                            setChecked(true);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
                        >
                          Check Answers
                        </button>
                      ) : (
                        <button
                          onClick={reset}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition"
                        >
                          Try Again
                        </button>
                      )}
                      {checked && exNo < 4 && (
                        <button
                          onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition"
                        >
                          Next Exercise →
                        </button>
                      )}
                    </div>
                    {score && (
                      <div
                        className={`rounded-2xl border p-4 ${score.percent >= 80 ? "border-emerald-200 bg-emerald-50" : score.percent >= 50 ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div
                              className={`text-3xl font-black ${score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"}`}
                            >
                              {score.percent}%
                            </div>
                            <div className="mt-0.5 text-sm text-slate-600">
                              {score.correct} out of {score.total} correct
                            </div>
                          </div>
                          <div className="text-3xl">
                            {score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}
                          </div>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${score.percent}%` }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          {score.percent >= 80
                            ? "Excellent! Move on to the next exercise."
                            : score.percent >= 50
                            ? "Good effort! Review the wrong answers and try once more."
                            : "Keep practising — check the Explanation tab and try again."}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <PastPerfectContinuousExplanation />
              )}
            </div>
          </section>

          {/* Right column */}
          {isPro ? (
            <TenseRecommendations tense="past-perfect-continuous" />
          ) : (
            <AdUnit variant="sidebar-light" />
          )}
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/past-perfect-continuous"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← All Past Perfect Continuous
          </a>
          <a
            href="/tenses/past-perfect-continuous/fill-in-blank"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: Fill in the Blank →
          </a>
        </div>
      </div>
    </div>
  );
}

function Formula({ parts }: { parts: Array<{ text: string; color?: string }> }) {
  const colors: Record<string, string> = {
    sky: "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) => (
        <span
          key={i}
          className={`rounded-lg px-2.5 py-1 text-xs font-black border ${colors[p.color ?? "slate"]}`}
        >
          {p.text}
        </span>
      ))}
    </div>
  );
}

function Ex({ en }: { en: string }) {
  return (
    <div className="rounded-xl bg-white border border-black/8 px-3 py-2.5">
      <div className="font-semibold text-slate-900 text-sm">{en}</div>
    </div>
  );
}

function PastPerfectContinuousExplanation() {
  return (
    <div className="space-y-8">
      {/* 3 gradient formula cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">
            + Affirmative
          </span>
          <Formula
            parts={[
              { text: "Subject", color: "sky" },
              { text: "had been", color: "yellow" },
              { text: "verb + -ing", color: "green" },
              { text: ".", color: "slate" },
            ]}
          />
          <Ex en="She had been waiting for 2 hours.  ·  They had been studying.  ·  He had been running." />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">
            − Negative
          </span>
          <Formula
            parts={[
              { text: "Subject", color: "sky" },
              { text: "hadn't been", color: "red" },
              { text: "verb + -ing", color: "green" },
              { text: ".", color: "slate" },
            ]}
          />
          <Ex en="He hadn't been sleeping well.  ·  We hadn't been expecting that.  ·  She hadn't been trying." />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">
            ? Question
          </span>
          <Formula
            parts={[
              { text: "Had", color: "violet" },
              { text: "subject", color: "sky" },
              { text: "been", color: "orange" },
              { text: "verb + -ing", color: "green" },
              { text: "?", color: "slate" },
            ]}
          />
          <Ex en="Had they been waiting long?  ·  Had she been crying?  ·  Had he been working all night?" />
        </div>
      </div>

      {/* When to use */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
          When to use Past Perfect Continuous
        </div>
        <div className="space-y-3">
          {[
            {
              label: "Ongoing action before another past action",
              color: "violet",
              examples: [
                "She had been waiting for 2 hours when he arrived.",
                "He had been reading when the lights went out.",
                "They had been arguing before I walked in.",
              ],
            },
            {
              label: "Duration up to a past point",
              color: "sky",
              examples: [
                "By noon, she had been on the phone for 3 hours.",
                "He had been working there for 10 years when he retired.",
                "We had been driving for 5 hours by the time we stopped.",
              ],
            },
            {
              label: "Explaining why something was true (result visible in the past)",
              color: "green",
              examples: [
                "He was tired because he had been working all night.",
                "Her eyes were red because she had been crying.",
                "The ground was wet because it had been raining.",
              ],
            },
            {
              label: "How long? questions in the past",
              color: "yellow",
              examples: [
                "How long had you been studying before the exam?",
                "Had they been waiting long when you arrived?",
                "How long had she been living there?",
              ],
            },
          ].map(({ label, color, examples }) => {
            const borderMap: Record<string, string> = {
              violet: "border-violet-200 bg-violet-50/50",
              sky: "border-sky-200 bg-sky-50/50",
              green: "border-emerald-200 bg-emerald-50/50",
              yellow: "border-amber-200 bg-amber-50/50",
            };
            const badgeMap: Record<string, string> = {
              violet: "bg-violet-100 text-violet-800 border-violet-200",
              sky: "bg-sky-100 text-sky-800 border-sky-200",
              green: "bg-emerald-100 text-emerald-800 border-emerald-200",
              yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
            };
            return (
              <div key={label} className={`rounded-xl border p-4 ${borderMap[color]}`}>
                <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-black mb-2 ${badgeMap[color]}`}>
                  {label}
                </span>
                <div className="space-y-1">
                  {examples.map((ex) => (
                    <Ex key={ex} en={ex} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PPC vs PP table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
          Past Perfect Continuous vs Past Perfect
        </div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5">
                <th className="px-4 py-2.5 font-black text-left text-emerald-700">Past Perfect Continuous</th>
                <th className="px-4 py-2.5 font-black text-left text-violet-700">Past Perfect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Focus on duration / process", "Focus on completion / result"],
                ["had been working (ongoing)", "had worked (finished)"],
                ["She had been reading for hours.", "She had read three chapters."],
                ["used with for / since / how long", "used with already / just / never / yet"],
              ].map(([a, b], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}>
                  <td className="px-4 py-2.5 text-slate-700">{a}</td>
                  <td className="px-4 py-2.5 text-slate-700">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="font-black mb-1">⚠ Stative verbs — no continuous form</div>
        <p>
          Verbs like <b>know, believe, understand, want, love, hate, need</b> do not use the
          continuous form. Use Past Perfect instead: <b>She had known him for years</b> (not
          &ldquo;had been knowing&rdquo;).
        </p>
      </div>
    </div>
  );
}
