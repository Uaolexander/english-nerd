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
    title: "Set 1 — Past Simple vs Past Continuous",
    instructions:
      "Choose between Past Simple (completed action / habit / sequence) and Past Continuous (in progress at a specific time / background / interrupted).",
    questions: [
      {
        id: "apt1-1",
        prompt: "She ___ to work every day when she lived in London. (habit)",
        options: ["was cycling", "had cycled", "cycled", "had been cycling"],
        correctIndex: 2,
        explanation: "cycled — Past Simple for a repeated habit in the past.",
      },
      {
        id: "apt1-2",
        prompt: "At 8 p.m. last night, I ___ dinner. (specific time in progress)",
        options: ["cooked", "had cooked", "was cooking", "had been cooking"],
        correctIndex: 2,
        explanation: "was cooking — Past Continuous for an action in progress at a specific past time.",
      },
      {
        id: "apt1-3",
        prompt: "He ___ the door, walked in, and sat down. (sequence of actions)",
        options: ["was opening", "had been opening", "had opened", "opened"],
        correctIndex: 3,
        explanation: "opened — Past Simple for a sequence of completed actions in order.",
      },
      {
        id: "apt1-4",
        prompt: "While she ___, her phone rang. (background activity interrupted)",
        options: ["read", "had read", "had been reading", "was reading"],
        correctIndex: 3,
        explanation: "was reading — Past Continuous for a background activity interrupted by another event.",
      },
      {
        id: "apt1-5",
        prompt: "They ___ football when it started to rain. (interrupted activity)",
        options: ["played", "had played", "were playing", "had been playing"],
        correctIndex: 2,
        explanation: "were playing — Past Continuous for an activity in progress when interrupted.",
      },
      {
        id: "apt1-6",
        prompt: "Last summer, he ___ three different countries. (completed trip)",
        options: ["was visiting", "had been visiting", "visited", "had visited"],
        correctIndex: 2,
        explanation: "visited — Past Simple for a completed action at a defined past time.",
      },
      {
        id: "apt1-7",
        prompt: "The sun ___ and the birds were singing when she woke up. (both in progress)",
        options: ["shone", "shined", "was shining", "had been shining"],
        correctIndex: 2,
        explanation: "was shining — Past Continuous; both 'was shining' and 'were singing' describe simultaneous background states.",
      },
      {
        id: "apt1-8",
        prompt: "I ___ her on the street and we had a long chat. (single completed event)",
        options: ["was meeting", "had been meeting", "met", "had met"],
        correctIndex: 2,
        explanation: "met — Past Simple for a single completed event in the past.",
      },
      {
        id: "apt1-9",
        prompt: "She ___ for a company in Paris for ten years before retiring. (habitual duration)",
        options: ["was working", "worked", "had worked", "had been working"],
        correctIndex: 1,
        explanation: "worked — Past Simple for a completed period of employment (past fact, no emphasis on duration).",
      },
      {
        id: "apt1-10",
        prompt: "While I ___ my homework, my brother was watching TV.",
        options: ["did", "was doing", "had done", "had been doing"],
        correctIndex: 1,
        explanation: "was doing — Past Continuous for two simultaneous background activities ('while').",
      },
    ],
  },
  2: {
    no: 2,
    title: "Set 2 — Past Perfect vs Past Perfect Continuous",
    instructions:
      "Choose between Past Perfect (had + pp) for completed results and Past Perfect Continuous (had been + -ing) for duration/process before a past event.",
    questions: [
      {
        id: "apt2-1",
        prompt: "She was tired because she ___ for 10 hours. (duration = PPC)",
        options: ["had driven", "drove", "was driving", "had been driving"],
        correctIndex: 3,
        explanation: "had been driving — PPC: '10 hours' of duration before a past result (tiredness).",
      },
      {
        id: "apt2-2",
        prompt: "By the time we arrived, they ___ three rounds. (completed quantity = PP)",
        options: ["had been playing", "played", "were playing", "had played"],
        correctIndex: 3,
        explanation: "had played — Past Perfect: 'three rounds' is a completed countable result.",
      },
      {
        id: "apt2-3",
        prompt: "She looked confident because she ___ hard before the presentation. (PP — result of prep)",
        options: ["had been preparing", "prepared", "was preparing", "had prepared"],
        correctIndex: 0,
        explanation: "had been preparing — PPC: the process of preparing (hard, ongoing) explains the confidence.",
      },
      {
        id: "apt2-4",
        prompt: "He said he ___ never been to Japan. (experience = PP)",
        options: ["had been going", "was going", "had", "hadn't"],
        correctIndex: 3,
        explanation: "hadn't (been to Japan) — Past Perfect negative for a past experience.",
      },
      {
        id: "apt2-5",
        prompt: "The paint smell lingered because someone ___ in the room all morning. (PPC = ongoing cause)",
        options: ["had painted", "painted", "was painting", "had been painting"],
        correctIndex: 3,
        explanation: "had been painting — PPC: the ongoing painting caused the lingering smell.",
      },
      {
        id: "apt2-6",
        prompt: "By 2015, she ___ her first novel. (completed milestone = PP)",
        options: ["had been writing", "wrote", "was writing", "had written"],
        correctIndex: 3,
        explanation: "had written — Past Perfect: a completed milestone ('her first novel') by a past year.",
      },
      {
        id: "apt2-7",
        prompt: "He looked pale because he ___ outside for months. (duration = PPC)",
        options: ["hadn't gone", "didn't go", "wasn't going", "hadn't been going"],
        correctIndex: 3,
        explanation: "hadn't been going — negative PPC: months of not going outside caused the pallor.",
      },
      {
        id: "apt2-8",
        prompt: "They ___ just arrived when the phone rang. (recently completed = PP)",
        options: ["had", "had been", "were", "have"],
        correctIndex: 0,
        explanation: "had (just arrived) — Past Perfect with 'just' for a recently completed action.",
      },
      {
        id: "apt2-9",
        prompt: "Her voice was hoarse because she ___ all day. (duration = PPC)",
        options: ["had sung", "sang", "was singing", "had been singing"],
        correctIndex: 3,
        explanation: "had been singing — PPC: all-day singing caused the hoarse voice.",
      },
      {
        id: "apt2-10",
        prompt: "Before the meeting, she ___ all the relevant documents. (completed prep = PP)",
        options: ["had been reading", "was reading", "read", "had read"],
        correctIndex: 3,
        explanation: "had read — Past Perfect: the documents were fully read (completed) before the meeting.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Set 3 — All 4 Past Tenses",
    instructions:
      "Choose among Past Simple, Past Continuous, Past Perfect, and Past Perfect Continuous. There is one correct answer for each.",
    questions: [
      {
        id: "apt3-1",
        prompt: "When I ___ at the station, the train had already left.",
        options: ["was arriving", "had arrived", "arrived", "had been arriving"],
        correctIndex: 2,
        explanation: "arrived — Past Simple for the action that happened at the moment described.",
      },
      {
        id: "apt3-2",
        prompt: "She ___ for two hours when the café finally closed.",
        options: ["was studying", "studied", "had studied", "had been studying"],
        correctIndex: 3,
        explanation: "had been studying — PPC: duration (two hours) before a past completed event.",
      },
      {
        id: "apt3-3",
        prompt: "He looked embarrassed because he ___ his lines.",
        options: ["was forgetting", "forgot", "had forgotten", "had been forgetting"],
        correctIndex: 2,
        explanation: "had forgotten — Past Perfect: the forgetting happened before the visible embarrassment.",
      },
      {
        id: "apt3-4",
        prompt: "At that moment, she ___ to her boss on the phone.",
        options: ["spoke", "had spoken", "had been speaking", "was speaking"],
        correctIndex: 3,
        explanation: "was speaking — Past Continuous: action in progress at a specific past moment ('at that moment').",
      },
      {
        id: "apt3-5",
        prompt: "They ___ three times before they finally agreed.",
        options: ["had been meeting", "were meeting", "met", "had met"],
        correctIndex: 3,
        explanation: "had met — Past Perfect: 'three times' is a completed count before the final agreement.",
      },
      {
        id: "apt3-6",
        prompt: "The road was wet because it ___ heavily all night.",
        options: ["rained", "had rained", "was raining", "had been raining"],
        correctIndex: 3,
        explanation: "had been raining — PPC: all-night rain (ongoing) caused the wet road.",
      },
      {
        id: "apt3-7",
        prompt: "While I ___ my suitcase, my taxi arrived early.",
        options: ["packed", "had packed", "was packing", "had been packing"],
        correctIndex: 2,
        explanation: "was packing — Past Continuous: background activity interrupted by the taxi arrival.",
      },
      {
        id: "apt3-8",
        prompt: "By the time she called, I ___ the whole report.",
        options: ["had been finishing", "was finishing", "finished", "had finished"],
        correctIndex: 3,
        explanation: "had finished — Past Perfect: the report was completely done before the call.",
      },
      {
        id: "apt3-9",
        prompt: "He ___ very hard as a child, which helped him later in life.",
        options: ["was working", "had been working", "worked", "had worked"],
        correctIndex: 2,
        explanation: "worked — Past Simple: a general past fact/habit ('as a child').",
      },
      {
        id: "apt3-10",
        prompt: "She was exhausted because she ___ since 5 a.m.",
        options: ["worked", "was working", "had worked", "had been working"],
        correctIndex: 3,
        explanation: "had been working — PPC: 'since 5 a.m.' is a starting point; the work caused her exhaustion.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Set 4 — Hard Mixed (Time Expressions Guide You)",
    instructions:
      "Use time expressions to identify the correct tense: 'at that moment' → PC; 'by then/by the time' → PP or PPC; 'yesterday/last year' → PS; 'since/for' + duration before past → PPC.",
    questions: [
      {
        id: "apt4-1",
        prompt: "At that moment, he ___ to music and didn't hear the doorbell.",
        options: ["had listened", "listened", "was listening", "had been listening"],
        correctIndex: 2,
        explanation: "'At that moment' → Past Continuous: was listening — action in progress at a specific past moment.",
      },
      {
        id: "apt4-2",
        prompt: "By then, she ___ all her savings. (completed result by that point)",
        options: ["was spending", "spent", "had been spending", "had spent"],
        correctIndex: 3,
        explanation: "'By then' → Past Perfect: had spent — completed action before a past reference point.",
      },
      {
        id: "apt4-3",
        prompt: "Yesterday morning, he ___ for a jog as usual. (simple past fact)",
        options: ["was going", "had gone", "had been going", "went"],
        correctIndex: 3,
        explanation: "'Yesterday morning' → Past Simple: went — completed action at a defined past time.",
      },
      {
        id: "apt4-4",
        prompt: "By the time the rescue team arrived, they ___ in the cave for 20 hours. (duration to a past point)",
        options: ["were trapped", "had trapped", "had been trapped", "trapped"],
        correctIndex: 2,
        explanation: "'By the time' + 'for 20 hours' → PPC: had been trapped — duration before another past event.",
      },
      {
        id: "apt4-5",
        prompt: "Last night, she ___ three cities on her itinerary. (completed list)",
        options: ["was visiting", "had been visiting", "visited", "had visited"],
        correctIndex: 2,
        explanation: "'Last night' → Past Simple: visited — completed actions on a specific past evening.",
      },
      {
        id: "apt4-6",
        prompt: "Since January, he ___ every day to prepare. (duration before a past point — use PPC)",
        options: ["practised", "had practised", "was practising", "had been practising"],
        correctIndex: 3,
        explanation: "'Since January' + duration before past → PPC: had been practising.",
      },
      {
        id: "apt4-7",
        prompt: "At midnight, the neighbours ___ loudly. (moment in progress)",
        options: ["argued", "had argued", "had been arguing", "were arguing"],
        correctIndex: 3,
        explanation: "'At midnight' → Past Continuous: were arguing — action in progress at a specific time.",
      },
      {
        id: "apt4-8",
        prompt: "By the time I got home, my sister ___ the whole meal. (completed result)",
        options: ["cooked", "was cooking", "had been cooking", "had cooked"],
        correctIndex: 3,
        explanation: "'By the time' + completed result → Past Perfect: had cooked.",
      },
      {
        id: "apt4-9",
        prompt: "For months before the launch, the team ___ day and night. (months of effort before past event)",
        options: ["worked", "was working", "had worked", "had been working"],
        correctIndex: 3,
        explanation: "'For months' before a past event → PPC: had been working — ongoing duration before the launch.",
      },
      {
        id: "apt4-10",
        prompt: "She ___ the answer but chose not to say anything. (state of knowledge in the past)",
        options: ["was knowing", "had been knowing", "knew", "had been knowing"],
        correctIndex: 2,
        explanation: "'Know' is stative — no continuous form. Past Simple: knew — used for a state of knowledge.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "PS vs PC",
  2: "PP vs PPC",
  3: "All 4 Tenses",
  4: "Hard Mixed",
};

export default function AllPastTensesClient() {
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
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/past-perfect-continuous">Past Perfect Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">All Past Tenses</span>
        </div>

        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">All Past Tenses</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 border border-rose-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B2+</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          40 advanced questions choosing among all four past tenses: Past Simple, Past Continuous,
          Past Perfect, and Past Perfect Continuous.
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
                        <div className="mt-2 text-xs text-slate-500">{score.percent >= 80 ? "Excellent! You&apos;ve mastered all four past tenses." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}</div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <AllPastExplanation />
              )}
            </div>
          </section>

          <AdUnit variant="sidebar-dark" />
        </div>

        <AdUnit variant="mobile-dark" />

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/past-perfect-continuous" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Past Perfect Continuous</a>
          <a href="/tenses" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">All Tenses →</a>
        </div>
      </div>
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

function AllPastExplanation() {
  return (
    <div className="space-y-8">
      {/* 4 mini gradient cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            label: "Past Simple",
            color: "violet",
            form: "V2 / -ed",
            use: "Completed action, habit, sequence",
            signal: "yesterday, last year, ago, in 2010",
          },
          {
            label: "Past Continuous",
            color: "sky",
            form: "was/were + -ing",
            use: "In progress at a specific time, background, interrupted",
            signal: "at that moment, while, when (interrupted)",
          },
          {
            label: "Past Perfect",
            color: "emerald",
            form: "had + past participle",
            use: "Completed before another past event/result",
            signal: "already, just, never, yet, by then, by the time",
          },
          {
            label: "Past Perfect Cont.",
            color: "orange",
            form: "had been + -ing",
            use: "Duration/process before another past event",
            signal: "for, since, how long, all day, all morning",
          },
        ].map(({ label, color, form, use, signal }) => {
          const gradMap: Record<string, string> = {
            violet: "from-violet-50 border-violet-100",
            sky: "from-sky-50 border-sky-100",
            emerald: "from-emerald-50 border-emerald-100",
            orange: "from-orange-50 border-orange-100",
          };
          const badgeMap: Record<string, string> = {
            violet: "bg-violet-500",
            sky: "bg-sky-500",
            emerald: "bg-emerald-500",
            orange: "bg-orange-500",
          };
          return (
            <div key={label} className={`rounded-2xl bg-gradient-to-b ${gradMap[color]} to-white border p-4 space-y-2`}>
              <span className={`inline-flex items-center rounded-xl ${badgeMap[color]} px-3 py-1 text-xs font-black text-white`}>{label}</span>
              <div className="font-mono text-xs text-slate-600 font-black">{form}</div>
              <div className="text-xs text-slate-700">{use}</div>
              <div className="text-xs text-slate-400 italic">{signal}</div>
            </div>
          );
        })}
      </div>

      {/* Comparison table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">All 4 Past Tenses — Quick Comparison</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5">
                <th className="px-3 py-2.5 font-black text-left text-slate-700">Tense</th>
                <th className="px-3 py-2.5 font-black text-left text-slate-700">Form</th>
                <th className="px-3 py-2.5 font-black text-left text-slate-700">Key use</th>
                <th className="px-3 py-2.5 font-black text-left text-slate-700">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Past Simple", "worked / went", "Completed past fact", "She left at 9."],
                ["Past Continuous", "was working", "In progress at a past moment", "She was leaving when I called."],
                ["Past Perfect", "had worked", "Before another past event", "She had already left."],
                ["Past Perfect Cont.", "had been working", "Duration before a past event", "She had been working for 2 hours."],
              ].map(([tense, form, use, ex], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}>
                  <td className="px-3 py-2.5 font-semibold text-slate-800 text-xs">{tense}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-slate-600">{form}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-600">{use}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-500 italic">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="font-black mb-1">⚠ Time expression cheat sheet</div>
        <div className="space-y-1 text-xs">
          <div><b>at that moment / while / when (background)</b> → Past Continuous</div>
          <div><b>yesterday / last year / ago / in 2010</b> → Past Simple</div>
          <div><b>already / just / never / yet / by then / by the time</b> → Past Perfect</div>
          <div><b>for / since / how long / all day</b> + before past event → Past Perfect Continuous</div>
        </div>
      </div>
    </div>
  );
}
