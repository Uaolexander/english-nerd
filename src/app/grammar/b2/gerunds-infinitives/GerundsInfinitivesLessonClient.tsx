"use client";

import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function GerundsInfinitivesLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Verb + gerund or infinitive?",
      instructions: "Choose the correct form. Some verbs are always followed by gerund (-ing), others by infinitive (to + verb).",
      questions: [
        { id: "e1q1", prompt: "She enjoys ___ by the sea in the morning.", options: ["to walk", "walking", "walk"], correctIndex: 1, explanation: "enjoy + gerund: enjoy walking." },
        { id: "e1q2", prompt: "He decided ___ a new laptop.", options: ["buying", "to buy", "buy"], correctIndex: 1, explanation: "decide + infinitive: decided to buy." },
        { id: "e1q3", prompt: "They suggested ___ a different route.", options: ["to take", "taking", "take"], correctIndex: 1, explanation: "suggest + gerund: suggested taking." },
        { id: "e1q4", prompt: "She managed ___ the door without a key.", options: ["opening", "to open", "open"], correctIndex: 1, explanation: "manage + infinitive: managed to open." },
        { id: "e1q5", prompt: "I can't imagine ___ in such a cold place.", options: ["to live", "living", "live"], correctIndex: 1, explanation: "imagine + gerund: imagine living." },
        { id: "e1q6", prompt: "He refused ___ the offer.", options: ["accepting", "to accept", "accept"], correctIndex: 1, explanation: "refuse + infinitive: refused to accept." },
        { id: "e1q7", prompt: "She admitted ___ the money.", options: ["to take", "taking", "take"], correctIndex: 1, explanation: "admit + gerund: admitted taking." },
        { id: "e1q8", prompt: "They agreed ___ the price.", options: ["lowering", "to lower", "lower"], correctIndex: 1, explanation: "agree + infinitive: agreed to lower." },
        { id: "e1q9", prompt: "I keep ___ the same mistakes.", options: ["to make", "making", "make"], correctIndex: 1, explanation: "keep + gerund: keep making." },
        { id: "e1q10", prompt: "She promised ___ on time.", options: ["being", "to be", "be"], correctIndex: 1, explanation: "promise + infinitive: promised to be." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Verbs that change meaning",
      instructions: "Some verbs change meaning depending on whether they are followed by gerund or infinitive. Choose the correct form based on the context.",
      questions: [
        { id: "e2q1", prompt: "I remember ___ her at the conference. (= I have a memory of meeting her)", options: ["to meet", "meeting", "meet"], correctIndex: 1, explanation: "remember + gerund = memory of a past event." },
        { id: "e2q2", prompt: "Remember ___ your passport before you leave! (= don't forget to do it)", options: ["to bring", "bringing", "bring"], correctIndex: 0, explanation: "remember + infinitive = you need to do something in the future." },
        { id: "e2q3", prompt: "I stopped ___ two years ago. (= I no longer smoke)", options: ["to smoke", "smoking", "smoke"], correctIndex: 1, explanation: "stop + gerund = end an activity." },
        { id: "e2q4", prompt: "She stopped ___ the map. (= she stopped in order to look)", options: ["to check", "checking", "check"], correctIndex: 0, explanation: "stop + infinitive = stopped in order to do something else." },
        { id: "e2q5", prompt: "He tried ___ the heavy box, but it didn't move. (= made an effort)", options: ["to lift", "lifting", "lift"], correctIndex: 0, explanation: "try + infinitive = attempt, make an effort." },
        { id: "e2q6", prompt: "Try ___ some lemon juice on it. (= experiment, see if it works)", options: ["to add", "adding", "add"], correctIndex: 1, explanation: "try + gerund = experiment with a different approach." },
        { id: "e2q7", prompt: "I regret ___ you that your application was unsuccessful. (= I'm sorry to tell you now)", options: ["to inform", "informing", "inform"], correctIndex: 0, explanation: "regret + infinitive = sorry about what I'm about to say (formal)." },
        { id: "e2q8", prompt: "She regrets ___ so much time on social media. (= she's sorry about a past habit)", options: ["to spend", "spending", "spend"], correctIndex: 1, explanation: "regret + gerund = feel bad about a past action." },
        { id: "e2q9", prompt: "He forgot ___ the email, so nobody came. (= he didn't send it)", options: ["to send", "sending", "send"], correctIndex: 0, explanation: "forget + infinitive = failed to do something." },
        { id: "e2q10", prompt: "I'll never forget ___ my first concert. (= I'll always remember the experience)", options: ["to attend", "attending", "attend"], correctIndex: 1, explanation: "forget + gerund = can't forget a past experience." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Mixed patterns in context",
      instructions: "Choose the correct form. This exercise mixes all patterns: fixed gerund/infinitive verbs, meaning-change verbs, and phrases like be used to, look forward to.",
      questions: [
        { id: "e3q1", prompt: "She's used to ___ long hours. (= it's normal for her)", options: ["work", "working", "to work"], correctIndex: 1, explanation: "be used to + gerund: it's normal or familiar." },
        { id: "e3q2", prompt: "He used to ___ every day. (= past habit, no longer true)", options: ["run", "running", "to run"], correctIndex: 0, explanation: "used to + bare infinitive = past habit." },
        { id: "e3q3", prompt: "I look forward to ___ you at the conference.", options: ["see", "seeing", "to see"], correctIndex: 1, explanation: "look forward to + gerund (to is a preposition here)." },
        { id: "e3q4", prompt: "He went on ___ for another hour despite being tired. (= continued)", options: ["to talk", "talking", "talk"], correctIndex: 1, explanation: "go on + gerund = continue doing the same thing." },
        { id: "e3q5", prompt: "After the break, she went on ___ a completely different topic. (= moved on to)", options: ["to discuss", "discussing", "discuss"], correctIndex: 0, explanation: "go on + infinitive = move on to do something different." },
        { id: "e3q6", prompt: "He denied ___ the money from the safe.", options: ["to steal", "stealing", "steal"], correctIndex: 1, explanation: "deny + gerund: deny stealing." },
        { id: "e3q7", prompt: "They tend ___ problems rather than solving them.", options: ["to avoid", "avoiding", "avoid"], correctIndex: 0, explanation: "tend + infinitive: tend to avoid." },
        { id: "e3q8", prompt: "I can't help ___ when I see that film.", options: ["to cry", "crying", "cry"], correctIndex: 1, explanation: "can't help + gerund = can't stop yourself from doing something." },
        { id: "e3q9", prompt: "She seems ___ very happy today.", options: ["being", "to be", "be"], correctIndex: 1, explanation: "seem + infinitive: seem to be." },
        { id: "e3q10", prompt: "He needs ___ more carefully in future.", options: ["driving", "to drive", "drive"], correctIndex: 1, explanation: "need + infinitive: need to drive." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Complete with the correct form",
      instructions: "Write the correct form of the verb in brackets (gerund or infinitive). Write only the verb form.",
      questions: [
        { id: "e4q1", prompt: "I remember (see) ___ this film as a child. It was wonderful.", correct: "seeing", explanation: "remember + gerund = memory of a past experience." },
        { id: "e4q2", prompt: "Don't forget (lock) ___ the door when you leave.", correct: "to lock", explanation: "forget + infinitive = don't fail to do this future action." },
        { id: "e4q3", prompt: "She tried (fix) ___ the printer but couldn't manage it.", correct: "to fix", explanation: "try + infinitive = make an effort to do something." },
        { id: "e4q4", prompt: "Have you tried (restart) ___ the computer? It might solve the problem.", correct: "restarting", explanation: "try + gerund = experiment with a solution." },
        { id: "e4q5", prompt: "He stopped (drink) ___ coffee because of his blood pressure.", correct: "drinking", explanation: "stop + gerund = end the activity." },
        { id: "e4q6", prompt: "She stopped (buy) ___ a newspaper on her way home.", correct: "to buy", explanation: "stop + infinitive = stopped in order to do something." },
        { id: "e4q7", prompt: "I regret (not/tell) ___ him the truth earlier.", correct: "not telling", explanation: "regret + gerund = feel bad about a past action." },
        { id: "e4q8", prompt: "We regret (inform) ___ you that your flight has been cancelled.", correct: "to inform", explanation: "regret + infinitive = formal expression of being sorry about what you're saying." },
        { id: "e4q9", prompt: "I can't stand (wait) ___ in long queues.", correct: "waiting", explanation: "can't stand + gerund = find something intolerable." },
        { id: "e4q10", prompt: "She's looking forward to (start) ___ her new job.", correct: "starting", explanation: "look forward to + gerund (to is a preposition)." },
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
        <a className="hover:text-slate-900 transition" href="/grammar/b2">Grammar B2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Gerunds &amp; Infinitives</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Gerunds{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">&amp; Infinitives</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        At B2 level, the key challenge is <b>verbs that change meaning</b> depending on whether they are followed by a gerund or an infinitive: <i>remember doing</i> vs <i>remember to do</i>, <i>stop doing</i> vs <i>stop to do</i>, <i>try doing</i> vs <i>try to do</i>, and others.
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

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
            <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
            <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
          </div>
        </aside>
      </div>

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B2 topics</a>
        <a href="/grammar/b2/reported-speech-advanced" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Reported Speech Advanced →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Gerunds &amp; Infinitives (B2)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { pair: "remember doing", use: "Memory of a past event", ex: "I remember meeting her at the party." },
          { pair: "remember to do", use: "Don't forget to do it (future action)", ex: "Remember to lock the door." },
          { pair: "stop doing", use: "End an activity", ex: "He stopped smoking two years ago." },
          { pair: "stop to do", use: "Pause in order to do something else", ex: "She stopped to check the map." },
          { pair: "try doing", use: "Experiment — see if it helps", ex: "Try restarting the router." },
          { pair: "try to do", use: "Attempt / make an effort", ex: "He tried to lift the box but couldn't." },
          { pair: "regret doing", use: "Feel bad about a past action", ex: "I regret spending so much money." },
          { pair: "regret to do", use: "Be sorry about what you're about to say (formal)", ex: "We regret to inform you that…" },
          { pair: "forget doing", use: "Can't forget a past experience", ex: "I'll never forget visiting Rome." },
          { pair: "forget to do", use: "Failed to do something", ex: "He forgot to send the email." },
          { pair: "go on doing", use: "Continue the same activity", ex: "She went on talking for an hour." },
          { pair: "go on to do", use: "Move on to a new activity", ex: "He went on to discuss the budget." },
        ].map(({ pair, use, ex }) => (
          <div key={pair} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-orange-700 text-sm">{pair}</span>
              <span className="text-xs text-slate-500">— {use}</span>
            </div>
            <div className="italic text-slate-700 text-sm">{ex}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800 space-y-2">
          <div><span className="font-black">be used to + gerund:</span> <i>She is used to working late</i> (it&apos;s normal for her).</div>
          <div><span className="font-black">used to + infinitive:</span> <i>She used to work late</i> (past habit — she no longer does).</div>
          <div><span className="font-black">look forward to + gerund:</span> <i>I look forward to seeing you</i> (to is a preposition here).</div>
          <div><span className="font-black">can&apos;t help + gerund:</span> <i>I can&apos;t help laughing</i> (can&apos;t stop yourself).</div>
        </div>
      </div>
    </div>
  );
}
