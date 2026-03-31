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
    title: "Set 1 — Result/Completion vs Duration",
    instructions:
      "Choose Past Perfect (had + past participle) for completed results, or Past Perfect Continuous (had been + -ing) for duration/process. Roughly half PP, half PPC.",
    questions: [
      {
        id: "pp1-1",
        prompt: "By the time she arrived, I ___ three chapters. (specific number = completed)",
        options: ["had been reading", "had read", "was reading", "read"],
        correctIndex: 1,
        explanation: "had read — Past Perfect: 'three chapters' is a completed quantity/result.",
      },
      {
        id: "pp1-2",
        prompt: "She looked exhausted because she ___ for hours. (duration = process)",
        options: ["had run", "ran", "had been running", "was running"],
        correctIndex: 2,
        explanation: "had been running — PPC: 'for hours' emphasises duration of an ongoing activity.",
      },
      {
        id: "pp1-3",
        prompt: "He was proud because he ___ the project. (completion = result)",
        options: ["had been finishing", "finished", "was finishing", "had finished"],
        correctIndex: 3,
        explanation: "had finished — Past Perfect: the project is completed, a result he's proud of.",
      },
      {
        id: "pp1-4",
        prompt: "Her hands were covered in paint because she ___ all afternoon. (duration causing visible result)",
        options: ["had painted", "painted", "had been painting", "was painting"],
        correctIndex: 2,
        explanation: "had been painting — PPC: the ongoing activity (all afternoon) explains the visible result.",
      },
      {
        id: "pp1-5",
        prompt: "By 10 a.m., they ___ two miles. (specific distance = completed)",
        options: ["had been walking", "walked", "were walking", "had walked"],
        correctIndex: 3,
        explanation: "had walked — Past Perfect: 'two miles' is a completed measurable result.",
      },
      {
        id: "pp1-6",
        prompt: "The room was smoky because she ___ in there. (process causing result)",
        options: ["had smoked", "smoked", "was smoking", "had been smoking"],
        correctIndex: 3,
        explanation: "had been smoking — PPC: ongoing smoking caused the smoky room.",
      },
      {
        id: "pp1-7",
        prompt: "I was surprised because she ___ the whole cake. (completed quantity)",
        options: ["had been eating", "was eating", "ate", "had eaten"],
        correctIndex: 3,
        explanation: "had eaten — Past Perfect: 'the whole cake' is a completed result.",
      },
      {
        id: "pp1-8",
        prompt: "He was sweating because he ___ for an hour without stopping. (duration = process)",
        options: ["had danced", "danced", "was dancing", "had been dancing"],
        correctIndex: 3,
        explanation: "had been dancing — PPC: 'for an hour' shows the duration causing the sweating.",
      },
      {
        id: "pp1-9",
        prompt: "She knew the script perfectly because she ___ it 20 times. (repeated completed action)",
        options: ["had been practising", "practised", "was practising", "had practised"],
        correctIndex: 3,
        explanation: "had practised — Past Perfect: '20 times' is a completed count.",
      },
      {
        id: "pp1-10",
        prompt: "The children were tired because they ___ all day. (all day = duration)",
        options: ["had played", "played", "were playing", "had been playing"],
        correctIndex: 3,
        explanation: "had been playing — PPC: 'all day' emphasises the duration of activity.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Set 2 — Stative Verbs (always PP, never PPC) + Non-stative",
    instructions:
      "Stative verbs (know, believe, understand, want, love, hate, need, own) cannot be used in continuous form — use Past Perfect. Other verbs may use PPC.",
    questions: [
      {
        id: "pp2-1",
        prompt: "She ___ him for years before they started dating.",
        options: ["had been knowing", "was knowing", "had known", "knew"],
        correctIndex: 2,
        explanation: "had known — 'know' is stative: no continuous form. Use Past Perfect: had known.",
      },
      {
        id: "pp2-2",
        prompt: "He was nervous because he ___ in front of an audience before.",
        options: ["hadn't been performing", "wasn't performing", "hadn't performed", "didn't perform"],
        correctIndex: 2,
        explanation: "hadn't performed — Past Perfect negative for a completed experience (first time).",
      },
      {
        id: "pp2-3",
        prompt: "By the time the deal was signed, they ___ about it for months.",
        options: ["had been negotiating", "had negotiated", "were negotiating", "negotiated"],
        correctIndex: 0,
        explanation: "had been negotiating — PPC: 'for months' shows duration of an ongoing process.",
      },
      {
        id: "pp2-4",
        prompt: "She ___ a flat in the city centre for several years before she moved.",
        options: ["had been owning", "was owning", "owned", "had owned"],
        correctIndex: 3,
        explanation: "had owned — 'own' is stative: no continuous form. Use Past Perfect.",
      },
      {
        id: "pp2-5",
        prompt: "I ___ the answer all along, but I didn't say anything.",
        options: ["had been knowing", "was knowing", "had known", "knew"],
        correctIndex: 2,
        explanation: "had known — 'know' is stative. Use Past Perfect: had known.",
      },
      {
        id: "pp2-6",
        prompt: "They ___ together for three years before they moved in.",
        options: ["had dated", "were dating", "had been dating", "dated"],
        correctIndex: 2,
        explanation: "had been dating — 'date' (go out with someone) is a dynamic verb; PPC for duration.",
      },
      {
        id: "pp2-7",
        prompt: "He ___ to quit his job for a long time before he finally did.",
        options: ["had been wanting", "was wanting", "had wanted", "wanted"],
        correctIndex: 2,
        explanation: "had wanted — 'want' is stative: no continuous form. Use Past Perfect.",
      },
      {
        id: "pp2-8",
        prompt: "The engineers ___ on the bridge for two years when it was finally completed.",
        options: ["had worked", "worked", "were working", "had been working"],
        correctIndex: 3,
        explanation: "had been working — 'work' is dynamic; PPC with 'for two years' for duration.",
      },
      {
        id: "pp2-9",
        prompt: "She ___ what to do. (state of uncertainty at a past moment)",
        options: ["had been not knowing", "wasn't knowing", "hadn't known", "didn't know"],
        correctIndex: 3,
        explanation: "didn't know — 'know' is stative; in simple past context, Past Simple is natural here.",
      },
      {
        id: "pp2-10",
        prompt: "By the end of the course, we ___ over a hundred new words.",
        options: ["had been learning", "were learning", "had learned", "learned"],
        correctIndex: 2,
        explanation: "had learned — Past Perfect: 'over a hundred words' is a completed count/result.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Set 3 — Context Clues (duration or number/completion?)",
    instructions:
      "Read context clues carefully: time expressions with 'for/since' suggest PPC; countable results, 'already/just/never/yet' suggest PP.",
    questions: [
      {
        id: "pp3-1",
        prompt: "She had ___ the email before I arrived. ('already' suggests completed action)",
        options: ["been writing", "already written", "been already writing", "already been writing"],
        correctIndex: 1,
        explanation: "already written — Past Perfect with 'already' for a completed action before another past event.",
      },
      {
        id: "pp3-2",
        prompt: "He had been ___ for five hours without a break. ('for five hours' suggests duration)",
        options: ["drive", "drove", "driven", "driving"],
        correctIndex: 3,
        explanation: "driving — had been driving: PPC with 'for five hours' for duration.",
      },
      {
        id: "pp3-3",
        prompt: "By the time we got there, she had ___ waiting for 30 minutes. (duration = PPC)",
        options: ["been", "already", "just", "never"],
        correctIndex: 0,
        explanation: "been — had been waiting: PPC requires 'been' before the -ing form.",
      },
      {
        id: "pp3-4",
        prompt: "I had ___ finished the exam when time was called. ('just' = completed moment = PP)",
        options: ["been just", "just", "been", "just been"],
        correctIndex: 1,
        explanation: "just — had just finished: Past Perfect with 'just' for a recently completed action.",
      },
      {
        id: "pp3-5",
        prompt: "He had ___ four books by the end of the year. ('four books' = completed quantity = PP)",
        options: ["been writing", "written", "been written", "write"],
        correctIndex: 1,
        explanation: "written — had written: Past Perfect for a completed quantity (four books).",
      },
      {
        id: "pp3-6",
        prompt: "She had been studying since ___ in the morning. ('since' = starting point = PPC)",
        options: ["yet", "already", "early", "just"],
        correctIndex: 2,
        explanation: "early — since early in the morning: 'since' + starting point is the PPC pattern.",
      },
      {
        id: "pp3-7",
        prompt: "He had ___ been to Paris before. ('never' = experience = PP)",
        options: ["been never", "never", "always been", "been always"],
        correctIndex: 1,
        explanation: "never — had never been: Past Perfect with 'never' for a past experience.",
      },
      {
        id: "pp3-8",
        prompt: "They had ___ painting the fence all morning. ('all morning' = duration = PPC)",
        options: ["just", "already", "never", "been"],
        correctIndex: 3,
        explanation: "been — had been painting: PPC with 'all morning' for duration.",
      },
      {
        id: "pp3-9",
        prompt: "I hadn't ___ the instructions yet. ('yet' = not completed = PP)",
        options: ["been reading", "read", "been read", "reading"],
        correctIndex: 1,
        explanation: "read — hadn't read yet: Past Perfect negative with 'yet' for an incomplete action.",
      },
      {
        id: "pp3-10",
        prompt: "She had been feeling unwell ___ the previous Friday. ('since' = starting point = PPC)",
        options: ["for", "already", "since", "yet"],
        correctIndex: 2,
        explanation: "since — since the previous Friday: 'since' with a specific past starting point requires PPC.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Set 4 — Mixed Hard (PP and PPC with Common Errors)",
    instructions:
      "Choose the correct form. All four options may include Past Perfect, PPC, Past Continuous, and Past Simple. Pay attention to all context clues.",
    questions: [
      {
        id: "pp4-1",
        prompt: "By noon, she ___ five cups of coffee. (count = completed = PP)",
        options: ["had been drinking", "was drinking", "drank", "had drunk"],
        correctIndex: 3,
        explanation: "had drunk — Past Perfect: 'five cups' is a completed countable result.",
      },
      {
        id: "pp4-2",
        prompt: "He was pale because he ___ outside much. (ongoing negative state = PPC)",
        options: ["hadn't been going", "didn't go", "wasn't going", "hadn't gone"],
        correctIndex: 0,
        explanation: "hadn't been going — negative PPC: the ongoing lack of outdoor activity explains the pallor.",
      },
      {
        id: "pp4-3",
        prompt: "She looked relieved because she ___ the exam. (completed event = PP)",
        options: ["had been passing", "was passing", "passed", "had passed"],
        correctIndex: 3,
        explanation: "had passed — Past Perfect: passing the exam is a completed event causing relief.",
      },
      {
        id: "pp4-4",
        prompt: "The children were hyperactive because they ___ sugar all day. (duration = PPC)",
        options: ["had eaten", "ate", "were eating", "had been eating"],
        correctIndex: 3,
        explanation: "had been eating — PPC: 'all day' shows the duration of sugar consumption causing hyperactivity.",
      },
      {
        id: "pp4-5",
        prompt: "I ___ the song before, so I knew all the words.",
        options: ["had been hearing", "had heard", "was hearing", "heard"],
        correctIndex: 1,
        explanation: "had heard — Past Perfect: hearing the song is a completed past experience.",
      },
      {
        id: "pp4-6",
        prompt: "She was hot because she ___ for two hours in the sun. (duration = PPC)",
        options: ["had gardened", "gardened", "was gardening", "had been gardening"],
        correctIndex: 3,
        explanation: "had been gardening — PPC: 'for two hours' shows the duration causing the heat.",
      },
      {
        id: "pp4-7",
        prompt: "By the time the concert started, they ___ in the queue since 4 p.m. (since = PPC)",
        options: ["stood", "had stood", "were standing", "had been standing"],
        correctIndex: 3,
        explanation: "had been standing — PPC with 'since 4 p.m.' for duration from a starting point.",
      },
      {
        id: "pp4-8",
        prompt: "He was surprised because he ___ a message from her in years. (experience = PP)",
        options: ["hadn't been receiving", "hadn't received", "wasn't receiving", "didn't receive"],
        correctIndex: 1,
        explanation: "hadn't received — Past Perfect: no message received is a completed (negative) experience over a period.",
      },
      {
        id: "pp4-9",
        prompt: "The floor was shiny because the cleaner ___ it. (completed action with result = PP)",
        options: ["had been polishing", "was polishing", "polished", "had polished"],
        correctIndex: 3,
        explanation: "had polished — Past Perfect: the completed polishing resulted in the shiny floor.",
      },
      {
        id: "pp4-10",
        prompt: "She explained that she ___ about the decision for weeks. (duration = PPC in reported speech)",
        options: ["was thinking", "thought", "had thought", "had been thinking"],
        correctIndex: 3,
        explanation: "had been thinking — PPC in reported speech: 'for weeks' shows duration before explaining.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Result vs Duration",
  2: "Stative Verbs",
  3: "Context Clues",
  4: "Mixed Hard",
};

export default function PpVsPpcPastClient() {
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
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/past-perfect-continuous">Past Perfect Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Past Perfect vs Continuous</span>
        </div>

        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">PP vs PPC</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 border border-rose-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B2</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions choosing between Past Perfect (<b>had + past participle</b>) and Past Perfect Continuous (<b>had been + -ing</b>). Master stative verbs, context clues, and result vs duration.
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
                <PpVsPpcExplanation />
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
          <a href="/tenses/past-perfect-continuous" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Past Perfect Continuous</a>
          <a href="/tenses/past-perfect-continuous/all-past-tenses" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: All Past Tenses →</a>
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

function PpVsPpcExplanation() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-violet-50 to-white border border-violet-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-violet-500 px-3 py-1 text-xs font-black text-white">Past Perfect — result / completion</span>
          <div className="flex flex-wrap gap-1.5">
            {["Subject", "had", "past participle", "."].map((t, i) => (
              <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${i === 1 ? "bg-yellow-100 text-yellow-800 border-yellow-200" : i === 2 ? "bg-violet-100 text-violet-800 border-violet-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}>{t}</span>
            ))}
          </div>
          <Ex en="She had read the book. (completed action)  ·  He had written 3 emails. (countable result)" />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">Past Perfect Continuous — duration / process</span>
          <div className="flex flex-wrap gap-1.5">
            {["Subject", "had been", "verb + -ing", "."].map((t, i) => (
              <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${i === 1 ? "bg-yellow-100 text-yellow-800 border-yellow-200" : i === 2 ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}>{t}</span>
            ))}
          </div>
          <Ex en="She had been reading for hours. (duration)  ·  He had been working since morning. (ongoing process)" />
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">PP vs PPC — Comparison</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5">
                <th className="px-4 py-2.5 font-black text-left text-violet-700">Past Perfect (had + pp)</th>
                <th className="px-4 py-2.5 font-black text-left text-emerald-700">Past Perfect Cont. (had been + -ing)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Completed action / result", "Ongoing action / process / duration"],
                ["Countable result: 3 books, 5 miles", "Duration: for 3 hours, since morning"],
                ["Signal words: already, just, never, yet", "Signal words: for, since, how long, all day"],
                ["She had eaten. (completed)", "She had been eating. (process)"],
                ["Stative verbs: know, want, own, love", "Dynamic verbs only: run, work, wait, study"],
              ].map(([a, b], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}>
                  <td className="px-4 py-2.5 text-slate-700">{a}</td>
                  <td className="px-4 py-2.5 text-slate-700">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Stative Verbs — always Past Perfect, never PPC</div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {["know", "believe", "understand", "want", "love", "hate", "need", "own", "prefer", "seem", "mean", "belong"].map((v) => (
              <span key={v} className="rounded-lg border border-amber-300 bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-800">{v}</span>
            ))}
          </div>
          <div className="space-y-1 text-sm text-amber-900">
            <Ex en="✗ She had been knowing him for years. → ✓ She had known him for years." />
            <Ex en="✗ He had been wanting to quit. → ✓ He had wanted to quit." />
          </div>
        </div>
      </div>
    </div>
  );
}
