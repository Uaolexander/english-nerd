"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function HaveToLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Have to or don't have to?",
      instructions: "Choose the correct form: have to / has to / don't have to / doesn't have to.",
      questions: [
        { id: "e1q1", prompt: "I ___ wear a uniform at work. It's compulsory.", options: ["have to", "don't have to", "has to"], correctIndex: 0, explanation: "Obligation for 'I' → have to." },
        { id: "e1q2", prompt: "She ___ wake up early tomorrow — it's a holiday.", options: ["has to", "doesn't have to", "don't have to"], correctIndex: 1, explanation: "No obligation for 'she' → doesn't have to (she can choose to sleep in)." },
        { id: "e1q3", prompt: "He ___ finish this report by Friday. The boss said so.", options: ["has to", "doesn't have to", "have to"], correctIndex: 0, explanation: "Obligation for 'he' → has to." },
        { id: "e1q4", prompt: "You ___ pay for parking here — it's free!", options: ["have to", "don't have to", "has to"], correctIndex: 1, explanation: "No obligation for 'you' → don't have to." },
        { id: "e1q5", prompt: "We ___ book a table — they take walk-ins.", options: ["have to", "don't have to", "doesn't have to"], correctIndex: 1, explanation: "No obligation for 'we' → don't have to." },
        { id: "e1q6", prompt: "They ___ complete the online training before starting.", options: ["have to", "don't have to", "has to"], correctIndex: 0, explanation: "Obligation for 'they' → have to." },
        { id: "e1q7", prompt: "She ___ speak French for the job — English is enough.", options: ["has to", "doesn't have to", "don't have to"], correctIndex: 1, explanation: "No obligation for 'she' → doesn't have to." },
        { id: "e1q8", prompt: "Students ___ pass all exams to graduate.", options: ["has to", "have to", "doesn't have to"], correctIndex: 1, explanation: "Obligation for 'students' (they) → have to." },
        { id: "e1q9", prompt: "He ___ bring a gift — but it would be a nice gesture.", options: ["has to", "doesn't have to", "don't have to"], correctIndex: 1, explanation: "No obligation → doesn't have to (it's optional)." },
        { id: "e1q10", prompt: "I ___ renew my passport — it expires next month.", options: ["have to", "don't have to", "has to"], correctIndex: 0, explanation: "Obligation for 'I' → have to." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Write have to / has to / don't have to / doesn't have to",
      instructions: "Write the correct form of have to (positive or negative).",
      questions: [
        { id: "e2q1", prompt: "She ___ (obligation) take the medicine twice a day.", correct: "has to", explanation: "she + obligation → has to" },
        { id: "e2q2", prompt: "I ___ (no obligation) come in on Saturday — it's optional.", correct: "don't have to", explanation: "I + no obligation → don't have to" },
        { id: "e2q3", prompt: "He ___ (obligation) wear a tie at the new office.", correct: "has to", explanation: "he + obligation → has to" },
        { id: "e2q4", prompt: "They ___ (obligation) leave before midnight — the venue closes.", correct: "have to", explanation: "they + obligation → have to" },
        { id: "e2q5", prompt: "You ___ (no obligation) print anything — just use the app.", correct: "don't have to", explanation: "you + no obligation → don't have to" },
        { id: "e2q6", prompt: "She ___ (no obligation) cook — there's a restaurant downstairs.", correct: "doesn't have to", explanation: "she + no obligation → doesn't have to" },
        { id: "e2q7", prompt: "We ___ (obligation) submit the form by the 30th.", correct: "have to", explanation: "we + obligation → have to" },
        { id: "e2q8", prompt: "He ___ (no obligation) explain — I already know what happened.", correct: "doesn't have to", explanation: "he + no obligation → doesn't have to" },
        { id: "e2q9", prompt: "I ___ (obligation) call the bank today — it's urgent.", correct: "have to", explanation: "I + obligation → have to" },
        { id: "e2q10", prompt: "She ___ (obligation) hand in her assignment tomorrow.", correct: "has to", explanation: "she + obligation → has to" },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Have to vs must vs don't have to vs mustn't",
      instructions: "Choose the correct modal. Think carefully about the meaning (obligation, no obligation, or prohibition).",
      questions: [
        { id: "e3q1", prompt: "You ___ smoke in the hospital. It's strictly forbidden.", options: ["don't have to", "mustn't", "have to"], correctIndex: 1, explanation: "mustn't = prohibition (it's NOT allowed). Don't have to ≠ prohibition — it just means no obligation." },
        { id: "e3q2", prompt: "You ___ buy a ticket — children under 5 get in free.", options: ["have to", "mustn't", "don't have to"], correctIndex: 2, explanation: "don't have to = no obligation (you can, but you don't need to)." },
        { id: "e3q3", prompt: "She ___ get a visa to work in this country — it's the law.", options: ["has to", "doesn't have to", "mustn't"], correctIndex: 0, explanation: "has to = external obligation (legal requirement)." },
        { id: "e3q4", prompt: "You ___ tell anyone about this — it's a secret!", options: ["don't have to", "mustn't", "have to"], correctIndex: 1, explanation: "mustn't = prohibition / strong instruction not to do something." },
        { id: "e3q5", prompt: "I feel I really ___ apologise. I was rude to her.", options: ["must", "have to", "don't have to"], correctIndex: 0, explanation: "must = personal, internal obligation (self-imposed)." },
        { id: "e3q6", prompt: "Passengers ___ keep their seatbelts on during take-off.", options: ["have to", "don't have to", "mustn't"], correctIndex: 0, explanation: "have to = external rule (airline regulation)." },
        { id: "e3q7", prompt: "You ___ rush — we have plenty of time.", options: ["must", "don't have to", "mustn't"], correctIndex: 1, explanation: "don't have to = no need to rush (no obligation)." },
        { id: "e3q8", prompt: "I ___ remember to call mum — it's her birthday!", options: ["must", "don't have to", "mustn't"], correctIndex: 0, explanation: "must = strong personal obligation / internal necessity." },
        { id: "e3q9", prompt: "You ___ use your phone during the exam.", options: ["don't have to", "mustn't", "have to"], correctIndex: 1, explanation: "mustn't = prohibition. Using the phone is not allowed." },
        { id: "e3q10", prompt: "She ___ be at the meeting — it's optional for her department.", options: ["has to", "doesn't have to", "mustn't"], correctIndex: 1, explanation: "doesn't have to = no obligation. She can attend or not." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Mixed: write the correct form",
      instructions: "Write the correct form: have to / has to / don't have to / doesn't have to / must / mustn't.",
      questions: [
        { id: "e4q1", prompt: "You ___ feed the cat — I already did it. (no obligation)", correct: "don't have to", explanation: "No obligation for 'you' → don't have to." },
        { id: "e4q2", prompt: "She ___ see a doctor — her cough is getting worse. (strong personal advice)", correct: "must", explanation: "Strong personal feeling of necessity → must." },
        { id: "e4q3", prompt: "Visitors ___ sign in at reception. (external rule)", correct: "have to", explanation: "External obligation (rule) → have to." },
        { id: "e4q4", prompt: "You ___ park here — it's a fire exit. (prohibition)", correct: "mustn't", explanation: "It is forbidden → mustn't." },
        { id: "e4q5", prompt: "He ___ travel for the job — everything is online now. (no obligation)", correct: "doesn't have to", explanation: "No obligation for 'he' → doesn't have to." },
        { id: "e4q6", prompt: "I ___ finish this before midnight — the deadline is strict. (external obligation)", correct: "have to", explanation: "External obligation → have to." },
        { id: "e4q7", prompt: "You ___ touch that wire — it could be dangerous! (prohibition)", correct: "mustn't", explanation: "Strong prohibition (safety) → mustn't." },
        { id: "e4q8", prompt: "She ___ work on weekends — her contract says Monday to Friday. (no obligation)", correct: "doesn't have to", explanation: "No obligation for 'she' → doesn't have to." },
        { id: "e4q9", prompt: "We ___ submit the application by Friday. (external deadline)", correct: "have to", explanation: "External obligation → have to." },
        { id: "e4q10", prompt: "I really ___ tidy my room — it's a mess! (internal, personal)", correct: "must", explanation: "Self-imposed necessity → must." },
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
        <a className="hover:text-slate-900 transition" href="/grammar/a2">Grammar A2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Have to / Don't have to</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Have to{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">obligation</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Use <b>have to / has to</b> for external obligations (rules, laws, requirements). Use <b>don't / doesn't have to</b> when something is <b>not necessary</b> — there is a choice. Exercise 3 also covers <b>must</b> and <b>mustn't</b>.
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
        <a href="/grammar/a2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All A2 topics</a>
        <a href="/grammar/a2/should-shouldnt" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Should / Shouldn't →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Have to / Don't have to (A2)</h2>
      <p><b>Have to</b> expresses <b>external obligation</b> — rules, laws, requirements from outside. It conjugates like a normal verb: have to / has to / had to.</p>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Forms</div>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { label: "Positive", rows: ["I / you / we / they have to go.", "He / she / it has to go."] },
            { label: "Negative", rows: ["I / you / we / they don't have to go.", "He / she / it doesn't have to go."] },
            { label: "Question", rows: ["Do I / you / we / they have to go?", "Does he / she / it have to go?"] },
            { label: "Past", rows: ["I had to stay late yesterday.", "She didn't have to pay."] },
          ].map(({ label, rows }) => (
            <div key={label} className="rounded-xl border border-black/10 bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-500 mb-2">{label}</div>
              {rows.map((r) => <div key={r} className="text-sm text-slate-800 italic">{r}</div>)}
            </div>
          ))}
        </div>
      </div>

      <h3>The crucial difference</h3>
      <div className="not-prose grid gap-3 md:grid-cols-2">
        {[
          { modal: "have to", meaning: "Obligation — you MUST do it (external rule)", color: "border-sky-200 bg-sky-50 text-sky-700", ex: "You have to wear a seatbelt. (it's the law)" },
          { modal: "don't have to", meaning: "No obligation — you can choose (it's optional)", color: "border-emerald-200 bg-emerald-50 text-emerald-700", ex: "You don't have to tip. (it's optional)" },
          { modal: "must", meaning: "Strong personal obligation — internal, speaker's own feeling", color: "border-violet-200 bg-violet-50 text-violet-700", ex: "I must call mum — it's been ages!" },
          { modal: "mustn't", meaning: "Prohibition — it is NOT allowed, forbidden", color: "border-red-200 bg-red-50 text-red-700", ex: "You mustn't smoke here. (it's forbidden)" },
        ].map(({ modal, meaning, color, ex }) => (
          <div key={modal} className={`rounded-xl border p-4 ${color}`}>
            <div className="text-sm font-black mb-1">{modal}</div>
            <div className="text-sm font-semibold text-slate-700">{meaning}</div>
            <div className="mt-1 text-sm text-slate-600 italic">{ex}</div>
          </div>
        ))}
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">⚠ Critical mistake to avoid:</span> <b>Don't have to ≠ mustn't</b>. <i>"You don't have to come"</i> = it's optional, you can stay home. <i>"You mustn't come"</i> = you are not allowed / it is forbidden.
        </div>
      </div>
    </div>
  );
}
