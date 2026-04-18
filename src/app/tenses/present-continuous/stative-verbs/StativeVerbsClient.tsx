"use client";

import { useMemo, useState, useEffect } from "react";
import { useLiveSync } from "@/lib/useLiveSync";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { PC_SPEED_QUESTIONS, PC_PDF_CONFIG } from "../pcSharedData";

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
    title: "Exercise 1 — Is it stative or active?",
    instructions:
      "Stative verbs describe states (know, want, love). Active verbs describe actions (run, write, eat). Stative verbs are NOT used in the continuous form. Choose the correct sentence.",
    questions: [
      { id: "1-1", prompt: "I ___ what you mean.", options: ["am knowing", "know", "am know", "knowing"], correctIndex: 1, explanation: "\"know\" is stative → Present Simple: I know what you mean." },
      { id: "1-2", prompt: "She ___ to music right now.", options: ["listens", "listen", "is listen", "is listening"], correctIndex: 3, explanation: "\"listen\" is active → Present Continuous: is listening." },
      { id: "1-3", prompt: "He ___ coffee. He never drinks tea.", options: ["is loving", "loves", "is love", "love"], correctIndex: 1, explanation: "\"love\" is stative (a feeling/preference) → Present Simple: loves." },
      { id: "1-4", prompt: "They ___ a new project at the moment.", options: ["work", "works", "is working", "are working"], correctIndex: 3, explanation: "\"work\" is active → Present Continuous: are working." },
      { id: "1-5", prompt: "I ___ a headache right now.", options: ["am having", "having", "have", "has"], correctIndex: 2, explanation: "\"have\" = possess/experience a state → stative → Present Simple: I have a headache." },
      { id: "1-6", prompt: "She ___ the door. Please wait.", options: ["opens", "open", "is opening", "are opening"], correctIndex: 2, explanation: "\"open\" = physical action → active → Present Continuous: is opening." },
      { id: "1-7", prompt: "We ___ that the answer is correct.", options: ["are believing", "believe", "are believe", "believing"], correctIndex: 1, explanation: "\"believe\" is stative (a mental state) → Present Simple: believe." },
      { id: "1-8", prompt: "He ___ his car — it's in the garage.", options: ["is repairing", "repaired", "repairs", "repair"], correctIndex: 0, explanation: "\"repair\" is active → Present Continuous: is repairing." },
      { id: "1-9", prompt: "I ___ an interesting book at the moment.", options: ["read", "reads", "am reading", "are reading"], correctIndex: 2, explanation: "\"read\" = active action in progress → Present Continuous: am reading." },
      { id: "1-10", prompt: "This soup ___ delicious!", options: ["is smelling", "are smelling", "smells", "smell"], correctIndex: 2, explanation: "\"smell\" = sensation/perception → stative → Present Simple: smells." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Mental and emotional stative verbs",
    instructions:
      "Verbs of thinking and feeling are almost always stative: know, understand, believe, think (= opinion), remember, forget, mean, want, need, prefer, love, hate, like, dislike.",
    questions: [
      { id: "2-1", prompt: "I ___ the answer now!", options: ["am remembering", "remember", "remembers", "am remember"], correctIndex: 1, explanation: "\"remember\" is stative → Present Simple: I remember the answer." },
      { id: "2-2", prompt: "She ___ to go home early today.", options: ["is wanting", "wants", "want", "are wanting"], correctIndex: 1, explanation: "\"want\" is stative (desire) → Present Simple: wants." },
      { id: "2-3", prompt: "They ___ the film — they're laughing a lot.", options: ["enjoy", "are enjoying", "is enjoying", "enjoyed"], correctIndex: 1, explanation: "\"enjoy\" can be used in continuous when describing an ongoing active experience: are enjoying." },
      { id: "2-4", prompt: "He ___ what she is saying.", options: ["is understanding", "understands", "understand", "are understanding"], correctIndex: 1, explanation: "\"understand\" is stative → Present Simple: understands." },
      { id: "2-5", prompt: "I ___ to get a new job. I'm looking now.", options: ["am needing", "needs", "need", "are needing"], correctIndex: 2, explanation: "\"need\" is stative → Present Simple: I need to get a new job." },
      { id: "2-6", prompt: "She ___ she's right about this.", options: ["is thinking", "think", "thinks", "are thinking"], correctIndex: 2, explanation: "\"think\" = opinion (stative) → Present Simple: thinks. Compare: She's thinking about the problem (active)." },
      { id: "2-7", prompt: "Do you ___ her name?", options: ["knowing", "are knowing", "knows", "know"], correctIndex: 3, explanation: "\"know\" is stative → Present Simple in question: Do you know?" },
      { id: "2-8", prompt: "He ___ rock music. He listens to it all day.", options: ["is preferring", "prefer", "prefers", "are preferring"], correctIndex: 2, explanation: "\"prefer\" is stative → Present Simple: prefers." },
      { id: "2-9", prompt: "I ___ what you mean by that.", options: ["am meaning", "am understanding", "understand", "is understanding"], correctIndex: 2, explanation: "\"understand\" is stative → Present Simple: I understand." },
      { id: "2-10", prompt: "We ___ your help right now.", options: ["are needing", "need", "is needing", "needs"], correctIndex: 1, explanation: "\"need\" is stative → Present Simple: We need." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Perception and sense verbs",
    instructions:
      "Sense verbs (see, hear, smell, taste, feel) are stative when they describe involuntary perception. But they can be used in continuous when describing a deliberate action.",
    questions: [
      { id: "3-1", prompt: "I ___ something burning! Can you smell it?", options: ["am smelling", "smell", "is smelling", "smells"], correctIndex: 1, explanation: "\"smell\" = involuntary perception (stative) → Present Simple: I smell something burning." },
      { id: "3-2", prompt: "The chef ___ the sauce to check if it's ready.", options: ["tastes", "taste", "is tasting", "are tasting"], correctIndex: 2, explanation: "\"taste\" = deliberate action (active) → Present Continuous: is tasting." },
      { id: "3-3", prompt: "This cake ___ amazing.", options: ["is tasting", "are tasting", "tastes", "taste"], correctIndex: 2, explanation: "\"taste\" = perception/quality (stative) → Present Simple: tastes." },
      { id: "3-4", prompt: "Can you hear that? The neighbours ___ music.", options: ["are playing", "plays", "play", "is playing"], correctIndex: 0, explanation: "\"play\" is active → Present Continuous: are playing. (Can you hear? = stative, involuntary.)" },
      { id: "3-5", prompt: "He ___ a specialist about his knee.", options: ["is seeing", "sees", "see", "are seeing"], correctIndex: 0, explanation: "\"see\" = meet/consult (active meaning) → Present Continuous: is seeing." },
      { id: "3-6", prompt: "I ___ a strange noise — do you hear it too?", options: ["am hearing", "hears", "hear", "am hear"], correctIndex: 2, explanation: "\"hear\" = involuntary perception (stative) → Present Simple: I hear a strange noise." },
      { id: "3-7", prompt: "This material ___ very soft.", options: ["is feeling", "feels", "feel", "are feeling"], correctIndex: 1, explanation: "\"feel\" = texture/quality (stative) → Present Simple: feels." },
      { id: "3-8", prompt: "She ___ better now — her temperature is down.", options: ["feels", "is feeling", "feel", "are feeling"], correctIndex: 1, explanation: "Both are possible here, but \"feel\" = health state tends to use simple: feels better." },
      { id: "3-9", prompt: "The flowers ___ beautiful.", options: ["are smelling", "smell", "smells", "is smelling"], correctIndex: 1, explanation: "\"smell\" = quality/sensation → stative → Present Simple: smell." },
      { id: "3-10", prompt: "I ___ you can do it. I have confidence in you.", options: ["am seeing", "see", "sees", "am seeing"], correctIndex: 1, explanation: "\"see\" = understand/believe (stative meaning) → Present Simple: I see." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: choose the right form",
    instructions:
      "Some verbs can be BOTH stative AND active depending on meaning. Think carefully about the context before choosing.",
    questions: [
      { id: "4-1", prompt: "I ___ about changing jobs — it's a big decision.", options: ["think", "thinks", "am thinking", "are thinking"], correctIndex: 2, explanation: "\"think about\" = active mental process (considering) → Present Continuous: am thinking." },
      { id: "4-2", prompt: "She ___ three languages fluently.", options: ["is speaking", "speaks", "speak", "are speaking"], correctIndex: 1, explanation: "\"speak\" = ability/habit → stative/habitual → Present Simple: speaks." },
      { id: "4-3", prompt: "He ___ a shower right now — call back later.", options: ["has", "have", "is having", "are having"], correctIndex: 2, explanation: "\"have\" = activity (take a shower) → active → Present Continuous: is having." },
      { id: "4-4", prompt: "They ___ two cars and a motorbike.", options: ["are owning", "own", "is owning", "owns"], correctIndex: 1, explanation: "\"own\" is always stative → Present Simple: own." },
      { id: "4-5", prompt: "I ___ tired of waiting. Let's go.", options: ["am getting", "gets", "get", "is getting"], correctIndex: 0, explanation: "\"get\" = changing state (becoming) → active/change → Present Continuous: am getting." },
      { id: "4-6", prompt: "We ___ a great time — the party is fantastic!", options: ["have", "has", "are having", "is having"], correctIndex: 2, explanation: "\"have a great time\" = experience (active) → Present Continuous: are having." },
      { id: "4-7", prompt: "She ___ her mother very much.", options: ["is resembling", "resembles", "resemble", "are resembling"], correctIndex: 1, explanation: "\"resemble\" is always stative → Present Simple: resembles." },
      { id: "4-8", prompt: "The kids ___ in the garden right now.", options: ["play", "plays", "are playing", "is playing"], correctIndex: 2, explanation: "\"play\" = active action in progress → Present Continuous: are playing." },
      { id: "4-9", prompt: "This dress ___ you perfectly.", options: ["is fitting", "fit", "are fitting", "fits"], correctIndex: 3, explanation: "\"fit\" = size/quality (stative) → Present Simple: fits." },
      { id: "4-10", prompt: "I ___ with you on this point. You're right.", options: ["am agreeing", "agree", "agrees", "is agreeing"], correctIndex: 1, explanation: "\"agree\" is stative → Present Simple: I agree." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Stative/Active",
  2: "Mental",
  3: "Perception",
  4: "Mixed",
};

/* ─── Helper components ─────────────────────────────────────────────────── */

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

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function StativeVerbsClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [pdfLoading, setPdfLoading] = useState(false);
  const isPro = useIsPro();

  const current = SETS[exNo];

  const { broadcast } = useLiveSync((payload) => {
    setAnswers(payload.answers as Record<string, number | null>);
    setChecked(payload.checked as boolean);
    setExNo(payload.exNo as 1 | 2 | 3 | 4);
  });

  const { save } = useProgress();

  async function handlePDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(PC_PDF_CONFIG); } finally { setPdfLoading(false); }
  }

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
    broadcast({ answers: {}, checked: false, exNo });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function switchSet(n: 1 | 2 | 3 | 4) {
    setExNo(n);
    setChecked(false);
    setAnswers({});
    broadcast({ answers: {}, checked: false, exNo: n });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function checkAnswers() {
    setChecked(true);
    broadcast({ answers, checked: true, exNo });
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
          <a className="hover:text-slate-900 transition" href="/tenses/present-continuous">Present Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Stative Verbs</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Stative Verbs</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700 border border-blue-200">Intermediate</span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 border border-slate-200">B1</span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Stative verbs describe <b>states</b>, not actions. They are <b>NOT</b> used in continuous tenses. 40 questions to master which verbs are stative.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className="">
              <div className=""><SpeedRound gameId="pc-stative-verbs" subject="Present Continuous" questions={PC_SPEED_QUESTIONS} variant="sidebar" /></div>
            </div>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}

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
              <PDFButton onDownload={handlePDF} loading={pdfLoading} />
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

                    {/* Mobile set switcher */}
                    <div className="mt-3 flex sm:hidden items-center gap-2 text-sm text-slate-600">
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

                  {/* Questions */}
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
                                      chosen === oi
                                        ? "border-[#F5DA20] bg-[#F5DA20]/20"
                                        : "border-black/10 bg-white hover:bg-black/5"
                                    } ${checked ? "cursor-default" : ""}`}
                                  >
                                    <input
                                      type="radio"
                                      name={q.id}
                                      disabled={checked}
                                      checked={chosen === oi}
                                      onChange={() =>
                                        { const newAnswers = { ...answers, [q.id]: oi }; setAnswers(newAnswers); broadcast({ answers: newAnswers, checked, exNo }); }
                                      }
                                      className="accent-[#F5DA20]"
                                    />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && (
                                    <div className="text-emerald-700 font-semibold">✅ Correct</div>
                                  )}
                                  {isWrong && (
                                    <div className="text-red-700 font-semibold">❌ Wrong</div>
                                  )}
                                  {noAnswer && (
                                    <div className="text-amber-700 font-semibold">⚠ No answer</div>
                                  )}
                                  <div className="mt-1.5 text-slate-600">
                                    <b className="text-slate-900">Correct answer:</b>{" "}
                                    {q.options[q.correctIndex]} —{" "}
                                    {q.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
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
                                score.percent >= 80
                                  ? "text-emerald-700"
                                  : score.percent >= 50
                                  ? "text-amber-700"
                                  : "text-red-700"
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
                              score.percent >= 80
                                ? "bg-emerald-500"
                                : score.percent >= 50
                                ? "bg-amber-500"
                                : "bg-red-500"
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

          {/* Right column */}
          {isPro ? (
            <aside className="flex flex-col gap-3">
              <p className="px-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">Recommended for you</p>
              {[
                { title: "-ing Spelling Rules", href: "/tenses/present-continuous/ing-forms", img: "/topics/exercises/ing-forms.jpg", level: "A2", badge: "bg-sky-500", reason: "Master -ing spelling" },
                { title: "Simple vs Continuous", href: "/tenses/present-continuous/ps-vs-pc", img: "/topics/exercises/ps-vs-pc.jpg", level: "A2", badge: "bg-amber-500", reason: "Compare both tenses" },
                { title: "Multiple Choice", href: "/tenses/present-continuous/quiz", img: "/topics/exercises/quiz.jpg", level: "A2", badge: "bg-emerald-500", reason: "Multiple choice practice" },
              ].map((rec) => (
                <a key={rec.href} href={rec.href} className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                    <img src={rec.img} alt={rec.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md ${rec.badge}`}>{rec.level}</span>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm font-bold leading-snug text-slate-800 transition group-hover:text-slate-900">{rec.title}</p>
                    {rec.reason && <p className="mt-1 text-[11px] font-semibold leading-snug text-amber-600">{rec.reason}</p>}
                  </div>
                </a>
              ))}
              <a href="/tenses/present-continuous" className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700">
                All Present Continuous
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </a>
            </aside>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}
        </div>

        {!isPro && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
            <div className="hidden lg:block" />
            <SpeedRound gameId="pc-stative-verbs" subject="Present Continuous" questions={PC_SPEED_QUESTIONS} />
            <div className="hidden lg:block" />
          </div>
        )}

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/present-continuous/ing-forms"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← -ing Spelling
          </a>
          <a
            href="/tenses/present-continuous/ps-vs-pc"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: Simple vs Continuous →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation tab ─────────────────────────────────────────────────────── */

function Explanation() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-1">Stative Verbs — Never Use -ing</h2>
        <p className="text-slate-500 text-sm">States, not actions — learn the categories and practise.</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🧠</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Mental Stative</span>
          </div>
          <Formula parts={[
            { text: "know / want / need", color: "yellow" }, { dim: true, text: "+" },
            { text: "→ Simple only", color: "green" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I know the answer." />
            <Ex en="She wants tea." />
            <Ex en="They need help." />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">❌</span>
            <span className="text-sm font-black text-red-600 uppercase tracking-widest">NOT in Continuous</span>
          </div>
          <Formula parts={[
            { text: "I am knowing", color: "red" },
          ]} />
          <div className="mt-3 space-y-2">
            <div className="rounded-xl bg-white border border-black/8 px-3 py-2.5">
              <div className="text-sm text-red-500 line-through">I am knowing the answer.</div>
              <div className="text-sm font-semibold text-emerald-700 mt-1">I know the answer. ✅</div>
            </div>
            <div className="rounded-xl bg-white border border-black/8 px-3 py-2.5">
              <div className="text-sm text-red-500 line-through">She is wanting coffee.</div>
              <div className="text-sm font-semibold text-emerald-700 mt-1">She wants coffee. ✅</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">👁</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Sense Perception</span>
          </div>
          <Formula parts={[
            { text: "see / hear / smell / taste / feel", color: "sky" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="I see a bird." />
            <Ex en="It tastes great." />
            <Ex en="I hear music." />
          </div>
        </div>
      </div>

      {/* Stative verbs grouped table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">Most common stative verbs by category</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Category</th>
                <th className="text-left font-black text-slate-500 pb-2">Verbs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Mental", "know, understand, believe, think*, remember, forget, mean, realise"],
                ["Desire", "want, need, prefer, wish, hope"],
                ["Feelings", "love, hate, like, dislike, adore, mind"],
                ["Senses", "see, hear, smell, taste, feel*"],
                ["Other", "have*, own, belong, contain, seem, appear, look*, cost, weigh, matter"],
              ].map(([cat, verbs]) => (
                <tr key={cat}>
                  <td className="py-2 pr-4 font-black text-slate-700 align-top">{cat}</td>
                  <td className="py-2 text-slate-600 font-mono text-xs leading-relaxed">{verbs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-400">* = can sometimes be active with a different meaning</p>

        {/* Amber warning */}
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>⚠ think, have, look, taste, feel, see</b> can be <b>BOTH stative AND active</b> — the meaning changes!<br />
          <span className="font-mono">think</span> (= believe) → Simple;{" "}
          <span className="font-mono">think</span> (= consider/ponder) → Continuous.
        </div>
      </div>

      {/* Wrong vs right grid */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-sm">✗</span>
          <h3 className="font-black text-slate-900">Wrong vs Right — common mistakes</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { wrong: "I am knowing the answer.", right: "I know the answer." },
            { wrong: "She is wanting coffee.", right: "She wants coffee." },
            { wrong: "He is owning three cars.", right: "He owns three cars." },
            { wrong: "They are believing you.", right: "They believe you." },
          ].map(({ wrong, right }) => (
            <div key={wrong} className="rounded-xl border border-black/8 bg-black/[0.02] px-3 py-2.5">
              <div className="text-sm text-red-500 line-through">{wrong} ❌</div>
              <div className="text-sm font-semibold text-emerald-700 mt-1">{right} ✅</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
