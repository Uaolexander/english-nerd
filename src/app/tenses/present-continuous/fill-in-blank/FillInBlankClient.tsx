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
    title: "Exercise 1 — Affirmative: write am / is / are + verb-ing",
    instructions:
      "Write the correct Present Continuous form of the verb in brackets. Use am with I, is with he / she / it, are with you / we / they. Don't forget the -ing ending.",
    questions: [
      { id: "1-1", prompt: "She ___ (read) a book right now.", hint: "(read)", correct: ["is reading"], explanation: "She → is reading." },
      { id: "1-2", prompt: "I ___ (cook) dinner at the moment.", hint: "(cook)", correct: ["am cooking"], explanation: "I → am cooking." },
      { id: "1-3", prompt: "They ___ (play) football in the park.", hint: "(play)", correct: ["are playing"], explanation: "They → are playing." },
      { id: "1-4", prompt: "He ___ (work) from home today.", hint: "(work)", correct: ["is working"], explanation: "He → is working." },
      { id: "1-5", prompt: "We ___ (watch) a film tonight.", hint: "(watch)", correct: ["are watching"], explanation: "We → are watching." },
      { id: "1-6", prompt: "The dog ___ (sleep) on the sofa.", hint: "(sleep)", correct: ["is sleeping"], explanation: "The dog (= it) → is sleeping." },
      { id: "1-7", prompt: "It ___ (rain) outside.", hint: "(rain)", correct: ["is raining"], explanation: "It → is raining." },
      { id: "1-8", prompt: "My parents ___ (visit) my aunt this weekend.", hint: "(visit)", correct: ["are visiting"], explanation: "My parents (= they) → are visiting." },
      { id: "1-9", prompt: "She ___ (run) in the park.", hint: "(run)", correct: ["is running"], explanation: "She → is running. (run → running: double consonant)" },
      { id: "1-10", prompt: "The children ___ (make) a lot of noise.", hint: "(make)", correct: ["are making"], explanation: "The children (= they) → are making. (make → making: drop -e)" },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: write am not / isn't / aren't + verb-ing",
    instructions:
      "Write the full negative form: I'm not / isn't / aren't + the -ing form of the verb in brackets. Never use don't / doesn't with continuous forms.",
    questions: [
      { id: "2-1", prompt: "She ___ (work) today — she's ill.", hint: "(work)", correct: ["isn't working", "is not working"], explanation: "She + negative → isn't working." },
      { id: "2-2", prompt: "I ___ (listen) to you.", hint: "(listen)", correct: ["'m not listening", "am not listening"], explanation: "I + negative → 'm not listening." },
      { id: "2-3", prompt: "They ___ (come) to the party.", hint: "(come)", correct: ["aren't coming", "are not coming"], explanation: "They + negative → aren't coming." },
      { id: "2-4", prompt: "He ___ (pay) attention in class.", hint: "(pay)", correct: ["isn't paying", "is not paying"], explanation: "He + negative → isn't paying." },
      { id: "2-5", prompt: "We ___ (go) out tonight.", hint: "(go)", correct: ["aren't going", "are not going"], explanation: "We + negative → aren't going." },
      { id: "2-6", prompt: "It ___ (snow) at the moment.", hint: "(snow)", correct: ["isn't snowing", "is not snowing"], explanation: "It + negative → isn't snowing." },
      { id: "2-7", prompt: "You ___ (wear) a coat — aren't you cold?", hint: "(wear)", correct: ["aren't wearing", "are not wearing"], explanation: "You + negative → aren't wearing." },
      { id: "2-8", prompt: "My phone ___ (charge).", hint: "(charge)", correct: ["isn't charging", "is not charging"], explanation: "My phone (= it) + negative → isn't charging." },
      { id: "2-9", prompt: "She ___ (talk) to me any more.", hint: "(talk)", correct: ["isn't talking", "is not talking"], explanation: "She + negative → isn't talking." },
      { id: "2-10", prompt: "The kids ___ (do) their homework.", hint: "(do)", correct: ["aren't doing", "are not doing"], explanation: "The kids (= they) + negative → aren't doing." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions: write the question or short answer",
    instructions:
      "Write the correct Present Continuous question or short answer using the verb in brackets. Start questions with Am / Is / Are.",
    questions: [
      { id: "3-1", prompt: "___ she sleeping? (sleep)", hint: "(sleep)", correct: ["is she sleeping?", "is she sleeping"], explanation: "She → Is: Is she sleeping?" },
      { id: "3-2", prompt: "___ you listening to me? (listen)", hint: "(listen)", correct: ["are you listening to me?", "are you listening to me", "are you listening?", "are you listening"], explanation: "You → Are: Are you listening?" },
      { id: "3-3", prompt: "___ they coming to the meeting? (come)", hint: "(come)", correct: ["are they coming to the meeting?", "are they coming to the meeting", "are they coming?", "are they coming"], explanation: "They → Are: Are they coming?" },
      { id: "3-4", prompt: "___ he watching TV right now? (watch)", hint: "(watch)", correct: ["is he watching tv right now?", "is he watching tv right now", "is he watching tv?", "is he watching?", "is he watching"], explanation: "He → Is: Is he watching TV right now?" },
      { id: "3-5", prompt: "___ I talking too fast? (talk)", hint: "(talk)", correct: ["am i talking too fast?", "am i talking too fast", "am i talking?", "am i talking"], explanation: "I → Am: Am I talking too fast?" },
      { id: "3-6", prompt: "___ it raining in the city too? (rain)", hint: "(rain)", correct: ["is it raining in the city?", "is it raining in the city", "is it raining?", "is it raining"], explanation: "It → Is: Is it raining?" },
      { id: "3-7", prompt: "\"Is it raining?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["it is", "yes, it is"], explanation: "Short answer with is: Yes, it is." },
      { id: "3-8", prompt: "\"Are you working?\" — \"No, ___.\"", hint: "(short answer)", correct: ["i'm not", "i am not", "no, i'm not", "no, i am not"], explanation: "Short negative answer: No, I'm not." },
      { id: "3-9", prompt: "\"Is she coming?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["she is", "yes, she is"], explanation: "Short answer with is: Yes, she is." },
      { id: "3-10", prompt: "\"Are they leaving?\" — \"No, ___.\"", hint: "(short answer)", correct: ["they aren't", "they are not", "no, they aren't", "no, they are not"], explanation: "Short negative answer: No, they aren't." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: affirmative, negative, and questions",
    instructions:
      "Write the correct Present Continuous form of the verb in brackets. Read the sentence carefully to decide if it is affirmative, negative, or a question.",
    questions: [
      { id: "4-1", prompt: "Look! The cat ___ (climb) the tree.", hint: "(climb)", correct: ["is climbing"], explanation: "The cat (= it) → is climbing." },
      { id: "4-2", prompt: "I ___ (not / feel) very well today.", hint: "(not / feel)", correct: ["'m not feeling", "am not feeling"], explanation: "I + negative → 'm not feeling." },
      { id: "4-3", prompt: "___ (you / enjoy) the party? (enjoy)", hint: "(you / enjoy)", correct: ["are you enjoying the party?", "are you enjoying the party", "are you enjoying?", "are you enjoying"], explanation: "You → Are you enjoying…?" },
      { id: "4-4", prompt: "They ___ (wait) for the bus.", hint: "(wait)", correct: ["are waiting"], explanation: "They → are waiting." },
      { id: "4-5", prompt: "He ___ (not / talk) on the phone right now.", hint: "(not / talk)", correct: ["isn't talking", "is not talking"], explanation: "He + negative → isn't talking." },
      { id: "4-6", prompt: "We ___ (have) a great time here.", hint: "(have)", correct: ["are having"], explanation: "We → are having. (have → having: drop -e)" },
      { id: "4-7", prompt: "___ (she / study) for the exam? (study)", hint: "(she / study)", correct: ["is she studying for the exam?", "is she studying for the exam", "is she studying?", "is she studying"], explanation: "She → Is she studying…?" },
      { id: "4-8", prompt: "She ___ (wear) headphones — she can't hear you.", hint: "(wear)", correct: ["is wearing"], explanation: "She → is wearing." },
      { id: "4-9", prompt: "\"Are you coming?\" — \"No, ___.\"", hint: "(short answer)", correct: ["i'm not", "i am not", "no, i'm not", "no, i am not"], explanation: "Short negative: No, I'm not." },
      { id: "4-10", prompt: "Prices ___ (rise) fast this year.", hint: "(rise)", correct: ["are rising"], explanation: "Prices (= they) → are rising. Temporary trend." },
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
          <a className="hover:text-slate-900 transition" href="/tenses/present-continuous">Present Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Fill in the Blank</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Writing</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Type the correct <b>Present Continuous</b> form of the verb in brackets. Four exercise sets — affirmative, negative, questions, and mixed. Pay attention to the -ing spelling rules.
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
                                          className={`rounded-lg border px-3 py-1 text-sm font-mono outline-none transition min-w-[150px] ${
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
          <a href="/tenses/present-continuous/quiz" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Multiple Choice</a>
          <a href="/tenses/present-continuous/spot-the-mistake" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Spot the Mistake →</a>
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
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I am cooking.  ·  She is running.  ·  They are playing." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "'m not / isn't / aren't", color: "red" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I'm not cooking.  ·  She isn't running.  ·  They aren't playing." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Am / Is / Are", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "verb-ing", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Am I cooking?  ·  Is she running?  ·  Are they playing?" />
          </div>
        </div>
      </div>

      {/* -ing spelling rules */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">-ing spelling rules</div>
        <div className="space-y-2">
          {[
            { rule: "Most verbs → add -ing", ex: "work → working · play → playing · read → reading" },
            { rule: "Ends in -e → drop the -e, add -ing", ex: "make → making · come → coming · write → writing" },
            { rule: "Short verb (CVC) → double the final consonant", ex: "run → running · sit → sitting · swim → swimming · stop → stopping" },
            { rule: "Ends in -ie → change to -y, add -ing", ex: "die → dying · lie → lying · tie → tying" },
          ].map(({ rule, ex }) => (
            <div key={rule} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800">{rule}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-mono">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stative verbs */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">Stative verbs — no continuous form!</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {["know", "believe", "understand", "like", "love", "hate", "want", "need", "seem", "own", "belong", "have (possession)"].map((v) => (
            <span key={v} className="rounded-lg bg-white border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800">{v}</span>
          ))}
        </div>
        <div className="mt-2 text-xs text-amber-700">✅ I know the answer. &nbsp;|&nbsp; ❌ I am knowing the answer.</div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">📌 Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["now", "right now", "at the moment", "currently", "today", "this week", "this year", "look!", "listen!"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
