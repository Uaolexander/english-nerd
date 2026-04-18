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
  { q: "My little brother is only two, so he ___ read yet.", options: ["can","can't","could","couldn't"], answer: 1 },
  { q: "I ___ swim very well because I go to the pool every week.", options: ["can't","could","can","cannot"], answer: 2 },
  { q: "Emma ___ speak English and Polish at home.", options: ["can't","can","could not","never"], answer: 1 },
  { q: "It is very dark and I ___ see the board clearly.", options: ["can","can't","could","always"], answer: 1 },
  { q: "___ you help me with this heavy bag, please?", options: ["Can't","Could not","Can","Cant"], answer: 2 },
  { q: "Can your brother play the guitar? — Yes, he ___.", options: ["can't","could","can","cannot"], answer: 2 },
  { q: "Can we open the window? — No, you ___. It is too cold.", options: ["can","can't","could","might"], answer: 1 },
  { q: "My grandmother ___ drive, so my dad takes her shopping.", options: ["can","could","can't","always"], answer: 2 },
  { q: "We ___ be late — the lesson starts in five minutes.", options: ["can","can't","could","should"], answer: 1 },
  { q: "Tom ___ ride a bike, so he walks to school every day.", options: ["can","can't","could","might"], answer: 1 },
  { q: "You ___ sit here if you want to be closer to the teacher.", options: ["can't","cannot","can","could not"], answer: 2 },
  { q: "___ I sit next to you during the lesson?", options: ["Can't","Cannot","Could not","Can"], answer: 3 },
  { q: "Can I borrow your ruler? — Yes, you ___.", options: ["can't","cannot","can","could not"], answer: 2 },
  { q: "My baby cousin ___ talk yet, but she understands many words.", options: ["can","could","can't","might"], answer: 2 },
  { q: "I ___ find my keys, so I am still at home.", options: ["can","could","can't","might"], answer: 2 },
  { q: "We ___ meet after class if you are free.", options: ["can't","can","cannot","could not"], answer: 1 },
  { q: "Can this computer open large files? — No, it ___.", options: ["can","could","can't","might"], answer: 2 },
  { q: "I ___ draw animals quite well, especially cats and birds.", options: ["can't","cannot","can","could not"], answer: 2 },
  { q: "We ___ play outside now because it is getting dark.", options: ["can","could","can't","might"], answer: 2 },
  { q: "___ your little sister count to twenty now?", options: ["Can't","Cannot","Could not","Can"], answer: 3 },
];

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Have / Has Got", href: "/grammar/a1/have-has-got", img: "/topics/a1/have-has-got.jpg", level: "A1", badge: "bg-emerald-500", reason: "Another key modal-like verb" },
  { title: "Present Simple (I/you/we/they)", href: "/grammar/a1/present-simple-i-you-we-they", img: "/topics/a1/present-simple-i-you-we-they.jpg", level: "A1", badge: "bg-emerald-500" },
  { title: "Wh- Questions", href: "/grammar/a1/wh-questions", img: "/topics/a1/wh-questions.jpg", level: "A1", badge: "bg-emerald-500" },
];

export default function CanCantLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      1: {
        type: "mcq",
        title: "Exercise 1 (Easy) — Choose can or can't",
        instructions: "Choose the correct word: can or can't.",
        questions: [
          {
            id: "e1q1",
            prompt: "My little brother is only two, so he ___ read long books yet.",
            options: ["can", "can't"],
            correctIndex: 1,
            explanation: "A two-year-old usually cannot read, so we use can't.",
          },
          {
            id: "e1q2",
            prompt: "I ___ swim very well because I go to the pool every week.",
            options: ["can", "can't"],
            correctIndex: 0,
            explanation: "This sentence shows ability, so can is correct.",
          },
          {
            id: "e1q3",
            prompt: "We ___ play football in the park after school today.",
            options: ["can", "can't"],
            correctIndex: 0,
            explanation: "This sentence talks about possibility or permission, so can fits.",
          },
          {
            id: "e1q4",
            prompt: "My grandmother ___ drive a car, so my dad takes her shopping.",
            options: ["can", "can't"],
            correctIndex: 1,
            explanation: "She does not have this ability, so can't is correct.",
          },
          {
            id: "e1q5",
            prompt: "You ___ sit here if you want to be closer to the teacher.",
            options: ["can", "can't"],
            correctIndex: 0,
            explanation: "This sentence gives permission, so we use can.",
          },
          {
            id: "e1q6",
            prompt: "It is very dark in this room, and I ___ see the board clearly.",
            options: ["can", "can't"],
            correctIndex: 1,
            explanation: "If it is too dark, you cannot see clearly, so can't is correct.",
          },
          {
            id: "e1q7",
            prompt: "Emma ___ speak English and Polish at home.",
            options: ["can", "can't"],
            correctIndex: 0,
            explanation: "This is a positive ability sentence, so we use can.",
          },
          {
            id: "e1q8",
            prompt: "We ___ be late today because the lesson starts in five minutes.",
            options: ["can", "can't"],
            correctIndex: 1,
            explanation: "Here the meaning is negative possibility, so can't works best.",
          },
          {
            id: "e1q9",
            prompt: "My cat ___ open the door, but it often tries.",
            options: ["can", "can't"],
            correctIndex: 1,
            explanation: "A cat usually cannot open a door, so can't is correct.",
          },
          {
            id: "e1q10",
            prompt: "I ___ help you with your homework after dinner.",
            options: ["can", "can't"],
            correctIndex: 0,
            explanation: "This sentence shows possibility to help, so can is right.",
          },
        ],
      },

      2: {
        type: "input",
        title: "Exercise 2 (Medium) — Type can or can't",
        instructions: "Write can or can't.",
        questions: [
          {
            id: "e2q1",
            prompt: "My sister ___ cook simple meals, but she is still learning.",
            correct: "can",
            explanation: "This sentence shows ability, so can is correct.",
          },
          {
            id: "e2q2",
            prompt: "I ___ hear you very well because the music is too loud.",
            correct: "can't",
            explanation: "The speaker cannot hear well, so can't is correct.",
          },
          {
            id: "e2q3",
            prompt: "You ___ use my pencil if yours is at home.",
            correct: "can",
            explanation: "This gives permission, so can is right.",
          },
          {
            id: "e2q4",
            prompt: "Tom ___ ride a bike, so he walks to school every day.",
            correct: "can't",
            explanation: "He does not have this ability, so can't is correct.",
          },
          {
            id: "e2q5",
            prompt: "We ___ meet after class if you are free this afternoon.",
            correct: "can",
            explanation: "This shows possibility, so can works here.",
          },
          {
            id: "e2q6",
            prompt: "My baby cousin ___ talk yet, but she understands many words.",
            correct: "can't",
            explanation: "A baby usually cannot talk yet, so can't is correct.",
          },
          {
            id: "e2q7",
            prompt: "I ___ answer that question because I know the rule.",
            correct: "can",
            explanation: "The speaker has the ability to answer, so can is right.",
          },
          {
            id: "e2q8",
            prompt: "We ___ go outside now because it is raining very hard.",
            correct: "can't",
            explanation: "This shows negative possibility, so can't is correct.",
          },
          {
            id: "e2q9",
            prompt: "Your dog ___ run very fast in the garden.",
            correct: "can",
            explanation: "This is a positive ability sentence, so can is correct.",
          },
          {
            id: "e2q10",
            prompt: "I ___ find my keys, so I am still at home.",
            correct: "can't",
            explanation: "The speaker cannot find the keys, so can't is correct.",
          },
        ],
      },

      3: {
        type: "mcq",
        title: "Exercise 3 (Hard) — Questions with can",
        instructions: "Choose the correct answer to complete the question or short answer.",
        questions: [
          {
            id: "e3q1",
            prompt: "___ you help me with this heavy bag, please?",
            options: ["Can", "Can't"],
            correctIndex: 0,
            explanation: "We use Can in polite requests: Can you help me?",
          },
          {
            id: "e3q2",
            prompt: "Can your brother play the guitar? — Yes, he ___.",
            options: ["can", "can't"],
            correctIndex: 0,
            explanation: "A positive short answer is: Yes, he can.",
          },
          {
            id: "e3q3",
            prompt: "Can we open the window? — No, you ___. It is too cold.",
            options: ["can", "can't"],
            correctIndex: 1,
            explanation: "A negative short answer is: No, you can't.",
          },
          {
            id: "e3q4",
            prompt: "___ your teacher speak Spanish, or only English?",
            options: ["Can", "Can't"],
            correctIndex: 0,
            explanation: "Questions start with Can: Can your teacher... ?",
          },
          {
            id: "e3q5",
            prompt: "Can your friends come tonight? — No, they ___ because they are busy.",
            options: ["can", "can't"],
            correctIndex: 1,
            explanation: "The answer is negative, so can't is correct.",
          },
          {
            id: "e3q6",
            prompt: "___ I sit next to you during the lesson?",
            options: ["Can", "Can't"],
            correctIndex: 0,
            explanation: "We use Can I... ? to ask for permission.",
          },
          {
            id: "e3q7",
            prompt: "Can this computer open large files? — No, it ___.",
            options: ["can", "can't"],
            correctIndex: 1,
            explanation: "The short answer is negative, so can't is correct.",
          },
          {
            id: "e3q8",
            prompt: "___ your little sister count to twenty now?",
            options: ["Can", "Can't"],
            correctIndex: 0,
            explanation: "Questions with ability use Can.",
          },
          {
            id: "e3q9",
            prompt: "Can I borrow your ruler? — Yes, you ___.",
            options: ["can", "can't"],
            correctIndex: 0,
            explanation: "A positive short answer is: Yes, you can.",
          },
          {
            id: "e3q10",
            prompt: "___ they finish the project today, or do they need more time?",
            options: ["Can", "Can't"],
            correctIndex: 0,
            explanation: "This is a question about possibility, so use Can.",
          },
        ],
      },

      4: {
        type: "input",
        title: "Exercise 4 (Harder) — Complete the sentence",
        instructions: "Write can or can't.",
        questions: [
          {
            id: "e4q1",
            prompt: "My father ___ fix many things at home because he is very practical.",
            correct: "can",
            explanation: "This sentence shows ability, so can is correct.",
          },
          {
            id: "e4q2",
            prompt: "I ___ carry this box alone because it is too heavy for me.",
            correct: "can't",
            explanation: "The speaker is not able to carry it, so can't is correct.",
          },
          {
            id: "e4q3",
            prompt: "You ___ come with us after school if your parents say yes.",
            correct: "can",
            explanation: "This gives permission or possibility, so can is correct.",
          },
          {
            id: "e4q4",
            prompt: "Our baby ___ walk yet, but she can stand for a short time.",
            correct: "can't",
            explanation: "Not able yet, so can't is correct.",
          },
          {
            id: "e4q5",
            prompt: "We ___ speak quietly here because the baby is asleep.",
            correct: "can",
            explanation: "This sentence shows possibility, so can is right.",
          },
          {
            id: "e4q6",
            prompt: "My grandparents ___ visit us this weekend because they are travelling.",
            correct: "can't",
            explanation: "They are not able to visit, so can't is correct.",
          },
          {
            id: "e4q7",
            prompt: "I ___ draw animals quite well, especially cats and birds.",
            correct: "can",
            explanation: "This sentence talks about ability, so can is correct.",
          },
          {
            id: "e4q8",
            prompt: "We ___ play outside now because it is getting dark.",
            correct: "can't",
            explanation: "This is negative possibility, so can't is correct.",
          },
          {
            id: "e4q9",
            prompt: "My classmates ___ understand this topic now because the teacher explained it clearly.",
            correct: "can",
            explanation: "They are able to understand it, so can is correct.",
          },
          {
            id: "e4q10",
            prompt: "I ___ open the door because my hands are full of shopping bags.",
            correct: "can't",
            explanation: "The speaker is not able to do it now, so can't is correct.",
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
        title: "Can / Can't",
        subtitle: "Ability, Permission & Possibility — 4 exercises + answer key",
        level: "A1",
        keyRule: "can / can't + base verb (no -s, no -ed). Questions: Can + subject + base verb?",
        exercises: [
          {
            number: 1, title: "Exercise 1", difficulty: "Easy",
            instruction: "Choose can or can't to complete the sentence.",
            questions: [
              "My little brother is only two, so he ___ read long books yet.",
              "I ___ swim very well because I go to the pool every week.",
              "We ___ play football in the park after school today.",
              "My grandmother ___ drive a car, so my dad takes her shopping.",
              "You ___ sit here if you want to be closer to the teacher.",
              "It is very dark in this room, and I ___ see the board clearly.",
              "Emma ___ speak English and Polish at home.",
              "We ___ be late today because the lesson starts in five minutes.",
              "My cat ___ open the door, but it often tries.",
              "I ___ help you with your homework after dinner.",
            ],
            hint: "can / can't",
          },
          {
            number: 2, title: "Exercise 2", difficulty: "Medium",
            instruction: "Write can or can't in the blank.",
            questions: [
              "My sister ___ cook simple meals, but she is still learning.",
              "I ___ hear you very well because the music is too loud.",
              "You ___ use my pencil if yours is at home.",
              "Tom ___ ride a bike, so he walks to school every day.",
              "We ___ meet after class if you are free this afternoon.",
              "My baby cousin ___ talk yet, but she understands many words.",
              "I ___ answer that question because I know the rule.",
              "We ___ go outside now because it is raining very hard.",
              "Your dog ___ run very fast in the garden.",
              "I ___ find my keys, so I am still at home.",
            ],
            hint: "can / can't",
          },
          {
            number: 3, title: "Exercise 3", difficulty: "Hard",
            instruction: "Choose Can or Can't / can or can't to complete the question or answer.",
            questions: [
              "___ you help me with this heavy bag, please?",
              "Can your brother play the guitar? — Yes, he ___.",
              "Can we open the window? — No, you ___. It is too cold.",
              "___ your teacher speak Spanish, or only English?",
              "Can your friends come tonight? — No, they ___ because they are busy.",
              "___ I sit next to you during the lesson?",
              "Can this computer open large files? — No, it ___.",
              "___ your little sister count to twenty now?",
              "Can I borrow your ruler? — Yes, you ___.",
              "___ they finish the project today, or do they need more time?",
            ],
            hint: "Can / can't",
          },
          {
            number: 4, title: "Exercise 4", difficulty: "Harder",
            instruction: "Write can or can't in the blank.",
            questions: [
              "My father ___ fix many things at home because he is very practical.",
              "I ___ carry this box alone because it is too heavy for me.",
              "You ___ come with us after school if your parents say yes.",
              "Our baby ___ walk yet, but she can stand for a short time.",
              "We ___ speak quietly here because the baby is asleep.",
              "My grandparents ___ visit us this weekend because they are travelling.",
              "I ___ draw animals quite well, especially cats and birds.",
              "We ___ play outside now because it is getting dark.",
              "My classmates ___ understand this topic now — the teacher explained it.",
              "I ___ open the door because my hands are full of shopping bags.",
            ],
            hint: "can / can't",
          },
        ],
        answerKey: [
          { exercise: 1, subtitle: "Easy — can or can't", answers: ["can't","can","can","can't","can","can't","can","can't","can't","can"] },
          { exercise: 2, subtitle: "Medium — write can or can't", answers: ["can","can't","can","can't","can","can't","can","can't","can","can't"] },
          { exercise: 3, subtitle: "Hard — questions & short answers", answers: ["Can","can","can't","Can","can't","Can","can't","Can","can","Can"] },
          { exercise: 4, subtitle: "Harder — complete the sentence", answers: ["can","can't","can","can't","can","can't","can","can't","can","can't"] },
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
        <span className="text-slate-700 font-medium">Can / Can't</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Can / Can't <span className="font-extrabold">— A1 basics</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Use <b>can</b> to talk about ability, permission, and possibility. Use <b>can't</b> when something is not possible or someone is not able to do it.
      </p>

      {/* Layout: left sidebar + center content + right sidebar */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="">
            <SpeedRound gameId="grammar-a1-can-cant" subject="Can / Can't" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          href="/grammar/a1/have-has-got"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: Have / Has got →
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Can / Can't — Ability &amp; Permission</h2>
        <p className="text-slate-500 text-sm">One simple modal verb — same for every subject, no exceptions.</p>
      </div>

      {/* Affirmative card */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-widest text-emerald-700">Affirmative</div>
        <Formula parts={[
          { text: "Subject", color: "slate" },
          { dim: true },
          { text: "can", color: "green" },
          { dim: true },
          { text: "verb", color: "sky" },
          { dim: true },
          { text: "rest", color: "slate" },
        ]} />
        <div className="grid gap-2 md:grid-cols-2 pt-1">
          <Ex en="I can swim." />
          <Ex en="She can drive." />
          <Ex en="He can cook." />
          <Ex en="They can help." />
        </div>
      </div>

      {/* Negative card */}
      <div className="rounded-2xl border border-red-200 bg-gradient-to-b from-red-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-widest text-red-600">Negative</div>
        <Formula parts={[
          { text: "Subject", color: "slate" },
          { dim: true },
          { text: "can't / cannot", color: "red" },
          { dim: true },
          { text: "verb", color: "sky" },
        ]} />
        <div className="grid gap-2 md:grid-cols-2 pt-1">
          <Ex en="He can't fly." />
          <Ex en="They cannot wait." />
          <Ex en="I can't come tonight." />
          <Ex en="We can't see anything." />
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-widest text-sky-700">Question</div>
        <Formula parts={[
          { text: "Can", color: "sky" },
          { dim: true },
          { text: "subject", color: "slate" },
          { dim: true },
          { text: "verb", color: "sky" },
          { dim: true },
          { text: "?", color: "slate" },
        ]} />
        <div className="grid gap-2 md:grid-cols-2 pt-1">
          <Ex en="Can you help me?" />
          <Ex en="Can she cook?" />
          <Ex en="Can I leave now?" />
          <Ex en="Can they come?" />
        </div>
        <div className="text-xs text-slate-500 pt-1 font-semibold">Short answers: Yes, I can. / No, I can't. / Yes, she can. / No, she can't.</div>
      </div>

      {/* Key rule — same for all subjects */}
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50 to-white p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-widest text-violet-700">Key rule — same for ALL subjects</div>
        <p className="text-sm text-slate-600">No -s for he/she/it. Can never changes.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-black/10">
                <th className="py-2 pr-4 text-left text-xs font-black text-slate-500 uppercase">Subject</th>
                <th className="py-2 pr-4 text-left text-xs font-black text-slate-500 uppercase">Positive</th>
                <th className="py-2 text-left text-xs font-black text-slate-500 uppercase">Negative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I", "I can swim", "I can't swim"],
                ["you", "You can drive", "You can't drive"],
                ["he / she / it", "She can cook", "He can't fly"],
                ["we / they", "They can help", "We can't wait"],
              ].map(([subj, pos, neg]) => (
                <tr key={subj}>
                  <td className="py-2.5 pr-4 font-black text-slate-700">{subj}</td>
                  <td className="py-2.5 pr-4 text-slate-700">{pos}</td>
                  <td className="py-2.5 text-slate-700">{neg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Usage cards */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Three uses of can</div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 bg-white p-4 space-y-2">
            <div className="text-xs font-black text-emerald-700 uppercase">Ability</div>
            <Ex en="I can swim." />
            <Ex en="She can speak French." />
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4 space-y-2">
            <div className="text-xs font-black text-sky-700 uppercase">Permission</div>
            <Ex en="Can I leave?" />
            <Ex en="You can use my pen." />
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4 space-y-2">
            <div className="text-xs font-black text-violet-700 uppercase">Request</div>
            <Ex en="Can you help me?" />
            <Ex en="Can you open the window?" />
          </div>
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <span className="font-black">Warning:</span> After <strong>can</strong> always use the infinitive WITHOUT "to".
        <div className="mt-2 space-y-1">
          <Ex en="I can swim." />
          <Ex en="I can to swim." correct={false} />
        </div>
      </div>
    </div>
  );
}