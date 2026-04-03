"use client";

import { useState } from "react";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import DownloadWorksheet from "./DownloadWorksheet";

/* ─── Data ───────────────────────────────────────────────────────────────── */

const VERBS = [
  { verb: "wake up",  meaning: "to stop sleeping",                example: "I wake up at 7 every morning." },
  { verb: "get up",   meaning: "to rise from bed",                example: "She gets up and makes coffee." },
  { verb: "turn on",  meaning: "to start a device",               example: "Can you turn on the TV?" },
  { verb: "turn off", meaning: "to stop a device",                example: "Turn off the lights when you leave." },
  { verb: "put on",   meaning: "to dress yourself in",            example: "He puts on his coat before going out." },
  { verb: "take off", meaning: "to remove clothing",              example: "She takes off her shoes at the door." },
  { verb: "look for", meaning: "to try to find something",        example: "I'm looking for my phone." },
  { verb: "come in",  meaning: "to enter a place",                example: "Come in! The door is open." },
  { verb: "go out",   meaning: "to leave / socialise",            example: "They go out every Friday night." },
  { verb: "pick up",  meaning: "to lift something",               example: "Can you pick up that box?" },
  { verb: "sit down", meaning: "to take a seat",                  example: "Please sit down and relax." },
  { verb: "stand up", meaning: "to rise from a sitting position", example: "Stand up when the teacher enters." },
];

const WORD_BANK = ["come in", "get up", "turn on", "turn off", "put on", "take off", "look for", "wake up", "pick up", "go out"];

const EXERCISES_WS = [
  { before: "",                                    answer: "Come in",     after: ", please! The teacher is ready to start the lesson." },
  { before: "I usually ",                          answer: "get up",      after: " at 7 o'clock every morning." },
  { before: "Can you ",                            answer: "turn on",     after: " the lights? It's too dark in here." },
  { before: "Please ",                             answer: "turn off",    after: " your phone — the film is about to start." },
  { before: "It's cold outside. Don't forget to ", answer: "put on",      after: " your coat before you leave." },
  { before: "I always ",                           answer: "take off",    after: " my shoes before entering the house." },
  { before: "I usually ",                          answer: "wake up",     after: " very early because of the birds outside." },
  { before: "Have you seen my keys? I'm ",         answer: "looking for", after: " them everywhere." },
  { before: "Can you ",                            answer: "pick up",     after: " that box? It's too heavy for me." },
  { before: "They love to ",                       answer: "go out",      after: " and try new restaurants at the weekend." },
];

const LEVELS = [
  { label: "A1", href: "/nerd-zone/phrasal-verbs",    color: "bg-[#F5DA20] text-black" },
  { label: "B1", href: "/nerd-zone/phrasal-verbs/b1", color: "bg-violet-500 text-white" },
  { label: "B2", href: "/nerd-zone/phrasal-verbs/b2", color: "bg-orange-500 text-white" },
  { label: "C1", href: "/nerd-zone/phrasal-verbs/c1", color: "bg-sky-500 text-white" },
];

/* ─── SpeedRound ─────────────────────────────────────────────────────────── */

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "To stop sleeping = ?",           options: ["wake up", "sit down", "go out", "turn off"],        answer: 0 },
  { q: "To start a device = ?",          options: ["turn off", "turn on", "look for", "pick up"],       answer: 1 },
  { q: '"Come in" means = ?',            options: ["to leave", "to sit", "to enter a place", "to stand up"], answer: 2 },
  { q: "To remove clothing = ?",         options: ["put on", "wake up", "take off", "come in"],         answer: 2 },
  { q: "To try to find something = ?",   options: ["go out", "look for", "get up", "stand up"],         answer: 1 },
  { q: "To lift something = ?",          options: ["sit down", "pick up", "turn on", "wake up"],        answer: 1 },
  { q: '"Turn off" means = ?',           options: ["to start a device", "to find", "to stop a device", "to enter"], answer: 2 },
  { q: "To leave and socialise = ?",     options: ["come in", "sit down", "go out", "wake up"],         answer: 2 },
  { q: "To dress yourself in = ?",       options: ["take off", "put on", "get up", "turn off"],         answer: 1 },
  { q: '"Get up" means = ?',             options: ["to stop sleeping", "to go outside", "to rise from bed", "to sit down"], answer: 2 },
  { q: "I always ___ at 7 AM.",          options: ["go out", "sit down", "wake up", "turn off"],        answer: 2 },
  { q: "Can you ___ the TV?",            options: ["pick up", "turn on", "come in", "take off"],        answer: 1 },
  { q: "Please ___ your coat — it's cold!", options: ["take off", "look for", "put on", "sit down"],   answer: 2 },
  { q: "I'm ___ my keys everywhere.",    options: ["turning on", "going out", "looking for", "waking up"], answer: 2 },
  { q: "___ ! The door is open.",        options: ["Stand up", "Go out", "Come in", "Turn off"],        answer: 2 },
  { q: "She ___ her shoes at the door.", options: ["turned on", "picked up", "took off", "went out"],   answer: 2 },
  { q: "Can you ___ that box for me?",   options: ["turn on", "pick up", "come in", "sit down"],        answer: 1 },
  { q: "They love to ___ on Fridays.",   options: ["wake up", "go out", "stand up", "look for"],        answer: 1 },
  { q: "Please ___ and relax!",          options: ["sit down", "go out", "turn on", "come in"],         answer: 0 },
  { q: "He ___ at 6, had coffee and left.", options: ["went out", "got up", "turned off", "came in"],   answer: 1 },
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
      { id:"e1q1",  prompt: "I usually ___ at 7 o'clock every morning.",                options: ["wake up","sit down","go out","come in"],         correctIndex: 0, explanation: '"wake up" = to stop sleeping' },
      { id:"e1q2",  prompt: "Can you ___ the lights? It's dark in here.",               options: ["turn off","turn on","put on","pick up"],          correctIndex: 1, explanation: '"turn on" = to start a device' },
      { id:"e1q3",  prompt: "Don't forget to ___ your coat — it's cold outside!",       options: ["take off","look for","put on","stand up"],        correctIndex: 2, explanation: '"put on" = to dress yourself in something' },
      { id:"e1q4",  prompt: "Everyone stood up and then ___ when the teacher said so.", options: ["went out","sat down","woke up","came in"],        correctIndex: 1, explanation: '"sit down" = to take a seat' },
      { id:"e1q5",  prompt: "I've lost my phone. I'm ___ it everywhere.",               options: ["picking up","going out","looking for","turning on"], correctIndex: 2, explanation: '"look for" = to try to find something' },
      { id:"e1q6",  prompt: "Please ___ your shoes before entering the house.",         options: ["put on","take off","pick up","wake up"],          correctIndex: 1, explanation: '"take off" = to remove clothing' },
      { id:"e1q7",  prompt: "The box fell. Can you ___ it for me?",                     options: ["turn on","come in","sit down","pick up"],         correctIndex: 3, explanation: '"pick up" = to lift something' },
      { id:"e1q8",  prompt: "They love to ___ and try new restaurants at weekends.",    options: ["go out","stand up","wake up","turn off"],         correctIndex: 0, explanation: '"go out" = to leave and socialise' },
      { id:"e1q9",  prompt: "___! The door is open and we're waiting for you.",         options: ["Go out","Turn on","Come in","Stand up"],          correctIndex: 2, explanation: '"come in" = to enter a place' },
      { id:"e1q10", prompt: "He forgot to ___ the lights before leaving the room.",     options: ["turn off","get up","look for","come in"],         correctIndex: 0, explanation: '"turn off" = to stop a device' },
    ],
  },
  2: {
    type: "input",
    title: "Exercise 2 — Type the phrasal verb",
    instructions: "Type the correct phrasal verb to complete the sentence.",
    questions: [
      { id:"e2q1",  prompt: "My alarm rang at 6:30, but I didn't ___ until 7.",          correct: "wake up",     explanation: '"wake up" = to stop sleeping' },
      { id:"e2q2",  prompt: "Can you ___ the television? The match is starting.",         correct: "turn on",     explanation: '"turn on" = to start a device' },
      { id:"e2q3",  prompt: "Please ___ the lights when you leave the room.",             correct: "turn off",    explanation: '"turn off" = to stop a device' },
      { id:"e2q4",  prompt: "She ___ her jacket as soon as she got home.",                correct: "took off",    explanation: '"take off" = to remove clothing' },
      { id:"e2q5",  prompt: "I can't find my keys — I've been ___ them all morning.",    correct: "looking for", explanation: '"look for" = to try to find something' },
      { id:"e2q6",  prompt: "___ ! We've been waiting for you.",                          correct: "come in",     explanation: '"come in" = to enter a place' },
      { id:"e2q7",  prompt: "Could you ___ that pen for me? I dropped it.",               correct: "pick up",     explanation: '"pick up" = to lift something' },
      { id:"e2q8",  prompt: "They decided to ___ and explore the city.",                  correct: "go out",      explanation: '"go out" = to leave and socialise' },
      { id:"e2q9",  prompt: "He ___ early, had breakfast and went to work.",              correct: "got up",      explanation: '"get up" = to rise from bed' },
      { id:"e2q10", prompt: "Everyone ___ when the music started.",                       correct: "stood up",    explanation: '"stand up" = to rise from a sitting position' },
    ],
  },
  3: {
    type: "mcq",
    title: "Exercise 3 — What does it mean?",
    instructions: "Choose the correct meaning of the phrasal verb in each sentence.",
    questions: [
      { id:"e3q1",  prompt: "She woke up early this morning.",        options: ["started sleeping","stopped sleeping","went outside","sat down"],          correctIndex: 1, explanation: '"wake up" = to stop sleeping' },
      { id:"e3q2",  prompt: "Can you turn off the TV please?",        options: ["start the TV","increase volume","stop the TV","find the TV"],             correctIndex: 2, explanation: '"turn off" = to stop a device' },
      { id:"e3q3",  prompt: "He put on his coat before leaving.",     options: ["removed his coat","bought a coat","dressed in a coat","looked for a coat"], correctIndex: 2, explanation: '"put on" = to dress yourself in something' },
      { id:"e3q4",  prompt: "I'm looking for my glasses.",            options: ["cleaning","wearing","trying to find","buying"],                           correctIndex: 2, explanation: '"look for" = to try to find something' },
      { id:"e3q5",  prompt: "Come in, the door is open!",             options: ["leave the room","enter the room","sit down","stand up"],                  correctIndex: 1, explanation: '"come in" = to enter a place' },
      { id:"e3q6",  prompt: "She picked up the bag from the floor.",  options: ["dropped","lifted","looked for","put on"],                                 correctIndex: 1, explanation: '"pick up" = to lift something' },
      { id:"e3q7",  prompt: "They go out every Friday evening.",      options: ["stay at home","travel abroad","leave and socialise","wake up early"],     correctIndex: 2, explanation: '"go out" = to leave and socialise' },
      { id:"e3q8",  prompt: "Please sit down!",                       options: ["stand up","leave","take a seat","enter"],                                 correctIndex: 2, explanation: '"sit down" = to take a seat' },
      { id:"e3q9",  prompt: "She took off her shoes at the door.",    options: ["put on","bought","removed","looked for"],                                 correctIndex: 2, explanation: '"take off" = to remove clothing' },
      { id:"e3q10", prompt: "He got up at 8.",                        options: ["went to sleep","rose from bed","went outside","turned off the alarm"],    correctIndex: 1, explanation: '"get up" = to rise from bed' },
    ],
  },
  4: {
    type: "input",
    title: "Exercise 4 — Mixed practice",
    instructions: "Type the correct phrasal verb in the right form.",
    questions: [
      { id:"e4q1",  prompt: "It's raining! Don't forget to ___ your coat.",              correct: "put on",      explanation: '"put on" = to dress yourself in something' },
      { id:"e4q2",  prompt: "She ___ her shoes and put them by the door.",               correct: "took off",    explanation: '"take off" = to remove clothing' },
      { id:"e4q3",  prompt: "I'm going to ___ and meet some friends tonight.",           correct: "go out",      explanation: '"go out" = to leave and socialise' },
      { id:"e4q4",  prompt: "Can you ___ the laptop? We need to start the meeting.",     correct: "turn on",     explanation: '"turn on" = to start a device' },
      { id:"e4q5",  prompt: "He ___ at 6, made coffee, and went for a run.",             correct: "got up",      explanation: '"get up" = to rise from bed' },
      { id:"e4q6",  prompt: "I've been ___ my passport for an hour!",                   correct: "looking for", explanation: '"look for" = to try to find something' },
      { id:"e4q7",  prompt: "The baby is asleep — please ___ the music.",               correct: "turn off",    explanation: '"turn off" = to stop a device' },
      { id:"e4q8",  prompt: "Don't just stand there — ___!",                            correct: "sit down",    explanation: '"sit down" = to take a seat' },
      { id:"e4q9",  prompt: "Someone knocks. You say: '___ ! The door is open.'",       correct: "come in",     explanation: '"come in" = to enter a place' },
      { id:"e4q10", prompt: "Could you ___ my bag from the floor? My back hurts.",      correct: "pick up",     explanation: '"pick up" = to lift something' },
    ],
  },
};

/* ─── PDF config ─────────────────────────────────────────────────────────── */

const PDF_CONFIG: LessonPDFConfig = {
  title: "Phrasal Verbs A1",
  subtitle: "Beginner Phrasal Verbs — 4 exercises + answer key",
  level: "A1",
  keyRule: "wake up · get up · turn on · turn off · put on · take off · look for · come in · go out · pick up",
  exercises: [
    {
      number: 1,
      title: "Exercise 1",
      difficulty: "Easy",
      instruction: "Fill in the blank with the correct phrasal verb.",
      questions: [
        "I usually ___ at 7 in the morning.",
        "Can you ___ the lights, please?",
        "Don't forget to ___ your coat.",
        "She ___ when the teacher came in.",
        "I'm ___ my keys everywhere.",
        "Please ___ your shoes at the door.",
        "Can you ___ that box for me?",
        "They ___ every Friday night.",
        "___ ! The door is open.",
        "He forgot to ___ the lights.",
      ],
    },
    {
      number: 2,
      title: "Exercise 2",
      difficulty: "Medium",
      instruction: "Write the phrasal verb in the correct form. Use the hint.",
      questions: [
        "She ___ her jacket when she got home. (take off)",
        "Can you ___ the TV? (turn on)",
        "Please ___ the lights when you leave. (turn off)",
        "I can't find my keys — I'm ___ them. (look for)",
        "___ ! We've been waiting for you. (come in)",
        "Could you ___ that pen? I dropped it. (pick up)",
        "They decided to ___ and see the city. (go out)",
        "He ___ early and had breakfast. (get up)",
        "Everyone ___ when the music started. (stand up)",
        "My alarm rang, but I didn't ___ until 7. (wake up)",
      ],
    },
    {
      number: 3,
      title: "Exercise 3",
      difficulty: "Medium",
      instruction: "Write the meaning of each phrasal verb.",
      questions: [
        "wake up = ___________________",
        "turn on = ___________________",
        "turn off = __________________",
        "put on = ____________________",
        "take off = __________________",
        "look for = __________________",
        "come in = ___________________",
        "go out = ____________________",
        "pick up = ___________________",
        "get up = ____________________",
      ],
    },
    {
      number: 4,
      title: "Exercise 4",
      difficulty: "Hard",
      instruction: "Complete with a phrasal verb in the correct form.",
      questions: [
        "It's cold! Don't forget to ___ your coat.",
        "She ___ her shoes and left them by the door.",
        "I'm going to ___ and meet friends tonight.",
        "Can you ___ the laptop? We need to start.",
        "He ___ at 6, made coffee, and went for a run.",
        "I've been ___ my passport for an hour!",
        "The baby's asleep — please ___ the music.",
        "Don't just stand there — ___!",
        "She knocked. I said: '___ , the door's open!'",
        "Could you ___ my bag? My back hurts.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Easy — fill in the blank", answers: ["wake up","turn on","put on","sat down","looking for","take off","pick up","go out","come in","turn off"] },
    { exercise: 2, subtitle: "Medium — correct form", answers: ["took off","turn on","turn off","looking for","come in","pick up","go out","got up","stood up","wake up"] },
    { exercise: 3, subtitle: "Medium — write the meaning", answers: ["to stop sleeping","to start a device","to stop a device","to dress yourself in","to remove clothing","to try to find","to enter a place","to leave / socialise","to lift something","to rise from bed"] },
    { exercise: 4, subtitle: "Hard — correct form", answers: ["put on","took off","go out","turn on","got up","looking for","turn off","sit down","come in","pick up"] },
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

export default function PhrasalVerbsA1Client({ isPro }: { isPro: boolean }) {
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
          {[["Home", "/"], ["Nerd Zone", "/nerd-zone"]].map(([label, href]) => (
            <span key={href} className="flex items-center gap-1.5">
              <a href={href} className="hover:text-slate-700 transition">{label}</a>
              <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          ))}
          <span className="text-slate-700 font-medium">Phrasal Verbs · A1</span>
        </nav>

        {/* Hero */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-violet-100 px-3 py-0.5 text-[11px] font-black text-violet-700">Phrasal Verbs</span>
            <span className="rounded-full bg-[#F5DA20] px-3 py-0.5 text-[11px] font-black text-black">A1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Beginner</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            Phrasal{" "}
            <span className="relative inline-block">
              Verbs
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            Start with these 12 essential A1 phrasal verbs. They appear in everyday conversations, instructions and short texts — master them first.
          </p>
        </div>

        {/* Level nav + download */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {LEVELS.map(({ label, href, color }) => (
              label === "A1" ? (
                <span key={label} className={`rounded-xl ${color} px-5 py-2 text-sm font-black shadow-sm`}>{label}</span>
              ) : (
                <a key={label} href={href} className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 transition">{label}</a>
              )
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            <DownloadWorksheet isPro={isPro} level="A1" wordBank={WORD_BANK} exercises={EXERCISES_WS} filename="PhrasalVerbs_A1_Worksheet_EnglishNerd.pdf" />
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
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">Phrasal verbs are easier to remember in context. Say the whole example sentence out loud 3 times — your brain stores it as a chunk, not a translation.</p>
          </div>
        </div>

        {/* Exercises + SpeedRound layout */}
        <div className="mt-14 grid gap-8 xl:grid-cols-[1fr_340px]">

          {/* LEFT: Exercises */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#F5DA20] shadow-sm" />
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
            <SpeedRound questions={SPEED_QUESTIONS} isPro={isPro} />
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mt-14 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Back to Nerd Zone
          </a>
          <a href="/nerd-zone/phrasal-verbs/b1" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            Next: B1
          </a>
        </div>

      </div>
    </div>
  );
}
