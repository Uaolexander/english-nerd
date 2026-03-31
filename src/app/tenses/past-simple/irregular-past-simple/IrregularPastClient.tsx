"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";

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
    title: "Exercise 1 — The most essential irregulars",
    instructions:
      "These are the most common irregular verbs. Learn them by heart: be→was/were, have→had, do→did, go→went, come→came, get→got, make→made, take→took, say→said, know→knew.",
    questions: [
      { id: "1-1", prompt: "She ___ very tired after the long journey.", options: ["was", "were", "be", "is"], correctIndex: 0, explanation: "be → was (I/he/she/it) / were (you/we/they): She was tired." },
      { id: "1-2", prompt: "I ___ a great idea yesterday!", options: ["have", "has", "had", "haved"], correctIndex: 2, explanation: "have → had: I had a great idea." },
      { id: "1-3", prompt: "He ___ to the shop and ___ back quickly.", options: ["goes / comes", "went / came", "go / come", "went / come"], correctIndex: 1, explanation: "go → went, come → came: He went and came back." },
      { id: "1-4", prompt: "We ___ the train at 8am.", options: ["taked", "took", "takes", "take"], correctIndex: 1, explanation: "take → took: We took the train." },
      { id: "1-5", prompt: "She ___ me to call her back.", options: ["sayed", "said", "says", "say"], correctIndex: 1, explanation: "say → said: She said to call her back." },
      { id: "1-6", prompt: "I ___ the answer, but I forgot it!", options: ["knew", "know", "knowed", "knows"], correctIndex: 0, explanation: "know → knew: I knew the answer." },
      { id: "1-7", prompt: "They ___ a big mistake.", options: ["maked", "make", "makes", "made"], correctIndex: 3, explanation: "make → made: They made a big mistake." },
      { id: "1-8", prompt: "He ___ a new job last year.", options: ["getted", "got", "gets", "get"], correctIndex: 1, explanation: "get → got: He got a new job." },
      { id: "1-9", prompt: "We ___ our homework before dinner.", options: ["doed", "did", "does", "do"], correctIndex: 1, explanation: "do → did: We did our homework." },
      { id: "1-10", prompt: "They ___ happy to see us.", options: ["was", "are", "been", "were"], correctIndex: 3, explanation: "be → were (they/we/you): They were happy." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Movement and action verbs",
    instructions:
      "Common action verbs: see→saw, give→gave, find→found, leave→left, buy→bought, bring→brought, think→thought, feel→felt, meet→met, run→ran.",
    questions: [
      { id: "2-1", prompt: "She ___ him at the conference last week.", options: ["meeted", "met", "mets", "meet"], correctIndex: 1, explanation: "meet → met: She met him at the conference." },
      { id: "2-2", prompt: "I ___ my keys — they were in my bag.", options: ["finded", "found", "finds", "find"], correctIndex: 1, explanation: "find → found: I found my keys." },
      { id: "2-3", prompt: "He ___ her flowers for her birthday.", options: ["buyed", "buy", "bought", "bringed"], correctIndex: 2, explanation: "buy → bought: He bought her flowers." },
      { id: "2-4", prompt: "They ___ home early because of the storm.", options: ["leaved", "left", "leave", "lefted"], correctIndex: 1, explanation: "leave → left: They left home early." },
      { id: "2-5", prompt: "I ___ a great film last night.", options: ["seed", "saw", "see", "sees"], correctIndex: 1, explanation: "see → saw: I saw a great film." },
      { id: "2-6", prompt: "She ___ me a gift from Paris.", options: ["bringed", "brung", "brought", "bring"], correctIndex: 2, explanation: "bring → brought: She brought me a gift." },
      { id: "2-7", prompt: "He ___ about the problem all day.", options: ["thinked", "thought", "think", "thinks"], correctIndex: 1, explanation: "think → thought: He thought about the problem." },
      { id: "2-8", prompt: "I ___ ill after eating that food.", options: ["feeled", "felt", "feel", "felled"], correctIndex: 1, explanation: "feel → felt: I felt ill after eating." },
      { id: "2-9", prompt: "She ___ him a lot of money.", options: ["gaved", "give", "gave", "gives"], correctIndex: 2, explanation: "give → gave: She gave him a lot of money." },
      { id: "2-10", prompt: "He ___ a marathon last year!", options: ["runned", "ran", "run", "runs"], correctIndex: 1, explanation: "run → ran: He ran a marathon." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Verbs with same present and past form",
    instructions:
      "Some irregular verbs have the same form in present and past: put→put, cut→cut, let→let, hit→hit, read→read (pronounced 'red'), hurt→hurt, cost→cost.",
    questions: [
      { id: "3-1", prompt: "She ___ the letter on the table and left.", options: ["putted", "putting", "puts", "put"], correctIndex: 3, explanation: "put → put (no change): She put the letter on the table." },
      { id: "3-2", prompt: "He ___ his hand while cooking.", options: ["cutted", "cutting", "cut", "cuts"], correctIndex: 2, explanation: "cut → cut (no change): He cut his hand." },
      { id: "3-3", prompt: "She ___ me borrow her car.", options: ["letted", "let", "lets", "letting"], correctIndex: 1, explanation: "let → let (no change): She let me borrow her car." },
      { id: "3-4", prompt: "He ___ the ball into the goal.", options: ["hitted", "hitting", "hits", "hit"], correctIndex: 3, explanation: "hit → hit (no change): He hit the ball into the goal." },
      { id: "3-5", prompt: "I ___ that book last summer.", options: ["readed", "red", "reads", "read"], correctIndex: 3, explanation: "\"read\" past tense is spelled the same but pronounced 'red': read → read." },
      { id: "3-6", prompt: "He ___ his ankle during the match.", options: ["hurted", "hurts", "hurting", "hurt"], correctIndex: 3, explanation: "hurt → hurt (no change): He hurt his ankle." },
      { id: "3-7", prompt: "The holiday ___ a lot — but it was worth it.", options: ["costed", "costing", "costs", "cost"], correctIndex: 3, explanation: "cost → cost (no change): The holiday cost a lot." },
      { id: "3-8", prompt: "She ___ down and didn't say anything.", options: ["setted", "sit", "sitted", "sat"], correctIndex: 3, explanation: "sit → sat (irregular): She sat down." },
      { id: "3-9", prompt: "They ___ the new policy to take effect immediately.", options: ["letted", "let", "lets", "letting"], correctIndex: 1, explanation: "let → let (no change): They let the policy take effect." },
      { id: "3-10", prompt: "The temperature ___ to -10°C last night.", options: ["falled", "fall", "falls", "fell"], correctIndex: 3, explanation: "fall → fell (irregular): The temperature fell to -10°C." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed irregular verbs",
    instructions:
      "All irregular verbs from Sets 1–3 plus new ones: write→wrote, speak→spoke, eat→ate, drink→drank, sleep→slept, wear→wore, lose→lost, win→won, grow→grew, swim→swam.",
    questions: [
      { id: "4-1", prompt: "She ___ a long letter to her friend.", options: ["writed", "wrote", "writes", "write"], correctIndex: 1, explanation: "write → wrote: She wrote a long letter." },
      { id: "4-2", prompt: "He ___ to the manager about the problem.", options: ["speaked", "spoke", "speaks", "speak"], correctIndex: 1, explanation: "speak → spoke: He spoke to the manager." },
      { id: "4-3", prompt: "We ___ dinner at 7pm.", options: ["eated", "eaten", "ate", "eat"], correctIndex: 2, explanation: "eat → ate: We ate dinner at 7pm." },
      { id: "4-4", prompt: "She ___ three glasses of water.", options: ["drinked", "drunk", "drank", "drink"], correctIndex: 2, explanation: "drink → drank: She drank three glasses of water." },
      { id: "4-5", prompt: "I ___ only four hours last night.", options: ["sleeped", "slept", "sleep", "sleeping"], correctIndex: 1, explanation: "sleep → slept: I slept only four hours." },
      { id: "4-6", prompt: "He ___ a red tie to the interview.", options: ["weared", "worn", "wore", "wear"], correctIndex: 2, explanation: "wear → wore: He wore a red tie." },
      { id: "4-7", prompt: "We ___ the match 3-0. Great game!", options: ["winned", "won", "win", "wins"], correctIndex: 1, explanation: "win → won: We won the match." },
      { id: "4-8", prompt: "She ___ her passport and had to get a new one.", options: ["losed", "losted", "lost", "lose"], correctIndex: 2, explanation: "lose → lost: She lost her passport." },
      { id: "4-9", prompt: "He ___ up on a farm in the countryside.", options: ["growed", "grown", "grew", "grow"], correctIndex: 2, explanation: "grow → grew: He grew up on a farm." },
      { id: "4-10", prompt: "I ___ across the lake — it was freezing!", options: ["swimmed", "swam", "swum", "swim"], correctIndex: 1, explanation: "swim → swam: I swam across the lake." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Essential",
  2: "Action verbs",
  3: "Same form",
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

export default function IrregularPastClient() {
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
          <a className="hover:text-slate-900 transition" href="/tenses/past-simple">Past Simple</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Irregular Verbs</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Irregular Verbs</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">Elementary</span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 border border-slate-200">A2</span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Irregular verbs don&apos;t follow the <b>-ed rule</b> — each one must be memorised. 40 MCQ questions covering the most essential irregular past forms.
        </p>

        {/* Three-column grid */}
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
                                        setAnswers((p) => ({ ...p, [q.id]: oi }))
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

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/past-simple/regular-past-simple"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← Regular Verbs
          </a>
          <a
            href="/tenses/past-simple/did-didnt"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: did / didn&apos;t →
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Irregular Verbs — Past Simple</h2>
        <p className="text-slate-500 text-sm">No rules — these must be memorised. Learn them in groups.</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📚</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">No Rule — Memorise!</span>
          </div>
          <Formula parts={[
            { text: "verb", color: "yellow" }, { dim: true, text: "+" },
            { text: "→ irregular past", color: "red" },
            { text: "(no -ed!)", color: "slate" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="go → went" />
            <Ex en="see → saw" />
            <Ex en="have → had" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">👥</span>
            <span className="text-sm font-black text-red-600 uppercase tracking-widest">Same for all subjects!</span>
          </div>
          <div className="mt-3 space-y-2">
            <Ex en="He went ✅" />
            <Ex en="She went ✅" />
            <Ex en="They went ✅" />
            <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2.5">
              <div className="font-semibold text-red-700 text-sm">She wented ❌</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔗</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Groups by pattern</span>
          </div>
          <div className="mt-3 space-y-2">
            <Ex en="think→thought, bring→brought, buy→bought" />
            <Ex en="find→found, wind→wound" />
            <Ex en="put→put, cut→cut, hit→hit" />
          </div>
        </div>
      </div>

      {/* Essential irregular verbs table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">The 30 most essential irregular verbs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-slate-500 pb-2 pr-6">Base form</th>
                <th className="text-left font-black text-emerald-600 pb-2 pr-6">Past simple</th>
                <th className="text-left font-black text-slate-500 pb-2 pr-6">Base form</th>
                <th className="text-left font-black text-emerald-600 pb-2">Past simple</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["be", "was / were", "see", "saw"],
                ["have", "had", "give", "gave"],
                ["do", "did", "find", "found"],
                ["go", "went", "leave", "left"],
                ["come", "came", "buy", "bought"],
                ["get", "got", "bring", "brought"],
                ["make", "made", "think", "thought"],
                ["take", "took", "feel", "felt"],
                ["say", "said", "meet", "met"],
                ["know", "knew", "run", "ran"],
                ["write", "wrote", "speak", "spoke"],
                ["eat", "ate", "drink", "drank"],
                ["sleep", "slept", "wear", "wore"],
                ["win", "won", "lose", "lost"],
                ["grow", "grew", "swim", "swam"],
              ].map(([base1, past1, base2, past2]) => (
                <tr key={base1}>
                  <td className="py-2 pr-6 font-mono font-black text-slate-700">{base1}</td>
                  <td className="py-2 pr-6 font-mono font-black text-emerald-700">{past1}</td>
                  <td className="py-2 pr-6 font-mono font-black text-slate-700">{base2}</td>
                  <td className="py-2 font-mono font-black text-emerald-700">{past2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Amber warning */}
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>⚠ wasn&apos;t / weren&apos;t (not &apos;didn&apos;t be&apos;!)</b><br />
          <span className="font-mono">He wasn&apos;t at home</span> ✅ /{" "}
          <span className="font-mono">He didn&apos;t be at home</span> ❌
        </div>
      </div>
    </div>
  );
}
