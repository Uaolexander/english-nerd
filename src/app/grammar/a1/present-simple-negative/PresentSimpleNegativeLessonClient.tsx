"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import GrammarRecommended, { type GrammarRec } from "@/components/GrammarRecommended";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
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
  { q: "I ___ coffee in the evening.", options: ["don't drink","doesn't drink","don't drinks","doesn't drinks"], answer: 0 },
  { q: "She ___ in London now.", options: ["don't live","doesn't live","doesn't lives","don't lives"], answer: 1 },
  { q: "We ___ TV after school.", options: ["doesn't watch","don't watch","don't watches","doesn't watches"], answer: 1 },
  { q: "He ___ football on Mondays.", options: ["doesn't play","don't play","doesn't plays","don't plays"], answer: 0 },
  { q: "They ___ lunch at home.", options: ["doesn't eat","don't eat","don't eats","doesn't eats"], answer: 1 },
  { q: "It ___ very fast.", options: ["doesn't move","don't move","doesn't moves","don't moves"], answer: 0 },
  { q: "You ___ French at school.", options: ["don't study","doesn't study","don't studies","doesn't studies"], answer: 0 },
  { q: "My dad ___ in a bank.", options: ["doesn't work","don't work","doesn't works","don't works"], answer: 0 },
  { q: "We ___ to bed late.", options: ["doesn't go","don't go","don't goes","doesn't goes"], answer: 1 },
  { q: "Anna ___ tea in the morning.", options: ["doesn't drink","don't drink","doesn't drinks","don't drinks"], answer: 0 },
  { q: "He ___ to school by bus.", options: ["doesn't goes","doesn't go","don't go","doesn't going"], answer: 1 },
  { q: "I ___ chocolate.", options: ["don't likes","doesn't like","don't like","doesn't likes"], answer: 2 },
  { q: "They ___ early on Sundays.", options: ["doesn't start","don't starts","doesn't starts","don't start"], answer: 3 },
  { q: "She ___ breakfast at 6 o'clock.", options: ["doesn't eat","don't eat","doesn't eats","don't eats"], answer: 0 },
  { q: "We ___ Spanish at school.", options: ["doesn't study","don't study","don't studies","doesn't studies"], answer: 1 },
  { q: "It ___ in the morning.", options: ["doesn't rains","doesn't rain","don't rain","don't rains"], answer: 1 },
  { q: "You ___ books every day.", options: ["doesn't read","don't reads","don't read","doesn't reads"], answer: 2 },
  { q: "My brother ___ football.", options: ["doesn't plays","don't play","doesn't play","don't plays"], answer: 2 },
  { q: "They ___ at home on Fridays.", options: ["doesn't stay","don't stay","don't stays","doesn't stays"], answer: 1 },
  { q: "She ___ orange juice.", options: ["doesn't drinks","doesn't drink","don't drink","don't drinks"], answer: 1 },
];

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Present Simple (I/you/we/they)", href: "/grammar/a1/present-simple-i-you-we-they", img: "/topics/a1/present-simple-i-you-we-they.jpg", level: "A1", badge: "bg-emerald-500", reason: "Learn the positive first" },
  { title: "Present Simple (he/she/it)", href: "/grammar/a1/present-simple-he-she-it", img: "/topics/a1/present-simple-he-she-it.jpg", level: "A1", badge: "bg-emerald-500" },
  { title: "Present Simple Questions", href: "/grammar/a1/present-simple-questions", img: "/topics/a1/present-simple-questions.jpg", level: "A1", badge: "bg-emerald-500" },
];

export default function PresentSimpleNegativeLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      // EX 1: MCQ - choose between don't / doesn't / base verb form in negative sentences
      1: {
        type: "mcq",
        title: "Exercise 1 (Easy) — Choose the correct negative form",
        instructions: "Choose the correct negative form for each sentence.",
        questions: [
          {
            id: "e1q1",
            prompt: "I ___ coffee in the evening.",
            options: ["don't drink", "doesn't drink", "don't drinks", "doesn't drinks"],
            correctIndex: 0,
            explanation: "With I, use 'don't' + base verb: I don't drink.",
          },
          {
            id: "e1q2",
            prompt: "She ___ in London now.",
            options: ["don't live", "doesn't live", "doesn't lives", "don't lives"],
            correctIndex: 1,
            explanation: "With she, use 'doesn't' + base verb: She doesn't live.",
          },
          {
            id: "e1q3",
            prompt: "We ___ TV after school.",
            options: ["doesn't watch", "don't watch", "don't watches", "doesn't watches"],
            correctIndex: 1,
            explanation: "With we, use 'don't' + base verb: We don't watch.",
          },
          {
            id: "e1q4",
            prompt: "He ___ football on Mondays.",
            options: ["doesn't play", "don't play", "doesn't plays", "don't plays"],
            correctIndex: 0,
            explanation: "With he, use 'doesn't' + base verb: He doesn't play.",
          },
          {
            id: "e1q5",
            prompt: "They ___ lunch at home.",
            options: ["doesn't eat", "don't eat", "don't eats", "doesn't eats"],
            correctIndex: 1,
            explanation: "With they, use 'don't' + base verb: They don't eat.",
          },
          {
            id: "e1q6",
            prompt: "It ___ very fast.",
            options: ["doesn't move", "don't move", "doesn't moves", "don't moves"],
            correctIndex: 0,
            explanation: "With it, use 'doesn't' + base verb: It doesn't move.",
          },
          {
            id: "e1q7",
            prompt: "You ___ French at school.",
            options: ["don't study", "doesn't study", "don't studies", "doesn't studies"],
            correctIndex: 0,
            explanation: "With you, use 'don't' + base verb: You don't study.",
          },
          {
            id: "e1q8",
            prompt: "My dad ___ in a bank.",
            options: ["doesn't work", "don't work", "doesn't works", "don't works"],
            correctIndex: 0,
            explanation: "With my dad (he), use 'doesn't' + base verb: My dad doesn't work.",
          },
          {
            id: "e1q9",
            prompt: "We ___ to bed late.",
            options: ["doesn't go", "don't go", "don't goes", "doesn't goes"],
            correctIndex: 1,
            explanation: "With we, use 'don't' + base verb: We don't go.",
          },
          {
            id: "e1q10",
            prompt: "Anna ___ tea in the morning.",
            options: ["doesn't drink", "don't drink", "doesn't drinks", "don't drinks"],
            correctIndex: 0,
            explanation: "With Anna (she), use 'doesn't' + base verb: Anna doesn't drink.",
          },
        ],
      },
      // EX 2: input - type correct negative form (e.g. don't like / doesn't work)
      2: {
        type: "input",
        title: "Exercise 2 (Medium) — Type the correct negative form",
        instructions: "Type the correct negative form (e.g. don't like / doesn't work). Use the words in brackets.",
        questions: [
          {
            id: "e2q1",
            prompt: "He ___ in a restaurant. (work)",
            correct: "doesn't work",
            explanation: "He = doesn't + base verb: doesn't work.",
          },
          {
            id: "e2q2",
            prompt: "I ___ pizza on Mondays. (eat)",
            correct: "don't eat",
            explanation: "I = don't + base verb: don't eat.",
          },
          {
            id: "e2q3",
            prompt: "They ___ English at home. (speak)",
            correct: "don't speak",
            explanation: "They = don't + base verb: don't speak.",
          },
          {
            id: "e2q4",
            prompt: "She ___ coffee in the evening. (drink)",
            correct: "doesn't drink",
            explanation: "She = doesn't + base verb: doesn't drink.",
          },
          {
            id: "e2q5",
            prompt: "We ___ to school on Sundays. (go)",
            correct: "don't go",
            explanation: "We = don't + base verb: don't go.",
          },
          {
            id: "e2q6",
            prompt: "It ___ at night. (work)",
            correct: "doesn't work",
            explanation: "It = doesn't + base verb: doesn't work.",
          },
          {
            id: "e2q7",
            prompt: "You ___ tea in the morning. (like)",
            correct: "don't like",
            explanation: "You = don't + base verb: don't like.",
          },
          {
            id: "e2q8",
            prompt: "My parents ___ TV after dinner. (watch)",
            correct: "don't watch",
            explanation: "My parents = they = don't + base verb: don't watch.",
          },
          {
            id: "e2q9",
            prompt: "She ___ fast food. (eat)",
            correct: "doesn't eat",
            explanation: "She = doesn't + base verb: doesn't eat.",
          },
          {
            id: "e2q10",
            prompt: "We ___ music at night. (listen)",
            correct: "don't listen",
            explanation: "We = don't + base verb: don't listen.",
          },
        ],
      },
      // EX 3: MCQ - mixed negative sentences with common mistakes as distractors
      3: {
        type: "mcq",
        title: "Exercise 3 (Hard) — Pick the correct negative sentence",
        instructions: "Choose the correct negative sentence. Watch for common mistakes!",
        questions: [
          {
            id: "e3q1",
            prompt: "He ___ to school by bus.",
            options: ["doesn't goes", "doesn't go", "don't go", "doesn't going"],
            correctIndex: 1,
            explanation: "He = doesn't + base verb: doesn't go.",
          },
          {
            id: "e3q2",
            prompt: "I ___ chocolate.",
            options: ["don't likes", "doesn't like", "don't like", "doesn't likes"],
            correctIndex: 2,
            explanation: "I = don't + base verb: don't like.",
          },
          {
            id: "e3q3",
            prompt: "They ___ early on Sundays.",
            options: ["doesn't start", "don't starts", "doesn't starts", "don't start"],
            correctIndex: 3,
            explanation: "They = don't + base verb: don't start.",
          },
          {
            id: "e3q4",
            prompt: "She ___ breakfast at 6 o'clock.",
            options: ["doesn't eat", "don't eat", "doesn't eats", "don't eats"],
            correctIndex: 0,
            explanation: "She = doesn't + base verb: doesn't eat.",
          },
          {
            id: "e3q5",
            prompt: "We ___ Spanish at school.",
            options: ["doesn't study", "don't study", "don't studies", "doesn't studies"],
            correctIndex: 1,
            explanation: "We = don't + base verb: don't study.",
          },
          {
            id: "e3q6",
            prompt: "It ___ in the morning.",
            options: ["doesn't rains", "doesn't rain", "don't rain", "don't rains"],
            correctIndex: 1,
            explanation: "It = doesn't + base verb: doesn't rain.",
          },
          {
            id: "e3q7",
            prompt: "You ___ books every day.",
            options: ["doesn't read", "don't reads", "don't read", "doesn't reads"],
            correctIndex: 2,
            explanation: "You = don't + base verb: don't read.",
          },
          {
            id: "e3q8",
            prompt: "My brother ___ football.",
            options: ["doesn't plays", "don't play", "doesn't play", "don't plays"],
            correctIndex: 2,
            explanation: "My brother (he) = doesn't + base verb: doesn't play.",
          },
          {
            id: "e3q9",
            prompt: "They ___ at home on Fridays.",
            options: ["doesn't stay", "don't stay", "don't stays", "doesn't stays"],
            correctIndex: 1,
            explanation: "They = don't + base verb: don't stay.",
          },
          {
            id: "e3q10",
            prompt: "She ___ orange juice.",
            options: ["doesn't drinks", "doesn't drink", "don't drink", "don't drinks"],
            correctIndex: 1,
            explanation: "She = doesn't + base verb: doesn't drink.",
          },
        ],
      },
      // EX 4: input - complete full negative sentences
      4: {
        type: "input",
        title: "Exercise 4 (Harder) — Complete the negative sentences",
        instructions: "Complete each sentence with the correct negative form in Present Simple.",
        questions: [
          {
            id: "e4q1",
            prompt: "I ___ TV at night. (watch)",
            correct: "don't watch",
            explanation: "I = don't + base verb: don't watch.",
          },
          {
            id: "e4q2",
            prompt: "He ___ tea in the morning. (drink)",
            correct: "doesn't drink",
            explanation: "He = doesn't + base verb: doesn't drink.",
          },
          {
            id: "e4q3",
            prompt: "We ___ to school on Saturday. (go)",
            correct: "don't go",
            explanation: "We = don't + base verb: don't go.",
          },
          {
            id: "e4q4",
            prompt: "She ___ chocolate. (eat)",
            correct: "doesn't eat",
            explanation: "She = doesn't + base verb: doesn't eat.",
          },
          {
            id: "e4q5",
            prompt: "They ___ English at home. (speak)",
            correct: "don't speak",
            explanation: "They = don't + base verb: don't speak.",
          },
          {
            id: "e4q6",
            prompt: "It ___ very fast. (move)",
            correct: "doesn't move",
            explanation: "It = doesn't + base verb: doesn't move.",
          },
          {
            id: "e4q7",
            prompt: "You ___ breakfast at 5 o'clock. (eat)",
            correct: "don't eat",
            explanation: "You = don't + base verb: don't eat.",
          },
          {
            id: "e4q8",
            prompt: "Anna ___ to the gym. (go)",
            correct: "doesn't go",
            explanation: "Anna (she) = doesn't + base verb: doesn't go.",
          },
          {
            id: "e4q9",
            prompt: "We ___ lunch at home. (eat)",
            correct: "don't eat",
            explanation: "We = don't + base verb: don't eat.",
          },
          {
            id: "e4q10",
            prompt: "My cat ___ milk. (drink)",
            correct: "doesn't drink",
            explanation: "My cat (it) = doesn't + base verb: doesn't drink.",
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
        title: "Present Simple Negative",
        subtitle: "don't / doesn't — 4 exercises + answer key",
        level: "A1",
        keyRule: "I/you/we/they + don't + base verb. He/she/it + doesn't + base verb.",
        exercises: [
          {
            number: 1, title: "Exercise 1", difficulty: "Easy",
            instruction: "Choose the correct negative form (don't / doesn't + verb).",
            questions: [
              "I ___ coffee in the evening. (don't drink / doesn't drink)",
              "She ___ in London now. (don't live / doesn't live)",
              "We ___ TV after school. (don't watch / doesn't watch)",
              "He ___ football on Mondays. (don't play / doesn't play)",
              "They ___ lunch at home. (don't eat / doesn't eat)",
              "It ___ very fast. (don't move / doesn't move)",
              "You ___ French at school. (don't study / doesn't study)",
              "My dad ___ in a bank. (don't work / doesn't work)",
              "We ___ to bed late. (don't go / doesn't go)",
              "Anna ___ tea in the morning. (don't drink / doesn't drink)",
            ],
          },
          {
            number: 2, title: "Exercise 2", difficulty: "Medium",
            instruction: "Type the correct negative form (e.g. don't like / doesn't work).",
            questions: [
              "He ___ in a restaurant. (work)",
              "I ___ pizza on Mondays. (eat)",
              "They ___ English at home. (speak)",
              "She ___ coffee in the evening. (drink)",
              "We ___ to school on Sundays. (go)",
              "It ___ at night. (work)",
              "You ___ tea in the morning. (like)",
              "My parents ___ TV after dinner. (watch)",
              "She ___ fast food. (eat)",
              "We ___ music at night. (listen)",
            ],
          },
          {
            number: 3, title: "Exercise 3", difficulty: "Hard",
            instruction: "Choose the correct negative sentence. Watch for common mistakes!",
            questions: [
              "He ___ to school by bus. (doesn't go / doesn't goes)",
              "I ___ chocolate. (don't like / don't likes)",
              "They ___ early on Sundays. (don't start / don't starts)",
              "She ___ breakfast at 6 o'clock. (doesn't eat / doesn't eats)",
              "We ___ Spanish at school. (don't study / doesn't study)",
              "It ___ in the morning. (doesn't rain / doesn't rains)",
              "You ___ books every day. (don't read / don't reads)",
              "My brother ___ football. (doesn't play / doesn't plays)",
              "They ___ at home on Fridays. (don't stay / doesn't stay)",
              "She ___ orange juice. (doesn't drink / doesn't drinks)",
            ],
          },
          {
            number: 4, title: "Exercise 4", difficulty: "Harder",
            instruction: "Complete each sentence with the correct negative form in Present Simple.",
            questions: [
              "I ___ TV at night. (watch)",
              "He ___ tea in the morning. (drink)",
              "We ___ to school on Saturday. (go)",
              "She ___ chocolate. (eat)",
              "They ___ English at home. (speak)",
              "It ___ very fast. (move)",
              "You ___ breakfast at 5 o'clock. (eat)",
              "Anna ___ to the gym. (go)",
              "We ___ lunch at home. (eat)",
              "My cat ___ milk. (drink)",
            ],
          },
        ],
        answerKey: [
          { exercise: 1, subtitle: "Easy — don't / doesn't", answers: ["don't drink","doesn't live","don't watch","doesn't play","don't eat","doesn't move","don't study","doesn't work","don't go","doesn't drink"] },
          { exercise: 2, subtitle: "Medium — type negative form", answers: ["doesn't work","don't eat","don't speak","doesn't drink","don't go","doesn't work","don't like","don't watch","doesn't eat","don't listen"] },
          { exercise: 3, subtitle: "Hard — correct negative sentence", answers: ["doesn't go","don't like","don't start","doesn't eat","don't study","doesn't rain","don't read","doesn't play","don't stay","doesn't drink"] },
          { exercise: 4, subtitle: "Harder — complete negative sentence", answers: ["don't watch","doesn't drink","don't go","doesn't eat","don't speak","doesn't move","don't eat","doesn't go","don't eat","doesn't drink"] },
        ],
      };
      await generateLessonPDF(config);
    } finally {
      setPdfLoading(false);
    }
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
        <span className="text-slate-700 font-medium">Present Simple Negative</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Present Simple Negative (don't / doesn't) – A1 Exercises
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Learn how to make negative sentences in the Present Simple with <b>don't</b> and <b>doesn't</b>. Practice with 4 easy exercises!
      </p>

      {/* Layout: left col + center content + right col */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="sticky top-24">
            <SpeedRound gameId="grammar-a1-present-simple-negative" subject="Present Simple Negative" questions={SPEED_QUESTIONS} variant="sidebar" />
          </div>
        ) : (
          <div className="sticky top-24">
            <AdUnit variant="sidebar-dark" />
          </div>
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
          <div className="sticky top-24">
            <AdUnit variant="sidebar-light" />
          </div>
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
          href="/grammar/a1/present-simple-questions"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: Present Simple: questions →
        </a>
      </div>
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
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Present Simple — Negative</h2>
        <p className="text-slate-500 text-sm">Use don't or doesn't + base verb to make any Present Simple sentence negative.</p>
      </div>

      {/* 2 gradient cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* don't */}
        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">❌</span>
            <span className="text-sm font-black text-red-700 uppercase tracking-widest">don't — I / you / we / they</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">Full form: <b>do not</b></p>
          <Formula parts={[{ text: "I/you/we/they", color: "green" }, { dim: true, text: "+" }, { text: "don't", color: "red" }, { dim: true, text: "+" }, { text: "base verb" }]} />
          <div className="mt-3 space-y-2">
            <Ex en="I don't like coffee." />
            <Ex en="We don't eat meat." />
            <Ex en="They don't go on Sundays." />
            <Ex en="You don't need to hurry." />
          </div>
        </div>

        {/* doesn't */}
        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">❌</span>
            <span className="text-sm font-black text-red-700 uppercase tracking-widest">doesn't — he / she / it</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">Full form: <b>does not</b></p>
          <Formula parts={[{ text: "he/she/it", color: "violet" }, { dim: true, text: "+" }, { text: "doesn't", color: "red" }, { dim: true, text: "+" }, { text: "base verb" }]} />
          <div className="mt-3 space-y-2">
            <Ex en="She doesn't play football." />
            <Ex en="He doesn't like tea." />
            <Ex en="It doesn't work at night." />
            <Ex en="Tom doesn't live here." />
          </div>
        </div>
      </div>

      {/* Reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Subject → auxiliary → negative sentence</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 pr-4 font-black text-slate-700">Subject</th>
                <th className="text-left py-2 pr-4 font-black text-slate-700">Auxiliary</th>
                <th className="text-left py-2 font-black text-slate-700">Example sentence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr><td className="py-2 pr-4 font-bold text-slate-900">I</td><td className="py-2 pr-4 font-bold text-red-700">don't</td><td className="py-2 text-slate-600 italic">I don't eat breakfast.</td></tr>
              <tr><td className="py-2 pr-4 font-bold text-slate-900">you</td><td className="py-2 pr-4 font-bold text-red-700">don't</td><td className="py-2 text-slate-600 italic">You don't live here.</td></tr>
              <tr><td className="py-2 pr-4 font-bold text-slate-900">we</td><td className="py-2 pr-4 font-bold text-red-700">don't</td><td className="py-2 text-slate-600 italic">We don't play tennis.</td></tr>
              <tr><td className="py-2 pr-4 font-bold text-slate-900">they</td><td className="py-2 pr-4 font-bold text-red-700">don't</td><td className="py-2 text-slate-600 italic">They don't go on Fridays.</td></tr>
              <tr><td className="py-2 pr-4 font-bold text-slate-900">he</td><td className="py-2 pr-4 font-bold text-red-700">doesn't</td><td className="py-2 text-slate-600 italic">He doesn't work at weekends.</td></tr>
              <tr><td className="py-2 pr-4 font-bold text-slate-900">she</td><td className="py-2 pr-4 font-bold text-red-700">doesn't</td><td className="py-2 text-slate-600 italic">She doesn't speak Spanish.</td></tr>
              <tr><td className="py-2 pr-4 font-bold text-slate-900">it</td><td className="py-2 pr-4 font-bold text-red-700">doesn't</td><td className="py-2 text-slate-600 italic">It doesn't open on Sundays.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Correct vs wrong examples */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Ex en="He doesn't plays football." correct={false} />
        <Ex en="He doesn't play football." />
        <Ex en="She doesn't likes tea." correct={false} />
        <Ex en="She doesn't like tea." />
        <Ex en="They doesn't go there." correct={false} />
        <Ex en="They don't go there." />
      </div>

      {/* Base verb word grid */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sm font-black text-sky-700">V</span>
          <h3 className="font-black text-slate-900">Base forms — always used after don't / doesn't</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {["eat", "go", "like", "work", "play", "speak", "have", "live"].map((v) => (
            <span key={v} className="rounded-lg px-3 py-1.5 text-xs font-black border bg-sky-100 text-sky-800 border-sky-200">{v}</span>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">Example: <span className="font-semibold text-slate-700">She doesn't have a car. / They don't speak French.</span></p>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <b>⚠ Key point:</b> After <b>doesn't</b> the verb must be the <b>base form</b> — no -s, no -es. <em>Doesn't</em> already carries the third-person -s, so the main verb stays unchanged: <em>doesn't go</em>, not <span className="line-through">doesn't goes</span>.
      </div>
    </div>
  );
}