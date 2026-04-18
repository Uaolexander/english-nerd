"use client";

import { useMemo, useState, useEffect } from "react";
import { useLiveSync } from "@/lib/useLiveSync";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { FUTPERF_SPEED_QUESTIONS, FUTPERF_PDF_CONFIG } from "../futPerfSharedData";
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
    title: "Exercise 1 — Single event vs completed before a deadline",
    instructions:
      "Choose 'will + base verb' (Future Simple: a single event at a future time) or 'will have + pp' (Future Perfect: completed before a future deadline). About half of the answers need each form.",
    questions: [
      {
        id: "1-1",
        prompt: "I ___ call you when I'm ready. (single action — promise)",
        options: ["will have called", "will call", "am going to call", "called"],
        correctIndex: 1,
        explanation: "'will call' — Future Simple for a single future action/promise.",
      },
      {
        id: "1-2",
        prompt: "By noon, I ___ called you three times already. (completed before noon)",
        options: ["will call", "will be calling", "will have called", "called"],
        correctIndex: 2,
        explanation: "'will have called' — Future Perfect: the calling is complete before/by noon.",
      },
      {
        id: "1-3",
        prompt: "She ___ arrive at the airport at 6 PM. (scheduled event)",
        options: ["will have arrived", "will be arriving", "will arrive", "arrives"],
        correctIndex: 2,
        explanation: "'will arrive' — Future Simple for a single scheduled event.",
      },
      {
        id: "1-4",
        prompt: "By 6 PM, she ___ already arrived and checked in. (completed before 6 PM)",
        options: ["will arrive", "is arriving", "will have arrived", "arrived"],
        correctIndex: 2,
        explanation: "'will have arrived' — Future Perfect: completion before the 6 PM deadline.",
      },
      {
        id: "1-5",
        prompt: "He ___ finish the project soon. (prediction — single completion)",
        options: ["will have finished", "will finish", "finishes", "is finishing"],
        correctIndex: 1,
        explanation: "'will finish' — Future Simple for a predicted single completion.",
      },
      {
        id: "1-6",
        prompt: "By next week, they ___ finished all the renovations. (deadline)",
        options: ["will finish", "will be finishing", "will have finished", "finished"],
        correctIndex: 2,
        explanation: "'will have finished' — Future Perfect for completion before next week.",
      },
      {
        id: "1-7",
        prompt: "I think the weather ___ improve next week. (simple prediction)",
        options: ["will have improved", "improves", "will improve", "improved"],
        correctIndex: 2,
        explanation: "'will improve' — Future Simple for a simple future prediction.",
      },
      {
        id: "1-8",
        prompt: "By the end of the year, the company ___ hired 50 new employees. (completion before year-end)",
        options: ["will hire", "is hiring", "hired", "will have hired"],
        correctIndex: 3,
        explanation: "'will have hired' — Future Perfect for completion before the end of the year.",
      },
      {
        id: "1-9",
        prompt: "They ___ release the new album in spring. (single planned event)",
        options: ["will have released", "will release", "release", "released"],
        correctIndex: 1,
        explanation: "'will release' — Future Simple for a single planned future event.",
      },
      {
        id: "1-10",
        prompt: "By the time you read this, she ___ already left for the airport. (before you read it)",
        options: ["will leave", "is leaving", "will have left", "left"],
        correctIndex: 2,
        explanation: "'will have left' — Future Perfect: completed before the reading moment.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — 'will finish' vs 'will have finished' in context",
    instructions:
      "Focus on the time reference: use Future Simple when the event happens AT a future time; use Future Perfect when the event is COMPLETED BEFORE a future deadline.",
    questions: [
      {
        id: "2-1",
        prompt: "The builders ___ complete the roof by the end of the month. (deadline = end of month)",
        options: ["will complete", "will be completing", "will have completed", "complete"],
        correctIndex: 2,
        explanation: "'will have completed' — Future Perfect: completion before the end-of-month deadline.",
      },
      {
        id: "2-2",
        prompt: "She ___ graduate next June. (single event in June)",
        options: ["will have graduated", "graduates", "will graduate", "is graduating"],
        correctIndex: 2,
        explanation: "'will graduate' — Future Simple for a single event happening in June.",
      },
      {
        id: "2-3",
        prompt: "By then, he ___ spent all his savings — he needs to be careful.",
        options: ["will spend", "will be spending", "will have spent", "spends"],
        correctIndex: 2,
        explanation: "'will have spent' — Future Perfect: spending is complete before 'then'.",
      },
      {
        id: "2-4",
        prompt: "I expect the results ___ come out on Friday. (at a future point)",
        options: ["will have come", "come", "will come", "came"],
        correctIndex: 2,
        explanation: "'will come out' — Future Simple for a single future event (results coming out).",
      },
      {
        id: "2-5",
        prompt: "By the time we get to the cinema, the film ___ already started. (before we arrive)",
        options: ["will start", "starts", "will have started", "started"],
        correctIndex: 2,
        explanation: "'will have started' — Future Perfect: the film starts before we arrive.",
      },
      {
        id: "2-6",
        prompt: "She ___ move to Berlin next autumn. (single future plan)",
        options: ["will have moved", "will move", "moved", "moves"],
        correctIndex: 1,
        explanation: "'will move' — Future Simple for a single planned future event.",
      },
      {
        id: "2-7",
        prompt: "By 2025, the app ___ gained ten million users. (deadline = 2025)",
        options: ["will gain", "gains", "will be gaining", "will have gained"],
        correctIndex: 3,
        explanation: "'will have gained' — Future Perfect: completion before the 2025 deadline.",
      },
      {
        id: "2-8",
        prompt: "The president ___ give a speech at 8 PM tonight. (scheduled single event)",
        options: ["will have given", "gives", "will give", "gave"],
        correctIndex: 2,
        explanation: "'will give' — Future Simple for a single scheduled event.",
      },
      {
        id: "2-9",
        prompt: "By retirement, she ___ taught thousands of students. (before retirement)",
        options: ["teaches", "will teach", "taught", "will have taught"],
        correctIndex: 3,
        explanation: "'will have taught' — Future Perfect: teaching is complete before/by retirement.",
      },
      {
        id: "2-10",
        prompt: "The library ___ close at 9 PM tomorrow. (single scheduled closing)",
        options: ["will have closed", "will close", "is closing", "closed"],
        correctIndex: 1,
        explanation: "'will close' — Future Simple for a single scheduled event.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Context-based choice",
    instructions:
      "Read the full context and choose the most appropriate form. Some need Future Perfect, some Future Simple, some Future Continuous. Correct answers are varied.",
    questions: [
      {
        id: "3-1",
        prompt: "Don't ring at 7 — I ___ having my piano lesson then. (in progress at 7)",
        options: ["will have", "will be", "have been", "will"],
        correctIndex: 1,
        explanation: "'will be having' — Future Continuous: action in progress at 7 PM ('at 7').",
      },
      {
        id: "3-2",
        prompt: "By 7 PM, I ___ finished my piano lesson. (completed before 7)",
        options: ["will be finishing", "will finish", "will have finished", "finished"],
        correctIndex: 2,
        explanation: "'will have finished' — Future Perfect: the lesson is complete before 7 PM.",
      },
      {
        id: "3-3",
        prompt: "I think it ___ be sunny tomorrow. (simple prediction)",
        options: ["will have been", "will be", "is going to have been", "has been"],
        correctIndex: 1,
        explanation: "'will be' — Future Simple for a simple weather prediction.",
      },
      {
        id: "3-4",
        prompt: "By the time he turns 30, he ___ lived in five different countries.",
        options: ["will live", "will be living", "lived", "will have lived"],
        correctIndex: 3,
        explanation: "'will have lived' — Future Perfect: completed before his 30th birthday.",
      },
      {
        id: "3-5",
        prompt: "At 11 AM tomorrow, she ___ presenting her thesis. (in progress at 11)",
        options: ["will have presented", "will present", "will be presenting", "presents"],
        correctIndex: 2,
        explanation: "'will be presenting' — Future Continuous: action in progress at 11 AM.",
      },
      {
        id: "3-6",
        prompt: "I promise I ___ forget to bring the keys. (negative promise)",
        options: ["won't have forgotten", "won't forget", "will forget", "don't forget"],
        correctIndex: 1,
        explanation: "'won't forget' — Future Simple negative for a promise.",
      },
      {
        id: "3-7",
        prompt: "By the end of this course, you ___ learned over 500 new words.",
        options: ["will learn", "will be learning", "learn", "will have learned"],
        correctIndex: 3,
        explanation: "'will have learned' — Future Perfect: completion before the end of the course.",
      },
      {
        id: "3-8",
        prompt: "The shop ___ open at 9 AM tomorrow. (scheduled single event)",
        options: ["will have opened", "will be opening", "will open", "opens"],
        correctIndex: 2,
        explanation: "'will open' — Future Simple for a scheduled single event.",
      },
      {
        id: "3-9",
        prompt: "When you get there, they ___ still setting up the room. (in progress when you arrive)",
        options: ["will have set up", "will set up", "will be setting up", "set up"],
        correctIndex: 2,
        explanation: "'will be setting up' — Future Continuous: action in progress when another occurs.",
      },
      {
        id: "3-10",
        prompt: "By midnight, the party ___ ended and everyone will have gone home.",
        options: ["will end", "will be ending", "will have ended", "ends"],
        correctIndex: 2,
        explanation: "'will have ended' — Future Perfect: the party is over before/by midnight.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Hard mixed: Future Simple / Continuous / Perfect",
    instructions:
      "This final set mixes all three future forms: Future Simple (will + base), Future Continuous (will be + -ing), and Future Perfect (will have + pp). Choose the most accurate form for each context.",
    questions: [
      {
        id: "4-1",
        prompt: "By the time he's 40, he ___ written his first novel — it's always been his dream.",
        options: ["will write", "will be writing", "will have written", "writes"],
        correctIndex: 2,
        explanation: "'will have written' — Future Perfect: completion before his 40th birthday.",
      },
      {
        id: "4-2",
        prompt: "She ___ start her new job on Monday. (single planned event)",
        options: ["will have started", "will be starting", "will start", "starts"],
        correctIndex: 2,
        explanation: "'will start' — Future Simple for a single planned event.",
      },
      {
        id: "4-3",
        prompt: "At 2 PM on Tuesday, the committee ___ reviewing the proposals. (in progress)",
        options: ["will have reviewed", "will review", "will be reviewing", "reviews"],
        correctIndex: 2,
        explanation: "'will be reviewing' — Future Continuous: action in progress at 2 PM.",
      },
      {
        id: "4-4",
        prompt: "I expect the package ___ arrive by Thursday. (single future event)",
        options: ["will have arrived", "will arrive", "is arriving", "arrives"],
        correctIndex: 1,
        explanation: "'will arrive' — Future Simple for a predicted single event.",
      },
      {
        id: "4-5",
        prompt: "By the time she finishes the project, she ___ worked on it for three years.",
        options: ["will work", "will be working", "will have worked", "worked"],
        correctIndex: 2,
        explanation: "'will have worked' — Future Perfect: three years of work is complete before she finishes.",
      },
      {
        id: "4-6",
        prompt: "This time next year, I ___ travelling around South America. (in progress next year)",
        options: ["will travel", "will have travelled", "will be travelling", "travel"],
        correctIndex: 2,
        explanation: "'will be travelling' — Future Continuous: action in progress at that future point.",
      },
      {
        id: "4-7",
        prompt: "By the next election, the government ___ failed to meet most of its promises.",
        options: ["will fail", "will be failing", "will have failed", "fails"],
        correctIndex: 2,
        explanation: "'will have failed' — Future Perfect: failure is established before the next election.",
      },
      {
        id: "4-8",
        prompt: "He ___ call us when he lands — he always does. (single future action)",
        options: ["will have called", "will be calling", "will call", "calls"],
        correctIndex: 2,
        explanation: "'will call' — Future Simple for a single expected future action.",
      },
      {
        id: "4-9",
        prompt: "Don't interrupt at noon — the scientists ___ conducting their main experiment then.",
        options: ["will have conducted", "will conduct", "will be conducting", "conduct"],
        correctIndex: 2,
        explanation: "'will be conducting' — Future Continuous: in progress at noon.",
      },
      {
        id: "4-10",
        prompt: "By the time this generation retires, AI ___ transformed every industry.",
        options: ["will transform", "will be transforming", "transforms", "will have transformed"],
        correctIndex: 3,
        explanation: "'will have transformed' — Future Perfect: transformation is complete before retirement.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Single vs deadline",
  2: "will vs will have",
  3: "Context-based",
  4: "All 3 forms",
};

export default function FuturePerfectVsSimpleClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const isPro = useIsPro();

  const current = SETS[exNo];

  const { broadcast } = useLiveSync((payload) => {
    setAnswers(payload.answers as Record<string, number | null>);
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3 | 4);
  });

  const { save } = useProgress();

  async function handlePDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(FUTPERF_PDF_CONFIG); } finally { setPdfLoading(false); }
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
    broadcast({ answers: {}, checked: false, exNo });
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setAnswers({});
    broadcast({ answers: {}, checked: false, exNo: n });
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a><span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a><span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/future-perfect">Future Perfect</a><span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Perfect vs Simple Future</span>
        </div>
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Future Perfect <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Perfect vs Simple Future</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Upper-intermediate</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">B2</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">40 questions contrasting Future Perfect (will have done), Future Simple (will do), and Future Continuous (will be doing). Mixed answers throughout.</p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          {isPro ? (
            <div className=""><SpeedRound gameId="futperf-vs-simple" subject="Future Perfect" questions={FUTPERF_SPEED_QUESTIONS} variant="sidebar" /></div>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <PDFButton onDownload={handlePDF} loading={pdfLoading} />
              <div className="ml-auto hidden sm:flex items-center gap-2">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
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
                        <button key={n} onClick={() => switchSet(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
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
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => (
                                  <label key={oi} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition ${chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"} ${checked ? "cursor-default" : ""}`}>
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => { const newAnswers = { ...answers, [q.id]: oi }; setAnswers(newAnswers); broadcast({ answers: newAnswers, checked, exNo }); }} className="accent-[#F5DA20]" />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-1.5 text-slate-600"><b className="text-slate-900">Correct answer:</b> {q.options[q.correctIndex]} — {q.explanation}</div>
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
                        <button onClick={() => { setChecked(true); broadcast({ answers, checked: true, exNo }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
                      ) : (
                        <button onClick={reset} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">Try Again</button>
                      )}
                      {checked && exNo < 4 && (
                        <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">Next Exercise →</button>
                      )}
                    </div>
                    {score && (
                      <div className={`rounded-2xl border p-4 ${score.percent >= 80 ? "border-emerald-200 bg-emerald-50" : score.percent >= 50 ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}>
                        <div className="flex items-center justify-between">
                          <div><div className={`text-3xl font-black ${score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"}`}>{score.percent}%</div><div className="mt-0.5 text-sm text-slate-600">{score.correct} out of {score.total} correct</div></div>
                          <div className="text-3xl">{score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}</div>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden"><div className={`h-2 rounded-full transition-all duration-500 ${score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${score.percent}%` }} /></div>
                        <div className="mt-2 text-xs text-slate-500">{score.percent >= 80 ? "Excellent! Move on to the next exercise." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}</div>
                      </div>
                    )}
                  </div>
                </>
              ) : (<Explanation />)}
            </div>
          </section>
          {isPro ? (
            <TenseRecommendations tense="future-perfect" />
          ) : (
            <AdUnit variant="sidebar-light" />
          )}
        </div>
        <AdUnit variant="mobile-dark" />
        <div className="mt-10 flex items-center gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-perfect" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Future Perfect exercises</a>
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
        <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${colors[p.color ?? "slate"]}`}>{p.text}</span>
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

function Explanation() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">Future Perfect — completed before a future point</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "will have", color: "yellow" },
            { text: "past participle", color: "green" },
            { text: "by [future time]", color: "violet" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="By Friday, she will have finished the report." />
            <Ex en="By 2030, they will have built the station." />
            <Ex en="By the time you arrive, I will have cooked." />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">Future Simple — single event / prediction / promise</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "will", color: "yellow" },
            { text: "base verb", color: "green" },
            { text: "tomorrow / soon / next week", color: "violet" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="She will finish the report on Friday." />
            <Ex en="They will build the station soon." />
            <Ex en="I will call you when I arrive." />
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Three-way comparison table</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Feature</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Future Perfect</th>
                <th className="px-4 py-2.5 font-black text-sky-700">Future Simple</th>
                <th className="px-4 py-2.5 font-black text-violet-700">Future Continuous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Form", "will have + pp", "will + base", "will be + -ing"],
                ["Focus", "Completion before a point", "Single event/decision", "In progress at a point"],
                ["Trigger", "by [time], by the time", "tomorrow, soon, next", "at [time], when, this time next"],
                ["Example", "By noon she'll have left.", "She'll leave at noon.", "At noon she'll be leaving."],
              ].map((row, i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 font-semibold text-slate-700 text-xs">{row[0]}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs">{row[1]}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-xs">{row[2]}</td>
                  <td className="px-4 py-2.5 text-violet-700 font-mono text-xs">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">The same verb, three different meanings</div>
        <div className="space-y-1.5 mt-2 text-xs text-amber-700">
          <div>✅ At 9 PM, she <b>will be working</b>. (still in the middle of work at 9)</div>
          <div>✅ By 9 PM, she <b>will have finished</b> work. (work is done before 9)</div>
          <div>✅ She <b>will finish</b> work at 9 PM. (work ends at exactly 9)</div>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Signal words summary</div>
        <div className="space-y-2">
          {[
            { label: "Future Perfect → by…", words: ["by Friday", "by then", "by the time…", "by 2030", "by next week", "already (before future point)"] },
            { label: "Future Simple → single event", words: ["tomorrow", "next week", "soon", "in June", "on Monday", "at [time] (single event)"] },
            { label: "Future Continuous → in progress", words: ["at this time tomorrow", "when you arrive", "this time next week", "at 9 PM (ongoing)"] },
          ].map(({ label, words }) => (
            <div key={label} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800 mb-2">{label}</div>
              <div className="flex flex-wrap gap-1.5">
                {words.map((w) => (
                  <span key={w} className="rounded-lg bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">{w}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
