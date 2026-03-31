"use client";

import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function SoSuchLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — so or such?",
      instructions: "Choose 'so' or 'such' to complete the sentence.",
      questions: [
        { id: "e1q1", prompt: "The film was ___ boring that I fell asleep.", options: ["so", "such"], correctIndex: 0, explanation: "so + adjective: so boring." },
        { id: "e1q2", prompt: "It was ___ a beautiful day that we went to the beach.", options: ["so", "such"], correctIndex: 1, explanation: "such + a + adjective + noun: such a beautiful day." },
        { id: "e1q3", prompt: "She speaks ___ quickly that I can't understand her.", options: ["so", "such"], correctIndex: 0, explanation: "so + adverb: so quickly." },
        { id: "e1q4", prompt: "He's ___ a kind person.", options: ["so", "such"], correctIndex: 1, explanation: "such + a + adjective + noun: such a kind person." },
        { id: "e1q5", prompt: "The food was ___ good that we ordered it again.", options: ["so", "such"], correctIndex: 0, explanation: "so + adjective: so good." },
        { id: "e1q6", prompt: "They were ___ rude people that everyone complained.", options: ["so", "such"], correctIndex: 1, explanation: "such + plural noun phrase (no 'a'): such rude people." },
        { id: "e1q7", prompt: "I was ___ tired that I went to bed at 8pm.", options: ["so", "such"], correctIndex: 0, explanation: "so + adjective: so tired." },
        { id: "e1q8", prompt: "It was ___ terrible weather that we stayed inside.", options: ["so", "such"], correctIndex: 1, explanation: "such + uncountable noun: such terrible weather." },
        { id: "e1q9", prompt: "He ran ___ fast that he broke the record.", options: ["so", "such"], correctIndex: 0, explanation: "so + adverb: so fast." },
        { id: "e1q10", prompt: "She has ___ long hair!", options: ["so", "such"], correctIndex: 1, explanation: "such + noun phrase: such long hair." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — so, such, or such a?",
      instructions: "Choose the correct option: 'so', 'such', or 'such a'.",
      questions: [
        { id: "e2q1", prompt: "It was ___ long film that we left early.", options: ["so", "such a", "such"], correctIndex: 1, explanation: "such a + singular countable noun: such a long film." },
        { id: "e2q2", prompt: "The music was ___ loud that the neighbours complained.", options: ["such", "such a", "so"], correctIndex: 2, explanation: "so + adjective (no noun follows): so loud." },
        { id: "e2q3", prompt: "They are ___ lovely children!", options: ["so", "such a", "such"], correctIndex: 2, explanation: "such + plural noun: such lovely children." },
        { id: "e2q4", prompt: "I've never met ___ interesting person.", options: ["so", "such", "such a"], correctIndex: 2, explanation: "such a + singular countable noun: such an interesting person." },
        { id: "e2q5", prompt: "She was ___ angry that she slammed the door.", options: ["such a", "such", "so"], correctIndex: 2, explanation: "so + adjective: so angry." },
        { id: "e2q6", prompt: "We had ___ fun at the party!", options: ["so", "such a", "such"], correctIndex: 2, explanation: "such + uncountable noun (fun): such fun." },
        { id: "e2q7", prompt: "It's ___ hot today!", options: ["such", "such a", "so"], correctIndex: 2, explanation: "so + adjective (no noun): so hot." },
        { id: "e2q8", prompt: "He told ___ funny joke that everyone laughed.", options: ["so", "such", "such a"], correctIndex: 2, explanation: "such a + singular noun: such a funny joke." },
        { id: "e2q9", prompt: "There was ___ noise that I couldn't sleep.", options: ["so", "such a", "such"], correctIndex: 1, explanation: "such a + singular countable noun: such a noise." },
        { id: "e2q10", prompt: "She sang ___ beautifully that the audience cried.", options: ["such", "such a", "so"], correctIndex: 2, explanation: "so + adverb: so beautifully." },
      ],
    },
    3: {
      type: "input",
      title: "Exercise 3 (Harder) — Write so or such (a)",
      instructions: "Write 'so', 'such', or 'such a' to complete the sentence.",
      questions: [
        { id: "e3q1", prompt: "The exam was ___ difficult that half the class failed.", correct: "so", explanation: "so + adjective: so difficult." },
        { id: "e3q2", prompt: "It was ___ cold night that the pipes froze.", correct: "such a", explanation: "such a + singular noun: such a cold night." },
        { id: "e3q3", prompt: "She's ___ good at languages.", correct: "so", explanation: "so + adjective: so good." },
        { id: "e3q4", prompt: "They have ___ nice house!", correct: "such a", explanation: "such a + singular noun: such a nice house." },
        { id: "e3q5", prompt: "He worked ___ hard that he got promoted.", correct: "so", explanation: "so + adverb: so hard." },
        { id: "e3q6", prompt: "It was ___ good news that she called everyone.", correct: "such", explanation: "such + uncountable noun: such good news." },
        { id: "e3q7", prompt: "The hotel was ___ expensive that we changed plans.", correct: "so", explanation: "so + adjective: so expensive." },
        { id: "e3q8", prompt: "They are ___ talented musicians.", correct: "such", explanation: "such + plural noun: such talented musicians." },
        { id: "e3q9", prompt: "I felt ___ embarrassed that I left the room.", correct: "so", explanation: "so + adjective: so embarrassed." },
        { id: "e3q10", prompt: "It was ___ exciting match that nobody left early.", correct: "such an", explanation: "such an + singular noun starting with vowel sound: such an exciting match." },
      ],
    },
    4: {
      type: "mcq",
      title: "Exercise 4 (Hardest) — so…that / such…that",
      instructions: "Choose the correct sentence. These questions test the full so/such…that structure.",
      questions: [
        { id: "e4q1", prompt: "Which is correct?", options: ["It was such cold that we wore coats.", "It was so cold that we wore coats."], correctIndex: 1, explanation: "so + adjective (no noun): so cold that…" },
        { id: "e4q2", prompt: "Which is correct?", options: ["She's such a talented singer that she got a record deal.", "She's so talented singer that she got a record deal."], correctIndex: 0, explanation: "such a + adj + noun: such a talented singer." },
        { id: "e4q3", prompt: "Which is correct?", options: ["There was such traffic that we were two hours late.", "There was so traffic that we were two hours late."], correctIndex: 0, explanation: "such + uncountable noun: such traffic." },
        { id: "e4q4", prompt: "Which is correct?", options: ["He spoke so quietly that nobody heard him.", "He spoke such quietly that nobody heard him."], correctIndex: 0, explanation: "so + adverb: so quietly." },
        { id: "e4q5", prompt: "Which is correct?", options: ["They were such good friends that they told each other everything.", "They were so good friends that they told each other everything."], correctIndex: 0, explanation: "such + plural noun: such good friends." },
        { id: "e4q6", prompt: "Which is correct?", options: ["It was so an interesting book that I read it twice.", "It was such an interesting book that I read it twice."], correctIndex: 1, explanation: "such an + singular noun: such an interesting book." },
        { id: "e4q7", prompt: "Which is correct?", options: ["She was so nervous that her hands were shaking.", "She was such nervous that her hands were shaking."], correctIndex: 0, explanation: "so + adjective: so nervous." },
        { id: "e4q8", prompt: "Which is correct?", options: ["It was such a long journey that we were exhausted.", "It was so long journey that we were exhausted."], correctIndex: 0, explanation: "such a + adj + singular noun: such a long journey." },
        { id: "e4q9", prompt: "Which is correct?", options: ["We had such a great time that we didn't want to leave.", "We had so a great time that we didn't want to leave."], correctIndex: 0, explanation: "such a + noun: such a great time." },
        { id: "e4q10", prompt: "Which is correct?", options: ["He runs so fast that nobody can catch him.", "He runs such fast that nobody can catch him."], correctIndex: 0, explanation: "so + adverb: so fast." },
      ],
    },
  }), []);

  const current = sets[exNo];

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
        <a className="hover:text-slate-900 transition" href="/grammar/b1">Grammar B1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">So &amp; Such</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          So &amp;{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Such</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        <b>So</b> intensifies adjectives and adverbs: <i>so <b>tired</b>, so <b>quickly</b>.</i> <b>Such</b> intensifies noun phrases: <i>such a <b>good film</b>, such <b>beautiful weather</b>.</i> Both are often followed by a <b>that</b> clause to show result.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
            <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
            <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
          </div>
        </aside>

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
                  {current.type === "mcq" ? (
                    current.questions.map((q, idx) => {
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
                    })
                  ) : (
                    current.questions.map((q, idx) => {
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
                                <input value={val} disabled={checked} onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))} placeholder="Type here…" className="w-full max-w-sm rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]" />
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
                    })
                  )}
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
                      <div className="mt-2 text-xs text-slate-500">
                        {score.percent >= 80 ? "Excellent! You can move to the next exercise." : score.percent >= 50 ? "Good effort! Try once more to improve your score." : "Keep practising — review the Explanation tab and try again."}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : <Explanation />}
          </div>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
            <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
            <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
          </div>
        </aside>
      </div>

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B1 topics</a>
        <a href="/grammar/b1/as-as-comparison" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: As…as Comparisons →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>So &amp; Such (B1)</h2>
      <div className="not-prose mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <div className="text-xs font-bold uppercase text-sky-600 mb-2">SO + adjective / adverb</div>
          <div className="grid gap-2 text-sm text-slate-700 italic">
            <div>It was <b>so cold</b>.</div>
            <div>She speaks <b>so quickly</b>.</div>
            <div>He is <b>so talented</b>.</div>
          </div>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
          <div className="text-xs font-bold uppercase text-violet-600 mb-2">SUCH (a) + noun phrase</div>
          <div className="grid gap-2 text-sm text-slate-700 italic">
            <div>It was <b>such a cold day</b>.</div>
            <div>They are <b>such talented people</b>.</div>
            <div>It was <b>such beautiful weather</b>.</div>
          </div>
        </div>
      </div>

      <h3>Patterns</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5">
        <div className="grid gap-2">
          {[
            ["Pattern", "Example"],
            ["so + adj", "so tired, so beautiful, so far"],
            ["so + adv", "so quickly, so well, so hard"],
            ["such a/an + adj + singular noun", "such a good idea, such an amazing view"],
            ["such + adj + plural noun", "such lovely children, such talented people"],
            ["such + adj + uncountable noun", "such terrible weather, such good food"],
          ].map((row, i) => (
            <div key={i} className={`grid grid-cols-2 gap-4 text-sm ${i === 0 ? "font-bold text-slate-500 text-xs uppercase pb-2 border-b" : "text-slate-700"}`}>
              <span className={i === 0 ? "" : "font-semibold text-slate-900"}>{row[0]}</span>
              <span className="italic">{row[1]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 Quick rule:</span> If the next word is a <b>noun</b> (or adj + noun) → use <b>such</b>. If the next word is an <b>adjective alone</b> or an <b>adverb</b> → use <b>so</b>.
          <div className="mt-2 grid gap-1 italic text-slate-700 text-xs">
            <div>It was <b>so</b> cold. (adj alone → so)</div>
            <div>It was <b>such a</b> cold day. (adj + noun → such a)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
