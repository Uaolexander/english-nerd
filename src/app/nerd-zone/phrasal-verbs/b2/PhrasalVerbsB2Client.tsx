"use client";

import { useState } from "react";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import DownloadWorksheet from "../DownloadWorksheet";

/* ─── Data ───────────────────────────────────────────────────────────────── */

const VERBS = [
  { verb: "come up with",  meaning: "to think of an idea or solution",           example: "She came up with a brilliant plan." },
  { verb: "cut back on",   meaning: "to reduce the amount of something",         example: "We need to cut back on spending." },
  { verb: "fall through",  meaning: "to fail to happen",                         example: "The deal fell through at the last minute." },
  { verb: "get rid of",    meaning: "to remove or throw away",                   example: "It's time to get rid of these old files." },
  { verb: "let down",      meaning: "to disappoint someone",                     example: "I don't want to let the team down." },
  { verb: "make out",      meaning: "to see or understand with difficulty",      example: "I could barely make out the text." },
  { verb: "rule out",      meaning: "to exclude a possibility",                  example: "We can't rule out the possibility of delays." },
  { verb: "stand for",     meaning: "to represent / to tolerate",                example: "I won't stand for this kind of behaviour." },
  { verb: "take on",       meaning: "to accept responsibility or hire staff",    example: "The company decided to take on ten new staff." },
  { verb: "break down",    meaning: "to stop working / to analyse step by step", example: "The car broke down on the motorway." },
  { verb: "bring about",   meaning: "to cause something to happen",              example: "The reforms brought about significant change." },
  { verb: "account for",   meaning: "to explain or give a reason for",           example: "How do you account for the missing data?" },
];

const WORD_BANK = ["come up with", "cut back on", "fall through", "get rid of", "let down", "make out", "rule out", "stand for", "take on", "break down"];

const EXERCISES_WS = [
  { before: "The negotiations ",             answer: "fell through",   after: " and both sides walked away." },
  { before: "She ",                          answer: "came up with",   after: " a creative solution nobody had considered." },
  { before: "The company needs to ",         answer: "cut back on",    after: " unnecessary costs this quarter." },
  { before: "It's time to ",                 answer: "get rid of",     after: " all the old equipment in the office." },
  { before: "I promised I wouldn't ",        answer: "let down",       after: " the people who believed in me." },
  { before: "The sign was so small I could barely ", answer: "make out", after: " the letters from a distance." },
  { before: "The investigation couldn't ",   answer: "rule out",       after: " the possibility of human error." },
  { before: '"FREE" here ',                  answer: "stands for",     after: ' "no hidden charges".' },
  { before: "The firm decided to ",          answer: "take on",        after: " extra staff for the busy season." },
  { before: "The engine ",                   answer: "broke down",     after: " just as we reached the motorway." },
];

const LEVELS = [
  { label: "A1-A2", href: "/nerd-zone/phrasal-verbs",    color: "bg-[#F5DA20] text-black" },
  { label: "B1",    href: "/nerd-zone/phrasal-verbs/b1", color: "bg-violet-500 text-white" },
  { label: "B2",    href: "/nerd-zone/phrasal-verbs/b2", color: "bg-orange-500 text-white" },
  { label: "C1",    href: "/nerd-zone/phrasal-verbs/c1", color: "bg-sky-500 text-white" },
];

/* ─── SpeedRound ─────────────────────────────────────────────────────────── */

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "To think of an idea = ?",           options: ["fall through","come up with","let down","rule out"],    answer: 1 },
  { q: "To reduce the amount = ?",          options: ["take on","cut back on","stand for","break down"],       answer: 1 },
  { q: "To fail to happen = ?",             options: ["fall through","make out","get rid of","bring about"],   answer: 0 },
  { q: "To remove or throw away = ?",       options: ["take on","stand for","get rid of","cut back on"],       answer: 2 },
  { q: "To disappoint someone = ?",         options: ["rule out","let down","account for","come up with"],     answer: 1 },
  { q: "To exclude a possibility = ?",      options: ["break down","rule out","make out","fall through"],      answer: 1 },
  { q: "To stop working = ?",               options: ["bring about","stand for","break down","let down"],      answer: 2 },
  { q: "To cause something to happen = ?",  options: ["bring about","make out","rule out","cut back on"],      answer: 0 },
  { q: "To explain or give reason = ?",     options: ["stand for","account for","take on","get rid of"],       answer: 1 },
  { q: "To accept responsibility = ?",      options: ["fall through","take on","come up with","let down"],     answer: 1 },
  { q: "She ___ a brilliant plan.",         options: ["fell through","came up with","ruled out","broke down"], answer: 1 },
  { q: "The deal ___ at the last minute.",  options: ["came up with","took on","fell through","made out"],     answer: 2 },
  { q: "We need to ___ spending.",          options: ["rule out","cut back on","stand for","let down"],        answer: 1 },
  { q: "I don't want to ___ the team.",     options: ["account for","come up with","let down","break down"],   answer: 2 },
  { q: "The car ___ on the motorway.",      options: ["fell through","broke down","ruled out","took on"],      answer: 1 },
  { q: "The reforms ___ significant change.", options: ["ruled out","let down","brought about","made out"],    answer: 2 },
  { q: "He could barely ___ her face.",     options: ["account for","take on","stand for","make out"],         answer: 3 },
  { q: '"UN" ___ United Nations.',          options: ["makes out","stands for","rules out","takes on"],        answer: 1 },
  { q: "The firm ___ ten new staff.",       options: ["brought about","cut back on","took on","fell through"],  answer: 2 },
  { q: "How do you ___ the missing data?",  options: ["rule out","account for","stand for","let down"],        answer: 1 },
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
      { id:"e1q1",  prompt: "She ___ an innovative solution that impressed the whole team.",    options: ["fell through","came up with","ruled out","broke down"],     correctIndex: 1, explanation: '"come up with" = to think of an idea' },
      { id:"e1q2",  prompt: "The project ___ when the main investor pulled out.",               options: ["took on","fell through","came up with","let down"],           correctIndex: 1, explanation: '"fall through" = to fail to happen' },
      { id:"e1q3",  prompt: "The company must ___ on costs to survive the recession.",          options: ["stand for","cut back on","make out","bring about"],           correctIndex: 1, explanation: '"cut back on" = to reduce' },
      { id:"e1q4",  prompt: "I don't want to ___ everyone who trusted me.",                     options: ["rule out","account for","let down","fall through"],            correctIndex: 2, explanation: '"let down" = to disappoint' },
      { id:"e1q5",  prompt: "The handwriting was so small I couldn't ___ the name.",            options: ["make out","take on","break down","stand for"],                correctIndex: 0, explanation: '"make out" = to see/understand with difficulty' },
      { id:"e1q6",  prompt: "We can't ___ the possibility of further delays.",                  options: ["account for","bring about","rule out","cut back on"],         correctIndex: 2, explanation: '"rule out" = to exclude a possibility' },
      { id:"e1q7",  prompt: "The machine ___ right before the presentation.",                   options: ["fell through","let down","broke down","stood for"],           correctIndex: 2, explanation: '"break down" = to stop working' },
      { id:"e1q8",  prompt: "These new policies could ___ a real change in behaviour.",         options: ["account for","bring about","get rid of","make out"],          correctIndex: 1, explanation: '"bring about" = to cause something to happen' },
      { id:"e1q9",  prompt: "How do you ___ the 20% gap in sales this quarter?",               options: ["take on","rule out","account for","come up with"],            correctIndex: 2, explanation: '"account for" = to explain' },
      { id:"e1q10", prompt: "The company ___ 50 new employees for the expansion.",              options: ["ruled out","took on","fell through","cut back on"],           correctIndex: 1, explanation: '"take on" = to hire / accept responsibility' },
    ],
  },
  2: {
    type: "input",
    title: "Exercise 2 — Type the phrasal verb",
    instructions: "Type the correct phrasal verb to complete the sentence.",
    questions: [
      { id:"e2q1",  prompt: "Nobody ___ a solution for the problem in time.",                   correct: "came up with",  explanation: '"come up with" = to think of an idea' },
      { id:"e2q2",  prompt: "The merger ___ due to regulatory problems.",                       correct: "fell through",  explanation: '"fall through" = to fail to happen' },
      { id:"e2q3",  prompt: "We need to ___ the older technology in the office.",               correct: "get rid of",   explanation: '"get rid of" = to remove' },
      { id:"e2q4",  prompt: "She ___ the entire department with poor planning.",                correct: "let down",     explanation: '"let down" = to disappoint' },
      { id:"e2q5",  prompt: "The number of errors in the report ___ poor proofreading.",        correct: "accounts for", explanation: '"account for" = to explain' },
      { id:"e2q6",  prompt: "They decided to ___ ten more engineers this quarter.",             correct: "take on",      explanation: '"take on" = to hire' },
      { id:"e2q7",  prompt: "The engine ___ on the way to the airport.",                        correct: "broke down",   explanation: '"break down" = to stop working' },
      { id:"e2q8",  prompt: "The new law ___ significant changes to healthcare.",               correct: "brought about", explanation: '"bring about" = to cause' },
      { id:"e2q9",  prompt: "I could barely ___ the writing on the board from the back.",       correct: "make out",     explanation: '"make out" = to see with difficulty' },
      { id:"e2q10", prompt: "The government plans to ___ single-use plastics by 2030.",        correct: "get rid of",   explanation: '"get rid of" = to remove' },
    ],
  },
  3: {
    type: "mcq",
    title: "Exercise 3 — What does it mean?",
    instructions: "Choose the correct meaning of the phrasal verb in each sentence.",
    questions: [
      { id:"e3q1",  prompt: "She came up with a genius solution.",         options: ["to dismiss an idea","to think of an idea","to postpone","to describe"], correctIndex: 1, explanation: '"come up with" = to think of an idea' },
      { id:"e3q2",  prompt: "The deal fell through at the last moment.",   options: ["to succeed","to fail to happen","to be delayed","to be agreed"], correctIndex: 1, explanation: '"fall through" = to fail to happen' },
      { id:"e3q3",  prompt: "We had to cut back on our budget.",           options: ["to increase","to explain","to reduce","to remove"],           correctIndex: 2, explanation: '"cut back on" = to reduce' },
      { id:"e3q4",  prompt: "He let down the whole department.",           options: ["to support","to fire","to disappoint","to help"],             correctIndex: 2, explanation: '"let down" = to disappoint' },
      { id:"e3q5",  prompt: "I couldn't make out the instructions.",       options: ["to write clearly","to ignore","to understand with difficulty","to translate"], correctIndex: 2, explanation: '"make out" = to understand with difficulty' },
      { id:"e3q6",  prompt: "We ruled out a technical error.",             options: ["to confirm","to exclude a possibility","to investigate","to cause"], correctIndex: 1, explanation: '"rule out" = to exclude a possibility' },
      { id:"e3q7",  prompt: "The old printer broke down.",                 options: ["to work better","to stop working","to be sold","to be repaired"], correctIndex: 1, explanation: '"break down" = to stop working' },
      { id:"e3q8",  prompt: "The new policy brought about major changes.", options: ["to cause","to prevent","to explain","to reject"],             correctIndex: 0, explanation: '"bring about" = to cause' },
      { id:"e3q9",  prompt: "How do you account for this result?",         options: ["to ignore","to explain","to predict","to improve"],          correctIndex: 1, explanation: '"account for" = to explain' },
      { id:"e3q10", prompt: "The firm took on 30 new graduates.",          options: ["to fire","to train","to accept/hire","to promote"],          correctIndex: 2, explanation: '"take on" = to hire / accept' },
    ],
  },
  4: {
    type: "input",
    title: "Exercise 4 — Mixed practice",
    instructions: "Type the correct phrasal verb in the right form.",
    questions: [
      { id:"e4q1",  prompt: "The team ___ a plan to cut costs by 30%.",                        correct: "came up with",  explanation: '"come up with" = to think of' },
      { id:"e4q2",  prompt: "The event ___ because of bad weather.",                            correct: "fell through",  explanation: '"fall through" = to fail to happen' },
      { id:"e4q3",  prompt: "We should ___ all the old furniture before the move.",             correct: "get rid of",   explanation: '"get rid of" = to remove' },
      { id:"e4q4",  prompt: "The company had to ___ spending during the recession.",            correct: "cut back on",  explanation: '"cut back on" = to reduce' },
      { id:"e4q5",  prompt: "She ___ us by missing the final deadline.",                        correct: "let down",     explanation: '"let down" = to disappoint' },
      { id:"e4q6",  prompt: "I ___ 'DIY' in the manual — it means do it yourself.",            correct: "made out",     explanation: '"make out" = to understand' },
      { id:"e4q7",  prompt: "We can't ___ the chance that the figures are wrong.",              correct: "rule out",     explanation: '"rule out" = to exclude a possibility' },
      { id:"e4q8",  prompt: "The company ___ 20 engineers for the new project.",                correct: "took on",      explanation: '"take on" = to hire' },
      { id:"e4q9",  prompt: "The protest ___ significant changes to the law.",                  correct: "brought about", explanation: '"bring about" = to cause' },
      { id:"e4q10", prompt: "How do you ___ such a large drop in sales this month?",            correct: "account for",  explanation: '"account for" = to explain' },
    ],
  },
};

/* ─── PDF config ─────────────────────────────────────────────────────────── */

const PDF_CONFIG: LessonPDFConfig = {
  title: "Phrasal Verbs B2",
  subtitle: "Upper-Intermediate Phrasal Verbs — 4 exercises + answer key",
  level: "B2",
  keyRule: "come up with · cut back on · fall through · get rid of · let down · make out · rule out · stand for · take on · break down",
  exercises: [
    {
      number: 1,
      title: "Exercise 1",
      difficulty: "Easy",
      instruction: "Fill in the blank with the correct phrasal verb.",
      questions: [
        "She ___ a brilliant plan.",
        "The deal ___ last minute.",
        "We must ___ on spending.",
        "It's time to ___ old files.",
        "I won't ___ the team.",
        "I couldn't ___ the text.",
        "We can't ___ this option.",
        '"UN" ___ United Nations.',
        "They ___ ten new staff.",
        "The car ___ on the road.",
      ],
    },
    {
      number: 2,
      title: "Exercise 2",
      difficulty: "Medium",
      instruction: "Write the phrasal verb in the correct form. Use the hint.",
      questions: [
        "She ___ a plan. (come up with)",
        "The deal ___. (fall through)",
        "We need to ___ waste. (get rid)",
        "He ___ the team. (let down)",
        "I couldn't ___ it. (make out)",
        "We ___ that option. (rule out)",
        "The engine ___. (break down)",
        "It ___ big change. (bring about)",
        "Explain ___. (account for)",
        "The firm ___ staff. (take on)",
      ],
    },
    {
      number: 3,
      title: "Exercise 3",
      difficulty: "Medium",
      instruction: "Write the meaning of each phrasal verb.",
      questions: [
        "come up with = _______________",
        "cut back on = ________________",
        "fall through = _______________",
        "get rid of = _________________",
        "let down = __________________",
        "make out = __________________",
        "rule out = __________________",
        "stand for = _________________",
        "take on = ___________________",
        "break down = ________________",
      ],
    },
    {
      number: 4,
      title: "Exercise 4",
      difficulty: "Hard",
      instruction: "Complete with a phrasal verb in the correct form.",
      questions: [
        "Nobody ___ a solution.",
        "The event ___ last week.",
        "___ the old equipment.",
        "She ___ on expenses.",
        "He ___ us badly.",
        "I ___ the handwriting.",
        "We can't ___ that theory.",
        "They ___ 30 new graduates.",
        "It ___ major changes.",
        "How do you ___ the errors?",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Easy — fill in the blank", answers: ["came up with","fell through","cut back on","get rid of","let down","make out","rule out","stands for","took on","broke down"] },
    { exercise: 2, subtitle: "Medium — correct form", answers: ["came up with","fell through","get rid of","let down","make out","ruled out","broke down","brought about","account for","took on"] },
    { exercise: 3, subtitle: "Medium — write the meaning", answers: ["to think of an idea","to reduce the amount","to fail to happen","to remove or throw away","to disappoint someone","to see/understand with difficulty","to exclude a possibility","to represent / tolerate","to accept responsibility","to stop working"] },
    { exercise: 4, subtitle: "Hard — correct form", answers: ["came up with","fell through","get rid of","cut back on","let down","made out","rule out","took on","brought about","account for"] },
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

export default function PhrasalVerbsB2Client({ isPro }: { isPro: boolean }) {
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
          <span className="text-slate-700 font-medium">B2</span>
        </nav>

        {/* Hero */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-violet-100 px-3 py-0.5 text-[11px] font-black text-violet-700">Phrasal Verbs</span>
            <span className="rounded-full bg-orange-500 px-3 py-0.5 text-[11px] font-black text-white">B2</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Upper-Intermediate</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            Phrasal{" "}
            <span className="relative inline-block">
              Verbs
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 high-frequency B2 phrasal verbs used in professional emails, academic writing and advanced conversations.
          </p>
        </div>

        {/* Level nav + download */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {LEVELS.map(({ label, href, color }) => (
              label === "B2" ? (
                <span key={label} className={`rounded-xl ${color} px-5 py-2 text-sm font-black shadow-sm`}>{label}</span>
              ) : (
                <a key={label} href={href} className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 transition">{label}</a>
              )
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            <DownloadWorksheet isPro={isPro} level="B2" wordBank={WORD_BANK} exercises={EXERCISES_WS} filename="PhrasalVerbs_B2_Worksheet_EnglishNerd.pdf" />
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
              <div key={verb} className={`group grid grid-cols-[1fr_1fr_1.5fr] gap-0 border-b border-slate-50 transition-colors hover:bg-[#F5DA20]/8 last:border-0 ${i % 2 === 1 ? "bg-slate-50/40" : "bg-white"}`}>
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
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">At B2, you should be using these in your writing. Pick 3 phrasal verbs and write a short email or paragraph using them today.</p>
          </div>
        </div>

        {/* Exercises + SpeedRound layout */}
        <div className="mt-14 grid gap-8 xl:grid-cols-[1fr_340px]">

          {/* LEFT: Exercises */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-sm" />
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
            <SpeedRound questions={SPEED_QUESTIONS} gameId="phrasal-verbs-b2" />
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mt-14 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone/phrasal-verbs/b1" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            ← B1
          </a>
          <a href="/nerd-zone/phrasal-verbs/c1" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            C1 →
          </a>
        </div>

      </div>
    </div>
  );
}
