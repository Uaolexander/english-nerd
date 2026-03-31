"use client";
import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string; };
type ExSet = { no: 1 | 2 | 3 | 4; title: string; instructions: string; questions: MCQ[]; };

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Completed result (PP) vs ongoing process (PPC)",
    instructions:
      "Choose between the Present Perfect (I have done) and the Present Perfect Continuous (I have been doing). Use the Present Perfect when the action is complete and the result matters. Use the Present Perfect Continuous when the focus is on the ongoing process, effort, or duration.",
    questions: [
      { id: "1-1",  prompt: "I ___ three emails this morning. (finished, focus on result)",
        options: ["have been writing", "have written", "was writing", "wrote"],
        correctIndex: 1,
        explanation: "Three emails = countable completed result → Present Perfect: I have written three emails." },
      { id: "1-2",  prompt: "I ___ emails all morning. (focus on the activity, not the count)",
        options: ["have written", "wrote", "have been writing", "was writing"],
        correctIndex: 2,
        explanation: "All morning + focus on ongoing activity → PPC: I have been writing emails all morning." },
      { id: "1-3",  prompt: "She looks exhausted. She ___ all day.",
        options: ["has worked", "has been working", "worked", "is working"],
        correctIndex: 1,
        explanation: "Visible result (exhaustion) from ongoing activity → PPC: She has been working all day." },
      { id: "1-4",  prompt: "He ___ the report. It's on your desk. (completed, result available)",
        options: ["has been finishing", "was finishing", "has finished", "is finishing"],
        correctIndex: 2,
        explanation: "The report is done and available → Present Perfect: He has finished the report." },
      { id: "1-5",  prompt: "We ___ a lot of progress on the project this week.",
        options: ["have been making", "made", "are making", "make"],
        correctIndex: 0,
        explanation: "A lot of progress over a period = ongoing effort → PPC: We have been making a lot of progress." },
      { id: "1-6",  prompt: "The builders ___ a new bridge. It's open now. (completed action)",
        options: ["have been building", "were building", "have built", "are building"],
        correctIndex: 2,
        explanation: "The bridge is complete and open → Present Perfect: They have built a new bridge." },
      { id: "1-7",  prompt: "He ___ on this novel for two years and still isn't done.",
        options: ["has worked", "has been working", "worked", "is working"],
        correctIndex: 1,
        explanation: "For two years + still in progress → PPC: He has been working on this novel for two years." },
      { id: "1-8",  prompt: "I ___ the book. Do you want to borrow it?",
        options: ["have been reading", "was reading", "read", "have read"],
        correctIndex: 3,
        explanation: "The book is finished (borrow it) → Present Perfect: I have read the book." },
      { id: "1-9",  prompt: "You've been crying. Your eyes are red. What ___?",
        options: ["has happened", "have happened", "has been happening", "happened"],
        correctIndex: 2,
        explanation: "What has been happening? = asking about ongoing activity with a visible present result." },
      { id: "1-10", prompt: "She ___ five languages. (ability, completed learning)",
        options: ["has been learning", "has learnt", "is learning", "was learning"],
        correctIndex: 1,
        explanation: "A completed skill/result → Present Perfect: She has learnt five languages." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Stative verbs: PP only (no continuous form)",
    instructions:
      "Some verbs are 'stative' (describing states, not actions) and are not normally used in continuous tenses. Common stative verbs: know, understand, believe, want, love, hate, need, own, belong, seem, appear, hear, see, taste, smell. Choose the correct form — always Present Perfect for these verbs.",
    questions: [
      { id: "2-1",  prompt: "I ___ him for over twenty years.",
        options: ["have been knowing", "have known", "am knowing", "was knowing"],
        correctIndex: 1,
        explanation: "Know is a stative verb — it cannot be used in the continuous: I have known him for over twenty years." },
      { id: "2-2",  prompt: "She ___ this house since her grandmother died.",
        options: ["has been owning", "has owned", "is owning", "was owning"],
        correctIndex: 1,
        explanation: "Own is stative — no continuous form: She has owned this house since her grandmother died." },
      { id: "2-3",  prompt: "They ___ each other since they were teenagers.",
        options: ["have been loving", "are loving", "have loved", "were loving"],
        correctIndex: 2,
        explanation: "Love is stative — use simple form: They have loved each other since they were teenagers." },
      { id: "2-4",  prompt: "He ___ English grammar since last year.",
        options: ["has understood", "has been understanding", "is understanding", "was understanding"],
        correctIndex: 0,
        explanation: "Understand is stative — no continuous: He has understood English grammar since last year." },
      { id: "2-5",  prompt: "We ___ a dog ever since we moved to the countryside.",
        options: ["have been wanting", "are wanting", "have wanted", "were wanting"],
        correctIndex: 2,
        explanation: "Want is stative — use Present Perfect simple: We have wanted a dog ever since we moved." },
      { id: "2-6",  prompt: "She ___ that something was wrong from the start.",
        options: ["has been believing", "has believed", "is believing", "was believing"],
        correctIndex: 1,
        explanation: "Believe is stative — no continuous: She has believed that something was wrong from the start." },
      { id: "2-7",  prompt: "This watch ___ to my grandfather.",
        options: ["has been belonging", "is belonging", "was belonging", "has belonged"],
        correctIndex: 3,
        explanation: "Belong is stative — use simple form: This watch has belonged to my grandfather." },
      { id: "2-8",  prompt: "I ___ this type of music since I was a teenager.",
        options: ["have been hating", "have hated", "am hating", "was hating"],
        correctIndex: 1,
        explanation: "Hate is stative — no continuous: I have hated this type of music since I was a teenager." },
      { id: "2-9",  prompt: "They ___ a need for better communication for a long time.",
        options: ["have been seeing", "have seen", "are seeing", "were seeing"],
        correctIndex: 1,
        explanation: "See (in the sense of perceive/recognise) is stative — Present Perfect: They have seen a need for better communication." },
      { id: "2-10", prompt: "The soup ___ strange all day. I think it's gone off.",
        options: ["has been tasting", "has tasted", "is tasting", "was tasting"],
        correctIndex: 1,
        explanation: "Taste (as a state/perception) is stative — no continuous: The soup has tasted strange all day." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Both possible but meaning differs: choose the more natural option",
    instructions:
      "In these sentences both Present Perfect and Present Perfect Continuous may be grammatically possible, but one is more natural given the context. Look at the clues in the sentence to decide whether the emphasis is on a completed result or an ongoing activity.",
    questions: [
      { id: "3-1",  prompt: "I'm covered in paint — I ___ the living room.",
        options: ["have painted", "have been painting", "painted", "was painting"],
        correctIndex: 1,
        explanation: "Covered in paint = visible result of an ongoing activity → PPC: I have been painting the living room." },
      { id: "3-2",  prompt: "The room looks great — I ___ the living room.",
        options: ["have been painting", "was painting", "painted", "have painted"],
        correctIndex: 3,
        explanation: "The room looks great = completed result → PP: I have painted the living room." },
      { id: "3-3",  prompt: "My hands are dirty — I ___ the car.",
        options: ["have fixed", "fixed", "was fixing", "have been fixing"],
        correctIndex: 3,
        explanation: "Dirty hands = evidence of ongoing activity → PPC: I have been fixing the car." },
      { id: "3-4",  prompt: "The car runs perfectly now — I ___ it.",
        options: ["have been fixing", "fixed", "was fixing", "have fixed"],
        correctIndex: 3,
        explanation: "Runs perfectly = completed result → PP: I have fixed it." },
      { id: "3-5",  prompt: "She looks nervous. She ___ about the interview.",
        options: ["has thought", "was thinking", "thought", "has been thinking"],
        correctIndex: 3,
        explanation: "She looks nervous = visible result of ongoing mental activity → PPC: She has been thinking about the interview." },
      { id: "3-6",  prompt: "She made a decision. She ___ about it carefully.",
        options: ["has been thinking", "was thinking", "has thought", "thinks"],
        correctIndex: 2,
        explanation: "She made a decision = the thinking is complete → PP: She has thought about it carefully." },
      { id: "3-7",  prompt: "Why is he so tired? He ___ since 6am.",
        options: ["has worked", "worked", "has been working", "is working"],
        correctIndex: 2,
        explanation: "Why is he tired? = asking about an ongoing activity's effect → PPC: He has been working since 6am." },
      { id: "3-8",  prompt: "He finally submitted his dissertation. He ___ it for two years.",
        options: ["has been writing", "was writing", "has written", "writes"],
        correctIndex: 2,
        explanation: "Finally submitted = completed → PP: He has written his dissertation. (Though PPC was the process, the result is what matters now.)" },
      { id: "3-9",  prompt: "Your eyes are red. ___ you been crying?",
        options: ["Did", "Were", "Have", "Has"],
        correctIndex: 2,
        explanation: "Have you been crying? — PPC question about recent activity with visible present result." },
      { id: "3-10", prompt: "I ___ the dishes. You can use them now.",
        options: ["have been washing", "was washing", "washed", "have washed"],
        correctIndex: 3,
        explanation: "You can use them now = completed result → PP: I have washed the dishes." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed hard: PP vs PPC in challenging contexts",
    instructions:
      "This set mixes Present Perfect and Present Perfect Continuous in more complex contexts. Consider the meaning carefully: Is the action complete or still ongoing? Is the focus on the result or the duration/process? Are there stative verbs involved?",
    questions: [
      { id: "4-1",  prompt: "We ___ ten kilometres today. (exact count, completed)",
        options: ["have been running", "were running", "have run", "are running"],
        correctIndex: 2,
        explanation: "Ten kilometres = measurable completed result → PP: We have run ten kilometres today." },
      { id: "4-2",  prompt: "My legs ache. We ___ all afternoon.",
        options: ["have run", "ran", "are running", "have been running"],
        correctIndex: 3,
        explanation: "Aching legs = result of ongoing activity → PPC: We have been running all afternoon." },
      { id: "4-3",  prompt: "How many cups of coffee ___ today?",
        options: ["have you been drinking", "were you drinking", "did you drink", "have you drunk"],
        correctIndex: 3,
        explanation: "How many = asking about a completed countable number → PP: How many cups have you drunk today?" },
      { id: "4-4",  prompt: "You look jittery. How much coffee ___ today?",
        options: ["have you drunk", "did you drink", "were you drinking", "have you been drinking"],
        correctIndex: 3,
        explanation: "You look jittery = visible result, asking about the ongoing habit/activity → PPC: How much coffee have you been drinking today?" },
      { id: "4-5",  prompt: "I ___ this city since I was born. I love it here.",
        options: ["have been knowing", "have been living in", "lived in", "am living in"],
        correctIndex: 1,
        explanation: "Since I was born + still living there = ongoing → PPC: I have been living in this city since I was born." },
      { id: "4-6",  prompt: "I ___ the truth about this for years — nobody listens.",
        options: ["have been saying", "was saying", "said", "say"],
        correctIndex: 0,
        explanation: "For years + ongoing effort/frustration → PPC: I have been saying the truth about this for years." },
      { id: "4-7",  prompt: "He ___ three books this year. (completed, countable result)",
        options: ["has been reading", "was reading", "has read", "reads"],
        correctIndex: 2,
        explanation: "Three books = countable completed result → PP: He has read three books this year." },
      { id: "4-8",  prompt: "She ___ a lot lately. She seems much calmer now.",
        options: ["has meditated", "meditated", "has been meditating", "is meditating"],
        correctIndex: 2,
        explanation: "Lately + seems calmer = ongoing habit with present result → PPC: She has been meditating a lot lately." },
      { id: "4-9",  prompt: "The scientists ___ a breakthrough. (completed achievement)",
        options: ["have been achieving", "were achieving", "are achieving", "have achieved"],
        correctIndex: 3,
        explanation: "A breakthrough = single completed achievement → PP: The scientists have achieved a breakthrough." },
      { id: "4-10", prompt: "The scientists ___ this problem for decades. They're close to a solution.",
        options: ["have solved", "solved", "were solving", "have been studying"],
        correctIndex: 3,
        explanation: "For decades + still working on it → PPC: The scientists have been studying this problem for decades." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Result vs Process",
  2: "Stative Verbs",
  3: "Context Choice",
  4: "Mixed Hard",
};

export default function PpVsPpcClient() {
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
          <span className="text-slate-700 font-medium">Perfect vs Perfect Continuous</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            PP <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">vs PPC</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 border border-rose-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">B2</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions to master the distinction between <b>Present Perfect</b> (I have done) and <b>Present Perfect Continuous</b> (I have been doing) — covering results vs processes, stative verbs, and contextual nuance.
        </p>

        {/* Three-column grid */}
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

      {/* 2 gradient cards: PP vs PPC */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-600 px-3 py-1 text-xs font-black text-white">Present Perfect — completed result</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "have / has", color: "yellow" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I have written three emails. (they are done — result matters)" />
            <Ex en="She has finished the report. (it is ready now)" />
            <Ex en="He has read the book. (the book is finished)" />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-600 px-3 py-1 text-xs font-black text-white">Present Perfect Continuous — ongoing process / duration</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "have / has been", color: "yellow" },
            { text: "verb + -ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I have been writing emails all morning. (the activity, not the count)" />
            <Ex en="She has been working on the report since 9am. (duration, effort)" />
            <Ex en="He has been reading for hours. (ongoing activity, visible tiredness)" />
          </div>
        </div>
      </div>

      {/* Comparison table with example pairs */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Side-by-side comparison</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-emerald-700">Present Perfect (result)</th>
                <th className="px-4 py-2.5 font-black text-sky-700">Present Perfect Continuous (process)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I've painted the wall. (it's done)", "I've been painting. (I'm still covered in paint)"],
                ["She's written the novel. (it's published)", "She's been writing the novel for 2 years. (still in progress)"],
                ["He's fixed the car. (it works now)", "He's been fixing the car all day. (effort, duration)"],
                ["We've eaten. (we're not hungry)", "We've been eating for an hour. (long meal, ongoing)"],
                ["They've built a bridge. (completed project)", "They've been building a bridge since last year. (still under construction)"],
              ].map(([pp, ppc], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2.5 text-emerald-800 text-xs">{pp}</td>
                  <td className="px-4 py-2.5 text-sky-800 text-xs">{ppc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stative verbs */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Stative verbs — PP only, never continuous</div>
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 mb-3">
          <span className="font-black">Rule:</span> Stative verbs describe states (not actions) and are <b>never</b> used in continuous tenses — not in Present Continuous and not in Present Perfect Continuous.
        </div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Category</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Stative verbs</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Correct form</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Emotions", "love, hate, like, prefer, want, wish", "I have always loved jazz. ✅"],
                ["Mental states", "know, believe, understand, think (opinion), remember, forget", "She has known him for years. ✅"],
                ["Senses", "see, hear, smell, taste, feel (perception)", "It has tasted strange all day. ✅"],
                ["Possession", "have (possess), own, belong, contain", "He has owned this flat since 2015. ✅"],
                ["Other states", "seem, appear, need, depend, consist", "This has always seemed odd to me. ✅"],
              ].map(([cat, verbs, ex], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{cat}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-600 text-xs">{verbs}</td>
                  <td className="px-4 py-2.5 text-emerald-700 text-xs">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key clues */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Key clues in sentences</div>
        <div className="space-y-3">
          {[
            { label: "Use PP when you see...", color: "green", examples: ["a countable number: I've read 5 books.", "a result word: It's done / ready / finished.", "already / just / yet in completion context.", "a stative verb: know / believe / own etc."] },
            { label: "Use PPC when you see...", color: "sky", examples: ["for / since + duration: for two hours / since Monday.", "all day / all morning / lately / recently.", "a visible result of activity: tired eyes / dirty hands.", "still / not finished yet (process ongoing)."] },
          ].map(({ label, color, examples }) => {
            const borderMap: Record<string, string> = { green: "border-emerald-200 bg-emerald-50/50", sky: "border-sky-200 bg-sky-50/50" };
            const badgeMap: Record<string, string> = { green: "bg-emerald-100 text-emerald-800 border-emerald-200", sky: "bg-sky-100 text-sky-800 border-sky-200" };
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
      </div>

    </div>
  );
}
