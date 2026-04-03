"use client";

import { useState, useEffect } from "react";
import AdUnit from "@/components/AdUnit";

// ── Exercise 1: ABCD Multiple Choice ────────────────────────────────────────

type MCQ = {
  id: number;
  question: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  explanation: string;
};

const EX1: MCQ[] = [
  { id: 1,  question: "What do you use to see?",                            options: ["Eyes",       "Ears",      "Mouth",      "Nose"],       correct: 0, explanation: "You use your eyes to see. Ears are for hearing, nose is for smelling, and mouth is for eating and speaking." },
  { id: 2,  question: "What do you use to hear?",                           options: ["Eyes",       "Ears",      "Nose",       "Mouth"],      correct: 1, explanation: "You use your ears to hear sounds and music. Your eyes are for seeing." },
  { id: 3,  question: "How many fingers do most people have?",              options: ["Five",       "Eight",     "Ten",        "Twelve"],     correct: 2, explanation: "Most people have ten fingers — five on each hand." },
  { id: 4,  question: "Which part of the body do you use to walk?",         options: ["Arms",       "Hands",     "Legs",       "Shoulders"],  correct: 2, explanation: "You use your legs and feet to walk. Arms help you carry and hold things." },
  { id: 5,  question: "What is at the very top of your body?",              options: ["Foot",       "Stomach",   "Head",       "Knee"],       correct: 2, explanation: "Your head is at the top of your body. It has your brain, eyes, ears, nose, and mouth." },
  { id: 6,  question: "What do you use to smell flowers?",                  options: ["Ears",       "Nose",      "Mouth",      "Eyes"],       correct: 1, explanation: "You use your nose to smell. It is in the centre of your face." },
  { id: 7,  question: "What do you use to eat and speak?",                  options: ["Nose",       "Ear",       "Mouth",      "Eye"],        correct: 2, explanation: "You use your mouth to eat food and to speak. Teeth and a tongue are inside your mouth." },
  { id: 8,  question: "How many legs does a person have?",                  options: ["One",        "Two",       "Three",      "Four"],       correct: 1, explanation: "People have two legs. We use them to walk, run, and jump." },
  { id: 9,  question: "Which part connects your head to your chest?",       options: ["Knee",       "Shoulder",  "Neck",       "Elbow"],      correct: 2, explanation: "Your neck connects your head to your body. You can turn your neck left and right." },
  { id: 10, question: "Where are your teeth?",                              options: ["In your ear","In your mouth","In your eye","In your nose"], correct: 1, explanation: "Teeth are in your mouth. You use them to eat and chew food." },
];

// ── Exercise 2: Choose the correct word ─────────────────────────────────────

type ChoiceQ = {
  id: number;
  before: string;
  after: string;
  options: string[];
  correct: string;
  explanation: string;
};

const EX2: ChoiceQ[] = [
  { id: 1,  before: "I write with my right",      after: ". I use a pen every day at school.",           options: ["hand",     "foot",     "ear"],       correct: "hand",     explanation: "You write with your hand. The foot is used for walking and the ear is for hearing." },
  { id: 2,  before: "My feet are cold. I need to put on my", after: ".",                                  options: ["socks",    "hat",      "gloves"],     correct: "socks",    explanation: "Socks go on your feet to keep them warm. A hat is for your head and gloves are for your hands." },
  { id: 3,  before: "She has long brown",          after: ". It looks very beautiful.",                   options: ["hair",     "nose",     "arm"],        correct: "hair",     explanation: "Hair grows on your head. The nose is for smelling and an arm connects your hand to your shoulder." },
  { id: 4,  before: "I can hear music with my",    after: ". I love listening to songs.",                 options: ["ears",     "mouth",    "fingers"],    correct: "ears",     explanation: "Ears are the parts of the body you use to hear. Fingers are for touching and the mouth is for eating." },
  { id: 5,  before: "I kicked the ball with my",   after: ". It went into the goal!",                    options: ["foot",     "hand",     "nose"],       correct: "foot",     explanation: "You kick with your foot. Hands are used to throw and the nose is for smelling." },
  { id: 6,  before: "The doctor looked into my",   after: "to check my teeth.",                          options: ["mouth",    "ear",      "knee"],       correct: "mouth",    explanation: "The doctor opens your mouth to look at your teeth and throat." },
  { id: 7,  before: "I hurt my",                   after: ". Now I cannot bend my leg.",                 options: ["knee",     "shoulder", "elbow"],      correct: "knee",     explanation: "The knee is the joint in the middle of your leg. If it hurts, bending the leg is difficult." },
  { id: 8,  before: "She smiled and showed her white", after: ". They look very clean.",                 options: ["teeth",    "eyes",     "hair"],       correct: "teeth",    explanation: "Teeth are in your mouth. White teeth are a sign of good health." },
  { id: 9,  before: "I carry my heavy school bag on my", after: ".",                                     options: ["back",     "stomach",  "nose"],       correct: "back",     explanation: "You carry heavy things on your back. The stomach is the front of your body and the nose is on your face." },
  { id: 10, before: "He raised his",               after: "to ask a question in class.",                 options: ["arm",      "foot",     "neck"],       correct: "arm",      explanation: "You raise your arm when you want to speak or answer a question. Feet are for walking." },
];

// ── Exercise 3: Fill from the box ───────────────────────────────────────────

const WORD_BOX = ["head", "eyes", "ears", "nose", "mouth", "arms", "legs", "hands", "fingers", "back"];

type FillQ = {
  id: number;
  before: string;
  after: string;
  correct: string;
  explanation: string;
};

const EX3: FillQ[] = [
  { id: 1,  before: "You wear a hat on your",      after: "to protect it from the sun.",           correct: "head",    explanation: "Your head is the top part of your body. A hat sits on your head." },
  { id: 2,  before: "You use your",                after: "to see the world around you.",          correct: "eyes",    explanation: "Eyes are used for seeing. We have two eyes." },
  { id: 3,  before: "You listen to music with your", after: ". They are on both sides of your head.", correct: "ears",  explanation: "Ears are used for hearing. We have two ears, one on each side of our head." },
  { id: 4,  before: "You use your",                after: "to smell food, flowers, and perfume.",  correct: "nose",    explanation: "The nose is used for smelling. It is in the middle of your face." },
  { id: 5,  before: "You use your",                after: "to eat, speak, and sing.",              correct: "mouth",   explanation: "The mouth is used for eating and speaking. Teeth and a tongue are inside." },
  { id: 6,  before: "You hug someone with your",   after: ". They are long and strong.",           correct: "arms",    explanation: "Arms are used to hug, carry, and reach for things. We have two arms." },
  { id: 7,  before: "You use your",                after: "to walk, run, and kick a ball.",        correct: "legs",    explanation: "Legs are used for movement. We have two legs." },
  { id: 8,  before: "You clap with your",          after: ". Each one has five fingers.",          correct: "hands",   explanation: "Hands are used for clapping, writing, and holding things. We have two hands." },
  { id: 9,  before: "You type on a keyboard with your", after: ". You have ten of them.",          correct: "fingers", explanation: "Fingers are used for typing, picking up small objects, and pointing." },
  { id: 10, before: "You carry a heavy bag on your", after: ". It can hurt if the bag is too heavy.", correct: "back", explanation: "The back is the rear part of your body. Carrying heavy things on your back can cause pain." },
];

// ── Vocabulary sidebar ───────────────────────────────────────────────────────

const VOCAB = [
  { word: "knee",     pos: "n.", def: "the joint in the middle of your leg" },
  { word: "neck",     pos: "n.", def: "the part of the body between the head and shoulders" },
  { word: "shoulder", pos: "n.", def: "the joint where the arm connects to the body" },
  { word: "elbow",    pos: "n.", def: "the joint in the middle of your arm" },
  { word: "stomach",  pos: "n.", def: "the part of the body below your chest; where food goes" },
  { word: "heel",     pos: "n.", def: "the round back part of your foot" },
];

const LABELS = ["A", "B", "C", "D"];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function MyBodyClient() {
  const [exNo, setExNo] = useState<1 | 2 | 3>(1);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [fillAnswers, setFillAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const questions = exNo === 1 ? EX1 : exNo === 2 ? EX2 : EX3;
  const total = questions.length;

  const answeredCount = exNo === 3
    ? EX3.filter((q) => (fillAnswers[q.id] ?? "").trim() !== "").length
    : EX1.filter((q) => answers[q.id] != null).length;

  const allAnswered = answeredCount === total;

  const correctCount = checked
    ? exNo === 1
      ? EX1.reduce((n, q) => n + (answers[q.id] === String(q.correct) ? 1 : 0), 0)
      : exNo === 2
      ? EX2.reduce((n, q) => n + (answers[q.id] === q.correct ? 1 : 0), 0)
      : EX3.reduce((n, q) => n + (normalize(fillAnswers[q.id] ?? "") === normalize(q.correct) ? 1 : 0), 0)
    : null;

  const percent = correctCount !== null ? Math.round((correctCount / total) * 100) : null;
  const grade = percent === null ? null : percent >= 80 ? "great" : percent >= 60 ? "ok" : "low";

  function switchEx(n: 1 | 2 | 3) {
    setExNo(n);
    setAnswers({});
    setFillAnswers({});
    setChecked(false);
  }

  function check() {
    if (!allAnswered) return;
    setChecked(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setAnswers({});
    setFillAnswers({});
    setChecked(false);
  }

  useEffect(() => {
    if (!checked || percent === null) return;
    fetch("/api/progress/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "vocabulary", level: "a1", slug: "my-body", exerciseNo: exNo, score: percent, questionsTotal: total }),
    }).catch(() => {});
  }, [checked, percent]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        {[["Home", "/"], ["Vocabulary", "/vocabulary"], ["A1", "/vocabulary/a1"]].map(([label, href]) => (
          <span key={href} className="flex items-center gap-1.5">
            <a href={href} className="hover:text-slate-700 transition">{label}</a>
            <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </span>
        ))}
        <span className="text-slate-700 font-medium">My Body</span>
      </nav>

      {/* Hero */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="rounded-full bg-[#F5DA20] px-3 py-0.5 text-[11px] font-black text-black">A1</span>
          <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Vocabulary</span>
          <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">3 exercises · 10 questions each</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.05]">
          My{" "}
          <span className="relative inline-block">
            Body
            <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/60" />
          </span>
        </h1>
        <p className="mt-3 max-w-xl text-[15px] text-slate-500 leading-relaxed">
          Learn body part vocabulary with three different activities. Each exercise uses the same words — so the more you practise, the better you remember!
        </p>
      </div>

      {/* 3-col grid */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr_240px]">

        {/* Left ad */}
        <AdUnit variant="sidebar-light" />

        {/* Main */}
        <div className="min-w-0 space-y-5">

          {/* Exercise switcher */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
            <div className="flex items-stretch border-b border-slate-100">
              {([
                { n: 1 as const, label: "Exercise 1", sub: "A B C D" },
                { n: 2 as const, label: "Exercise 2", sub: "Choose" },
                { n: 3 as const, label: "Exercise 3", sub: "Fill in" },
              ]).map(({ n, label, sub }) => (
                <button
                  key={n}
                  onClick={() => switchEx(n)}
                  className={`flex flex-1 flex-col items-center gap-0.5 px-4 py-3.5 text-sm transition border-r last:border-r-0 border-slate-100 ${
                    exNo === n
                      ? "bg-[#F5DA20]/15 font-black text-slate-900 border-b-2 border-b-[#F5DA20]"
                      : "font-semibold text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                  }`}
                >
                  <span>{label}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${exNo === n ? "text-slate-600" : "text-slate-300"}`}>{sub}</span>
                </button>
              ))}
            </div>

            {/* Header */}
            <div className="flex items-center justify-between bg-slate-50/80 px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-[15px] font-black text-slate-900">
                  {exNo === 1 && "Multiple Choice — Choose the correct answer (A, B, C or D)"}
                  {exNo === 2 && "Choose the Word — Select the best option for each gap"}
                  {exNo === 3 && "Fill in the Blanks — Use the words from the box"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {exNo === 1 && "Read each question and choose one answer from four options."}
                  {exNo === 2 && "Read each sentence and choose the word that fits best."}
                  {exNo === 3 && "Use each word from the box once. Read the sentences carefully."}
                </p>
              </div>
              {!checked ? (
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="h-1.5 w-24 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full bg-[#F5DA20] transition-all duration-300" style={{ width: `${(answeredCount / total) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 tabular-nums">{answeredCount}/{total}</span>
                </div>
              ) : (
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black border ${
                  grade === "great" ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                  grade === "ok"   ? "border-amber-200 bg-amber-50 text-amber-700" :
                                     "border-red-200 bg-red-50 text-red-700"
                }`}>{correctCount}/{total}</span>
              )}
            </div>

            {/* Word box for Ex 3 */}
            {exNo === 3 && (
              <div className="border-b border-slate-100 bg-[#F5DA20]/6 px-6 py-4">
                <p className="mb-3 text-xs font-black text-slate-500 uppercase tracking-wide">Words to use:</p>
                <div className="flex flex-wrap gap-2">
                  {WORD_BOX.map((w) => {
                    const used = Object.values(fillAnswers).some((v) => normalize(v) === w);
                    return (
                      <span
                        key={w}
                        className={`rounded-xl border px-4 py-1.5 text-sm font-bold transition ${
                          used
                            ? "border-slate-200 bg-slate-100 text-slate-300 line-through"
                            : "border-[#F5DA20] bg-[#F5DA20]/15 text-slate-800"
                        }`}
                      >
                        {w}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Score panel */}
            {checked && percent !== null && (
              <div className={`flex items-center gap-5 px-6 py-5 border-b border-slate-100 ${
                grade === "great" ? "bg-emerald-50" :
                grade === "ok"   ? "bg-amber-50" :
                                   "bg-red-50"
              }`}>
                <div className={`text-5xl font-black tabular-nums leading-none ${
                  grade === "great" ? "text-emerald-600" :
                  grade === "ok"   ? "text-amber-600" : "text-red-600"
                }`}>{percent}<span className="text-2xl">%</span></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-700">{correctCount} out of {total} correct</div>
                  <div className="mt-2.5 h-2 w-full rounded-full bg-black/8 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${
                      grade === "great" ? "bg-emerald-500" :
                      grade === "ok"   ? "bg-amber-400" : "bg-red-500"
                    }`} style={{ width: `${percent}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {grade === "great" ? "Excellent! Great body vocabulary!" :
                     grade === "ok"   ? "Good effort! Try once more to improve." :
                                        "Keep practising — review the explanations below."}
                  </p>
                </div>
                <div className="text-4xl">{grade === "great" ? "🎉" : grade === "ok" ? "💪" : "📖"}</div>
              </div>
            )}

            {/* Questions */}
            <div className="divide-y divide-slate-50">

              {/* ── Exercise 1: ABCD ── */}
              {exNo === 1 && EX1.map((q, idx) => {
                const chosen = answers[q.id];
                const isCorrect = checked && chosen === String(q.correct);
                const isWrong   = checked && chosen != null && chosen !== String(q.correct);

                return (
                  <div key={q.id} className={`px-6 py-6 transition-colors duration-200 ${isCorrect ? "bg-emerald-50/60" : isWrong ? "bg-red-50/60" : ""}`}>
                    <div className="flex gap-4">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all ${
                        isCorrect ? "bg-emerald-500 text-white" :
                        isWrong   ? "bg-red-500 text-white" :
                        chosen != null ? "bg-[#F5DA20] text-black" :
                        "bg-slate-100 text-slate-400"
                      }`}>
                        {checked
                          ? isCorrect
                            ? <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                            : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                          : String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-semibold text-slate-900 leading-snug mb-4">{q.question}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, oi) => {
                            const sel    = chosen === String(oi);
                            const ok     = checked && sel && oi === q.correct;
                            const bad    = checked && sel && oi !== q.correct;
                            const reveal = checked && !sel && oi === q.correct;
                            return (
                              <button
                                key={oi}
                                onClick={() => { if (!checked) setAnswers((p) => ({ ...p, [q.id]: String(oi) })); }}
                                disabled={checked}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-left transition-all duration-150 ${
                                  ok     ? "bg-emerald-500 text-white shadow-sm" :
                                  bad    ? "bg-red-500 text-white shadow-sm" :
                                  reveal ? "border-2 border-emerald-300 bg-emerald-50 text-emerald-700" :
                                  sel    ? "bg-[#F5DA20] text-black shadow-sm" :
                                  checked ? "border border-slate-100 bg-slate-50 text-slate-300" :
                                  "border border-slate-200 bg-white text-slate-700 hover:border-[#F5DA20] hover:bg-[#F5DA20]/10 active:scale-[0.98]"
                                }`}
                              >
                                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                                  ok     ? "bg-white/20 text-white" :
                                  bad    ? "bg-white/20 text-white" :
                                  reveal ? "bg-emerald-200 text-emerald-700" :
                                  sel    ? "bg-black/10 text-black" :
                                  checked ? "bg-slate-100 text-slate-300" :
                                  "bg-slate-100 text-slate-500"
                                }`}>{LABELS[oi]}</span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {checked && (
                          <div className={`mt-3 rounded-xl px-4 py-3 text-sm leading-relaxed ${
                            isCorrect ? "bg-emerald-50 border border-emerald-100 text-emerald-800" :
                                        "bg-slate-50 border border-slate-100 text-slate-600"
                          }`}>
                            <span className="font-bold">{isCorrect ? "✓ Correct! " : `✗ The answer is ${q.options[q.correct]}. `}</span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* ── Exercise 2: Choose the word ── */}
              {exNo === 2 && EX2.map((q, idx) => {
                const chosen = answers[q.id];
                const isCorrect = checked && chosen === q.correct;
                const isWrong   = checked && chosen != null && chosen !== q.correct;

                return (
                  <div key={q.id} className={`px-6 py-6 transition-colors duration-200 ${isCorrect ? "bg-emerald-50/60" : isWrong ? "bg-red-50/60" : ""}`}>
                    <div className="flex gap-4">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all ${
                        isCorrect ? "bg-emerald-500 text-white" :
                        isWrong   ? "bg-red-500 text-white" :
                        chosen != null ? "bg-[#F5DA20] text-black" :
                        "bg-slate-100 text-slate-400"
                      }`}>
                        {checked
                          ? isCorrect
                            ? <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                            : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                          : String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] text-slate-800 leading-relaxed font-medium">
                          {q.before}{" "}
                          <span className={`inline-block min-w-[90px] rounded-lg px-3 py-0.5 text-center font-black transition-all ${
                            isCorrect ? "bg-emerald-100 text-emerald-700" :
                            isWrong   ? "bg-red-100 text-red-600 line-through" :
                            chosen    ? "bg-[#F5DA20]/30 text-slate-800" :
                            "border-2 border-dashed border-slate-200 text-slate-300"
                          }`}>{chosen ?? "???"}</span>
                          {" "}{q.after}
                        </p>
                        {isWrong && (
                          <p className="mt-1 text-sm font-semibold text-emerald-600">✓ Correct answer: <span className="font-black">{q.correct}</span></p>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {q.options.map((opt) => {
                            const sel    = chosen === opt;
                            const ok     = checked && sel && opt === q.correct;
                            const bad    = checked && sel && opt !== q.correct;
                            const reveal = checked && !sel && opt === q.correct;
                            return (
                              <button
                                key={opt}
                                onClick={() => { if (!checked) setAnswers((p) => ({ ...p, [q.id]: opt })); }}
                                disabled={checked}
                                className={`rounded-xl px-5 py-2 text-sm font-bold transition-all duration-150 ${
                                  ok     ? "bg-emerald-500 text-white shadow-sm" :
                                  bad    ? "bg-red-500 text-white shadow-sm" :
                                  reveal ? "border-2 border-emerald-300 bg-emerald-50 text-emerald-700" :
                                  sel    ? "bg-[#F5DA20] text-black shadow-sm" :
                                  checked ? "border border-slate-100 bg-slate-50 text-slate-300" :
                                  "border border-slate-200 bg-white text-slate-700 hover:border-[#F5DA20] hover:bg-[#F5DA20]/10 active:scale-95"
                                }`}
                              >{opt}</button>
                            );
                          })}
                        </div>
                        {checked && (
                          <div className={`mt-3 rounded-xl px-4 py-3 text-sm leading-relaxed ${
                            isCorrect ? "bg-emerald-50 border border-emerald-100 text-emerald-800" :
                                        "bg-slate-50 border border-slate-100 text-slate-600"
                          }`}>
                            <span className="font-bold">{isCorrect ? "✓ Correct! " : "Explanation: "}</span>{q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* ── Exercise 3: Fill in the blanks ── */}
              {exNo === 3 && EX3.map((q, idx) => {
                const val = fillAnswers[q.id] ?? "";
                const isCorrect = checked && normalize(val) === normalize(q.correct);
                const isWrong   = checked && val.trim() !== "" && !isCorrect;
                const noAnswer  = checked && val.trim() === "";

                return (
                  <div key={q.id} className={`px-6 py-6 transition-colors duration-200 ${isCorrect ? "bg-emerald-50/60" : (isWrong || noAnswer) ? "bg-red-50/60" : ""}`}>
                    <div className="flex gap-4">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all ${
                        isCorrect   ? "bg-emerald-500 text-white" :
                        isWrong || noAnswer ? "bg-red-500 text-white" :
                        val.trim()  ? "bg-[#F5DA20] text-black" :
                        "bg-slate-100 text-slate-400"
                      }`}>
                        {checked
                          ? isCorrect
                            ? <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                            : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                          : String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] text-slate-800 leading-relaxed font-medium">
                          {q.before}{" "}
                          <input
                            type="text"
                            value={val}
                            disabled={checked}
                            onChange={(e) => setFillAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                            placeholder="________"
                            className={`inline-block w-32 rounded-lg border px-3 py-0.5 text-center text-sm font-bold outline-none transition-all ${
                              isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-700" :
                              isWrong   ? "border-red-300 bg-red-50 text-red-600 line-through" :
                              noAnswer  ? "border-red-200 bg-red-50" :
                              val.trim() ? "border-[#F5DA20] bg-[#F5DA20]/15 text-slate-900 focus:ring-2 focus:ring-[#F5DA20]/30" :
                              "border-slate-200 bg-white text-slate-900 focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/20"
                            }`}
                          />{" "}
                          {q.after}
                        </p>
                        {checked && (
                          <div className={`mt-3 rounded-xl px-4 py-3 text-sm leading-relaxed ${
                            isCorrect ? "bg-emerald-50 border border-emerald-100 text-emerald-800" :
                                        "bg-slate-50 border border-slate-100 text-slate-600"
                          }`}>
                            <span className="font-bold">
                              {isCorrect ? "✓ Correct! " : `✗ The answer is "${q.correct}". `}
                            </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
              {!checked ? (
                <>
                  <button
                    onClick={check}
                    disabled={!allAnswered}
                    className="rounded-xl bg-[#F5DA20] px-6 py-2.5 text-sm font-black text-black transition hover:opacity-90 shadow-sm disabled:opacity-35 disabled:cursor-not-allowed"
                  >
                    Check Answers
                  </button>
                  {exNo === 3 && (
                    <button
                      onClick={() => {
                        const all: Record<number, string> = {};
                        EX3.forEach((q) => { all[q.id] = q.correct; });
                        setFillAnswers(all);
                        setChecked(true);
                      }}
                      className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition underline underline-offset-2"
                    >
                      Show Answers
                    </button>
                  )}
                  {!allAnswered && exNo !== 3 && (
                    <span className="text-xs text-slate-400">{total - answeredCount} question{total - answeredCount !== 1 ? "s" : ""} remaining</span>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={reset} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
                    Try Again
                  </button>
                  {exNo < 3 && (
                    <button onClick={() => switchEx((exNo + 1) as 2 | 3)} className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition">
                      Next Exercise →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom nav */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <a href="/vocabulary/a1" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
              All A1 Exercises
            </a>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
              <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                <p className="text-xs font-black text-slate-700 uppercase tracking-wide">Key Vocabulary</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Body words to know</p>
              </div>
              <div className="px-4 py-3 space-y-4">
                {VOCAB.map(({ word, pos, def }) => (
                  <div key={word}>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-black text-[#b8a200]">{word}</span>
                      <span className="text-[10px] text-slate-300 font-semibold italic">{pos}</span>
                    </div>
                    <p className="mt-0.5 text-[12px] text-slate-500 leading-snug">{def}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-yellow-100 bg-yellow-50 px-4 py-4">
              <p className="text-xs font-black text-yellow-700 uppercase tracking-wide mb-2">A1 Tip</p>
              <p className="text-xs text-yellow-800/70 leading-relaxed">
                Body words are essential vocabulary. Try to say them out loud while pointing to each part — this helps you remember them much faster!
              </p>
            </div>

            <AdUnit variant="inline-light" />
          </div>
        </aside>

      </div>
    </div>
  );
}
