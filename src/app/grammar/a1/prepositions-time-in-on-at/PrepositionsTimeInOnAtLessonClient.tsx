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
  { q: "I wake up ___ 7 o'clock every morning.", options: ["in","on","at","for"], answer: 2 },
  { q: "She was born ___ Monday.", options: ["in","at","on","by"], answer: 2 },
  { q: "We go to school ___ September.", options: ["at","on","for","in"], answer: 3 },
  { q: "The party starts ___ midnight.", options: ["on","in","at","by"], answer: 2 },
  { q: "He always calls ___ Sundays.", options: ["in","at","for","on"], answer: 3 },
  { q: "I was born ___ 1995.", options: ["on","at","in","by"], answer: 2 },
  { q: "The meeting is ___ Tuesday morning.", options: ["in","at","by","on"], answer: 3 },
  { q: "They go on holiday ___ summer.", options: ["at","on","in","by"], answer: 2 },
  { q: "The class starts ___ 9 am.", options: ["on","in","by","at"], answer: 3 },
  { q: "I watch films ___ the weekend.", options: ["in","at","on","by"], answer: 1 },
  { q: "She reads ___ the evening.", options: ["at","on","in","by"], answer: 2 },
  { q: "The shop closes ___ Christmas Day.", options: ["in","at","on","by"], answer: 2 },
  { q: "We eat dinner ___ 7 pm.", options: ["on","in","by","at"], answer: 3 },
  { q: "I started this job ___ January.", options: ["at","on","in","by"], answer: 2 },
  { q: "They met ___ Valentine's Day.", options: ["in","at","on","by"], answer: 2 },
  { q: "The museum opens ___ 10 o'clock.", options: ["on","in","by","at"], answer: 3 },
  { q: "I love skiing ___ winter.", options: ["at","on","in","by"], answer: 2 },
  { q: "She calls her mum ___ Sundays.", options: ["in","at","by","on"], answer: 3 },
  { q: "We always eat cake ___ New Year.", options: ["in","on","at","by"], answer: 2 },
  { q: "He studies English ___ the morning.", options: ["at","on","in","by"], answer: 2 },
];

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Prepositions of Place", href: "/grammar/a1/prepositions-place", img: "/topics/a1/prepositions-of-place.jpg", level: "A1", badge: "bg-emerald-500", reason: "Same prepositions, different use" },
  { title: "Adverbs of Frequency", href: "/grammar/a1/adverbs-frequency", img: "/topics/a1/adverbs-of-frequency.jpg", level: "A1", badge: "bg-emerald-500" },
  { title: "Present Simple (I/you/we/they)", href: "/grammar/a1/present-simple-i-you-we-they", img: "/topics/a1/present-simple-i-you-we-they.jpg", level: "A1", badge: "bg-emerald-500" },
];

export default function PrepositionsOfTimeLessonClient() {
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      1: {
        type: "mcq",
        title: "Exercise 1 (Easy) — Choose the correct preposition of time",
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
        title: "Exercise 2 (Medium) — Write the correct preposition of time",
        instructions: "Type the correct preposition of time in each blank.",
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
        title: "Exercise 3 (Harder) — Choose the correct preposition of time",
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
        instructions: "Write the correct preposition of time in the blank.",
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
        title: "Prepositions of Time",
        subtitle: "in / on / at — 4 exercises + answer key",
        level: "A1",
        keyRule: "AT + exact time (at 7 o'clock, at midnight). ON + days & dates (on Monday, on 5th May). IN + months, years, seasons, parts of day (in January, in 2020, in the morning).",
        exercises: [
          {
            number: 1, title: "Exercise 1", difficulty: "Easy",
            instruction: "Choose in, on, or at.",
            questions: [
              "I wake up ___ 7 o'clock every morning.",
              "She was born ___ Monday.",
              "We go back to school ___ September.",
              "The party starts ___ midnight.",
              "He calls his parents ___ Sundays.",
              "I was born ___ 1995.",
              "The meeting is ___ Tuesday morning.",
              "They always go on holiday ___ summer.",
              "The class starts ___ 9 am.",
              "I usually watch films ___ the weekend.",
            ],
            hint: "in / on / at",
          },
          {
            number: 2, title: "Exercise 2", difficulty: "Easy",
            instruction: "Choose in, on, or at.",
            questions: [
              "She loves reading ___ the evening.",
              "The shop closes ___ Christmas Day.",
              "We always have dinner ___ 7 pm.",
              "I started this new job ___ January.",
              "They first met ___ Valentine's Day.",
              "The museum opens ___ 10 o'clock.",
              "I love skiing ___ winter.",
              "She calls her mum ___ Sundays.",
              "We always eat cake ___ New Year.",
              "He studies English ___ the morning.",
            ],
            hint: "in / on / at",
          },
          {
            number: 3, title: "Exercise 3", difficulty: "Medium",
            instruction: "Choose in, on, or at.",
            questions: [
              "The film starts ___ half past eight.",
              "I usually go jogging ___ Saturday mornings.",
              "My birthday is ___ the 12th of April.",
              "We moved to London ___ 2018.",
              "She fell asleep ___ midnight.",
              "The concert is ___ Friday evening.",
              "I always feel tired ___ the afternoon.",
              "He graduated ___ June.",
              "We have English classes ___ Tuesdays and Thursdays.",
              "The temperature drops ___ night in winter.",
            ],
            hint: "in / on / at",
          },
          {
            number: 4, title: "Exercise 4", difficulty: "Hard",
            instruction: "Write in, on, or at.",
            questions: [
              "I go to the gym ___ Monday and Wednesday mornings.",
              "The New Year begins ___ midnight.",
              "She was born ___ a cold day ___ January.",
              "We visited Rome ___ the spring of 2022.",
              "The bus arrives ___ 8:15 every morning.",
              "I love going for walks ___ the evening.",
              "School starts again ___ the 5th of September.",
              "He phoned me ___ Saturday afternoon.",
              "They got married ___ summer, ___ a beautiful day.",
              "The shop is closed ___ Sundays.",
            ],
          },
        ],
        answerKey: [
          { exercise: 1, subtitle: "Easy — in/on/at", answers: ["at","on","in","at","on","in","on","in","at","at"] },
          { exercise: 2, subtitle: "Easy — in/on/at", answers: ["in","on","at","in","on","at","in","on","at","in"] },
          { exercise: 3, subtitle: "Medium — in/on/at", answers: ["at","on","on","in","at","on","in","in","on","at"] },
          { exercise: 4, subtitle: "Hard — write in/on/at", answers: ["on","at","on / in","in","at","in","on","on","in / on","on"] },
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
        <span className="text-slate-700 font-medium">Prepositions of time</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Prepositions of Time (A1) <span className="font-extrabold">— exercises & explanation</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Learn how to use <b>in, on, at</b> — the three most common prepositions of time. These words tell us <em>when</em> something happens: in the morning, on Monday, at 5 o&apos;clock.
      </p>

      {/* Layout: left col + center content + right col */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="">
            <SpeedRound gameId="grammar-a1-prepositions-time" subject="Prepositions of Time" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          href="/grammar/a1/some-any"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: Some / Any →
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
        <h2 className="text-2xl font-black text-slate-900">Prepositions of Time — in / on / at</h2>
        <p className="mt-2 text-slate-600 text-sm">
          Use <b>in</b>, <b>on</b>, and <b>at</b> to say <b>when</b> something happens. Each preposition covers a different type of time expression — and the rule is simple: think from small to large.
        </p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* AT */}
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50 to-white p-5 space-y-3">
          <div className="text-xs font-black uppercase tracking-wide text-sky-700">AT — specific times</div>
          <Formula parts={[{ text: "at", color: "sky" }, { dim: true, text: "+" }, { text: "exact time / special phrase", color: "slate" }]} />
          <div className="space-y-2 pt-1">
            <Ex en="The class starts at 7 o'clock." />
            <Ex en="I never sleep at midnight." />
            <Ex en="I relax at the weekend. (BrE)" />
          </div>
          <div className="text-xs text-slate-500 pt-1 space-y-0.5">
            <div className="font-semibold text-slate-600 mb-1">Use AT with:</div>
            <div>at 7 o'clock · at noon · at midnight</div>
            <div>at night · at the weekend (BrE)</div>
          </div>
        </div>

        {/* ON */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5 space-y-3">
          <div className="text-xs font-black uppercase tracking-wide text-emerald-700">ON — days and dates</div>
          <Formula parts={[{ text: "on", color: "green" }, { dim: true, text: "+" }, { text: "day / date / special day", color: "slate" }]} />
          <div className="space-y-2 pt-1">
            <Ex en="I go to the gym on Monday." />
            <Ex en="My birthday is on 5th June." />
            <Ex en="We rest on Christmas Day." />
          </div>
          <div className="text-xs text-slate-500 pt-1 space-y-0.5">
            <div className="font-semibold text-slate-600 mb-1">Use ON with:</div>
            <div>on Monday · on Friday evening</div>
            <div>on 5 March · on my birthday</div>
          </div>
        </div>

        {/* IN */}
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50 to-white p-5 space-y-3">
          <div className="text-xs font-black uppercase tracking-wide text-violet-700">IN — months, years, seasons</div>
          <Formula parts={[{ text: "in", color: "violet" }, { dim: true, text: "+" }, { text: "month / year / season / part of day", color: "slate" }]} />
          <div className="space-y-2 pt-1">
            <Ex en="I was born in January." />
            <Ex en="It was cold in 2024." />
            <Ex en="She drinks coffee in the morning." />
          </div>
          <div className="text-xs text-slate-500 pt-1 space-y-0.5">
            <div className="font-semibold text-slate-600 mb-1">Use IN with:</div>
            <div>in January · in 2024 · in summer</div>
            <div>in the morning / afternoon / evening</div>
          </div>
        </div>
      </div>

      {/* Reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-black text-white shrink-0">!</span>
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Reference table — at / on / in</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="pb-2 text-left font-black text-slate-700 pr-4">Preposition</th>
                <th className="pb-2 text-left font-black text-slate-700 pr-4">Used with</th>
                <th className="pb-2 text-left font-black text-slate-700">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr>
                <td className="py-2.5 pr-4 font-black text-sky-700">at</td>
                <td className="py-2.5 pr-4 text-slate-600">exact times, special phrases</td>
                <td className="py-2.5 text-slate-800">at 9 o'clock, at noon, at midnight, at night, at the weekend</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-black text-emerald-700">on</td>
                <td className="py-2.5 pr-4 text-slate-600">days, dates, special days</td>
                <td className="py-2.5 text-slate-800">on Monday, on 5th June, on my birthday, on Christmas Day</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-black text-violet-700">in</td>
                <td className="py-2.5 pr-4 text-slate-600">months, years, seasons, parts of day</td>
                <td className="py-2.5 text-slate-800">in January, in 2024, in summer, in the morning, in the evening</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Correction examples */}
      <div className="rounded-2xl border border-red-200 bg-gradient-to-b from-red-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-wide text-red-600">Common mistakes — fix these!</div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Ex en="in Monday" correct={false} />
          <Ex en="on Monday" correct={true} />
          <Ex en="on the morning" correct={false} />
          <Ex en="in the morning" correct={true} />
          <Ex en="at January" correct={false} />
          <Ex en="in January" correct={true} />
          <Ex en="in 7 o'clock" correct={false} />
          <Ex en="at 7 o'clock" correct={true} />
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Watch out!</span> We say <b>at night</b> (NOT <i>in the night</i>). Parts of the day use <b>in</b> — <i>in the morning, in the afternoon, in the evening</i> — but <b>noon</b> and <b>midnight</b> always take <b>at</b>: <i>at noon, at midnight</i>.
      </div>
    </div>
  );
}