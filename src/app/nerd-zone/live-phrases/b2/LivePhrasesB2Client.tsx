"use client";

import { useState } from "react";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import DownloadWorksheet from "../DownloadWorksheet";

const PHRASES = [
  { phrase: "For what it's worth",    meaning: "My opinion may not matter, but…",              example: "For what it's worth, I think you made the right call." },
  { phrase: "Having said that",       meaning: "Despite what was just said",                   example: "It's expensive. Having said that, the quality is superb." },
  { phrase: "All things considered",  meaning: "Taking everything into account",               example: "All things considered, the event was a success." },
  { phrase: "More often than not",    meaning: "Usually / in most cases",                      example: "More often than not, the simplest solution is the best." },
  { phrase: "On the face of it",      meaning: "At first glance / apparently",                 example: "On the face of it, the proposal sounds reasonable." },
  { phrase: "Read between the lines", meaning: "To understand hidden or implied meaning",      example: "His message seemed friendly, but read between the lines." },
  { phrase: "Up in the air",          meaning: "Uncertain / not yet decided",                  example: "The launch date is still up in the air." },
  { phrase: "Touch base",             meaning: "To briefly make contact / check in",           example: "Let's touch base next week to see how things are going." },
  { phrase: "Push the envelope",      meaning: "To exceed normal limits / try new things",     example: "This company always pushes the envelope with its designs." },
  { phrase: "In the long run",        meaning: "Over a long period of time / eventually",      example: "Saving money now will pay off in the long run." },
  { phrase: "By the same token",      meaning: "For the same reason / similarly",              example: "He works hard; by the same token, he expects the same from others." },
  { phrase: "For the time being",     meaning: "For now / temporarily",                        example: "For the time being, let's keep this between us." },
];

const WORD_BANK = ["for what it's worth", "having said that", "all things considered", "more often than not", "on the face of it", "read between the lines", "up in the air", "touch base", "push the envelope", "in the long run"];

const EXERCISES_WS = [
  { before: "",                                  answer: "For what it's worth",      after: ", I think you made the right decision."                    },
  { before: "It's a difficult situation. ",      answer: "Having said that",         after: ", I believe it can still be resolved."                     },
  { before: "",                                  answer: "All things considered",    after: ", the project was a success despite the delays."            },
  { before: "",                                  answer: "More often than not",      after: ", the simplest solution turns out to be the best one."      },
  { before: "",                                  answer: "On the face of it",        after: ", the proposal sounds reasonable, but I have some concerns." },
  { before: "His message seemed friendly, but you need to ", answer: "read between the lines", after: "."                                              },
  { before: "The launch date is still ",         answer: "up in the air",            after: " — we need another meeting to confirm."                    },
  { before: "Let's ",                            answer: "touch base",               after: " next week to see how things are going."                   },
  { before: "This company always tries to ",     answer: "push the envelope",        after: " with its product designs."                                },
  { before: "Saving money now will pay off ",    answer: "in the long run",          after: "."                                                         },
];

const LEVELS = [
  { label: "A1-A2", href: "/nerd-zone/live-phrases",     color: "bg-[#F5DA20] text-black" },
  { label: "B1",    href: "/nerd-zone/live-phrases/b1",  color: "bg-violet-500 text-white" },
  { label: "B2",    href: "/nerd-zone/live-phrases/b2",  color: "bg-orange-500 text-white" },
  { label: "C1",    href: "/nerd-zone/live-phrases/c1",  color: "bg-sky-500 text-white" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: '"For what it\'s worth" = ?',       options: ["it\'s valuable","my opinion may not matter","it costs a lot","for free"],          answer: 1 },
  { q: '"Having said that" = ?',           options: ["after saying","despite what I said","I said before","saying goodbye"],             answer: 1 },
  { q: '"All things considered" = ?',      options: ["all items listed","taking everything into account","all things bought","considering all"],  answer: 1 },
  { q: '"More often than not" = ?',        options: ["rarely","sometimes","usually","never"],                                             answer: 2 },
  { q: '"On the face of it" = ?',          options: ["on someone\'s face","at first glance","on the surface literally","facing it"],      answer: 1 },
  { q: '"Read between the lines" = ?',     options: ["read slowly","find hidden meaning","read out loud","line by line"],                 answer: 1 },
  { q: '"Up in the air" = ?',              options: ["flying","uncertain / undecided","very high","on a plane"],                          answer: 1 },
  { q: '"Touch base" = ?',                 options: ["touch something","briefly check in","play baseball","touch a base"],                answer: 1 },
  { q: '"Push the envelope" = ?',          options: ["post a letter","exceed normal limits","push something","fold paper"],               answer: 1 },
  { q: '"In the long run" = ?',            options: ["running far","after a long time / eventually","in a marathon","long distance"],     answer: 1 },
  { q: '"By the same token" = ?',          options: ["with same coin","for the same reason","same password","same ticket"],              answer: 1 },
  { q: '"For the time being" = ?',         options: ["forever","for now / temporarily","for a long time","for a while later"],           answer: 1 },
  { q: 'The date is still ___ — uncertain.', options: ["up in the air","on the face of it","in the long run","touching base"],           answer: 0 },
  { q: 'Let\'s ___ next week — check in.', options: ["push the envelope","touch base","read between the lines","for the time being"],    answer: 1 },
  { q: '___, the plan sounds fine.',        options: ["Up in the air","On the face of it","Having said that","Touch base"],              answer: 1 },
  { q: '___, it still worked out well.',    options: ["All things considered","More often than not","Touch base","For the time being"],   answer: 0 },
  { q: '___, I think you\'re right.',       options: ["In the long run","For what it\'s worth","Having said that","Up in the air"],      answer: 1 },
  { q: 'It\'s expensive. ___, it\'s great.', options: ["For the time being","Having said that","Touch base","In the long run"],         answer: 1 },
  { q: '___, hard work pays off.',           options: ["Up in the air","For what it\'s worth","In the long run","Touch base"],           answer: 2 },
  { q: '___, let\'s keep things as they are.', options: ["For the time being","Push the envelope","All things considered","Read between the lines"], answer: 0 },
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
    title: "Exercise 1 — Choose the expression",
    instructions: "Choose the correct expression to complete each sentence.",
    questions: [
      { id:"e1q1",  prompt: '___, I think you handled that situation very well.',                       options: ["For what it\'s worth","Having said that","Up in the air","Touch base"],         correctIndex: 0, explanation: '"For what it\'s worth" = my opinion may not matter, but…' },
      { id:"e1q2",  prompt: 'The project was chaotic. ___, we delivered on time.',                    options: ["More often than not","Having said that","In the long run","On the face of it"], correctIndex: 1, explanation: '"Having said that" = despite what was just said' },
      { id:"e1q3",  prompt: '___, the conference was a great success.',                               options: ["All things considered","Up in the air","By the same token","Touch base"],       correctIndex: 0, explanation: '"All things considered" = taking everything into account' },
      { id:"e1q4",  prompt: '___, the simplest solution really is the best.',                         options: ["On the face of it","For the time being","More often than not","Touch base"],   correctIndex: 2, explanation: '"More often than not" = usually / in most cases' },
      { id:"e1q5",  prompt: '___, the proposal looks solid — but I have some concerns.',              options: ["In the long run","On the face of it","Having said that","Up in the air"],      correctIndex: 1, explanation: '"On the face of it" = at first glance / apparently' },
      { id:"e1q6",  prompt: 'His email seemed positive, but try to ___ and see what he really means.', options: ["touch base","push the envelope","read between the lines","up in the air"],    correctIndex: 2, explanation: '"Read between the lines" = understand hidden or implied meaning' },
      { id:"e1q7",  prompt: 'The start date is still ___— nothing has been confirmed.',               options: ["up in the air","by the same token","in the long run","for the time being"],   correctIndex: 0, explanation: '"Up in the air" = uncertain / not yet decided' },
      { id:"e1q8",  prompt: 'Let\'s ___ early next week to review how things are progressing.',       options: ["push the envelope","read between the lines","touch base","all things considered"], correctIndex: 2, explanation: '"Touch base" = briefly make contact / check in' },
      { id:"e1q9",  prompt: 'Investing in training now will pay off ___ for the whole team.',         options: ["in the long run","up in the air","on the face of it","by the same token"],     correctIndex: 0, explanation: '"In the long run" = over a long period / eventually' },
      { id:"e1q10", prompt: '___, please use the old process until the new one is ready.',            options: ["By the same token","More often than not","For the time being","Having said that"], correctIndex: 2, explanation: '"For the time being" = for now / temporarily' },
    ],
  },
  2: {
    type: "input",
    title: "Exercise 2 — Type the expression",
    instructions: "Type the correct expression to complete each sentence.",
    questions: [
      { id:"e2q1",  prompt: "___, I think you made the right call here.",                correct: "for what it's worth",  explanation: '"For what it\'s worth" = my opinion may not matter, but…' },
      { id:"e2q2",  prompt: "It\'s a tough market. ___, the product is strong.",        correct: "having said that",     explanation: '"Having said that" = despite what was just said' },
      { id:"e2q3",  prompt: "___, the event was a success despite the issues.",          correct: "all things considered", explanation: '"All things considered" = taking everything into account' },
      { id:"e2q4",  prompt: "___, the most direct approach saves the most time.",       correct: "more often than not",  explanation: '"More often than not" = usually / in most cases' },
      { id:"e2q5",  prompt: "___, the merger looks straightforward, but it isn\'t.",    correct: "on the face of it",    explanation: '"On the face of it" = at first glance / apparently' },
      { id:"e2q6",  prompt: "You need to ___ — the real message isn\'t obvious.",       correct: "read between the lines", explanation: '"Read between the lines" = understand hidden meaning' },
      { id:"e2q7",  prompt: "The budget decision is still ___.",                         correct: "up in the air",        explanation: '"Up in the air" = uncertain / not yet decided' },
      { id:"e2q8",  prompt: "Can we ___ on Thursday to review the progress?",           correct: "touch base",           explanation: '"Touch base" = briefly make contact / check in' },
      { id:"e2q9",  prompt: "This investment will be worth it ___.",                     correct: "in the long run",      explanation: '"In the long run" = over a long period / eventually' },
      { id:"e2q10", prompt: "___, let\'s use the current system while we upgrade.",     correct: "for the time being",   explanation: '"For the time being" = for now / temporarily' },
    ],
  },
  3: {
    type: "mcq",
    title: "Exercise 3 — What does it mean?",
    instructions: "Choose the correct meaning of the expression.",
    questions: [
      { id:"e3q1",  prompt: '"For what it\'s worth, I think you were right."',    options: ["it\'s very valuable","my opinion may not matter","it\'s worthless","I\'m certain"],  correctIndex: 1, explanation: '"For what it\'s worth" = my opinion may not matter, but…' },
      { id:"e3q2",  prompt: '"Having said that, I still support the idea."',      options: ["after saying it","despite what I said","before I said","saying it again"],          correctIndex: 1, explanation: '"Having said that" = despite what was just said' },
      { id:"e3q3",  prompt: '"All things considered, it went well."',             options: ["all objects included","taking everything into account","all tasks done","all said"], correctIndex: 1, explanation: '"All things considered" = taking everything into account' },
      { id:"e3q4",  prompt: '"More often than not, people prefer the classic."', options: ["sometimes","rarely","usually","always"],                                              correctIndex: 2, explanation: '"More often than not" = usually / in most cases' },
      { id:"e3q5",  prompt: '"On the face of it, the idea seems solid."',        options: ["on someone\'s face","at first glance","on the surface literally","in detail"],       correctIndex: 1, explanation: '"On the face of it" = at first glance / apparently' },
      { id:"e3q6",  prompt: '"Read between the lines of his reply."',            options: ["read slowly","find hidden meaning","read every line","read backwards"],              correctIndex: 1, explanation: '"Read between the lines" = understand hidden meaning' },
      { id:"e3q7",  prompt: '"The plan is still up in the air."',                options: ["the plan is flying","uncertain","the plan is ambitious","very high"],                 correctIndex: 1, explanation: '"Up in the air" = uncertain / not yet decided' },
      { id:"e3q8",  prompt: '"Let\'s touch base after the call."',               options: ["touch something","briefly check in","shake hands","meet formally"],                  correctIndex: 1, explanation: '"Touch base" = briefly make contact' },
      { id:"e3q9",  prompt: '"This will pay off in the long run."',              options: ["in a long race","eventually / over time","after a long run","soon"],                 correctIndex: 1, explanation: '"In the long run" = over a long period / eventually' },
      { id:"e3q10", prompt: '"Use this system for the time being."',             options: ["forever","for now / temporarily","for a long time","for later"],                     correctIndex: 1, explanation: '"For the time being" = for now / temporarily' },
    ],
  },
  4: {
    type: "input",
    title: "Exercise 4 — Mixed practice",
    instructions: "Type the correct expression in the right form.",
    questions: [
      { id:"e4q1",  prompt: "___, your feedback really helped us improve the plan.",    correct: "for what it's worth",   explanation: '"For what it\'s worth" = my opinion may not matter, but…' },
      { id:"e4q2",  prompt: "The results were mixed. ___, we learned a great deal.",   correct: "having said that",      explanation: '"Having said that" = despite what was just said' },
      { id:"e4q3",  prompt: "___, I believe the project was handled well.",             correct: "all things considered", explanation: '"All things considered" = taking everything into account' },
      { id:"e4q4",  prompt: "___, the team that prepares most carefully wins.",         correct: "more often than not",   explanation: '"More often than not" = usually' },
      { id:"e4q5",  prompt: "___, the contract seems fair — let\'s review it.",         correct: "on the face of it",     explanation: '"On the face of it" = at first glance' },
      { id:"e4q6",  prompt: "Don\'t take the email at face value — ___ .",              correct: "read between the lines", explanation: '"Read between the lines" = find hidden meaning' },
      { id:"e4q7",  prompt: "The decision on the new office is still ___.",             correct: "up in the air",         explanation: '"Up in the air" = uncertain / not yet decided' },
      { id:"e4q8",  prompt: "Let\'s ___ on Friday and discuss the updates.",           correct: "touch base",            explanation: '"Touch base" = briefly check in' },
      { id:"e4q9",  prompt: "These habits will make a huge difference ___.",           correct: "in the long run",       explanation: '"In the long run" = eventually / over time' },
      { id:"e4q10", prompt: "___, please continue using the old software.",            correct: "for the time being",    explanation: '"For the time being" = for now / temporarily' },
    ],
  },
};

const PDF_CONFIG: LessonPDFConfig = {
  title: "Live Phrases B2",
  subtitle: "Upper-Intermediate Expressions — 4 exercises + answer key",
  level: "B2",
  keyRule: "for what it's worth · having said that · all things considered · more often than not · up in the air · touch base · in the long run · for the time being",
  exercises: [
    {
      number: 1,
      title: "Exercise 1",
      difficulty: "Easy",
      instruction: "Fill in with the correct expression.",
      questions: [
        "___, you made the right call.",
        "___, it still worked out.",
        "___, the plan looks fine.",
        "The date is still ___ — open.",
        "___, it\'s the best approach.",
        "Let\'s ___ next week.",
        "This pays off ___.",
        "___, let\'s keep the old system.",
        "It\'s pricey. ___, it\'s great.",
        "___, find what he really means.",
      ],
    },
    {
      number: 2,
      title: "Exercise 2",
      difficulty: "Medium",
      instruction: "Write the expression. Use the hint.",
      questions: [
        "___ — my view (4 words)",
        "___ — despite this (3 words)",
        "___ — in total (3 words)",
        "___ — usually (4 words)",
        "___ — apparently (5 words)",
        "___ — hidden meaning (4 words)",
        "___ — uncertain (4 words)",
        "___ — check in (2 words)",
        "___ — eventually (4 words)",
        "___ — for now (4 words)",
      ],
    },
    {
      number: 3,
      title: "Exercise 3",
      difficulty: "Medium",
      instruction: "Write the meaning of each expression.",
      questions: [
        "for what it's worth = _______",
        "having said that = __________",
        "all things considered = _____",
        "more often than not = _______",
        "on the face of it = _________",
        "read between lines = ________",
        "up in the air = _____________",
        "touch base = ________________",
        "in the long run = ___________",
        "for the time being = ________",
      ],
    },
    {
      number: 4,
      title: "Exercise 4",
      difficulty: "Hard",
      instruction: "Complete with the correct expression.",
      questions: [
        "___, your input was valuable.",
        "Tough week. ___, we succeeded.",
        "___, the launch went smoothly.",
        "___, the direct route is best.",
        "___, the deal looks promising.",
        "Look deeper — ___ his reply.",
        "The venue is still ___.",
        "Let\'s ___ on Monday to review.",
        "Patience pays off ___.",
        "___, use the backup process.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Easy — fill in the blank", answers: ["For what it's worth","All things considered","On the face of it","up in the air","More often than not","touch base","in the long run","For the time being","Having said that","read between the lines"] },
    { exercise: 2, subtitle: "Medium — write the expression", answers: ["For what it's worth","Having said that","All things considered","More often than not","On the face of it","Read between the lines","Up in the air","Touch base","In the long run","For the time being"] },
    { exercise: 3, subtitle: "Medium — write the meaning", answers: ["my opinion may not matter, but…","despite what was just said","taking everything into account","usually / in most cases","at first glance / apparently","understand hidden meaning","uncertain / not yet decided","briefly make contact / check in","over a long period / eventually","for now / temporarily"] },
    { exercise: 4, subtitle: "Hard — mixed practice", answers: ["For what it's worth","Having said that","All things considered","More often than not","On the face of it","read between the lines","up in the air","touch base","in the long run","For the time being"] },
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
                className={`w-44 rounded-lg border px-3 py-1.5 text-center text-sm font-semibold outline-none transition ${!checked ? "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100" : isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-700"}`} />
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

export default function LivePhrasesB2Client({ isPro }: { isPro: boolean }) {
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

        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          {[["Home", "/"], ["Nerd Zone", "/nerd-zone"], ["Live Phrases", "/nerd-zone/live-phrases"]].map(([label, href]) => (
            <span key={href} className="flex items-center gap-1.5">
              <a href={href} className="hover:text-slate-700 transition">{label}</a>
              <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          ))}
          <span className="text-slate-700 font-medium">B2</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-black text-emerald-700">Live Phrases</span>
            <span className="rounded-full bg-orange-500 px-3 py-0.5 text-[11px] font-black text-white">B2</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Upper-Intermediate</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            Live{" "}
            <span className="relative inline-block">
              Phrases
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 sophisticated B2 expressions used in professional and academic English — essential for sounding polished and precise.
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
            <DownloadWorksheet isPro={isPro} level="B2" title="Live Phrases" wordBank={WORD_BANK} exercises={EXERCISES_WS} filename="LivePhrases_B2_Worksheet_EnglishNerd.pdf" />
            <span className="text-[11px] text-slate-400">10 exercises + answer key · PDF</span>
          </div>
        </div>

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
              {showAll ? (<><svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 15l7-7 7 7"/></svg>Collapse</>) : (<><svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 9l-7 7-7-7"/></svg>Show all 12 expressions</>)}
            </button>
          </div>
        </div>

        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">These B2 expressions are common in professional writing, presentations and meetings. Try using one in your next email or conversation — precision and nuance will set your English apart.</p>
          </div>
        </div>

        <div className="mt-8">
          <AdUnit variant="inline-light" />
        </div>

        <div className="mt-6 grid gap-8 xl:grid-cols-[1fr_340px]">
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
            <SpeedRound questions={SPEED_QUESTIONS} gameId="live-phrases-b2" />
          </div>
        </div>

        <div className="mt-14 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone/live-phrases/b1" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            ← B1
          </a>
          <a href="/nerd-zone/live-phrases/c1" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">Next: C1</a>
        </div>
      </div>
    </div>
  );
}
