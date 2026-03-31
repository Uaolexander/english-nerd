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
    title: "Exercise 1 — Affirmative: write will be + verb-ing",
    instructions:
      "Write the correct Future Continuous affirmative form of the verb in brackets. Use will be + verb-ing for all subjects. Pay attention to -ing spelling.",
    questions: [
      { id: "1-1", prompt: "At 8 PM tonight, I ___ (watch) the match.", hint: "(watch)", correct: ["will be watching", "i'll be watching", "i will be watching"], explanation: "I will be watching — action in progress at 8 PM." },
      { id: "1-2", prompt: "This time next week, she ___ (sit) on the beach.", hint: "(sit)", correct: ["will be sitting", "she'll be sitting", "she will be sitting"], explanation: "She will be sitting. sit → sitting (double consonant)." },
      { id: "1-3", prompt: "When you call, they ___ (have) dinner.", hint: "(have)", correct: ["will be having", "they'll be having", "they will be having"], explanation: "They will be having. have → having (drop -e)." },
      { id: "1-4", prompt: "By noon tomorrow, he ___ (drive) to the airport.", hint: "(drive)", correct: ["will be driving", "he'll be driving", "he will be driving"], explanation: "He will be driving. drive → driving (drop -e)." },
      { id: "1-5", prompt: "At this time next year, we ___ (study) at university.", hint: "(study)", correct: ["will be studying", "we'll be studying", "we will be studying"], explanation: "We will be studying. study → studying (no change, ends in -y)." },
      { id: "1-6", prompt: "The children ___ (sleep) by the time we arrive home.", hint: "(sleep)", correct: ["will be sleeping", "they'll be sleeping"], explanation: "The children will be sleeping — they → will be sleeping." },
      { id: "1-7", prompt: "Don't call at 3 PM — I ___ (run) in the park.", hint: "(run)", correct: ["will be running", "i'll be running", "i will be running"], explanation: "I will be running. run → running (double consonant)." },
      { id: "1-8", prompt: "At midnight the team ___ (work) on the deadline.", hint: "(work)", correct: ["will be working", "they'll be working"], explanation: "The team will be working — action in progress at a specific future time." },
      { id: "1-9", prompt: "Tomorrow at dawn, the birds ___ (sing) in the garden.", hint: "(sing)", correct: ["will be singing", "they'll be singing"], explanation: "The birds will be singing — planned/expected ongoing action." },
      { id: "1-10", prompt: "She ___ (make) breakfast when you wake up.", hint: "(make)", correct: ["will be making", "she'll be making", "she will be making"], explanation: "She will be making. make → making (drop -e)." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: write won't be + verb-ing",
    instructions:
      "Write the full negative form: won't be (or will not be) + the -ing form of the verb in brackets. All subjects use won't be — no exceptions.",
    questions: [
      { id: "2-1", prompt: "She ___ (work) this weekend — she's on holiday.", hint: "(work)", correct: ["won't be working", "will not be working"], explanation: "She won't be working — negative Future Continuous." },
      { id: "2-2", prompt: "I ___ (join) you tonight — I have a deadline.", hint: "(join)", correct: ["won't be joining", "will not be joining"], explanation: "I won't be joining — use won't be + verb-ing." },
      { id: "2-3", prompt: "They ___ (travel) by train — they're flying.", hint: "(travel)", correct: ["won't be travelling", "won't be traveling", "will not be travelling", "will not be traveling"], explanation: "They won't be travelling — travel → travelling (double -l in UK English)." },
      { id: "2-4", prompt: "He ___ (use) the car tomorrow — I can take it.", hint: "(use)", correct: ["won't be using", "will not be using"], explanation: "He won't be using. use → using (drop -e)." },
      { id: "2-5", prompt: "We ___ (sleep) at midnight — we'll be celebrating!", hint: "(sleep)", correct: ["won't be sleeping", "will not be sleeping"], explanation: "We won't be sleeping — we'll be awake celebrating." },
      { id: "2-6", prompt: "Don't worry — it ___ (rain) tomorrow according to the forecast.", hint: "(rain)", correct: ["won't be raining", "will not be raining"], explanation: "It won't be raining — negative future continuous with natural events." },
      { id: "2-7", prompt: "She ___ (come) to the meeting — she's called in sick.", hint: "(come)", correct: ["won't be coming", "will not be coming"], explanation: "She won't be coming. come → coming (drop -e)." },
      { id: "2-8", prompt: "At noon the office ___ (operate) — it's a public holiday.", hint: "(operate)", correct: ["won't be operating", "will not be operating"], explanation: "The office won't be operating. operate → operating (drop -e)." },
      { id: "2-9", prompt: "I ___ (sit) around doing nothing — I have plans.", hint: "(sit)", correct: ["won't be sitting", "will not be sitting"], explanation: "I won't be sitting. sit → sitting (double consonant)." },
      { id: "2-10", prompt: "The kids ___ (make) noise at bedtime — they'll be exhausted.", hint: "(make)", correct: ["won't be making", "will not be making"], explanation: "The kids won't be making. make → making (drop -e)." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions and short answers",
    instructions:
      "Write the correct Future Continuous question (Will + subject + be + verb-ing?) or short answer (Yes, I will. / No, I won't.).",
    questions: [
      { id: "3-1", prompt: "___ you be working late tonight? (work)", hint: "(work)", correct: ["will you be working late tonight?", "will you be working late tonight", "will you be working?", "will you be working"], explanation: "Will + subject + be + verb-ing: Will you be working?" },
      { id: "3-2", prompt: "___ she be travelling by that time? (travel)", hint: "(travel)", correct: ["will she be travelling by that time?", "will she be travelling by that time", "will she be travelling?", "will she be travelling", "will she be traveling?", "will she be traveling"], explanation: "Will she be travelling? — Future Continuous question." },
      { id: "3-3", prompt: "___ they be joining us for dinner? (join)", hint: "(join)", correct: ["will they be joining us for dinner?", "will they be joining us for dinner", "will they be joining?", "will they be joining"], explanation: "Will they be joining us for dinner?" },
      { id: "3-4", prompt: "___ he be sleeping when we get there? (sleep)", hint: "(sleep)", correct: ["will he be sleeping when we get there?", "will he be sleeping?", "will he be sleeping"], explanation: "Will he be sleeping? — action in progress at future time." },
      { id: "3-5", prompt: "___ the team be working at midnight? (work)", hint: "(work)", correct: ["will the team be working at midnight?", "will the team be working at midnight", "will the team be working?", "will the team be working"], explanation: "Will the team be working at midnight?" },
      { id: "3-6", prompt: "\"Will you be using the car tonight?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["i will", "yes, i will"], explanation: "Short affirmative answer: Yes, I will." },
      { id: "3-7", prompt: "\"Will she be coming to the party?\" — \"No, ___.\"", hint: "(short answer)", correct: ["she won't", "no, she won't", "she will not", "no, she will not"], explanation: "Short negative answer: No, she won't." },
      { id: "3-8", prompt: "\"Will they be travelling tomorrow?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["they will", "yes, they will"], explanation: "Short affirmative answer: Yes, they will." },
      { id: "3-9", prompt: "\"Will you be working on Sunday?\" — \"No, ___.\"", hint: "(short answer)", correct: ["i won't", "no, i won't", "i will not", "no, i will not"], explanation: "Short negative answer: No, I won't." },
      { id: "3-10", prompt: "\"Will he be driving there?\" — \"Yes, ___.\"", hint: "(short answer)", correct: ["he will", "yes, he will"], explanation: "Short affirmative answer: Yes, he will." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: affirmative, negative, and questions",
    instructions:
      "Write the correct Future Continuous form of the verb in brackets. Read carefully to decide if it is affirmative, negative, or a question.",
    questions: [
      { id: "4-1", prompt: "At 9 AM tomorrow, I ___ (fly) to London.", hint: "(fly)", correct: ["will be flying", "i'll be flying", "i will be flying"], explanation: "I will be flying — affirmative. fly → flying (ends in -y, no change)." },
      { id: "4-2", prompt: "___ (you / work) from home on Friday? (work)", hint: "(you / work)", correct: ["will you be working from home on friday?", "will you be working from home on friday", "will you be working?", "will you be working"], explanation: "Will you be working from home on Friday?" },
      { id: "4-3", prompt: "She ___ (not / attend) the conference — she's busy.", hint: "(not / attend)", correct: ["won't be attending", "will not be attending"], explanation: "She won't be attending — negative." },
      { id: "4-4", prompt: "By midnight, we ___ (celebrate) the new year.", hint: "(celebrate)", correct: ["will be celebrating", "we'll be celebrating", "we will be celebrating"], explanation: "We will be celebrating. celebrate → celebrating (drop -e)." },
      { id: "4-5", prompt: "\"Will you be joining us?\" — \"No, ___.\"", hint: "(short answer)", correct: ["i won't", "no, i won't", "i will not", "no, i will not"], explanation: "Short negative answer: No, I won't." },
      { id: "4-6", prompt: "He ___ (not / swim) in the morning — the pool opens at noon.", hint: "(not / swim)", correct: ["won't be swimming", "will not be swimming"], explanation: "He won't be swimming. swim → swimming (double consonant)." },
      { id: "4-7", prompt: "When you wake up, the sun ___ (shine) brightly.", hint: "(shine)", correct: ["will be shining", "it'll be shining"], explanation: "The sun will be shining. shine → shining (drop -e)." },
      { id: "4-8", prompt: "___ (the team / play) at that time? (play)", hint: "(the team / play)", correct: ["will the team be playing at that time?", "will the team be playing at that time", "will the team be playing?", "will the team be playing"], explanation: "Will the team be playing at that time?" },
      { id: "4-9", prompt: "I ___ (not / use) my laptop tonight — feel free to borrow it.", hint: "(not / use)", correct: ["won't be using", "will not be using"], explanation: "I won't be using. use → using (drop -e)." },
      { id: "4-10", prompt: "This time next month, they ___ (live) in their new house.", hint: "(live)", correct: ["will be living", "they'll be living", "they will be living"], explanation: "They will be living. live → living (drop -e)." },
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
          <a className="hover:text-slate-900 transition" href="/tenses/future-continuous">Future Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Fill in the Blank</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Writing</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">B1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Type the correct <b>Future Continuous</b> form of the verb in brackets. Four exercise sets — affirmative, negative, questions, and mixed. Pay attention to the -ing spelling rules.
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
                                          className={`rounded-lg border px-3 py-1 text-sm font-mono outline-none transition min-w-[180px] ${
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
          <a href="/tenses/future-continuous/quiz" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← Multiple Choice</a>
          <a href="/tenses/future-continuous/spot-the-mistake" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Spot the Mistake →</a>
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
            { text: "will be", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I will be working.  ·  She will be sleeping.  ·  They will be travelling." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "won't be", color: "red" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I won't be working tomorrow.  ·  She won't be joining us." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "be", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you be working tonight?  ·  Will she be coming?" />
          </div>
        </div>
      </div>

      {/* Short answers */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Short answers</div>
        <div className="space-y-2">
          {[
            { q: "Will she be joining us?", yes: "Yes, she will.", no: "No, she won't." },
            { q: "Will they be travelling?", yes: "Yes, they will.", no: "No, they won't." },
            { q: "Will you be working late?", yes: "Yes, I will.", no: "No, I won't." },
          ].map(({ q, yes, no }) => (
            <div key={q} className="rounded-xl bg-white border border-black/10 px-4 py-3 grid sm:grid-cols-3 gap-2 text-sm">
              <div className="font-semibold text-slate-700">{q}</div>
              <div className="text-emerald-700 font-semibold">{yes}</div>
              <div className="text-red-700 font-semibold">{no}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">Always use &quot;will be&quot; + -ing — never the base form!</div>
        <div className="space-y-1 mt-2 text-xs text-amber-700">
          <div>✅ She will be <b>working</b>. &nbsp;|&nbsp; ❌ She will be <b>work</b>.</div>
          <div>✅ Will you be <b>coming</b>? &nbsp;|&nbsp; ❌ Will you <b>coming</b>? (missing &quot;be&quot;)</div>
        </div>
      </div>

      {/* -ing spelling rules */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">-ing spelling rules</div>
        <div className="space-y-2">
          {[
            { rule: "Most verbs → add -ing", ex: "work → working · play → playing · read → reading" },
            { rule: "Ends in -e → drop the -e, add -ing", ex: "make → making · come → coming · write → writing · drive → driving" },
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

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["at this time tomorrow", "at 8 o'clock tomorrow", "this time next week", "this time next month", "this time next year", "when you arrive", "when you call", "all day tomorrow", "soon", "tonight", "by midnight", "at noon tomorrow"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
