"use client";

import { useState } from "react";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import DownloadWorksheet from "../DownloadWorksheet";

const PHRASES = [
  { phrase: "Bite the bullet",         meaning: "To endure a painful or difficult situation",       example: "We need to bite the bullet and have that difficult conversation." },
  { phrase: "Go the extra mile",        meaning: "To make a special effort beyond what's expected",  example: "Our team always goes the extra mile for every client." },
  { phrase: "Speak volumes",            meaning: "To clearly indicate something without words",      example: "The silence in the room spoke volumes — no one agreed." },
  { phrase: "Leave no stone unturned",  meaning: "To try every possible option",                     example: "The detectives left no stone unturned in their search." },
  { phrase: "Raise the bar",            meaning: "To set a higher standard",                         example: "That performance has raised the bar for everyone." },
  { phrase: "Cut corners",              meaning: "To do something cheaply, reducing quality",        example: "You can't cut corners when it comes to safety standards." },
  { phrase: "On balance",              meaning: "Taking everything into account",                   example: "On balance, the benefits outweigh the risks." },
  { phrase: "Come to a head",           meaning: "To reach a crisis or turning point",              example: "The tensions finally came to a head during the review meeting." },
  { phrase: "Draw a blank",             meaning: "To be unable to remember or think of something",  example: "I drew a blank when she asked me for the author's name." },
  { phrase: "Fly in the face of",       meaning: "To openly contradict or oppose",                  example: "His decision flies in the face of all the evidence presented." },
  { phrase: "Stand one's ground",       meaning: "To maintain your position under pressure",        example: "She stood her ground despite fierce opposition from the board." },
  { phrase: "Cut to the bone",          meaning: "To reduce something to the minimum possible",     example: "After the losses, the company cut costs to the bone." },
];

const WORD_BANK = ["bite the bullet", "go the extra mile", "speak volumes", "leave no stone unturned", "raise the bar", "cut corners", "on balance", "come to a head", "draw a blank", "fly in the face of"];

const EXERCISES_WS = [
  { before: "We need to ",                    answer: "bite the bullet",          after: " and have that difficult conversation with the board."       },
  { before: "Our team always tries to ",      answer: "go the extra mile",        after: " for every client, no matter how small the project."         },
  { before: "The silence in the room ",       answer: "spoke volumes",            after: " — no one supported the idea."                               },
  { before: "The detectives ",                answer: "left no stone unturned",   after: " in their search for evidence."                              },
  { before: "That performance has really ",   answer: "raised the bar",           after: " for everyone in the competition."                           },
  { before: "You can't ",                     answer: "cut corners",              after: " when it comes to safety standards."                         },
  { before: "",                               answer: "On balance",               after: ", I think the benefits of the plan outweigh the risks."      },
  { before: "The tensions finally ",          answer: "came to a head",           after: " during the annual review meeting."                          },
  { before: "I ",                             answer: "drew a blank",             after: " when she asked me for the name of the author."              },
  { before: "His decision ",                  answer: "flies in the face of",     after: " all the evidence presented to the committee."               },
];

const LEVELS = [
  { label: "A1-A2", href: "/nerd-zone/live-phrases",     color: "bg-[#F5DA20] text-black" },
  { label: "B1",    href: "/nerd-zone/live-phrases/b1",  color: "bg-violet-500 text-white" },
  { label: "B2",    href: "/nerd-zone/live-phrases/b2",  color: "bg-orange-500 text-white" },
  { label: "C1",    href: "/nerd-zone/live-phrases/c1",  color: "bg-sky-500 text-white" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: '"Bite the bullet" = ?',           options: ["eat something","endure difficulty","avoid a problem","fire a gun"],           answer: 1 },
  { q: '"Go the extra mile" = ?',         options: ["drive far","make special effort","travel more","go running"],                 answer: 1 },
  { q: '"Speak volumes" = ?',             options: ["speak loudly","indicate clearly without words","read volumes","give a speech"], answer: 1 },
  { q: '"Leave no stone unturned" = ?',   options: ["clean the garden","try every possible option","leave stones alone","never stop"], answer: 1 },
  { q: '"Raise the bar" = ?',             options: ["lift a bar","set a higher standard","raise your hand","open a pub"],          answer: 1 },
  { q: '"Cut corners" = ?',               options: ["cut paper","do cheaply / reduce quality","turn at corners","cut short"],     answer: 1 },
  { q: '"On balance" = ?',                options: ["on a scale","taking everything into account","balanced meal","carefully"],    answer: 1 },
  { q: '"Come to a head" = ?',            options: ["come forward","reach a crisis point","arrive at the top","come first"],      answer: 1 },
  { q: '"Draw a blank" = ?',              options: ["draw a picture","unable to remember","draw something blank","get no result"], answer: 1 },
  { q: '"Fly in the face of" = ?',        options: ["fly in an aircraft","openly contradict","face a challenge","fly fast"],      answer: 1 },
  { q: '"Stand one\'s ground" = ?',       options: ["stand outside","maintain your position","stand on ground","stay upright"],   answer: 1 },
  { q: '"Cut to the bone" = ?',           options: ["cut bone","reduce to minimum","cut deeply","be harsh"],                      answer: 1 },
  { q: 'She stood firm — she ___ her ground.', options: ["raised","cut","stood","flew"],                                          answer: 2 },
  { q: 'He ___ when asked for the answer.', options: ["raised the bar","drew a blank","bit the bullet","cut corners"],            answer: 1 },
  { q: 'The conflict finally ___ a head.', options: ["spoke","came to","went to","raised"],                                       answer: 1 },
  { q: 'Don\'t ___ on quality — do it right.', options: ["raise the bar","go the extra mile","cut corners","stand your ground"],  answer: 2 },
  { q: 'Their silence ___ — nobody agreed.',   options: ["raised the bar","spoke volumes","cut to the bone","drew a blank"],      answer: 1 },
  { q: '___, the plan was a success.',     options: ["On balance","Bite the bullet","Draw a blank","Cut corners"],                 answer: 0 },
  { q: 'We ___ — we tried every option.',  options: ["raised the bar","flew in the face","left no stone unturned","cut to the bone"], answer: 2 },
  { q: 'It ___ all the data we had.',      options: ["speaks volumes","flies in the face of","comes to a head","cuts corners"],   answer: 1 },
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
      { id:"e1q1",  prompt: "The conversation would be difficult, but we decided to ___ and address it directly.",   options: ["raise the bar","bite the bullet","draw a blank","cut corners"],          correctIndex: 1, explanation: '"Bite the bullet" = endure a painful situation' },
      { id:"e1q2",  prompt: "Our customer service team always tries to ___ for every single client.",               options: ["cut corners","speak volumes","go the extra mile","come to a head"],      correctIndex: 2, explanation: '"Go the extra mile" = make special effort beyond expectations' },
      { id:"e1q3",  prompt: "No one responded to the question — the silence ___ .",                                 options: ["drew a blank","spoke volumes","raised the bar","cut to the bone"],       correctIndex: 1, explanation: '"Speak volumes" = indicate clearly without words' },
      { id:"e1q4",  prompt: "The investigators ___ in their search for the missing documents.",                     options: ["left no stone unturned","stood their ground","came to a head","bit the bullet"], correctIndex: 0, explanation: '"Leave no stone unturned" = try every possible option' },
      { id:"e1q5",  prompt: "That presentation ___ for all future speakers at this conference.",                    options: ["cut corners","spoke volumes","raised the bar","flew in the face of"],    correctIndex: 2, explanation: '"Raise the bar" = set a higher standard' },
      { id:"e1q6",  prompt: "You simply cannot ___ when it comes to product safety testing.",                       options: ["cut corners","draw a blank","stand your ground","bite the bullet"],     correctIndex: 0, explanation: '"Cut corners" = do something cheaply, reducing quality' },
      { id:"e1q7",  prompt: "___, the advantages of the merger outweigh the risks involved.",                       options: ["Come to a head","On balance","Draw a blank","Go the extra mile"],        correctIndex: 1, explanation: '"On balance" = taking everything into account' },
      { id:"e1q8",  prompt: "Tensions had been building for months before they finally ___.",                       options: ["cut to the bone","came to a head","raised the bar","stood their ground"], correctIndex: 1, explanation: '"Come to a head" = reach a crisis or turning point' },
      { id:"e1q9",  prompt: "When asked for the title, I completely ___ — I couldn't remember it.",                options: ["drew a blank","bit the bullet","cut corners","spoke volumes"],           correctIndex: 0, explanation: '"Draw a blank" = be unable to remember something' },
      { id:"e1q10", prompt: "The new report ___ everything the committee believed to be true.",                     options: ["left no stone unturned","flies in the face of","comes to a head","raises the bar"], correctIndex: 1, explanation: '"Fly in the face of" = openly contradict or oppose' },
    ],
  },
  2: {
    type: "input",
    title: "Exercise 2 — Type the expression",
    instructions: "Type the correct expression to complete each sentence.",
    questions: [
      { id:"e2q1",  prompt: "It was hard, but we decided to ___ and make the difficult decision.",     correct: "bite the bullet",        explanation: '"Bite the bullet" = endure a painful situation' },
      { id:"e2q2",  prompt: "The team always ___ for every client, no matter how small the project.", correct: "goes the extra mile",     explanation: '"Go the extra mile" = make a special effort' },
      { id:"e2q3",  prompt: "Her expression ___ — she clearly wasn't happy with the outcome.",        correct: "spoke volumes",          explanation: '"Speak volumes" = indicate clearly without words' },
      { id:"e2q4",  prompt: "The investigators ___ to find the missing witness.",                     correct: "left no stone unturned", explanation: '"Leave no stone unturned" = try every possible option' },
      { id:"e2q5",  prompt: "That new product launch really ___ for the whole industry.",             correct: "raised the bar",         explanation: '"Raise the bar" = set a higher standard' },
      { id:"e2q6",  prompt: "Don't ___ — quality is more important than saving a few pounds.",        correct: "cut corners",            explanation: '"Cut corners" = do cheaply, reducing quality' },
      { id:"e2q7",  prompt: "___, I believe the positives outweigh the negatives here.",              correct: "on balance",             explanation: '"On balance" = taking everything into account' },
      { id:"e2q8",  prompt: "The crisis ___ during the board meeting — nobody expected it.",          correct: "came to a head",         explanation: '"Come to a head" = reach a crisis or turning point' },
      { id:"e2q9",  prompt: "I ___ when she asked me for the date — I had forgotten completely.",     correct: "drew a blank",           explanation: '"Draw a blank" = be unable to remember something' },
      { id:"e2q10", prompt: "The result ___ all our earlier predictions.",                            correct: "flew in the face of",    explanation: '"Fly in the face of" = openly contradict' },
    ],
  },
  3: {
    type: "mcq",
    title: "Exercise 3 — What does it mean?",
    instructions: "Choose the correct meaning of the expression.",
    questions: [
      { id:"e3q1",  prompt: '"We had to bite the bullet."',                 options: ["eat something hard","avoid the problem","endure a difficult situation","be brave physically"], correctIndex: 2, explanation: '"Bite the bullet" = endure a painful situation' },
      { id:"e3q2",  prompt: '"She always goes the extra mile."',            options: ["she drives far","she makes extra effort","she works overtime","she runs further"],            correctIndex: 1, explanation: '"Go the extra mile" = make a special effort beyond expectations' },
      { id:"e3q3",  prompt: '"The silence spoke volumes."',                 options: ["it was loud","it was clearly meaningful","it said a lot of words","it was silent"],            correctIndex: 1, explanation: '"Speak volumes" = indicate clearly without words' },
      { id:"e3q4",  prompt: '"They left no stone unturned."',               options: ["they cleaned the garden","they tried every option","they found stones","they stopped looking"], correctIndex: 1, explanation: '"Leave no stone unturned" = try every possible option' },
      { id:"e3q5",  prompt: '"Don\'t cut corners on this project."',        options: ["don\'t cut paper","don\'t reduce quality","don\'t be creative","don\'t work at corners"],     correctIndex: 1, explanation: '"Cut corners" = do cheaply, reducing quality' },
      { id:"e3q6",  prompt: '"On balance, it was the right decision."',     options: ["on a scale","on a balance beam","taking everything into account","carefully weighted"],         correctIndex: 2, explanation: '"On balance" = taking everything into account' },
      { id:"e3q7",  prompt: '"The issue finally came to a head."',          options: ["came first","reached a crisis","the head arrived","it was resolved"],                          correctIndex: 1, explanation: '"Come to a head" = reach a crisis or turning point' },
      { id:"e3q8",  prompt: '"I drew a blank when asked."',                 options: ["I drew a picture","I couldn\'t remember","I got no points","I drew something blank"],           correctIndex: 1, explanation: '"Draw a blank" = be unable to remember something' },
      { id:"e3q9",  prompt: '"It flies in the face of tradition."',         options: ["it flies near tradition","it openly contradicts tradition","it supports tradition","it flies fast"], correctIndex: 1, explanation: '"Fly in the face of" = openly contradict' },
      { id:"e3q10", prompt: '"She stood her ground under pressure."',       options: ["she stayed standing","she maintained her position","she stood outside","she stood firm physically"], correctIndex: 1, explanation: '"Stand one\'s ground" = maintain your position under pressure' },
    ],
  },
  4: {
    type: "input",
    title: "Exercise 4 — Mixed practice",
    instructions: "Type the correct expression in the right form.",
    questions: [
      { id:"e4q1",  prompt: "The task was unpleasant, but we had to ___ and get it done.",            correct: "bite the bullet",        explanation: '"Bite the bullet" = endure a painful situation' },
      { id:"e4q2",  prompt: "They always ___ for their customers — service is exceptional.",          correct: "go the extra mile",      explanation: '"Go the extra mile" = make a special effort' },
      { id:"e4q3",  prompt: "His reaction ___ — he was clearly uncomfortable.",                       correct: "spoke volumes",          explanation: '"Speak volumes" = indicate clearly without words' },
      { id:"e4q4",  prompt: "The team ___ to find the cause of the problem.",                         correct: "left no stone unturned", explanation: '"Leave no stone unturned" = try every option' },
      { id:"e4q5",  prompt: "Her work has ___ for everyone in the department.",                       correct: "raised the bar",         explanation: '"Raise the bar" = set a higher standard' },
      { id:"e4q6",  prompt: "We can't ___ on compliance — the risks are too high.",                  correct: "cut corners",            explanation: '"Cut corners" = reduce quality to save resources' },
      { id:"e4q7",  prompt: "___, the restructuring improved the company's performance.",             correct: "on balance",             explanation: '"On balance" = taking everything into account' },
      { id:"e4q8",  prompt: "The dispute ___ during the final negotiation round.",                    correct: "came to a head",         explanation: '"Come to a head" = reach a crisis or turning point' },
      { id:"e4q9",  prompt: "I ___ — I simply couldn't recall the name.",                            correct: "drew a blank",           explanation: '"Draw a blank" = be unable to remember something' },
      { id:"e4q10", prompt: "This finding ___ what we thought we knew.",                              correct: "flies in the face of",   explanation: '"Fly in the face of" = openly contradict' },
    ],
  },
};

const PDF_CONFIG: LessonPDFConfig = {
  title: "Live Phrases C1",
  subtitle: "Advanced Expressions — 4 exercises + answer key",
  level: "C1",
  keyRule: "bite the bullet · go the extra mile · speak volumes · leave no stone unturned · raise the bar · cut corners · on balance · come to a head",
  exercises: [
    {
      number: 1,
      title: "Exercise 1",
      difficulty: "Easy",
      instruction: "Fill in with the correct expression.",
      questions: [
        "We had to ___ and decide.",
        "She always ___ for clients.",
        "The silence ___ — no one agreed.",
        "___, the plan worked well.",
        "Don\'t ___ on safety.",
        "That work ___ for everyone.",
        "The issue ___ last week.",
        "I ___ when asked the name.",
        "It ___ all the evidence.",
        "She ___ despite the pressure.",
      ],
    },
    {
      number: 2,
      title: "Exercise 2",
      difficulty: "Medium",
      instruction: "Write the expression. Use the hint.",
      questions: [
        "___ — endure difficulty (3 words)",
        "___ — extra effort (4 words)",
        "___ — indicate without words (2 words)",
        "___ — try every option (5 words)",
        "___ — set higher standard (3 words)",
        "___ — reduce quality (2 words)",
        "___ — considering all (2 words)",
        "___ — reach a crisis (4 words)",
        "___ — can\'t remember (3 words)",
        "___ — openly contradict (4 words)",
      ],
    },
    {
      number: 3,
      title: "Exercise 3",
      difficulty: "Medium",
      instruction: "Write the meaning of each expression.",
      questions: [
        "bite the bullet = __________",
        "go the extra mile = ________",
        "speak volumes = ____________",
        "leave no stone unturned = __",
        "raise the bar = ____________",
        "cut corners = ______________",
        "on balance = _______________",
        "come to a head = ___________",
        "draw a blank = _____________",
        "fly in the face of = _______",
      ],
    },
    {
      number: 4,
      title: "Exercise 4",
      difficulty: "Hard",
      instruction: "Complete with the correct expression.",
      questions: [
        "It was hard, but we had to ___.",
        "The team ___ to find the answer.",
        "Her silence ___ — she disagreed.",
        "They ___ to solve the problem.",
        "Her result ___ for all of us.",
        "Don\'t ___ — quality matters.",
        "___, the benefits outweigh risks.",
        "The crisis ___ in the meeting.",
        "I ___ when asked the date.",
        "The data ___ our assumption.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Easy — fill in the blank", answers: ["bite the bullet","goes the extra mile","spoke volumes","On balance","cut corners","raised the bar","came to a head","drew a blank","flies in the face of","stood her ground"] },
    { exercise: 2, subtitle: "Medium — write the expression", answers: ["Bite the bullet","Go the extra mile","Speak volumes","Leave no stone unturned","Raise the bar","Cut corners","On balance","Come to a head","Draw a blank","Fly in the face of"] },
    { exercise: 3, subtitle: "Medium — write the meaning", answers: ["endure a difficult situation","make special effort beyond expectations","indicate clearly without words","try every possible option","set a higher standard","do cheaply, reducing quality","taking everything into account","reach a crisis or turning point","be unable to remember","openly contradict or oppose"] },
    { exercise: 4, subtitle: "Hard — mixed practice", answers: ["bite the bullet","tried every option / left no stone unturned","spoke volumes","left no stone unturned","raised the bar","cut corners","On balance","came to a head","drew a blank","flies in the face of"] },
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
                className={`w-48 rounded-lg border px-3 py-1.5 text-center text-sm font-semibold outline-none transition ${!checked ? "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100" : isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-700"}`} />
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

export default function LivePhrasesC1Client({ isPro }: { isPro: boolean }) {
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
          <span className="text-slate-700 font-medium">C1</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-black text-emerald-700">Live Phrases</span>
            <span className="rounded-full bg-sky-500 px-3 py-0.5 text-[11px] font-black text-white">C1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Advanced</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            Live{" "}
            <span className="relative inline-block">
              Phrases
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 sophisticated C1 expressions used in journalism, business and intellectual discourse — master these to reach true fluency.
          </p>
        </div>

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
            <DownloadWorksheet isPro={isPro} level="C1" title="Live Phrases" wordBank={WORD_BANK} exercises={EXERCISES_WS} filename="LivePhrases_C1_Worksheet_EnglishNerd.pdf" />
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
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">These C1 idioms are used in journalism, formal presentations and intellectual debate. Use them deliberately — one well-placed idiom signals advanced command of English.</p>
          </div>
        </div>

        <div className="mt-14 grid gap-8 xl:grid-cols-[1fr_340px]">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-500 shadow-sm" />
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
            <SpeedRound questions={SPEED_QUESTIONS} gameId="live-phrases-c1" />
          </div>
        </div>

        <div className="mt-14 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone/live-phrases/b2" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            ← B2
          </a>
          <a href="/nerd-zone/live-phrases" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">Back to A1-A2</a>
        </div>
      </div>
    </div>
  );
}
