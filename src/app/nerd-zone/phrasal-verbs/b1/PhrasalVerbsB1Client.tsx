"use client";

import { useState } from "react";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import DownloadWorksheet from "../DownloadWorksheet";

/* ─── Data ───────────────────────────────────────────────────────────────── */

const VERBS = [
  { verb: "carry on",        meaning: "to continue doing something",          example: "Carry on — I'll join you in a moment." },
  { verb: "bring up",        meaning: "to mention a topic",                   example: "She brought up an interesting point." },
  { verb: "come across",     meaning: "to find or meet by chance",            example: "I came across this café by accident." },
  { verb: "deal with",       meaning: "to handle a problem or situation",     example: "How do you deal with stress at work?" },
  { verb: "fall out with",   meaning: "to argue and stop being friends",      example: "She fell out with her flatmate." },
  { verb: "give up",         meaning: "to stop trying",                       example: "Don't give up — you're nearly there!" },
  { verb: "look forward to", meaning: "to be excited about a future event",   example: "I'm looking forward to the holiday." },
  { verb: "make up",         meaning: "to reconcile after an argument",       example: "They fought but made up the next day." },
  { verb: "put off",         meaning: "to postpone",                          example: "Stop putting things off and just start!" },
  { verb: "set up",          meaning: "to establish or start something",      example: "She set up her own business at 25." },
  { verb: "take up",         meaning: "to start a new hobby or activity",     example: "He took up running after lockdown." },
  { verb: "work out",        meaning: "to exercise / to solve a problem",     example: "I go to the gym to work out three times a week." },
];

const WORD_BANK = ["carry on", "bring up", "come across", "deal with", "give up", "look forward to", "put off", "set up", "take up", "work out"];

const EXERCISES_WS = [
  { before: "Don't ",                         answer: "give up",            after: " — you've almost finished the project." },
  { before: "Could I ",                       answer: "bring up",           after: " a problem we've been having recently?" },
  { before: "I ",                             answer: "came across",        after: " this great café by accident walking home." },
  { before: "How do you usually ",            answer: "deal with",          after: " difficult customers at work?" },
  { before: "We've been ",                    answer: "putting off",        after: " the meeting for two weeks now." },
  { before: "She decided to ",               answer: "set up",             after: " her own business after years of experience." },
  { before: "He ",                            answer: "took up",            after: " yoga after his doctor recommended it." },
  { before: "Please ",                        answer: "carry on",           after: " — I'll join you in five minutes." },
  { before: "I'm really ",                    answer: "looking forward to", after: " seeing everyone at the party." },
  { before: "I usually ",                     answer: "work out",           after: " at the gym before work." },
];

const LEVELS = [
  { label: "A1-A2", href: "/nerd-zone/phrasal-verbs",    color: "bg-[#F5DA20] text-black" },
  { label: "B1",    href: "/nerd-zone/phrasal-verbs/b1", color: "bg-violet-500 text-white" },
  { label: "B2",    href: "/nerd-zone/phrasal-verbs/b2", color: "bg-orange-500 text-white" },
  { label: "C1",    href: "/nerd-zone/phrasal-verbs/c1", color: "bg-sky-500 text-white" },
];

/* ─── SpeedRound ─────────────────────────────────────────────────────────── */

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "To continue doing something = ?",     options: ["give up","put off","carry on","make up"],          answer: 2 },
  { q: "To stop trying = ?",                  options: ["work out","give up","take up","set up"],            answer: 1 },
  { q: "To postpone = ?",                     options: ["carry on","put off","bring up","come across"],      answer: 1 },
  { q: "To mention a topic = ?",              options: ["make up","bring up","deal with","give up"],         answer: 1 },
  { q: "To find by chance = ?",               options: ["set up","come across","work out","take up"],        answer: 1 },
  { q: "To establish something = ?",          options: ["put off","take up","set up","make up"],             answer: 2 },
  { q: "To reconcile after argument = ?",     options: ["fall out with","make up","carry on","set up"],      answer: 1 },
  { q: "To start a new hobby = ?",            options: ["take up","give up","put off","bring up"],           answer: 0 },
  { q: "To handle a problem = ?",             options: ["work out","fall out with","deal with","look forward to"], answer: 2 },
  { q: "To argue and stop being friends = ?", options: ["make up","fall out with","carry on","take up"],     answer: 1 },
  { q: "Don't ___ — you're nearly there!",    options: ["set up","take up","give up","carry on"],            answer: 2 },
  { q: "She ___ her own business at 25.",     options: ["took up","put off","set up","worked out"],          answer: 2 },
  { q: "I'm ___ the holiday next week.",      options: ["making up","looking forward to","giving up","setting up"], answer: 1 },
  { q: "How do you ___ stress at work?",      options: ["come across","deal with","carry on","bring up"],    answer: 1 },
  { q: "He ___ running after lockdown.",      options: ["put off","gave up","came across","took up"],        answer: 3 },
  { q: "They argued but ___ the next day.",   options: ["set up","fell out","made up","put off"],            answer: 2 },
  { q: "Please ___ — I'll be there soon.",    options: ["give up","carry on","put off","work out"],          answer: 1 },
  { q: "We've been ___ this meeting for weeks.", options: ["putting off","working out","taking up","setting up"], answer: 0 },
  { q: "I ___ this great café by accident.",  options: ["came across","set up","made up","took up"],         answer: 0 },
  { q: "I ___ at the gym every morning.",     options: ["set up","put off","work out","fall out"],           answer: 2 },
];

/* ─── Exercise types ─────────────────────────────────────────────────────── */

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
  | { type: "mcq";   title: string; instructions: string; questions: MCQ[]   }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

/* ─── Exercises ──────────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3 | 4, ExerciseSet> = {
  1: {
    type: "mcq",
    title: "Exercise 1 — Choose the phrasal verb",
    instructions: "Choose the correct phrasal verb to complete each sentence.",
    questions: [
      { id:"e1q1",  prompt: "Don't ___ — you're nearly there!",                           options: ["set up","take up","give up","carry on"],            correctIndex: 2, explanation: '"give up" = to stop trying' },
      { id:"e1q2",  prompt: "Could I ___ a concern about the deadline?",                  options: ["put off","bring up","work out","make up"],          correctIndex: 1, explanation: '"bring up" = to mention a topic' },
      { id:"e1q3",  prompt: "I ___ an interesting article while browsing the web.",       options: ["made up","set up","came across","took up"],         correctIndex: 2, explanation: '"come across" = to find by chance' },
      { id:"e1q4",  prompt: "How do you ___ difficult clients?",                          options: ["deal with","carry on","put off","fall out with"],   correctIndex: 0, explanation: '"deal with" = to handle a problem' },
      { id:"e1q5",  prompt: "Stop ___ your homework and do it now!",                      options: ["making up","working out","putting off","bringing up"], correctIndex: 2, explanation: '"put off" = to postpone' },
      { id:"e1q6",  prompt: "She ___ her own café after leaving her corporate job.",      options: ["took up","set up","gave up","carried on"],          correctIndex: 1, explanation: '"set up" = to establish something' },
      { id:"e1q7",  prompt: "He ___ yoga after the doctor's advice.",                     options: ["gave up","put off","took up","made up"],            correctIndex: 2, explanation: '"take up" = to start a hobby' },
      { id:"e1q8",  prompt: "They argued last week but ___ quickly.",                     options: ["carried on","set up","made up","fell out with"],    correctIndex: 2, explanation: '"make up" = to reconcile' },
      { id:"e1q9",  prompt: "I'm really ___ the weekend trip.",                           options: ["coming across","looking forward to","putting off","setting up"], correctIndex: 1, explanation: '"look forward to" = to be excited about the future' },
      { id:"e1q10", prompt: "I ___ three times a week to stay healthy.",                  options: ["put off","carry on","work out","come across"],      correctIndex: 2, explanation: '"work out" = to exercise' },
    ],
  },
  2: {
    type: "input",
    title: "Exercise 2 — Type the phrasal verb",
    instructions: "Type the correct phrasal verb to complete the sentence.",
    questions: [
      { id:"e2q1",  prompt: "She ___ her job after the manager refused her raise.",       correct: "gave up",            explanation: '"give up" = to stop trying' },
      { id:"e2q2",  prompt: "He ___ a great idea during the meeting.",                    correct: "brought up",         explanation: '"bring up" = to mention a topic' },
      { id:"e2q3",  prompt: "I ___ an old friend while shopping yesterday.",              correct: "came across",        explanation: '"come across" = to find or meet by chance' },
      { id:"e2q4",  prompt: "We need to ___ this problem before it gets worse.",          correct: "deal with",          explanation: '"deal with" = to handle a problem' },
      { id:"e2q5",  prompt: "They've been ___ the project for months.",                   correct: "putting off",        explanation: '"put off" = to postpone' },
      { id:"e2q6",  prompt: "She ___ a new business from scratch.",                       correct: "set up",             explanation: '"set up" = to establish' },
      { id:"e2q7",  prompt: "I've ___ running — it helps me clear my head.",              correct: "taken up",           explanation: '"take up" = to start a hobby' },
      { id:"e2q8",  prompt: "After the argument, they ___ and became friends again.",     correct: "made up",            explanation: '"make up" = to reconcile' },
      { id:"e2q9",  prompt: "I'm ___ seeing you at the conference next month.",           correct: "looking forward to", explanation: '"look forward to" = excited about future' },
      { id:"e2q10", prompt: "He ___ at the gym every morning before work.",               correct: "works out",          explanation: '"work out" = to exercise' },
    ],
  },
  3: {
    type: "mcq",
    title: "Exercise 3 — What does it mean?",
    instructions: "Choose the correct meaning of the phrasal verb in each sentence.",
    questions: [
      { id:"e3q1",  prompt: "Please carry on — I'll be right there.",          options: ["to stop","to continue","to postpone","to start"],          correctIndex: 1, explanation: '"carry on" = to continue' },
      { id:"e3q2",  prompt: "She brought up the salary issue.",                options: ["to solve","to ignore","to mention","to postpone"],         correctIndex: 2, explanation: '"bring up" = to mention a topic' },
      { id:"e3q3",  prompt: "He came across an old letter in the attic.",      options: ["to write","to lose","to find by chance","to send"],       correctIndex: 2, explanation: '"come across" = to find by chance' },
      { id:"e3q4",  prompt: "She gave up trying to fix the relationship.",     options: ["to continue","to stop trying","to start","to mention"],   correctIndex: 1, explanation: '"give up" = to stop trying' },
      { id:"e3q5",  prompt: "We keep putting off the difficult decisions.",    options: ["to make","to postpone","to discuss","to cancel"],         correctIndex: 1, explanation: '"put off" = to postpone' },
      { id:"e3q6",  prompt: "They set up a charity to help local families.",   options: ["to close","to establish","to postpone","to mention"],     correctIndex: 1, explanation: '"set up" = to establish' },
      { id:"e3q7",  prompt: "She took up painting after retiring.",            options: ["to stop","to postpone","to start a hobby","to find"],     correctIndex: 2, explanation: '"take up" = to start a new activity' },
      { id:"e3q8",  prompt: "They fell out with each other over money.",       options: ["to agree","to meet","to argue and stop being friends","to apologise"], correctIndex: 2, explanation: '"fall out with" = to argue and stop being friends' },
      { id:"e3q9",  prompt: "He works out every day at the local gym.",        options: ["to study","to rest","to exercise","to travel"],           correctIndex: 2, explanation: '"work out" = to exercise' },
      { id:"e3q10", prompt: "I'm looking forward to the summer holiday.",      options: ["to dread","to be excited about","to cancel","to plan"],   correctIndex: 1, explanation: '"look forward to" = to be excited about the future' },
    ],
  },
  4: {
    type: "input",
    title: "Exercise 4 — Mixed practice",
    instructions: "Type the correct phrasal verb in the right form.",
    questions: [
      { id:"e4q1",  prompt: "The meeting was ___ because the manager was ill.",            correct: "put off",            explanation: '"put off" = to postpone' },
      { id:"e4q2",  prompt: "They ___ over money, but quickly made up.",                   correct: "fell out",           explanation: '"fall out" = to argue and separate' },
      { id:"e4q3",  prompt: "I ___ a perfect venue for the wedding online.",               correct: "came across",        explanation: '"come across" = to find by chance' },
      { id:"e4q4",  prompt: "She ___ smoking after her health scare.",                     correct: "gave up",            explanation: '"give up" = to stop' },
      { id:"e4q5",  prompt: "We need to ___ this issue before the presentation.",          correct: "deal with",          explanation: '"deal with" = to handle' },
      { id:"e4q6",  prompt: "He ___ cycling during the lockdown.",                         correct: "took up",            explanation: '"take up" = to start a hobby' },
      { id:"e4q7",  prompt: "The entrepreneur ___ her first company at 22.",               correct: "set up",             explanation: '"set up" = to establish' },
      { id:"e4q8",  prompt: "I'm really ___ my promotion next month.",                     correct: "looking forward to", explanation: '"look forward to" = excited about the future' },
      { id:"e4q9",  prompt: "She ___ an important point about the budget.",                correct: "brought up",         explanation: '"bring up" = to mention' },
      { id:"e4q10", prompt: "He ___ every day to keep fit for the marathon.",              correct: "works out",          explanation: '"work out" = to exercise' },
    ],
  },
};

/* ─── PDF config ─────────────────────────────────────────────────────────── */

const PDF_CONFIG: LessonPDFConfig = {
  title: "Phrasal Verbs B1",
  subtitle: "Intermediate Phrasal Verbs — 4 exercises + answer key",
  level: "B1",
  keyRule: "carry on · bring up · come across · deal with · give up · look forward to · put off · set up · take up · work out",
  exercises: [
    {
      number: 1,
      title: "Exercise 1",
      difficulty: "Easy",
      instruction: "Fill in the blank with the correct phrasal verb.",
      questions: [
        "Don't ___ — keep going!",
        "Could I ___ a concern?",
        "I ___ a great café.",
        "How do you ___ stress?",
        "Stop ___ your homework!",
        "She ___ her own café.",
        "He ___ yoga last year.",
        "They fought but ___.",
        "I'm ___ the weekend trip.",
        "I ___ three times a week.",
      ],
    },
    {
      number: 2,
      title: "Exercise 2",
      difficulty: "Medium",
      instruction: "Write the phrasal verb in the correct form. Use the hint.",
      questions: [
        "She ___ her job. (give up)",
        "He ___ a point. (bring up)",
        "I ___ an old friend. (come across)",
        "We need to ___ this. (deal with)",
        "They ___ it for months. (put off)",
        "She ___ a new café. (set up)",
        "I've ___ running. (take up)",
        "They quickly ___. (make up)",
        "I'm ___ the trip. (look forward to)",
        "He ___ at gym daily. (work out)",
      ],
    },
    {
      number: 3,
      title: "Exercise 3",
      difficulty: "Medium",
      instruction: "Write the meaning of each phrasal verb.",
      questions: [
        "carry on = __________________",
        "bring up = __________________",
        "come across = _______________",
        "deal with = _________________",
        "give up = ___________________",
        "look forward to = ___________",
        "put off = ___________________",
        "set up = ____________________",
        "take up = ___________________",
        "work out = __________________",
      ],
    },
    {
      number: 4,
      title: "Exercise 4",
      difficulty: "Hard",
      instruction: "Complete with a phrasal verb in the correct form.",
      questions: [
        "The task was ___ again.",
        "They ___ — it was bad.",
        "I ___ a great venue online.",
        "She ___ smoking last year.",
        "We must ___ this problem.",
        "He ___ cycling in lockdown.",
        "She ___ her first company.",
        "I'm really ___ Friday.",
        "She ___ an important point.",
        "He ___ every day.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Easy — fill in the blank", answers: ["give up","bring up","came across","deal with","putting off","set up","took up","made up","looking forward to","work out"] },
    { exercise: 2, subtitle: "Medium — correct form", answers: ["gave up","brought up","came across","deal with","putting off","set up","taken up","made up","looking forward to","works out"] },
    { exercise: 3, subtitle: "Medium — write the meaning", answers: ["to continue doing something","to mention a topic","to find/meet by chance","to handle a problem","to stop trying","to be excited about future","to postpone","to establish/start","to start a new hobby","to exercise / solve a problem"] },
    { exercise: 4, subtitle: "Hard — correct form", answers: ["put off","fell out","came across","gave up","deal with","took up","set up","looking forward to","brought up","works out"] },
  ],
};

/* ─── MCQ Exercise component ─────────────────────────────────────────────── */

function MCQExercise({ set, checked, answers, onAnswer, onCheck, onReset }: {
  set: Extract<ExerciseSet, { type: "mcq" }>;
  checked: boolean;
  answers: Record<string, number>;
  onAnswer: (id: string, i: number) => void;
  onCheck: () => void;
  onReset: () => void;
}) {
  const score = checked
    ? set.questions.filter((q) => answers[q.id] === q.correctIndex).length
    : 0;

  return (
    <div>
      <p className="mb-5 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
        {set.instructions}
      </p>
      <div className="space-y-5">
        {set.questions.map((q, qi) => {
          const chosen = answers[q.id] ?? -1;
          const isCorrect = checked && chosen === q.correctIndex;
          const isWrong   = checked && chosen !== q.correctIndex && chosen !== -1;
          return (
            <div key={q.id}>
              <p className="mb-2 text-sm font-semibold text-slate-800">
                <span className="mr-1.5 text-slate-400">{qi + 1}.</span>
                {q.prompt}
              </p>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  let cls = "rounded-xl border px-4 py-2 text-sm font-semibold transition ";
                  if (!checked) {
                    cls += isChosen
                      ? "border-sky-400 bg-sky-100 text-sky-800"
                      : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50";
                  } else if (oi === q.correctIndex) {
                    cls += "border-emerald-400 bg-emerald-50 text-emerald-800";
                  } else if (isChosen) {
                    cls += "border-red-300 bg-red-50 text-red-700 line-through";
                  } else {
                    cls += "border-slate-100 bg-slate-50 text-slate-400";
                  }
                  return (
                    <button key={oi} disabled={checked} className={cls} onClick={() => onAnswer(q.id, oi)}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {checked && (isCorrect || isWrong) && (
                <p className={`mt-1.5 text-xs font-semibold ${isCorrect ? "text-emerald-600" : "text-red-500"}`}>
                  {isCorrect ? "✓ Correct!" : `✗ ${q.explanation}`}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center gap-3">
        {!checked ? (
          <button
            onClick={onCheck}
            disabled={Object.keys(answers).length < set.questions.length}
            className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-black text-white transition hover:bg-slate-700 disabled:opacity-40"
          >
            Check answers
          </button>
        ) : (
          <>
            <div className={`rounded-xl px-5 py-2.5 text-sm font-black ${score === set.questions.length ? "bg-emerald-500 text-white" : score >= 7 ? "bg-[#F5DA20] text-black" : "bg-slate-200 text-slate-700"}`}>
              {score} / {set.questions.length}
            </div>
            <button onClick={onReset} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Input Exercise component ───────────────────────────────────────────── */

function InputExercise({ set, checked, answers, onAnswer, onCheck, onReset }: {
  set: Extract<ExerciseSet, { type: "input" }>;
  checked: boolean;
  answers: Record<string, string>;
  onAnswer: (id: string, v: string) => void;
  onCheck: () => void;
  onReset: () => void;
}) {
  const score = checked
    ? set.questions.filter((q) => normalize(answers[q.id] ?? "") === normalize(q.correct)).length
    : 0;

  return (
    <div>
      <p className="mb-5 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">
        {set.instructions}
      </p>
      <div className="space-y-4">
        {set.questions.map((q, qi) => {
          const val       = answers[q.id] ?? "";
          const isCorrect = checked && normalize(val) === normalize(q.correct);
          const isWrong   = checked && normalize(val) !== normalize(q.correct);
          const parts     = q.prompt.split("___");
          return (
            <div key={q.id} className="flex flex-wrap items-center gap-1">
              <span className="text-sm text-slate-400 mr-1">{qi + 1}.</span>
              <span className="text-sm text-slate-800">{parts[0]}</span>
              <input
                type="text"
                value={val}
                disabled={checked}
                onChange={(e) => onAnswer(q.id, e.target.value)}
                placeholder="___"
                className={`w-28 rounded-lg border px-3 py-1.5 text-center text-sm font-semibold outline-none transition
                  ${!checked ? "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  : isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-red-300 bg-red-50 text-red-700"}`}
              />
              <span className="text-sm text-slate-800">{parts[1]}</span>
              {checked && isWrong && (
                <span className="ml-1 text-xs text-emerald-600 font-semibold">→ {q.correct}</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center gap-3">
        {!checked ? (
          <button
            onClick={onCheck}
            disabled={Object.keys(answers).filter(k => (answers as Record<string, string>)[k].trim()).length < set.questions.length}
            className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-black text-white transition hover:bg-slate-700 disabled:opacity-40"
          >
            Check answers
          </button>
        ) : (
          <>
            <div className={`rounded-xl px-5 py-2.5 text-sm font-black ${score === set.questions.length ? "bg-emerald-500 text-white" : score >= 7 ? "bg-[#F5DA20] text-black" : "bg-slate-200 text-slate-700"}`}>
              {score} / {set.questions.length}
            </div>
            <button onClick={onReset} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function PhrasalVerbsB1Client({ isPro }: { isPro: boolean }) {
  const [showAll, setShowAll]           = useState(false);
  const [exNo, setExNo]                 = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked]           = useState(false);
  const [mcqAnswers, setMcqAnswers]     = useState<Record<string, number>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const visibleVerbs = showAll ? VERBS : VERBS.slice(0, 5);
  const currentSet   = SETS[exNo];

  function switchEx(n: 1 | 2 | 3 | 4) {
    setExNo(n);
    setChecked(false);
    setMcqAnswers({});
    setInputAnswers({});
  }

  async function handleDownloadPDF() {
    const { generateLessonPDF } = await import("@/lib/generateLessonPDF");
    await generateLessonPDF(PDF_CONFIG);
  }

  const DIFFICULTIES  = ["Easy", "Medium", "Medium", "Hard"];
  const DIFF_COLORS   = ["bg-emerald-100 text-emerald-700", "bg-[#F5DA20] text-black", "bg-[#F5DA20] text-black", "bg-red-100 text-red-700"];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          {[["Home", "/"], ["Nerd Zone", "/nerd-zone"], ["Phrasal Verbs", "/nerd-zone/phrasal-verbs"]].map(([label, href]) => (
            <span key={href} className="flex items-center gap-1.5">
              <a href={href} className="hover:text-slate-700 transition">{label}</a>
              <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          ))}
          <span className="text-slate-700 font-medium">B1</span>
        </nav>

        {/* Hero */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-violet-100 px-3 py-0.5 text-[11px] font-black text-violet-700">Phrasal Verbs</span>
            <span className="rounded-full bg-violet-500 px-3 py-0.5 text-[11px] font-black text-white">B1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Intermediate</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            Phrasal{" "}
            <span className="relative inline-block">
              Verbs
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-violet-500/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 key B1 phrasal verbs that intermediate speakers use daily — in meetings, conversations and everyday situations.
          </p>
        </div>

        {/* Level nav + download */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {LEVELS.map(({ label, href, color }) => (
              label === "B1" ? (
                <span key={label} className={`rounded-xl ${color} px-5 py-2 text-sm font-black shadow-sm`}>{label}</span>
              ) : (
                <a key={label} href={href} className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 transition">{label}</a>
              )
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            <DownloadWorksheet isPro={isPro} level="B1" wordBank={WORD_BANK} exercises={EXERCISES_WS} filename="PhrasalVerbs_B1_Worksheet_EnglishNerd.pdf" />
            <span className="text-[11px] text-slate-400">10 exercises + answer key · PDF</span>
          </div>
        </div>

        {/* Verb table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-0 border-b-2 border-slate-200 bg-white">
            <div className="flex items-center gap-2 px-5 py-4"><span className="h-2 w-2 rounded-full bg-violet-500" /><span className="text-[10px] font-black uppercase tracking-widest text-violet-700">Phrasal Verb</span></div>
            <div className="flex items-center gap-2 border-l border-emerald-100 bg-emerald-50/60 px-5 py-4"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Meaning</span></div>
            <div className="flex items-center gap-2 border-l border-sky-100 bg-sky-50/60 px-5 py-4"><span className="h-2 w-2 rounded-full bg-sky-500" /><span className="text-[10px] font-black uppercase tracking-widest text-sky-700">Example</span></div>
          </div>
          <div>
            {visibleVerbs.map(({ verb, meaning, example }, i) => (
              <div key={verb} className={`group grid grid-cols-[1fr_1fr_1.5fr] gap-0 border-b border-slate-50 transition-colors hover:bg-violet-500/8 last:border-0 ${i % 2 === 1 ? "bg-slate-50/40" : "bg-white"}`}>
                <div className="flex items-center px-5 py-3.5"><span className="text-sm font-black text-slate-900">{verb}</span></div>
                <div className="flex items-center border-l border-emerald-50 bg-emerald-50/30 px-5 py-3.5 group-hover:bg-emerald-50/60"><span className="inline-flex rounded-lg bg-emerald-100 px-2.5 py-1 text-sm font-semibold text-emerald-800">{meaning}</span></div>
                <div className="flex items-center border-l border-sky-50 bg-sky-50/30 px-5 py-3.5 group-hover:bg-sky-50/60"><span className="text-sm italic text-sky-800">{example}</span></div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 flex items-center justify-center">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              {showAll ? (
                <>
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 15l7-7 7 7"/></svg>
                  Collapse
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 9l-7 7-7-7"/></svg>
                  Show all 12 verbs
                </>
              )}
            </button>
          </div>
        </div>

        {/* Study tip */}
        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">At B1 level, focus on phrasal verbs you can use at work and in conversation. Try using 2–3 new ones in writing or speech every day this week.</p>
          </div>
        </div>

        {/* Exercises + SpeedRound layout */}
        <div className="mt-8">
          <AdUnit variant="inline-light" />
        </div>

        <div className="mt-6 grid gap-8 xl:grid-cols-[1fr_340px]">

          {/* LEFT: Exercises */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-500 shadow-sm" />
              <h2 className="text-2xl font-black text-slate-900">Practice Exercises</h2>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {([1, 2, 3, 4] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => switchEx(n)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition ${
                    exNo === n
                      ? "bg-slate-900 text-white shadow-md"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
                >
                  Ex {n}
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${DIFF_COLORS[n - 1]}`}>
                    {DIFFICULTIES[n - 1]}
                  </span>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-black text-slate-900">{currentSet.title}</h3>

              {currentSet.type === "mcq" ? (
                <MCQExercise
                  set={currentSet}
                  checked={checked}
                  answers={mcqAnswers as Record<string, number>}
                  onAnswer={(id, i) => setMcqAnswers((prev) => ({ ...prev, [id]: i }))}
                  onCheck={() => setChecked(true)}
                  onReset={() => { setChecked(false); setMcqAnswers({}); }}
                />
              ) : (
                <InputExercise
                  set={currentSet}
                  checked={checked}
                  answers={inputAnswers as Record<string, string>}
                  onAnswer={(id, v) => setInputAnswers((prev) => ({ ...prev, [id]: v }))}
                  onCheck={() => setChecked(true)}
                  onReset={() => { setChecked(false); setInputAnswers({}); }}
                />
              )}
            </div>

            {/* Worksheet PDF button */}
            <div className="mt-6 flex items-center gap-3">
              <PDFButton onDownload={handleDownloadPDF} loading={false} />
              <p className="text-xs text-slate-400">PRO · Worksheet PDF · 4 exercises + answer key</p>
            </div>
          </div>

          {/* RIGHT: SpeedRound */}
          <div className="xl:sticky xl:top-6 xl:self-start">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-sm" />
              <h2 className="text-2xl font-black text-slate-900">SpeedRound <span className="text-sm font-bold text-amber-500 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">GAME</span></h2>
            </div>
            <SpeedRound questions={SPEED_QUESTIONS} gameId="phrasal-verbs-b1" />
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mt-14 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone/phrasal-verbs" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            ← A1-A2
          </a>
          <a href="/nerd-zone/phrasal-verbs/b2" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            Next: B2
          </a>
        </div>

      </div>
    </div>
  );
}
