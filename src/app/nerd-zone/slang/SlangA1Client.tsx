"use client";

import { useState } from "react";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import DownloadWorksheet from "./DownloadWorksheet";

const WORDS = [
  { word: "cool",        meaning: "great, impressive, or acceptable",             example: "That design looks really cool — everyone will love it." },
  { word: "yeah",        meaning: "yes (informal)",                                example: "— Did you like the film? — Yeah, it was great!" },
  { word: "nope",        meaning: "no (informal)",                                 example: "— Are you coming tonight? — Nope, I'm too tired." },
  { word: "wanna",       meaning: "want to (informal spoken form)",                example: "I wanna try that new café everyone's talking about." },
  { word: "gonna",       meaning: "going to (informal spoken form)",               example: "Are you gonna join us for dinner tonight?" },
  { word: "gotta",       meaning: "have to / must (informal spoken form)",         example: "You've gotta see this film — it's absolutely brilliant." },
  { word: "kinda",       meaning: "kind of / a little (informal)",                 example: "I'm kinda tired, but I'll come to the party anyway." },
  { word: "no biggie",   meaning: "it's not important / no problem",               example: "— Sorry I broke your pen. — No biggie, I have more." },
  { word: "totally",     meaning: "absolutely / completely",                       example: "I totally agree with everything you just said." },
  { word: "hang out",    meaning: "to spend casual time with friends",             example: "We should hang out more — I never see you anymore." },
  { word: "a big deal",  meaning: "something very important or significant",       example: "Moving abroad is a big deal — think it through." },
  { word: "stuff",       meaning: "things in general (informal)",                  example: "I need to sort out some stuff before the weekend." },
  { word: "chill",       meaning: "to relax / calm and easy-going",               example: "I'm just gonna chill at home tonight, nothing special." },
  { word: "literally",   meaning: "used for emphasis (often informal/hyperbole)",  example: "I was literally shaking when they called my name." },
  { word: "ages",        meaning: "a very long time",                              example: "I haven't seen you for ages — how have you been?" },
  { word: "sorted",      meaning: "arranged / dealt with (British informal)",      example: "Don't worry — tickets are sorted, I bought them online." },
  { word: "mate",        meaning: "friend (British informal)",                     example: "This is Jake — he's my mate from university." },
  { word: "cheesy",      meaning: "too sentimental or unoriginal",                example: "The film was a bit cheesy, but I still enjoyed it." },
  { word: "dodgy",       meaning: "suspicious or of poor quality (British)",       example: "That Wi-Fi looks a bit dodgy — I wouldn't use it." },
  { word: "fancy",       meaning: "to want something / to like someone (British)", example: "Do you fancy a coffee? There's a café round the corner." },
  { word: "knackered",   meaning: "very tired (British informal)",                 example: "I'm absolutely knackered — I've been on my feet all day." },
  { word: "buzzing",     meaning: "very excited or in a great mood (British)",    example: "She's buzzing after getting the job offer — great news!" },
  { word: "gutted",      meaning: "very disappointed (British informal)",          example: "I'm gutted we lost the match — we played so well." },
  { word: "dead",        meaning: "very / really (British intensifier)",           example: "That was dead funny — I couldn't stop laughing." },
];

const WORD_BANK = ["cool", "yeah", "gonna", "gotta", "kinda", "no biggie", "totally", "hang out", "a big deal", "wanna"];

const EXERCISES_WS = [
  { before: "Are you ",                  answer: "gonna",      after: " join us for dinner tonight?"                         },
  { before: "I ",                        answer: "wanna",      after: " try that new café everyone's talking about."         },
  { before: "You've ",                   answer: "gotta",      after: " see this film — it's absolutely brilliant."          },
  { before: "I'm ",                      answer: "kinda",      after: " tired, but I'll come to the party anyway."           },
  { before: "— Sorry I broke your pen. — ", answer: "No biggie", after: ", I have plenty more."                             },
  { before: "That new design looks really ", answer: "cool",   after: " — everyone's going to love it."                     },
  { before: "I ",                        answer: "totally",    after: " agree with everything you just said."                },
  { before: "We should ",               answer: "hang out",   after: " more — I feel like I never see you anymore."         },
  { before: "— Did you like the film? — ", answer: "Yeah",    after: ", it was great!"                                      },
  { before: "Moving abroad is ",        answer: "a big deal", after: " — make sure you've thought it through."              },
];

const LEVELS = [
  { label: "A1-A2", href: "/nerd-zone/slang",    color: "bg-[#F5DA20] text-black" },
  { label: "B1",    href: "/nerd-zone/slang/b1", color: "bg-violet-500 text-white" },
  { label: "B2",    href: "/nerd-zone/slang/b2", color: "bg-orange-500 text-white" },
  { label: "C1",    href: "/nerd-zone/slang/c1", color: "bg-sky-500 text-white" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: '"Cool" = ?',         options: ["awful","great / impressive","cold","boring"],             answer: 1 },
  { q: '"Yeah" = ?',         options: ["no","yes (informal)","maybe","later"],                    answer: 1 },
  { q: '"Nope" = ?',         options: ["yes","no (informal)","maybe","not yet"],                  answer: 1 },
  { q: '"Wanna" = ?',        options: ["going to","want to","have to","must"],                    answer: 1 },
  { q: '"Gonna" = ?',        options: ["want to","going to","must","kind of"],                    answer: 1 },
  { q: '"Gotta" = ?',        options: ["want to","have to / must","going to","kind of"],          answer: 1 },
  { q: '"Kinda" = ?',        options: ["totally","kind of / a little","absolutely","not at all"], answer: 1 },
  { q: '"No biggie" = ?',    options: ["big problem","no problem / not important","a huge deal","very important"], answer: 1 },
  { q: '"Totally" = ?',      options: ["maybe","absolutely / completely","kind of","partly"],     answer: 1 },
  { q: '"Hang out" = ?',     options: ["hang something","spend casual time with friends","stay home","hang up"], answer: 1 },
  { q: '"A big deal" = ?',   options: ["a large offer","something very important","a good price","a big shop"], answer: 1 },
  { q: '"Stuff" = ?',        options: ["one thing","things in general","food","work tasks"],      answer: 1 },
  { q: '"Mate" = ?',         options: ["partner","friend (British informal)","colleague","boss"],  answer: 1 },
  { q: '"Knackered" = ?',    options: ["excited","very tired (British)","very happy","confused"],  answer: 1 },
  { q: '"Gutted" = ?',       options: ["very hungry","very disappointed","very excited","very tired"], answer: 1 },
  { q: '"Buzzing" = ?',      options: ["making noise","very excited / great mood","very tired","confused"], answer: 1 },
  { q: '"Dodgy" = ?',        options: ["stylish","suspicious / poor quality","reliable","expensive"], answer: 1 },
  { q: '"Fancy" = ?',        options: ["expensive only","want / like (British)","hate","ignore"],  answer: 1 },
  { q: '"Dead" in British slang = ?', options: ["lifeless","very / really","not alive","extremely bad"], answer: 1 },
  { q: '"Sorted" = ?',       options: ["confused","arranged / dealt with","not ready","complicated"], answer: 1 },
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
    instructions: "Choose the correct informal word or phrase to complete each sentence.",
    questions: [
      { id:"e1q1",  prompt: 'Are you ___ join us for pizza tonight?',                    options: ["wanna","gonna","gotta","kinda"],             correctIndex: 1, explanation: '"Gonna" = going to (informal spoken form)' },
      { id:"e1q2",  prompt: 'I ___ try that new sushi place — it looks amazing!',        options: ["gonna","gotta","wanna","kinda"],             correctIndex: 2, explanation: '"Wanna" = want to (informal spoken form)' },
      { id:"e1q3",  prompt: 'That new jacket looks really ___ — where did you get it?',  options: ["cheesy","dodgy","cool","kinda"],             correctIndex: 2, explanation: '"Cool" = great, impressive, or acceptable' },
      { id:"e1q4",  prompt: 'You\'ve ___ see this show — it\'s absolutely brilliant.',   options: ["wanna","gonna","kinda","gotta"],             correctIndex: 3, explanation: '"Gotta" = have to / must (informal spoken form)' },
      { id:"e1q5",  prompt: 'I\'m ___ tired, but I\'ll still come to the event.',        options: ["totally","kinda","gotta","wanna"],           correctIndex: 1, explanation: '"Kinda" = kind of / a little (informal)' },
      { id:"e1q6",  prompt: '— Sorry I forgot your charger. — ___, I have a spare.',     options: ["A big deal","No biggie","Totally","Yeah"],   correctIndex: 1, explanation: '"No biggie" = it\'s not important / no problem' },
      { id:"e1q7",  prompt: 'I ___ agree with what you just said — well done!',          options: ["kinda","gotta","totally","gonna"],           correctIndex: 2, explanation: '"Totally" = absolutely / completely' },
      { id:"e1q8",  prompt: 'We should ___ more often — I\'ve missed you.',               options: ["chill out","hang out","sort out","deal with"], correctIndex: 1, explanation: '"Hang out" = to spend casual time with friends' },
      { id:"e1q9",  prompt: 'Moving abroad alone is ___ — have you planned everything?', options: ["no biggie","totally fine","a big deal","kinda okay"], correctIndex: 2, explanation: '"A big deal" = something very important or significant' },
      { id:"e1q10", prompt: '— Did you enjoy the concert? — ___, it was incredible!',    options: ["Nope","Yeah","Kinda","Gotta"],               correctIndex: 1, explanation: '"Yeah" = yes (informal)' },
    ],
  },
  2: {
    type: "input",
    title: "Exercise 2 — Type the slang word",
    instructions: "Type the correct informal word or phrase to complete each sentence.",
    questions: [
      { id:"e2q1",  prompt: "Are you ___ come to the party on Friday night?",          correct: "gonna",      explanation: '"Gonna" = going to (informal spoken form)' },
      { id:"e2q2",  prompt: "I ___ try that café — everyone says it\'s amazing.",      correct: "wanna",      explanation: '"Wanna" = want to (informal spoken form)' },
      { id:"e2q3",  prompt: "You\'ve ___ watch this film — it\'s a masterpiece.",      correct: "gotta",      explanation: '"Gotta" = have to / must (informal spoken form)' },
      { id:"e2q4",  prompt: "I\'m ___ nervous, but I\'ll give the speech anyway.",     correct: "kinda",      explanation: '"Kinda" = kind of / a little (informal)' },
      { id:"e2q5",  prompt: "— Sorry I was late. — ___, no harm done at all.",         correct: "no biggie",  explanation: '"No biggie" = it\'s not important / no problem' },
      { id:"e2q6",  prompt: "That new design is really ___ — the client will love it.", correct: "cool",      explanation: '"Cool" = great, impressive, or acceptable' },
      { id:"e2q7",  prompt: "I ___ agree with your feedback — it\'s spot on.",         correct: "totally",    explanation: '"Totally" = absolutely / completely' },
      { id:"e2q8",  prompt: "Let\'s ___ this weekend and catch up properly.",          correct: "hang out",   explanation: '"Hang out" = to spend casual time with friends' },
      { id:"e2q9",  prompt: "Quitting your job without a plan is ___ — think carefully.", correct: "a big deal", explanation: '"A big deal" = something very important or significant' },
      { id:"e2q10", prompt: "I need to sort out some ___ before the weekend.",         correct: "stuff",      explanation: '"Stuff" = things in general (informal)' },
    ],
  },
  3: {
    type: "mcq",
    title: "Exercise 3 — What does it mean?",
    instructions: "Choose the correct meaning of the slang word or phrase.",
    questions: [
      { id:"e3q1",  prompt: '"That film was so cheesy — I cringed."',         options: ["scary","too sentimental or unoriginal","very exciting","hilarious"],        correctIndex: 1, explanation: '"Cheesy" = too sentimental or unoriginal' },
      { id:"e3q2",  prompt: '"That Wi-Fi looks a bit dodgy — don\'t use it."', options: ["fast","suspicious or poor quality","expensive","broken"],                  correctIndex: 1, explanation: '"Dodgy" = suspicious or of poor quality (British)' },
      { id:"e3q3",  prompt: '"Do you fancy a coffee round the corner?"',      options: ["hate","want / like (British)","avoid","make"],                              correctIndex: 1, explanation: '"Fancy" = to want something / to like someone (British)' },
      { id:"e3q4",  prompt: '"I\'m absolutely knackered after that shift."',  options: ["energised","very tired (British)","very hungry","very bored"],               correctIndex: 1, explanation: '"Knackered" = very tired (British informal)' },
      { id:"e3q5",  prompt: '"She\'s buzzing after getting the promotion."',  options: ["upset","very excited / great mood","very tired","confused"],                 correctIndex: 1, explanation: '"Buzzing" = very excited or in a great mood (British)' },
      { id:"e3q6",  prompt: '"I\'m gutted we didn\'t get the contract."',     options: ["relieved","very disappointed","very happy","not surprised"],                 correctIndex: 1, explanation: '"Gutted" = very disappointed (British informal)' },
      { id:"e3q7",  prompt: '"That was dead funny — I can\'t stop laughing."', options: ["not funny","very / really (intensifier)","barely funny","quite funny"],    correctIndex: 1, explanation: '"Dead" = very / really (British intensifier)' },
      { id:"e3q8",  prompt: '"Don\'t worry — everything\'s sorted."',         options: ["lost","arranged / dealt with","complicated","still in progress"],            correctIndex: 1, explanation: '"Sorted" = arranged / dealt with (British informal)' },
      { id:"e3q9",  prompt: '"This is Jake — my mate from school."',          options: ["teacher","friend (British informal)","flatmate","boss"],                     correctIndex: 1, explanation: '"Mate" = friend (British informal)' },
      { id:"e3q10", prompt: '"I was literally shaking with excitement."',     options: ["actually shaking","used for emphasis","not really shaking","physically ill"], correctIndex: 1, explanation: '"Literally" = used for emphasis (often informal/hyperbole)' },
    ],
  },
  4: {
    type: "input",
    title: "Exercise 4 — Mixed practice",
    instructions: "Type the correct slang word or phrase.",
    questions: [
      { id:"e4q1",  prompt: "I\'m ___ exhausted — I\'ve been on my feet all day.",        correct: "knackered",  explanation: '"Knackered" = very tired (British informal)' },
      { id:"e4q2",  prompt: "She\'s ___ after hearing the great news — she can\'t stop smiling.", correct: "buzzing", explanation: '"Buzzing" = very excited or in a great mood' },
      { id:"e4q3",  prompt: "I\'m ___ we lost — we played so well today.",               correct: "gutted",     explanation: '"Gutted" = very disappointed (British informal)' },
      { id:"e4q4",  prompt: "That joke was ___ funny — the whole room was laughing.",     correct: "dead",       explanation: '"Dead" = very / really (British intensifier)' },
      { id:"e4q5",  prompt: "Don\'t worry — the hotel is ___, I booked it this morning.", correct: "sorted",     explanation: '"Sorted" = arranged / dealt with (British informal)' },
      { id:"e4q6",  prompt: "Hey ___ — long time no see! How\'ve you been?",             correct: "mate",       explanation: '"Mate" = friend (British informal)' },
      { id:"e4q7",  prompt: "That ending was a bit ___ — way too predictable.",           correct: "cheesy",     explanation: '"Cheesy" = too sentimental or unoriginal' },
      { id:"e4q8",  prompt: "Do you ___ coming to the cinema with us tonight?",          correct: "fancy",      explanation: '"Fancy" = to want something / to like someone (British)' },
      { id:"e4q9",  prompt: "That link looks ___ — I wouldn\'t click on it.",            correct: "dodgy",      explanation: '"Dodgy" = suspicious or of poor quality (British)' },
      { id:"e4q10", prompt: "I was ___ speechless when I heard the news.",               correct: "literally",  explanation: '"Literally" = used for emphasis (informal/hyperbole)' },
    ],
  },
};

const PDF_CONFIG: LessonPDFConfig = {
  title: "English Slang A1-A2",
  subtitle: "Beginner & Elementary Informal Words — 4 exercises + answer key",
  level: "A1-A2",
  keyRule: "cool · yeah · gonna · gotta · wanna · kinda · no biggie · totally · hang out · a big deal · mate · knackered · gutted · buzzing · sorted",
  exercises: [
    {
      number: 1,
      title: "Exercise 1",
      difficulty: "Easy",
      instruction: "Fill in the correct informal word.",
      questions: [
        "Are you ___ come to the party?",
        "I ___ try that new café.",
        "That jacket looks really ___.",
        "You\'ve ___ see this show.",
        "I\'m ___ tired but I\'ll come.",
        "— Late again. — ___, no worries.",
        "I ___ agree — you\'re right.",
        "We should ___ more often.",
        "Moving abroad is ___ — plan it.",
        "Did you enjoy it? — ___, loved it!",
      ],
    },
    {
      number: 2,
      title: "Exercise 2",
      difficulty: "Medium",
      instruction: "Write the slang. Use the hint.",
      questions: [
        "___ — going to",
        "___ — want to",
        "___ — have to / must",
        "___ — kind of / a little",
        "___ — no problem (2 words)",
        "___ — great / impressive",
        "___ — absolutely",
        "___ — spend time with friends (2 words)",
        "___ — very important (3 words)",
        "___ — things in general",
      ],
    },
    {
      number: 3,
      title: "Exercise 3",
      difficulty: "Medium",
      instruction: "Write the meaning of each slang word.",
      questions: [
        "mate = _______________",
        "knackered = __________",
        "buzzing = ____________",
        "gutted = _____________",
        "dead (British) = ______",
        "sorted = _____________",
        "dodgy = ______________",
        "fancy = _______________",
        "cheesy = _____________",
        "literally = ___________",
      ],
    },
    {
      number: 4,
      title: "Exercise 4",
      difficulty: "Hard",
      instruction: "Complete with the correct slang.",
      questions: [
        "I\'m ___ — on feet all day.",
        "She\'s ___ about the promotion.",
        "I\'m ___ we didn\'t win.",
        "That was ___ funny.",
        "Don\'t worry — it\'s all ___.",
        "Hey ___ — long time no see!",
        "That film was a bit ___.",
        "Do you ___ going out tonight?",
        "That website looks ___ to me.",
        "I was ___ in shock.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Easy — fill in the blank", answers: ["gonna","wanna","cool","gotta","kinda","No biggie","totally","hang out","a big deal","Yeah"] },
    { exercise: 2, subtitle: "Medium — write the slang", answers: ["gonna","wanna","gotta","kinda","no biggie","cool","totally","hang out","a big deal","stuff"] },
    { exercise: 3, subtitle: "Medium — write the meaning", answers: ["friend (British)","very tired","very excited","very disappointed","very / really","arranged / done","suspicious","want / like","too sentimental","used for emphasis"] },
    { exercise: 4, subtitle: "Hard — mixed practice", answers: ["knackered","buzzing","gutted","dead","sorted","mate","cheesy","fancy","dodgy","literally"] },
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
                  if (!checked) { cls += isChosen ? "border-pink-400 bg-pink-100 text-pink-800" : "border-slate-200 bg-white text-slate-700 hover:border-pink-300 hover:bg-pink-50"; }
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
                className={`w-44 rounded-lg border px-3 py-1.5 text-center text-sm font-semibold outline-none transition ${!checked ? "border-slate-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100" : isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-700"}`} />
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

export default function SlangA1Client({ isPro }: { isPro: boolean }) {
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
          {[["Home", "/"], ["Nerd Zone", "/nerd-zone"]].map(([label, href]) => (
            <span key={href} className="flex items-center gap-1.5">
              <a href={href} className="hover:text-slate-700 transition">{label}</a>
              <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          ))}
          <span className="text-slate-700 font-medium">Slang · A1-A2</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-pink-100 px-3 py-0.5 text-[11px] font-black text-pink-700">Slang</span>
            <span className="rounded-full bg-[#F5DA20] px-3 py-0.5 text-[11px] font-black text-black">A1-A2</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Beginner</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            English{" "}
            <span className="relative inline-block">
              Slang
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            24 essential A1-A2 informal words and phrases — used daily in conversations, messages and media. Start here.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {LEVELS.map(({ label, href, color }) => (
              label === "A1-A2" ? (
                <span key={label} className={`rounded-xl ${color} px-5 py-2 text-sm font-black shadow-sm`}>{label}</span>
              ) : (
                <a key={label} href={href} className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-700 transition">{label}</a>
              )
            ))}
          </div>
          <div className="flex flex-col items-end gap-1">
            <DownloadWorksheet isPro={isPro} level="A1-A2" title="English Slang" wordBank={WORD_BANK} exercises={EXERCISES_WS} filename="Slang_A1A2_Worksheet_EnglishNerd.pdf" />
            <span className="text-[11px] text-slate-400">10 exercises + answer key · PDF</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-pink-100 bg-pink-50/60 px-4 py-3 text-sm text-pink-700">
          ⚠️ These words are informal — perfect for casual conversation and messages, but avoid them in formal writing or professional emails.
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-0 border-b-2 border-slate-200 bg-white">
            <div className="flex items-center gap-2 px-5 py-4"><span className="h-2 w-2 rounded-full bg-pink-500" /><span className="text-[10px] font-black uppercase tracking-widest text-pink-700">Word / Phrase</span></div>
            <div className="flex items-center gap-2 border-l border-emerald-100 bg-emerald-50/60 px-5 py-4"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Meaning</span></div>
            <div className="flex items-center gap-2 border-l border-sky-100 bg-sky-50/60 px-5 py-4"><span className="h-2 w-2 rounded-full bg-sky-500" /><span className="text-[10px] font-black uppercase tracking-widest text-sky-700">Example</span></div>
          </div>
          <div>
            {visibleWords.flatMap(({ word, meaning, example }, i) => {
              const row = (
                <div key={word} className={`group grid grid-cols-[1fr_1fr_1.5fr] gap-0 border-b border-slate-50 transition-colors hover:bg-[#F5DA20]/8 last:border-0 ${i % 2 === 1 ? "bg-slate-50/40" : "bg-white"}`}>
                  <div className="flex items-center px-5 py-3.5"><span className="text-sm font-black text-pink-600">{word}</span></div>
                  <div className="flex items-center border-l border-emerald-50 bg-emerald-50/30 px-5 py-3.5 group-hover:bg-emerald-50/60"><span className="inline-flex rounded-lg bg-emerald-100 px-2.5 py-1 text-sm font-semibold text-emerald-800">{meaning}</span></div>
                  <div className="flex items-center border-l border-sky-50 bg-sky-50/30 px-5 py-3.5 group-hover:bg-sky-50/60"><span className="text-sm italic text-sky-800">{example}</span></div>
                </div>
              );
              if (i === 12) {
                return [
                  <div key="a2-divider" className="border-y-2 border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-2 px-5 py-2">
                      <span className="rounded-full bg-[#F5DA20] px-2 py-0.5 text-[10px] font-black text-black">A2</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Elementary</span>
                    </div>
                  </div>,
                  row,
                ];
              }
              return [row];
            })}
          </div>
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 flex items-center justify-center">
            <button onClick={() => setShowAll((v) => !v)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:bg-slate-50">
              {showAll ? (<><svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 15l7-7 7 7"/></svg>Collapse</>) : (<><svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 9l-7 7-7-7"/></svg>Show all 24 words</>)}
            </button>
          </div>
        </div>

        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">These basics are used every day in informal English. Start with them in casual chats and messages — they'll immediately make your English feel more natural and relaxed.</p>
          </div>
        </div>

        <div className="mt-14 grid gap-8 xl:grid-cols-[1fr_340px]">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#F5DA20] shadow-sm" />
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
            <SpeedRound questions={SPEED_QUESTIONS} gameId="slang-a1" />
          </div>
        </div>

        <div className="mt-14 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Back to Nerd Zone
          </a>
          <a href="/nerd-zone/slang/b1" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">Next: B1</a>
        </div>
      </div>
    </div>
  );
}
