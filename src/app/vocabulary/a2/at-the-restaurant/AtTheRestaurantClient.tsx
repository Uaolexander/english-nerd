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
  { q: "You book a table in advance with a ___.", options: ["menu", "bill", "reservation", "receipt"], answer: 2 },
  { q: "The first course of a meal is called ___.", options: ["main course", "starter", "dessert", "side dish"], answer: 1 },
  { q: "The ___ is a list of food and drinks.", options: ["menu", "bill", "table", "waiter"], answer: 0 },
  { q: "The final course of a meal is ___.", options: ["starter", "main course", "reservation", "dessert"], answer: 3 },
  { q: "The waiter brings you the ___ to pay.", options: ["menu", "bill", "tip", "plate"], answer: 1 },
  { q: "An Italian restaurant serves ___.", options: ["sushi", "pizza", "tacos", "curry"], answer: 1 },
  { q: "Gluten-free means without ___.", options: ["sugar", "salt", "wheat", "oil"], answer: 2 },
  { q: "To recommend means to ___.", options: ["order food", "suggest something good", "pay the bill", "reserve a table"], answer: 1 },
  { q: "A tip is extra money for the ___.", options: ["food", "waiter", "table", "kitchen"], answer: 1 },
  { q: "Tender meat is ___.", options: ["hard", "spicy", "soft and easy to chew", "cold"], answer: 2 },
  { q: "You are a vegetarian if you don't eat ___.", options: ["vegetables", "fruit", "meat", "bread"], answer: 2 },
  { q: "A ___ course comes before the main.", options: ["dessert", "starter", "side", "bill"], answer: 1 },
  { q: "Sarah and Mark go to the restaurant for ___.", options: ["lunch", "breakfast", "dinner", "snack"], answer: 2 },
  { q: "The chef ___ the restaurant.", options: ["serves", "runs", "orders", "books"], answer: 1 },
  { q: "Wine is a type of ___.", options: ["food", "drink", "dessert", "starter"], answer: 1 },
  { q: "When food is delicious, it tastes very ___.", options: ["bad", "good", "spicy", "cold"], answer: 1 },
  { q: "To reserve a table means to ___ it in advance.", options: ["book", "pay", "order", "taste"], answer: 0 },
  { q: "A fork is a piece of ___.", options: ["furniture", "crockery", "cutlery", "glassware"], answer: 2 },
  { q: "The ___ brings your food to the table.", options: ["chef", "manager", "waiter", "cashier"], answer: 2 },
  { q: "Pasta is an example of an ___ dish.", options: ["English", "French", "Italian", "Spanish"], answer: 2 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "At the Restaurant",
  subtitle: "A2 restaurant dialogue vocabulary — 10 questions",
  level: "A2",
  keyRule: "Restaurant vocabulary: reservation · menu · starter · main course · dessert · bill · tip",
  exercises: [
    {
      number: 1, title: "Dialogue Exercise", difficulty: "Easy",
      instruction: "Read the dialogue and choose the correct word.",
      questions: [
        "Have you made a ___? We have a table for two. (reservation / bicycle / window)",
        "Here is the ___. Please take a look. (menu / weather / shoe)",
        "I'd like the soup as a ___. (starter / homework / dream)",
        "What is the ___ course? (main / first / only / last)",
        "I'd like pasta as my ___. (main course / dessert / starter)",
        "Could we have the ___ please? (bill / song / cat)",
        "Can I leave a ___? The service was excellent. (tip / change / note)",
        "This steak is very ___. (tender / hard / loud)",
        "Do you have any ___ options? (gluten-free / expensive / large)",
        "The chef of this restaurant is ___. (excellent / poor / ordinary)",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Dialogue Exercise", answers: ["reservation", "menu", "starter", "main", "main course", "bill", "tip", "tender", "gluten-free", "excellent"] },
  ],
};

/*
  Dialogue: "At the Restaurant"
  Sarah and Mark go to an Italian restaurant for dinner.
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
    speaker: "Waiter",
    before: "Good evening! Have you made a",
    after: "? We have a table for two ready for you.",
    options: ["reservation", "bicycle", "window"],
    correct: "reservation",
    explanation: "A reservation is when you book a table in advance at a restaurant. Bicycle and window are not related to restaurants.",
  },
  {
    id: 2,
    speaker: "Waiter",
    before: "Here is the",
    after: ". Please take a look and decide what you would like.",
    options: ["menu", "weather", "shoe"],
    correct: "menu",
    explanation: "A menu is a list of food and drinks available at the restaurant. Weather and shoe do not belong in this context.",
  },
  {
    id: 3,
    speaker: "Sarah",
    before: "I'd like the soup as a",
    after: ". It looks delicious.",
    options: ["starter", "homework", "dream"],
    correct: "starter",
    explanation: "A starter is the first course of a meal, eaten before the main course. Homework and dream make no sense in a restaurant context.",
  },
  {
    id: 4,
    speaker: "Mark",
    before: "And I'll have the steak as my",
    after: ". Can I have it medium rare?",
    options: ["main course", "garden", "lesson"],
    correct: "main course",
    explanation: "The main course is the largest and most important part of a meal. Garden and lesson are completely unrelated to ordering food.",
  },
  {
    id: 5,
    speaker: "Waiter",
    before: "Can I",
    after: "the salmon? It's very fresh today.",
    options: ["recommend", "forget", "sleep"],
    correct: "recommend",
    explanation: "To recommend means to suggest something good. A waiter recommends dishes they think you will enjoy. Forget and sleep do not fit this sentence.",
  },
  {
    id: 6,
    speaker: "Sarah",
    before: "Is there anything",
    after: "on the menu? I don't eat meat.",
    options: ["vegetarian", "expensive", "frozen"],
    correct: "vegetarian",
    explanation: "Vegetarian food contains no meat. If you don't eat meat, you look for vegetarian options. Expensive and frozen don't explain why Sarah is asking.",
  },
  {
    id: 7,
    speaker: "Mark",
    before: "I'd love some",
    after: ". What do you have?",
    options: ["dessert", "furniture", "weather"],
    correct: "dessert",
    explanation: "Dessert is the sweet course at the end of a meal, like cake or ice cream. Furniture and weather are completely unrelated to eating.",
  },
  {
    id: 8,
    speaker: "Waiter",
    before: "Service is not included, so you can leave a",
    after: "if you enjoyed your meal.",
    options: ["tip", "cloud", "notebook"],
    correct: "tip",
    explanation: "A tip is extra money you give to a waiter to show you are happy with the service. Cloud and notebook are not things you leave at a restaurant.",
  },
  {
    id: 9,
    speaker: "Sarah",
    before: "Excuse me, could we have the",
    after: ", please? We need to leave soon.",
    options: ["bill", "river", "tree"],
    correct: "bill",
    explanation: "The bill shows the total amount you need to pay at a restaurant. River and tree have nothing to do with paying for a meal.",
  },
  {
    id: 10,
    speaker: "Mark",
    before: "That was excellent! I really",
    after: "the food. Let's come again!",
    options: ["enjoyed", "slept", "forgot"],
    correct: "enjoyed",
    explanation: "To enjoy means to like something very much. Mark is saying the food was excellent and he liked it. Slept and forgot do not make sense here.",
  },
];

const VOCAB_FOCUS = [
  { word: "reservation", def: "when you book a table at a restaurant in advance" },
  { word: "starter", def: "the first course of a meal, eaten before the main course" },
  { word: "main course", def: "the largest and most important part of a meal" },
  { word: "vegetarian", def: "food that contains no meat or fish" },
  { word: "recommend", def: "to suggest something good for someone to try" },
];

export default function AtTheRestaurantClient() {
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
      body: JSON.stringify({ category: "vocabulary", level: "a2", slug: "at-the-restaurant", exerciseNo: 1, score: percent, questionsTotal: QUESTIONS.length }),
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
        {[["Home", "/"], ["Vocabulary", "/vocabulary"], ["A2", "/vocabulary/a2"]].map(([label, href]) => (
          <span key={href} className="flex items-center gap-1.5">
            <a href={href} className="hover:text-slate-700 transition">{label}</a>
            <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </span>
        ))}
        <span className="text-slate-700 font-medium">At the Restaurant</span>
      </nav>

      {/* Hero */}
      <div className="mt-6 flex flex-wrap items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-emerald-400 px-3 py-0.5 text-[11px] font-black text-black">A2</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Dialogue</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">10 questions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.05]">
            At the <span className="relative inline-block">
              Restaurant
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/60" />
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-slate-500 leading-relaxed">
            Sarah and Mark go to an Italian restaurant for dinner. Read the dialogue and choose the correct word
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
          <div className=""><SpeedRound gameId="vocab-at-the-restaurant" subject="At the Restaurant Vocabulary" questions={SPEED_QUESTIONS} variant="sidebar" /></div>
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
          {tab === "explanation" ? <AtTheRestaurantExplanation /> : (
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
                  {grade === "great" ? "Excellent! Your restaurant vocabulary is great!" :
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
                            q.speaker === "Waiter"   ? "text-sky-500" :
                            q.speaker === "Sarah"    ? "text-orange-500" :
                            q.speaker === "Mark"     ? "text-violet-500" :
                            "text-slate-400"
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
            <a href="/vocabulary/a2" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
              All A2 Exercises
            </a>
          </div>
          </div>
          )}
          </div>
        </section>

        {/* Right column */}
        {isPro ? (
          <VocabRecommendations level="a2" />
        ) : (
          <AdUnit variant="sidebar-light" />
        )}

      </div>
    </div>
  );
}

function AtTheRestaurantExplanation() {
  const words = [
    ["reservation", "резервація — booking a table in advance"],
    ["menu", "меню — list of food and drinks"],
    ["starter", "закуска — first course of a meal"],
    ["main course", "головна страва — the central dish"],
    ["dessert", "десерт — sweet food at the end of a meal"],
    ["bill", "рахунок — the paper showing what you owe"],
    ["tip", "чайові — extra money for good service"],
    ["waiter", "офіціант — person who brings your food"],
    ["chef", "шеф-кухар — person who cooks in a restaurant"],
    ["gluten-free", "без глютену — no wheat products"],
    ["vegetarian", "вегетаріанець — no meat"],
    ["tender", "ніжний — soft and easy to chew"],
    ["recommend", "рекомендувати — suggest something good"],
    ["flavour", "смак — the taste of food"],
    ["pasta", "паста — Italian noodle dish"],
    ["wine", "вино — alcoholic grape drink"],
    ["table", "стіл — where you sit to eat"],
    ["cutlery", "столові прибори — forks, knives, spoons"],
    ["excellent", "відмінний — very good"],
    ["delicious", "смачний — tastes very good"],
  ];
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-slate-900">At the Restaurant — Vocabulary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {words.map(([en, ua]) => (
          <div key={en} className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm flex gap-2">
            <span className="font-bold text-slate-900 min-w-[90px]">{en}</span>
            <span className="text-slate-500">{ua}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">A2 Tip</div>
        <p className="text-xs text-amber-700 leading-relaxed">At a restaurant, the three parts of a full meal are: <strong>starter → main course → dessert</strong>. Learn them in order!</p>
      </div>
    </div>
  );
}
