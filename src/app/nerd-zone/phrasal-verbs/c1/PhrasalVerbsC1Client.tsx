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
  { verb: "boil down to",       meaning: "to be essentially about something",             example: "It all boils down to a lack of trust." },
  { verb: "come to terms with", meaning: "to accept something difficult",                 example: "She's coming to terms with the diagnosis." },
  { verb: "draw on",            meaning: "to use knowledge, experience or resources",     example: "He drew on years of research for the report." },
  { verb: "fall back on",       meaning: "to use when other options fail",                example: "It's good to have savings to fall back on." },
  { verb: "get round to",       meaning: "to finally find time to do something",          example: "I keep meaning to call but never get round to it." },
  { verb: "iron out",           meaning: "to resolve small difficulties or problems",     example: "We need to iron out a few details before signing." },
  { verb: "live up to",         meaning: "to be as good as expected",                     example: "The film didn't live up to the hype." },
  { verb: "phase out",          meaning: "to gradually stop using something",             example: "The company is phasing out plastic packaging." },
  { verb: "single out",         meaning: "to choose or highlight one from a group",       example: "She was singled out for exceptional performance." },
  { verb: "stand up for",       meaning: "to defend someone or a principle",              example: "You need to stand up for what you believe in." },
  { verb: "bring to light",     meaning: "to reveal or expose information",               example: "The audit brought to light several errors." },
  { verb: "grapple with",       meaning: "to struggle to deal with a difficult problem",  example: "Governments are grappling with rising inflation." },
];

const WORD_BANK = ["boil down to", "come to terms with", "draw on", "fall back on", "iron out", "live up to", "phase out", "single out", "stand up for", "bring to light"];

const EXERCISES_WS = [
  { before: "The conflict ",                      answer: "boils down to",      after: " a fundamental difference in values." },
  { before: "He's still struggling to ",          answer: "come to terms with", after: " the sudden loss of his job." },
  { before: "For the speech, she ",               answer: "drew on",            after: " decades of experience in the field." },
  { before: "It's wise to have an emergency fund to ", answer: "fall back on",  after: " if things go wrong." },
  { before: "We need to ",                        answer: "iron out",           after: " a few technical issues before the product launch." },
  { before: "The sequel failed to ",              answer: "live up to",         after: " the expectations set by the original." },
  { before: "The company plans to ",              answer: "phase out",          after: " single-use plastics by next year." },
  { before: "One employee was ",                  answer: "singled out",        after: " for a special achievement award." },
  { before: "Don't be afraid to ",                answer: "stand up for",       after: " your rights in the workplace." },
  { before: "The investigation ",                 answer: "brought to light",   after: " serious flaws in the approval process." },
];

const LEVELS = [
  { label: "A1-A2", href: "/nerd-zone/phrasal-verbs",    color: "bg-[#F5DA20] text-black" },
  { label: "B1",    href: "/nerd-zone/phrasal-verbs/b1", color: "bg-violet-500 text-white" },
  { label: "B2",    href: "/nerd-zone/phrasal-verbs/b2", color: "bg-orange-500 text-white" },
  { label: "C1",    href: "/nerd-zone/phrasal-verbs/c1", color: "bg-sky-500 text-white" },
];

/* ─── SpeedRound ─────────────────────────────────────────────────────────── */

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "To be essentially about = ?",         options: ["grapple with","boil down to","phase out","iron out"],        answer: 1 },
  { q: "To accept something difficult = ?",   options: ["stand up for","draw on","come to terms with","single out"],  answer: 2 },
  { q: "To use experience/resources = ?",     options: ["draw on","fall back on","iron out","live up to"],            answer: 0 },
  { q: "To use when other options fail = ?",  options: ["phase out","fall back on","single out","grapple with"],      answer: 1 },
  { q: "To finally find time for = ?",        options: ["iron out","get round to","boil down to","bring to light"],   answer: 1 },
  { q: "To resolve small difficulties = ?",   options: ["grapple with","stand up for","iron out","phase out"],        answer: 2 },
  { q: "To be as good as expected = ?",       options: ["live up to","draw on","single out","come to terms with"],    answer: 0 },
  { q: "To gradually stop using = ?",         options: ["bring to light","phase out","fall back on","iron out"],      answer: 1 },
  { q: "To highlight one from a group = ?",   options: ["grapple with","boil down to","single out","stand up for"],   answer: 2 },
  { q: "To reveal or expose info = ?",        options: ["get round to","bring to light","live up to","draw on"],      answer: 1 },
  { q: "To struggle with a problem = ?",      options: ["iron out","phase out","grapple with","fall back on"],        answer: 2 },
  { q: "It all ___ a lack of trust.",         options: ["grapples with","boils down to","phases out","irons out"],    answer: 1 },
  { q: "She ___ decades of experience.",      options: ["singled out","drew on","fell back on","lived up to"],        answer: 1 },
  { q: "The film didn't ___ the hype.",       options: ["iron out","grapple with","live up to","phase out"],          answer: 2 },
  { q: "We need to ___ a few details.",       options: ["stand up for","iron out","bring to light","single out"],     answer: 1 },
  { q: "She was ___ for exceptional work.",   options: ["phased out","singled out","grappled with","drawn on"],       answer: 1 },
  { q: "Don't forget to ___ your values.",    options: ["boil down to","come to terms","stand up for","phase out"],   answer: 2 },
  { q: "The audit ___ several errors.",       options: ["brought to light","grappled with","ironed out","phased out"], answer: 0 },
  { q: "She hasn't ___ the loss yet.",        options: ["come to terms with","drawn on","singled out","phased out"],  answer: 0 },
  { q: "Use savings to ___ in emergencies.",  options: ["grapple with","iron out","fall back on","live up to"],       answer: 2 },
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
      { id:"e1q1",  prompt: "This whole conflict ___ a misunderstanding about money.",          options: ["grapples with","boils down to","phases out","irons out"],       correctIndex: 1, explanation: '"boil down to" = to be essentially about' },
      { id:"e1q2",  prompt: "She is slowly ___ the end of her long career.",                   options: ["drawing on","coming to terms with","falling back on","getting round to"], correctIndex: 1, explanation: '"come to terms with" = to accept something difficult' },
      { id:"e1q3",  prompt: "The speaker ___ her own research and personal stories.",          options: ["ironed out","drew on","phased out","singled out"],               correctIndex: 1, explanation: '"draw on" = to use knowledge or experience' },
      { id:"e1q4",  prompt: "It's useful to have an emergency plan to ___ in a crisis.",       options: ["live up to","stand up for","fall back on","bring to light"],    correctIndex: 2, explanation: '"fall back on" = to use when other options fail' },
      { id:"e1q5",  prompt: "I never ___ replying to that email from last month.",             options: ["grappled with","singled out","got round to","phased out"],       correctIndex: 2, explanation: '"get round to" = to finally find time' },
      { id:"e1q6",  prompt: "We need to ___ these technical issues before the launch.",        options: ["bring to light","iron out","boil down to","draw on"],           correctIndex: 1, explanation: '"iron out" = to resolve small difficulties' },
      { id:"e1q7",  prompt: "The sequel simply didn't ___ the original film.",                 options: ["phase out","single out","grapple with","live up to"],           correctIndex: 3, explanation: '"live up to" = to be as good as expected' },
      { id:"e1q8",  prompt: "The company is ___ its reliance on fossil fuels.",                options: ["standing up for","grappling with","phasing out","drawing on"],   correctIndex: 2, explanation: '"phase out" = to gradually stop using' },
      { id:"e1q9",  prompt: "One student was ___ for her exceptional essay.",                  options: ["singled out","boiled down to","ironed out","fallen back on"],   correctIndex: 0, explanation: '"single out" = to choose or highlight one' },
      { id:"e1q10", prompt: "The journalist ___ the corruption in the local council.",         options: ["came to terms with","brought to light","drew on","phased out"], correctIndex: 1, explanation: '"bring to light" = to reveal information' },
    ],
  },
  2: {
    type: "input",
    title: "Exercise 2 — Type the phrasal verb",
    instructions: "Type the correct phrasal verb to complete the sentence.",
    questions: [
      { id:"e2q1",  prompt: "The debate ___ a question of funding priorities.",                 correct: "boiled down to",      explanation: '"boil down to" = to be essentially about' },
      { id:"e2q2",  prompt: "He is still ___ the failure of his startup.",                      correct: "coming to terms with", explanation: '"come to terms with" = to accept' },
      { id:"e2q3",  prompt: "The architect ___ traditional techniques in the new design.",      correct: "drew on",             explanation: '"draw on" = to use experience' },
      { id:"e2q4",  prompt: "We can always ___ the original plan if this doesn't work.",        correct: "fall back on",        explanation: '"fall back on" = to use as backup' },
      { id:"e2q5",  prompt: "I haven't ___ fixing the website yet.",                            correct: "got round to",        explanation: '"get round to" = to finally find time' },
      { id:"e2q6",  prompt: "Let's ___ any remaining issues before the meeting.",               correct: "iron out",            explanation: '"iron out" = to resolve' },
      { id:"e2q7",  prompt: "The product ___ the bold promises made in the advertising.",       correct: "lived up to",         explanation: '"live up to" = to match expectations' },
      { id:"e2q8",  prompt: "The airline is ___ its oldest fleet of aircraft.",                 correct: "phasing out",         explanation: '"phase out" = to gradually stop using' },
      { id:"e2q9",  prompt: "The manager ___ three employees for the innovation award.",        correct: "singled out",         explanation: '"single out" = to highlight one' },
      { id:"e2q10", prompt: "The documentary ___ previously hidden practices in the industry.", correct: "brought to light",    explanation: '"bring to light" = to reveal' },
    ],
  },
  3: {
    type: "mcq",
    title: "Exercise 3 — What does it mean?",
    instructions: "Choose the correct meaning of the phrasal verb in each sentence.",
    questions: [
      { id:"e3q1",  prompt: "It all boils down to trust.",              options: ["to complicate","to be essentially about","to resolve","to reveal"],    correctIndex: 1, explanation: '"boil down to" = to be essentially about' },
      { id:"e3q2",  prompt: "She drew on her years of experience.",     options: ["to ignore","to write about","to use knowledge/experience","to lack"],  correctIndex: 2, explanation: '"draw on" = to use knowledge or experience' },
      { id:"e3q3",  prompt: "We need to iron out the details.",         options: ["to add details","to ignore","to resolve small problems","to cancel"],  correctIndex: 2, explanation: '"iron out" = to resolve difficulties' },
      { id:"e3q4",  prompt: "The film lived up to the hype.",           options: ["to fail to impress","to match expectations","to exceed","to ignore"],  correctIndex: 1, explanation: '"live up to" = to be as good as expected' },
      { id:"e3q5",  prompt: "The company is phasing out plastic.",      options: ["to introduce","to gradually stop using","to recycle","to increase"],   correctIndex: 1, explanation: '"phase out" = to gradually stop using' },
      { id:"e3q6",  prompt: "She was singled out for praise.",          options: ["to be punished","to be ignored","to be chosen from a group","to resign"], correctIndex: 2, explanation: '"single out" = to choose or highlight one' },
      { id:"e3q7",  prompt: "He stood up for his colleague.",           options: ["to argue with","to criticise","to abandon","to defend"],               correctIndex: 3, explanation: '"stand up for" = to defend someone or a principle' },
      { id:"e3q8",  prompt: "The audit brought to light many errors.",  options: ["to hide","to reveal information","to cause","to ignore"],              correctIndex: 1, explanation: '"bring to light" = to reveal' },
      { id:"e3q9",  prompt: "She's grappling with the new system.",     options: ["to master easily","to ignore","to struggle with","to explain"],        correctIndex: 2, explanation: '"grapple with" = to struggle to deal with' },
      { id:"e3q10", prompt: "He fell back on his savings.",             options: ["to lose savings","to increase savings","to use as backup","to invest"], correctIndex: 2, explanation: '"fall back on" = to use when other options fail' },
    ],
  },
  4: {
    type: "input",
    title: "Exercise 4 — Mixed practice",
    instructions: "Type the correct phrasal verb in the right form.",
    questions: [
      { id:"e4q1",  prompt: "The whole issue ___ poor communication.",                          correct: "boils down to",       explanation: '"boil down to" = to be essentially about' },
      { id:"e4q2",  prompt: "She is gradually ___ her new reality.",                            correct: "coming to terms with", explanation: '"come to terms with" = to accept' },
      { id:"e4q3",  prompt: "The researcher ___ 20 years of field studies for the book.",       correct: "drew on",             explanation: '"draw on" = to use experience' },
      { id:"e4q4",  prompt: "If the plan fails, we'll have to ___ our old strategy.",           correct: "fall back on",        explanation: '"fall back on" = to use as backup' },
      { id:"e4q5",  prompt: "She never ___ updating her CV — now she regrets it.",              correct: "got round to",        explanation: '"get round to" = to find time for' },
      { id:"e4q6",  prompt: "The lawyers ___ the final contract details overnight.",             correct: "ironed out",          explanation: '"iron out" = to resolve' },
      { id:"e4q7",  prompt: "The new CEO ___ the high expectations from the board.",             correct: "lived up to",         explanation: '"live up to" = to match expectations' },
      { id:"e4q8",  prompt: "Schools are slowly ___ the use of printed textbooks.",             correct: "phasing out",         explanation: '"phase out" = to gradually stop using' },
      { id:"e4q9",  prompt: "The teacher ___ one student for an outstanding presentation.",      correct: "singled out",         explanation: '"single out" = to highlight one from a group' },
      { id:"e4q10", prompt: "The investigation ___ serious misconduct within the organisation.", correct: "brought to light",    explanation: '"bring to light" = to reveal' },
    ],
  },
};

/* ─── PDF config ─────────────────────────────────────────────────────────── */

const PDF_CONFIG: LessonPDFConfig = {
  title: "Phrasal Verbs C1",
  subtitle: "Advanced Phrasal Verbs — 4 exercises + answer key",
  level: "C1",
  keyRule: "boil down to · draw on · fall back on · iron out · live up to · phase out · single out · stand up for · bring to light · grapple with",
  exercises: [
    {
      number: 1,
      title: "Exercise 1",
      difficulty: "Easy",
      instruction: "Fill in the blank with the correct phrasal verb.",
      questions: [
        "It all ___ lack of trust.",
        "She is ___ the diagnosis.",
        "She ___ her experience.",
        "We can ___ the old plan.",
        "I never ___ calling back.",
        "We need to ___ the details.",
        "It didn't ___ the hype.",
        "They are ___ old methods.",
        "She was ___ for her work.",
        "The probe ___ many errors.",
      ],
    },
    {
      number: 2,
      title: "Exercise 2",
      difficulty: "Medium",
      instruction: "Write the phrasal verb in the correct form. Use the hint.",
      questions: [
        "It ___ planning. (boil down to)",
        "She ___ the loss. (come to terms)",
        "He ___ past experience. (draw on)",
        "Try to ___. (fall back on)",
        "I ___ replying. (get round to)",
        "Let's ___ the issues. (iron out)",
        "It didn't ___. (live up to)",
        "They're ___ plastics. (phase out)",
        "She was ___. (single out)",
        "It ___ errors. (bring to light)",
      ],
    },
    {
      number: 3,
      title: "Exercise 3",
      difficulty: "Medium",
      instruction: "Write the meaning of each phrasal verb.",
      questions: [
        "boil down to = ______________",
        "come to terms with = ________",
        "draw on = ___________________",
        "fall back on = ______________",
        "get round to = ______________",
        "iron out = __________________",
        "live up to = ________________",
        "phase out = _________________",
        "single out = ________________",
        "grapple with = ______________",
      ],
    },
    {
      number: 4,
      title: "Exercise 4",
      difficulty: "Hard",
      instruction: "Complete with a phrasal verb in the correct form.",
      questions: [
        "The issue ___ one of trust.",
        "She's slowly ___ it.",
        "She ___ years of research.",
        "We'll ___ our old plan.",
        "I never ___ sorting that.",
        "They ___ the details fast.",
        "It didn't ___ expectations.",
        "They are ___ old packaging.",
        "He was ___ for excellence.",
        "The audit ___ the truth.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Easy — fill in the blank", answers: ["boils down to","coming to terms with","drew on","fall back on","got round to","iron out","live up to","phasing out","singled out","brought to light"] },
    { exercise: 2, subtitle: "Medium — correct form", answers: ["boiled down to","come to terms with","drew on","fall back on","got round to","iron out","live up to","phasing out","singled out","brought to light"] },
    { exercise: 3, subtitle: "Medium — write the meaning", answers: ["to be essentially about","to accept something difficult","to use knowledge/experience","to use when other options fail","to find time for something","to resolve small difficulties","to be as good as expected","to gradually stop using","to choose one from a group","to struggle with a problem"] },
    { exercise: 4, subtitle: "Hard — correct form", answers: ["boils down to","coming to terms with","drew on","fall back on","got round to","ironed out","live up to","phasing out","singled out","brought to light"] },
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
                className={`w-36 rounded-lg border px-3 py-1.5 text-center text-sm font-semibold outline-none transition
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

export default function PhrasalVerbsC1Client({ isPro }: { isPro: boolean }) {
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
          <span className="text-slate-700 font-medium">C1</span>
        </nav>

        {/* Hero */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-violet-100 px-3 py-0.5 text-[11px] font-black text-violet-700">Phrasal Verbs</span>
            <span className="rounded-full bg-sky-500 px-3 py-0.5 text-[11px] font-black text-white">C1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Advanced</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            Phrasal{" "}
            <span className="relative inline-block">
              Verbs
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 sophisticated C1 phrasal verbs that separate good English from truly fluent English — used in journalism, business and intellectual discourse.
          </p>
        </div>

        {/* Level nav + download */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {LEVELS.map(({ label, href, color }) => (
              label === "C1" ? (
                <span key={label} className={`rounded-xl ${color} px-5 py-2 text-sm font-black shadow-sm`}>{label}</span>
              ) : (
                <a key={label} href={href} className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 transition">{label}</a>
              )
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            <DownloadWorksheet isPro={isPro} level="C1" wordBank={WORD_BANK} exercises={EXERCISES_WS} filename="PhrasalVerbs_C1_Worksheet_EnglishNerd.pdf" />
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
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">C1 phrasal verbs sound most natural in writing. Read quality journalism (The Guardian, The Economist) and notice how often these appear — then consciously use them in your own writing.</p>
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
              <span className="h-2.5 w-2.5 rounded-full bg-sky-500 shadow-sm" />
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
            <SpeedRound questions={SPEED_QUESTIONS} gameId="phrasal-verbs-c1" />
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mt-14 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone/phrasal-verbs/b2" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            ← B2
          </a>
          <a href="/nerd-zone" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            Back to Nerd Zone
          </a>
        </div>

      </div>
    </div>
  );
}
