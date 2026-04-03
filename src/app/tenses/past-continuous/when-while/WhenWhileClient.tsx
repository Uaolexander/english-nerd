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
    title: "Exercise 1 — 'when' for the interrupting event",
    instructions:
      "'when' is followed by a short Past Simple action that interrupts an ongoing Continuous action: I was watching TV WHEN the phone rang.",
    questions: [
      { id: "1-1", prompt: "I was walking home ___ I saw the accident.", options: ["while", "when"], correctIndex: 1, explanation: "'when' + short Past Simple event (saw the accident)." },
      { id: "1-2", prompt: "She was cooking ___ the fire alarm went off.", options: ["while", "when"], correctIndex: 1, explanation: "'when' + short interrupting event." },
      { id: "1-3", prompt: "They were playing football ___ it started to rain.", options: ["while", "when"], correctIndex: 1, explanation: "'when' + short Past Simple event (started to rain)." },
      { id: "1-4", prompt: "I was having a shower ___ someone knocked on the door.", options: ["while", "when"], correctIndex: 1, explanation: "'when' + short interrupting event." },
      { id: "1-5", prompt: "He was reading ___ his phone rang.", options: ["while", "when"], correctIndex: 1, explanation: "'when' + the interrupting event (phone rang)." },
      { id: "1-6", prompt: "She was sleeping ___ the earthquake hit.", options: ["while", "when"], correctIndex: 1, explanation: "'when' + short event (earthquake hit)." },
      { id: "1-7", prompt: "We were eating lunch ___ the boss came in.", options: ["while", "when"], correctIndex: 1, explanation: "'when' + short completed event." },
      { id: "1-8", prompt: "He was crossing the road ___ a car nearly hit him.", options: ["while", "when"], correctIndex: 1, explanation: "'when' + short event (car nearly hit him)." },
      { id: "1-9", prompt: "She was waiting for the bus ___ she met her old friend.", options: ["while", "when"], correctIndex: 1, explanation: "'when' + short completed event (met her friend)." },
      { id: "1-10", prompt: "They were arguing ___ I arrived.", options: ["while", "when"], correctIndex: 1, explanation: "'when' + simple point of arrival." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — 'while' for the ongoing background",
    instructions:
      "'while' is followed by an ongoing Past Continuous action that was already in progress. 'while' introduces the BACKGROUND, not the event.",
    questions: [
      { id: "2-1", prompt: "___ she was sleeping, he cooked dinner.", options: ["When", "While"], correctIndex: 1, explanation: "'While' + Continuous background (she was sleeping)." },
      { id: "2-2", prompt: "___ I was walking to work, I saw a rainbow.", options: ["When", "While"], correctIndex: 1, explanation: "'While' + Continuous background." },
      { id: "2-3", prompt: "He left a message ___ she was in a meeting.", options: ["when", "while"], correctIndex: 1, explanation: "'while' + Continuous background (she was in a meeting)." },
      { id: "2-4", prompt: "___ they were having dinner, someone broke in.", options: ["When", "While"], correctIndex: 1, explanation: "'While' + Continuous background." },
      { id: "2-5", prompt: "I fell asleep ___ I was watching TV.", options: ["when", "while"], correctIndex: 1, explanation: "'while' + Continuous background." },
      { id: "2-6", prompt: "___ we were hiking, the weather suddenly changed.", options: ["When", "While"], correctIndex: 1, explanation: "'While' + ongoing background activity." },
      { id: "2-7", prompt: "She dropped her phone ___ she was getting off the train.", options: ["when", "while"], correctIndex: 1, explanation: "'while' + Continuous background (getting off the train)." },
      { id: "2-8", prompt: "___ he was waiting, he read a magazine.", options: ["When", "While"], correctIndex: 1, explanation: "'While' + Continuous background (waiting)." },
      { id: "2-9", prompt: "I noticed the smell ___ I was walking into the building.", options: ["when", "while"], correctIndex: 1, explanation: "'while' + Continuous background." },
      { id: "2-10", prompt: "___ she was studying, her sister kept interrupting.", options: ["When", "While"], correctIndex: 1, explanation: "'While' + Continuous background (studying)." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Choose the correct tense with when/while",
    instructions:
      "Look at whether you need Past Simple or Past Continuous with 'when' and 'while'.",
    questions: [
      { id: "3-1", prompt: "I was watching TV when he ___ in.", options: ["was coming", "came", "come", "comes"], correctIndex: 1, explanation: "'when' + the interrupting action → Past Simple: came in." },
      { id: "3-2", prompt: "While she ___ the door, the phone rang.", options: ["opened", "was opening", "opens", "open"], correctIndex: 1, explanation: "'While' + Continuous action: was opening." },
      { id: "3-3", prompt: "When I ___ the room, everyone was staring at me.", options: ["was entering", "entered", "enter", "enters"], correctIndex: 1, explanation: "'When I entered' = short completed action." },
      { id: "3-4", prompt: "She hurt her knee while she ___ skiing.", options: ["skied", "was skiing", "skis", "ski"], correctIndex: 1, explanation: "'while' + Continuous background: was skiing." },
      { id: "3-5", prompt: "When the alarm ___, I was still asleep.", options: ["was going off", "went off", "goes off", "go off"], correctIndex: 1, explanation: "'When the alarm went off' = short Past Simple event." },
      { id: "3-6", prompt: "While they ___, I prepared the food.", options: ["were arriving", "arrived", "arrive", "arrives"], correctIndex: 0, explanation: "'While they were arriving' = Continuous background." },
      { id: "3-7", prompt: "He called when I ___ a shower.", options: ["was having", "had", "have", "has"], correctIndex: 0, explanation: "Continuous background (shower) with interrupting call. 'when I was having a shower.'" },
      { id: "3-8", prompt: "When she ___ the news, she burst into tears.", options: ["was hearing", "heard", "hear", "hears"], correctIndex: 1, explanation: "'When she heard' = short past event." },
      { id: "3-9", prompt: "While we ___ through the park, we saw a deer.", options: ["walked", "were walking", "walk", "walks"], correctIndex: 1, explanation: "'while' + Continuous background: were walking." },
      { id: "3-10", prompt: "I dropped my keys when I ___ the door.", options: ["was unlocking", "unlocked", "unlock", "unlocks"], correctIndex: 0, explanation: "'when I was unlocking' = Continuous background; dropping = simultaneous short event." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Complex sentences (mixed)",
    instructions:
      "Complete these complex sentences — choose both the connector and the correct tense where needed.",
    questions: [
      { id: "4-1", prompt: "___ I was having breakfast, I heard the news on the radio.", options: ["When", "While"], correctIndex: 1, explanation: "'While' + Continuous background (having breakfast)." },
      { id: "4-2", prompt: "He slipped on the ice ___ he was running to the car.", options: ["when", "while"], correctIndex: 1, explanation: "'while' + Continuous background: running to the car." },
      { id: "4-3", prompt: "I was texting ___ the teacher asked me a question.", options: ["while", "when"], correctIndex: 1, explanation: "'when' + short interrupting event (teacher asked)." },
      { id: "4-4", prompt: "They were not paying attention ___ the accident happened.", options: ["when", "while"], correctIndex: 0, explanation: "'when' + short Past Simple event (accident happened)." },
      { id: "4-5", prompt: "___ we were packing, my wife found the missing passport.", options: ["When", "While"], correctIndex: 1, explanation: "'While' + Continuous background (packing)." },
      { id: "4-6", prompt: "The lights went out ___ we were eating dinner.", options: ["when", "while"], correctIndex: 0, explanation: "'when' introduces the interrupting event (lights went out)." },
      { id: "4-7", prompt: "She was studying ___ her brother was playing video games.", options: ["while", "when"], correctIndex: 0, explanation: "'while' + two simultaneous Continuous actions." },
      { id: "4-8", prompt: "___ he was explaining, I suddenly understood everything.", options: ["When", "While"], correctIndex: 1, explanation: "'While' + Continuous background (explaining)." },
      { id: "4-9", prompt: "A bird flew into the window ___ I was sitting in the kitchen.", options: ["when", "while"], correctIndex: 0, explanation: "'when' + short interrupting event." },
      { id: "4-10", prompt: "___ she was writing the report, her computer crashed.", options: ["When", "While"], correctIndex: 1, explanation: "'While' + Continuous background." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "'when'",
  2: "'while'",
  3: "Tense choice",
  4: "Complex",
};

function Formula({ parts }: { parts: Array<{ text?: string; color?: string; dim?: boolean }> }) {
  const colors: Record<string, string> = {
    sky:    "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-[#FFF3A3] text-amber-800 border-amber-300",
    red:    "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate:  "bg-slate-100 text-slate-600 border-slate-200",
    green:  "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) =>
        p.dim ? (
          <span key={i} className="text-slate-400 font-bold text-sm">+</span>
        ) : (
          <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${p.color ? colors[p.color] : colors.slate}`}>
            {p.text}
          </span>
        )
      )}
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

export default function WhenWhileClient() {
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
    setChecked(false);
    setAnswers({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    setExNo(n);
    setChecked(false);
    setAnswers({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function checkAnswers() {
    setChecked(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          <span className="text-slate-700 font-medium">when vs while</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">when vs while</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">Intermediate</span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 border border-slate-200">B1</span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          &apos;when&apos; introduces a short interrupting event; &apos;while&apos; introduces an ongoing background action. Master these connectors with 40 questions.
        </p>

        {/* 3-col grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left ad */}
          <AdUnit variant="sidebar-dark" />

          {/* Main content */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
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
                        <button onClick={checkAnswers} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
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

          {/* Right ad */}
          <AdUnit variant="sidebar-dark" />
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/past-continuous/was-were-ing" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← was/were + -ing</a>
          <a href="/tenses/past-continuous/ps-vs-pc" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: PS vs Continuous →</a>
        </div>

      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900">&apos;when&apos; and &apos;while&apos; — Past Continuous</h2>
        <p className="mt-2 text-slate-600 text-sm leading-relaxed">
          Two connectors, two jobs. &apos;while&apos; sets the ongoing background; &apos;when&apos; signals the interrupting event.
        </p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Card 1 */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 p-5 space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-emerald-700">while + Continuous</div>
          <Formula parts={[
            { text: "While", color: "green" },
            { dim: true },
            { text: "was/were + -ing", color: "yellow" },
            { text: "(background)", color: "slate" },
          ]} />
          <div className="space-y-1.5 pt-1">
            <Ex en="While she was sleeping..." />
            <Ex en="While they were eating..." />
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200 p-5 space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-red-700">when + Simple (interruption)</div>
          <Formula parts={[
            { text: "when", color: "red" },
            { dim: true },
            { text: "Past Simple", color: "yellow" },
            { text: "(event!)", color: "slate" },
          ]} />
          <div className="space-y-1.5 pt-1">
            <Ex en="...when the phone rang." />
            <Ex en="...when he arrived." />
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 p-5 space-y-3">
          <div className="text-xs font-black uppercase tracking-wider text-sky-700">Both structures</div>
          <div className="space-y-1.5">
            <Ex en="I was watching TV when the phone rang." />
            <Ex en="While I was watching TV, the phone rang." />
          </div>
          <p className="text-xs text-sky-700 font-semibold">= same meaning!</p>
        </div>
      </div>

      {/* Pattern diagram */}
      <div className="rounded-2xl border border-black/10 bg-slate-50 p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-wider text-slate-500">Pattern Diagram</div>
        <div className="space-y-2 font-mono text-sm text-slate-700">
          <div className="rounded-lg bg-white border border-black/8 px-3 py-2">[Continuous background] + <span className="font-black text-red-600">when</span> + [Simple interruption]</div>
          <div className="rounded-lg bg-white border border-black/8 px-3 py-2"><span className="font-black text-emerald-600">While</span> + [Continuous background], [Simple event]</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-black/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-black/10">
              <th className="text-left px-4 py-3 font-black text-slate-700">while + Continuous</th>
              <th className="text-left px-4 py-3 font-black text-slate-700">when + Simple</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            <tr className="bg-white">
              <td className="px-4 py-3 text-slate-700">While she was sleeping,</td>
              <td className="px-4 py-3 text-slate-700">the phone rang.</td>
            </tr>
            <tr className="bg-slate-50/50">
              <td className="px-4 py-3 text-slate-700">While we were eating,</td>
              <td className="px-4 py-3 text-slate-700">he came in.</td>
            </tr>
            <tr className="bg-white">
              <td className="px-4 py-3 text-slate-700">I was reading</td>
              <td className="px-4 py-3 text-slate-700">when she called.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Amber warning */}
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 flex gap-3">
        <div className="text-lg shrink-0">⚠️</div>
        <div className="text-sm text-amber-800">
          <b className="font-black">Note:</b> &apos;while&apos; can also go with Past Simple to mean &apos;during the time that&apos; in some cases, but the most common pattern is <b>while + Continuous</b>.
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border border-black/10 bg-slate-50 p-5 space-y-3">
        <div className="text-xs font-black uppercase tracking-wider text-slate-500">Time-line Visualisation</div>
        <div className="font-mono text-sm text-slate-700 space-y-1">
          <div className="rounded-lg bg-white border border-black/8 px-3 py-2">----[was watching TV]----X Phone rang</div>
          <div className="rounded-lg bg-white border border-black/8 px-3 py-2 text-slate-500">Background action → → → → → Interruption</div>
        </div>
      </div>
    </div>
  );
}
