"use client";

import { useState, useEffect, useRef } from "react";
import AdUnit from "@/components/AdUnit";
import { useIsPro } from "@/lib/ProContext";
import ReadingRecommendations from "@/components/ReadingRecommendations";
import PDFButton from "@/components/PDFButton";
import { generateReadingPDF, type ReadingPDFConfig } from "@/lib/generateReadingPDF";
import { useLiveSync } from "@/lib/useLiveSync";

type PenPal = {
  name: string;
  country: string;
  flag: string;
  border: string;
  message: string;
};

const PEN_PALS: PenPal[] = [
  {
    name: "Mia",
    country: "Australia",
    flag: "AU",
    border: "border-sky-500",
    message:
      "Hi! My name is Mia and I live near the beach in Sydney, Australia. I love the ocean and I go swimming almost every day. I study at high school and my favourite subjects are art and PE. On weekends, I play volleyball with my friends on the beach. I have a younger brother. He is eight years old and very funny. One day, I really want to visit Europe and see places like Paris and Rome!",
  },
  {
    name: "Carlos",
    country: "Mexico",
    flag: "MX",
    border: "border-orange-500",
    message:
      "Hello! I am Carlos and I live in Mexico City, the capital of Mexico. I study English and French at school because I love learning languages. I also play guitar in a band with three of my friends. We practise every Saturday afternoon. My absolute favourite food is tacos. My mum makes the best tacos in the world! I have never been on a plane before, but I hope to travel soon.",
  },
  {
    name: "Yuki",
    country: "Japan",
    flag: "JP",
    border: "border-violet-500",
    message:
      "Nice to meet you! My name is Yuki and I am from Tokyo, Japan. Tokyo is a very big and busy city. I love anime and reading manga in my free time. I take the train to school every morning. It is about twenty minutes. After school, I often help my mother cook Japanese food like miso soup and rice dishes. In the future, I want to be a teacher and help young children learn.",
  },
  {
    name: "Anna",
    country: "Poland",
    flag: "PL",
    border: "border-emerald-500",
    message:
      "Hi there! My name is Anna and I live in a small town near the mountains in Poland. The nature here is beautiful. In winter, I love going skiing with my family. It is my favourite sport! I study biology at school because I find animals and plants really interesting. At home, I have two cats. Their names are Luna and Star. They are very cute and I love them very much.",
  },
];

type Question = {
  id: number;
  text: string;
  answer: boolean;
};

const QUESTIONS: Question[] = [
  { id: 1, text: "Mia plays volleyball on the beach at weekends.", answer: true },
  { id: 2, text: "Mia's younger brother is ten years old.", answer: false },
  { id: 3, text: "Carlos studies English and French at school.", answer: true },
  { id: 4, text: "Carlos has already travelled by plane.", answer: false },
  { id: 5, text: "Yuki takes the train to school every morning.", answer: true },
  { id: 6, text: "Yuki wants to be a doctor in the future.", answer: false },
  { id: 7, text: "Anna goes skiing with her family in winter.", answer: true },
  { id: 8, text: "Anna has two cats named Luna and Star.", answer: true },
];

export default function PenPalsClient() {
  const isPro = useIsPro();
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [checked, setChecked] = useState(false);

  const { isLive, broadcast } = useLiveSync((payload) => {
    setAnswers(payload.answers as Record<number, boolean | null>);
    setChecked(payload.checked as boolean);
  });

  const [pdfLoading, setPdfLoading] = useState(false);

  const questionsTopRef = useRef<HTMLDivElement>(null);

  const answeredCount = QUESTIONS.filter((q) => answers[q.id] != null).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const correctCount = checked
    ? QUESTIONS.reduce((n, q) => n + (answers[q.id] === q.answer ? 1 : 0), 0)
    : null;
  const percent =
    correctCount !== null
      ? Math.round((correctCount / QUESTIONS.length) * 100)
      : null;

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const config: ReadingPDFConfig = {
        title: "Pen Pals",
        level: "A2",
        filename: "EnglishNerd_Pen-Pals_A2.pdf",
        passages: PEN_PALS.map((p) => ({ speaker: p.name, speakerSub: p.country, text: p.message })),
        trueFalse: QUESTIONS.map((q) => ({ text: q.text, answer: q.answer })),
      };
      await generateReadingPDF(config);
    } finally {
      setPdfLoading(false);
    }
  }

  function pick(id: number, val: boolean) {
    if (checked) return;
    setAnswers((p) => { const n = { ...p, [id]: val }; broadcast({ answers: n, checked: false, exNo: 1 }); return n; });
  }

  function check() {
    if (!allAnswered) return;
    setChecked(true);
    broadcast({ answers, checked: true, exNo: 1 });
    setTimeout(() => {
      if (!questionsTopRef.current) return;
      const top =
        questionsTopRef.current.getBoundingClientRect().top +
        window.scrollY -
        80;
      window.scrollTo({ top, behavior: "smooth" });
    }, 50);
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
      body: JSON.stringify({
        category: "reading",
        level: "a2",
        slug: "pen-pals",
        exerciseNo: 1,
        score: percent,
        questionsTotal: 8,
      }),
    }).catch(() => {});
  }, [checked, percent]);

  const grade =
    percent === null ? null : percent >= 80 ? "great" : percent >= 60 ? "ok" : "low";

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/reading">Reading</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/reading/a2">A2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Pen Pals</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Pen Pals
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-teal-100 px-3 py-1 text-xs font-black text-teal-700 border border-teal-200">
          A2
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Read messages from four pen pals and decide if each statement is True or False.
      </p>

      <div className="mt-3 flex items-center gap-3">
        <PDFButton onDownload={downloadPDF} loading={pdfLoading} />
      </div>

      {/* Layout grid */}
      <div className={`mt-10 grid gap-6 ${isPro ? "lg:grid-cols-[1fr_300px]" : "lg:grid-cols-[260px_1fr_260px]"}`}>
        {!isPro && <AdUnit variant="sidebar-dark" />}

        {/* Main content card */}
        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="space-y-6">

              {/* 2x2 pen pal profile cards */}
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Messages from pen pals</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  {PEN_PALS.map((pal) => (
                    <div
                      key={pal.name}
                      className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden border-l-4 ${pal.border}`}
                    >
                      <div className="p-5 sm:p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-black text-slate-500">
                            {pal.name[0]}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-sm">{pal.name}</p>
                            <p className="text-xs text-slate-400">{pal.country}</p>
                          </div>
                        </div>
                        <p className="text-slate-700 leading-relaxed text-base">{pal.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scroll anchor */}
              <div ref={questionsTopRef} />

              {/* Score panel */}
              {checked && percent !== null && (
                <div
                  className={`flex items-center gap-5 rounded-2xl border px-6 py-5 ${
                    grade === "great"
                      ? "border-emerald-400/40 bg-emerald-50"
                      : grade === "ok"
                      ? "border-amber-400/40 bg-amber-50"
                      : "border-red-400/40 bg-red-50"
                  }`}
                >
                  <div
                    className={`text-5xl font-black tabular-nums ${
                      grade === "great"
                        ? "text-emerald-600"
                        : grade === "ok"
                        ? "text-amber-600"
                        : "text-red-600"
                    }`}
                  >
                    {percent}<span className="text-2xl">%</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-600">
                      {correctCount} out of {QUESTIONS.length} correct
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#F5DA20] transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {grade === "great"
                        ? "Excellent! You understood the pen pal messages very well."
                        : grade === "ok"
                        ? "Good effort. Read the messages again and try once more."
                        : "Read the messages carefully again, then try again."}
                    </p>
                  </div>
                </div>
              )}

              {/* Questions card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Card header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <div>
                    <h2 className="text-[15px] font-black text-slate-800">True / False Questions</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Choose the correct answer for each statement.</p>
                  </div>
                  {!checked ? (
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-24 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
                          style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-400 tabular-nums">
                        {answeredCount}/{QUESTIONS.length}
                      </span>
                    </div>
                  ) : (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        grade === "great"
                          ? "bg-emerald-100 text-emerald-700"
                          : grade === "ok"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {correctCount}/{QUESTIONS.length}
                    </span>
                  )}
                </div>

                {/* Questions list */}
                <div className="divide-y divide-slate-100">
                  {QUESTIONS.map((q, idx) => {
                    const chosen = answers[q.id];
                    const isCorrect = checked && chosen === q.answer;
                    const isWrong = checked && chosen != null && chosen !== q.answer;

                    return (
                      <div
                        key={q.id}
                        className={`px-6 py-5 transition-colors duration-200 ${
                          isCorrect ? "bg-emerald-50" : isWrong ? "bg-red-50" : ""
                        }`}
                      >
                        <div className="flex gap-4">
                          {/* Number bubble */}
                          <div
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black transition-all ${
                              isCorrect
                                ? "bg-emerald-400 text-white"
                                : isWrong
                                ? "bg-red-400 text-white"
                                : chosen != null
                                ? "bg-[#F5DA20] text-black"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {checked
                              ? isCorrect
                                ? "✓"
                                : "✗"
                              : String(idx + 1).padStart(2, "0")}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-[15px] text-slate-700 leading-snug font-medium">
                              {q.text}
                            </p>

                            {/* TRUE / FALSE buttons */}
                            <div className="mt-3.5 grid grid-cols-2 gap-2">
                              {([true, false] as const).map((val) => {
                                const sel = chosen === val;
                                const ok = checked && sel && val === q.answer;
                                const bad = checked && sel && val !== q.answer;
                                const reveal = checked && !sel && val === q.answer;

                                return (
                                  <button
                                    key={String(val)}
                                    onClick={() => pick(q.id, val)}
                                    disabled={checked}
                                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all duration-150 ${
                                      ok
                                        ? "bg-emerald-400 text-white shadow-sm"
                                        : bad
                                        ? "bg-red-400 text-white shadow-sm"
                                        : reveal
                                        ? "border border-emerald-400/50 bg-emerald-50 text-emerald-700"
                                        : sel
                                        ? "bg-[#F5DA20] text-black shadow-sm"
                                        : checked
                                        ? "border border-slate-200 bg-slate-50 text-slate-300"
                                        : "border border-slate-200 bg-white text-slate-500 hover:border-[#F5DA20]/60 hover:bg-[#F5DA20]/10 hover:text-slate-700 active:scale-[0.97]"
                                    }`}
                                  >
                                    {val ? (
                                      <>
                                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                                        True
                                      </>
                                    ) : (
                                      <>
                                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                        False
                                      </>
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {checked && (
                              <p
                                className={`mt-2 text-xs font-medium ${
                                  isCorrect ? "text-emerald-600" : "text-red-500"
                                }`}
                              >
                                {isCorrect
                                  ? "Correct!"
                                  : `Incorrect. The answer is ${q.answer ? "True" : "False"}.`}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Card footer */}
                <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
                  {!checked ? (
                    <>
                      <button
                        onClick={check}
                        disabled={!allAnswered}
                        className="rounded-xl bg-[#F5DA20] px-6 py-2.5 text-sm font-black text-black transition hover:opacity-90 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Check Answers
                      </button>
                      {!allAnswered && (
                        <span className="text-xs text-slate-400">
                          {QUESTIONS.length - answeredCount} question
                          {QUESTIONS.length - answeredCount !== 1 ? "s" : ""} remaining
                        </span>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={reset}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {isPro ? (
          <ReadingRecommendations level="a2" currentSlug="pen-pals" />
        ) : (
          <AdUnit variant="sidebar-dark" />
        )}
      </div>
    </div>
  );
}
