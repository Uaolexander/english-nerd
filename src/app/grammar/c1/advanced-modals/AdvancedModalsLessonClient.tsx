"use client";

import { useMemo, useState } from "react";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function AdvancedModalsLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — would rather, it's time, had better",
      instructions: "These expressions use a past-tense form even when referring to the present or future. Choose the correct form.",
      questions: [
        { id: "e1q1", prompt: "I'd rather you ___ me earlier. I had no idea.", options: ["tell", "told", "had told"], correctIndex: 1, explanation: "would rather + subject + past simple = preference about present/future (told, not tell)." },
        { id: "e1q2", prompt: "It's time we ___ a decision. We've been waiting too long.", options: ["make", "made", "have made"], correctIndex: 1, explanation: "It's time + subject + past simple = overdue action (made)." },
        { id: "e1q3", prompt: "You'd better ___ that email before the meeting.", options: ["sending", "to send", "send"], correctIndex: 2, explanation: "had better + bare infinitive (no 'to'): had better send." },
        { id: "e1q4", prompt: "I'd rather she ___ come — it'll be awkward.", options: ["doesn't", "didn't", "hadn't"], correctIndex: 1, explanation: "would rather + subject + past simple (negative): didn't come." },
        { id: "e1q5", prompt: "It's high time the company ___ its approach to diversity.", options: ["rethinks", "rethought", "has rethought"], correctIndex: 1, explanation: "It's high time + past simple = strong criticism that action is overdue (rethought)." },
        { id: "e1q6", prompt: "You'd better ___ be late again or there will be consequences.", options: ["not", "not to", "don't"], correctIndex: 0, explanation: "had better not + bare infinitive: had better not be late." },
        { id: "e1q7", prompt: "I'd rather ___ at home tonight than go to the party.", options: ["staying", "to stay", "stay"], correctIndex: 2, explanation: "would rather + bare infinitive (same subject): I'd rather stay." },
        { id: "e1q8", prompt: "It's about time they ___ the road. It's been broken for months.", options: ["fix", "fixed", "have fixed"], correctIndex: 1, explanation: "It's about time + past simple = overdue (fixed). Same as 'it's time'." },
        { id: "e1q9", prompt: "You'd better ___ the terms carefully before you sign.", options: ["to read", "reading", "read"], correctIndex: 2, explanation: "had better + bare infinitive: had better read." },
        { id: "e1q10", prompt: "I'd sooner ___ than lie to her.", options: ["saying nothing", "say nothing", "to say nothing"], correctIndex: 1, explanation: "would sooner + bare infinitive = preference (like 'would rather'): sooner say." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — be supposed to, be meant to, may/might well",
      instructions: "Choose the correct modal expression based on the context.",
      questions: [
        { id: "e2q1", prompt: "The train ___ arrive at 10:15, but it's already 10:40.", options: ["is supposed to", "had better", "would rather"], correctIndex: 0, explanation: "be supposed to = expected/scheduled to (but didn't)." },
        { id: "e2q2", prompt: "This button ___ open the settings menu. (intended design)", options: ["is supposed to", "may well", "had better"], correctIndex: 0, explanation: "be supposed to / be meant to = designed or intended to do something." },
        { id: "e2q3", prompt: "She ___ have left by now — she said she had an early flight.", options: ["may well", "is supposed to", "had better"], correctIndex: 0, explanation: "may well = it's quite likely (stronger than 'might'). May well have left." },
        { id: "e2q4", prompt: "He ___ the report by Friday. (obligation he agreed to)", options: ["is supposed to submit", "may well submit", "would rather submit"], correctIndex: 0, explanation: "be supposed to = obligation or arrangement (often implies risk of not meeting it)." },
        { id: "e2q5", prompt: "This plan ___ work — the logic is sound. (likely outcome)", options: ["might well", "is supposed to", "had better"], correctIndex: 0, explanation: "might well / may well = quite likely." },
        { id: "e2q6", prompt: "You ___ not leave early — the director is still here.", options: ["are supposed to", "had better", "may well"], correctIndex: 1, explanation: "had better not = strong advice/warning (negative consequence implied)." },
        { id: "e2q7", prompt: "The new regulations ___ come into force next January.", options: ["are supposed to", "had better", "would sooner"], correctIndex: 0, explanation: "be supposed to = expected/planned to happen at a particular time." },
        { id: "e2q8", prompt: "This is ___ to be a five-star hotel, but the rooms are tiny.", options: ["supposed", "meant", "both are correct"], correctIndex: 2, explanation: "both 'supposed to be' and 'meant to be' express reputation or expectation." },
        { id: "e2q9", prompt: "They ___ announce the decision tomorrow — we'll know soon.", options: ["may well", "had better", "are supposed to"], correctIndex: 0, explanation: "may well = quite probable in the near future." },
        { id: "e2q10", prompt: "You ___ call ahead before arriving — they're very strict about appointments.", options: ["may well", "are supposed to", "had better"], correctIndex: 2, explanation: "had better = strong advice with implied warning (call or face consequences)." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Mixed advanced modal expressions in context",
      instructions: "Choose the most natural and accurate modal expression for each context.",
      questions: [
        { id: "e3q1", prompt: "The CEO ___ resign if the scandal isn't resolved quickly. (strong possibility)", options: ["had better", "may well", "is supposed to"], correctIndex: 1, explanation: "may well resign = quite likely to resign in these circumstances." },
        { id: "e3q2", prompt: "Honestly, I ___ have taken the other job. I regret it now.", options: ["had better", "would sooner", "would rather"], correctIndex: 2, explanation: "would rather have + pp = past regret/preference (same person). Would rather have taken." },
        { id: "e3q3", prompt: "It's high time the public ___ the full picture. (criticism — they don't yet)", options: ["knows", "knew", "has known"], correctIndex: 1, explanation: "It's high time + past simple = strong criticism. 'Knew', not 'knows'." },
        { id: "e3q4", prompt: "I'd rather you ___ sent that message. It's caused a lot of problems.", options: ["didn't", "hadn't", "wouldn't have"], correctIndex: 1, explanation: "would rather + subject + past perfect = past regret about someone else's action (hadn't sent)." },
        { id: "e3q5", prompt: "You ___ reply to an email like that — you'll only make things worse.", options: ["had better not", "are not supposed to", "may well not"], correctIndex: 0, explanation: "had better not = strong warning/advice with implied negative consequence." },
        { id: "e3q6", prompt: "She ___ have been working there for twenty years. (polite/hedged estimate)", options: ["is supposed to", "may well", "had better"], correctIndex: 1, explanation: "may well have been = quite likely estimation about the past." },
        { id: "e3q7", prompt: "The results ___ be announced in a press conference. (planned / expected)", options: ["are supposed to", "may well", "had better"], correctIndex: 0, explanation: "are supposed to = planned/expected arrangement." },
        { id: "e3q8", prompt: "I'd sooner ___ than take that job. It would destroy my work-life balance.", options: ["to resign", "resign", "resigning"], correctIndex: 1, explanation: "would sooner + bare infinitive: sooner resign. No 'to', no -ing." },
        { id: "e3q9", prompt: "It's time we ___ seriously about long-term sustainability. (present need)", options: ["think", "thought", "are thinking"], correctIndex: 1, explanation: "It's time + past simple: thought. NOT 'think' or 'are thinking'." },
        { id: "e3q10", prompt: "This ___ be the breakthrough we've been waiting for. (strong positive probability)", options: ["may well", "had better", "is supposed to"], correctIndex: 0, explanation: "may well be = quite possibly / likely this positive outcome." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Write the correct advanced modal form",
      instructions: "Complete each sentence with the correct form of the expression in brackets. Write only the modal phrase.",
      questions: [
        { id: "e4q1", prompt: "I ___ (would rather / you / not interrupt) me when I'm speaking.", correct: "would rather you didn't interrupt", explanation: "would rather + subject + past simple (negative)." },
        { id: "e4q2", prompt: "It's time you ___ (take) this more seriously.", correct: "took", explanation: "It's time + past simple: took." },
        { id: "e4q3", prompt: "You ___ (had better / not tell) anyone about this. It's confidential.", correct: "had better not tell", explanation: "had better not + bare infinitive." },
        { id: "e4q4", prompt: "The results ___ (be supposed to / publish) last week, but there was a delay.", correct: "were supposed to be published", explanation: "were supposed to be published = passive, past expectation that wasn't met." },
        { id: "e4q5", prompt: "She ___ (may well / be) the best candidate we've interviewed.", correct: "may well be", explanation: "may well be = quite likely is." },
        { id: "e4q6", prompt: "I'd rather ___ (stay) here than travel in this weather.", correct: "stay", explanation: "would rather + bare infinitive (same subject)." },
        { id: "e4q7", prompt: "It's high time the industry ___ (regulate) more strictly.", correct: "was regulated", explanation: "It's high time + past simple (passive): was regulated." },
        { id: "e4q8", prompt: "He ___ (would sooner / leave) the company than compromise his principles.", correct: "would sooner leave", explanation: "would sooner + bare infinitive: sooner leave." },
        { id: "e4q9", prompt: "I'd rather he ___ (not / go) to the press before we've discussed it.", correct: "didn't go", explanation: "would rather + subject + past simple (negative): didn't go." },
        { id: "e4q10", prompt: "This policy ___ (be meant to / protect) consumers, but it's having the opposite effect.", correct: "is meant to protect", explanation: "be meant to + infinitive = intended/designed to." },
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
        <a className="hover:text-slate-900 transition" href="/grammar/c1">Grammar C1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Advanced Modal Expressions</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Advanced{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Modal Expressions</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-200">C1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        At C1, modal expressions go beyond basic modals. Learn <b>would rather / sooner</b> (preference), <b>it&apos;s time / high time</b> (overdue action), <b>had better</b> (strong advice), <b>be supposed / meant to</b> (expectation), and <b>may / might well</b> (strong probability).
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
        <a href="/grammar/c1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All C1 topics</a>
        <a href="/grammar/c1/passive-infinitives" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Passive Infinitives →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Advanced Modal Expressions (C1)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { expr: "would rather + bare inf", use: "Preference (same subject)", ex: "I'd rather stay home. / She'd rather not go.", note: "Same subject → bare infinitive." },
          { expr: "would rather + subject + past simple", use: "Preference about someone else (present/future)", ex: "I'd rather you didn't mention it. / She'd rather we were there.", note: "Different subject → past simple." },
          { expr: "would rather + subject + past perfect", use: "Preference about someone else (past — regret)", ex: "I'd rather you hadn't told him.", note: "Past regret → past perfect." },
          { expr: "would sooner + bare inf", use: "Preference (same as would rather)", ex: "I'd sooner resign than lie.", note: "Formal/literary alternative to would rather." },
          { expr: "it's time / it's high time + past simple", use: "Overdue action (criticism)", ex: "It's time he grew up. / It's high time we left.", note: "Past simple even for present/future meaning." },
          { expr: "it's about time + past simple", use: "Overdue action (mild frustration)", ex: "It's about time they fixed the lift.", note: "Same structure as it's time." },
          { expr: "had better + bare inf", use: "Strong advice with implied warning", ex: "You'd better call him now. / You'd better not be late.", note: "No 'to': had better do (not had better to do)." },
          { expr: "be supposed to + inf", use: "Expectation, arrangement, or rule", ex: "The meeting is supposed to start at 9. / He was supposed to call.", note: "Often implies the expectation wasn't met." },
          { expr: "be meant to + inf", use: "Intention or design", ex: "This is meant to be a luxury hotel. / What is this button meant to do?", note: "Interchangeable with be supposed to in many contexts." },
          { expr: "may / might well + inf", use: "Strong probability (stronger than may/might alone)", ex: "She may well be right. / This might well be the answer.", note: "Well intensifies the probability." },
        ].map(({ expr, use, ex, note }) => (
          <div key={expr} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-cyan-700 text-sm">{expr}</span>
              <span className="text-xs text-slate-500">— {use}</span>
            </div>
            <div className="italic text-slate-700 text-sm mb-1">{ex}</div>
            <div className="text-xs text-slate-400">{note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
