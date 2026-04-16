"use client";
import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { PASTPERF_SPEED_QUESTIONS, PASTPERF_PDF_CONFIG } from "../pastPerfSharedData";
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
    title: "Set 1 — Affirmative",
    instructions:
      "Choose the correct auxiliary to complete each sentence in the Past Perfect affirmative (had + past participle).",
    questions: [
      {
        id: "q1-1",
        prompt: "She ___ already left when I arrived.",
        options: ["had", "have", "was", "did"],
        correctIndex: 0,
        explanation: "Past Perfect affirmative: had + past participle (left).",
      },
      {
        id: "q1-2",
        prompt: "They ___ finished the project before the deadline.",
        options: ["have", "had", "did", "were"],
        correctIndex: 1,
        explanation: "Had + past participle (finished) = Past Perfect.",
      },
      {
        id: "q1-3",
        prompt: "By the time he called, I ___ eaten dinner.",
        options: ["have", "was", "had", "did"],
        correctIndex: 2,
        explanation: "'By the time' signals Past Perfect: had eaten.",
      },
      {
        id: "q1-4",
        prompt: "We ___ never seen anything like it before.",
        options: ["did", "have", "were", "had"],
        correctIndex: 3,
        explanation: "Past Perfect with 'never': had never seen.",
      },
      {
        id: "q1-5",
        prompt: "He ___ lived in Paris for three years before moving to London.",
        options: ["had", "have", "has", "was"],
        correctIndex: 0,
        explanation: "Action completed before another past action: had lived.",
      },
      {
        id: "q1-6",
        prompt: "The children ___ gone to bed before their parents came home.",
        options: ["have", "did", "had", "were"],
        correctIndex: 2,
        explanation: "Past Perfect: had gone — action before another past event.",
      },
      {
        id: "q1-7",
        prompt: "She told me she ___ already heard the news.",
        options: ["has", "had", "have", "did"],
        correctIndex: 1,
        explanation: "Reported speech backshift: told → had heard.",
      },
      {
        id: "q1-8",
        prompt: "By 2010, he ___ written three novels.",
        options: ["had", "has", "was", "did"],
        correctIndex: 0,
        explanation: "'By [past time]' + Past Perfect: had written.",
      },
      {
        id: "q1-9",
        prompt: "I ___ just finished packing when the taxi arrived.",
        options: ["have", "did", "was", "had"],
        correctIndex: 3,
        explanation: "'Just' with Past Perfect: had just finished.",
      },
      {
        id: "q1-10",
        prompt: "After she ___ read the letter, she started to cry.",
        options: ["has", "was", "had", "did"],
        correctIndex: 2,
        explanation: "Action before another past action: had read.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Set 2 — Negative",
    instructions:
      "Choose the correct negative Past Perfect form to complete each sentence.",
    questions: [
      {
        id: "q2-1",
        prompt: "He ___ seen her before that day.",
        options: ["hadn't", "haven't", "didn't", "wasn't"],
        correctIndex: 0,
        explanation: "Past Perfect negative: hadn't + past participle (seen).",
      },
      {
        id: "q2-2",
        prompt: "They ___ met each other before the conference.",
        options: ["haven't", "didn't", "hadn't", "weren't"],
        correctIndex: 2,
        explanation: "Negative Past Perfect: hadn't met.",
      },
      {
        id: "q2-3",
        prompt: "She ___ eaten anything since breakfast, so she was starving.",
        options: ["hadn't", "haven't", "didn't", "wasn't"],
        correctIndex: 0,
        explanation: "Past Perfect negative: hadn't eaten.",
      },
      {
        id: "q2-4",
        prompt: "I ___ heard that song before, but I loved it immediately.",
        options: ["didn't", "haven't", "wasn't", "hadn't"],
        correctIndex: 3,
        explanation: "Negative Past Perfect with 'before': hadn't heard.",
      },
      {
        id: "q2-5",
        prompt: "We ___ finished the report when the boss asked for it.",
        options: ["haven't", "hadn't", "didn't", "weren't"],
        correctIndex: 1,
        explanation: "Hadn't finished — not completed before the past moment.",
      },
      {
        id: "q2-6",
        prompt: "He realised he ___ brought his wallet.",
        options: ["didn't", "hasn't", "hadn't", "wasn't"],
        correctIndex: 2,
        explanation: "Hadn't brought — realised is the main past tense here.",
      },
      {
        id: "q2-7",
        prompt: "By the time the film started, they ___ arrived yet.",
        options: ["haven't", "hadn't", "didn't", "weren't"],
        correctIndex: 1,
        explanation: "'By the time' + Past Perfect negative: hadn't arrived.",
      },
      {
        id: "q2-8",
        prompt: "She ___ studied English before she moved to London.",
        options: ["hasn't", "didn't", "hadn't", "wasn't"],
        correctIndex: 2,
        explanation: "Past Perfect negative: hadn't studied.",
      },
      {
        id: "q2-9",
        prompt: "I told him I ___ seen that film yet.",
        options: ["haven't", "hadn't", "didn't", "wasn't"],
        correctIndex: 1,
        explanation: "Reported speech backshift: haven't → hadn't.",
      },
      {
        id: "q2-10",
        prompt: "They ___ spoken to each other for years before the reunion.",
        options: ["didn't", "haven't", "weren't", "hadn't"],
        correctIndex: 3,
        explanation: "Past Perfect negative: hadn't spoken — before another past event.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Set 3 — Questions & Short Answers",
    instructions:
      "Choose the correct word to form a Past Perfect question or short answer.",
    questions: [
      {
        id: "q3-1",
        prompt: "___ they finished before you arrived?",
        options: ["Had", "Have", "Did", "Was"],
        correctIndex: 0,
        explanation: "Past Perfect question: Had + subject + past participle.",
      },
      {
        id: "q3-2",
        prompt: "___ she ever been to Japan before that trip?",
        options: ["Did", "Has", "Had", "Was"],
        correctIndex: 2,
        explanation: "Had + subject + past participle for Past Perfect questions.",
      },
      {
        id: "q3-3",
        prompt: "Had you met him before? — Yes, I ___.",
        options: ["did", "had", "was", "have"],
        correctIndex: 1,
        explanation: "Short answer for Past Perfect: Yes, I had.",
      },
      {
        id: "q3-4",
        prompt: "___ the train already left when you got to the station?",
        options: ["Has", "Did", "Was", "Had"],
        correctIndex: 3,
        explanation: "Past Perfect question with 'already': Had + subject + past participle.",
      },
      {
        id: "q3-5",
        prompt: "Had they eaten before the party? — No, they ___.",
        options: ["didn't", "hadn't", "haven't", "weren't"],
        correctIndex: 1,
        explanation: "Short answer for Past Perfect negative: No, they hadn't.",
      },
      {
        id: "q3-6",
        prompt: "___ he finished his homework before dinner?",
        options: ["Has", "Did", "Had", "Was"],
        correctIndex: 2,
        explanation: "Past Perfect question: Had + subject + past participle.",
      },
      {
        id: "q3-7",
        prompt: "Had she lived there before? — Yes, she ___.",
        options: ["did", "was", "had", "has"],
        correctIndex: 2,
        explanation: "Short answer: Yes, she had.",
      },
      {
        id: "q3-8",
        prompt: "___ you ever tried sushi before last night?",
        options: ["Did", "Had", "Have", "Were"],
        correctIndex: 1,
        explanation: "'Before last night' — specific past reference needs Past Perfect: Had.",
      },
      {
        id: "q3-9",
        prompt: "Had they read the instructions? — No, they ___.",
        options: ["didn't", "weren't", "hadn't", "haven't"],
        correctIndex: 2,
        explanation: "Negative short answer: No, they hadn't.",
      },
      {
        id: "q3-10",
        prompt: "___ the meeting started by the time you arrived?",
        options: ["Did", "Was", "Has", "Had"],
        correctIndex: 3,
        explanation: "'By the time' triggers Past Perfect: Had the meeting started?",
      },
    ],
  },
  4: {
    no: 4,
    title: "Set 4 — Mixed (PP vs Past Simple + Sequence)",
    instructions:
      "Choose the correct tense form. Some sentences require Past Perfect; others use Past Simple. Pay attention to sequence words like before, after, when, by the time, and already.",
    questions: [
      {
        id: "q4-1",
        prompt: "When I arrived at the party, most people ___ already gone home.",
        options: ["went", "had gone", "have gone", "were going"],
        correctIndex: 1,
        explanation: "'Already' + action before another past event: had gone.",
      },
      {
        id: "q4-2",
        prompt: "She ___ the door and walked outside.",
        options: ["had opened", "opened", "had been opening", "was opened"],
        correctIndex: 1,
        explanation: "Sequential past actions narrated in order use Past Simple: opened.",
      },
      {
        id: "q4-3",
        prompt: "By the time the ambulance arrived, the patient ___ unconscious.",
        options: ["had become", "became", "has become", "was becoming"],
        correctIndex: 0,
        explanation: "'By the time' + state before a past moment: had become.",
      },
      {
        id: "q4-4",
        prompt: "I ___ at home when the earthquake hit.",
        options: ["had been", "was", "have been", "had stayed"],
        correctIndex: 1,
        explanation: "Background state at the same time: was (Past Continuous would also work, but 'was' is the only correct option here).",
      },
      {
        id: "q4-5",
        prompt: "After we ___ all the food, we felt a little sick.",
        options: ["ate", "had eaten", "have eaten", "were eating"],
        correctIndex: 1,
        explanation: "Action completed before a result: had eaten.",
      },
      {
        id: "q4-6",
        prompt: "He ___ his keys, so he couldn't get in.",
        options: ["had lost", "lost", "has lost", "was losing"],
        correctIndex: 0,
        explanation: "Loss happened before 'couldn't get in': had lost.",
      },
      {
        id: "q4-7",
        prompt: "They ___ the film before, so they didn't want to watch it again.",
        options: ["saw", "see", "had seen", "have seen"],
        correctIndex: 2,
        explanation: "Past experience before a past decision: had seen.",
      },
      {
        id: "q4-8",
        prompt: "She ___ the room as soon as she heard the news.",
        options: ["had left", "left", "has left", "was leaving"],
        correctIndex: 1,
        explanation: "Immediate past reaction in sequence: left (Past Simple).",
      },
      {
        id: "q4-9",
        prompt: "Before she became famous, she ___ in a small café.",
        options: ["worked", "had worked", "has worked", "was work"],
        correctIndex: 1,
        explanation: "'Before she became famous' signals Past Perfect: had worked.",
      },
      {
        id: "q4-10",
        prompt: "He said he ___ the report, but it wasn't on my desk.",
        options: ["sent", "has sent", "had sent", "was sending"],
        correctIndex: 2,
        explanation: "Reported speech backshift: said → had sent.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Affirmative",
  2: "Negative",
  3: "Questions",
  4: "Mixed",
};

export default function PastPerfectQuizClient() {
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
    try { await generateLessonPDF(PASTPERF_PDF_CONFIG); } finally { setPdfLoading(false); }
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
          <a className="hover:text-slate-900 transition" href="/tenses/past-perfect">Past Perfect</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Multiple Choice</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">
              Quiz
            </span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">
            Medium
          </span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">
            B1–B2
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          40 multiple-choice questions across four sets: affirmative (had), negative (hadn&apos;t),
          questions + short answers, and mixed including sequence of events.
        </p>

        {/* Layout */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          {/* Left column */}
          {isPro ? (
            <div className=""><SpeedRound gameId="pastperf-quiz" subject="Past Perfect" questions={PASTPERF_SPEED_QUESTIONS} variant="sidebar" /></div>
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
                <PastPerfectExplanation />
              )}
            </div>
          </section>

          {/* Right column */}
          {isPro ? (
            <TenseRecommendations tense="past-perfect" />
          ) : (
            <AdUnit variant="sidebar-light" />
          )}
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/past-perfect"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← All Past Perfect exercises
          </a>
          <a
            href="/tenses/past-perfect/fill-in-blank"
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

function PastPerfectExplanation() {
  return (
    <div className="space-y-8">
      {/* 3 gradient cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">
            + Affirmative
          </span>
          <Formula
            parts={[
              { text: "Subject", color: "sky" },
              { text: "had", color: "yellow" },
              { text: "past participle", color: "green" },
              { text: ".", color: "slate" },
            ]}
          />
          <Ex en="She had left before he arrived.  ·  They had eaten.  ·  It had happened before." />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">
            − Negative
          </span>
          <Formula
            parts={[
              { text: "Subject", color: "sky" },
              { text: "hadn't", color: "red" },
              { text: "past participle", color: "green" },
              { text: ".", color: "slate" },
            ]}
          />
          <Ex en="He hadn't seen it before.  ·  We hadn't met yet.  ·  She hadn't finished." />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">
            ? Question
          </span>
          <Formula
            parts={[
              { text: "Had", color: "violet" },
              { text: "subject", color: "sky" },
              { text: "past participle", color: "green" },
              { text: "?", color: "slate" },
            ]}
          />
          <Ex en="Had they finished?  ·  Had she ever been there?  ·  Had it started?" />
        </div>
      </div>

      {/* When to use */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
          When to use Past Perfect
        </div>
        <div className="space-y-3">
          {[
            {
              label: "Before another past action",
              color: "violet",
              examples: [
                "She had already left when I arrived.",
                "By the time he called, I had eaten.",
                "They had been friends before they met at work.",
              ],
            },
            {
              label: "Reported speech (backshift)",
              color: "sky",
              examples: [
                "He said he had finished the report.",
                "She told me she had never been to Rome.",
                "They explained they had already tried.",
              ],
            },
            {
              label: "Third conditional",
              color: "green",
              examples: [
                "If I had known, I would have helped.",
                "If she had studied, she would have passed.",
                "If we had left earlier, we would have arrived on time.",
              ],
            },
            {
              label: "After wish / if only",
              color: "yellow",
              examples: [
                "I wish I had listened.",
                "If only she had told the truth.",
                "I wish we had seen each other more.",
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

      {/* PP vs Past Simple */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
          Past Perfect vs Past Simple
        </div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5">
                <th className="px-4 py-2.5 font-black text-left text-violet-700">Past Perfect</th>
                <th className="px-4 py-2.5 font-black text-left text-red-700">Past Simple</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Action before another past event", "Action at a specific time in the past"],
                ["By the time, before, after, when + sequence needed", "Yesterday, last week, in 2020, at 5pm"],
                ["She had left before I arrived.", "She left at 8am."],
                ["By the time he called, she had finished.", "She finished and then he called."],
                ["I wish I had known.", "I knew it then."],
              ].map(([pp, ps], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-violet-800 font-mono text-xs">{pp}</td>
                  <td className="px-4 py-2.5 text-red-800 font-mono text-xs">{ps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
          Key words for Past Perfect
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "already",
            "just",
            "never",
            "ever",
            "by the time",
            "before",
            "after",
            "when",
            "as soon as",
            "until",
            "by 5pm",
            "by then",
          ].map((t) => (
            <span
              key={t}
              className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
