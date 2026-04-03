"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";

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

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — The background action (Past Continuous)",
    instructions:
      "Pattern: [Subject] + was/were + -ing (background) + WHEN + [subject] + Past Simple (interruption). The Continuous action was already happening when the Simple action interrupted it.",
    questions: [
      { id: "1-1", prompt: "I ___ TV when the power went out.", options: ["watched", "was watching", "watch", "am watching"], correctIndex: 1, explanation: "Background Continuous: was watching — then the power went out (interruption)." },
      { id: "1-2", prompt: "She ___ her car when it started to rain.", options: ["washed", "was washing", "washes", "is washing"], correctIndex: 1, explanation: "Background Continuous: was washing." },
      { id: "1-3", prompt: "We ___ in the garden when the storm hit.", options: ["sat", "were sitting", "sit", "are sitting"], correctIndex: 1, explanation: "Background Continuous: were sitting." },
      { id: "1-4", prompt: "He ___ his bike when he fell off.", options: ["rode", "was riding", "ride", "rides"], correctIndex: 1, explanation: "Background Continuous: was riding." },
      { id: "1-5", prompt: "They ___ to school when the bus broke down.", options: ["travelled", "were travelling", "travel", "are travelling"], correctIndex: 1, explanation: "Background Continuous: were travelling." },
      { id: "1-6", prompt: "I ___ a nap when my alarm went off.", options: ["took", "was taking", "take", "am taking"], correctIndex: 1, explanation: "Background Continuous: was taking." },
      { id: "1-7", prompt: "She ___ for the exam when her friend called.", options: ["studied", "was studying", "study", "is studying"], correctIndex: 1, explanation: "Background Continuous: was studying." },
      { id: "1-8", prompt: "We ___ lunch when we heard the explosion.", options: ["had", "were having", "have", "are having"], correctIndex: 1, explanation: "Background Continuous: were having." },
      { id: "1-9", prompt: "He ___ in the pool when it started to thunder.", options: ["swam", "was swimming", "swim", "is swimming"], correctIndex: 1, explanation: "Background Continuous: was swimming." },
      { id: "1-10", prompt: "I ___ my phone when I saw the notification.", options: ["checked", "was checking", "check", "am checking"], correctIndex: 1, explanation: "Background Continuous: was checking." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — The interrupting event (Past Simple)",
    instructions:
      "Now choose the correct INTERRUPTING event in Past Simple. The Continuous is given — you supply the Past Simple action that happened.",
    questions: [
      { id: "2-1", prompt: "She was walking to work when she ___ her old teacher.", options: ["was seeing", "saw", "see", "sees"], correctIndex: 1, explanation: "Short interrupting event → Past Simple: saw." },
      { id: "2-2", prompt: "We were having dinner when the lights ___ out.", options: ["were going", "went", "go", "goes"], correctIndex: 1, explanation: "Short event → Past Simple: went out." },
      { id: "2-3", prompt: "He was reading when his phone ___.", options: ["was ringing", "rang", "ring", "rings"], correctIndex: 1, explanation: "Short event → Past Simple: rang." },
      { id: "2-4", prompt: "They were playing tennis when it ___ to rain.", options: ["was starting", "started", "start", "starts"], correctIndex: 1, explanation: "Short interrupting event → Past Simple: started." },
      { id: "2-5", prompt: "I was driving when a deer ___ into the road.", options: ["was jumping", "jumped", "jump", "jumps"], correctIndex: 1, explanation: "Short sudden event → Past Simple: jumped." },
      { id: "2-6", prompt: "She was taking a bath when someone ___ on the door.", options: ["was knocking", "knocked", "knock", "knocks"], correctIndex: 1, explanation: "Short event → Past Simple: knocked." },
      { id: "2-7", prompt: "They were arguing when their mother ___ home.", options: ["was coming", "came", "come", "comes"], correctIndex: 1, explanation: "Short event → Past Simple: came." },
      { id: "2-8", prompt: "I was sleeping when I ___ a loud crash.", options: ["was hearing", "heard", "hear", "hears"], correctIndex: 1, explanation: "Short event → Past Simple: heard." },
      { id: "2-9", prompt: "He was jogging when he ___ his ankle.", options: ["was twisting", "twisted", "twist", "twists"], correctIndex: 1, explanation: "Short event → Past Simple: twisted." },
      { id: "2-10", prompt: "We were watching the film when she ___ out of the theatre.", options: ["was walking", "walked", "walk", "walks"], correctIndex: 1, explanation: "Short event → Past Simple: walked." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Full interrupted action sentences",
    instructions:
      "Choose the complete correct combination. Remember: Continuous for the background, Simple for the interruption.",
    questions: [
      { id: "3-1", prompt: "Which is correct?", options: ["I read when he called.", "I was reading when he called.", "I read when he was calling.", "I was reading when he was calling."], correctIndex: 1, explanation: "Background Continuous + Simple interruption: I was reading when he called." },
      { id: "3-2", prompt: "Which is correct?", options: ["She cooked when the fire alarm went off.", "She was cooking when the fire alarm went off.", "She cooked when the fire alarm was going off.", "She was cooking when the fire alarm was going off."], correctIndex: 1, explanation: "Background Continuous: was cooking. Interruption: fire alarm went off (Simple)." },
      { id: "3-3", prompt: "Which is correct?", options: ["They played when it started to rain.", "They were playing when it started to rain.", "They played when it was starting to rain.", "They were playing when it was starting to rain."], correctIndex: 1, explanation: "Background: were playing. Interruption: it started to rain (Simple)." },
      { id: "3-4", prompt: "Which is correct?", options: ["He drove when the tyre burst.", "He was driving when the tyre burst.", "He drove when the tyre was bursting.", "He was driving when the tyre was bursting."], correctIndex: 1, explanation: "Background: was driving. Interruption: tyre burst (Simple)." },
      { id: "3-5", prompt: "Which is correct?", options: ["I had a shower when you knocked.", "I was having a shower when you knocked.", "I had a shower when you were knocking.", "I was having a shower when you were knocking."], correctIndex: 1, explanation: "Background: was having a shower. Interruption: you knocked (Simple)." },
      { id: "3-6", prompt: "Which is correct?", options: ["We ate when the power cut happened.", "We were eating when the power cut happened.", "We ate when the power cut was happening.", "We were eating when the power cut was happening."], correctIndex: 1, explanation: "Background: were eating. Interruption: power cut happened (Simple)." },
      { id: "3-7", prompt: "Which is correct?", options: ["She ran when she tripped.", "She was running when she tripped.", "She ran when she was tripping.", "She was running when she was tripping."], correctIndex: 1, explanation: "Background: was running. Interruption: she tripped (Simple)." },
      { id: "3-8", prompt: "Which is correct?", options: ["He slept when the phone rang.", "He was sleeping when the phone rang.", "He slept when the phone was ringing.", "He was sleeping when the phone was ringing."], correctIndex: 1, explanation: "Background: was sleeping. Interruption: phone rang (Simple)." },
      { id: "3-9", prompt: "Which is correct?", options: ["I walked when I saw the accident.", "I was walking when I saw the accident.", "I walked when I was seeing the accident.", "I was walking when I was seeing the accident."], correctIndex: 1, explanation: "Background: was walking. Interruption: I saw the accident (Simple)." },
      { id: "3-10", prompt: "Which is correct?", options: ["They swam when the shark appeared.", "They were swimming when the shark appeared.", "They swam when the shark was appearing.", "They were swimming when the shark was appearing."], correctIndex: 1, explanation: "Background: were swimming. Interruption: shark appeared (Simple)." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed and tricky cases",
    instructions:
      "These sentences require careful thought. Sometimes 'when' introduces a period rather than a sudden interruption — think about the context.",
    questions: [
      { id: "4-1", prompt: "I met my best friend when I ___ at university.", options: ["studied", "was studying", "study", "studies"], correctIndex: 1, explanation: "'When I was studying' = background period → Past Continuous." },
      { id: "4-2", prompt: "When he got home, his children ___ in the garden.", options: ["played", "were playing", "play", "plays"], correctIndex: 1, explanation: "The children's action was already in progress when he arrived → Past Continuous." },
      { id: "4-3", prompt: "She ___ here when I was a student.", options: ["lived", "was living", "live", "lives"], correctIndex: 1, explanation: "Temporary state during a past period → Past Continuous: was living." },
      { id: "4-4", prompt: "He ___ in the middle of the story when she fell asleep.", options: ["talked", "was talking", "talk", "talks"], correctIndex: 1, explanation: "Background ongoing action: was talking." },
      { id: "4-5", prompt: "While she was waiting, she ___ a message on her phone.", options: ["was reading", "read", "reads", "reading"], correctIndex: 1, explanation: "'While she was waiting' = Continuous background; 'read' = completed action during that time → Simple." },
      { id: "4-6", prompt: "The moment I ___ the results, I called my parents.", options: ["was seeing", "saw", "see", "sees"], correctIndex: 1, explanation: "'The moment I saw' = short completed event → Past Simple." },
      { id: "4-7", prompt: "I ___ the dishes when I suddenly remembered the meeting.", options: ["washed", "was washing", "wash", "washes"], correctIndex: 1, explanation: "Background Continuous: was washing (then remembered = interruption)." },
      { id: "4-8", prompt: "He ___ a great career until he made that mistake.", options: ["was having", "had", "have", "has"], correctIndex: 0, explanation: "Long ongoing background state → Past Continuous: was having." },
      { id: "4-9", prompt: "She ___ to explain when I interrupted her.", options: ["tried", "was trying", "try", "tries"], correctIndex: 1, explanation: "Ongoing attempt interrupted → Past Continuous: was trying." },
      { id: "4-10", prompt: "Just as they ___ to leave, the phone rang.", options: ["were about", "about", "was about", "are about"], correctIndex: 0, explanation: "\"were about to\" = past Continuous pattern for an action that was just about to start." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Continuous background",
  2: "Simple interruption",
  3: "Full pattern",
  4: "Mixed/tricky",
};

function Formula({ parts }: { parts: Array<{ text: string; color?: string; dim?: boolean }> }) {
  const colors: Record<string, string> = {
    sky:    "bg-sky-100 text-sky-800 border-sky-200",
    yellow: "bg-[#FFF3A3] text-amber-800 border-amber-300",
    red:    "bg-red-100 text-red-800 border-red-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200",
    slate:  "bg-slate-100 text-slate-600 border-slate-200",
    green:  "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) =>
        p.dim ? (
          <span key={i} className="text-slate-400 font-bold text-sm">+</span>
        ) : (
          <span key={i} className={`rounded-lg px-2.5 py-1 text-xs font-black border ${p.color ? colors[p.color] : colors.slate}`}>
            {p.text}
          </span>
        )
      )}
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

export default function InterruptedActionsClient() {
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
    setChecked(false);
    setAnswers({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    setExNo(n);
    setChecked(false);
    setAnswers({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function checkAnswers() {
    setChecked(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          <a className="hover:text-slate-900 transition" href="/tenses/past-continuous">Past Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Interrupted Actions</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Interrupted Actions</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">Intermediate</span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 border border-slate-200">B1</span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          The classic interrupted action: I was doing something (Continuous) <b>WHEN</b> something happened (Simple). 40 questions to perfect this pattern.
        </p>

        {/* 3-col grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left ad */}
          <AdUnit variant="sidebar-dark" />

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
              <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
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
                      const chosen = answers[q.id] ?? null;
                      const isCorrect = checked && chosen === q.correctIndex;
                      const isWrong = checked && chosen !== null && chosen !== q.correctIndex;
                      const noAnswer = checked && chosen === null;
                      return (
                        <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-900">{q.prompt}</div>
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => (
                                  <label
                                    key={oi}
                                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition ${
                                      chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"
                                    } ${checked ? "cursor-default" : ""}`}
                                  >
                                    <input
                                      type="radio"
                                      name={q.id}
                                      disabled={checked}
                                      checked={chosen === oi}
                                      onChange={() => setAnswers((p) => ({ ...p, [q.id]: oi }))}
                                      className="accent-[#F5DA20]"
                                    />
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
                                    <b className="text-slate-900">Correct answer:</b>{" "}
                                    {q.options[q.correctIndex]} — {q.explanation}
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
                        <button
                          onClick={checkAnswers}
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
                        className={`rounded-2xl border p-4 ${
                          score.percent >= 80
                            ? "border-emerald-200 bg-emerald-50"
                            : score.percent >= 50
                            ? "border-amber-200 bg-amber-50"
                            : "border-red-200 bg-red-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div
                              className={`text-3xl font-black ${
                                score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"
                              }`}
                            >
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
                            className={`h-2 rounded-full transition-all duration-500 ${
                              score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"
                            }`}
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
          <a
            href="/tenses/past-continuous/ps-vs-pc"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← PS vs Continuous
          </a>
          <a
            href="/tenses/past-continuous"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Back to Past Continuous →
          </a>
        </div>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Interrupted Actions — the Pattern</h2>
        <p className="text-slate-500 text-sm">Background action + short interruption — two tenses working together.</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🎬</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">The Background</span>
          </div>
          <Formula parts={[
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "was/were", color: "yellow" }, { dim: true, text: "+" },
            { text: "verb-ing", color: "green" }, { dim: true, text: "+" },
            { text: "(ongoing)", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I was walking home." />
            <Ex en="She was cooking dinner." />
            <Ex en="They were sleeping." />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⚡</span>
            <span className="text-sm font-black text-red-600 uppercase tracking-widest">The Interruption</span>
          </div>
          <Formula parts={[
            { text: "when", color: "red" }, { dim: true, text: "+" },
            { text: "Subject", color: "sky" }, { dim: true, text: "+" },
            { text: "Past Simple", color: "yellow" }, { dim: true, text: "+" },
            { text: "(short event!)", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="...when my phone rang." />
            <Ex en="...when the alarm went off." />
            <Ex en="...when he called." />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✅</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Complete Pattern</span>
          </div>
          <div className="mt-1 space-y-2">
            <Ex en="I was walking home when it started to rain." />
            <Ex en="She was cooking when the fire alarm went off." />
            <Ex en="They were sleeping when the earthquake hit." />
          </div>
        </div>
      </div>

      {/* Timeline visualization */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">⏱</span>
          <h3 className="font-black text-slate-900">Timeline — how it works</h3>
        </div>
        <div className="font-mono text-sm bg-slate-50 rounded-xl p-4 space-y-3">
          <div className="text-slate-600">I was walking home&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;X&nbsp; it started to rain</div>
          <div className="text-emerald-600">=====[Continuous]======|===</div>
          <div className="text-slate-400 text-xs pl-24">↑ when (Simple)</div>
        </div>
        <p className="mt-3 text-sm text-slate-600">The <b>Continuous</b> action was already happening. Then the <b>Simple</b> action interrupted it at a specific moment.</p>
      </div>

      {/* Key examples */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-sm">📌</span>
          <h3 className="font-black text-slate-900">Key examples</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            "I was watching TV when the phone rang.",
            "She was having a shower when he knocked.",
            "We were eating lunch when the storm started.",
            "He was driving when a deer jumped into the road.",
          ].map((ex) => (
            <div key={ex} className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-sm font-semibold text-slate-800 italic">
              {ex}
            </div>
          ))}
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0">⚠</span>
          <div>
            <div className="font-black text-amber-800 mb-2">Use Simple for the interruption — NOT another Continuous!</div>
            <div className="text-sm text-amber-700 space-y-2">
              <div>
                <span className="font-mono font-semibold">I was reading when he called.</span>{" "}
                <span className="text-emerald-700 font-black">✅</span>
                <span className="text-xs ml-2 text-amber-600">(Continuous background → Simple interruption)</span>
              </div>
              <div>
                <span className="font-mono line-through opacity-60">I was reading when he was calling.</span>{" "}
                <span className="text-red-600 font-black">❌</span>
                <span className="text-xs ml-2 text-amber-600">(Two Continuous = simultaneous, not interrupted)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Was/were reminder */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sm">💡</span>
          <h3 className="font-black text-slate-900">Quick reminder: was vs were</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          {[
            { subj: "I", aux: "was working" },
            { subj: "He / She / It", aux: "was working" },
            { subj: "You", aux: "were working" },
            { subj: "We / They", aux: "were working" },
          ].map(({ subj, aux }) => (
            <div key={subj} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
              <span className="font-black text-slate-700">{subj}</span>
              <span className="font-mono text-sm text-slate-600">{aux}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
