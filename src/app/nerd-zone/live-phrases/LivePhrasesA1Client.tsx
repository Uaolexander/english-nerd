"use client";

import { useState } from "react";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import DownloadWorksheet from "./DownloadWorksheet";

const PHRASES = [
  { phrase: "Sounds good",          meaning: "That's agreeable / I like that idea",          example: "— Let's meet at 3. — Sounds good, see you then." },
  { phrase: "No worries",           meaning: "It's fine / don't worry about it",             example: "— Sorry I'm late! — No worries, we just started." },
  { phrase: "Go ahead",             meaning: "Please proceed / feel free",                   example: "— Can I use your pen? — Go ahead." },
  { phrase: "I see",                meaning: "I understand",                                  example: "— The deadline is Friday. — I see, I'll prioritise it." },
  { phrase: "Fair enough",          meaning: "I accept that / I understand",                 example: "— I can't come Friday. — Fair enough, we'll reschedule." },
  { phrase: "Bear with me",         meaning: "Please be patient for a moment",               example: "Bear with me — the file is taking a while to load." },
  { phrase: "By all means",         meaning: "Of course / please go ahead",                  example: "— Can I ask you something? — By all means." },
  { phrase: "No wonder",            meaning: "It makes perfect sense / not surprising",      example: "You've been working 14-hour days. No wonder you're tired." },
  { phrase: "My bad",               meaning: "My mistake / I'm sorry",                       example: "I forgot to reply. My bad — I'll do it now." },
  { phrase: "Hang on",              meaning: "Wait a moment",                                 example: "Hang on — let me check the schedule first." },
  { phrase: "Cheers",               meaning: "Thank you / goodbye (informal, British)",      example: "— Here's your coffee. — Cheers!" },
  { phrase: "That said",            meaning: "Despite what I just said (introduces contrast)", example: "It's a tough course. That said, I learned a lot." },
  { phrase: "I was wondering",      meaning: "A polite way to ask something",                example: "I was wondering if you could help me with this." },
  { phrase: "It depends",           meaning: "The answer changes in different situations",   example: "— Is it expensive? — It depends on the restaurant." },
  { phrase: "What do you reckon?",  meaning: "What is your opinion?",                        example: "I'm not sure about this idea. What do you reckon?" },
  { phrase: "To be honest",         meaning: "Said before an honest or surprising opinion",  example: "To be honest, I didn't really enjoy the film." },
  { phrase: "I'll get back to you", meaning: "I'll contact you later with an answer",        example: "I need to check my diary — I'll get back to you." },
  { phrase: "Same here",            meaning: "Me too / I feel the same way",                 example: "— I'm exhausted. — Same here, it's been a long week." },
  { phrase: "Let me know",          meaning: "Tell me / inform me",                          example: "Let me know if you need any help with the report." },
  { phrase: "Either way",           meaning: "Regardless of which option",                   example: "We can eat in or out — either way is fine with me." },
  { phrase: "As far as I know",     meaning: "Based on the information I have",              example: "As far as I know, the meeting is still at 3 pm." },
  { phrase: "It's up to you",       meaning: "You can decide / it's your choice",            example: "We can go now or later — it's up to you." },
  { phrase: "Out of the blue",      meaning: "Unexpectedly / without warning",               example: "She called me out of the blue after three years." },
  { phrase: "On second thought",    meaning: "Having reconsidered",                          example: "On second thought, let's take the train instead." },
];

const WORD_BANK = ["sounds good", "no worries", "go ahead", "fair enough", "bear with me", "by all means", "my bad", "hang on", "cheers", "that said"];

const EXERCISES_WS = [
  { before: "— Can I use your computer? — ",  answer: "Go ahead",     after: ", it's not being used right now."           },
  { before: "Sorry I'm late! — ",             answer: "No worries",   after: ", we haven't started yet."                  },
  { before: "— Let's meet at 3 pm. — ",       answer: "Sounds good",  after: ", I'll see you then."                       },
  { before: "— Can I ask you something? — ",  answer: "By all means", after: ", what would you like to know?"             },
  { before: "I forgot to send the email. ",   answer: "My bad",       after: " — I'll do it right now."                   },
  { before: "Just ",                           answer: "bear with me", after: " for a second — I'm finding the file."     },
  { before: "— I can't come on Friday. — ",   answer: "Fair enough",  after: ", we'll move it to Saturday."               },
  { before: "",                                answer: "Hang on",      after: " — let me check the schedule before we confirm." },
  { before: "Thanks for your help! — ",       answer: "Cheers",       after: ", anytime!"                                 },
  { before: "It's a tough job. ",             answer: "That said",    after: ", the pay is excellent."                    },
];

const LEVELS = [
  { label: "A1-A2", href: "/nerd-zone/live-phrases",    color: "bg-[#F5DA20] text-black" },
  { label: "B1",    href: "/nerd-zone/live-phrases/b1", color: "bg-violet-500 text-white" },
  { label: "B2",    href: "/nerd-zone/live-phrases/b2", color: "bg-orange-500 text-white" },
  { label: "C1",    href: "/nerd-zone/live-phrases/c1", color: "bg-sky-500 text-white" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: '"Sounds good" = ?',          options: ["I disagree","That\'s agreeable","Let\'s wait","Say again"],              answer: 1 },
  { q: '"No worries" = ?',           options: ["Big problem","It\'s fine / don\'t worry","I\'m worried","Worry more"],  answer: 1 },
  { q: '"Go ahead" = ?',             options: ["Stop here","Please proceed / feel free","Go back","Not yet"],            answer: 1 },
  { q: '"I see" = ?',                options: ["I\'m looking","I understand","I can see you","I agree fully"],           answer: 1 },
  { q: '"Fair enough" = ?',          options: ["Not fair","I accept that","That\'s unfair","Exactly right"],             answer: 1 },
  { q: '"Bear with me" = ?',         options: ["Hold a bear","Please be patient","Go away","Come back later"],           answer: 1 },
  { q: '"By all means" = ?',         options: ["No way at all","Of course / go ahead","Means a lot","Not sure"],        answer: 1 },
  { q: '"No wonder" = ?',            options: ["That\'s strange","It makes perfect sense","I wonder why","Very odd"],    answer: 1 },
  { q: '"My bad" = ?',               options: ["Well done!","My mistake / I\'m sorry","Your mistake","Not bad at all"], answer: 1 },
  { q: '"Hang on" = ?',              options: ["Hang something","Wait a moment","Move on now","Hang up"],                answer: 1 },
  { q: '"Cheers" = ?',               options: ["I\'m unhappy","Thank you / goodbye","Drink more","Bad news"],            answer: 1 },
  { q: '"That said" = ?',            options: ["Repeat that","Despite what I said","Say it again","I said that"],        answer: 1 },
  { q: '"I was wondering" = ?',      options: ["I don\'t know","A polite way to ask","I\'m confused","I wonder why"],   answer: 1 },
  { q: '"It depends" = ?',           options: ["Always yes","Answer varies by situation","I\'m certain","Definitely"],  answer: 1 },
  { q: '"To be honest" = ?',         options: ["I\'m lying","Before an honest opinion","Be dishonest","Tell a joke"],   answer: 1 },
  { q: '"Same here" = ?',            options: ["Different here","Me too / I feel the same","Same time","Not here"],      answer: 1 },
  { q: '"Let me know" = ?',          options: ["Keep it secret","Tell me / inform me","I\'ll tell you","No need"],      answer: 1 },
  { q: '"Either way" = ?',           options: ["Only one way","Regardless of which option","Both ways","Wrong way"],     answer: 1 },
  { q: 'She said "Go ___" — proceed!', options: ["back","ahead","away","fast"],                                          answer: 1 },
  { q: '"No ___" — it\'s fine!',     options: ["problem","worries","issue","cap"],                                       answer: 1 },
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
      { id:"e1q1",  prompt: '___, we haven\'t started yet — don\'t worry.',                    options: ["My bad","No worries","Hang on","Fair enough"],       correctIndex: 1, explanation: '"No worries" = it\'s fine / don\'t worry about it' },
      { id:"e1q2",  prompt: '— Can I ask you something personal? — ___, go right ahead.',    options: ["By all means","Bear with me","Cheers","That said"],   correctIndex: 0, explanation: '"By all means" = of course / please go ahead' },
      { id:"e1q3",  prompt: '— Let\'s catch up at 4 pm. — ___, see you then!',               options: ["Go ahead","Fair enough","Sounds good","I see"],       correctIndex: 2, explanation: '"Sounds good" = that\'s agreeable / I like that idea' },
      { id:"e1q4",  prompt: '___ — let me just pull up the file for you.',                    options: ["Cheers","Hang on","My bad","Bear with me"],           correctIndex: 1, explanation: '"Hang on" = wait a moment' },
      { id:"e1q5",  prompt: '— The deadline moved to Monday. — ___, I\'ll adjust my plan.',  options: ["My bad","Go ahead","I see","No wonder"],              correctIndex: 2, explanation: '"I see" = I understand' },
      { id:"e1q6",  prompt: '— I can\'t make Thursday. — ___, we\'ll find another time.',    options: ["No wonder","Fair enough","My bad","That said"],       correctIndex: 1, explanation: '"Fair enough" = I accept that / I understand' },
      { id:"e1q7",  prompt: '___ — I sent the wrong version of the report.',                  options: ["By all means","No wonder","My bad","Hang on"],        correctIndex: 2, explanation: '"My bad" = my mistake / I\'m sorry' },
      { id:"e1q8",  prompt: 'It\'s a long commute. ___, the office is in a great location.', options: ["Go ahead","My bad","That said","Bear with me"],       correctIndex: 2, explanation: '"That said" = despite what I just said' },
      { id:"e1q9",  prompt: 'You\'ve had no sleep for 36 hours. ___ you\'re exhausted!',     options: ["My bad","No wonder","Bear with me","Cheers"],         correctIndex: 1, explanation: '"No wonder" = it makes perfect sense / not surprising' },
      { id:"e1q10", prompt: 'Thank you so much for your help! — ___!',                       options: ["My bad","Fair enough","Cheers","That said"],          correctIndex: 2, explanation: '"Cheers" = thank you / goodbye (informal, British)' },
    ],
  },
  2: {
    type: "input",
    title: "Exercise 2 — Type the expression",
    instructions: "Type the correct expression to complete each sentence.",
    questions: [
      { id:"e2q1",  prompt: "___, we just got started — no problem at all.",                  correct: "no worries",   explanation: '"No worries" = it\'s fine / don\'t worry about it' },
      { id:"e2q2",  prompt: "— Can I use this chair? — ___, it\'s free.",                    correct: "go ahead",     explanation: '"Go ahead" = please proceed / feel free' },
      { id:"e2q3",  prompt: "— Meeting at noon? — ___, I\'ll be there.",                     correct: "sounds good",  explanation: '"Sounds good" = that\'s agreeable / I like that idea' },
      { id:"e2q4",  prompt: "Just ___ while I find that document for you.",                   correct: "bear with me", explanation: '"Bear with me" = please be patient for a moment' },
      { id:"e2q5",  prompt: "— Can I join your project? — ___, we\'d love to have you.",     correct: "by all means", explanation: '"By all means" = of course / please go ahead' },
      { id:"e2q6",  prompt: "— I couldn\'t attend the meeting. — ___, I\'ll send the notes.", correct: "my bad",      explanation: '"My bad" = my mistake / I\'m sorry' },
      { id:"e2q7",  prompt: "___ — let me just check the calendar before I confirm.",        correct: "hang on",      explanation: '"Hang on" = wait a moment' },
      { id:"e2q8",  prompt: "— It\'s tricky. ___, it\'s completely manageable.",             correct: "that said",    explanation: '"That said" = despite what I just said' },
      { id:"e2q9",  prompt: "You\'ve skipped lunch every day. ___ you\'re hungry!",          correct: "no wonder",    explanation: '"No wonder" = it makes perfect sense / not surprising' },
      { id:"e2q10", prompt: "___ if you need anything — I\'m happy to help.",                correct: "let me know",  explanation: '"Let me know" = tell me / inform me' },
    ],
  },
  3: {
    type: "mcq",
    title: "Exercise 3 — What does it mean?",
    instructions: "Choose the correct meaning of the expression.",
    questions: [
      { id:"e3q1",  prompt: '"No worries — we haven\'t started yet."',      options: ["I\'m worried","It\'s fine / don\'t worry","Big problem","No solution"],         correctIndex: 1, explanation: '"No worries" = it\'s fine / don\'t worry about it' },
      { id:"e3q2",  prompt: '"Go ahead, the chair is free."',               options: ["Go away","Please proceed","Stop now","Go back"],                                correctIndex: 1, explanation: '"Go ahead" = please proceed / feel free' },
      { id:"e3q3",  prompt: '"I see — I\'ll adjust my schedule."',          options: ["I\'m watching","I understand","I can see","I agree fully"],                     correctIndex: 1, explanation: '"I see" = I understand' },
      { id:"e3q4",  prompt: '"Fair enough — let\'s reschedule."',           options: ["Not fair","I accept that / okay","That\'s unfair","Exactly right"],             correctIndex: 1, explanation: '"Fair enough" = I accept that / I understand' },
      { id:"e3q5",  prompt: '"Bear with me — I\'m loading the file."',      options: ["Hold a bear","Please be patient","Go away quickly","Come back later"],          correctIndex: 1, explanation: '"Bear with me" = please be patient for a moment' },
      { id:"e3q6",  prompt: '"By all means, ask your question."',           options: ["No way at all","Of course / go ahead","Means a lot","Maybe sometime"],         correctIndex: 1, explanation: '"By all means" = of course / please go ahead' },
      { id:"e3q7",  prompt: '"No wonder you\'re tired after all that."',    options: ["That\'s weird","It makes perfect sense","I\'m wondering","Very strange"],       correctIndex: 1, explanation: '"No wonder" = it makes perfect sense / not surprising' },
      { id:"e3q8",  prompt: '"My bad — I sent the wrong document."',        options: ["Good job","My mistake / I\'m sorry","Your mistake","Not too bad"],              correctIndex: 1, explanation: '"My bad" = my mistake / I\'m sorry' },
      { id:"e3q9",  prompt: '"It was hard. That said, I\'d do it again."',  options: ["I said it","Despite what I just said","Say it again","That\'s what I said"],   correctIndex: 1, explanation: '"That said" = despite what I just said (introduces contrast)' },
      { id:"e3q10", prompt: '"I was wondering if you could help."',         options: ["I don\'t know","Polite way to ask","I\'m confused","I wonder why"],             correctIndex: 1, explanation: '"I was wondering" = a polite way to ask something' },
    ],
  },
  4: {
    type: "input",
    title: "Exercise 4 — Mixed practice",
    instructions: "Type the correct expression in the right form.",
    questions: [
      { id:"e4q1",  prompt: "— Sorry for the wait! — ___, no rush at all.",              correct: "no worries",        explanation: '"No worries" = it\'s fine / don\'t worry about it' },
      { id:"e4q2",  prompt: "___ — let me find the right page before we continue.",      correct: "hang on",           explanation: '"Hang on" = wait a moment' },
      { id:"e4q3",  prompt: "— Can I start the presentation? — ___, the room is ready.", correct: "go ahead",          explanation: '"Go ahead" = please proceed / feel free' },
      { id:"e4q4",  prompt: "I missed your birthday. ___ — I completely forgot.",        correct: "my bad",            explanation: '"My bad" = my mistake / I\'m sorry' },
      { id:"e4q5",  prompt: "— Shall we reschedule? — ___, that works better anyway.",   correct: "sounds good",       explanation: '"Sounds good" = that\'s agreeable / I like that idea' },
      { id:"e4q6",  prompt: "— I can\'t stay late. — ___, we\'ll finish tomorrow.",      correct: "fair enough",       explanation: '"Fair enough" = I accept that / I understand' },
      { id:"e4q7",  prompt: "It\'s expensive. ___, the quality is absolutely worth it.", correct: "that said",         explanation: '"That said" = despite what I just said' },
      { id:"e4q8",  prompt: "___ if anything changes — I\'ll rearrange my day.",         correct: "let me know",       explanation: '"Let me know" = tell me / inform me' },
      { id:"e4q9",  prompt: "You\'ve been up since 5 am. ___ you\'re falling asleep!",   correct: "no wonder",         explanation: '"No wonder" = it makes perfect sense / not surprising' },
      { id:"e4q10", prompt: "— Is now a good time to talk? — ___, go right ahead.",      correct: "by all means",      explanation: '"By all means" = of course / please go ahead' },
    ],
  },
};

const PDF_CONFIG: LessonPDFConfig = {
  title: "Live Phrases A1-A2",
  subtitle: "Beginner & Elementary Expressions — 4 exercises + answer key",
  level: "A1-A2",
  keyRule: "sounds good · no worries · go ahead · fair enough · bear with me · by all means · my bad · hang on · cheers · that said",
  exercises: [
    {
      number: 1,
      title: "Exercise 1",
      difficulty: "Easy",
      instruction: "Fill in with the correct expression.",
      questions: [
        "___, we haven\'t started — no rush.",
        "Can I ask something? — ___, go ahead.",
        "Meet at 4? — ___, see you then!",
        "___ — let me pull up that file.",
        "Deadline on Monday. — ___, I\'ll adjust.",
        "Can\'t make Thursday. — ___, reschedule.",
        "___ — I sent the wrong version.",
        "Long commute. ___, great location.",
        "No sleep for 36 hours. ___ you\'re tired!",
        "Thank you so much! — ___!",
      ],
    },
    {
      number: 2,
      title: "Exercise 2",
      difficulty: "Medium",
      instruction: "Write the expression. Use the hint.",
      questions: [
        "___ — it\'s fine (2 words)",
        "___ — please proceed (2 words)",
        "___ — agreeable (2 words)",
        "___ — be patient (3 words)",
        "___ — of course (3 words)",
        "___ — my mistake (2 words)",
        "___ — wait (2 words)",
        "___ — despite this (2 words)",
        "___ — not surprising (2 words)",
        "___ — tell me (3 words)",
      ],
    },
    {
      number: 3,
      title: "Exercise 3",
      difficulty: "Medium",
      instruction: "Write the meaning of each expression.",
      questions: [
        "sounds good = __________",
        "no worries = ___________",
        "go ahead = _____________",
        "fair enough = __________",
        "bear with me = _________",
        "by all means = _________",
        "my bad = _______________",
        "hang on = ______________",
        "that said = ____________",
        "no wonder = ____________",
      ],
    },
    {
      number: 4,
      title: "Exercise 4",
      difficulty: "Hard",
      instruction: "Complete with the correct expression.",
      questions: [
        "___ — totally fine, no rush.",
        "___ — wait just a second.",
        "Can I start? — ___, ready.",
        "Missed your birthday. ___.",
        "Reschedule? — ___, works better.",
        "Can\'t stay late. — ___.",
        "Pricey. ___, worth every penny.",
        "___ if the plan changes.",
        "Up since 5 am. ___ exhausted!",
        "Good time to talk? — ___, go.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Easy — fill in the blank", answers: ["No worries","By all means","Sounds good","Hang on","I see","Fair enough","My bad","That said","No wonder","Cheers"] },
    { exercise: 2, subtitle: "Medium — write the expression", answers: ["No worries","Go ahead","Sounds good","Bear with me","By all means","My bad","Hang on","That said","No wonder","Let me know"] },
    { exercise: 3, subtitle: "Medium — write the meaning", answers: ["that's agreeable","it's fine / don't worry","please proceed","I accept that","please be patient","of course / go ahead","my mistake","wait a moment","despite what I said","it makes perfect sense"] },
    { exercise: 4, subtitle: "Hard — mixed practice", answers: ["No worries","Hang on","Go ahead","My bad","Sounds good","Fair enough","That said","Let me know","No wonder","By all means"] },
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

export default function LivePhrasesA1Client({ isPro }: { isPro: boolean }) {
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
          {[["Home", "/"], ["Nerd Zone", "/nerd-zone"]].map(([label, href]) => (
            <span key={href} className="flex items-center gap-1.5">
              <a href={href} className="hover:text-slate-700 transition">{label}</a>
              <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          ))}
          <span className="text-slate-700 font-medium">Live Phrases · A1-A2</span>
        </nav>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-[11px] font-black text-emerald-700">Live Phrases</span>
            <span className="rounded-full bg-[#F5DA20] px-3 py-0.5 text-[11px] font-black text-black">A1-A2</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Beginner</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            Live{" "}
            <span className="relative inline-block">
              Phrases
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            24 essential A1-A2 expressions that native speakers use every day — in shops, offices, and casual conversations. Start here.
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
            <DownloadWorksheet isPro={isPro} level="A1-A2" title="Live Phrases" wordBank={WORD_BANK} exercises={EXERCISES_WS} filename="LivePhrases_A1A2_Worksheet_EnglishNerd.pdf" />
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
            {visiblePhrases.flatMap(({ phrase, meaning, example }, i) => {
              const row = (
                <div key={phrase} className={`group grid grid-cols-[1fr_1fr_1.5fr] gap-0 border-b border-slate-50 transition-colors hover:bg-[#F5DA20]/8 last:border-0 ${i % 2 === 1 ? "bg-slate-50/40" : "bg-white"}`}>
                  <div className="flex items-center px-5 py-3.5"><span className="text-sm font-black text-slate-900">{phrase}</span></div>
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
              {showAll ? (<><svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 15l7-7 7 7"/></svg>Collapse</>) : (<><svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 9l-7 7-7-7"/></svg>Show all 24 expressions</>)}
            </button>
          </div>
        </div>

        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">Start using these phrases in everyday conversation this week. Native speakers use them constantly — even 2–3 of these will immediately make your English sound more natural.</p>
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
            <SpeedRound questions={SPEED_QUESTIONS} gameId="live-phrases-a1" />
          </div>
        </div>

        <div className="mt-14 border-t border-slate-100 pt-6 flex items-center justify-between">
          <a href="/nerd-zone" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Back to Nerd Zone
          </a>
          <a href="/nerd-zone/live-phrases/b1" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">Next: B1</a>
        </div>
      </div>
    </div>
  );
}
