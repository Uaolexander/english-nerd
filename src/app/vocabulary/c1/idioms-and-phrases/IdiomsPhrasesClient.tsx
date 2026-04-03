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
  { id: 1, question: "What does 'bite the bullet' mean?", options: ["To shoot someone", "To endure a painful situation bravely", "To eat quickly", "To refuse to act"], correct: 1, explanation: "'Bite the bullet' means to endure something painful or difficult without complaining. It originates from soldiers biting bullets during surgery before anaesthesia existed." },
  { id: 2, question: "What does 'beat around the bush' mean?", options: ["To hit plants", "To avoid getting to the main point", "To win easily", "To walk in the park"], correct: 1, explanation: "'Beat around the bush' means to avoid speaking directly about a difficult or awkward subject. It comes from hunting, where beaters would circle bushes to drive out birds." },
  { id: 3, question: "What does 'let the cat out of the bag' mean?", options: ["To release a pet", "To accidentally reveal a secret", "To start a fight", "To make a discovery"], correct: 1, explanation: "'Let the cat out of the bag' means to accidentally reveal a secret. It may originate from a market scam involving a bag that was supposed to contain a pig." },
  { id: 4, question: "What does 'burn the midnight oil' mean?", options: ["To set fire to something", "To waste energy", "To work very late into the night", "To cook a lot"], correct: 2, explanation: "'Burn the midnight oil' means to work very late at night. Before electricity, people burned oil lamps to read or work after dark." },
  { id: 5, question: "What does 'hit the nail on the head' mean?", options: ["To do DIY work", "To say exactly the right thing", "To be very lucky", "To miss an opportunity"], correct: 1, explanation: "'Hit the nail on the head' means to describe exactly what is causing a situation or problem — to be precisely correct." },
  { id: 6, question: "What does 'spill the beans' mean?", options: ["To cook badly", "To make a mess", "To reveal secret information", "To start an argument"], correct: 2, explanation: "'Spill the beans' means to reveal information that was meant to be kept secret, often accidentally or prematurely." },
  { id: 7, question: "What does 'on the fence' mean?", options: ["Standing on something", "Being undecided or neutral", "Being very enthusiastic", "Working outdoors"], correct: 1, explanation: "'On the fence' means to be undecided or neutral about an issue, without committing to either side of an argument." },
  { id: 8, question: "What does 'pull someone's leg' mean?", options: ["To injure someone", "To help someone walk", "To joke with or tease someone", "To support someone"], correct: 2, explanation: "'Pull someone's leg' means to joke with or tease them, usually by telling them something that isn't true for fun." },
  { id: 9, question: "What does 'cost an arm and a leg' mean?", options: ["To cause injury", "To be very expensive", "To be very cheap", "To require much effort"], correct: 1, explanation: "'Cost an arm and a leg' means to be extremely expensive. It exaggerates the high price by suggesting you'd have to sacrifice body parts to pay for it." },
  { id: 10, question: "What does 'the ball is in your court' mean?", options: ["Playing tennis", "It is now your responsibility to take action", "A sports result", "A legal term"], correct: 1, explanation: "'The ball is in your court' means it is now the other person's turn to take action or make a decision. It is borrowed from tennis." },
];

// ── Exercise 2: Choose the correct phrase ────────────────────────────────────

type ChoiceQ = {
  id: number;
  before: string;
  after: string;
  options: string[];
  correct: string;
  explanation: string;
};

const EX2: ChoiceQ[] = [
  { id: 1, before: "She didn't want to discuss the problem directly, so she kept", after: "instead of saying what she meant.", options: ["beating around the bush", "hitting the nail on the head", "burning bridges"], correct: "beating around the bush", explanation: "'Beating around the bush' means avoiding the main point, which fits the context of someone not speaking directly about a problem." },
  { id: 2, before: "The operation was painful, but she decided to", after: "and get it done.", options: ["bite the bullet", "let the cat out", "pull her leg"], correct: "bite the bullet", explanation: "'Bite the bullet' fits here because she is enduring something painful and difficult without backing down." },
  { id: 3, before: "He accidentally", after: "about the surprise party before we could tell her.", options: ["let the cat out of the bag", "bit the bullet", "beat around the bush"], correct: "let the cat out of the bag", explanation: "'Let the cat out of the bag' means to accidentally reveal a secret — exactly what happened with the surprise party." },
  { id: 4, before: "She was", after: "about whether to accept the job offer or not.", options: ["on the fence", "in the dark", "ahead of the game"], correct: "on the fence", explanation: "'On the fence' describes being undecided — she hadn't committed to accepting or declining the job." },
  { id: 5, before: "You really", after: "when you said the real issue was communication.", options: ["hit the nail on the head", "beat around the bush", "spilled the beans"], correct: "hit the nail on the head", explanation: "'Hit the nail on the head' means to identify the precise cause of a problem, which is what happened here." },
  { id: 6, before: "That new car", after: "— I can't afford it on my salary.", options: ["costs an arm and a leg", "is on the fence", "burns midnight oil"], correct: "costs an arm and a leg", explanation: "'Costs an arm and a leg' means it is extremely expensive, which explains why the speaker cannot afford it." },
  { id: 7, before: "Don't worry — I was only", after: "when I said your presentation was terrible!", options: ["pulling your leg", "biting the bullet", "burning bridges"], correct: "pulling your leg", explanation: "'Pulling your leg' means joking or teasing someone — the speaker didn't really mean the presentation was terrible." },
  { id: 8, before: "The decision is yours. The", after: "— we're waiting for your answer.", options: ["ball is in your court", "cat is out of the bag", "nail is on the head"], correct: "ball is in your court", explanation: "'The ball is in your court' means it is now the other person's responsibility to act or decide." },
  { id: 9, before: "Someone", after: "about the merger before the official announcement.", options: ["spilled the beans", "beat around the bush", "bit the bullet"], correct: "spilled the beans", explanation: "'Spilled the beans' means to reveal confidential information before the appropriate time — fitting for a leaked announcement." },
  { id: 10, before: "He", after: "to finish the report, working until 3am.", options: ["burned the midnight oil", "spilled the beans", "let the cat out"], correct: "burned the midnight oil", explanation: "'Burned the midnight oil' describes working very late into the night, which matches working until 3am." },
];

// ── Exercise 3: Fill from the box ────────────────────────────────────────────

const WORD_BOX = ["bite the bullet", "on the fence", "pull someone's leg", "burn the midnight oil", "spill the beans", "cost an arm and a leg", "beat around the bush", "hit the nail on the head", "let the cat out of the bag", "ball is in your court"];

type FillQ = {
  id: number;
  before: string;
  after: string;
  correct: string;
  explanation: string;
};

const EX3: FillQ[] = [
  { id: 1, before: "Stop trying to", after: "! Tell me exactly what happened.", correct: "beat around the bush", explanation: "'Beat around the bush' means to avoid getting to the point — the speaker wants directness." },
  { id: 2, before: "He decided to", after: "and have the difficult conversation.", correct: "bite the bullet", explanation: "'Bite the bullet' means to do something difficult without complaining — facing the conversation head-on." },
  { id: 3, before: "She accidentally", after: "before we could announce the news officially.", correct: "let the cat out of the bag", explanation: "'Let the cat out of the bag' means to reveal a secret prematurely, which is what happened before the announcement." },
  { id: 4, before: "You", after: "— that was exactly the right thing to say.", correct: "hit the nail on the head", explanation: "'Hit the nail on the head' means to say exactly the right thing or identify the precise issue." },
  { id: 5, before: "I was studying all night — I had to", after: "to finish my thesis.", correct: "burn the midnight oil", explanation: "'Burn the midnight oil' means to work very late into the night, which describes studying all night." },
  { id: 6, before: "Don't be", after: "— make a decision one way or the other!", correct: "on the fence", explanation: "'On the fence' means undecided — the speaker is urging a commitment to one position." },
  { id: 7, before: "The renovation", after: "— we spent over £50,000.", correct: "cost an arm and a leg", explanation: "'Cost an arm and a leg' means to be extremely expensive, which is reinforced by the £50,000 figure." },
  { id: 8, before: "She was only", after: "when she said the meeting was cancelled.", correct: "pull someone's leg", explanation: "'Pull someone's leg' means to joke or tease — the meeting wasn't actually cancelled." },
  { id: 9, before: "Please don't", after: "about the surprise — keep it secret!", correct: "spill the beans", explanation: "'Spill the beans' means to reveal a secret, so the speaker is asking for confidentiality about the surprise." },
  { id: 10, before: "We've given you all the information. The", after: "— let us know what you decide.", correct: "ball is in your court", explanation: "'The ball is in your court' means it is now the other person's responsibility to act or decide." },
];

// ── Vocabulary sidebar ────────────────────────────────────────────────────────

const VOCAB = [
  { word: "idiom", pos: "n.", def: "a phrase whose meaning is different from the individual words" },
  { word: "bite the bullet", pos: "phr.", def: "to endure a difficult situation with courage" },
  { word: "on the fence", pos: "phr.", def: "undecided or neutral about something" },
  { word: "spill the beans", pos: "phr.", def: "to reveal secret information" },
  { word: "cost an arm and a leg", pos: "phr.", def: "to be very expensive" },
];

const LABELS = ["A", "B", "C", "D"];

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function IdiomsPhrasesClient() {
  const [exNo, setExNo] = useState<1 | 2 | 3>(1);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [fillAnswers, setFillAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const questions = exNo === 1 ? EX1 : exNo === 2 ? EX2 : EX3;
  const total = questions.length;

  const answeredCount = exNo === 3
    ? EX3.filter((q) => (fillAnswers[q.id] ?? "").trim() !== "").length
    : questions.filter((q) => answers[q.id] != null).length;

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
      body: JSON.stringify({ category: "vocabulary", level: "c1", slug: "idioms-and-phrases", exerciseNo: exNo, score: percent, questionsTotal: total }),
    }).catch(() => {});
  }, [checked, percent]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        {[["Home", "/"], ["Vocabulary", "/vocabulary"], ["C1", "/vocabulary/c1"]].map(([label, href]) => (
          <span key={href} className="flex items-center gap-1.5">
            <a href={href} className="hover:text-slate-700 transition">{label}</a>
            <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </span>
        ))}
        <span className="text-slate-700 font-medium">Idioms & Phrases</span>
      </nav>

      {/* Hero */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="rounded-full bg-sky-400 px-3 py-0.5 text-[11px] font-black text-black">C1</span>
          <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Vocabulary</span>
          <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">3 exercises · 10 questions each</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.05]">
          <span className="relative inline-block">
            Idioms & Phrases
            <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/60" />
          </span>
        </h1>
        <p className="mt-3 max-w-xl text-[15px] text-slate-500 leading-relaxed">
          Master advanced English idioms with three different activities. Each exercise reinforces the same phrases — so the more you practise, the more natural they feel!
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
                  {exNo === 1 && "Multiple Choice — What does the idiom mean?"}
                  {exNo === 2 && "Choose the Phrase — Select the correct idiom for each sentence"}
                  {exNo === 3 && "Fill in the Blanks — Use the idioms from the box"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {exNo === 1 && "Read each question and choose one answer from four options."}
                  {exNo === 2 && "Read each sentence and choose the idiom that fits best."}
                  {exNo === 3 && "Use each idiom from the box once. Read the sentences carefully."}
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
                <p className="mb-3 text-xs font-black text-slate-500 uppercase tracking-wide">Idioms to use:</p>
                <div className="flex flex-wrap gap-2">
                  {WORD_BOX.map((w) => {
                    const used = Object.values(fillAnswers).some((v) => normalize(v) === normalize(w));
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
                    {grade === "great" ? "Excellent! You have a strong command of English idioms!" :
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

              {/* ── Exercise 2: Choose the phrase ── */}
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
                            className={`inline-block w-48 rounded-lg border px-3 py-0.5 text-center text-sm font-bold outline-none transition-all ${
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
            <a href="/vocabulary/c1" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
              All C1 Exercises
            </a>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
              <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                <p className="text-xs font-black text-slate-700 uppercase tracking-wide">Key Vocabulary</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Idioms in this exercise</p>
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

            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-4">
              <p className="text-xs font-black text-sky-700 uppercase tracking-wide mb-2">C1 Tip</p>
              <p className="text-xs text-sky-800/70 leading-relaxed">
                Idioms cannot be translated word-for-word. Learn them as <span className="font-semibold text-sky-800">fixed chunks</span> with their meaning and typical context. Notice how native speakers use them in conversation.
              </p>
            </div>

            <AdUnit variant="inline-light" />
          </div>
        </aside>

      </div>
    </div>
  );
}
