"use client";
import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import { useLiveSync } from "@/lib/useLiveSync";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { PASTPERF_SPEED_QUESTIONS, PASTPERF_PDF_CONFIG } from "../pastPerfSharedData";
import TenseRecommendations from "@/components/TenseRecommendations";

type InputQ = {
  id: string;
  prompt: string;
  hint: string;
  correct: string[];
  explanation: string;
};
type ExSet = {
  no: 1 | 2 | 3 | 4;
  title: string;
  instructions: string;
  questions: InputQ[];
};

function normalize(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/\u2019/g, "'")
    .replace(/\u2018/g, "'");
}
function isAccepted(val: string, correct: string[]) {
  const n = normalize(val);
  return correct.some((c) => normalize(c) === n);
}

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Set 1 — Affirmative (had + past participle)",
    instructions:
      "Complete each sentence with the Past Perfect affirmative form of the verb in brackets. Type: had + past participle.",
    questions: [
      {
        id: "f1-1",
        prompt: "She ___ (leave) before he arrived.",
        hint: "had + past participle",
        correct: ["had left"],
        explanation: "had left — Past Perfect of 'leave' (irregular: leave → left).",
      },
      {
        id: "f1-2",
        prompt: "They ___ (finish) the exam by noon.",
        hint: "had + past participle",
        correct: ["had finished"],
        explanation: "had finished — regular verb: finish → finished.",
      },
      {
        id: "f1-3",
        prompt: "By the time we arrived, the film ___ (start).",
        hint: "had + past participle",
        correct: ["had started"],
        explanation: "had started — action before another past moment.",
      },
      {
        id: "f1-4",
        prompt: "He ___ (eat) dinner before the guests came.",
        hint: "had + past participle",
        correct: ["had eaten"],
        explanation: "had eaten — irregular: eat → eaten.",
      },
      {
        id: "f1-5",
        prompt: "I ___ (see) that film three times before last night.",
        hint: "had + past participle",
        correct: ["had seen"],
        explanation: "had seen — irregular: see → seen.",
      },
      {
        id: "f1-6",
        prompt: "She told me she ___ (meet) him before.",
        hint: "had + past participle",
        correct: ["had met"],
        explanation: "had met — reported speech backshift; irregular: meet → met.",
      },
      {
        id: "f1-7",
        prompt: "By 2015, he ___ (live) in five different countries.",
        hint: "had + past participle",
        correct: ["had lived"],
        explanation: "had lived — regular verb; 'by 2015' signals Past Perfect.",
      },
      {
        id: "f1-8",
        prompt: "After she ___ (read) the letter, she smiled.",
        hint: "had + past participle",
        correct: ["had read"],
        explanation: "had read — irregular: read → read (pronounced 'red').",
      },
      {
        id: "f1-9",
        prompt: "They ___ (already / decide) when I called.",
        hint: "had already + past participle",
        correct: ["had already decided"],
        explanation: "had already decided — 'already' goes between had and the past participle.",
      },
      {
        id: "f1-10",
        prompt: "We ___ (never / visit) Paris before that trip.",
        hint: "had never + past participle",
        correct: ["had never visited"],
        explanation: "had never visited — 'never' goes between had and the past participle.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Set 2 — Negative (hadn't + past participle)",
    instructions:
      "Complete each sentence with the Past Perfect negative form of the verb in brackets. Type: hadn't + past participle (or 'had not + past participle' — both accepted).",
    questions: [
      {
        id: "f2-1",
        prompt: "He ___ (eat) anything before the meeting.",
        hint: "hadn't + past participle",
        correct: ["hadn't eaten", "had not eaten"],
        explanation: "hadn't eaten / had not eaten — negative Past Perfect.",
      },
      {
        id: "f2-2",
        prompt: "She ___ (finish) her homework when her mother called.",
        hint: "hadn't + past participle",
        correct: ["hadn't finished", "had not finished"],
        explanation: "hadn't finished — not completed before the past event.",
      },
      {
        id: "f2-3",
        prompt: "They ___ (meet) before the party.",
        hint: "hadn't + past participle",
        correct: ["hadn't met", "had not met"],
        explanation: "hadn't met — irregular: meet → met.",
      },
      {
        id: "f2-4",
        prompt: "I ___ (see) him in years before I ran into him.",
        hint: "hadn't + past participle",
        correct: ["hadn't seen", "had not seen"],
        explanation: "hadn't seen — irregular: see → seen.",
      },
      {
        id: "f2-5",
        prompt: "By the time the doctor arrived, the patient ___ (regain) consciousness.",
        hint: "hadn't + past participle",
        correct: ["hadn't regained", "had not regained"],
        explanation: "hadn't regained — state not yet reached before that past moment.",
      },
      {
        id: "f2-6",
        prompt: "She told me she ___ (hear) the news yet.",
        hint: "hadn't + past participle",
        correct: ["hadn't heard", "had not heard"],
        explanation: "hadn't heard — reported speech backshift; irregular: hear → heard.",
      },
      {
        id: "f2-7",
        prompt: "He ___ (sleep) well for weeks before the holiday.",
        hint: "hadn't + past participle",
        correct: ["hadn't slept", "had not slept"],
        explanation: "hadn't slept — irregular: sleep → slept.",
      },
      {
        id: "f2-8",
        prompt: "We ___ (book) a table, so we had to wait.",
        hint: "hadn't + past participle",
        correct: ["hadn't booked", "had not booked"],
        explanation: "hadn't booked — explains why they had to wait.",
      },
      {
        id: "f2-9",
        prompt: "I wished I ___ (say) that.",
        hint: "hadn't + past participle",
        correct: ["hadn't said", "had not said"],
        explanation: "hadn't said — 'wished I hadn't said' = regret about the past.",
      },
      {
        id: "f2-10",
        prompt: "They ___ (speak) to each other for years before the reconciliation.",
        hint: "hadn't + past participle",
        correct: ["hadn't spoken", "had not spoken"],
        explanation: "hadn't spoken — irregular: speak → spoken.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Set 3 — Questions (Had + subject + past participle?)",
    instructions:
      "Write the Past Perfect question for each prompt. Type: Had + subject + past participle + ?",
    questions: [
      {
        id: "f3-1",
        prompt: "Ask if they finished before you arrived.",
        hint: "Had they …?",
        correct: [
          "had they finished before you arrived?",
          "had they finished?",
          "had they finished before i arrived?",
        ],
        explanation: "Had they finished before you arrived? — Past Perfect question: Had + subject + past participle.",
      },
      {
        id: "f3-2",
        prompt: "Ask if she had ever been to Italy (before that trip).",
        hint: "Had she ever …?",
        correct: [
          "had she ever been to italy?",
          "had she ever been to italy before that trip?",
          "had she ever been to italy before?",
        ],
        explanation: "Had she ever been to Italy? — 'ever' goes between had and the past participle.",
      },
      {
        id: "f3-3",
        prompt: "Ask if he had eaten before the party.",
        hint: "Had he …?",
        correct: ["had he eaten before the party?", "had he eaten?"],
        explanation: "Had he eaten before the party? — standard Past Perfect question.",
      },
      {
        id: "f3-4",
        prompt: "Ask if they had met each other before that day.",
        hint: "Had they …?",
        correct: [
          "had they met each other before that day?",
          "had they met before that day?",
          "had they met each other?",
          "had they met?",
        ],
        explanation: "Had they met each other before that day? — Had + subject + past participle.",
      },
      {
        id: "f3-5",
        prompt: "Ask if the train had already left.",
        hint: "Had the train already …?",
        correct: [
          "had the train already left?",
          "had the train left already?",
        ],
        explanation: "Had the train already left? — 'already' typically goes between had and the past participle.",
      },
      {
        id: "f3-6",
        prompt: "Ask if she had spoken to the manager.",
        hint: "Had she …?",
        correct: ["had she spoken to the manager?", "had she spoken to him?"],
        explanation: "Had she spoken to the manager? — irregular: speak → spoken.",
      },
      {
        id: "f3-7",
        prompt: "Ask if he had seen the film before.",
        hint: "Had he …?",
        correct: ["had he seen the film before?", "had he seen it before?", "had he seen the film?"],
        explanation: "Had he seen the film before? — irregular: see → seen.",
      },
      {
        id: "f3-8",
        prompt: "Ask if they had finished the report by Friday.",
        hint: "Had they …?",
        correct: ["had they finished the report by friday?", "had they finished the report?"],
        explanation: "Had they finished the report by Friday? — 'by Friday' = specific past deadline.",
      },
      {
        id: "f3-9",
        prompt: "Ask if I had ever tried Thai food (before that).",
        hint: "Had I ever …?",
        correct: [
          "had i ever tried thai food before that?",
          "had you ever tried thai food before that?",
          "had i ever tried thai food?",
          "had you ever tried thai food?",
        ],
        explanation: "Had you ever tried Thai food before that? — first/second person both accepted.",
      },
      {
        id: "f3-10",
        prompt: "Ask if the meeting had started by the time you arrived.",
        hint: "Had the meeting …?",
        correct: [
          "had the meeting started by the time you arrived?",
          "had the meeting started?",
          "had the meeting started by the time i arrived?",
        ],
        explanation: "Had the meeting started by the time you arrived? — 'by the time' + Past Perfect question.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Set 4 — Mixed (had / hadn't / questions)",
    instructions:
      "Complete each sentence with the correct Past Perfect form — affirmative, negative, or question. Use context clues like before, after, when, by the time, and already.",
    questions: [
      {
        id: "f4-1",
        prompt: "When I got to the cinema, the film ___ (already / start).",
        hint: "had already + past participle",
        correct: ["had already started"],
        explanation: "had already started — 'already' signals completion before a past moment.",
      },
      {
        id: "f4-2",
        prompt: "She ___ (not / finish) cooking when the guests arrived.",
        hint: "hadn't + past participle",
        correct: ["hadn't finished", "had not finished"],
        explanation: "hadn't finished — cooking was still in progress when guests arrived.",
      },
      {
        id: "f4-3",
        prompt: "___ you ___ (ever / try) sushi before last night? (question)",
        hint: "Had you ever …?",
        correct: ["had you ever tried", "had you ever tried sushi before last night?", "had you ever tried sushi?"],
        explanation: "Had you ever tried? — Past Perfect question with 'ever'.",
      },
      {
        id: "f4-4",
        prompt: "By the time he retired, he ___ (work) for the company for 30 years.",
        hint: "had + past participle",
        correct: ["had worked"],
        explanation: "had worked — duration completed before the past reference point.",
      },
      {
        id: "f4-5",
        prompt: "I ___ (not / hear) that song before you played it.",
        hint: "hadn't + past participle",
        correct: ["hadn't heard", "had not heard"],
        explanation: "hadn't heard — first experience; negative before the past event.",
      },
      {
        id: "f4-6",
        prompt: "After they ___ (discuss) the plan, they made a decision.",
        hint: "had + past participle",
        correct: ["had discussed"],
        explanation: "had discussed — action completed before the decision was made.",
      },
      {
        id: "f4-7",
        prompt: "___ she ___ (tell) you about it before the meeting? (question)",
        hint: "Had she …?",
        correct: [
          "had she told",
          "had she told you about it before the meeting?",
          "had she told you?",
        ],
        explanation: "Had she told you? — Past Perfect question.",
      },
      {
        id: "f4-8",
        prompt: "He ___ (never / fly) before that business trip.",
        hint: "had never + past participle",
        correct: ["had never flown"],
        explanation: "had never flown — irregular: fly → flown; 'never' between had and past participle.",
      },
      {
        id: "f4-9",
        prompt: "They ___ (not / save) enough money, so they couldn't buy the house.",
        hint: "hadn't + past participle",
        correct: ["hadn't saved", "had not saved"],
        explanation: "hadn't saved — the lack of savings caused the inability to buy.",
      },
      {
        id: "f4-10",
        prompt: "Before she became a doctor, she ___ (study) biology at university.",
        hint: "had + past participle",
        correct: ["had studied"],
        explanation: "had studied — action completed before another past event.",
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

export default function FillInBlankClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const isPro = useIsPro();
  const current = SETS[exNo];

  const { save } = useProgress();

  const { isLive, broadcast } = useLiveSync((payload) => {
    setInputs(payload.answers as Record<string, string>);
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3 | 4);
  });

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
      if (isAccepted(inputs[q.id] ?? "", q.correct)) correct++;
    }
    const total = current.questions.length;
    return { correct, total, percent: Math.round((correct / total) * 100) };
  }, [checked, current, inputs]);

  function reset() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked(false);
    setInputs({});
    broadcast({ answers: {}, checked: false, exNo });
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setInputs({});
    broadcast({ answers: {}, checked: false, exNo: n });
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
          <span className="text-slate-700 font-medium">Fill in the Blank</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">
              Fill in the Blank
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
          Type the correct Past Perfect form (had + past participle) to complete each sentence.
          40 writing exercises across four sets.
        </p>

        {/* Layout */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          {/* Left column */}
          {isPro ? (
            <div className=""><SpeedRound gameId="pastperf-fill-in-blank" subject="Past Perfect" questions={PASTPERF_SPEED_QUESTIONS} variant="sidebar" /></div>
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
                      const val = inputs[q.id] ?? "";
                      const ok = checked && isAccepted(val, q.correct);
                      const wrong = checked && val.trim().length > 0 && !isAccepted(val, q.correct);
                      const blank = checked && val.trim().length === 0;
                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3 flex items-center gap-2">
                                <input
                                  type="text"
                                  spellCheck={false}
                                  autoComplete="off"
                                  disabled={checked}
                                  value={val}
                                  onChange={(e) => {
                                    const newAnswers = { ...inputs, [q.id]: e.target.value };
                                    setInputs(newAnswers);
                                    broadcast({ answers: newAnswers, checked, exNo });
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !checked) {
                                      setChecked(true);
                                      broadcast({ answers: inputs, checked: true, exNo });
                                      window.scrollTo({ top: 0, behavior: "smooth" });
                                    }
                                  }}
                                  placeholder={q.hint}
                                  className={`flex-1 rounded-xl border px-4 py-2.5 text-sm transition outline-none ${
                                    ok
                                      ? "border-emerald-400 bg-emerald-50"
                                      : wrong
                                      ? "border-red-400 bg-red-50"
                                      : blank
                                      ? "border-amber-400 bg-amber-50"
                                      : "border-black/10 bg-white focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/20"
                                  }`}
                                />
                                {checked && (
                                  <span className="text-lg shrink-0">
                                    {ok ? "✅" : blank ? "⚠️" : "❌"}
                                  </span>
                                )}
                              </div>
                              {checked && (
                                <div className="mt-2 text-sm text-slate-600">
                                  <b className="text-slate-900">Correct:</b> {q.correct[0]} —{" "}
                                  {q.explanation}
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
                            broadcast({ answers: inputs, checked: true, exNo });
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
                        className={`rounded-2xl border p-4 ${
                          score.percent >= 80
                            ? "border-emerald-200 bg-emerald-50"
                            : score.percent >= 50
                            ? "border-amber-200 bg-amber-50"
                            : "border-red-200 bg-red-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div
                              className={`text-3xl font-black ${
                                score.percent >= 80
                                  ? "text-emerald-700"
                                  : score.percent >= 50
                                  ? "text-amber-700"
                                  : "text-red-700"
                              }`}
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
                            className={`h-2 rounded-full transition-all duration-500 ${
                              score.percent >= 80
                                ? "bg-emerald-500"
                                : score.percent >= 50
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
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
            href="/tenses/past-perfect/quiz"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← Quiz
          </a>
          <a
            href="/tenses/past-perfect/spot-the-mistake"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: Spot the Mistake →
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
                <span
                  className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-black mb-2 ${badgeMap[color]}`}
                >
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
