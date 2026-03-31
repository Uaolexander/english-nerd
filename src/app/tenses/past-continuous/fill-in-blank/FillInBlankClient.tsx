"use client";

import { useMemo, useState } from "react";

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
    title: "Exercise 1 — Affirmative: write was / were + verb-ing",
    instructions:
      "Write the correct Past Continuous form of the verb in brackets. Use was with I / he / she / it, were with you / we / they. Don't forget the -ing ending.",
    questions: [
      { id: "1-1", prompt: "She ___ (read) a book at 9 PM last night.", hint: "(read)", correct: ["was reading"], explanation: "She → was reading." },
      { id: "1-2", prompt: "I ___ (cook) dinner when you called.", hint: "(cook)", correct: ["was cooking"], explanation: "I → was cooking." },
      { id: "1-3", prompt: "They ___ (play) football all afternoon.", hint: "(play)", correct: ["were playing"], explanation: "They → were playing." },
      { id: "1-4", prompt: "He ___ (work) from home yesterday.", hint: "(work)", correct: ["was working"], explanation: "He → was working." },
      { id: "1-5", prompt: "We ___ (watch) a film at that time.", hint: "(watch)", correct: ["were watching"], explanation: "We → were watching." },
      { id: "1-6", prompt: "The dog ___ (sleep) on the sofa all morning.", hint: "(sleep)", correct: ["was sleeping"], explanation: "The dog (= it) → was sleeping." },
      { id: "1-7", prompt: "It ___ (rain) all night long.", hint: "(rain)", correct: ["was raining"], explanation: "It → was raining." },
      { id: "1-8", prompt: "My parents ___ (visit) my aunt this time last week.", hint: "(visit)", correct: ["were visiting"], explanation: "My parents (= they) → were visiting." },
      { id: "1-9", prompt: "She ___ (run) in the park when it started to rain.", hint: "(run)", correct: ["was running"], explanation: "She → was running. (run → running: double consonant)" },
      { id: "1-10", prompt: "The children ___ (make) a lot of noise when I arrived.", hint: "(make)", correct: ["were making"], explanation: "The children (= they) → were making. (make → making: drop -e)" },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: write wasn't / weren't + verb-ing",
    instructions:
      "Write the full negative form: wasn't / weren't + the -ing form of the verb in brackets. Never use didn't with continuous forms.",
    questions: [
      { id: "2-1", prompt: "She ___ (work) yesterday — she was ill.", hint: "(work)", correct: ["wasn't working", "was not working"], explanation: "She + negative → wasn't working." },
      { id: "2-2", prompt: "I ___ (listen) to you at that moment.", hint: "(listen)", correct: ["wasn't listening", "was not listening"], explanation: "I + negative → wasn't listening." },
      { id: "2-3", prompt: "They ___ (come) to the party after all.", hint: "(come)", correct: ["weren't coming", "were not coming"], explanation: "They + negative → weren't coming." },
      { id: "2-4", prompt: "He ___ (pay) attention during the lesson.", hint: "(pay)", correct: ["wasn't paying", "was not paying"], explanation: "He + negative → wasn't paying." },
      { id: "2-5", prompt: "We ___ (go) out that evening.", hint: "(go)", correct: ["weren't going", "were not going"], explanation: "We + negative → weren't going." },
      { id: "2-6", prompt: "It ___ (snow) when we left the house.", hint: "(snow)", correct: ["wasn't snowing", "was not snowing"], explanation: "It + negative → wasn't snowing." },
      { id: "2-7", prompt: "You ___ (wear) a coat — weren't you cold?", hint: "(wear)", correct: ["weren't wearing", "were not wearing"], explanation: "You + negative → weren't wearing." },
      { id: "2-8", prompt: "My phone ___ (charge) when I needed it.", hint: "(charge)", correct: ["wasn't charging", "was not charging"], explanation: "My phone (= it) + negative → wasn't charging." },
      { id: "2-9", prompt: "She ___ (talk) to me any more that day.", hint: "(talk)", correct: ["wasn't talking", "was not talking"], explanation: "She + negative → wasn't talking." },
      { id: "2-10", prompt: "The kids ___ (do) their homework when I came home.", hint: "(do)", correct: ["weren't doing", "were not doing"], explanation: "The kids (= they) + negative → weren't doing." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions: write the question or short answer",
    instructions:
      "Write the correct Past Continuous question or short answer using the verb in brackets. Start questions with Was / Were.",
    questions: [
      { id: "3-1", prompt: "___ she sleeping when you arrived? (sleep)", hint: "(sleep)", correct: ["was she sleeping?", "was she sleeping"], explanation: "She → Was: Was she sleeping?" },
      { id: "3-2", prompt: "___ you listening to me at that point? (listen)", hint: "(listen)", correct: ["were you listening to me?", "were you listening to me", "were you listening?", "were you listening"], explanation: "You → Were: Were you listening?" },
      { id: "3-3", prompt: "___ they coming to the meeting yesterday? (come)", hint: "(come)", correct: ["were they coming to the meeting?", "were they coming to the meeting", "were they coming?", "were they coming"], explanation: "They → Were: Were they coming?" },
      { id: "3-4", prompt: "___ he watching TV at 8 PM last night? (watch)", hint: "(watch)", correct: ["was he watching tv at 8 pm?", "was he watching tv?", "was he watching?", "was he watching"], explanation: "He → Was: Was he watching TV?" },
      { id: "3-5", prompt: "___ I talking too fast during the presentation? (talk)", hint: "(talk)", correct: ["was i talking too fast?", "was i talking too fast", "was i talking?", "was i talking"], explanation: "I → Was: Was I talking too fast?" },
      { id: "3-6", prompt: "___ it raining when you left the house? (rain)", hint: "(rain)", correct: ["was it raining when you left?", "was it raining?", "was it raining"], explanation: "It → Was: Was it raining?" },
      { id: "3-7", prompt: '"Was it raining?" — "Yes, ___.\"', hint: "(short answer)", correct: ["it was", "yes, it was"], explanation: "Short answer with was: Yes, it was." },
      { id: "3-8", prompt: '"Were you working?" — "No, ___.\"', hint: "(short answer)", correct: ["i wasn't", "i was not", "no, i wasn't", "no, i was not"], explanation: "Short negative answer: No, I wasn't." },
      { id: "3-9", prompt: '"Was she coming?" — "Yes, ___.\"', hint: "(short answer)", correct: ["she was", "yes, she was"], explanation: "Short answer with was: Yes, she was." },
      { id: "3-10", prompt: '"Were they leaving?" — "No, ___.\"', hint: "(short answer)", correct: ["they weren't", "they were not", "no, they weren't", "no, they were not"], explanation: "Short negative answer: No, they weren't." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: affirmative, negative, and when/while",
    instructions:
      "Write the correct Past Continuous form. Read carefully to decide if it is affirmative, negative, or a question. Some sentences include when and while.",
    questions: [
      { id: "4-1", prompt: "I ___ (cook) when the phone rang.", hint: "(cook)", correct: ["was cooking"], explanation: "I → was cooking. Interrupted action: Past Continuous + when + Past Simple." },
      { id: "4-2", prompt: "While she ___ (read), he was cooking dinner.", hint: "(read)", correct: ["was reading"], explanation: "She → was reading. Parallel actions with while." },
      { id: "4-3", prompt: "They ___ (not / wait) for the bus — they walked.", hint: "(not / wait)", correct: ["weren't waiting", "were not waiting"], explanation: "They + negative → weren't waiting." },
      { id: "4-4", prompt: "___ (you / sleep) when I called last night? (sleep)", hint: "(you / sleep)", correct: ["were you sleeping when i called?", "were you sleeping?", "were you sleeping"], explanation: "You → Were you sleeping…?" },
      { id: "4-5", prompt: "She ___ (talk) on the phone at midnight.", hint: "(talk)", correct: ["was talking"], explanation: "She → was talking. Action in progress at a specific past moment." },
      { id: "4-6", prompt: "He ___ (not / watch) TV — he was studying all evening.", hint: "(not / watch)", correct: ["wasn't watching", "was not watching"], explanation: "He + negative → wasn't watching." },
      { id: "4-7", prompt: "While the children ___ (play), the parents were cooking.", hint: "(play)", correct: ["were playing"], explanation: "Children → were playing. Parallel actions with while." },
      { id: "4-8", prompt: "It ___ (snow) when we woke up.", hint: "(snow)", correct: ["was snowing"], explanation: "It → was snowing. Action in progress when we woke up." },
      { id: "4-9", prompt: '"Were you coming to the party?" — "No, ___.\"', hint: "(short answer)", correct: ["i wasn't", "i was not", "no, i wasn't", "no, i was not"], explanation: "Short negative: No, I wasn't." },
      { id: "4-10", prompt: "We ___ (have) lunch when the fire alarm went off.", hint: "(have)", correct: ["were having"], explanation: "We → were having. (have → having: drop -e) Action interrupted by alarm." },
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
          <a className="hover:text-slate-900 transition" href="/tenses/past-continuous">Past Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Fill in the Blank</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Writing</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">A2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Type the correct <b>Past Continuous</b> form of the verb in brackets. Four exercise sets — affirmative, negative, questions, and mixed with when/while. Pay attention to the -ing spelling rules.
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
          <a href="/tenses/past-continuous/quiz" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Multiple Choice</a>
          <a href="/tenses/past-continuous/spot-the-mistake" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Spot the Mistake →</a>
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
            { text: "was / were", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I was cooking.  ·  She was running.  ·  They were playing." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "wasn't / weren't", color: "red" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I wasn't cooking.  ·  She wasn't running.  ·  They weren't playing." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Was / Were", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "verb-ing", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Was I cooking?  ·  Was she running?  ·  Were they playing?" />
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

      {/* was / were table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">was vs. were — quick reference</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-slate-600">Auxiliary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I / He / She / It", "was"],
                ["You / We / They", "were"],
              ].map(([subj, aux], i) => (
                <tr key={i} className={i === 0 ? "bg-amber-50" : "bg-white"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-amber-700 font-black font-mono">{aux}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">Warning:</span> Never use <b>didn&apos;t</b> with continuous forms!<br />
          <span className="text-xs">She <b>wasn&apos;t</b> working ✅ &nbsp; She didn&apos;t working ❌</span>
        </div>
      </div>

      {/* when / while */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">when & while patterns</div>
        <div className="space-y-2">
          <div className="rounded-xl bg-white border border-black/10 px-4 py-3">
            <div className="text-sm font-black text-slate-800">Past Continuous + when + Past Simple (interrupted action)</div>
            <div className="text-xs text-emerald-600 font-mono mt-1">I was cooking when the phone rang.</div>
          </div>
          <div className="rounded-xl bg-white border border-black/10 px-4 py-3">
            <div className="text-sm font-black text-slate-800">while + Past Continuous … Past Continuous (parallel actions)</div>
            <div className="text-xs text-emerald-600 font-mono mt-1">While she was reading, he was cooking.</div>
          </div>
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["at 8 o'clock", "at that time", "this time yesterday", "when", "while", "all morning", "all evening", "all night", "all day long"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
