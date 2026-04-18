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
    title: "Exercise 1 — Regular verbs: write the past simple form",
    instructions:
      "Write the correct Past Simple form of the regular verb in brackets. Remember the spelling rules: add -ed, drop the silent -e, double CVC consonant, or change y→ied.",
    questions: [
      { id: "1-1", prompt: "She ___ (work) late last night.", hint: "(work)", correct: ["worked"], explanation: "work → worked (regular)" },
      { id: "1-2", prompt: "They ___ (play) tennis yesterday morning.", hint: "(play)", correct: ["played"], explanation: "play → played (vowel + y, just add -ed)" },
      { id: "1-3", prompt: "He ___ (study) for three hours.", hint: "(study)", correct: ["studied"], explanation: "study → studied (consonant + y → ied)" },
      { id: "1-4", prompt: "We ___ (visit) the museum last Sunday.", hint: "(visit)", correct: ["visited"], explanation: "visit → visited (regular, add -ed)" },
      { id: "1-5", prompt: "She ___ (close) the window before leaving.", hint: "(close)", correct: ["closed"], explanation: "close → closed (drop -e, add -d)" },
      { id: "1-6", prompt: "He ___ (stop) the car at the red light.", hint: "(stop)", correct: ["stopped"], explanation: "stop → stopped (CVC: double final consonant)" },
      { id: "1-7", prompt: "I ___ (try) to call you all morning.", hint: "(try)", correct: ["tried"], explanation: "try → tried (consonant + y → ied)" },
      { id: "1-8", prompt: "They ___ (watch) the football match together.", hint: "(watch)", correct: ["watched"], explanation: "watch → watched (regular, add -ed)" },
      { id: "1-9", prompt: "She ___ (like) the new restaurant very much.", hint: "(like)", correct: ["liked"], explanation: "like → liked (drop -e, add -d)" },
      { id: "1-10", prompt: "He ___ (plan) the trip carefully.", hint: "(plan)", correct: ["planned"], explanation: "plan → planned (CVC: double final consonant)" },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Irregular verbs: write the past simple form",
    instructions:
      "Write the correct Past Simple form of the irregular verb in brackets. These forms must be memorised — they do not follow the -ed pattern.",
    questions: [
      { id: "2-1", prompt: "She ___ (go) to the gym this morning.", hint: "(go)", correct: ["went"], explanation: "go → went (irregular)" },
      { id: "2-2", prompt: "He ___ (have) a great time at the party.", hint: "(have)", correct: ["had"], explanation: "have → had (irregular)" },
      { id: "2-3", prompt: "I ___ (see) an old friend in town yesterday.", hint: "(see)", correct: ["saw"], explanation: "see → saw (irregular)" },
      { id: "2-4", prompt: "They ___ (eat) at a nice restaurant last night.", hint: "(eat)", correct: ["ate"], explanation: "eat → ate (irregular)" },
      { id: "2-5", prompt: "She ___ (write) an email to her boss.", hint: "(write)", correct: ["wrote"], explanation: "write → wrote (irregular)" },
      { id: "2-6", prompt: "He ___ (take) the train to the city.", hint: "(take)", correct: ["took"], explanation: "take → took (irregular)" },
      { id: "2-7", prompt: "We ___ (make) a delicious pizza for dinner.", hint: "(make)", correct: ["made"], explanation: "make → made (irregular)" },
      { id: "2-8", prompt: "She ___ (think) about the problem all day.", hint: "(think)", correct: ["thought"], explanation: "think → thought (irregular)" },
      { id: "2-9", prompt: "He ___ (buy) a new laptop last week.", hint: "(buy)", correct: ["bought"], explanation: "buy → bought (irregular)" },
      { id: "2-10", prompt: "They ___ (come) home very late last night.", hint: "(come)", correct: ["came"], explanation: "come → came (irregular)" },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Negatives & questions with did",
    instructions:
      "Write the correct negative or question form using did/didn't + the base form of the verb in brackets. Never use the past form after didn't or did.",
    questions: [
      { id: "3-1", prompt: "I ___ (not/eat) breakfast this morning.", hint: "(not/eat)", correct: ["didn't eat", "did not eat"], explanation: "Negative: didn't + base form → didn't eat" },
      { id: "3-2", prompt: "She ___ (not/go) to school yesterday.", hint: "(not/go)", correct: ["didn't go", "did not go"], explanation: "Negative: didn't + base form → didn't go" },
      { id: "3-3", prompt: "___ (you/see) the news last night? (see)", hint: "(you/see)", correct: ["did you see the news last night?", "did you see the news last night", "did you see?", "did you see"], explanation: "Question: Did + you + base form?" },
      { id: "3-4", prompt: "He ___ (not/finish) his homework in time.", hint: "(not/finish)", correct: ["didn't finish", "did not finish"], explanation: "Negative: didn't + base form → didn't finish" },
      { id: "3-5", prompt: "___ (she/study) for the exam? (study)", hint: "(she/study)", correct: ["did she study for the exam?", "did she study for the exam", "did she study?", "did she study"], explanation: "Question: Did + she + base form?" },
      { id: "3-6", prompt: "They ___ (not/come) to the meeting.", hint: "(not/come)", correct: ["didn't come", "did not come"], explanation: "Negative: didn't + base form → didn't come" },
      { id: "3-7", prompt: "\"Did you call him?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["i did", "yes, i did"], explanation: "Short answer: Yes, I did." },
      { id: "3-8", prompt: "\"Did she win?\" — \"No, ___.\"", hint: "(short answer)", correct: ["she didn't", "she did not", "no, she didn't", "no, she did not"], explanation: "Short negative answer: No, she didn't." },
      { id: "3-9", prompt: "We ___ (not/know) about the change.", hint: "(not/know)", correct: ["didn't know", "did not know"], explanation: "Negative: didn't + base form → didn't know" },
      { id: "3-10", prompt: "What ___ (you/do) at the weekend? (do)", hint: "(you/do)", correct: ["did you do at the weekend?", "did you do at the weekend", "did you do?", "did you do"], explanation: "Wh- question: What + did + subject + base form?" },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: regular, irregular, negatives, and questions",
    instructions:
      "Write the correct Past Simple form of the verb in brackets. Read each sentence carefully — some require affirmative, some negative, and some question forms.",
    questions: [
      { id: "4-1", prompt: "She ___ (give) him a lovely birthday present.", hint: "(give)", correct: ["gave"], explanation: "Affirmative: give → gave (irregular)" },
      { id: "4-2", prompt: "He ___ (not/tell) anyone about the surprise.", hint: "(not/tell)", correct: ["didn't tell", "did not tell"], explanation: "Negative: didn't + base form → didn't tell" },
      { id: "4-3", prompt: "They ___ (finish) the project before the deadline.", hint: "(finish)", correct: ["finished"], explanation: "Affirmative: finish → finished (regular)" },
      { id: "4-4", prompt: "___ (he/find) his wallet? (find)", hint: "(he/find)", correct: ["did he find his wallet?", "did he find his wallet", "did he find?", "did he find"], explanation: "Question: Did + he + base form?" },
      { id: "4-5", prompt: "I ___ (feel) really tired after the long walk.", hint: "(feel)", correct: ["felt"], explanation: "Affirmative: feel → felt (irregular)" },
      { id: "4-6", prompt: "She ___ (not/sleep) well last night.", hint: "(not/sleep)", correct: ["didn't sleep", "did not sleep"], explanation: "Negative: didn't + base form → didn't sleep" },
      { id: "4-7", prompt: "We ___ (spend) a week in Paris last summer.", hint: "(spend)", correct: ["spent"], explanation: "Affirmative: spend → spent (irregular)" },
      { id: "4-8", prompt: "\"Did they enjoy the concert?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["they did", "yes, they did"], explanation: "Short answer: Yes, they did." },
      { id: "4-9", prompt: "He ___ (drop) his phone on the way home.", hint: "(drop)", correct: ["dropped"], explanation: "Affirmative: drop → dropped (CVC: double consonant)" },
      { id: "4-10", prompt: "She ___ (not/want) to leave the party early.", hint: "(not/want)", correct: ["didn't want", "did not want"], explanation: "Negative: didn't + base form → didn't want" },
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
          <a className="hover:text-slate-900 transition" href="/tenses/past-simple">Past Simple</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Fill in the Blank</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Writing</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Type the correct <b>Past Simple</b> form of the verb in brackets. Four exercise sets — regular verbs, irregular verbs, negatives &amp; questions, and mixed. Pay attention to spelling rules and irregular forms.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className=""><SpeedRound gameId="ps-fill-in-blank" subject="Past Simple" questions={PS_SPEED_QUESTIONS} variant="sidebar" /></div>
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
                                          className={`rounded-lg border px-3 py-1 text-sm font-mono outline-none transition min-w-[150px] ${
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
            <TenseRecommendations tense="past-simple" />
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/past-simple/quiz" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Multiple Choice</a>
          <a href="/tenses/past-simple/spot-the-mistake" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Spot the Mistake →</a>
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
            <Ex en="She worked late.  ·  He went home.  ·  They played tennis." />
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

      {/* Regular verb spelling rules */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Regular verb spelling rules (-ed)</div>
        <div className="space-y-2">
          {[
            { rule: "Most verbs → add -ed", ex: "work → worked · visit → visited · finish → finished" },
            { rule: "Ends in -e → add only -d", ex: "like → liked · live → lived · close → closed · use → used" },
            { rule: "Short verb (CVC) → double final consonant + -ed", ex: "stop → stopped · plan → planned · drop → dropped · chat → chatted" },
            { rule: "Ends in consonant + y → change y to i, add -ed", ex: "study → studied · try → tried · carry → carried · worry → worried" },
            { rule: "Ends in vowel + y → just add -ed", ex: "play → played · enjoy → enjoyed · stay → stayed · delay → delayed" },
          ].map(({ rule, ex }) => (
            <div key={rule} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800">{rule}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-mono">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">Key rule: always use base form after didn&apos;t / Did</div>
        <div className="mt-1 text-xs text-amber-700 space-y-1">
          <div>She <b>didn&apos;t go</b> ✅ &nbsp;|&nbsp; She didn&apos;t went ❌</div>
          <div><b>Did</b> he eat? ✅ &nbsp;|&nbsp; Did he ate? ❌</div>
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
            "catch → caught", "fall → fell", "forget → forgot", "keep → kept", "lose → lost",
            "pay → paid", "put → put", "send → sent", "sleep → slept", "spend → spent",
            "teach → taught", "wear → wore", "win → won",
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
