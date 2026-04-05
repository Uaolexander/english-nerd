"use client";

import { useState, useEffect, useRef } from "react";
import AdUnit from "@/components/AdUnit";

const TEXT = `The concept of the attention economy rests on a simple but profound premise: in an age of information abundance, human attention has become the scarcest and most valuable resource. Technology companies, media platforms and advertisers compete aggressively for a finite commodity that cannot be manufactured or expanded. The phrase was popularised by psychologist and Nobel laureate Herbert Simon, who observed in 1971 that information consumes the attention of its recipients and that a wealth of information creates a poverty of attention.

The mechanisms by which platforms capture and retain attention have grown increasingly sophisticated. Variable reward schedules, borrowed from behavioural psychology research on gambling, underpin the design of social media feeds. Unpredictable rewards, such as an unexpected like or a surprising post, trigger dopamine release and compel continued engagement more effectively than predictable ones. This architecture is not accidental. Former employees of major tech companies have testified that engagement metrics, rather than user wellbeing, drive product decisions.

The implications extend beyond individual behaviour. Some researchers argue that the commodification of attention has degraded the quality of public discourse by systematically rewarding outrage, simplification and tribal affiliation over nuance and complexity. Others contend that moral panics about technology are cyclical and that previous innovations, from the printing press to television, generated similar anxieties that ultimately proved overstated.

What distinguishes the current moment, proponents of regulation argue, is the unprecedented scale, speed and personalisation of these systems, which may require novel regulatory frameworks rather than analogies to earlier media.`;

type Question = {
  id: number;
  text: string;
  options: { label: string; text: string }[];
  answer: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "According to Herbert Simon's 1971 observation, what is the consequence of an abundance of information?",
    options: [
      { label: "A", text: "It raises the market value of advertising." },
      { label: "B", text: "It creates a scarcity of human attention." },
      { label: "C", text: "It improves the quality of public discourse." },
    ],
    answer: "B",
  },
  {
    id: 2,
    text: "The text states that variable reward schedules used in social media design are borrowed from research into which field?",
    options: [
      { label: "A", text: "Neuroscience and brain-scanning studies." },
      { label: "B", text: "Behavioural psychology research on gambling." },
      { label: "C", text: "Cognitive science and attention management." },
    ],
    answer: "B",
  },
  {
    id: 3,
    text: "What does the text say primarily drives product decisions at major tech companies, according to former employees?",
    options: [
      { label: "A", text: "User wellbeing and mental health outcomes." },
      { label: "B", text: "Regulatory compliance and legal obligations." },
      { label: "C", text: "Engagement metrics rather than user wellbeing." },
    ],
    answer: "C",
  },
  {
    id: 4,
    text: "According to some researchers cited in the text, how has the commodification of attention affected public discourse?",
    options: [
      { label: "A", text: "It has encouraged nuanced and complex debate." },
      { label: "B", text: "It has degraded discourse by rewarding outrage and simplification." },
      { label: "C", text: "It has had no measurable effect on public conversation." },
    ],
    answer: "B",
  },
  {
    id: 5,
    text: "What is the counterargument presented against concerns about the attention economy?",
    options: [
      { label: "A", text: "Attention is not actually a finite resource and can be expanded through training." },
      { label: "B", text: "Tech companies have already agreed to voluntary regulation." },
      { label: "C", text: "Moral panics about new technologies are recurrent and often prove to have been exaggerated." },
    ],
    answer: "C",
  },
  {
    id: 6,
    text: "According to proponents of regulation, what makes the current situation distinct from earlier media developments?",
    options: [
      { label: "A", text: "The unprecedented scale, speed and personalisation of current systems." },
      { label: "B", text: "The fact that attention was not commodified by previous media." },
      { label: "C", text: "The absence of any historical analogies to draw lessons from." },
    ],
    answer: "A",
  },
];

export default function AttentionEconomyClient() {
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [checked, setChecked] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

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
    setAnswers((prev) => ({ ...prev, [id]: label }));
  }

  function check() {
    if (!allAnswered) return;
    setChecked(true);
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
  }

  useEffect(() => {
    if (!checked || percent === null) return;
    fetch("/api/progress/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "reading",
        level: "c1",
        slug: "the-attention-economy",
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
    <div className="min-h-screen bg-slate-50">
      {/* Dark header bar */}
      <div className="bg-[#0E0F13] text-white">
        <div className="mx-auto max-w-3xl px-6 py-6">
          {/* Breadcrumb */}
          <div className="text-sm text-white/55">
            <a className="hover:text-white transition" href="/">Home</a>{" "}
            <span className="text-white/30">/</span>{" "}
            <a className="hover:text-white transition" href="/reading">Reading</a>{" "}
            <span className="text-white/30">/</span>{" "}
            <a className="hover:text-white transition" href="/reading/c1">C1</a>{" "}
            <span className="text-white/30">/</span>{" "}
            <span className="text-white/80">The Attention Economy</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-sky-400 px-3 py-1 text-xs font-black text-black">
              C1
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/60">
              Comprehension
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/60">
              6 questions
            </span>
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">
            The Attention Economy
          </h1>
          <p className="mt-1 text-sm text-white/55">
            Read the analytical essay and choose the best answer for each question.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-8">

        {/* Reading text */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-base font-black text-slate-800 uppercase tracking-wide mb-4">
            Read the text
          </h2>
          <div className="space-y-4">
            {TEXT.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-slate-700 leading-relaxed text-base">
                {paragraph}
              </p>
            ))}
          </div>
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
                  className={`font-semibold text-sm leading-relaxed mb-4 ${
                    checked && isCorrect === true
                      ? "text-emerald-700"
                      : checked && isCorrect === false
                      ? "text-red-700"
                      : "text-slate-800"
                  }`}
                >
                  <span className="mr-2 text-slate-400 font-normal text-xs">{q.id}.</span>
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
                  ? "Outstanding analytical reading. Well done."
                  : grade === "ok"
                  ? "Good effort. Re-read the relevant paragraphs for any questions you missed."
                  : "Keep practising. Read the text carefully, paying attention to how each argument is qualified."}
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

      <div className="mt-10">
        <AdUnit variant="inline-light" />
      </div>
      </div>
    </div>
  );
}
