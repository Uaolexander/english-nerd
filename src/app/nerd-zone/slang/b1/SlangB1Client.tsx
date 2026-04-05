"use client";

import { useState } from "react";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import DownloadWorksheet from "../DownloadWorksheet";

const WORDS = [
  { word: "lowkey",      meaning: "slightly, or secretly / in a subtle way",          example: "I'm lowkey obsessed with this new series." },
  { word: "vibe",        meaning: "feeling, mood, or atmosphere",                      example: "This place has such an amazing vibe." },
  { word: "lit",         meaning: "exciting, excellent, or lively",                    example: "The party last night was absolutely lit." },
  { word: "chill",       meaning: "relaxed; or to relax and do nothing",               example: "Let's just stay in and chill tonight." },
  { word: "no cap",      meaning: "no lie / I'm being completely honest",              example: "That's the best pizza I've ever had, no cap." },
  { word: "slay",        meaning: "to do something impressively well",                 example: "She walked in and absolutely slayed that outfit." },
  { word: "flex",        meaning: "to show off / a display of wealth or skill",        example: "He's always flexing his new gadgets online." },
  { word: "ghost",       meaning: "to suddenly stop responding to someone",            example: "He just ghosted me after three weeks of texting." },
  { word: "extra",       meaning: "over the top, dramatic or excessive",               example: "She cried at a TV advert — isn't that a bit extra?" },
  { word: "bussin",      meaning: "extremely good, usually said about food",           example: "This ramen is absolutely bussin — best in the city." },
  { word: "dead",        meaning: "very funny (e.g. 'I'm dead' = I'm laughing hard)", example: "That video had me dead — I watched it five times." },
  { word: "vibe check",  meaning: "an assessment of someone's mood or energy",         example: "This new colleague passed the vibe check immediately." },
];

const WORD_BANK = ["lowkey", "vibe", "lit", "chill", "no cap", "slay", "flex", "ghost", "extra", "bussin"];

const EXERCISES_WS = [
  { before: "I'm ",                              answer: "lowkey",   after: " obsessed with this new series — I can't stop watching."   },
  { before: "This place has such an amazing ",   answer: "vibe",     after: " — I could stay here all day."                             },
  { before: "The party last night was absolutely ", answer: "lit",   after: " — we didn't leave until 3 am."                           },
  { before: "Let's just stay in and ",           answer: "chill",    after: " — I don't feel like going out."                          },
  { before: "That pizza is completely ",         answer: "bussin",   after: " — best I've had in months."                              },
  { before: "She walked in and absolutely ",     answer: "slayed",   after: " — everyone was staring."                                 },
  { before: "Don't ",                            answer: "flex",     after: " your car in front of them — they'll find it annoying."   },
  { before: "He just ",                          answer: "ghosted",  after: " me after three weeks of texting — no explanation."       },
  { before: "She cried at a TV advert — isn't that a bit ", answer: "extra", after: "?"                                               },
  { before: "This is the best burger I've ever eaten, ", answer: "no cap", after: "."                                                  },
];

const LEVELS = [
  { label: "A1-A2", href: "/nerd-zone/slang",    color: "bg-[#F5DA20] text-black" },
  { label: "B1",    href: "/nerd-zone/slang/b1", color: "bg-violet-500 text-white" },
  { label: "B2",    href: "/nerd-zone/slang/b2", color: "bg-orange-500 text-white" },
  { label: "C1",    href: "/nerd-zone/slang/c1", color: "bg-sky-500 text-white" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: '"Lowkey" = ?',        options: ["very publicly","slightly / secretly","loudly","obviously"],              answer: 1 },
  { q: '"Vibe" = ?',          options: ["music volume","feeling / mood / atmosphere","visual style","a type of dance"], answer: 1 },
  { q: '"Lit" = ?',           options: ["on fire literally","exciting / excellent","boring","well-lit"],          answer: 1 },
  { q: '"Chill" = ?',         options: ["very cold","relaxed / to relax","stressed","excited"],                   answer: 1 },
  { q: '"No cap" = ?',        options: ["no hat","no lie / being honest","no limits","no way"],                  answer: 1 },
  { q: '"Slay" = ?',          options: ["to kill","to do impressively well","to sleep","to leave"],               answer: 1 },
  { q: '"Flex" = ?',          options: ["to stretch","to show off","to relax","to hide"],                        answer: 1 },
  { q: '"Ghost" = ?',         options: ["a spirit","to suddenly stop responding","to appear","to haunt"],         answer: 1 },
  { q: '"Extra" = ?',         options: ["additional","over the top / dramatic","extra time","more food"],         answer: 1 },
  { q: '"Bussin" = ?',        options: ["taking a bus","extremely good (about food)","busy","moving fast"],       answer: 1 },
  { q: '"Dead" (slang) = ?',  options: ["lifeless","very funny / laughing hard","not alive","extremely sad"],    answer: 1 },
  { q: '"Vibe check" = ?',    options: ["checking a speaker","assessing someone\'s mood","a music test","a vibe level"], answer: 1 },
  { q: 'She ___ that outfit — everyone loved it.', options: ["ghosted","slayed","flexed","chilled"],             answer: 1 },
  { q: 'He ___ me — no reply for two weeks.',      options: ["vibed","ghosted","flexed","slayed"],               answer: 1 },
  { q: 'This ramen is ___. Best in town!',         options: ["dead","lowkey","bussin","extra"],                  answer: 2 },
  { q: 'The party was ___— everyone was dancing.', options: ["chill","extra","lit","ghosted"],                   answer: 2 },
  { q: 'I\'m ___ in love with this show.',         options: ["dead","extra","lowkey","bussin"],                  answer: 2 },
  { q: 'Isn\'t that a bit ___? She overreacts.',   options: ["lit","vibe","bussin","extra"],                     answer: 3 },
  { q: 'That\'s the best I\'ve had, ___ .',        options: ["slay","chill","no cap","ghost"],                   answer: 2 },
  { q: 'New colleague passed the ___ check.',      options: ["chill","flex","vibe","slay"],                      answer: 2 },
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
      { id:"e1q1",  prompt: 'I\'m ___ obsessed with this show — I can\'t stop watching.',         options: ["extra","lowkey","dead","lit"],         correctIndex: 1, explanation: '"Lowkey" = slightly, or secretly / in a subtle way' },
      { id:"e1q2",  prompt: 'This café has such a great ___ — I want to come back every day.',   options: ["flex","slay","vibe","ghost"],          correctIndex: 2, explanation: '"Vibe" = feeling, mood, or atmosphere' },
      { id:"e1q3",  prompt: 'Last night\'s concert was absolutely ___ — the crowd loved it.',    options: ["bussin","extra","lit","dead"],          correctIndex: 2, explanation: '"Lit" = exciting, excellent, or lively' },
      { id:"e1q4",  prompt: 'Let\'s just stay in and ___ — I\'ve had a long week.',               options: ["ghost","flex","slay","chill"],         correctIndex: 3, explanation: '"Chill" = relaxed; or to relax and do nothing' },
      { id:"e1q5",  prompt: 'That\'s the most delicious thing I\'ve ever tasted, ___ .',         options: ["extra","no cap","lowkey","dead"],      correctIndex: 1, explanation: '"No cap" = no lie / I\'m being completely honest' },
      { id:"e1q6",  prompt: 'She walked into the room and absolutely ___ that look.',            options: ["ghosted","chilled","flexed","slayed"],  correctIndex: 3, explanation: '"Slay" = to do something impressively well' },
      { id:"e1q7",  prompt: 'He\'s always ___ his new trainers online — so annoying.',           options: ["slaying","ghosting","flexing","vibing"], correctIndex: 2, explanation: '"Flex" = to show off / a display of wealth or skill' },
      { id:"e1q8",  prompt: 'He just ___ me — no message for over a week.',                     options: ["slayed","vibed","ghosted","flexed"],    correctIndex: 2, explanation: '"Ghost" = to suddenly stop responding to someone' },
      { id:"e1q9",  prompt: 'She made such a scene — wasn\'t that a bit ___?',                  options: ["lit","vibe","bussin","extra"],          correctIndex: 3, explanation: '"Extra" = over the top, dramatic or excessive' },
      { id:"e1q10", prompt: 'This burger is absolutely ___ — best I\'ve had all year.',         options: ["dead","extra","lowkey","bussin"],       correctIndex: 3, explanation: '"Bussin" = extremely good, usually said about food' },
    ],
  },
  2: {
    type: "input",
    title: "Exercise 2 — Type the slang word",
    instructions: "Type the correct slang word or phrase to complete each sentence.",
    questions: [
      { id:"e2q1",  prompt: "I\'m ___ obsessed with this playlist — it\'s on repeat.",         correct: "lowkey",     explanation: '"Lowkey" = slightly / secretly' },
      { id:"e2q2",  prompt: "This place has a great ___ — I feel so relaxed here.",            correct: "vibe",       explanation: '"Vibe" = feeling, mood, or atmosphere' },
      { id:"e2q3",  prompt: "The party was absolutely ___ — we had the best time.",            correct: "lit",        explanation: '"Lit" = exciting, excellent, or lively' },
      { id:"e2q4",  prompt: "Let\'s just ___ at home and watch something tonight.",            correct: "chill",      explanation: '"Chill" = to relax and do nothing' },
      { id:"e2q5",  prompt: "This is the best food I\'ve tried in this city, ___ .",           correct: "no cap",     explanation: '"No cap" = no lie / being completely honest' },
      { id:"e2q6",  prompt: "She ___ that presentation — the client was blown away.",          correct: "slayed",     explanation: '"Slay" = to do something impressively well' },
      { id:"e2q7",  prompt: "He\'s always ___ his designer stuff on Instagram.",               correct: "flexing",    explanation: '"Flex" = to show off' },
      { id:"e2q8",  prompt: "He ___ me after two weeks — not even a goodbye text.",            correct: "ghosted",    explanation: '"Ghost" = to suddenly stop responding' },
      { id:"e2q9",  prompt: "Wasn\'t that a bit ___ — she made it into a whole drama.",        correct: "extra",      explanation: '"Extra" = over the top, dramatic or excessive' },
      { id:"e2q10", prompt: "This homemade pasta is ___ — you should open a restaurant.",     correct: "bussin",     explanation: '"Bussin" = extremely good (usually about food)' },
    ],
  },
  3: {
    type: "mcq",
    title: "Exercise 3 — What does it mean?",
    instructions: "Choose the correct meaning of the slang word or phrase.",
    questions: [
      { id:"e3q1",  prompt: '"I\'m lowkey nervous about the presentation."',      options: ["very openly","slightly / secretly","completely","loudly"],              correctIndex: 1, explanation: '"Lowkey" = slightly, or secretly / in a subtle way' },
      { id:"e3q2",  prompt: '"This coffee shop has a great vibe."',               options: ["a great view","feeling / mood / atmosphere","a great menu","loud music"], correctIndex: 1, explanation: '"Vibe" = feeling, mood, or atmosphere' },
      { id:"e3q3",  prompt: '"The show last night was lit."',                     options: ["on fire","exciting / excellent","boring","well-lit"],                    correctIndex: 1, explanation: '"Lit" = exciting, excellent, or lively' },
      { id:"e3q4",  prompt: '"Let\'s chill this weekend."',                       options: ["go out","relax / do nothing","plan things","study hard"],                correctIndex: 1, explanation: '"Chill" = relaxed; or to relax and do nothing' },
      { id:"e3q5",  prompt: '"That\'s the best song I\'ve heard, no cap."',      options: ["with a cap on","no lie / being honest","not really","just kidding"],     correctIndex: 1, explanation: '"No cap" = no lie / I\'m being completely honest' },
      { id:"e3q6",  prompt: '"She slayed that job interview."',                   options: ["ruined it","did it impressively well","failed badly","was late for it"], correctIndex: 1, explanation: '"Slay" = to do something impressively well' },
      { id:"e3q7",  prompt: '"He\'s always flexing his new watch."',              options: ["wearing","showing off","hiding","losing"],                              correctIndex: 1, explanation: '"Flex" = to show off / a display of wealth or skill' },
      { id:"e3q8",  prompt: '"He ghosted me after the third date."',              options: ["appeared suddenly","stopped responding","called constantly","stayed"],   correctIndex: 1, explanation: '"Ghost" = to suddenly stop responding to someone' },
      { id:"e3q9",  prompt: '"She\'s being a bit extra today."',                  options: ["efficient","over the top / dramatic","very calm","helpful"],            correctIndex: 1, explanation: '"Extra" = over the top, dramatic or excessive' },
      { id:"e3q10", prompt: '"That video had me dead."',                          options: ["I was bored","I was laughing very hard","I was sleeping","I was scared"], correctIndex: 1, explanation: '"Dead" = very funny (\'I\'m dead\' = I\'m laughing hard)' },
    ],
  },
  4: {
    type: "input",
    title: "Exercise 4 — Mixed practice",
    instructions: "Type the correct slang word or phrase.",
    questions: [
      { id:"e4q1",  prompt: "I\'m ___ excited about the trip — I can\'t wait.",             correct: "lowkey",     explanation: '"Lowkey" = slightly / secretly' },
      { id:"e4q2",  prompt: "The atmosphere here is incredible — such a good ___.",         correct: "vibe",       explanation: '"Vibe" = feeling, mood, or atmosphere' },
      { id:"e4q3",  prompt: "This restaurant is ___ — hands down the best in town.",        correct: "bussin",     explanation: '"Bussin" = extremely good (about food)' },
      { id:"e4q4",  prompt: "He ___ her after a month — not even a text.",                 correct: "ghosted",    explanation: '"Ghost" = to suddenly stop responding' },
      { id:"e4q5",  prompt: "She ___ it — everyone was talking about her performance.",     correct: "slayed",     explanation: '"Slay" = to do something impressively well' },
      { id:"e4q6",  prompt: "That joke had me ___ — I was in tears laughing.",             correct: "dead",       explanation: '"Dead" = very funny / I\'m laughing hard' },
      { id:"e4q7",  prompt: "He\'s always ___ his money — it gets old fast.",              correct: "flexing",    explanation: '"Flex" = to show off' },
      { id:"e4q8",  prompt: "Isn\'t that a bit ___? She turned it into a huge drama.",     correct: "extra",      explanation: '"Extra" = over the top, dramatic or excessive' },
      { id:"e4q9",  prompt: "That\'s honestly the best meal I\'ve had, ___ .",             correct: "no cap",     explanation: '"No cap" = no lie / being completely honest' },
      { id:"e4q10", prompt: "The new colleague passed the ___ check — great energy.",      correct: "vibe",       explanation: '"Vibe check" = assessment of someone\'s mood or energy' },
    ],
  },
};

const PDF_CONFIG: LessonPDFConfig = {
  title: "English Slang B1",
  subtitle: "Intermediate Informal Words — 4 exercises + answer key",
  level: "B1",
  keyRule: "lowkey · vibe · lit · chill · no cap · slay · flex · ghost · extra · bussin · dead · vibe check",
  exercises: [
    {
      number: 1,
      title: "Exercise 1",
      difficulty: "Easy",
      instruction: "Fill in the correct slang word.",
      questions: [
        "I\'m ___ obsessed — can\'t stop watching.",
        "The café has a great ___ — love it.",
        "Last night\'s party was ___ .",
        "Let\'s just ___ at home tonight.",
        "Best I\'ve ever tasted, ___ .",
        "She ___ that outfit — everyone stared.",
        "He\'s always ___ his gadgets online.",
        "He just ___ me — no reply at all.",
        "Wasn\'t that a bit ___? Total drama.",
        "This food is ___ — best in town.",
      ],
    },
    {
      number: 2,
      title: "Exercise 2",
      difficulty: "Medium",
      instruction: "Write the slang. Use the hint.",
      questions: [
        "___ — slightly / secretly",
        "___ — feeling or mood",
        "___ — exciting / excellent",
        "___ — relax",
        "___ — no lie (2 words)",
        "___ — do impressively well",
        "___ — show off",
        "___ — stop responding",
        "___ — over the top",
        "___ — extremely good (food)",
      ],
    },
    {
      number: 3,
      title: "Exercise 3",
      difficulty: "Medium",
      instruction: "Write the meaning of each slang word.",
      questions: [
        "lowkey = _____________",
        "vibe = ______________",
        "lit = ________________",
        "chill = ______________",
        "no cap = _____________",
        "slay = _______________",
        "flex = _______________",
        "ghost = ______________",
        "extra = ______________",
        "bussin = _____________",
      ],
    },
    {
      number: 4,
      title: "Exercise 4",
      difficulty: "Hard",
      instruction: "Complete with the correct slang.",
      questions: [
        "___ excited — won\'t admit it.",
        "Incredible atmosphere — great ___.",
        "This pasta is ___ — incredible.",
        "He ___ her — zero contact.",
        "She ___ the interview — hired!",
        "That joke had me ___ — so funny.",
        "Always ___ his new car online.",
        "Wasn\'t that a bit ___?",
        "Best meal I\'ve had, ___ .",
        "New colleague passed the ___ check.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Easy — fill in the blank", answers: ["lowkey","vibe","lit","chill","no cap","slayed","flexing","ghosted","extra","bussin"] },
    { exercise: 2, subtitle: "Medium — write the slang", answers: ["lowkey","vibe","lit","chill","no cap","slay","flex","ghost","extra","bussin"] },
    { exercise: 3, subtitle: "Medium — write the meaning", answers: ["slightly / secretly","feeling or mood","exciting / excellent","relax / relaxed","no lie / honest","do impressively well","show off","stop responding","over the top","extremely good"] },
    { exercise: 4, subtitle: "Hard — mixed practice", answers: ["lowkey","vibe","bussin","ghosted","slayed","dead","flexing","extra","no cap","vibe"] },
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
                  if (!checked) { cls += isChosen ? "border-violet-400 bg-violet-100 text-violet-800" : "border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50"; }
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
                className={`w-44 rounded-lg border px-3 py-1.5 text-center text-sm font-semibold outline-none transition ${!checked ? "border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100" : isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-700"}`} />
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

export default function SlangB1Client({ isPro }: { isPro: boolean }) {
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
          <span className="text-slate-700 font-medium">B1</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-pink-100 px-3 py-0.5 text-[11px] font-black text-pink-700">Slang</span>
            <span className="rounded-full bg-violet-500 px-3 py-0.5 text-[11px] font-black text-white">B1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Intermediate</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            English{" "}
            <span className="relative inline-block">
              Slang
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 B1 slang words you'll hear constantly in English-speaking social media, podcasts and casual conversations.
          </p>
        </div>

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
            <DownloadWorksheet isPro={isPro} level="B1" title="English Slang" wordBank={WORD_BANK} exercises={EXERCISES_WS} filename="Slang_B1_Worksheet_EnglishNerd.pdf" />
            <span className="text-[11px] text-slate-400">10 exercises + answer key · PDF</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-pink-100 bg-pink-50/60 px-4 py-3 text-sm text-pink-700">
          ⚠️ These terms are informal and context-sensitive — use them with friends, but avoid them in formal or professional settings.
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
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">These terms are common in English-speaking social media and everyday conversation. Use them with friends, but always read the room — slang can sound awkward in the wrong context.</p>
          </div>
        </div>

        <div className="mt-8">
          <AdUnit variant="inline-light" />
        </div>

        <div className="mt-6 grid gap-8 xl:grid-cols-[1fr_340px]">
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
            <SpeedRound questions={SPEED_QUESTIONS} gameId="slang-b1" />
          </div>
        </div>

        <div className="mt-14 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone/slang" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            ← A1-A2
          </a>
          <a href="/nerd-zone/slang/b2" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">Next: B2</a>
        </div>
      </div>
    </div>
  );
}
