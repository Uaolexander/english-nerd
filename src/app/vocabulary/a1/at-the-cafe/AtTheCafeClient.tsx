"use client";

import { useState, useEffect } from "react";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import VocabRecommendations from "@/components/VocabRecommendations";
import { useLiveSync } from "@/lib/useLiveSync";

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "Where do you look to choose food at a café?", options: ["bill", "menu", "seat", "bag"], answer: 1 },
  { q: "What is the first meal of the day?", options: ["lunch", "dinner", "breakfast", "snack"], answer: 2 },
  { q: "What do you ask for when you want to pay?", options: ["menu", "bag", "bill", "juice"], answer: 2 },
  { q: "A hot drink made from beans:", options: ["tea", "coffee", "juice", "milk"], answer: 1 },
  { q: "Two pieces of bread with filling inside:", options: ["cake", "salad", "sandwich", "soup"], answer: 2 },
  { q: "A white liquid you add to coffee:", options: ["water", "milk", "juice", "sugar"], answer: 1 },
  { q: "A cold drink made from fruit:", options: ["coffee", "tea", "milk", "juice"], answer: 3 },
  { q: "Euros are a type of ___.", options: ["food", "money", "drink", "bag"], answer: 1 },
  { q: "You put food in a ___ to take it away.", options: ["bag", "cup", "plate", "box"], answer: 0 },
  { q: "Coffee that needs to cool down is very ___.", options: ["cold", "sweet", "hot", "long"], answer: 2 },
  { q: "Orange is a type of ___.", options: ["coffee", "juice", "milk", "tea"], answer: 1 },
  { q: "Apple ___ is a popular drink.", options: ["milk", "sandwich", "juice", "coffee"], answer: 2 },
  { q: "What does a waiter give you at the start?", options: ["bill", "bag", "menu", "coffee"], answer: 2 },
  { q: "Pedro wants something ___ to drink.", options: ["cold", "hot", "sweet", "big"], answer: 1 },
  { q: "You ___ ten euros for your food.", options: ["bring", "pay", "cook", "ask"], answer: 1 },
  { q: "Maria orders a sandwich with ___.", options: ["milk", "cheese", "honey", "juice"], answer: 1 },
  { q: "At a café, you ___ breakfast.", options: ["do", "make", "have", "cook"], answer: 2 },
  { q: "Fresh orange ___ is a drink.", options: ["cake", "juice", "coffee", "bread"], answer: 1 },
  { q: "When you want to leave, you ask for the ___.", options: ["menu", "bag", "bill", "seat"], answer: 2 },
  { q: "A waiter works at a ___.", options: ["school", "café", "park", "hospital"], answer: 1 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "At the Café",
  subtitle: "A1 dialogue vocabulary — 10 questions + key words",
  level: "A1",
  keyRule: "Café vocabulary: menu · breakfast · bill · juice · sandwich",
  exercises: [
    {
      number: 1,
      title: "Dialogue Exercise — Choose the correct word",
      difficulty: "Easy",
      instruction: "Read each sentence from the dialogue and choose the word that fits best.",
      questions: [
        "Maria and Pedro want to have ___ at a café. (breakfast / homework / exercise)",
        "The waiter gives them the ___. (menu / bed / shoe)",
        "Pedro wants a ___, please. (coffee / chair / flower)",
        "Do you want ___ in your coffee? (milk / sand / music)",
        "Maria wants a ___ with cheese. (sandwich / pencil / cloud)",
        "They have orange juice and ___ juice. (apple / book / door)",
        "The coffee is very ___. (hot / long / green)",
        "Can we have the ___, please? (bill / song / cat)",
        "That's ten ___, please. (euros / kilos / hours)",
        "Can I have a ___ for my sandwich? (bag / dream / lesson)",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Dialogue Exercise", answers: ["breakfast", "menu", "coffee", "milk", "sandwich", "apple", "hot", "bill", "euros", "bag"] },
  ],
};

/*
  Dialogue: "At the Café"
  Maria and Pedro go to a café for breakfast.
  Each QUESTION has a sentence with one blank and 3 options.
  Only one option is clearly correct from context.
*/
type Question = {
  id: number;
  before: string;   // text before the gap
  after: string;    // text after the gap
  options: string[];
  correct: string;
  explanation: string;
  speaker?: string; // optional speaker label
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    speaker: "Narrator",
    before: "Maria and Pedro go to a café. They want to have",
    after: ".",
    options: ["breakfast", "homework", "exercise"],
    correct: "breakfast",
    explanation: "You have breakfast at a café in the morning. Homework and exercise are not things you have at a café.",
  },
  {
    id: 2,
    speaker: "Waiter",
    before: "Good morning! Here is the",
    after: ". Please take a look.",
    options: ["menu", "bed", "shoe"],
    correct: "menu",
    explanation: "A waiter gives you a menu at a café so you can choose your food and drinks.",
  },
  {
    id: 3,
    speaker: "Pedro",
    before: "Can I have a",
    after: ", please? I need something hot to drink.",
    options: ["coffee", "chair", "flower"],
    correct: "coffee",
    explanation: "Coffee is a hot drink. A chair is furniture and a flower is a plant — you don't drink them!",
  },
  {
    id: 4,
    speaker: "Waiter",
    before: "Of course! Do you want",
    after: " in your coffee?",
    options: ["milk", "sand", "music"],
    correct: "milk",
    explanation: "Milk is a liquid you can put in coffee. Sand is from the beach and music is a sound — they don't go in coffee.",
  },
  {
    id: 5,
    speaker: "Maria",
    before: "I'd like a",
    after: " with cheese, please. I'm very hungry!",
    options: ["sandwich", "pencil", "cloud"],
    correct: "sandwich",
    explanation: "A sandwich is food with bread and filling. A pencil is for writing and a cloud is in the sky.",
  },
  {
    id: 6,
    speaker: "Waiter",
    before: "We also have fresh juice — orange juice and",
    after: " juice.",
    options: ["apple", "book", "door"],
    correct: "apple",
    explanation: "Apple juice is a popular drink. Books and doors are objects — you can't make juice from them!",
  },
  {
    id: 7,
    speaker: "Pedro",
    before: "This coffee is very",
    after: ". I need to wait before I drink it.",
    options: ["hot", "long", "green"],
    correct: "hot",
    explanation: "Hot coffee needs time to cool down before you drink it. Long and green don't explain why you need to wait.",
  },
  {
    id: 8,
    speaker: "Maria",
    before: "Can we have the",
    after: ", please? We need to leave soon.",
    options: ["bill", "song", "cat"],
    correct: "bill",
    explanation: "You ask for the bill at a café when you want to pay and leave. A song or a cat don't help you pay!",
  },
  {
    id: 9,
    speaker: "Waiter",
    before: "Of course! That's ten",
    after: ", please.",
    options: ["euros", "kilos", "hours"],
    correct: "euros",
    explanation: "Euros are money. You pay for food with money, not kilos (weight) or hours (time).",
  },
  {
    id: 10,
    speaker: "Pedro",
    before: "Excuse me, can I have a",
    after: " for my sandwich? I want to take it with me.",
    options: ["bag", "dream", "lesson"],
    correct: "bag",
    explanation: "You put food in a bag to take it away. A dream is when you sleep and a lesson is at school.",
  },
];

const VOCAB_FOCUS = [
  { word: "menu", def: "a list of food and drinks at a café or restaurant" },
  { word: "breakfast", def: "the first meal of the day, usually in the morning" },
  { word: "bill", def: "a piece of paper showing how much you need to pay" },
  { word: "juice", def: "a cold drink made from fruit" },
  { word: "sandwich", def: "two pieces of bread with food inside" },
];

export default function AtTheCafeClient() {
  const isPro = useIsPro();
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [checked, setChecked] = useState(false);

  const { isLive, broadcast } = useLiveSync((payload) => {
    setAnswers(payload.answers as Record<number, string | null>);
    setChecked(payload.checked as boolean);
  });

  async function handlePDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(PDF_CONFIG); } finally { setPdfLoading(false); }
  }

  const answeredCount = QUESTIONS.filter((q) => answers[q.id] != null).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const correctCount = checked
    ? QUESTIONS.reduce((n, q) => n + (answers[q.id] === q.correct ? 1 : 0), 0)
    : null;
  const percent = correctCount !== null ? Math.round((correctCount / QUESTIONS.length) * 100) : null;

  function pick(id: number, val: string) {
    if (checked) return;
    setAnswers((p) => { const n = { ...p, [id]: val }; broadcast({ answers: n, checked: false, exNo: 1 }); return n; });
  }

  function check() {
    if (!allAnswered) return;
    setChecked(true);
    broadcast({ answers, checked: true, exNo: 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setAnswers({});
    setChecked(false);
    broadcast({ answers: {}, checked: false, exNo: 1 });
  }

  useEffect(() => {
    if (!checked || percent === null) return;
    fetch("/api/progress/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "vocabulary", level: "a1", slug: "at-the-cafe", exerciseNo: 1, score: percent, questionsTotal: QUESTIONS.length }),
    }).catch(() => {});
  }, [checked, percent]);

  const grade =
    percent === null ? null :
    percent >= 80 ? "great" :
    percent >= 60 ? "ok" : "low";

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
        <span className="text-slate-700 font-medium">At the Café</span>
      </nav>

      {/* Hero */}
      <div className="mt-6 flex flex-wrap items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-[#F5DA20] px-3 py-0.5 text-[11px] font-black text-black">A1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Dialogue</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">10 questions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.05]">
            At the <span className="relative inline-block">
              Café
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/60" />
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-slate-500 leading-relaxed">
            Maria and Pedro go to a café for breakfast. Read the dialogue and choose the correct word
            for each gap. Think about the context!
          </p>
        </div>
      </div>

      {/* How-to */}
      <div className="mt-6 flex flex-wrap gap-3">
        {[
          { n: "1", label: "Read the sentence", sub: "understand the situation" },
          { n: "2", label: "Choose the word", sub: "that fits the context" },
          { n: "3", label: "Check your answers", sub: "and read the explanations" },
        ].map(({ n, label, sub }) => (
          <div key={n} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#F5DA20] text-xs font-black text-black shadow-sm">{n}</div>
            <div>
              <div className="text-sm font-bold text-slate-800">{label}</div>
              <div className="text-xs text-slate-400">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 3-col grid */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

        {/* Left column */}
        {isPro ? (
          <div className=""><SpeedRound gameId="vocab-at-the-cafe" subject="At the Café Vocabulary" questions={SPEED_QUESTIONS} variant="sidebar" /></div>
        ) : (
          <AdUnit variant="sidebar-dark" />
        )}

        {/* Main */}
        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

          {/* Tab bar */}
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
            <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
            <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Vocabulary</button>
            <PDFButton onDownload={handlePDF} loading={pdfLoading} />
          </div>

          <div className="p-6 md:p-8">
          {tab === "explanation" ? <AtTheCafeExplanation /> : (
          <div className="space-y-5">

          {/* Score panel */}
          {checked && percent !== null && (
            <div className={`flex items-center gap-5 rounded-2xl border px-6 py-5 ${
              grade === "great" ? "border-emerald-200 bg-emerald-50" :
              grade === "ok"   ? "border-amber-200 bg-amber-50" :
                                 "border-red-200 bg-red-50"
            }`}>
              <div className={`text-5xl font-black tabular-nums leading-none ${
                grade === "great" ? "text-emerald-600" :
                grade === "ok"   ? "text-amber-600" :
                                   "text-red-600"
              }`}>
                {percent}<span className="text-2xl">%</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-700">{correctCount} out of {QUESTIONS.length} correct</div>
                <div className="mt-2.5 h-2 w-full rounded-full bg-black/8 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      grade === "great" ? "bg-emerald-500" :
                      grade === "ok"   ? "bg-amber-400" :
                                         "bg-red-500"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {grade === "great" ? "Excellent! You have great vocabulary for a beginner." :
                   grade === "ok"   ? "Good effort! Read the explanations and try again." :
                                      "Keep practising! Review the explanations below to improve."}
                </p>
              </div>
              <div className="text-4xl">{grade === "great" ? "🎉" : grade === "ok" ? "💪" : "📖"}</div>
            </div>
          )}

          {/* Questions card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]">

            {/* Card header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
              <div>
                <h2 className="text-[15px] font-black text-slate-900">Choose the correct word</h2>
                <p className="text-xs text-slate-400 mt-0.5">Read each sentence and select the word that fits best.</p>
              </div>
              {!checked ? (
                <div className="flex items-center gap-2.5">
                  <div className="h-1.5 w-24 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
                      style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-400 tabular-nums">{answeredCount}/{QUESTIONS.length}</span>
                </div>
              ) : (
                <span className={`rounded-full px-3 py-1 text-xs font-black border ${
                  grade === "great" ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                  grade === "ok"   ? "border-amber-200 bg-amber-50 text-amber-700" :
                                     "border-red-200 bg-red-50 text-red-700"
                }`}>
                  {correctCount}/{QUESTIONS.length}
                </span>
              )}
            </div>

            {/* Questions list */}
            <div className="divide-y divide-slate-50">
              {QUESTIONS.map((q, idx) => {
                const chosen = answers[q.id];
                const isCorrect = checked && chosen === q.correct;
                const isWrong   = checked && chosen != null && chosen !== q.correct;

                return (
                  <div
                    key={q.id}
                    className={`px-6 py-6 transition-colors duration-200 ${
                      isCorrect ? "bg-emerald-50/60" :
                      isWrong   ? "bg-red-50/60" : ""
                    }`}
                  >
                    <div className="flex gap-4">

                      {/* Number */}
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all ${
                        isCorrect      ? "bg-emerald-500 text-white" :
                        isWrong        ? "bg-red-500 text-white" :
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

                        {/* Speaker label */}
                        {q.speaker && (
                          <div className={`mb-1.5 text-[11px] font-black uppercase tracking-wider ${
                            q.speaker === "Narrator" ? "text-slate-300" :
                            q.speaker === "Waiter"   ? "text-sky-400" :
                            q.speaker === "Pedro"    ? "text-violet-500" :
                            "text-orange-500"
                          }`}>
                            {q.speaker}
                          </div>
                        )}

                        {/* Sentence with gap */}
                        <p className="text-[16px] text-slate-800 leading-relaxed font-medium">
                          {q.before}{" "}
                          <span className={`inline-block min-w-[80px] rounded-lg px-3 py-0.5 text-center font-black transition-all ${
                            isCorrect ? "bg-emerald-100 text-emerald-700" :
                            isWrong   ? "bg-red-100 text-red-600 line-through" :
                            chosen    ? "bg-[#F5DA20]/30 text-slate-800" :
                            "border-2 border-dashed border-slate-200 text-slate-300"
                          }`}>
                            {chosen ?? "???"}
                          </span>
                          {" "}{q.after}
                        </p>

                        {/* Corrected word if wrong */}
                        {isWrong && (
                          <p className="mt-1 text-sm font-semibold text-emerald-600">
                            ✓ Correct answer: <span className="font-black">{q.correct}</span>
                          </p>
                        )}

                        {/* Options */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {q.options.map((opt) => {
                            const sel     = chosen === opt;
                            const ok      = checked && sel && opt === q.correct;
                            const bad     = checked && sel && opt !== q.correct;
                            const reveal  = checked && !sel && opt === q.correct;

                            return (
                              <button
                                key={opt}
                                onClick={() => pick(q.id, opt)}
                                disabled={checked}
                                className={`rounded-xl px-5 py-2 text-sm font-bold transition-all duration-150
                                  ${ok     ? "bg-emerald-500 text-white shadow-sm" :
                                    bad    ? "bg-red-500 text-white shadow-sm" :
                                    reveal ? "border-2 border-emerald-300 bg-emerald-50 text-emerald-700" :
                                    sel    ? "bg-[#F5DA20] text-black shadow-sm" :
                                    checked ? "border border-slate-100 bg-slate-50 text-slate-300" :
                                    "border border-slate-200 bg-white text-slate-700 hover:border-[#F5DA20] hover:bg-[#F5DA20]/10 hover:text-slate-900 active:scale-95"
                                  }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {checked && (
                          <div className={`mt-3 rounded-xl px-4 py-3 text-sm leading-relaxed ${
                            isCorrect ? "bg-emerald-50 border border-emerald-100 text-emerald-800" :
                                        "bg-slate-50 border border-slate-100 text-slate-600"
                          }`}>
                            <span className="font-bold">{isCorrect ? "✓ Correct! " : "Explanation: "}</span>
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
                  {!allAnswered && (
                    <span className="text-xs text-slate-400">
                      {QUESTIONS.length - answeredCount} question{QUESTIONS.length - answeredCount !== 1 ? "s" : ""} remaining
                    </span>
                  )}
                </>
              ) : (
                <button
                  onClick={reset}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Try Again
                </button>
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
          )}
          </div>
        </section>

        {/* Right column */}
        {isPro ? (
          <VocabRecommendations level="a1" />
        ) : (
          <AdUnit variant="sidebar-light" />
        )}

      </div>
    </div>
  );
}

function AtTheCafeExplanation() {
  const words = [
    ["breakfast", "сніданок — перший прийом їжі"],
    ["menu", "меню — список страв і напоїв"],
    ["coffee", "кава — гарячий напій із зерен"],
    ["milk", "молоко — біла рідина, додають до кави"],
    ["sandwich", "сандвіч — два шматки хліба з начинкою"],
    ["juice", "сік — холодний напій із фруктів"],
    ["apple", "яблуко — фрукт, з нього роблять сік"],
    ["orange", "апельсин — фрукт, популярний для соку"],
    ["hot", "гарячий — висока температура"],
    ["bill", "рахунок — скільки потрібно заплатити"],
    ["euros", "євро — гроші в Європі"],
    ["bag", "пакет — щоб взяти їжу з собою"],
    ["waiter", "офіціант — людина, яка приносить їжу"],
    ["café", "кафе — місце, де п'ють каву та їдять"],
    ["drink", "напій — рідина, яку п'ють"],
    ["food", "їжа — те, що їдять"],
    ["pay", "платити — давати гроші"],
    ["choose", "вибирати — приймати рішення"],
    ["order", "замовляти — просити принести страву"],
    ["leave", "йти — виходити"],
  ];
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-slate-900">At the Café — Vocabulary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {words.map(([en, ua]) => (
          <div key={en} className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm flex gap-2">
            <span className="font-bold text-slate-900 min-w-[80px]">{en}</span>
            <span className="text-slate-500">{ua}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">A1 Tip</div>
        <p className="text-xs text-amber-700 leading-relaxed">When you don't know a word, look at the <strong>whole sentence</strong> for clues. The situation, other words and common sense will help you choose correctly.</p>
      </div>
    </div>
  );
}
