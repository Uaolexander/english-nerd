"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type InputQ = {
  id: string;
  prompt: string;
  hint: string;
  correct: string[];
  explanation: string;
};

type ExSet = {
  no: 1 | 2 | 3 | 4;
  title: string;
  instructions: string;
  questions: InputQ[];
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/'/g, "'").replace(/'/g, "'");
}

function isAccepted(val: string, correct: string[]) {
  const n = normalize(val);
  return correct.some((c) => normalize(c) === n);
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Affirmative: write am / is / are + going to + base form",
    instructions:
      "Write the correct be going to form. Use am with I, is with he / she / it, are with you / we / they. The main verb stays in base form after going to.",
    questions: [
      { id: "1-1", prompt: "She ___ (visit) her grandparents next weekend.", hint: "(visit)", correct: ["is going to visit"], explanation: "She → is going to visit." },
      { id: "1-2", prompt: "I ___ (start) a new course in September.", hint: "(start)", correct: ["am going to start", "'m going to start"], explanation: "I → am going to start." },
      { id: "1-3", prompt: "They ___ (buy) a new car soon.", hint: "(buy)", correct: ["are going to buy"], explanation: "They → are going to buy." },
      { id: "1-4", prompt: "He ___ (apply) for the job.", hint: "(apply)", correct: ["is going to apply"], explanation: "He → is going to apply." },
      { id: "1-5", prompt: "We ___ (travel) to Japan next year.", hint: "(travel)", correct: ["are going to travel"], explanation: "We → are going to travel." },
      { id: "1-6", prompt: "Look! The ladder is shaking — he ___ (fall).", hint: "(fall)", correct: ["is going to fall"], explanation: "Visible evidence → is going to fall." },
      { id: "1-7", prompt: "You ___ (love) this restaurant.", hint: "(love)", correct: ["are going to love"], explanation: "You → are going to love." },
      { id: "1-8", prompt: "My sister ___ (have) a baby.", hint: "(have)", correct: ["is going to have"], explanation: "My sister (= she) → is going to have." },
      { id: "1-9", prompt: "It ___ (be) a long journey.", hint: "(be)", correct: ["is going to be"], explanation: "It → is going to be." },
      { id: "1-10", prompt: "The children ___ (perform) in the school play.", hint: "(perform)", correct: ["are going to perform"], explanation: "The children (= they) → are going to perform." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: write am not / isn't / aren't + going to + base form",
    instructions:
      "Write the full negative be going to form. Use I'm not, isn't, or aren't. Never use don't / doesn't with going to.",
    questions: [
      { id: "2-1", prompt: "She ___ (come) to the party tonight.", hint: "(come)", correct: ["isn't going to come", "is not going to come"], explanation: "She + negative → isn't going to come." },
      { id: "2-2", prompt: "I ___ (accept) their offer.", hint: "(accept)", correct: ["'m not going to accept", "am not going to accept"], explanation: "I + negative → 'm not going to accept." },
      { id: "2-3", prompt: "They ___ (wait) any longer.", hint: "(wait)", correct: ["aren't going to wait", "are not going to wait"], explanation: "They + negative → aren't going to wait." },
      { id: "2-4", prompt: "He ___ (change) his plans.", hint: "(change)", correct: ["isn't going to change", "is not going to change"], explanation: "He + negative → isn't going to change." },
      { id: "2-5", prompt: "We ___ (stay) for dinner.", hint: "(stay)", correct: ["aren't going to stay", "are not going to stay"], explanation: "We + negative → aren't going to stay." },
      { id: "2-6", prompt: "It ___ (be) easy.", hint: "(be)", correct: ["isn't going to be", "is not going to be"], explanation: "It + negative → isn't going to be." },
      { id: "2-7", prompt: "You ___ (need) an umbrella — the forecast is sunny.", hint: "(need)", correct: ["aren't going to need", "are not going to need"], explanation: "You + negative → aren't going to need." },
      { id: "2-8", prompt: "The project ___ (finish) on time.", hint: "(finish)", correct: ["isn't going to finish", "is not going to finish"], explanation: "The project (= it) + negative → isn't going to finish." },
      { id: "2-9", prompt: "She ___ (forget) this day.", hint: "(forget)", correct: ["isn't going to forget", "is not going to forget"], explanation: "She + negative → isn't going to forget." },
      { id: "2-10", prompt: "The kids ___ (eat) their vegetables.", hint: "(eat)", correct: ["aren't going to eat", "are not going to eat"], explanation: "The kids (= they) + negative → aren't going to eat." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions: write the question or short answer",
    instructions:
      "Write the correct be going to question or short answer. Start questions with Am / Is / Are. Short answers use only the auxiliary.",
    questions: [
      { id: "3-1", prompt: "___ she going to leave? (leave)", hint: "(leave)", correct: ["is she going to leave?", "is she going to leave"], explanation: "She → Is: Is she going to leave?" },
      { id: "3-2", prompt: "___ you going to apply? (apply)", hint: "(apply)", correct: ["are you going to apply?", "are you going to apply"], explanation: "You → Are: Are you going to apply?" },
      { id: "3-3", prompt: "___ they going to join us? (join)", hint: "(join)", correct: ["are they going to join us?", "are they going to join us", "are they going to join?", "are they going to join"], explanation: "They → Are: Are they going to join us?" },
      { id: "3-4", prompt: "___ he going to call back? (call)", hint: "(call)", correct: ["is he going to call back?", "is he going to call back", "is he going to call?", "is he going to call"], explanation: "He → Is: Is he going to call back?" },
      { id: "3-5", prompt: "___ I going to pass the exam? (pass)", hint: "(pass)", correct: ["am i going to pass the exam?", "am i going to pass the exam", "am i going to pass?", "am i going to pass"], explanation: "I → Am: Am I going to pass?" },
      { id: "3-6", prompt: "___ it going to rain? (rain)", hint: "(rain)", correct: ["is it going to rain?", "is it going to rain"], explanation: "It → Is: Is it going to rain?" },
      { id: "3-7", prompt: "\"Is it going to rain?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["it is", "yes, it is"], explanation: "Short answer with is: Yes, it is." },
      { id: "3-8", prompt: "\"Are you going to stay?\" — \"No, ___.\"", hint: "(short answer)", correct: ["i'm not", "i am not", "no, i'm not", "no, i am not"], explanation: "Short negative answer: No, I'm not." },
      { id: "3-9", prompt: "\"Is she going to pass?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["she is", "yes, she is"], explanation: "Short answer with is: Yes, she is." },
      { id: "3-10", prompt: "\"Are they going to move?\" — \"No, ___.\"", hint: "(short answer)", correct: ["they aren't", "they are not", "no, they aren't", "no, they are not"], explanation: "Short negative answer: No, they aren't." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: affirmative, negative, and questions",
    instructions:
      "Write the correct be going to form. Read each sentence carefully to decide if it is affirmative, negative, or a question.",
    questions: [
      { id: "4-1", prompt: "Look at those clouds! It ___ (rain) soon.", hint: "(rain)", correct: ["is going to rain"], explanation: "Visible evidence → is going to rain." },
      { id: "4-2", prompt: "I ___ (not / give up) — I've worked too hard for this.", hint: "(not / give up)", correct: ["'m not going to give up", "am not going to give up"], explanation: "I + negative → 'm not going to give up." },
      { id: "4-3", prompt: "___ (you / help) me with this? (help)", hint: "(you / help)", correct: ["are you going to help me?", "are you going to help me with this?", "are you going to help?", "are you going to help"], explanation: "You → Are you going to help?" },
      { id: "4-4", prompt: "They ___ (announce) the results tomorrow.", hint: "(announce)", correct: ["are going to announce"], explanation: "They → are going to announce." },
      { id: "4-5", prompt: "He ___ (not / make) it in time — his train is delayed.", hint: "(not / make)", correct: ["isn't going to make", "is not going to make"], explanation: "He + negative → isn't going to make it." },
      { id: "4-6", prompt: "We ___ (paint) the living room this weekend.", hint: "(paint)", correct: ["are going to paint"], explanation: "We → are going to paint." },
      { id: "4-7", prompt: "___ (she / study) abroad? (study)", hint: "(she / study)", correct: ["is she going to study abroad?", "is she going to study?", "is she going to study"], explanation: "She → Is she going to study?" },
      { id: "4-8", prompt: "She ___ (be) a brilliant scientist one day.", hint: "(be)", correct: ["is going to be"], explanation: "She → is going to be." },
      { id: "4-9", prompt: "\"Are you going to quit?\" — \"No, ___.\"", hint: "(short answer)", correct: ["i'm not", "i am not", "no, i'm not", "no, i am not"], explanation: "Short negative: No, I'm not." },
      { id: "4-10", prompt: "The company ___ (not / expand) next year.", hint: "(not / expand)", correct: ["isn't going to expand", "is not going to expand"], explanation: "The company (= it) + negative → isn't going to expand." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Affirmative",
  2: "Negative",
  3: "Questions",
  4: "Mixed",
};

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function FillInBlankClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const current = SETS[exNo];

  const { save } = useProgress();

  useEffect(() => {
    if (checked && score) {
      save(exNo, score.percent, score.total);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const score = useMemo(() => {
    if (!checked) return null;
    let correct = 0;
    for (const q of current.questions) {
      if (isAccepted(answers[q.id] ?? "", q.correct)) correct++;
    }
    const total = current.questions.length;
    return { correct, total, percent: Math.round((correct / total) * 100) };
  }, [checked, current, answers]);

  function reset() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked(false);
    setAnswers({});
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setAnswers({});
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/be-going-to">Be Going To</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Fill in the Blank</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Be Going To{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Writing</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Type the correct <b>be going to</b> form of the verb in brackets. Four exercise sets — affirmative, negative, questions, and mixed. Remember: only am / is / are changes, not &quot;going to&quot;.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left ad */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
            </div>
          </aside>

          {/* Main content */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {tab === "exercises" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-black text-slate-900">{current.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">{current.instructions}</p>
                    <div className="mt-3 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3, 4] as const).map((n) => (
                        <button key={n} onClick={() => switchSet(n)}
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    {current.questions.map((q, idx) => {
                      const val = answers[q.id] ?? "";
                      const answered = normalize(val) !== "";
                      const correct = checked && answered && isAccepted(val, q.correct);
                      const wrong = checked && answered && !correct;
                      const noAnswer = checked && !answered;

                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900 leading-relaxed">
                                {q.prompt.split("___").map((part, i, arr) =>
                                  i < arr.length - 1 ? (
                                    <span key={i}>
                                      {part}
                                      <span className="inline-block align-baseline mx-1">
                                        <input
                                          type="text"
                                          value={val}
                                          disabled={checked}
                                          autoComplete="off"
                                          autoCorrect="off"
                                          autoCapitalize="off"
                                          spellCheck={false}
                                          placeholder={q.hint}
                                          onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                                          className={`rounded-lg border px-3 py-1 text-sm font-mono outline-none transition min-w-[200px] ${
                                            checked
                                              ? correct
                                                ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                                                : wrong
                                                ? "border-red-400 bg-red-50 text-red-800"
                                                : noAnswer
                                                ? "border-amber-300 bg-amber-50"
                                                : ""
                                              : "border-black/15 bg-white focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/20"
                                          }`}
                                        />
                                      </span>
                                    </span>
                                  ) : (
                                    part
                                  )
                                )}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {correct && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {wrong && <div className="text-red-700 font-semibold">❌ Wrong — you wrote: <span className="font-mono">{val}</span></div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-1.5 text-slate-600">
                                    <b className="text-slate-900">Correct answer:</b>{" "}
                                    <span className="font-mono font-bold text-slate-800">{q.correct[0]}</span> — {q.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex flex-wrap gap-3 items-center">
                      {!checked ? (
                        <button onClick={() => { setChecked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
                          Check Answers
                        </button>
                      ) : (
                        <button onClick={reset} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">
                          Try Again
                        </button>
                      )}
                      {checked && exNo < 4 && (
                        <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">
                          Next Exercise →
                        </button>
                      )}
                    </div>
                    {score && (
                      <div className={`rounded-2xl border p-4 ${score.percent >= 80 ? "border-emerald-200 bg-emerald-50" : score.percent >= 50 ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`text-3xl font-black ${score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"}`}>{score.percent}%</div>
                            <div className="mt-0.5 text-sm text-slate-600">{score.correct} out of {score.total} correct</div>
                          </div>
                          <div className="text-3xl">{score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}</div>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                          <div className={`h-2 rounded-full transition-all duration-500 ${score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${score.percent}%` }} />
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          {score.percent >= 80 ? "Excellent! Move on to the next exercise." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Explanation />
              )}
            </div>
          </section>

          {/* Right ad */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
            </div>
          </aside>
        </div>

        {/* Mobile ad */}
        <div className="mt-8 lg:hidden rounded-2xl border border-black/10 bg-white/60 p-4">
          <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
          <div className="mt-3 h-[90px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">320 × 90</div>
        </div>

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/be-going-to/quiz" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Multiple Choice</a>
          <a href="/tenses/be-going-to/spot-the-mistake" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Spot the Mistake →</a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation tab ─────────────────────────────────────────────────────── */

function Formula({ parts }: { parts: Array<{ text: string; color?: string }> }) {
  const colors: Record<string, string> = {
    sky: "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) => (
        <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${colors[p.color ?? "slate"]}`}>{p.text}</span>
      ))}
    </div>
  );
}

function Ex({ en }: { en: string }) {
  return (
    <div className="rounded-xl bg-white border border-black/8 px-3 py-2.5">
      <div className="font-semibold text-slate-900 text-sm">{en}</div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">

      {/* 3 gradient cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "am / is / are", color: "yellow" },
            { text: "going to", color: "violet" },
            { text: "verb (base form)", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I am going to work.  ·  She is going to leave.  ·  They are going to play." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "am not / isn't / aren't", color: "red" },
            { text: "going to", color: "violet" },
            { text: "verb (base form)", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I'm not going to stay.  ·  She isn't going to come.  ·  They aren't going to wait." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Am / Is / Are", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "going to", color: "violet" },
            { text: "verb (base form)", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Am I going to pass?  ·  Is she going to leave?  ·  Are they going to join us?" />
          </div>
        </div>
      </div>

      {/* am / is / are table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Which auxiliary to use</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">+</th>
                <th className="px-4 py-2.5 font-black text-red-700">−</th>
                <th className="px-4 py-2.5 font-black text-sky-700">?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I", "am going to work", "'m not going to work", "Am I going to work?"],
                ["He / She / It", "is going to work ★", "isn't going to work", "Is she going to work?"],
                ["You", "are going to work", "aren't going to work", "Are you going to work?"],
                ["We / They", "are going to work", "aren't going to work", "Are they going to work?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i === 1 ? "bg-amber-50 font-bold" : "bg-white"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm">{aff}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-sm">{neg}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-sm">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Key rule:</span> <b>&quot;going to&quot;</b> never changes — only <b>am / is / are</b> changes!<br />
          <span className="text-xs">He <b>is</b> going to work ✅ &nbsp; He <b>are</b> going to work ❌</span>
        </div>
      </div>

      {/* When to use */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use be going to</div>
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="text-sm font-black text-emerald-800 mb-2">1. Plans and intentions (already decided)</div>
            <Ex en="I'm going to visit my parents this weekend." />
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
            <div className="text-sm font-black text-sky-800 mb-2">2. Predictions based on visible evidence</div>
            <Ex en="Look at those clouds — it's going to rain!" />
          </div>
        </div>
      </div>

      {/* be going to vs will */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Be going to vs Will</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-violet-700">be going to</th>
                <th className="px-4 py-2.5 font-black text-sky-700">will</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Pre-planned decisions", "Spontaneous decisions"],
                ["Predictions with visible evidence", "General predictions (opinion)"],
                ["I'm going to buy a car. (planned)", "I'll help you carry that. (spontaneous)"],
              ].map(([a, b], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-violet-700 text-sm">{a}</td>
                  <td className="px-4 py-2.5 text-sky-700 text-sm">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["tomorrow", "next week", "next month", "next year", "soon", "tonight", "this weekend", "in the future", "this summer"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
