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
    title: "Exercise 1 — Spontaneous decisions",
    instructions:
      "A spontaneous decision is made at the moment of speaking — NOT planned beforehand. Use will / I'll. Some sentences need 'Shall I?' for offers. Choose the correct option.",
    questions: [
      { id: "1-1", prompt: "The phone is ringing. \"Don't worry — ___ answer it.\"", options: ["I'll", "I'm going to", "I will be", "I'm"], correctIndex: 0, explanation: "Spontaneous decision made at the moment: I'll answer it." },
      { id: "1-2", prompt: "\"It's cold in here.\" \"___ close the window?\"", options: ["Will I", "Shall I", "Am I going to", "Should I"], correctIndex: 1, explanation: "'Shall I?' is used for making offers/suggestions. Shall I close the window?" },
      { id: "1-3", prompt: "\"There's no coffee left.\" \"I ___ go and buy some.\"", options: ["am going to", "will be", "'ll", "am"], correctIndex: 2, explanation: "Spontaneous decision: I'll go and buy some." },
      { id: "1-4", prompt: "\"I can't carry all these bags.\" \"Don't worry, ___ help you.\"", options: ["I'm going to", "I will be", "I am", "I'll"], correctIndex: 3, explanation: "Spontaneous offer: I'll help you (decided right now)." },
      { id: "1-5", prompt: "\"___ carry this for you?\" — formal offer", options: ["Shall I", "Will I", "Am I going to", "Do I"], correctIndex: 0, explanation: "'Shall I?' makes a polite offer: Shall I carry this for you?" },
      { id: "1-6", prompt: "\"I'm hungry.\" \"___ make you a sandwich.\"", options: ["I'm going to", "I'll", "I will be", "I am"], correctIndex: 1, explanation: "Spontaneous offer: I'll make you a sandwich (decided just now)." },
      { id: "1-7", prompt: "\"___ open the door for you?\" — polite offer", options: ["Will I", "Am I going to", "Shall I", "Would I"], correctIndex: 2, explanation: "'Shall I?' is the standard form for polite offers." },
      { id: "1-8", prompt: "\"The printer is broken.\" \"I ___ call the technician.\"", options: ["am going to", "will be", "am", "'ll"], correctIndex: 3, explanation: "Spontaneous decision: I'll call the technician (decided now)." },
      { id: "1-9", prompt: "\"I need someone to pick up the kids.\" \"I ___ do it — I'm free this afternoon.\"", options: ["'ll", "am going to", "will be", "am"], correctIndex: 0, explanation: "Spontaneous volunteer: I'll do it (decided in the moment)." },
      { id: "1-10", prompt: "\"___ wait here while you go inside?\" — offering to wait", options: ["Will I", "Shall I", "Am I going to", "Do I"], correctIndex: 1, explanation: "'Shall I wait?' = an offer to wait for the other person." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Offers with Shall I / Shall we",
    instructions:
      "Choose the correct subject after 'Shall' for offers and suggestions. Shall I = offering to do something for one person; Shall we = suggesting doing something together.",
    questions: [
      { id: "2-1", prompt: "\"Shall ___ book a table for tonight?\" (I'm suggesting it to you)", options: ["I", "we", "you", "they"], correctIndex: 0, explanation: "'Shall I' = I am offering to do it for you." },
      { id: "2-2", prompt: "\"Shall ___ go to the cinema this evening?\" (both of us)", options: ["I", "we", "you", "they"], correctIndex: 1, explanation: "'Shall we' = suggesting doing something together." },
      { id: "2-3", prompt: "\"Shall ___ help you with your homework?\" (offering help)", options: ["you", "they", "we", "I"], correctIndex: 3, explanation: "'Shall I help you?' = offering personal help." },
      { id: "2-4", prompt: "\"Shall ___ take a taxi or walk?\" (deciding together)", options: ["I", "we", "you", "they"], correctIndex: 1, explanation: "'Shall we take a taxi?' = suggesting a joint decision." },
      { id: "2-5", prompt: "\"Shall ___ get the bill?\" (offering to pay for everyone)", options: ["I", "we", "you", "they"], correctIndex: 0, explanation: "'Shall I get the bill?' = offering to pay." },
      { id: "2-6", prompt: "\"Shall ___ order some food?\" (to the group, deciding together)", options: ["I", "we", "you", "they"], correctIndex: 1, explanation: "'Shall we order' = group decision/suggestion." },
      { id: "2-7", prompt: "\"Shall ___ turn the heating on?\" (you feel cold; offering for all)", options: ["they", "you", "we", "I"], correctIndex: 3, explanation: "'Shall I turn the heating on?' = offering to do it for everyone." },
      { id: "2-8", prompt: "\"Shall ___ start the meeting now?\" (suggesting to the team)", options: ["I", "they", "we", "you"], correctIndex: 2, explanation: "'Shall we start?' = group suggestion." },
      { id: "2-9", prompt: "\"Shall ___ wait for Sarah before we eat?\" (group decision)", options: ["I", "they", "we", "you"], correctIndex: 2, explanation: "'Shall we wait?' = asking if the group should wait." },
      { id: "2-10", prompt: "\"Shall ___ carry those bags for you?\" (offering personal help)", options: ["I", "we", "you", "they"], correctIndex: 0, explanation: "'Shall I carry those bags?' = offering to help someone." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Promises with will / won't",
    instructions:
      "Promises use will (positive promise) or won't (promise NOT to do something). Choose the correct form — some contexts need won't, others need will, and some 'Shall I?' for offers.",
    questions: [
      { id: "3-1", prompt: "\"I promise I ___ be late to the wedding.\"", options: ["won't", "will", "am going to", "shall"], correctIndex: 0, explanation: "Promise not to do: I won't be late." },
      { id: "3-2", prompt: "\"I ___ call you the moment I arrive.\"", options: ["won't", "will", "am going to", "shall"], correctIndex: 1, explanation: "Positive promise: I will call you." },
      { id: "3-3", prompt: "\"I promise I ___ tell anyone your secret.\"", options: ["will", "am going to", "won't", "shall"], correctIndex: 2, explanation: "Promise not to do: I won't tell anyone." },
      { id: "3-4", prompt: "\"Don't worry — I ___ be there for you, no matter what.\"", options: ["won't", "am going to", "shall", "will"], correctIndex: 3, explanation: "Positive promise of support: I will be there for you." },
      { id: "3-5", prompt: "\"I ___ give up — I promise I'll keep trying.\"", options: ["won't", "will", "am going to", "shall"], correctIndex: 0, explanation: "Promise not to quit: I won't give up." },
      { id: "3-6", prompt: "\"I ___ always love you — no matter what happens.\"", options: ["won't", "will", "am going to", "shall"], correctIndex: 1, explanation: "Positive lifelong promise: I will always love you." },
      { id: "3-7", prompt: "\"I ___ let you down again — you have my word.\"", options: ["will", "am going to", "won't", "shall"], correctIndex: 2, explanation: "Promise not to do (again): I won't let you down." },
      { id: "3-8", prompt: "\"I ___ support you in whatever you decide.\"", options: ["won't", "am going to", "shall", "will"], correctIndex: 3, explanation: "Positive supportive promise: I will support you." },
      { id: "3-9", prompt: "\"I ___ shout at you again — I'm sorry about last time.\"", options: ["won't", "will", "am going to", "shall"], correctIndex: 0, explanation: "Promise not to repeat behaviour: I won't shout at you again." },
      { id: "3-10", prompt: "\"I ___ do my best to make this work.\"", options: ["won't", "will", "am going to", "shall"], correctIndex: 1, explanation: "Positive commitment/promise: I will do my best." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Promises, offers & decisions: identify & choose",
    instructions:
      "Each sentence shows a use of will. Choose the correct form AND identify which function it has: (A) spontaneous decision, (B) offer with Shall, (C) positive promise, or (D) negative promise. Select the correct word/phrase.",
    questions: [
      { id: "4-1", prompt: "\"It's raining! ___ get the umbrella from the car.\" (spontaneous decision)", options: ["I'll", "Shall I", "I'm going to", "I plan to"], correctIndex: 0, explanation: "Spontaneous decision: I'll get the umbrella (decided now)." },
      { id: "4-2", prompt: "\"___ translate this document for you?\" (formal offer)", options: ["Will I", "Shall I", "Am I going to", "Do I"], correctIndex: 1, explanation: "Polite offer: Shall I translate this for you?" },
      { id: "4-3", prompt: "\"I promise I ___ forget your birthday this year.\"", options: ["will", "am going to", "won't", "shall"], correctIndex: 2, explanation: "Negative promise (promise NOT to forget): I won't forget." },
      { id: "4-4", prompt: "\"I ___ always be honest with you.\" (positive promise)", options: ["won't", "am going to", "shall", "will"], correctIndex: 3, explanation: "Positive promise: I will always be honest." },
      { id: "4-5", prompt: "\"You look exhausted. ___ make you some tea?\" (offer)", options: ["Shall I", "Will I", "Am I going to", "Must I"], correctIndex: 0, explanation: "Offer: Shall I make you some tea?" },
      { id: "4-6", prompt: "\"The bag is too heavy for you. ___ carry it.\" (spontaneous offer)", options: ["I'm going to", "I'll", "I will be", "I am"], correctIndex: 1, explanation: "Spontaneous offer/decision: I'll carry it." },
      { id: "4-7", prompt: "\"I ___ never speak to him again — I promise.\"", options: ["will", "am going to", "won't", "shall"], correctIndex: 2, explanation: "Negative promise: I won't (never) speak to him again." },
      { id: "4-8", prompt: "\"I ___ email you the report by 5 PM — you have my word.\"", options: ["won't", "am going to", "shall", "will"], correctIndex: 3, explanation: "Positive promise: I will email you the report." },
      { id: "4-9", prompt: "\"___ meet you at the airport? I can be there at 3.\" (offer)", options: ["Shall I", "Will I", "Am I going to", "Do I"], correctIndex: 0, explanation: "Offer/suggestion: Shall I meet you at the airport?" },
      { id: "4-10", prompt: "\"I ___ do it — it's wrong and I won't change my mind.\"", options: ["will", "won't", "am going to", "shall"], correctIndex: 1, explanation: "Strong refusal/negative decision: I won't do it." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Decisions",
  2: "Shall I/we",
  3: "Promises",
  4: "All uses",
};

export default function PromisesOffersClient() {
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
          <span className="text-slate-700 font-medium">Promises, Offers &amp; Decisions</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Promises, Offers &amp; Decisions</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2–B1</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions on three key uses of <b>will</b>: spontaneous decisions, polite offers with <b>Shall I/we</b>, and promises with <b>will/won&apos;t</b>.
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
      {/* 3 gradient formula cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">⚡ Spontaneous decision</span>
          <Formula parts={[
            { text: "Situation happens", color: "slate" },
            { text: "→", color: "slate" },
            { text: "I'll / I will", color: "yellow" },
            { text: "verb (decided RIGHT NOW)", color: "green" },
          ]} />
          <div className="space-y-1.5">
            <Ex en={`"The phone is ringing." → "I'll get it!"`} />
            <Ex en={`"We have no bread." → "I'll go to the shop."`} />
            <Ex en="Key: the decision was NOT made before — it happens at the moment of speaking." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">🤝 Offers with Shall</span>
          <Formula parts={[
            { text: "Shall", color: "violet" },
            { text: "I / we", color: "sky" },
            { text: "verb (base form)", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Shall I open the window? (offering to do something for you)" />
            <Ex en="Shall we go for a walk? (suggesting something to do together)" />
            <Ex en="Shall I vs Shall we: I = for you only; we = both of us together" />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">🤞 Promises</span>
          <Formula parts={[
            { text: "I will", color: "yellow" },
            { text: "verb (positive promise)", color: "green" },
          ]} />
          <Formula parts={[
            { text: "I won't", color: "red" },
            { text: "verb (promise NOT to do)", color: "green" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I will be there for you. (positive promise)" />
            <Ex en="I won't tell anyone. (promise not to do something)" />
            <Ex en="I won't let you down. (promise of loyalty)" />
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Comparing spontaneous will vs planned going to</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Situation</th>
                <th className="px-4 py-2.5 font-black text-yellow-700">will (spontaneous)</th>
                <th className="px-4 py-2.5 font-black text-sky-700">be going to (planned)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["You see a heavy bag", "\"I'll carry that!\" (decided now)", "— (no plan before)"],
                ["You planned to help", "—", "\"I'm going to help him move.\" (planned last week)"],
                ["Phone rings", "\"I'll get it!\" (instant decision)", "—"],
                ["You booked a trip", "—", "\"I'm going to Paris.\" (already booked)"],
              ].map(([sit, will, going], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2.5 text-slate-700 text-xs">{sit}</td>
                  <td className="px-4 py-2.5 text-yellow-700 font-mono text-xs">{will}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-xs">{going}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-2">Common mistakes to avoid</div>
        <div className="space-y-1 text-sm text-amber-900">
          <div>❌ &quot;I&apos;m going to carry that for you.&quot; (if decided just now → use will!)</div>
          <div>✅ &quot;I&apos;ll carry that for you.&quot;</div>
          <div className="mt-2">❌ &quot;Shall you open the door?&quot; (Shall is only for I and we in offers)</div>
          <div>✅ &quot;Shall I open the door?&quot;</div>
        </div>
      </div>

      {/* Uses summary */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Three uses of will</div>
        <div className="space-y-2">
          {[
            { label: "⚡ Spontaneous decision", ex: "\"It's hot.\" → \"I'll open the window.\" (decided right now)" },
            { label: "🤝 Offer (Shall I/we)", ex: "\"Shall I get you a coffee?\" / \"Shall we go?\"" },
            { label: "🤞 Positive promise", ex: "\"I'll call you tonight.\" / \"I'll be there for you.\"" },
            { label: "🚫 Negative promise", ex: "\"I won't be late.\" / \"I won't tell a soul.\"" },
          ].map(({ label, ex }) => (
            <div key={label} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800">{label}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-mono">{ex}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
