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
    title: "Exercise 1 — Evidence-based predictions (going to)",
    instructions:
      "Each sentence describes a visible situation. Choose the correct going to prediction. The subject determines am/is/are. Answers vary by subject and verb.",
    questions: [
      { id: "1-1", prompt: "Look at the sky! Those clouds are very dark. It ___ rain.", options: ["is going to", "will", "rains", "rained"], correctIndex: 0, explanation: "Visible evidence (dark clouds): it is going to rain." },
      { id: "1-2", prompt: "Watch out! That ladder ___ fall — it's leaning at a dangerous angle.", options: ["will fall", "is going to fall", "falls", "fell"], correctIndex: 1, explanation: "Visible danger (angle): is going to fall." },
      { id: "1-3", prompt: "She looks exhausted. She ___ faint if she doesn't sit down.", options: ["will faint", "faints", "is going to faint", "fainted"], correctIndex: 2, explanation: "Observable physical state (exhausted): is going to faint." },
      { id: "1-4", prompt: "The tyres on that car are completely bald. They ___ burst.", options: ["will burst", "burst", "bursted", "are going to burst"], correctIndex: 3, explanation: "Physical evidence (bald tyres): are going to burst." },
      { id: "1-5", prompt: "I can see smoke coming from the oven! The food ___ burn!", options: ["is going to burn", "will burn", "burns", "burned"], correctIndex: 0, explanation: "Sensory evidence (smoke): is going to burn." },
      { id: "1-6", prompt: "They've been arguing all day — they ___ have a big falling out.", options: ["will have", "are going to have", "have", "had"], correctIndex: 1, explanation: "Observable pattern (all-day arguing): are going to have a falling out." },
      { id: "1-7", prompt: "His face is turning red — he ___ explode with anger.", options: ["will explode", "explodes", "is going to explode", "exploded"], correctIndex: 2, explanation: "Visible sign (red face): is going to explode." },
      { id: "1-8", prompt: "Look at those waves! The boat ___ capsize!", options: ["will capsize", "capsizes", "capsized", "is going to capsize"], correctIndex: 3, explanation: "Visible danger (huge waves): is going to capsize." },
      { id: "1-9", prompt: "The ice on the path is melting fast. There ___ be a flood.", options: ["is going to be", "will be", "is", "was"], correctIndex: 0, explanation: "Physical evidence (fast melting): is going to be a flood." },
      { id: "1-10", prompt: "She can barely keep her eyes open. She ___ fall asleep in the meeting.", options: ["will fall", "is going to fall", "falls", "fell"], correctIndex: 1, explanation: "Observable state (barely awake): is going to fall asleep." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Going to (evidence) vs will (opinion): choose correctly",
    instructions:
      "Some sentences have visible evidence NOW → use going to. Others are opinions or guesses → use will. MUST read the context. 5 answers use going to, 5 use will.",
    questions: [
      { id: "2-1", prompt: "Look at him run! He ___ win this race — he's way ahead.", options: ["is going to win", "will win", "wins", "won"], correctIndex: 0, explanation: "Visible evidence (he's way ahead): is going to win." },
      { id: "2-2", prompt: "\"I think prices ___ drop after the election,\" said the economist.", options: ["are going to drop", "will drop", "drop", "dropped"], correctIndex: 1, explanation: "Expert opinion, no current evidence: will drop." },
      { id: "2-3", prompt: "She's been practising for years. She ___ pass the audition — I can tell.", options: ["is going to pass", "passes", "will pass", "passed"], correctIndex: 2, explanation: "Opinion based on knowledge (years of practice): will pass." },
      { id: "2-4", prompt: "Watch out! That branch ___ snap — it's cracking under the weight.", options: ["will snap", "snaps", "snapped", "is going to snap"], correctIndex: 3, explanation: "Current physical sign (cracking): is going to snap." },
      { id: "2-5", prompt: "\"I believe the new law ___ have a big impact on businesses.\"", options: ["is going to have", "will have", "has", "had"], correctIndex: 1, explanation: "Opinion (I believe, no visible event happening): will have." },
      { id: "2-6", prompt: "Her voice is shaking and she looks nervous — she ___ cry.", options: ["is going to cry", "will cry", "cries", "cried"], correctIndex: 0, explanation: "Visible emotional signs (shaking voice, nervous face): is going to cry." },
      { id: "2-7", prompt: "\"I'm sure the project ___ succeed — the team is excellent.\"", options: ["is going to succeed", "will succeed", "succeeds", "succeeded"], correctIndex: 1, explanation: "Confidence/opinion (I'm sure): will succeed." },
      { id: "2-8", prompt: "The engine is making a terrible noise. The car ___ break down.", options: ["will break down", "breaks down", "is going to break down", "broke down"], correctIndex: 2, explanation: "Observable mechanical sign (terrible noise): is going to break down." },
      { id: "2-9", prompt: "\"I don't think he ___ ever change his ways,\" she said sadly.", options: ["is going to", "changes", "changed", "will"], correctIndex: 3, explanation: "Personal opinion (I don't think): will (negative opinion)." },
      { id: "2-10", prompt: "Look at the queue — it ___ take at least an hour to get in.", options: ["is going to take", "will take", "takes", "took"], correctIndex: 0, explanation: "Observable evidence (long queue): is going to take an hour." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Situation → prediction: choose the result",
    instructions:
      "Read the situation and choose the correct evidence-based prediction. Choose am/is/are going to based on the subject. Some sentences use will for contrast. Mix of subjects.",
    questions: [
      { id: "3-1", prompt: "The baby is crying and reaching for the cup. She ___ knock it over.", options: ["is going to knock it over", "will knock it over", "knocks it over", "knocked it over"], correctIndex: 0, explanation: "Visible action (reaching for cup): is going to knock it over." },
      { id: "3-2", prompt: "He's been studying all night. \"I think he ___ ace the test tomorrow.\"", options: ["is going to ace it", "will ace it", "aces it", "aced it"], correctIndex: 1, explanation: "Opinion based on studying habit: will ace the test." },
      { id: "3-3", prompt: "The children are running towards the street without looking. They ___ get hurt!", options: ["will get hurt", "get hurt", "are going to get hurt", "got hurt"], correctIndex: 2, explanation: "Visible dangerous action: are going to get hurt." },
      { id: "3-4", prompt: "\"I believe the merger ___ create thousands of jobs,\" said the CEO.", options: ["is going to create", "creates", "created", "will create"], correctIndex: 3, explanation: "CEO's opinion (I believe): will create jobs." },
      { id: "3-5", prompt: "Her contract ends next week and nothing has been renewed. She ___ lose her job.", options: ["is going to lose", "will lose", "loses", "lost"], correctIndex: 0, explanation: "Known fact / observable situation (contract ending): is going to lose her job." },
      { id: "3-6", prompt: "\"I think the concert ___ be sold out — it's very popular.\"", options: ["is going to be", "will be", "is", "was"], correctIndex: 1, explanation: "Opinion/guess: will be sold out." },
      { id: "3-7", prompt: "He's been eating nothing but junk food. His health ___ suffer.", options: ["will suffer", "suffers", "is going to suffer", "suffered"], correctIndex: 2, explanation: "Observable behaviour pattern: is going to suffer." },
      { id: "3-8", prompt: "\"I'm confident the team ___ deliver on time,\" the manager said.", options: ["is going to deliver", "delivers", "delivered", "will deliver"], correctIndex: 3, explanation: "Manager's confident opinion: will deliver." },
      { id: "3-9", prompt: "The dam is cracking. It ___ burst within hours.", options: ["is going to burst", "will burst", "bursts", "burst"], correctIndex: 0, explanation: "Physical evidence (cracking dam): is going to burst." },
      { id: "3-10", prompt: "\"I believe AI ___ transform the job market completely,\" wrote the researcher.", options: ["is going to transform", "will transform", "transforms", "transformed"], correctIndex: 1, explanation: "Researcher's long-term opinion (I believe): will transform." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed will vs going to for predictions",
    instructions:
      "Complete each sentence with will or be going to (am/is/are going to). Read the context for evidence vs opinion clues. Answers vary throughout.",
    questions: [
      { id: "4-1", prompt: "I can see he's furious — he ___ say something he'll regret.", options: ["is going to say", "will say", "says", "said"], correctIndex: 0, explanation: "Visible anger = evidence: is going to say something." },
      { id: "4-2", prompt: "\"In my opinion, renewable energy ___ become cheaper very soon.\"", options: ["is going to become", "will become", "becomes", "became"], correctIndex: 1, explanation: "Personal opinion (in my opinion): will become cheaper." },
      { id: "4-3", prompt: "She's been practising daily — I'm sure she ___ get the role.", options: ["is going to get", "gets", "will get", "got"], correctIndex: 2, explanation: "Confident opinion (I'm sure): will get the role." },
      { id: "4-4", prompt: "Look at that car — the brakes have failed! It ___ crash!", options: ["will crash", "crashes", "crashed", "is going to crash"], correctIndex: 3, explanation: "Visible immediate danger (no brakes): is going to crash." },
      { id: "4-5", prompt: "\"I think the negotiations ___ take longer than expected.\"", options: ["are going to take", "will take", "take", "took"], correctIndex: 1, explanation: "Opinion (I think): will take longer." },
      { id: "4-6", prompt: "He's been coughing all week and hasn't seen a doctor. He ___ get worse.", options: ["is going to get worse", "will get worse", "gets worse", "got worse"], correctIndex: 0, explanation: "Observable behaviour + consequence: is going to get worse." },
      { id: "4-7", prompt: "\"I don't think the market ___ recover quickly,\" the analyst warned.", options: ["is going to", "recovers", "will", "recovered"], correctIndex: 2, explanation: "Analyst's negative opinion (I don't think): will recover." },
      { id: "4-8", prompt: "She's sprinting towards the finish line — she ___ break the record!", options: ["will break", "breaks", "is going to break", "broke"], correctIndex: 2, explanation: "Visible event happening now: is going to break the record." },
      { id: "4-9", prompt: "\"I believe space tourism ___ become normal within 20 years.\"", options: ["is going to become", "becomes", "became", "will become"], correctIndex: 3, explanation: "Long-term belief/opinion (I believe): will become normal." },
      { id: "4-10", prompt: "The glass is on the edge — it ___ fall! Catch it!", options: ["is going to fall", "will fall", "falls", "fell"], correctIndex: 0, explanation: "Immediate visible danger (on the edge): is going to fall." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Evidence signs",
  2: "Going to vs will",
  3: "Situation → result",
  4: "Mixed",
};

export default function EvidencePredictionsClient() {
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
          <span className="text-slate-700 font-medium">Evidence-Based Predictions</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Be Going To{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Evidence-Based Predictions</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 border border-rose-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">B1</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions on <b>be going to</b> for evidence-based predictions — when you can see or feel something is about to happen — versus <b>will</b> for opinions and guesses.
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
      {/* 2 contrast cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-200 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">👁 be going to — evidence</span>
          <Formula parts={[
            { text: "Visible sign NOW", color: "violet" },
            { text: "→", color: "slate" },
            { text: "am/is/are going to", color: "sky" },
          ]} />
          <div className="text-xs text-slate-600 space-y-1">
            <div>• You can SEE, HEAR, FEEL it happening</div>
            <div>• The event is about to happen right now</div>
            <div>• Often after &quot;Look!&quot; / &quot;Watch out!&quot;</div>
          </div>
          <div className="space-y-1.5">
            <Ex en="Look at those clouds! It's going to rain." />
            <Ex en="She looks pale — she's going to faint." />
            <Ex en="Watch out! He's going to fall!" />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-yellow-50 to-white border border-yellow-200 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-yellow-400 px-3 py-1 text-xs font-black text-black">💭 will — opinion / guess</span>
          <Formula parts={[
            { text: "Opinion/belief", color: "violet" },
            { text: "→", color: "slate" },
            { text: "will", color: "yellow" },
          ]} />
          <div className="text-xs text-slate-600 space-y-1">
            <div>• Based on knowledge or feeling</div>
            <div>• No visible event happening right now</div>
            <div>• After &quot;I think&quot; / &quot;I believe&quot; / &quot;I&apos;m sure&quot;</div>
          </div>
          <div className="space-y-1.5">
            <Ex en="I think it will rain tomorrow." />
            <Ex en="I believe prices will fall." />
            <Ex en="I'm sure she'll pass." />
          </div>
        </div>
      </div>

      {/* Situations table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Evidence clues that trigger going to</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">What you observe</th>
                <th className="px-4 py-2.5 font-black text-sky-700">Evidence prediction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Dark clouds in the sky", "It's going to rain."],
                ["Someone looks pale / dizzy", "She's going to faint."],
                ["A glass is on the edge", "It's going to fall."],
                ["Someone is driving too fast", "He's going to crash."],
                ["Smoke coming from the kitchen", "The food is going to burn."],
                ["A branch cracking under weight", "It's going to snap."],
                ["A person running full speed towards the finish", "She's going to win."],
              ].map(([obs, pred], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2.5 text-slate-700 text-xs font-semibold">{obs}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-xs">{pred}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-2">Key distinction</div>
        <div className="space-y-2 text-sm text-amber-900">
          <div><b>Evidence = going to:</b> &quot;Look at those clouds — it&apos;s going to rain!&quot; (you see the clouds NOW)</div>
          <div><b>Opinion = will:</b> &quot;I think it will rain tomorrow.&quot; (just your personal prediction, no current evidence)</div>
        </div>
      </div>

      {/* Signal words */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Signal words</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-sky-50 border border-sky-200 p-4 space-y-2">
            <div className="text-sm font-black text-sky-800">→ be going to (evidence)</div>
            <div className="flex flex-wrap gap-1.5">
              {["Look!", "Watch out!", "Can you see…?", "Listen!", "I can smell/hear/see…", "Watch — he's about to…", "Any second now…"].map((s) => (
                <span key={s} className="rounded-lg bg-white border border-sky-200 px-2 py-0.5 text-xs font-semibold text-sky-800">{s}</span>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4 space-y-2">
            <div className="text-sm font-black text-yellow-800">→ will (opinion)</div>
            <div className="flex flex-wrap gap-1.5">
              {["I think…", "I believe…", "I'm sure…", "I doubt…", "In my opinion…", "probably", "definitely", "I expect…"].map((s) => (
                <span key={s} className="rounded-lg bg-white border border-yellow-200 px-2 py-0.5 text-xs font-semibold text-yellow-800">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Senses */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Evidence can come from any sense</div>
        <div className="flex flex-wrap gap-2">
          {["👁 See: dark clouds / red face", "👂 Hear: cracking sound / engine noise", "👃 Smell: smoke / burning", "✋ Feel: shaking / trembling", "🧠 Know: facts / data / signs"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
