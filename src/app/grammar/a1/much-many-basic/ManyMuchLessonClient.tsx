
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
  { q: "How ___ apples are in the bowl?", options: ["much","many","few","lot"], answer: 1 },
  { q: "How ___ milk is in the fridge?", options: ["many","much","some","lot"], answer: 1 },
  { q: "There aren't ___ students today.", options: ["much","many","some","any"], answer: 1 },
  { q: "We don't have ___ bread left.", options: ["many","much","few","some"], answer: 1 },
  { q: "How ___ books do you have?", options: ["much","many","lot","few"], answer: 1 },
  { q: "I don't drink ___ coffee.", options: ["many","much","lot","few"], answer: 1 },
  { q: "How ___ money do you have?", options: ["many","much","lot","few"], answer: 1 },
  { q: "There weren't ___ cars there.", options: ["much","many","lot","some"], answer: 1 },
  { q: "How ___ time do we have?", options: ["many","much","lot","few"], answer: 1 },
  { q: "How ___ languages do you speak?", options: ["much","many","lot","few"], answer: 1 },
  { q: "There isn't ___ juice in the bottle.", options: ["many","much","few","lot"], answer: 1 },
  { q: "We don't need ___ sugar.", options: ["many","much","lot","few"], answer: 1 },
  { q: "How ___ emails did you get?", options: ["much","many","lot","some"], answer: 1 },
  { q: "There isn't ___ food in the kitchen.", options: ["many","much","few","lot"], answer: 1 },
  { q: "How ___ sleep did you get?", options: ["many","much","lot","some"], answer: 1 },
  { q: "How ___ homework do you have?", options: ["many","much","lot","few"], answer: 1 },
  { q: "We haven't got ___ cheese.", options: ["many","much","lot","few"], answer: 1 },
  { q: "How ___ people live here?", options: ["much","many","lot","few"], answer: 1 },
  { q: "I didn't spend ___ money.", options: ["many","much","lot","few"], answer: 1 },
  { q: "How ___ water do you drink?", options: ["many","much","lot","few"], answer: 1 },
];

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Countable & Uncountable", href: "/grammar/a1/countable-uncountable", img: "/topics/a1/countable-uncountable.jpg", level: "A1", badge: "bg-emerald-500", reason: "Much/many depends on this" },
  { title: "Some / Any", href: "/grammar/a1/some-any", img: "/topics/a1/some-any.jpg", level: "A1", badge: "bg-emerald-500" },
  { title: "Plural Nouns", href: "/grammar/a1/plural-nouns", img: "/topics/a1/plural-nouns.jpg", level: "A1", badge: "bg-emerald-500" },
];

export default function ManyMuchLessonClient() {
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      1: {
        type: "mcq",
        title: "Exercise 1 (Very Easy) — Choose much or many",
        instructions: "Choose the correct answer.",
        questions: [
          {
            id: "e1q1",
            prompt: "How ___ apples are in the bowl?",
            options: ["much", "many"],
            correctIndex: 1,
            explanation: "Apples are countable plural, so we use many.",
          },
          {
            id: "e1q2",
            prompt: "How ___ milk is there in the fridge?",
            options: ["much", "many"],
            correctIndex: 0,
            explanation: "Milk is uncountable, so we use much.",
          },
          {
            id: "e1q3",
            prompt: "There aren't ___ students in the classroom today.",
            options: ["much", "many"],
            correctIndex: 1,
            explanation: "Students are countable plural, so many is correct.",
          },
          {
            id: "e1q4",
            prompt: "We don't have ___ bread left.",
            options: ["much", "many"],
            correctIndex: 0,
            explanation: "Bread is uncountable, so much is correct.",
          },
          {
            id: "e1q5",
            prompt: "How ___ books do you have?",
            options: ["much", "many"],
            correctIndex: 1,
            explanation: "Books are countable plural, so many is correct.",
          },
          {
            id: "e1q6",
            prompt: "I don't drink ___ coffee in the evening.",
            options: ["much", "many"],
            correctIndex: 0,
            explanation: "Coffee is uncountable here, so much is correct.",
          },
          {
            id: "e1q7",
            prompt: "There are ___ chairs in the room.",
            options: ["much", "many"],
            correctIndex: 1,
            explanation: "Chairs are countable plural, so many is correct.",
          },
          {
            id: "e1q8",
            prompt: "How ___ water do you drink every day?",
            options: ["much", "many"],
            correctIndex: 0,
            explanation: "Water is uncountable, so much is correct.",
          },
          {
            id: "e1q9",
            prompt: "We didn't see ___ cars there.",
            options: ["much", "many"],
            correctIndex: 1,
            explanation: "Cars are countable plural, so many is correct.",
          },
          {
            id: "e1q10",
            prompt: "There isn't ___ juice in the bottle.",
            options: ["much", "many"],
            correctIndex: 0,
            explanation: "Juice is uncountable, so much is correct.",
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
            prompt: "How ___ homework do you usually get after your English lesson?",
            options: ["much", "many"],
            correctIndex: 0,
            explanation: "Homework is uncountable, so much is correct.",
          },
          {
            id: "e2q2",
            prompt: "There are ___ pictures on the wall in our living room.",
            options: ["much", "many"],
            correctIndex: 1,
            explanation: "Pictures are countable plural, so many is correct.",
          },
          {
            id: "e2q3",
            prompt: "We don't need ___ sugar in this tea because it is already sweet.",
            options: ["much", "many"],
            correctIndex: 0,
            explanation: "Sugar is uncountable, so much is correct.",
          },
          {
            id: "e2q4",
            prompt: "How ___ bananas do we need for the fruit salad today?",
            options: ["much", "many"],
            correctIndex: 1,
            explanation: "Bananas are countable plural, so many is correct.",
          },
          {
            id: "e2q5",
            prompt: "There isn't ___ time before the bus comes, so let's hurry.",
            options: ["much", "many"],
            correctIndex: 0,
            explanation: "Time is uncountable here, so much is correct.",
          },
          {
            id: "e2q6",
            prompt: "I don't know ___ people in this town because I'm new here.",
            options: ["much", "many"],
            correctIndex: 1,
            explanation: "People are countable plural, so many is correct.",
          },
          {
            id: "e2q7",
            prompt: "How ___ money do you have with you for the tickets today?",
            options: ["much", "many"],
            correctIndex: 0,
            explanation: "Money is uncountable, so much is correct.",
          },
          {
            id: "e2q8",
            prompt: "There were not ___ mistakes in his test, so he felt happy.",
            options: ["much", "many"],
            correctIndex: 1,
            explanation: "Mistakes are countable plural, so many is correct.",
          },
          {
            id: "e2q9",
            prompt: "We haven't got ___ cheese, but we still have some butter in the fridge.",
            options: ["much", "many"],
            correctIndex: 0,
            explanation: "Cheese is uncountable, so much is correct.",
          },
          {
            id: "e2q10",
            prompt: "How ___ lessons do you have on Monday at school?",
            options: ["much", "many"],
            correctIndex: 1,
            explanation: "Lessons are countable plural, so many is correct.",
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
            prompt: "We don't have ___ information about the museum, so let's check the website first.",
            options: ["much", "many"],
            correctIndex: 0,
            explanation: "Information is uncountable, so much is correct.",
          },
          {
            id: "e3q2",
            prompt: "How ___ emails do you usually get in the morning before work starts?",
            options: ["much", "many"],
            correctIndex: 1,
            explanation: "Emails are countable plural, so many is correct.",
          },
          {
            id: "e3q3",
            prompt: "There isn't ___ food in the kitchen, so we need to go shopping after class.",
            options: ["much", "many"],
            correctIndex: 0,
            explanation: "Food is uncountable, so much is correct.",
          },
          {
            id: "e3q4",
            prompt: "There are ___ children in the park because the weather is warm and sunny today.",
            options: ["much", "many"],
            correctIndex: 1,
            explanation: "Children are countable plural, so many is correct.",
          },
          {
            id: "e3q5",
            prompt: "I didn't spend ___ money in the shop because I only bought bread and milk.",
            options: ["much", "many"],
            correctIndex: 0,
            explanation: "Money is uncountable, so much is correct.",
          },
          {
            id: "e3q6",
            prompt: "How ___ countries would you like to visit before you are thirty?",
            options: ["much", "many"],
            correctIndex: 1,
            explanation: "Countries are countable plural, so many is correct.",
          },
          {
            id: "e3q7",
            prompt: "We need ___ water, but we don't need ___ bottles because we already have enough at home.",
            options: ["much / many", "many / much", "much / much", "many / many"],
            correctIndex: 0,
            explanation: "Water is uncountable, so much. Bottles are countable plural, so many.",
          },
          {
            id: "e3q8",
            prompt: "There weren't ___ buses after ten o'clock, so we walked home together.",
            options: ["much", "many"],
            correctIndex: 1,
            explanation: "Buses are countable plural, so many is correct.",
          },
          {
            id: "e3q9",
            prompt: "How ___ sleep do you get when you have a lot of homework to do?",
            options: ["much", "many"],
            correctIndex: 0,
            explanation: "Sleep is uncountable, so much is correct.",
          },
          {
            id: "e3q10",
            prompt: "There are ___ shops near our house, but there isn't ___ parking space for visitors.",
            options: ["many / much", "much / many"],
            correctIndex: 0,
            explanation: "Shops are countable plural, so many. Parking space is uncountable here, so much.",
          },
        ],
      },

      4: {
        type: "input",
        title: "Exercise 4 (A Little Harder) — Type the missing answer",
        instructions: "Write the missing answer exactly: much or many.",
        questions: [
          {
            id: "e4q1",
            prompt: "How _____ time do we have before the lesson starts?",
            correct: "much",
            explanation: "Time is uncountable, so much is correct.",
          },
          {
            id: "e4q2",
            prompt: "There are not _____ students in the library this afternoon.",
            correct: "many",
            explanation: "Students are countable plural, so many is correct.",
          },
          {
            id: "e4q3",
            prompt: "We haven't got _____ milk, so I'll buy some on the way home.",
            correct: "much",
            explanation: "Milk is uncountable, so much is correct.",
          },
          {
            id: "e4q4",
            prompt: "How _____ photos did you take during your trip to Kraków?",
            correct: "many",
            explanation: "Photos are countable plural, so many is correct.",
          },
          {
            id: "e4q5",
            prompt: "I don't eat _____ chocolate because I prefer fruit.",
            correct: "much",
            explanation: "Chocolate is uncountable here, so much is correct.",
          },
          {
            id: "e4q6",
            prompt: "There were _____ people at the concert, so it was hard to find our friends.",
            correct: "many",
            explanation: "People are countable plural, so many is correct.",
          },
          {
            id: "e4q7",
            prompt: "How _____ homework do you usually have on Fridays?",
            correct: "much",
            explanation: "Homework is uncountable, so much is correct.",
          },
          {
            id: "e4q8",
            prompt: "We don't need _____ plates because only four people are coming.",
            correct: "many",
            explanation: "Plates are countable plural, so many is correct.",
          },
          {
            id: "e4q9",
            prompt: "There isn't _____ cheese left, so the pizza will be very small.",
            correct: "much",
            explanation: "Cheese is uncountable, so much is correct.",
          },
          {
            id: "e4q10",
            prompt: "How _____ languages would you like to learn in the future?",
            correct: "many",
            explanation: "Languages are countable plural, so many is correct.",
          },
        ],
      },
    };
  }, []);

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
        title: "Much / Many",
        subtitle: "Countable & Uncountable Nouns — 4 exercises + answer key",
        level: "A1",
        keyRule: "Use MANY with countable plural nouns. Use MUCH with uncountable nouns. Both are common in questions and negatives.",
        exercises: [
          {
            number: 1, title: "Exercise 1", difficulty: "Easy",
            instruction: "Choose much or many.",
            questions: [
              "How ___ apples are in the bowl?",
              "How ___ milk is there in the fridge?",
              "There aren't ___ students in class today.",
              "We don't have ___ bread left.",
              "How ___ books do you have?",
              "I don't drink ___ coffee in the evening.",
              "There are ___ chairs in the room.",
              "How ___ water do you drink every day?",
              "We didn't see ___ cars there.",
              "There isn't ___ juice in the bottle.",
            ],
            hint: "much / many",
          },
          {
            number: 2, title: "Exercise 2", difficulty: "Easy",
            instruction: "Choose much or many.",
            questions: [
              "How ___ homework do you usually get?",
              "There are ___ pictures on the wall.",
              "We don't need ___ sugar in this tea.",
              "How ___ bananas do we need for the salad?",
              "There isn't ___ time before the bus comes.",
              "I don't know ___ people in this town.",
              "How ___ money do you have with you?",
              "There were not ___ mistakes in his test.",
              "We haven't got ___ cheese in the fridge.",
              "How ___ lessons do you have on Monday?",
            ],
            hint: "much / many",
          },
          {
            number: 3, title: "Exercise 3", difficulty: "Medium",
            instruction: "Choose much or many.",
            questions: [
              "We don't have ___ information about the museum.",
              "How ___ emails do you usually get in the morning?",
              "There isn't ___ food in the kitchen.",
              "There are ___ children in the park today.",
              "I didn't spend ___ money in the shop.",
              "How ___ countries would you like to visit?",
              "How ___ sleep do you get with a lot of homework?",
              "There weren't ___ buses after ten o'clock.",
              "How ___ languages would you like to learn?",
              "We need ___ water for the trip.",
            ],
            hint: "much / many",
          },
          {
            number: 4, title: "Exercise 4", difficulty: "Hard",
            instruction: "Write much or many.",
            questions: [
              "How ___ time do we have before the lesson?",
              "There are not ___ students in the library.",
              "We haven't got ___ milk, so I'll buy some.",
              "How ___ photos did you take on your trip?",
              "I don't eat ___ chocolate — I prefer fruit.",
              "There were ___ people at the concert.",
              "How ___ homework do you usually have on Fridays?",
              "We don't need ___ plates — only four people are coming.",
              "There isn't ___ cheese left for the pizza.",
              "How ___ languages would you like to learn?",
            ],
          },
        ],
        answerKey: [
          { exercise: 1, subtitle: "Easy — much or many", answers: ["many","much","many","much","many","much","many","much","many","much"] },
          { exercise: 2, subtitle: "Easy — much or many", answers: ["much","many","much","many","much","many","much","many","much","many"] },
          { exercise: 3, subtitle: "Medium — much or many", answers: ["much","many","much","many","much","many","much","many","many","much"] },
          { exercise: 4, subtitle: "Hard — write much or many", answers: ["much","many","much","many","much","many","much","many","much","many"] },
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
        <span className="text-slate-700 font-medium">Much / Many</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Much / Many <span className="font-extrabold">— A1 grammar exercises</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Practise much and many with easy A1 grammar explanations and step-by-step exercises. Learn how to use much with uncountable nouns and many with countable plural nouns.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="">
            <SpeedRound gameId="grammar-a1-much-many" subject="Much / Many" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          href="/grammar/a1/adverbs-frequency"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: Adverbs of frequency →
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
        <h2 className="text-2xl font-black text-slate-900">Much / Many</h2>
        <p className="mt-2 text-slate-600 text-sm">
          Use <b>many</b> with countable plural nouns and <b>much</b> with uncountable nouns. Both are most common in <b>questions</b> and <b>negative sentences</b>.
        </p>
      </div>

      {/* 2 gradient cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* MANY */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5 space-y-3">
          <div className="text-xs font-black uppercase tracking-wide text-emerald-700">MANY — countable nouns</div>
          <Formula parts={[{ text: "many", color: "green" }, { dim: true, text: "+" }, { text: "countable plural noun", color: "slate" }]} />
          <div className="space-y-2 pt-1">
            <Ex en="How many books do you have?" />
            <Ex en="There aren't many people here." />
            <Ex en="Many students study English." />
          </div>
        </div>

        {/* MUCH */}
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50 to-white p-5 space-y-3">
          <div className="text-xs font-black uppercase tracking-wide text-sky-700">MUCH — uncountable nouns</div>
          <Formula parts={[{ text: "much", color: "sky" }, { dim: true, text: "+" }, { text: "uncountable noun", color: "slate" }]} />
          <div className="space-y-2 pt-1">
            <Ex en="How much water do you drink?" />
            <Ex en="I don't have much time." />
            <Ex en="There isn't much money left." />
          </div>
        </div>
      </div>

      {/* Reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-black text-white shrink-0">!</span>
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Reference table — many vs much</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="pb-2 text-left font-black text-slate-700 pr-4">Noun type</th>
                <th className="pb-2 text-left font-black text-slate-700 pr-4">Use</th>
                <th className="pb-2 text-left font-black text-slate-700">Example sentences</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-slate-700">Countable plural</td>
                <td className="py-2.5 pr-4 font-black text-emerald-700">many</td>
                <td className="py-2.5 text-slate-800">many books · many people · many times</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-slate-700">Uncountable</td>
                <td className="py-2.5 pr-4 font-black text-sky-700">much</td>
                <td className="py-2.5 text-slate-800">much water · much time · much money</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-semibold text-slate-700">Both</td>
                <td className="py-2.5 pr-4 font-black text-violet-700">a lot of</td>
                <td className="py-2.5 text-slate-800">a lot of books · a lot of water (positive sentences)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* A lot of card */}
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-wide text-violet-700">A lot of — used with BOTH countable &amp; uncountable</div>
        <p className="text-sm text-slate-600">In positive sentences, <b>a lot of</b> is more natural than much/many:</p>
        <div className="space-y-2">
          <Ex en="I have a lot of books." />
          <Ex en="She drinks a lot of water." />
        </div>
        <p className="text-xs text-slate-500 pt-1">Use <b>much / many</b> mostly in questions and negatives — <i>How much? / How many? / I don&apos;t have many…</i></p>
      </div>

      {/* Correction examples */}
      <div className="rounded-2xl border border-red-200 bg-gradient-to-b from-red-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-wide text-red-600">Common mistakes — fix these!</div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Ex en="much books" correct={false} />
          <Ex en="many books" correct={true} />
          <Ex en="many water" correct={false} />
          <Ex en="much water" correct={true} />
          <Ex en="How many homework?" correct={false} />
          <Ex en="How much homework?" correct={true} />
          <Ex en="How much chairs?" correct={false} />
          <Ex en="How many chairs?" correct={true} />
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Remember!</span> <b>How much?</b> goes with uncountable nouns (water, time, money). <b>How many?</b> goes with countable nouns (books, chairs, people). Never mix them!
      </div>
    </div>
  );
}