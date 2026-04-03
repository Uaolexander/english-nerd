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

export default function WishWouldLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — wish + would or wish + Past Perfect?",
      instructions: "Choose the correct wish structure. wish + would = irritating habit or desired change. wish + Past Perfect = regret about the past.",
      questions: [
        { id: "e1q1", prompt: "I wish she ___ stop interrupting me all the time.", options: ["would", "had", "could"], correctIndex: 0, explanation: "wish + would = you want someone to stop an annoying habit." },
        { id: "e1q2", prompt: "I wish I ___ that argument with my boss. It cost me the promotion.", options: ["didn't have", "hadn't had", "wouldn't have"], correctIndex: 1, explanation: "wish + Past Perfect = regret about a past event." },
        { id: "e1q3", prompt: "He wishes she ___ call him back. He's been waiting for hours.", options: ["would", "had", "has"], correctIndex: 0, explanation: "wish + would = desire for someone to do something (still possible)." },
        { id: "e1q4", prompt: "I wish I ___ to the doctor sooner. Now it's too late.", options: ["went", "had gone", "would go"], correctIndex: 1, explanation: "wish + Past Perfect = regret about a past decision." },
        { id: "e1q5", prompt: "She wishes her neighbours ___ play loud music at night.", options: ["don't", "wouldn't", "hadn't"], correctIndex: 1, explanation: "wish + wouldn't = a habit you want someone to stop." },
        { id: "e1q6", prompt: "I wish I ___ harder at school. My life would be different now.", options: ["studied", "had studied", "would study"], correctIndex: 1, explanation: "wish + Past Perfect = regret about a past habit." },
        { id: "e1q7", prompt: "He wishes she ___ talk about her ex all the time.", options: ["wouldn't", "hadn't", "didn't"], correctIndex: 0, explanation: "wish + wouldn't = ongoing annoying habit." },
        { id: "e1q8", prompt: "I wish I ___ that investment. I lost everything.", options: ["didn't make", "hadn't made", "wouldn't make"], correctIndex: 1, explanation: "wish + Past Perfect = regret about a past action." },
        { id: "e1q9", prompt: "She wishes he ___ be more considerate of her feelings.", options: ["would", "had", "could"], correctIndex: 0, explanation: "wish + would = desire for change in someone's behaviour." },
        { id: "e1q10", prompt: "I wish I ___ the opportunity to study abroad when I was young.", options: ["had", "had had", "would have"], correctIndex: 1, explanation: "wish + Past Perfect = regret about a past missed opportunity." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write the correct wish form",
      instructions: "Complete the wish sentence with the correct form of the verb in brackets.",
      questions: [
        { id: "e2q1", prompt: "He's always late. I wish he (be) ___ more punctual.", correct: "would be", explanation: "wish + would be = desire for change in a habit." },
        { id: "e2q2", prompt: "I didn't say goodbye. I wish I (say) ___ goodbye.", correct: "had said", explanation: "wish + Past Perfect = regret about a past action." },
        { id: "e2q3", prompt: "She keeps leaving the door open. I wish she (not/do) ___ that.", correct: "wouldn't do", explanation: "wish + wouldn't = annoying repeated habit." },
        { id: "e2q4", prompt: "I never learnt to swim. I wish I (learn) ___ as a child.", correct: "had learnt", explanation: "wish + Past Perfect = regret about a past missed opportunity." },
        { id: "e2q5", prompt: "He never listens. I wish he (listen) ___ to me.", correct: "would listen", explanation: "wish + would = desire for a change in behaviour." },
        { id: "e2q6", prompt: "I lost my job because I was rude to the manager. I wish I (not/be) ___ so rude.", correct: "hadn't been", explanation: "wish + Past Perfect = regret about past behaviour." },
        { id: "e2q7", prompt: "If only she (tell) ___ me the truth from the beginning.", correct: "had told", explanation: "if only + Past Perfect = strong regret (same as wish + Past Perfect)." },
        { id: "e2q8", prompt: "He keeps smoking indoors. I wish he (smoke) ___ outside.", correct: "would smoke", explanation: "wish + would = wanting someone to change their behaviour." },
        { id: "e2q9", prompt: "I didn't back up my files. If only I (back up) ___ everything.", correct: "had backed up", explanation: "if only + Past Perfect = strong regret." },
        { id: "e2q10", prompt: "She never replies on time. I wish she (reply) ___ faster.", correct: "would reply", explanation: "wish + would = desired behavioural change." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — wish + Past Simple vs would vs Past Perfect",
      instructions: "Choose the correct form. All three structures are tested: wish + Past Simple (present state), wish + would (habits/behaviour), wish + Past Perfect (past regrets).",
      questions: [
        { id: "e3q1", prompt: "I wish I ___ taller. (I'm not tall — current state)", options: ["were", "had been", "would be"], correctIndex: 0, explanation: "wish + Past Simple (were) = current state you'd like to be different." },
        { id: "e3q2", prompt: "I wish I ___ taller when I tried to become a basketball player. (past — it affected my career)", options: ["were", "had been", "would be"], correctIndex: 1, explanation: "wish + Past Perfect = regret about a past situation." },
        { id: "e3q3", prompt: "She wishes she ___ speak Russian. (She can't — present ability)", options: ["could", "had", "would"], correctIndex: 0, explanation: "wish + could = desired present ability." },
        { id: "e3q4", prompt: "I wish you ___ making that noise! It's driving me crazy.", options: ["stop", "would stop", "had stopped"], correctIndex: 1, explanation: "wish + would stop = annoying ongoing action." },
        { id: "e3q5", prompt: "He wishes he ___ the contract before signing. (He didn't read it — past)", options: ["read", "had read", "would read"], correctIndex: 1, explanation: "wish + Past Perfect = regret about a past action." },
        { id: "e3q6", prompt: "I wish the weather ___ nicer today. (It's bad right now)", options: ["is", "were", "would be"], correctIndex: 1, explanation: "wish + were = current situation you'd like to be different." },
        { id: "e3q7", prompt: "She wishes her son ___ call more often. (He rarely calls)", options: ["calls", "would call", "called"], correctIndex: 1, explanation: "wish + would = desired change in someone's habit." },
        { id: "e3q8", prompt: "I wish I ___ so much money on that holiday. (past — I regret spending it)", options: ["don't spend", "hadn't spent", "wouldn't spend"], correctIndex: 1, explanation: "wish + Past Perfect = regret about a past expenditure." },
        { id: "e3q9", prompt: "He wishes he ___ a better job. (He has a bad job — present state)", options: ["has", "had", "would have"], correctIndex: 1, explanation: "wish + Past Simple (had) = current situation you wish were different." },
        { id: "e3q10", prompt: "I wish she ___ stop criticising everything I do!", options: ["would", "had", "could"], correctIndex: 0, explanation: "wish + would stop = irritating ongoing behaviour." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — All wish structures: rewrite the sentence",
      instructions: "Rewrite the sentence using the correct wish / if only structure. Write only the wish clause.",
      questions: [
        { id: "e4q1", prompt: "I don't have a car. (wish + had): I wish ___.", correct: "i wish i had a car", explanation: "wish + Past Simple = current state wish." },
        { id: "e4q2", prompt: "I didn't study medicine. (wish + Past Perfect): I wish ___.", correct: "i wish i had studied medicine", explanation: "wish + Past Perfect = past regret." },
        { id: "e4q3", prompt: "He keeps leaving his shoes in the hallway. (wish + wouldn't): I wish ___.", correct: "i wish he wouldn't leave his shoes in the hallway", explanation: "wish + wouldn't = annoying habit." },
        { id: "e4q4", prompt: "She can't speak Japanese. (wish + could): She wishes ___.", correct: "she wishes she could speak japanese", explanation: "wish + could = desired ability." },
        { id: "e4q5", prompt: "I accepted the wrong job offer. (if only + Past Perfect): If only ___.", correct: "if only i hadn't accepted the wrong job offer", explanation: "if only + Past Perfect = strong past regret." },
        { id: "e4q6", prompt: "My colleague complains constantly. (wish + would stop): I wish ___.", correct: "i wish my colleague would stop complaining", explanation: "wish + would stop = desire for a behaviour to stop." },
        { id: "e4q7", prompt: "I didn't apologise. (wish + Past Perfect): I wish ___.", correct: "i wish i had apologised", explanation: "wish + Past Perfect = regret about omission." },
        { id: "e4q8", prompt: "I live far from the city centre. (wish + lived): I wish ___.", correct: "i wish i lived closer to the city centre", explanation: "wish + Past Simple = current situation wish." },
        { id: "e4q9", prompt: "She never replies to messages. (if only + would): If only ___.", correct: "if only she would reply to messages", explanation: "if only + would = frustrated desire for behaviour change." },
        { id: "e4q10", prompt: "He crashed my car. (wish + Past Perfect — he / not/crash): I wish ___.", correct: "i wish he hadn't crashed my car", explanation: "wish + Past Perfect = regret about another person's past action." },
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
        <a className="hover:text-slate-900 transition" href="/grammar/b2">Grammar B2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Wish + Would / Past Perfect</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Wish +{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Would / Past Perfect</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        At B2 level, <b>wish + would</b> expresses frustration about an annoying habit or a desired change in someone&apos;s behaviour. <b>Wish + Past Perfect</b> expresses regret about something that happened (or didn&apos;t happen) in the past.
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
        <a href="/grammar/b2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B2 topics</a>
        <a href="/grammar/b2/modal-perfect" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Modal Verbs Perfect →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Wish + Would / Past Perfect (B2)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { struct: "wish + Past Simple", use: "Unhappy about a current state", ex: "I wish I were taller. / I wish I had more time." },
          { struct: "wish + could", use: "Desired present ability", ex: "I wish I could speak Japanese." },
          { struct: "wish + would", use: "Frustration about a habit / desire for change", ex: "I wish he would stop smoking. / I wish she would reply faster." },
          { struct: "wish + Past Perfect", use: "Regret about a past event", ex: "I wish I had studied harder. / I wish I hadn't said that." },
          { struct: "if only + …", use: "Stronger, more dramatic version of wish", ex: "If only I had listened! / If only she would call." },
        ].map(({ struct, use, ex }) => (
          <div key={struct} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-orange-700 text-sm">{struct}</span>
              <span className="text-xs text-slate-500">— {use}</span>
            </div>
            <div className="italic text-slate-700 text-sm">{ex}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black">⚠ wish + would — only for other people&apos;s behaviour:</span> You can&apos;t say <i>I wish I would…</i> about yourself (use <i>wish + Past Simple</i> instead). You CAN say <i>I wish it would stop raining</i> (about things outside your control).
        </div>
      </div>
    </div>
  );
}
