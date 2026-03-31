"use client";

import { useMemo, useState } from "react";

type MCQ = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type ExSet = {
  no: 1 | 2 | 3 | 4;
  title: string;
  instructions: string;
  questions: MCQ[];
};

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Plans (going to) vs spontaneous decisions (will)",
    instructions:
      "Use 'be going to' for plans made before the moment of speaking. Use 'will' for decisions made at the moment. Exactly 5 sentences need going to and 5 need will.",
    questions: [
      { id: "1-1", prompt: "\"I've registered for the marathon — I ___ run it in April.\"", options: ["am going to run", "will run", "run", "ran"], correctIndex: 0, explanation: "Already registered = pre-made plan: am going to run." },
      { id: "1-2", prompt: "\"The bin is full.\" \"___ take it out.\" (deciding just now)", options: ["I'm going to", "I'll", "I", "I would"], correctIndex: 1, explanation: "Spontaneous decision: I'll take it out (will)." },
      { id: "1-3", prompt: "\"She ___ present at the conference — she's been preparing for weeks.\"", options: ["will present", "presents", "is going to present", "presented"], correctIndex: 2, explanation: "Long preparation = pre-arranged: is going to present." },
      { id: "1-4", prompt: "\"The office is too hot.\" \"___ open a window.\" (reacting now)", options: ["I'm going to", "I", "I would", "I'll"], correctIndex: 3, explanation: "Spontaneous reaction: I'll open a window (will)." },
      { id: "1-5", prompt: "\"We've already agreed — we ___ split the costs equally.\"", options: ["are going to split", "will split", "split", "splits"], correctIndex: 0, explanation: "Pre-agreed plan: are going to split." },
      { id: "1-6", prompt: "\"I forgot to call the client!\" \"___ do it now.\" (deciding right now)", options: ["I'm going to", "I'll", "I", "I would"], correctIndex: 1, explanation: "Spontaneous decision: I'll do it now (will)." },
      { id: "1-7", prompt: "\"They ___ launch the new product in March — the date is confirmed.\"", options: ["will launch", "launch", "are going to launch", "launched"], correctIndex: 2, explanation: "Confirmed date = pre-made plan: are going to launch." },
      { id: "1-8", prompt: "\"The cups are dirty.\" \"___ wash them.\" (spontaneous)", options: ["I'm going to", "I", "I would", "I'll"], correctIndex: 3, explanation: "Spontaneous offer/decision: I'll wash them (will)." },
      { id: "1-9", prompt: "\"He ___ take a sabbatical — he submitted the request last month.\"", options: ["is going to take", "will take", "takes", "took"], correctIndex: 0, explanation: "Request already submitted = pre-decided: is going to take." },
      { id: "1-10", prompt: "\"I can't find my keys!\" \"Don't worry — ___ help you look.\" (instant offer)", options: ["I'm going to", "I'll", "I", "I would"], correctIndex: 1, explanation: "Spontaneous offer: I'll help you look (will)." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Evidence predictions (going to) vs opinion predictions (will)",
    instructions:
      "When you can see or feel evidence right now → use be going to. When it is an opinion or guess → use will. 5 answers need going to, 5 need will.",
    questions: [
      { id: "2-1", prompt: "Look at that ice! The skater ___ fall — she's losing balance.", options: ["is going to fall", "will fall", "falls", "fell"], correctIndex: 0, explanation: "Visible evidence (losing balance): is going to fall." },
      { id: "2-2", prompt: "\"I think electric cars ___ dominate the market within 10 years.\"", options: ["are going to dominate", "will dominate", "dominate", "dominated"], correctIndex: 1, explanation: "Opinion prediction (I think, no current visible sign): will dominate." },
      { id: "2-3", prompt: "Watch out — that shelf ___ collapse! The screws are falling out.", options: ["will collapse", "collapses", "is going to collapse", "collapsed"], correctIndex: 2, explanation: "Visible sign (screws falling out): is going to collapse." },
      { id: "2-4", prompt: "\"I believe the new director ___ make a real difference to the company.\"", options: ["is going to make", "makes", "made", "will make"], correctIndex: 3, explanation: "Personal belief (I believe): will make a difference." },
      { id: "2-5", prompt: "Her hands are shaking and she looks terrified. She ___ freeze on stage.", options: ["is going to freeze", "will freeze", "freezes", "froze"], correctIndex: 0, explanation: "Physical signs (shaking hands, terror): is going to freeze." },
      { id: "2-6", prompt: "\"I'm confident the treatment ___ work — it has an 80% success rate.\"", options: ["is going to work", "will work", "works", "worked"], correctIndex: 1, explanation: "Confident opinion (not a visible event right now): will work." },
      { id: "2-7", prompt: "The pipes have been making a banging noise all week. One ___ burst soon.", options: ["will burst", "bursts", "is going to burst", "burst"], correctIndex: 2, explanation: "Observable sign (banging noise): is going to burst." },
      { id: "2-8", prompt: "\"I don't think the proposal ___ pass — it has too many opponents.\"", options: ["is going to", "passes", "passed", "will"], correctIndex: 3, explanation: "Negative opinion (I don't think): will pass." },
      { id: "2-9", prompt: "Look how dark it is! It ___ storm tonight — I can feel it in the air.", options: ["is going to storm", "will storm", "storms", "stormed"], correctIndex: 0, explanation: "Sensory evidence (dark sky, feeling in the air): is going to storm." },
      { id: "2-10", prompt: "\"She's been so dedicated — I'm sure she ___ get a promotion.\"", options: ["is going to get", "will get", "gets", "got"], correctIndex: 1, explanation: "Confident opinion based on knowledge (not visible event): will get a promotion." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Choose the more natural option",
    instructions:
      "Both will and going to can sometimes be used, but one is more natural in context. Choose the better option. Mix of going to and will — 5 each.",
    questions: [
      { id: "3-1", prompt: "\"I've made a firm decision — I ___ stop eating processed food.\"", options: ["am going to stop", "will stop", "stop", "stopped"], correctIndex: 0, explanation: "Firm decision already made: am going to stop (more natural than will for pre-decided)." },
      { id: "3-2", prompt: "\"I promise I ___ be there before 8.\" (promise)", options: ["am going to be", "will be", "be", "was"], correctIndex: 1, explanation: "Promises always use will, not going to: I will be there." },
      { id: "3-3", prompt: "\"Oh, your glass is empty! ___ get you a refill.\" (spontaneous)", options: ["I'm going to", "I", "I'll", "I would"], correctIndex: 2, explanation: "Spontaneous offer: I'll get you a refill (will)." },
      { id: "3-4", prompt: "\"They ___ move to Madrid — they've already found a flat there.\"", options: ["will move", "move", "moved", "are going to move"], correctIndex: 3, explanation: "Flat already found = pre-arranged: are going to move." },
      { id: "3-5", prompt: "\"I think I ___ have the pasta.\" (at a restaurant, just deciding)", options: ["am going to have", "will have", "have", "had"], correctIndex: 1, explanation: "Deciding at the moment of speaking: I'll have (will) is most natural in this context." },
      { id: "3-6", prompt: "\"She ___ retire at 60 — she told HR last month.\"", options: ["will retire", "is going to retire", "retires", "retired"], correctIndex: 1, explanation: "Already told HR = pre-made plan: is going to retire." },
      { id: "3-7", prompt: "\"I ___ carry that for you — it looks heavy.\" (reacting now)", options: ["am going to", "do", "'ll", "would"], correctIndex: 2, explanation: "Spontaneous offer: I'll carry that (will)." },
      { id: "3-8", prompt: "\"They ___ hire a project manager — the board approved it yesterday.\"", options: ["will hire", "hire", "hired", "are going to hire"], correctIndex: 3, explanation: "Board already approved = pre-arranged: are going to hire." },
      { id: "3-9", prompt: "\"You look cold — ___ turn the heating up?\" (Shall I = offer)", options: ["Will I", "Shall I", "Am I going to", "Do I"], correctIndex: 1, explanation: "Polite offer: Shall I turn the heating up?" },
      { id: "3-10", prompt: "\"I've already started packing — I ___ leave first thing tomorrow.\"", options: ["will leave", "leave", "am going to leave", "left"], correctIndex: 2, explanation: "Already packing = plan confirmed: am going to leave." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Complete dialogues: mixed will / going to",
    instructions:
      "Complete these dialogues with will, going to, or the correct form. Read the context clues carefully. Mix of will and going to throughout.",
    questions: [
      { id: "4-1", prompt: "\"Are you going to the gym tonight?\" \"No, I ___ stay home — I'm too tired.\" (deciding now)", options: ["'ll", "am going to", "do", "would"], correctIndex: 0, explanation: "Spontaneous decision: I'll stay home (will)." },
      { id: "4-2", prompt: "\"What are your plans for summer?\" \"I ___ visit Japan — I've started learning Japanese!\"", options: ["will visit", "am going to visit", "visit", "visited"], correctIndex: 1, explanation: "Pre-made plan with preparation evidence: am going to visit." },
      { id: "4-3", prompt: "\"Careful — that box is sliding off the shelf! It ___ fall!\"", options: ["will fall", "falls", "is going to fall", "fell"], correctIndex: 2, explanation: "Visible immediate danger: is going to fall." },
      { id: "4-4", prompt: "\"I've reserved a table for us — we ___ have dinner at Rossi's at 8.\"", options: ["will have", "have", "had", "are going to have"], correctIndex: 3, explanation: "Table already reserved = pre-made plan: are going to have." },
      { id: "4-5", prompt: "\"The meeting room is booked.\" \"___ check if there's another one available.\" (now)", options: ["I'll", "I'm going to", "I", "I would"], correctIndex: 0, explanation: "Spontaneous decision: I'll check (will)." },
      { id: "4-6", prompt: "\"I think the new policy ___ have mixed results,\" said the expert.", options: ["is going to have", "will have", "has", "had"], correctIndex: 1, explanation: "Expert opinion (I think, no visible event): will have." },
      { id: "4-7", prompt: "\"She ___ take a break — she's been working for 12 hours straight.\"", options: ["will take", "takes", "is going to take", "took"], correctIndex: 2, explanation: "Observable exhaustion = going to: is going to take a break." },
      { id: "4-8", prompt: "\"You look upset. I ___ get you a cup of tea.\" (spontaneous care)", options: ["am going to", "do", "would", "'ll"], correctIndex: 3, explanation: "Spontaneous caring offer: I'll get you a tea (will)." },
      { id: "4-9", prompt: "\"They ___ announce the winner at midnight — it says so on the website.\"", options: ["are going to announce", "will announce", "announce", "announced"], correctIndex: 0, explanation: "Pre-confirmed schedule: are going to announce." },
      { id: "4-10", prompt: "\"The engine is overheating — the car ___ break down if we don't stop!\"", options: ["will break down", "breaks down", "is going to break down", "broke down"], correctIndex: 2, explanation: "Observable warning sign (overheating): is going to break down." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Plan vs spontaneous",
  2: "Evidence vs opinion",
  3: "Most natural",
  4: "Dialogues",
};

export default function WillVsGoingToClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

  const current = SETS[exNo];

  const score = useMemo(() => {
    if (!checked) return null;
    let correct = 0;
    for (const q of current.questions) {
      if (answers[q.id] === q.correctIndex) correct++;
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
          <span className="text-slate-700 font-medium">will vs going to</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Be Going To{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">will vs going to</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 border border-rose-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">B1</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions on <b>be going to</b> vs <b>will</b> — emphasising when going to is needed: plans &amp; intentions, evidence-based predictions; and when will is needed: spontaneous decisions, promises, opinions.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
            </div>
          </aside>

          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <div className="ml-auto hidden sm:flex items-center gap-2">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {tab === "exercises" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-black text-slate-900">{current.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">{current.instructions}</p>
                    <div className="mt-3 flex sm:hidden items-center gap-2">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3, 4] as const).map((n) => (
                        <button key={n} onClick={() => switchSet(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 space-y-5">
                    {current.questions.map((q, idx) => {
                      const chosen = answers[q.id] ?? null;
                      const isCorrect = checked && chosen === q.correctIndex;
                      const isWrong = checked && chosen !== null && chosen !== q.correctIndex;
                      const noAnswer = checked && chosen === null;
                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => (
                                  <label key={oi} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition ${chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"} ${checked ? "cursor-default" : ""}`}>
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => setAnswers((p) => ({ ...p, [q.id]: oi }))} className="accent-[#F5DA20]" />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-1.5 text-slate-600"><b className="text-slate-900">Correct answer:</b> {q.options[q.correctIndex]} — {q.explanation}</div>
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
                        <button onClick={() => { setChecked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
                      ) : (
                        <button onClick={reset} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">Try Again</button>
                      )}
                      {checked && exNo < 4 && (
                        <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">Next Exercise →</button>
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
                        <div className="mt-2 text-xs text-slate-500">{score.percent >= 80 ? "Excellent! Move on to the next exercise." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}</div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Explanation />
              )}
            </div>
          </section>

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
            </div>
          </aside>
        </div>

        <div className="mt-8 lg:hidden rounded-2xl border border-black/10 bg-white/60 p-4">
          <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
          <div className="mt-3 h-[90px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">320 × 90</div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/be-going-to" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Be Going To exercises</a>
        </div>
      </div>
    </div>
  );
}

function Formula({ parts }: { parts: Array<{ text: string; color?: string }> }) {
  const colors: Record<string, string> = {
    sky: "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
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
      {/* Two focus cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-200 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">be going to — two uses</span>
          <div className="text-xs text-slate-600 space-y-3">
            <div>
              <div className="font-black text-slate-700 mb-1">📅 Plans &amp; intentions (decided BEFORE)</div>
              <Formula parts={[{ text: "already booked / decided / arranged", color: "sky" }, { text: "→ going to", color: "sky" }]} />
            </div>
            <div>
              <div className="font-black text-slate-700 mb-1">👁 Evidence predictions (visible NOW)</div>
              <Formula parts={[{ text: "Look! / Watch out! / I can see…", color: "violet" }, { text: "→ going to", color: "sky" }]} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Ex en="I'm going to visit Rome — tickets booked!" />
            <Ex en="Watch out — that vase is going to fall!" />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-yellow-50 to-white border border-yellow-200 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-yellow-400 px-3 py-1 text-xs font-black text-black">will — three uses</span>
          <div className="text-xs text-slate-600 space-y-3">
            <div>
              <div className="font-black text-slate-700 mb-1">⚡ Spontaneous decisions (decided NOW)</div>
              <Formula parts={[{ text: "situation happens", color: "slate" }, { text: "→ I'll", color: "yellow" }]} />
            </div>
            <div>
              <div className="font-black text-slate-700 mb-1">🤞 Promises &amp; offers</div>
              <Formula parts={[{ text: "I promise…", color: "violet" }, { text: "/ Shall I…?", color: "violet" }, { text: "→ will", color: "yellow" }]} />
            </div>
            <div>
              <div className="font-black text-slate-700 mb-1">💭 Opinion predictions</div>
              <Formula parts={[{ text: "I think / I believe…", color: "violet" }, { text: "→ will", color: "yellow" }]} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Ex en={`"No coffee!" → "I'll get some."`} />
            <Ex en="I'll be there on time — I promise." />
            <Ex en="I think prices will fall." />
          </div>
        </div>
      </div>

      {/* Full comparison table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Complete comparison table</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Function</th>
                <th className="px-4 py-2.5 font-black text-sky-700">be going to</th>
                <th className="px-4 py-2.5 font-black text-yellow-700">will</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Pre-made plans", "✅ I'm going to study medicine.", "❌"],
                ["Spontaneous decisions", "❌", "✅ I'll get the door."],
                ["Evidence predictions", "✅ It's going to rain! (clouds visible)", "❌"],
                ["Opinion predictions", "❌", "✅ I think it will rain tomorrow."],
                ["Promises", "❌ (unnatural)", "✅ I'll be there. / I won't forget."],
                ["Polite offers", "❌", "✅ Shall I / I'll carry that."],
              ].map(([fn, going, will], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2.5 text-slate-700 text-xs font-semibold">{fn}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-xs">{going}</td>
                  <td className="px-4 py-2.5 text-yellow-700 font-mono text-xs">{will}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-2">The most common error</div>
        <div className="space-y-2 text-sm text-amber-900">
          <div>❌ &quot;I&apos;ll start a new job next month — I signed the contract last week.&quot;</div>
          <div>✅ &quot;I&apos;m going to start a new job next month — I signed the contract last week.&quot;</div>
          <div className="mt-2 text-xs">Contract signed = decision made BEFORE → must use going to.</div>
        </div>
      </div>

      {/* Context signal words */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Context signal summary</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-sky-50 border border-sky-200 p-4 space-y-2">
            <div className="text-sm font-black text-sky-800">→ be going to</div>
            <div className="flex flex-wrap gap-1.5">
              {["already booked", "already decided", "I've arranged", "Look!", "Watch out!", "I can see/hear/smell", "I've been preparing", "the plan is confirmed", "I signed up"].map((s) => (
                <span key={s} className="rounded-lg bg-white border border-sky-200 px-2 py-0.5 text-xs font-semibold text-sky-800">{s}</span>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4 space-y-2">
            <div className="text-sm font-black text-yellow-800">→ will</div>
            <div className="flex flex-wrap gap-1.5">
              {["I think…", "I believe…", "I'm sure…", "I promise", "Shall I…?", "deciding right now", "reacting to situation", "there's no X", "the phone is ringing"].map((s) => (
                <span key={s} className="rounded-lg bg-white border border-yellow-200 px-2 py-0.5 text-xs font-semibold text-yellow-800">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
