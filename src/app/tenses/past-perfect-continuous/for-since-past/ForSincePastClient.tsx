"use client";
import { useMemo, useState, useEffect } from "react";
import { useLiveSync } from "@/lib/useLiveSync";
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
    title: "Set 1 — for or since?",
    instructions:
      "Choose 'for' or 'since' to complete each Past Perfect Continuous sentence. Remember: 'for' = duration (3 hours, years), 'since' = starting point (Monday, 2015, morning).",
    questions: [
      {
        id: "fs1-1",
        prompt: "She had been waiting ___ two hours when the train finally arrived.",
        options: ["for", "since", "during", "while"],
        correctIndex: 0,
        explanation: "for — 'two hours' is a duration (a period of time), so use 'for'.",
      },
      {
        id: "fs1-2",
        prompt: "He had been living there ___ 2010.",
        options: ["for", "since", "from", "during"],
        correctIndex: 1,
        explanation: "since — '2010' is a specific starting point in the past, so use 'since'.",
      },
      {
        id: "fs1-3",
        prompt: "They had been arguing ___ hours before the manager stepped in.",
        options: ["since", "during", "for", "while"],
        correctIndex: 2,
        explanation: "for — 'hours' is a duration, so use 'for'.",
      },
      {
        id: "fs1-4",
        prompt: "She had been working at the hospital ___ the pandemic began.",
        options: ["for", "during", "since", "while"],
        correctIndex: 2,
        explanation: "since — 'the pandemic began' is a starting point event, so use 'since'.",
      },
      {
        id: "fs1-5",
        prompt: "I had been studying ___ six months when I passed the exam.",
        options: ["since", "during", "while", "for"],
        correctIndex: 3,
        explanation: "for — 'six months' is a duration, so use 'for'.",
      },
      {
        id: "fs1-6",
        prompt: "He had been awake ___ midnight when I finally called him.",
        options: ["for", "during", "while", "since"],
        correctIndex: 3,
        explanation: "since — 'midnight' is a specific starting point in the past.",
      },
      {
        id: "fs1-7",
        prompt: "The baby had been crying ___ almost an hour before it stopped.",
        options: ["since", "while", "during", "for"],
        correctIndex: 3,
        explanation: "for — 'almost an hour' is a duration.",
      },
      {
        id: "fs1-8",
        prompt: "By noon, she had been on the phone ___ early morning.",
        options: ["for", "during", "while", "since"],
        correctIndex: 3,
        explanation: "since — 'early morning' is a starting point.",
      },
      {
        id: "fs1-9",
        prompt: "He had been training ___ three weeks before the injury happened.",
        options: ["since", "during", "while", "for"],
        correctIndex: 3,
        explanation: "for — 'three weeks' is a duration.",
      },
      {
        id: "fs1-10",
        prompt: "She had been feeling unwell ___ last Tuesday.",
        options: ["for", "during", "while", "since"],
        correctIndex: 3,
        explanation: "since — 'last Tuesday' is a specific starting point.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Set 2 — How long? Questions with PPC",
    instructions:
      "Choose the correct option to complete the 'how long' question or answer with Past Perfect Continuous.",
    questions: [
      {
        id: "fs2-1",
        prompt: "How long ___ they been waiting when you arrived?",
        options: ["have", "were", "had", "are"],
        correctIndex: 2,
        explanation: "How long had they been waiting? — PPC question with 'how long'.",
      },
      {
        id: "fs2-2",
        prompt: "She had been working there ___ ages.",
        options: ["since", "while", "during", "for"],
        correctIndex: 3,
        explanation: "for ages — 'ages' is a vague duration, so use 'for'.",
      },
      {
        id: "fs2-3",
        prompt: "How long ___ you been studying before you passed?",
        options: ["were", "have", "had", "are"],
        correctIndex: 2,
        explanation: "How long had you been studying? — PPC 'how long' question (past context).",
      },
      {
        id: "fs2-4",
        prompt: "He had been running ___ he was a teenager.",
        options: ["for", "during", "while", "since"],
        correctIndex: 3,
        explanation: "since — 'he was a teenager' is a past starting point (use 'since').",
      },
      {
        id: "fs2-5",
        prompt: "___ long had the project been running before it was cancelled?",
        options: ["Since", "During", "How", "For"],
        correctIndex: 2,
        explanation: "How long had the project been running? — 'How long' opens the question.",
      },
      {
        id: "fs2-6",
        prompt: "They had been married ___ 25 years when they divorced.",
        options: ["since", "during", "while", "for"],
        correctIndex: 3,
        explanation: "for — '25 years' is a duration.",
      },
      {
        id: "fs2-7",
        prompt: "How long ___ she been living there when the fire started?",
        options: ["has", "were", "had", "is"],
        correctIndex: 2,
        explanation: "How long had she been living? — PPC question; 'when the fire started' is the past reference.",
      },
      {
        id: "fs2-8",
        prompt: "He had been learning piano ___ he was five.",
        options: ["for", "during", "while", "since"],
        correctIndex: 3,
        explanation: "since — 'he was five' is a starting point age.",
      },
      {
        id: "fs2-9",
        prompt: "I had been feeling ill ___ the previous night.",
        options: ["for", "during", "while", "since"],
        correctIndex: 3,
        explanation: "since — 'the previous night' is the starting point.",
      },
      {
        id: "fs2-10",
        prompt: "The team had been practising ___ five days a week.",
        options: ["since", "for", "during", "while"],
        correctIndex: 1,
        explanation: "for — when expressing frequency/duration with 'a week', use 'for'.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Set 3 — Choose the Complete Time Expression",
    instructions:
      "Choose the time expression that best completes each Past Perfect Continuous sentence.",
    questions: [
      {
        id: "fs3-1",
        prompt: "She had been sleeping ___.",
        options: ["for 3 hours", "since 3 hours", "during 3 hours", "while 3 hours"],
        correctIndex: 0,
        explanation: "for 3 hours — '3 hours' is a duration; use 'for'.",
      },
      {
        id: "fs3-2",
        prompt: "He had been training hard ___.",
        options: ["for since January", "since January", "for January", "during since January"],
        correctIndex: 1,
        explanation: "since January — January is a specific starting point; use 'since'.",
      },
      {
        id: "fs3-3",
        prompt: "They had been waiting at the station ___.",
        options: ["for 2 p.m.", "since ages", "since 2 p.m.", "for since 2 p.m."],
        correctIndex: 2,
        explanation: "since 2 p.m. — 2 p.m. is a specific time (starting point); use 'since'.",
      },
      {
        id: "fs3-4",
        prompt: "By the time the film started, she had been queuing ___.",
        options: ["for an hour", "since an hour", "during an hour", "while an hour"],
        correctIndex: 0,
        explanation: "for an hour — 'an hour' is a duration; use 'for'.",
      },
      {
        id: "fs3-5",
        prompt: "He had been living in Paris ___.",
        options: ["for 2019", "since 2019", "during 2019", "while 2019"],
        correctIndex: 1,
        explanation: "since 2019 — '2019' is a year (starting point); use 'since'.",
      },
      {
        id: "fs3-6",
        prompt: "The children had been playing outside ___.",
        options: ["since all afternoon", "for afternoon", "during since", "for ages"],
        correctIndex: 3,
        explanation: "for ages — 'ages' is a vague duration; use 'for'.",
      },
      {
        id: "fs3-7",
        prompt: "She had been suffering from headaches ___.",
        options: ["for the accident", "since the accident", "while the accident", "during for"],
        correctIndex: 1,
        explanation: "since the accident — 'the accident' is a starting point event; use 'since'.",
      },
      {
        id: "fs3-8",
        prompt: "He had been working on the project ___.",
        options: ["since six months", "for six months", "during six months", "while six months"],
        correctIndex: 1,
        explanation: "for six months — 'six months' is a duration; use 'for'.",
      },
      {
        id: "fs3-9",
        prompt: "They had been dating ___.",
        options: ["for they were students", "since they were students", "while students", "during students"],
        correctIndex: 1,
        explanation: "since they were students — 'they were students' is a past starting point event.",
      },
      {
        id: "fs3-10",
        prompt: "I had been feeling nervous ___.",
        options: ["for the morning", "since the morning", "while the morning", "during for"],
        correctIndex: 1,
        explanation: "since the morning — 'the morning' is a starting point; use 'since'.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Set 4 — Full PPC Sentences (Mixed Affirmative/Negative with for/since)",
    instructions:
      "Choose the correct complete Past Perfect Continuous form. Pay attention to whether the sentence is affirmative, negative, or a question.",
    questions: [
      {
        id: "fs4-1",
        prompt: "She ___ for three hours when the café closed.",
        options: ["had been studying", "was studying", "has been studying", "studied"],
        correctIndex: 0,
        explanation: "had been studying — PPC affirmative with 'for'; duration before a past event.",
      },
      {
        id: "fs4-2",
        prompt: "He ___ since the accident, so he needed physiotherapy.",
        options: ["hadn't been walking", "wasn't walking", "hasn't been walking", "didn't walk"],
        correctIndex: 0,
        explanation: "hadn't been walking — negative PPC with 'since'; explains the need for treatment.",
      },
      {
        id: "fs4-3",
        prompt: "___ she been practising since last week?",
        options: ["Was", "Has", "Had", "Is"],
        correctIndex: 2,
        explanation: "Had she been practising? — PPC question; 'since last week' is a past starting point.",
      },
      {
        id: "fs4-4",
        prompt: "They ___ for years before they finally agreed on a solution.",
        options: ["were arguing", "had been arguing", "have been arguing", "argued"],
        correctIndex: 1,
        explanation: "had been arguing — PPC with 'for years' before another past event (agreed).",
      },
      {
        id: "fs4-5",
        prompt: "He looked exhausted. ___ working since dawn?",
        options: ["Was he", "Had he been", "Has he been", "Did he be"],
        correctIndex: 1,
        explanation: "Had he been working? — PPC question; 'since dawn' is a starting point.",
      },
      {
        id: "fs4-6",
        prompt: "The project ___ for two years when it was finally cancelled.",
        options: ["had been running", "was running", "has been running", "ran"],
        correctIndex: 0,
        explanation: "had been running — PPC affirmative with 'for two years'.",
      },
      {
        id: "fs4-7",
        prompt: "I ___ well since I moved to the new city.",
        options: ["wasn't sleeping", "hadn't been sleeping", "haven't been sleeping", "didn't sleep"],
        correctIndex: 1,
        explanation: "hadn't been sleeping — negative PPC with 'since'; the past context needs 'had'.",
      },
      {
        id: "fs4-8",
        prompt: "By noon, she ___ on the phone for three hours.",
        options: ["was", "has been", "had been", "is"],
        correctIndex: 2,
        explanation: "had been — PPC with 'by noon' (past reference) and 'for three hours' (duration).",
      },
      {
        id: "fs4-9",
        prompt: "How long ___ they been living there before they moved?",
        options: ["have", "were", "had", "are"],
        correctIndex: 2,
        explanation: "How long had they been living? — PPC 'how long' question (past context).",
      },
      {
        id: "fs4-10",
        prompt: "She ___ since her childhood, which made her a professional.",
        options: ["had been dancing", "was dancing", "danced", "has been dancing"],
        correctIndex: 0,
        explanation: "had been dancing — PPC affirmative with 'since'; years of past practice before becoming professional.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "for or since",
  2: "How long?",
  3: "Time Expressions",
  4: "Mixed Sentences",
};

export default function ForSincePastClient() {
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
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/past-perfect-continuous">Past Perfect Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">for vs since in the Past</span>
        </div>

        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Perfect Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">for vs since</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B2</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions on using &lsquo;for&rsquo; (duration) and &lsquo;since&rsquo; (starting point) with Past Perfect Continuous.
          She had been waiting <b>for 3 hours</b> / <b>since morning</b>.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          {isPro ? (
            <div className=""><SpeedRound gameId="pastperfcont-for-since-past" subject="Past Perfect Continuous" questions={PASTPERFCONT_SPEED_QUESTIONS} variant="sidebar" /></div>
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
                          <div>
                            <div className={`text-3xl font-black ${score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"}`}>{score.percent}%</div>
                            <div className="mt-0.5 text-sm text-slate-600">{score.correct} out of {score.total} correct</div>
                          </div>
                          <div className="text-3xl">{score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}</div>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                          <div className={`h-2 rounded-full transition-all duration-500 ${score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${score.percent}%` }} />
                        </div>
                        <div className="mt-2 text-xs text-slate-500">{score.percent >= 80 ? "Excellent! Move on to the next exercise." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}</div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <ForSinceExplanation />
              )}
            </div>
          </section>

          {isPro ? (
            <TenseRecommendations tense="past-perfect-continuous" />
          ) : (
            <AdUnit variant="sidebar-light" />
          )}
        </div>

        <AdUnit variant="mobile-dark" />

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/past-perfect-continuous" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Past Perfect Continuous</a>
          <a href="/tenses/past-perfect-continuous/pp-vs-ppc-past" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: PP vs PPC →</a>
        </div>
      </div>
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

function ForSinceExplanation() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">for — duration</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {["Subject", "had been", "verb + -ing", "for", "[period of time]"].map((t, i) => (
              <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${i === 3 ? "bg-emerald-100 text-emerald-800 border-emerald-200" : i === 4 ? "bg-yellow-100 text-yellow-800 border-yellow-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}>{t}</span>
            ))}
          </div>
          <Ex en="She had been waiting for 2 hours.  ·  He had been working for 10 years.  ·  They had been arguing for ages." />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">since — starting point</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {["Subject", "had been", "verb + -ing", "since", "[point in time]"].map((t, i) => (
              <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${i === 3 ? "bg-sky-100 text-sky-800 border-sky-200" : i === 4 ? "bg-yellow-100 text-yellow-800 border-yellow-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}>{t}</span>
            ))}
          </div>
          <Ex en="She had been waiting since 3 p.m.  ·  He had been working since 2015.  ·  They had been living there since childhood." />
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">for vs since — comparison table</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5">
                <th className="px-4 py-2.5 font-black text-left text-emerald-700">for (duration)</th>
                <th className="px-4 py-2.5 font-black text-left text-sky-700">since (starting point)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["for 2 hours", "since 3 p.m."],
                ["for 10 years", "since 2014"],
                ["for a long time", "since last Monday"],
                ["for ages", "since the accident"],
                ["for three months", "since she was a child"],
              ].map(([a, b], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}>
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-700">{a}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-700">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">How long? — question formula</div>
        <div className="rounded-xl border border-black/10 bg-white p-4 font-mono text-sm text-slate-700">
          <span className="font-black text-violet-700">How long</span> + <span className="font-black text-sky-700">had</span> + subject + <span className="font-black text-orange-600">been</span> + verb-ing?
          <div className="mt-2 text-slate-500">→ How long had you been studying?</div>
          <div className="text-slate-500">→ How long had they been waiting?</div>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="font-black mb-1">⚠ Never use for and since together</div>
        <p>✗ She had been working <b>for since</b> Monday. → ✓ She had been working <b>since</b> Monday.<br />
        ✗ He had been studying <b>since</b> three hours. → ✓ He had been studying <b>for</b> three hours.</p>
      </div>
    </div>
  );
}
