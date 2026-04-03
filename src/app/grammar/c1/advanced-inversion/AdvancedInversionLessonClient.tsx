"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function AdvancedInversionLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Identify the correct inversion",
      instructions: "After certain negative/restrictive adverbials, the auxiliary comes before the subject. Choose the correctly inverted sentence.",
      questions: [
        { id: "e1q1", prompt: "Never ___ such a brave decision.", options: ["have I seen", "I have seen", "I saw"], correctIndex: 0, explanation: "Never + have + subject + past participle: Never have I seen." },
        { id: "e1q2", prompt: "Rarely ___ in such difficult circumstances.", options: ["we have worked", "have we worked", "we worked"], correctIndex: 1, explanation: "Rarely + have + subject + pp: Rarely have we worked." },
        { id: "e1q3", prompt: "Not only ___ late, but he also forgot his presentation.", options: ["was he", "he was", "he is"], correctIndex: 0, explanation: "Not only + auxiliary-subject inversion in the first clause: Not only was he late." },
        { id: "e1q4", prompt: "No sooner ___ the door than the phone rang.", options: ["I had opened", "had I opened", "I opened"], correctIndex: 1, explanation: "No sooner + had + subject + pp: No sooner had I opened (+ than)." },
        { id: "e1q5", prompt: "Hardly ___ when the storm broke.", options: ["we had left", "had we left", "we left"], correctIndex: 1, explanation: "Hardly + had + subject + pp: Hardly had we left (+ when)." },
        { id: "e1q6", prompt: "Under no circumstances ___ to leave without permission.", options: ["students are allowed", "are students allowed", "students allowed"], correctIndex: 1, explanation: "Under no circumstances + are + subject: are students allowed." },
        { id: "e1q7", prompt: "Only after the meeting ___ about the redundancies.", options: ["we found out", "did we find out", "we did find out"], correctIndex: 1, explanation: "Only after + fronted adverbial + did + subject + bare inf: did we find out." },
        { id: "e1q8", prompt: "Little ___ that the company was about to collapse.", options: ["they knew", "did they know", "they did know"], correctIndex: 1, explanation: "Little + did + subject + know: Little did they know." },
        { id: "e1q9", prompt: "At no point ___ responsibility for the error.", options: ["the manager accepted", "did the manager accept", "the manager did accept"], correctIndex: 1, explanation: "At no point + did + subject + bare infinitive." },
        { id: "e1q10", prompt: "Scarcely ___ when the guests started arriving.", options: ["we had prepared", "had we prepared", "we prepared"], correctIndex: 1, explanation: "Scarcely + had + subject + pp + when (similar to Hardly… when)." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — So/Such inversion & comparative inversion",
      instructions: "So + adjective/adverb and Such + noun phrase can be fronted, triggering inversion. Comparative inversion uses 'as'. Choose the correct form.",
      questions: [
        { id: "e2q1", prompt: "So ___ the noise that no one could sleep.", options: ["was loud", "loud was", "was"], correctIndex: 1, explanation: "So + adjective + was + subject: So loud was the noise that…" },
        { id: "e2q2", prompt: "Such ___ the pressure that several staff resigned.", options: ["the pressure was", "was the pressure", "pressure was"], correctIndex: 1, explanation: "Such + was + the + noun: Such was the pressure that…" },
        { id: "e2q3", prompt: "So ___ she work that she barely slept.", options: ["did hard", "hard did", "hard", ], correctIndex: 1, explanation: "So + adverb + did + subject + infinitive: So hard did she work." },
        { id: "e2q4", prompt: "Such ___ the scale of the disaster that aid agencies were overwhelmed.", options: ["was", "is", "had been"], correctIndex: 0, explanation: "Such was the scale… (past context = 'was')." },
        { id: "e2q5", prompt: "So ___ the temperature drop that pipes froze overnight.", options: ["sudden was", "was sudden", "suddenly was"], correctIndex: 0, explanation: "So + adjective + was + subject: So sudden was the temperature drop." },
        { id: "e2q6", prompt: "As ___ his predecessor, so too was he committed to reform.", options: ["was", "did", "has been"], correctIndex: 0, explanation: "Comparative inversion: As was his predecessor, so too was he (parallel structure with 'as … so too')." },
        { id: "e2q7", prompt: "Such ___ her talent that she was offered a scholarship immediately.", options: ["was", "were", "is"], correctIndex: 0, explanation: "Such was + singular noun (her talent): Such was her talent that…" },
        { id: "e2q8", prompt: "So ___ the response that the organisers had to add extra seating.", options: ["overwhelming was", "was overwhelming", "overwhelmingly was"], correctIndex: 0, explanation: "So + adjective + was + subject: So overwhelming was the response." },
        { id: "e2q9", prompt: "As ___ the previous generation, so too are today's youth facing uncertain futures.", options: ["did", "were", "had"], correctIndex: 0, explanation: "As did + subject (previous context = simple past action): As did the previous generation, so too are…" },
        { id: "e2q10", prompt: "Such ___ their enthusiasm that the project was completed a week ahead of schedule.", options: ["was", "were", "had been"], correctIndex: 0, explanation: "Such was + singular noun (their enthusiasm)." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Mixed inversion in context",
      instructions: "Choose the correct form to complete each sentence. Multiple inversion types are tested.",
      questions: [
        { id: "e3q1", prompt: "Not until the results were published ___ the true extent of the problem.", options: ["we realised", "did we realise", "we did realise"], correctIndex: 1, explanation: "Not until + clause + did + subject + bare infinitive: Not until… did we realise." },
        { id: "e3q2", prompt: "No sooner ___ the announcement than protests erupted across the country.", options: ["had been made", "was made", "had the announcement been made"], correctIndex: 2, explanation: "No sooner had + subject + been + pp: No sooner had the announcement been made than…" },
        { id: "e3q3", prompt: "Only by working together ___ overcome these challenges.", options: ["we can", "can we", "we could"], correctIndex: 1, explanation: "Only by + -ing + can + subject: Only by working together can we." },
        { id: "e3q4", prompt: "Seldom ___ a policy receive such unanimous cross-party support.", options: ["a", "does", "has"], correctIndex: 1, explanation: "Seldom + does + subject + bare infinitive: Seldom does a policy receive…" },
        { id: "e3q5", prompt: "Not only ___ the test, but she also broke the world record.", options: ["she passed", "did she pass", "she did pass"], correctIndex: 1, explanation: "Not only + did + subject + bare inf: Not only did she pass." },
        { id: "e3q6", prompt: "In no way ___ responsible for the outcome.", options: ["I am", "am I", "do I am"], correctIndex: 1, explanation: "In no way + am + I: In no way am I responsible." },
        { id: "e3q7", prompt: "Barely ___ into the building when the alarm went off.", options: ["we had stepped", "had we stepped", "we stepped"], correctIndex: 1, explanation: "Barely + had + subject + pp + when: Barely had we stepped." },
        { id: "e3q8", prompt: "Not for one moment ___ that the plan would fail.", options: ["I imagined", "did I imagine", "I did imagine"], correctIndex: 1, explanation: "Not for one moment + did + subject + bare inf." },
        { id: "e3q9", prompt: "So ___ the impact of the speech that many in the audience were moved to tears.", options: ["profound was", "was profound", "profoundly was"], correctIndex: 0, explanation: "So + adjective + was + subject: So profound was the impact." },
        { id: "e3q10", prompt: "At no time during the negotiations ___ the original terms of the agreement.", options: ["they discussed", "did they discuss", "they did discuss"], correctIndex: 1, explanation: "At no time + did + subject + bare infinitive." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Rewrite using inversion",
      instructions: "Rewrite each sentence beginning with the word(s) given. Write the full rewritten sentence (lowercase).",
      questions: [
        { id: "e4q1", prompt: "I have never seen such determination before. (Never before…)", correct: "never before have i seen such determination", explanation: "Never before + have + subject + pp: Never before have I seen." },
        { id: "e4q2", prompt: "She had barely sat down when her phone rang. (Barely…)", correct: "barely had she sat down when her phone rang", explanation: "Barely + had + subject + pp + when." },
        { id: "e4q3", prompt: "He not only apologised but also offered to resign. (Not only…)", correct: "not only did he apologise but he also offered to resign", explanation: "Not only + did + subject + bare inf + but also + subject + verb." },
        { id: "e4q4", prompt: "The silence was so complete that no one dared to breathe. (So…)", correct: "so complete was the silence that no one dared to breathe", explanation: "So + adjective + was + subject + that." },
        { id: "e4q5", prompt: "We had no sooner announced the results than the complaints started. (No sooner…)", correct: "no sooner had we announced the results than the complaints started", explanation: "No sooner + had + subject + pp + than." },
        { id: "e4q6", prompt: "Students are not allowed under any circumstances to use their phones during exams. (Under no circumstances…)", correct: "under no circumstances are students allowed to use their phones during exams", explanation: "Under no circumstances + are + subject + allowed to." },
        { id: "e4q7", prompt: "They little knew what awaited them on the other side. (Little…)", correct: "little did they know what awaited them on the other side", explanation: "Little + did + subject + know." },
        { id: "e4q8", prompt: "The pressure was such that the entire team threatened to quit. (Such…)", correct: "such was the pressure that the entire team threatened to quit", explanation: "Such + was + the + noun + that." },
        { id: "e4q9", prompt: "He worked so hard that he collapsed from exhaustion. (So hard…)", correct: "so hard did he work that he collapsed from exhaustion", explanation: "So + adverb + did + subject + bare inf + that." },
        { id: "e4q10", prompt: "We only understood the full impact of the decision after many years. (Only after many years…)", correct: "only after many years did we understand the full impact of the decision", explanation: "Only after + time phrase + did + subject + bare inf." },
      ],
    },
  }), []);

  const current = sets[exNo];

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
    const total = current.questions.length;
    if (current.type === "mcq") {
      for (const q of current.questions) { if (mcqAnswers[q.id] === q.correctIndex) correct++; }
    } else {
      for (const q of current.questions) {
        const a = normalize(inputAnswers[q.id] ?? "");
        if (a && a === normalize(q.correct)) correct++;
      }
    }
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
  }, [checked, current, mcqAnswers, inputAnswers]);

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); }
  function switchExercise(n: 1 | 2 | 3 | 4) { setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/c1">Grammar C1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Advanced Inversion</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Advanced{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Inversion</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-200">C1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Subject-auxiliary inversion is triggered by fronting certain negative or restrictive adverbials (<i>Never, Rarely, Not only, No sooner, Hardly, Under no circumstances</i>), and also by <b>so/such</b> fronting for degree (<i>So loud was the noise…</i>) and <b>comparative</b> structures (<i>As did his predecessor…</i>). These structures are hallmarks of formal writing and rhetoric.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <AdUnit variant="sidebar-dark" />

        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
            <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
            <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
              Exercises:
              {([1, 2, 3, 4] as const).map((n) => (
                <button key={n} onClick={() => switchExercise(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {tab === "exercises" ? (
              <>
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-slate-900">{current.title}</h2>
                  <p className="text-slate-700">{current.instructions}</p>
                  <div className="mt-2 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                    <span>Exercises:</span>
                    {([1, 2, 3, 4] as const).map((n) => (
                      <button key={n} onClick={() => switchExercise(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
                    ))}
                  </div>
                </div>
                <div className="mt-8 space-y-5">
                  {current.type === "mcq" ? current.questions.map((q, idx) => {
                    const chosen = mcqAnswers[q.id] ?? null;
                    const isCorrect = checked && chosen === q.correctIndex;
                    const isWrong = checked && chosen !== null && chosen !== q.correctIndex;
                    const noAnswer = checked && chosen === null;
                    return (
                      <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                          <div className="flex-1">
                            <div className="font-bold text-slate-900">{q.prompt}</div>
                            <div className="mt-3 grid gap-2 sm:grid-cols-3">
                              {q.options.map((opt, oi) => (
                                <label key={oi} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition ${chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"} ${checked ? "cursor-default" : ""}`}>
                                  <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => setMcqAnswers((p) => ({ ...p, [q.id]: oi }))} />
                                  <span className="text-slate-900">{opt}</span>
                                </label>
                              ))}
                            </div>
                            {checked && (
                              <div className="mt-3 text-sm">
                                {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                <div className="mt-2 text-slate-700"><b className="text-slate-900">Correct:</b> {q.options[q.correctIndex]} — {q.explanation}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }) : current.questions.map((q, idx) => {
                    const val = inputAnswers[q.id] ?? "";
                    const answered = normalize(val) !== "";
                    const isCorrect = checked && answered && normalize(val) === normalize(q.correct);
                    const wrong = checked && answered && !isCorrect;
                    const noAnswer = checked && !answered;
                    return (
                      <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                          <div className="flex-1">
                            <div className="font-bold text-slate-900">{q.prompt}</div>
                            <div className="mt-3">
                              <input value={val} disabled={checked} onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))} placeholder="Type here…" className="w-full max-w-lg rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]" />
                            </div>
                            {checked && (
                              <div className="mt-3 text-sm">
                                {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                {wrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                <div className="mt-2 text-slate-700"><b className="text-slate-900">Correct:</b> {q.correct} — {q.explanation}</div>
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
                      <button onClick={resetExercise} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">Try Again</button>
                    )}
                    {checked && exNo < 4 && (
                      <button onClick={() => switchExercise((exNo + 1) as 1 | 2 | 3 | 4)} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">Next Exercise →</button>
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
                      <div className="mt-2 text-xs text-slate-500">{score.percent >= 80 ? "Excellent! You can move to the next exercise." : score.percent >= 50 ? "Good effort! Try once more to improve your score." : "Keep practising — review the Explanation tab and try again."}</div>
                    </div>
                  )}
                </div>
              </>
            ) : <Explanation />}
          </div>
        </section>

        <AdUnit variant="sidebar-dark" />
      </div>

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/c1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All C1 topics</a>
        <a href="/grammar/c1/extraposition" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Extraposition →</a>
      </div>
    </div>
  );
}

function Explanation() {
  const rows = [
    { adv: "Never / Rarely / Seldom / Scarcely / Barely", structure: "Never + have/had/did + S + V", ex: "Never have I felt so proud." },
    { adv: "Not only… (but also)", structure: "Not only + aux + S + V", ex: "Not only did she win, but she also broke the record." },
    { adv: "No sooner… than", structure: "No sooner + had + S + pp + than", ex: "No sooner had I sat down than the phone rang." },
    { adv: "Hardly / Scarcely… when", structure: "Hardly + had + S + pp + when", ex: "Hardly had we arrived when it started raining." },
    { adv: "Under no circumstances / At no point / In no way", structure: "+ aux + S + V", ex: "Under no circumstances are students allowed to cheat." },
    { adv: "Only after / Only when / Only then / Only by", structure: "Only… + did/can/could + S + V", ex: "Only after the meeting did we learn the truth." },
    { adv: "Not until", structure: "Not until + clause/time + did + S + V", ex: "Not until she left did he realise how much he cared." },
    { adv: "Little", structure: "Little + did + S + know/think/realise", ex: "Little did they know what lay ahead." },
    { adv: "So + adj / adv (degree)", structure: "So + adj/adv + was/did + S", ex: "So loud was the music that neighbours complained." },
    { adv: "Such + NP (degree)", structure: "Such + was + the + noun", ex: "Such was her determination that nothing could stop her." },
  ];
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Advanced Inversion (C1)</h2>
      <p className="not-prose mt-2 text-slate-700 text-sm">Subject-auxiliary inversion places the auxiliary before the subject. It is required after negative/restrictive adverbials, and after fronted so/such for degree.</p>
      <div className="not-prose mt-4 overflow-x-auto rounded-2xl border border-black/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 bg-black/5">
              <th className="px-4 py-3 text-left font-black text-slate-700">Trigger</th>
              <th className="px-4 py-3 text-left font-black text-slate-700">Structure</th>
              <th className="px-4 py-3 text-left font-black text-slate-700">Example</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={`border-b border-black/5 ${i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}`}>
                <td className="px-4 py-3 font-semibold text-cyan-700">{r.adv}</td>
                <td className="px-4 py-3 text-slate-600 font-mono text-xs">{r.structure}</td>
                <td className="px-4 py-3 italic text-slate-700">{r.ex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-cyan-50 p-5">
        <div className="text-sm font-black text-slate-800 mb-2">Common mistakes</div>
        <div className="text-sm text-slate-700 space-y-1">
          <div>❌ <span className="line-through">Never I have seen</span> → ✅ <b>Never have I seen</b></div>
          <div>❌ <span className="line-through">No sooner I had left than</span> → ✅ <b>No sooner had I left than</b></div>
          <div>❌ <span className="line-through">So loud the music was</span> → ✅ <b>So loud was the music</b></div>
          <div>❌ <span className="line-through">Not only she passed</span> → ✅ <b>Not only did she pass</b></div>
        </div>
      </div>
    </div>
  );
}
