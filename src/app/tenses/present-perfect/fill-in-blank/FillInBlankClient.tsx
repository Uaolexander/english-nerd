"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import { useLiveSync } from "@/lib/useLiveSync";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { PP_SPEED_QUESTIONS, PP_PDF_CONFIG } from "../ppSharedData";
import TenseRecommendations from "@/components/TenseRecommendations";

/* ─── Types ─────────────────────────────────────────────────────────────── */

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

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/'/g, "'").replace(/'/g, "'");
}

function isAccepted(val: string, correct: string[]) {
  const n = normalize(val);
  return correct.some((c) => normalize(c) === n);
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Affirmative: write have / has + past participle",
    instructions:
      "Write the correct Present Perfect form of the verb in brackets. Use have with I / you / we / they and has with he / she / it. Remember irregular past participles!",
    questions: [
      { id: "1-1",  prompt: "She ___ (finish) her homework.",             hint: "(finish)",   correct: ["has finished"],          explanation: "She → has finished." },
      { id: "1-2",  prompt: "I ___ (visit) Paris twice.",                 hint: "(visit)",    correct: ["have visited"],          explanation: "I → have visited." },
      { id: "1-3",  prompt: "They ___ (live) here for ten years.",        hint: "(live)",     correct: ["have lived"],            explanation: "They → have lived." },
      { id: "1-4",  prompt: "He ___ (just / leave) the office.",          hint: "(leave)",    correct: ["has just left"],         explanation: "He → has just left. (leave → left: irregular)" },
      { id: "1-5",  prompt: "We ___ (already / eat) lunch.",              hint: "(eat)",      correct: ["have already eaten"],    explanation: "We → have already eaten. (eat → eaten: irregular)" },
      { id: "1-6",  prompt: "The film ___ (start).",                      hint: "(start)",    correct: ["has started"],           explanation: "The film (= it) → has started." },
      { id: "1-7",  prompt: "You ___ (do) a great job.",                  hint: "(do)",       correct: ["have done"],             explanation: "You → have done. (do → done: irregular)" },
      { id: "1-8",  prompt: "My parents ___ (go) to Spain.",              hint: "(go)",       correct: ["have gone"],             explanation: "My parents (= they) → have gone. (go → gone: irregular)" },
      { id: "1-9",  prompt: "It ___ (be) very cold this week.",           hint: "(be)",       correct: ["has been"],              explanation: "It → has been. (be → been: irregular)" },
      { id: "1-10", prompt: "The children ___ (never / try) sushi.",      hint: "(try)",      correct: ["have never tried"],      explanation: "The children (= they) → have never tried." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: write haven't / hasn't + past participle",
    instructions:
      "Write the full negative Present Perfect form: haven't / hasn't + past participle. Use haven't with I / you / we / they, and hasn't with he / she / it.",
    questions: [
      { id: "2-1",  prompt: "She ___ (call) me yet.",                     hint: "(call)",     correct: ["hasn't called", "has not called"],       explanation: "She → hasn't called yet." },
      { id: "2-2",  prompt: "I ___ (see) that film.",                     hint: "(see)",      correct: ["haven't seen", "have not seen"],         explanation: "I → haven't seen. (see → seen: irregular)" },
      { id: "2-3",  prompt: "They ___ (finish) the project yet.",         hint: "(finish)",   correct: ["haven't finished", "have not finished"], explanation: "They → haven't finished yet." },
      { id: "2-4",  prompt: "He ___ (eat) anything today.",               hint: "(eat)",      correct: ["hasn't eaten", "has not eaten"],         explanation: "He → hasn't eaten. (eat → eaten: irregular)" },
      { id: "2-5",  prompt: "We ___ (be) to Japan.",                      hint: "(be)",       correct: ["haven't been", "have not been"],         explanation: "We → haven't been. (be → been: irregular)" },
      { id: "2-6",  prompt: "It ___ (rain) for weeks.",                   hint: "(rain)",     correct: ["hasn't rained", "has not rained"],       explanation: "It → hasn't rained." },
      { id: "2-7",  prompt: "You ___ (answer) my question.",              hint: "(answer)",   correct: ["haven't answered", "have not answered"], explanation: "You → haven't answered." },
      { id: "2-8",  prompt: "My sister ___ (arrive) yet.",                hint: "(arrive)",   correct: ["hasn't arrived", "has not arrived"],     explanation: "My sister (= she) → hasn't arrived yet." },
      { id: "2-9",  prompt: "The results ___ (be) published yet.",        hint: "(be)",       correct: ["haven't been", "have not been"],         explanation: "The results (= they) → haven't been published yet." },
      { id: "2-10", prompt: "He ___ (speak) to her since Monday.",        hint: "(speak)",    correct: ["hasn't spoken", "has not spoken"],       explanation: "He → hasn't spoken. (speak → spoken: irregular)" },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions, short answers + ever / never / just / already / yet",
    instructions:
      "Write the question, short answer, or the missing time adverb. For questions, start with Have or Has. Short answers repeat only have / has.",
    questions: [
      { id: "3-1",  prompt: "___ she ever been to Australia?",            hint: "(Has/Have)", correct: ["has she ever been to australia?", "has she ever been to australia"], explanation: "She → Has: Has she ever been to Australia?" },
      { id: "3-2",  prompt: "___ you finished your report?",              hint: "(Has/Have)", correct: ["have you finished your report?", "have you finished your report", "have you finished?", "have you finished"], explanation: "You → Have: Have you finished your report?" },
      { id: "3-3",  prompt: "___ they ever tried Indian food?",           hint: "(Has/Have)", correct: ["have they ever tried indian food?", "have they ever tried indian food", "have they ever tried?", "have they ever tried"], explanation: "They → Have: Have they ever tried Indian food?" },
      { id: "3-4",  prompt: "\"Have you seen him?\" — \"No, ___.\"",      hint: "(short)",    correct: ["i haven't", "i have not", "no, i haven't", "no, i have not"], explanation: "Short negative answer with have: No, I haven't." },
      { id: "3-5",  prompt: "\"Has she called?\" — \"Yes, ___.\"",        hint: "(short)",    correct: ["she has", "yes, she has"],              explanation: "Short positive answer with has: Yes, she has." },
      { id: "3-6",  prompt: "I have ___ been to China. (not at any time)", hint: "(adverb)",  correct: ["never"],                               explanation: "Never = not at any time: I have never been to China." },
      { id: "3-7",  prompt: "\"Have they arrived?\" — \"Yes, ___.\"",     hint: "(short)",    correct: ["they have", "yes, they have"],          explanation: "Short positive answer: Yes, they have." },
      { id: "3-8",  prompt: "___ he ever eaten octopus?",                 hint: "(Has/Have)", correct: ["has he ever eaten octopus?", "has he ever eaten octopus", "has he ever eaten?", "has he ever eaten"], explanation: "He → Has: Has he ever eaten octopus?" },
      { id: "3-9",  prompt: "She has ___ left — she just walked out.",    hint: "(adverb)",   correct: ["just"],                                explanation: "Just = very recently: She has just left." },
      { id: "3-10", prompt: "Have you finished ___ or are you still working?", hint: "(adverb)", correct: ["yet"],                             explanation: "Yet in questions about completion: Have you finished yet?" },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: affirmative, negative, questions + since / for",
    instructions:
      "Write the correct Present Perfect form of the verb in brackets, or the correct time expression. This exercise mixes all forms and tests since vs for.",
    questions: [
      { id: "4-1",  prompt: "I ___ (just / finish) the book.",            hint: "(finish)",   correct: ["have just finished"],                   explanation: "I → have just finished." },
      { id: "4-2",  prompt: "She ___ (work) here since 2019.",            hint: "(work)",     correct: ["has worked"],                           explanation: "She → has worked here since 2019." },
      { id: "4-3",  prompt: "___ (you / ever / meet) a famous person?",   hint: "(meet)",     correct: ["have you ever met a famous person?", "have you ever met a famous person", "have you ever met?", "have you ever met"], explanation: "You → Have you ever met…? (meet → met: irregular)" },
      { id: "4-4",  prompt: "They ___ (live) in London ___ five years.",  hint: "(live/for)", correct: ["have lived", "have lived in london for five years"], explanation: "They → have lived … for five years. For + period of time." },
      { id: "4-5",  prompt: "He ___ (not / call) me ___ last week.",      hint: "(call/since)", correct: ["hasn't called", "has not called"],    explanation: "He → hasn't called … since last week. Since + point in time." },
      { id: "4-6",  prompt: "___ (she / already / read) that book?",      hint: "(read)",     correct: ["has she already read that book?", "has she already read that book", "has she already read?", "has she already read"], explanation: "She → Has she already read…? (read → read: same form)" },
      { id: "4-7",  prompt: "We ___ (not / see) each other ___ ages.",    hint: "(see/for)",  correct: ["haven't seen", "have not seen"],        explanation: "We → haven't seen … for ages." },
      { id: "4-8",  prompt: "It ___ (be) raining ___ Monday.",            hint: "(be/since)", correct: ["has been"],                            explanation: "It → has been raining since Monday." },
      { id: "4-9",  prompt: "\"Have you eaten yet?\" — \"No, ___.\"",     hint: "(short)",    correct: ["i haven't", "i have not", "no, i haven't", "no, i have not"], explanation: "Short negative: No, I haven't." },
      { id: "4-10", prompt: "How long ___ (you / study) English?",        hint: "(study)",    correct: ["have you studied", "have you been studying"], explanation: "How long → Have you studied / Have you been studying English?" },
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

export default function FillInBlankClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const isPro = useIsPro();

  const current = SETS[exNo];

  const { save } = useProgress();

  const { isLive, broadcast } = useLiveSync((payload) => {
    setAnswers(payload.answers as Record<string, string>);
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3 | 4);
  });

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
      if (isAccepted(answers[q.id] ?? "", q.correct)) correct++;
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
          <span className="text-slate-700 font-medium">Fill in the Blank</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Writing</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">B1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Type the correct <b>Present Perfect</b> form of the verb in brackets. Four exercise sets — affirmative, negative, questions, and mixed. Pay attention to irregular past participles.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className=""><SpeedRound gameId="pp-fill-in-blank" subject="Present Perfect" questions={PP_SPEED_QUESTIONS} variant="sidebar" /></div>
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

                  <div className="mt-8 space-y-4">
                    {current.questions.map((q, idx) => {
                      const val = answers[q.id] ?? "";
                      const answered = normalize(val) !== "";
                      const correct = checked && answered && isAccepted(val, q.correct);
                      const wrong = checked && answered && !correct;
                      const noAnswer = checked && !answered;

                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900 leading-relaxed">
                                {q.prompt.split("___").map((part, i, arr) =>
                                  i < arr.length - 1 ? (
                                    <span key={i}>
                                      {part}
                                      <span className="inline-block align-baseline mx-1">
                                        <input
                                          type="text"
                                          value={val}
                                          disabled={checked}
                                          autoComplete="off"
                                          autoCorrect="off"
                                          autoCapitalize="off"
                                          spellCheck={false}
                                          placeholder={q.hint}
                                          onChange={(e) => {
                                            const newAnswers = { ...answers, [q.id]: e.target.value };
                                            setAnswers(newAnswers);
                                            broadcast({ answers: newAnswers, checked, exNo });
                                          }}
                                          className={`rounded-lg border px-3 py-1 text-sm font-mono outline-none transition min-w-[180px] ${
                                            checked
                                              ? correct
                                                ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                                                : wrong
                                                ? "border-red-400 bg-red-50 text-red-800"
                                                : noAnswer
                                                ? "border-amber-300 bg-amber-50"
                                                : ""
                                              : "border-black/15 bg-white focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/20"
                                          }`}
                                        />
                                      </span>
                                    </span>
                                  ) : (
                                    part
                                  )
                                )}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {correct && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {wrong && <div className="text-red-700 font-semibold">❌ Wrong — you wrote: <span className="font-mono">{val}</span></div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-1.5 text-slate-600">
                                    <b className="text-slate-900">Correct answer:</b>{" "}
                                    <span className="font-mono font-bold text-slate-800">{q.correct[0]}</span> — {q.explanation}
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
            <SpeedRound gameId="pp-fill-in-blank" subject="Present Perfect" questions={PP_SPEED_QUESTIONS} />
            <div className="hidden lg:block" />
          </div>
        )}

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/present-perfect/quiz" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Multiple Choice</a>
          <a href="/tenses/present-perfect/spot-the-mistake" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Spot the Mistake →</a>
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
            <Ex en="I have worked.  ·  She has eaten.  ·  They have gone." />
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
            <Ex en="I haven't seen him.  ·  She hasn't called.  ·  They haven't arrived." />
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
            <Ex en="Have you seen this film?  ·  Has she arrived?" />
          </div>
        </div>
      </div>

      {/* have / has table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">have vs has</div>
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
                ["I / You / We / They", "have worked", "haven't worked", "Have you worked?"],
                ["He / She / It ★", "has worked", "hasn't worked", "Has she worked?"],
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
          <span className="font-black">★ Key rule:</span> He / She / It always use <b>has</b> / <b>hasn&apos;t</b>. The verb after have/has must be the <b>past participle</b>.<br />
          <span className="text-xs">She <b>has finished</b> ✅ &nbsp; She <b>have finished</b> ❌ &nbsp; She <b>has finish</b> ❌</span>
        </div>
      </div>

      {/* When to use — 4 use cases */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use Present Perfect</div>
        <div className="space-y-3">
          {[
            { label: "Life experience (ever / never)", color: "violet", examples: ["Have you ever been to Japan?", "I've never tried sushi."] },
            { label: "Recent past with present result (just)", color: "sky", examples: ["She has just left the office.", "I've just finished."] },
            { label: "Action still ongoing (since / for)", color: "green", examples: ["I've lived here for 5 years.", "She's worked here since 2020."] },
            { label: "Completion / achievement (already / yet)", color: "yellow", examples: ["I've already done my homework.", "Have you finished yet?"] },
          ].map(({ label, color, examples }) => {
            const borderMap: Record<string, string> = { violet: "border-violet-200 bg-violet-50/50", sky: "border-sky-200 bg-sky-50/50", green: "border-emerald-200 bg-emerald-50/50", yellow: "border-amber-200 bg-amber-50/50" };
            const badgeMap: Record<string, string> = { violet: "bg-violet-100 text-violet-800 border-violet-200", sky: "bg-sky-100 text-sky-800 border-sky-200", green: "bg-emerald-100 text-emerald-800 border-emerald-200", yellow: "bg-yellow-100 text-yellow-800 border-yellow-200" };
            return (
              <div key={label} className={`rounded-xl border p-4 ${borderMap[color]}`}>
                <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-black mb-2 ${badgeMap[color]}`}>{label}</span>
                <div className="space-y-1">
                  {examples.map((ex) => <Ex key={ex} en={ex} />)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Common irregular past participles */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Common irregular past participles</div>
        <div className="flex flex-wrap gap-2">
          {[
            "be → been", "do → done", "go → gone", "see → seen", "eat → eaten",
            "come → come", "take → taken", "make → made", "give → given", "get → got",
            "find → found", "know → known", "think → thought", "buy → bought", "leave → left",
            "write → written", "read → read", "tell → told", "hear → heard", "feel → felt",
            "meet → met", "run → run", "fly → flown", "drink → drunk", "drive → driven",
            "break → broken", "bring → brought", "build → built", "catch → caught", "lose → lost",
          ].map((v) => (
            <span key={v} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{v}</span>
          ))}
        </div>
      </div>

      {/* PP vs Past Simple */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Present Perfect vs Past Simple</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <div className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">Present Perfect</div>
            <div className="space-y-1.5 text-sm text-emerald-900">
              <div>No specific time mentioned</div>
              <div className="font-mono text-xs">I have seen that film.</div>
              <div className="font-mono text-xs">She has just called.</div>
              <div className="font-mono text-xs">Have you ever been to Italy?</div>
            </div>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
            <div className="text-xs font-black text-red-700 uppercase tracking-widest mb-2">Past Simple</div>
            <div className="space-y-1.5 text-sm text-red-900">
              <div>Specific time mentioned</div>
              <div className="font-mono text-xs">I saw that film last week.</div>
              <div className="font-mono text-xs">She called an hour ago.</div>
              <div className="font-mono text-xs">Did you go to Italy last year?</div>
            </div>
          </div>
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["already", "yet", "just", "ever", "never", "since 2020", "since Monday", "for 5 years", "for a long time", "recently", "so far", "today", "this week", "this month", "this year", "many times", "once", "twice"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
