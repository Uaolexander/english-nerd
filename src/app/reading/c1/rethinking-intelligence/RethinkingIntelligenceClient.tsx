"use client";

import { useState, useEffect, useRef } from "react";

type Profile = {
  name: string;
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
  text: string;
};

const PROFILES: Profile[] = [
  {
    name: "Prof. Martinez",
    title: "Cognitive Neuroscientist",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500",
    text:
      "Traditional IQ tests measure a narrow band of cognitive ability and fail to capture creativity, emotional intelligence and practical reasoning. My research into neuroplasticity strongly suggests that intelligence is not a fixed trait but a dynamic capacity shaped by experience and environment throughout the lifespan. The heritability estimates frequently cited in popular media are regularly overstated and misrepresent what the scientific literature actually supports. When we expand our definition of intelligence beyond the logico-mathematical, we find that human cognitive potential is far broader and more malleable than standardised testing would have us believe.",
  },
  {
    name: "Dr. Nakamura",
    title: "Educational Psychologist",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500",
    text:
      "Howard Gardner's theory of multiple intelligences offers a compelling framework for understanding the full spectrum of human ability. Educational systems systematically undervalue spatial, musical and interpersonal intelligences in favour of linguistic and logical-mathematical ones, disadvantaging large numbers of students. My longitudinal study tracked children identified as gifted at age seven and found that, contrary to popular assumption, they do not consistently outperform their peers by adulthood. Early identification of giftedness is a poor predictor of long-term achievement across most domains of life.",
  },
  {
    name: "Prof. Osei",
    title: "Behavioural Economist",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500",
    text:
      "What we conventionally call intelligence is far more context-dependent than is commonly acknowledged. Research my team conducted demonstrates that financial stress temporarily reduces cognitive capacity by an amount equivalent to losing approximately 13 IQ points. This finding has profound implications: it suggests that poverty itself constrains intellectual performance, rather than the reverse relationship assumed in many policy debates. Cognitive bandwidth is a finite resource. When mental energy is consumed by the immediate pressures of scarcity, fewer resources remain available for abstract reasoning, planning and problem-solving.",
  },
  {
    name: "Dr. Lindqvist",
    title: "Geneticist",
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500",
    text:
      "Genetic factors do account for a meaningful proportion of variance in measured intelligence, with estimates converging around fifty percent. However, this figure is routinely misunderstood. Heritability is not destiny. Gene-environment interaction means that the same genetic predispositions can lead to very different outcomes depending on the circumstances in which a child develops. Deterministic interpretations of genetic data are therefore scientifically unjustified and potentially harmful. The evidence strongly supports early childhood intervention programmes as highly effective in raising cognitive outcomes, which is precisely what a simplistic genetic determinist position would not predict.",
  },
];

type Statement = {
  id: number;
  text: string;
  answer: boolean;
  person: string;
};

const STATEMENTS: Statement[] = [
  {
    id: 1,
    text: "Prof. Martinez argues that intelligence is a fixed biological trait that cannot be significantly altered by experience.",
    answer: false,
    person: "Prof. Martinez",
  },
  {
    id: 2,
    text: "Prof. Martinez believes the heritability figures reported in popular media tend to exaggerate what the scientific evidence supports.",
    answer: true,
    person: "Prof. Martinez",
  },
  {
    id: 3,
    text: "Dr. Nakamura's longitudinal research found that children identified as gifted at age seven reliably outperform peers in adulthood.",
    answer: false,
    person: "Dr. Nakamura",
  },
  {
    id: 4,
    text: "Dr. Nakamura claims that educational systems give insufficient attention to spatial and musical intelligences.",
    answer: true,
    person: "Dr. Nakamura",
  },
  {
    id: 5,
    text: "Prof. Osei's research indicates that financial stress can reduce cognitive performance by an amount comparable to losing around 13 IQ points.",
    answer: true,
    person: "Prof. Osei",
  },
  {
    id: 6,
    text: "Prof. Osei contends that low intelligence is primarily what causes people to experience poverty.",
    answer: false,
    person: "Prof. Osei",
  },
  {
    id: 7,
    text: "Dr. Lindqvist acknowledges that genetic factors account for roughly half of the variance observed in measured intelligence.",
    answer: true,
    person: "Dr. Lindqvist",
  },
  {
    id: 8,
    text: "Dr. Lindqvist opposes early childhood intervention programmes, viewing them as incompatible with a genetic understanding of intelligence.",
    answer: false,
    person: "Dr. Lindqvist",
  },
];

export default function RethinkingIntelligenceClient() {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [checked, setChecked] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const answeredCount = STATEMENTS.filter((s) => answers[s.id] != null).length;
  const allAnswered = answeredCount === STATEMENTS.length;

  const correctCount = checked
    ? STATEMENTS.reduce((n, s) => n + (answers[s.id] === s.answer ? 1 : 0), 0)
    : null;
  const percent =
    correctCount !== null
      ? Math.round((correctCount / STATEMENTS.length) * 100)
      : null;

  function pick(id: number, val: boolean) {
    if (checked) return;
    setAnswers((prev) => ({ ...prev, [id]: val }));
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
        slug: "rethinking-intelligence",
        exerciseNo: 1,
        score: percent,
        questionsTotal: 8,
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
            <span className="text-white/80">Rethinking Intelligence</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-sky-400 px-3 py-1 text-xs font-black text-black">
              C1
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/60">
              True / False
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/60">
              8 questions
            </span>
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">
            Rethinking Intelligence
          </h1>
          <p className="mt-1 text-sm text-white/55">
            Read what four researchers say about intelligence. Decide whether each statement is True or False based on what the researcher actually claims.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-8">

        {/* Profiles grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {PROFILES.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border-l-4 ${p.borderColor} ${p.bgColor} bg-white border border-slate-200 shadow-sm p-6`}
            >
              <h2 className={`text-base font-black ${p.color}`}>{p.name}</h2>
              <p className="text-xs font-semibold text-slate-400 mb-3">{p.title}</p>
              <p className="text-slate-700 leading-relaxed text-sm">{p.text}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
            <span>Progress</span>
            <span>{answeredCount} / {STATEMENTS.length}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
              style={{ width: `${(answeredCount / STATEMENTS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Statements */}
        <div ref={resultsRef} className="mt-6 flex flex-col gap-4">
          {STATEMENTS.map((s) => {
            const chosen = answers[s.id];
            const isCorrect = checked ? chosen === s.answer : null;

            return (
              <div
                key={s.id}
                className={`rounded-2xl border bg-white shadow-sm p-5 transition ${
                  checked && isCorrect === true
                    ? "border-emerald-400 bg-emerald-50"
                    : checked && isCorrect === false
                    ? "border-red-400 bg-red-50"
                    : "border-slate-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <p
                      className={`font-semibold text-sm leading-relaxed ${
                        checked && isCorrect === true
                          ? "text-emerald-700"
                          : checked && isCorrect === false
                          ? "text-red-700"
                          : "text-slate-800"
                      }`}
                    >
                      <span className="mr-2 text-slate-400 font-normal text-xs">
                        {s.id}.
                      </span>
                      {s.text}
                    </p>
                    <p className="mt-1 text-xs text-slate-400 font-medium">{s.person}</p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {(["TRUE", "FALSE"] as const).map((label) => {
                      const val = label === "TRUE";
                      const selected = chosen === val;
                      let btnClass =
                        "rounded-xl border px-4 py-2 text-sm font-bold transition select-none ";

                      if (!checked) {
                        btnClass += selected
                          ? "bg-[#F5DA20] border-[#F5DA20] text-black"
                          : "border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700 cursor-pointer";
                      } else {
                        const isThisCorrect = val === s.answer;
                        if (selected && isThisCorrect) {
                          btnClass += "bg-emerald-400 border-emerald-400 text-white";
                        } else if (selected && !isThisCorrect) {
                          btnClass += "bg-red-400 border-red-400 text-white";
                        } else if (!selected && isThisCorrect) {
                          btnClass += "bg-emerald-100 border-emerald-400 text-emerald-700";
                        } else {
                          btnClass += "border-slate-200 text-slate-300";
                        }
                      }

                      return (
                        <button
                          key={label}
                          type="button"
                          className={btnClass}
                          onClick={() => pick(s.id, val)}
                          disabled={checked}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {checked && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    {isCorrect ? (
                      <span className="text-emerald-600 font-semibold">
                        Correct! The statement is {s.answer ? "True" : "False"}.
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Wrong. The correct answer is{" "}
                        <span className="uppercase font-black">
                          {s.answer ? "True" : "False"}
                        </span>
                        .
                      </span>
                    )}
                  </div>
                )}
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
              {allAnswered ? "Check Answers" : `Answer all ${STATEMENTS.length} questions`}
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
                {correctCount} / {STATEMENTS.length}
              </p>
              <p className="mt-1 text-slate-500 text-sm">{percent}% correct</p>
              <p className="mt-3 text-slate-700 font-semibold">
                {grade === "great"
                  ? "Outstanding. You read with precision and care."
                  : grade === "ok"
                  ? "Good effort. Review the statements you missed and re-read those sections."
                  : "Keep practising. Read each researcher's text closely and watch for hedging language."}
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
    </div>
  );
}
