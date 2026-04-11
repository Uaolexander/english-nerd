"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import GrammarRecommended, { type GrammarRec } from "@/components/GrammarRecommended";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF, type LessonPDFConfig } from "@/lib/generateLessonPDF";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "At 8pm, she ___ TV.", options: ["watched","was watching","is watching","watches"], answer: 1 },
  { q: "They ___ football when it rained.", options: ["played","were playing","are playing","play"], answer: 1 },
  { q: "___ it raining when you left?", options: ["Did","Was","Were","Is"], answer: 1 },
  { q: "I ___ when she knocked.", options: ["slept","was sleeping","sleep","sleeps"], answer: 1 },
  { q: "We ___ dinner when she arrived.", options: ["had","were having","have","have had"], answer: 1 },
  { q: "She ___ a shower when phone rang.", options: ["took","was taking","takes","take"], answer: 1 },
  { q: "Past Continuous = was/were + ___", options: ["verb","past tense","verb-ing","infinitive"], answer: 2 },
  { q: "He ___ all morning.", options: ["took","takes","was working","has taken"], answer: 2 },
  { q: "What ___ you doing at midnight?", options: ["did","are","were","was"], answer: 2 },
  { q: "I ___ — please pay attention!", options: ["wasn't listening","didn't listen","not listen","haven't listened"], answer: 0 },
  { q: "She (read) ___ when I arrived.", options: ["read","was reading","reads","is reading"], answer: 1 },
  { q: "They (wait) ___ for an hour.", options: ["waited","were waiting","are waiting","wait"], answer: 1 },
  { q: "He ___ fast when it happened.", options: ["drove","was driving","drives","had driven"], answer: 1 },
  { q: "While I ___ TV, she cooked.", options: ["watched","was watching","watch","have watched"], answer: 1 },
  { q: "He stood up and ___ the room.", options: ["was leaving","left","leaves","had left"], answer: 1 },
  { q: "She ___ when I said hello.", options: ["cried","was crying","cry","has cried"], answer: 1 },
  { q: "Use 'while' + past ___ for background.", options: ["simple","perfect","continuous","passive"], answer: 2 },
  { q: "I (study) ___ all evening.", options: ["studied","was studying","studies","study"], answer: 1 },
  { q: "It (rain) ___ when we left.", options: ["rained","was raining","rains","rain"], answer: 1 },
  { q: "Were they travelling when it ___?", options: ["happens","happened","was happening","has happened"], answer: 1 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Past Continuous",
  subtitle: "was/were + -ing — 4 exercises + answer key",
  level: "B1",
  keyRule: "was/were + verb-ing  ·  I was reading when she called.",
  exercises: [
    {
      number: 1,
      title: "Exercise 1",
      difficulty: "Easy",
      instruction: "Choose the correct Past Continuous form.",
      questions: [
        "At 8pm she ___ TV.",
        "They ___ football in the rain.",
        "I ___ when she knocked.",
        "He ___ to music at noon.",
        "We ___ dinner when she came.",
        "___ it raining when you left?",
        "The kids ___ all afternoon.",
        "She ___ a shower then.",
        "What ___ you doing at midnight?",
        "I ___ — please pay attention!",
      ],
      hint: "was/were + -ing",
    },
    {
      number: 2,
      title: "Exercise 2",
      difficulty: "Medium",
      instruction: "Write the Past Continuous form.",
      questions: [
        "She (read) ___ when I arrived.",
        "They (wait) ___ for an hour.",
        "He (not/listen) ___ to me.",
        "What (you/do) ___ at midnight?",
        "I (study) ___ all evening.",
        "It (rain) ___ when we left.",
        "We (not/expect) ___ guests.",
        "She (talk) ___ for an hour.",
        "(they/travel) ___ at that time?",
        "The dog (sleep) ___ all day.",
      ],
    },
    {
      number: 3,
      title: "Exercise 3",
      difficulty: "Hard",
      instruction: "Past Continuous or Past Simple?",
      questions: [
        "While I ___ TV, she cooked.",
        "He stood up and ___ the room.",
        "They ___ as soon as the bell rang.",
        "While she ___, he cooked.",
        "I ___ my keys while cleaning.",
        "It ___ all day — we stayed in.",
        "She ___ when I said hello.",
        "He ___ and broke his arm.",
        "I ___ when earthquake struck.",
        "She ___ the door and walked in.",
      ],
    },
    {
      number: 4,
      title: "Exercise 4",
      difficulty: "Hardest",
      instruction: "Write the correct tense form.",
      questions: [
        "While I (walk) ___ it rained.",
        "She (find) ___ her wallet then.",
        "He (not/pay) ___ attention.",
        "They (meet) ___ at work.",
        "I (read) ___ when lights went out.",
        "At 3am the baby (cry) ___.",
        "She (arrive) ___ as we left.",
        "He (drive) ___ fast then.",
        "I (not/pay) ___ attention again.",
        "They (discuss) ___ when he came.",
      ],
    },
  ],
  answerKey: [
    {
      exercise: 1,
      subtitle: "Easy — was/were + -ing",
      answers: ["was watching","were playing","was sleeping","was listening","were having","Was it raining","were playing","was taking","were you doing","wasn't listening"],
    },
    {
      exercise: 2,
      subtitle: "Medium — write the form",
      answers: ["was reading","were waiting","wasn't listening","were you doing","was studying","was raining","weren't expecting","was talking","were they travelling","was sleeping"],
    },
    {
      exercise: 3,
      subtitle: "Hard — Past Cont. vs Simple",
      answers: ["was watching","left","left","was shopping","found","was raining","was crying","fell","was sleeping","opened"],
    },
    {
      exercise: 4,
      subtitle: "Hardest — choose the tense",
      answers: ["was walking","found","wasn't paying","met","was reading","was crying","arrived","was driving","wasn't paying","were discussing"],
    },
  ],
};

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Past Perfect", href: "/grammar/b1/past-perfect", level: "B1", badge: "bg-violet-500", reason: "Pairs naturally with Past Continuous in narrative" },
  { title: "Present Perfect Continuous", href: "/grammar/b1/present-perfect-continuous", level: "B1", badge: "bg-violet-500" },
  { title: "Past Passive", href: "/grammar/b1/passive-past", level: "B1", badge: "bg-violet-500" },
];

export default function PastContinuousLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct Past Continuous form",
      instructions: "Choose the correct Past Continuous form (was/were + -ing).",
      questions: [
        { id: "e1q1", prompt: "At 8pm yesterday, she ___ TV.", options: ["watched", "was watching", "is watching"], correctIndex: 1, explanation: "At 8pm yesterday = specific time in the past → was watching (ongoing action at that moment)." },
        { id: "e1q2", prompt: "They ___ football when it started to rain.", options: ["played", "were playing", "are playing"], correctIndex: 1, explanation: "Ongoing action interrupted by rain → were playing." },
        { id: "e1q3", prompt: "I ___ when she knocked at the door.", options: ["slept", "was sleeping", "sleep"], correctIndex: 1, explanation: "Interrupted action → was sleeping." },
        { id: "e1q4", prompt: "He ___ to music when I called him.", options: ["listened", "was listening", "listens"], correctIndex: 1, explanation: "Ongoing action at the time of the call → was listening." },
        { id: "e1q5", prompt: "We ___ dinner when she arrived.", options: ["had", "were having", "have"], correctIndex: 1, explanation: "Ongoing action interrupted by her arrival → were having." },
        { id: "e1q6", prompt: "The children ___ in the garden all afternoon.", options: ["played", "were playing", "play"], correctIndex: 1, explanation: "Extended ongoing action → were playing." },
        { id: "e1q7", prompt: "___ it ___ when you left?", options: ["Did/rain", "Was/raining", "Is/raining"], correctIndex: 1, explanation: "Past Continuous question: Was it raining?" },
        { id: "e1q8", prompt: "She ___ a shower when the phone rang.", options: ["took", "was taking", "takes"], correctIndex: 1, explanation: "Interrupted action → was taking." },
        { id: "e1q9", prompt: "I ___ to you — please pay attention.", options: ["wasn't listening", "didn't listen", "not listen"], correctIndex: 0, explanation: "Past Continuous negative: wasn't listening." },
        { id: "e1q10", prompt: "What ___ you ___ at midnight?", options: ["did/do", "were/doing", "are/doing"], correctIndex: 1, explanation: "Past Continuous question: What were you doing?" },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the Past Continuous form",
      instructions: "Write the correct Past Continuous form of the verb in brackets (was/were + -ing).",
      questions: [
        { id: "e2q1", prompt: "She (read) ___ a book when I arrived.", correct: "was reading", explanation: "she + was + reading" },
        { id: "e2q2", prompt: "They (wait) ___ for over an hour.", correct: "were waiting", explanation: "they + were + waiting" },
        { id: "e2q3", prompt: "He (not/listen) ___ when I explained.", correct: "wasn't listening", explanation: "he + wasn't + listening" },
        { id: "e2q4", prompt: "What (you/do) ___ at midnight?", correct: "were you doing", explanation: "were + you + doing (question form)" },
        { id: "e2q5", prompt: "I (study) ___ all evening.", correct: "was studying", explanation: "I + was + studying" },
        { id: "e2q6", prompt: "It (rain) ___ when we left.", correct: "was raining", explanation: "it + was + raining" },
        { id: "e2q7", prompt: "We (not/expect) ___ so many guests.", correct: "weren't expecting", explanation: "we + weren't + expecting" },
        { id: "e2q8", prompt: "She (talk) ___ on her phone for an hour.", correct: "was talking", explanation: "she + was + talking" },
        { id: "e2q9", prompt: "(they/travel) ___ when it happened?", correct: "were they travelling", explanation: "were + they + travelling (question form)" },
        { id: "e2q10", prompt: "The dog (sleep) ___ on the sofa all day.", correct: "was sleeping", explanation: "the dog + was + sleeping" },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Past Continuous vs Past Simple",
      instructions: "Choose the correct tense. Think about whether the action was ongoing or completed.",
      questions: [
        { id: "e3q1", prompt: "While I ___ TV, she cooked dinner.", options: ["watched", "was watching"], correctIndex: 1, explanation: "while + ongoing background action → was watching (continuous)." },
        { id: "e3q2", prompt: "He ___ up and left the room without a word.", options: ["stood", "was standing"], correctIndex: 0, explanation: "stood up = sudden, completed action → past simple." },
        { id: "e3q3", prompt: "They ___ as soon as the bell rang.", options: ["left", "were leaving"], correctIndex: 0, explanation: "As soon as = immediate reaction → left (past simple)." },
        { id: "e3q4", prompt: "While she ___, he prepared the meal.", options: ["shopped", "was shopping"], correctIndex: 1, explanation: "While = during the time she was shopping → ongoing → was shopping." },
        { id: "e3q5", prompt: "I ___ my keys while I was cleaning.", options: ["was finding", "found"], correctIndex: 1, explanation: "Sudden discovery = completed moment → found (past simple)." },
        { id: "e3q6", prompt: "It ___ all day — we couldn't go out.", options: ["rained", "was raining"], correctIndex: 1, explanation: "All day = extended ongoing condition → was raining." },
        { id: "e3q7", prompt: "She ___ when I said hello, so I went over.", options: ["was crying", "cried"], correctIndex: 0, explanation: "Ongoing visible action at the time → was crying." },
        { id: "e3q8", prompt: "He ___ and broke his arm.", options: ["was falling", "fell"], correctIndex: 1, explanation: "Sudden, completed event → fell (past simple)." },
        { id: "e3q9", prompt: "I ___ when the earthquake struck.", options: ["slept", "was sleeping"], correctIndex: 1, explanation: "Action in progress when interrupted → was sleeping." },
        { id: "e3q10", prompt: "She ___ the door and walked in.", options: ["was opening", "opened"], correctIndex: 1, explanation: "Sequential completed actions → opened (past simple)." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Past Continuous or Past Simple?",
      instructions: "Write the correct tense of the verb in brackets. Think carefully about the context.",
      questions: [
        { id: "e4q1", prompt: "While I (walk) ___ home, it started to rain.", correct: "was walking", explanation: "while = ongoing background → was walking." },
        { id: "e4q2", prompt: "She (find) ___ her wallet while she was cleaning.", correct: "found", explanation: "Sudden discovery → past simple: found." },
        { id: "e4q3", prompt: "He (not/pay) ___ attention when the teacher explained it.", correct: "wasn't paying", explanation: "Ongoing failure to pay attention → wasn't paying." },
        { id: "e4q4", prompt: "They (meet) ___ when they were both working at the same company.", correct: "met", explanation: "Completed event → past simple: met." },
        { id: "e4q5", prompt: "I (read) ___ when suddenly the lights went out.", correct: "was reading", explanation: "Ongoing action interrupted → was reading." },
        { id: "e4q6", prompt: "At 3am, the baby (cry) ___ and woke everyone up.", correct: "was crying", explanation: "Ongoing action at a specific time → was crying." },
        { id: "e4q7", prompt: "She (arrive) ___ just as we were leaving.", correct: "arrived", explanation: "Completed arrival interrupting an ongoing action → arrived (past simple)." },
        { id: "e4q8", prompt: "He (drive) ___ too fast when the accident happened.", correct: "was driving", explanation: "Ongoing action at the moment of the accident → was driving." },
        { id: "e4q9", prompt: "I (not/pay) ___ attention and missed the announcement.", correct: "wasn't paying", explanation: "Ongoing state → wasn't paying." },
        { id: "e4q10", prompt: "They (discuss) ___ the problem when the manager walked in.", correct: "were discussing", explanation: "Ongoing action interrupted → were discussing." },
      ],
    },
  }), []);

  const current = sets[exNo];

  const { save } = useProgress();
  const isPro = useIsPro();

  async function handleDownloadPDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(PDF_CONFIG); } catch (e) { console.error(e); } finally { setPdfLoading(false); }
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
    const total = current.questions.length;
    if (current.type === "mcq") {
      for (const q of current.questions) { if (mcqAnswers[q.id] === q.correctIndex) correct++; }
    } else {
      for (const q of current.questions) {
        const a = normalize(inputAnswers[q.id] ?? "");
        if (a && a === normalize(q.correct)) correct++;
      }
    }
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
  }, [checked, current, mcqAnswers, inputAnswers]);

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); }
  function switchExercise(n: 1 | 2 | 3 | 4) { window.scrollTo({ top: 0, behavior: "smooth" }); setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/b1">Grammar B1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Past Continuous</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Past{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Continuous</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        The Past Continuous uses <b>was / were + -ing</b>. It describes an action that was <b>in progress</b> at a specific moment in the past, or an ongoing action that was <b>interrupted</b> by another event: <i>I <b>was reading</b> when she called.</i>
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24 self-start">
          {isPro ? (
            <SpeedRound gameId="grammar-b1-past-continuous" subject="Past Continuous" questions={SPEED_QUESTIONS} variant="sidebar" />
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}
        </div>

        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
            <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
            <PDFButton onDownload={handleDownloadPDF} loading={pdfLoading} />
            <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
              Exercises:
              {([1, 2, 3, 4] as const).map((n) => (
                <button key={n} onClick={() => switchExercise(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {tab === "exercises" ? (
              <>
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-slate-900">{current.title}</h2>
                  <p className="text-slate-700">{current.instructions}</p>
                  <div className="mt-2 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                    <span>Exercises:</span>
                    {([1, 2, 3, 4] as const).map((n) => (
                      <button key={n} onClick={() => switchExercise(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 space-y-5">
                  {current.type === "mcq" ? (
                    current.questions.map((q, idx) => {
                      const chosen = mcqAnswers[q.id] ?? null;
                      const isCorrect = checked && chosen === q.correctIndex;
                      const isWrong = checked && chosen !== null && chosen !== q.correctIndex;
                      const noAnswer = checked && chosen === null;
                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                {q.options.map((opt, oi) => (
                                  <label key={oi} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition ${chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"} ${checked ? "cursor-default" : ""}`}>
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => setMcqAnswers((p) => ({ ...p, [q.id]: oi }))} />
                                    <span className="text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-2 text-slate-700"><b className="text-slate-900">Correct:</b> {q.options[q.correctIndex]} — {q.explanation}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    current.questions.map((q, idx) => {
                      const val = inputAnswers[q.id] ?? "";
                      const answered = normalize(val) !== "";
                      const isCorrect = checked && answered && normalize(val) === normalize(q.correct);
                      const wrong = checked && answered && !isCorrect;
                      const noAnswer = checked && !answered;
                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3">
                                <input value={val} disabled={checked} onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))} placeholder="Type here…" className="w-full max-w-sm rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]" />
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {wrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-2 text-slate-700"><b className="text-slate-900">Correct:</b> {q.correct} — {q.explanation}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    {!checked ? (
                      <button onClick={() => { setChecked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
                    ) : (
                      <button onClick={resetExercise} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">Try Again</button>
                    )}
                    {checked && exNo < 4 && (
                      <button onClick={() => switchExercise((exNo + 1) as 1 | 2 | 3 | 4)} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">Next Exercise →</button>
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
                        {score.percent >= 80 ? "Excellent! You can move to the next exercise." : score.percent >= 50 ? "Good effort! Try once more to improve your score." : "Keep practising — review the Explanation tab and try again."}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : <Explanation />}
          </div>
        </section>

        {isPro ? (
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/b1" allLabel="All B1 topics" />
        ) : (
          <AdUnit variant="sidebar-dark" />

        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-b1-past-continuous" subject="Past Continuous" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/past-perfect" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Past Perfect →</a>
      </div>
    </div>
  );
}

function Formula({ parts }: { parts: Array<{ text?: string; color?: string; dim?: boolean }> }) {
  const colors: Record<string, string> = {
    sky:    "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-[#FFF3A3] text-amber-800 border-amber-300",
    red:    "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    green:  "bg-emerald-100 text-emerald-800 border-emerald-200",
    slate:  "bg-slate-100 text-slate-600 border-slate-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) =>
        p.dim ? (
          <span key={i} className="text-slate-400 font-bold text-sm">+</span>
        ) : (
          <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${p.color ? colors[p.color] : colors.slate}`}>
            {p.text}
          </span>
        )
      )}
    </div>
  );
}

function Ex({ en, correct = true }: { en: string; correct?: boolean }) {
  return (
    <div className={`flex items-start gap-2 rounded-xl px-3 py-2.5 ${correct ? "bg-white border border-black/8" : "bg-red-50 border border-red-100"}`}>
      <span className="text-sm shrink-0">{correct ? "✅" : "❌"}</span>
      <div className={`font-semibold text-sm ${correct ? "text-slate-900" : "text-red-700 line-through"}`}>{en}</div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Past Continuous</h2>
        <p className="text-slate-500 text-sm">Actions in progress at a specific past moment</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-emerald-600 mb-3">Affirmative (+)</div>
          <Formula parts={[
            { text: "Subject", color: "slate" },
            { dim: true },
            { text: "was/were", color: "green" },
            { dim: true },
            { text: "verb-ing", color: "green" },
          ]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>I <b>was watching</b> TV at 8pm.</div>
            <div>They <b>were playing</b> outside.</div>
          </div>
        </div>

        <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-red-600 mb-3">Negative (−)</div>
          <Formula parts={[
            { text: "Subject", color: "slate" },
            { dim: true },
            { text: "wasn't/weren't", color: "red" },
            { dim: true },
            { text: "verb-ing", color: "slate" },
          ]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>She <b>wasn't sleeping</b>.</div>
            <div>We <b>weren't listening</b>.</div>
          </div>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-sky-600 mb-3">Question (?)</div>
          <Formula parts={[
            { text: "Was/Were", color: "sky" },
            { dim: true },
            { text: "subject", color: "slate" },
            { dim: true },
            { text: "verb-ing", color: "slate" },
            { text: "?", color: "slate" },
          ]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div><b>Was</b> he working?</div>
            <div><b>Were</b> they sleeping?</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-emerald-600 mb-2">At a moment in the past</div>
          <div className="text-sm text-slate-700">Action was already in progress at a specific time.</div>
          <div className="mt-2 italic text-slate-600 text-sm">At 8pm, I was watching TV.</div>
          <div className="mt-1 italic text-slate-600 text-sm">This time yesterday, she was working.</div>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-sky-600 mb-2">Interrupted action</div>
          <div className="text-sm text-slate-700">Longer action interrupted by a shorter one (Past Simple).</div>
          <div className="mt-2 italic text-slate-600 text-sm">I was reading when she called.</div>
          <div className="mt-1 italic text-slate-600 text-sm">He was cooking when the fire started.</div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF3A3] text-sm font-black">!</span>
          <span className="font-black text-slate-900 text-sm">was / were — Quick Reference</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 pr-4 font-black text-slate-700">Subject</th>
                <th className="text-left py-2 pr-4 font-black text-slate-700">Affirmative</th>
                <th className="text-left py-2 font-black text-slate-700">Negative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr>
                <td className="py-2 pr-4 text-slate-600">I / he / she / it</td>
                <td className="py-2 pr-4 font-semibold text-emerald-700">was + -ing</td>
                <td className="py-2 font-semibold text-red-700">wasn&apos;t + -ing</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-slate-600">you / we / they</td>
                <td className="py-2 pr-4 font-semibold text-emerald-700">were + -ing</td>
                <td className="py-2 font-semibold text-red-700">weren&apos;t + -ing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="text-xs font-bold uppercase text-slate-500 mb-3">Time Markers</div>
        <div className="flex flex-wrap gap-2">
          {["at this time yesterday", "at 8pm", "while", "when", "all morning", "all day"].map((w) => (
            <span key={w} className="rounded-lg border border-sky-200 bg-sky-100 px-2.5 py-1 text-xs font-black text-sky-800">{w}</span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-bold uppercase text-slate-500 mb-3">Common Mistake</div>
        <Ex en="I was eat dinner at 7pm." correct={false} />
        <Ex en="I was eating dinner at 7pm." correct={true} />
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Key pattern:</span> Use <b>while</b> + past continuous for the background action; use <b>when</b> + past simple for the interrupting event.
        <div className="mt-1 italic">While I was sleeping, the phone rang.</div>
      </div>
    </div>
  );
}
