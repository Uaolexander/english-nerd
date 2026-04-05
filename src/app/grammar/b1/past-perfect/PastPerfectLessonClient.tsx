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
  { q: "Past Perfect formula:", options: ["was/were + pp", "am/is/are + pp", "had + past participle", "would + pp"], answer: 2 },
  { q: "'When I arrived, she ___ already left.'", options: ["has", "is", "had", "was"], answer: 2 },
  { q: "Past Perfect is used for:", options: ["Two actions, the earlier one uses PP", "Future plans", "General facts", "Present states"], answer: 0 },
  { q: "'He felt tired because he ___ worked all night.'", options: ["has", "have", "is", "had"], answer: 3 },
  { q: "'I ___ never seen snow before that winter.'", options: ["have", "was", "am", "had"], answer: 3 },
  { q: "'By the time we arrived, the film ___.'", options: ["started", "has started", "had started", "was starting"], answer: 2 },
  { q: "Past Perfect negative form:", options: ["didn't have + pp", "hadn't + pp", "wasn't + pp", "haven't + pp"], answer: 1 },
  { q: "'___ you ___ that film before?' Correct:", options: ["Have/seen", "Had/saw", "Had/seen", "Have/saw"], answer: 2 },
  { q: "Which uses Past Perfect correctly?", options: ["She had finish her work.", "She had finished her work.", "She has finished her work.", "She finished her work had."], answer: 1 },
  { q: "'I was late because I ___ missed the bus.'", options: ["has", "have", "am", "had"], answer: 3 },
  { q: "Key word for Past Perfect:", options: ["tomorrow", "by the time", "right now", "every day"], answer: 1 },
  { q: "'She ___ never tried sushi before that night.'", options: ["has", "is", "was", "had"], answer: 3 },
  { q: "Two actions: A then B. Which tense for A?", options: ["Past Simple for A", "Past Perfect for A", "Present Perfect for A", "Future Simple for A"], answer: 1 },
  { q: "'We arrived but the train ___ left.'", options: ["has", "was", "is", "had"], answer: 3 },
  { q: "'She ___ already seen the film.' (before we asked)", options: ["has", "is", "was", "had"], answer: 3 },
  { q: "Past Perfect or Past Simple? 'She wrote the letter, folded it...'", options: ["Past Perfect — sequential actions", "Past Simple — sequential actions", "Depends on context", "Past Perfect — cause and effect"], answer: 1 },
  { q: "'I knew the answer because I ___ read the chapter.'", options: ["has", "is", "was", "had"], answer: 3 },
  { q: "'They ___ been married for 20 years when divorced.'", options: ["has", "have", "was", "had"], answer: 3 },
  { q: "'I ___ just finished when the phone rang.'", options: ["has just", "have just", "had just", "was just"], answer: 2 },
  { q: "Which is WRONG?", options: ["She had left before I arrived.", "He hadn't eaten all day.", "By 9pm, we had finished.", "I had never been there."], answer: 3 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Past Perfect",
  subtitle: "had + past participle",
  level: "B1",
  keyRule: "Past Perfect = had + past participle. Use for the EARLIER of two past actions.",
  exercises: [
    {
      number: 1,
      title: "Choose the correct Past Perfect",
      difficulty: "Easy",
      instruction: "Choose the correct form.",
      questions: [
        "When I arrived, she ___ already left.",
        "He felt tired because he ___ worked all night.",
        "I ___ never seen snow before that winter.",
        "By the time we arrived, the film ___.",
        "She ___ finished homework before dinner.",
        "They ___ never been to Japan before 2022.",
        "I felt sick because I ___ eaten too much.",
        "___ you ___ that film before?",
        "He ___ met her before the party. (negative)",
        "By 9pm, we ___ already finished dinner.",
      ],
    },
    {
      number: 2,
      title: "Write the Past Perfect form",
      difficulty: "Medium",
      instruction: "Write had + past participle.",
      questions: [
        "She (leave) ___ before I arrived.",
        "He (never/try) ___ sushi before that night.",
        "By the time we called, they (already/go) ___.",
        "I (not/eat) ___ all day, so I was starving.",
        "She felt nervous because she (not/prepare) ___.",
        "He (live) ___ there 10 years before moving.",
        "(you/ever/be) ___ to London before 2018?",
        "I (just/finish) ___ when the phone rang.",
        "They (never/meet) ___ before the conference.",
        "She (already/see) ___ the film, so didn't come.",
      ],
    },
    {
      number: 3,
      title: "Past Perfect vs Past Simple",
      difficulty: "Hard",
      instruction: "Choose the correct tense.",
      questions: [
        "When he got home, family ___ to bed.",
        "She ___ the letter, folded it, put in envelope.",
        "Exhausted because I ___ slept for two days.",
        "When police arrived, the thief ___.",
        "I ___ the film before, so knew what'd happen.",
        "We arrived at station but train ___.",
        "He felt embarrassed because he ___ wrong name.",
        "After she ___ exam, she went to celebrate.",
        "She ___ home when I called — no answer.",
        "He ___ never flown before, so was terrified.",
      ],
    },
    {
      number: 4,
      title: "Past Perfect or Past Simple?",
      difficulty: "Harder",
      instruction: "Write Past Perfect or Past Simple.",
      questions: [
        "Late because I (miss) ___ the bus.",
        "She (study) ___ English 3 years before London.",
        "By 2020, he (work) ___ there for a decade.",
        "Meeting (start) ___ by time we arrived.",
        "I (not/realise) ___ my mistake until she said.",
        "She (never/drive) ___ manual car before that.",
        "He (just/sit) ___ down when boss called.",
        "They (be) ___ married 20 years when divorced.",
        "Knew answer because I (read) ___ the chapter.",
        "She (already/leave) ___ when I got there.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Past Perfect forms", answers: ["had", "had", "had", "had started", "had", "had", "had", "Had/seen", "hadn't", "had"] },
    { exercise: 2, subtitle: "Written forms", answers: ["had left", "had never tried", "had already gone", "hadn't eaten", "hadn't prepared", "had lived", "had you ever been", "had just finished", "had never met", "had already seen"] },
    { exercise: 3, subtitle: "Correct tenses", answers: ["had gone", "wrote (Past Simple)", "hadn't", "had escaped", "had seen", "had left", "had said", "had finished", "had already left", "had"] },
    { exercise: 4, subtitle: "PP or Past Simple", answers: ["had missed", "had studied", "had worked", "had started", "hadn't realised", "had never driven", "had just sat", "had been", "had read", "had already left"] },
  ],
};

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Past Continuous", href: "/grammar/b1/past-continuous", level: "B1", badge: "bg-violet-500", reason: "Often used together in storytelling" },
  { title: "Present Perfect Continuous", href: "/grammar/b1/present-perfect-continuous", level: "B1", badge: "bg-violet-500" },
  { title: "Past Passive", href: "/grammar/b1/passive-past", level: "B1", badge: "bg-violet-500" },
];

export default function PastPerfectLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct Past Perfect form",
      instructions: "Choose the correct Past Perfect form (had + past participle).",
      questions: [
        { id: "e1q1", prompt: "When I arrived, she ___ already left.", options: ["has", "had", "was"], correctIndex: 1, explanation: "had left = she left before I arrived. Past Perfect for the earlier action." },
        { id: "e1q2", prompt: "He felt tired because he ___ worked all night.", options: ["has", "have", "had"], correctIndex: 2, explanation: "had worked = reason for feeling tired. Earlier action → Past Perfect." },
        { id: "e1q3", prompt: "I ___ never seen snow before that winter.", options: ["have", "had", "was"], correctIndex: 1, explanation: "had never seen = life experience up to a past point." },
        { id: "e1q4", prompt: "By the time we arrived, the film ___.", options: ["started", "had started", "has started"], correctIndex: 1, explanation: "by the time = before a past moment → had started." },
        { id: "e1q5", prompt: "She ___ finished her homework before dinner.", options: ["has", "had", "was"], correctIndex: 1, explanation: "had finished = completed before another past event (dinner)." },
        { id: "e1q6", prompt: "They ___ never been to Japan before 2022.", options: ["have", "had", "has"], correctIndex: 1, explanation: "had never been = up to that past point in time." },
        { id: "e1q7", prompt: "I felt sick because I ___ eaten too much.", options: ["have", "was", "had"], correctIndex: 2, explanation: "had eaten = reason (cause before effect)." },
        { id: "e1q8", prompt: "___ you ___ that film before?", options: ["Have/seen", "Had/saw", "Had/seen"], correctIndex: 2, explanation: "Had + past participle for question: Had you seen?" },
        { id: "e1q9", prompt: "He ___ met her before the party.", options: ["hasn't", "hadn't", "didn't"], correctIndex: 1, explanation: "hadn't met = Past Perfect negative." },
        { id: "e1q10", prompt: "By 9pm, we ___ already finished dinner.", options: ["have", "were", "had"], correctIndex: 2, explanation: "by 9pm + already → had finished." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the Past Perfect form",
      instructions: "Write the correct Past Perfect form of the verb in brackets (had + past participle).",
      questions: [
        { id: "e2q1", prompt: "She (leave) ___ before I arrived.", correct: "had left", explanation: "had + past participle: had left" },
        { id: "e2q2", prompt: "He (never/try) ___ sushi before that night.", correct: "had never tried", explanation: "had never + past participle: had never tried" },
        { id: "e2q3", prompt: "By the time we called, they (already/go) ___.", correct: "had already gone", explanation: "had already + past participle: had already gone" },
        { id: "e2q4", prompt: "I (not/eat) ___ all day, so I was starving.", correct: "hadn't eaten", explanation: "hadn't + past participle: hadn't eaten" },
        { id: "e2q5", prompt: "She felt nervous because she (not/prepare) ___.", correct: "hadn't prepared", explanation: "hadn't prepared" },
        { id: "e2q6", prompt: "He (live) ___ there for 10 years before moving away.", correct: "had lived", explanation: "had lived" },
        { id: "e2q7", prompt: "(you/ever/be) ___ to London before 2018?", correct: "had you ever been", explanation: "Had + you + ever + past participle" },
        { id: "e2q8", prompt: "I (just/finish) ___ when the phone rang.", correct: "had just finished", explanation: "had just + past participle" },
        { id: "e2q9", prompt: "They (never/meet) ___ before the conference.", correct: "had never met", explanation: "had never + past participle: had never met" },
        { id: "e2q10", prompt: "She (already/see) ___ the film, so she didn't come.", correct: "had already seen", explanation: "had already seen" },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Past Perfect vs Past Simple",
      instructions: "Choose the correct tense. Think about which action happened first.",
      questions: [
        { id: "e3q1", prompt: "By the time he got home, his family ___ to bed.", options: ["went", "had gone"], correctIndex: 1, explanation: "had gone = family went to bed before he got home." },
        { id: "e3q2", prompt: "She ___ the letter, folded it and put it in an envelope.", options: ["had written", "wrote"], correctIndex: 1, explanation: "Sequential completed actions with no earlier/later contrast → past simple: wrote." },
        { id: "e3q3", prompt: "I was exhausted because I ___ slept for two days.", options: ["hadn't", "didn't"], correctIndex: 0, explanation: "hadn't slept = Past Perfect negative (reason for exhaustion)." },
        { id: "e3q4", prompt: "When the police arrived, the thief ___.", options: ["escaped", "had escaped"], correctIndex: 1, explanation: "had escaped = escaped before the police arrived." },
        { id: "e3q5", prompt: "I ___ the film before, so I knew what would happen.", options: ["had seen", "saw"], correctIndex: 0, explanation: "had seen = before this watching, at some earlier point." },
        { id: "e3q6", prompt: "We arrived at the station but the train ___.", options: ["left", "had left"], correctIndex: 1, explanation: "had left = train left before we arrived." },
        { id: "e3q7", prompt: "He felt embarrassed because he ___ the wrong name.", options: ["said", "had said"], correctIndex: 1, explanation: "had said = saying wrong name happened before the embarrassment." },
        { id: "e3q8", prompt: "After she ___ the exam, she went out to celebrate.", options: ["finished", "had finished"], correctIndex: 1, explanation: "had finished = after = the earlier action." },
        { id: "e3q9", prompt: "She ___ home when I called — I got no answer.", options: ["already left", "had already left"], correctIndex: 1, explanation: "had already left = she left before the call." },
        { id: "e3q10", prompt: "He ___ never flown before, so he was terrified.", options: ["had", "has"], correctIndex: 0, explanation: "had never flown = up to a past moment." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Past Perfect or Past Simple?",
      instructions: "Write the correct tense of the verb in brackets — Past Perfect (had + pp) or Past Simple.",
      questions: [
        { id: "e4q1", prompt: "I was late because I (miss) ___ the bus.", correct: "had missed", explanation: "had missed = earlier cause of being late." },
        { id: "e4q2", prompt: "She (study) ___ English for 3 years before moving to London.", correct: "had studied", explanation: "had studied = completed before moving (earlier action)." },
        { id: "e4q3", prompt: "By 2020, he (work) ___ there for a decade.", correct: "had worked", explanation: "By 2020 = a past point → had worked." },
        { id: "e4q4", prompt: "The meeting (start) ___ by the time we arrived.", correct: "had started", explanation: "had started = before we arrived." },
        { id: "e4q5", prompt: "I (not/realise) ___ my mistake until she pointed it out.", correct: "hadn't realised", explanation: "hadn't realised = I was unaware until that moment." },
        { id: "e4q6", prompt: "She (never/drive) ___ a manual car before that day.", correct: "had never driven", explanation: "had never driven = up to that past day." },
        { id: "e4q7", prompt: "He (just/sit) ___ down when his boss called him in.", correct: "had just sat", explanation: "had just sat = immediately before the boss called." },
        { id: "e4q8", prompt: "They (be) ___ married for 20 years when they divorced.", correct: "had been", explanation: "had been = duration up to the divorce." },
        { id: "e4q9", prompt: "I knew the answer because I (read) ___ the chapter before class.", correct: "had read", explanation: "had read = read before the class (earlier action)." },
        { id: "e4q10", prompt: "She (already/leave) ___ when I got there, so I missed her.", correct: "had already left", explanation: "had already left = she left before I got there." },
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
  function switchExercise(n: 1 | 2 | 3 | 4) { setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/b1">Grammar B1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Past Perfect</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Past{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Perfect</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        The Past Perfect uses <b>had + past participle</b>. It describes an action that was completed <b>before</b> another past action or time: <i>When I arrived, she <b>had already left</b>.</i> Think of it as the &ldquo;past of the past&rdquo;.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24">
          {isPro ? (
            <SpeedRound gameId="grammar-b1-past-perfect" subject="Past Perfect" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <div className="sticky top-24">
            <AdUnit variant="sidebar-dark" />
          </div>
        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-b1-past-perfect" subject="Past Perfect" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/present-perfect-continuous" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Present Perfect Continuous →</a>
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Past Perfect</h2>
        <p className="text-slate-500 text-sm">The earlier of two past actions — "the past of the past"</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-emerald-600 mb-3">Affirmative (+)</div>
          <Formula parts={[
            { text: "Subject", color: "slate" },
            { dim: true },
            { text: "had", color: "green" },
            { dim: true },
            { text: "past participle", color: "green" },
          ]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>She <b>had already left</b>.</div>
            <div>They <b>had finished</b> dinner.</div>
          </div>
        </div>

        <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-red-600 mb-3">Negative (−)</div>
          <Formula parts={[
            { text: "Subject", color: "slate" },
            { dim: true },
            { text: "hadn't", color: "red" },
            { dim: true },
            { text: "past participle", color: "slate" },
          ]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div>He <b>hadn't eaten</b> yet.</div>
            <div>I <b>hadn't seen</b> it before.</div>
          </div>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5">
          <div className="text-xs font-bold uppercase text-sky-600 mb-3">Question (?)</div>
          <Formula parts={[
            { text: "Had", color: "sky" },
            { dim: true },
            { text: "subject", color: "slate" },
            { dim: true },
            { text: "past participle", color: "slate" },
            { text: "?", color: "slate" },
          ]} />
          <div className="mt-3 space-y-1 text-sm text-slate-600 italic">
            <div><b>Had</b> she left?</div>
            <div><b>Had</b> they met before?</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
        <div className="text-xs font-bold uppercase text-violet-600 mb-3">Timeline — Sequence of Events</div>
        <div className="text-xs font-bold text-slate-500 mb-3">EARLIER ←————————————→ LATER → NOW</div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="rounded-xl border border-violet-300 bg-violet-100 px-3 py-2 text-violet-700 font-bold">She had left (Past Perfect)</div>
          <div className="text-slate-400 font-bold">→ then →</div>
          <div className="rounded-xl border border-sky-200 bg-sky-100 px-3 py-2 text-sky-700 font-bold">I arrived (Past Simple)</div>
          <div className="text-slate-400 font-bold">→ now</div>
        </div>
        <div className="mt-3 text-sm italic text-slate-600">When I arrived, she had already left.</div>
      </div>

      <div>
        <div className="text-xs font-bold uppercase text-slate-500 mb-3">Key Connectors</div>
        <div className="flex flex-wrap gap-2">
          {["before", "after", "when", "by the time", "already", "just", "never"].map((w) => (
            <span key={w} className="rounded-lg border border-violet-200 bg-violet-100 px-2.5 py-1 text-xs font-black text-violet-800">{w}</span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-bold uppercase text-slate-500 mb-3">Common Mistake</div>
        <Ex en="She left before he has arrived." correct={false} />
        <Ex en="She had left before he arrived." correct={true} />
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">When to use it:</span> Past perfect is only needed to show which action came FIRST. If the order is already clear from "before" or "after", the past perfect is optional but still correct.
      </div>
    </div>
  );
}
