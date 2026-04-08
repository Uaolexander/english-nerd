
"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import AdUnit from "@/components/AdUnit";
import GrammarRecommended, { type GrammarRec } from "@/components/GrammarRecommended";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import PDFButton from "@/components/PDFButton";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";

type MCQ = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type InputQ = {
  id: string;
  prompt: string; // with ____ gap
  correct: string; // normalized expected answer
  explanation: string;
};

type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) {
  return s.trim().toLowerCase();
}

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "___ is your name?", options: ["What","Where","When","Who"], answer: 0 },
  { q: "___ do you live?", options: ["Why","Where","How","When"], answer: 1 },
  { q: "___ is your best friend?", options: ["What","Where","Who","When"], answer: 2 },
  { q: "___ do you go to school? (by bus)", options: ["Why","When","Where","How"], answer: 3 },
  { q: "___ are you happy today?", options: ["Where","Who","Why","How"], answer: 2 },
  { q: "___ old are you?", options: ["What","When","Why","How"], answer: 3 },
  { q: "___ does the lesson start?", options: ["Where","When","Who","How"], answer: 1 },
  { q: "___ is your bag? (I can't see it.)", options: ["What","Why","Where","Who"], answer: 2 },
  { q: "___ do you spell your name?", options: ["When","Who","Why","How"], answer: 3 },
  { q: "___ is that man? (He is my teacher.)", options: ["Where","When","Who","Why"], answer: 2 },
  { q: "___ is your favorite color?", options: ["Where","When","What","Who"], answer: 2 },
  { q: "___ do you wake up in the morning?", options: ["When","Why","Who","How"], answer: 0 },
  { q: "___ is your English teacher?", options: ["What","Where","When","Who"], answer: 3 },
  { q: "___ are you tired?", options: ["Where","How","Why","Who"], answer: 2 },
  { q: "___ do you come to school? (by bike)", options: ["Where","When","How","Why"], answer: 2 },
  { q: "___ is the supermarket? (on Main Street)", options: ["When","Where","Why","How"], answer: 1 },
  { q: "___ is your birthday?", options: ["Why","How","Who","When"], answer: 3 },
  { q: "___ do you want for lunch?", options: ["When","What","Where","Who"], answer: 1 },
  { q: "___ do you like English? (Because it's fun)", options: ["Where","When","Why","Who"], answer: 2 },
  { q: "___ do you do on weekends?", options: ["Where","Who","When","What"], answer: 3 },
];

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Present Simple Questions", href: "/grammar/a1/present-simple-questions", img: "/topics/a1/present-simple-questions.jpg", level: "A1", badge: "bg-emerald-500", reason: "Yes/no questions come first" },
  { title: "Present Simple (I/you/we/they)", href: "/grammar/a1/present-simple-i-you-we-they", img: "/topics/a1/present-simple-i-you-we-they.jpg", level: "A1", badge: "bg-emerald-500" },
  { title: "Adverbs of Frequency", href: "/grammar/a1/adverbs-frequency", img: "/topics/a1/adverbs-frequency.jpg", level: "A1", badge: "bg-emerald-500" },
];

export default function WhQuestionsLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      // EX 1: MCQ - Choose the correct wh-word
      1: {
        type: "mcq",
        title: "Exercise 1 (Easy) — Choose the correct wh-word",
        instructions: "Choose the correct wh-word (what / where / when / why / who / how).",
        questions: [
          {
            id: "e1q1",
            prompt: "___ is your name?",
            options: ["What", "When", "Who"],
            correctIndex: 0,
            explanation: "We use 'what' to ask for information or things.",
          },
          {
            id: "e1q2",
            prompt: "___ do you live?",
            options: ["Where", "Why", "How"],
            correctIndex: 0,
            explanation: "'Where' is for places.",
          },
          {
            id: "e1q3",
            prompt: "___ is your best friend?",
            options: ["Who", "What", "When"],
            correctIndex: 0,
            explanation: "'Who' is for people.",
          },
          {
            id: "e1q4",
            prompt: "___ do you go to school? (by bus, by car, etc.)",
            options: ["How", "When", "Why"],
            correctIndex: 0,
            explanation: "'How' is for the way/method.",
          },
          {
            id: "e1q5",
            prompt: "___ are you happy today?",
            options: ["Why", "Where", "Who"],
            correctIndex: 0,
            explanation: "'Why' is for reasons.",
          },
          {
            id: "e1q6",
            prompt: "___ old are you?",
            options: ["How", "When", "What"],
            correctIndex: 0,
            explanation: "'How' is used with age.",
          },
          {
            id: "e1q7",
            prompt: "___ does the movie start?",
            options: ["When", "Where", "How"],
            correctIndex: 0,
            explanation: "'When' is for time.",
          },
          {
            id: "e1q8",
            prompt: "___ is your bag? (I can't see it.)",
            options: ["Where", "What", "Why"],
            correctIndex: 0,
            explanation: "'Where' is for location.",
          },
          {
            id: "e1q9",
            prompt: "___ do you spell your name?",
            options: ["How", "Who", "When"],
            correctIndex: 0,
            explanation: "'How' is for the way or method.",
          },
          {
            id: "e1q10",
            prompt: "___ is that man? (He is my teacher.)",
            options: ["Who", "Why", "Where"],
            correctIndex: 0,
            explanation: "'Who' is for asking about a person.",
          },
        ],
      },

      // EX 2: Input - Type the correct wh-word
      2: {
        type: "input",
        title: "Exercise 2 (Medium) — Type the correct wh-word",
        instructions: "Type the correct wh-word (what / where / when / why / who / how).",
        questions: [
          {
            id: "e2q1",
            prompt: "___ is your favorite color?",
            correct: "what",
            explanation: "'What' for things/information.",
          },
          {
            id: "e2q2",
            prompt: "___ do you wake up in the morning?",
            correct: "when",
            explanation: "'When' for time.",
          },
          {
            id: "e2q3",
            prompt: "___ is your English teacher?",
            correct: "who",
            explanation: "'Who' for a person.",
          },
          {
            id: "e2q4",
            prompt: "___ do you go to the gym? (on Mondays, at 6pm, etc.)",
            correct: "when",
            explanation: "'When' for when something happens.",
          },
          {
            id: "e2q5",
            prompt: "___ are you tired?",
            correct: "why",
            explanation: "'Why' for reasons.",
          },
          {
            id: "e2q6",
            prompt: "___ do you come to school? (by bike)",
            correct: "how",
            explanation: "'How' for the way/method.",
          },
          {
            id: "e2q7",
            prompt: "___ is the supermarket? (on Main Street)",
            correct: "where",
            explanation: "'Where' for places.",
          },
          {
            id: "e2q8",
            prompt: "___ is your birthday?",
            correct: "when",
            explanation: "'When' for dates and time.",
          },
          {
            id: "e2q9",
            prompt: "___ do you want for lunch?",
            correct: "what",
            explanation: "'What' for things/choices.",
          },
          {
            id: "e2q10",
            prompt: "___ is your brother? (He is at home.)",
            correct: "where",
            explanation: "'Where' for asking about place.",
          },
        ],
      },

      // EX 3: MCQ - Mixed wh-questions in context
      3: {
        type: "mcq",
        title: "Exercise 3 (Hard) — Choose the correct wh-word in context",
        instructions: "Choose the best wh-word for each question.",
        questions: [
          {
            id: "e3q1",
            prompt: "___ do you like English? Because it is fun.",
            options: ["Why", "Where", "Who"],
            correctIndex: 0,
            explanation: "'Why' asks for a reason.",
          },
          {
            id: "e3q2",
            prompt: "___ do you usually eat breakfast? At 7 o'clock.",
            options: ["When", "Who", "How"],
            correctIndex: 0,
            explanation: "'When' asks about time.",
          },
          {
            id: "e3q3",
            prompt: "___ is your favorite singer?",
            options: ["Who", "Why", "What"],
            correctIndex: 0,
            explanation: "'Who' is for a person.",
          },
          {
            id: "e3q4",
            prompt: "___ do you get to work? I take the bus.",
            options: ["How", "Where", "When"],
            correctIndex: 0,
            explanation: "'How' is for the method/way.",
          },
          {
            id: "e3q5",
            prompt: "___ do you play football? In the park.",
            options: ["Where", "How", "Why"],
            correctIndex: 0,
            explanation: "'Where' is for place.",
          },
          {
            id: "e3q6",
            prompt: "___ is your favorite food?",
            options: ["What", "Who", "When"],
            correctIndex: 0,
            explanation: "'What' is for things.",
          },
          {
            id: "e3q7",
            prompt: "___ is your bag? It's under the table.",
            options: ["Where", "What", "How"],
            correctIndex: 0,
            explanation: "'Where' is for location.",
          },
          {
            id: "e3q8",
            prompt: "___ do you study English? To travel.",
            options: ["Why", "Who", "When"],
            correctIndex: 0,
            explanation: "'Why' is for reason.",
          },
          {
            id: "e3q9",
            prompt: "___ do you do on weekends?",
            options: ["What", "Where", "Who"],
            correctIndex: 0,
            explanation: "'What' is for activities/things.",
          },
          {
            id: "e3q10",
            prompt: "___ do you go to bed? At 10pm.",
            options: ["When", "How", "Why"],
            correctIndex: 0,
            explanation: "'When' is for time.",
          },
        ],
      },

      // EX 4: Input - Complete wh-questions (answer = wh-word only)
      4: {
        type: "input",
        title: "Exercise 4 (Harder) — Complete the question with a wh-word",
        instructions: "Write only the correct wh-word for each question.",
        questions: [
          {
            id: "e4q1",
            prompt: "___ do you have English class? (time)",
            correct: "when",
            explanation: "'When' is for time.",
          },
          {
            id: "e4q2",
            prompt: "___ is your best friend? (person)",
            correct: "who",
            explanation: "'Who' is for people.",
          },
          {
            id: "e4q3",
            prompt: "___ do you go to school? (place)",
            correct: "where",
            explanation: "'Where' is for places.",
          },
          {
            id: "e4q4",
            prompt: "___ are you sad? (reason)",
            correct: "why",
            explanation: "'Why' is for reasons.",
          },
          {
            id: "e4q5",
            prompt: "___ do you come to school? (by train)",
            correct: "how",
            explanation: "'How' is for the way/method.",
          },
          {
            id: "e4q6",
            prompt: "___ is your favorite animal? (thing)",
            correct: "what",
            explanation: "'What' is for things/information.",
          },
          {
            id: "e4q7",
            prompt: "___ is your sister? (at home)",
            correct: "where",
            explanation: "'Where' is for place.",
          },
          {
            id: "e4q8",
            prompt: "___ do you go to bed? (10pm)",
            correct: "when",
            explanation: "'When' is for time.",
          },
          {
            id: "e4q9",
            prompt: "___ is that woman? (my teacher)",
            correct: "who",
            explanation: "'Who' is for people.",
          },
          {
            id: "e4q10",
            prompt: "___ do you like pizza? (Because it is tasty)",
            correct: "why",
            explanation: "'Why' is for reasons.",
          },
        ],
      },
    };
  }, []);

  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);

  // Store answers
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

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
    let total = 0;

    if (current.type === "mcq") {
      total = current.questions.length;
      for (const q of current.questions) {
        const a = mcqAnswers[q.id];
        if (a === q.correctIndex) correct++;
      }
    } else {
      total = current.questions.length;
      for (const q of current.questions) {
        const a = normalize(inputAnswers[q.id] ?? "");
        if (a && a === normalize(q.correct)) correct++;
      }
    }

    const percent = total ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percent };
  }, [checked, current, mcqAnswers, inputAnswers]);

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const config: LessonPDFConfig = {
        title: "Wh-Questions",
        subtitle: "What / Where / When / Why / Who / How — 4 exercises + answer key",
        level: "A1",
        keyRule: "Wh-word + do/does/is/are + subject + verb? Use: What (things), Where (place), When (time), Who (person), Why (reason), How (manner).",
        exercises: [
          {
            number: 1,
            title: "Exercise 1",
            difficulty: "Easy",
            instruction: "Choose the correct wh-word.",
            questions: [
              "___ is your name?",
              "___ do you live?",
              "___ is your best friend?",
              "___ do you go to school? (by bus, by car…)",
              "___ are you happy today?",
              "___ old are you?",
              "___ does the movie start?",
              "___ is your bag? (I can't see it.)",
              "___ do you spell your name?",
              "___ is that man? (He is my teacher.)",
            ],
            hint: "what / where / who / how / why / when",
          },
          {
            number: 2,
            title: "Exercise 2",
            difficulty: "Medium",
            instruction: "Write the correct wh-word.",
            questions: [
              "___ is your favorite color?",
              "___ do you wake up in the morning?",
              "___ is your English teacher?",
              "___ do you go to the gym? (on Mondays)",
              "___ are you tired?",
              "___ do you come to school? (by bike)",
              "___ is the supermarket? (on Main Street)",
              "___ is your birthday?",
              "___ do you want for lunch?",
              "___ is your brother? (He is at home.)",
            ],
          },
          {
            number: 3,
            title: "Exercise 3",
            difficulty: "Hard",
            instruction: "Choose the best wh-word in context.",
            questions: [
              "___ do you like English? (Because it's fun.)",
              "___ do you usually eat breakfast? (At 7 o'clock.)",
              "___ is your favorite singer?",
              "___ do you get to work? (I take the bus.)",
              "___ do you play football? (In the park.)",
              "___ is your favorite food?",
              "___ is your bag? (It's under the table.)",
              "___ do you study English? (To travel.)",
              "___ do you do on weekends?",
              "___ do you go to bed? (At 10pm.)",
            ],
            hint: "what / where / when / who / why / how",
          },
          {
            number: 4,
            title: "Exercise 4",
            difficulty: "Harder",
            instruction: "Write only the correct wh-word.",
            questions: [
              "___ do you have English class? (time)",
              "___ is your best friend? (person)",
              "___ do you go to school? (place)",
              "___ are you sad? (reason)",
              "___ do you come to school? (by train)",
              "___ is your favorite animal? (thing)",
              "___ is your sister? (at home)",
              "___ do you go to bed? (10pm)",
              "___ is that woman? (my teacher)",
              "___ do you like pizza? (Because it's tasty)",
            ],
          },
        ],
        answerKey: [
          {
            exercise: 1,
            subtitle: "Easy — choose the correct wh-word",
            answers: ["What", "Where", "Who", "How", "Why", "How", "When", "Where", "How", "Who"],
          },
          {
            exercise: 2,
            subtitle: "Medium — type the wh-word",
            answers: ["What", "When", "Who", "When", "Why", "How", "Where", "When", "What", "Where"],
          },
          {
            exercise: 3,
            subtitle: "Hard — wh-word in context",
            answers: ["Why", "When", "Who", "How", "Where", "What", "Where", "Why", "What", "When"],
          },
          {
            exercise: 4,
            subtitle: "Harder — complete the question",
            answers: ["When", "Who", "Where", "Why", "How", "What", "Where", "When", "Who", "Why"],
          },
        ],
      };
      await generateLessonPDF(config);
    } finally {
      setPdfLoading(false);
    }
  }

  function resetExercise() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked(false);
    setMcqAnswers({});
    setInputAnswers({});
  }

  function switchExercise(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setMcqAnswers({});
    setInputAnswers({});
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a1">Grammar A1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Wh-Questions (what / where / when / why / who / how)</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Wh-Questions <span className="font-extrabold">(what / where / when / why / who / how)</span> – A1 Exercises
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        We use <b>wh-questions</b> to ask for information: about things, people, places, time, reasons, and ways. Practice with 4 graded exercises and get confident with what, where, when, why, who, and how.
      </p>

      {/* Layout: left ad/game + center content + right ad/recommendations */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="">
            <SpeedRound gameId="grammar-a1-wh-questions" subject="Wh-Questions" questions={SPEED_QUESTIONS} variant="sidebar" />
          </div>
        ) : (
          <AdUnit variant="sidebar-dark" />

        )}

        {/* Center */}
        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button
              onClick={() => setTab("exercises")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"
              }`}
            >
              Exercises
            </button>
            <button
              onClick={() => setTab("explanation")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"
              }`}
            >
              Explanation
            </button>

            <PDFButton onDownload={downloadPDF} loading={pdfLoading} />

            <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
              Exercises:
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => switchExercise(n as 1 | 2 | 3 | 4)}
                  className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${
                    exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {tab === "exercises" ? (
              <>
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-slate-900">{current.title}</h2>
                  <p className="text-slate-700">{current.instructions}</p>

                  {/* Mobile exercise buttons */}
                  <div className="mt-2 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                    <span>Exercises:</span>
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        onClick={() => switchExercise(n as 1 | 2 | 3 | 4)}
                        className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${
                          exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Questions */}
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
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>

                              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                {q.options.map((opt, oi) => (
                                  <label
                                    key={oi}
                                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition ${
                                      chosen === oi
                                        ? "border-[#F5DA20] bg-[#F5DA20]/20"
                                        : "border-black/10 bg-white hover:bg-black/5"
                                    } ${checked ? "cursor-default opacity-95" : ""}`}
                                  >
                                    <input
                                      type="radio"
                                      name={q.id}
                                      disabled={checked}
                                      checked={chosen === oi}
                                      onChange={() => setMcqAnswers((p) => ({ ...p, [q.id]: oi }))}
                                    />
                                    <span className="text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>

                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}

                                  <div className="mt-2 text-slate-700">
                                    <b className="text-slate-900">Correct:</b> {q.options[q.correctIndex]} — {q.explanation}
                                  </div>
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
                      const noAnswer = checked && !answered;
                      const wrong = checked && answered && !isCorrect;

                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>

                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>

                              <div className="mt-3 flex items-center gap-3">
                                <input
                                  value={val}
                                  disabled={checked}
                                  onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                                  placeholder="Type here…"
                                  className="w-full max-w-xs rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]"
                                />
                              </div>

                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {wrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}

                                  <div className="mt-2 text-slate-700">
                                    <b className="text-slate-900">Correct:</b> {q.correct} — {q.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Controls */}
                <div className="mt-8 space-y-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    {!checked ? (
                      <button
                        onClick={() => { setChecked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
                      >
                        Check Answers
                      </button>
                    ) : (
                      <button
                        onClick={resetExercise}
                        className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition"
                      >
                        Try Again
                      </button>
                    )}
                    {checked && exNo < 4 && (
                      <button
                        onClick={() => switchExercise((exNo + 1) as 1 | 2 | 3 | 4)}
                        className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition"
                      >
                        Next Exercise →
                      </button>
                    )}
                  </div>

                  {score && (
                    <div className={`rounded-2xl border p-4 ${
                      score.percent >= 80
                        ? "border-emerald-200 bg-emerald-50"
                        : score.percent >= 50
                        ? "border-amber-200 bg-amber-50"
                        : "border-red-200 bg-red-50"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-3xl font-black ${
                            score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"
                          }`}>
                            {score.percent}%
                          </div>
                          <div className="mt-0.5 text-sm text-slate-600">
                            {score.correct} out of {score.total} correct
                          </div>
                        </div>
                        <div className="text-3xl">
                          {score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}
                        </div>
                      </div>
                      <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${score.percent}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-slate-500">
                        {score.percent >= 80
                          ? "Excellent! You can move to the next exercise."
                          : score.percent >= 50
                          ? "Good effort! Try once more to improve your score."
                          : "Keep practising — review the Explanation tab and try again."}
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
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/a1" allLabel="All A1 topics" />
        ) : (
          <AdUnit variant="sidebar-light" />

        )}
      </div>

      {/* SpeedRound below grid for non-PRO users */}
      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-a1-wh-questions" subject="Wh-Questions" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      {/* Bottom navigation */}
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a
          href="/grammar/a1"
          className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
        >
          ← All A1 topics
        </a>
        <a
          href="/grammar/a1/can-cant"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: Can / Can't →
        </a>
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
  const whWords = [
    { word: "What", asks: "things / actions", ex1: "What is your name?", ex2: "What do you do?" },
    { word: "Where", asks: "place", ex1: "Where do you live?", ex2: "Where is the station?" },
    { word: "When", asks: "time", ex1: "When is your birthday?", ex2: "When do you start?" },
    { word: "Who", asks: "person (subject)", ex1: "Who is calling?", ex2: "Who made this?" },
    { word: "Why", asks: "reason", ex1: "Why are you late?", ex2: "Why do you study English?" },
    { word: "How", asks: "manner / degree", ex1: "How are you?", ex2: "How do you spell it?" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Wh- Questions</h2>
        <p className="mt-2 text-slate-600 text-sm">
          <b>Wh-questions</b> ask for specific information. The wh-word at the start tells you exactly what kind of answer is needed.
        </p>
      </div>

      {/* Wh-word reference grid */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {whWords.map(({ word, asks, ex1, ex2 }) => (
          <div key={word} className="rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-sky-200 bg-sky-100 px-2.5 py-1 text-sm font-black text-sky-800">{word}</span>
              <span className="text-xs text-slate-500 font-semibold">{asks}</span>
            </div>
            <div className="text-sm text-slate-700 italic space-y-0.5">
              <div>{ex1}</div>
              <div>{ex2}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Formula */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-wide text-emerald-700">Question formula</div>
        <Formula parts={[
          { text: "Wh-word", color: "sky" },
          { dim: true, text: "+" },
          { text: "do/does/is/are", color: "green" },
          { dim: true, text: "+" },
          { text: "subject", color: "slate" },
          { dim: true, text: "+" },
          { text: "verb", color: "slate" },
          { dim: true, text: "+" },
          { text: "?", color: "yellow" },
        ]} />
        <div className="space-y-2 pt-1">
          <Ex en="Where do you live?" />
          <Ex en="What does she like?" />
          <Ex en="When is your birthday?" />
          <Ex en="How do you spell it?" />
        </div>
      </div>

      {/* Special case: Who as subject */}
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-wide text-violet-700">Special case — WHO as subject (no auxiliary needed!)</div>
        <p className="text-sm text-slate-600">When <b>Who</b> is the subject of the verb, you do NOT use do/does/is/are:</p>
        <Formula parts={[{ text: "Who", color: "violet" }, { dim: true, text: "+" }, { text: "verb", color: "slate" }, { dim: true, text: "+" }, { text: "?", color: "yellow" }]} />
        <div className="space-y-2 pt-1">
          <Ex en="Who lives here?" />
          <Ex en="Who called you yesterday?" />
          <Ex en="Who knows the answer?" />
        </div>
      </div>

      {/* Reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-black text-white shrink-0">!</span>
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Structure comparison — to be vs do/does</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="pb-2 text-left font-black text-slate-700 pr-4">Auxiliary</th>
                <th className="pb-2 text-left font-black text-slate-700 pr-4">Formula</th>
                <th className="pb-2 text-left font-black text-slate-700">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-slate-700">to be</td>
                <td className="py-2.5 pr-4 text-slate-600">Wh- + is/are + subject?</td>
                <td className="py-2.5 text-slate-800">Where is the station? · Who are they?</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-slate-700">do / does</td>
                <td className="py-2.5 pr-4 text-slate-600">Wh- + do/does + subject + base verb?</td>
                <td className="py-2.5 text-slate-800">What do you eat? · How does she travel?</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Correction examples */}
      <div className="rounded-2xl border border-red-200 bg-gradient-to-b from-red-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-wide text-red-600">Common mistakes — fix these!</div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Ex en="Where you live?" correct={false} />
          <Ex en="Where do you live?" correct={true} />
          <Ex en="What you are doing?" correct={false} />
          <Ex en="What are you doing?" correct={true} />
          <Ex en="What does she likes?" correct={false} />
          <Ex en="What does she like?" correct={true} />
          <Ex en="How you go to work?" correct={false} />
          <Ex en="How do you go to work?" correct={true} />
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Remember!</span> Always use the auxiliary verb <b>do / does / is / are</b> after the Wh-word — except when <b>Who</b> is the subject. <i>Where you live?</i> is wrong. <i>Where <b>do</b> you live?</i> is correct.
      </div>
    </div>
  );
}