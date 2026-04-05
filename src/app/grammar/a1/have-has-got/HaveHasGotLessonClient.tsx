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
  prompt: string;
  correct: string;
  explanation: string;
};

type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) {
  return s.trim().toLowerCase();
}

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "I ___ a new bike for my birthday.", options: ["has got","have got","has","is got"], answer: 1 },
  { q: "She ___ long brown hair.", options: ["have got","haves got","has got","is got"], answer: 2 },
  { q: "They ___ a big house near the park.", options: ["has got","is got","are got","have got"], answer: 3 },
  { q: "My brother ___ a dog called Max.", options: ["have got","haves got","has got","is got"], answer: 2 },
  { q: "We ___ any homework today — the teacher is ill.", options: ["has got","haven't got","hasn't got","have got"], answer: 1 },
  { q: "She ___ any sisters — she is an only child.", options: ["have got","hasn't got","haven't got","is got"], answer: 1 },
  { q: "___ you got a pen I can borrow?", options: ["Has","Is","Are","Have"], answer: 3 },
  { q: "___ your mum got a car?", options: ["Have","Is","Are","Has"], answer: 3 },
  { q: "Have you got a bike? — Yes, I ___.", options: ["has got","haven't","have got","has"], answer: 2 },
  { q: "Has she got a cat? — No, she ___.", options: ["has got","haven't got","hasn't got","has"], answer: 2 },
  { q: "My parents ___ a small flat in the city centre.", options: ["has got","is got","are got","have got"], answer: 3 },
  { q: "This dog ___ very short legs.", options: ["have got","is got","are got","has got"], answer: 3 },
  { q: "I ___ any money today — I left my wallet at home.", options: ["has got","haven't got","hasn't got","have got"], answer: 1 },
  { q: "He ___ blue eyes and curly hair.", options: ["have got","is got","are got","has got"], answer: 3 },
  { q: "Have they got a garden? — Yes, they ___.", options: ["has got","haven't","have got","has"], answer: 2 },
  { q: "My teacher ___ a very loud voice.", options: ["have got","is got","are got","has got"], answer: 3 },
  { q: "We ___ got enough chairs for everyone.", options: ["hasn't","haven't","has","is"], answer: 1 },
  { q: "My aunt ___ curly hair and blue eyes.", options: ["have got","is got","are got","has got"], answer: 3 },
  { q: "I ___ two younger cousins who live in the city.", options: ["has got","is got","are got","have got"], answer: 3 },
  { q: "This classroom ___ enough chairs for all the students.", options: ["have got","is got","are got","has got"], answer: 3 },
];

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Present Simple (I/you/we/they)", href: "/grammar/a1/present-simple-i-you-we-they", img: "/topics/a1/present-simple-i-you-we-they.jpg", level: "A1", badge: "bg-emerald-500", reason: "Builds on have/has got" },
  { title: "Can / Can't", href: "/grammar/a1/can-cant", img: "/topics/a1/can-cant.jpg", level: "A1", badge: "bg-emerald-500" },
  { title: "Subject Pronouns", href: "/grammar/a1/subject-pronouns", img: "/topics/a1/subject-pronouns.jpg", level: "A1", badge: "bg-emerald-500" },
];

export default function HaveHasGotLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      1: {
        type: "mcq",
        title: "Exercise 1 (Easy) — Choose have got or has got",
        instructions: "Choose the correct form: have got or has got.",
        questions: [
          {
            id: "e1q1",
            prompt: "My sister ___ a new bike, and she rides it every weekend.",
            options: ["have got", "has got"],
            correctIndex: 1,
            explanation: "My sister = she, so we use has got.",
          },
          {
            id: "e1q2",
            prompt: "I ___ two English books in my school bag today.",
            options: ["have got", "has got"],
            correctIndex: 0,
            explanation: "With I, we use have got.",
          },
          {
            id: "e1q3",
            prompt: "Tom and Mia ___ a small dog at home.",
            options: ["have got", "has got"],
            correctIndex: 0,
            explanation: "Tom and Mia = they, so we use have got.",
          },
          {
            id: "e1q4",
            prompt: "My teacher ___ a very friendly smile.",
            options: ["have got", "has got"],
            correctIndex: 1,
            explanation: "My teacher = one person, so has got.",
          },
          {
            id: "e1q5",
            prompt: "We ___ a maths test after lunch.",
            options: ["have got", "has got"],
            correctIndex: 0,
            explanation: "With we, we use have got.",
          },
          {
            id: "e1q6",
            prompt: "My brother ___ blue eyes and dark hair.",
            options: ["have got", "has got"],
            correctIndex: 1,
            explanation: "My brother = he, so has got.",
          },
          {
            id: "e1q7",
            prompt: "You ___ a good idea for our class project.",
            options: ["have got", "has got"],
            correctIndex: 0,
            explanation: "With you, we use have got.",
          },
          {
            id: "e1q8",
            prompt: "This room ___ two big windows.",
            options: ["have got", "has got"],
            correctIndex: 1,
            explanation: "This room = it, so has got.",
          },
          {
            id: "e1q9",
            prompt: "My friends ___ a lot of homework this evening.",
            options: ["have got", "has got"],
            correctIndex: 0,
            explanation: "My friends = they, so have got.",
          },
          {
            id: "e1q10",
            prompt: "Our cat ___ a very funny name.",
            options: ["have got", "has got"],
            correctIndex: 1,
            explanation: "Our cat = it, so has got.",
          },
        ],
      },

      2: {
        type: "input",
        title: "Exercise 2 (Medium) — Type have got or has got",
        instructions: "Write have got or has got.",
        questions: [
          {
            id: "e2q1",
            prompt: "I ___ a new dictionary for my English lessons.",
            correct: "have got",
            explanation: "With I, we use have got.",
          },
          {
            id: "e2q2",
            prompt: "My father ___ a car, but he usually goes to work by bus.",
            correct: "has got",
            explanation: "My father = he, so has got.",
          },
          {
            id: "e2q3",
            prompt: "We ___ a big kitchen with a table near the window.",
            correct: "have got",
            explanation: "With we, we use have got.",
          },
          {
            id: "e2q4",
            prompt: "Anna ___ long brown hair and green eyes.",
            correct: "has got",
            explanation: "Anna = she, so has got.",
          },
          {
            id: "e2q5",
            prompt: "You ___ a message from your teacher on your phone.",
            correct: "have got",
            explanation: "With you, we use have got.",
          },
          {
            id: "e2q6",
            prompt: "My grandparents ___ a small house in the countryside.",
            correct: "have got",
            explanation: "Grandparents = they, so have got.",
          },
          {
            id: "e2q7",
            prompt: "My little sister ___ a pink school bag.",
            correct: "has got",
            explanation: "My little sister = she, so has got.",
          },
          {
            id: "e2q8",
            prompt: "This computer ___ a very fast processor.",
            correct: "has got",
            explanation: "This computer = it, so has got.",
          },
          {
            id: "e2q9",
            prompt: "They ___ two lessons before lunch today.",
            correct: "have got",
            explanation: "With they, we use have got.",
          },
          {
            id: "e2q10",
            prompt: "My teacher ___ a lot of books on her desk.",
            correct: "has got",
            explanation: "My teacher = one person, so has got.",
          },
        ],
      },

      3: {
        type: "mcq",
        title: "Exercise 3 (Hard) — Negative and question forms",
        instructions: "Choose the correct form in each sentence.",
        questions: [
          {
            id: "e3q1",
            prompt: "She ___ any brothers or sisters.",
            options: ["has got", "hasn't got", "haven't got"],
            correctIndex: 1,
            explanation: "With she, the negative form is hasn't got.",
          },
          {
            id: "e3q2",
            prompt: "___ you got your school ID with you today?",
            options: ["Have", "Has", "Haven't"],
            correctIndex: 0,
            explanation: "Questions with you start with Have you got... ?",
          },
          {
            id: "e3q3",
            prompt: "We ___ much time before the next lesson starts.",
            options: ["haven't got", "hasn't got", "has got"],
            correctIndex: 0,
            explanation: "With we, the negative form is haven't got.",
          },
          {
            id: "e3q4",
            prompt: "___ your brother got a bike, or does he walk to school?",
            options: ["Have", "Has", "Haven't"],
            correctIndex: 1,
            explanation: "Your brother = he, so the question starts with Has.",
          },
          {
            id: "e3q5",
            prompt: "My dog ___ a bed in the kitchen, so it sleeps there.",
            options: ["has got", "have got", "hasn't got"],
            correctIndex: 0,
            explanation: "My dog = it, so has got.",
          },
          {
            id: "e3q6",
            prompt: "I ___ any money with me, so I can't buy a drink.",
            options: ["hasn't got", "haven't got", "have got"],
            correctIndex: 1,
            explanation: "With I, the negative form is haven't got.",
          },
          {
            id: "e3q7",
            prompt: "___ they got a test tomorrow morning?",
            options: ["Has", "Have", "Haven't"],
            correctIndex: 1,
            explanation: "With they, questions start with Have they got... ?",
          },
          {
            id: "e3q8",
            prompt: "He ___ a laptop at home, but he doesn't use it every day.",
            options: ["have got", "has got", "hasn't got"],
            correctIndex: 1,
            explanation: "With he, we use has got in positive sentences.",
          },
          {
            id: "e3q9",
            prompt: "My parents ___ a garden, so they grow tomatoes in summer.",
            options: ["has got", "have got", "haven't got"],
            correctIndex: 1,
            explanation: "My parents = they, so have got.",
          },
          {
            id: "e3q10",
            prompt: "___ she got a new phone, or is it her old one?",
            options: ["Have", "Has", "Hasn't"],
            correctIndex: 1,
            explanation: "With she, questions start with Has she got... ?",
          },
        ],
      },

      4: {
        type: "input",
        title: "Exercise 4 (Harder) — Complete the sentence",
        instructions: "Write have got, has got, haven't got, or hasn't got.",
        questions: [
          {
            id: "e4q1",
            prompt: "I ___ a lot of free time this week because I have many classes.",
            correct: "haven't got",
            explanation: "With I, the negative form is haven't got.",
          },
          {
            id: "e4q2",
            prompt: "My best friend ___ a very warm jacket for winter.",
            correct: "has got",
            explanation: "My best friend = one person, so has got.",
          },
          {
            id: "e4q3",
            prompt: "We ___ a new student in our class this month.",
            correct: "have got",
            explanation: "With we, we use have got.",
          },
          {
            id: "e4q4",
            prompt: "My little brother ___ his own room, so he shares with me.",
            correct: "hasn't got",
            explanation: "My little brother = he, so hasn't got.",
          },
          {
            id: "e4q5",
            prompt: "You ___ a pen in your bag, so you can use mine.",
            correct: "haven't got",
            explanation: "With you, the negative form is haven't got.",
          },
          {
            id: "e4q6",
            prompt: "Our school ___ a very big library on the second floor.",
            correct: "has got",
            explanation: "Our school = it, so has got.",
          },
          {
            id: "e4q7",
            prompt: "They ___ any milk at home, so they need to go to the shop.",
            correct: "haven't got",
            explanation: "With they, the negative form is haven't got.",
          },
          {
            id: "e4q8",
            prompt: "My aunt ___ curly hair and blue eyes.",
            correct: "has got",
            explanation: "My aunt = she, so has got.",
          },
          {
            id: "e4q9",
            prompt: "I ___ two younger cousins who live in Gdańsk.",
            correct: "have got",
            explanation: "With I, we use have got.",
          },
          {
            id: "e4q10",
            prompt: "This classroom ___ enough chairs for all the students.",
            correct: "has got",
            explanation: "This classroom = it, so has got.",
          },
        ],
      },
    };
  }, []);

  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);

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

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const config: LessonPDFConfig = {
        title: "Have / Has Got",
        subtitle: "Possession & Description — 4 exercises + answer key",
        level: "A1",
        keyRule: "I/You/We/They → have got. He/She/It → has got. Negative: haven't / hasn't got.",
        exercises: [
          {
            number: 1, title: "Exercise 1", difficulty: "Easy",
            instruction: "Choose have got or has got.",
            questions: [
              "I ___ a new bike for my birthday.",
              "She ___ long brown hair.",
              "They ___ a big house near the park.",
              "My brother ___ a dog called Max.",
              "We ___ a very small garden, but we love it.",
              "My teacher ___ a very loud voice.",
              "He ___ blue eyes and curly hair.",
              "You ___ a great idea, I think!",
              "This dog ___ very short legs.",
              "My parents ___ a small flat in the city centre.",
            ],
            hint: "have got / has got",
          },
          {
            number: 2, title: "Exercise 2", difficulty: "Medium",
            instruction: "Choose haven't got or hasn't got.",
            questions: [
              "We ___ any homework today — the teacher is ill.",
              "She ___ any sisters — she is an only child.",
              "I ___ any money today — I left my wallet at home.",
              "My brother ___ a bicycle — he walks everywhere.",
              "They ___ a car, so they take the bus to work.",
              "He ___ a pet because his flat doesn't allow animals.",
              "You ___ enough time — we need to hurry!",
              "My grandparents ___ a computer at home.",
              "We ___ got enough chairs for everyone.",
              "This school ___ a swimming pool.",
            ],
            hint: "haven't got / hasn't got",
          },
          {
            number: 3, title: "Exercise 3", difficulty: "Hard",
            instruction: "Write Have or Has to start the question.",
            questions: [
              "___ you got a pen I can borrow?",
              "___ your mum got a car?",
              "___ they got a garden at their new house?",
              "___ he got any brothers or sisters?",
              "___ she got long hair or short hair?",
              "___ your teacher got a good sense of humour?",
              "___ the children got enough food for lunch?",
              "___ your dog got a collar with its name on it?",
              "___ we got time to finish this before break?",
              "___ this hotel got a swimming pool?",
            ],
            hint: "Have / Has",
          },
          {
            number: 4, title: "Exercise 4", difficulty: "Harder",
            instruction: "Write the correct form: have got / has got / haven't got / hasn't got.",
            questions: [
              "My father ___ a very good sense of humour.",
              "I ___ two younger cousins who live in the city.",
              "She ___ a lot of books about history on her shelf.",
              "We ___ any food at home — let's go shopping.",
              "My cat ___ beautiful green eyes.",
              "My grandparents ___ a garden with many flowers.",
              "He ___ a driving licence yet — he is still learning.",
              "My aunt ___ curly hair and blue eyes.",
              "This classroom ___ enough chairs for all students.",
              "I ___ enough time to finish all the exercises today.",
            ],
            hint: "have got / has got / haven't got / hasn't got",
          },
        ],
        answerKey: [
          { exercise: 1, subtitle: "Easy — have got or has got", answers: ["have got","has got","have got","has got","have got","has got","has got","have got","has got","have got"] },
          { exercise: 2, subtitle: "Medium — haven't got or hasn't got", answers: ["haven't got","hasn't got","haven't got","hasn't got","haven't got","hasn't got","haven't got","haven't got","haven't got","hasn't got"] },
          { exercise: 3, subtitle: "Hard — Have or Has", answers: ["Have","Has","Have","Has","Has","Has","Have","Has","Have","Has"] },
          { exercise: 4, subtitle: "Harder — correct form", answers: ["has got","have got","has got","haven't got","has got","have got","hasn't got","has got","has got","haven't got"] },
        ],
      };
      await generateLessonPDF(config);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a1">Grammar A1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Have / Has got</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Have / Has got <span className="font-extrabold">exercises and explanation (A1)</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Practise <b>have got</b> and <b>has got</b> with simple A1 exercises, answers, and a clear explanation. Learn positive, negative, and question forms in one lesson.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="sticky top-24">
            <SpeedRound gameId="grammar-a1-have-has-got" subject="Have / Has Got" questions={SPEED_QUESTIONS} variant="sidebar" />
          </div>
        ) : (
          <AdUnit variant="sidebar-dark" />

        )}

        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
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

          <div className="p-6 md:p-8">
            {tab === "exercises" ? (
              <>
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-slate-900">{current.title}</h2>
                  <p className="text-slate-700">{current.instructions}</p>

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

                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
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

      {/* Bottom navigation */}
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a
          href="/grammar/a1"
          className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
        >
          ← All A1 topics
        </a>
        <a
          href="/grammar/a1/prepositions-place"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: Prepositions of place →
        </a>
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Have got / Has got — Possession</h2>
        <p className="text-slate-500 text-sm">Use these to talk about things you own, family, and physical features.</p>
      </div>

      {/* Affirmative card */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-widest text-emerald-700">Affirmative</div>
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase">I / you / we / they</div>
          <Formula parts={[
            { text: "I / you / we / they", color: "slate" },
            { dim: true },
            { text: "have got", color: "green" },
            { dim: true },
            { text: "noun", color: "sky" },
          ]} />
          <div className="text-xs font-bold text-slate-500 uppercase mt-3">He / she / it</div>
          <Formula parts={[
            { text: "he / she / it", color: "slate" },
            { dim: true },
            { text: "has got", color: "green" },
            { dim: true },
            { text: "noun", color: "sky" },
          ]} />
        </div>
        <div className="grid gap-2 md:grid-cols-2 pt-1">
          <Ex en="I have got a pen. / I've got a pen." />
          <Ex en="She has got blue eyes. / She's got blue eyes." />
          <Ex en="They've got a big house." />
          <Ex en="He's got two brothers." />
        </div>
      </div>

      {/* Negative card */}
      <div className="rounded-2xl border border-red-200 bg-gradient-to-b from-red-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-widest text-red-600">Negative</div>
        <div className="space-y-2">
          <Formula parts={[
            { text: "I / you / we / they", color: "slate" },
            { dim: true },
            { text: "haven't got", color: "red" },
            { dim: true },
            { text: "noun", color: "sky" },
          ]} />
          <Formula parts={[
            { text: "he / she / it", color: "slate" },
            { dim: true },
            { text: "hasn't got", color: "red" },
            { dim: true },
            { text: "noun", color: "sky" },
          ]} />
        </div>
        <div className="grid gap-2 md:grid-cols-2 pt-1">
          <Ex en="I haven't got a car." />
          <Ex en="He hasn't got a bike." />
          <Ex en="We haven't got time." />
          <Ex en="She hasn't got a dog." />
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-widest text-sky-700">Question</div>
        <Formula parts={[
          { text: "Have / Has", color: "sky" },
          { dim: true },
          { text: "subject", color: "slate" },
          { dim: true },
          { text: "got", color: "violet" },
          { dim: true },
          { text: "noun", color: "sky" },
          { dim: true },
          { text: "?", color: "slate" },
        ]} />
        <div className="grid gap-2 md:grid-cols-2 pt-1">
          <Ex en="Have you got a ruler?" />
          <Ex en="Has she got a sister?" />
          <Ex en="Have they got a car?" />
          <Ex en="Has he got any brothers?" />
        </div>
        <div className="text-xs text-slate-500 pt-1 font-semibold">Short answers: Yes, I have. / No, I haven't. / Yes, she has. / No, she hasn't.</div>
      </div>

      {/* Reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-black text-white">!</span>
          <span className="text-sm font-black text-slate-700 uppercase tracking-wide">All subjects — forms &amp; contractions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-black/10">
                <th className="py-2 pr-4 text-left text-xs font-black text-slate-500 uppercase">Subject</th>
                <th className="py-2 pr-4 text-left text-xs font-black text-slate-500 uppercase">Full form</th>
                <th className="py-2 pr-4 text-left text-xs font-black text-slate-500 uppercase">Contraction</th>
                <th className="py-2 text-left text-xs font-black text-slate-500 uppercase">Negative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I", "I have got", "I've got", "I haven't got"],
                ["you", "You have got", "You've got", "You haven't got"],
                ["he / she / it", "She has got", "She's got", "She hasn't got"],
                ["we / they", "They have got", "They've got", "They haven't got"],
              ].map(([subj, full, contr, neg]) => (
                <tr key={subj}>
                  <td className="py-2.5 pr-4 font-black text-slate-700">{subj}</td>
                  <td className="py-2.5 pr-4 text-slate-700">{full}</td>
                  <td className="py-2.5 pr-4 text-slate-700">{contr}</td>
                  <td className="py-2.5 text-slate-700">{neg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Have got = Have note */}
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50 to-white p-5 space-y-2">
        <div className="text-xs font-black uppercase tracking-widest text-violet-700">Have got = Have</div>
        <p className="text-sm text-slate-600">Both mean the same thing. <strong>Have got</strong> is more British and informal. <strong>Have</strong> is more American and formal.</p>
        <div className="grid gap-2 md:grid-cols-2 pt-1">
          <Ex en="I've got a car. (British/informal)" />
          <Ex en="I have a car. (American/formal)" />
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Warning:</span> The question form is <strong>Have you got…?</strong> — never mix "do" with "have got".
        <div className="mt-2 space-y-1">
          <Ex en="Have you got a pen?" />
          <Ex en="Do you have got a pen?" correct={false} />
        </div>
      </div>
    </div>
  );
}