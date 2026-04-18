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
  { q: "A destination is the ___ you are travelling to.", options: ["hotel", "ticket", "place", "guide"], answer: 2 },
  { q: "To travel abroad means to visit another ___.", options: ["city", "country", "region", "town"], answer: 1 },
  { q: "A passport is a document for ___ travel.", options: ["domestic", "international", "local", "business"], answer: 1 },
  { q: "A budget is how much ___ you can spend.", options: ["time", "luggage", "money", "energy"], answer: 2 },
  { q: "An itinerary is a detailed ___ for a trip.", options: ["map", "ticket", "plan/schedule", "guide"], answer: 2 },
  { q: "Direct flights have ___ stops.", options: ["many", "some", "no", "one"], answer: 2 },
  { q: "Accommodation is where you ___ on a trip.", options: ["eat", "fly", "stay/sleep", "shop"], answer: 2 },
  { q: "To book means to ___ in advance.", options: ["pay", "reserve", "pack", "choose"], answer: 1 },
  { q: "Luggage is your ___ when travelling.", options: ["ticket", "passport", "bags and suitcases", "guide"], answer: 2 },
  { q: "Laura and Mike are planning their summer ___.", options: ["interview", "lesson", "holiday", "meeting"], answer: 2 },
  { q: "Abroad means in another ___.", options: ["city", "region", "country", "hotel"], answer: 2 },
  { q: "Local transport includes buses and ___ in that area.", options: ["flights", "trains", "ships", "taxis"], answer: 1 },
  { q: "A guidebook gives information about ___.", options: ["flights", "hotels only", "travel destinations", "passports"], answer: 2 },
  { q: "A visa allows you to ___ a foreign country.", options: ["leave", "enter", "fly over", "drive through"], answer: 1 },
  { q: "Jet lag is tiredness caused by ___.", options: ["long walks", "time zone changes", "bad food", "hot weather"], answer: 1 },
  { q: "Travel insurance protects you against unexpected ___.", options: ["delays and illness", "boredom", "good weather", "cheap flights"], answer: 0 },
  { q: "A currency exchange is where you swap ___.", options: ["passports", "money from one currency to another", "luggage", "tickets"], answer: 1 },
  { q: "Mike asks Laura: Have you chosen a ___?", options: ["hotel", "guidebook", "destination", "flight"], answer: 2 },
  { q: "Look forward to means to ___.", options: ["look behind", "be excited about something coming", "plan carefully", "worry about"], answer: 1 },
  { q: "Japan is known for its ___ culture and food.", options: ["European", "African", "unique", "ordinary"], answer: 2 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Travel Plans",
  subtitle: "B1 travel vocabulary — dialogue exercise",
  level: "B1",
  keyRule: "Travel vocabulary: destination · passport · itinerary · accommodation · budget · luggage · visa",
  exercises: [
    {
      number: 1, title: "Dialogue Exercise", difficulty: "Medium",
      instruction: "Choose the correct word for each gap.",
      questions: [
        "Laura and Mike are planning their summer ___. (holiday / lesson / meeting)",
        "Have you chosen a ___? Where do you want to go? (destination / jacket / window)",
        "Have you ever ___ abroad before? (travelled / cooked / slept)",
        "We need to get our ___ before we can fly. (passports / suitcases / tickets)",
        "We are working with a strict ___. (budget / guidebook / schedule)",
        "I've already planned our ___. (itinerary / luggage / accommodation)",
        "We should look for ___ near the city centre. (accommodation / transport / food)",
        "Are there any ___ flights or do we need to change? (direct / cheap / long)",
        "I can't wait to see the ___ culture and food! (local / old / basic)",
        "I'm really looking ___ to the trip! (forward / back / up)",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Dialogue Exercise", answers: ["holiday", "destination", "travelled", "passports", "budget", "itinerary", "accommodation", "direct", "local", "forward"] },
  ],
};

/*
  Dialogue: "Travel Plans"
  Laura and Mike discuss their holiday plans.
  Each QUESTION has a sentence with one blank and 3 options.
  Only one option is clearly correct from context.
*/
type Question = {
  id: number;
  before: string;
  after: string;
  options: string[];
  correct: string;
  explanation: string;
  speaker?: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    speaker: "Narrator",
    before: "Laura and Mike are planning their summer",
    after: ".",
    options: ["holiday", "lesson", "meeting"],
    correct: "holiday",
    explanation: "A holiday is a period of time when you travel or relax away from work. A lesson is for learning and a meeting is for work.",
  },
  {
    id: 2,
    speaker: "Mike",
    before: "Have you chosen a",
    after: "yet? Where do you want to go?",
    options: ["destination", "jacket", "window"],
    correct: "destination",
    explanation: "A destination is the place you are travelling to. A jacket is clothing and a window is part of a building.",
  },
  {
    id: 3,
    speaker: "Laura",
    before: "I'd love to go to Japan. Have you ever",
    after: "abroad before?",
    options: ["travelled", "cooked", "slept"],
    correct: "travelled",
    explanation: "Travelling abroad means visiting another country. Cooked and slept are not activities that relate to going abroad.",
  },
  {
    id: 4,
    speaker: "Mike",
    before: "We need to book our",
    after: "— a hotel or maybe an apartment?",
    options: ["accommodation", "furniture", "schedule"],
    correct: "accommodation",
    explanation: "Accommodation is the place where you stay when travelling — a hotel, apartment or hostel. Furniture is for a home and schedule is a timetable.",
  },
  {
    id: 5,
    speaker: "Laura",
    before: "Let's check the",
    after: ". How much can we spend in total?",
    options: ["budget", "weather", "colour"],
    correct: "budget",
    explanation: "A budget is the amount of money you plan to spend. Weather and colour are not relevant to financial planning.",
  },
  {
    id: 6,
    speaker: "Mike",
    before: "We should also plan our",
    after: "— which cities to visit each day.",
    options: ["itinerary", "wardrobe", "garden"],
    correct: "itinerary",
    explanation: "An itinerary is a detailed plan of your journey, including where you go each day. A wardrobe holds clothes and a garden is an outdoor space.",
  },
  {
    id: 7,
    speaker: "Laura",
    before: "Don't forget to",
    after: "some yen. Japanese shops don't always accept cards.",
    options: ["exchange", "forget", "lose"],
    correct: "exchange",
    explanation: "To exchange currency means to convert your money into the local currency. Forget and lose are not helpful actions when dealing with money.",
  },
  {
    id: 8,
    speaker: "Mike",
    before: "What is the",
    after: "in Japan? Is it the yen?",
    options: ["currency", "language", "weather"],
    correct: "currency",
    explanation: "Currency is the system of money used in a country. The currency of Japan is the yen.",
  },
  {
    id: 9,
    speaker: "Laura",
    before: "I'll book the",
    after: "online. We can fly from London.",
    options: ["flights", "meals", "hotels"],
    correct: "flights",
    explanation: "Flights are journeys by plane. If they are flying from London, they need to book flights.",
  },
  {
    id: 10,
    speaker: "Mike",
    before: "Great! I'm really looking",
    after: "to this trip!",
    options: ["forward", "backward", "upward"],
    correct: "forward",
    explanation: "\"Looking forward to\" is a phrasal verb meaning you are excited and happy about something that will happen. You look forward to things, not backward or upward.",
  },
];

const VOCAB_FOCUS = [
  { word: "destination", def: "the place you are travelling to" },
  { word: "accommodation", def: "the place where you stay when travelling" },
  { word: "itinerary", def: "a detailed plan of your journey" },
  { word: "budget", def: "the amount of money you plan to spend" },
  { word: "currency", def: "the system of money used in a country" },
];

export default function TravelPlansClient() {
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
      body: JSON.stringify({ category: "vocabulary", level: "b1", slug: "travel-plans", exerciseNo: 1, score: percent, questionsTotal: QUESTIONS.length }),
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
        {[["Home", "/"], ["Vocabulary", "/vocabulary"], ["B1", "/vocabulary/b1"]].map(([label, href]) => (
          <span key={href} className="flex items-center gap-1.5">
            <a href={href} className="hover:text-slate-700 transition">{label}</a>
            <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </span>
        ))}
        <span className="text-slate-700 font-medium">Travel Plans</span>
      </nav>

      {/* Hero */}
      <div className="mt-6 flex flex-wrap items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-violet-400 px-3 py-0.5 text-[11px] font-black text-black">B1</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Dialogue</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">10 questions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.05]">
            Travel{" "}
            <span className="relative inline-block">
              Plans
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/60" />
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-slate-500 leading-relaxed">
            Laura and Mike discuss their holiday plans. Read the dialogue and choose the correct word
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
          <div className=""><SpeedRound gameId="vocab-travel-plans" subject="Travel Plans Vocabulary" questions={SPEED_QUESTIONS} variant="sidebar" /></div>
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
          {tab === "explanation" ? <TravelPlansExplanation /> : (
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
                  {grade === "great" ? "Excellent! You have great B1 travel vocabulary." :
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
                            q.speaker === "Mike"     ? "text-violet-500" :
                            q.speaker === "Laura"    ? "text-orange-500" :
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
            <a href="/vocabulary/b1" className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
              All B1 Exercises
            </a>
          </div>
          </div>
          )}
          </div>
        </section>

        {/* Right column */}
        {isPro ? (
          <VocabRecommendations level="b1" />
        ) : (
          <AdUnit variant="sidebar-light" />
        )}

      </div>
    </div>
  );
}

function TravelPlansExplanation() {
  const words = [
    ["holiday", "відпустка — period of travel/relaxation"],
    ["destination", "пункт призначення — place you travel to"],
    ["passport", "паспорт — document for international travel"],
    ["budget", "бюджет — how much money you can spend"],
    ["itinerary", "маршрут — detailed plan for a trip"],
    ["accommodation", "проживання — where you stay on a trip"],
    ["direct flight", "прямий рейс — flight with no stops"],
    ["local culture", "місцева культура — traditions of an area"],
    ["look forward to", "з нетерпінням чекати — be excited about"],
    ["luggage", "багаж — bags and suitcases"],
    ["visa", "віза — document to enter a foreign country"],
    ["jet lag", "джетлаг — tiredness from time zone change"],
    ["travel insurance", "страхування подорожі — protection for trips"],
    ["currency exchange", "обмін валют — swap money currencies"],
    ["guidebook", "путівник — book with travel information"],
    ["sightseeing", "огляд визначних місць — visiting attractions"],
    ["abroad", "за кордон — in another country"],
    ["booking", "бронювання — reserving in advance"],
    ["hostel", "хостел — cheap shared accommodation"],
    ["souvenir", "сувенір — gift bought on holiday"],
  ];
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-slate-900">Travel Plans — Vocabulary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {words.map(([en, ua]) => (
          <div key={en} className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm flex gap-2">
            <span className="font-bold text-slate-900 min-w-[100px]">{en}</span>
            <span className="text-slate-500">{ua}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">B1 Tip</div>
        <p className="text-xs text-amber-700 leading-relaxed">Notice phrasal verbs like <strong>"look forward to"</strong> — very common in spoken English. Learn them as fixed expressions!</p>
      </div>
    </div>
  );
}
