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
    title: "Exercise 1 — Identify the plan context",
    instructions:
      "Choose the correct future form. When the context shows a pre-decided plan (booking, deciding, arranging), use 'be going to'. When a decision is made at the moment, use 'will'. Answers are mixed.",
    questions: [
      { id: "1-1", prompt: "\"I ___ Paris next month — I booked the flights last week.\"", options: ["am going to visit", "am visiting", "will visit", "visit"], correctIndex: 0, explanation: "Flights already booked = pre-made plan: am going to visit." },
      { id: "1-2", prompt: "\"There's no paper in the printer.\" \"I ___ get some from the cupboard.\" (deciding now)", options: ["am going to get", "will get", "get", "got"], correctIndex: 1, explanation: "Spontaneous decision made at the moment: will get (not going to)." },
      { id: "1-3", prompt: "\"She ___ leave her job — she's already handed in her notice.\"", options: ["will leave", "leaves", "is going to leave", "left"], correctIndex: 2, explanation: "Notice already given = pre-made decision: is going to leave." },
      { id: "1-4", prompt: "\"I ___ learn Spanish — I signed up for classes yesterday.\"", options: ["will learn", "learn", "learned", "am going to learn"], correctIndex: 3, explanation: "Already signed up = pre-made intention: am going to learn." },
      { id: "1-5", prompt: "\"The lift is broken.\" \"I ___ take the stairs then.\" (deciding now)", options: ["will take", "am going to take", "take", "took"], correctIndex: 0, explanation: "Spontaneous decision: I'll take the stairs (will)." },
      { id: "1-6", prompt: "\"They ___ build a new hospital — the council voted for it last month.\"", options: ["will build", "are going to build", "build", "built"], correctIndex: 1, explanation: "Decision already made by vote: are going to build." },
      { id: "1-7", prompt: "\"I've decided — I ___ buy a new laptop this weekend.\"", options: ["will buy", "buy", "am going to buy", "bought"], correctIndex: 2, explanation: "Decision already made: am going to buy." },
      { id: "1-8", prompt: "\"It's Anna's birthday!\" \"___ get her some flowers.\" (spontaneous idea)", options: ["I'm going to", "I", "I would", "I'll"], correctIndex: 3, explanation: "Spontaneous decision: I'll get her flowers (will)." },
      { id: "1-9", prompt: "\"He ___ apply for the scholarship — he's been preparing his portfolio for months.\"", options: ["is going to apply", "will apply", "applies", "applied"], correctIndex: 0, explanation: "Long preparation = pre-made intention: is going to apply." },
      { id: "1-10", prompt: "\"We ___ redecorate the living room — we've already chosen the paint.\"", options: ["will redecorate", "are going to redecorate", "redecorate", "redecorated"], correctIndex: 1, explanation: "Paint already chosen = pre-made plan: are going to redecorate." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Correct going to form by subject",
    instructions:
      "Choose the correct form of 'be going to' based on the subject. Mix of am/is/are going to and isn't/aren't going to.",
    questions: [
      { id: "2-1", prompt: "I ___ going to apply for the position — I've already updated my CV.", options: ["am", "is", "are", "be"], correctIndex: 0, explanation: "I + am going to (pre-made intention)." },
      { id: "2-2", prompt: "She ___ going to move in with her boyfriend next month.", options: ["am", "is", "are", "be"], correctIndex: 1, explanation: "She + is going to (plan)." },
      { id: "2-3", prompt: "We ___ going to take a cooking class together.", options: ["is", "am", "are", "be"], correctIndex: 2, explanation: "We + are going to (shared plan)." },
      { id: "2-4", prompt: "He ___ going to run the marathon — he's been training for six months.", options: ["am", "be", "are", "is"], correctIndex: 3, explanation: "He + is going to (intention backed by training)." },
      { id: "2-5", prompt: "They ___ going to launch the product in spring.", options: ["are", "is", "am", "be"], correctIndex: 0, explanation: "They + are going to (plan)." },
      { id: "2-6", prompt: "My sister ___ going to get married in June.", options: ["am", "is", "are", "be"], correctIndex: 1, explanation: "My sister (= she) + is going to (plan)." },
      { id: "2-7", prompt: "You ___ going to love the surprise we have for you.", options: ["is", "am", "are", "be"], correctIndex: 2, explanation: "You + are going to (prediction based on context)." },
      { id: "2-8", prompt: "The company ___ going to reduce its carbon footprint by 50%.", options: ["am", "are", "be", "is"], correctIndex: 3, explanation: "The company (= it/singular) + is going to (plan)." },
      { id: "2-9", prompt: "I ___ going to take a few days off — I really need a rest.", options: ["am", "is", "are", "be"], correctIndex: 0, explanation: "I + am going to (intention)." },
      { id: "2-10", prompt: "The new rules ___ going to affect a lot of people.", options: ["am", "is", "are", "be"], correctIndex: 2, explanation: "The new rules (plural) + are going to (plan/prediction)." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Negative intentions",
    instructions:
      "Choose the correct negative form of 'be going to': isn't going to, aren't going to, or 'm not going to. Some sentences need a positive form — read carefully!",
    questions: [
      { id: "3-1", prompt: "I ___ going to accept that offer — the salary is too low.", options: ["'m not", "aren't", "isn't", "not"], correctIndex: 0, explanation: "I + 'm not going to (negative intention)." },
      { id: "3-2", prompt: "She ___ going to renew her contract — she wants a change.", options: ["am not", "isn't", "aren't", "not"], correctIndex: 1, explanation: "She + isn't going to (negative decision)." },
      { id: "3-3", prompt: "They ___ going to relocate the office — it's too expensive.", options: ["isn't", "am not", "aren't", "not"], correctIndex: 2, explanation: "They + aren't going to (negative plan)." },
      { id: "3-4", prompt: "He ___ going to study law — he's changed his mind and chosen engineering.", options: ["am not", "aren't", "not", "isn't"], correctIndex: 3, explanation: "He + isn't going to (changed plan)." },
      { id: "3-5", prompt: "I ___ going to give up learning the guitar, no matter how hard it is.", options: ["'m not", "aren't", "isn't", "not"], correctIndex: 0, explanation: "I + 'm not going to (strong negative intention)." },
      { id: "3-6", prompt: "We ___ going to use that supplier again after what happened.", options: ["isn't", "aren't", "am not", "not"], correctIndex: 1, explanation: "We + aren't going to (negative decision)." },
      { id: "3-7", prompt: "The government ___ going to reduce taxes this year, unfortunately.", options: ["am not", "aren't", "isn't", "not"], correctIndex: 2, explanation: "The government (singular) + isn't going to (negative plan)." },
      { id: "3-8", prompt: "You ___ going to believe this, but I just won the lottery!", options: ["isn't", "am not", "not", "aren't"], correctIndex: 3, explanation: "You + aren't going to (predicting your disbelief)." },
      { id: "3-9", prompt: "She ___ going to attend the event — she has a prior engagement.", options: ["isn't", "am not", "aren't", "not"], correctIndex: 0, explanation: "She + isn't going to (conflict in plans)." },
      { id: "3-10", prompt: "I ___ going to buy a new phone — I decided to save money instead.", options: ["aren't", "'m not", "isn't", "not"], correctIndex: 1, explanation: "I + 'm not going to (changed intention)." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Plans in context: full dialogue mix",
    instructions:
      "Complete these dialogues and sentences. Mix of affirmative going to, negative going to, question forms, and contrast with will. Read the context carefully.",
    questions: [
      { id: "4-1", prompt: "\"___ you going to join the gym?\" \"Yes, I've already signed up!\"", options: ["Am", "Is", "Are", "Do"], correctIndex: 2, explanation: "You → Are you going to…?" },
      { id: "4-2", prompt: "\"She ___ going to open her own business — she's been saving for two years.\"", options: ["am", "are", "is", "be"], correctIndex: 2, explanation: "She + is going to (long-planned intention)." },
      { id: "4-3", prompt: "\"Oh, I forgot to bring my book.\" \"___ lend you mine.\" (spontaneous)", options: ["I'm going to", "I'll", "I", "I am"], correctIndex: 1, explanation: "Spontaneous offer: I'll lend you mine (will)." },
      { id: "4-4", prompt: "\"They ___ release the update until all the bugs are fixed.\"", options: ["are going to", "aren't going to", "will", "am going to"], correctIndex: 1, explanation: "Negative plan: They aren't going to release until bugs are fixed." },
      { id: "4-5", prompt: "\"___ he going to present at the conference?\" \"Yes, he is.\"", options: ["Am", "Are", "Is", "Do"], correctIndex: 2, explanation: "He → Is he going to…?" },
      { id: "4-6", prompt: "\"I've made up my mind — I ___ take a year off to travel.\"", options: ["will take", "am going to take", "take", "would take"], correctIndex: 1, explanation: "Pre-made decision: am going to take (not will)." },
      { id: "4-7", prompt: "\"Are they going to accept?\" \"No, ___.\"", options: ["they aren't", "they won't", "they don't", "they not"], correctIndex: 0, explanation: "Short negative answer: No, they aren't." },
      { id: "4-8", prompt: "\"The milk has run out.\" \"___ pop to the shop.\" (deciding just now)", options: ["I'm going to", "I'll", "I", "I am"], correctIndex: 1, explanation: "Spontaneous decision: I'll pop to the shop (will)." },
      { id: "4-9", prompt: "\"We ___ going to renovate — we've hired the architect already.\"", options: ["is", "am", "are", "be"], correctIndex: 2, explanation: "We + are going to (architect hired = plan in place)." },
      { id: "4-10", prompt: "\"___ she going to study abroad?\" \"No, she isn't — she changed her mind.\"", options: ["Am", "Are", "Is", "Do"], correctIndex: 2, explanation: "She → Is she going to…?" },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Plan context",
  2: "Correct form",
  3: "Negatives",
  4: "Dialogues",
};

export default function PlansIntentionsClient() {
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
          <a className="hover:text-slate-900 transition" href="/tenses/be-going-to">Be Going To</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Plans &amp; Intentions</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Be Going To{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Plans &amp; Intentions</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2–B1</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions on using <b>be going to</b> for plans and intentions already decided — plus contrast with <b>will</b> for spontaneous decisions.
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
      {/* 3 gradient formula cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">📅 Plans already decided</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "am/is/are", color: "violet" },
            { text: "going to", color: "sky" },
            { text: "verb", color: "green" },
            { text: "(plan made BEFORE)", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I'm going to visit my parents next weekend. (decided already)" />
            <Ex en="They're going to open a new office. (already planned)" />
            <Ex en="She's going to apply for the job. (she's already decided)" />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">🎯 Strong intentions</span>
          <Formula parts={[
            { text: "I've decided to…", color: "violet" },
            { text: "/ I'm planning to…", color: "violet" },
            { text: "→ be going to", color: "sky" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I've decided — I'm going to quit smoking." />
            <Ex en="We're planning to renovate the bathroom." />
            <Ex en="I'm going to learn how to cook — I've signed up for a class." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">⚡ Compare: will (spontaneous)</span>
          <Formula parts={[
            { text: "Situation NOW", color: "slate" },
            { text: "→", color: "slate" },
            { text: "I'll", color: "yellow" },
            { text: "verb (decided RIGHT NOW)", color: "green" },
          ]} />
          <div className="space-y-1.5">
            <Ex en={`"We have no coffee." → "I'll get some." (decided just now)`} />
            <Ex en={`"The phone is ringing." → "I'll answer it." (spontaneous)`} />
            <Ex en="Key: will if the decision was NOT made before speaking." />
          </div>
        </div>
      </div>

      {/* Context clues table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Context clues: going to vs will</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-sky-700">→ be going to (plan)</th>
                <th className="px-4 py-2.5 font-black text-yellow-700">→ will (spontaneous)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I've already booked / signed up / paid", "The phone just rang"],
                ["I've decided / I've made up my mind", "There's no X left"],
                ["I've been planning / saving for months", "The door / bell just went"],
                ["I'm planning to…", "I just thought of something"],
                ["We chose / hired / applied already", "Oh, I'll do that now"],
              ].map(([going, will], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
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
        <div className="text-sm font-black text-amber-800 mb-2">Common mistake</div>
        <div className="space-y-1 text-sm text-amber-900">
          <div>❌ &quot;I&apos;ll visit my parents next week — I booked the train yesterday.&quot;</div>
          <div>✅ &quot;I&apos;m going to visit my parents next week — I booked the train yesterday.&quot;</div>
          <div className="mt-2 text-xs">If the plan was made BEFORE the moment of speaking → use going to, not will.</div>
        </div>
      </div>

      {/* Signal phrases */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Signal phrases for going to plans</div>
        <div className="flex flex-wrap gap-2">
          {["I've decided to", "I'm planning to", "I've already booked", "I've signed up", "I've been saving", "I've arranged", "I've made up my mind", "We've agreed to", "I've enrolled"].map((t) => (
            <span key={t} className="rounded-lg bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs font-semibold text-sky-800">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
