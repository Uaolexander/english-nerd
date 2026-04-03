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
    title: "Exercise 1 — Mixed: had / hadn't / Had I?",
    instructions:
      "Choose the correct Past Perfect form. Each question mixes affirmative (had), negative (hadn't), and question (Had) forms — read the context carefully to decide which form fits.",
    questions: [
      { id: "1-1",  prompt: "She ___ already left when I arrived.",                        options: ["have", "had", "has", "did"],              correctIndex: 1, explanation: "Affirmative: she had already left. 'had' is the same for ALL subjects in Past Perfect." },
      { id: "1-2",  prompt: "He ___ spoken to her since their argument last week.",        options: ["hasn't", "hadn't", "didn't", "wasn't"],    correctIndex: 1, explanation: "Negative: he hadn't spoken. Use 'hadn't' — not 'hasn't', which is Present Perfect." },
      { id: "1-3",  prompt: "___ they finished the report before the deadline?",           options: ["Have", "Did", "Had", "Were"],              correctIndex: 2, explanation: "Past Perfect question: Had they finished…? — 'Had' inverts with the subject." },
      { id: "1-4",  prompt: "By the time we arrived, dinner ___ already started.",        options: ["has", "have", "had", "was"],               correctIndex: 2, explanation: "Affirmative: dinner had already started. 'By the time' + past event → Past Perfect." },
      { id: "1-5",  prompt: "I ___ seen anything so beautiful before that moment.",       options: ["haven't", "hadn't", "didn't", "wasn't"],   correctIndex: 1, explanation: "Negative: I hadn't seen — the experience was entirely new up to that past point." },
      { id: "1-6",  prompt: "___ she ever lived abroad before moving to Paris?",          options: ["Has", "Did", "Was", "Had"],                correctIndex: 3, explanation: "Past Perfect question: Had she ever lived…? — asking about experience before a past event." },
      { id: "1-7",  prompt: "The match ___ already ended when we turned on the TV.",      options: ["has", "have", "had", "was"],               correctIndex: 2, explanation: "Affirmative: the match had already ended. Completed before another past action." },
      { id: "1-8",  prompt: "They ___ met before the conference, so it was awkward.",     options: ["haven't", "hadn't", "didn't", "weren't"],  correctIndex: 1, explanation: "Negative: they hadn't met — they were strangers up to that point." },
      { id: "1-9",  prompt: "___ he left a message before he hung up?",                   options: ["Has", "Have", "Did", "Had"],               correctIndex: 3, explanation: "Past Perfect question: Had he left…? — asking if an action occurred before another past event." },
      { id: "1-10", prompt: "We ___ been to Greece before, so everything was new.",       options: ["haven't", "hadn't", "didn't", "weren't"],  correctIndex: 1, explanation: "Negative: we hadn't been — it was our first time. 'hadn't' is the Past Perfect negative." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Sequence: before / after / when / by the time",
    instructions:
      "Choose the correct Past Perfect form. These sentences describe two past events — the earlier one uses Past Perfect (had / hadn't / Had).",
    questions: [
      { id: "2-1",  prompt: "Before she phoned, I ___ already eaten dinner.",              options: ["have", "has", "had", "did"],              correctIndex: 2, explanation: "Affirmative: I had already eaten — completed before she phoned." },
      { id: "2-2",  prompt: "When we arrived, they ___ still not served any food.",        options: ["haven't", "hadn't", "didn't", "weren't"], correctIndex: 1, explanation: "Negative: they hadn't served — the food wasn't ready even by the time we arrived." },
      { id: "2-3",  prompt: "___ the film started before you bought the popcorn?",         options: ["Have", "Did", "Had", "Was"],               correctIndex: 2, explanation: "Past Perfect question: Had the film started…? — before a second past event." },
      { id: "2-4",  prompt: "By the time the taxi arrived, we ___ waited for an hour.",   options: ["have", "has", "had", "were"],              correctIndex: 2, explanation: "Affirmative: we had waited for an hour. 'By the time' triggers Past Perfect." },
      { id: "2-5",  prompt: "She told him she ___ never heard of the band before.",        options: ["has", "hadn't", "have", "didn't"],         correctIndex: 1, explanation: "Negative in reported speech: she hadn't heard — backshifted from 'I've never heard'." },
      { id: "2-6",  prompt: "He ___ been to Japan before, so everything felt exciting.",  options: ["haven't", "hadn't", "didn't", "wasn't"],   correctIndex: 1, explanation: "Negative: he hadn't been — his first visit ever." },
      { id: "2-7",  prompt: "By 2020, they ___ lived in the same house for ten years.",   options: ["have", "has", "had", "were"],              correctIndex: 2, explanation: "Affirmative: they had lived — 'by [year]' with a past result → Past Perfect." },
      { id: "2-8",  prompt: "___ anyone told you the news before you arrived?",           options: ["Has", "Have", "Did", "Had"],               correctIndex: 3, explanation: "Past Perfect question: Had anyone told you…? — before the arrival." },
      { id: "2-9",  prompt: "After he ___ finished work, he went straight to the gym.",   options: ["has", "have", "had", "was"],               correctIndex: 2, explanation: "Affirmative: after he had finished — the earlier of two past actions." },
      { id: "2-10", prompt: "We checked in after we ___ dropped off our bags.",           options: ["have", "hadn't", "had", "were"],           correctIndex: 2, explanation: "Affirmative: after we had dropped off — the dropping off came first." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Dialogues and short answers",
    instructions:
      "Choose the correct short answer or missing Past Perfect form in these dialogues. Short answers always repeat 'had' or 'hadn't' — never 'have', 'has', or 'did'.",
    questions: [
      { id: "3-1",  prompt: "\"Had you eaten before you left?\" — \"Yes, ___.\"",          options: ["I have", "I did", "I had", "I was"],             correctIndex: 2, explanation: "Short positive answer: Yes, I had. Repeat the auxiliary 'had'." },
      { id: "3-2",  prompt: "\"Had she called?\" — \"No, ___.\"",                          options: ["she hasn't", "she hadn't", "she didn't", "she wasn't"], correctIndex: 1, explanation: "Short negative answer: No, she hadn't. Use 'hadn't' for Past Perfect short answers." },
      { id: "3-3",  prompt: "___ the storm passed by the time they left the shelter?",     options: ["Has", "Did", "Was", "Had"],                      correctIndex: 3, explanation: "Past Perfect question: Had the storm passed…? — 'Had' inverts with the subject." },
      { id: "3-4",  prompt: "\"Had they finished?\" — \"Yes, ___.\"",                      options: ["they did", "they have", "they had", "they were"], correctIndex: 2, explanation: "Short positive answer: Yes, they had. The auxiliary is always 'had' in Past Perfect." },
      { id: "3-5",  prompt: "He told me he ___ seen the film already, so I went alone.",   options: ["has", "had", "have", "was"],                     correctIndex: 1, explanation: "Reported speech: he had seen — backshift from 'I have seen' → 'he had seen'." },
      { id: "3-6",  prompt: "The guests ___ arrived yet when we sat down to eat.",         options: ["haven't", "hadn't", "didn't", "weren't"],        correctIndex: 1, explanation: "Negative: the guests hadn't arrived — they were still on their way." },
      { id: "3-7",  prompt: "\"Had it rained?\" — \"No, ___.\"",                           options: ["it hadn't", "it hasn't", "it didn't", "it wasn't"], correctIndex: 0, explanation: "Short negative: No, it hadn't. Always use 'hadn't' for Past Perfect short answers." },
      { id: "3-8",  prompt: "By the time I woke up, she ___ already left for work.",       options: ["has", "have", "had", "was"],                     correctIndex: 2, explanation: "Affirmative: she had already left — completed before I woke up." },
      { id: "3-9",  prompt: "___ he spoken to her before the meeting started?",            options: ["Has", "Have", "Did", "Had"],                     correctIndex: 3, explanation: "Past Perfect question: Had he spoken…? — before another past event." },
      { id: "3-10", prompt: "\"Had the children eaten?\" — \"Yes, ___.\"",                 options: ["they did", "they have", "they had", "they were"], correctIndex: 2, explanation: "Short positive answer: Yes, they had. 'the children' = 'they' in the answer." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — All forms: harder mixed sentences",
    instructions:
      "Choose the correct Past Perfect form. All three forms appear (had, hadn't, Had) alongside common confusers. Read the full sentence context before choosing.",
    questions: [
      { id: "4-1",  prompt: "I ___ never eaten Thai food before I visited Bangkok.",       options: ["have", "had", "has", "did"],              correctIndex: 1, explanation: "Affirmative: I had never eaten — experience before a past event. 'had' for all subjects." },
      { id: "4-2",  prompt: "She ___ not realised how tired she was until she sat down.",  options: ["hasn't", "hadn't", "didn't", "wasn't"],   correctIndex: 1, explanation: "Negative: she hadn't realised — use 'hadn't', not 'hasn't' (wrong tense)." },
      { id: "4-3",  prompt: "___ he left a message before he hung up?",                    options: ["Has", "Have", "Did", "Had"],               correctIndex: 3, explanation: "Past Perfect question: Had he left…? — 'Had' starts the question." },
      { id: "4-4",  prompt: "She ___ just fallen asleep when the phone rang.",             options: ["has", "had", "have", "was"],               correctIndex: 1, explanation: "Affirmative: she had just fallen asleep — earlier of two past actions." },
      { id: "4-5",  prompt: "By the time the ambulance arrived, he ___ already recovered.", options: ["has", "have", "had", "was"],             correctIndex: 2, explanation: "Affirmative: he had already recovered — completed before the ambulance arrived." },
      { id: "4-6",  prompt: "They ___ never met before, yet they immediately got along.",  options: ["haven't", "hadn't", "didn't", "weren't"], correctIndex: 1, explanation: "Negative: they hadn't met — strangers up to that point. 'hadn't' not 'haven't'." },
      { id: "4-7",  prompt: "After she ___ read the letter, she burst into tears.",        options: ["has", "had", "have", "was"],               correctIndex: 1, explanation: "Affirmative: after she had read — 'after' + earlier past action → Past Perfect." },
      { id: "4-8",  prompt: "___ you eaten before you left the house?",                    options: ["Have", "Did", "Had", "Were"],              correctIndex: 2, explanation: "Past Perfect question: Had you eaten…? — before leaving (another past event)." },
      { id: "4-9",  prompt: "He ___ spoken to anyone about the problem before the meeting.", options: ["hasn't", "hadn't", "didn't", "wasn't"], correctIndex: 1, explanation: "Negative: he hadn't spoken — no one knew until the meeting." },
      { id: "4-10", prompt: "By 2020, the company ___ sold over a million units.",         options: ["has", "have", "had", "was"],               correctIndex: 2, explanation: "Affirmative: the company had sold — 'by [past year]' → Past Perfect." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Mixed forms",
  2: "Sequence",
  3: "Dialogues",
  4: "Hard mixed",
};

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function HadPastParticipleClient() {
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
          <a className="hover:text-slate-900 transition" href="/tenses/past-perfect">Past Perfect</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">had / hadn&apos;t / Had I?</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">had / hadn&apos;t / Had I?</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">Easy</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">B1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions to master the auxiliary verb <b>had</b>: affirmatives, negatives with <b>hadn&apos;t</b>, questions with <b>Had</b>, and short answers.
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
              <div className="ml-auto hidden sm:flex items-center gap-2">
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
                    <div className="mt-3 flex sm:hidden items-center gap-2">
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
          <a href="/tenses/past-perfect" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Past Perfect exercises</a>
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
            { text: "had", color: "yellow" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="She had already left when I arrived." />
            <Ex en="They had finished dinner by 8 pm." />
            <Ex en="I had never seen anything like it." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "hadn't", color: "red" },
            { text: "past participle", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="He hadn't eaten anything all day." />
            <Ex en="We hadn't met before the conference." />
            <Ex en="She hadn't realised what happened." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Had", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "past participle", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Had she ever lived abroad?" />
            <Ex en="Had they finished by noon?" />
            <Ex en="Had you met him before?" />
          </div>
        </div>
      </div>

      {/* had table — same for ALL subjects */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">had — same for ALL subjects</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Affirmative</th>
                <th className="px-4 py-2.5 font-black text-red-700">Negative</th>
                <th className="px-4 py-2.5 font-black text-sky-700">Question</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I", "I had gone", "I hadn't gone", "Had I gone?"],
                ["you", "you had gone", "you hadn't gone", "Had you gone?"],
                ["he / she / it", "she had gone", "she hadn't gone", "Had she gone?"],
                ["we", "we had gone", "we hadn't gone", "Had we gone?"],
                ["they", "they had gone", "they hadn't gone", "Had they gone?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs">{aff}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-xs">{neg}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-xs">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Key rule:</span> <b>had</b> is the same for ALL persons — I had, she had, they had. There is NO &ldquo;has&rdquo; or &ldquo;have&rdquo; in Past Perfect.<br />
          <span className="text-xs mt-1 block">She <b>had</b> finished ✅ &nbsp; She <b>has</b> finished ❌ (that&apos;s Present Perfect) &nbsp; | &nbsp; The word after &lsquo;had&rsquo; must be the <b>past participle</b>.</span>
        </div>
      </div>

      {/* Short answers */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Short answers</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Question</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Yes answer</th>
                <th className="px-4 py-2.5 font-black text-red-700">No answer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Had you seen him?", "Yes, I had.", "No, I hadn't."],
                ["Had she finished?", "Yes, she had.", "No, she hadn't."],
                ["Had they arrived?", "Yes, they had.", "No, they hadn't."],
                ["Had it worked?", "Yes, it had.", "No, it hadn't."],
              ].map(([q, yes, no], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-slate-700 font-mono text-xs">{q}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs">{yes}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-xs">{no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">Remember:</span> In short answers, always repeat <b>had</b> or <b>hadn&apos;t</b> — never &ldquo;did&rdquo; or the main verb.<br />
          <span className="text-xs">&ldquo;Had you met her?&rdquo; → &ldquo;Yes, I <b>had</b>.&rdquo; ✅ &nbsp; &ldquo;Yes, I <b>did</b>.&rdquo; ❌</span>
        </div>
      </div>

    </div>
  );
}
