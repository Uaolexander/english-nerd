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
  { q: "She ___ goes to bed early — every single night.", options: ["always","never","sometimes","often"], answer: 0 },
  { q: "I ___ eat broccoli — maybe once a year.", options: ["always","usually","often","hardly ever"], answer: 3 },
  { q: "We ___ have English on Monday — it is in our timetable.", options: ["always","never","hardly ever","rarely"], answer: 0 },
  { q: "He ___ watches TV before bed, but not every day.", options: ["never","always","sometimes","hardly ever"], answer: 2 },
  { q: "My dad is ___ on time. He is never late.", options: ["hardly ever","always","never","sometimes"], answer: 1 },
  { q: "I ___ drink cola — I prefer water.", options: ["always","usually","often","never"], answer: 3 },
  { q: "Which is correct? She ___ is late.", options: ["always is","is always","never always","sometimes is"], answer: 1 },
  { q: "They ___ go to the beach in summer — it is a tradition.", options: ["never","always","hardly ever","rarely"], answer: 1 },
  { q: "My sister ___ forgets her keys. It happens many times.", options: ["never","hardly ever","often","always"], answer: 2 },
  { q: "We ___ eat at restaurants because it is expensive.", options: ["always","usually","hardly ever","often"], answer: 2 },
  { q: "Which is correct?", options: ["I usually get up at 7.","I get usually up at 7.","Usually I get up at 7 always.","I get up usually at 7."], answer: 0 },
  { q: "He ___ plays football — about three times a week.", options: ["never","hardly ever","often","always"], answer: 2 },
  { q: "She is ___ happy in the morning. (After 'is')", options: ["usually is","is usually","always before","never after"], answer: 1 },
  { q: "My grandma ___ uses the internet — she prefers newspapers.", options: ["always","usually","often","hardly ever"], answer: 3 },
  { q: "We ___ have breakfast before school — every morning.", options: ["always","never","sometimes","rarely"], answer: 0 },
  { q: "I am tired because I ___ go to bed late on Sundays.", options: ["never","hardly ever","often","always"], answer: 2 },
  { q: "Which position is correct for adverbs of frequency with main verbs?", options: ["After the verb","Before the verb","At the end","At the beginning only"], answer: 1 },
  { q: "My mum ___ cooks on Friday — we order pizza instead.", options: ["always","usually","often","never"], answer: 3 },
  { q: "Our teacher ___ gives a warm-up — it is part of her routine.", options: ["never","hardly ever","usually","rarely"], answer: 2 },
  { q: "I ___ forget my homework — maybe once a year.", options: ["always","usually","often","hardly ever"], answer: 3 },
];

export default function AdverbFrequencyLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      /* ── Exercise 1 ── Easy: choose between 2 adverbs ─────────────────── */
      1: {
        type: "mcq",
        title: "Exercise 1 — Choose the correct adverb",
        instructions:
          "Read each sentence carefully and choose the adverb that makes sense.",
        questions: [
          {
            id: "e1q1",
            prompt: "I ___ drink coffee late at night because I want to sleep well.",
            options: ["always", "never"],
            correctIndex: 1,
            explanation:
              "The person avoids coffee to sleep well, so it never happens.",
          },
          {
            id: "e1q2",
            prompt: "She ___ walks to school with her best friend every morning.",
            options: ["always", "never"],
            correctIndex: 0,
            explanation: "Every morning = it happens 100% of the time → always.",
          },
          {
            id: "e1q3",
            prompt: "My dad ___ watches TV in the morning because he goes to work early.",
            options: ["often", "never"],
            correctIndex: 1,
            explanation: "Going to work early leaves no time for TV → never.",
          },
          {
            id: "e1q4",
            prompt: "We ___ have English lessons on Tuesday and Thursday — it is our fixed schedule.",
            options: ["always", "sometimes"],
            correctIndex: 0,
            explanation: "A fixed timetable = it happens every time → always.",
          },
          {
            id: "e1q5",
            prompt: "Tom is not late every day, but he is ___ late for class.",
            options: ["sometimes", "always"],
            correctIndex: 0,
            explanation: "Not every day, but it does happen → sometimes.",
          },
          {
            id: "e1q6",
            prompt: "My little sister ___ eats vegetables, so my mum is very happy.",
            options: ["always", "never"],
            correctIndex: 0,
            explanation: "Mum is happy because she eats them every time → always.",
          },
          {
            id: "e1q7",
            prompt: "I ___ go to bed at 3 a.m. because I am usually very tired by 10 p.m.",
            options: ["often", "never"],
            correctIndex: 1,
            explanation: "Being tired by 10 p.m. means staying up until 3 a.m. never happens.",
          },
          {
            id: "e1q8",
            prompt: "We ___ watch a movie together on Friday evening — it is our family tradition.",
            options: ["always", "sometimes"],
            correctIndex: 0,
            explanation: "A tradition = every time → always.",
          },
          {
            id: "e1q9",
            prompt: "She ___ watches TV after dinner, but sometimes she reads instead.",
            options: ["often", "never"],
            correctIndex: 0,
            explanation: "It happens most of the time but not every time → often.",
          },
          {
            id: "e1q10",
            prompt: "I ___ forget my keys because I keep them in the same place every day.",
            options: ["always", "never"],
            correctIndex: 1,
            explanation: "Keeping keys in the same spot prevents forgetting → never.",
          },
        ],
      },

      /* ── Exercise 2 ── Medium: 3 options, wider range ──────────────────── */
      2: {
        type: "mcq",
        title: "Exercise 2 — Choose the best adverb",
        instructions:
          "Three options this time. Choose the adverb that fits the meaning best.",
        questions: [
          {
            id: "e2q1",
            prompt: "I am very tired on Monday mornings because I ___ go to bed late on Sunday.",
            options: ["often", "never", "hardly ever"],
            correctIndex: 0,
            explanation: "It happens many times (not 100%, not almost never) → often.",
          },
          {
            id: "e2q2",
            prompt: "My grandparents ___ use the internet, but they prefer newspapers.",
            options: ["always", "sometimes", "never"],
            correctIndex: 1,
            explanation: "They do it from time to time, not always → sometimes.",
          },
          {
            id: "e2q3",
            prompt: "We ___ eat breakfast before school because lessons start very early.",
            options: ["never", "always", "sometimes"],
            correctIndex: 1,
            explanation: "A daily routine that happens every day → always.",
          },
          {
            id: "e2q4",
            prompt: "My sister is very sporty, so she ___ goes running after work.",
            options: ["often", "never", "hardly ever"],
            correctIndex: 0,
            explanation: "A sporty person does it regularly but maybe not every day → often.",
          },
          {
            id: "e2q5",
            prompt: "I ___ drink cola — maybe once a year.",
            options: ["usually", "often", "hardly ever"],
            correctIndex: 2,
            explanation: "Once a year = very rarely → hardly ever.",
          },
          {
            id: "e2q6",
            prompt: "He is a careful student, so he ___ checks his homework before class.",
            options: ["never", "always", "sometimes"],
            correctIndex: 1,
            explanation: "A careful habit done every time → always.",
          },
          {
            id: "e2q7",
            prompt: "We ___ go to the cinema in winter, but not every weekend.",
            options: ["never", "often", "always"],
            correctIndex: 1,
            explanation: "Many times but not every week → often.",
          },
          {
            id: "e2q8",
            prompt: "My mum ___ cooks on Friday because we usually order pizza.",
            options: ["usually", "always", "never"],
            correctIndex: 2,
            explanation: "If they order pizza, she does not cook → never.",
          },
          {
            id: "e2q9",
            prompt: "I ___ forget names when I meet many new people.",
            options: ["always", "sometimes", "never"],
            correctIndex: 1,
            explanation: "It happens from time to time, not every time → sometimes.",
          },
          {
            id: "e2q10",
            prompt: "Our teacher ___ gives us a warm-up activity at the start — it is part of her routine.",
            options: ["hardly ever", "never", "usually"],
            correctIndex: 2,
            explanation: "A regular classroom routine = most of the time → usually.",
          },
        ],
      },

      /* ── Exercise 3 ── Word order: choose the correct sentence ─────────── */
      3: {
        type: "mcq",
        title: "Exercise 3 — Choose the correct word order",
        instructions:
          "Adverbs of frequency go BEFORE the main verb but AFTER 'am / is / are / was'. Choose the sentence with the correct word order.",
        questions: [
          {
            id: "e3q1",
            prompt: "Which sentence is correct?",
            options: [
              "She always is late for class.",
              "She is always late for class.",
            ],
            correctIndex: 1,
            explanation:
              "'Always' comes AFTER 'is' (to be). ✅ She is always late.",
          },
          {
            id: "e3q2",
            prompt: "Which sentence is correct?",
            options: [
              "I usually get up at 7 a.m.",
              "I get usually up at 7 a.m.",
            ],
            correctIndex: 0,
            explanation:
              "'Usually' goes BEFORE the main verb 'get'. ✅ I usually get up.",
          },
          {
            id: "e3q3",
            prompt: "Which sentence is correct?",
            options: [
              "They are never on time.",
              "They never are on time.",
            ],
            correctIndex: 0,
            explanation:
              "'Never' comes AFTER 'are' (to be). ✅ They are never on time.",
          },
          {
            id: "e3q4",
            prompt: "Which sentence is correct?",
            options: [
              "He plays often football after school.",
              "He often plays football after school.",
            ],
            correctIndex: 1,
            explanation:
              "'Often' goes BEFORE the main verb 'plays'. ✅ He often plays football.",
          },
          {
            id: "e3q5",
            prompt: "Which sentence is correct?",
            options: [
              "My dad is sometimes tired in the evening.",
              "My dad sometimes is tired in the evening.",
            ],
            correctIndex: 0,
            explanation:
              "'Sometimes' comes AFTER 'is' (to be). ✅ My dad is sometimes tired.",
          },
          {
            id: "e3q6",
            prompt: "Which sentence is correct?",
            options: [
              "We hardly ever eat in restaurants.",
              "We eat in restaurants hardly ever.",
            ],
            correctIndex: 0,
            explanation:
              "'Hardly ever' goes BEFORE the main verb 'eat'. ✅ We hardly ever eat.",
          },
          {
            id: "e3q7",
            prompt: "Which sentence is correct?",
            options: [
              "She is always happy in the morning.",
              "She always is happy in the morning.",
            ],
            correctIndex: 0,
            explanation:
              "'Always' goes AFTER 'is' (to be). ✅ She is always happy.",
          },
          {
            id: "e3q8",
            prompt: "Which sentence is correct?",
            options: [
              "I read never books before bed.",
              "I never read books before bed.",
            ],
            correctIndex: 1,
            explanation:
              "'Never' goes BEFORE the main verb 'read'. ✅ I never read books.",
          },
          {
            id: "e3q9",
            prompt: "Which sentence is correct?",
            options: [
              "My brother is usually hungry after school.",
              "My brother usually is hungry after school.",
            ],
            correctIndex: 0,
            explanation:
              "'Usually' comes AFTER 'is' (to be). ✅ My brother is usually hungry.",
          },
          {
            id: "e3q10",
            prompt: "Which sentence is correct?",
            options: [
              "They sometimes go to the park on weekends.",
              "They go sometimes to the park on weekends.",
            ],
            correctIndex: 0,
            explanation:
              "'Sometimes' goes BEFORE the main verb 'go'. ✅ They sometimes go.",
          },
        ],
      },

      /* ── Exercise 4 ── Input: type the adverb ──────────────────────────── */
      4: {
        type: "input",
        title: "Exercise 4 — Type the adverb",
        instructions:
          "Type the correct adverb of frequency. Use: always / usually / often / sometimes / hardly ever / never.",
        questions: [
          {
            id: "e4q1",
            prompt: "I _____ get up at 7 a.m. on school days — every single day.",
            correct: "always",
            explanation: "Every single day = 100% → always.",
          },
          {
            id: "e4q2",
            prompt: "We _____ go to the beach in winter because it is too cold.",
            correct: "never",
            explanation: "Too cold = it does not happen → never.",
          },
          {
            id: "e4q3",
            prompt: "My dad _____ cooks dinner on Friday, but not every week.",
            correct: "sometimes",
            explanation: "Not every week = occasionally → sometimes.",
          },
          {
            id: "e4q4",
            prompt: "She _____ drinks tea in the morning — it is her normal routine.",
            correct: "usually",
            explanation: "A normal routine = most of the time → usually.",
          },
          {
            id: "e4q5",
            prompt: "I _____ eat burgers — maybe once or twice a year.",
            correct: "hardly ever",
            explanation: "Once or twice a year = very rarely → hardly ever.",
          },
          {
            id: "e4q6",
            prompt: "My friends _____ play computer games after school — almost every day.",
            correct: "often",
            explanation: "Almost every day = many times → often.",
          },
          {
            id: "e4q7",
            prompt: "He _____ says thank you when someone helps him — without exception.",
            correct: "always",
            explanation: "Without exception = 100% → always.",
          },
          {
            id: "e4q8",
            prompt: "We _____ travel by plane because train tickets are much cheaper.",
            correct: "hardly ever",
            explanation: "Preferring trains = flying very rarely → hardly ever.",
          },
          {
            id: "e4q9",
            prompt: "I _____ forget my homework — maybe once a year.",
            correct: "hardly ever",
            explanation: "Once a year = very rarely → hardly ever.",
          },
          {
            id: "e4q10",
            prompt: "Our teacher _____ starts the lesson with a warm-up — it is part of her routine.",
            correct: "usually",
            explanation: "Part of a routine = most of the time → usually.",
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
    const total = current.questions.length;

    if (current.type === "mcq") {
      for (const q of current.questions) {
        if (mcqAnswers[q.id] === q.correctIndex) correct++;
      }
    } else {
      for (const q of current.questions) {
        const a = normalize(inputAnswers[q.id] ?? "");
        if (a && a === normalize(q.correct)) correct++;
      }
    }

    return { correct, total, percent: Math.round((correct / total) * 100) };
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
        title: "Adverbs of Frequency",
        subtitle: "Always / Usually / Often / Sometimes / Never — 4 exercises + answer key",
        level: "A1",
        keyRule: "always → usually → often → sometimes → hardly ever → never (before main verb, after 'be')",
        exercises: [
          {
            number: 1, title: "Exercise 1", difficulty: "Easy",
            instruction: "Choose always or never to complete each sentence.",
            questions: [
              "I ___ drink coffee late at night because I want to sleep well.",
              "She ___ walks to school with her friend every single morning.",
              "My dad ___ watches TV in the morning — he goes to work early.",
              "We ___ have English on Tuesday — it is our fixed schedule.",
              "Tom is not late every day, but he is ___ late for class.",
              "My little sister ___ eats vegetables, so my mum is very happy.",
              "I ___ go to bed at 3 a.m. because I am tired by 10 p.m.",
              "We ___ watch a movie on Friday — it is our family tradition.",
              "She ___ watches TV after dinner, but sometimes she reads instead.",
              "I ___ forget my keys because I keep them in the same place.",
            ],
            hint: "always / never",
          },
          {
            number: 2, title: "Exercise 2", difficulty: "Medium",
            instruction: "Choose the best adverb from three options.",
            questions: [
              "I am tired on Mondays because I ___ go to bed late on Sunday.",
              "My grandparents ___ use the internet, but prefer newspapers.",
              "We ___ eat breakfast before school — lessons start very early.",
              "My sister is sporty, so she ___ goes running after work.",
              "I ___ drink cola — maybe once or twice a year.",
              "He is careful, so he ___ checks his homework before class.",
              "We ___ go to the cinema in winter, but not every weekend.",
              "My mum ___ cooks on Friday because we usually order pizza.",
              "I ___ forget names when I meet many new people.",
              "Our teacher ___ gives us a warm-up — it is part of her routine.",
            ],
            hint: "often / usually / never / sometimes / hardly ever",
          },
          {
            number: 3, title: "Exercise 3", difficulty: "Hard",
            instruction: "Put the adverb in the correct position in the sentence.",
            questions: [
              "She is late for class. (always)",
              "I get up at 7 a.m. (usually)",
              "They are on time. (never)",
              "He plays football after school. (often)",
              "My dad is tired in the evening. (sometimes)",
              "We eat in restaurants. (hardly ever)",
              "She is happy in the morning. (always)",
              "I read books before bed. (never)",
              "My brother is hungry after school. (usually)",
              "They go to the park on weekends. (sometimes)",
            ],
          },
          {
            number: 4, title: "Exercise 4", difficulty: "Harder",
            instruction: "Write the correct adverb: always / usually / often / sometimes / hardly ever / never.",
            questions: [
              "I _____ get up at 7 a.m. on school days — every single day.",
              "We _____ go to the beach in winter because it is too cold.",
              "My dad _____ cooks dinner on Friday, but not every week.",
              "She _____ drinks tea in the morning — it is her normal routine.",
              "I _____ eat burgers — maybe once or twice a year.",
              "My friends _____ play computer games after school — almost every day.",
              "He _____ says thank you when someone helps him — without exception.",
              "We _____ travel by plane because train tickets are much cheaper.",
              "I _____ forget my homework — maybe once a year.",
              "Our teacher _____ starts the lesson with a warm-up — it is her routine.",
            ],
          },
        ],
        answerKey: [
          { exercise: 1, subtitle: "Easy — always or never", answers: ["never","always","never","always","sometimes","always","never","always","often","never"] },
          { exercise: 2, subtitle: "Medium — choose the best adverb", answers: ["often","sometimes","always","often","hardly ever","always","often","never","sometimes","usually"] },
          { exercise: 3, subtitle: "Hard — correct word order", answers: ["She is always late.","I usually get up.","They are never on time.","He often plays.","My dad is sometimes tired.","We hardly ever eat.","She is always happy.","I never read.","My brother is usually hungry.","They sometimes go."] },
          { exercise: 4, subtitle: "Harder — type the adverb", answers: ["always","never","sometimes","usually","hardly ever","often","always","hardly ever","hardly ever","usually"] },
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
        <span className="text-slate-700 font-medium">Adverbs of Frequency</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Adverbs of Frequency{" "}
          <span className="font-extrabold">— A1 grammar exercises</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Learn and practise adverbs of frequency: <b>always</b>, <b>usually</b>,{" "}
        <b>often</b>, <b>sometimes</b>, <b>hardly ever</b>, and <b>never</b> — including
        how to put them in the right place in a sentence.
      </p>

      {/* Layout: left sidebar + content + right sidebar */}
      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="sticky top-24">
            <SpeedRound gameId="grammar-a1-adverbs-frequency" subject="Adverbs of Frequency" questions={SPEED_QUESTIONS} variant="sidebar" />
          </div>
        ) : (
          <div className="sticky top-24">
            <AdUnit variant="sidebar-dark" />
          </div>
        )}

        {/* Center */}
        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          {/* Tabs + exercise switcher */}
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button
              onClick={() => setTab("exercises")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                tab === "exercises"
                  ? "bg-[#F5DA20] text-black"
                  : "text-slate-700 hover:bg-black/5"
              }`}
            >
              Exercises
            </button>
            <button
              onClick={() => setTab("explanation")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                tab === "explanation"
                  ? "bg-[#F5DA20] text-black"
                  : "text-slate-700 hover:bg-black/5"
              }`}
            >
              Explanation
            </button>

            <PDFButton onDownload={downloadPDF} loading={pdfLoading} />

            <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
              Exercises:
              {([1, 2, 3, 4] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => switchExercise(n)}
                  className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${
                    exNo === n
                      ? "bg-[#F5DA20] text-black"
                      : "bg-white text-slate-800 hover:bg-black/5"
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
                  <h2 className="text-2xl font-black text-slate-900">
                    {current.title}
                  </h2>
                  <p className="text-slate-700">{current.instructions}</p>

                  {/* Mobile exercise buttons */}
                  <div className="mt-2 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                    <span>Exercises:</span>
                    {([1, 2, 3, 4] as const).map((n) => (
                      <button
                        key={n}
                        onClick={() => switchExercise(n)}
                        className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${
                          exNo === n
                            ? "bg-[#F5DA20] text-black"
                            : "bg-white text-slate-800 hover:bg-black/5"
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
                      const isWrong =
                        checked && chosen !== null && chosen !== q.correctIndex;
                      const noAnswer = checked && chosen === null;

                      return (
                        <div
                          key={q.id}
                          className="rounded-2xl border border-black/10 bg-white p-5"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">
                                {q.prompt}
                              </div>

                              <div
                                className={`mt-3 grid gap-2 ${
                                  q.options.length === 3
                                    ? "sm:grid-cols-3"
                                    : "sm:grid-cols-2"
                                }`}
                              >
                                {q.options.map((opt, oi) => (
                                  <label
                                    key={oi}
                                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition ${
                                      chosen === oi
                                        ? "border-[#F5DA20] bg-[#F5DA20]/20"
                                        : "border-black/10 bg-white hover:bg-black/5"
                                    } ${checked ? "cursor-default" : ""}`}
                                  >
                                    <input
                                      type="radio"
                                      name={q.id}
                                      disabled={checked}
                                      checked={chosen === oi}
                                      onChange={() =>
                                        setMcqAnswers((p) => ({
                                          ...p,
                                          [q.id]: oi,
                                        }))
                                      }
                                    />
                                    <span className="text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>

                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && (
                                    <div className="font-semibold text-emerald-700">
                                      ✅ Correct
                                    </div>
                                  )}
                                  {isWrong && (
                                    <div className="font-semibold text-red-700">
                                      ❌ Wrong
                                    </div>
                                  )}
                                  {noAnswer && (
                                    <div className="font-semibold text-amber-700">
                                      ⚠ No answer
                                    </div>
                                  )}
                                  <div className="mt-2 text-slate-700">
                                    <b className="text-slate-900">Correct:</b>{" "}
                                    {q.options[q.correctIndex]} —{" "}
                                    {q.explanation}
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
                      const isCorrect =
                        checked &&
                        answered &&
                        normalize(val) === normalize(q.correct);
                      const noAnswer = checked && !answered;
                      const wrong = checked && answered && !isCorrect;

                      return (
                        <div
                          key={q.id}
                          className="rounded-2xl border border-black/10 bg-white p-5"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">
                                {q.prompt}
                              </div>

                              <div className="mt-3">
                                <input
                                  value={val}
                                  disabled={checked}
                                  onChange={(e) =>
                                    setInputAnswers((p) => ({
                                      ...p,
                                      [q.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="Type here…"
                                  className="w-full max-w-xs rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]"
                                />
                              </div>

                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && (
                                    <div className="font-semibold text-emerald-700">
                                      ✅ Correct
                                    </div>
                                  )}
                                  {wrong && (
                                    <div className="font-semibold text-red-700">
                                      ❌ Wrong
                                    </div>
                                  )}
                                  {noAnswer && (
                                    <div className="font-semibold text-amber-700">
                                      ⚠ No answer
                                    </div>
                                  )}
                                  <div className="mt-2 text-slate-700">
                                    <b className="text-slate-900">Correct:</b>{" "}
                                    {q.correct} — {q.explanation}
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
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl border border-black/10 bg-white/70 p-5">
              <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Recommended</div>
              <div className="space-y-2">
                <a href="/grammar/a1" className="flex items-center gap-3 rounded-xl p-2 hover:bg-black/5 transition">
                  <span className="text-lg">📚</span>
                  <div><div className="text-sm font-bold text-slate-900">All A1 Lessons</div><div className="text-xs text-slate-500">Complete the level</div></div>
                </a>
                <a href="/grammar/a2" className="flex items-center gap-3 rounded-xl p-2 hover:bg-black/5 transition">
                  <span className="text-lg">🚀</span>
                  <div><div className="text-sm font-bold text-slate-900">A2 Grammar</div><div className="text-xs text-slate-500">Next level up</div></div>
                </a>
                <a href="/tenses/present-simple" className="flex items-center gap-3 rounded-xl p-2 hover:bg-black/5 transition">
                  <span className="text-lg">⏰</span>
                  <div><div className="text-sm font-bold text-slate-900">Present Simple</div><div className="text-xs text-slate-500">Essential tense</div></div>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="sticky top-24">
            <AdUnit variant="sidebar-light" />
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/a1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">
          ← All A1 topics
        </a>
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
          Move to A2 →
        </a>
      </div>
    </div>
  );
}

/* ─── Explanation tab ──────────────────────────────────────────────────────── */

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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Adverbs of Frequency</h2>
        <p className="text-slate-500 text-sm">Tell us how often something happens — and where to put them matters.</p>
      </div>

      {/* Frequency scale */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-black text-white">!</span>
          <span className="text-sm font-black text-slate-700 uppercase tracking-wide">Frequency scale</span>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { word: "always", pct: 100, label: "100%", color: "bg-emerald-500" },
            { word: "usually", pct: 80, label: "~80%", color: "bg-emerald-400" },
            { word: "often", pct: 60, label: "~60%", color: "bg-yellow-400" },
            { word: "sometimes", pct: 40, label: "~40%", color: "bg-yellow-300" },
            { word: "rarely", pct: 20, label: "~20%", color: "bg-orange-300" },
            { word: "never", pct: 2, label: "0%", color: "bg-red-400" },
          ].map(({ word, pct, label, color }) => (
            <div key={word} className="flex items-center gap-3">
              <div className="w-24 text-sm font-black text-slate-800">{word}</div>
              <div className="flex-1 rounded-full bg-black/5 h-2.5 overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="w-10 text-right text-xs font-semibold text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Position rule — before main verb */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-widest text-emerald-700">Position rule 1 — BEFORE the main verb</div>
        <Formula parts={[
          { text: "Subject", color: "slate" },
          { dim: true },
          { text: "adverb", color: "yellow" },
          { dim: true },
          { text: "main verb", color: "green" },
          { dim: true },
          { text: "rest", color: "slate" },
        ]} />
        <div className="grid gap-2 md:grid-cols-2 pt-1">
          <Ex en="I always eat breakfast." />
          <Ex en="She often reads books." />
          <Ex en="They never watch TV." />
          <Ex en="We sometimes go by bus." />
        </div>
      </div>

      {/* Position rule — after to be */}
      <div className="rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-widest text-sky-700">Position rule 2 — AFTER to be (am / is / are)</div>
        <Formula parts={[
          { text: "Subject", color: "slate" },
          { dim: true },
          { text: "am / is / are", color: "sky" },
          { dim: true },
          { text: "adverb", color: "yellow" },
          { dim: true },
          { text: "rest", color: "slate" },
        ]} />
        <div className="grid gap-2 md:grid-cols-2 pt-1">
          <Ex en="I am always tired on Monday." />
          <Ex en="She is usually on time." />
          <Ex en="They are never late." />
          <Ex en="He is sometimes busy." />
        </div>
      </div>

      {/* Full adverb reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-black text-white">!</span>
          <span className="text-sm font-black text-slate-700 uppercase tracking-wide">All 6 adverbs — meaning &amp; examples</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-black/10">
                <th className="py-2 pr-4 text-left text-xs font-black text-slate-500 uppercase">Adverb</th>
                <th className="py-2 pr-4 text-left text-xs font-black text-slate-500 uppercase">%</th>
                <th className="py-2 pr-4 text-left text-xs font-black text-slate-500 uppercase">Example 1</th>
                <th className="py-2 text-left text-xs font-black text-slate-500 uppercase">Example 2</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["always", "100%", "I always brush my teeth.", "She always arrives early."],
                ["usually", "~80%", "He usually drinks coffee.", "We usually have lunch at 1."],
                ["often", "~60%", "They often go to the gym.", "I often forget my keys."],
                ["sometimes", "~40%", "We sometimes eat out.", "She sometimes works late."],
                ["rarely", "~20%", "He rarely eats sweets.", "I rarely watch the news."],
                ["never", "0%", "I never smoke.", "She never misses class."],
              ].map(([adv, pct, ex1, ex2]) => (
                <tr key={adv}>
                  <td className="py-2.5 pr-4 font-black text-slate-800">{adv}</td>
                  <td className="py-2.5 pr-4 text-slate-500 text-xs font-semibold">{pct}</td>
                  <td className="py-2.5 pr-4 text-slate-700 italic">{ex1}</td>
                  <td className="py-2.5 text-slate-700 italic">{ex2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Warning:</span> The adverb always comes <strong>BEFORE</strong> the main verb — never after it.
        <div className="mt-2 space-y-1">
          <Ex en="I always go to school by bus." />
          <Ex en="I go always to school by bus." correct={false} />
        </div>
      </div>
    </div>
  );
}
