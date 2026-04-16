"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { FUTPERF_SPEED_QUESTIONS, FUTPERF_PDF_CONFIG } from "../futPerfSharedData";
import TenseRecommendations from "@/components/TenseRecommendations";

/* ─── Types ─────────────────────────────────────────────────────────────── */

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

/* ─── Question data ─────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — will have / won't have",
    instructions:
      "Choose will have or won't have to complete each sentence. Look for 'by' + a future time marker as your guide.",
    questions: [
      { id: "1-1", prompt: "By 6 PM, she ___ finished all her work.", options: ["will have", "won't have", "will has", "have will"], correctIndex: 0, explanation: "Affirmative: She will have finished by 6 PM." },
      { id: "1-2", prompt: "Don't worry — the train ___ arrived by the time you get there.", options: ["won't have", "will have", "will has", "have not"], correctIndex: 1, explanation: "The train will have arrived = completed action before another future event." },
      { id: "1-3", prompt: "I'm afraid they ___ read the report by Monday.", options: ["will have", "won't have", "will has", "haven't"], correctIndex: 1, explanation: "won't have = negative Future Perfect — they won't complete it by Monday." },
      { id: "1-4", prompt: "By the time you wake up, I ___ already left.", options: ["will have", "won't have", "am going to have", "will has"], correctIndex: 0, explanation: "will have + past participle (left). Action completed before a future moment." },
      { id: "1-5", prompt: "He ___ forgotten about it by tomorrow — he never remembers.", options: ["will have", "won't have", "will has", "have"], correctIndex: 0, explanation: "Prediction about a completed state: He will have forgotten." },
      { id: "1-6", prompt: "We ___ eaten by the time the film starts, so let's go.", options: ["will have", "won't have", "will has", "are having"], correctIndex: 0, explanation: "We will have eaten = the eating will be complete before the film starts." },
      { id: "1-7", prompt: "She ___ completed the project by Friday — she's only just started.", options: ["will have", "won't have", "will has", "haven't"], correctIndex: 1, explanation: "won't have completed = the project won't be done in time." },
      { id: "1-8", prompt: "By next year, they ___ built the new bridge.", options: ["will have", "won't have", "are going to", "have built"], correctIndex: 0, explanation: "By next year + will have + past participle (built)." },
      { id: "1-9", prompt: "Don't call at 8 — I ___ gone to bed by then.", options: ["will have", "won't have", "am going to have", "will has"], correctIndex: 0, explanation: "will have gone = completed before 8 PM." },
      { id: "1-10", prompt: "I'm sorry, but I ___ finished the essay by tomorrow — I need more time.", options: ["will have", "won't have", "will has", "haven't"], correctIndex: 1, explanation: "won't have finished = negative, the task won't be complete." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Will + have + past participle questions",
    instructions:
      "Choose the correct question form or short answer for the Future Perfect. Remember: Will + subject + have + past participle?",
    questions: [
      { id: "2-1", prompt: "___ you have finished by 5 o'clock?", options: ["Will", "Would", "Do", "Are"], correctIndex: 0, explanation: "Questions: Will + subject + have + past participle?" },
      { id: "2-2", prompt: "Will she have ___ by the time we arrive?", options: ["left", "leave", "leaving", "leaved"], correctIndex: 0, explanation: "Will have + past participle: left (irregular past participle of leave)." },
      { id: "2-3", prompt: "\"Will they have arrived by 8 PM?\" — \"Yes, ___.\"", options: ["they will", "they do", "they have", "they are"], correctIndex: 0, explanation: "Short answer for Future Perfect: Yes, they will." },
      { id: "2-4", prompt: "Will he have ___ all his money by then?", options: ["spent", "spend", "spending", "spended"], correctIndex: 0, explanation: "Past participle of spend → spent." },
      { id: "2-5", prompt: "\"Will you have read it by tonight?\" — \"No, ___.\"", options: ["I won't", "I don't", "I haven't", "I'm not"], correctIndex: 0, explanation: "Short negative answer: No, I won't." },
      { id: "2-6", prompt: "___ she have told him by Monday?", options: ["Will", "Would", "Does", "Is"], correctIndex: 0, explanation: "Will she have told him by Monday? — Future Perfect question." },
      { id: "2-7", prompt: "Will they have ___ the contract before the meeting?", options: ["signed", "sign", "signing", "signd"], correctIndex: 0, explanation: "Past participle of sign → signed (regular)." },
      { id: "2-8", prompt: "\"Will he have eaten by then?\" — \"No, ___.\"", options: ["he won't", "he doesn't", "he hasn't", "he isn't"], correctIndex: 0, explanation: "Short negative: No, he won't." },
      { id: "2-9", prompt: "Will we have ___ enough by the time we retire?", options: ["saved", "save", "saving", "saves"], correctIndex: 0, explanation: "Past participle of save → saved (regular)." },
      { id: "2-10", prompt: "___ the team have completed the project by the deadline?", options: ["Will", "Would", "Are", "Do"], correctIndex: 0, explanation: "Will + subject + have + past participle = Future Perfect question." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Choose the correct past participle",
    instructions:
      "Select the correct past participle to complete the Future Perfect sentence. Watch out for irregular verbs!",
    questions: [
      { id: "3-1", prompt: "By tonight, she will have ___ all the food.", options: ["eaten", "ate", "eat", "eated"], correctIndex: 0, explanation: "Past participle of eat → eaten (irregular)." },
      { id: "3-2", prompt: "They will have ___ by the time you land.", options: ["gone", "went", "go", "goed"], correctIndex: 0, explanation: "Past participle of go → gone (irregular)." },
      { id: "3-3", prompt: "I will have ___ the report before the meeting.", options: ["written", "wrote", "write", "writed"], correctIndex: 0, explanation: "Past participle of write → written (irregular)." },
      { id: "3-4", prompt: "He will have ___ the problem by then.", options: ["solved", "solve", "solving", "solven"], correctIndex: 0, explanation: "Past participle of solve → solved (regular)." },
      { id: "3-5", prompt: "By 9 AM, we will have ___ the office.", options: ["left", "leaved", "leave", "leaving"], correctIndex: 0, explanation: "Past participle of leave → left (irregular)." },
      { id: "3-6", prompt: "She will have ___ the book by this weekend.", options: ["read", "readed", "reading", "red"], correctIndex: 0, explanation: "Past participle of read → read (same spelling, pronounced /red/)." },
      { id: "3-7", prompt: "They will have ___ all their savings by then.", options: ["spent", "spended", "spend", "spendt"], correctIndex: 0, explanation: "Past participle of spend → spent (irregular)." },
      { id: "3-8", prompt: "By next month, he will have ___ a new job.", options: ["found", "finded", "find", "founded"], correctIndex: 0, explanation: "Past participle of find → found (irregular)." },
      { id: "3-9", prompt: "We will have ___ a decision before Friday.", options: ["made", "maked", "make", "maden"], correctIndex: 0, explanation: "Past participle of make → made (irregular)." },
      { id: "3-10", prompt: "By the time she calls, I will have ___ asleep.", options: ["fallen", "fell", "fall", "felled"], correctIndex: 0, explanation: "Past participle of fall → fallen (irregular)." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: all Future Perfect forms",
    instructions:
      "This exercise mixes affirmative, negative, and question forms. Choose the correct option for each Future Perfect sentence.",
    questions: [
      { id: "4-1", prompt: "By this time next year, she ___ her degree.", options: ["will have finished", "will has finished", "will finished", "has finished"], correctIndex: 0, explanation: "Affirmative Future Perfect: will have + past participle." },
      { id: "4-2", prompt: "They ___ a decision by Friday — it's too complicated.", options: ["won't have made", "will have made", "won't made", "haven't made"], correctIndex: 0, explanation: "Negative Future Perfect: won't have + past participle." },
      { id: "4-3", prompt: "___ he have sent the email before the deadline?", options: ["Will", "Would", "Does", "Is"], correctIndex: 0, explanation: "Future Perfect question: Will + subject + have + past participle?" },
      { id: "4-4", prompt: "\"Will you have left by 8?\" — \"Yes, ___.\"", options: ["I will", "I do", "I have", "I am"], correctIndex: 0, explanation: "Short answer: Yes, I will." },
      { id: "4-5", prompt: "By the time the guests arrive, we ___ everything.", options: ["will have prepared", "will has prepared", "have prepared", "will prepared"], correctIndex: 0, explanation: "will have prepared = Future Perfect affirmative." },
      { id: "4-6", prompt: "She ___ the training by the end of the month.", options: ["won't have completed", "will have completed", "will completed", "hasn't completed"], correctIndex: 0, explanation: "Negative: won't have completed." },
      { id: "4-7", prompt: "By next Christmas, he ___ working here for ten years.", options: ["will have been", "will has been", "have been", "will be"], correctIndex: 0, explanation: "Future Perfect: will have been — completed duration before a future point." },
      { id: "4-8", prompt: "Will they have ___ the stadium before the tournament?", options: ["built", "build", "building", "builded"], correctIndex: 0, explanation: "Past participle of build → built (irregular)." },
      { id: "4-9", prompt: "I ___ all my money by the end of the holiday.", options: ["will have spent", "will has spent", "have spent", "will spend"], correctIndex: 0, explanation: "will have spent = Future Perfect affirmative." },
      { id: "4-10", prompt: "\"Will she have arrived by noon?\" — \"No, ___.\"", options: ["she won't", "she doesn't", "she hasn't", "she isn't"], correctIndex: 0, explanation: "Short negative answer: No, she won't." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "will have / won't have",
  2: "Questions",
  3: "Past Participles",
  4: "Mixed",
};

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function FuturePerfectQuizClient() {
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
          <a className="hover:text-slate-900 transition" href="/tenses/future-perfect">Future Perfect</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Multiple Choice</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Quiz</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700 border border-red-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Practice <b>Future Perfect</b> with 40 multiple choice questions across four sets: will have / won&apos;t have, questions, past participles, and a mixed review. Pick the correct form and check your answers.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {isPro ? (
            <div className=""><SpeedRound gameId="futperf-quiz" subject="Future Perfect Quiz" questions={FUTPERF_SPEED_QUESTIONS} variant="sidebar" /></div>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}

          {/* Main content */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <PDFButton onDownload={handlePDF} loading={pdfLoading} />
              <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
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
                    <div className="mt-3 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3, 4] as const).map((n) => (
                        <button key={n} onClick={() => switchSet(n)}
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
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
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => (
                                  <label key={oi} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition ${chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"} ${checked ? "cursor-default" : ""}`}>
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi}
                                      onChange={() => setAnswers((p) => ({ ...p, [q.id]: oi }))}
                                      className="accent-[#F5DA20]" />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-1.5 text-slate-600">
                                    <b className="text-slate-900">Correct answer:</b> {q.options[q.correctIndex]} — {q.explanation}
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
                        <button onClick={() => { setChecked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
                          Check Answers
                        </button>
                      ) : (
                        <button onClick={reset} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">
                          Try Again
                        </button>
                      )}
                      {checked && exNo < 4 && (
                        <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">
                          Next Exercise →
                        </button>
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
                        <div className="mt-2 text-xs text-slate-500">
                          {score.percent >= 80 ? "Excellent! Move on to the next exercise." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Explanation />
              )}
            </div>
          </section>

          {isPro ? (
            <TenseRecommendations tense="future-perfect" />
          ) : (
            <AdUnit variant="sidebar-light" />
          )}
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-perfect" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Future Perfect exercises</a>
          <a href="/tenses/future-perfect/fill-in-blank" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Fill in the Blank →</a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation tab ─────────────────────────────────────────────────────── */

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

      {/* 3 gradient cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "will have", color: "yellow" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I will have finished.  ·  She will have left.  ·  They will have arrived." />
            <Ex en="By 6 PM, he will have completed the report." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "won't have", color: "red" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I won't have finished yet.  ·  She won't have arrived by then." />
            <Ex en="They won't have read the report by Monday." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "have", color: "yellow" },
            { text: "past participle", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you have finished by Monday?  ·  Will she have left by the time I arrive?" />
            <Ex en={`"Will they have arrived?" — "Yes, they will." / "No, they won't."`} />
          </div>
        </div>
      </div>

      {/* will have — same for all subjects */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will have — same for ALL subjects</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">+</th>
                <th className="px-4 py-2.5 font-black text-red-700">−</th>
                <th className="px-4 py-2.5 font-black text-sky-700">?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I", "will have finished", "won't have finished", "Will I have finished?"],
                ["You", "will have finished", "won't have finished", "Will you have finished?"],
                ["He / She / It", "will have finished ★", "won't have finished", "Will she have finished?"],
                ["We / They", "will have finished", "won't have finished", "Will they have finished?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i === 2 ? "bg-amber-50 font-bold" : "bg-white"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm">{aff}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-sm">{neg}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-sm">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Key rule:</span> <b>will have</b> is the same for ALL subjects — I, you, he, she, it, we, they.<br />
          <span className="text-xs">Never say &quot;will has&quot; ❌ — always <b>will have</b> ✅</span>
        </div>
      </div>

      {/* When to use */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use Future Perfect</div>
        <div className="space-y-3">
          <div className="rounded-xl bg-white border border-black/10 px-4 py-3">
            <div className="text-sm font-black text-slate-800 mb-1">1. Action completed before a specific future time</div>
            <div className="text-xs text-slate-500 font-mono mb-1.5">NOW ─────────── future time ─── DEADLINE</div>
            <Ex en="By 6 PM, I will have finished my work." />
            <Ex en="By next Monday, she will have sent all the emails." />
          </div>
          <div className="rounded-xl bg-white border border-black/10 px-4 py-3">
            <div className="text-sm font-black text-slate-800 mb-1">2. Action completed before another future action</div>
            <div className="text-xs text-slate-500 font-mono mb-1.5">NOW ─── [leaves] ─── [you arrive] (future)</div>
            <Ex en="By the time you arrive, she will have already left." />
            <Ex en="When the film starts, we will have eaten." />
          </div>
          <div className="rounded-xl bg-white border border-black/10 px-4 py-3">
            <div className="text-sm font-black text-slate-800 mb-1">3. Prediction about a completed state</div>
            <Ex en="He will have forgotten about it by tomorrow." />
            <Ex en="By next year, prices will have risen significantly." />
          </div>
        </div>
      </div>

      {/* Irregular past participles */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Irregular past participles</div>
        <div className="flex flex-wrap gap-2">
          {[
            "go → gone", "eat → eaten", "see → seen", "come → come", "take → taken",
            "make → made", "write → written", "read → read", "leave → left", "speak → spoken",
            "be → been", "have → had", "get → got/gotten", "find → found", "know → known",
            "think → thought", "buy → bought", "tell → told", "hear → heard", "begin → begun",
            "feel → felt", "meet → met", "run → run", "send → sent", "spend → spent",
            "build → built", "break → broken", "drive → driven", "fall → fallen", "forget → forgotten",
            "grow → grown", "lose → lost", "pay → paid", "win → won", "do → done",
          ].map((pair) => (
            <span key={pair} className="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{pair}</span>
          ))}
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Key time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["by tomorrow", "by Monday", "by next week", "by the time + clause", "by then", "by the end of...", "already", "yet (negative)", "before + future event"].map((t) => (
            <span key={t} className="rounded-lg bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs font-semibold text-sky-700">{t}</span>
          ))}
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">Tip:</span> &quot;by&quot; is the strongest signal for Future Perfect. If you see &quot;by [future time]&quot;, think <b>will have + past participle</b>.
        </div>
      </div>

    </div>
  );
}
