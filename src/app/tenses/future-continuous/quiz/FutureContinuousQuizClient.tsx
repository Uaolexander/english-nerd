"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";

/* ─── Types ─────────────────────────────────────────────────────────────── */

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

/* ─── Question data ─────────────────────────────────────────────────────── */

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — will be / won't be",
    instructions:
      "Choose will be or won't be to complete each sentence. Remember: Future Continuous uses will be + verb-ing for all subjects — there are no changes for he/she/it.",
    questions: [
      { id: "1-1", prompt: "At 8 PM tomorrow, I ___ watching the match.", options: ["will be", "won't be", "will", "am going to"], correctIndex: 0, explanation: "Affirmative: I will be watching. 'will be' + verb-ing for all subjects." },
      { id: "1-2", prompt: "She ___ working this weekend — she's on holiday.", options: ["will be", "won't be", "isn't", "doesn't"], correctIndex: 1, explanation: "Negative: she won't be working. 'won't be' + verb-ing." },
      { id: "1-3", prompt: "When you arrive, they ___ having dinner.", options: ["won't be", "will be", "are", "have"], correctIndex: 1, explanation: "Affirmative: they will be having. Action in progress when you arrive." },
      { id: "1-4", prompt: "Don't call me at noon — I ___ driving.", options: ["will be", "won't be", "am", "have been"], correctIndex: 0, explanation: "Affirmative: I will be driving — action in progress at that time." },
      { id: "1-5", prompt: "This time next week, we ___ sitting on the beach.", options: ["won't be", "will be", "sit", "will"], correctIndex: 1, explanation: "Affirmative: we will be sitting. 'This time next week' signals Future Continuous." },
      { id: "1-6", prompt: "He ___ joining us for lunch — he has a meeting.", options: ["will be", "won't be", "isn't", "doesn't"], correctIndex: 1, explanation: "Negative: he won't be joining. The reason confirms it's negative." },
      { id: "1-7", prompt: "By midnight, the team ___ still working on the project.", options: ["won't be", "will be", "works", "will"], correctIndex: 1, explanation: "Affirmative: will be working. Action expected to be in progress at midnight." },
      { id: "1-8", prompt: "I ___ sleeping when you get back — I have a deadline.", options: ["will be", "won't be", "am not", "don't"], correctIndex: 1, explanation: "Negative: I won't be sleeping. The deadline means I'll still be awake." },
      { id: "1-9", prompt: "At this time tomorrow, the children ___ playing in the park.", options: ["won't be", "will be", "play", "are"], correctIndex: 1, explanation: "Affirmative: will be playing. 'At this time tomorrow' signals Future Continuous." },
      { id: "1-10", prompt: "Don't worry about the noise — they ___ working much longer.", options: ["will be", "won't be", "aren't", "don't"], correctIndex: 1, explanation: "Negative: they won't be working much longer. Don't worry = reassurance, so negative." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Questions and short answers",
    instructions:
      "Choose the correct question form or short answer for Future Continuous. Questions use: Will + subject + be + verb-ing? Short answers: Yes, I will. / No, I won't.",
    questions: [
      { id: "2-1", prompt: "___ you be working late tonight?", options: ["Are", "Do", "Will", "Shall"], correctIndex: 2, explanation: "Future Continuous questions start with 'Will': Will you be working?" },
      { id: "2-2", prompt: "Will she ___ the presentation tomorrow?", options: ["give", "gives", "be giving", "gave"], correctIndex: 2, explanation: "Will + subject + be + verb-ing: Will she be giving…?" },
      { id: "2-3", prompt: "\"Will they be coming to the party?\" — \"Yes, ___.\"", options: ["they are", "they will be", "they will", "they do"], correctIndex: 2, explanation: "Short affirmative answer: Yes, they will. (modal stays the same)" },
      { id: "2-4", prompt: "\"Will you be using the car tonight?\" — \"No, ___.\"", options: ["I won't be", "I don't", "I won't", "I am not"], correctIndex: 2, explanation: "Short negative answer: No, I won't." },
      { id: "2-5", prompt: "Will he be ___ by the time we get there?", options: ["sleep", "slept", "sleeping", "sleeps"], correctIndex: 2, explanation: "Will + subject + be + verb-ing: Will he be sleeping?" },
      { id: "2-6", prompt: "___ she be travelling on Friday?", options: ["Does", "Is", "Will", "Has"], correctIndex: 2, explanation: "Future Continuous questions: Will + subject + be + verb-ing?" },
      { id: "2-7", prompt: "\"Will he be joining us?\" — \"Yes, ___.\"", options: ["he does", "he is", "he will", "he will be joining"], correctIndex: 2, explanation: "Short affirmative answer: Yes, he will." },
      { id: "2-8", prompt: "Will the team ___ working at 10 PM?", options: ["is", "be", "been", "are"], correctIndex: 1, explanation: "Will + subject + be + verb-ing: Will the team be working?" },
      { id: "2-9", prompt: "\"Will you be needing any help?\" — \"No, ___.\"", options: ["I'm not", "I won't be", "I don't", "I won't"], correctIndex: 3, explanation: "Short negative answer: No, I won't." },
      { id: "2-10", prompt: "Will they ___ waiting for us when we arrive?", options: ["are", "were", "be", "being"], correctIndex: 2, explanation: "Will + subject + be + verb-ing: Will they be waiting?" },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Choose the correct -ing form",
    instructions:
      "Choose the correct -ing spelling. Remember: add -ing (work→working), drop -e (make→making), double CVC consonant (run→running), -ie→-ying (die→dying).",
    questions: [
      { id: "3-1", prompt: "At noon I'll be ___ lunch.", options: ["makeing", "makking", "making", "maked"], correctIndex: 2, explanation: "make → making. Drop the final -e, then add -ing." },
      { id: "3-2", prompt: "She'll be ___ in the pool all morning.", options: ["swiming", "swimming", "swimeing", "swimmed"], correctIndex: 1, explanation: "swim → swimming. Short CVC verb: double the final consonant." },
      { id: "3-3", prompt: "They won't be ___ this weekend — they're exhausted.", options: ["runing", "runeing", "running", "runned"], correctIndex: 2, explanation: "run → running. Short CVC verb: double the final consonant." },
      { id: "3-4", prompt: "He will be ___ on the sofa when you get home.", options: ["lieing", "lyeing", "lying", "lie-ing"], correctIndex: 2, explanation: "lie → lying. Verbs ending in -ie: change -ie to -y, add -ing." },
      { id: "3-5", prompt: "We'll be ___ a report at 3 PM.", options: ["writing", "writeing", "writting", "writ"], correctIndex: 0, explanation: "write → writing. Drop the final -e, then add -ing." },
      { id: "3-6", prompt: "The kids will be ___ all afternoon.", options: ["siting", "sitteing", "sitting", "siteing"], correctIndex: 2, explanation: "sit → sitting. Short CVC verb: double the final consonant." },
      { id: "3-7", prompt: "I won't be ___ to music — I'll be focused on work.", options: ["listning", "listenning", "listeing", "listening"], correctIndex: 3, explanation: "listen → listening. Ends in a vowel + n, but 'en' is not CVC final: just add -ing." },
      { id: "3-8", prompt: "By midnight she'll be ___ of exhaustion.", options: ["dieing", "dying", "dyeing", "die-ing"], correctIndex: 1, explanation: "die → dying. Verbs ending in -ie: change -ie to -y, add -ing." },
      { id: "3-9", prompt: "They'll be ___ out of town all next week.", options: ["travelling", "traveling", "travleing", "travell"], correctIndex: 0, explanation: "travel → travelling (UK English). Double the final -l before -ing." },
      { id: "3-10", prompt: "At 6 AM he'll be ___ to the gym.", options: ["driveing", "drivving", "driving", "drived"], correctIndex: 2, explanation: "drive → driving. Drop the final -e, then add -ing." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed",
    instructions:
      "This mixed exercise covers will be / won't be, question forms, short answers, and -ing spelling. Read each sentence carefully and choose the best option.",
    questions: [
      { id: "4-1", prompt: "This time next year, I ___ studying at university.", options: ["am", "will be", "won't be", "going to"], correctIndex: 1, explanation: "Affirmative Future Continuous: I will be studying. 'This time next year' signals FC." },
      { id: "4-2", prompt: "___ she be sleeping when we call?", options: ["Does", "Is", "Will", "Has"], correctIndex: 2, explanation: "Future Continuous question: Will she be sleeping?" },
      { id: "4-3", prompt: "\"Will you be attending the meeting?\" — \"No, ___.\"", options: ["I won't", "I don't", "I'm not", "I haven't"], correctIndex: 0, explanation: "Short negative answer: No, I won't." },
      { id: "4-4", prompt: "At 9 PM he'll be ___ dinner.", options: ["cookeing", "cooking", "cooked", "cooks"], correctIndex: 1, explanation: "cook → cooking. Most verbs just add -ing." },
      { id: "4-5", prompt: "Don't call at noon — she ___ still sleeping.", options: ["won't be", "will be", "isn't", "hasn't"], correctIndex: 1, explanation: "Affirmative: she will be still sleeping. Don't disturb = she IS sleeping then." },
      { id: "4-6", prompt: "Will they ___ by the time we arrive?", options: ["eating", "are eating", "be eating", "ate"], correctIndex: 2, explanation: "Will + subject + be + verb-ing: Will they be eating?" },
      { id: "4-7", prompt: "\"Will he be working late?\" — \"Yes, ___.\"", options: ["he is", "he does", "he will", "he working"], correctIndex: 2, explanation: "Short affirmative: Yes, he will." },
      { id: "4-8", prompt: "The sun ___ shining brightly at noon tomorrow.", options: ["won't be", "will be", "is", "shines"], correctIndex: 1, explanation: "Affirmative: will be shining. Expected condition at a future time." },
      { id: "4-9", prompt: "By 7 AM, the team will be ___ breakfast.", options: ["haveing", "have", "having", "havin"], correctIndex: 2, explanation: "have → having. Drop the final -e, then add -ing." },
      { id: "4-10", prompt: "Don't worry — we ___ late, we'll be there on time.", options: ["will be", "won't be", "aren't", "don't"], correctIndex: 1, explanation: "Negative: we won't be late. 'Don't worry' signals reassurance = negative." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "will be / won't be",
  2: "Questions",
  3: "-ing forms",
  4: "Mixed",
};

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function FutureContinuousQuizClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

  const current = SETS[exNo];

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

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/future-continuous">Future Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Multiple Choice</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Quiz</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">B1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Practice <b>Future Continuous</b> with 40 multiple choice questions across four sets: will be / won't be, questions, -ing spelling, and a mixed review. Pick the correct form and check your answers.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left ad */}
          <AdUnit variant="sidebar-dark" />

          {/* Main content */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {tab === "exercises" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-black text-slate-900">{current.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">{current.instructions}</p>
                    <div className="mt-3 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3, 4] as const).map((n) => (
                        <button key={n} onClick={() => switchSet(n)}
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>
                          {n}
                        </button>
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
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi}
                                      onChange={() => setAnswers((p) => ({ ...p, [q.id]: oi }))}
                                      className="accent-[#F5DA20]" />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-1.5 text-slate-600">
                                    <b className="text-slate-900">Correct answer:</b> {q.options[q.correctIndex]} — {q.explanation}
                                  </div>
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
                          className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">
                          Check Answers
                        </button>
                      ) : (
                        <button onClick={reset} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">
                          Try Again
                        </button>
                      )}
                      {checked && exNo < 4 && (
                        <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">
                          Next Exercise →
                        </button>
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

          {/* Right ad */}
          <AdUnit variant="sidebar-dark" />
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-continuous" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Future Continuous exercises</a>
          <a href="/tenses/future-continuous/fill-in-blank" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Fill in the Blank →</a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation tab ─────────────────────────────────────────────────────── */

function Formula({ parts }: { parts: Array<{ text: string; color?: string }> }) {
  const colors: Record<string, string> = {
    sky: "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-100 text-emerald-800 border-emerald-200",
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

      {/* 3 gradient cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "will be", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I will be working.  ·  She will be sleeping.  ·  They will be travelling." />
            <Ex en="Contractions: I'll be, you'll be, he'll be, she'll be, we'll be, they'll be" />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "won't be", color: "red" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I won't be working tomorrow.  ·  She won't be joining us." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "be", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you be working tonight?  ·  Will she be coming?" />
          </div>
        </div>
      </div>

      {/* will be is the same for all subjects */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will be is the same for ALL subjects</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">+</th>
                <th className="px-4 py-2.5 font-black text-red-700">−</th>
                <th className="px-4 py-2.5 font-black text-sky-700">?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I", "will be working", "won't be working", "Will I be working?"],
                ["You", "will be working", "won't be working", "Will you be working?"],
                ["He / She / It", "will be working ★", "won't be working", "Will she be working?"],
                ["We / They", "will be working", "won't be working", "Will they be working?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i === 2 ? "bg-amber-50 font-bold" : "bg-white"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm">{aff}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-sm">{neg}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-sm">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Key rule:</span> &quot;will be&quot; never changes — it is the same for all subjects!<br />
          <span className="text-xs">She <b>will be</b> working ✅ &nbsp; She <b>wills be</b> working ❌ &nbsp; She <b>is going to be</b> working (alternative form) ✅</span>
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">Common mistake — always use &quot;will be&quot; + -ing form!</div>
        <div className="space-y-1.5 mt-2 text-xs text-amber-700">
          <div>✅ She will be <b>working</b> tomorrow. &nbsp;|&nbsp; ❌ She will <b>work</b> tomorrow. (that&apos;s Simple Future)</div>
          <div>✅ They will be <b>sleeping</b>. &nbsp;|&nbsp; ❌ They will be <b>sleep</b>. (base form after be)</div>
          <div>✅ Will you be <b>coming</b>? &nbsp;|&nbsp; ❌ Will you <b>coming</b>? (missing &quot;be&quot;)</div>
        </div>
      </div>

      {/* When to use */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use Future Continuous</div>
        <div className="space-y-2">
          {[
            { use: "Action in progress at a specific future time", ex: "At 8 PM tomorrow, I'll be watching the match." },
            { use: "Action in progress when another action happens", ex: "When you arrive, I'll be cooking dinner." },
            { use: "Polite questions about plans (less direct than will)", ex: "Will you be using the car tonight?" },
            { use: "Planned/expected events in the future", ex: "This time next week, we'll be sitting on the beach." },
          ].map(({ use, ex }) => (
            <div key={use} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800">{use}</div>
              <div className="text-xs text-slate-500 mt-0.5 italic">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* -ing spelling rules */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">-ing spelling rules</div>
        <div className="space-y-2">
          {[
            { rule: "Most verbs → add -ing", ex: "work → working · play → playing · read → reading" },
            { rule: "Ends in -e → drop the -e, add -ing", ex: "make → making · come → coming · write → writing · drive → driving" },
            { rule: "Short verb (CVC) → double the final consonant", ex: "run → running · sit → sitting · swim → swimming · stop → stopping" },
            { rule: "Ends in -ie → change to -y, add -ing", ex: "die → dying · lie → lying · tie → tying" },
          ].map(({ rule, ex }) => (
            <div key={rule} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800">{rule}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-mono">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions</div>
        <div className="flex flex-wrap gap-2">
          {["at this time tomorrow", "at 8 o'clock tomorrow", "this time next week", "this time next month", "this time next year", "when you arrive", "when you call", "all day tomorrow", "soon", "tonight", "by midnight", "at noon tomorrow"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
