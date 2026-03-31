"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";

/* ─── Types ─────────────────────────────────────────────────────────────── */

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

/* ─── Question data ─────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Sequence matters: PP vs PS",
    instructions:
      "Use Past Perfect when one past action clearly happened before another and the sequence matters. Use Past Simple for standalone past actions or when 'before/after' already makes the order clear and no emphasis is needed.",
    questions: [
      { id: "1-1",  prompt: "He was upset because he ___ the match on TV.",               options: ["misses", "missed", "had missed", "was missing"],    correctIndex: 2, explanation: "'had missed' — the missing happened before his current upset feeling. Past Perfect explains a past result." },
      { id: "1-2",  prompt: "Yesterday I ___ to the gym and then went to work.",           options: ["had gone", "went", "have gone", "going"],           correctIndex: 1, explanation: "'went' — two sequential past actions narrated in order. No earlier/later contrast needed; use Past Simple." },
      { id: "1-3",  prompt: "She couldn't pay because she ___ her wallet at home.",        options: ["left", "leaves", "had left", "has left"],           correctIndex: 2, explanation: "'had left' — leaving the wallet (earlier, Past Perfect) explains why she couldn't pay (later, Past Simple)." },
      { id: "1-4",  prompt: "I ___ a shower, then I made breakfast.",                      options: ["had taken", "took", "have taken", "was taking"],    correctIndex: 1, explanation: "'took' — two simple past actions in order of narrative; Past Simple is correct here." },
      { id: "1-5",  prompt: "He knew the answer because he ___ the chapter the night before.", options: ["reads", "read", "had read", "was reading"],    correctIndex: 2, explanation: "'had read' — the reading (Past Perfect) explains the knowing. Reading is clearly earlier." },
      { id: "1-6",  prompt: "They ___ dinner and then watched a film.",                    options: ["had eaten", "ate", "have eaten", "were eating"],    correctIndex: 1, explanation: "'ate' — two past actions told in sequence. Past Simple is natural in narrative order." },
      { id: "1-7",  prompt: "She was shocked because no one ___ her about the change.",   options: ["tells", "told", "had told", "has told"],            correctIndex: 2, explanation: "'had told' — not being told (Past Perfect) explains her shock (Past Simple result)." },
      { id: "1-8",  prompt: "I ___ my keys and then found them in my coat pocket.",        options: ["had lost", "lost", "have lost", "was losing"],      correctIndex: 1, explanation: "'lost' — straightforward narrative past sequence; Past Simple tells the story directly." },
      { id: "1-9",  prompt: "He ___ the test because he hadn't studied.",                  options: ["fails", "failed", "had failed", "was failing"],     correctIndex: 1, explanation: "'failed' — the failure is a past fact. 'hadn't studied' (Past Perfect) is the cause stated already; the result uses Past Simple." },
      { id: "1-10", prompt: "I was relieved when I realised I ___ my passport after all.", options: ["don't lose", "didn't lose", "hadn't lost", "haven't lost"], correctIndex: 2, explanation: "'hadn't lost' — the non-losing was a state before (and opposite of) the feared outcome; Past Perfect negative." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — 'When': meaning changes!",
    instructions:
      "With 'when', Past Simple in both clauses = the second action follows the first. Past Perfect in one clause = the first action was already complete when the second happened. Choose the form that matches the meaning in brackets.",
    questions: [
      { id: "2-1",  prompt: "When he arrived, she ___ [she was already gone by then].",    options: ["left", "leaves", "had left", "was leaving"],       correctIndex: 2, explanation: "'had left' — she was already gone when he arrived. Past Perfect shows the earlier completed action." },
      { id: "2-2",  prompt: "When he arrived, she ___ [she left at that moment].",          options: ["had left", "was leaving", "left", "leaves"],       correctIndex: 2, explanation: "'left' — Past Simple for both shows the two actions happened at the same point or she left because he arrived." },
      { id: "2-3",  prompt: "When I called, he ___ [he was in the middle of eating].",      options: ["had eaten", "ate", "was eating", "eats"],           correctIndex: 2, explanation: "'was eating' — Past Continuous shows an action in progress when another happened." },
      { id: "2-4",  prompt: "When we opened the box, it ___ [the box was already empty — someone had taken everything].", options: ["was empty", "had been empty", "is empty", "becomes empty"], correctIndex: 1, explanation: "'had been empty' — the state of being empty existed before and up to the moment of opening." },
      { id: "2-5",  prompt: "When she heard the news, she ___ [she cried at that moment].", options: ["had cried", "was crying", "cried", "would cry"],    correctIndex: 2, explanation: "'cried' — she cried in response to the news; Past Simple for the immediate reaction." },
      { id: "2-6",  prompt: "When I got to the party, most people ___ [they arrived before me].", options: ["arrived", "arrive", "had arrived", "were arriving"], correctIndex: 2, explanation: "'had arrived' — most people got there before me; Past Perfect shows earlier completion." },
      { id: "2-7",  prompt: "When the film ended, the audience ___ [they applauded straight away].", options: ["had applauded", "applauded", "were applauding", "have applauded"], correctIndex: 1, explanation: "'applauded' — the applause followed the film's end immediately; two sequential Past Simple actions." },
      { id: "2-8",  prompt: "When I saw her, I realised I ___ her somewhere before.",       options: ["see", "saw", "had seen", "was seeing"],            correctIndex: 2, explanation: "'had seen' — the previous meeting was before the current realisation; Past Perfect for the earlier experience." },
      { id: "2-9",  prompt: "When the new manager arrived, things ___ [changes happened at that point].", options: ["had changed", "changed", "were changing", "have changed"], correctIndex: 1, explanation: "'changed' — Past Simple: the changes resulted from or coincided with the manager's arrival." },
      { id: "2-10", prompt: "When I checked my email, I saw she ___ me an hour earlier.",   options: ["messaged", "messages", "had messaged", "was messaging"], correctIndex: 2, explanation: "'had messaged' — her message was sent an hour before I checked; Past Perfect for the clearly earlier action." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — already / just / never / ever in past context",
    instructions:
      "Words like 'already', 'just', 'never', 'ever', 'yet' and 'still' push you toward Past Perfect when the context is past-in-past. Choose the correct form.",
    questions: [
      { id: "3-1",  prompt: "When I offered her food, she said she had ___ eaten.",        options: ["yet", "just", "already", "still"],                 correctIndex: 2, explanation: "'already' — She had already eaten. 'Already' with Past Perfect shows the action was complete before the current moment." },
      { id: "3-2",  prompt: "By the time he turned 30, he ___ never been abroad.",         options: ["has", "have", "had", "was"],                       correctIndex: 2, explanation: "'had never been' — Past Perfect with 'never' in a past context ('by the time he turned 30')." },
      { id: "3-3",  prompt: "I ___ just sat down when the alarm went off.",                options: ["have", "had", "has", "was"],                       correctIndex: 1, explanation: "'had just sat down' — 'just' with Past Perfect: the sitting was very recent before the alarm." },
      { id: "3-4",  prompt: "She ___ ever read such a strange book before that one.",      options: ["has never", "hadn't ever", "never", "didn't ever"], correctIndex: 1, explanation: "'hadn't ever' (= had never) — Past Perfect negative to express an experience up to a past point." },
      { id: "3-5",  prompt: "He was furious because she ___ already left without saying goodbye.", options: ["has", "have", "had", "was"],                correctIndex: 2, explanation: "'had already left' — the departure (earlier) explains the fury (later result)." },
      { id: "3-6",  prompt: "They ___ never met before they were introduced at the party.", options: ["have", "haven't", "had", "hasn't"],                correctIndex: 2, explanation: "'had never met' — Past Perfect with 'never' for an experience (or lack of it) before a past event." },
      { id: "3-7",  prompt: "By the time the rescue team arrived, the climbers ___ still not reached the summit.", options: ["have", "had", "has", "were"],  correctIndex: 1, explanation: "'had still not reached' — 'still not' + Past Perfect describes an uncompleted state before the rescue team's arrival." },
      { id: "3-8",  prompt: "She realised she ___ already seen that episode.",             options: ["has", "have", "had", "was"],                       correctIndex: 2, explanation: "'had already seen' — the viewing was complete before the realisation; Past Perfect." },
      { id: "3-9",  prompt: "I ___ just finished cooking when they knocked on the door.",   options: ["have", "had", "has", "was"],                       correctIndex: 1, explanation: "'had just finished' — 'just' with Past Perfect; the cooking was very recently completed before the knock." },
      { id: "3-10", prompt: "Before that trip, he ___ never flown in a plane.",            options: ["has", "have", "had", "hasn't"],                    correctIndex: 2, explanation: "'had never flown' — Past Perfect with 'never before' a specific past event." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed hard: choose PP or PS from full context",
    instructions:
      "Read each sentence carefully and choose between Past Perfect and Past Simple based on the full context. Both tenses are tested, and some distractors are close.",
    questions: [
      { id: "4-1",  prompt: "She told me she ___ the film before, so she didn't want to go again.", options: ["sees", "saw", "had seen", "was seeing"],   correctIndex: 2, explanation: "'had seen' — reported Past Perfect: the viewing happened before her statement." },
      { id: "4-2",  prompt: "Last weekend, I ___ my cousin and we had a great time.",       options: ["had visited", "visiting", "visit", "visited"],     correctIndex: 3, explanation: "'visited' — a simple past action ('last weekend'); no earlier/later contrast needed." },
      { id: "4-3",  prompt: "The police arrested him because he ___ several banks.",        options: ["robs", "robbed", "had robbed", "was robbing"],     correctIndex: 2, explanation: "'had robbed' — the robberies (Past Perfect) explain/cause the arrest (Past Simple)." },
      { id: "4-4",  prompt: "I called him, but he ___ already left the office.",            options: ["has", "have", "had", "was"],                       correctIndex: 2, explanation: "'had already left' — his departure was complete before my call; Past Perfect." },
      { id: "4-5",  prompt: "We ___ to Italy twice before we moved there permanently.",     options: ["have been", "were", "had been", "went"],           correctIndex: 2, explanation: "'had been' — two trips to Italy happened before the past event (moving there); Past Perfect." },
      { id: "4-6",  prompt: "I was so hungry by dinner — I ___ nothing since breakfast.",   options: ["eat", "ate", "had eaten", "have eaten"],            correctIndex: 2, explanation: "'had eaten' — the absence of eating (Past Perfect) led to the hunger (Past Simple result)." },
      { id: "4-7",  prompt: "He ___ his ankle during the match and had to stop playing.",   options: ["twisted", "had twisted", "twists", "was twisting"], correctIndex: 0, explanation: "'twisted' — both events (twisting ankle, stopping) are in sequence in the narrative; Past Simple." },
      { id: "4-8",  prompt: "By the time I got home, my flatmate ___ all the leftovers.",   options: ["eats", "ate", "had eaten", "has eaten"],           correctIndex: 2, explanation: "'had eaten' — 'by the time I got home' signals Past Perfect for the earlier completed action." },
      { id: "4-9",  prompt: "She didn't recognise him because he ___ a beard.",             options: ["grows", "grew", "had grown", "was growing"],       correctIndex: 2, explanation: "'had grown' — the beard was already there (earlier state, Past Perfect) when she saw him." },
      { id: "4-10", prompt: "When the fire brigade arrived, most guests ___.",              options: ["evacuate", "evacuated", "had evacuated", "were evacuating"], correctIndex: 2, explanation: "'had evacuated' — most guests were already out before the fire brigade arrived; Past Perfect." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Sequence",
  2: "When",
  3: "already/just/never",
  4: "Mixed hard",
};

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function PastPerfectVsPastSimpleClient() {
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
          <a className="hover:text-slate-900 transition" href="/tenses/past-perfect">Past Perfect</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Past Perfect vs Past Simple</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">vs Past Simple</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 border border-rose-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1–B2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions on the key distinction: when must you use Past Perfect, and when is Past Simple enough? Covers sequence, &ldquo;when&rdquo; ambiguity, signal words, and full-context choices.
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
              <div className="ml-auto hidden sm:flex items-center gap-2">
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
                    <div className="mt-3 flex sm:hidden items-center gap-2">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3, 4] as const).map((n) => (
                        <button key={n} onClick={() => switchSet(n)}
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                          {n}
                        </button>
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
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi}
                                      onChange={() => setAnswers((p) => ({ ...p, [q.id]: oi }))}
                                      className="accent-[#F5DA20]" />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-1.5 text-slate-600">
                                    <b className="text-slate-900">Correct answer:</b> {q.options[q.correctIndex]} — {q.explanation}
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
          <a href="/tenses/past-perfect" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Past Perfect exercises</a>
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

      {/* Key difference */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-violet-50 to-white border border-violet-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-violet-500 px-3 py-1 text-xs font-black text-white">Past Perfect — use when sequence matters</span>
          <Formula parts={[
            { text: "earlier action", color: "violet" },
            { text: "had + past participle", color: "yellow" },
            { text: "+ later action", color: "green" },
            { text: "(Past Simple)", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="She was late because she had missed the bus." />
            <Ex en="He already knew — he had read the report." />
            <Ex en="By the time we arrived, they had eaten." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">Past Simple — use for narrative sequence</span>
          <Formula parts={[
            { text: "action 1", color: "green" },
            { text: "verb + -ed", color: "slate" },
            { text: "→ then action 2", color: "green" },
            { text: "verb + -ed", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="She woke up, had breakfast and went to work." />
            <Ex en="He finished the meeting and called his wife." />
            <Ex en="I lost my keys and then found them." />
          </div>
        </div>
      </div>

      {/* Contrast table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Same context — different meaning</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-violet-700">Past Perfect</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Past Simple</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["When I arrived, she had left.", "When I arrived, she left.", "PP = she was already gone. PS = she left at that moment."],
                ["He knew because he had seen it.", "He saw it and knew.", "PP = earlier experience explains current knowledge. PS = two actions in order."],
                ["By noon, they had finished.", "They finished at noon.", "PP = completed before noon. PS = they finished at noon."],
                ["She hadn't eaten, so she was hungry.", "She didn't eat lunch.", "PP = state before a past moment. PS = a fact about the past."],
              ].map(([pp, ps, diff], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                  <td className="px-4 py-2.5 text-violet-700 font-mono text-xs">{pp}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs">{ps}</td>
                  <td className="px-4 py-2.5 text-slate-600 text-xs">{diff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* When ambiguity */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">The &ldquo;when&rdquo; test</div>
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? when</span>
          <div className="space-y-3 text-sm text-slate-700">
            <div className="rounded-xl bg-white border border-black/8 p-3 space-y-1">
              <div className="font-black text-slate-900 text-xs uppercase tracking-wide">Past Perfect → action was already complete</div>
              <div className="font-mono text-violet-700">&ldquo;When I arrived, he had left.&rdquo;</div>
              <div className="text-slate-500 text-xs">= He was already gone when I got there.</div>
            </div>
            <div className="rounded-xl bg-white border border-black/8 p-3 space-y-1">
              <div className="font-black text-slate-900 text-xs uppercase tracking-wide">Past Simple → actions happen in sequence</div>
              <div className="font-mono text-emerald-700">&ldquo;When I arrived, he left.&rdquo;</div>
              <div className="text-slate-500 text-xs">= He left after I arrived (possibly because I arrived).</div>
            </div>
          </div>
        </div>
      </div>

      {/* Signal words */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Signal words</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-violet-700">Past Perfect signals</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Past Simple signals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["already, just, never, ever, yet, still not", "yesterday, last week, ago, in [year], then"],
                ["by the time, by [past point]", "first … then, and then, after that"],
                ["before / after (with two past events)", "specific time expressions (at 9 am, on Monday)"],
                ["because/since + earlier cause", "simple narrative: He woke up, showered, left."],
              ].map(([pp, ps], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                  <td className="px-4 py-2.5 text-violet-700 text-xs font-mono">{pp}</td>
                  <td className="px-4 py-2.5 text-emerald-700 text-xs font-mono">{ps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Key distinction:</span> Past Perfect is used when you want to make it clear that one past action happened <b>before</b> another past action — especially when the order would be unclear without it, or to explain a past result.<br />
          <span className="text-xs mt-1 block">If the order is obvious from &ldquo;before/after&rdquo; and you are telling a story, Past Simple is also acceptable — but Past Perfect is always more precise.</span>
        </div>
      </div>

    </div>
  );
}
