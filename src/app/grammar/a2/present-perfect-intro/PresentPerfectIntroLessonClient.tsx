"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import AdUnit from "@/components/AdUnit";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import PDFButton from "@/components/PDFButton";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import GrammarRecommended, { type GrammarRec } from "@/components/GrammarRecommended";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Past Simple (Regular)", href: "/grammar/a2/past-simple-regular", level: "A2", badge: "bg-emerald-600", reason: "Compare present perfect with past simple" },
  { title: "Past Simple (Irregular)", href: "/grammar/a2/past-simple-irregular", level: "A2", badge: "bg-emerald-600", reason: "Irregular past participles are key for present perfect" },
  { title: "Time Expressions (Past)", href: "/grammar/a2/time-expressions-past", level: "A2", badge: "bg-emerald-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "She ___ visited Paris twice.", options: ["have", "has", "did", "was"], answer: 1 },
  { q: "I ___ seen that film before.", options: ["has", "have", "am", "did"], answer: 1 },
  { q: "They ___ finished their homework.", options: ["has", "have", "are", "did"], answer: 1 },
  { q: "He ___ never tried sushi.", options: ["have", "has", "did", "was"], answer: 1 },
  { q: "We ___ lived here for ten years.", options: ["has", "have", "are", "did"], answer: 1 },
  { q: "I ___ just arrived. (present perfect)", options: ["has arrived", "have arrived", "arrived", "arrive"], answer: 1 },
  { q: "She ___ already eaten.", options: ["have", "has", "did", "was"], answer: 1 },
  { q: "He ___ lost his keys.", options: ["have", "has", "did", "was"], answer: 1 },
  { q: "Present perfect negative: she ___", options: ["hasn't gone", "haven't gone", "didn't gone", "not gone"], answer: 0 },
  { q: "Have you ever ___ to Japan?", options: ["go", "went", "gone", "going"], answer: 2 },
  { q: "I ___ her three times this week.", options: ["saw", "have seen", "see", "seen"], answer: 1 },
  { q: "She ___ the report yet.", options: ["didn't finish", "hasn't finished", "doesn't finish", "not finish"], answer: 1 },
  { q: "We first ___ in 2010. (specific time)", options: ["have met", "met", "were meeting", "meet"], answer: 1 },
  { q: "I ___ just ___ the news!", options: ["did / hear", "have / heard", "was / hearing", "did / heard"], answer: 1 },
  { q: "She ___ working here since January.", options: ["was", "has been", "is", "have been"], answer: 1 },
  { q: "He ___ when he was five. (specific time)", options: ["has started", "started", "starts", "have started"], answer: 1 },
  { q: "Signal word for present perfect: ___", options: ["yesterday", "last year", "just", "ago"], answer: 2 },
  { q: "Signal word for past simple: ___", options: ["ever", "already", "yet", "last night"], answer: 3 },
  { q: "You ___ never been to Australia.", options: ["has", "have", "did", "are"], answer: 1 },
  { q: "She ___ worked there since 2018.", options: ["have", "has", "did", "was"], answer: 1 },
];

export default function PresentPerfectIntroLessonClient() {
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct present perfect form",
      instructions: "Choose the correct present perfect form (have/has + past participle).",
      questions: [
        { id: "e1q1", prompt: "She ___ visited Paris twice.", options: ["have", "has", "is"], correctIndex: 1, explanation: "she → has: She has visited Paris." },
        { id: "e1q2", prompt: "I ___ seen that film before.", options: ["have", "has", "am"], correctIndex: 0, explanation: "I → have: I have seen that film." },
        { id: "e1q3", prompt: "They ___ finished their homework.", options: ["has", "have", "are"], correctIndex: 1, explanation: "they → have: They have finished." },
        { id: "e1q4", prompt: "He ___ never tried sushi.", options: ["have", "has", "did"], correctIndex: 1, explanation: "he → has: He has never tried sushi." },
        { id: "e1q5", prompt: "We ___ lived here for ten years.", options: ["has", "have", "are"], correctIndex: 1, explanation: "we → have: We have lived here." },
        { id: "e1q6", prompt: "She ___ already eaten.", options: ["have", "has", "did"], correctIndex: 1, explanation: "she → has: She has already eaten." },
        { id: "e1q7", prompt: "I ___ just arrived home.", options: ["has", "have", "was"], correctIndex: 1, explanation: "I → have: I have just arrived." },
        { id: "e1q8", prompt: "He ___ lost his keys.", options: ["have", "has", "did"], correctIndex: 1, explanation: "he → has: He has lost his keys." },
        { id: "e1q9", prompt: "You ___ never been to Japan.", options: ["has", "have", "did"], correctIndex: 1, explanation: "you → have: You have never been." },
        { id: "e1q10", prompt: "She ___ worked there since 2018.", options: ["have", "has", "did"], correctIndex: 1, explanation: "she → has: She has worked there since 2018." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the present perfect form",
      instructions: "Write the correct present perfect form. Use have/has + past participle.",
      questions: [
        { id: "e2q1", prompt: "She (visit) ___ three countries this year.", correct: "has visited", explanation: "she + has + past participle: has visited" },
        { id: "e2q2", prompt: "I (never/eat) ___ Indian food.", correct: "have never eaten", explanation: "I + have + never + past participle: have never eaten" },
        { id: "e2q3", prompt: "He (lose) ___ his phone.", correct: "has lost", explanation: "he + has + past participle: has lost" },
        { id: "e2q4", prompt: "We (just/arrive) ___.", correct: "have just arrived", explanation: "we + have + just + past participle: have just arrived" },
        { id: "e2q5", prompt: "She (already/finish) ___ the report.", correct: "has already finished", explanation: "she + has + already + past participle: has already finished" },
        { id: "e2q6", prompt: "They (live) ___ here since 2015.", correct: "have lived", explanation: "they + have + past participle: have lived" },
        { id: "e2q7", prompt: "I (see) ___ that film twice.", correct: "have seen", explanation: "I + have + past participle: have seen" },
        { id: "e2q8", prompt: "He (not/call) ___ me yet.", correct: "hasn't called", explanation: "he + hasn't + past participle: hasn't called" },
        { id: "e2q9", prompt: "She (work) ___ there for five years.", correct: "has worked", explanation: "she + has + past participle: has worked" },
        { id: "e2q10", prompt: "You (ever/be) ___ to Australia?", correct: "have you ever been", explanation: "Question form: Have + you + ever + past participle: Have you ever been?" },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Present Perfect vs Past Simple",
      instructions: "Choose the correct tense: present perfect or past simple. The clue is in the time expression or context.",
      questions: [
        { id: "e3q1", prompt: "She ___ in London for 3 years. (she still lives there)", options: ["lived", "has lived", "was living"], correctIndex: 1, explanation: "has lived = started in the past, continues now → present perfect." },
        { id: "e3q2", prompt: "I ___ this morning at 7am.", options: ["have woken up", "woke up", "wake up"], correctIndex: 1, explanation: "7am this morning = specific finished time → past simple: woke up." },
        { id: "e3q3", prompt: "___ you ever ___ to Japan?", options: ["Did/go", "Have/been", "Were/going"], correctIndex: 1, explanation: "Have you ever been = life experience, no specific time → present perfect." },
        { id: "e3q4", prompt: "He ___ his passport last week.", options: ["has lost", "lost", "loses"], correctIndex: 1, explanation: "last week = specific finished time → past simple: lost." },
        { id: "e3q5", prompt: "I ___ her three times this week.", options: ["saw", "have seen", "see"], correctIndex: 1, explanation: "this week = period still in progress → present perfect: have seen." },
        { id: "e3q6", prompt: "She ___ the report yet.", options: ["didn't finish", "hasn't finished", "doesn't finish"], correctIndex: 1, explanation: "'yet' = up to now → present perfect: hasn't finished yet." },
        { id: "e3q7", prompt: "We first ___ in 2010.", options: ["have met", "met", "were meeting"], correctIndex: 1, explanation: "in 2010 = specific point in the past → past simple: met." },
        { id: "e3q8", prompt: "I ___ just ___ the news!", options: ["did/hear", "have/heard", "was/hearing"], correctIndex: 1, explanation: "'just' with present perfect = very recent action: have just heard." },
        { id: "e3q9", prompt: "She ___ working here since January.", options: ["was", "has been", "is"], correctIndex: 1, explanation: "since January = from a past point to now → present perfect: has been." },
        { id: "e3q10", prompt: "He ___ when he was five years old.", options: ["has started", "started", "starts"], correctIndex: 1, explanation: "when he was five = specific finished time → past simple: started." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Present Perfect or Past Simple?",
      instructions: "Write the correct form of the verb in brackets: present perfect (have/has + pp) or past simple.",
      questions: [
        { id: "e4q1", prompt: "She (live) ___ in Paris for two years. She's still there.", correct: "has lived", explanation: "Still ongoing → present perfect: has lived." },
        { id: "e4q2", prompt: "I (see) ___ that film last Friday.", correct: "saw", explanation: "Last Friday = specific finished time → past simple: saw." },
        { id: "e4q3", prompt: "He (never/try) ___ Thai food in his life.", correct: "has never tried", explanation: "Life experience, no specific time → present perfect: has never tried." },
        { id: "e4q4", prompt: "They (arrive) ___ an hour ago.", correct: "arrived", explanation: "An hour ago = specific finished time → past simple: arrived." },
        { id: "e4q5", prompt: "I (just/finish) ___ my homework.", correct: "have just finished", explanation: "'just' = very recently → present perfect: have just finished." },
        { id: "e4q6", prompt: "She (start) ___ this job in 2019.", correct: "started", explanation: "In 2019 = specific past point → past simple: started." },
        { id: "e4q7", prompt: "(you/ever/eat) ___ sushi?", correct: "have you ever eaten", explanation: "ever = at any time in your life → present perfect question: Have you ever eaten?" },
        { id: "e4q8", prompt: "He (not/call) ___ me yet today.", correct: "hasn't called", explanation: "'yet' + today (period in progress) → present perfect: hasn't called." },
        { id: "e4q9", prompt: "I (meet) ___ her at a conference in 2022.", correct: "met", explanation: "Specific event in 2022 → past simple: met." },
        { id: "e4q10", prompt: "She (work) ___ here since she left university.", correct: "has worked", explanation: "since + point in time, still ongoing → present perfect: has worked." },
      ],
    },
  }), []);

  const current = sets[exNo];

  const { save } = useProgress();

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

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const config: LessonPDFConfig = {
        title: "Present Perfect",
        subtitle: "have / has + past participle — 4 exercises + answer key",
        level: "A2",
        keyRule: "have/has + past participle. Use for experiences (ever/never), recent results (just/already/yet), and situations from past to now (since/for).",
        exercises: [
          {
            number: 1,
            title: "Exercise 1",
            difficulty: "Easy",
            instruction: "Choose have or has.",
            questions: [
              "She ___ visited Paris twice.",
              "I ___ seen that film before.",
              "They ___ finished their homework.",
              "He ___ never tried sushi.",
              "We ___ lived here for ten years.",
              "She ___ already eaten.",
              "I ___ just arrived home.",
              "He ___ lost his keys.",
              "You ___ never been to Japan.",
              "She ___ worked there since 2018.",
            ],
            hint: "have / has",
          },
          {
            number: 2,
            title: "Exercise 2",
            difficulty: "Medium",
            instruction: "Write the present perfect form (have/has + past participle).",
            questions: [
              "She (visit) ___ three countries this year.",
              "I (never/eat) ___ Indian food.",
              "He (lose) ___ his phone.",
              "We (just/arrive) ___.",
              "She (already/finish) ___ the report.",
              "They (live) ___ here since 2015.",
              "I (see) ___ that film twice.",
              "He (not/call) ___ me yet.",
              "She (work) ___ there for five years.",
              "You (ever/be) ___ to Australia?",
            ],
          },
          {
            number: 3,
            title: "Exercise 3",
            difficulty: "Harder",
            instruction: "Choose present perfect or past simple.",
            questions: [
              "She ___ in London for 3 years. (she still lives there)",
              "I ___ this morning at 7am.",
              "___ you ever ___ to Japan?",
              "He ___ his passport last week.",
              "I ___ her three times this week.",
              "She ___ the report yet.",
              "We first ___ in 2010.",
              "I ___ just ___ the news!",
              "She ___ working here since January.",
              "He ___ when he was five years old.",
            ],
          },
          {
            number: 4,
            title: "Exercise 4",
            difficulty: "Hardest",
            instruction: "Write the correct form: present perfect or past simple.",
            questions: [
              "She (live) ___ in Paris for two years. She's still there.",
              "I (see) ___ that film last Friday.",
              "He (never/try) ___ Thai food in his life.",
              "They (arrive) ___ an hour ago.",
              "I (just/finish) ___ my homework.",
              "She (start) ___ this job in 2019.",
              "(you/ever/eat) ___ sushi?",
              "He (not/call) ___ me yet today.",
              "I (meet) ___ her at a conference in 2022.",
              "She (work) ___ here since she left university.",
            ],
          },
        ],
        answerKey: [
          {
            exercise: 1,
            subtitle: "Easy — have or has",
            answers: ["has", "have", "have", "has", "have", "has", "have", "has", "have", "has"],
          },
          {
            exercise: 2,
            subtitle: "Medium — present perfect form",
            answers: ["has visited", "have never eaten", "has lost", "have just arrived", "has already finished", "have lived", "have seen", "hasn't called", "has worked", "have you ever been"],
          },
          {
            exercise: 3,
            subtitle: "Harder — present perfect vs past simple",
            answers: ["has lived", "woke up", "Have / been", "lost", "have seen", "hasn't finished", "met", "have / heard", "has been", "started"],
          },
          {
            exercise: 4,
            subtitle: "Hardest — correct tense",
            answers: ["has lived", "saw", "has never tried", "arrived", "have just finished", "started", "have you ever eaten", "hasn't called", "met", "has worked"],
          },
        ],
      };
      await generateLessonPDF(config);
    } finally {
      setPdfLoading(false);
    }
  }

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); }
  function switchExercise(n: 1 | 2 | 3 | 4) { setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a2">Grammar A2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Present Perfect: Introduction</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Present Perfect{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">introduction</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        The Present Perfect uses <b>have/has + past participle</b>: <i>I <b>have seen</b> that film. She <b>has lived</b> here for years.</i> It connects the past to the present. Exercise 3 focuses on the critical difference between Present Perfect and Past Simple.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {isPro ? (
          <div className="sticky top-24">
            <SpeedRound gameId="grammar-a2-present-perfect-intro" subject="Present Perfect" questions={SPEED_QUESTIONS} variant="sidebar" />
          </div>
        ) : (
          <div className="sticky top-24"><AdUnit variant="sidebar-dark" /></div>
        )}

        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
            <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
            <PDFButton onDownload={downloadPDF} loading={pdfLoading} />
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
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/a2" allLabel="All A2 topics" />
        ) : (
          <div className="sticky top-24">
            <AdUnit variant="sidebar-light" />
          </div>
        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-a2-present-perfect-intro" subject="Present Perfect" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All A2 topics</a>
        <a href="/grammar/a2/prepositions-movement" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Prepositions of Movement →</a>
      </div>
    </div>
  );
}

function Formula({ parts }: { parts: Array<{ text: string; color?: string; dim?: boolean }> }) {
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Present Perfect — Introduction</h2>
        <p className="text-slate-500 text-sm">have / has + past participle — connects a past action to the present</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4">
          <div className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-2">Affirmative (+)</div>
          <Formula parts={[{ text: "Subject", color: "sky" }, { dim: true, text: "+" }, { text: "have/has", color: "yellow" }, { dim: true, text: "+" }, { text: "past participle", color: "green" }]} />
          <div className="mt-2 text-xs italic text-slate-600">I have seen it. / She has gone.</div>
        </div>
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4">
          <div className="text-xs font-black text-red-700 uppercase tracking-wide mb-2">Negative (−)</div>
          <Formula parts={[{ text: "Subject", color: "sky" }, { dim: true, text: "+" }, { text: "haven't/hasn't", color: "red" }, { dim: true, text: "+" }, { text: "past participle", color: "green" }]} />
          <div className="mt-2 text-xs italic text-slate-600">I haven&apos;t seen it. / She hasn&apos;t gone.</div>
        </div>
        <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-4">
          <div className="text-xs font-black text-sky-700 uppercase tracking-wide mb-2">Question (?)</div>
          <Formula parts={[{ text: "Have/Has", color: "yellow" }, { dim: true, text: "+" }, { text: "Subject", color: "sky" }, { dim: true, text: "+" }, { text: "past participle", color: "green" }, { text: "?", color: "slate" }]} />
          <div className="mt-2 text-xs italic text-slate-600">Have you seen it? / Has she gone?</div>
        </div>
      </div>

      {/* Usage cards */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-4">
          <div className="text-xs font-black text-sky-700 uppercase tracking-wide mb-2">Experience (life)</div>
          <div className="text-sm text-slate-700 italic mb-2">Have you ever been to Japan? / I&apos;ve never tried sushi.</div>
          <div className="flex flex-wrap gap-1">
            {["ever", "never", "before"].map(w => (
              <span key={w} className="rounded-lg bg-sky-100 border border-sky-200 px-2 py-0.5 text-xs font-bold text-sky-800">{w}</span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4">
          <div className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-2">Recent result</div>
          <div className="text-sm text-slate-700 italic mb-2">I&apos;ve lost my keys. (they&apos;re still lost) / She&apos;s already left.</div>
          <div className="flex flex-wrap gap-1">
            {["just", "already", "yet", "recently"].map(w => (
              <span key={w} className="rounded-lg bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-xs font-bold text-emerald-800">{w}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Key words chips */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFF3A3] text-sm font-black text-amber-800">!</span>
          <span className="text-sm font-bold text-slate-700">Key signal words</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {["ever", "never", "already", "yet", "just", "recently", "before", "so far", "since", "for"].map(w => (
            <span key={w} className="rounded-xl bg-violet-100 border border-violet-200 px-3 py-1 text-sm font-bold text-violet-800">{w}</span>
          ))}
        </div>
      </div>

      {/* have/has reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFF3A3] text-sm font-black text-amber-800">!</span>
          <span className="text-sm font-bold text-slate-700">have vs has — quick reference</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-slate-50">
                <th className="px-3 py-2 text-left font-bold text-slate-600">Subject</th>
                <th className="px-3 py-2 text-left font-bold text-slate-900">Auxiliary</th>
                <th className="px-3 py-2 text-left font-bold text-slate-600">Contraction</th>
                <th className="px-3 py-2 text-left font-bold text-slate-600">Negative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I / you / we / they", "have", "I've / you've", "haven't"],
                ["he / she / it", "has", "he's / she's", "hasn't"],
              ].map(([sub, aux, contr, neg]) => (
                <tr key={sub} className="bg-white even:bg-slate-50/50">
                  <td className="px-3 py-2 text-slate-600">{sub}</td>
                  <td className="px-3 py-2 font-black text-slate-900">{aux}</td>
                  <td className="px-3 py-2 text-slate-700 italic">{contr}</td>
                  <td className="px-3 py-2 text-red-700 italic">{neg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-2">
        <div className="text-xs font-black text-slate-500 uppercase tracking-wide mb-2">Examples</div>
        <Ex en="I have gone." />
        <Ex en="I have went." correct={false} />
        <Ex en="She has seen it." />
        <Ex en="She has see it." correct={false} />
      </div>

      {/* Amber tip */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">yet vs already:</span> Use <b>yet</b> in questions and negatives — <i>Have you done it yet? / I haven&apos;t done it yet.</i> Use <b>already</b> in affirmatives — <i>I&apos;ve already done it.</i>
      </div>
    </div>
  );
}
