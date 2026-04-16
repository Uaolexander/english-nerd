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
    title: "Exercise 1 — Affirmative: will have + past participle",
    instructions:
      "Write the correct Future Perfect form of the verb in brackets. Use will have + past participle for all subjects. Look for 'by' + a future time.",
    questions: [
      { id: "1-1", prompt: "By 6 PM, she ___ (finish) all her work.", hint: "(finish)", correct: ["will have finished"], explanation: "She will have finished — affirmative Future Perfect." },
      { id: "1-2", prompt: "By the time you arrive, I ___ (cook) dinner.", hint: "(cook)", correct: ["will have cooked"], explanation: "I will have cooked — completed before your arrival." },
      { id: "1-3", prompt: "By next year, they ___ (build) the new stadium.", hint: "(build)", correct: ["will have built"], explanation: "They will have built — irregular: build → built." },
      { id: "1-4", prompt: "He ___ (forget) about it by tomorrow.", hint: "(forget)", correct: ["will have forgotten"], explanation: "He will have forgotten — irregular: forget → forgotten." },
      { id: "1-5", prompt: "By the time the film starts, we ___ (eat).", hint: "(eat)", correct: ["will have eaten"], explanation: "We will have eaten — irregular: eat → eaten." },
      { id: "1-6", prompt: "By Monday, the team ___ (complete) the project.", hint: "(complete)", correct: ["will have completed"], explanation: "The team will have completed — regular: complete → completed." },
      { id: "1-7", prompt: "She ___ (leave) by the time you get there.", hint: "(leave)", correct: ["will have left"], explanation: "She will have left — irregular: leave → left." },
      { id: "1-8", prompt: "By next week, I ___ (read) the whole novel.", hint: "(read)", correct: ["will have read"], explanation: "I will have read — irregular: read → read (pronounced /red/)." },
      { id: "1-9", prompt: "By the end of the month, he ___ (spend) all his savings.", hint: "(spend)", correct: ["will have spent"], explanation: "He will have spent — irregular: spend → spent." },
      { id: "1-10", prompt: "By the time you call, they ___ (make) a decision.", hint: "(make)", correct: ["will have made"], explanation: "They will have made — irregular: make → made." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: won't have + past participle",
    instructions:
      "Write the full negative Future Perfect form using won't have + past participle. The subject won't complete the action by the stated time.",
    questions: [
      { id: "2-1", prompt: "She ___ (finish) the report by Friday — she needs more time.", hint: "(finish)", correct: ["won't have finished", "will not have finished"], explanation: "She won't have finished — negative Future Perfect." },
      { id: "2-2", prompt: "I ___ (complete) the course by summer — it's too long.", hint: "(complete)", correct: ["won't have completed", "will not have completed"], explanation: "I won't have completed — the course is too long." },
      { id: "2-3", prompt: "They ___ (arrive) by 8 PM — they left too late.", hint: "(arrive)", correct: ["won't have arrived", "will not have arrived"], explanation: "They won't have arrived — negative: won't have + past participle." },
      { id: "2-4", prompt: "He ___ (save) enough money by then.", hint: "(save)", correct: ["won't have saved", "will not have saved"], explanation: "He won't have saved — negative Future Perfect." },
      { id: "2-5", prompt: "We ___ (eat) by the time they get here — dinner isn't ready.", hint: "(eat)", correct: ["won't have eaten", "will not have eaten"], explanation: "We won't have eaten — irregular: eat → eaten." },
      { id: "2-6", prompt: "By Monday, she ___ (read) all the documents.", hint: "(read)", correct: ["won't have read", "will not have read"], explanation: "She won't have read — negative Future Perfect, irregular: read → read." },
      { id: "2-7", prompt: "By next year, they ___ (sell) the house yet.", hint: "(sell)", correct: ["won't have sold", "will not have sold"], explanation: "They won't have sold — irregular: sell → sold." },
      { id: "2-8", prompt: "I ___ (write) the letter by this afternoon.", hint: "(write)", correct: ["won't have written", "will not have written"], explanation: "I won't have written — irregular: write → written." },
      { id: "2-9", prompt: "He ___ (learn) all the vocabulary by the test.", hint: "(learn)", correct: ["won't have learned", "won't have learnt", "will not have learned", "will not have learnt"], explanation: "He won't have learned — both learned and learnt are accepted." },
      { id: "2-10", prompt: "By next week, she ___ (recover) from her illness.", hint: "(recover)", correct: ["won't have recovered", "will not have recovered"], explanation: "She won't have recovered — negative Future Perfect." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions and short answers",
    instructions:
      "Write the Future Perfect question or short answer. Questions: Will + subject + have + past participle? Short answers use will / won't.",
    questions: [
      { id: "3-1", prompt: "___ (you / finish) by tomorrow? (finish)", hint: "(you / finish)", correct: ["will you have finished by tomorrow?", "will you have finished?", "will you have finished"], explanation: "Will you have finished? — Future Perfect question." },
      { id: "3-2", prompt: "___ (she / leave) by the time we arrive? (leave)", hint: "(she / leave)", correct: ["will she have left by the time we arrive?", "will she have left?", "will she have left"], explanation: "Will she have left? — irregular: leave → left." },
      { id: "3-3", prompt: "___ (they / complete) the project by Friday? (complete)", hint: "(they / complete)", correct: ["will they have completed the project by friday?", "will they have completed the project by friday", "will they have completed?", "will they have completed"], explanation: "Will they have completed the project by Friday?" },
      { id: "3-4", prompt: "___ (he / read) the report before the meeting? (read)", hint: "(he / read)", correct: ["will he have read the report before the meeting?", "will he have read the report?", "will he have read?", "will he have read"], explanation: "Will he have read? — irregular: read → read." },
      { id: "3-5", prompt: "___ (we / eat) before the show starts? (eat)", hint: "(we / eat)", correct: ["will we have eaten before the show starts?", "will we have eaten?", "will we have eaten"], explanation: "Will we have eaten? — irregular: eat → eaten." },
      { id: "3-6", prompt: "\"Will you have finished by 6?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["i will", "yes, i will"], explanation: "Short answer: Yes, I will." },
      { id: "3-7", prompt: "\"Will she have left by then?\" — \"No, ___.\"", hint: "(short answer)", correct: ["she won't", "she will not", "no, she won't", "no, she will not"], explanation: "Short negative answer: No, she won't." },
      { id: "3-8", prompt: "\"Will they have arrived by 8?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["they will", "yes, they will"], explanation: "Short answer: Yes, they will." },
      { id: "3-9", prompt: "\"Will he have eaten before we get there?\" — \"No, ___.\"", hint: "(short answer)", correct: ["he won't", "he will not", "no, he won't", "no, he will not"], explanation: "Short negative: No, he won't." },
      { id: "3-10", prompt: "\"Will you have written the essay by Monday?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["i will", "yes, i will"], explanation: "Short answer: Yes, I will." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: affirmative, negative, and questions",
    instructions:
      "Write the correct Future Perfect form. Read each sentence carefully to decide if it is affirmative (+), negative (−), or a question (?). Use the verb in brackets.",
    questions: [
      { id: "4-1", prompt: "By the time he calls, I ___ (go) to bed.", hint: "(go)", correct: ["will have gone"], explanation: "Affirmative: I will have gone — irregular: go → gone." },
      { id: "4-2", prompt: "I ___ (not / finish) the assignment by tonight — it's huge.", hint: "(not / finish)", correct: ["won't have finished", "will not have finished"], explanation: "Negative: won't have finished." },
      { id: "4-3", prompt: "___ (you / spend) all your money by the end of the trip? (spend)", hint: "(you / spend)", correct: ["will you have spent all your money by the end of the trip?", "will you have spent all your money?", "will you have spent?", "will you have spent"], explanation: "Question: Will you have spent? — irregular: spend → spent." },
      { id: "4-4", prompt: "By next summer, she ___ (learn) three languages.", hint: "(learn)", correct: ["will have learned", "will have learnt"], explanation: "Affirmative: will have learned / learnt." },
      { id: "4-5", prompt: "He ___ (not / save) enough for a deposit by then.", hint: "(not / save)", correct: ["won't have saved", "will not have saved"], explanation: "Negative: won't have saved." },
      { id: "4-6", prompt: "By 2030, scientists ___ (find) a cure for this disease.", hint: "(find)", correct: ["will have found"], explanation: "Affirmative: will have found — irregular: find → found." },
      { id: "4-7", prompt: "___ (they / build) the new school by September? (build)", hint: "(they / build)", correct: ["will they have built the new school by september?", "will they have built the new school?", "will they have built?", "will they have built"], explanation: "Question: Will they have built? — irregular: build → built." },
      { id: "4-8", prompt: "\"Will you have left by 7?\" — \"No, ___.\"", hint: "(short answer)", correct: ["i won't", "i will not", "no, i won't", "no, i will not"], explanation: "Short negative: No, I won't." },
      { id: "4-9", prompt: "By the end of the year, we ___ (travel) to ten countries.", hint: "(travel)", correct: ["will have traveled", "will have travelled"], explanation: "Affirmative: will have traveled / travelled." },
      { id: "4-10", prompt: "The company ___ (not / launch) the product by Christmas.", hint: "(not / launch)", correct: ["won't have launched", "will not have launched"], explanation: "Negative: won't have launched." },
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
      if (isAccepted(answers[q.id] ?? "", q.correct)) correct++;
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
          <span className="text-slate-700 font-medium">Fill in the Blank</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Writing</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700 border border-red-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Type the correct <b>Future Perfect</b> form of the verb in brackets. Four exercise sets — affirmative, negative, questions, and mixed. Pay close attention to irregular past participles.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {isPro ? (
            <div className=""><SpeedRound gameId="futperf-fill-in-blank" subject="Future Perfect Writing" questions={FUTPERF_SPEED_QUESTIONS} variant="sidebar" /></div>
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
                                          onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
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
          <a href="/tenses/future-perfect/quiz" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Multiple Choice</a>
          <a href="/tenses/future-perfect/spot-the-mistake" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Spot the Mistake →</a>
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
            <Ex en="By 6 PM, I will have finished.  ·  She will have left.  ·  They will have arrived." />
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
            <Ex en="Will you have finished by Monday?  ·  Will she have left?" />
          </div>
        </div>
      </div>

      {/* will have table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will have — same for all subjects</div>
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
                ["I / You / He / She / It / We / They", "will have finished", "won't have finished", "Will ... have finished?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className="bg-white">
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
          <span className="font-black">Key:</span> <b>will have</b> never changes — same for every subject. The past participle never changes either.<br />
          <span className="text-xs">Never &quot;will has finished&quot; ❌ — always <b>will have finished</b> ✅</span>
        </div>
      </div>

      {/* When to use */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use Future Perfect</div>
        <div className="space-y-2">
          {[
            { label: "Completed before a specific future time", ex: "By 6 PM, I will have finished my work." },
            { label: "Completed before another future action", ex: "By the time you arrive, she will have already left." },
            { label: "Prediction about a completed future state", ex: "He will have forgotten about it by tomorrow." },
          ].map(({ label, ex }) => (
            <div key={label} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800 mb-1.5">{label}</div>
              <Ex en={ex} />
            </div>
          ))}
        </div>
      </div>

      {/* Irregular past participles */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Irregular past participles</div>
        <div className="flex flex-wrap gap-2">
          {[
            "go → gone", "eat → eaten", "see → seen", "come → come", "take → taken",
            "make → made", "write → written", "read → read", "leave → left", "speak → spoken",
            "be → been", "have → had", "find → found", "know → known", "think → thought",
            "buy → bought", "tell → told", "hear → heard", "feel → felt", "spend → spent",
            "build → built", "break → broken", "fall → fallen", "forget → forgotten", "lose → lost",
            "pay → paid", "win → won", "do → done", "run → run", "send → sent",
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
      </div>

    </div>
  );
}
