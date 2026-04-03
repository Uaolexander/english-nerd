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
    title: "Exercise 1 — Affirmative, negative & question with 'this time tomorrow'",
    instructions:
      "Complete each sentence using the correct Future Continuous form. Some sentences are affirmative, some negative, some are questions. Watch the context carefully.",
    questions: [
      {
        id: "1-1",
        prompt: "This time tomorrow, I ___ flying over the Atlantic.",
        options: ["will be", "won't be", "am going to be", "will"],
        correctIndex: 0,
        explanation: "Affirmative: 'will be + -ing'. 'This time tomorrow' signals an action in progress at a future moment.",
      },
      {
        id: "1-2",
        prompt: "This time tomorrow, she ___ working — it's her day off.",
        options: ["will be", "won't be", "isn't going to", "will"],
        correctIndex: 1,
        explanation: "Negative: 'won't be + -ing'. 'It's her day off' confirms the negative.",
      },
      {
        id: "1-3",
        prompt: "___ you be travelling this time next week?",
        options: ["Are", "Do", "Will", "Won't"],
        correctIndex: 2,
        explanation: "Question: 'Will + subject + be + -ing?' — Will you be travelling…?",
      },
      {
        id: "1-4",
        prompt: "This time next year, we ___ living in our new house.",
        options: ["will be", "won't be", "live", "are going to"],
        correctIndex: 0,
        explanation: "Affirmative: 'will be + -ing'. 'This time next year' signals a future point in time.",
      },
      {
        id: "1-5",
        prompt: "This time tomorrow, they ___ sleeping — the match finishes at midnight.",
        options: ["will be", "won't be", "are", "will"],
        correctIndex: 1,
        explanation: "Negative: 'won't be sleeping' — the match goes until midnight so they'll still be awake.",
      },
      {
        id: "1-6",
        prompt: "___ she be studying at this time tomorrow?",
        options: ["Is", "Does", "Will", "Has"],
        correctIndex: 2,
        explanation: "Question form: Will + subject + be + -ing?",
      },
      {
        id: "1-7",
        prompt: "At 3 PM tomorrow, the children ___ having their lunch break.",
        options: ["won't be", "will be", "are", "will"],
        correctIndex: 1,
        explanation: "Affirmative: 'will be having'. At 3 PM tomorrow is a specific future moment.",
      },
      {
        id: "1-8",
        prompt: "Don't call at 7 — we ___ eating dinner then.",
        options: ["won't be", "will be", "are", "aren't"],
        correctIndex: 1,
        explanation: "Affirmative: 'will be eating'. The request not to call implies we WILL be busy at that time.",
      },
      {
        id: "1-9",
        prompt: "This time next month, I ___ working here — I've handed in my notice.",
        options: ["will be", "won't be", "am", "will"],
        correctIndex: 1,
        explanation: "Negative: 'won't be working'. 'I've handed in my notice' confirms it's negative.",
      },
      {
        id: "1-10",
        prompt: "___ he be presenting at this time on Friday?",
        options: ["Is", "Does", "Will", "Would"],
        correctIndex: 2,
        explanation: "Question: Will + subject + be + -ing?",
      },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Choose the correct word pair",
    instructions:
      "Each question has a gap split into two blanks. Choose the option that correctly fills both blanks with the right Future Continuous structure.",
    questions: [
      {
        id: "2-1",
        prompt: "At 9 PM tonight, ___ you ___ home?",
        options: ["will / be driving", "are / driving", "do / drive", "will / drive"],
        correctIndex: 0,
        explanation: "Will you be driving? — Future Continuous question: Will + subject + be + -ing?",
      },
      {
        id: "2-2",
        prompt: "At midnight, she ___ still ___ the reports.",
        options: ["is / checking", "will / check", "will be / checking", "won't / checking"],
        correctIndex: 2,
        explanation: "will be + checking. Affirmative Future Continuous for an action in progress at midnight.",
      },
      {
        id: "2-3",
        prompt: "At this time tomorrow, ___ they ___ in the conference room?",
        options: ["will / meeting", "are / meeting", "will / be meeting", "do / meet"],
        correctIndex: 2,
        explanation: "Will they be meeting? — Future Continuous question.",
      },
      {
        id: "2-4",
        prompt: "By 6 AM, the bakers ___ already ___ the bread.",
        options: ["will / make", "will be / making", "are / making", "won't / making"],
        correctIndex: 1,
        explanation: "will be + making. Affirmative Future Continuous for an action in progress at 6 AM.",
      },
      {
        id: "2-5",
        prompt: "At noon, ___ the boss ___ in a meeting?",
        options: ["is / sitting", "will / be sitting", "does / sit", "will / sitting"],
        correctIndex: 1,
        explanation: "Will the boss be sitting? — Future Continuous question.",
      },
      {
        id: "2-6",
        prompt: "At this time next week, I ___ ___ by the pool.",
        options: ["will / relax", "am going / to relax", "won't be / relaxing", "will be / relaxing"],
        correctIndex: 3,
        explanation: "will be + relaxing. Affirmative Future Continuous for an action in progress next week.",
      },
      {
        id: "2-7",
        prompt: "At 8 PM, ___ she ___ the children to bed?",
        options: ["will / be putting", "is / putting", "does / put", "will be / put"],
        correctIndex: 0,
        explanation: "Will she be putting? — Future Continuous question: Will + subject + be + -ing?",
      },
      {
        id: "2-8",
        prompt: "This time tomorrow night, they ___ ___ the match.",
        options: ["will / watching", "will be / watching", "are / watching", "won't / be watching"],
        correctIndex: 1,
        explanation: "will be + watching. Affirmative Future Continuous.",
      },
      {
        id: "2-9",
        prompt: "At 10 AM Saturday, ___ you ___ at the gym?",
        options: ["will / be training", "are / training", "do / train", "will / train"],
        correctIndex: 0,
        explanation: "Will you be training? — Future Continuous question.",
      },
      {
        id: "2-10",
        prompt: "At 11 PM, she ___ ___ — she goes to bed at 10.",
        options: ["will be / sleeping", "won't be / sleeping", "is / sleeping", "will / sleep"],
        correctIndex: 1,
        explanation: "won't be + sleeping. Negative Future Continuous — she goes to bed at 10, so she won't still be awake.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — FC or another future form?",
    instructions:
      "Read the situation and choose the most natural future form. Sometimes Future Continuous is correct (ongoing at a future time); sometimes another form (Future Simple, be going to, Present Continuous) is better.",
    questions: [
      {
        id: "3-1",
        prompt: "It's 8 AM. The flight leaves at 10 AM. At 11 AM, the plane ___ over the sea. (in progress)",
        options: ["will fly", "will be flying", "flies", "is going to fly"],
        correctIndex: 1,
        explanation: "Future Continuous: action in progress at a specific future time (11 AM).",
      },
      {
        id: "3-2",
        prompt: "I've bought the tickets. We ___ see the show on Saturday. (firm plan)",
        options: ["will be seeing", "will see", "are going to see", "see"],
        correctIndex: 2,
        explanation: "Be going to: use for firm plans/intentions already arranged.",
      },
      {
        id: "3-3",
        prompt: "Don't ring at 7 — Mum ___ cooking dinner then. (in progress at 7)",
        options: ["will cook", "will be cooking", "cooks", "is going to cook"],
        correctIndex: 1,
        explanation: "Future Continuous: action in progress at a specific time (7 o'clock).",
      },
      {
        id: "3-4",
        prompt: "Look at those clouds. It ___ rain soon. (prediction based on evidence)",
        options: ["will be raining", "rains", "is going to rain", "will rain"],
        correctIndex: 2,
        explanation: "Be going to: for predictions based on present evidence (you can see the clouds).",
      },
      {
        id: "3-5",
        prompt: "At this time next year, I ___ studying in London. (in progress next year)",
        options: ["will study", "am studying", "will be studying", "going to study"],
        correctIndex: 2,
        explanation: "Future Continuous: action in progress at a specific future time.",
      },
      {
        id: "3-6",
        prompt: "I promise I ___ tell anyone. (promise)",
        options: ["will be telling", "am telling", "won't tell", "don't tell"],
        correctIndex: 2,
        explanation: "Future Simple (negative): 'won't tell' for a promise/commitment.",
      },
      {
        id: "3-7",
        prompt: "When you call me at 9 PM, I ___ putting the kids to bed. (in progress)",
        options: ["will put", "will be putting", "put", "am going to put"],
        correctIndex: 1,
        explanation: "Future Continuous: the action (putting kids to bed) will be in progress when you call.",
      },
      {
        id: "3-8",
        prompt: "She ___ the project by Friday — she just told her boss. (firm intention)",
        options: ["will be finishing", "finishes", "is going to finish", "will be finish"],
        correctIndex: 2,
        explanation: "Be going to: expressing a firm intention or decision already made.",
      },
      {
        id: "3-9",
        prompt: "At 6 AM tomorrow, the workers ___ already repairing the road. (in progress early morning)",
        options: ["will repair", "will be repairing", "repaired", "are repairing"],
        correctIndex: 1,
        explanation: "Future Continuous: action in progress at a specific future time (6 AM tomorrow).",
      },
      {
        id: "3-10",
        prompt: "I can't meet at 3 PM — I ___ at the dentist's then. (appointment already booked)",
        options: ["will be sitting", "will sit", "am sitting", "sat"],
        correctIndex: 0,
        explanation: "Future Continuous: ongoing / in-progress action at 3 PM; also acceptable for an appointment in progress.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Hard mixed: all forms + all time phrases",
    instructions:
      "This final set mixes all Future Continuous forms with various time phrases: 'this time tomorrow', 'at 3 PM', 'by then', 'next week at this time'. Choose the best answer for each sentence.",
    questions: [
      {
        id: "4-1",
        prompt: "Next week at this time, ___ she be sitting in her new office?",
        options: ["Is", "Does", "Will", "Would"],
        correctIndex: 2,
        explanation: "Future Continuous question: Will + subject + be + -ing?",
      },
      {
        id: "4-2",
        prompt: "By then, I ___ still waiting — the queue is enormous.",
        options: ["won't be", "will be", "am", "will"],
        correctIndex: 1,
        explanation: "Affirmative: 'will be waiting'. 'The queue is enormous' means the waiting will continue.",
      },
      {
        id: "4-3",
        prompt: "At 11 PM tonight, the kids ___ sleeping — they go to bed at 9.",
        options: ["will be", "won't be", "are", "will"],
        correctIndex: 0,
        explanation: "Affirmative: 'will be sleeping'. They go to bed at 9, so at 11 they'll definitely be asleep.",
      },
      {
        id: "4-4",
        prompt: "This time next month, they ___ packing their suitcases for the move.",
        options: ["won't be", "will be", "are going to", "have been"],
        correctIndex: 1,
        explanation: "Affirmative: 'will be packing' — action in progress at a specific future moment.",
      },
      {
        id: "4-5",
        prompt: "At 8 AM on Monday, ___ you be commuting to work?",
        options: ["Are", "Do", "Will", "Won't"],
        correctIndex: 2,
        explanation: "Question: Will + subject + be + -ing?",
      },
      {
        id: "4-6",
        prompt: "By 10 PM tonight, she ___ celebrating — her results come out at 9.",
        options: ["won't be", "will be", "is", "will"],
        correctIndex: 1,
        explanation: "Affirmative: 'will be celebrating' — she'll be in the middle of celebrating by 10 PM.",
      },
      {
        id: "4-7",
        prompt: "Next year at this time, I ___ studying here — I graduate in June.",
        options: ["will be", "won't be", "am", "was going to be"],
        correctIndex: 1,
        explanation: "Negative: 'won't be studying'. She graduates in June, so she won't still be a student.",
      },
      {
        id: "4-8",
        prompt: "At 3 PM this Saturday, ___ the team be training?",
        options: ["Does", "Is", "Will", "Has"],
        correctIndex: 2,
        explanation: "Question: Will + subject + be + -ing?",
      },
      {
        id: "4-9",
        prompt: "By then, he ___ driving — he should be home already.",
        options: ["will be", "won't be", "is", "drives"],
        correctIndex: 1,
        explanation: "Negative: 'won't be driving'. He should already be home, so the driving will be over.",
      },
      {
        id: "4-10",
        prompt: "This time tomorrow, we ___ boarding the plane to Tokyo.",
        options: ["won't be", "will be", "board", "have been"],
        correctIndex: 1,
        explanation: "Affirmative: 'will be boarding' — action in progress at a specific future moment.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "This time tomorrow",
  2: "Word pairs",
  3: "FC or other?",
  4: "Hard mixed",
};

export default function AtFutureMomentClient() {
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
          <a className="hover:text-slate-900 transition" href="/">Home</a><span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a><span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/future-continuous">Future Continuous</a><span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">At a Future Moment</span>
        </div>
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Future Continuous <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">At a Future Moment</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">B1</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">40 questions on using Future Continuous for actions in progress at a specific future time. Master time phrases like &quot;this time tomorrow&quot; and &quot;at 3 PM&quot;.</p>
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
                          <div><div className={`text-3xl font-black ${score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"}`}>{score.percent}%</div><div className="mt-0.5 text-sm text-slate-600">{score.correct} out of {score.total} correct</div></div>
                          <div className="text-3xl">{score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}</div>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden"><div className={`h-2 rounded-full transition-all duration-500 ${score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${score.percent}%` }} /></div>
                        <div className="mt-2 text-xs text-slate-500">{score.percent >= 80 ? "Excellent! Move on to the next exercise." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}</div>
                      </div>
                    )}
                  </div>
                </>
              ) : (<Explanation />)}
            </div>
          </section>
          <AdUnit variant="sidebar-dark" />
        </div>
        <AdUnit variant="mobile-dark" />
        <div className="mt-10 flex items-center gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-continuous" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Future Continuous exercises</a>
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
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">Core idea</span>
          <Formula parts={[
            { text: "At [future time]", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "will be", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="At 9 PM tomorrow, I will be watching the match." />
            <Ex en="This time next week, she will be sitting on the beach." />
            <Ex en="At this time next year, they will be living in Spain." />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative at a future moment</span>
          <Formula parts={[
            { text: "At [future time]", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "won't be", color: "red" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="At midnight, she won't be sleeping — she's a night owl." />
            <Ex en="This time tomorrow, he won't be working (it's his day off)." />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Asking about a future moment</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "be", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: "at [time]?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you be working at 9 PM?" />
            <Ex en="Will she be travelling this time next week?" />
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Timeline — in progress at a future point</div>
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="flex items-center gap-0 text-xs">
            <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-slate-600">NOW</span>
            <div className="flex-1 h-0.5 bg-slate-200 mx-2 relative">
              <div className="absolute left-1/3 right-0 h-0.5 bg-emerald-400"></div>
              <div className="absolute left-1/2 -top-3 text-emerald-700 font-black text-xs">← will be doing →</div>
              <div className="absolute left-2/3 -bottom-4 text-slate-500 text-xs">📍 "at 9 PM"</div>
            </div>
            <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-slate-600">FUTURE</span>
          </div>
          <div className="mt-6 text-xs text-slate-500 italic">The action started before the future point and continues through it — that is when we say "will be doing".</div>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Signal phrases that trigger Future Continuous</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Signal phrase</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["this time tomorrow", "This time tomorrow, I'll be flying."],
                ["at [time] tomorrow", "At 8 PM tomorrow, she'll be cooking."],
                ["this time next week/month/year", "This time next year, we'll be living abroad."],
                ["when you call / arrive / get there", "When you arrive, he'll be sleeping."],
                ["at this moment tomorrow", "At this moment tomorrow, they'll be celebrating."],
                ["by then (with in progress meaning)", "By then, she'll still be studying."],
              ].map(([phrase, ex], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 font-semibold text-violet-700 font-mono text-xs">{phrase}</td>
                  <td className="px-4 py-2.5 text-slate-600 text-xs italic">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">Key difference: &quot;at&quot; (in progress) vs &quot;by&quot; (completed)</div>
        <div className="space-y-1.5 mt-2 text-xs text-amber-700">
          <div>✅ At 9 PM, I <b>will be watching</b> TV. (still in progress at 9)</div>
          <div>✅ By 9 PM, I <b>will have watched</b> the show. (completed before 9)</div>
        </div>
      </div>
    </div>
  );
}
