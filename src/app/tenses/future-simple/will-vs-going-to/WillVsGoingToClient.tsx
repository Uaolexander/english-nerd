"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";

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
    title: "Exercise 1 — Planned vs spontaneous",
    instructions:
      "Use 'will' for spontaneous decisions (made at the moment of speaking). Use 'be going to' for plans made before the moment. Exactly 5 answers use will and 5 use going to.",
    questions: [
      { id: "1-1", prompt: "\"The doorbell rang.\" \"I ___ get it.\" (decided just now)", options: ["I'll get it", "am going to get", "get", "was going to get"], correctIndex: 0, explanation: "Spontaneous decision: I'll get it (decided at this very moment)." },
      { id: "1-2", prompt: "\"I've already bought the tickets. We ___ see Hamilton on Saturday.\"", options: ["will see", "are going to see", "see", "would see"], correctIndex: 1, explanation: "Pre-made plan (tickets already bought): are going to see." },
      { id: "1-3", prompt: "\"We have no milk.\" \"I ___ get some from the corner shop.\" (deciding now)", options: ["am going to get", "would get", "'ll get", "get"], correctIndex: 2, explanation: "Spontaneous decision made at the moment: I'll get some." },
      { id: "1-4", prompt: "\"I've decided — I ___ apply for the MBA programme next year.\"", options: ["will apply", "apply", "was going to apply", "am going to apply"], correctIndex: 3, explanation: "Pre-decided intention: am going to apply." },
      { id: "1-5", prompt: "\"This bag is too heavy for you.\" \"___ carry it for you.\" (instant offer)", options: ["I'll", "I'm going to", "I", "I would"], correctIndex: 0, explanation: "Spontaneous offer: I'll carry it (decided now)." },
      { id: "1-6", prompt: "\"We ___ renovate the kitchen — we've already hired a contractor.\"", options: ["will renovate", "renovate", "are going to renovate", "renovated"], correctIndex: 2, explanation: "Pre-arranged plan (contractor hired): are going to renovate." },
      { id: "1-7", prompt: "\"There's no answer at the door.\" \"___ try calling her instead.\"", options: ["I'm going to", "I would", "I", "I'll"], correctIndex: 3, explanation: "Spontaneous alternative decision: I'll try calling her." },
      { id: "1-8", prompt: "\"She ___ study medicine — she submitted her application last week.\"", options: ["will study", "is going to study", "studies", "studied"], correctIndex: 1, explanation: "Application already submitted = pre-made plan: is going to study." },
      { id: "1-9", prompt: "\"The computer's crashed.\" \"I ___ restart it.\" (deciding right now)", options: ["am going to", "do", "'ll", "would"], correctIndex: 2, explanation: "Spontaneous reaction: I'll restart it." },
      { id: "1-10", prompt: "\"They ___ open a new branch in Madrid — the board approved it yesterday.\"", options: ["will open", "open", "would open", "are going to open"], correctIndex: 3, explanation: "Approved plan: are going to open (decision already made)." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Evidence (going to) vs opinion (will)",
    instructions:
      "Use 'be going to' when there is visible evidence right now. Use 'will' when it is an opinion or guess (no immediate evidence). 5 sentences need going to, 5 need will.",
    questions: [
      { id: "2-1", prompt: "Look at those clouds! It ___ rain any second.", options: ["is going to", "will", "rains", "rained"], correctIndex: 0, explanation: "Visible evidence (storm clouds): is going to rain." },
      { id: "2-2", prompt: "\"I think prices ___ rise next year,\" said the analyst.", options: ["are going to rise", "will rise", "rise", "rose"], correctIndex: 1, explanation: "Opinion/prediction without current evidence: will rise." },
      { id: "2-3", prompt: "Watch out! That vase ___ fall off the shelf!", options: ["will", "falls", "is going to", "fell"], correctIndex: 2, explanation: "Visible immediate danger (vase tipping): is going to fall." },
      { id: "2-4", prompt: "I believe technology ___ change our lives completely in 20 years.", options: ["is going to", "changes", "changed", "will"], correctIndex: 3, explanation: "Opinion-based long-term prediction (no current evidence): will change." },
      { id: "2-5", prompt: "She's looking very pale — she ___ faint.", options: ["is going to", "will", "faints", "fainted"], correctIndex: 0, explanation: "Visible evidence (pale appearance): is going to faint." },
      { id: "2-6", prompt: "I think the new café ___ be a big hit with locals.", options: ["is going to be", "will be", "is", "was"], correctIndex: 1, explanation: "Personal opinion prediction: will be a big hit." },
      { id: "2-7", prompt: "He's driving way too fast — he ___ crash!", options: ["will", "crashes", "is going to", "crashed"], correctIndex: 2, explanation: "Visible evidence (dangerous speed): is going to crash." },
      { id: "2-8", prompt: "I'm sure the economy ___ recover after the reforms.", options: ["is going to", "recovers", "recovered", "will"], correctIndex: 3, explanation: "Opinion/hope, no immediate evidence: will recover." },
      { id: "2-9", prompt: "Look at him — he ___ sneeze! (he's holding his nose)", options: ["is going to", "will", "sneezes", "sneezed"], correctIndex: 0, explanation: "Observable sign (nose-holding): is going to sneeze." },
      { id: "2-10", prompt: "She's very talented. I think she ___ win the award.", options: ["is going to win", "will win", "wins", "won"], correctIndex: 1, explanation: "Opinion-based prediction (no visible event happening now): will win." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Intentions (going to) vs decisions (will)",
    instructions:
      "An intention is a plan you decided before. A spontaneous decision happens now. Choose will or going to accordingly. Mix of 5+5.",
    questions: [
      { id: "3-1", prompt: "\"I ___ visit Paris next month — I've already booked the flights.\"", options: ["am going to visit", "will visit", "visit", "visited"], correctIndex: 0, explanation: "Pre-booked trip = prior intention: am going to visit." },
      { id: "3-2", prompt: "\"Oh, the door! ___ get it.\" (just heard a knock)", options: ["I'm going to", "I'll", "I", "I would"], correctIndex: 1, explanation: "Spontaneous reaction: I'll get it." },
      { id: "3-3", prompt: "\"I've made up my mind — I ___ quit my job and travel.\"", options: ["will quit", "quit", "am going to quit", "quitted"], correctIndex: 2, explanation: "Pre-made decision/intention: am going to quit." },
      { id: "3-4", prompt: "\"You look tired.\" \"Yes, I think I ___ take a nap.\" (deciding now)", options: ["am going to", "do", "would", "'ll"], correctIndex: 3, explanation: "Spontaneous decision upon reflection: I'll take a nap." },
      { id: "3-5", prompt: "\"She ___ move to Berlin — she's already found an apartment.\"", options: ["is going to move", "will move", "moves", "moved"], correctIndex: 0, explanation: "Apartment found = pre-arranged: is going to move." },
      { id: "3-6", prompt: "\"The printer is jammed.\" \"___ fix it.\" (reacting now)", options: ["I'm going to", "I'll", "I", "I would"], correctIndex: 1, explanation: "Spontaneous decision: I'll fix it." },
      { id: "3-7", prompt: "\"They ___ launch a new product line — the R&D team has been working on it for months.\"", options: ["will launch", "launch", "are going to launch", "launched"], correctIndex: 2, explanation: "Long-term plan in progress: are going to launch." },
      { id: "3-8", prompt: "\"There's no coffee.\" \"I ___ make some.\" (just decided)", options: ["am going to", "do", "would", "'ll"], correctIndex: 3, explanation: "Spontaneous decision: I'll make some." },
      { id: "3-9", prompt: "\"I ___ learn Italian next year — I've enrolled in a class.\"", options: ["am going to learn", "will learn", "learn", "learned"], correctIndex: 0, explanation: "Enrolled = pre-arranged intention: am going to learn." },
      { id: "3-10", prompt: "\"This box is too big.\" \"Wait — ___ get a knife and cut it open.\"", options: ["I'm going to", "I'll", "I", "I would"], correctIndex: 1, explanation: "Spontaneous problem-solving decision: I'll get a knife." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Hard mixed: will or going to?",
    instructions:
      "These sentences require careful reading of the context. Choose the more natural form. Some have clear signals, others require judgement. Answers vary throughout.",
    questions: [
      { id: "4-1", prompt: "\"I promise I ___ be more careful next time.\"", options: ["will", "am going to", "am", "was going to"], correctIndex: 0, explanation: "Promise: will is used for promises (not going to)." },
      { id: "4-2", prompt: "\"According to the schedule, the train ___ depart at 14:30.\"", options: ["will depart", "is going to depart", "departs", "departed"], correctIndex: 0, explanation: "Timetabled event: will (or present simple) for schedules." },
      { id: "4-3", prompt: "\"I can smell something burning — the cake ___ burn!\"", options: ["will", "burns", "is going to", "burned"], correctIndex: 2, explanation: "Sensory evidence (smell): is going to burn." },
      { id: "4-4", prompt: "\"I'm sure she ___ do well in the interview — she's very well prepared.\"", options: ["is going to", "does", "will", "did"], correctIndex: 2, explanation: "Opinion-based prediction with 'I'm sure': will do well." },
      { id: "4-5", prompt: "\"We ___ have a baby! We found out last week.\"", options: ["will have", "have", "had", "are going to have"], correctIndex: 3, explanation: "Already confirmed news/plan: are going to have a baby." },
      { id: "4-6", prompt: "\"I think the film ___ win the Oscar — it's incredible.\"", options: ["is going to win", "will win", "wins", "won"], correctIndex: 1, explanation: "Opinion prediction (I think): will win." },
      { id: "4-7", prompt: "\"The patient ___ need surgery — the scans confirm it.\"", options: ["will need", "needs", "is going to need", "needed"], correctIndex: 2, explanation: "Medical evidence from scans: is going to need (evidence-based)." },
      { id: "4-8", prompt: "\"Shall I carry that?\" \"No, it's fine — I ___ manage.\" (saying it now)", options: ["am going to", "manage", "would", "will"], correctIndex: 3, explanation: "Spontaneous decision/reassurance: I'll manage (will)." },
      { id: "4-9", prompt: "\"She ___ retire at 60 — it's always been her plan.\"", options: ["is going to retire", "will retire", "retires", "retired"], correctIndex: 0, explanation: "Long-held intention/plan: is going to retire." },
      { id: "4-10", prompt: "\"I ___ call you back in five minutes.\"", options: ["am going to", "call", "will", "would"], correctIndex: 2, explanation: "Spontaneous promise/offer: will call you back." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Plan vs spontaneous",
  2: "Evidence vs opinion",
  3: "Intention vs decision",
  4: "Hard mixed",
};

export default function WillVsGoingToClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

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
          <a className="hover:text-slate-900 transition" href="/tenses/future-simple">Future Simple</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">will vs going to</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">will vs going to</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 border border-rose-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">B1</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions on the key distinction: <b>will</b> (spontaneous decisions, promises, opinion predictions) vs <b>be going to</b> (plans made earlier, evidence-based predictions).
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <AdUnit variant="sidebar-dark" />

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

          <AdUnit variant="sidebar-dark" />
        </div>

        <AdUnit variant="mobile-dark" />

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-simple" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Future Simple exercises</a>
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
      {/* 2 comparison cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-b from-yellow-50 to-white border border-yellow-200 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-yellow-400 px-3 py-1 text-xs font-black text-black">will</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "will", color: "yellow" },
            { text: "verb", color: "green" },
          ]} />
          <div className="text-xs text-slate-600 space-y-1">
            <div className="font-black text-slate-700 mb-1">Use will for:</div>
            <div>⚡ Spontaneous decisions (decided NOW)</div>
            <div>🤞 Promises &amp; offers</div>
            <div>💭 Opinion predictions (I think, I believe)</div>
            <div>📋 Scheduled facts</div>
          </div>
          <div className="space-y-1.5">
            <Ex en={`"The phone is ringing." → "I'll get it!"`} />
            <Ex en="I think it will rain tomorrow." />
            <Ex en="I'll help you move the boxes." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-200 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">be going to</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "am/is/are", color: "violet" },
            { text: "going to", color: "sky" },
            { text: "verb", color: "green" },
          ]} />
          <div className="text-xs text-slate-600 space-y-1">
            <div className="font-black text-slate-700 mb-1">Use going to for:</div>
            <div>📅 Plans &amp; intentions already made</div>
            <div>👁 Evidence-based predictions (can see/feel)</div>
          </div>
          <div className="space-y-1.5">
            <Ex en="I'm going to Paris next month. (booked)" />
            <Ex en="Look at those clouds — it's going to rain!" />
            <Ex en="She's going to faint — she looks so pale." />
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Side-by-side comparison</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Situation</th>
                <th className="px-4 py-2.5 font-black text-yellow-700">will ✓</th>
                <th className="px-4 py-2.5 font-black text-sky-700">be going to ✓</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Decision made NOW", "I'll take it.", "—"],
                ["Decision made BEFORE", "—", "I'm going to take it. (already decided)"],
                ["Opinion prediction", "I think it will work.", "—"],
                ["Evidence prediction", "—", "Look — it's going to rain! (clouds visible)"],
                ["Promise", "I'll be there. / I won't forget.", "—"],
              ].map(([sit, will, going], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2.5 text-slate-700 text-xs font-semibold">{sit}</td>
                  <td className="px-4 py-2.5 text-yellow-700 font-mono text-xs">{will}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-xs">{going}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signal words */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Signal words &amp; clues</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4 space-y-2">
            <div className="text-sm font-black text-yellow-800">→ will</div>
            <div className="flex flex-wrap gap-1.5">
              {["I think…", "I believe…", "I'm sure…", "I doubt…", "probably", "definitely", "I promise", "Shall I…?", "right now (reacting)"].map((s) => (
                <span key={s} className="rounded-lg bg-white border border-yellow-200 px-2 py-0.5 text-xs font-semibold text-yellow-800">{s}</span>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-sky-50 border border-sky-200 p-4 space-y-2">
            <div className="text-sm font-black text-sky-800">→ be going to</div>
            <div className="flex flex-wrap gap-1.5">
              {["Look!", "Watch out!", "already booked", "already decided", "I've arranged…", "the plan is…", "I can see/feel…", "according to the plan"].map((s) => (
                <span key={s} className="rounded-lg bg-white border border-sky-200 px-2 py-0.5 text-xs font-semibold text-sky-800">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-2">Tricky cases</div>
        <div className="space-y-2 text-sm text-amber-900">
          <div><b>Both can express future plans</b> in informal speech, but going to is more natural for confirmed plans.</div>
          <div><b>Promises:</b> always use will, not going to.</div>
          <div>✅ &quot;I&apos;ll be there.&quot; ❌ &quot;I&apos;m going to be there.&quot; (as a promise)</div>
        </div>
      </div>
    </div>
  );
}
