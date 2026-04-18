"use client";

import { useMemo, useState, useEffect } from "react";
import { useLiveSync } from "@/lib/useLiveSync";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { PP_SPEED_QUESTIONS, PP_PDF_CONFIG } from "../ppSharedData";
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
    title: "Exercise 1 — Affirmative: have or has?",
    instructions:
      "Choose have or has to complete each Present Perfect sentence. Remember: I / you / we / they → have; he / she / it → has.",
    questions: [
      { id: "1-1",  prompt: "She ___ finished her homework already.",           options: ["have", "has", "is", "are"],          correctIndex: 1, explanation: "She (= he/she/it) → has: She has finished." },
      { id: "1-2",  prompt: "I ___ visited Paris twice.",                       options: ["has", "is", "have", "was"],          correctIndex: 2, explanation: "I → have: I have visited." },
      { id: "1-3",  prompt: "They ___ lived here for ten years.",               options: ["has", "is", "are", "have"],          correctIndex: 3, explanation: "They → have: They have lived." },
      { id: "1-4",  prompt: "He ___ just left the office.",                     options: ["have", "has", "had", "did"],         correctIndex: 1, explanation: "He (= he/she/it) → has: He has just left." },
      { id: "1-5",  prompt: "We ___ already eaten lunch.",                      options: ["has", "is", "are", "have"],          correctIndex: 3, explanation: "We → have: We have already eaten." },
      { id: "1-6",  prompt: "The film ___ started.",                            options: ["have", "are", "has", "is"],          correctIndex: 2, explanation: "The film (= it) → has: The film has started." },
      { id: "1-7",  prompt: "You ___ done a great job.",                        options: ["has", "have", "had", "are"],         correctIndex: 1, explanation: "You → have: You have done." },
      { id: "1-8",  prompt: "My parents ___ gone to Spain for the weekend.",    options: ["has", "is", "have", "are"],          correctIndex: 2, explanation: "My parents (= they) → have: They have gone." },
      { id: "1-9",  prompt: "It ___ been very cold this week.",                 options: ["have", "are", "were", "has"],        correctIndex: 3, explanation: "It (= he/she/it) → has: It has been." },
      { id: "1-10", prompt: "The children ___ never tried sushi.",              options: ["has", "have", "are", "were"],        correctIndex: 1, explanation: "The children (= they) → have: They have never tried." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: haven't or hasn't?",
    instructions:
      "Choose haven't or hasn't to make the Present Perfect negative. Use haven't with I / you / we / they and hasn't with he / she / it.",
    questions: [
      { id: "2-1",  prompt: "She ___ called me yet.",                           options: ["haven't", "hasn't", "didn't", "isn't"],     correctIndex: 1, explanation: "She → hasn't: She hasn't called yet." },
      { id: "2-2",  prompt: "I ___ seen that film before.",                     options: ["hasn't", "didn't", "haven't", "wasn't"],    correctIndex: 2, explanation: "I → haven't: I haven't seen." },
      { id: "2-3",  prompt: "They ___ finished the project yet.",               options: ["hasn't", "didn't", "aren't", "haven't"],    correctIndex: 3, explanation: "They → haven't: They haven't finished." },
      { id: "2-4",  prompt: "He ___ eaten anything today.",                     options: ["haven't", "hasn't", "didn't", "isn't"],     correctIndex: 1, explanation: "He → hasn't: He hasn't eaten." },
      { id: "2-5",  prompt: "We ___ been to Japan.",                            options: ["hasn't", "weren't", "didn't", "haven't"],   correctIndex: 3, explanation: "We → haven't: We haven't been." },
      { id: "2-6",  prompt: "It ___ rained for three weeks.",                   options: ["haven't", "didn't", "hasn't", "wasn't"],    correctIndex: 2, explanation: "It → hasn't: It hasn't rained." },
      { id: "2-7",  prompt: "You ___ answered my question.",                    options: ["hasn't", "haven't", "didn't", "weren't"],   correctIndex: 1, explanation: "You → haven't: You haven't answered." },
      { id: "2-8",  prompt: "My sister ___ arrived yet.",                       options: ["haven't", "didn't", "hasn't", "isn't"],     correctIndex: 2, explanation: "My sister (= she) → hasn't: She hasn't arrived." },
      { id: "2-9",  prompt: "The results ___ been published yet.",              options: ["hasn't", "weren't", "haven't", "aren't"],   correctIndex: 2, explanation: "The results (= they) → haven't: They haven't been published." },
      { id: "2-10", prompt: "He ___ spoken to her since Monday.",               options: ["haven't", "hasn't", "didn't", "isn't"],     correctIndex: 1, explanation: "He → hasn't: He hasn't spoken." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions and short answers",
    instructions:
      "Form Present Perfect questions with Have / Has and choose correct short answers. Questions follow the pattern: Have/Has + subject + past participle?",
    questions: [
      { id: "3-1",  prompt: "___ she ever been to Australia?",                  options: ["Have", "Did", "Was", "Has"],              correctIndex: 3, explanation: "She → Has: Has she ever been…?" },
      { id: "3-2",  prompt: "___ you finished your report yet?",                options: ["Has", "Did", "Are", "Have"],              correctIndex: 3, explanation: "You → Have: Have you finished…?" },
      { id: "3-3",  prompt: "___ they ever tried Indian food?",                 options: ["Has", "Did", "Have", "Are"],              correctIndex: 2, explanation: "They → Have: Have they ever tried…?" },
      { id: "3-4",  prompt: '"Have you seen him?" — "No, ___.\'',               options: ["I haven't", "I didn't", "I hasn't", "I don't"], correctIndex: 0, explanation: "Short negative answer with have: No, I haven't." },
      { id: "3-5",  prompt: '"Has she called?" — "Yes, ___.\'',                 options: ["she did", "she have", "she has", "she is"], correctIndex: 2, explanation: "Short positive answer with has: Yes, she has." },
      { id: "3-6",  prompt: "___ he ever eaten octopus?",                       options: ["Have", "Did", "Was", "Has"],              correctIndex: 3, explanation: "He → Has: Has he ever eaten…?" },
      { id: "3-7",  prompt: '"Have they arrived?" — "Yes, ___.\'',              options: ["they did", "they have", "they has", "they are"], correctIndex: 1, explanation: "Short positive answer: Yes, they have." },
      { id: "3-8",  prompt: '"Has it worked?" — "No, ___.\'',                   options: ["it hasn't", "it haven't", "it didn't", "it isn't"], correctIndex: 0, explanation: "Short negative with has: No, it hasn't." },
      { id: "3-9",  prompt: "___ your parents ever visited London?",            options: ["Have", "Has", "Did", "Are"],              correctIndex: 0, explanation: "Your parents (= they) → Have: Have your parents ever visited…?" },
      { id: "3-10", prompt: '"Has the taxi arrived?" — "Yes, ___.\'',           options: ["it have", "it has", "it did", "it was"],  correctIndex: 1, explanation: "The taxi (= it) → has: Yes, it has." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: all forms",
    instructions:
      "This set combines affirmative, negative, and question forms. Choose have, has, haven't, hasn't, Have, or Has to best complete each sentence.",
    questions: [
      { id: "4-1",  prompt: "I ___ just finished the report.",                  options: ["has", "have", "am", "did"],              correctIndex: 1, explanation: "I → have: I have just finished." },
      { id: "4-2",  prompt: "She ___ never met the director.",                  options: ["have", "has", "did", "is"],              correctIndex: 1, explanation: "She → has: She has never met." },
      { id: "4-3",  prompt: "___ they ever worked abroad?",                     options: ["Has", "Did", "Were", "Have"],            correctIndex: 3, explanation: "They → Have: Have they ever worked…?" },
      { id: "4-4",  prompt: "He ___ told anyone about the surprise.",           options: ["haven't", "hasn't", "didn't", "isn't"],  correctIndex: 1, explanation: "He → hasn't: He hasn't told anyone." },
      { id: "4-5",  prompt: "We ___ already booked the tickets.",               options: ["has", "have", "did", "are"],             correctIndex: 1, explanation: "We → have: We have already booked." },
      { id: "4-6",  prompt: "___ she spoken to the manager yet?",               options: ["Have", "Has", "Did", "Was"],             correctIndex: 1, explanation: "She → Has: Has she spoken…?" },
      { id: "4-7",  prompt: "You ___ been to this museum before, ___ you?",     options: ["have … haven't", "have … have", "haven't … have", "hasn't … have"], correctIndex: 0, explanation: "You have been… haven't you? (negative question tag after affirmative)" },
      { id: "4-8",  prompt: "The company ___ launched three new products.",     options: ["have", "has", "did", "are"],             correctIndex: 1, explanation: "The company (= it) → has: The company has launched." },
      { id: "4-9",  prompt: "They ___ received the package yet.",               options: ["hasn't", "haven't", "didn't", "aren't"], correctIndex: 1, explanation: "They → haven't: They haven't received." },
      { id: "4-10", prompt: "___ it ever been this hot in April?",              options: ["Have", "Has", "Was", "Did"],             correctIndex: 1, explanation: "It → Has: Has it ever been…?" },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Affirmative",
  2: "Negative",
  3: "Questions",
  4: "Mixed",
};

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function HaveHasClient() {
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
    try { await generateLessonPDF(PP_PDF_CONFIG); } finally { setPdfLoading(false); }
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
          <a className="hover:text-slate-900 transition" href="/tenses/present-perfect">Present Perfect</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">have / has / haven&apos;t / hasn&apos;t</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">have / hasn&apos;t / Have I?</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">Easy</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">B1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Practice choosing the correct auxiliary verb in Present Perfect: <b>have</b> or <b>has</b> in affirmatives, <b>haven&apos;t</b> or <b>hasn&apos;t</b> in negatives, and <b>Have</b> or <b>Has</b> in questions. 40 multiple-choice questions across four sets.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className=""><SpeedRound gameId="pp-have-has" subject="Present Perfect" questions={PP_SPEED_QUESTIONS} variant="sidebar" /></div>
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
                                      onChange={() => { const newAnswers = { ...answers, [q.id]: oi }; setAnswers(newAnswers); broadcast({ answers: newAnswers, checked, exNo }); }}
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
            <TenseRecommendations tense="present-perfect" />
          ) : (
            <AdUnit variant="sidebar-light" />
          )}
        </div>

        {!isPro && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
            <div className="hidden lg:block" />
            <SpeedRound gameId="pp-have-has" subject="Present Perfect" questions={PP_SPEED_QUESTIONS} />
            <div className="hidden lg:block" />
          </div>
        )}

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/present-perfect" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Present Perfect exercises</a>
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
            { text: "have / has", color: "yellow" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I have worked here for years." />
            <Ex en="She has eaten already." />
            <Ex en="They have just arrived." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "haven't / hasn't", color: "red" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I haven't seen him yet." />
            <Ex en="She hasn't called back." />
            <Ex en="They haven't arrived." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Have / Has", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "past participle", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Have you seen this film?" />
            <Ex en="Has she arrived yet?" />
            <Ex en="Have they eaten?" />
          </div>
        </div>
      </div>

      {/* have / has table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">have vs has — quick reference</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Affirmative</th>
                <th className="px-4 py-2.5 font-black text-red-700">Negative</th>
                <th className="px-4 py-2.5 font-black text-sky-700">Question</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I / You / We / They", "have worked", "haven't worked", "Have you worked?"],
                ["He / She / It ★", "has worked", "hasn't worked", "Has she worked?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i === 1 ? "bg-amber-50 font-bold" : "bg-white"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs">{aff}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-xs">{neg}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-xs">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Key rule:</span> He / She / It always use <b>has</b> and <b>hasn&apos;t</b>. This is the most common mistake — never say &ldquo;She have finished.&rdquo;<br />
          <span className="text-xs mt-1 block">She <b>has</b> finished ✅ &nbsp; She <b>have</b> finished ❌ &nbsp;|&nbsp; The word after have/has must be the <b>past participle</b> (not the base form or simple past).</span>
        </div>
      </div>

      {/* Short answers */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Short answers</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Question</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Yes answer</th>
                <th className="px-4 py-2.5 font-black text-red-700">No answer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Have you seen it?", "Yes, I have.", "No, I haven't."],
                ["Has she arrived?", "Yes, she has.", "No, she hasn't."],
                ["Have they finished?", "Yes, they have.", "No, they haven't."],
                ["Has it worked?", "Yes, it has.", "No, it hasn't."],
              ].map(([q, yes, no], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-slate-700 font-mono text-xs">{q}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs">{yes}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-xs">{no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">Remember:</span> In short answers, repeat <b>have</b> or <b>has</b> — never use &ldquo;did&rdquo; or the main verb.<br />
          <span className="text-xs">&ldquo;Have you seen it?&rdquo; → &ldquo;Yes, I <b>have</b>.&rdquo; ✅ &nbsp; &ldquo;Yes, I <b>did</b>.&rdquo; ❌</span>
        </div>
      </div>

    </div>
  );
}
