"use client";

import { useState, useEffect, useRef } from "react";
import AdUnit from "@/components/AdUnit";
import { useIsPro } from "@/lib/ProContext";
import ReadingRecommendations from "@/components/ReadingRecommendations";
import PDFButton from "@/components/PDFButton";
import { generateReadingPDF, type ReadingPDFConfig } from "@/lib/generateReadingPDF";
import { useLiveSync } from "@/lib/useLiveSync";

const TEXT = `Emma is 10 years old. She lives with her mum, dad, and younger brother. She gets up at 7 o'clock every morning. First she washes her face and gets dressed. Then she goes to the kitchen for breakfast. She eats cereal and drinks orange juice. Sometimes her mum makes toast too.

Emma goes to school by bus. The bus stop is near her house. The journey takes about fifteen minutes. School starts at 9 o'clock. Emma's favourite subject is art. She loves drawing and painting pictures. She also likes maths because she enjoys solving problems. Science is interesting too, but art is her number one.

Emma has lunch at school at 12 o'clock. She usually eats a sandwich and an apple. She sits with her friends in the lunch hall and they talk and laugh together.

After school she goes home at 3 o'clock. She puts her bag down and has a small snack. Then she does her homework at the kitchen table. After homework she watches TV for a little while. In the evening she reads a book in her room before bed. She always reads for at least twenty minutes. She goes to bed at 9 o'clock. Emma thinks a good school day needs a good night's sleep.`;

type Question = {
  id: number;
  text: string;
  options: { label: string; text: string }[];
  answer: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What time does Emma get up?",
    options: [
      { label: "A", text: "6 o'clock" },
      { label: "B", text: "7 o'clock" },
      { label: "C", text: "8 o'clock" },
    ],
    answer: "B",
  },
  {
    id: 2,
    text: "How does Emma go to school?",
    options: [
      { label: "A", text: "by car" },
      { label: "B", text: "by bike" },
      { label: "C", text: "by bus" },
    ],
    answer: "C",
  },
  {
    id: 3,
    text: "What is Emma's favourite subject?",
    options: [
      { label: "A", text: "maths" },
      { label: "B", text: "art" },
      { label: "C", text: "music" },
    ],
    answer: "B",
  },
  {
    id: 4,
    text: "What time does Emma have lunch?",
    options: [
      { label: "A", text: "11 o'clock" },
      { label: "B", text: "12 o'clock" },
      { label: "C", text: "1 o'clock" },
    ],
    answer: "B",
  },
  {
    id: 5,
    text: "What does Emma eat for lunch?",
    options: [
      { label: "A", text: "a pizza" },
      { label: "B", text: "a sandwich" },
      { label: "C", text: "pasta" },
    ],
    answer: "B",
  },
  {
    id: 6,
    text: "What does Emma do before bed?",
    options: [
      { label: "A", text: "watches TV" },
      { label: "B", text: "plays games" },
      { label: "C", text: "reads a book" },
    ],
    answer: "C",
  },
];

export default function MySchoolDayClient() {
  const isPro = useIsPro();
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [checked, setChecked] = useState(false);

  const { isLive, broadcast } = useLiveSync((payload) => {
    setAnswers(payload.answers as Record<number, string | null>);
    setChecked(payload.checked as boolean);
  });

  const resultsRef = useRef<HTMLDivElement>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const config: ReadingPDFConfig = {
        title: "My School Day",
        level: "A1",
        filename: "EnglishNerd_My-School-Day_A1.pdf",
        passages: [{ text: TEXT }],
        multipleChoiceLetter: QUESTIONS.map(q => ({
          question: q.text,
          options: q.options,
          answer: q.answer,
        })),
      };
      await generateReadingPDF(config);
    } finally {
      setPdfLoading(false);
    }
  }

  const answeredCount = QUESTIONS.filter((q) => answers[q.id] != null).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const correctCount = checked
    ? QUESTIONS.reduce((n, q) => n + (answers[q.id] === q.answer ? 1 : 0), 0)
    : null;
  const percent =
    correctCount !== null
      ? Math.round((correctCount / QUESTIONS.length) * 100)
      : null;

  function pick(id: number, label: string) {
    if (checked) return;
    setAnswers((prev) => { const n = { ...prev, [id]: label }; broadcast({ answers: n, checked: false, exNo: 1 }); return n; });
  }

  function check() {
    if (!allAnswered) return;
    setChecked(true);
    broadcast({ answers, checked: true, exNo: 1 });
    setTimeout(() => {
      if (resultsRef.current) {
        const top =
          resultsRef.current.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
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
        level: "a1",
        slug: "my-school-day",
        exerciseNo: 1,
        score: percent,
        questionsTotal: 6,
      }),
    }).catch(() => {});
  }, [checked, percent]);

  const grade =
    percent === null
      ? null
      : percent >= 80
      ? "great"
      : percent >= 60
      ? "ok"
      : "low";

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/reading">Reading</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/reading/a1">A1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">My School Day</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          My School Day
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
          A1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Read the story and decide if each statement is True or False.
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

            {/* Reading text */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <h2 className="text-base font-black text-slate-800 uppercase tracking-wide mb-4">
                Read the text
              </h2>
              <p className="text-slate-700 leading-relaxed text-base">{TEXT}</p>
            </div>

            {/* Progress bar */}
            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                <span>Progress</span>
                <span>{answeredCount} / {QUESTIONS.length}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
                  style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Questions */}
            <div ref={resultsRef} className="mt-6 flex flex-col gap-5">
              {QUESTIONS.map((q) => {
                const chosen = answers[q.id];
                const isCorrect = checked ? chosen === q.answer : null;

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl border bg-white shadow-sm p-5 transition ${
                      checked && isCorrect === true
                        ? "border-emerald-400 bg-emerald-50"
                        : checked && isCorrect === false
                        ? "border-red-400 bg-red-50"
                        : "border-slate-200"
                    }`}
                  >
                    <p
                      className={`font-semibold text-base mb-4 ${
                        checked && isCorrect === true
                          ? "text-emerald-700"
                          : checked && isCorrect === false
                          ? "text-red-700"
                          : "text-slate-800"
                      }`}
                    >
                      <span className="mr-2 text-slate-400 font-normal text-sm">{q.id}.</span>
                      {q.text}
                    </p>

                    <div className="flex flex-col gap-2">
                      {q.options.map((opt) => {
                        const selected = chosen === opt.label;
                        const isThisCorrect = opt.label === q.answer;

                        let btnClass =
                          "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold text-left transition ";

                        if (!checked) {
                          btnClass += selected
                            ? "bg-[#F5DA20]/20 border-[#F5DA20] text-slate-800"
                            : "border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50 cursor-pointer";
                        } else {
                          if (selected && isThisCorrect) {
                            btnClass += "bg-emerald-50 border-emerald-400 text-emerald-700";
                          } else if (selected && !isThisCorrect) {
                            btnClass += "bg-red-50 border-red-400 text-red-700";
                          } else if (!selected && isThisCorrect) {
                            btnClass += "bg-emerald-50 border-emerald-300 text-emerald-700";
                          } else {
                            btnClass += "border-slate-200 text-slate-400";
                          }
                        }

                        return (
                          <button
                            key={opt.label}
                            type="button"
                            className={btnClass}
                            onClick={() => pick(q.id, opt.label)}
                            disabled={checked}
                          >
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black border ${
                                !checked
                                  ? selected
                                    ? "bg-[#F5DA20] border-[#F5DA20] text-black"
                                    : "border-slate-300 text-slate-500"
                                  : isThisCorrect
                                  ? "bg-emerald-400 border-emerald-400 text-white"
                                  : selected
                                  ? "bg-red-400 border-red-400 text-white"
                                  : "border-slate-300 text-slate-400"
                              }`}
                            >
                              {opt.label}
                            </span>
                            <span>{opt.text}</span>
                            {checked && isThisCorrect && (
                              <span className="ml-auto text-emerald-500 font-black text-base">
                                ✓
                              </span>
                            )}
                            {checked && selected && !isThisCorrect && (
                              <span className="ml-auto text-red-500 font-black text-base">
                                ✗
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Check / score area */}
            <div className="mt-8 flex flex-col items-center gap-4">
              {!checked ? (
                <button
                  type="button"
                  onClick={check}
                  disabled={!allAnswered}
                  className={`rounded-2xl px-8 py-3 text-base font-black transition ${
                    allAnswered
                      ? "bg-[#F5DA20] text-black hover:opacity-90"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {allAnswered ? "Check Answers" : `Answer all ${QUESTIONS.length} questions`}
                </button>
              ) : (
                <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm p-6 text-center">
                  <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">
                    Your score
                  </p>
                  <p
                    className={`mt-1 text-5xl font-black ${
                      grade === "great"
                        ? "text-emerald-500"
                        : grade === "ok"
                        ? "text-[#F5DA20]"
                        : "text-red-500"
                    }`}
                  >
                    {correctCount} / {QUESTIONS.length}
                  </p>
                  <p className="mt-1 text-slate-500 text-sm">{percent}% correct</p>
                  <p className="mt-3 text-slate-700 font-semibold">
                    {grade === "great"
                      ? "Excellent work! Keep it up."
                      : grade === "ok"
                      ? "Good effort. Review the wrong answers."
                      : "Keep practising. Read the text again and try once more."}
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-4 rounded-xl border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 transition"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

          </div>
        </section>

        {isPro ? (
          <ReadingRecommendations level="a1" currentSlug="my-school-day" />
        ) : (
          <AdUnit variant="sidebar-dark" />
        )}
      </div>
    </div>
  );
}
