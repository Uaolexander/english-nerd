"use client";

import { useState } from "react";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import { useLiveSync } from "@/lib/useLiveSync";
import DownloadWorksheet from "../DownloadWorksheet";

const WORDS = [
  { word: "gaslighting",        meaning: "making someone question their own reality through manipulation",           example: "He kept telling her she imagined things — classic gaslighting." },
  { word: "gatekeeping",        meaning: "preventing others from accessing something or joining a group",            example: "Telling fans they're not 'real' fans is pure gatekeeping." },
  { word: "virtue signalling",  meaning: "publicly performing morality to gain social approval",                    example: "Posting about charity just to get likes is a form of virtue signalling." },
  { word: "cancel",             meaning: "to publicly withdraw support from someone due to controversial behaviour", example: "Fans threatened to cancel the brand after the ad." },
  { word: "parasocial",         meaning: "describing a one-sided emotional bond (e.g. fan to influencer)",          example: "The relationship between a fan and a celebrity is inherently parasocial." },
  { word: "chronically online", meaning: "so absorbed in internet culture that you lose real-world perspective",    example: "If you're upset about a meme at 2 am, you might be chronically online." },
  { word: "red flag",           meaning: "a warning sign of problematic behaviour in a person or situation",        example: "He never listens and always blames others — that's a huge red flag." },
  { word: "NPC",                meaning: "someone acting robotically, without independent thought (from gaming)",   example: "He just nodded and agreed with everything — total NPC energy." },
  { word: "delulu",             meaning: "short for delusional; having unrealistic expectations",                   example: "Thinking he'll text back after three months is a bit delulu." },
  { word: "situationship",      meaning: "a romantic connection that is undefined or lacks commitment",             example: "They've been in a situationship for six months — neither will define it." },
  { word: "lore",               meaning: "someone's personal backstory or accumulated history",                     example: "That argument is now part of the office lore." },
  { word: "unhinged",           meaning: "wildly irrational or chaotic — often used humorously",                   example: "That reply was completely unhinged — I can't stop laughing." },
];

const WORD_BANK = ["gaslighting", "gatekeeping", "virtue signalling", "cancel", "parasocial", "chronically online", "red flag", "NPC", "delulu", "situationship"];

const EXERCISES_WS = [
  { before: "He kept telling her she imagined things — classic ",                   answer: "gaslighting",       after: "."                                                          },
  { before: "Telling people they're not 'real' fans is pure ",                      answer: "gatekeeping",       after: " — everyone is welcome."                                    },
  { before: "Posting about charity just to get likes is a form of ",               answer: "virtue signalling", after: "."                                                          },
  { before: "Fans threatened to ",                                                   answer: "cancel",            after: " the brand after the controversial ad."                      },
  { before: "The relationship between a fan and a celebrity is inherently ",        answer: "parasocial",        after: " — they don't know you exist."                              },
  { before: "If you're upset about a meme at 2 am, you might be ",                 answer: "chronically online", after: "."                                                         },
  { before: "He never listens and always blames others — that's a huge ",           answer: "red flag",          after: "."                                                          },
  { before: "He just nodded and agreed with everything — total ",                   answer: "NPC",               after: " energy."                                                   },
  { before: "Thinking he'll text back after three months? That's a bit ",           answer: "delulu",            after: "."                                                          },
  { before: "They've been in a ",                                                    answer: "situationship",     after: " for six months — neither one will define it."              },
];

const LEVELS = [
  { label: "A1-A2", href: "/nerd-zone/slang",    color: "bg-[#F5DA20] text-black" },
  { label: "B1",    href: "/nerd-zone/slang/b1", color: "bg-violet-500 text-white" },
  { label: "B2",    href: "/nerd-zone/slang/b2", color: "bg-orange-500 text-white" },
  { label: "C1",    href: "/nerd-zone/slang/c1", color: "bg-sky-500 text-white" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: '"Gaslighting" = ?',        options: ["lighting a fire","making someone question their reality","bright lighting","manipulation"], answer: 1 },
  { q: '"Gatekeeping" = ?',        options: ["keeping a gate","preventing others from joining","a gate policy","keeping secrets"],       answer: 1 },
  { q: '"Virtue signalling" = ?',  options: ["good behaviour","performing morality for approval","strong ethics","moral values"],        answer: 1 },
  { q: '"Cancel" = ?',             options: ["delete a file","publicly withdraw support","cancel plans","remove content"],               answer: 1 },
  { q: '"Parasocial" = ?',         options: ["social media","one-sided emotional bond","parallel society","para-social club"],           answer: 1 },
  { q: '"Chronically online" = ?', options: ["often connected","so absorbed in internet you lose perspective","chronic pain","online always"], answer: 1 },
  { q: '"Red flag" = ?',           options: ["a red banner","warning sign of bad behaviour","a danger signal","a political sign"],       answer: 1 },
  { q: '"NPC" = ?',                options: ["a type of game","acting robotically without independent thought","a character","a player"], answer: 1 },
  { q: '"Delulu" = ?',             options: ["delusional / unrealistic expectations","a word game","confused","lost"],                  answer: 0 },
  { q: '"Situationship" = ?',      options: ["a difficult situation","undefined romantic connection","a situation in life","a problem"], answer: 1 },
  { q: '"Lore" = ?',               options: ["old stories","personal backstory / accumulated history","mythology","legend"],            answer: 1 },
  { q: '"Unhinged" = ?',           options: ["broken door","wildly irrational or chaotic","unstable structure","very confused"],        answer: 1 },
  { q: 'He kept denying reality — classic ___.', options: ["lore","NPC","gaslighting","delulu"],                                       answer: 2 },
  { q: 'Telling fans they\'re not real fans is ___.', options: ["gaslighting","gatekeeping","cancel","parasocial"],                    answer: 1 },
  { q: 'She thinks he\'ll call — a bit ___.', options: ["unhinged","lore","NPC","delulu"],                                             answer: 3 },
  { q: 'He nodded at everything — total ___ energy.', options: ["lore","NPC","red flag","situationship"],                              answer: 1 },
  { q: 'That\'s a huge ___ — always blaming others.', options: ["lore","delulu","red flag","NPC"],                                    answer: 2 },
  { q: 'They\'re in a ___ — won\'t define it.', options: ["situationship","lore","red flag","parasocial"],                            answer: 0 },
  { q: 'That reply was completely ___ — hilarious.', options: ["parasocial","unhinged","chronically online","gatekeeping"],            answer: 1 },
  { q: 'Fan-celebrity bond is inherently ___.', options: ["unhinged","situationship","parasocial","lore"],                             answer: 2 },
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
    instructions: "Choose the correct cultural slang term to complete each sentence.",
    questions: [
      { id:"e1q1",  prompt: 'He kept insisting she misremembered events — classic ___ .',       options: ["gatekeeping","gaslighting","NPC","lore"],                   correctIndex: 1, explanation: '"Gaslighting" = making someone question their own reality' },
      { id:"e1q2",  prompt: 'Saying someone isn\'t a "real" fan is pure ___ .',               options: ["cancelling","virtue signalling","gatekeeping","parasocial"], correctIndex: 2, explanation: '"Gatekeeping" = preventing others from accessing or joining' },
      { id:"e1q3",  prompt: 'Posting about social causes just for likes is ___ .',            options: ["gaslighting","virtue signalling","NPC","lore"],              correctIndex: 1, explanation: '"Virtue signalling" = publicly performing morality for approval' },
      { id:"e1q4",  prompt: 'Fans threatened to ___ the brand after the offensive post.',    options: ["gaslight","gatekeep","lore","cancel"],                      correctIndex: 3, explanation: '"Cancel" = publicly withdraw support due to controversial behaviour' },
      { id:"e1q5",  prompt: 'The bond between a fan and a celebrity is inherently ___ .',   options: ["unhinged","situationship","parasocial","delulu"],            correctIndex: 2, explanation: '"Parasocial" = a one-sided emotional bond' },
      { id:"e1q6",  prompt: 'Being upset about a meme at 2 am means you\'re probably ___ .', options: ["delulu","chronically online","unhinged","NPC"],             correctIndex: 1, explanation: '"Chronically online" = so absorbed in internet culture you lose perspective' },
      { id:"e1q7",  prompt: 'He never listens and always deflects — that\'s a huge ___ .',  options: ["NPC","lore","red flag","situationship"],                    correctIndex: 2, explanation: '"Red flag" = a warning sign of problematic behaviour' },
      { id:"e1q8",  prompt: 'He just agreed with everything in the meeting — total ___ .', options: ["lore","red flag","situationship","NPC"],                     correctIndex: 3, explanation: '"NPC" = someone acting robotically, without independent thought' },
      { id:"e1q9",  prompt: 'Thinking he\'ll reply after two months is a bit ___ .',       options: ["unhinged","parasocial","delulu","lore"],                     correctIndex: 2, explanation: '"Delulu" = short for delusional; having unrealistic expectations' },
      { id:"e1q10", prompt: 'They\'ve been in a ___ for a year — no label, no commitment.', options: ["red flag","situationship","lore","NPC"],                   correctIndex: 1, explanation: '"Situationship" = a romantic connection that is undefined' },
    ],
  },
  2: {
    type: "input",
    title: "Exercise 2 — Type the slang term",
    instructions: "Type the correct cultural slang term to complete each sentence.",
    questions: [
      { id:"e2q1",  prompt: "He kept insisting she was imagining things — textbook ___ .",      correct: "gaslighting",        explanation: '"Gaslighting" = making someone question their own reality' },
      { id:"e2q2",  prompt: "Telling new fans they\'re not \'real\' fans is ___ .",              correct: "gatekeeping",        explanation: '"Gatekeeping" = preventing others from accessing or joining' },
      { id:"e2q3",  prompt: "Sharing charity posts just for likes is ___ .",                   correct: "virtue signalling",  explanation: '"Virtue signalling" = publicly performing morality for approval' },
      { id:"e2q4",  prompt: "Fans threatened to ___ the influencer after the controversy.",    correct: "cancel",             explanation: '"Cancel" = publicly withdraw support' },
      { id:"e2q5",  prompt: "Fan-celebrity bonds are inherently ___ — it\'s one-sided.",       correct: "parasocial",         explanation: '"Parasocial" = a one-sided emotional bond' },
      { id:"e2q6",  prompt: "If you\'re arguing online at 3 am, you might be ___ .",           correct: "chronically online",  explanation: '"Chronically online" = so absorbed in internet culture you lose perspective' },
      { id:"e2q7",  prompt: "He always blames others — that\'s a massive ___ .",               correct: "red flag",           explanation: '"Red flag" = a warning sign of problematic behaviour' },
      { id:"e2q8",  prompt: "She just agreed with everything — total ___ energy.",             correct: "NPC",                explanation: '"NPC" = acting robotically, without independent thought' },
      { id:"e2q9",  prompt: "Expecting a reply after four months is a bit ___ .",             correct: "delulu",             explanation: '"Delulu" = short for delusional; unrealistic expectations' },
      { id:"e2q10", prompt: "He\'s been in a ___ for a year and won\'t make it official.",    correct: "situationship",      explanation: '"Situationship" = undefined or uncommitted romantic connection' },
    ],
  },
  3: {
    type: "mcq",
    title: "Exercise 3 — What does it mean?",
    instructions: "Choose the correct meaning of the cultural slang term.",
    questions: [
      { id:"e3q1",  prompt: '"He was gaslighting her the entire relationship."',    options: ["lighting candles","making her question her reality","being supportive","lying to her"], correctIndex: 1, explanation: '"Gaslighting" = making someone question their own reality through manipulation' },
      { id:"e3q2",  prompt: '"Saying that is just gatekeeping."',                   options: ["opening a gate","preventing others from joining","a gate policy","keeping safe"],   correctIndex: 1, explanation: '"Gatekeeping" = preventing others from accessing something' },
      { id:"e3q3",  prompt: '"That post felt like virtue signalling."',             options: ["good values","performing morality for approval","moral education","ethical content"], correctIndex: 1, explanation: '"Virtue signalling" = publicly performing morality to gain social approval' },
      { id:"e3q4",  prompt: '"They cancelled the brand overnight."',               options: ["stopped a subscription","publicly withdrew support","deleted content","removed ads"], correctIndex: 1, explanation: '"Cancel" = publicly withdraw support due to controversial behaviour' },
      { id:"e3q5",  prompt: '"That bond is inherently parasocial."',               options: ["a social bond","one-sided emotional bond","a strong friendship","a bond online"],    correctIndex: 1, explanation: '"Parasocial" = a one-sided emotional bond (e.g. fan to influencer)' },
      { id:"e3q6",  prompt: '"She\'s chronically online."',                         options: ["often on a timer","so absorbed in internet she loses perspective","very connected","online 24/7"], correctIndex: 1, explanation: '"Chronically online" = absorbed in internet culture, losing real-world perspective' },
      { id:"e3q7",  prompt: '"That\'s a huge red flag."',                           options: ["a red banner","warning sign of bad behaviour","danger ahead","a political signal"],  correctIndex: 1, explanation: '"Red flag" = a warning sign of problematic behaviour' },
      { id:"e3q8",  prompt: '"He\'s giving total NPC energy."',                    options: ["a game character","acting robotically / no independent thought","a non-player","passive energy"], correctIndex: 1, explanation: '"NPC" = someone acting robotically, without independent thought (from gaming)' },
      { id:"e3q9",  prompt: '"That\'s a bit delulu."',                             options: ["lovely","delusional / unrealistic expectations","confused","a little tired"],         correctIndex: 1, explanation: '"Delulu" = short for delusional; having unrealistic expectations' },
      { id:"e3q10", prompt: '"They\'re in a situationship."',                      options: ["a complicated situation","an undefined romantic connection","a friendship","a problem"], correctIndex: 1, explanation: '"Situationship" = a romantic connection that is undefined or lacks commitment' },
    ],
  },
  4: {
    type: "input",
    title: "Exercise 4 — Mixed practice",
    instructions: "Type the correct cultural slang term.",
    questions: [
      { id:"e4q1",  prompt: "She\'s in therapy because of years of ___ by her ex.",            correct: "gaslighting",        explanation: '"Gaslighting" = making someone question their own reality' },
      { id:"e4q2",  prompt: "Telling people which bands they can or can\'t like is ___ .",    correct: "gatekeeping",        explanation: '"Gatekeeping" = preventing others from accessing or joining' },
      { id:"e4q3",  prompt: "Sharing fundraisers just for the likes is obvious ___ .",        correct: "virtue signalling",  explanation: '"Virtue signalling" = performing morality for social approval' },
      { id:"e4q4",  prompt: "The internet moved quickly to ___ the celebrity.",               correct: "cancel",             explanation: '"Cancel" = publicly withdraw support' },
      { id:"e4q5",  prompt: "His relationship with his audience was deeply ___ .",            correct: "parasocial",         explanation: '"Parasocial" = a one-sided emotional bond' },
      { id:"e4q6",  prompt: "Arguing about fictional characters at midnight? Very ___ .",     correct: "chronically online",  explanation: '"Chronically online" = absorbed in internet culture you lose perspective' },
      { id:"e4q7",  prompt: "He interrupts constantly — that\'s a massive ___ .",            correct: "red flag",           explanation: '"Red flag" = a warning sign of problematic behaviour' },
      { id:"e4q8",  prompt: "She just followed the crowd — pure ___ behaviour.",             correct: "NPC",                explanation: '"NPC" = acting robotically, without independent thought' },
      { id:"e4q9",  prompt: "That argument is now part of the office ___ .",                 correct: "lore",               explanation: '"Lore" = someone\'s personal backstory or accumulated history' },
      { id:"e4q10", prompt: "That email response was completely ___ — I cried laughing.",    correct: "unhinged",           explanation: '"Unhinged" = wildly irrational or chaotic — often used humorously' },
    ],
  },
};

const PDF_CONFIG: LessonPDFConfig = {
  title: "English Slang C1",
  subtitle: "Advanced Cultural & Social Slang — 4 exercises + answer key",
  level: "C1",
  keyRule: "gaslighting · gatekeeping · virtue signalling · cancel · parasocial · chronically online · red flag · NPC · delulu · situationship · lore · unhinged",
  exercises: [
    {
      number: 1,
      title: "Exercise 1",
      difficulty: "Easy",
      instruction: "Fill in the correct cultural slang term.",
      questions: [
        "Classic ___ — denying her reality.",
        "That\'s just ___ — no new fans allowed.",
        "Charity post for likes — ___ .",
        "They moved to ___ the brand.",
        "Fan-celeb bond is ___ in nature.",
        "Upset at memes at 2 am = ___ .",
        "Always blames others — huge ___ .",
        "Agreed with everything — total ___ .",
        "Expects reply after months — ___ .",
        "Been in a ___ for a year.",
      ],
    },
    {
      number: 2,
      title: "Exercise 2",
      difficulty: "Medium",
      instruction: "Write the slang term. Use the hint.",
      questions: [
        "___ — manipulate reality",
        "___ — block entry to group",
        "___ — perform morality (2 words)",
        "___ — withdraw public support",
        "___ — one-sided emotional bond",
        "___ — lost in internet (2 words)",
        "___ — warning sign (2 words)",
        "___ — robotic, no thought",
        "___ — delusional (informal)",
        "___ — undefined romance",
      ],
    },
    {
      number: 3,
      title: "Exercise 3",
      difficulty: "Medium",
      instruction: "Write the meaning of each slang term.",
      questions: [
        "gaslighting = __________",
        "gatekeeping = __________",
        "virtue signalling = _____",
        "cancel = ________________",
        "parasocial = ____________",
        "chronically online = ____",
        "red flag = ______________",
        "NPC = ___________________",
        "delulu = ________________",
        "situationship = _________",
      ],
    },
    {
      number: 4,
      title: "Exercise 4",
      difficulty: "Hard",
      instruction: "Complete with the correct cultural slang.",
      questions: [
        "Years of ___ left her confused.",
        "Telling fans who\'s real is ___ .",
        "Fundraiser post for likes? Pure ___ .",
        "Fans quickly moved to ___ him.",
        "Fan-idol bond is always ___ .",
        "Arguing online at 3 am = ___ .",
        "Constant blame — a huge ___ .",
        "She followed everyone — pure ___ .",
        "That story is now office ___ .",
        "That message was completely ___ .",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Easy — fill in the blank", answers: ["gaslighting","gatekeeping","virtue signalling","cancel","parasocial","chronically online","red flag","NPC","delulu","situationship"] },
    { exercise: 2, subtitle: "Medium — write the slang", answers: ["gaslighting","gatekeeping","virtue signalling","cancel","parasocial","chronically online","red flag","NPC","delulu","situationship"] },
    { exercise: 3, subtitle: "Medium — write the meaning", answers: ["making someone question reality","preventing others from joining","performing morality for approval","publicly withdraw support","one-sided emotional bond","absorbed in internet culture","warning sign of bad behaviour","acting robotically","delusional / unrealistic","undefined romantic connection"] },
    { exercise: 4, subtitle: "Hard — mixed practice", answers: ["gaslighting","gatekeeping","virtue signalling","cancel","parasocial","chronically online","red flag","NPC","lore","unhinged"] },
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
                className={`w-52 rounded-lg border px-3 py-1.5 text-center text-sm font-semibold outline-none transition ${!checked ? "border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100" : isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-700"}`} />
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

export default function SlangC1Client({ isPro }: { isPro: boolean }) {
  const [showAll, setShowAll]           = useState(false);
  const [exNo, setExNo]                 = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked]           = useState(false);
  const [mcqAnswers, setMcqAnswers]     = useState<Record<string, number>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const { isLive, broadcast } = useLiveSync((payload) => {
    setMcqAnswers(payload.answers as Record<string, number>);
    setInputAnswers((payload as unknown as { inputAnswers: Record<string, string> }).inputAnswers ?? {});
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3 | 4);
  });

  const visibleWords = showAll ? WORDS : WORDS.slice(0, 5);
  const currentSet   = SETS[exNo];

  function switchEx(n: 1 | 2 | 3 | 4) { setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); broadcast({ answers: {}, checked: false, exNo: n }); }

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
          <span className="text-slate-700 font-medium">C1</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-pink-100 px-3 py-0.5 text-[11px] font-black text-pink-700">Slang</span>
            <span className="rounded-full bg-sky-500 px-3 py-0.5 text-[11px] font-black text-white">C1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Advanced</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            English{" "}
            <span className="relative inline-block">
              Slang
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            12 sophisticated C1 terms that describe cultural and social phenomena — essential for understanding modern media, politics and online discourse.
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
            <DownloadWorksheet isPro={isPro} level="C1" title="English Slang" wordBank={WORD_BANK} exercises={EXERCISES_WS} filename="Slang_C1_Worksheet_EnglishNerd.pdf" />
            <span className="text-[11px] text-slate-400">10 exercises + answer key · PDF</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-pink-100 bg-pink-50/60 px-4 py-3 text-sm text-pink-700">
          ⚠️ C1 slang is often conceptual — these words describe cultural phenomena. Knowing them helps you understand debates in media, politics and online discourse.
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
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">C1 slang is often conceptual and appears in media and social commentary. Follow English-language podcasts and news discussions — you'll hear these terms used to describe real events and cultural debates.</p>
          </div>
        </div>

        <div className="mt-8">
          <AdUnit variant="inline-light" />
        </div>

        <div className="mt-6 grid gap-8 xl:grid-cols-[1fr_340px]">
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
                  onAnswer={(id, i) => setMcqAnswers((p) => { const n = { ...p, [id]: i }; broadcast({ answers: n, checked: false, exNo }); return n; })}
                  onCheck={() => { setChecked(true); broadcast({ answers: mcqAnswers, checked: true, exNo }); }}
                  onReset={() => { setChecked(false); setMcqAnswers({}); broadcast({ answers: {}, checked: false, exNo }); }} />
              ) : (
                <InputExercise set={currentSet} checked={checked} answers={inputAnswers}
                  onAnswer={(id, v) => setInputAnswers((p) => { const n = { ...p, [id]: v }; broadcast({ answers: mcqAnswers, checked: false, exNo }); return n; })}
                  onCheck={() => { setChecked(true); broadcast({ answers: mcqAnswers, checked: true, exNo }); }}
                  onReset={() => { setChecked(false); setInputAnswers({}); broadcast({ answers: {}, checked: false, exNo }); }} />
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
            <SpeedRound questions={SPEED_QUESTIONS} gameId="slang-c1" />
          </div>
        </div>

        <div className="mt-14 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone/slang/b2" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            ← B2
          </a>
          <a href="/nerd-zone" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">Nerd Zone</a>
        </div>
      </div>
    </div>
  );
}
