"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { BGT_SPEED_QUESTIONS, BGT_PDF_CONFIG } from "../bgtSharedData";
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
    title: "Exercise 1 — Affirmative: choose am / is / are + going to",
    instructions:
      "Be going to uses am / is / are + going to + base form. Use am with I, is with he / she / it, and are with you / we / they.",
    questions: [
      { id: "1-1", prompt: "She ___ going to leave tomorrow.", options: ["am", "is", "are", "be"], correctIndex: 1, explanation: "She → is: She is going to leave." },
      { id: "1-2", prompt: "I ___ going to visit my parents this weekend.", options: ["is", "are", "am", "be"], correctIndex: 2, explanation: "I → am: I am going to visit." },
      { id: "1-3", prompt: "They ___ going to play football on Saturday.", options: ["am", "is", "are", "be"], correctIndex: 2, explanation: "They → are: They are going to play." },
      { id: "1-4", prompt: "He ___ going to study medicine.", options: ["are", "am", "is", "be"], correctIndex: 2, explanation: "He → is: He is going to study." },
      { id: "1-5", prompt: "We ___ going to travel to Spain next summer.", options: ["is", "am", "are", "be"], correctIndex: 2, explanation: "We → are: We are going to travel." },
      { id: "1-6", prompt: "Look at those clouds — it ___ going to rain.", options: ["am", "are", "is", "be"], correctIndex: 2, explanation: "It → is: It is going to rain." },
      { id: "1-7", prompt: "You ___ going to love this film!", options: ["am", "is", "are", "be"], correctIndex: 2, explanation: "You → are: You are going to love." },
      { id: "1-8", prompt: "My parents ___ going to move to the countryside.", options: ["is", "am", "are", "be"], correctIndex: 2, explanation: "My parents (= they) → are: They are going to move." },
      { id: "1-9", prompt: "The team ___ going to win the championship.", options: ["am", "are", "is", "be"], correctIndex: 2, explanation: "The team (= it) → is: The team is going to win." },
      { id: "1-10", prompt: "The children ___ going to perform at the school concert.", options: ["am", "is", "are", "be"], correctIndex: 2, explanation: "The children (= they) → are: They are going to perform." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: choose am not / isn't / aren't + going to",
    instructions:
      "Negative be going to: I'm not going to, he/she/it isn't going to, you/we/they aren't going to. Never use 'don't' or 'doesn't' with going to.",
    questions: [
      { id: "2-1", prompt: "She ___ going to come to the party.", options: ["don't", "isn't", "aren't", "not"], correctIndex: 1, explanation: "She → isn't: She isn't going to come." },
      { id: "2-2", prompt: "I ___ going to accept that offer.", options: ["isn't", "don't", "'m not", "aren't"], correctIndex: 2, explanation: "I → 'm not: I'm not going to accept." },
      { id: "2-3", prompt: "They ___ going to wait any longer.", options: ["isn't", "doesn't", "aren't", "not"], correctIndex: 2, explanation: "They → aren't: They aren't going to wait." },
      { id: "2-4", prompt: "He ___ going to finish the project on time.", options: ["aren't", "isn't", "don't", "not"], correctIndex: 1, explanation: "He → isn't: He isn't going to finish." },
      { id: "2-5", prompt: "We ___ going to stay for dinner.", options: ["isn't", "doesn't", "aren't", "not"], correctIndex: 2, explanation: "We → aren't: We aren't going to stay." },
      { id: "2-6", prompt: "It ___ going to be easy.", options: ["don't", "aren't", "isn't", "not"], correctIndex: 2, explanation: "It → isn't: It isn't going to be easy." },
      { id: "2-7", prompt: "You ___ going to believe this!", options: ["isn't", "don't", "aren't", "not"], correctIndex: 2, explanation: "You → aren't: You aren't going to believe." },
      { id: "2-8", prompt: "My flight ___ going to be on time.", options: ["don't", "aren't", "isn't", "not"], correctIndex: 2, explanation: "My flight (= it) → isn't: My flight isn't going to be on time." },
      { id: "2-9", prompt: "She ___ going to change her mind.", options: ["don't", "isn't", "aren't", "not"], correctIndex: 1, explanation: "She → isn't: She isn't going to change her mind." },
      { id: "2-10", prompt: "The kids ___ going to eat vegetables.", options: ["isn't", "doesn't", "aren't", "not"], correctIndex: 2, explanation: "The kids (= they) → aren't: They aren't going to eat." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions: Am / Is / Are + going to + short answers",
    instructions:
      "Questions invert the subject and the auxiliary: Am I going to…? Is he/she/it going to…? Are you/we/they going to…? Short answers use am / is / are — never repeat going to or the main verb.",
    questions: [
      { id: "3-1", prompt: "___ she going to leave?", options: ["Am", "Are", "Is", "Do"], correctIndex: 2, explanation: "She → Is: Is she going to leave?" },
      { id: "3-2", prompt: "___ you going to apply for the job?", options: ["Is", "Am", "Does", "Are"], correctIndex: 3, explanation: "You → Are: Are you going to apply?" },
      { id: "3-3", prompt: "___ they going to join us?", options: ["Is", "Am", "Are", "Do"], correctIndex: 2, explanation: "They → Are: Are they going to join us?" },
      { id: "3-4", prompt: '"Is it going to rain?" — "Yes, ___.', options: ["it rains", "it does", "it is", "it are"], correctIndex: 2, explanation: "Short answer with is: Yes, it is." },
      { id: "3-5", prompt: '"Are you going to stay?" — "No, ___.', options: ["I'm not", "I don't", "I isn't", "I aren't"], correctIndex: 0, explanation: "Short negative answer: No, I'm not." },
      { id: "3-6", prompt: '"Is she going to pass?" — "Yes, ___.', options: ["she does", "she is", "she are", "she am"], correctIndex: 1, explanation: "Short answer with is: Yes, she is." },
      { id: "3-7", prompt: "___ he going to call back?", options: ["Are", "Am", "Is", "Does"], correctIndex: 2, explanation: "He → Is: Is he going to call back?" },
      { id: "3-8", prompt: '"Are they going to move?" — "No, ___.', options: ["they don't", "they isn't", "they aren't", "they not"], correctIndex: 2, explanation: "Short negative answer: No, they aren't." },
      { id: "3-9", prompt: "___ I going to pass the exam?", options: ["Is", "Are", "Am", "Do"], correctIndex: 2, explanation: "I → Am: Am I going to pass?" },
      { id: "3-10", prompt: '"Is he going to retire?" — "No, ___.', options: ["he doesn't", "he not", "he isn't", "he aren't"], correctIndex: 2, explanation: "Short negative answer: No, he isn't." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: be going to vs will + all forms",
    instructions:
      "This exercise mixes affirmative, negative, and question forms, and tests the difference between be going to (plans/evidence) and will (spontaneous decisions/general predictions).",
    questions: [
      { id: "4-1", prompt: "Look at those dark clouds! It ___ going to storm.", options: ["are", "am", "is", "be"], correctIndex: 2, explanation: "Evidence visible → is going to: It is going to storm." },
      { id: "4-2", prompt: "___ you going to tell him the news?", options: ["Is", "Am", "Are", "Do"], correctIndex: 2, explanation: "You → Are: Are you going to tell him?" },
      { id: "4-3", prompt: "I ___ going to apply for that job — I've already prepared my CV.", options: ["aren't", "isn't", "'m not", "not"], correctIndex: 2, explanation: "I + negative → 'm not: I'm not going to apply." },
      { id: "4-4", prompt: '"Is she going to study abroad?" — "Yes, ___.', options: ["she does", "she is", "she are", "she am"], correctIndex: 1, explanation: "Short answer with is: Yes, she is." },
      { id: "4-5", prompt: "They ___ going to announce the winner tonight.", options: ["is", "am", "are", "be"], correctIndex: 2, explanation: "They → are: They are going to announce." },
      { id: "4-6", prompt: "He ___ going to make it — he booked his flight last week.", options: ["aren't", "am not", "isn't", "not"], correctIndex: 2, explanation: "He + negative → isn't: He isn't going to make it." },
      { id: "4-7", prompt: "___ it going to be a long meeting?", options: ["Am", "Are", "Is", "Do"], correctIndex: 2, explanation: "It → Is: Is it going to be a long meeting?" },
      { id: "4-8", prompt: "We ___ going to renovate the kitchen next month.", options: ["is", "am", "are", "be"], correctIndex: 2, explanation: "We → are: We are going to renovate." },
      { id: "4-9", prompt: '"Are you going to quit?" — "No, ___.', options: ["I don't", "I isn't", "I'm not", "I aren't"], correctIndex: 2, explanation: "Short negative: No, I'm not." },
      { id: "4-10", prompt: "She ___ going to be a great doctor — she works so hard.", options: ["are", "is", "am", "be"], correctIndex: 1, explanation: "She → is: She is going to be a great doctor." },
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

export default function BeGoingToQuizClient() {
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
    try { await generateLessonPDF(BGT_PDF_CONFIG); } finally { setPdfLoading(false); }
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
          <a className="hover:text-slate-900 transition" href="/tenses/be-going-to">Be Going To</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Multiple Choice</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Be Going To{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Quiz</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Practice <b>Be Going To</b> with 40 multiple choice questions across four sets: affirmative, negative, questions, and a mixed review including be going to vs will. Pick the correct form and check your answers.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className=""><SpeedRound gameId="bgt-quiz" subject="Be Going To Quiz" questions={BGT_SPEED_QUESTIONS} variant="sidebar" /></div>
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

          {/* Right column */}
          {isPro ? (
            <TenseRecommendations tense="be-going-to" />
          ) : (
            <AdUnit variant="sidebar-light" />
          )}
        </div>

        {!isPro && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
            <div className="hidden lg:block" />
            <SpeedRound gameId="bgt-quiz" subject="Be Going To Quiz" questions={BGT_SPEED_QUESTIONS} />
            <div className="hidden lg:block" />
          </div>
        )}

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/be-going-to" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Be Going To exercises</a>
          <a href="/tenses/be-going-to/fill-in-blank" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Fill in the Blank →</a>
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
            { text: "am / is / are", color: "yellow" },
            { text: "going to", color: "violet" },
            { text: "verb (base form)", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I am going to work.  ·  She is going to leave.  ·  They are going to play." />
            <Ex en="I'm going to study.  ·  He's going to call.  ·  We're going to travel." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "am not / isn't / aren't", color: "red" },
            { text: "going to", color: "violet" },
            { text: "verb (base form)", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I'm not going to stay.  ·  He isn't going to come.  ·  They aren't going to wait." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Am / Is / Are", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "going to", color: "violet" },
            { text: "verb (base form)", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Am I going to pass?  ·  Is she going to leave?  ·  Are they going to join us?" />
          </div>
        </div>
      </div>

      {/* am / is / are table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Which auxiliary to use</div>
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
                ["I", "am going to work", "'m not going to work", "Am I going to work?"],
                ["He / She / It", "is going to work ★", "isn't going to work", "Is she going to work?"],
                ["You", "are going to work", "aren't going to work", "Are you going to work?"],
                ["We / They", "are going to work", "aren't going to work", "Are they going to work?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i === 1 ? "bg-amber-50 font-bold" : "bg-white"}>
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
          <span className="font-black">★ Key rule:</span> Only <b>am / is / are</b> changes — <b>&quot;going to&quot;</b> never changes!<br />
          <span className="text-xs">She <b>is</b> going to leave ✅ &nbsp; She <b>are</b> going to leave ❌</span>
        </div>
      </div>

      {/* When to use */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use be going to</div>
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="text-sm font-black text-emerald-800 mb-2">1. Plans and intentions (already decided)</div>
            <div className="space-y-1.5">
              <Ex en="I'm going to visit my parents this weekend. (decision already made)" />
              <Ex en="She's going to study medicine. (future plan)" />
            </div>
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
            <div className="text-sm font-black text-sky-800 mb-2">2. Predictions based on visible evidence</div>
            <div className="space-y-1.5">
              <Ex en="Look at those clouds — it's going to rain! (you can see the evidence)" />
              <Ex en="He's going to fall — be careful! (visible current situation)" />
            </div>
          </div>
        </div>
      </div>

      {/* be going to vs will */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Be going to vs Will</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-violet-700">be going to</th>
                <th className="px-4 py-2.5 font-black text-sky-700">will</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Pre-planned decisions", "Spontaneous decisions"],
                ["Predictions with visible evidence", "General predictions (opinion)"],
                ["I'm going to buy a car. (planned)", "I'll help you carry that. (spontaneous)"],
                ["It's going to snow — look at those clouds!", "I think it will snow this winter."],
              ].map(([a, b], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-violet-700 text-sm">{a}</td>
                  <td className="px-4 py-2.5 text-sky-700 text-sm">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["tomorrow", "next week", "next month", "next year", "soon", "tonight", "this weekend", "in the future", "this summer"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
