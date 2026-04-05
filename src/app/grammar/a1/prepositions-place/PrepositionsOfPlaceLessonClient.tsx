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
  prompt: string; // sentence with a blank
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
  { q: "The cat is ___ the chair.", options: ["in","on","under","behind"], answer: 1 },
  { q: "The bag is ___ the desk.", options: ["on","in","under","next to"], answer: 2 },
  { q: "The milk is ___ the fridge.", options: ["on","under","in","behind"], answer: 2 },
  { q: "The picture is ___ the wall.", options: ["in","under","behind","on"], answer: 3 },
  { q: "He is hiding ___ the door.", options: ["on","in","behind","under"], answer: 2 },
  { q: "The lamp is ___ the sofa and the chair.", options: ["behind","on","under","between"], answer: 3 },
  { q: "The bank is ___ the café.", options: ["under","next to","on","in"], answer: 1 },
  { q: "The dog is sleeping ___ the bed.", options: ["on","in","next to","under"], answer: 3 },
  { q: "The keys are ___ the table.", options: ["in","behind","on","under"], answer: 2 },
  { q: "She is standing ___ the students.", options: ["under","between","on","in front of"], answer: 3 },
  { q: "The café is ___ the park.", options: ["on","under","near","behind"], answer: 2 },
  { q: "The car is ___ the garage.", options: ["on","behind","under","in"], answer: 3 },
  { q: "The school is ___ the library and the park.", options: ["in front of","behind","between","next to"], answer: 2 },
  { q: "The poster is ___ the door.", options: ["under","in","on","behind"], answer: 3 },
  { q: "The children are playing ___ the table.", options: ["on","in","behind","under"], answer: 3 },
  { q: "The supermarket is ___ the station.", options: ["under","on","in","opposite"], answer: 3 },
  { q: "My house is ___ the school.", options: ["on","in","next to","under"], answer: 2 },
  { q: "There is a cat ___ the box.", options: ["on","behind","under","in"], answer: 3 },
  { q: "The bookshop is ___ the café.", options: ["in","under","opposite","on"], answer: 2 },
  { q: "The shoes are ___ the bed.", options: ["on","in","behind","under"], answer: 3 },
];

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Prepositions: in / on / at", href: "/grammar/a1/prepositions-time-in-on-at", img: "/topics/a1/prepositions-time-in-on-at.jpg", level: "A1", badge: "bg-emerald-500", reason: "Same prepositions for time" },
  { title: "There is / There are", href: "/grammar/a1/there-is-there-are", img: "/topics/a1/there-is-there-are.jpg", level: "A1", badge: "bg-emerald-500" },
  { title: "This / That / These / Those", href: "/grammar/a1/this-that-these-those", img: "/topics/a1/this-that-these-those.jpg", level: "A1", badge: "bg-emerald-500" },
];

export default function PrepositionsOfPlaceLessonClient() {
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      1: {
        type: "mcq",
        title: "Exercise 1 (Easy) — Choose the correct preposition of place",
        instructions: "Choose the correct preposition to complete each sentence.",
        questions: [
          {
            id: "e1q1",
            prompt: "The cat is sleeping ___ the chair, not under it, in the living room.",
            options: ["on", "under", "between", "behind"],
            correctIndex: 0,
            explanation: 'We use "on" when something is on the surface of something else.',
          },
          {
            id: "e1q2",
            prompt: "Your school bag is ___ the desk, so you cannot see it from here.",
            options: ["under", "next to", "in", "on"],
            correctIndex: 0,
            explanation: 'We use "under" when something is below another thing.',
          },
          {
            id: "e1q3",
            prompt: "The books are ___ the shelf above the small table.",
            options: ["on", "between", "behind", "under"],
            correctIndex: 0,
            explanation: 'We use "on" for things placed on a shelf.',
          },
          {
            id: "e1q4",
            prompt: "The lamp is ___ the sofa and the armchair near the window.",
            options: ["between", "in", "on", "under"],
            correctIndex: 0,
            explanation: 'We use "between" when something is in the middle of two things.',
          },
          {
            id: "e1q5",
            prompt: "There is some milk ___ the fridge for your breakfast.",
            options: ["in", "on", "under", "behind"],
            correctIndex: 0,
            explanation: 'We use "in" when something is inside something else.',
          },
          {
            id: "e1q6",
            prompt: "The bus stop is ___ the bank, so you only need to walk a few steps.",
            options: ["next to", "behind", "under", "between"],
            correctIndex: 0,
            explanation: 'We use "next to" when two things are very close side by side.',
          },
          {
            id: "e1q7",
            prompt: "The picture is hanging ___ the wall in my bedroom.",
            options: ["on", "in", "between", "under"],
            correctIndex: 0,
            explanation: 'We usually say a picture is "on" the wall.',
          },
          {
            id: "e1q8",
            prompt: "My little brother is hiding ___ the door because he wants to surprise us.",
            options: ["behind", "on", "between", "under"],
            correctIndex: 0,
            explanation: 'We use "behind" when something is at the back of something else.',
          },
          {
            id: "e1q9",
            prompt: "The teacher is standing ___ the students at the front of the classroom.",
            options: ["in front of", "under", "in", "behind"],
            correctIndex: 0,
            explanation: 'We use "in front of" when someone or something is before another thing.',
          },
          {
            id: "e1q10",
            prompt: "Our car is parked ___ the house, not behind it, near the small garden gate.",
            options: ["in front of", "between", "on", "behind"],
            correctIndex: 0,
            explanation: 'We use "in front of" for something positioned before a building or object.',
          },
        ],
      },
      2: {
        type: "input",
        title: "Exercise 2 (Medium) — Write the correct preposition of place",
        instructions: "Type the correct preposition of place in each blank.",
        questions: [
          {
            id: "e2q1",
            prompt: "The keys are ____ the table next to my phone.",
            correct: "on",
            explanation: 'Use "on" for something on a surface.',
          },
          {
            id: "e2q2",
            prompt: "The shoes are ____ the bed, so please put them somewhere else.",
            correct: "under",
            explanation: 'Use "under" when something is below another thing.',
          },
          {
            id: "e2q3",
            prompt: "Our dog is sitting ____ the two chairs in the kitchen.",
            correct: "between",
            explanation: 'Use "between" for the middle of two things.',
          },
          {
            id: "e2q4",
            prompt: "There is a lot of juice ____ the bottle in the fridge.",
            correct: "in",
            explanation: 'Use "in" when something is inside something.',
          },
          {
            id: "e2q5",
            prompt: "The supermarket is ____ the post office on this street.",
            correct: "next to",
            explanation: 'Use "next to" when two places are side by side.',
          },
          {
            id: "e2q6",
            prompt: "The children are playing ____ the house because it is raining outside.",
            correct: "in",
            explanation: 'Use "in" when someone is inside a place.',
          },
          {
            id: "e2q7",
            prompt: "My coat is hanging ____ the door in the hallway.",
            correct: "behind",
            explanation: 'Use "behind" for something at the back of another thing.',
          },
          {
            id: "e2q8",
            prompt: "The teacher is ____ the board, writing a new example for us.",
            correct: "in front of",
            explanation: 'Use "in front of" when someone is before something else.',
          },
          {
            id: "e2q9",
            prompt: "The apple is ____ the box, not on the floor.",
            correct: "in",
            explanation: 'Use "in" because the apple is inside the box.',
          },
          {
            id: "e2q10",
            prompt: "There is a small café ____ our school, so we go there after lessons.",
            correct: "near",
            explanation: 'Use "near" when something is close to a place.',
          },
        ],
      },
      3: {
        type: "mcq",
        title: "Exercise 3 (Harder) — Choose the correct preposition of place",
        instructions: "Choose the best preposition for each sentence.",
        questions: [
          {
            id: "e3q1",
            prompt: "The remote control is ___ the sofa cushions, in the middle of them.",
            options: ["between", "on", "in front of", "under"],
            correctIndex: 0,
            explanation: '"Between" is correct because it is in the middle of the cushions.',
          },
          {
            id: "e3q2",
            prompt: "There is a beautiful mirror ___ the wall above the table.",
            options: ["on", "under", "behind", "between"],
            correctIndex: 0,
            explanation: 'We say a mirror is "on" the wall.',
          },
          {
            id: "e3q3",
            prompt: "My grandmother is sitting ___ me, directly before me, so I can see her face clearly.",
            options: ["in front of", "behind", "under", "next to"],
            correctIndex: 0,
            explanation: '"In front of" means before someone or something.',
          },
          {
            id: "e3q4",
            prompt: "The cat is hiding ___ the sofa, not behind it, because it is afraid of the vacuum cleaner.",
            options: ["under", "on", "between", "behind"],
            correctIndex: 0,
            explanation: '"Under" is correct because the cat is below the sofa.',
          },
          {
            id: "e3q5",
            prompt: "The bakery is ___ the pharmacy and the flower shop on the corner.",
            options: ["between", "behind", "in", "on"],
            correctIndex: 0,
            explanation: '"Between" is used for something in the middle of two places.',
          },
          {
            id: "e3q6",
            prompt: "Your notebook is ___ your backpack, inside it, not on the desk.",
            options: ["in", "next to", "behind", "under"],
            correctIndex: 0,
            explanation: '"In" is correct because the notebook is inside the backpack.',
          },
          {
            id: "e3q7",
            prompt: "The little boy is standing ___ his mother, right beside her, while they wait for the bus.",
            options: ["next to", "under", "on", "between"],
            correctIndex: 0,
            explanation: '"Next to" means very close at the side of someone.',
          },
          {
            id: "e3q8",
            prompt: "Our garden is ___ the house, so you can see it from the kitchen window.",
            options: ["behind", "in", "between", "under"],
            correctIndex: 0,
            explanation: '"Behind" is correct because the garden is at the back of the house.',
          },
          {
            id: "e3q9",
            prompt: "There is a small lamp ___ my bed, beside it, and I use it every evening.",
            options: ["next to", "under", "between", "behind"],
            correctIndex: 0,
            explanation: '"Next to" is correct because the lamp is beside the bed.',
          },
          {
            id: "e3q10",
            prompt: "The students are waiting ___ the classroom door because the lesson starts in five minutes.",
            options: ["outside", "on", "behind", "under"],
            correctIndex: 0,
            explanation: '"Outside" is correct because they are not in the classroom yet.',
          },
        ],
      },
      4: {
        type: "input",
        title: "Exercise 4 (Hardest) — Complete the sentences",
        instructions: "Write the correct preposition of place in the blank.",
        questions: [
          {
            id: "e4q1",
            prompt: "The TV is ____ the wall in the living room.",
            correct: "on",
            explanation: 'Use "on" because the TV is attached to the wall.',
          },
          {
            id: "e4q2",
            prompt: "My little sister is hiding ____ the curtain and laughing quietly.",
            correct: "behind",
            explanation: 'Use "behind" when someone is at the back of something.',
          },
          {
            id: "e4q3",
            prompt: "The ball is ____ the chair, so you need to bend down and get it.",
            correct: "under",
            explanation: 'Use "under" for something below another thing.',
          },
          {
            id: "e4q4",
            prompt: "There is a small park ____ my house, so I can walk there in two minutes.",
            correct: "near",
            explanation: 'Use "near" when a place is close.',
          },
          {
            id: "e4q5",
            prompt: "The cookies are ____ the jar on the kitchen table.",
            correct: "in",
            explanation: 'Use "in" because the cookies are inside the jar.',
          },
          {
            id: "e4q6",
            prompt: "My school is ____ the library and the sports centre.",
            correct: "between",
            explanation: 'Use "between" for something in the middle of two places.',
          },
          {
            id: "e4q7",
            prompt: "The teacher is standing ____ the class and asking a question.",
            correct: "in front of",
            explanation: 'Use "in front of" when someone is before a group or object.',
          },
          {
            id: "e4q8",
            prompt: "There is a small table ____ the sofa with a lamp on it.",
            correct: "next to",
            explanation: 'Use "next to" when one thing is beside another.',
          },
          {
            id: "e4q9",
            prompt: "Our car is ____ the house, not behind it.",
            correct: "in front of",
            explanation: 'Use "in front of" because the car is before the house.',
          },
          {
            id: "e4q10",
            prompt: "The students are waiting ____ the classroom door before the lesson.",
            correct: "outside",
            explanation: 'Use "outside" because they are not inside the classroom.',
          },
        ],
      },
    };
  }, []);

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
        title: "Prepositions of Place",
        subtitle: "in / on / under / next to / behind / between — 4 exercises + answer key",
        level: "A1",
        keyRule: "Use IN (inside), ON (surface), UNDER (below), NEXT TO (beside), BEHIND (at the back), BETWEEN (in the middle of two things).",
        exercises: [
          {
            number: 1, title: "Exercise 1", difficulty: "Easy",
            instruction: "Choose the correct preposition of place.",
            questions: [
              "The cat is sleeping ___ the chair.",
              "Your school bag is ___ the desk.",
              "The books are ___ the shelf.",
              "The lamp is ___ the sofa and the armchair.",
              "There is some milk ___ the fridge.",
              "The bus stop is ___ the bank.",
              "The picture is hanging ___ the wall.",
              "My brother is hiding ___ the door.",
              "The teacher is standing ___ the students.",
              "The dog is sleeping ___ the bed.",
            ],
            hint: "in/on/under…",
          },
          {
            number: 2, title: "Exercise 2", difficulty: "Easy",
            instruction: "Choose the correct preposition of place.",
            questions: [
              "Put the plates ___ the table for dinner.",
              "The car keys are ___ my bag somewhere.",
              "There is a big tree ___ the house.",
              "The supermarket is ___ the bank and the library.",
              "The cat is hiding ___ the sofa.",
              "My coat is hanging ___ the door.",
              "The post office is ___ the café.",
              "The remote control is ___ the cushions.",
              "There is a small garden ___ the building.",
              "My glasses are ___ this pile of papers.",
            ],
            hint: "in/on/under…",
          },
          {
            number: 3, title: "Exercise 3", difficulty: "Medium",
            instruction: "Choose the correct preposition of place.",
            questions: [
              "The school is ___ the park and the library.",
              "There is a poster ___ the door.",
              "The bookshop is ___ the café on the main street.",
              "There is a mouse ___ the cupboard.",
              "My house is ___ the school — just two minutes away.",
              "The children are playing ___ the big tree.",
              "There is a beautiful painting ___ the fireplace.",
              "Put the vegetables ___ the fridge when you get home.",
              "The bank is ___ the supermarket on King Street.",
              "The cat is sitting ___ the two children.",
            ],
            hint: "in/on/under…",
          },
          {
            number: 4, title: "Exercise 4", difficulty: "Hard",
            instruction: "Write the correct preposition of place.",
            questions: [
              "The café is ___ the park — just opposite the gate.",
              "There are some books ___ the shelf above the desk.",
              "She put her phone ___ the table and went to sleep.",
              "The dog is sleeping ___ the bed in the corner.",
              "The cinema is ___ the hotel and the restaurant.",
              "There is a small pond ___ the garden.",
              "He found his keys ___ the sofa cushions.",
              "The old church is ___ the main square.",
              "Put the cups ___ the top shelf in the kitchen.",
              "She is standing ___ the door, waiting for us.",
            ],
          },
        ],
        answerKey: [
          { exercise: 1, subtitle: "Easy — choose preposition", answers: ["on","under","on","between","in","next to","on","behind","in front of","under"] },
          { exercise: 2, subtitle: "Easy — choose preposition", answers: ["on","in","behind","between","under","on","next to","between","behind","under"] },
          { exercise: 3, subtitle: "Medium — choose preposition", answers: ["between","on","opposite","in","next to","under","above","in","next to","between"] },
          { exercise: 4, subtitle: "Hard — write preposition", answers: ["opposite","on","on","under","between","in","under","in","on","in front of"] },
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
        <span className="text-slate-700 font-medium">Prepositions of Place</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Prepositions of Place <span className="font-extrabold">— exercises & explanation</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Learn how to use <b>in, on, under, next to, behind, between, in front of, near</b> and other common prepositions of place. These words help us say where people and things are in a clear, simple way.
      </p>

      {/* Layout: left col + center content + right col */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="sticky top-24">
            <SpeedRound gameId="grammar-a1-prepositions-place" subject="Prepositions of Place" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          href="/grammar/a1/prepositions-time-in-on-at"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: Prepositions of time →
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Prepositions of Place</h2>
        <p className="text-slate-500 text-sm">Tell us where something is located in space.</p>
      </div>

      {/* Sentence formula */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-widest text-emerald-700">Sentence structure</div>
        <Formula parts={[
          { text: "Subject", color: "slate" },
          { dim: true },
          { text: "to be", color: "green" },
          { dim: true },
          { text: "preposition", color: "violet" },
          { dim: true },
          { text: "place", color: "sky" },
        ]} />
        <div className="grid gap-2 md:grid-cols-2 pt-1">
          <Ex en="The cat is under the bed." />
          <Ex en="The keys are on the table." />
          <Ex en="The milk is in the fridge." />
          <Ex en="The shop is between the bank and the café." />
        </div>
      </div>

      {/* Preposition cards grid */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Prepositions — meaning &amp; examples</div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            {
              emoji: "📦",
              prep: "in",
              meaning: "inside something",
              examples: ["in the box", "in the room", "in London"],
            },
            {
              emoji: "🧊",
              prep: "on",
              meaning: "on a surface",
              examples: ["on the table", "on the wall", "on the floor"],
            },
            {
              emoji: "📍",
              prep: "at",
              meaning: "specific point or place",
              examples: ["at the door", "at the bus stop", "at school"],
            },
            {
              emoji: "🛏️",
              prep: "under",
              meaning: "below something",
              examples: ["under the bed", "under the bridge", "under the table"],
            },
            {
              emoji: "↔️",
              prep: "next to / beside",
              meaning: "directly to the side",
              examples: ["next to the window", "beside the car", "next to the sofa"],
            },
            {
              emoji: "🌳",
              prep: "between",
              meaning: "in the middle of two things",
              examples: ["between the trees", "between Monday and Friday", "between the bank and the café"],
            },
            {
              emoji: "🚗",
              prep: "in front of",
              meaning: "facing / before",
              examples: ["in front of the house", "in front of the class"],
            },
            {
              emoji: "🏠",
              prep: "behind",
              meaning: "at the back",
              examples: ["behind the door", "behind the school", "behind the sofa"],
            },
          ].map(({ emoji, prep, meaning, examples }) => (
            <div key={prep} className="rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50 to-white p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{emoji}</span>
                <span className="font-black text-violet-800 text-sm">{prep}</span>
                <span className="text-slate-400 text-xs">— {meaning}</span>
              </div>
              <Formula parts={[
                { text: "is / are", color: "slate" },
                { dim: true },
                { text: prep, color: "violet" },
                { dim: true },
                { text: "place", color: "sky" },
              ]} />
              <div className="space-y-1 pt-1">
                {examples.map((ex) => (
                  <Ex key={ex} en={ex} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed expressions table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-black text-white">!</span>
          <span className="text-sm font-black text-slate-700 uppercase tracking-wide">Common fixed expressions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-black/10">
                <th className="py-2 pr-4 text-left text-xs font-black text-slate-500 uppercase">at</th>
                <th className="py-2 pr-4 text-left text-xs font-black text-slate-500 uppercase">in</th>
                <th className="py-2 text-left text-xs font-black text-slate-500 uppercase">on</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["at home", "in bed", "on the bus"],
                ["at school", "in hospital", "on the train"],
                ["at work", "in the car", "on the left"],
                ["at the station", "in the morning", "on the right"],
              ].map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="py-2.5 pr-4 text-slate-700 font-semibold">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Warning:</span> in / on / at are NOT interchangeable — these are fixed expressions you must memorise.
        <div className="mt-2 space-y-1">
          <Ex en="I am at home." />
          <Ex en="I am in home." correct={false} />
          <Ex en="I travel on the bus." />
          <Ex en="I travel in the bus." correct={false} />
        </div>
      </div>
    </div>
  );
}