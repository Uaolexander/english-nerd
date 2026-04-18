"use client";

import { useState, useEffect } from "react";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import VocabRecommendations from "@/components/VocabRecommendations";
import { useLiveSync } from "@/lib/useLiveSync";

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "What sound does a dog make?", options: ["Meow", "Moo", "Woof", "Roar"], answer: 2 },
  { q: "Where do fish live?", options: ["In trees", "In water", "In the sky", "Underground"], answer: 1 },
  { q: "Which animal can fly?", options: ["Dog", "Cat", "Horse", "Bird"], answer: 3 },
  { q: "What do rabbits eat?", options: ["Meat", "Fish", "Carrots", "Chocolate"], answer: 2 },
  { q: "How many legs does a dog have?", options: ["Two", "Four", "Six", "Eight"], answer: 1 },
  { q: "Which is the biggest land animal?", options: ["Cat", "Rabbit", "Elephant", "Bird"], answer: 2 },
  { q: "What do birds use to fly?", options: ["Legs", "Tail", "Fins", "Wings"], answer: 3 },
  { q: "What is a baby cat called?", options: ["Puppy", "Kitten", "Cub", "Chick"], answer: 1 },
  { q: "Which is the fastest land animal?", options: ["Turtle", "Snail", "Elephant", "Cheetah"], answer: 3 },
  { q: "What is a baby dog called?", options: ["Kitten", "Cub", "Puppy", "Chick"], answer: 2 },
  { q: "What part does an elephant have instead of a nose?", options: ["Fin", "Trunk", "Tail", "Wing"], answer: 1 },
  { q: "Which animal wags its tail when happy?", options: ["Fish", "Bird", "Dog", "Cat"], answer: 2 },
  { q: "What do bears love to eat?", options: ["Honey", "Pizza", "Bread", "Rice"], answer: 0 },
  { q: "Which word describes a lion?", options: ["Tiny", "Friendly", "Dangerous", "Slow"], answer: 2 },
  { q: "Fish use ___ to swim.", options: ["Legs", "Fins", "Wings", "Arms"], answer: 1 },
  { q: "Dolphins are very ___.", options: ["Boring", "Clever", "Slow", "Small"], answer: 1 },
  { q: "Which animal lives in the forest?", options: ["Dolphin", "Fish", "Bear", "Bird"], answer: 2 },
  { q: "Pet animals live ___.", options: ["In forests", "In water", "With people", "Underground"], answer: 2 },
  { q: "A cheetah can run at ___ km/h.", options: ["10", "50", "100", "200"], answer: 2 },
  { q: "Cats use their ___ to balance.", options: ["Wings", "Fins", "Tail", "Trunk"], answer: 2 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Animals Vocabulary",
  subtitle: "A1 vocabulary exercises — 3 activities + key words",
  level: "A1",
  keyRule: "Animals vocabulary: pet vs wild · body parts · actions",
  exercises: [
    {
      number: 1,
      title: "Exercise 1 — Multiple Choice",
      difficulty: "Easy",
      instruction: "Choose the correct answer (A, B, C or D).",
      questions: [
        "What sound does a dog make? (Meow / Moo / Woof / Roar)",
        "Where do fish live? (In trees / In water / In the sky / Underground)",
        "Which animal can fly? (Dog / Cat / Horse / Bird)",
        "What do rabbits eat? (Meat / Fish / Carrots and grass / Chocolate)",
        "How many legs does a dog have? (Two / Four / Six / Eight)",
        "Which animal is the biggest? (Cat / Rabbit / Elephant / Bird)",
        "What do birds use to fly? (Legs / Tail / Fins / Wings)",
        "What is a baby cat called? (Puppy / Kitten / Cub / Chick)",
        "Which animal is the fastest on land? (Turtle / Snail / Elephant / Cheetah)",
        "What is a baby dog called? (Kitten / Cub / Puppy / Chick)",
      ],
    },
    {
      number: 2,
      title: "Exercise 2 — Choose the Word",
      difficulty: "Easy",
      instruction: "Choose the word that fits each sentence.",
      questions: [
        "My dog loves to ___ in the park. (run / sleep / cook)",
        "Birds use their ___ to fly. (fins / wings / paws)",
        "Cats are popular ___ animals. (wild / pet / dangerous)",
        "Fish use their ___ to swim. (legs / fins / arms)",
        "A lion is very ___. (friendly / dangerous / tiny)",
        "Dogs wag their ___ when happy. (wings / trunk / tail)",
        "An elephant uses its long ___. (ear / trunk / leg)",
        "Dolphins are very ___. (boring / clever / slow)",
        "Bears love to eat ___. (honey / bread / soup)",
        "A horse is a very ___ animal. (tiny / useful / lazy)",
      ],
    },
    {
      number: 3,
      title: "Exercise 3 — Fill in the Blanks",
      difficulty: "Medium",
      instruction: "Use words from the box: fly / water / friendly / forest / fast / eat / wild / trunk / swim / tail",
      questions: [
        "All animals need to ___ every day to survive.",
        "Fish live in ___. They cannot breathe air.",
        "Birds can ___ because they have wings.",
        "Dogs are very ___ — they love people.",
        "Bears and wolves live in the ___.",
        "A cheetah is very ___ — 100 km/h!",
        "Lions and tigers are ___ animals.",
        "An elephant's ___ is like a very long nose.",
        "Dolphins love to ___ in the ocean.",
        "A cat uses its ___ to keep balance.",
      ],
    },
    {
      number: 4,
      title: "Key Vocabulary",
      difficulty: "Reference",
      instruction: "Remember these animal words.",
      questions: [
        "wild — living in nature, not with people",
        "pet — an animal that lives with you at home",
        "trunk — an elephant's long nose",
        "fins — flat parts on a fish's body",
        "honey — a sweet food made by bees",
        "tail — the long part at the back of an animal",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Multiple Choice", answers: ["Woof", "In water", "Bird", "Carrots and grass", "Four", "Elephant", "Wings", "Kitten", "Cheetah", "Puppy"] },
    { exercise: 2, subtitle: "Choose the Word", answers: ["run", "wings", "pet", "fins", "dangerous", "tail", "trunk", "clever", "honey", "useful"] },
    { exercise: 3, subtitle: "Fill in the Blanks", answers: ["eat", "water", "fly", "friendly", "forest", "fast", "wild", "trunk", "swim", "tail"] },
    { exercise: 4, subtitle: "Key Words", answers: ["wild", "pet", "trunk", "fins", "honey", "tail"] },
  ],
};

// ── Exercise 1: ABCD Multiple Choice ────────────────────────────────────────

type MCQ = {
  id: number;
  question: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  explanation: string;
};

const EX1: MCQ[] = [
  { id: 1, question: "What sound does a dog make?", options: ["Meow", "Moo", "Woof", "Roar"], correct: 2, explanation: "Dogs say \"woof\". Cats say \"meow\", cows say \"moo\", and lions roar." },
  { id: 2, question: "Where do fish live?", options: ["In trees", "In water", "In the sky", "Underground"], correct: 1, explanation: "Fish live in water — in rivers, lakes, and the ocean." },
  { id: 3, question: "Which animal can fly?", options: ["Dog", "Cat", "Horse", "Bird"], correct: 3, explanation: "Birds have wings and can fly. Dogs, cats, and horses cannot fly." },
  { id: 4, question: "What do rabbits eat?", options: ["Meat", "Fish", "Carrots and grass", "Chocolate"], correct: 2, explanation: "Rabbits eat vegetables and grass. They love carrots!" },
  { id: 5, question: "How many legs does a dog have?", options: ["Two", "Four", "Six", "Eight"], correct: 1, explanation: "Dogs have four legs. Most mammals have four legs." },
  { id: 6, question: "Which animal is the biggest?", options: ["Cat", "Rabbit", "Elephant", "Bird"], correct: 2, explanation: "Elephants are the biggest land animals on Earth." },
  { id: 7, question: "What do birds use to fly?", options: ["Their legs", "Their tail", "Their fins", "Their wings"], correct: 3, explanation: "Birds use their wings to fly. Fish use fins to swim." },
  { id: 8, question: "What is a baby cat called?", options: ["A puppy", "A kitten", "A cub", "A chick"], correct: 1, explanation: "A baby cat is a kitten. A baby dog is a puppy." },
  { id: 9, question: "Which animal is the fastest on land?", options: ["Turtle", "Snail", "Elephant", "Cheetah"], correct: 3, explanation: "The cheetah is the fastest land animal — it can run 100 km/h!" },
  { id: 10, question: "What is a baby dog called?", options: ["A kitten", "A cub", "A puppy", "A chick"], correct: 2, explanation: "A baby dog is a puppy. A baby cat is a kitten." },
];

// ── Exercise 2: Choose the correct word ─────────────────────────────────────

type ChoiceQ = {
  id: number;
  before: string;
  after: string;
  options: string[];
  correct: string;
  explanation: string;
};

const EX2: ChoiceQ[] = [
  { id: 1, before: "My dog loves to", after: "in the park every morning.", options: ["run", "sleep", "cook"], correct: "run", explanation: "Dogs love to run and play. They need exercise every day." },
  { id: 2, before: "Birds use their", after: "to fly high in the sky.", options: ["fins", "wings", "paws"], correct: "wings", explanation: "Wings help birds fly. Fish use fins to swim." },
  { id: 3, before: "Cats are popular", after: "animals that live with people at home.", options: ["wild", "pet", "dangerous"], correct: "pet", explanation: "Pet animals live with people. Wild animals live in nature." },
  { id: 4, before: "Fish use their", after: "to swim through the water.", options: ["legs", "fins", "arms"], correct: "fins", explanation: "Fish have fins instead of legs. Fins help them move through the water." },
  { id: 5, before: "A lion is very", after: "— it hunts other animals for food.", options: ["friendly", "dangerous", "tiny"], correct: "dangerous", explanation: "Lions are dangerous wild animals. They are predators." },
  { id: 6, before: "Dogs wag their", after: "when they are happy.", options: ["wings", "trunk", "tail"], correct: "tail", explanation: "Dogs wag their tail when they are excited or happy." },
  { id: 7, before: "An elephant uses its long", after: "to pick up food and drink water.", options: ["ear", "trunk", "leg"], correct: "trunk", explanation: "An elephant's trunk is like a very long nose. It is very useful!" },
  { id: 8, before: "Dolphins are very", after: "— they can learn tricks quickly.", options: ["boring", "clever", "slow"], correct: "clever", explanation: "Dolphins are very intelligent animals. They can understand commands." },
  { id: 9, before: "Bears love to eat fish, berries, and", after: ". It is very sweet!", options: ["honey", "bread", "soup"], correct: "honey", explanation: "Bears love honey! They find it in beehives in the forest." },
  { id: 10, before: "A horse is a very", after: "animal — farmers and riders use it for work.", options: ["tiny", "useful", "lazy"], correct: "useful", explanation: "Horses are useful because people can ride them and they can do heavy work." },
];

// ── Exercise 3: Fill from the box ───────────────────────────────────────────

const WORD_BOX = ["fly", "water", "friendly", "forest", "fast", "eat", "wild", "trunk", "swim", "tail"];

type FillQ = {
  id: number;
  before: string;
  after: string;
  correct: string;
  explanation: string;
};

const EX3: FillQ[] = [
  { id: 1, before: "All animals need to", after: "every day to survive.", correct: "eat", explanation: "All living creatures need food to survive." },
  { id: 2, before: "Fish live in", after: ". They cannot breathe air.", correct: "water", explanation: "Fish breathe through their gills and must stay in water." },
  { id: 3, before: "Birds can", after: "because they have wings on their body.", correct: "fly", explanation: "Wings give birds the ability to fly through the air." },
  { id: 4, before: "Dogs are very", after: "— they love people and love to play.", correct: "friendly", explanation: "Dogs are known for being loyal and friendly to their owners." },
  { id: 5, before: "Bears and wolves live in the", after: ". They like trees and quiet places.", correct: "forest", explanation: "Forests provide food and shelter for many animals." },
  { id: 6, before: "A cheetah is very", after: ". It can run one hundred kilometres per hour!", correct: "fast", explanation: "The cheetah is the fastest land animal in the world." },
  { id: 7, before: "Lions and tigers are", after: "animals — they do not live with people.", correct: "wild", explanation: "Wild animals live in nature, not in people's homes." },
  { id: 8, before: "An elephant's", after: "is like a very long nose — it uses it to eat and drink.", correct: "trunk", explanation: "The trunk is one of the most unique features of an elephant." },
  { id: 9, before: "Dolphins love to", after: "and jump in the ocean all day.", correct: "swim", explanation: "Dolphins are excellent swimmers and love to play in the water." },
  { id: 10, before: "A cat uses its", after: "to keep balance when it walks on high places.", correct: "tail", explanation: "The tail helps cats balance, especially when climbing." },
];

// ── Vocabulary sidebar ───────────────────────────────────────────────────────

const VOCAB = [
  { word: "wild", pos: "adj.", def: "living in nature, not with people" },
  { word: "pet", pos: "n.", def: "an animal that lives with you at home" },
  { word: "trunk", pos: "n.", def: "an elephant's long nose" },
  { word: "fins", pos: "n.", def: "flat parts on a fish's body that help it swim" },
  { word: "honey", pos: "n.", def: "a sweet, sticky food made by bees" },
  { word: "tail", pos: "n.", def: "the long part at the back of an animal's body" },
];

const LABELS = ["A", "B", "C", "D"];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function AnimalsClient() {
  const isPro = useIsPro();
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [exNo, setExNo] = useState<1 | 2 | 3>(1);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [fillAnswers, setFillAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const { isLive, broadcast } = useLiveSync((payload) => {
    setAnswers(payload.answers as Record<number, string | null>);
    setFillAnswers((payload as unknown as { fillAnswers: Record<number, string> }).fillAnswers ?? {});
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3);
  });

  async function handlePDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(PDF_CONFIG); } finally { setPdfLoading(false); }
  }

  const questions = exNo === 1 ? EX1 : exNo === 2 ? EX2 : EX3;
  const total = questions.length;

  const answeredCount = exNo === 3
    ? EX3.filter((q) => (fillAnswers[q.id] ?? "").trim() !== "").length
    : EX1.filter((q) => answers[q.id] != null).length;

  const allAnswered = answeredCount === total;

  const correctCount = checked
    ? exNo === 1
      ? EX1.reduce((n, q) => n + (answers[q.id] === String(q.correct) ? 1 : 0), 0)
      : exNo === 2
      ? EX2.reduce((n, q) => n + (answers[q.id] === q.correct ? 1 : 0), 0)
      : EX3.reduce((n, q) => n + (normalize(fillAnswers[q.id] ?? "") === normalize(q.correct) ? 1 : 0), 0)
    : null;

  const percent = correctCount !== null ? Math.round((correctCount / total) * 100) : null;
  const grade = percent === null ? null : percent >= 80 ? "great" : percent >= 60 ? "ok" : "low";

  function switchEx(n: 1 | 2 | 3) {
    setExNo(n);
    setAnswers({});
    setFillAnswers({});
    setChecked(false);
    broadcast({ answers: {}, checked: false, exNo: n });
  }

  function check() {
    if (!allAnswered) return;
    setChecked(true);
    broadcast({ answers, checked: true, exNo });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setAnswers({});
    setFillAnswers({});
    setChecked(false);
    broadcast({ answers: {}, checked: false, exNo });
  }

  useEffect(() => {
    if (!checked || percent === null) return;
    fetch("/api/progress/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "vocabulary", level: "a1", slug: "animals", exerciseNo: exNo, score: percent, questionsTotal: total }),
    }).catch(() => {});
  }, [checked, percent]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        {[["Home", "/"], ["Vocabulary", "/vocabulary"], ["A1", "/vocabulary/a1"]].map(([label, href]) => (
          <span key={href} className="flex items-center gap-1.5">
            <a href={href} className="hover:text-slate-700 transition">{label}</a>
            <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </span>
        ))}
        <span className="text-slate-700 font-medium">Animals</span>
      </nav>

      {/* Hero */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="rounded-full bg-[#F5DA20] px-3 py-0.5 text-[11px] font-black text-black">A1</span>
          <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Vocabulary</span>
          <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">3 exercises · 10 questions each</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.05]">
          <span className="relative inline-block">
            Animals
            <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/60" />
          </span>
        </h1>
        <p className="mt-3 max-w-xl text-[15px] text-slate-500 leading-relaxed">
          Learn animal vocabulary with three different activities. Each exercise uses the same words — so the more you practise, the better you remember!
        </p>
      </div>

      {/* 3-col grid */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

        {/* Left column */}
        {isPro ? (
          <div className=""><SpeedRound gameId="vocab-animals" subject="Animals Vocabulary" questions={SPEED_QUESTIONS} variant="sidebar" /></div>
        ) : (
          <AdUnit variant="sidebar-dark" />
        )}

        {/* Main */}
        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

          {/* Tab bar */}
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
            <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
            <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Vocabulary</button>
            <PDFButton onDownload={handlePDF} loading={pdfLoading} />
          </div>

          <div className="p-6 md:p-8">
          {tab === "explanation" ? <AnimalsExplanation /> : (
          <div className="space-y-5">

          {/* Exercise switcher */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
            <div className="flex items-stretch border-b border-slate-100">
              {([
                { n: 1 as const, label: "Exercise 1", sub: "A B C D" },
                { n: 2 as const, label: "Exercise 2", sub: "Choose" },
                { n: 3 as const, label: "Exercise 3", sub: "Fill in" },
              ]).map(({ n, label, sub }) => (
                <button
                  key={n}
                  onClick={() => switchEx(n)}
                  className={`flex flex-1 flex-col items-center gap-0.5 px-4 py-3.5 text-sm transition border-r last:border-r-0 border-slate-100 ${
                    exNo === n
                      ? "bg-[#F5DA20]/15 font-black text-slate-900 border-b-2 border-b-[#F5DA20]"
                      : "font-semibold text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <span>{label}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${exNo === n ? "text-slate-600" : "text-slate-300"}`}>{sub}</span>
                </button>
              ))}
            </div>

            {/* Header */}
            <div className="flex items-center justify-between bg-slate-50/80 px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-[15px] font-black text-slate-900">
                  {exNo === 1 && "Multiple Choice — Choose the correct answer (A, B, C or D)"}
                  {exNo === 2 && "Choose the Word — Select the best option for each gap"}
                  {exNo === 3 && "Fill in the Blanks — Use the words from the box"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {exNo === 1 && "Read each question and choose one answer from four options."}
                  {exNo === 2 && "Read each sentence and choose the word that fits best."}
                  {exNo === 3 && "Use each word from the box once. Read the sentences carefully."}
                </p>
              </div>
              {!checked ? (
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="h-1.5 w-24 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full bg-[#F5DA20] transition-all duration-300" style={{ width: `${(answeredCount / total) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 tabular-nums">{answeredCount}/{total}</span>
                </div>
              ) : (
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black border ${
                  grade === "great" ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                  grade === "ok"   ? "border-amber-200 bg-amber-50 text-amber-700" :
                                     "border-red-200 bg-red-50 text-red-700"
                }`}>{correctCount}/{total}</span>
              )}
            </div>

            {/* Word box for Ex 3 */}
            {exNo === 3 && (
              <div className="border-b border-slate-100 bg-[#F5DA20]/6 px-6 py-4">
                <p className="mb-3 text-xs font-black text-slate-500 uppercase tracking-wide">Words to use:</p>
                <div className="flex flex-wrap gap-2">
                  {WORD_BOX.map((w) => {
                    const used = checked
                      ? Object.values(fillAnswers).some((v) => normalize(v) === w)
                      : Object.values(fillAnswers).some((v) => normalize(v) === w);
                    return (
                      <span
                        key={w}
                        className={`rounded-xl border px-4 py-1.5 text-sm font-bold transition ${
                          used
                            ? "border-slate-200 bg-slate-100 text-slate-300 line-through"
                            : "border-[#F5DA20] bg-[#F5DA20]/15 text-slate-800"
                        }`}
                      >
                        {w}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Score panel */}
            {checked && percent !== null && (
              <div className={`flex items-center gap-5 px-6 py-5 border-b border-slate-100 ${
                grade === "great" ? "bg-emerald-50" :
                grade === "ok"   ? "bg-amber-50" :
                                   "bg-red-50"
              }`}>
                <div className={`text-5xl font-black tabular-nums leading-none ${
                  grade === "great" ? "text-emerald-600" :
                  grade === "ok"   ? "text-amber-600" : "text-red-600"
                }`}>{percent}<span className="text-2xl">%</span></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-700">{correctCount} out of {total} correct</div>
                  <div className="mt-2.5 h-2 w-full rounded-full bg-black/8 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${
                      grade === "great" ? "bg-emerald-500" :
                      grade === "ok"   ? "bg-amber-400" : "bg-red-500"
                    }`} style={{ width: `${percent}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {grade === "great" ? "Excellent! Great animal vocabulary!" :
                     grade === "ok"   ? "Good effort! Try once more to improve." :
                                        "Keep practising — review the explanations below."}
                  </p>
                </div>
                <div className="text-4xl">{grade === "great" ? "🎉" : grade === "ok" ? "💪" : "📖"}</div>
              </div>
            )}

            {/* Questions */}
            <div className="divide-y divide-slate-50">

              {/* ── Exercise 1: ABCD ── */}
              {exNo === 1 && EX1.map((q, idx) => {
                const chosen = answers[q.id];
                const isCorrect = checked && chosen === String(q.correct);
                const isWrong   = checked && chosen != null && chosen !== String(q.correct);

                return (
                  <div key={q.id} className={`px-6 py-6 transition-colors duration-200 ${isCorrect ? "bg-emerald-50/60" : isWrong ? "bg-red-50/60" : ""}`}>
                    <div className="flex gap-4">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all ${
                        isCorrect ? "bg-emerald-500 text-white" :
                        isWrong   ? "bg-red-500 text-white" :
                        chosen != null ? "bg-[#F5DA20] text-black" :
                        "bg-slate-100 text-slate-400"
                      }`}>
                        {checked
                          ? isCorrect
                            ? <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                            : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                          : String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-semibold text-slate-900 leading-snug mb-4">{q.question}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, oi) => {
                            const sel    = chosen === String(oi);
                            const ok     = checked && sel && oi === q.correct;
                            const bad    = checked && sel && oi !== q.correct;
                            const reveal = checked && !sel && oi === q.correct;
                            return (
                              <button
                                key={oi}
                                onClick={() => { if (!checked) setAnswers((p) => { const n = { ...p, [q.id]: String(oi) }; broadcast({ answers: n, checked: false, exNo }); return n; }); }}
                                disabled={checked}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-left transition-all duration-150 ${
                                  ok     ? "bg-emerald-500 text-white shadow-sm" :
                                  bad    ? "bg-red-500 text-white shadow-sm" :
                                  reveal ? "border-2 border-emerald-300 bg-emerald-50 text-emerald-700" :
                                  sel    ? "bg-[#F5DA20] text-black shadow-sm" :
                                  checked ? "border border-slate-100 bg-slate-50 text-slate-300" :
                                  "border border-slate-200 bg-white text-slate-700 hover:border-[#F5DA20] hover:bg-[#F5DA20]/10 active:scale-[0.98]"
                                }`}
                              >
                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                                  ok     ? "bg-white/20 text-white" :
                                  bad    ? "bg-white/20 text-white" :
                                  reveal ? "bg-emerald-200 text-emerald-700" :
                                  sel    ? "bg-black/10 text-black" :
                                  checked ? "bg-slate-100 text-slate-300" :
                                  "bg-slate-100 text-slate-500"
                                }`}>{LABELS[oi]}</span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {checked && (
                          <div className={`mt-3 rounded-xl px-4 py-3 text-sm leading-relaxed ${
                            isCorrect ? "bg-emerald-50 border border-emerald-100 text-emerald-800" :
                                        "bg-slate-50 border border-slate-100 text-slate-600"
                          }`}>
                            <span className="font-bold">{isCorrect ? "✓ Correct! " : `✗ The answer is ${q.options[q.correct]}. `}</span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* ── Exercise 2: Choose the word ── */}
              {exNo === 2 && EX2.map((q, idx) => {
                const chosen = answers[q.id];
                const isCorrect = checked && chosen === q.correct;
                const isWrong   = checked && chosen != null && chosen !== q.correct;

                return (
                  <div key={q.id} className={`px-6 py-6 transition-colors duration-200 ${isCorrect ? "bg-emerald-50/60" : isWrong ? "bg-red-50/60" : ""}`}>
                    <div className="flex gap-4">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all ${
                        isCorrect ? "bg-emerald-500 text-white" :
                        isWrong   ? "bg-red-500 text-white" :
                        chosen != null ? "bg-[#F5DA20] text-black" :
                        "bg-slate-100 text-slate-400"
                      }`}>
                        {checked
                          ? isCorrect
                            ? <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                            : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                          : String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] text-slate-800 leading-relaxed font-medium">
                          {q.before}{" "}
                          <span className={`inline-block min-w-[90px] rounded-lg px-3 py-0.5 text-center font-black transition-all ${
                            isCorrect ? "bg-emerald-100 text-emerald-700" :
                            isWrong   ? "bg-red-100 text-red-600 line-through" :
                            chosen    ? "bg-[#F5DA20]/30 text-slate-800" :
                            "border-2 border-dashed border-slate-200 text-slate-300"
                          }`}>{chosen ?? "???"}</span>
                          {" "}{q.after}
                        </p>
                        {isWrong && (
                          <p className="mt-1 text-sm font-semibold text-emerald-600">✓ Correct answer: <span className="font-black">{q.correct}</span></p>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {q.options.map((opt) => {
                            const sel    = chosen === opt;
                            const ok     = checked && sel && opt === q.correct;
                            const bad    = checked && sel && opt !== q.correct;
                            const reveal = checked && !sel && opt === q.correct;
                            return (
                              <button
                                key={opt}
                                onClick={() => { if (!checked) setAnswers((p) => { const n = { ...p, [q.id]: opt }; broadcast({ answers: n, checked: false, exNo }); return n; }); }}
                                disabled={checked}
                                className={`rounded-xl px-5 py-2 text-sm font-bold transition-all duration-150 ${
                                  ok     ? "bg-emerald-500 text-white shadow-sm" :
                                  bad    ? "bg-red-500 text-white shadow-sm" :
                                  reveal ? "border-2 border-emerald-300 bg-emerald-50 text-emerald-700" :
                                  sel    ? "bg-[#F5DA20] text-black shadow-sm" :
                                  checked ? "border border-slate-100 bg-slate-50 text-slate-300" :
                                  "border border-slate-200 bg-white text-slate-700 hover:border-[#F5DA20] hover:bg-[#F5DA20]/10 active:scale-95"
                                }`}
                              >{opt}</button>
                            );
                          })}
                        </div>
                        {checked && (
                          <div className={`mt-3 rounded-xl px-4 py-3 text-sm leading-relaxed ${
                            isCorrect ? "bg-emerald-50 border border-emerald-100 text-emerald-800" :
                                        "bg-slate-50 border border-slate-100 text-slate-600"
                          }`}>
                            <span className="font-bold">{isCorrect ? "✓ Correct! " : "Explanation: "}</span>{q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* ── Exercise 3: Fill in the blanks ── */}
              {exNo === 3 && EX3.map((q, idx) => {
                const val = fillAnswers[q.id] ?? "";
                const isCorrect = checked && normalize(val) === normalize(q.correct);
                const isWrong   = checked && val.trim() !== "" && !isCorrect;
                const noAnswer  = checked && val.trim() === "";

                return (
                  <div key={q.id} className={`px-6 py-6 transition-colors duration-200 ${isCorrect ? "bg-emerald-50/60" : (isWrong || noAnswer) ? "bg-red-50/60" : ""}`}>
                    <div className="flex gap-4">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all ${
                        isCorrect   ? "bg-emerald-500 text-white" :
                        isWrong || noAnswer ? "bg-red-500 text-white" :
                        val.trim()  ? "bg-[#F5DA20] text-black" :
                        "bg-slate-100 text-slate-400"
                      }`}>
                        {checked
                          ? isCorrect
                            ? <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                            : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                          : String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] text-slate-800 leading-relaxed font-medium">
                          {q.before}{" "}
                          <input
                            type="text"
                            value={val}
                            disabled={checked}
                            onChange={(e) => setFillAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                            placeholder="________"
                            className={`inline-block w-32 rounded-lg border px-3 py-0.5 text-center text-sm font-bold outline-none transition-all ${
                              isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-700" :
                              isWrong   ? "border-red-300 bg-red-50 text-red-600 line-through" :
                              noAnswer  ? "border-red-200 bg-red-50" :
                              val.trim() ? "border-[#F5DA20] bg-[#F5DA20]/15 text-slate-900 focus:ring-2 focus:ring-[#F5DA20]/30" :
                              "border-slate-200 bg-white text-slate-900 focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/20"
                            }`}
                          />{" "}
                          {q.after}
                        </p>
                        {checked && (
                          <div className={`mt-3 rounded-xl px-4 py-3 text-sm leading-relaxed ${
                            isCorrect ? "bg-emerald-50 border border-emerald-100 text-emerald-800" :
                                        "bg-slate-50 border border-slate-100 text-slate-600"
                          }`}>
                            <span className="font-bold">
                              {isCorrect ? "✓ Correct! " : `✗ The answer is "${q.correct}". `}
                            </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
              {!checked ? (
                <>
                  <button
                    onClick={check}
                    disabled={!allAnswered}
                    className="rounded-xl bg-[#F5DA20] px-6 py-2.5 text-sm font-black text-black transition hover:opacity-90 shadow-sm disabled:opacity-35 disabled:cursor-not-allowed"
                  >
                    Check Answers
                  </button>
                  {exNo === 3 && (
                    <button
                      onClick={() => {
                        const all: Record<number, string> = {};
                        EX3.forEach((q) => { all[q.id] = q.correct; });
                        setFillAnswers(all);
                        setChecked(true);
                        broadcast({ answers, checked: true, exNo });
                      }}
                      className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition underline underline-offset-2"
                    >
                      Show Answers
                    </button>
                  )}
                  {!allAnswered && exNo !== 3 && (
                    <span className="text-xs text-slate-400">{total - answeredCount} question{total - answeredCount !== 1 ? "s" : ""} remaining</span>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={reset} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
                    Try Again
                  </button>
                  {exNo < 3 && (
                    <button onClick={() => switchEx((exNo + 1) as 2 | 3)} className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition">
                      Next Exercise →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom nav */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <a href="/vocabulary/a1" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
              All A1 Exercises
            </a>
          </div>
          </div>
          )}
          </div>
        </section>

        {/* Right column */}
        {isPro ? (
          <VocabRecommendations level="a1" />
        ) : (
          <AdUnit variant="sidebar-light" />
        )}

      </div>
    </div>
  );
}

function AnimalsExplanation() {
  const words = [
    ["dog", "собака — friendly pet mammal"],
    ["cat", "кіт — popular pet, says meow"],
    ["bird", "птах — has wings, can fly"],
    ["fish", "риба — lives in water, has fins"],
    ["elephant", "слон — biggest land animal, has a trunk"],
    ["cheetah", "гепард — fastest land animal"],
    ["rabbit", "кролик — eats carrots and grass"],
    ["dolphin", "дельфін — very clever, lives in the ocean"],
    ["bear", "ведмідь — lives in the forest, loves honey"],
    ["horse", "кінь — useful, people can ride it"],
    ["wild", "дикий — lives in nature, not with people"],
    ["pet", "домашній — lives with people at home"],
    ["trunk", "хобот — elephant's long nose"],
    ["fins", "плавці — help fish swim"],
    ["tail", "хвіст — back part of an animal's body"],
    ["wings", "крила — help birds fly"],
    ["puppy", "цуценя — baby dog"],
    ["kitten", "кошеня — baby cat"],
    ["honey", "мед — sweet food made by bees"],
    ["woof", "гав — sound a dog makes"],
  ];
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-slate-900">Animals Vocabulary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {words.map(([en, ua]) => (
          <div key={en} className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm flex gap-2">
            <span className="font-bold text-slate-900 min-w-[80px]">{en}</span>
            <span className="text-slate-500">{ua}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">A1 Tip</div>
        <p className="text-xs text-amber-700 leading-relaxed">Do all three exercises in order. Each one uses the <strong>same vocabulary</strong> — by Exercise 3, the words will feel much more familiar!</p>
      </div>
    </div>
  );
}
