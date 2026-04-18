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
import { useLiveSync } from "@/lib/useLiveSync";

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
  { q: "Is 'apple' countable or uncountable?", options: ["uncountable","countable","both","neither"], answer: 1 },
  { q: "Is 'water' countable or uncountable?", options: ["countable","uncountable","both","neither"], answer: 1 },
  { q: "I need ___ information about the trip.", options: ["a","an","some","many"], answer: 2 },
  { q: "There are ___ books on the table.", options: ["much","a little","some","a few → some"], answer: 2 },
  { q: "There isn't ___ milk in the fridge.", options: ["many","a few","some","any"], answer: 3 },
  { q: "We don't have ___ apples left.", options: ["much","any","a little","some"], answer: 1 },
  { q: "Is 'bread' countable or uncountable?", options: ["countable","both","uncountable","neither"], answer: 2 },
  { q: "I would like ___ coffee, please.", options: ["a","many","some","any"], answer: 2 },
  { q: "She has ___ friends in this city.", options: ["much","a little","any","some"], answer: 3 },
  { q: "Is 'chair' countable or uncountable?", options: ["uncountable","countable","both","neither"], answer: 1 },
  { q: "There isn't ___ sugar in this tea.", options: ["many","a few","some","any"], answer: 3 },
  { q: "Can I have ___ orange, please?", options: ["some","any","a","an"], answer: 3 },
  { q: "Is 'rice' countable or uncountable?", options: ["countable","uncountable","both","neither"], answer: 1 },
  { q: "I don't have ___ money today.", options: ["many","some","a few","any"], answer: 3 },
  { q: "We need ___ eggs to make the cake.", options: ["much","any → some","some","a little"], answer: 2 },
  { q: "Is 'homework' countable or uncountable?", options: ["countable","both","uncountable","neither"], answer: 2 },
  { q: "Would you like ___ tea?", options: ["a","an","many","some"], answer: 3 },
  { q: "She bought ___ new umbrella.", options: ["some","a","an","any"], answer: 2 },
  { q: "Is 'advice' countable or uncountable?", options: ["countable","uncountable","both","neither"], answer: 1 },
  { q: "There is ___ milk in the glass.", options: ["many","some","any → some","a few"], answer: 1 },
];

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Some / Any", href: "/grammar/a1/some-any", img: "/topics/a1/some-any.jpg", level: "A1", badge: "bg-emerald-500", reason: "Used with countable & uncountable" },
  { title: "Much / Many", href: "/grammar/a1/much-many-basic", img: "/topics/a1/much-many.jpg", level: "A1", badge: "bg-emerald-500" },
  { title: "Plural Nouns", href: "/grammar/a1/plural-nouns", img: "/topics/a1/plural-nouns.jpg", level: "A1", badge: "bg-emerald-500" },
];

export default function CountableUncountableLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      1: {
        type: "mcq",
        title: "Exercise 1 (Very Easy) — Choose the correct word",
        instructions: "Choose the correct answer.",
        questions: [
          {
            id: "e1q1",
            prompt: "I need ___ information about the city before our trip tomorrow.",
            options: ["a", "an", "some", "any"],
            correctIndex: 2,
            explanation: "Information is uncountable, so we use some in a positive sentence.",
          },
          {
            id: "e1q2",
            prompt: "She bought ___ apple at the shop after school.",
            options: ["a", "an", "some", "any"],
            correctIndex: 1,
            explanation: "Apple is countable singular and begins with a vowel sound, so we use an.",
          },
          {
            id: "e1q3",
            prompt: "We have ___ milk in the fridge for breakfast.",
            options: ["a", "an", "some", "any"],
            correctIndex: 2,
            explanation: "Milk is uncountable, so some is correct in a positive sentence.",
          },
          {
            id: "e1q4",
            prompt: "There is ___ book on the desk near the window.",
            options: ["a", "an", "some", "any"],
            correctIndex: 0,
            explanation: "Book is a countable singular noun, so we use a.",
          },
          {
            id: "e1q5",
            prompt: "He ate ___ orange before the lesson started.",
            options: ["a", "an", "some", "any"],
            correctIndex: 1,
            explanation: "Orange is countable singular and starts with a vowel sound, so an is correct.",
          },
          {
            id: "e1q6",
            prompt: "There is ___ bread on the table if you are hungry.",
            options: ["a", "an", "some", "any"],
            correctIndex: 2,
            explanation: "Bread is uncountable, so some is correct.",
          },
          {
            id: "e1q7",
            prompt: "I can see ___ chair in the corner of the room.",
            options: ["a", "an", "some", "any"],
            correctIndex: 0,
            explanation: "Chair is countable singular, so we use a.",
          },
          {
            id: "e1q8",
            prompt: "She has ___ egg for breakfast every morning.",
            options: ["a", "an", "some", "any"],
            correctIndex: 1,
            explanation: "Egg is countable singular and begins with a vowel sound, so an is correct.",
          },
          {
            id: "e1q9",
            prompt: "We need ___ water because the bottle is empty.",
            options: ["a", "an", "some", "any"],
            correctIndex: 2,
            explanation: "Water is uncountable, so some is correct in a positive sentence.",
          },
          {
            id: "e1q10",
            prompt: "There is ___ pen under your chair.",
            options: ["a", "an", "some", "any"],
            correctIndex: 0,
            explanation: "Pen is countable singular, so we use a.",
          },
        ],
      },

      2: {
        type: "mcq",
        title: "Exercise 2 (Easy) — Choose the correct answer",
        instructions: "Choose the best option for each sentence.",
        questions: [
          {
            id: "e2q1",
            prompt: "We don't have ___ cheese at home, so we can't make sandwiches now.",
            options: ["a", "an", "some", "any"],
            correctIndex: 3,
            explanation: "Cheese is uncountable, and in negative sentences we usually use any.",
          },
          {
            id: "e2q2",
            prompt: "Can I have ___ banana, please? I'm really hungry after the walk.",
            options: ["a", "an", "some", "any"],
            correctIndex: 0,
            explanation: "Banana is countable singular, so a is correct.",
          },
          {
            id: "e2q3",
            prompt: "There is ___ interesting article in this magazine about animals.",
            options: ["a", "an", "some", "any"],
            correctIndex: 1,
            explanation: "Article is countable singular and starts with a vowel sound, so an is correct.",
          },
          {
            id: "e2q4",
            prompt: "We bought ___ rice and vegetables for dinner after work.",
            options: ["a", "an", "some", "any"],
            correctIndex: 2,
            explanation: "Rice is uncountable, so some is correct in a positive sentence.",
          },
          {
            id: "e2q5",
            prompt: "Is there ___ juice in the fridge, or do we need to buy more?",
            options: ["a", "an", "some", "any"],
            correctIndex: 3,
            explanation: "In questions with uncountable nouns, any is common.",
          },
          {
            id: "e2q6",
            prompt: "She saw ___ old house near the station and took a photo of it.",
            options: ["a", "an", "some", "any"],
            correctIndex: 1,
            explanation: "Old house is countable singular and old starts with a vowel sound, so an is correct.",
          },
          {
            id: "e2q7",
            prompt: "There are ___ apples in the bowl, so take one if you want.",
            options: ["a", "an", "some", "any"],
            correctIndex: 2,
            explanation: "Apples are countable plural, so some is correct in a positive sentence.",
          },
          {
            id: "e2q8",
            prompt: "He doesn't need ___ help with this exercise because it is easy.",
            options: ["a", "an", "some", "any"],
            correctIndex: 3,
            explanation: "Help is uncountable, and in negatives we usually use any.",
          },
          {
            id: "e2q9",
            prompt: "I have ___ idea for our class project, and I want to tell you now.",
            options: ["a", "an", "some", "any"],
            correctIndex: 1,
            explanation: "Idea is countable singular and starts with a vowel sound, so an is correct.",
          },
          {
            id: "e2q10",
            prompt: "There is ___ soup in the kitchen if you want something warm.",
            options: ["a", "an", "some", "any"],
            correctIndex: 2,
            explanation: "Soup is usually treated as uncountable here, so some is correct.",
          },
        ],
      },

      3: {
        type: "mcq",
        title: "Exercise 3 (Medium) — Choose the best option",
        instructions: "Choose the correct word or phrase for each sentence.",
        questions: [
          {
            id: "e3q1",
            prompt: "I need ___ information about the buses because I don't know this city very well.",
            options: ["a", "an", "some", "any"],
            correctIndex: 2,
            explanation: "Information is uncountable, so some is correct in a positive sentence.",
          },
          {
            id: "e3q2",
            prompt: "We haven't got ___ eggs, so we can't make a cake this evening.",
            options: ["a", "an", "some", "any"],
            correctIndex: 3,
            explanation: "Eggs are countable plural, and in negative sentences we usually use any.",
          },
          {
            id: "e3q3",
            prompt: "She bought ___ umbrella because it looked like rain in the morning.",
            options: ["a", "an", "some", "any"],
            correctIndex: 1,
            explanation: "Umbrella is countable singular and starts with a vowel sound, so an is correct.",
          },
          {
            id: "e3q4",
            prompt: "There is ___ furniture in the room, but it still looks comfortable and nice.",
            options: ["a", "an", "some", "any"],
            correctIndex: 2,
            explanation: "Furniture is uncountable, so some is correct in a positive sentence.",
          },
          {
            id: "e3q5",
            prompt: "Do you have ___ money with you, or do we need to go to the cash machine first?",
            options: ["a", "an", "some", "any"],
            correctIndex: 3,
            explanation: "Money is uncountable, and in general questions we usually use any.",
          },
          {
            id: "e3q6",
            prompt: "He is reading ___ interesting book about life in a big city.",
            options: ["a", "an", "some", "any"],
            correctIndex: 1,
            explanation: "Interesting book is countable singular and starts with a vowel sound, so an is correct.",
          },
          {
            id: "e3q7",
            prompt: "We bought ___ apples, ___ bread, and ___ orange for the picnic.",
            options: ["some / some / an", "any / some / a", "a / any / an", "some / a / some"],
            correctIndex: 0,
            explanation: "Apples are plural countable, bread is uncountable, and orange is singular countable with a vowel sound.",
          },
          {
            id: "e3q8",
            prompt: "There isn't ___ homework for tomorrow, so we can relax this evening.",
            options: ["a", "an", "some", "any"],
            correctIndex: 3,
            explanation: "Homework is uncountable, and in negative sentences we usually use any.",
          },
          {
            id: "e3q9",
            prompt: "I saw ___ accident near the station when I was coming home.",
            options: ["a", "an", "some", "any"],
            correctIndex: 1,
            explanation: "Accident is countable singular and starts with a vowel sound, so an is correct.",
          },
          {
            id: "e3q10",
            prompt: "There are ___ chairs in the room, but there isn't ___ table.",
            options: ["some / a", "any / some", "a / any", "an / some"],
            correctIndex: 0,
            explanation: "Chairs are plural countable in a positive sentence, so some is correct. Table is singular countable, so a is correct.",
          },
        ],
      },

      4: {
        type: "input",
        title: "Exercise 4 (A Little Harder) — Type the missing answer",
        instructions: "Write the missing answer exactly: a, an, some, or any.",
        questions: [
          {
            id: "e4q1",
            prompt: "I need _____ information about this hotel before I book a room.",
            correct: "some",
            explanation: "Information is uncountable, so some is correct in a positive sentence.",
          },
          {
            id: "e4q2",
            prompt: "There is _____ apple in my bag if you want a snack.",
            correct: "an",
            explanation: "Apple is singular countable and starts with a vowel sound, so an is correct.",
          },
          {
            id: "e4q3",
            prompt: "We don't have _____ bread, so I need to go to the shop.",
            correct: "any",
            explanation: "Bread is uncountable, and in negative sentences we usually use any.",
          },
          {
            id: "e4q4",
            prompt: "She bought _____ new dress for the party on Saturday.",
            correct: "a",
            explanation: "Dress is singular countable, so a is correct.",
          },
          {
            id: "e4q5",
            prompt: "There is _____ milk in the fridge for your coffee.",
            correct: "some",
            explanation: "Milk is uncountable, so some is correct in a positive sentence.",
          },
          {
            id: "e4q6",
            prompt: "Do you have _____ money for the bus ticket, or should I pay?",
            correct: "any",
            explanation: "Money is uncountable, and in general questions we usually use any.",
          },
          {
            id: "e4q7",
            prompt: "He saw _____ elephant at the zoo and took a lot of photos.",
            correct: "an",
            explanation: "Elephant is singular countable and starts with a vowel sound, so an is correct.",
          },
          {
            id: "e4q8",
            prompt: "We have _____ eggs, so let's make an omelette for lunch.",
            correct: "some",
            explanation: "Eggs are plural countable, so some is correct in a positive sentence.",
          },
          {
            id: "e4q9",
            prompt: "There isn't _____ homework today, so the students are very happy.",
            correct: "any",
            explanation: "Homework is uncountable, and in negatives we usually use any.",
          },
          {
            id: "e4q10",
            prompt: "I need _____ umbrella because it is raining outside.",
            correct: "an",
            explanation: "Umbrella is singular countable and starts with a vowel sound, so an is correct.",
          },
        ],
      },
    };
  }, []);

  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);

  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const { isLive, broadcast } = useLiveSync((payload) => {
    setMcqAnswers(payload.answers as Record<string, number | null>);
    setInputAnswers((payload as unknown as { inputAnswers: Record<string, string> }).inputAnswers ?? {});
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3 | 4);
  });

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
    broadcast({ answers: {}, checked: false, exNo });
  }

  function switchExercise(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setMcqAnswers({});
    setInputAnswers({});
    broadcast({ answers: {}, checked: false, exNo: n });
  }

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const config: LessonPDFConfig = {
        title: "Countable & Uncountable",
        subtitle: "Count nouns vs. mass nouns — 4 exercises + answer key",
        level: "A1",
        keyRule: "Countable: a/an, some, many, a few. Uncountable: some, much, a little (no a/an, no plural).",
        exercises: [
          {
            number: 1, title: "Exercise 1", difficulty: "Easy",
            instruction: "Choose the correct word to complete the sentence.",
            questions: [
              "I need ___ information about the city before our trip.",
              "Can I have ___ apple, please?",
              "We don't have ___ bread left in the kitchen.",
              "There are ___ students in the classroom today.",
              "She drinks ___ water every morning to stay healthy.",
              "I need ___ umbrella because it is raining outside.",
              "There is ___ milk in the fridge — please buy more.",
              "He gave me ___ good advice about my homework.",
              "We have ___ chairs in the garden for the party.",
              "Is there ___ sugar left in the jar?",
            ],
            hint: "a / an / some / any",
          },
          {
            number: 2, title: "Exercise 2", difficulty: "Medium",
            instruction: "Choose the correct word: a, an, some, or any.",
            questions: [
              "There isn't ___ coffee in the cup — can you make more?",
              "She wants to eat ___ orange for breakfast.",
              "Do you have ___ money with you today?",
              "I would like ___ rice with my meal, please.",
              "There are ___ books on my desk that I need to read.",
              "My mum makes ___ excellent apple pie every Sunday.",
              "We don't need ___ more salt — it is already salty enough.",
              "I can see ___ egg in the bowl on the table.",
              "Is there ___ butter in the fridge for the toast?",
              "He bought ___ new bag for his school trip.",
            ],
            hint: "a / an / some / any",
          },
          {
            number: 3, title: "Exercise 3", difficulty: "Hard",
            instruction: "Choose much or many to complete the sentence.",
            questions: [
              "How ___ books do you have on your shelf?",
              "How ___ milk is left in the bottle?",
              "There are too ___ people in this room.",
              "She doesn't eat ___ meat during the week.",
              "How ___ money do you need for the trip?",
              "There are ___ apples in the basket on the counter.",
              "We don't have ___ time before the lesson starts.",
              "How ___ sugar do you want in your tea?",
              "There are too ___ chairs in this small room.",
              "He doesn't drink ___ coffee in the evening.",
            ],
            hint: "much / many",
          },
          {
            number: 4, title: "Exercise 4", difficulty: "Harder",
            instruction: "Write the missing word: a, an, some, or any.",
            questions: [
              "I would like ___ cup of tea, please.",
              "There isn't ___ homework today, so students are very happy.",
              "We have ___ eggs, so let's make an omelette for lunch.",
              "She is reading ___ interesting book about history.",
              "Do you have ___ information about the new school?",
              "I need ___ umbrella because it is raining outside.",
              "There isn't ___ water in my bottle — can I have some?",
              "He gave me ___ advice that was very helpful.",
              "We bought ___ new chairs for the living room.",
              "Is there ___ orange juice in the fridge?",
            ],
            hint: "a / an / some / any",
          },
        ],
        answerKey: [
          { exercise: 1, subtitle: "Easy — a / an / some / any", answers: ["some","an","any","some","some","an","some","some","some","any"] },
          { exercise: 2, subtitle: "Medium — a / an / some / any", answers: ["any","an","any","some","some","an","any","an","any","a"] },
          { exercise: 3, subtitle: "Hard — much or many", answers: ["many","much","many","much","much","many","much","much","many","much"] },
          { exercise: 4, subtitle: "Harder — a / an / some / any", answers: ["a","any","some","an","any","an","any","some","some","any"] },
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
        <span className="text-slate-700 font-medium">Countable / Uncountable</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Countable / Uncountable <span className="font-extrabold">— A1 grammar exercises</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Learn countable and uncountable nouns with easy A1 rules, clear examples, and graded exercises. Practise words like apples, bread, milk, rice, books, and water.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="">
            <SpeedRound gameId="grammar-a1-countable-uncountable" subject="Countable & Uncountable" questions={SPEED_QUESTIONS} variant="sidebar" />
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
                                      onChange={() => { setMcqAnswers((p) => { const n = { ...p, [q.id]: oi }; broadcast({ answers: n, checked, exNo }); return n; }); }}
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
                        onClick={() => { setChecked(true); broadcast({ answers: mcqAnswers, checked: true, exNo }); window.scrollTo({ top: 0, behavior: "smooth" }); }}
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
          href="/grammar/a1/much-many-basic"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: Much / Many →
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
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Countable &amp; Uncountable Nouns</h2>
        <p className="mt-2 text-slate-600 text-sm">
          Nouns in English are either <b>countable</b> (you can count individual items) or <b>uncountable</b> (you cannot count them one by one). This difference controls which articles and quantifiers you use.
        </p>
      </div>

      {/* 2 gradient cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Countable */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5 space-y-3">
          <div className="text-xs font-black uppercase tracking-wide text-emerald-700">Countable — can be counted</div>
          <Formula parts={[{ text: "a/an", color: "green" }, { dim: true, text: "+" }, { text: "singular noun", color: "slate" }]} />
          <Formula parts={[{ text: "number", color: "green" }, { dim: true, text: "+" }, { text: "plural noun", color: "slate" }]} />
          <div className="space-y-2 pt-1">
            <Ex en="a dog / two dogs" />
            <Ex en="a book / three books" />
            <Ex en="a chair / four chairs" />
          </div>
          <p className="text-xs text-slate-500 pt-1">Can say: <i>one book</i>, <i>two books</i> ✓ — has plural form</p>
        </div>

        {/* Uncountable */}
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50 to-white p-5 space-y-3">
          <div className="text-xs font-black uppercase tracking-wide text-sky-700">Uncountable — cannot be counted</div>
          <Formula parts={[{ text: "some/any/much/a lot of", color: "sky" }, { dim: true, text: "+" }, { text: "noun (no plural!)", color: "slate" }]} />
          <div className="space-y-2 pt-1">
            <Ex en="some water (NOT a water)" />
            <Ex en="some rice (NOT two rices)" />
            <Ex en="some advice (NOT an advice)" />
          </div>
          <p className="text-xs text-slate-500 pt-1">Cannot say: <i>one water</i>, <i>two waters</i> ✗ — no plural form</p>
        </div>
      </div>

      {/* Reference table — 12 uncountable nouns */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-black text-white shrink-0">!</span>
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">12 common uncountable nouns to memorise</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {["water", "milk", "rice", "bread", "money", "music", "advice", "information", "news", "furniture", "luggage", "weather"].map((word) => (
            <div key={word} className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-800 text-center">
              {word}
            </div>
          ))}
        </div>
      </div>

      {/* Quantities for uncountable */}
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-wide text-violet-700">Common quantities for uncountable nouns</div>
        <p className="text-sm text-slate-600">Use a container or measure word to talk about a specific amount:</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Ex en="a glass of water" />
          <Ex en="a loaf of bread" />
          <Ex en="a piece of advice" />
          <Ex en="a slice of cake" />
          <Ex en="a cup of tea" />
          <Ex en="a bowl of rice" />
        </div>
      </div>

      {/* Correction examples */}
      <div className="rounded-2xl border border-red-200 bg-gradient-to-b from-red-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-wide text-red-600">Common mistakes — fix these!</div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Ex en="an advice" correct={false} />
          <Ex en="a piece of advice" correct={true} />
          <Ex en="two rices" correct={false} />
          <Ex en="two portions of rice" correct={true} />
          <Ex en="some informations" correct={false} />
          <Ex en="some information" correct={true} />
          <Ex en="a homework" correct={false} />
          <Ex en="some homework" correct={true} />
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Remember!</span> Never use <b>a/an</b> with uncountable nouns and never make them plural. Say <i>some water</i>, not <i>a water</i>. Say <i>information</i>, not <i>informations</i>.
      </div>
    </div>
  );
}