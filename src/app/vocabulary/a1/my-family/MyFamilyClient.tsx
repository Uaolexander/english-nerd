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
  { q: "The woman who is your parent:", options: ["sister", "grandmother", "mother", "aunt"], answer: 2 },
  { q: "The man who is your parent:", options: ["brother", "grandfather", "uncle", "father"], answer: 3 },
  { q: "A boy with the same parents as you:", options: ["uncle", "cousin", "brother", "father"], answer: 2 },
  { q: "A girl with the same parents as you:", options: ["aunt", "mother", "cousin", "sister"], answer: 3 },
  { q: "The mother of your mother:", options: ["aunt", "grandmother", "sister", "cousin"], answer: 1 },
  { q: "The father of your father:", options: ["uncle", "brother", "grandfather", "cousin"], answer: 2 },
  { q: "The group of people you are related to:", options: ["class", "team", "family", "club"], answer: 2 },
  { q: "A sister or brother is your ___.", options: ["friend", "sibling", "cousin", "parent"], answer: 1 },
  { q: "What do you have for Christmas dinner?", options: ["lesson", "food", "rain", "music"], answer: 1 },
  { q: "Friendly and generous means:", options: ["expensive", "difficult", "kind", "small"], answer: 2 },
  { q: "Anna's grandmother lives in a small ___.", options: ["city", "hotel", "hospital", "house"], answer: 3 },
  { q: "To spend ___ with family means to be with them.", options: ["money", "time", "music", "rain"], answer: 1 },
  { q: "Your mother's sister is your ___.", options: ["grandmother", "cousin", "aunt", "niece"], answer: 2 },
  { q: "Your brother's son is your ___.", options: ["nephew", "cousin", "uncle", "sibling"], answer: 0 },
  { q: "A large ___ has many people in it.", options: ["house", "class", "family", "dinner"], answer: 2 },
  { q: "Anna has ___ people in her family.", options: ["two", "three", "four", "five"], answer: 3 },
  { q: "Jack is Anna's ___.", options: ["father", "brother", "uncle", "cousin"], answer: 1 },
  { q: "Emma is ___ years old.", options: ["six", "seven", "eight", "ten"], answer: 2 },
  { q: "What does a grandfather tell?", options: ["jokes", "stories", "songs", "lessons"], answer: 1 },
  { q: "Anna's father drives a big ___.", options: ["car", "train", "bus", "bike"], answer: 2 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "My Family",
  subtitle: "A1 family vocabulary — dialogue exercise + key words",
  level: "A1",
  keyRule: "Family vocabulary: mother · father · brother · sister · grandmother",
  exercises: [
    {
      number: 1, title: "Dialogue Exercise", difficulty: "Easy",
      instruction: "Read each sentence and choose the correct family word.",
      questions: [
        "I have a big ___. There are five people in it. (family / garden / lesson)",
        "My ___ is a nurse. She works at the hospital. (mother / mirror / lamp)",
        "My ___ drives a big bus. (father / pencil / cloud)",
        "Do you have a ___? Yes! His name is Jack, he is ten. (brother / kitchen / flower)",
        "My ___ Emma is eight years old. (sister / chair / sky)",
        "Every Sunday, we visit my ___. She lives in a village. (grandmother / student / market)",
        "My grandmother makes great ___. (food / stone / book)",
        "My grandfather is very ___. He tells funny stories. (kind / difficult / expensive)",
        "We have a big family ___ every Christmas. (dinner / lesson / river)",
        "I love spending ___ with my family at weekends. (time / rain / music)",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Dialogue Exercise", answers: ["family", "mother", "father", "brother", "sister", "grandmother", "food", "kind", "dinner", "time"] },
  ],
};

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
    speaker: "Anna",
    before: "I have a big",
    after: ". There are five people in it.",
    options: ["family", "garden", "lesson"],
    correct: "family",
    explanation: "A family is the group of people you live with and are related to. A garden is outside and a lesson is at school.",
  },
  {
    id: 2,
    speaker: "Anna",
    before: "My",
    after: "is a nurse. She works at the hospital every day.",
    options: ["mother", "mirror", "lamp"],
    correct: "mother",
    explanation: "Your mother is the woman who is your parent. A mirror and a lamp are objects in a room.",
  },
  {
    id: 3,
    speaker: "Anna",
    before: "My",
    after: "drives a big bus. He starts work at six in the morning.",
    options: ["father", "pencil", "cloud"],
    correct: "father",
    explanation: "Your father is the man who is your parent. A pencil is for writing and a cloud is in the sky.",
  },
  {
    id: 4,
    speaker: "Tom",
    before: "Do you have a",
    after: "? Anna: Yes! His name is Jack. He is ten years old.",
    options: ["brother", "kitchen", "flower"],
    correct: "brother",
    explanation: "A brother is a boy or man who has the same parents as you. A kitchen is a room and a flower is a plant.",
  },
  {
    id: 5,
    speaker: "Anna",
    before: "My",
    after: "Emma is eight years old. She loves drawing and painting.",
    options: ["sister", "chair", "sky"],
    correct: "sister",
    explanation: "A sister is a girl or woman who has the same parents as you. A chair is furniture and the sky is above us.",
  },
  {
    id: 6,
    speaker: "Anna",
    before: "Every Sunday, we visit my",
    after: ". She lives in a small house in the village.",
    options: ["grandmother", "student", "market"],
    correct: "grandmother",
    explanation: "Your grandmother is the mother of your mother or father. A student studies at school and a market is a place to buy food.",
  },
  {
    id: 7,
    speaker: "Anna",
    before: "My grandmother makes great",
    after: ". We always eat a lot at her house.",
    options: ["food", "stone", "book"],
    correct: "food",
    explanation: "Food is what you eat. A stone is a hard object from the ground and a book is for reading.",
  },
  {
    id: 8,
    speaker: "Anna",
    before: "My grandfather is very",
    after: ". He always tells funny stories and makes us laugh.",
    options: ["kind", "difficult", "expensive"],
    correct: "kind",
    explanation: "Kind means friendly and generous. Difficult means hard to do and expensive means it costs a lot of money.",
  },
  {
    id: 9,
    speaker: "Anna",
    before: "We have a big family",
    after: "every Christmas. All of us sit at the table together.",
    options: ["dinner", "lesson", "river"],
    correct: "dinner",
    explanation: "Dinner is the main meal of the day. A lesson is at school and a river is a body of water.",
  },
  {
    id: 10,
    speaker: "Anna",
    before: "I love spending",
    after: "with my family at weekends. It makes me happy.",
    options: ["time", "rain", "music"],
    correct: "time",
    explanation: "You spend time with people you love. Rain is weather and music is something you listen to.",
  },
];

const VOCAB_FOCUS = [
  { word: "family", def: "the group of people you are related to and live with" },
  { word: "mother", def: "a woman who has a child; your female parent" },
  { word: "father", def: "a man who has a child; your male parent" },
  { word: "brother", def: "a boy or man who has the same parents as you" },
  { word: "grandmother", def: "the mother of your mother or father" },
];

export default function MyFamilyClient() {
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
      body: JSON.stringify({ category: "vocabulary", level: "a1", slug: "my-family", exerciseNo: 1, score: percent, questionsTotal: QUESTIONS.length }),
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
        <span className="text-slate-700 font-medium">My Family</span>
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
            My{" "}
            <span className="relative inline-block">
              Family
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/60" />
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-slate-500 leading-relaxed">
            Anna tells her friend Tom about her family. Read the dialogue and choose
            the correct word for each gap. Think about the context!
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
          <div className=""><SpeedRound gameId="vocab-my-family" subject="My Family Vocabulary" questions={SPEED_QUESTIONS} variant="sidebar" /></div>
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
          {tab === "explanation" ? <MyFamilyExplanation /> : (
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
                  {grade === "great" ? "Excellent! You know your family vocabulary well!" :
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
                            q.speaker === "Tom"      ? "text-violet-500" :
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
                            const sel    = chosen === opt;
                            const ok     = checked && sel && opt === q.correct;
                            const bad    = checked && sel && opt !== q.correct;
                            const reveal = checked && !sel && opt === q.correct;

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

function MyFamilyExplanation() {
  const words = [
    ["mother", "мама — жінка-батьок"],
    ["father", "тато — чоловік-батьок"],
    ["brother", "брат — хлопець із тими ж батьками"],
    ["sister", "сестра — дівчина із тими ж батьками"],
    ["grandmother", "бабуся — мама твоїх батьків"],
    ["grandfather", "дідусь — тато твоїх батьків"],
    ["aunt", "тітка — сестра твоїх батьків"],
    ["uncle", "дядько — брат твоїх батьків"],
    ["cousin", "двоюрідний — дитина тітки або дядька"],
    ["nephew", "племінник — хлопець-дитина брата або сестри"],
    ["niece", "племінниця — дівчина-дитина брата або сестри"],
    ["family", "родина — усі твої родичі"],
    ["parents", "батьки — мама і тато разом"],
    ["sibling", "брат або сестра"],
    ["kind", "добрий — friendly and generous"],
    ["dinner", "вечеря — the main evening meal"],
    ["food", "їжа — що їдять"],
    ["time", "час — spend time = бути разом"],
    ["village", "село — small place in the countryside"],
    ["stories", "оповіді — tales or narratives"],
  ];
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-slate-900">My Family — Vocabulary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {words.map(([en, ua]) => (
          <div key={en} className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm flex gap-2">
            <span className="font-bold text-slate-900 min-w-[90px]">{en}</span>
            <span className="text-slate-500">{ua}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">A1 Tip</div>
        <p className="text-xs text-amber-700 leading-relaxed">Family words are some of the first words you learn in English. <strong>Mother, father, brother, sister</strong> can be used without "my" when talking generally.</p>
      </div>
    </div>
  );
}
