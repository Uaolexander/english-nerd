"use client";
import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string; };
type ExSet = { no: 1 | 2 | 3 | 4; title: string; instructions: string; questions: MCQ[]; };

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Present Simple vs Present Continuous",
    instructions:
      "Choose between Present Simple (I work / she works) and Present Continuous (I am working / she is working). Use Present Simple for habits, routines, permanent states, and general truths. Use Present Continuous for actions happening now, temporary situations, and changing situations.",
    questions: [
      { id: "1-1",  prompt: "She ___ yoga every morning before work.",
        options: ["is doing", "does", "has done", "has been doing"],
        correctIndex: 1,
        explanation: "Every morning = regular habit → Present Simple: She does yoga every morning." },
      { id: "1-2",  prompt: "Quiet! The baby ___.",
        options: ["sleeps", "has slept", "has been sleeping", "is sleeping"],
        correctIndex: 3,
        explanation: "Right now at this moment → Present Continuous: The baby is sleeping." },
      { id: "1-3",  prompt: "Water ___ at 100 degrees Celsius.",
        options: ["is boiling", "has boiled", "boils", "has been boiling"],
        correctIndex: 2,
        explanation: "Scientific fact / general truth → Present Simple: Water boils at 100°C." },
      { id: "1-4",  prompt: "I ___ with my sister this month while my flat is being repaired.",
        options: ["stay", "have stayed", "have been staying", "am staying"],
        correctIndex: 3,
        explanation: "Temporary arrangement this month → Present Continuous: I am staying with my sister this month." },
      { id: "1-5",  prompt: "He ___ in IT. He's been there for ten years.",
        options: ["is working", "has worked", "works", "is been working"],
        correctIndex: 2,
        explanation: "Permanent situation (career) → Present Simple: He works in IT." },
      { id: "1-6",  prompt: "Prices ___ all the time these days.",
        options: ["rise", "have risen", "have been rising", "are rising"],
        correctIndex: 3,
        explanation: "All the time these days = changing/developing trend right now → Present Continuous: Prices are rising." },
      { id: "1-7",  prompt: "The kids ___ two languages — English and French.",
        options: ["are speaking", "have spoken", "have been speaking", "speak"],
        correctIndex: 3,
        explanation: "Permanent ability/state → Present Simple: The kids speak two languages." },
      { id: "1-8",  prompt: "Look — they ___ down the street holding hands.",
        options: ["walk", "have walked", "have been walking", "are walking"],
        correctIndex: 3,
        explanation: "Look! = visible action happening right now → Present Continuous: They are walking." },
      { id: "1-9",  prompt: "She usually ___ the bus to work, but today she's driving.",
        options: ["is taking", "has taken", "takes", "has been taking"],
        correctIndex: 2,
        explanation: "Usually = regular habit → Present Simple: She usually takes the bus." },
      { id: "1-10", prompt: "I ___ for my phone. Have you seen it?",
        options: ["look", "have looked", "looks", "am looking"],
        correctIndex: 3,
        explanation: "Happening now, current activity → Present Continuous: I am looking for my phone." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Present Perfect vs Present Perfect Continuous",
    instructions:
      "Choose between Present Perfect (I have done) and Present Perfect Continuous (I have been doing). Use Present Perfect for completed actions, results, and achievements. Use Present Perfect Continuous for ongoing actions, duration, and visible present results of recent activity.",
    questions: [
      { id: "2-1",  prompt: "I ___ four cups of coffee today. (completed, countable)",
        options: ["have been drinking", "am drinking", "drunk", "have drunk"],
        correctIndex: 3,
        explanation: "Four cups = countable completed result → Present Perfect: I have drunk four cups of coffee today." },
      { id: "2-2",  prompt: "My eyes hurt — I ___ too much today.",
        options: ["have read", "am reading", "read", "have been reading"],
        correctIndex: 3,
        explanation: "Eyes hurt = visible result of ongoing activity → PPC: I have been reading too much today." },
      { id: "2-3",  prompt: "She ___ her driving test. She got it first time!",
        options: ["has been passing", "passed", "is passing", "has passed"],
        correctIndex: 3,
        explanation: "She got it = completed achievement, specific result → Present Perfect: She has passed her driving test." },
      { id: "2-4",  prompt: "He ___ all day — he hasn't eaten or stopped once.",
        options: ["has worked", "worked", "is working", "has been working"],
        correctIndex: 3,
        explanation: "All day = duration of ongoing activity → PPC: He has been working all day." },
      { id: "2-5",  prompt: "The government ___ a new law on data privacy.",
        options: ["has been introducing", "introduced", "is introducing", "has introduced"],
        correctIndex: 3,
        explanation: "A new law = completed legislative action → Present Perfect: The government has introduced a new law." },
      { id: "2-6",  prompt: "We ___ to fix this problem since last month.",
        options: ["have tried", "tried", "try", "have been trying"],
        correctIndex: 3,
        explanation: "Since last month = point in time, ongoing effort → PPC: We have been trying to fix this problem since last month." },
      { id: "2-7",  prompt: "I ___ Spanish for two years now and can hold a conversation.",
        options: ["have studied", "study", "am studying", "have been studying"],
        correctIndex: 3,
        explanation: "For two years, still ongoing → PPC: I have been studying Spanish for two years." },
      { id: "2-8",  prompt: "He ___ two novels. His latest one is a bestseller.",
        options: ["has been writing", "is writing", "wrote", "has written"],
        correctIndex: 3,
        explanation: "Two novels = countable completed result → Present Perfect: He has written two novels." },
      { id: "2-9",  prompt: "You look muddy. ___ you been gardening?",
        options: ["Did", "Were", "Are", "Have"],
        correctIndex: 3,
        explanation: "Have you been gardening? — PPC question, recent activity with visible result." },
      { id: "2-10", prompt: "I ___ this song before. I love it!",
        options: ["was hearing", "have been hearing", "am hearing", "have heard"],
        correctIndex: 3,
        explanation: "Life experience with present reaction → Present Perfect: I have heard this song before." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Choose from all four present tenses",
    instructions:
      "Choose the correct tense from all four present tenses: Present Simple (does), Present Continuous (is doing), Present Perfect (has done), and Present Perfect Continuous (has been doing). Look at the time clues and context carefully.",
    questions: [
      { id: "3-1",  prompt: "He ___ on his laptop for the past three hours. He needs a break.",
        options: ["works", "is working", "has worked", "has been working"],
        correctIndex: 3,
        explanation: "For the past three hours = duration → PPC: He has been working on his laptop for the past three hours." },
      { id: "3-2",  prompt: "The sun ___ in the east.",
        options: ["is rising", "has risen", "has been rising", "rises"],
        correctIndex: 3,
        explanation: "Permanent scientific fact → Present Simple: The sun rises in the east." },
      { id: "3-3",  prompt: "I can't talk right now — I ___ dinner.",
        options: ["make", "have made", "have been making", "am making"],
        correctIndex: 3,
        explanation: "Right now = action in progress → Present Continuous: I am making dinner." },
      { id: "3-4",  prompt: "She ___ already ___ the project. You can see the results.",
        options: ["is / finishing", "has / finished", "has been / finishing", "was / finishing"],
        correctIndex: 1,
        explanation: "Already + you can see the results = completed → Present Perfect: She has already finished the project." },
      { id: "3-5",  prompt: "___ you ever ___ bungee jumping?",
        options: ["Are / doing", "Have / done", "Have / been doing", "Do / do"],
        correctIndex: 1,
        explanation: "Life experience question → Present Perfect: Have you ever done bungee jumping?" },
      { id: "3-6",  prompt: "My sister ___ to become a doctor. She's in her third year.",
        options: ["is studying", "has studied", "has been studying", "studies"],
        correctIndex: 2,
        explanation: "She's in her third year = ongoing study with duration → PPC: My sister has been studying to become a doctor." },
      { id: "3-7",  prompt: "Look at those clouds! It ___ any minute.",
        options: ["is raining", "rains", "has rained", "has been raining"],
        correctIndex: 0,
        explanation: "Look! Future imminence signalled by present evidence → Present Continuous: It is raining any minute. (going to rain, expressed via continuous)." },
      { id: "3-8",  prompt: "They ___ in that house since 1998.",
        options: ["live", "are living", "lived", "have been living"],
        correctIndex: 3,
        explanation: "Since 1998 + still there = ongoing state/activity → PPC: They have been living in that house since 1998." },
      { id: "3-9",  prompt: "She ___ three languages fluently.",
        options: ["is speaking", "has been speaking", "has spoken", "speaks"],
        correctIndex: 3,
        explanation: "Permanent ability/state → Present Simple: She speaks three languages fluently." },
      { id: "3-10", prompt: "I ___ him before, but I can't remember where.",
        options: ["am seeing", "see", "have been seeing", "have seen"],
        correctIndex: 3,
        explanation: "Experience with present relevance → Present Perfect: I have seen him before." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed hard: all 4 tenses + adverbs / time expressions",
    instructions:
      "Advanced mixed exercise. All four present tenses are tested alongside key time expressions and adverbs: always, usually, now, at the moment, already, just, yet, since, for, recently, lately, still, today, these days. Choose the most natural and correct option.",
    questions: [
      { id: "4-1",  prompt: "She ___ still ___ the same mistake every time.",
        options: ["is / making", "makes", "has / made", "has been / making"],
        correctIndex: 1,
        explanation: "Still + every time = repeated habit → Present Simple: She still makes the same mistake every time." },
      { id: "4-2",  prompt: "I ___ for a new flat lately. The market is crazy.",
        options: ["look", "am looking", "have looked", "have been looking"],
        correctIndex: 3,
        explanation: "Lately = ongoing recent activity → PPC: I have been looking for a new flat lately." },
      { id: "4-3",  prompt: "They ___ their project yet. It's due tomorrow.",
        options: ["don't finish", "aren't finishing", "haven't been finishing", "haven't finished"],
        correctIndex: 3,
        explanation: "Yet in a negative → Present Perfect: They haven't finished their project yet." },
      { id: "4-4",  prompt: "He ___ just ___ back from a conference in Berlin.",
        options: ["is / coming", "comes / back", "has / come", "has been / coming"],
        correctIndex: 2,
        explanation: "Just = very recent completed action → Present Perfect: He has just come back from Berlin." },
      { id: "4-5",  prompt: "More and more people ___ to work from home these days.",
        options: ["choose", "have chosen", "have been choosing", "are choosing"],
        correctIndex: 3,
        explanation: "More and more + these days = changing/evolving trend → Present Continuous: More and more people are choosing to work from home." },
      { id: "4-6",  prompt: "I can't believe it — she ___ here for 30 years and I never noticed.",
        options: ["worked", "works", "is working", "has been working"],
        correctIndex: 3,
        explanation: "For 30 years + still here = ongoing → PPC: She has been working here for 30 years." },
      { id: "4-7",  prompt: "He ___ always ___ the same brand of coffee. He's very loyal.",
        options: ["is / buying", "has / bought", "buys / always", "has been / buying"],
        correctIndex: 0,
        explanation: "Always with continuous can describe a persistent habit (sometimes irritating): He is always buying the same brand. Alternatively Present Simple also works, but the continuous is used here for emphasis on the habit." },
      { id: "4-8",  prompt: "The scientists ___ this virus since the outbreak began.",
        options: ["study", "are studying", "have studied", "have been studying"],
        correctIndex: 3,
        explanation: "Since the outbreak began = point in time, ongoing research → PPC: The scientists have been studying this virus since the outbreak began." },
      { id: "4-9",  prompt: "I ___ already ___ my boss about the problem.",
        options: ["am / telling", "have / told", "have been / telling", "was / telling"],
        correctIndex: 1,
        explanation: "Already = completed action → Present Perfect: I have already told my boss about the problem." },
      { id: "4-10", prompt: "He ___ coffee every morning, but right now he ___ tea.",
        options: ["drinks / is drinking", "is drinking / drinks", "has drunk / is drinking", "drinks / drinks"],
        correctIndex: 0,
        explanation: "Every morning = habit (PS), right now = current action (PC): He drinks coffee every morning, but right now he is drinking tea." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "PS vs PC",
  2: "PP vs PPC",
  3: "All 4 Tenses",
  4: "Mixed Hard",
};

export default function AllPresentTensesClient() {
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

  function reset() { window.scrollTo({ top: 0, behavior: "smooth" }); setChecked(false); setAnswers({}); }
  function switchSet(n: 1 | 2 | 3 | 4) { window.scrollTo({ top: 0, behavior: "smooth" }); setExNo(n); setChecked(false); setAnswers({}); }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/present-perfect-continuous">Present Perfect Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">All Present Tenses</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            All <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Present Tenses</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 border border-rose-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">B2</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions to master all four present tenses: <b>Present Simple</b>, <b>Present Continuous</b>, <b>Present Perfect</b>, and <b>Present Perfect Continuous</b> — with key time expressions and adverbs.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          <AdUnit variant="sidebar-dark" />

          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
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
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
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
                        <button onClick={() => { setChecked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
                      ) : (
                        <button onClick={reset} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">Try Again</button>
                      )}
                      {checked && exNo < 4 && (
                        <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">Next Exercise →</button>
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

          <AdUnit variant="sidebar-dark" />
        </div>

        <AdUnit variant="mobile-dark" />

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/present-perfect-continuous" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Present Perfect Continuous exercises</a>
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

      {/* 4 mini gradient cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 p-4 space-y-2">
          <span className="inline-flex items-center rounded-xl bg-slate-700 px-3 py-1 text-xs font-black text-white">Present Simple</span>
          <Formula parts={[{ text: "I work / She works", color: "slate" }]} />
          <div className="space-y-1">
            <Ex en="She drinks coffee every morning." />
            <Ex en="Water boils at 100°C." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-4 space-y-2">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">Present Continuous</span>
          <Formula parts={[{ text: "I am working / She is working", color: "sky" }]} />
          <div className="space-y-1">
            <Ex en="She is talking on the phone right now." />
            <Ex en="Prices are rising these days." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-4 space-y-2">
          <span className="inline-flex items-center rounded-xl bg-emerald-600 px-3 py-1 text-xs font-black text-white">Present Perfect</span>
          <Formula parts={[{ text: "I have worked / She has worked", color: "green" }]} />
          <div className="space-y-1">
            <Ex en="She has finished the report." />
            <Ex en="I have never tried sushi." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-violet-50 to-white border border-violet-100 p-4 space-y-2">
          <span className="inline-flex items-center rounded-xl bg-violet-600 px-3 py-1 text-xs font-black text-white">Present Perfect Continuous</span>
          <Formula parts={[{ text: "I have been working / She has been working", color: "violet" }]} />
          <div className="space-y-1">
            <Ex en="She has been working here for 3 years." />
            <Ex en="It has been raining since Tuesday." />
          </div>
        </div>
      </div>

      {/* Big comparison table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Full comparison table</div>
        <div className="rounded-2xl border border-black/10 overflow-x-auto">
          <table className="w-full text-xs min-w-[600px]">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-3 py-3 font-black text-slate-700">Tense</th>
                <th className="px-3 py-3 font-black text-slate-700">Form</th>
                <th className="px-3 py-3 font-black text-slate-700">Main uses</th>
                <th className="px-3 py-3 font-black text-slate-700">Key time signals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr className="bg-white">
                <td className="px-3 py-3 font-black text-slate-700">Present Simple</td>
                <td className="px-3 py-3 font-mono text-slate-600">work / works</td>
                <td className="px-3 py-3 text-slate-600">Habits, routines, permanent states, general truths, instructions</td>
                <td className="px-3 py-3 font-mono text-slate-500">always, usually, often, sometimes, never, every day, on Mondays</td>
              </tr>
              <tr className="bg-sky-50/40">
                <td className="px-3 py-3 font-black text-sky-800">Present Continuous</td>
                <td className="px-3 py-3 font-mono text-sky-700">am/is/are working</td>
                <td className="px-3 py-3 text-slate-600">Actions now, temporary situations, changing trends, plans (near future)</td>
                <td className="px-3 py-3 font-mono text-slate-500">now, at the moment, right now, today, this week, these days, Look!</td>
              </tr>
              <tr className="bg-white">
                <td className="px-3 py-3 font-black text-emerald-800">Present Perfect</td>
                <td className="px-3 py-3 font-mono text-emerald-700">have/has worked</td>
                <td className="px-3 py-3 text-slate-600">Completed actions with present relevance, life experience, recent news</td>
                <td className="px-3 py-3 font-mono text-slate-500">just, already, yet, ever, never, recently, since, for, today (unfinished period)</td>
              </tr>
              <tr className="bg-violet-50/40">
                <td className="px-3 py-3 font-black text-violet-800">Present Perfect Continuous</td>
                <td className="px-3 py-3 font-mono text-violet-700">have/has been working</td>
                <td className="px-3 py-3 text-slate-600">Ongoing actions with duration, visible present results, recently stopped actions</td>
                <td className="px-3 py-3 font-mono text-slate-500">for (duration), since (point), all day/morning, lately, recently, How long?</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Key distinctions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Key distinctions to remember</div>
        <div className="space-y-3">
          {[
            {
              label: "Simple vs Continuous (habit vs now)",
              color: "sky",
              examples: [
                "She works at a hospital. (permanent job = PS)",
                "She is working from home today. (temporary = PC)",
                "He reads every evening. (habit = PS)",
                "He is reading a really good book right now. (now = PC)",
              ],
            },
            {
              label: "PP vs PPC (result vs duration/process)",
              color: "violet",
              examples: [
                "I have written the report. (done, result ready = PP)",
                "I have been writing the report all morning. (process, duration = PPC)",
                "She has lost weight. (noticeable result = PP)",
                "She has been exercising every day. (ongoing activity = PPC)",
              ],
            },
            {
              label: "PS vs PP (habit vs experience/recent past)",
              color: "green",
              examples: [
                "I go to the gym regularly. (current habit = PS)",
                "I have been to the gym three times this week. (this week = unfinished period = PP)",
                "She travels a lot. (general habit = PS)",
                "She has travelled to 30 countries. (life experience = PP)",
              ],
            },
          ].map(({ label, color, examples }) => {
            const borderMap: Record<string, string> = { sky: "border-sky-200 bg-sky-50/50", violet: "border-violet-200 bg-violet-50/50", green: "border-emerald-200 bg-emerald-50/50" };
            const badgeMap: Record<string, string> = { sky: "bg-sky-100 text-sky-800 border-sky-200", violet: "bg-violet-100 text-violet-800 border-violet-200", green: "bg-emerald-100 text-emerald-800 border-emerald-200" };
            return (
              <div key={label} className={`rounded-xl border p-4 ${borderMap[color]}`}>
                <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-black mb-2 ${badgeMap[color]}`}>{label}</span>
                <div className="space-y-1">
                  {examples.map((ex) => <Ex key={ex} en={ex} />)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Quick reminder:</span> Stative verbs (know, believe, want, love, hate, own, understand) are <b>never</b> used in any continuous tense — use Present Simple or Present Perfect instead.
        </div>
      </div>

    </div>
  );
}
