"use client";

import { useState, useCallback } from "react";

type Person = {
  name: string;
  age: number;
  role: string;
  color: string;
  borderColor: string;
  text: string;
};

type Statement = {
  id: number;
  personIndex: number;
  text: string;
  answer: boolean;
};

const PEOPLE: Person[] = [
  {
    name: "Jake",
    age: 22,
    role: "University student",
    color: "bg-violet-50",
    borderColor: "border-violet-400",
    text:
      "I check my phone more than 50 times a day. I know that sounds a lot, but it just happens automatically. Last year I deleted Instagram for a whole month and I actually felt much more relaxed and less anxious. Now I only use it for direct messages, not for scrolling through posts. I think social media makes people compare themselves to others all the time, and that comparison is often unfair because people only share the best parts of their lives.",
  },
  {
    name: "Maya",
    age: 19,
    role: "Graphic designer",
    color: "bg-emerald-50",
    borderColor: "border-emerald-400",
    text:
      "For me, social media is not just entertainment -- it is part of my job. I use it to share my design work and find inspiration from other artists. On a typical day I spend around four hours online across different platforms. I do worry about how much screen time I have, but I find it genuinely difficult to reduce it when so much of my work depends on being connected. I think technology has completely changed the way creative people work and share ideas.",
  },
  {
    name: "Omar",
    age: 25,
    role: "Teacher",
    color: "bg-amber-50",
    borderColor: "border-amber-400",
    text:
      "About six months ago I introduced a no-phones rule in my classroom, and the difference has been remarkable. My students are significantly more focused during lessons and we have much better discussions. Outside school, I do use technology for planning lessons and finding resources, but when it comes to personal time I strongly prefer face-to-face interaction with friends and family. Every night before bed I read a physical book rather than looking at a screen.",
  },
  {
    name: "Priya",
    age: 21,
    role: "Blogger",
    color: "bg-sky-50",
    borderColor: "border-sky-400",
    text:
      "I actually earn money through Instagram, which is amazing but also quite a lot of pressure. I post new content every single day and currently have around 50,000 followers. I have to admit that sometimes I make my life look more perfect than it really is -- things like choosing the right background or editing photos to look better than reality. It bothers me a little because I genuinely believe authenticity is important, especially for younger followers who might compare themselves to what they see.",
  },
];

const STATEMENTS: Statement[] = [
  {
    id: 1,
    personIndex: 0,
    text: "Jake deleted Instagram for a month and felt more stressed during that time.",
    answer: false,
  },
  {
    id: 2,
    personIndex: 0,
    text: "Jake believes social media encourages unfair comparisons between people.",
    answer: true,
  },
  {
    id: 3,
    personIndex: 1,
    text: "Maya uses social media only for personal entertainment.",
    answer: false,
  },
  {
    id: 4,
    personIndex: 1,
    text: "Maya finds it hard to spend less time online because of her work.",
    answer: true,
  },
  {
    id: 5,
    personIndex: 2,
    text: "Omar banned phones in his classroom about six months ago.",
    answer: true,
  },
  {
    id: 6,
    personIndex: 2,
    text: "Omar uses technology for everything in his personal life as well as at work.",
    answer: false,
  },
  {
    id: 7,
    personIndex: 3,
    text: "Priya has more than 50,000 followers on Instagram.",
    answer: false,
  },
  {
    id: 8,
    personIndex: 3,
    text: "Priya sometimes presents her life as more perfect than it actually is.",
    answer: true,
  },
];

async function saveResult(score: number) {
  try {
    await fetch("/api/progress/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "reading",
        level: "b1",
        slug: "digital-lives",
        exerciseNo: 1,
        score,
        questionsTotal: 8,
      }),
    });
  } catch {
    // Silent -- never break exercise flow
  }
}

export default function DigitalLivesClient() {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>(() =>
    Object.fromEntries(STATEMENTS.map((s) => [s.id, null]))
  );
  const [checked, setChecked] = useState(false);
  const [saved, setSaved] = useState(false);

  const answered = Object.values(answers).filter((v) => v !== null).length;
  const progress = Math.round((answered / STATEMENTS.length) * 100);

  const handleAnswer = useCallback(
    (id: number, value: boolean) => {
      if (checked) return;
      setAnswers((prev) => ({ ...prev, [id]: value }));
    },
    [checked]
  );

  const handleCheck = useCallback(async () => {
    if (answered < STATEMENTS.length) return;
    setChecked(true);
    const correct = STATEMENTS.filter((s) => answers[s.id] === s.answer).length;
    const score = Math.round((correct / STATEMENTS.length) * 100);
    if (!saved) {
      setSaved(true);
      await saveResult(score);
    }
  }, [answered, answers, saved]);

  const handleReset = useCallback(() => {
    setAnswers(Object.fromEntries(STATEMENTS.map((s) => [s.id, null])));
    setChecked(false);
    setSaved(false);
  }, []);

  const correct = checked
    ? STATEMENTS.filter((s) => answers[s.id] === s.answer).length
    : 0;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Dark header */}
      <div className="bg-[#0E0F13] text-white">
        <div className="mx-auto max-w-3xl px-6 py-8">
          {/* Breadcrumb */}
          <div className="text-sm text-white/50">
            <a className="hover:text-white transition" href="/">Home</a>{" "}
            <span className="text-white/25">/</span>{" "}
            <a className="hover:text-white transition" href="/reading">Reading</a>{" "}
            <span className="text-white/25">/</span>{" "}
            <a className="hover:text-white transition" href="/reading/b1">B1</a>{" "}
            <span className="text-white/25">/</span>{" "}
            <span className="text-white/80">Digital Lives</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-violet-400 px-3 py-1 text-xs font-black text-black">
              B1
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
              True / False
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/60">
              8 questions
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-black md:text-3xl">Digital Lives</h1>
          <p className="mt-1 text-sm text-white/50">
            Read what four young people say about social media and technology. Decide if each statement is true or false.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-3xl px-6 py-8 space-y-8">

        {/* Reading texts -- 2x2 grid */}
        <section>
          <h2 className="mb-4 text-base font-bold text-slate-800">Read the texts</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {PEOPLE.map((person) => (
              <div
                key={person.name}
                className={`rounded-2xl border-2 ${person.borderColor} ${person.color} p-5`}
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white font-black text-slate-700 text-sm shadow-sm">
                    {person.name[0]}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-sm">{person.name}, {person.age}</p>
                    <p className="text-xs text-slate-500">{person.role}</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed text-sm">{person.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Progress bar */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
            <span>{answered} / {STATEMENTS.length} answered</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Statements */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-800">True or False?</h2>
          {STATEMENTS.map((stmt) => {
            const userAnswer = answers[stmt.id];
            const isCorrect = checked ? userAnswer === stmt.answer : null;

            return (
              <div
                key={stmt.id}
                className={`rounded-2xl border-2 bg-white p-4 transition ${
                  checked
                    ? isCorrect
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-red-400 bg-red-50"
                    : userAnswer !== null
                    ? "border-[#F5DA20]"
                    : "border-slate-200"
                }`}
              >
                <p className="mb-3 text-slate-700 leading-relaxed text-sm font-medium">
                  <span className="mr-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-500">
                    {stmt.id}
                  </span>
                  {stmt.text}
                </p>

                <div className="flex gap-2">
                  {([true, false] as const).map((val) => {
                    const label = val ? "TRUE" : "FALSE";
                    const selected = userAnswer === val;
                    const isThisCorrect = checked && val === stmt.answer;
                    const isThisWrong = checked && selected && val !== stmt.answer;

                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleAnswer(stmt.id, val)}
                        disabled={checked}
                        className={`rounded-xl px-5 py-2 text-xs font-black transition ${
                          isThisCorrect
                            ? "bg-emerald-400 text-black"
                            : isThisWrong
                            ? "bg-red-400 text-white"
                            : selected
                            ? "bg-[#F5DA20] text-black"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        } disabled:cursor-default`}
                      >
                        {label}
                      </button>
                    );
                  })}

                  {checked && (
                    <span className={`ml-auto text-xs font-bold ${isCorrect ? "text-emerald-600" : "text-red-500"}`}>
                      {isCorrect ? "Correct" : `Answer: ${stmt.answer ? "TRUE" : "FALSE"}`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {/* Result */}
        {checked && (
          <div className="rounded-2xl border-2 border-[#F5DA20] bg-[#F5DA20]/10 p-5 text-center">
            <p className="text-2xl font-black text-slate-800">
              {correct} / {STATEMENTS.length}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {correct === STATEMENTS.length
                ? "Perfect score! Excellent reading comprehension."
                : correct >= 6
                ? "Great job! Just a couple of mistakes."
                : correct >= 4
                ? "Good effort. Read the texts again to review your mistakes."
                : "Keep practising. Read more carefully and try again."}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          {!checked ? (
            <button
              type="button"
              onClick={handleCheck}
              disabled={answered < STATEMENTS.length}
              className="inline-flex items-center rounded-xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check Answers
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center rounded-xl border-2 border-slate-300 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:border-slate-400"
            >
              Try Again
            </button>
          )}
          <a
            href="/reading/b1"
            className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300"
          >
            Back to B1
          </a>
        </div>

      </div>
    </main>
  );
}
