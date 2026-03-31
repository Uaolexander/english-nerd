"use client";
import { useMemo, useState } from "react";

type InputQ = {
  id: string;
  prompt: string;
  hint: string;
  correct: string[];
  explanation: string;
};
type ExSet = {
  no: 1 | 2 | 3 | 4;
  title: string;
  instructions: string;
  questions: InputQ[];
};

function normalize(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/\u2019/g, "'")
    .replace(/\u2018/g, "'");
}
function isAccepted(val: string, correct: string[]) {
  const n = normalize(val);
  return correct.some((c) => normalize(c) === n);
}

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Set 1 — Affirmative (had been + -ing)",
    instructions:
      "Complete each sentence with the Past Perfect Continuous affirmative form of the verb in brackets. Type: had been + verb-ing.",
    questions: [
      {
        id: "f1-1",
        prompt: "She ___ (wait) for an hour when he finally arrived.",
        hint: "had been + -ing",
        correct: ["had been waiting"],
        explanation: "had been waiting — PPC: duration of an action before another past event.",
      },
      {
        id: "f1-2",
        prompt: "They ___ (run) for 20 minutes when it started to rain.",
        hint: "had been + -ing",
        correct: ["had been running"],
        explanation: "had been running — run → running (double n before -ing).",
      },
      {
        id: "f1-3",
        prompt: "He ___ (study) all night, so he was exhausted in the morning.",
        hint: "had been + -ing",
        correct: ["had been studying"],
        explanation: "had been studying — PPC explains the cause of past exhaustion.",
      },
      {
        id: "f1-4",
        prompt: "By the time the doctor arrived, the patient ___ (bleed) for ten minutes.",
        hint: "had been + -ing",
        correct: ["had been bleeding"],
        explanation: "had been bleeding — duration up to a past moment.",
      },
      {
        id: "f1-5",
        prompt: "I ___ (work) at that company for five years when I got promoted.",
        hint: "had been + -ing",
        correct: ["had been working"],
        explanation: "had been working — duration (five years) before a past event.",
      },
      {
        id: "f1-6",
        prompt: "The children ___ (sleep) for two hours when the alarm went off.",
        hint: "had been + -ing",
        correct: ["had been sleeping"],
        explanation: "had been sleeping — duration before another past event.",
      },
      {
        id: "f1-7",
        prompt: "We ___ (talk) about you just before you called!",
        hint: "had been + -ing",
        correct: ["had been talking"],
        explanation: "had been talking — ongoing activity just before a past moment.",
      },
      {
        id: "f1-8",
        prompt: "She ___ (write) her thesis for six months before she finished it.",
        hint: "had been + -ing",
        correct: ["had been writing"],
        explanation: "had been writing — write → writing (drop e before -ing).",
      },
      {
        id: "f1-9",
        prompt: "He ___ (walk) for hours before he found the right street.",
        hint: "had been + -ing",
        correct: ["had been walking"],
        explanation: "had been walking — prolonged activity before a past result.",
      },
      {
        id: "f1-10",
        prompt: "By the time lunch arrived, they ___ (cook) since seven in the morning.",
        hint: "had been + -ing (with since)",
        correct: ["had been cooking"],
        explanation: "had been cooking — PPC with 'since' for ongoing duration.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Set 2 — Negative (hadn't been + -ing) & Mixed",
    instructions:
      "Six questions need the negative form (hadn't been + -ing). Four need the affirmative based on context. Read carefully.",
    questions: [
      {
        id: "f2-1",
        prompt: "He ___ (eat) well, so his energy levels were very low.",
        hint: "hadn't been + -ing",
        correct: ["hadn't been eating", "had not been eating"],
        explanation: "hadn't been eating — negative PPC explains the low energy.",
      },
      {
        id: "f2-2",
        prompt: "The children ___ (behave) badly — in fact, they were very quiet all afternoon.",
        hint: "hadn't been + -ing",
        correct: ["hadn't been behaving", "had not been behaving"],
        explanation: "hadn't been behaving badly — negative PPC; the reality was they were quiet.",
      },
      {
        id: "f2-3",
        prompt: "She was soaking wet because she ___ (shelter) from the rain.",
        hint: "hadn't been + -ing",
        correct: ["hadn't been sheltering", "had not been sheltering"],
        explanation: "hadn't been sheltering — she was NOT sheltering, hence soaking wet.",
      },
      {
        id: "f2-4",
        prompt: "His eyes were red because he ___ (sleep) properly for days.",
        hint: "hadn't been + -ing",
        correct: ["hadn't been sleeping", "had not been sleeping"],
        explanation: "hadn't been sleeping — negative PPC explains the red eyes.",
      },
      {
        id: "f2-5",
        prompt: "The team ___ (perform) well, so the coach was very disappointed.",
        hint: "hadn't been + -ing",
        correct: ["hadn't been performing", "had not been performing"],
        explanation: "hadn't been performing well — poor performance disappointed the coach.",
      },
      {
        id: "f2-6",
        prompt: "She ___ (pay) attention, so she missed the important announcement.",
        hint: "hadn't been + -ing",
        correct: ["hadn't been paying", "had not been paying"],
        explanation: "hadn't been paying attention — negative PPC explains missing the announcement.",
      },
      {
        id: "f2-7",
        prompt: "Her hands were dirty because she ___ (garden) all morning.",
        hint: "had been + -ing",
        correct: ["had been gardening"],
        explanation: "had been gardening — affirmative PPC; gardening caused dirty hands.",
      },
      {
        id: "f2-8",
        prompt: "The room smelled of paint because workers ___ (decorate).",
        hint: "had been + -ing",
        correct: ["had been decorating"],
        explanation: "had been decorating — affirmative PPC; the smell is the result.",
      },
      {
        id: "f2-9",
        prompt: "He was out of breath because he ___ (sprint) for five minutes.",
        hint: "had been + -ing",
        correct: ["had been sprinting"],
        explanation: "had been sprinting — sprint → sprinting (double t); cause of breathlessness.",
      },
      {
        id: "f2-10",
        prompt: "She looked upset because she ___ (argue) with her flatmate.",
        hint: "had been + -ing",
        correct: ["had been arguing"],
        explanation: "had been arguing — argue → arguing (drop e); visible emotional result.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Set 3 — Questions & Short Answers",
    instructions:
      "Write the Past Perfect Continuous question or short answer. For questions, type the full question form. For short answers, type 'she had' or 'they hadn't' etc.",
    questions: [
      {
        id: "f3-1",
        prompt: "___ she been waiting long when you arrived? (question)",
        hint: "Had she been …?",
        correct: ["had she been waiting long", "had she been waiting long when you arrived?", "had she been waiting long when you arrived"],
        explanation: "Had she been waiting? — PPC question: Had + subject + been + -ing.",
      },
      {
        id: "f3-2",
        prompt: "___ they been living there long before they moved? (question)",
        hint: "Had they been …?",
        correct: ["had they been living there long", "had they been living there long before they moved?", "had they been living there long before they moved"],
        explanation: "Had they been living? — PPC question form.",
      },
      {
        id: "f3-3",
        prompt: "Had you been working on the project long? — Yes, ___ (short answer)",
        hint: "Yes, I ___.",
        correct: ["yes, i had", "i had"],
        explanation: "Yes, I had. — Short answer for PPC: use 'had', not 'had been'.",
      },
      {
        id: "f3-4",
        prompt: "___ he been training before the race? (question)",
        hint: "Had he been …?",
        correct: ["had he been training", "had he been training before the race?", "had he been training before the race"],
        explanation: "Had he been training? — PPC question about preparation.",
      },
      {
        id: "f3-5",
        prompt: "Had they been arguing before you arrived? — No, ___ (short answer)",
        hint: "No, they ___.",
        correct: ["no, they hadn't", "they hadn't"],
        explanation: "No, they hadn't. — Negative short answer.",
      },
      {
        id: "f3-6",
        prompt: "___ you been learning Spanish long before you moved? (question)",
        hint: "Had you been …?",
        correct: ["had you been learning spanish long", "had you been learning spanish long before you moved?", "had you been learning spanish long before you moved"],
        explanation: "Had you been learning? — PPC question with 'how long'.",
      },
      {
        id: "f3-7",
        prompt: "Had she been crying before the meeting? — Yes, ___ (short answer)",
        hint: "Yes, she ___.",
        correct: ["yes, she had", "she had"],
        explanation: "Yes, she had. — Positive short answer.",
      },
      {
        id: "f3-8",
        prompt: "___ the team been practising? (question)",
        hint: "Had the team been …?",
        correct: ["had the team been practising", "had the team been practicing", "had the team been practising?", "had the team been practicing?"],
        explanation: "Had the team been practising? — PPC question.",
      },
      {
        id: "f3-9",
        prompt: "Had he been sleeping when you called? — No, ___ (short answer)",
        hint: "No, he ___.",
        correct: ["no, he hadn't", "he hadn't"],
        explanation: "No, he hadn't. — Negative short answer for PPC.",
      },
      {
        id: "f3-10",
        prompt: "___ how long ___ she been working there before she left? (question)",
        hint: "How long had she been …?",
        correct: ["how long had she been working there", "how long had she been working there before she left?", "how long had she been working there before she left"],
        explanation: "How long had she been working? — PPC 'how long' question.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Set 4 — Mixed (All Forms)",
    instructions:
      "Use context clues to decide whether to write had been + -ing (affirmative), hadn't been + -ing (negative), or the question form. The verb is given in brackets.",
    questions: [
      {
        id: "f4-1",
        prompt: "I was exhausted because I ___ (sleep) well for a week.",
        hint: "hadn't been + -ing",
        correct: ["hadn't been sleeping", "had not been sleeping"],
        explanation: "hadn't been sleeping — negative PPC explains past exhaustion.",
      },
      {
        id: "f4-2",
        prompt: "The streets were flooded because it ___ (rain) heavily all night.",
        hint: "had been + -ing",
        correct: ["had been raining"],
        explanation: "had been raining — affirmative PPC; heavy rain caused flooding.",
      },
      {
        id: "f4-3",
        prompt: "___ they ___ (wait) long when the bus finally came? (question)",
        hint: "Had they been …?",
        correct: ["had they been waiting long", "had they been waiting long when the bus finally came?", "had they been waiting long when the bus came?"],
        explanation: "Had they been waiting long? — PPC question.",
      },
      {
        id: "f4-4",
        prompt: "She said she ___ (try) to contact him for days.",
        hint: "had been + -ing (reported speech)",
        correct: ["had been trying"],
        explanation: "had been trying — PPC in reported speech (backshift).",
      },
      {
        id: "f4-5",
        prompt: "The machine broke down because engineers ___ (maintain) it properly.",
        hint: "hadn't been + -ing",
        correct: ["hadn't been maintaining", "had not been maintaining"],
        explanation: "hadn't been maintaining — poor maintenance caused the breakdown.",
      },
      {
        id: "f4-6",
        prompt: "He was covered in mud because he ___ (dig) in the garden.",
        hint: "had been + -ing",
        correct: ["had been digging"],
        explanation: "had been digging — dig → digging (double g); mud is the visible result.",
      },
      {
        id: "f4-7",
        prompt: "By the time she graduated, she ___ (study) for four years.",
        hint: "had been + -ing (with for)",
        correct: ["had been studying"],
        explanation: "had been studying — PPC with 'for' showing duration before graduation.",
      },
      {
        id: "f4-8",
        prompt: "The project failed because the team ___ (communicate) well.",
        hint: "hadn't been + -ing",
        correct: ["hadn't been communicating", "had not been communicating"],
        explanation: "hadn't been communicating — poor communication led to failure.",
      },
      {
        id: "f4-9",
        prompt: "___ she ___ (practise) before the concert? — Yes, she had. (question)",
        hint: "Had she been …?",
        correct: ["had she been practising", "had she been practicing", "had she been practising before the concert?", "had she been practicing before the concert?"],
        explanation: "Had she been practising? — PPC question; short answer uses 'had'.",
      },
      {
        id: "f4-10",
        prompt: "He looked pale because he ___ (sit) inside all day without fresh air.",
        hint: "had been + -ing",
        correct: ["had been sitting"],
        explanation: "had been sitting — sit → sitting (double t); explains his pale complexion.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Affirmative",
  2: "Negative + Mixed",
  3: "Questions",
  4: "Mixed",
};

export default function FillInBlankClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const current = SETS[exNo];

  const score = useMemo(() => {
    if (!checked) return null;
    let correct = 0;
    for (const q of current.questions) {
      if (isAccepted(inputs[q.id] ?? "", q.correct)) correct++;
    }
    const total = current.questions.length;
    return { correct, total, percent: Math.round((correct / total) * 100) };
  }, [checked, current, inputs]);

  function reset() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setChecked(false);
    setInputs({});
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setChecked(false);
    setInputs({});
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
          <a className="hover:text-slate-900 transition" href="/tenses/past-perfect-continuous">Past Perfect Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Fill in the Blank</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Perfect Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">
              Fill in the Blank
            </span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">
            Medium
          </span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">
            B2
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          Type the correct Past Perfect Continuous form (had been + -ing) to complete each sentence.
          40 writing exercises across four sets.
        </p>

        {/* Layout */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          {/* Left ad */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">
                300 × 600
              </div>
            </div>
          </aside>

          {/* Main content */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
            {/* Tab bar */}
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button
                onClick={() => setTab("exercises")}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}
              >
                Exercises
              </button>
              <button
                onClick={() => setTab("explanation")}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}
              >
                Explanation
              </button>
              <div className="ml-auto hidden sm:flex items-center gap-2">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => switchSet(n)}
                    title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}
                  >
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
                    <div className="mt-3 flex sm:hidden items-center gap-2">
                      <span className="text-slate-400 text-xs">Set:</span>
                      {([1, 2, 3, 4] as const).map((n) => (
                        <button
                          key={n}
                          onClick={() => switchSet(n)}
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 space-y-5">
                    {current.questions.map((q, idx) => {
                      const val = inputs[q.id] ?? "";
                      const correct = checked && isAccepted(val, q.correct);
                      const wrong = checked && !isAccepted(val, q.correct);
                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900 mb-1">{q.prompt}</div>
                              <div className="text-xs text-slate-400 mb-2">Hint: {q.hint}</div>
                              <input
                                type="text"
                                spellCheck={false}
                                autoComplete="off"
                                disabled={checked}
                                value={val}
                                placeholder="Type your answer…"
                                onChange={(e) =>
                                  setInputs((p) => ({ ...p, [q.id]: e.target.value }))
                                }
                                className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
                                  checked
                                    ? correct
                                      ? "border-emerald-400 bg-emerald-50"
                                      : "border-red-400 bg-red-50"
                                    : "border-black/10 focus:border-[#F5DA20]"
                                }`}
                              />
                              {checked && (
                                <div className="mt-2 text-sm">
                                  {correct ? (
                                    <div className="text-emerald-700 font-semibold">✅ Correct!</div>
                                  ) : (
                                    <div className="text-red-700 font-semibold">
                                      ❌ Correct answer: <b>{q.correct[0]}</b>
                                    </div>
                                  )}
                                  {wrong && (
                                    <div className="mt-1 text-slate-600">{q.explanation}</div>
                                  )}
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
                        <button
                          onClick={() => {
                            setChecked(true);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
                        >
                          Check Answers
                        </button>
                      ) : (
                        <button
                          onClick={reset}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition"
                        >
                          Try Again
                        </button>
                      )}
                      {checked && exNo < 4 && (
                        <button
                          onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition"
                        >
                          Next Exercise →
                        </button>
                      )}
                    </div>
                    {score && (
                      <div
                        className={`rounded-2xl border p-4 ${score.percent >= 80 ? "border-emerald-200 bg-emerald-50" : score.percent >= 50 ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`text-3xl font-black ${score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"}`}>
                              {score.percent}%
                            </div>
                            <div className="mt-0.5 text-sm text-slate-600">
                              {score.correct} out of {score.total} correct
                            </div>
                          </div>
                          <div className="text-3xl">
                            {score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}
                          </div>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${score.percent}%` }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          {score.percent >= 80
                            ? "Excellent! Move on to the next exercise."
                            : score.percent >= 50
                            ? "Good effort! Review the wrong answers and try once more."
                            : "Keep practising — check the Explanation tab and try again."}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <FillExplanation />
              )}
            </div>
          </section>

          {/* Right ad */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">
                300 × 600
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile ad */}
        <div className="mt-8 lg:hidden rounded-2xl border border-black/10 bg-white/60 p-4">
          <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
          <div className="mt-3 h-[90px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">
            320 × 90
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/past-perfect-continuous"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← All Past Perfect Continuous
          </a>
          <a
            href="/tenses/past-perfect-continuous/spot-the-mistake"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: Spot the Mistake →
          </a>
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
        <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${colors[p.color ?? "slate"]}`}>
          {p.text}
        </span>
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

function FillExplanation() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[{ text: "Subject", color: "sky" }, { text: "had been", color: "yellow" }, { text: "verb + -ing", color: "green" }, { text: ".", color: "slate" }]} />
          <Ex en="She had been waiting for an hour.  ·  They had been studying all night." />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[{ text: "Subject", color: "sky" }, { text: "hadn't been", color: "red" }, { text: "verb + -ing", color: "green" }, { text: ".", color: "slate" }]} />
          <Ex en="He hadn't been sleeping well.  ·  She hadn't been eating properly." />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[{ text: "Had", color: "violet" }, { text: "subject", color: "sky" }, { text: "been", color: "orange" }, { text: "verb + -ing", color: "green" }, { text: "?", color: "slate" }]} />
          <Ex en="Had they been waiting long?  ·  Had she been crying?  ·  How long had he been working?" />
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">-ing Spelling Rules</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5">
                <th className="px-4 py-2.5 font-black text-left text-slate-700">Rule</th>
                <th className="px-4 py-2.5 font-black text-left text-slate-700">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Most verbs: add -ing", "work → working, read → reading"],
                ["Ends in -e: drop e, add -ing", "write → writing, make → making"],
                ["Short vowel + consonant: double consonant", "run → running, sit → sitting"],
                ["Ends in -ie: change to -y + -ing", "lie → lying, die → dying"],
              ].map(([rule, ex], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-black/[0.02]"}>
                  <td className="px-4 py-2.5 text-slate-700">{rule}</td>
                  <td className="px-4 py-2.5 text-slate-600 font-mono text-xs">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="font-black mb-1">⚠ Short answers use &ldquo;had&rdquo; only</div>
        <p>In short answers, use <b>had</b> — not <b>had been</b>: &ldquo;Had you been waiting long? — Yes, I <b>had</b>.&rdquo;</p>
      </div>
    </div>
  );
}
