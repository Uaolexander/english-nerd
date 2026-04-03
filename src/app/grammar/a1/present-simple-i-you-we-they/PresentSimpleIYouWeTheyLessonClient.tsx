"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
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
  { q: "I ___ tea every morning.", options: ["drinks","drink","drinking","drank"], answer: 1 },
  { q: "You ___ English at school.", options: ["study","studies","studied","studying"], answer: 0 },
  { q: "We ___ football on Sundays.", options: ["plays","played","play","playing"], answer: 2 },
  { q: "They ___ in a small flat.", options: ["lives","live","living","lived"], answer: 1 },
  { q: "I ___ my homework after dinner.", options: ["do","does","doing","did"], answer: 0 },
  { q: "You ___ very fast when late.", options: ["walk","walks","walking","walked"], answer: 0 },
  { q: "We ___ lunch together.", options: ["eats","eat","eating","ate"], answer: 1 },
  { q: "They ___ TV in the evening.", options: ["watch","watches","watched","watching"], answer: 0 },
  { q: "I ___ my grandparents every weekend.", options: ["visiting","visited","visit","visits"], answer: 2 },
  { q: "We ___ to music in the car.", options: ["listen","listens","listening","listened"], answer: 0 },
  { q: "I ___ in Poznań with my family.", options: ["lives","live","living","lived"], answer: 1 },
  { q: "They ___ Italian and French at home.", options: ["speaks","speak","speaking","spoke"], answer: 1 },
  { q: "We ___ to school by bus every day.", options: ["go","goes","going","went"], answer: 0 },
  { q: "You ___ your friends after school.", options: ["meet","meets","meeting","met"], answer: 0 },
  { q: "I ___ coffee but I don't like tea.", options: ["likes","like","liking","liked"], answer: 1 },
  { q: "They ___ home at 5 o'clock.", options: ["leave","leaves","leaving","left"], answer: 0 },
  { q: "We ___ school at 8 o'clock.", options: ["start","starts","started","starting"], answer: 0 },
  { q: "I ___ orange juice in the morning.", options: ["drinks","drink","drank","drinking"], answer: 1 },
  { q: "You ___ your little brother with homework.", options: ["help","helps","helped","helping"], answer: 0 },
  { q: "They ___ pizza on Fridays.", options: ["eat","eats","eating","ate"], answer: 0 },
];

export default function PresentSimpleIYouWeTheyLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const isPro = useIsPro();
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      // EX 1: MCQ - choose correct verb form for I/you/we/they
      1: {
        type: "mcq",
        title: "Exercise 1 (Easy) — Choose the correct verb",
        instructions: "Choose the correct verb form for the Present Simple (I / you / we / they).",
        questions: [
          {
            id: "e1q1",
            prompt: "I ___ tea every morning before work.",
            options: ["drinks", "drink", "drinking", "drank"],
            correctIndex: 1,
            explanation: "With I, use the base verb: I drink.",
          },
          {
            id: "e1q2",
            prompt: "You ___ English at school every week.",
            options: ["study", "studies", "studied", "studying"],
            correctIndex: 0,
            explanation: "With you, use the base verb: you study.",
          },
          {
            id: "e1q3",
            prompt: "We ___ football in the park on Sundays.",
            options: ["plays", "played", "play", "playing"],
            correctIndex: 2,
            explanation: "With we, use the base verb: we play.",
          },
          {
            id: "e1q4",
            prompt: "They ___ in a small flat near the station.",
            options: ["lives", "live", "living", "lived"],
            correctIndex: 1,
            explanation: "With they, use the base verb: they live.",
          },
          {
            id: "e1q5",
            prompt: "I ___ my homework after dinner.",
            options: ["do", "does", "doing", "did"],
            correctIndex: 0,
            explanation: "With I, use the base verb: I do.",
          },
          {
            id: "e1q6",
            prompt: "You ___ very fast when you are late.",
            options: ["walk", "walks", "walking", "walked"],
            correctIndex: 0,
            explanation: "With you, use the base verb: you walk.",
          },
          {
            id: "e1q7",
            prompt: "We ___ lunch together at school.",
            options: ["eats", "eat", "eating", "ate"],
            correctIndex: 1,
            explanation: "With we, use the base verb: we eat.",
          },
          {
            id: "e1q8",
            prompt: "They ___ TV in the evening after work.",
            options: ["watch", "watches", "watched", "watching"],
            correctIndex: 0,
            explanation: "With they, use the base verb: they watch.",
          },
          {
            id: "e1q9",
            prompt: "I ___ my grandparents every weekend.",
            options: ["visiting", "visited", "visit", "visits"],
            correctIndex: 2,
            explanation: "With I, use the base verb: I visit.",
          },
          {
            id: "e1q10",
            prompt: "We ___ to music in the car.",
            options: ["listen", "listens", "listening", "listened"],
            correctIndex: 0,
            explanation: "With we, use the base verb: we listen.",
          },
        ],
      },

      // EX 2: input - type correct base verb
      2: {
        type: "input",
        title: "Exercise 2 (Medium) — Type the correct verb",
        instructions: "Type the correct base verb for the Present Simple (I / you / we / they).",
        questions: [
          {
            id: "e2q1",
            prompt: "I ___ in Poznań with my family. (live)",
            correct: "live",
            explanation: "With I, use the base verb: I live.",
          },
          {
            id: "e2q2",
            prompt: "You ___ your school bag every evening. (pack)",
            correct: "pack",
            explanation: "With you, use the base verb: you pack.",
          },
          {
            id: "e2q3",
            prompt: "We ___ breakfast at 7 o'clock. (eat)",
            correct: "eat",
            explanation: "With we, use the base verb: we eat.",
          },
          {
            id: "e2q4",
            prompt: "They ___ in a bank in the city centre. (work)",
            correct: "work",
            explanation: "With they, use the base verb: they work.",
          },
          {
            id: "e2q5",
            prompt: "I ___ books in the library every week. (read)",
            correct: "read",
            explanation: "With I, use the base verb: I read.",
          },
          {
            id: "e2q6",
            prompt: "We ___ to school by bus every day. (go)",
            correct: "go",
            explanation: "With we, use the base verb: we go.",
          },
          {
            id: "e2q7",
            prompt: "You ___ your friends after school. (meet)",
            correct: "meet",
            explanation: "With you, use the base verb: you meet.",
          },
          {
            id: "e2q8",
            prompt: "They ___ Italian and French at home. (speak)",
            correct: "speak",
            explanation: "With they, use the base verb: they speak.",
          },
          {
            id: "e2q9",
            prompt: "I ___ coffee but I don't like tea. (like)",
            correct: "like",
            explanation: "With I, use the base verb: I like.",
          },
          {
            id: "e2q10",
            prompt: "We ___ dinner at 6 o'clock. (cook)",
            correct: "cook",
            explanation: "With we, use the base verb: we cook.",
          },
        ],
      },

      // EX 3: MCQ - mixed routines, distractors with -s
      3: {
        type: "mcq",
        title: "Exercise 3 (Harder) — Pick the correct Present Simple form",
        instructions: "Choose the correct verb form for I / you / we / they.",
        questions: [
          {
            id: "e3q1",
            prompt: "They ___ to music every morning.",
            options: ["listens", "listen", "listened", "listening"],
            correctIndex: 1,
            explanation: "With they, use the base verb: they listen.",
          },
          {
            id: "e3q2",
            prompt: "We ___ our friends at the weekend.",
            options: ["meets", "meet", "meeting", "met"],
            correctIndex: 1,
            explanation: "With we, use the base verb: we meet.",
          },
          {
            id: "e3q3",
            prompt: "You ___ a sandwich for lunch every day.",
            options: ["eat", "eats", "ate", "eating"],
            correctIndex: 0,
            explanation: "With you, use the base verb: you eat.",
          },
          {
            id: "e3q4",
            prompt: "I ___ to the gym after work.",
            options: ["go", "goes", "going", "gone"],
            correctIndex: 0,
            explanation: "With I, use the base verb: I go.",
          },
          {
            id: "e3q5",
            prompt: "They ___ TV in the living room.",
            options: ["watch", "watches", "watched", "watching"],
            correctIndex: 0,
            explanation: "With they, use the base verb: they watch.",
          },
          {
            id: "e3q6",
            prompt: "We ___ school at 8 o'clock.",
            options: ["start", "starts", "started", "starting"],
            correctIndex: 0,
            explanation: "With we, use the base verb: we start.",
          },
          {
            id: "e3q7",
            prompt: "I ___ orange juice in the morning.",
            options: ["drinks", "drink", "drank", "drinking"],
            correctIndex: 1,
            explanation: "With I, use the base verb: I drink.",
          },
          {
            id: "e3q8",
            prompt: "You ___ your little brother with his homework.",
            options: ["help", "helps", "helped", "helping"],
            correctIndex: 0,
            explanation: "With you, use the base verb: you help.",
          },
          {
            id: "e3q9",
            prompt: "We ___ books in English class.",
            options: ["read", "reads", "reading", "readed"],
            correctIndex: 0,
            explanation: "With we, use the base verb: we read.",
          },
          {
            id: "e3q10",
            prompt: "They ___ home at 5 o'clock.",
            options: ["leave", "leaves", "leaving", "left"],
            correctIndex: 0,
            explanation: "With they, use the base verb: they leave.",
          },
        ],
      },

      // EX 4: input - complete full sentences
      4: {
        type: "input",
        title: "Exercise 4 (Challenge) — Complete the sentences",
        instructions: "Complete the sentences in Present Simple (I / you / we / they).",
        questions: [
          {
            id: "e4q1",
            prompt: "I ___ to school by bike every day.",
            correct: "go",
            explanation: "With I, use the base verb: I go.",
          },
          {
            id: "e4q2",
            prompt: "You ___ very well in English class.",
            correct: "speak",
            explanation: "With you, use the base verb: you speak.",
          },
          {
            id: "e4q3",
            prompt: "We ___ our lessons after lunch.",
            correct: "start",
            explanation: "With we, use the base verb: we start.",
          },
          {
            id: "e4q4",
            prompt: "They ___ in a big house near the park.",
            correct: "live",
            explanation: "With they, use the base verb: they live.",
          },
          {
            id: "e4q5",
            prompt: "I ___ chocolate but I don't like sweets.",
            correct: "like",
            explanation: "With I, use the base verb: I like.",
          },
          {
            id: "e4q6",
            prompt: "We ___ TV together in the evening.",
            correct: "watch",
            explanation: "With we, use the base verb: we watch.",
          },
          {
            id: "e4q7",
            prompt: "You ___ your keys on the table every day.",
            correct: "put",
            explanation: "With you, use the base verb: you put.",
          },
          {
            id: "e4q8",
            prompt: "They ___ pizza on Fridays.",
            correct: "eat",
            explanation: "With they, use the base verb: they eat.",
          },
          {
            id: "e4q9",
            prompt: "I ___ music when I study.",
            correct: "listen",
            explanation: "With I, use the base verb: I listen.",
          },
          {
            id: "e4q10",
            prompt: "We ___ our homework before dinner.",
            correct: "do",
            explanation: "With we, use the base verb: we do.",
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
        title: "Present Simple",
        subtitle: "I / You / We / They — 4 exercises + answer key",
        level: "A1",
        keyRule: "Use the base verb (no -s) with I, you, we, they: I work. They live. We play.",
        exercises: [
          {
            number: 1, title: "Exercise 1", difficulty: "Easy",
            instruction: "Choose the correct verb form (I / you / we / they).",
            questions: [
              "I ___ tea every morning before work. (drink / drinks)",
              "You ___ English at school every week. (study / studies)",
              "We ___ football in the park on Sundays. (play / plays)",
              "They ___ in a small flat near the station. (live / lives)",
              "I ___ my homework after dinner. (do / does)",
              "You ___ very fast when you are late. (walk / walks)",
              "We ___ lunch together at school. (eat / eats)",
              "They ___ TV in the evening after work. (watch / watches)",
              "I ___ my grandparents every weekend. (visit / visits)",
              "We ___ to music in the car. (listen / listens)",
            ],
          },
          {
            number: 2, title: "Exercise 2", difficulty: "Medium",
            instruction: "Type the correct base verb in Present Simple (I / you / we / they).",
            questions: [
              "I ___ in Poznań with my family. (live)",
              "You ___ your school bag every evening. (pack)",
              "We ___ breakfast at 7 o'clock. (eat)",
              "They ___ in a bank in the city centre. (work)",
              "I ___ books in the library every week. (read)",
              "We ___ to school by bus every day. (go)",
              "You ___ your friends after school. (meet)",
              "They ___ Italian and French at home. (speak)",
              "I ___ coffee but I don't like tea. (like)",
              "We ___ dinner at 6 o'clock. (cook)",
            ],
          },
          {
            number: 3, title: "Exercise 3", difficulty: "Hard",
            instruction: "Choose the correct Present Simple form for I / you / we / they.",
            questions: [
              "They ___ to music every morning. (listen / listens)",
              "We ___ our friends at the weekend. (meet / meets)",
              "You ___ a sandwich for lunch every day. (eat / eats)",
              "I ___ to the gym after work. (go / goes)",
              "They ___ TV in the living room. (watch / watches)",
              "We ___ school at 8 o'clock. (start / starts)",
              "I ___ orange juice in the morning. (drink / drinks)",
              "You ___ your little brother with homework. (help / helps)",
              "We ___ books in English class. (read / reads)",
              "They ___ home at 5 o'clock. (leave / leaves)",
            ],
          },
          {
            number: 4, title: "Exercise 4", difficulty: "Harder",
            instruction: "Complete the sentence with the correct base verb.",
            questions: [
              "I ___ to school by bike every day. (go)",
              "You ___ very well in English class. (speak)",
              "We ___ our lessons after lunch. (start)",
              "They ___ in a big house near the park. (live)",
              "I ___ chocolate but I don't like sweets. (like)",
              "We ___ TV together in the evening. (watch)",
              "You ___ your keys on the table every day. (put)",
              "They ___ pizza on Fridays. (eat)",
              "I ___ music when I study. (listen)",
              "We ___ our homework before dinner. (do)",
            ],
          },
        ],
        answerKey: [
          { exercise: 1, subtitle: "Easy — choose correct verb form", answers: ["drink","study","play","live","do","walk","eat","watch","visit","listen"] },
          { exercise: 2, subtitle: "Medium — type the base verb", answers: ["live","pack","eat","work","read","go","meet","speak","like","cook"] },
          { exercise: 3, subtitle: "Hard — choose correct form", answers: ["listen","meet","eat","go","watch","start","drink","help","read","leave"] },
          { exercise: 4, subtitle: "Harder — complete the sentence", answers: ["go","speak","start","live","like","watch","put","eat","listen","do"] },
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
        <span className="text-slate-700 font-medium">Present Simple (I / you / we / they)</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Present Simple <span className="font-extrabold">(I / you / we / they)</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Learn how to use the Present Simple for <b>I</b>, <b>you</b>, <b>we</b>, and <b>they</b>. Practice with 4 easy exercises!
      </p>

      {/* Layout: left col + center content + right col */}
      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="sticky top-24">
            <SpeedRound gameId="grammar-a1-present-simple-i-you-we-they" subject="Present Simple (I/you/we/they)" questions={SPEED_QUESTIONS} variant="sidebar" />
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
        <a
          href="/grammar/a1"
          className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
        >
          ← All A1 topics
        </a>
        <a
          href="/grammar/a1/present-simple-he-she-it"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: Present Simple (he/she/it) →
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Present Simple — I / You / We / They</h2>
        <p className="text-slate-500 text-sm">Use the base verb (no -s) for routines, habits, and facts with I, you, we, and they.</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Affirmative */}
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✅</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Affirmative</span>
          </div>
          <Formula parts={[{ text: "I/you/we/they", color: "green" }, { dim: true, text: "+" }, { text: "verb", color: "sky" }, { dim: true, text: "+" }, { text: "rest" }]} />
          <div className="mt-3 space-y-2">
            <Ex en="I work every day." />
            <Ex en="We play football." />
            <Ex en="They eat at noon." />
          </div>
        </div>

        {/* Negative */}
        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❌</span>
            <span className="text-sm font-black text-red-700 uppercase tracking-widest">Negative</span>
          </div>
          <Formula parts={[{ text: "I/you/we/they", color: "green" }, { dim: true, text: "+" }, { text: "don't", color: "red" }, { dim: true, text: "+" }, { text: "verb" }]} />
          <div className="mt-3 space-y-2">
            <Ex en="I don't work on Sundays." />
            <Ex en="We don't eat meat." />
            <Ex en="They don't like tea." />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❓</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Question</span>
          </div>
          <Formula parts={[{ text: "Do", color: "sky" }, { dim: true, text: "+" }, { text: "I/you/we/they", color: "green" }, { dim: true, text: "+" }, { text: "verb ?" }]} />
          <div className="mt-3 space-y-2">
            <Ex en="Do you live here?" />
            <Ex en="Do we have class today?" />
            <Ex en="Do they speak English?" />
          </div>
        </div>
      </div>

      {/* Reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Quick reference — all four subjects</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 pr-4 font-black text-slate-700">Subject</th>
                <th className="text-left py-2 pr-4 font-black text-slate-700">+ Affirmative</th>
                <th className="text-left py-2 pr-4 font-black text-slate-700">− Negative</th>
                <th className="text-left py-2 font-black text-slate-700">? Question</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr><td className="py-2 pr-4 font-bold text-slate-900">I</td><td className="py-2 pr-4 text-slate-700">I <b>work</b> here.</td><td className="py-2 pr-4 text-slate-700">I <b>don't work</b> there.</td><td className="py-2 text-slate-700"><b>Do</b> I work here?</td></tr>
              <tr><td className="py-2 pr-4 font-bold text-slate-900">you</td><td className="py-2 pr-4 text-slate-700">You <b>live</b> here.</td><td className="py-2 pr-4 text-slate-700">You <b>don't live</b> there.</td><td className="py-2 text-slate-700"><b>Do</b> you live here?</td></tr>
              <tr><td className="py-2 pr-4 font-bold text-slate-900">we</td><td className="py-2 pr-4 text-slate-700">We <b>play</b> football.</td><td className="py-2 pr-4 text-slate-700">We <b>don't play</b> tennis.</td><td className="py-2 text-slate-700"><b>Do</b> we play today?</td></tr>
              <tr><td className="py-2 pr-4 font-bold text-slate-900">they</td><td className="py-2 pr-4 text-slate-700">They <b>eat</b> at noon.</td><td className="py-2 pr-4 text-slate-700">They <b>don't eat</b> meat.</td><td className="py-2 text-slate-700"><b>Do</b> they eat here?</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Verb grid */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sm font-black text-sky-700">V</span>
          <h3 className="font-black text-slate-900">Common verbs — always base form with I/you/we/they</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {["work", "live", "go", "eat", "drink", "like", "play", "watch", "know", "read"].map((v) => (
            <span key={v} className="rounded-lg px-3 py-1.5 text-xs font-black border bg-sky-100 text-sky-800 border-sky-200">{v}</span>
          ))}
        </div>
      </div>

      {/* Time expressions */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF3A3] text-sm font-black text-amber-700">⏱</span>
          <h3 className="font-black text-slate-900">Time expressions for Present Simple</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {["every day", "every week", "always", "usually", "often", "sometimes", "never", "on Mondays", "in the morning"].map((t) => (
            <span key={t} className="rounded-lg px-3 py-1.5 text-xs font-black border bg-[#FFF3A3] text-amber-800 border-amber-300">{t}</span>
          ))}
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <b>⚠ Key point:</b> Never add <b>-s</b> to the verb with I / you / we / they. That -s is only for he / she / it. Also use <b>do</b> (not <i>does</i>) to form questions and negatives with these subjects.
      </div>
    </div>
  );
}