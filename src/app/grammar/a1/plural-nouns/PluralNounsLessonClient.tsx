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
  { q: "one book → two ___", options: ["book","books","bookes","bookies"], answer: 1 },
  { q: "one bus → two ___", options: ["bus","buss","buses","busis"], answer: 2 },
  { q: "one child → two ___", options: ["childs","childen","children","childes"], answer: 2 },
  { q: "one city → two ___", options: ["citys","cities","cityes","citeis"], answer: 1 },
  { q: "one man → two ___", options: ["mans","manes","men","mans"], answer: 2 },
  { q: "one tooth → two ___", options: ["tooths","teethes","toothes","teeth"], answer: 3 },
  { q: "one potato → two ___", options: ["potatos","potato","potatoes","potatois"], answer: 2 },
  { q: "one leaf → two ___", options: ["leafs","leaves","leafes","leafis"], answer: 1 },
  { q: "one woman → two ___", options: ["womans","wemen","women","womens"], answer: 2 },
  { q: "one box → two ___", options: ["box","boxs","boxis","boxes"], answer: 3 },
  { q: "one mouse → two ___", options: ["mouses","mice","mices","mousis"], answer: 1 },
  { q: "one foot → two ___", options: ["foots","feets","feet","footes"], answer: 2 },
  { q: "one baby → two ___", options: ["babys","babies","babyes","babyies"], answer: 1 },
  { q: "one knife → two ___", options: ["knifes","knifis","knives","knivis"], answer: 2 },
  { q: "one sheep → two ___", options: ["sheeps","sheeps","sheepes","sheep"], answer: 3 },
  { q: "one church → two ___", options: ["churchs","church","churches","churchies"], answer: 2 },
  { q: "one person → two ___", options: ["persons","peoples","people","persones"], answer: 2 },
  { q: "one dish → two ___", options: ["dishs","dishes","dishis","dishse"], answer: 1 },
  { q: "one fish → two ___", options: ["fishes","fishs","fish","fishis"], answer: 2 },
  { q: "one ox → two ___", options: ["oxs","oxes","oxen","oxis"], answer: 2 },
];

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Subject Pronouns", href: "/grammar/a1/subject-pronouns", img: "/topics/a1/subject-pronouns.jpg", level: "A1", badge: "bg-emerald-500", reason: "Essential before plurals" },
  { title: "Articles: a / an", href: "/grammar/a1/articles-a-an", img: "/topics/a1/articles-a-an.jpg", level: "A1", badge: "bg-emerald-500" },
  { title: "This / That / These / Those", href: "/grammar/a1/this-that-these-those", img: "/topics/a1/this-that-these-those.jpg", level: "A1", badge: "bg-emerald-500" },
];

export default function PluralNounsLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      // EX 1: easy — regular plurals
      1: {
        type: "mcq",
        title: "Exercise 1 (Easy) — Choose the plural form",
        instructions: "Choose the correct plural form.",
        questions: [
          {
            id: "e1q1",
            prompt: "one book → two ____",
            options: ["book", "books"],
            correctIndex: 1,
            explanation: "Most nouns add -s: book → books.",
          },
          {
            id: "e1q2",
            prompt: "one cat → three ____",
            options: ["cats", "cates"],
            correctIndex: 0,
            explanation: "Add -s: cat → cats.",
          },
          {
            id: "e1q3",
            prompt: "one bus → two ____",
            options: ["buses", "bus"],
            correctIndex: 0,
            explanation: "Nouns ending in -s add -es: bus → buses.",
          },
          {
            id: "e1q4",
            prompt: "one box → five ____",
            options: ["boxs", "boxes"],
            correctIndex: 1,
            explanation: "Nouns ending in -x add -es: box → boxes.",
          },
          {
            id: "e1q5",
            prompt: "one watch → two ____",
            options: ["watches", "watchs"],
            correctIndex: 0,
            explanation: "Nouns ending in -ch add -es: watch → watches.",
          },
          {
            id: "e1q6",
            prompt: "one dish → four ____",
            options: ["dishes", "dishs"],
            correctIndex: 0,
            explanation: "Nouns ending in -sh add -es: dish → dishes.",
          },
          {
            id: "e1q7",
            prompt: "one baby → two ____",
            options: ["babys", "babies"],
            correctIndex: 1,
            explanation: "Consonant + y → change y to ies: baby → babies.",
          },
          {
            id: "e1q8",
            prompt: "one city → many ____",
            options: ["cities", "citys"],
            correctIndex: 0,
            explanation: "Consonant + y → ies: city → cities.",
          },
          {
            id: "e1q9",
            prompt: "one day → two ____",
            options: ["daies", "days"],
            correctIndex: 1,
            explanation: "Vowel + y → just add -s: day → days.",
          },
          {
            id: "e1q10",
            prompt: "one toy → three ____",
            options: ["toys", "toies"],
            correctIndex: 0,
            explanation: "Vowel + y → add -s: toy → toys.",
          },
        ],
      },

      // EX 2: medium — type plurals
      2: {
        type: "input",
        title: "Exercise 2 (Medium) — Type the plural",
        instructions: "Write the plural form.",
        questions: [
          {
            id: "e2q1",
            prompt: "one girl → two ____",
            correct: "girls",
            explanation: "Add -s: girl → girls.",
          },
          {
            id: "e2q2",
            prompt: "one class → three ____",
            correct: "classes",
            explanation: "Ends in -ss → add -es: class → classes.",
          },
          {
            id: "e2q3",
            prompt: "one tomato → two ____",
            correct: "tomatoes",
            explanation: "Many nouns ending in -o add -es: tomato → tomatoes.",
          },
          {
            id: "e2q4",
            prompt: "one photo → two ____",
            correct: "photos",
            explanation: "Some -o nouns add -s: photo → photos.",
          },
          {
            id: "e2q5",
            prompt: "one knife → two ____",
            correct: "knives",
            explanation: "Many -fe nouns → -ves: knife → knives.",
          },
          {
            id: "e2q6",
            prompt: "one leaf → many ____",
            correct: "leaves",
            explanation: "Many -f nouns → -ves: leaf → leaves.",
          },
          {
            id: "e2q7",
            prompt: "one party → two ____",
            correct: "parties",
            explanation: "Consonant + y → ies: party → parties.",
          },
          {
            id: "e2q8",
            prompt: "one key → two ____",
            correct: "keys",
            explanation: "Vowel + y → add -s: key → keys.",
          },
          {
            id: "e2q9",
            prompt: "one woman → two ____",
            correct: "women",
            explanation: "Irregular plural: woman → women.",
          },
          {
            id: "e2q10",
            prompt: "one child → three ____",
            correct: "children",
            explanation: "Irregular plural: child → children.",
          },
        ],
      },

      // EX 3: hard — irregulars and tricky ones
      3: {
        type: "mcq",
        title: "Exercise 3 (Hard) — Irregular plurals",
        instructions: "Choose the correct plural form.",
        questions: [
          {
            id: "e3q1",
            prompt: "one man → two ____",
            options: ["mans", "men"],
            correctIndex: 1,
            explanation: "Irregular plural: man → men.",
          },
          {
            id: "e3q2",
            prompt: "one person → two ____",
            options: ["people", "persons"],
            correctIndex: 0,
            explanation: "Common irregular plural: person → people.",
          },
          {
            id: "e3q3",
            prompt: "one foot → two ____",
            options: ["feet", "foots"],
            correctIndex: 0,
            explanation: "Irregular plural: foot → feet.",
          },
          {
            id: "e3q4",
            prompt: "one tooth → two ____",
            options: ["tooths", "teeth"],
            correctIndex: 1,
            explanation: "Irregular plural: tooth → teeth.",
          },
          {
            id: "e3q5",
            prompt: "one mouse → two ____",
            options: ["mice", "mouses"],
            correctIndex: 0,
            explanation: "Irregular plural: mouse → mice.",
          },
          {
            id: "e3q6",
            prompt: "one sheep → two ____",
            options: ["sheeps", "sheep"],
            correctIndex: 1,
            explanation: "Same form: one sheep → two sheep.",
          },
          {
            id: "e3q7",
            prompt: "one fish → two ____",
            options: ["fish", "fishes"],
            correctIndex: 0,
            explanation: "Fish does not change in plural: one fish → two fish.",
          },
          {
            id: "e3q8",
            prompt: "one baby → three ____",
            options: ["babies", "babys"],
            correctIndex: 0,
            explanation: "Consonant + y → ies: baby → babies.",
          },
          {
            id: "e3q9",
            prompt: "one leaf → two ____",
            options: ["leaves", "leafs"],
            correctIndex: 0,
            explanation: "Many -f nouns → -ves: leaf → leaves.",
          },
          {
            id: "e3q10",
            prompt: "one hero → two ____",
            options: ["heros", "heroes"],
            correctIndex: 1,
            explanation: "Many -o nouns add -es: hero → heroes.",
          },
        ],
      },

      // EX 4: harder — complete sentences
      4: {
        type: "input",
        title: "Exercise 4 (Harder) — Complete the sentences",
        instructions: "Write the correct plural noun.",
        questions: [
          {
            id: "e4q1",
            prompt: "There are three ____ in the room. (chair)",
            correct: "chairs",
            explanation: "Regular plural: chair → chairs.",
          },
          {
            id: "e4q2",
            prompt: "Two ____ are playing outside. (child)",
            correct: "children",
            explanation: "Irregular: child → children.",
          },
          {
            id: "e4q3",
            prompt: "I have two ____ . (box)",
            correct: "boxes",
            explanation: "Ends in -x → add -es: box → boxes.",
          },
          {
            id: "e4q4",
            prompt: "My parents have three ____ . (baby)",
            correct: "babies",
            explanation: "Consonant + y → ies: baby → babies.",
          },
          {
            id: "e4q5",
            prompt: "These ____ are very good. (dish)",
            correct: "dishes",
            explanation: "Ends in -sh → add -es: dish → dishes.",
          },
          {
            id: "e4q6",
            prompt: "Two ____ are on the table. (knife)",
            correct: "knives",
            explanation: "-fe → -ves: knife → knives.",
          },
          {
            id: "e4q7",
            prompt: "There are many ____ in the city. (bus)",
            correct: "buses",
            explanation: "Ends in -s → add -es: bus → buses.",
          },
          {
            id: "e4q8",
            prompt: "My ___ are tired. (foot)",
            correct: "feet",
            explanation: "Irregular: foot → feet.",
          },
          {
            id: "e4q9",
            prompt: "Two ____ are reading. (woman)",
            correct: "women",
            explanation: "Irregular: woman → women.",
          },
          {
            id: "e4q10",
            prompt: "I can see five ____ . (sheep)",
            correct: "sheep",
            explanation: "Same form plural: sheep → sheep.",
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
        title: "Plural Nouns",
        subtitle: "Regular & Irregular Plurals — 4 exercises + answer key",
        level: "A1",
        keyRule: "Most nouns: add -s. Nouns ending in -s/-x/-ch/-sh/-o: add -es. Nouns ending in consonant+y: -ies. Irregular: man→men, child→children, tooth→teeth.",
        exercises: [
          {
            number: 1,
            title: "Exercise 1",
            difficulty: "Easy",
            instruction: "Choose the correct plural form.",
            questions: [
              "one book → two ____",
              "one cat → three ____",
              "one bus → two ____",
              "one box → five ____",
              "one watch → two ____",
              "one dish → four ____",
              "one baby → two ____",
              "one city → many ____",
              "one day → two ____",
              "one toy → three ____",
            ],
            hint: "books / cats / buses / boxes / watches / dishes / babies / cities / days / toys",
          },
          {
            number: 2,
            title: "Exercise 2",
            difficulty: "Medium",
            instruction: "Write the plural form.",
            questions: [
              "one girl → two ____",
              "one class → three ____",
              "one tomato → two ____",
              "one photo → two ____",
              "one knife → two ____",
              "one leaf → many ____",
              "one party → two ____",
              "one key → two ____",
              "one woman → two ____",
              "one child → three ____",
            ],
          },
          {
            number: 3,
            title: "Exercise 3",
            difficulty: "Hard",
            instruction: "Choose the correct plural form.",
            questions: [
              "one man → two ____",
              "one person → two ____",
              "one foot → two ____",
              "one tooth → two ____",
              "one mouse → two ____",
              "one sheep → two ____",
              "one fish → two ____",
              "one baby → three ____",
              "one leaf → two ____",
              "one hero → two ____",
            ],
            hint: "men / people / feet / teeth / mice / sheep / fish / babies / leaves / heroes",
          },
          {
            number: 4,
            title: "Exercise 4",
            difficulty: "Harder",
            instruction: "Write the correct plural noun.",
            questions: [
              "There are three ____ in the room. (chair)",
              "Two ____ are playing outside. (child)",
              "I have two ____ . (box)",
              "My parents have three ____ . (baby)",
              "These ____ are very good. (dish)",
              "Two ____ are on the table. (knife)",
              "There are many ____ in the city. (bus)",
              "My ___ are tired. (foot)",
              "Two ____ are reading. (woman)",
              "I can see five ____ . (sheep)",
            ],
          },
        ],
        answerKey: [
          {
            exercise: 1,
            subtitle: "Easy — choose the plural form",
            answers: ["books", "cats", "buses", "boxes", "watches", "dishes", "babies", "cities", "days", "toys"],
          },
          {
            exercise: 2,
            subtitle: "Medium — type the plural",
            answers: ["girls", "classes", "tomatoes", "photos", "knives", "leaves", "parties", "keys", "women", "children"],
          },
          {
            exercise: 3,
            subtitle: "Hard — irregular plurals",
            answers: ["men", "people", "feet", "teeth", "mice", "sheep", "fish", "babies", "leaves", "heroes"],
          },
          {
            exercise: 4,
            subtitle: "Harder — complete the sentences",
            answers: ["chairs", "children", "boxes", "babies", "dishes", "knives", "buses", "feet", "women", "sheep"],
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
  }

  function switchExercise(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setMcqAnswers({});
    setInputAnswers({});
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/a1">Grammar A1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Plural Nouns</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Plural Nouns <span className="font-extrabold">— basics</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Learn how to make nouns plural: <b>-s</b>, <b>-es</b>, <b>-ies</b>, <b>-ves</b>, and common irregular plurals.
      </p>

      {/* Layout: left ad/game + center content + right ad/recommendations */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="sticky top-24">
            <SpeedRound gameId="grammar-a1-plural-nouns" subject="Plural Nouns" questions={SPEED_QUESTIONS} variant="sidebar" />
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
            <AdUnit variant="sidebar-dark" />
          </div>
        )}
      </div>

      {/* SpeedRound below grid for non-PRO users */}
      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-a1-plural-nouns" subject="Plural Nouns" questions={SPEED_QUESTIONS} />
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
          href="/grammar/a1/subject-pronouns"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: Subject pronouns →
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
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Plural Nouns</h2>
        <p className="text-slate-500 text-sm">How to make English nouns plural — regular rules and irregular forms.</p>
      </div>

      {/* 4 rule cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📚</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Most nouns — add -s</span>
          </div>
          <Formula parts={[
            { text: "noun", color: "green" },
            { dim: true },
            { text: "+ s", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="cat → cats" />
            <Ex en="book → books" />
            <Ex en="dog → dogs" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🚌</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">-s / -sh / -ch / -x / -o — add -es</span>
          </div>
          <Formula parts={[
            { text: "noun", color: "sky" },
            { dim: true },
            { text: "+ es", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="bus → buses" />
            <Ex en="dish → dishes" />
            <Ex en="watch → watches" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-b from-violet-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">👶</span>
            <span className="text-sm font-black text-violet-700 uppercase tracking-widest">Consonant + -y → -ies</span>
          </div>
          <Formula parts={[
            { text: "consonant", color: "violet" },
            { dim: true },
            { text: "-y", color: "red" },
            { dim: true },
            { text: "→ -ies", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="baby → babies" />
            <Ex en="city → cities" />
            <Ex en="party → parties" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🍂</span>
            <span className="text-sm font-black text-amber-700 uppercase tracking-widest">-f / -fe → -ves</span>
          </div>
          <Formula parts={[
            { text: "-f / -fe", color: "yellow" },
            { dim: true },
            { text: "→ -ves", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="leaf → leaves" />
            <Ex en="knife → knives" />
            <Ex en="wolf → wolves" />
          </div>
        </div>
      </div>

      {/* Irregular nouns table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Irregular plurals — memorise these</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 pr-6 font-black text-slate-700">Singular</th>
                <th className="text-left py-2 font-black text-emerald-700">Plural</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["man", "men"], ["woman", "women"], ["child", "children"],
                ["mouse", "mice"], ["tooth", "teeth"], ["foot", "feet"],
                ["person", "people"], ["sheep", "sheep"], ["fish", "fish"],
              ].map(([sg, pl]) => (
                <tr key={sg}>
                  <td className="py-2 pr-6 text-slate-700">{sg}</td>
                  <td className="py-2 font-black text-emerald-700">{pl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Word grid — 16 regular plurals */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Common regular plurals</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          {[
            "cats","dogs","books","cars",
            "buses","boxes","dishes","watches",
            "babies","cities","parties","countries",
            "leaves","knives","tables","chairs",
          ].map((w) => (
            <span key={w} className="rounded-lg bg-slate-100 border border-slate-200 px-3 py-1.5 text-slate-700 font-semibold text-center">{w}</span>
          ))}
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <b>⚠ Key point:</b> Some nouns are always plural or always singular — <b>news</b> (is, not are), <b>trousers</b>, <b>scissors</b> (always plural), <b>information</b>, <b>advice</b> (uncountable — no plural).
      </div>
    </div>
  );
}