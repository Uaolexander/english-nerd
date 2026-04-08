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
  { q: "My name is Alex. ___ am a teacher.", options: ["He","She","I","They"], answer: 2 },
  { q: "Maria is from Spain. ___ is my friend.", options: ["He","She","It","We"], answer: 1 },
  { q: "Tom works here. ___ is very kind.", options: ["She","He","It","They"], answer: 1 },
  { q: "The dog is big. ___ is brown.", options: ["He","She","It","We"], answer: 2 },
  { q: "My parents are at home. ___ are watching TV.", options: ["He","She","It","They"], answer: 3 },
  { q: "Anna and I are students. ___ study every day.", options: ["He","She","We","It"], answer: 2 },
  { q: "Are ___ from London? (talking to a friend)", options: ["he","she","you","we"], answer: 2 },
  { q: "___ is cold today. (the weather)", options: ["He","She","It","They"], answer: 2 },
  { q: "The children are in the garden. ___ are playing.", options: ["He","It","She","They"], answer: 3 },
  { q: "David and Kate are here. ___ are happy.", options: ["He","She","It","They"], answer: 3 },
  { q: "My sister is a doctor. ___ works at a hospital.", options: ["He","She","They","We"], answer: 1 },
  { q: "___ are all ready to go! (me + friends)", options: ["I","He","We","They"], answer: 2 },
  { q: "The phone is ringing. ___ is on the table.", options: ["He","She","It","They"], answer: 2 },
  { q: "My brother is tall. ___ plays basketball.", options: ["She","He","It","They"], answer: 1 },
  { q: "Look at the flowers! ___ are beautiful.", options: ["He","She","It","They"], answer: 3 },
  { q: "___ am very tired today.", options: ["He","She","I","We"], answer: 2 },
  { q: "Do ___ speak English? (to two people)", options: ["he","she","it","you"], answer: 3 },
  { q: "The book is on the shelf. ___ is interesting.", options: ["He","She","It","We"], answer: 2 },
  { q: "___ is my teacher. (a woman)", options: ["He","She","It","They"], answer: 1 },
  { q: "Mike is here. ___ is waiting for you.", options: ["She","It","He","We"], answer: 2 },
];

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Verb to be (am/is/are)", href: "/grammar/a1/to-be-am-is-are", img: "/topics/a1/to-be-am-is-are.jpg", level: "A1", badge: "bg-emerald-500", reason: "Use pronouns with am/is/are" },
  { title: "Possessive Adjectives", href: "/grammar/a1/possessive-adjectives", img: "/topics/a1/possessive-adjectives.jpg", level: "A1", badge: "bg-emerald-500" },
  { title: "Present Simple (I/you/we/they)", href: "/grammar/a1/present-simple-i-you-we-they", img: "/topics/a1/present-simple-i-you-we-they.jpg", level: "A1", badge: "bg-emerald-500" },
];

export default function SubjectPronounsLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => {
    return {
      1: {
        type: "mcq",
        title: "Exercise 1 (Easy) — Choose the correct subject pronoun",
        instructions: "Choose the correct subject pronoun: I, you, he, she, it, we, or they.",
        questions: [
          {
            id: "e1q1",
            prompt: "Anna is my sister. ___ is very kind and friendly.",
            options: ["He", "She", "They"],
            correctIndex: 1,
            explanation: "Anna is one girl, so we use she.",
          },
          {
            id: "e1q2",
            prompt: "My brother and I live in Warsaw. ___ study English every week.",
            options: ["We", "They", "You"],
            correctIndex: 0,
            explanation: "My brother and I = we.",
          },
          {
            id: "e1q3",
            prompt: "This phone is new. ___ is very expensive.",
            options: ["He", "It", "They"],
            correctIndex: 1,
            explanation: "A thing like a phone takes it.",
          },
          {
            id: "e1q4",
            prompt: "Tom is my teacher. ___ speaks very clearly in class.",
            options: ["He", "She", "We"],
            correctIndex: 0,
            explanation: "Tom is one man, so we use he.",
          },
          {
            id: "e1q5",
            prompt: "My parents work in a hospital. ___ come home late.",
            options: ["We", "They", "She"],
            correctIndex: 1,
            explanation: "Parents = more than one person, so they.",
          },
          {
            id: "e1q6",
            prompt: "I am Oleksandr and ___ am from Ukraine.",
            options: ["I", "you", "he"],
            correctIndex: 0,
            explanation: "When you talk about yourself, use I.",
          },
          {
            id: "e1q7",
            prompt: "Kate and Emma are in my class. ___ sit next to me.",
            options: ["They", "She", "We"],
            correctIndex: 0,
            explanation: "Kate and Emma = they.",
          },
          {
            id: "e1q8",
            prompt: "You and your brother are very busy today. ___ have a lot to do.",
            options: ["You", "We", "They"],
            correctIndex: 0,
            explanation: "When we speak to someone directly, we use you.",
          },
          {
            id: "e1q9",
            prompt: "My cat is under the table. ___ is sleeping now.",
            options: ["It", "She", "They"],
            correctIndex: 0,
            explanation: "At A1 level, animals are usually it unless we focus on gender.",
          },
          {
            id: "e1q10",
            prompt: "Sara and I go to the same school. ___ walk there every morning.",
            options: ["They", "We", "You"],
            correctIndex: 1,
            explanation: "Sara and I = we.",
          },
        ],
      },

      2: {
        type: "input",
        title: "Exercise 2 (Medium) — Type the subject pronoun",
        instructions: "Write the correct subject pronoun.",
        questions: [
          {
            id: "e2q1",
            prompt: "My name is Julia. ___ am eleven years old.",
            correct: "i",
            explanation: "When you speak about yourself, use I.",
          },
          {
            id: "e2q2",
            prompt: "Mr Brown is our new English teacher. ___ is very nice.",
            correct: "he",
            explanation: "Mr Brown is one man, so he.",
          },
          {
            id: "e2q3",
            prompt: "This bag is very heavy. ___ is full of books.",
            correct: "it",
            explanation: "A bag is a thing, so it.",
          },
          {
            id: "e2q4",
            prompt: "My friends are in the park. ___ are playing football.",
            correct: "they",
            explanation: "Friends = plural, so they.",
          },
          {
            id: "e2q5",
            prompt: "Lisa is my best friend. ___ always helps me.",
            correct: "she",
            explanation: "Lisa is one girl, so she.",
          },
          {
            id: "e2q6",
            prompt: "My brother and I love computer games. ___ play together every weekend.",
            correct: "we",
            explanation: "My brother and I = we.",
          },
          {
            id: "e2q7",
            prompt: "Paul is at home today because ___ is sick.",
            correct: "he",
            explanation: "Paul is one boy/man, so he.",
          },
          {
            id: "e2q8",
            prompt: "Your dog is very cute. ___ has big brown eyes.",
            correct: "it",
            explanation: "At this level, a dog can be it.",
          },
          {
            id: "e2q9",
            prompt: "You and I are in the same group. ___ have the same homework.",
            correct: "we",
            explanation: "You and I = we.",
          },
          {
            id: "e2q10",
            prompt: "Anna and Tom are my neighbours. ___ live next door.",
            correct: "they",
            explanation: "Anna and Tom = they.",
          },
        ],
      },

      3: {
        type: "mcq",
        title: "Exercise 3 (Hard) — Replace the noun with a pronoun",
        instructions: "Choose the pronoun that can replace the underlined word or words.",
        questions: [
          {
            id: "e3q1",
            prompt: "_My mother_ works in a school library.",
            options: ["He", "She", "They"],
            correctIndex: 1,
            explanation: "My mother = one woman, so she.",
          },
          {
            id: "e3q2",
            prompt: "_The children_ are very quiet today.",
            options: ["We", "They", "It"],
            correctIndex: 1,
            explanation: "The children = plural, so they.",
          },
          {
            id: "e3q3",
            prompt: "_This computer_ is old, but it still works well.",
            options: ["He", "It", "They"],
            correctIndex: 1,
            explanation: "A computer is a thing, so it.",
          },
          {
            id: "e3q4",
            prompt: "_My dad and I_ usually cook dinner together.",
            options: ["We", "They", "You"],
            correctIndex: 0,
            explanation: "My dad and I = we.",
          },
          {
            id: "e3q5",
            prompt: "_Emma_ is very good at maths.",
            options: ["She", "He", "It"],
            correctIndex: 0,
            explanation: "Emma is one girl, so she.",
          },
          {
            id: "e3q6",
            prompt: "_The books_ are on the teacher's desk.",
            options: ["It", "They", "We"],
            correctIndex: 1,
            explanation: "Books = plural, so they.",
          },
          {
            id: "e3q7",
            prompt: "_Your little sister_ is in the garden.",
            options: ["He", "She", "They"],
            correctIndex: 1,
            explanation: "Sister = one girl, so she.",
          },
          {
            id: "e3q8",
            prompt: "_The milk_ is in the fridge.",
            options: ["It", "He", "They"],
            correctIndex: 0,
            explanation: "Milk is a thing, so it.",
          },
          {
            id: "e3q9",
            prompt: "_You and your friends_ are very lucky.",
            options: ["We", "You", "They"],
            correctIndex: 1,
            explanation: "You and your friends = you (plural). 'We' would include the speaker; 'they' is for people not in the conversation.",
          },
          {
            id: "e3q10",
            prompt: "_My uncle_ lives in London.",
            options: ["He", "She", "It"],
            correctIndex: 0,
            explanation: "Uncle = one man, so he.",
          },
        ],
      },

      4: {
        type: "input",
        title: "Exercise 4 (Harder) — Complete the sentences",
        instructions: "Write the correct subject pronoun.",
        questions: [
          {
            id: "e4q1",
            prompt: "Ben is my cousin. ___ is fourteen years old.",
            correct: "he",
            explanation: "Ben is one boy, so he.",
          },
          {
            id: "e4q2",
            prompt: "My sister and I share one bedroom. ___ keep it very tidy.",
            correct: "we",
            explanation: "My sister and I = we.",
          },
          {
            id: "e4q3",
            prompt: "That table is very old, but ___ is still beautiful.",
            correct: "it",
            explanation: "A table is a thing, so it.",
          },
          {
            id: "e4q4",
            prompt: "Mia is in the kitchen because ___ wants some tea.",
            correct: "she",
            explanation: "Mia is one girl, so she.",
          },
          {
            id: "e4q5",
            prompt: "My parents are at work, so ___ are not at home now.",
            correct: "they",
            explanation: "Parents = plural, so they.",
          },
          {
            id: "e4q6",
            prompt: "Hello, I'm Peter and ___ live in Poznań.",
            correct: "i",
            explanation: "When you speak about yourself, use I.",
          },
          {
            id: "e4q7",
            prompt: "My dog is very smart. ___ understands many words.",
            correct: "it",
            explanation: "Dog = it at this level unless gender is important.",
          },
          {
            id: "e4q8",
            prompt: "You and Kate are late again. ___ need to hurry up.",
            correct: "you",
            explanation: "We are talking directly to the person, so you.",
          },
          {
            id: "e4q9",
            prompt: "My classmates are in the classroom and ___ are ready for the lesson.",
            correct: "they",
            explanation: "Classmates = plural, so they.",
          },
          {
            id: "e4q10",
            prompt: "My grandmother is very active. ___ goes for a walk every morning.",
            correct: "she",
            explanation: "Grandmother = one woman, so she.",
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
        title: "Subject Pronouns",
        subtitle: "I · you · he · she · it · we · they — 4 exercises + answer key",
        level: "A1",
        keyRule: "I · you · he · she · it · we · they — use he/she for people, it for things/animals, they for plural.",
        exercises: [
          {
            number: 1,
            title: "Exercise 1",
            difficulty: "Easy",
            instruction: "Choose the correct subject pronoun: I, you, he, she, it, we, or they.",
            questions: [
              "Anna is my sister. ___ is very kind and friendly.",
              "My brother and I live in Warsaw. ___ study English every week.",
              "This phone is new. ___ is very expensive.",
              "Tom is my teacher. ___ speaks very clearly in class.",
              "My parents work in a hospital. ___ come home late.",
              "I am Oleksandr and ___ am from Ukraine.",
              "Kate and Emma are in my class. ___ sit next to me.",
              "You and your brother are very busy today. ___ have a lot to do.",
              "My cat is under the table. ___ is sleeping now.",
              "Sara and I go to the same school. ___ walk there every morning.",
            ],
            hint: "She / We / It / He / They / I / They / You / It / We",
          },
          {
            number: 2,
            title: "Exercise 2",
            difficulty: "Medium",
            instruction: "Write the correct subject pronoun.",
            questions: [
              "My name is Julia. ___ am eleven years old.",
              "Mr Brown is our new English teacher. ___ is very nice.",
              "This bag is very heavy. ___ is full of books.",
              "My friends are in the park. ___ are playing football.",
              "Lisa is my best friend. ___ always helps me.",
              "My brother and I love computer games. ___ play together every weekend.",
              "Paul is at home today because ___ is sick.",
              "Your dog is very cute. ___ has big brown eyes.",
              "You and I are in the same group. ___ have the same homework.",
              "Anna and Tom are my neighbours. ___ live next door.",
            ],
          },
          {
            number: 3,
            title: "Exercise 3",
            difficulty: "Hard",
            instruction: "Choose the pronoun that replaces the underlined word(s).",
            questions: [
              "_My mother_ works in a school library.",
              "_The children_ are very quiet today.",
              "_This computer_ is old, but it still works well.",
              "_My dad and I_ usually cook dinner together.",
              "_Emma_ is very good at maths.",
              "_The books_ are on the teacher's desk.",
              "_Your little sister_ is in the garden.",
              "_The milk_ is in the fridge.",
              "_You and your friends_ are very lucky.",
              "_My uncle_ lives in London.",
            ],
            hint: "She / They / It / We / She / They / She / It / You / He",
          },
          {
            number: 4,
            title: "Exercise 4",
            difficulty: "Harder",
            instruction: "Write the correct subject pronoun.",
            questions: [
              "Ben is my cousin. ___ is fourteen years old.",
              "My sister and I share one bedroom. ___ keep it very tidy.",
              "That table is very old, but ___ is still beautiful.",
              "Mia is in the kitchen because ___ wants some tea.",
              "My parents are at work, so ___ are not at home now.",
              "Hello, I'm Peter and ___ live in Poznań.",
              "My dog is very smart. ___ understands many words.",
              "You and Kate are late again. ___ need to hurry up.",
              "My classmates are in the classroom and ___ are ready for the lesson.",
              "My grandmother is very active. ___ goes for a walk every morning.",
            ],
          },
        ],
        answerKey: [
          {
            exercise: 1,
            subtitle: "Easy — choose the correct subject pronoun",
            answers: ["She", "We", "It", "He", "They", "I", "They", "You", "It", "We"],
          },
          {
            exercise: 2,
            subtitle: "Medium — type the subject pronoun",
            answers: ["I", "He", "It", "They", "She", "We", "he", "It", "We", "They"],
          },
          {
            exercise: 3,
            subtitle: "Hard — replace the underlined noun",
            answers: ["She", "They", "It", "We", "She", "They", "She", "It", "You", "He"],
          },
          {
            exercise: 4,
            subtitle: "Harder — complete the sentences",
            answers: ["He", "We", "it", "she", "they", "I", "It", "You", "they", "She"],
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
        <span className="text-slate-700 font-medium">Subject pronouns</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Subject pronouns <span className="font-extrabold">— A1 basics</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Use subject pronouns to talk about people and things without repeating the noun every time. Learn how to use I, you, he, she, it, we, and they.
      </p>

      {/* Layout: left ad/game + center content + right ad/recommendations */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        {/* Left column */}
        {isPro ? (
          <div className="">
            <SpeedRound gameId="grammar-a1-subject-pronouns" subject="Subject Pronouns" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <AdUnit variant="sidebar-dark" />

        )}
      </div>

      {/* SpeedRound below grid for non-PRO users */}
      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-a1-subject-pronouns" subject="Subject Pronouns" questions={SPEED_QUESTIONS} />
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
          href="/grammar/a1/possessive-adjectives"
          className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
        >
          Next: Possessive adjectives →
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
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Subject Pronouns</h2>
        <p className="text-slate-500 text-sm">Replace nouns with the right pronoun — I, you, he, she, it, we, or they.</p>
      </div>

      {/* Pronoun chips grid */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">7</span>
          <h3 className="font-black text-slate-900">The 7 subject pronouns</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Singular</div>
            <div className="space-y-2">
              {[
                { pronoun: "I", desc: "yourself", color: "sky" },
                { pronoun: "you", desc: "the person you speak to", color: "yellow" },
                { pronoun: "he", desc: "one man or boy", color: "violet" },
                { pronoun: "she", desc: "one woman or girl", color: "green" },
                { pronoun: "it", desc: "one thing or animal", color: "slate" },
              ].map(({ pronoun, desc, color }) => (
                <div key={pronoun} className="flex items-center gap-3">
                  <Formula parts={[{ text: pronoun, color: color as string }]} />
                  <span className="text-xs text-slate-500">{desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Plural</div>
            <div className="space-y-2">
              {[
                { pronoun: "we", desc: "you + other people", color: "green" },
                { pronoun: "you", desc: "two or more people you speak to", color: "yellow" },
                { pronoun: "they", desc: "more than one person or thing", color: "violet" },
              ].map(({ pronoun, desc, color }) => (
                <div key={pronoun + "pl"} className="flex items-center gap-3">
                  <Formula parts={[{ text: pronoun, color: color as string }]} />
                  <span className="text-xs text-slate-500">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2 usage cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">👤</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Singular pronouns</span>
          </div>
          <div className="space-y-2">
            <Ex en="I am a student." />
            <Ex en="He is my brother." />
            <Ex en="She is a doctor." />
            <Ex en="It is on the table." />
          </div>
        </div>
        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">👥</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Plural pronouns</span>
          </div>
          <div className="space-y-2">
            <Ex en="We are ready." />
            <Ex en="You are all welcome." />
            <Ex en="They are my friends." />
          </div>
        </div>
      </div>

      {/* Reference table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Noun → pronoun replacement</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left py-2 pr-4 font-black text-slate-700">Noun</th>
                <th className="text-left py-2 pr-4 font-black text-slate-700">Pronoun</th>
                <th className="text-left py-2 font-black text-slate-700">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr><td className="py-2 pr-4 text-slate-700">John</td><td className="py-2 pr-4 font-bold text-violet-700">he</td><td className="py-2 text-slate-600 italic">He is tall.</td></tr>
              <tr><td className="py-2 pr-4 text-slate-700">Maria</td><td className="py-2 pr-4 font-bold text-green-700">she</td><td className="py-2 text-slate-600 italic">She is kind.</td></tr>
              <tr><td className="py-2 pr-4 text-slate-700">John and Maria</td><td className="py-2 pr-4 font-bold text-violet-700">they</td><td className="py-2 text-slate-600 italic">They are at home.</td></tr>
              <tr><td className="py-2 pr-4 text-slate-700">my phone</td><td className="py-2 pr-4 font-bold text-slate-700">it</td><td className="py-2 text-slate-600 italic">It is new.</td></tr>
              <tr><td className="py-2 pr-4 text-slate-700">my friends and I</td><td className="py-2 pr-4 font-bold text-green-700">we</td><td className="py-2 text-slate-600 italic">We go to school.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Correct vs wrong */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Ex en="Me is a student." correct={false} />
        <Ex en="I am a student." />
        <Ex en="Him is my friend." correct={false} />
        <Ex en="He is my friend." />
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <b>⚠ Common mistake:</b> Never use object pronouns (me, him, her, them) as the subject of a sentence. The subject pronoun always comes <b>before</b> the verb: <b>I am</b>, <b>He is</b>, <b>She is</b>, <b>They are</b>.
      </div>
    </div>
  );
}