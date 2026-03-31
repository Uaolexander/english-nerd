"use client";

import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function UsedToLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Choose the correct form",
      instructions: "Choose the correct form of 'used to' to complete each sentence.",
      questions: [
        { id: "e1q1", prompt: "She ___ live in Paris before she moved to London.", options: ["used to", "use to", "was used to"], correctIndex: 0, explanation: "Positive form: used to + infinitive." },
        { id: "e1q2", prompt: "They ___ play football every Saturday as kids.", options: ["use to", "used to", "are used to"], correctIndex: 1, explanation: "Past habit: used to play." },
        { id: "e1q3", prompt: "He ___ smoke, but he quit two years ago.", options: ["used to", "use to", "is used to"], correctIndex: 0, explanation: "Past state no longer true: used to smoke." },
        { id: "e1q4", prompt: "___ you ___ walk to school when you were young?", options: ["Did / use to", "Did / used to", "Were / used to"], correctIndex: 0, explanation: "Question form: Did + subject + use to (no -d)." },
        { id: "e1q5", prompt: "I ___ like vegetables, but now I love them.", options: ["didn't use to", "didn't used to", "wasn't used to"], correctIndex: 0, explanation: "Negative: didn't use to (no -d after did)." },
        { id: "e1q6", prompt: "My grandfather ___ tell us stories every night.", options: ["use to", "was used to", "used to"], correctIndex: 2, explanation: "Past habit: used to tell." },
        { id: "e1q7", prompt: "We ___ have a dog, but he died last year.", options: ["used to", "are used to", "use to"], correctIndex: 0, explanation: "Past state: used to have." },
        { id: "e1q8", prompt: "She ___ be very shy, but now she's very confident.", options: ["is used to", "used to", "uses to"], correctIndex: 1, explanation: "Past state no longer true: used to be." },
        { id: "e1q9", prompt: "___ your parents ___ work abroad?", options: ["Did / used to", "Did / use to", "Were / used to"], correctIndex: 1, explanation: "Question: Did + subject + use to (no -d in infinitive)." },
        { id: "e1q10", prompt: "He ___ be the best student in class.", options: ["use to", "used to", "is used to"], correctIndex: 1, explanation: "Past state: used to be." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the correct form",
      instructions: "Write the correct form of 'used to' (positive, negative, or question) using the verb in brackets.",
      questions: [
        { id: "e2q1", prompt: "My family (live) ___ in a small village.", correct: "used to live", explanation: "Positive: used to live." },
        { id: "e2q2", prompt: "I (not / eat) ___ fish, but I love it now.", correct: "didn't use to eat", explanation: "Negative: didn't use to eat." },
        { id: "e2q3", prompt: "(your parents / work) ___ abroad? [question]", correct: "did your parents use to work", explanation: "Question: Did your parents use to work?" },
        { id: "e2q4", prompt: "She (be) ___ a teacher before she became a doctor.", correct: "used to be", explanation: "Past state: used to be." },
        { id: "e2q5", prompt: "We (not / have) ___ a car when I was a child.", correct: "didn't use to have", explanation: "Negative: didn't use to have." },
        { id: "e2q6", prompt: "He (spend) ___ his summers at the beach.", correct: "used to spend", explanation: "Past habit: used to spend." },
        { id: "e2q7", prompt: "(you / watch) ___ cartoons as a child? [question]", correct: "did you use to watch", explanation: "Question: Did you use to watch?" },
        { id: "e2q8", prompt: "They (not / argue) ___ so much when they were younger.", correct: "didn't use to argue", explanation: "Negative: didn't use to argue." },
        { id: "e2q9", prompt: "She (have) ___ long hair when she was a teenager.", correct: "used to have", explanation: "Past state: used to have." },
        { id: "e2q10", prompt: "I (not / know) ___ how to cook, but now I'm quite good.", correct: "didn't use to know", explanation: "Negative past state: didn't use to know." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Used to or Past Simple?",
      instructions: "Choose the best option: 'used to' or Past Simple. Think about whether it's a habit/state or a single event.",
      questions: [
        { id: "e3q1", prompt: "We ___ to Rome in 2019 and stayed for a week.", options: ["used to go", "went"], correctIndex: 1, explanation: "Single completed event in the past → Past Simple: went." },
        { id: "e3q2", prompt: "She ___ have long hair when she was a teenager.", options: ["used to", "had"], correctIndex: 0, explanation: "Past state, no longer true → used to have." },
        { id: "e3q3", prompt: "I ___ my keys yesterday and couldn't get in.", options: ["used to lose", "lost"], correctIndex: 1, explanation: "Single event yesterday → Past Simple: lost." },
        { id: "e3q4", prompt: "They ___ spend every summer at their grandparents' farm.", options: ["used to", "spent"], correctIndex: 0, explanation: "Repeated past habit → used to spend." },
        { id: "e3q5", prompt: "He ___ the window and let some fresh air in.", options: ["used to open", "opened"], correctIndex: 1, explanation: "Single completed action → Past Simple: opened." },
        { id: "e3q6", prompt: "We ___ not have smartphones — life was very different.", options: ["used to", "did"], correctIndex: 0, explanation: "Past state no longer true → used to (not have)." },
        { id: "e3q7", prompt: "She ___ the exam last Monday.", options: ["used to pass", "passed"], correctIndex: 1, explanation: "Single event last Monday → Past Simple: passed." },
        { id: "e3q8", prompt: "I ___ love reading comics when I was little.", options: ["used to", "loved"], correctIndex: 0, explanation: "Past habit/state, implies contrast with now → used to love." },
        { id: "e3q9", prompt: "He ___ the company in 2010 and ran it for 15 years.", options: ["used to found", "founded"], correctIndex: 1, explanation: "Specific past event → Past Simple: founded." },
        { id: "e3q10", prompt: "They ___ have dinner together every Sunday.", options: ["used to", "had"], correctIndex: 0, explanation: "Repeated past habit → used to have." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Used to or Past Simple?",
      instructions: "Write 'used to' or Past Simple of the verb in brackets. The context hint tells you which to use.",
      questions: [
        { id: "e4q1", prompt: "I (visit) ___ my aunt every summer as a child. [habit]", correct: "used to visit", explanation: "Repeated habit: used to visit." },
        { id: "e4q2", prompt: "She (call) ___ me yesterday to say hello. [single event]", correct: "called", explanation: "Single past event: called." },
        { id: "e4q3", prompt: "He (not / like) ___ coffee, but now he drinks three cups a day. [past state]", correct: "didn't use to like", explanation: "Negative past state: didn't use to like." },
        { id: "e4q4", prompt: "They (move) ___ to Canada in 2015. [single event]", correct: "moved", explanation: "Single past event: moved." },
        { id: "e4q5", prompt: "We (play) ___ chess every evening after dinner. [habit]", correct: "used to play", explanation: "Repeated habit: used to play." },
        { id: "e4q6", prompt: "She (win) ___ the competition last year. [single event]", correct: "won", explanation: "Single past event: won." },
        { id: "e4q7", prompt: "I (not / know) ___ how to drive until I was 25. [past state]", correct: "didn't use to know", explanation: "Negative past state: didn't use to know." },
        { id: "e4q8", prompt: "He (buy) ___ a new car in March. [single event]", correct: "bought", explanation: "Single past event: bought." },
        { id: "e4q9", prompt: "My parents (argue) ___ a lot, but now they get on well. [habit, contrast with now]", correct: "used to argue", explanation: "Past habit with contrast to now: used to argue." },
        { id: "e4q10", prompt: "We (see) ___ a great film last Friday. [single event]", correct: "saw", explanation: "Single past event: saw." },
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
        <span className="text-slate-700 font-medium">Used to</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Used{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">to</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        We use <b>used to + infinitive</b> to talk about <b>past habits</b> and <b>past states</b> that are no longer true: <i>She <b>used to</b> live in Paris.</i> The negative is <b>didn&apos;t use to</b> and the question is <b>Did … use to</b>.
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
        <a href="/grammar/b1/would-past-habits" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Would — Past Habits →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Used to (B1)</h2>
      <p>We use <b>used to + infinitive</b> to talk about <b>past habits</b> (things we did regularly) and <b>past states</b> (how things were) that are no longer true now.</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Forms</div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { label: "Positive", rows: ["I / She used to live here.", "They used to play every day."] },
            { label: "Negative", rows: ["I didn't use to like it.", "She didn't use to smoke."] },
            { label: "Question", rows: ["Did you use to live here?", "Did they use to play?"] },
            { label: "Short answers", rows: ["Yes, I did. / No, I didn't.", "Yes, she did. / No, she didn't."] },
          ].map(({ label, rows }) => (
            <div key={label} className="rounded-xl border border-black/10 bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-500 mb-2">{label}</div>
              {rows.map((r) => <div key={r} className="text-sm text-slate-800 italic">{r}</div>)}
            </div>
          ))}
        </div>
      </div>

      <h3>When to use 'used to'</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2">
        {[
          { use: "Past habits (no longer true)", color: "border-violet-200 bg-violet-50 text-violet-700", ex: "I used to play tennis every week. (I don't now)" },
          { use: "Past states (no longer true)", color: "border-sky-200 bg-sky-50 text-sky-700", ex: "She used to be shy. (She isn't now)" },
          { use: "Contrast with the present", color: "border-emerald-200 bg-emerald-50 text-emerald-700", ex: "I didn't use to like coffee, but now I love it." },
          { use: "Questions about the past", color: "border-amber-200 bg-amber-50 text-amber-700", ex: "Did you use to live near here?" },
        ].map(({ use, color, ex }) => (
          <div key={use} className={`rounded-xl border p-4 ${color}`}>
            <div className="text-sm font-black mb-1">{use}</div>
            <div className="text-sm text-slate-600 italic">{ex}</div>
          </div>
        ))}
      </div>

      <h3>Used to vs Past Simple</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5 space-y-3 text-sm text-slate-700">
        <div>
          <b>Used to</b> = repeated habit or state, implies contrast with now:<br />
          <span className="italic">We <b>used to</b> visit them every summer. (we don&apos;t anymore)</span>
        </div>
        <div>
          <b>Past Simple</b> = single completed event, or sequence:<br />
          <span className="italic">We <b>visited</b> them in 2019. (once, specific trip)</span>
        </div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">⚠️ Common mistake:</span> In questions and negatives, drop the -d from &quot;used&quot;: <b>Did she use to…?</b> / <b>She didn&apos;t use to…</b> — NOT &quot;did she <i>used</i> to&quot;.
        </div>
      </div>
    </div>
  );
}
