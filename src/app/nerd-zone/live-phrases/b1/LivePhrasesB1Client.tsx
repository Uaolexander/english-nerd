"use client";

import { useState } from "react";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import DownloadWorksheet from "../DownloadWorksheet";

/* ─── Data ───────────────────────────────────────────────────────────────── */

const PHRASES = [
  { phrase: "Long story short",       meaning: "To summarise briefly",                         example: "Long story short, we missed the flight." },
  { phrase: "At the end of the day",  meaning: "Ultimately / when everything is considered",   example: "At the end of the day, the client comes first." },
  { phrase: "Give it a shot",         meaning: "Try it",                                        example: "You've never tried sushi? Give it a shot!" },
  { phrase: "Cut to the chase",       meaning: "Get to the main point quickly",                 example: "Let's cut to the chase — are you interested?" },
  { phrase: "Out of the blue",        meaning: "Suddenly and unexpectedly",                     example: "She called out of the blue after five years." },
  { phrase: "On the same page",       meaning: "Having the same understanding",                 example: "Are we all on the same page about the deadline?" },
  { phrase: "In a nutshell",          meaning: "In summary / briefly",                          example: "In a nutshell, the project is behind schedule." },
  { phrase: "Keep me posted",         meaning: "Keep me informed / give me updates",            example: "Let me know how it goes — keep me posted." },
  { phrase: "Pull someone's leg",     meaning: "To joke with someone / tease",                  example: "I'm just pulling your leg — relax!" },
  { phrase: "It's on me",             meaning: "I'll pay for it / it's my treat",               example: "Don't worry about the bill — it's on me tonight." },
  { phrase: "I'm all for it",         meaning: "I fully support it",                            example: "A shorter working week? I'm all for it." },
  { phrase: "That's the thing",       meaning: "That's exactly the issue or point",             example: "That's the thing — nobody told me about the change." },
];

const WORD_BANK = ["long story short", "at the end of the day", "give it a shot", "cut to the chase", "out of the blue", "on the same page", "in a nutshell", "keep me posted", "pull your leg", "it's on me"];

const EXERCISES_WS = [
  { before: "I was sitting at home when, ",          answer: "out of the blue",         after: ", she called after five years of silence."          },
  { before: "I don't have time for the full version — just explain it ", answer: "in a nutshell", after: "."                                        },
  { before: "You've never tried Thai food? ",        answer: "Give it a shot",          after: " — I think you'll love it."                         },
  { before: "Stop going around the topic and just ", answer: "cut to the chase",        after: "."                                                  },
  { before: "Are we all ",                           answer: "on the same page",        after: " about the new deadline?"                           },
  { before: "Don't worry about the bill — ",         answer: "it's on me",              after: " tonight."                                          },
  { before: "I'm just ",                             answer: "pulling your leg",        after: " — I didn't really forget your birthday!"           },
  { before: "",                                      answer: "Long story short",        after: ", we missed the flight and had to book a hotel."    },
  { before: "",                                      answer: "At the end of the day",   after: ", what matters most is that the client is happy."   },
  { before: "Let me know how the meeting goes — ",   answer: "keep me posted",          after: "."                                                  },
];

const LEVELS = [
  { label: "A1-A2", href: "/nerd-zone/live-phrases",     color: "bg-[#F5DA20] text-black" },
  { label: "B1",    href: "/nerd-zone/live-phrases/b1",  color: "bg-violet-500 text-white" },
  { label: "B2",    href: "/nerd-zone/live-phrases/b2",  color: "bg-orange-500 text-white" },
  { label: "C1",    href: "/nerd-zone/live-phrases/c1",  color: "bg-sky-500 text-white" },
];

/* ─── SpeedRound ─────────────────────────────────────────────────────────── */

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: '"Long story short" means = ?',       options: ["to exaggerate","to summarise briefly","to tell a story","to be honest"],     answer: 1 },
  { q: '"Give it a shot" means = ?',         options: ["fire a gun","try it","give a gift","take a photo"],                          answer: 1 },
  { q: '"Out of the blue" means = ?',        options: ["feeling sad","in the sky","suddenly","painting blue"],                       answer: 2 },
  { q: '"On the same page" means = ?',       options: ["same book","shared understanding","same address","same age"],                answer: 1 },
  { q: '"In a nutshell" means = ?',          options: ["inside a nut","in summary","a small shell","very small"],                    answer: 1 },
  { q: '"Keep me posted" means = ?',         options: ["send letters","keep informed","post online","stay still"],                   answer: 1 },
  { q: '"It\'s on me" means = ?',            options: ["on my back","I\'ll pay","it\'s my fault","on my mind"],                     answer: 1 },
  { q: '"Cut to the chase" means = ?',       options: ["run faster","get to the point","cut something","chase someone"],             answer: 1 },
  { q: '"Pull someone\'s leg" means = ?',    options: ["pull physically","joke with them","help someone","trip someone"],            answer: 1 },
  { q: '"I\'m all for it" means = ?',        options: ["I disagree","I\'m confused","I fully support it","I\'m against it"],        answer: 2 },
  { q: '"That\'s the thing" = ?',            options: ["that object","that\'s the point","a specific thing","that\'s wrong"],       answer: 1 },
  { q: '"At the end of the day" = ?',        options: ["at night","ultimately","at 6 pm","at the finish"],                          answer: 1 },
  { q: 'She called ___ after five years.',   options: ["out of the blue","in a nutshell","on the same page","it\'s on me"],         answer: 0 },
  { q: 'You\'ve never tried it? ___!',       options: ["Keep me posted","Give it a shot","Cut to the chase","That\'s the thing"],   answer: 1 },
  { q: 'Don\'t worry about the bill — ___!', options: ["long story short","I\'m all for it","it\'s on me","in a nutshell"],        answer: 2 },
  { q: '___, we missed the flight.',         options: ["Out of the blue","Long story short","In a nutshell","On the same page"],    answer: 1 },
  { q: 'Let me know how it goes — ___.',     options: ["give it a shot","keep me posted","cut to the chase","it\'s on me"],        answer: 1 },
  { q: 'Are we all ___ on the deadline?',    options: ["out of the blue","in a nutshell","on the same page","all for it"],         answer: 2 },
  { q: 'I\'m just ___ — don\'t worry!',     options: ["on the same page","pulling your leg","cutting to the chase","keeping posted"], answer: 1 },
  { q: 'A shorter week? ___ !',              options: ["I\'m all for it","That\'s the thing","Long story short","In a nutshell"],  answer: 0 },
];

/* ─── Exercise types ─────────────────────────────────────────────────────── */

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq";   title: string; instructions: string; questions: MCQ[]    }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

/* ─── Exercises ──────────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3 | 4, ExerciseSet> = {
  1: {
    type: "mcq",
    title: "Exercise 1 — Choose the expression",
    instructions: "Choose the correct expression to complete each sentence.",
    questions: [
      { id:"e1q1",  prompt: 'I don\'t have time for the full story — ___, we missed the flight.',                   options: ["In a nutshell","Long story short","On the same page","Give it a shot"],    correctIndex: 1, explanation: '"Long story short" = to summarise briefly' },
      { id:"e1q2",  prompt: 'You\'ve never tried sushi? ___ — you might love it!',                                  options: ["Keep me posted","Cut to the chase","Give it a shot","It\'s on me"],        correctIndex: 2, explanation: '"Give it a shot" = try it' },
      { id:"e1q3",  prompt: 'She called me completely ___ — I hadn\'t heard from her in years.',                    options: ["out of the blue","in a nutshell","on the same page","long story short"],   correctIndex: 0, explanation: '"Out of the blue" = suddenly and unexpectedly' },
      { id:"e1q4",  prompt: 'Are we all ___ about what needs to happen by Friday?',                                 options: ["pulling my leg","on the same page","all for it","cutting to the chase"],   correctIndex: 1, explanation: '"On the same page" = having the same understanding' },
      { id:"e1q5",  prompt: 'Stop going around in circles and just ___!',                                           options: ["give it a shot","keep me posted","cut to the chase","pull my leg"],        correctIndex: 2, explanation: '"Cut to the chase" = get to the main point quickly' },
      { id:"e1q6",  prompt: 'Don\'t worry about the bill tonight — ___.',                                           options: ["in a nutshell","it\'s on me","I\'m all for it","long story short"],       correctIndex: 1, explanation: '"It\'s on me" = I\'ll pay for it' },
      { id:"e1q7",  prompt: 'Let me know how the interview goes — ___.',                                            options: ["cut to the chase","give it a shot","keep me posted","that\'s the thing"],  correctIndex: 2, explanation: '"Keep me posted" = keep me informed' },
      { id:"e1q8",  prompt: 'A four-day working week? ___ — sign me up!',                                          options: ["I\'m all for it","Out of the blue","That\'s the thing","Long story short"], correctIndex: 0, explanation: '"I\'m all for it" = I fully support it' },
      { id:"e1q9",  prompt: 'Relax — I\'m just ___ ! I didn\'t forget your birthday.',                              options: ["on the same page","keeping you posted","pulling your leg","in a nutshell"],  correctIndex: 2, explanation: '"Pull someone\'s leg" = to joke with someone' },
      { id:"e1q10", prompt: '___, the meeting was a disaster but we saved the deal.',                                options: ["Out of the blue","At the end of the day","In a nutshell","Give it a shot"], correctIndex: 2, explanation: '"In a nutshell" = in summary' },
    ],
  },
  2: {
    type: "input",
    title: "Exercise 2 — Type the expression",
    instructions: "Type the correct expression to complete each sentence.",
    questions: [
      { id:"e2q1",  prompt: "I was just sitting at home when, ___, she called after five years.",   correct: "out of the blue",      explanation: '"Out of the blue" = suddenly and unexpectedly' },
      { id:"e2q2",  prompt: "Don\'t give me the full story — just explain it ___.",                  correct: "in a nutshell",        explanation: '"In a nutshell" = in summary / briefly' },
      { id:"e2q3",  prompt: "___ — we missed the train and had to take a taxi.",                    correct: "long story short",     explanation: '"Long story short" = to summarise briefly' },
      { id:"e2q4",  prompt: "Let me ___ — are you interested or not?",                              correct: "cut to the chase",     explanation: '"Cut to the chase" = get to the main point' },
      { id:"e2q5",  prompt: "Before we start, are we all ___ about the plan?",                     correct: "on the same page",     explanation: '"On the same page" = having the same understanding' },
      { id:"e2q6",  prompt: "Let me know the result — ___ !",                                       correct: "keep me posted",       explanation: '"Keep me posted" = keep me informed' },
      { id:"e2q7",  prompt: "Have you tried the new restaurant? You should ___.",                   correct: "give it a shot",       explanation: '"Give it a shot" = try it' },
      { id:"e2q8",  prompt: "Don\'t worry about lunch — ___ today.",                                correct: "it's on me",           explanation: '"It\'s on me" = I\'ll pay for it' },
      { id:"e2q9",  prompt: "___ , what really matters is how we treat each other.",                correct: "at the end of the day", explanation: '"At the end of the day" = ultimately' },
      { id:"e2q10", prompt: "That\'s the meeting that ___ — nobody warned us.",                     correct: "out of the blue",      explanation: '"Out of the blue" = suddenly and unexpectedly' },
    ],
  },
  3: {
    type: "mcq",
    title: "Exercise 3 — What does it mean?",
    instructions: "Choose the correct meaning of the expression.",
    questions: [
      { id:"e3q1",  prompt: '"Long story short, we cancelled the event."',       options: ["in detail","to summarise","once upon a time","to be honest"],          correctIndex: 1, explanation: '"Long story short" = to summarise briefly' },
      { id:"e3q2",  prompt: '"Give it a shot — you\'ve got nothing to lose."',   options: ["take a photo","fire a gun","try it","give something away"],             correctIndex: 2, explanation: '"Give it a shot" = try it' },
      { id:"e3q3",  prompt: '"She called out of the blue."',                     options: ["feeling sad","very suddenly","from a blue phone","she was angry"],      correctIndex: 1, explanation: '"Out of the blue" = suddenly and unexpectedly' },
      { id:"e3q4",  prompt: '"Are we on the same page?"',                        options: ["same book","same job","same understanding","same schedule"],             correctIndex: 2, explanation: '"On the same page" = having the same understanding' },
      { id:"e3q5",  prompt: '"In a nutshell, the plan failed."',                 options: ["in detail","in a small space","in summary","in secret"],                correctIndex: 2, explanation: '"In a nutshell" = in summary' },
      { id:"e3q6",  prompt: '"Keep me posted on the results."',                  options: ["post a letter","keep me informed","write a post","stay close"],         correctIndex: 1, explanation: '"Keep me posted" = keep me informed' },
      { id:"e3q7",  prompt: '"Don\'t worry — it\'s on me."',                    options: ["it\'s my fault","I\'ll pay","it\'s on top of me","I\'m responsible"],  correctIndex: 1, explanation: '"It\'s on me" = I\'ll pay for it' },
      { id:"e3q8",  prompt: '"I\'m all for it!"',                               options: ["I disagree","I\'m confused","I support it fully","I\'m worried"],      correctIndex: 2, explanation: '"I\'m all for it" = I fully support it' },
      { id:"e3q9",  prompt: '"I was just pulling your leg!"',                    options: ["pulling your arm","joking with you","helping you","hurting you"],       correctIndex: 1, explanation: '"Pull someone\'s leg" = to joke with them' },
      { id:"e3q10", prompt: '"Cut to the chase — what\'s the problem?"',        options: ["run faster","chase someone","get to the point","cut something"],        correctIndex: 2, explanation: '"Cut to the chase" = get to the main point quickly' },
    ],
  },
  4: {
    type: "input",
    title: "Exercise 4 — Mixed practice",
    instructions: "Type the correct expression in the right form.",
    questions: [
      { id:"e4q1",  prompt: "Let\'s not waste time — ___ and tell me what happened.",                correct: "cut to the chase",     explanation: '"Cut to the chase" = get to the main point' },
      { id:"e4q2",  prompt: "___ , everything worked out fine in the end.",                         correct: "long story short",     explanation: '"Long story short" = to summarise briefly' },
      { id:"e4q3",  prompt: "___ , success depends on the effort you put in.",                      correct: "at the end of the day", explanation: '"At the end of the day" = ultimately' },
      { id:"e4q4",  prompt: "I\'ve never been skiing — maybe I should ___.",                        correct: "give it a shot",       explanation: '"Give it a shot" = try it' },
      { id:"e4q5",  prompt: "The news came ___  — no one expected the announcement.",               correct: "out of the blue",      explanation: '"Out of the blue" = suddenly and unexpectedly' },
      { id:"e4q6",  prompt: "Before we decide, let\'s make sure we\'re all ___.",                  correct: "on the same page",     explanation: '"On the same page" = shared understanding' },
      { id:"e4q7",  prompt: "___ , the deal was good but the timing was wrong.",                    correct: "in a nutshell",        explanation: '"In a nutshell" = in summary' },
      { id:"e4q8",  prompt: "Send me the report and ___ on any changes.",                           correct: "keep me posted",       explanation: '"Keep me posted" = keep me informed' },
      { id:"e4q9",  prompt: "Don\'t pay — this dinner is ___.",                                    correct: "on me",                explanation: '"It\'s on me" = I\'ll pay for it' },
      { id:"e4q10", prompt: "___ — nobody told me about the meeting!",                              correct: "that's the thing",     explanation: '"That\'s the thing" = that\'s exactly the issue' },
    ],
  },
};

/* ─── PDF config ─────────────────────────────────────────────────────────── */

const PDF_CONFIG: LessonPDFConfig = {
  title: "Live Phrases B1",
  subtitle: "Intermediate Expressions — 4 exercises + answer key",
  level: "B1",
  keyRule: "long story short · give it a shot · out of the blue · on the same page · in a nutshell · keep me posted · it's on me · cut to the chase",
  exercises: [
    {
      number: 1,
      title: "Exercise 1",
      difficulty: "Easy",
      instruction: "Fill in with the correct expression.",
      questions: [
        "___, we missed the flight.",
        "Are we all ___ on the plan?",
        "You never tried it? ___!",
        "___ — get to the point!",
        "She called me ___ yesterday.",
        "Let me know — ___.",
        "Dinner is ___ tonight.",
        "___ — the project failed.",
        "A 4-day week? ___!",
        "___ — nobody told me.",
      ],
    },
    {
      number: 2,
      title: "Exercise 2",
      difficulty: "Medium",
      instruction: "Write the expression. Use the hint.",
      questions: [
        "___ — in summary. (3 words)",
        "___ — try it. (4 words)",
        "___ — unexpectedly. (4 words)",
        "___ — same understanding. (4 words)",
        "___ — get to point. (4 words)",
        "___ — keep informed. (3 words)",
        "___ — I'll pay. (3 words)",
        "___ — I support it. (4 words)",
        "___ — to joke. (3 words)",
        "___ — that's the issue. (3 words)",
      ],
    },
    {
      number: 3,
      title: "Exercise 3",
      difficulty: "Medium",
      instruction: "Write the meaning of each expression.",
      questions: [
        "long story short = ___________",
        "give it a shot = ___________",
        "out of the blue = ___________",
        "on the same page = __________",
        "in a nutshell = _____________",
        "keep me posted = ___________",
        "it's on me = _______________",
        "cut to the chase = __________",
        "pull someone's leg = ________",
        "I'm all for it = ____________",
      ],
    },
    {
      number: 4,
      title: "Exercise 4",
      difficulty: "Hard",
      instruction: "Complete with the correct expression.",
      questions: [
        "___, results are what count.",
        "Never tried yoga? ___!",
        "She texted me ___ this morning.",
        "___ — are we agreed on this?",
        "___ — what\'s the main point?",
        "Let me know the result — ___.",
        "Lunch is ___ — put your wallet away.",
        "___ , the plan didn\'t work.",
        "I was just ___ — it was a joke!",
        "___ — no one told me!",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Easy — fill in the blank", answers: ["Long story short","on the same page","Give it a shot","Cut to the chase","out of the blue","keep me posted","on me","In a nutshell","I'm all for it","That's the thing"] },
    { exercise: 2, subtitle: "Medium — write the expression", answers: ["In a nutshell","Give it a shot","Out of the blue","On the same page","Cut to the chase","Keep me posted","It's on me","I'm all for it","Pull their leg","That's the thing"] },
    { exercise: 3, subtitle: "Medium — write the meaning", answers: ["to summarise briefly","try it","suddenly, unexpectedly","same understanding","in summary / briefly","keep me informed","I'll pay","get to the point","to joke with someone","I fully support it"] },
    { exercise: 4, subtitle: "Hard — mixed practice", answers: ["At the end of the day","Give it a shot","out of the blue","On the same page","Cut to the chase","keep me posted","on me","Long story short","pulling your leg","That's the thing"] },
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
  const score = checked ? set.questions.filter((q) => answers[q.id] === q.correctIndex).length : 0;
  return (
    <div>
      <p className="mb-5 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">{set.instructions}</p>
      <div className="space-y-5">
        {set.questions.map((q, qi) => {
          const chosen = answers[q.id] ?? -1;
          const isCorrect = checked && chosen === q.correctIndex;
          const isWrong   = checked && chosen !== q.correctIndex && chosen !== -1;
          return (
            <div key={q.id}>
              <p className="mb-2 text-sm font-semibold text-slate-800"><span className="mr-1.5 text-slate-400">{qi + 1}.</span>{q.prompt}</p>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  let cls = "rounded-xl border px-4 py-2 text-sm font-semibold transition ";
                  if (!checked) { cls += isChosen ? "border-sky-400 bg-sky-100 text-sky-800" : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50"; }
                  else if (oi === q.correctIndex) { cls += "border-emerald-400 bg-emerald-50 text-emerald-800"; }
                  else if (isChosen) { cls += "border-red-300 bg-red-50 text-red-700 line-through"; }
                  else { cls += "border-slate-100 bg-slate-50 text-slate-400"; }
                  return <button key={oi} disabled={checked} className={cls} onClick={() => onAnswer(q.id, oi)}>{opt}</button>;
                })}
              </div>
              {checked && (isCorrect || isWrong) && (
                <p className={`mt-1.5 text-xs font-semibold ${isCorrect ? "text-emerald-600" : "text-red-500"}`}>{isCorrect ? "✓ Correct!" : `✗ ${q.explanation}`}</p>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center gap-3">
        {!checked ? (
          <button onClick={onCheck} disabled={Object.keys(answers).length < set.questions.length} className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-black text-white transition hover:bg-slate-700 disabled:opacity-40">Check answers</button>
        ) : (
          <>
            <div className={`rounded-xl px-5 py-2.5 text-sm font-black ${score === set.questions.length ? "bg-emerald-500 text-white" : score >= 7 ? "bg-[#F5DA20] text-black" : "bg-slate-200 text-slate-700"}`}>{score} / {set.questions.length}</div>
            <button onClick={onReset} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Try again</button>
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
  const score = checked ? set.questions.filter((q) => normalize(answers[q.id] ?? "") === normalize(q.correct)).length : 0;
  return (
    <div>
      <p className="mb-5 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800">{set.instructions}</p>
      <div className="space-y-4">
        {set.questions.map((q, qi) => {
          const val = answers[q.id] ?? "";
          const isCorrect = checked && normalize(val) === normalize(q.correct);
          const isWrong   = checked && normalize(val) !== normalize(q.correct);
          const parts = q.prompt.split("___");
          return (
            <div key={q.id} className="flex flex-wrap items-center gap-1">
              <span className="text-sm text-slate-400 mr-1">{qi + 1}.</span>
              <span className="text-sm text-slate-800">{parts[0]}</span>
              <input type="text" value={val} disabled={checked} onChange={(e) => onAnswer(q.id, e.target.value)} placeholder="___"
                className={`w-40 rounded-lg border px-3 py-1.5 text-center text-sm font-semibold outline-none transition ${!checked ? "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100" : isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-700"}`} />
              <span className="text-sm text-slate-800">{parts[1]}</span>
              {checked && isWrong && <span className="ml-1 text-xs text-emerald-600 font-semibold">→ {q.correct}</span>}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center gap-3">
        {!checked ? (
          <button onClick={onCheck} disabled={Object.keys(answers).filter(k => (answers as Record<string,string>)[k].trim()).length < set.questions.length} className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-black text-white transition hover:bg-slate-700 disabled:opacity-40">Check answers</button>
        ) : (
          <>
            <div className={`rounded-xl px-5 py-2.5 text-sm font-black ${score === set.questions.length ? "bg-emerald-500 text-white" : score >= 7 ? "bg-[#F5DA20] text-black" : "bg-slate-200 text-slate-700"}`}>{score} / {set.questions.length}</div>
            <button onClick={onReset} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Try again</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function LivePhrasesB1Client({ isPro }: { isPro: boolean }) {
  const [showAll, setShowAll]           = useState(false);
  const [exNo, setExNo]                 = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked]           = useState(false);
  const [mcqAnswers, setMcqAnswers]     = useState<Record<string, number>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const visiblePhrases = showAll ? PHRASES : PHRASES.slice(0, 5);
  const currentSet     = SETS[exNo];

  function switchEx(n: 1 | 2 | 3 | 4) { setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  async function handleDownloadPDF() {
    const { generateLessonPDF } = await import("@/lib/generateLessonPDF");
    await generateLessonPDF(PDF_CONFIG);
  }

  const DIFFICULTIES = ["Easy", "Medium", "Medium", "Hard"];
  const DIFF_COLORS  = ["bg-emerald-100 text-emerald-700", "bg-[#F5DA20] text-black", "bg-[#F5DA20] text-black", "bg-red-100 text-red-700"];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          {[["Home", "/"], ["Nerd Zone", "/nerd-zone"], ["Live Phrases", "/nerd-zone/live-phrases"]].map(([label, href]) => (
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
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-black text-emerald-700">Live Phrases</span>
            <span className="rounded-full bg-violet-500 px-3 py-0.5 text-[11px] font-black text-white">B1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Intermediate</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            Live{" "}
            <span className="relative inline-block">
              Phrases
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 key B1 expressions used at work, in meetings and everyday conversations — phrases that make you sound fluent and confident.
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
            <DownloadWorksheet isPro={isPro} level="B1" title="Live Phrases" wordBank={WORD_BANK} exercises={EXERCISES_WS} filename="LivePhrases_B1_Worksheet_EnglishNerd.pdf" />
            <span className="text-[11px] text-slate-400">10 exercises + answer key · PDF</span>
          </div>
        </div>

        {/* Phrase table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-0 border-b-2 border-slate-200 bg-white">
            <div className="flex items-center gap-2 px-5 py-4"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Expression</span></div>
            <div className="flex items-center gap-2 border-l border-emerald-100 bg-emerald-50/60 px-5 py-4"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Meaning</span></div>
            <div className="flex items-center gap-2 border-l border-sky-100 bg-sky-50/60 px-5 py-4"><span className="h-2 w-2 rounded-full bg-sky-500" /><span className="text-[10px] font-black uppercase tracking-widest text-sky-700">Example</span></div>
          </div>
          <div>
            {visiblePhrases.map(({ phrase, meaning, example }, i) => (
              <div key={phrase} className={`group grid grid-cols-[1fr_1fr_1.5fr] gap-0 border-b border-slate-50 transition-colors hover:bg-[#F5DA20]/8 last:border-0 ${i % 2 === 1 ? "bg-slate-50/40" : "bg-white"}`}>
                <div className="flex items-center px-5 py-3.5"><span className="text-sm font-black text-slate-900">{phrase}</span></div>
                <div className="flex items-center border-l border-emerald-50 bg-emerald-50/30 px-5 py-3.5 group-hover:bg-emerald-50/60"><span className="inline-flex rounded-lg bg-emerald-100 px-2.5 py-1 text-sm font-semibold text-emerald-800">{meaning}</span></div>
                <div className="flex items-center border-l border-sky-50 bg-sky-50/30 px-5 py-3.5 group-hover:bg-sky-50/60"><span className="text-sm italic text-sky-800">{example}</span></div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 flex items-center justify-center">
            <button onClick={() => setShowAll((v) => !v)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:bg-slate-50">
              {showAll ? (
                <><svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 15l7-7 7 7"/></svg>Collapse</>
              ) : (
                <><svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 9l-7 7-7-7"/></svg>Show all 12 expressions</>
              )}
            </button>
          </div>
        </div>

        {/* Study tip */}
        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">These phrases are common in workplace conversations and emails. Try slipping 2–3 of them into your next meeting or message today — they'll make you sound far more natural.</p>
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
                <button key={n} onClick={() => switchEx(n)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition ${exNo === n ? "bg-slate-900 text-white shadow-md" : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"}`}>
                  <span className={`rounded-lg px-2 py-0.5 text-[10px] font-black ${exNo === n ? "bg-white/20 text-white" : DIFF_COLORS[n - 1]}`}>{DIFFICULTIES[n - 1]}</span>
                  Exercise {n}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-black text-slate-900">{currentSet.title}</h3>
              {currentSet.type === "mcq" ? (
                <MCQExercise set={currentSet} checked={checked} answers={mcqAnswers}
                  onAnswer={(id, i) => setMcqAnswers((p) => ({ ...p, [id]: i }))}
                  onCheck={() => setChecked(true)}
                  onReset={() => { setChecked(false); setMcqAnswers({}); }} />
              ) : (
                <InputExercise set={currentSet} checked={checked} answers={inputAnswers}
                  onAnswer={(id, v) => setInputAnswers((p) => ({ ...p, [id]: v }))}
                  onCheck={() => setChecked(true)}
                  onReset={() => { setChecked(false); setInputAnswers({}); }} />
              )}
            </div>

            {/* Worksheet PDF button */}
            <div className="mt-6 flex items-center gap-3">
              <PDFButton onDownload={handleDownloadPDF} loading={false} />
              <p className="text-xs text-slate-400">PRO · Lesson PDF · 4 exercises + answer key</p>
            </div>
          </div>

          {/* RIGHT: SpeedRound */}
          <div className="xl:sticky xl:top-6 xl:self-start">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-sm" />
              <h2 className="text-2xl font-black text-slate-900">SpeedRound <span className="text-sm font-bold text-amber-500 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">GAME</span></h2>
            </div>
            <SpeedRound questions={SPEED_QUESTIONS} gameId="live-phrases-b1" />
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mt-14 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone/live-phrases" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            ← A1-A2
          </a>
          <a href="/nerd-zone/live-phrases/b2" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            Next: B2
          </a>
        </div>

      </div>
    </div>
  );
}
