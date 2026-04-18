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
  { q: "___ you drink coffee in the morning?", options: ["Do","Does","Did","Are"], answer: 0 },
  { q: "___ she work in a hospital?", options: ["Do","Does","Did","Is"], answer: 1 },
  { q: "___ they live near the station?", options: ["Does","Do","Is","Are"], answer: 1 },
  { q: "___ he play football after school?", options: ["Does","Do","Is","Did"], answer: 0 },
  { q: "___ we eat lunch at home?", options: ["Do","Does","Are","Did"], answer: 0 },
  { q: "___ it work well now?", options: ["Does","Do","Is","Did"], answer: 0 },
  { q: "___ your parents speak English?", options: ["Do","Does","Are","Is"], answer: 0 },
  { q: "___ Anna go to school by bus?", options: ["Does","Do","Is","Did"], answer: 0 },
  { q: "___ I need this book today?", options: ["Do","Does","Am","Is"], answer: 0 },
  { q: "___ the dog sleep in the kitchen?", options: ["Does","Do","Is","Are"], answer: 0 },
  { q: "___ he like chocolate?", options: ["Does he likes?","Do he like?","Does he like?","Is he like?"], answer: 2 },
  { q: "___ you play the guitar?", options: ["Does you play?","Do you play?","Do you plays?","Are you play?"], answer: 1 },
  { q: "___ she go to school by bus?", options: ["Does she goes?","Do she go?","Does she go?","Is she go?"], answer: 2 },
  { q: "___ they know the answer?", options: ["Do they know?","Does they know?","Do they knows?","Are they know?"], answer: 0 },
  { q: "___ it work on Sundays?", options: ["Does it work?","Do it work?","Does it works?","Is it work?"], answer: 0 },
  { q: "___ we watch TV at night?", options: ["Does we watch?","Do we watches?","Do we watch?","Are we watch?"], answer: 2 },
  { q: "___ your friends speak Spanish?", options: ["Do your friends speak?","Does your friends speak?","Do your friends speaks?","Are your friends speak?"], answer: 0 },
  { q: "___ Anna read books?", options: ["Does Anna reads?","Do Anna read?","Does Anna read?","Is Anna read?"], answer: 2 },
  { q: "___ you want some water?", options: ["Does you want?","Do you wants?","Do you want?","Are you want?"], answer: 2 },
  { q: "___ it start at 7 o'clock?", options: ["Does it starts?","Do it start?","Does it start?","Is it start?"], answer: 2 },
];

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Present Simple (I/you/we/they)", href: "/grammar/a1/present-simple-i-you-we-they", img: "/topics/a1/present-simple-i-you-we-they.jpg", level: "A1", badge: "bg-emerald-500", reason: "Questions build on this" },
  { title: "Wh- Questions", href: "/grammar/a1/wh-questions", img: "/topics/a1/wh-questions.jpg", level: "A1", badge: "bg-emerald-500" },
  { title: "Present Simple Negative", href: "/grammar/a1/present-simple-negative", img: "/topics/a1/present-simple-negative.jpg", level: "A1", badge: "bg-emerald-500" },
];

export default function PresentSimpleQuestionsLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      // EX 1: MCQ - choose do/does for questions
      1: {
        type: "mcq",
        title: "Exercise 1 (Easy) — Choose do or does",
        instructions: "Choose the correct word (do or does) to complete each Present Simple question.",
        questions: [
          {
            id: "e1q1",
            prompt: "___ you drink coffee in the morning?",
            options: ["Do", "Does", "Did", "Are"],
            correctIndex: 0,
            explanation: "Use 'Do' with you: Do you drink coffee in the morning?",
          },
          {
            id: "e1q2",
            prompt: "___ she work in a hospital?",
            options: ["Do", "Does", "Did", "Is"],
            correctIndex: 1,
            explanation: "Use 'Does' with she: Does she work in a hospital?",
          },
          {
            id: "e1q3",
            prompt: "___ they live near the station?",
            options: ["Does", "Do", "Is", "Are"],
            correctIndex: 1,
            explanation: "Use 'Do' with they: Do they live near the station?",
          },
          {
            id: "e1q4",
            prompt: "___ he play football after school?",
            options: ["Does", "Do", "Is", "Did"],
            correctIndex: 0,
            explanation: "Use 'Does' with he: Does he play football after school?",
          },
          {
            id: "e1q5",
            prompt: "___ we eat lunch at home?",
            options: ["Do", "Does", "Are", "Did"],
            correctIndex: 0,
            explanation: "Use 'Do' with we: Do we eat lunch at home?",
          },
          {
            id: "e1q6",
            prompt: "___ it work well now?",
            options: ["Does", "Do", "Is", "Did"],
            correctIndex: 0,
            explanation: "Use 'Does' with it: Does it work well now?",
          },
          {
            id: "e1q7",
            prompt: "___ your parents speak English?",
            options: ["Do", "Does", "Are", "Is"],
            correctIndex: 0,
            explanation: "Use 'Do' with your parents (they): Do your parents speak English?",
          },
          {
            id: "e1q8",
            prompt: "___ Anna go to school by bus?",
            options: ["Does", "Do", "Is", "Did"],
            correctIndex: 0,
            explanation: "Use 'Does' with Anna (she): Does Anna go to school by bus?",
          },
          {
            id: "e1q9",
            prompt: "___ I need this book today?",
            options: ["Do", "Does", "Am", "Is"],
            correctIndex: 0,
            explanation: "Use 'Do' with I: Do I need this book today?",
          },
          {
            id: "e1q10",
            prompt: "___ the dog sleep in the kitchen?",
            options: ["Does", "Do", "Is", "Are"],
            correctIndex: 0,
            explanation: "Use 'Does' with the dog (it): Does the dog sleep in the kitchen?",
          },
        ],
      },
      // EX 2: input - type the correct Present Simple question
      2: {
        type: "input",
        title: "Exercise 2 (Medium) — Type the Present Simple question",
        instructions: "Type the correct Present Simple question. Use do/does and the base verb. Use the words in brackets to help you.",
        questions: [
          {
            id: "e2q1",
            prompt: "___ you like pizza? (like)",
            correct: "do you like pizza?",
            explanation: "Use 'Do' with you: Do you like pizza?",
          },
          {
            id: "e2q2",
            prompt: "___ she play tennis on Sundays? (play)",
            correct: "does she play tennis on sundays?",
            explanation: "Use 'Does' with she: Does she play tennis on Sundays?",
          },
          {
            id: "e2q3",
            prompt: "___ they go to school by bus? (go)",
            correct: "do they go to school by bus?",
            explanation: "Use 'Do' with they: Do they go to school by bus?",
          },
          {
            id: "e2q4",
            prompt: "___ it rain here in summer? (rain)",
            correct: "does it rain here in summer?",
            explanation: "Use 'Does' with it: Does it rain here in summer?",
          },
          {
            id: "e2q5",
            prompt: "___ your friends read books? (read)",
            correct: "do your friends read books?",
            explanation: "Use 'Do' with your friends (they): Do your friends read books?",
          },
          {
            id: "e2q6",
            prompt: "___ Anna study English? (study)",
            correct: "does anna study english?",
            explanation: "Use 'Does' with Anna (she): Does Anna study English?",
          },
          {
            id: "e2q7",
            prompt: "___ we start at 8 o'clock? (start)",
            correct: "do we start at 8 o'clock?",
            explanation: "Use 'Do' with we: Do we start at 8 o'clock?",
          },
          {
            id: "e2q8",
            prompt: "___ he want some tea? (want)",
            correct: "does he want some tea?",
            explanation: "Use 'Does' with he: Does he want some tea?",
          },
          {
            id: "e2q9",
            prompt: "___ it help you? (help)",
            correct: "does it help you?",
            explanation: "Use 'Does' with it: Does it help you?",
          },
          {
            id: "e2q10",
            prompt: "___ I need to bring my book? (need)",
            correct: "do i need to bring my book?",
            explanation: "Use 'Do' with I: Do I need to bring my book?",
          },
        ],
      },
      // EX 3: MCQ - mixed Present Simple questions with distractors
      3: {
        type: "mcq",
        title: "Exercise 3 (Hard) — Find the correct Present Simple question",
        instructions: "Choose the correct Present Simple question. Watch for common mistakes!",
        questions: [
          {
            id: "e3q1",
            prompt: "___ he like chocolate?",
            options: [
              "Does he likes chocolate?",
              "Do he like chocolate?",
              "Does he like chocolate?",
              "Is he like chocolate?",
            ],
            correctIndex: 2,
            explanation: "Use 'Does' with he and base verb: Does he like chocolate?",
          },
          {
            id: "e3q2",
            prompt: "___ you play the guitar?",
            options: [
              "Does you play the guitar?",
              "Do you play the guitar?",
              "Do you plays the guitar?",
              "Are you play the guitar?",
            ],
            correctIndex: 1,
            explanation: "Use 'Do' with you and base verb: Do you play the guitar?",
          },
          {
            id: "e3q3",
            prompt: "___ she go to school by bus?",
            options: [
              "Does she goes to school by bus?",
              "Do she go to school by bus?",
              "Does she go to school by bus?",
              "Is she go to school by bus?",
            ],
            correctIndex: 2,
            explanation: "Use 'Does' with she and base verb: Does she go to school by bus?",
          },
          {
            id: "e3q4",
            prompt: "___ they know the answer?",
            options: [
              "Do they know the answer?",
              "Does they know the answer?",
              "Do they knows the answer?",
              "Are they know the answer?",
            ],
            correctIndex: 0,
            explanation: "Use 'Do' with they and base verb: Do they know the answer?",
          },
          {
            id: "e3q5",
            prompt: "___ it work on Sundays?",
            options: [
              "Does it work on Sundays?",
              "Do it work on Sundays?",
              "Does it works on Sundays?",
              "Is it work on Sundays?",
            ],
            correctIndex: 0,
            explanation: "Use 'Does' with it and base verb: Does it work on Sundays?",
          },
          {
            id: "e3q6",
            prompt: "___ we watch TV at night?",
            options: [
              "Does we watch TV at night?",
              "Do we watches TV at night?",
              "Do we watch TV at night?",
              "Are we watch TV at night?",
            ],
            correctIndex: 2,
            explanation: "Use 'Do' with we and base verb: Do we watch TV at night?",
          },
          {
            id: "e3q7",
            prompt: "___ your friends speak Spanish?",
            options: [
              "Do your friends speak Spanish?",
              "Does your friends speak Spanish?",
              "Do your friends speaks Spanish?",
              "Are your friends speak Spanish?",
            ],
            correctIndex: 0,
            explanation: "Use 'Do' with your friends (they): Do your friends speak Spanish?",
          },
          {
            id: "e3q8",
            prompt: "___ Anna read books?",
            options: [
              "Does Anna reads books?",
              "Do Anna read books?",
              "Does Anna read books?",
              "Is Anna read books?",
            ],
            correctIndex: 2,
            explanation: "Use 'Does' with Anna (she) and base verb: Does Anna read books?",
          },
          {
            id: "e3q9",
            prompt: "___ you want some water?",
            options: [
              "Does you want some water?",
              "Do you wants some water?",
              "Do you want some water?",
              "Are you want some water?",
            ],
            correctIndex: 2,
            explanation: "Use 'Do' with you and base verb: Do you want some water?",
          },
          {
            id: "e3q10",
            prompt: "___ it start at 7 o'clock?",
            options: [
              "Does it starts at 7 o'clock?",
              "Do it start at 7 o'clock?",
              "Does it start at 7 o'clock?",
              "Is it start at 7 o'clock?",
            ],
            correctIndex: 2,
            explanation: "Use 'Does' with it and base verb: Does it start at 7 o'clock?",
          },
        ],
      },
      // EX 4: input - complete Present Simple questions
      4: {
        type: "input",
        title: "Exercise 4 (Harder) — Complete the Present Simple question",
        instructions: "Complete each Present Simple question using do/does and the base verb. Use the verb in brackets.",
        questions: [
          {
            id: "e4q1",
            prompt: "___ you ___ football after school? (play)",
            correct: "do you play football after school?",
            explanation: "Use 'Do' with you: Do you play football after school?",
          },
          {
            id: "e4q2",
            prompt: "___ she ___ tea in the morning? (drink)",
            correct: "does she drink tea in the morning?",
            explanation: "Use 'Does' with she: Does she drink tea in the morning?",
          },
          {
            id: "e4q3",
            prompt: "___ they ___ to the gym on Friday? (go)",
            correct: "do they go to the gym on friday?",
            explanation: "Use 'Do' with they: Do they go to the gym on Friday?",
          },
          {
            id: "e4q4",
            prompt: "___ it ___ well now? (work)",
            correct: "does it work well now?",
            explanation: "Use 'Does' with it: Does it work well now?",
          },
          {
            id: "e4q5",
            prompt: "___ Anna ___ English at home? (speak)",
            correct: "does anna speak english at home?",
            explanation: "Use 'Does' with Anna (she): Does Anna speak English at home?",
          },
          {
            id: "e4q6",
            prompt: "___ you ___ lunch at school? (eat)",
            correct: "do you eat lunch at school?",
            explanation: "Use 'Do' with you: Do you eat lunch at school?",
          },
          {
            id: "e4q7",
            prompt: "___ he ___ to school by bus? (go)",
            correct: "does he go to school by bus?",
            explanation: "Use 'Does' with he: Does he go to school by bus?",
          },
          {
            id: "e4q8",
            prompt: "___ we ___ homework in the evening? (do)",
            correct: "do we do homework in the evening?",
            explanation: "Use 'Do' with we: Do we do homework in the evening?",
          },
          {
            id: "e4q9",
            prompt: "___ your parents ___ early? (start)",
            correct: "do your parents start early?",
            explanation: "Use 'Do' with your parents (they): Do your parents start early?",
          },
          {
            id: "e4q10",
            prompt: "___ it ___ at night? (rain)",
            correct: "does it rain at night?",
            explanation: "Use 'Does' with it: Does it rain at night?",
          },
        ],
      },
    };
  }, []);

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
        title: "Present Simple Questions",
        subtitle: "do / does — 4 exercises + answer key",
        level: "A1",
        keyRule: "Do + I/you/we/they + base verb? Does + he/she/it + base verb?",
        exercises: [
          {
            number: 1, title: "Exercise 1", difficulty: "Easy",
            instruction: "Choose Do or Does to complete each Present Simple question.",
            questions: [
              "___ you drink coffee in the morning?",
              "___ she work in a hospital?",
              "___ they live near the station?",
              "___ he play football after school?",
              "___ we eat lunch at home?",
              "___ it work well now?",
              "___ your parents speak English?",
              "___ Anna go to school by bus?",
              "___ I need this book today?",
              "___ the dog sleep in the kitchen?",
            ],
          },
          {
            number: 2, title: "Exercise 2", difficulty: "Medium",
            instruction: "Type the correct Present Simple question using do/does and the base verb.",
            questions: [
              "___ you like pizza? (like)",
              "___ she play tennis on Sundays? (play)",
              "___ they go to school by bus? (go)",
              "___ it rain here in summer? (rain)",
              "___ your friends read books? (read)",
              "___ Anna study English? (study)",
              "___ we start at 8 o'clock? (start)",
              "___ he want some tea? (want)",
              "___ it help you? (help)",
              "___ I need to bring my book? (need)",
            ],
          },
          {
            number: 3, title: "Exercise 3", difficulty: "Hard",
            instruction: "Choose the correct Present Simple question. Watch for common mistakes!",
            questions: [
              "___ he like chocolate? (Does he like / Does he likes / Do he like)",
              "___ you play the guitar? (Do you play / Does you play / Do you plays)",
              "___ she go to school by bus? (Does she go / Does she goes / Do she go)",
              "___ they know the answer? (Do they know / Does they know / Do they knows)",
              "___ it work on Sundays? (Does it work / Does it works / Do it work)",
              "___ we watch TV at night? (Do we watch / Does we watch / Do we watches)",
              "___ your friends speak Spanish? (Do they speak / Does they speak / Do they speaks)",
              "___ Anna read books? (Does Anna read / Does Anna reads / Do Anna read)",
              "___ you want some water? (Do you want / Do you wants / Does you want)",
              "___ it start at 7? (Does it start / Does it starts / Do it start)",
            ],
          },
          {
            number: 4, title: "Exercise 4", difficulty: "Harder",
            instruction: "Complete each Present Simple question using do/does and the verb in brackets.",
            questions: [
              "___ you ___ football after school? (play)",
              "___ she ___ tea in the morning? (drink)",
              "___ they ___ to the gym on Friday? (go)",
              "___ it ___ well now? (work)",
              "___ Anna ___ English at home? (speak)",
              "___ you ___ lunch at school? (eat)",
              "___ he ___ to school by bus? (go)",
              "___ we ___ homework in the evening? (do)",
              "___ your parents ___ early? (start)",
              "___ it ___ at night? (rain)",
            ],
          },
        ],
        answerKey: [
          { exercise: 1, subtitle: "Easy — Do or Does", answers: ["Do","Does","Do","Does","Do","Does","Do","Does","Do","Does"] },
          { exercise: 2, subtitle: "Medium — type the question", answers: ["Do you like pizza?","Does she play tennis?","Do they go by bus?","Does it rain here?","Do your friends read?","Does Anna study?","Do we start at 8?","Does he want tea?","Does it help you?","Do I need my book?"] },
          { exercise: 3, subtitle: "Hard — correct question form", answers: ["Does he like?","Do you play?","Does she go?","Do they know?","Does it work?","Do we watch?","Do they speak?","Does Anna read?","Do you want?","Does it start?"] },
          { exercise: 4, subtitle: "Harder — complete the question", answers: ["Do you play","Does she drink","Do they go","Does it work","Does Anna speak","Do you eat","Does he go","Do we do","Do your parents start","Does it rain"] },
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
        <span className="text-slate-700 font-medium">Present Simple Questions</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Present Simple Questions (do / does) – A1 Exercises
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Learn how to ask questions in the Present Simple with <b>do</b> and <b>does</b>. Practice with 4 easy exercises!
      </p>

      {/* Layout: left col + center content + right col */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="">
            <SpeedRound gameId="grammar-a1-present-simple-questions" subject="Present Simple Questions" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          href="/grammar/a1/wh-questions"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: Wh-questions →
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Present Simple — Questions</h2>
        <p className="text-slate-500 text-sm">Use do or does to form yes/no and wh-questions in the Present Simple.</p>
      </div>

      {/* 2 gradient cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❓</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Yes / No Question</span>
          </div>
          <Formula parts={[
            { text: "Do / Does", color: "sky" },
            { dim: true },
            { text: "Subject", color: "yellow" },
            { dim: true },
            { text: "Base verb", color: "green" },
            { dim: true },
            { text: "?", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="Do you drink coffee?" />
            <Ex en="Does she work here?" />
            <Ex en="Do they live nearby?" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-b from-violet-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔍</span>
            <span className="text-sm font-black text-violet-700 uppercase tracking-widest">Wh- Question</span>
          </div>
          <Formula parts={[
            { text: "Wh- word", color: "violet" },
            { dim: true },
            { text: "do / does", color: "sky" },
            { dim: true },
            { text: "Subject", color: "yellow" },
            { dim: true },
            { text: "Base verb", color: "green" },
            { dim: true },
            { text: "?", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="Where do you live?" />
            <Ex en="What does she eat?" />
            <Ex en="When do they start?" />
          </div>
        </div>
      </div>

      {/* Reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Do vs Does — which to use?</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 pr-4 font-black text-slate-700">Subject</th>
                <th className="text-left py-2 pr-4 font-black text-sky-700">Helper verb</th>
                <th className="text-left py-2 font-black text-slate-700">Short answer (Yes)</th>
                <th className="text-left py-2 pl-4 font-black text-slate-700">Short answer (No)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr>
                <td className="py-2 pr-4 text-slate-700">I / you / we / they</td>
                <td className="py-2 pr-4 font-black text-sky-700">Do</td>
                <td className="py-2 text-emerald-700 font-semibold">Yes, I do.</td>
                <td className="py-2 pl-4 text-red-600 font-semibold">No, I don&apos;t.</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-slate-700">he / she / it</td>
                <td className="py-2 pr-4 font-black text-sky-700">Does</td>
                <td className="py-2 text-emerald-700 font-semibold">Yes, she does.</td>
                <td className="py-2 pl-4 text-red-600 font-semibold">No, she doesn&apos;t.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Short answers grid */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Short answers — common forms</h3>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Ex en="Yes, I do." />
          <Ex en="No, I don't." />
          <Ex en="Yes, she does." />
          <Ex en="No, she doesn't." />
          <Ex en="Yes, they do." />
          <Ex en="No, he doesn't." />
        </div>
      </div>

      {/* Wrong vs right */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Wrong</p>
          <Ex en="Does she works here?" correct={false} />
          <Ex en="Do he like pizza?" correct={false} />
          <Ex en="Does they go by bus?" correct={false} />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-1">Correct</p>
          <Ex en="Does she work here?" />
          <Ex en="Does he like pizza?" />
          <Ex en="Do they go by bus?" />
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <b>⚠ Key point:</b> After <b>does</b> the verb is always the BASE form — Does she <b>work</b>? NOT Does she <b>works</b>? The &quot;-s&quot; belongs to <i>does</i>, not the main verb.
      </div>
    </div>
  );
}