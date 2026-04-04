"use client";

import { useState } from "react";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import DownloadWorksheet from "../DownloadWorksheet";

const WORDS = [
  { word: "hits different",           meaning: "feels uniquely good, often with emotion",              example: "Listening to that song at sunset just hits different." },
  { word: "rent-free",                meaning: "living in your head constantly without effort",        example: "That song has been rent-free in my head all week." },
  { word: "goated",                   meaning: "being the greatest (from GOAT = Greatest of All Time)", example: "His last album was goated — pure perfection." },
  { word: "main character",           meaning: "acting as if you're the protagonist of your own story", example: "She walked in like she was the main character of a film." },
  { word: "it's giving…",             meaning: "it has the energy / vibe of something",               example: "That outfit? It's giving vintage 90s — love it." },
  { word: "rizz",                     meaning: "natural charm or ability to attract others",           example: "He has so much rizz — he makes everyone feel at ease." },
  { word: "salty",                    meaning: "bitter, upset or resentful about something",           example: "Don't be salty about losing — it was a fair game." },
  { word: "based",                    meaning: "holding unpopular opinions confidently",               example: "That's a pretty based take — I respect that you stand by it." },
  { word: "understood the assignment", meaning: "did exactly what was needed, perfectly",             example: "Her outfit was perfect — she understood the assignment." },
  { word: "touch grass",              meaning: "to go outside / disconnect from the internet",         example: "You've been online for 10 hours. Go touch grass." },
  { word: "era",                      meaning: "a specific phase or period of your life",              example: "I'm in my fitness era right now — gym every morning." },
  { word: "situationship",            meaning: "a romantic connection that is undefined or uncommitted", example: "They've been in a situationship for months — neither will define it." },
];

const WORD_BANK = ["hits different", "rent-free", "goated", "main character", "rizz", "salty", "based", "understood the assignment", "touch grass", "it's giving"];

const EXERCISES_WS = [
  { before: "Listening to that song at sunset just ", answer: "hits different",             after: " — nothing compares to it."                              },
  { before: "That embarrassing moment has been living ", answer: "rent-free",               after: " in my head all week."                                   },
  { before: "His performance last night was absolutely ", answer: "goated",                 after: " — nobody compares."                                     },
  { before: "She walked in like she was the ", answer: "main character",                    after: " of a film — all eyes were on her."                      },
  { before: "He has so much ", answer: "rizz",                                              after: " — he can make anyone feel comfortable instantly."        },
  { before: "Don't be ", answer: "salty",                                                   after: " about losing — it was a completely fair game."          },
  { before: "That's a pretty ", answer: "based",                                            after: " take — I respect that you stand by it."                 },
  { before: "She completely ", answer: "understood the assignment",                         after: " — her outfit was perfect for the occasion."             },
  { before: "You've been online for 10 hours. You need to go ", answer: "touch grass",     after: "."                                                       },
  { before: "That colour combination? ", answer: "It's giving",                             after: " vintage 90s — I love it."                               },
];

const LEVELS = [
  { label: "A1-A2", href: "/nerd-zone/slang",    color: "bg-[#F5DA20] text-black" },
  { label: "B1",    href: "/nerd-zone/slang/b1", color: "bg-violet-500 text-white" },
  { label: "B2",    href: "/nerd-zone/slang/b2", color: "bg-orange-500 text-white" },
  { label: "C1",    href: "/nerd-zone/slang/c1", color: "bg-sky-500 text-white" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: '"Hits different" = ?',            options: ["hits harder","feels uniquely good","sounds different","is very popular"],       answer: 1 },
  { q: '"Rent-free" = ?',                 options: ["living cheaply","in your head constantly","free accommodation","no cost"],     answer: 1 },
  { q: '"Goated" = ?',                    options: ["animal behaviour","being the greatest","very old","strange"],                  answer: 1 },
  { q: '"Main character" = ?',            options: ["a film hero","acting as your own protagonist","the lead actor","a novel"],     answer: 1 },
  { q: '"It\'s giving…" = ?',             options: ["it\'s donating","it has the energy / vibe of","it\'s giving up","it provides"], answer: 1 },
  { q: '"Rizz" = ?',                      options: ["a sound","natural charm / ability to attract","a type of food","laughter"],    answer: 1 },
  { q: '"Salty" = ?',                     options: ["too much salt","bitter / upset / resentful","very tasty","very happy"],        answer: 1 },
  { q: '"Based" = ?',                     options: ["at the base","holding unpopular opinions confidently","based on facts","located there"], answer: 1 },
  { q: '"Understood the assignment" = ?', options: ["completed a task","did exactly what was needed","understood homework","read an assignment"], answer: 1 },
  { q: '"Touch grass" = ?',               options: ["touch something","go outside / disconnect","feel nature","be grounded"],       answer: 1 },
  { q: '"Era" = ?',                       options: ["historical period","a phase of your life","a long time","an age"],             answer: 1 },
  { q: '"Situationship" = ?',             options: ["a situation","undefined romantic connection","a relationship","a friendship"],  answer: 1 },
  { q: 'That song at sunset just ___ .',  options: ["hits different","rent-free","goated","rizz"],                                  answer: 0 },
  { q: 'She has natural ___ — so charming.', options: ["era","rizz","salty","based"],                                              answer: 1 },
  { q: 'Don\'t be ___ about losing.',     options: ["goated","based","salty","rizz"],                                              answer: 2 },
  { q: 'He\'s in his gym ___ right now.', options: ["situationship","rizz","era","salty"],                                         answer: 2 },
  { q: 'That look? It\'s ___ Y2K.',       options: ["rent-free","goated","based","giving"],                                        answer: 3 },
  { q: 'Stop scrolling — go ___ grass.',  options: ["touch","rent","vibe","main"],                                                 answer: 0 },
  { q: 'She ___ the assignment — flawless.', options: ["touched","goated","understood","hit"],                                     answer: 2 },
  { q: 'That idea lives ___ in my head.', options: ["based","rent-free","goated","salty"],                                         answer: 1 },
];

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq";   title: string; instructions: string; questions: MCQ[]    }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const SETS: Record<1 | 2 | 3 | 4, ExerciseSet> = {
  1: {
    type: "mcq",
    title: "Exercise 1 — Choose the slang word",
    instructions: "Choose the correct slang word or phrase to complete each sentence.",
    questions: [
      { id:"e1q1",  prompt: 'Listening to this track at night just ___ — so nostalgic.',      options: ["rizz","hits different","goated","situationship"],          correctIndex: 1, explanation: '"Hits different" = feels uniquely good, often with emotion' },
      { id:"e1q2",  prompt: 'That cringeworthy moment has been living ___ all week.',         options: ["situationship","era","rent-free","based"],                 correctIndex: 2, explanation: '"Rent-free" = living in your head constantly without effort' },
      { id:"e1q3",  prompt: 'Her performance last night was ___ — nobody does it better.',   options: ["salty","goated","extra","situationship"],                  correctIndex: 1, explanation: '"Goated" = being the greatest (from GOAT)' },
      { id:"e1q4",  prompt: 'He walked in like he was the ___ of the whole evening.',        options: ["situationship","rizz","salty","main character"],           correctIndex: 3, explanation: '"Main character" = acting as if you\'re the protagonist' },
      { id:"e1q5",  prompt: 'He has so much ___ — everyone wants to talk to him.',           options: ["era","salty","rizz","based"],                              correctIndex: 2, explanation: '"Rizz" = natural charm or ability to attract others' },
      { id:"e1q6",  prompt: 'Don\'t be ___ about it — it was a completely fair result.',     options: ["goated","based","salty","rizz"],                           correctIndex: 2, explanation: '"Salty" = bitter, upset or resentful about something' },
      { id:"e1q7",  prompt: 'That\'s a very ___ take — respect for owning your opinion.',   options: ["salty","situationship","based","rent-free"],               correctIndex: 2, explanation: '"Based" = holding unpopular opinions confidently' },
      { id:"e1q8",  prompt: 'She ___ — her presentation was exactly what the client needed.', options: ["touched grass","understood the assignment","hits different","goated"], correctIndex: 1, explanation: '"Understood the assignment" = did exactly what was needed' },
      { id:"e1q9",  prompt: 'You\'ve been online for hours — go ___ please.',                options: ["situationship","touch grass","rent-free","goated"],        correctIndex: 1, explanation: '"Touch grass" = go outside / disconnect from the internet' },
      { id:"e1q10", prompt: 'They\'ve been in a ___ for six months — neither will commit.',  options: ["era","rizz","situationship","based"],                     correctIndex: 2, explanation: '"Situationship" = a romantic connection that is undefined' },
    ],
  },
  2: {
    type: "input",
    title: "Exercise 2 — Type the slang word",
    instructions: "Type the correct slang word or phrase to complete each sentence.",
    questions: [
      { id:"e2q1",  prompt: "That song at sunset just ___ — nothing else feels like it.",       correct: "hits different",             explanation: '"Hits different" = feels uniquely good, often with emotion' },
      { id:"e2q2",  prompt: "That awkward comment has been living ___ in my head.",             correct: "rent-free",                  explanation: '"Rent-free" = in your head constantly without effort' },
      { id:"e2q3",  prompt: "His latest album is ___ — pure perfection from start to finish.", correct: "goated",                     explanation: '"Goated" = being the greatest (from GOAT)' },
      { id:"e2q4",  prompt: "She walked in like the ___ of a blockbuster film.",               correct: "main character",             explanation: '"Main character" = acting as if you\'re the protagonist' },
      { id:"e2q5",  prompt: "He has serious ___ — everyone\'s drawn to him instantly.",        correct: "rizz",                       explanation: '"Rizz" = natural charm or ability to attract others' },
      { id:"e2q6",  prompt: "Don\'t be ___ — losing doesn\'t make you a bad player.",          correct: "salty",                      explanation: '"Salty" = bitter, upset or resentful about something' },
      { id:"e2q7",  prompt: "That\'s a ___ opinion — I respect that you own it fully.",        correct: "based",                      explanation: '"Based" = holding unpopular opinions confidently' },
      { id:"e2q8",  prompt: "She ___ — her outfit was absolutely perfect for the event.",      correct: "understood the assignment",  explanation: '"Understood the assignment" = did exactly what was needed' },
      { id:"e2q9",  prompt: "You\'ve been scrolling for hours — go ___ and get some air.",     correct: "touch grass",                explanation: '"Touch grass" = go outside / disconnect from the internet' },
      { id:"e2q10", prompt: "I\'m in my reading ___ — a new book every single week.",         correct: "era",                        explanation: '"Era" = a specific phase or period of your life' },
    ],
  },
  3: {
    type: "mcq",
    title: "Exercise 3 — What does it mean?",
    instructions: "Choose the correct meaning of the slang word or phrase.",
    questions: [
      { id:"e3q1",  prompt: '"That song at sunset just hits different."',          options: ["sounds odd","feels uniquely good","is very popular","plays loudly"],        correctIndex: 1, explanation: '"Hits different" = feels uniquely good, often with emotion' },
      { id:"e3q2",  prompt: '"That moment lives rent-free in my head."',           options: ["cheaply","in my head constantly","paid for","at low cost"],                 correctIndex: 1, explanation: '"Rent-free" = in your head constantly without effort' },
      { id:"e3q3",  prompt: '"That performance was goated."',                      options: ["animal-like","the greatest","very old","strange behaviour"],                correctIndex: 1, explanation: '"Goated" = being the greatest (from GOAT = Greatest of All Time)' },
      { id:"e3q4",  prompt: '"She walked in like the main character."',            options: ["an actor","acting as the protagonist of her story","the lead role","a hero"], correctIndex: 1, explanation: '"Main character" = acting as if you\'re the protagonist of your own story' },
      { id:"e3q5",  prompt: '"That outfit — it\'s giving 90s."',                   options: ["it\'s donating","it has the energy / vibe of","it provides","it shows"],   correctIndex: 1, explanation: '"It\'s giving…" = it has the energy / vibe of something' },
      { id:"e3q6",  prompt: '"He has so much rizz."',                              options: ["a skill","natural charm / ability to attract","a quality","money"],         correctIndex: 1, explanation: '"Rizz" = natural charm or ability to attract others' },
      { id:"e3q7",  prompt: '"Don\'t be salty about it."',                         options: ["don\'t add salt","bitter / upset / resentful","don\'t be unhappy","annoyed"], correctIndex: 1, explanation: '"Salty" = bitter, upset or resentful about something' },
      { id:"e3q8",  prompt: '"That\'s a based take."',                             options: ["at the base","holding unpopular opinions confidently","based on facts","very basic"], correctIndex: 1, explanation: '"Based" = holding unpopular opinions confidently' },
      { id:"e3q9",  prompt: '"She understood the assignment."',                    options: ["she read it","she did exactly what was needed","she attended","she studied"], correctIndex: 1, explanation: '"Understood the assignment" = did exactly what was needed, perfectly' },
      { id:"e3q10", prompt: '"Go touch grass."',                                   options: ["feel nature","go outside / disconnect from internet","do gardening","touch something"], correctIndex: 1, explanation: '"Touch grass" = go outside / disconnect from the internet' },
    ],
  },
  4: {
    type: "input",
    title: "Exercise 4 — Mixed practice",
    instructions: "Type the correct slang word or phrase.",
    questions: [
      { id:"e4q1",  prompt: "Coffee at 6 am on a cold morning just ___ .",                     correct: "hits different",             explanation: '"Hits different" = feels uniquely good, often with emotion' },
      { id:"e4q2",  prompt: "That conversation has been living ___ in my head for days.",      correct: "rent-free",                  explanation: '"Rent-free" = in your head constantly without effort' },
      { id:"e4q3",  prompt: "His new track is ___ — best rapper alive right now.",             correct: "goated",                     explanation: '"Goated" = being the greatest (from GOAT)' },
      { id:"e4q4",  prompt: "She entered the room like the ___ — all eyes on her.",           correct: "main character",             explanation: '"Main character" = acting as if you\'re the protagonist' },
      { id:"e4q5",  prompt: "She has serious ___ — everyone loves being around her.",         correct: "rizz",                       explanation: '"Rizz" = natural charm or ability to attract others' },
      { id:"e4q6",  prompt: "Stop being ___ — you got a fair result and you know it.",        correct: "salty",                      explanation: '"Salty" = bitter, upset or resentful about something' },
      { id:"e4q7",  prompt: "That\'s a ___ take — controversial but you own it.",             correct: "based",                      explanation: '"Based" = holding unpopular opinions confidently' },
      { id:"e4q8",  prompt: "She ___ — every detail was exactly right.",                      correct: "understood the assignment",  explanation: '"Understood the assignment" = did exactly what was needed' },
      { id:"e4q9",  prompt: "You\'ve been online since morning — please just ___ .",          correct: "touch grass",                explanation: '"Touch grass" = go outside / disconnect from the internet' },
      { id:"e4q10", prompt: "They\'ve been in a ___ for a year — just make it official.",    correct: "situationship",              explanation: '"Situationship" = an undefined or uncommitted romantic connection' },
    ],
  },
};

const PDF_CONFIG: LessonPDFConfig = {
  title: "English Slang B2",
  subtitle: "Upper-Intermediate Gen Z & Internet Slang — 4 exercises + answer key",
  level: "B2",
  keyRule: "hits different · rent-free · goated · main character · rizz · salty · based · understood the assignment · touch grass · era · situationship",
  exercises: [
    {
      number: 1,
      title: "Exercise 1",
      difficulty: "Easy",
      instruction: "Fill in the correct slang word.",
      questions: [
        "That song at sunset just ___ .",
        "That moment lives ___ in my head.",
        "Her album was ___ — the greatest.",
        "She walked in like the ___ .",
        "He has so much ___ — so charming.",
        "Don\'t be ___ about the result.",
        "That\'s a ___ take — own it.",
        "She ___ — perfect in every way.",
        "Stop scrolling — go ___ .",
        "They\'re in a ___ — undefined.",
      ],
    },
    {
      number: 2,
      title: "Exercise 2",
      difficulty: "Medium",
      instruction: "Write the slang. Use the hint.",
      questions: [
        "___ — feels uniquely good (2 words)",
        "___ — in your head always (2 words)",
        "___ — the greatest",
        "___ — like the protagonist (2 words)",
        "___ — natural charm",
        "___ — bitter / resentful",
        "___ — confident unpopular view",
        "___ — did it perfectly (3 words)",
        "___ — go outside (2 words)",
        "___ — undefined romance",
      ],
    },
    {
      number: 3,
      title: "Exercise 3",
      difficulty: "Medium",
      instruction: "Write the meaning of each slang word.",
      questions: [
        "hits different = ________",
        "rent-free = _____________",
        "goated = ________________",
        "main character = ________",
        "it\'s giving = ___________",
        "rizz = __________________",
        "salty = _________________",
        "based = _________________",
        "touch grass = ___________",
        "situationship = _________",
      ],
    },
    {
      number: 4,
      title: "Exercise 4",
      difficulty: "Hard",
      instruction: "Complete with the correct slang.",
      questions: [
        "Coffee at dawn just ___ .",
        "It\'s been ___ in my head all week.",
        "His set was ___ — best ever.",
        "She entered like the ___ .",
        "She has real ___ — everyone loves her.",
        "Stop being ___ — it was fair.",
        "That\'s a ___ opinion — own it.",
        "She ___ — every detail was right.",
        "Log off and go ___ .",
        "They\'re in a ___ — just date already.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Easy — fill in the blank", answers: ["hits different","rent-free","goated","main character","rizz","salty","based","understood the assignment","touch grass","situationship"] },
    { exercise: 2, subtitle: "Medium — write the slang", answers: ["hits different","rent-free","goated","main character","rizz","salty","based","understood the assignment","touch grass","situationship"] },
    { exercise: 3, subtitle: "Medium — write the meaning", answers: ["feels uniquely good","in your head constantly","the greatest","acting as the protagonist","it has the energy of","natural charm","bitter / resentful","confident unpopular view","go outside / disconnect","undefined romantic connection"] },
    { exercise: 4, subtitle: "Hard — mixed practice", answers: ["hits different","rent-free","goated","main character","rizz","salty","based","understood the assignment","touch grass","situationship"] },
  ],
};

function MCQExercise({ set, checked, answers, onAnswer, onCheck, onReset }: {
  set: Extract<ExerciseSet, { type: "mcq" }>; checked: boolean; answers: Record<string, number>;
  onAnswer: (id: string, i: number) => void; onCheck: () => void; onReset: () => void;
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
                  if (!checked) { cls += isChosen ? "border-orange-400 bg-orange-100 text-orange-800" : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50"; }
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

function InputExercise({ set, checked, answers, onAnswer, onCheck, onReset }: {
  set: Extract<ExerciseSet, { type: "input" }>; checked: boolean; answers: Record<string, string>;
  onAnswer: (id: string, v: string) => void; onCheck: () => void; onReset: () => void;
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
                className={`w-52 rounded-lg border px-3 py-1.5 text-center text-sm font-semibold outline-none transition ${!checked ? "border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100" : isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-700"}`} />
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

export default function SlangB2Client({ isPro }: { isPro: boolean }) {
  const [showAll, setShowAll]           = useState(false);
  const [exNo, setExNo]                 = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked]           = useState(false);
  const [mcqAnswers, setMcqAnswers]     = useState<Record<string, number>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const visibleWords = showAll ? WORDS : WORDS.slice(0, 5);
  const currentSet   = SETS[exNo];

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

        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          {[["Home", "/"], ["Nerd Zone", "/nerd-zone"], ["Slang", "/nerd-zone/slang"]].map(([label, href]) => (
            <span key={href} className="flex items-center gap-1.5">
              <a href={href} className="hover:text-slate-700 transition">{label}</a>
              <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          ))}
          <span className="text-slate-700 font-medium">B2</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-pink-100 px-3 py-0.5 text-[11px] font-black text-pink-700">Slang</span>
            <span className="rounded-full bg-orange-500 px-3 py-0.5 text-[11px] font-black text-white">B2</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Upper-Intermediate</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            English{" "}
            <span className="relative inline-block">
              Slang
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 popular B2 Gen Z and internet slang terms widely used in 2024–2025 — understand them to follow real English conversations online.
          </p>
        </div>

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
            <DownloadWorksheet isPro={isPro} level="B2" title="English Slang" wordBank={WORD_BANK} exercises={EXERCISES_WS} filename="Slang_B2_Worksheet_EnglishNerd.pdf" />
            <span className="text-[11px] text-slate-400">10 exercises + answer key · PDF</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-pink-100 bg-pink-50/60 px-4 py-3 text-sm text-pink-700">
          ⚠️ Slang changes fast. These terms were widely used in 2024–2025 — understanding them helps you follow real conversations on social media and in everyday speech.
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-0 border-b-2 border-slate-200 bg-white">
            <div className="flex items-center gap-2 px-5 py-4"><span className="h-2 w-2 rounded-full bg-pink-500" /><span className="text-[10px] font-black uppercase tracking-widest text-pink-700">Word / Phrase</span></div>
            <div className="flex items-center gap-2 border-l border-emerald-100 bg-emerald-50/60 px-5 py-4"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Meaning</span></div>
            <div className="flex items-center gap-2 border-l border-sky-100 bg-sky-50/60 px-5 py-4"><span className="h-2 w-2 rounded-full bg-sky-500" /><span className="text-[10px] font-black uppercase tracking-widest text-sky-700">Example</span></div>
          </div>
          <div>
            {visibleWords.map(({ word, meaning, example }, i) => (
              <div key={word} className={`group grid grid-cols-[1fr_1fr_1.5fr] gap-0 border-b border-slate-50 transition-colors hover:bg-[#F5DA20]/8 last:border-0 ${i % 2 === 1 ? "bg-slate-50/40" : "bg-white"}`}>
                <div className="flex items-center px-5 py-3.5"><span className="text-sm font-black text-pink-600">{word}</span></div>
                <div className="flex items-center border-l border-emerald-50 bg-emerald-50/30 px-5 py-3.5 group-hover:bg-emerald-50/60"><span className="inline-flex rounded-lg bg-emerald-100 px-2.5 py-1 text-sm font-semibold text-emerald-800">{meaning}</span></div>
                <div className="flex items-center border-l border-sky-50 bg-sky-50/30 px-5 py-3.5 group-hover:bg-sky-50/60"><span className="text-sm italic text-sky-800">{example}</span></div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 flex items-center justify-center">
            <button onClick={() => setShowAll((v) => !v)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:bg-slate-50">
              {showAll ? (<><svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 15l7-7 7 7"/></svg>Collapse</>) : (<><svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 9l-7 7-7-7"/></svg>Show all 12 words</>)}
            </button>
          </div>
        </div>

        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">Gen Z slang travels fast — but also dates fast. Understanding these terms helps you follow real conversations online. You don't need to use all of them, but recognising them is essential at B2.</p>
          </div>
        </div>

        <div className="mt-14 grid gap-8 xl:grid-cols-[1fr_340px]">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-sm" />
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
            <div className="mt-6 flex items-center gap-3">
              <PDFButton onDownload={handleDownloadPDF} loading={false} />
              <p className="text-xs text-slate-400">PRO · Lesson PDF · 4 exercises + answer key</p>
            </div>
          </div>
          <div className="xl:sticky xl:top-6 xl:self-start">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-sm" />
              <h2 className="text-2xl font-black text-slate-900">SpeedRound <span className="text-sm font-bold text-amber-500 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">GAME</span></h2>
            </div>
            <SpeedRound questions={SPEED_QUESTIONS} gameId="slang-b2" />
          </div>
        </div>

        <div className="mt-14 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone/slang/b1" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            ← B1
          </a>
          <a href="/nerd-zone/slang/c1" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">Next: C1</a>
        </div>
      </div>
    </div>
  );
}
