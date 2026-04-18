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
  { q: "___ is my book. (near, one)", options: ["That","These","This","Those"], answer: 2 },
  { q: "___ are my keys. (near, plural)", options: ["This","That","Those","These"], answer: 3 },
  { q: "___ is a nice car. (far, one)", options: ["This","These","That","Those"], answer: 2 },
  { q: "___ are my friends. (far, plural)", options: ["This","That","These","Those"], answer: 3 },
  { q: "Is ___ your pen? (near, one)", options: ["that","these","this","those"], answer: 2 },
  { q: "___ shoes are too small. (near, plural)", options: ["This","That","Those","These"], answer: 3 },
  { q: "Who is ___? (far, one person)", options: ["these","those","this","that"], answer: 3 },
  { q: "Are ___ your glasses? (far, plural)", options: ["this","that","these","those"], answer: 3 },
  { q: "___ is a beautiful city! (near)", options: ["That","These","This","Those"], answer: 2 },
  { q: "I like ___ dress over there.", options: ["this","these","that","those"], answer: 2 },
  { q: "___ flowers are for you. (I'm holding them)", options: ["That","These","This","Those"], answer: 1 },
  { q: "Look at ___ mountains! (far away)", options: ["this","these","those","that"], answer: 2 },
  { q: "___ is my stop. (the bus stop coming up)", options: ["That","These","Those","This"], answer: 0 },
  { q: "Can you pass me ___ salt? (near)", options: ["those","that","these","this"], answer: 3 },
  { q: "___ were the best days of my life. (past)", options: ["This","That","These","Those"], answer: 3 },
  { q: "___ bag is very heavy. (you are holding it)", options: ["That","These","This","Those"], answer: 2 },
  { q: "Do you know ___ people over there?", options: ["this","that","these","those"], answer: 3 },
  { q: "___ is interesting! (something you just heard)", options: ["That","These","Those","This"], answer: 0 },
  { q: "___ apples look delicious. (on the table in front)", options: ["That","This","These","Those"], answer: 2 },
  { q: "I don't like ___ colour. (pointing to something far)", options: ["this","these","those","that"], answer: 3 },
];

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Plural Nouns", href: "/grammar/a1/plural-nouns", img: "/topics/a1/plural-nouns.jpg", level: "A1", badge: "bg-emerald-500", reason: "These/those use plurals" },
  { title: "Subject Pronouns", href: "/grammar/a1/subject-pronouns", img: "/topics/a1/subject-pronouns.jpg", level: "A1", badge: "bg-emerald-500" },
  { title: "Articles: a / an", href: "/grammar/a1/articles-a-an", img: "/topics/a1/articles-a-an.jpg", level: "A1", badge: "bg-emerald-500" },
];

export default function ThisThatTheseThoseLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      // EX 1: MCQ - choose this/that/these/those
      1: {
        type: "mcq",
        title: "Exercise 1 (Easy) — Choose this, that, these, or those",
        instructions: "Choose the correct word: this, that, these, or those.",
        questions: [
          {
            id: "e1q1",
            prompt: "___ book on my desk is very interesting.",
            options: ["this", "that", "these", "those"],
            correctIndex: 0,
            explanation: "We use 'this' for singular and near. The book is on my desk (near).",
          },
          {
            id: "e1q2",
            prompt: "___ girl over there is my cousin.",
            options: ["this", "that", "these", "those"],
            correctIndex: 1,
            explanation: "We use 'that' for singular and far. The girl is over there (far).",
          },
          {
            id: "e1q3",
            prompt: "___ shoes next to my chair are new.",
            options: ["this", "that", "these", "those"],
            correctIndex: 2,
            explanation: "We use 'these' for plural and near. The shoes are next to me (near and more than one).",
          },
          {
            id: "e1q4",
            prompt: "___ houses across the street are very old.",
            options: ["this", "that", "these", "those"],
            correctIndex: 3,
            explanation: "We use 'those' for plural and far. The houses are across the street (far and more than one).",
          },
          {
            id: "e1q5",
            prompt: "___ sandwich in my hand is for you.",
            options: ["this", "that", "these", "those"],
            correctIndex: 0,
            explanation: "We use 'this' for one thing that is near (in my hand).",
          },
          {
            id: "e1q6",
            prompt: "___ car near the bus stop is my dad's.",
            options: ["this", "that", "these", "those"],
            correctIndex: 1,
            explanation: "We use 'that' for one thing that is not very close (near the bus stop, not with me).",
          },
          {
            id: "e1q7",
            prompt: "___ apples on the table are fresh.",
            options: ["this", "that", "these", "those"],
            correctIndex: 2,
            explanation: "We use 'these' for plural and near (apples are on the table, close to me).",
          },
          {
            id: "e1q8",
            prompt: "___ mountains in the distance look beautiful.",
            options: ["this", "that", "these", "those"],
            correctIndex: 3,
            explanation: "We use 'those' for plural and far (mountains in the distance).",
          },
          {
            id: "e1q9",
            prompt: "___ pen here is not working.",
            options: ["this", "that", "these", "those"],
            correctIndex: 0,
            explanation: "We use 'this' for singular and near (the pen is here, with me).",
          },
          {
            id: "e1q10",
            prompt: "___ people at the end of the street are waiting for the bus.",
            options: ["this", "that", "these", "those"],
            correctIndex: 3,
            explanation: "We use 'those' for plural and far (people at the end of the street).",
          },
        ],
      },
      // EX 2: input - write this/that/these/those
      2: {
        type: "input",
        title: "Exercise 2 (Medium) — Type the missing word",
        instructions: "Write this, that, these, or those. (One word, no punctuation needed.)",
        questions: [
          {
            id: "e2q1",
            prompt: "___ dog next to me is very friendly.",
            correct: "this",
            explanation: "'This' is for one thing near you (the dog is next to me).",
          },
          {
            id: "e2q2",
            prompt: "___ chairs by the window are comfortable.",
            correct: "these",
            explanation: "'These' is for more than one thing near you (chairs by the window).",
          },
          {
            id: "e2q3",
            prompt: "___ man over there is my teacher.",
            correct: "that",
            explanation: "'That' is for one thing far from you (man over there).",
          },
          {
            id: "e2q4",
            prompt: "___ oranges in my bag are sweet.",
            correct: "these",
            explanation: "'These' is for more than one thing near you (oranges in my bag).",
          },
          {
            id: "e2q5",
            prompt: "___ building on the hill is a museum.",
            correct: "that",
            explanation: "'That' is for one thing far from you (building on the hill).",
          },
          {
            id: "e2q6",
            prompt: "___ shoes on my feet are new.",
            correct: "these",
            explanation: "'These' is for plural and near (on my feet).",
          },
          {
            id: "e2q7",
            prompt: "___ picture on the wall is my family.",
            correct: "that",
            explanation: "'That' is for singular and far (on the wall, not with me).",
          },
          {
            id: "e2q8",
            prompt: "___ cookies here are for you.",
            correct: "these",
            explanation: "'These' is for plural and near (cookies here).",
          },
          {
            id: "e2q9",
            prompt: "___ boys in the park are my friends.",
            correct: "those",
            explanation: "'Those' is for plural and far (boys in the park).",
          },
          {
            id: "e2q10",
            prompt: "___ cup next to me is mine.",
            correct: "this",
            explanation: "'This' is for singular and near (the cup is close to the speaker).",
          },
        ],
      },
      // EX 3: MCQ - mix singular/plural and near/far
      3: {
        type: "mcq",
        title: "Exercise 3 (Hard) — Mixed practice",
        instructions: "Choose the correct word: this, that, these, or those.",
        questions: [
          {
            id: "e3q1",
            prompt: "___ pencils on my desk are blue.",
            options: ["this", "that", "these", "those"],
            correctIndex: 2,
            explanation: "'These' for plural and near (pencils on my desk).",
          },
          {
            id: "e3q2",
            prompt: "___ tree in the garden is very tall.",
            options: ["this", "that", "these", "those"],
            correctIndex: 1,
            explanation: "'That' for singular and far (tree in the garden, not with me).",
          },
          {
            id: "e3q3",
            prompt: "___ children at the playground are happy.",
            options: ["this", "that", "these", "those"],
            correctIndex: 3,
            explanation: "'Those' for plural and far (children at the playground).",
          },
          {
            id: "e3q4",
            prompt: "___ phone in my pocket is new.",
            options: ["this", "that", "these", "those"],
            correctIndex: 0,
            explanation: "'This' for singular and near (phone in my pocket).",
          },
          {
            id: "e3q5",
            prompt: "___ bags on the floor are heavy.",
            options: ["this", "that", "these", "those"],
            correctIndex: 2,
            explanation: "'These' for plural and near (bags on the floor, close to me).",
          },
          {
            id: "e3q6",
            prompt: "___ cat on the roof is black.",
            options: ["this", "that", "these", "those"],
            correctIndex: 1,
            explanation: "'That' for singular and far (cat on the roof).",
          },
          {
            id: "e3q7",
            prompt: "___ hats on the shelf are expensive.",
            options: ["this", "that", "these", "those"],
            correctIndex: 3,
            explanation: "'Those' for plural and far (hats on the shelf, not with me).",
          },
          {
            id: "e3q8",
            prompt: "___ cake here is delicious.",
            options: ["this", "that", "these", "those"],
            correctIndex: 0,
            explanation: "'This' for singular and near (cake here).",
          },
          {
            id: "e3q9",
            prompt: "___ students in the next classroom are noisy.",
            options: ["this", "that", "these", "those"],
            correctIndex: 3,
            explanation: "'Those' for plural and far (students in the next classroom).",
          },
          {
            id: "e3q10",
            prompt: "___ glass of water in front of me is cold.",
            options: ["this", "that", "these", "those"],
            correctIndex: 0,
            explanation: "'This' for singular and near (glass of water in front of me).",
          },
        ],
      },
      // EX 4: input - complete sentences
      4: {
        type: "input",
        title: "Exercise 4 (Harder) — Complete the sentences",
        instructions: "Write this, that, these, or those to complete the sentence.",
        questions: [
          {
            id: "e4q1",
            prompt: "Can you pass me ___ notebook on the table?",
            correct: "that",
            explanation: "'That' for singular and a bit far (notebook on the table).",
          },
          {
            id: "e4q2",
            prompt: "___ flowers in your hand are beautiful.",
            correct: "these",
            explanation: "'These' for plural and near (flowers in your hand).",
          },
          {
            id: "e4q3",
            prompt: "___ boy here is my brother.",
            correct: "this",
            explanation: "'This' for singular and near (boy here).",
          },
          {
            id: "e4q4",
            prompt: "___ birds in the sky are flying south.",
            correct: "those",
            explanation: "'Those' for plural and far (birds in the sky).",
          },
          {
            id: "e4q5",
            prompt: "___ keys on the table belong to you.",
            correct: "those",
            explanation: "'Those' for plural and a bit far (keys on the table).",
          },
          {
            id: "e4q6",
            prompt: "___ pizza in front of us smells great.",
            correct: "this",
            explanation: "'This' for singular and near (pizza in front of us).",
          },
          {
            id: "e4q7",
            prompt: "___ jackets over there are mine.",
            correct: "those",
            explanation: "'Those' for plural and far (jackets over there).",
          },
          {
            id: "e4q8",
            prompt: "___ cake on my plate is chocolate.",
            correct: "this",
            explanation: "'This' for singular and near (cake on my plate).",
          },
          {
            id: "e4q9",
            prompt: "___ glasses in the cupboard are clean.",
            correct: "those",
            explanation: "'Those' for plural and far (glasses in the cupboard).",
          },
          {
            id: "e4q10",
            prompt: "___ children next to me are my cousins.",
            correct: "these",
            explanation: "'These' for plural and near (children next to me).",
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

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const config: LessonPDFConfig = {
        title: "This / That / These / Those",
        subtitle: "Demonstrative Pronouns — 4 exercises + answer key",
        level: "A1",
        keyRule: "Near + singular → this · Near + plural → these · Far + singular → that · Far + plural → those",
        exercises: [
          {
            number: 1,
            title: "Exercise 1",
            difficulty: "Easy",
            instruction: "Choose this, that, these, or those.",
            questions: [
              "___ book on my desk is very interesting.",
              "___ girl over there is my cousin.",
              "___ shoes next to my chair are new.",
              "___ houses across the street are very old.",
              "___ sandwich in my hand is for you.",
              "___ car near the bus stop is my dad's.",
              "___ apples on the table are fresh.",
              "___ mountains in the distance look beautiful.",
              "___ pen here is not working.",
              "___ people at the end of the street are waiting for the bus.",
            ],
            hint: "this / that / these / those / this / that / these / those / this / those",
          },
          {
            number: 2,
            title: "Exercise 2",
            difficulty: "Medium",
            instruction: "Write this, that, these, or those.",
            questions: [
              "___ dog next to me is very friendly.",
              "___ chairs by the window are comfortable.",
              "___ man over there is my teacher.",
              "___ oranges in my bag are sweet.",
              "___ building on the hill is a museum.",
              "___ shoes on my feet are new.",
              "___ picture on the wall is my family.",
              "___ cookies here are for you.",
              "___ boys in the park are my friends.",
              "___ cup next to me is mine.",
            ],
          },
          {
            number: 3,
            title: "Exercise 3",
            difficulty: "Hard",
            instruction: "Choose this, that, these, or those.",
            questions: [
              "___ pencils on my desk are blue.",
              "___ tree in the garden is very tall.",
              "___ children at the playground are happy.",
              "___ phone in my pocket is new.",
              "___ bags on the floor are heavy.",
              "___ cat on the roof is black.",
              "___ hats on the shelf are expensive.",
              "___ cake here is delicious.",
              "___ students in the next classroom are noisy.",
              "___ glass of water in front of me is cold.",
            ],
            hint: "these / that / those / this / these / that / those / this / those / this",
          },
          {
            number: 4,
            title: "Exercise 4",
            difficulty: "Harder",
            instruction: "Write this, that, these, or those to complete the sentence.",
            questions: [
              "Can you pass me ___ notebook on the table?",
              "___ flowers in your hand are beautiful.",
              "___ boy here is my brother.",
              "___ birds in the sky are flying south.",
              "___ keys on the table belong to you.",
              "___ pizza in front of us smells great.",
              "___ jackets over there are mine.",
              "___ cake on my plate is chocolate.",
              "___ glasses in the cupboard are clean.",
              "___ children next to me are my cousins.",
            ],
          },
        ],
        answerKey: [
          {
            exercise: 1,
            subtitle: "Easy — choose this/that/these/those",
            answers: ["This", "That", "These", "Those", "This", "That", "These", "Those", "This", "Those"],
          },
          {
            exercise: 2,
            subtitle: "Medium — type this/that/these/those",
            answers: ["This", "These", "That", "These", "That", "These", "That", "These", "Those", "This"],
          },
          {
            exercise: 3,
            subtitle: "Hard — mixed practice",
            answers: ["These", "That", "Those", "This", "These", "That", "Those", "This", "Those", "This"],
          },
          {
            exercise: 4,
            subtitle: "Harder — complete the sentences",
            answers: ["that", "These", "This", "Those", "Those", "This", "Those", "This", "Those", "These"],
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

  return (
    <div className="relative min-h-screen w-full">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FFF7D9] via-white to-white" />
      <div className="pointer-events-none absolute -top-28 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#F5DA20]/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a1">Grammar A1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">This / That / These / Those</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          This / That / These / Those <span className="font-extrabold">— basics</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Use <b>this</b>, <b>that</b>, <b>these</b>, and <b>those</b> to point to people or things near or far, singular or plural. Practice with 4 graded exercises.
      </p>

      {/* Layout: left ad/game + center content + right ad/recommendations */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="">
            <SpeedRound gameId="grammar-a1-this-that-these-those" subject="This / That / These / Those" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <AdUnit variant="sidebar-dark" />

        )}
      </div>

      {/* SpeedRound below grid for non-PRO users */}
      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-a1-this-that-these-those" subject="This / That / These / Those" questions={SPEED_QUESTIONS} />
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
          href="/grammar/a1/present-simple-i-you-we-they"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: Present Simple (I/you/we/they) →
        </a>
      </div>
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
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">This / That / These / Those</h2>
        <p className="text-slate-500 text-sm">Point to people or things near or far, singular or plural.</p>
      </div>

      {/* 2x2 grid cards */}
      <div className="grid gap-4 grid-cols-2">
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">👆</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">THIS</span>
          </div>
          <Formula parts={[{ text: "NEAR", color: "sky" }, { dim: true }, { text: "SINGULAR", color: "slate" }]} />
          <div className="mt-3 space-y-2">
            <Ex en="This apple is sweet." />
            <Ex en="This is my friend." />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-b from-violet-50 to-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">👉</span>
            <span className="text-sm font-black text-violet-700 uppercase tracking-widest">THAT</span>
          </div>
          <Formula parts={[{ text: "FAR", color: "violet" }, { dim: true }, { text: "SINGULAR", color: "slate" }]} />
          <div className="mt-3 space-y-2">
            <Ex en="That car is fast." />
            <Ex en="What is that?" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">☝️</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">THESE</span>
          </div>
          <Formula parts={[{ text: "NEAR", color: "sky" }, { dim: true }, { text: "PLURAL", color: "green" }]} />
          <div className="mt-3 space-y-2">
            <Ex en="These books are mine." />
            <Ex en="These are my keys." />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🫳</span>
            <span className="text-sm font-black text-amber-700 uppercase tracking-widest">THOSE</span>
          </div>
          <Formula parts={[{ text: "FAR", color: "violet" }, { dim: true }, { text: "PLURAL", color: "green" }]} />
          <div className="mt-3 space-y-2">
            <Ex en="Those birds are loud." />
            <Ex en="Who are those people?" />
          </div>
        </div>
      </div>

      {/* Distance table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Distance × Number — 2×2 table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead>
              <tr className="border-b border-black/10">
                <th className="py-2 pr-4 text-left font-black text-slate-500"></th>
                <th className="py-2 pr-4 font-black text-sky-700">NEAR</th>
                <th className="py-2 font-black text-violet-700">FAR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr>
                <td className="py-3 pr-4 text-left font-black text-slate-700">Singular</td>
                <td className="py-3 pr-4 font-black text-sky-700 text-lg">this</td>
                <td className="py-3 font-black text-violet-700 text-lg">that</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-left font-black text-slate-700">Plural</td>
                <td className="py-3 pr-4 font-black text-emerald-700 text-lg">these</td>
                <td className="py-3 font-black text-amber-700 text-lg">those</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjective AND pronoun */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Used as adjectives AND pronouns</h3>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">As adjective (before noun)</p>
            <div className="space-y-2">
              <Ex en="This book is mine." />
              <Ex en="These shoes are new." />
            </div>
          </div>
          <div>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">As pronoun (alone)</p>
            <div className="space-y-2">
              <Ex en="This is my book." />
              <Ex en="These are my shoes." />
            </div>
          </div>
        </div>
      </div>

      {/* Wrong vs right */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Wrong</p>
          <Ex en="These is my keys." correct={false} />
          <Ex en="This are my friends." correct={false} />
          <Ex en="Those chair is comfortable." correct={false} />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-1">Correct</p>
          <Ex en="These are my keys." />
          <Ex en="These are my friends." />
          <Ex en="That chair is comfortable." />
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <b>⚠ Key point:</b> Use &quot;This is&quot; / &quot;That is&quot; for introductions — &quot;This is my friend Tom.&quot; Never &quot;These is&quot; or &quot;Those is&quot; — those are always wrong!
      </div>
    </div>
  );
}