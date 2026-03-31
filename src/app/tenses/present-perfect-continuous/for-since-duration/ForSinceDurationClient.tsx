"use client";
import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string; };
type ExSet = { no: 1 | 2 | 3 | 4; title: string; instructions: string; questions: MCQ[]; };

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — for or since?",
    instructions:
      "Choose for or since to complete the Present Perfect Continuous sentence. Use for with a period of time (for 20 minutes, for two weeks). Use since with a specific point in time (since 9am, since Monday, since 2020).",
    questions: [
      { id: "1-1",  prompt: "I've been waiting ___ 20 minutes.",               options: ["since", "for", "during", "from"],       correctIndex: 1, explanation: "20 minutes is a duration/period → for." },
      { id: "1-2",  prompt: "She has been working here ___ 2018.",             options: ["for", "during", "from", "since"],       correctIndex: 3, explanation: "2018 is a point in time → since." },
      { id: "1-3",  prompt: "They've been arguing ___ three hours.",           options: ["since", "during", "from", "for"],       correctIndex: 3, explanation: "Three hours is a duration → for." },
      { id: "1-4",  prompt: "He has been studying ___ this morning.",          options: ["for", "during", "from", "since"],       correctIndex: 3, explanation: "This morning is a point in time → since." },
      { id: "1-5",  prompt: "We've been living in Madrid ___ five years.",     options: ["since", "during", "from", "for"],       correctIndex: 3, explanation: "Five years is a period → for." },
      { id: "1-6",  prompt: "It has been raining ___ Tuesday.",                options: ["for", "during", "from", "since"],       correctIndex: 3, explanation: "Tuesday is a point in time → since." },
      { id: "1-7",  prompt: "She has been feeling unwell ___ a week.",         options: ["since", "during", "from", "for"],       correctIndex: 3, explanation: "A week is a period/duration → for." },
      { id: "1-8",  prompt: "I've been learning guitar ___ I was a child.",    options: ["for", "during", "from", "since"],       correctIndex: 3, explanation: "Since I was a child = a point in time (a clause) → since." },
      { id: "1-9",  prompt: "He's been running ___ half an hour.",             options: ["since", "during", "from", "for"],       correctIndex: 3, explanation: "Half an hour is a duration → for." },
      { id: "1-10", prompt: "We have been friends ___ primary school.",        options: ["for", "during", "from", "since"],       correctIndex: 3, explanation: "Primary school is a point in time → since." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — How long questions with Present Perfect Continuous",
    instructions:
      "Choose the correct word or phrase to complete each 'How long' question or answer using the Present Perfect Continuous. Remember: How long have/has + subject + been + -ing?",
    questions: [
      { id: "2-1",  prompt: "___ long have you been studying English?",        options: ["What", "Since", "How", "For"],           correctIndex: 2, explanation: "How long…? is the standard question to ask about duration." },
      { id: "2-2",  prompt: "How long ___ she been working at that company?",  options: ["do", "did", "has", "have"],              correctIndex: 2, explanation: "She → has: How long has she been working…?" },
      { id: "2-3",  prompt: '"How long have you been waiting?" — "___ an hour."', options: ["Since", "During", "At", "For"],       correctIndex: 3, explanation: "An hour is a period → for: For an hour." },
      { id: "2-4",  prompt: "How long ___ they been living together?",         options: ["did", "do", "have", "has"],              correctIndex: 2, explanation: "They → have: How long have they been living together?" },
      { id: "2-5",  prompt: '"How long has he been ill?" — "___ Monday."',     options: ["For", "During", "At", "Since"],          correctIndex: 3, explanation: "Monday is a point in time → Since Monday." },
      { id: "2-6",  prompt: "How long have you ___ trying to call me?",        options: ["been", "be", "being", "was"],            correctIndex: 0, explanation: "After have been, the verb takes -ing: have been trying." },
      { id: "2-7",  prompt: "How long ___ it been raining?",                   options: ["do", "did", "have", "has"],              correctIndex: 3, explanation: "It → has: How long has it been raining?" },
      { id: "2-8",  prompt: '"How long have they been together?" — "___ three years."', options: ["Since", "During", "At", "For"], correctIndex: 3, explanation: "Three years is a duration → For three years." },
      { id: "2-9",  prompt: "How long has she been ___ yoga?",                 options: ["do", "done", "doing", "did"],            correctIndex: 2, explanation: "After been, the main verb must be in its -ing form: doing." },
      { id: "2-10", prompt: '"How long have you been here?" — "___ I arrived."', options: ["For", "During", "At", "Since"],        correctIndex: 3, explanation: "I arrived is a point in the past → Since I arrived." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Choose the correct time expression",
    instructions:
      "Select the time expression that correctly completes each Present Perfect Continuous sentence. Pay attention to whether the expression refers to a duration (→ for) or a point in time (→ since).",
    questions: [
      { id: "3-1",  prompt: "She has been working non-stop ___ dawn.",         options: ["for", "during", "at", "since"],          correctIndex: 3, explanation: "Dawn is a point in time → since dawn." },
      { id: "3-2",  prompt: "They've been travelling ___ the past few months.", options: ["since", "during", "at", "for"],          correctIndex: 3, explanation: "The past few months is a period/duration → for the past few months." },
      { id: "3-3",  prompt: "I've been living alone ___ my flatmate left.",    options: ["for", "during", "at", "since"],          correctIndex: 3, explanation: "My flatmate left is a past event (a point in time) → since." },
      { id: "3-4",  prompt: "He has been playing chess ___ he was seven.",     options: ["for", "during", "at", "since"],          correctIndex: 3, explanation: "He was seven refers to a point in the past → since he was seven." },
      { id: "3-5",  prompt: "We've been talking ___ two hours and made no progress.", options: ["since", "during", "at", "for"],  correctIndex: 3, explanation: "Two hours is a duration → for two hours." },
      { id: "3-6",  prompt: "It has been snowing ___ yesterday afternoon.",    options: ["for", "during", "at", "since"],          correctIndex: 3, explanation: "Yesterday afternoon is a point in time → since yesterday afternoon." },
      { id: "3-7",  prompt: "She's been training ___ ages.",                   options: ["since", "during", "at", "for"],          correctIndex: 3, explanation: "Ages is an informal way to say a long time → for ages." },
      { id: "3-8",  prompt: "They have been building this bridge ___ 2019.",   options: ["for", "during", "at", "since"],          correctIndex: 3, explanation: "2019 is a specific year (point in time) → since 2019." },
      { id: "3-9",  prompt: "I've been trying to reach you ___ all morning.",  options: ["since", "during", "at", "for"],          correctIndex: 3, explanation: "All morning is a duration → for all morning." },
      { id: "3-10", prompt: "He's been feeling anxious ___ the interview.",    options: ["for", "during", "at", "since"],          correctIndex: 3, explanation: "The interview is a past event (point in time) → since the interview." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: full PPC sentences with for / since, all forms",
    instructions:
      "This exercise mixes affirmative, negative, and question forms of the Present Perfect Continuous with for and since. Choose the option that makes the sentence grammatically correct and natural.",
    questions: [
      { id: "4-1",  prompt: "She ___ been sleeping well since she changed jobs.",  options: ["has", "hasn't", "haven't", "have"],           correctIndex: 1, explanation: "The context implies poor sleep since changing jobs → She hasn't been sleeping well." },
      { id: "4-2",  prompt: "I've been learning Spanish ___ three years now.",     options: ["since", "during", "at", "for"],               correctIndex: 3, explanation: "Three years is a duration → for three years." },
      { id: "4-3",  prompt: "___ they been waiting since the train was cancelled?", options: ["Did", "Was", "Are", "Have"],                  correctIndex: 3, explanation: "They → Have: Have they been waiting since…?" },
      { id: "4-4",  prompt: "He ___ been practising guitar for weeks.",            options: ["hasn't", "haven't", "have", "has"],            correctIndex: 3, explanation: "He → has: He has been practising guitar for weeks." },
      { id: "4-5",  prompt: "We haven't been getting along well ___ the argument.", options: ["for", "during", "at", "since"],              correctIndex: 3, explanation: "The argument is a point in time → since the argument." },
      { id: "4-6",  prompt: "How long has the baby ___ crying?",                   options: ["be", "been", "being", "was"],                 correctIndex: 1, explanation: "After has, use been + -ing: has the baby been crying." },
      { id: "4-7",  prompt: "She has been volunteering at the shelter ___ a long time.", options: ["since", "during", "at", "for"],         correctIndex: 3, explanation: "A long time is a duration → for a long time." },
      { id: "4-8",  prompt: "___ he been taking piano lessons since last year?",   options: ["Did", "Was", "Are", "Has"],                   correctIndex: 3, explanation: "He → Has: Has he been taking piano lessons since last year?" },
      { id: "4-9",  prompt: "They haven't been speaking to each other ___ the argument.", options: ["for", "during", "at", "since"],        correctIndex: 3, explanation: "The argument is a past event → since the argument." },
      { id: "4-10", prompt: "I've been feeling much better ___ I started exercising.", options: ["for", "during", "at", "since"],           correctIndex: 3, explanation: "I started exercising is a past clause → since I started exercising." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "for / since",
  2: "How long?",
  3: "Time expressions",
  4: "Mixed",
};

export default function ForSinceDurationClient() {
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
          <span className="text-slate-700 font-medium">for vs since (Duration)</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            PPC <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">for vs since</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">B1</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions to master <b>for</b> and <b>since</b> with the Present Perfect Continuous — including duration questions, time expressions, and How long sentences.
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

      {/* 2 gradient cards: for vs since */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">for — period / duration</span>
          <Formula parts={[
            { text: "I / She / They", color: "sky" },
            { text: "have/has been + -ing", color: "yellow" },
            { text: "for", color: "orange" },
            { text: "duration", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I've been waiting for 20 minutes." />
            <Ex en="She has been working here for three years." />
            <Ex en="They've been living together for ages." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-violet-50 to-white border border-violet-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-violet-500 px-3 py-1 text-xs font-black text-white">since — point in time</span>
          <Formula parts={[
            { text: "I / She / They", color: "sky" },
            { text: "have/has been + -ing", color: "yellow" },
            { text: "since", color: "violet" },
            { text: "point in time", color: "red" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I've been waiting since 9 o'clock." />
            <Ex en="She has been working here since 2018." />
            <Ex en="They've been living together since last year." />
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">for vs since — comparison</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-sky-700">for + duration</th>
                <th className="px-4 py-2.5 font-black text-violet-700">since + point in time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["for 20 minutes", "since 9 o'clock"],
                ["for three days", "since Monday"],
                ["for two weeks", "since last Tuesday"],
                ["for a year", "since 2023"],
                ["for ages / a long time", "since I was a child"],
                ["for the past few months", "since she started working here"],
              ].map(([f, s], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2.5 font-mono text-sky-700 text-sm">{f}</td>
                  <td className="px-4 py-2.5 font-mono text-violet-700 text-sm">{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Quick test:</span> Can you replace it with &quot;a length of time&quot;? → use <b>for</b>. Can you replace it with &quot;starting at that moment&quot;? → use <b>since</b>.
        </div>
      </div>

      {/* How long questions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">How long…? questions</div>
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <Formula parts={[
            { text: "How long", color: "orange" },
            { text: "have / has", color: "yellow" },
            { text: "subject", color: "sky" },
            { text: "been", color: "slate" },
            { text: "verb + -ing", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="How long have you been studying English?" />
            <Ex en="How long has she been working at that company?" />
            <Ex en="How long has it been raining?" />
          </div>
          <div className="text-sm text-slate-600 pt-1">
            <b className="text-slate-900">Short answers use for or since:</b>
          </div>
          <div className="space-y-1.5">
            <Ex en='"How long have you been waiting?" — "For an hour." / "Since noon."' />
            <Ex en='"How long has he been ill?" — "For a week." / "Since last Monday."' />
          </div>
        </div>
      </div>

      {/* Common time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Common time expressions</div>
        <div className="space-y-3">
          {[
            { label: "with for", color: "sky", examples: ["for 20 minutes", "for two hours", "for three days", "for a week", "for several months", "for a year", "for ages", "for a long time", "for the past few weeks"] },
            { label: "with since", color: "violet", examples: ["since 9 o'clock", "since Monday", "since last Tuesday", "since January", "since 2020", "since this morning", "since I was a child", "since she left", "since the meeting"] },
          ].map(({ label, color, examples }) => {
            const borderMap: Record<string, string> = { sky: "border-sky-200 bg-sky-50/50", violet: "border-violet-200 bg-violet-50/50" };
            const badgeMap: Record<string, string> = { sky: "bg-sky-100 text-sky-800 border-sky-200", violet: "bg-violet-100 text-violet-800 border-violet-200" };
            return (
              <div key={label} className={`rounded-xl border p-4 ${borderMap[color]}`}>
                <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-black mb-3 ${badgeMap[color]}`}>{label}</span>
                <div className="flex flex-wrap gap-2">
                  {examples.map((ex) => (
                    <span key={ex} className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${badgeMap[color]}`}>{ex}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
