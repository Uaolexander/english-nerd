"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import { useLiveSync } from "@/lib/useLiveSync";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import TenseRecommendations from "@/components/TenseRecommendations";
import { PS_SPEED_QUESTIONS, PS_PDF_CONFIG } from "../psSharedData";

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
    title: "Exercise 1 — Regular verbs: choose the correct past form",
    instructions:
      "Regular verbs form the past simple by adding -ed (or -d). Watch out for spelling changes: double the final consonant in short CVC verbs (stop→stopped), change y→ied (study→studied), and drop the silent -e before adding -d (like→liked).",
    questions: [
      { id: "1-1", prompt: "She ___ hard for the exam last week.", options: ["study", "studyed", "studied", "studing"], correctIndex: 2, explanation: "study → studied (y→ied rule)" },
      { id: "1-2", prompt: "He ___ football every Saturday last year.", options: ["play", "plaied", "playing", "played"], correctIndex: 3, explanation: "play → played (add -ed; y after vowel stays)" },
      { id: "1-3", prompt: "They ___ in London for two years.", options: ["lived", "liveed", "live", "living"], correctIndex: 0, explanation: "live → lived (drop silent -e, add -d)" },
      { id: "1-4", prompt: "We ___ the meeting at 9 o'clock.", options: ["start", "starting", "startes", "started"], correctIndex: 3, explanation: "start → started (regular, just add -ed)" },
      { id: "1-5", prompt: "The bus ___ at the corner.", options: ["stoped", "stopping", "stopped", "stops"], correctIndex: 2, explanation: "stop → stopped (CVC rule: double the final consonant)" },
      { id: "1-6", prompt: "She ___ the door quietly.", options: ["close", "closed", "closeed", "closing"], correctIndex: 1, explanation: "close → closed (drop silent -e, add -d)" },
      { id: "1-7", prompt: "He ___ to finish the project on time.", options: ["try", "tryed", "tried", "tryes"], correctIndex: 2, explanation: "try → tried (y→ied rule)" },
      { id: "1-8", prompt: "They ___ the new restaurant last night.", options: ["visited", "visit", "visitting", "visitied"], correctIndex: 0, explanation: "visit → visited (regular, just add -ed)" },
      { id: "1-9", prompt: "I ___ my keys in the office.", options: ["drop", "droping", "droped", "dropped"], correctIndex: 3, explanation: "drop → dropped (CVC rule: double the final consonant)" },
      { id: "1-10", prompt: "She ___ her old flat and bought a house.", options: ["rent", "rented", "rentted", "renting"], correctIndex: 1, explanation: "rent → rented (regular, just add -ed)" },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Irregular verbs: choose the correct past form",
    instructions:
      "Irregular verbs do not follow the -ed pattern — they have unique past forms that must be memorised. Choose the correct irregular past simple form.",
    questions: [
      { id: "2-1", prompt: "She ___ to the supermarket yesterday.", options: ["goed", "go", "gone", "went"], correctIndex: 3, explanation: "go → went (irregular)" },
      { id: "2-2", prompt: "He ___ a great idea at the meeting.", options: ["had", "have", "has", "haved"], correctIndex: 0, explanation: "have → had (irregular)" },
      { id: "2-3", prompt: "I ___ a beautiful bird in the garden.", options: ["seed", "saw", "seen", "sawed"], correctIndex: 1, explanation: "see → saw (irregular)" },
      { id: "2-4", prompt: "They ___ lunch at the new café.", options: ["eated", "eat", "ate", "eaten"], correctIndex: 2, explanation: "eat → ate (irregular)" },
      { id: "2-5", prompt: "She ___ a letter to her friend.", options: ["writed", "write", "written", "wrote"], correctIndex: 3, explanation: "write → wrote (irregular)" },
      { id: "2-6", prompt: "He ___ his bag and left the office.", options: ["taked", "took", "taken", "take"], correctIndex: 1, explanation: "take → took (irregular)" },
      { id: "2-7", prompt: "We ___ the children to school.", options: ["bringed", "bring", "brought", "brung"], correctIndex: 2, explanation: "bring → brought (irregular)" },
      { id: "2-8", prompt: "She ___ that she was right.", options: ["thinked", "thought", "think", "thunk"], correctIndex: 1, explanation: "think → thought (irregular)" },
      { id: "2-9", prompt: "He ___ a new car last month.", options: ["buyed", "buy", "bought", "boughted"], correctIndex: 2, explanation: "buy → bought (irregular)" },
      { id: "2-10", prompt: "They ___ to the party at midnight.", options: ["comed", "comes", "come", "came"], correctIndex: 3, explanation: "come → came (irregular)" },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Negatives & questions with did",
    instructions:
      "In Past Simple negatives and questions, use did/didn't + base form of the verb. Never use the past form after did/didn't — always the base form.",
    questions: [
      { id: "3-1", prompt: "She ___ to the concert last night.", options: ["didn't went", "didn't go", "doesn't go", "wasn't go"], correctIndex: 1, explanation: "Negative: didn't + base form → didn't go (NOT didn't went)" },
      { id: "3-2", prompt: "___ you see the film yesterday?", options: ["Was", "Were", "Did", "Have"], correctIndex: 2, explanation: "Past Simple question: Did + subject + base form" },
      { id: "3-3", prompt: "He ___ his homework before dinner.", options: ["didn't did", "doesn't do", "didn't do", "wasn't do"], correctIndex: 2, explanation: "Negative: didn't + base form → didn't do" },
      { id: "3-4", prompt: "\"Did she call you?\" — \"Yes, ___.\"", options: ["she did", "she does", "she was", "she called"], correctIndex: 0, explanation: "Short answer: Yes, she did." },
      { id: "3-5", prompt: "They ___ anything at the party.", options: ["didn't ate", "didn't eat", "doesn't eat", "weren't eat"], correctIndex: 1, explanation: "Negative: didn't + base form → didn't eat" },
      { id: "3-6", prompt: "___ they arrive on time?", options: ["Were", "Have", "Did", "Was"], correctIndex: 2, explanation: "Past Simple question: Did + subject + base form" },
      { id: "3-7", prompt: "\"Did he study?\" — \"No, ___.\"", options: ["he didn't", "he doesn't", "he wasn't", "he didn't study"], correctIndex: 0, explanation: "Short answer: No, he didn't." },
      { id: "3-8", prompt: "I ___ understand the instructions.", options: ["didn't understood", "don't understood", "didn't understand", "wasn't understood"], correctIndex: 2, explanation: "Negative: didn't + base form → didn't understand" },
      { id: "3-9", prompt: "What ___ you do at the weekend?", options: ["were", "have", "did", "was"], correctIndex: 2, explanation: "Wh- question: What + did + subject + base form?" },
      { id: "3-10", prompt: "She ___ any coffee this morning.", options: ["didn't drank", "doesn't drink", "didn't drink", "wasn't drink"], correctIndex: 2, explanation: "Negative: didn't + base form → didn't drink" },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: all Past Simple forms",
    instructions:
      "This exercise mixes affirmative, negative, and question forms with both regular and irregular verbs. Choose the correct option for each sentence.",
    questions: [
      { id: "4-1", prompt: "She ___ a cake for the party yesterday.", options: ["make", "maked", "makes", "made"], correctIndex: 3, explanation: "Affirmative: make → made (irregular)" },
      { id: "4-2", prompt: "They ___ in Berlin when they were young.", options: ["live", "lived", "were lived", "lives"], correctIndex: 1, explanation: "Affirmative: live → lived (regular, drop -e + d)" },
      { id: "4-3", prompt: "___ he find his keys?", options: ["Was", "Did", "Does", "Were"], correctIndex: 1, explanation: "Question: Did + subject + base form" },
      { id: "4-4", prompt: "I ___ to music on the way to work.", options: ["listened", "listen", "listend", "was listen"], correctIndex: 0, explanation: "Affirmative: listen → listened (regular)" },
      { id: "4-5", prompt: "We ___ the match — the other team was better.", options: ["didn't win", "didn't won", "doesn't win", "weren't win"], correctIndex: 0, explanation: "Negative: didn't + base form → didn't win" },
      { id: "4-6", prompt: "She ___ her friend at the café this morning.", options: ["meet", "met", "meeted", "metting"], correctIndex: 1, explanation: "Affirmative: meet → met (irregular)" },
      { id: "4-7", prompt: "\"Did you enjoy the trip?\" — \"Yes, ___.\"", options: ["I enjoyed", "I did", "I was", "I do"], correctIndex: 1, explanation: "Short answer: Yes, I did." },
      { id: "4-8", prompt: "He ___ a word — he just left.", options: ["didn't say", "didn't said", "doesn't say", "wasn't say"], correctIndex: 0, explanation: "Negative: didn't + base form → didn't say" },
      { id: "4-9", prompt: "The children ___ in the garden all afternoon.", options: ["play", "were play", "played", "plaied"], correctIndex: 2, explanation: "Affirmative: play → played (regular)" },
      { id: "4-10", prompt: "Where ___ you go for your holiday last summer?", options: ["were", "have", "did", "was"], correctIndex: 2, explanation: "Wh- question: Where + did + you + base form?" },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Regular",
  2: "Irregular",
  3: "Neg & Q",
  4: "Mixed",
};

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function PastSimpleQuizClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const isPro = useIsPro();

  const current = SETS[exNo];

  const { save } = useProgress();

  const { isLive, broadcast } = useLiveSync((payload) => {
    setAnswers(payload.answers as Record<string, number | null>);
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3 | 4);
  });

  async function handlePDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(PS_PDF_CONFIG); } finally { setPdfLoading(false); }
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

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/past-simple">Past Simple</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Multiple Choice</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Quiz</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Practice <b>Past Simple</b> with 40 multiple choice questions across four sets: regular verbs, irregular verbs, negatives &amp; questions, and a mixed review. Pick the correct form and check your answers.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className=""><SpeedRound gameId="ps-quiz" subject="Past Simple" questions={PS_SPEED_QUESTIONS} variant="sidebar" /></div>
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
                                      onChange={() => {
                                        const newAnswers = { ...answers, [q.id]: oi };
                                        setAnswers(newAnswers);
                                        broadcast({ answers: newAnswers, checked, exNo });
                                      }}
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
                        <button onClick={() => { setChecked(true); broadcast({ answers, checked: true, exNo }); window.scrollTo({ top: 0, behavior: "smooth" }); }}
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

          {/* Right column */}
          {isPro ? (
            <TenseRecommendations tense="past-simple" />
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/past-simple" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Past Simple exercises</a>
          <a href="/tenses/past-simple/fill-in-blank" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Fill in the Blank →</a>
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
            { text: "past form", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="She worked hard.  ·  He went home.  ·  They played tennis." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "didn't", color: "red" },
            { text: "base form", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="She didn't work.  ·  He didn't go.  ·  They didn't play." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Did", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "base form", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Did she work?  ·  Did he go?  ·  Did they play?" />
          </div>
        </div>
      </div>

      {/* Conjugation table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Conjugation table</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">+ (work)</th>
                <th className="px-4 py-2.5 font-black text-red-700">−</th>
                <th className="px-4 py-2.5 font-black text-sky-700">?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I", "worked", "didn't work", "Did I work?"],
                ["You", "worked", "didn't work", "Did you work?"],
                ["He / She / It ★", "worked", "didn't work", "Did he work?"],
                ["We", "worked", "didn't work", "Did we work?"],
                ["They", "worked", "didn't work", "Did they work?"],
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
          <span className="font-black">★ Key rule:</span> Past Simple is the <b>same for all persons</b>.<br />
          <span className="text-xs">After <b>didn&apos;t</b> and <b>Did</b>, always use the <b>base form</b> (not the past form).<br />
          She <b>didn&apos;t go</b> ✅ &nbsp; She didn&apos;t went ❌ &nbsp;|&nbsp; <b>Did</b> she go? ✅ &nbsp; Did she went? ❌</span>
        </div>
      </div>

      {/* Spelling rules */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Regular verb spelling rules</div>
        <div className="space-y-2">
          {[
            { rule: "Most verbs → add -ed", ex: "work → worked · play → played · visit → visited" },
            { rule: "Ends in -e → add only -d", ex: "like → liked · live → lived · close → closed" },
            { rule: "Short verb (CVC) → double final consonant + -ed", ex: "stop → stopped · plan → planned · drop → dropped" },
            { rule: "Ends in consonant + y → change y to i, add -ed", ex: "study → studied · try → tried · carry → carried" },
            { rule: "Ends in vowel + y → just add -ed", ex: "play → played · enjoy → enjoyed · stay → stayed" },
          ].map(({ rule, ex }) => (
            <div key={rule} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800">{rule}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-mono">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Irregular verbs grid */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Common irregular verbs</div>
        <div className="flex flex-wrap gap-2">
          {[
            "go → went", "have → had", "see → saw", "eat → ate", "come → came",
            "take → took", "make → made", "give → gave", "say → said", "do → did",
            "get → got", "find → found", "know → knew", "think → thought", "buy → bought",
            "leave → left", "write → wrote", "tell → told", "hear → heard", "begin → began",
            "feel → felt", "meet → met", "run → ran", "sit → sat", "stand → stood",
            "fly → flew", "drink → drank", "drive → drove", "wake → woke", "speak → spoke",
            "sing → sang", "swim → swam", "break → broke", "bring → brought", "build → built",
            "catch → caught", "choose → chose", "fall → fell", "forget → forgot", "grow → grew",
            "hold → held", "keep → kept", "lead → led", "lose → lost", "pay → paid",
            "put → put", "send → sent", "sleep → slept", "spend → spent", "teach → taught",
            "wear → wore", "win → won",
          ].map((v) => (
            <span key={v} className="rounded-lg bg-violet-50 border border-violet-200 px-2.5 py-1 text-xs font-semibold text-violet-800">{v}</span>
          ))}
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["yesterday", "last week", "last month", "last year", "last night", "ago", "in 2020", "when I was young", "this morning", "in the past", "once", "at that time"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
