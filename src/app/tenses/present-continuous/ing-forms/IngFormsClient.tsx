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
    title: "Exercise 1 — Simply add -ing",
    instructions:
      "Most verbs just add -ing to the base form: work → working, eat → eating, play → playing. No spelling change needed.",
    questions: [
      { id: "1-1", prompt: "work → ___", options: ["workking", "working", "workes", "workeing"], correctIndex: 1, explanation: "Most verbs just add -ing: work → working." },
      { id: "1-2", prompt: "eat → ___", options: ["eatting", "eateing", "eating", "eats"], correctIndex: 2, explanation: "Ends in vowel+t but the vowel isn't stressed short — just add -ing: eat → eating." },
      { id: "1-3", prompt: "play → ___", options: ["plaing", "playying", "plays", "playing"], correctIndex: 3, explanation: "Ends in -ay, just add -ing: play → playing." },
      { id: "1-4", prompt: "read → ___", options: ["readding", "reading", "reads", "readeing"], correctIndex: 1, explanation: "Just add -ing: read → reading." },
      { id: "1-5", prompt: "talk → ___", options: ["talkking", "talking", "talkeing", "talkes"], correctIndex: 1, explanation: "Ends in two consonants (lk), just add -ing: talk → talking." },
      { id: "1-6", prompt: "sleep → ___", options: ["sleping", "sleeppping", "sleeping", "sleepeing"], correctIndex: 2, explanation: "Ends in double vowel+p, just add -ing: sleep → sleeping." },
      { id: "1-7", prompt: "watch → ___", options: ["watcing", "watchhing", "watcheing", "watching"], correctIndex: 3, explanation: "Ends in -ch, just add -ing: watch → watching." },
      { id: "1-8", prompt: "look → ___", options: ["lookin", "lookking", "looking", "lookeing"], correctIndex: 2, explanation: "Ends in double vowel+k, just add -ing: look → looking." },
      { id: "1-9", prompt: "wait → ___", options: ["waitting", "waiteing", "waiting", "waites"], correctIndex: 2, explanation: "Ends in vowel+t (ai = two vowels), just add -ing: wait → waiting." },
      { id: "1-10", prompt: "think → ___", options: ["thinkking", "thinking", "thinkeing", "thinkes"], correctIndex: 1, explanation: "Ends in two consonants (nk), just add -ing: think → thinking." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Double the final consonant",
    instructions:
      "If a verb ends in consonant-vowel-consonant (CVC) AND the last syllable is STRESSED, double the final consonant before adding -ing: run → running, sit → sitting.",
    questions: [
      { id: "2-1", prompt: "run → ___", options: ["runing", "running", "runeing", "runned"], correctIndex: 1, explanation: "CVC pattern (r-u-n), one syllable → double the n: run → running." },
      { id: "2-2", prompt: "sit → ___", options: ["siting", "sitting", "siteing", "sitted"], correctIndex: 1, explanation: "CVC (s-i-t), one syllable → double the t: sit → sitting." },
      { id: "2-3", prompt: "swim → ___", options: ["swiming", "swiming", "swimming", "swimmeing"], correctIndex: 2, explanation: "CVC (sw-i-m), one syllable → double the m: swim → swimming." },
      { id: "2-4", prompt: "stop → ___", options: ["stoping", "stopping", "stopeing", "stopes"], correctIndex: 1, explanation: "CVC (st-o-p), one syllable → double the p: stop → stopping." },
      { id: "2-5", prompt: "get → ___", options: ["geting", "getting", "geteing", "getted"], correctIndex: 1, explanation: "CVC (g-e-t), one syllable → double the t: get → getting." },
      { id: "2-6", prompt: "plan → ___", options: ["planing", "planning", "planeing", "plans"], correctIndex: 1, explanation: "CVC (pl-a-n), one syllable → double the n: plan → planning." },
      { id: "2-7", prompt: "begin → ___", options: ["begining", "beginning", "begineing", "begines"], correctIndex: 1, explanation: "Two syllables, stress on last (be-GIN), CVC → double the n: begin → beginning." },
      { id: "2-8", prompt: "cut → ___", options: ["cuting", "cutting", "cuteing", "cutted"], correctIndex: 1, explanation: "CVC (c-u-t), one syllable → double the t: cut → cutting." },
      { id: "2-9", prompt: "hit → ___", options: ["hiting", "hitting", "hiteing", "hitted"], correctIndex: 1, explanation: "CVC (h-i-t), one syllable → double the t: hit → hitting." },
      { id: "2-10", prompt: "put → ___", options: ["puting", "putting", "puteing", "putted"], correctIndex: 1, explanation: "CVC (p-u-t), one syllable → double the t: put → putting." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Drop the silent -e",
    instructions:
      "If a verb ends in a silent -e, drop the -e before adding -ing: make → making, dance → dancing, write → writing.",
    questions: [
      { id: "3-1", prompt: "make → ___", options: ["makeing", "makking", "making", "maked"], correctIndex: 2, explanation: "Drop the silent -e: make → making." },
      { id: "3-2", prompt: "write → ___", options: ["writeing", "writing", "writeting", "writed"], correctIndex: 1, explanation: "Drop the silent -e: write → writing." },
      { id: "3-3", prompt: "dance → ___", options: ["danceing", "danccing", "dancing", "dances"], correctIndex: 2, explanation: "Drop the silent -e: dance → dancing." },
      { id: "3-4", prompt: "have → ___", options: ["haveing", "having", "havving", "haves"], correctIndex: 1, explanation: "Drop the silent -e: have → having." },
      { id: "3-5", prompt: "drive → ___", options: ["driveing", "driving", "drivving", "drived"], correctIndex: 1, explanation: "Drop the silent -e: drive → driving." },
      { id: "3-6", prompt: "take → ___", options: ["takeing", "takking", "taking", "taked"], correctIndex: 2, explanation: "Drop the silent -e: take → taking." },
      { id: "3-7", prompt: "smile → ___", options: ["smileing", "smilling", "smiling", "smiles"], correctIndex: 2, explanation: "Drop the silent -e: smile → smiling." },
      { id: "3-8", prompt: "come → ___", options: ["comeing", "comming", "coming", "comes"], correctIndex: 2, explanation: "Drop the silent -e: come → coming." },
      { id: "3-9", prompt: "live → ___", options: ["liveing", "livving", "living", "lives"], correctIndex: 2, explanation: "Drop the silent -e: live → living." },
      { id: "3-10", prompt: "use → ___", options: ["useing", "ussing", "using", "uses"], correctIndex: 2, explanation: "Drop the silent -e: use → using." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Change -ie to -y",
    instructions:
      "Verbs ending in -ie: change -ie to -y before adding -ing: die → dying, lie → lying, tie → tying. This set also mixes all four rules — apply the correct one.",
    questions: [
      { id: "4-1", prompt: "die → ___", options: ["dieing", "dying", "diying", "dies"], correctIndex: 1, explanation: "Ends in -ie → change to -y: die → dying." },
      { id: "4-2", prompt: "lie → ___", options: ["lieing", "lying", "liying", "lies"], correctIndex: 1, explanation: "Ends in -ie → change to -y: lie → lying." },
      { id: "4-3", prompt: "tie → ___", options: ["tieing", "tying", "tiying", "ties"], correctIndex: 1, explanation: "Ends in -ie → change to -y: tie → tying." },
      { id: "4-4", prompt: "shop → ___", options: ["shoping", "shopping", "shopeing", "shops"], correctIndex: 1, explanation: "CVC (sh-o-p), one syllable → double the p: shop → shopping." },
      { id: "4-5", prompt: "hope → ___", options: ["hopeing", "hopping", "hoping", "hopes"], correctIndex: 2, explanation: "Drop the silent -e: hope → hoping. (Don't double — it's not CVC before -ing!)" },
      { id: "4-6", prompt: "hop → ___", options: ["hoping", "hopping", "hopeing", "hops"], correctIndex: 1, explanation: "CVC (h-o-p), one syllable → double the p: hop → hopping. (Compare: hope → hoping.)" },
      { id: "4-7", prompt: "listen → ___", options: ["listenning", "listening", "listeneing", "listens"], correctIndex: 1, explanation: "Ends in two consonants (en), just add -ing: listen → listening." },
      { id: "4-8", prompt: "carry → ___", options: ["carring", "carryying", "carrying", "carries"], correctIndex: 2, explanation: "Ends in -y (preceded by consonant) — just add -ing: carry → carrying." },
      { id: "4-9", prompt: "open → ___", options: ["openning", "opening", "openeing", "opens"], correctIndex: 1, explanation: "Two syllables, stress on first (O-pen), NOT CVC stress → just add -ing: open → opening." },
      { id: "4-10", prompt: "begin → ___", options: ["begining", "beginning", "begineing", "begins"], correctIndex: 1, explanation: "Two syllables, stress on LAST (be-GIN), CVC → double the n: begin → beginning." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Add -ing",
  2: "Double CVC",
  3: "Drop -e",
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

export default function IngFormsClient() {
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
          <a className="hover:text-slate-900 transition" href="/tenses/present-continuous">Present Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">-ing Spelling Rules</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">-ing Spelling</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">Beginner</span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 border border-slate-200">A1</span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Master the <b>-ing spelling rules</b> with 40 multiple-choice questions. Four sets covering the four key spelling rules.
        </p>

        {/* Three-column grid */}
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
          <AdUnit variant="sidebar-dark" />
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/present-continuous"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← Present Continuous
          </a>
          <a
            href="/tenses/present-continuous/stative-verbs"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: Stative Verbs →
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">-ing Spelling Rules</h2>
        <p className="text-slate-500 text-sm">Four rules to master — learn the pattern, then practise.</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✅</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Simply add -ing</span>
          </div>
          <Formula parts={[
            { text: "verb", color: "yellow" }, { dim: true, text: "+" },
            { text: "-ing", color: "green" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="work → working" />
            <Ex en="eat → eating" />
            <Ex en="play → playing" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">2×</span>
            <span className="text-sm font-black text-red-600 uppercase tracking-widest">Double + -ing (CVC)</span>
          </div>
          <Formula parts={[
            { text: "CVC verb", color: "yellow" }, { dim: true, text: "+" },
            { text: "double + -ing", color: "red" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="run → running" />
            <Ex en="sit → sitting" />
            <Ex en="stop → stopping" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✂</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Drop -e + -ing</span>
          </div>
          <Formula parts={[
            { text: "verb + -e", color: "yellow" }, { dim: true, text: "+" },
            { text: "drop -e + -ing", color: "violet" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="make → making" />
            <Ex en="write → writing" />
            <Ex en="have → having" />
          </div>
        </div>
      </div>

      {/* 4 rules table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">The 4 -ing spelling rules</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Rule</th>
                <th className="text-left font-black text-slate-500 pb-2 pr-4">When?</th>
                <th className="text-left font-black text-slate-500 pb-2">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Add -ing", "default — most verbs", "work → working"],
                ["Double consonant", "CVC + stressed last syllable", "run → running"],
                ["Drop -e", "ends in silent -e", "make → making"],
                ["-ie → -y", "ends in -ie", "die → dying"],
              ].map(([rule, when, example]) => (
                <tr key={rule}>
                  <td className="py-2 pr-4 font-black text-slate-700">{rule}</td>
                  <td className="py-2 pr-4 text-slate-600">{when}</td>
                  <td className="py-2 font-mono text-slate-800">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Amber warning */}
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>⚠ hope vs hop — Don&apos;t confuse them!</b><br />
          <span className="font-mono">hope</span> (silent -e) → <span className="font-mono">hoping</span> (drop -e).{" "}
          <span className="font-mono">hop</span> (CVC) → <span className="font-mono">hopping</span> (double p).
        </div>
      </div>

      {/* Common -ing forms table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-sm">📌</span>
          <h3 className="font-black text-slate-900">Common -ing forms — quick reference</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Base</th>
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Rule</th>
                <th className="text-left font-black text-emerald-600 pb-2">-ing form</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["run", "CVC double", "running"],
                ["make", "drop -e", "making"],
                ["die", "-ie → -y", "dying"],
                ["play", "add -ing", "playing"],
                ["begin", "CVC stressed", "beginning"],
                ["open", "NOT stressed", "opening"],
              ].map(([base, rule, form]) => (
                <tr key={base}>
                  <td className="py-2 pr-4 font-mono font-black text-slate-700">{base}</td>
                  <td className="py-2 pr-4 text-slate-500 text-xs">{rule}</td>
                  <td className="py-2 font-mono font-black text-emerald-700">{form}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
