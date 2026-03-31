"use client";
import { useState } from "react";

type ClickQ = {
  mode: "click";
  id: string;
  sentence: string;
  wrongWord: string;
  correction: string[];
  explanation: string;
};
type RewriteQ = {
  mode: "rewrite";
  id: string;
  sentence: string;
  correct: string[];
  wrongWord: string;
  explanation: string;
};
type Q = ClickQ | RewriteQ;
type ExSet = {
  no: 1 | 2 | 3 | 4;
  title: string;
  instructions: string;
  questions: Q[];
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
    title: "Set 1 — Wrong Auxiliary (have/has/was instead of had)",
    instructions:
      "Each sentence uses the wrong auxiliary verb. Click the wrong word and type the correction.",
    questions: [
      {
        mode: "click",
        id: "s1-1",
        sentence: "She have been waiting for an hour when he arrived.",
        wrongWord: "have",
        correction: ["had"],
        explanation: "PPC requires 'had been' for all subjects. 'Have been waiting' is Present Perfect Continuous.",
      },
      {
        mode: "click",
        id: "s1-2",
        sentence: "They has been arguing before I walked in.",
        wrongWord: "has",
        correction: ["had"],
        explanation: "'Has been' is Present Perfect Continuous. Past reference needs 'had been'.",
      },
      {
        mode: "click",
        id: "s1-3",
        sentence: "By noon, he was been working for five hours.",
        wrongWord: "was",
        correction: ["had"],
        explanation: "'Was been working' is incorrect. Past Perfect Continuous uses 'had been working'.",
      },
      {
        mode: "click",
        id: "s1-4",
        sentence: "I have been running for 20 minutes when it started to rain.",
        wrongWord: "have",
        correction: ["had"],
        explanation: "'When it started to rain' is a past reference — use 'had been running', not 'have been running'.",
      },
      {
        mode: "click",
        id: "s1-5",
        sentence: "The children has been sleeping for two hours when we arrived home.",
        wrongWord: "has",
        correction: ["had"],
        explanation: "'Has been' is third-person Present Perfect Continuous. Past reference needs 'had been'.",
      },
      {
        mode: "click",
        id: "s1-6",
        sentence: "She told me she have been studying all night.",
        wrongWord: "have",
        correction: ["had"],
        explanation: "In reported speech, Present Perfect Continuous backshifts to Past Perfect Continuous: had been studying.",
      },
      {
        mode: "click",
        id: "s1-7",
        sentence: "He was been trying to contact her for days before she finally answered.",
        wrongWord: "was",
        correction: ["had"],
        explanation: "'Was been' is not a valid construction. Use 'had been trying' for PPC.",
      },
      {
        mode: "click",
        id: "s1-8",
        sentence: "By 2020, they has been living in that house for ten years.",
        wrongWord: "has",
        correction: ["had"],
        explanation: "'By 2020' is a past deadline — 'had been living', not 'has been living'.",
      },
      {
        mode: "click",
        id: "s1-9",
        sentence: "We have been walking for hours before we found the hotel.",
        wrongWord: "have",
        correction: ["had"],
        explanation: "'Before we found' is a past context — 'had been walking', not 'have been walking'.",
      },
      {
        mode: "click",
        id: "s1-10",
        sentence: "Her eyes were red because she is been crying.",
        wrongWord: "is",
        correction: ["had"],
        explanation: "'Is been crying' is not grammatical. The correct form is 'had been crying' (PPC).",
      },
    ],
  },
  2: {
    no: 2,
    title: "Set 2 — Wrong Verb Form (missing 'been' or wrong -ing)",
    instructions:
      "Each sentence has a missing 'been', a wrong participle, or an incorrect -ing spelling. Click the wrong word and type the correction.",
    questions: [
      {
        mode: "click",
        id: "s2-1",
        sentence: "She had working in that office for three years when she was promoted.",
        wrongWord: "working",
        correction: ["been working"],
        explanation: "PPC needs 'been' between 'had' and the -ing verb: had been working.",
      },
      {
        mode: "click",
        id: "s2-2",
        sentence: "He had been work all night, so he was exhausted.",
        wrongWord: "work",
        correction: ["working"],
        explanation: "After 'had been', use the -ing form: had been working.",
      },
      {
        mode: "click",
        id: "s2-3",
        sentence: "They had been runing for twenty minutes when it started to rain.",
        wrongWord: "runing",
        correction: ["running"],
        explanation: "run → running (double n before -ing: short vowel + single consonant).",
      },
      {
        mode: "click",
        id: "s2-4",
        sentence: "By the time we left, she had been makeing dinner for an hour.",
        wrongWord: "makeing",
        correction: ["making"],
        explanation: "make → making (drop the final 'e' before adding -ing).",
      },
      {
        mode: "click",
        id: "s2-5",
        sentence: "He had been siting at his desk for hours without a break.",
        wrongWord: "siting",
        correction: ["sitting"],
        explanation: "sit → sitting (double the final consonant: short vowel + single consonant).",
      },
      {
        mode: "click",
        id: "s2-6",
        sentence: "She had wait for the bus for 30 minutes when it finally arrived.",
        wrongWord: "wait",
        correction: ["been waiting"],
        explanation: "PPC: had + been + verb-ing. 'had wait' is missing 'been' and the -ing form.",
      },
      {
        mode: "click",
        id: "s2-7",
        sentence: "The team had been practise every day before the competition.",
        wrongWord: "practise",
        correction: ["practising"],
        explanation: "After 'had been', use the -ing form: practising (or practicing).",
      },
      {
        mode: "click",
        id: "s2-8",
        sentence: "I had been writeing my essay for four hours when the power cut happened.",
        wrongWord: "writeing",
        correction: ["writing"],
        explanation: "write → writing (drop the final 'e', add -ing).",
      },
      {
        mode: "click",
        id: "s2-9",
        sentence: "They had been swiming in the lake all afternoon before the storm.",
        wrongWord: "swiming",
        correction: ["swimming"],
        explanation: "swim → swimming (double the final consonant: short vowel + single consonant).",
      },
      {
        mode: "click",
        id: "s2-10",
        sentence: "He had been diged in the garden all morning, so his hands were muddy.",
        wrongWord: "diged",
        correction: ["digging"],
        explanation: "dig → digging (-ing form with double g). 'Diged' is not a valid form.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Set 3 — Wrong Tense (rewrite the sentence)",
    instructions:
      "Each sentence uses the wrong tense. Rewrite the full sentence correctly, changing to Past Perfect Continuous where needed (or back to Past Perfect/Past Simple).",
    questions: [
      {
        mode: "rewrite",
        id: "s3-1",
        sentence: "She was tired because she worked all day.",
        wrongWord: "worked",
        correct: [
          "She was tired because she had been working all day.",
          "She was tired because she'd been working all day.",
        ],
        explanation: "The ongoing work (cause) needs PPC: had been working. 'Worked' is just Past Simple without the duration.",
      },
      {
        mode: "rewrite",
        id: "s3-2",
        sentence: "When I called, he had been finished his homework.",
        wrongWord: "had been finished",
        correct: ["When I called, he had finished his homework."],
        explanation: "'Finished' is a completed action — use Past Perfect (had finished), not PPC.",
      },
      {
        mode: "rewrite",
        id: "s3-3",
        sentence: "Her eyes were red because she cried.",
        wrongWord: "cried",
        correct: [
          "Her eyes were red because she had been crying.",
          "Her eyes were red because she'd been crying.",
        ],
        explanation: "The red eyes are the result of ongoing crying — PPC: had been crying.",
      },
      {
        mode: "rewrite",
        id: "s3-4",
        sentence: "By noon, he had been writing two reports. (completed specific number)",
        wrongWord: "had been writing",
        correct: ["By noon, he had written two reports."],
        explanation: "'Two reports' is a completed countable result — use Past Perfect (had written), not PPC.",
      },
      {
        mode: "rewrite",
        id: "s3-5",
        sentence: "The ground was wet because it rained.",
        wrongWord: "rained",
        correct: [
          "The ground was wet because it had been raining.",
          "The ground was wet because it'd been raining.",
        ],
        explanation: "The wet ground is the result of continuous past rain — PPC: had been raining.",
      },
      {
        mode: "rewrite",
        id: "s3-6",
        sentence: "She had been known him for years before they married.",
        wrongWord: "had been known",
        correct: ["She had known him for years before they married."],
        explanation: "'Know' is a stative verb — no continuous form. Use Past Perfect: had known.",
      },
      {
        mode: "rewrite",
        id: "s3-7",
        sentence: "He was out of breath because he was running.",
        wrongWord: "was running",
        correct: [
          "He was out of breath because he had been running.",
          "He was out of breath because he'd been running.",
        ],
        explanation: "PPC (had been running) is needed to show the completed ongoing cause of a past result.",
      },
      {
        mode: "rewrite",
        id: "s3-8",
        sentence: "They had been drunk three cups of coffee by the meeting.",
        wrongWord: "had been drunk",
        correct: ["They had drunk three cups of coffee by the meeting."],
        explanation: "'Three cups' is a completed quantity — Past Perfect (had drunk), not PPC.",
      },
      {
        mode: "rewrite",
        id: "s3-9",
        sentence: "I couldn't concentrate because the neighbours were drilling.",
        wrongWord: "were drilling",
        correct: [
          "I couldn't concentrate because the neighbours had been drilling.",
          "I couldn't concentrate because the neighbours had been drilling for hours.",
        ],
        explanation: "PPC (had been drilling) better explains the ongoing past cause of inability to concentrate.",
      },
      {
        mode: "rewrite",
        id: "s3-10",
        sentence: "She had been understood the rules before the game started.",
        wrongWord: "had been understood",
        correct: ["She had understood the rules before the game started."],
        explanation: "'Understand' is a stative verb — no continuous form. Use Past Perfect: had understood.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Set 4 — Mixed Errors (rewrite the sentence)",
    instructions:
      "Each sentence contains a mixed error: word order, double negative, wrong time expression, or incorrect form. Rewrite each sentence correctly.",
    questions: [
      {
        mode: "rewrite",
        id: "s4-1",
        sentence: "She had been waiting already for an hour when he arrived.",
        wrongWord: "already",
        correct: ["She had already been waiting for an hour when he arrived.", "She had been waiting for an hour already when he arrived."],
        explanation: "'Already' in PPC goes between 'had' and 'been': had already been waiting.",
      },
      {
        mode: "rewrite",
        id: "s4-2",
        sentence: "He hadn't been sleeping good, so he felt terrible.",
        wrongWord: "good",
        correct: ["He hadn't been sleeping well, so he felt terrible."],
        explanation: "Use 'well' (adverb), not 'good' (adjective), to modify the verb 'sleeping'.",
      },
      {
        mode: "rewrite",
        id: "s4-3",
        sentence: "Had they been waited long when you arrived?",
        wrongWord: "waited",
        correct: ["Had they been waiting long when you arrived?"],
        explanation: "In PPC questions: Had + subject + been + verb-ing. Use 'waiting', not 'waited'.",
      },
      {
        mode: "rewrite",
        id: "s4-4",
        sentence: "By the time she graduated, she had been studying since four years.",
        wrongWord: "since",
        correct: ["By the time she graduated, she had been studying for four years."],
        explanation: "Use 'for' with a duration (four years). 'Since' is for a specific starting point.",
      },
      {
        mode: "rewrite",
        id: "s4-5",
        sentence: "They hadn't been never arguing before I arrived.",
        wrongWord: "never",
        correct: [
          "They had never been arguing before I arrived.",
          "They hadn't been arguing before I arrived.",
        ],
        explanation: "Double negative: hadn't + never is wrong. Use 'had never been' or 'hadn't been'.",
      },
      {
        mode: "rewrite",
        id: "s4-6",
        sentence: "She had been working since three hours when the boss called.",
        wrongWord: "since",
        correct: ["She had been working for three hours when the boss called."],
        explanation: "Use 'for' with a period of time (three hours). 'Since' requires a specific point in time.",
      },
      {
        mode: "rewrite",
        id: "s4-7",
        sentence: "Had been you training before the race?",
        wrongWord: "Had been you",
        correct: ["Had you been training before the race?"],
        explanation: "PPC question word order: Had + subject + been + -ing. Not 'Had been + subject'.",
      },
      {
        mode: "rewrite",
        id: "s4-8",
        sentence: "He had been working there for since 2010.",
        wrongWord: "for since",
        correct: ["He had been working there since 2010.", "He had been working there for years since 2010."],
        explanation: "Do not use 'for' and 'since' together. Use either 'for' (duration) or 'since' (starting point).",
      },
      {
        mode: "rewrite",
        id: "s4-9",
        sentence: "She been waiting for me when I arrived.",
        wrongWord: "been",
        correct: ["She had been waiting for me when I arrived."],
        explanation: "PPC requires 'had': had been waiting. 'Been waiting' alone is not a complete tense.",
      },
      {
        mode: "rewrite",
        id: "s4-10",
        sentence: "I was surprised because they hadn't been not practising.",
        wrongWord: "not",
        correct: [
          "I was surprised because they hadn't been practising.",
          "I was surprised because they had not been practising.",
        ],
        explanation: "Double negative: 'hadn't been not practising' is wrong. Use 'hadn't been practising'.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Wrong Auxiliary",
  2: "Wrong Form",
  3: "Wrong Tense",
  4: "Mixed Errors",
};

export default function SpotTheMistakeClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [clickStates, setClickStates] = useState<
    Record<string, { clicked: string | null; input: string; submitted: boolean }>
  >({});
  const [rewriteStates, setRewriteStates] = useState<
    Record<string, { input: string; submitted: boolean }>
  >({});
  const current = SETS[exNo];

  function switchSet(n: 1 | 2 | 3 | 4) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setExNo(n);
    setClickStates({});
    setRewriteStates({});
  }

  function ClickCard({ q, idx }: { q: ClickQ; idx: number }) {
    const state = clickStates[q.id] ?? { clicked: null, input: "", submitted: false };
    const tokens = q.sentence.split(" ");
    const isCorrect = state.submitted && isAccepted(state.input, q.correction);
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
            {idx + 1}
          </div>
          <div className="flex-1">
            <div className="mb-1 text-xs text-slate-500 font-semibold uppercase tracking-wide">
              Click the wrong word
            </div>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {tokens.map((tok, ti) => {
                const cleanTok = tok.replace(/[.,!?]/g, "");
                const isWrong =
                  state.submitted &&
                  (normalize(cleanTok) === normalize(q.wrongWord) || tok === q.wrongWord);
                const isClicked = state.clicked === tok + ti;
                return (
                  <button
                    key={ti}
                    disabled={state.submitted}
                    onClick={() =>
                      !state.submitted &&
                      setClickStates((p) => ({
                        ...p,
                        [q.id]: {
                          ...(p[q.id] ?? { clicked: null, input: "", submitted: false }),
                          clicked: tok + ti,
                        },
                      }))
                    }
                    className={`rounded-lg px-2 py-1 text-sm border transition ${
                      isClicked
                        ? "border-[#F5DA20] bg-[#F5DA20]/20 font-bold"
                        : isWrong
                        ? "border-red-400 bg-red-50 text-red-700 font-bold"
                        : "border-transparent hover:border-black/10 hover:bg-black/5"
                    } ${state.submitted ? "cursor-default" : "cursor-pointer"}`}
                  >
                    {tok}
                  </button>
                );
              })}
            </div>
            {state.clicked && !state.submitted && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  spellCheck={false}
                  autoComplete="off"
                  value={state.input}
                  placeholder="Type correction…"
                  onChange={(e) =>
                    setClickStates((p) => ({
                      ...p,
                      [q.id]: { ...p[q.id], input: e.target.value },
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setClickStates((p) => ({
                        ...p,
                        [q.id]: { ...p[q.id], submitted: true },
                      }));
                    }
                  }}
                  className="flex-1 rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#F5DA20]"
                />
                <button
                  onClick={() =>
                    setClickStates((p) => ({
                      ...p,
                      [q.id]: { ...p[q.id], submitted: true },
                    }))
                  }
                  className="rounded-xl bg-[#F5DA20] px-4 py-2 text-sm font-black text-black hover:opacity-90"
                >
                  ✓
                </button>
              </div>
            )}
            {state.submitted && (
              <div className="mt-2 text-sm">
                {isCorrect ? (
                  <div className="text-emerald-700 font-semibold">✅ Correct!</div>
                ) : (
                  <div className="text-red-700 font-semibold">
                    ❌ The wrong word was: <b>{q.wrongWord}</b> → should be:{" "}
                    <b>{q.correction[0]}</b>
                  </div>
                )}
                <div className="mt-1 text-slate-600">{q.explanation}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function RewriteCard({ q, idx }: { q: RewriteQ; idx: number }) {
    const state = rewriteStates[q.id] ?? { input: "", submitted: false };
    const isCorrect = state.submitted && isAccepted(state.input, q.correct);
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">
            {idx + 1}
          </div>
          <div className="flex-1">
            <div className="mb-1 text-xs text-slate-500 font-semibold uppercase tracking-wide">
              Rewrite correctly
            </div>
            <div className="mb-3 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm font-semibold text-red-800">
              ✗ {q.sentence}
            </div>
            <input
              type="text"
              spellCheck={false}
              autoComplete="off"
              disabled={state.submitted}
              value={state.input}
              placeholder="Type the corrected sentence…"
              onChange={(e) =>
                setRewriteStates((p) => ({
                  ...p,
                  [q.id]: { ...(p[q.id] ?? { input: "", submitted: false }), input: e.target.value },
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setRewriteStates((p) => ({
                    ...p,
                    [q.id]: { ...p[q.id], submitted: true },
                  }));
                }
              }}
              className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
                state.submitted
                  ? isCorrect
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-red-400 bg-red-50"
                  : "border-black/10 focus:border-[#F5DA20]"
              }`}
            />
            {!state.submitted && state.input.trim() && (
              <button
                onClick={() =>
                  setRewriteStates((p) => ({
                    ...p,
                    [q.id]: { ...p[q.id], submitted: true },
                  }))
                }
                className="mt-2 rounded-xl bg-[#F5DA20] px-4 py-2 text-sm font-black text-black hover:opacity-90"
              >
                Check
              </button>
            )}
            {state.submitted && (
              <div className="mt-2 text-sm">
                {isCorrect ? (
                  <div className="text-emerald-700 font-semibold">✅ Correct!</div>
                ) : (
                  <div className="text-red-700 font-semibold">
                    ❌ Correct version: <b>{q.correct[0]}</b>
                  </div>
                )}
                <div className="mt-1 text-slate-600">{q.explanation}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
          <span className="text-slate-700 font-medium">Spot the Mistake</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Perfect Continuous{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">
              Spot the Mistake
            </span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 border border-rose-200">
            Hard
          </span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">
            B2
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          Find and correct the mistake in each sentence. Click the wrong word and type the
          correction, or rewrite the full sentence. 40 error-correction exercises across four sets.
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
                    {current.questions.map((q, idx) =>
                      q.mode === "click" ? (
                        <ClickCard key={q.id} q={q} idx={idx} />
                      ) : (
                        <RewriteCard key={q.id} q={q} idx={idx} />
                      )
                    )}
                  </div>
                </>
              ) : (
                <StmExplanation />
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
            href="/tenses/past-perfect-continuous/sentence-builder"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: Sentence Builder →
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

function StmExplanation() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[{ text: "Subject", color: "sky" }, { text: "had been", color: "yellow" }, { text: "verb + -ing", color: "green" }, { text: ".", color: "slate" }]} />
          <Ex en="She had been waiting for an hour.  ·  They had been working since morning." />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[{ text: "Subject", color: "sky" }, { text: "hadn't been", color: "red" }, { text: "verb + -ing", color: "green" }, { text: ".", color: "slate" }]} />
          <Ex en="He hadn't been eating well.  ·  They hadn't been communicating properly." />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[{ text: "Had", color: "violet" }, { text: "subject", color: "sky" }, { text: "been", color: "orange" }, { text: "verb + -ing", color: "green" }, { text: "?", color: "slate" }]} />
          <Ex en="Had they been waiting long?  ·  Had she been crying?  ·  How long had he been working?" />
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Common Mistakes</div>
        <div className="space-y-3">
          {[
            { label: "Wrong auxiliary: have/has/was instead of had", color: "red", examples: ["✗ She have been waiting → ✓ She had been waiting", "✗ He was been running → ✓ He had been running"] },
            { label: "Missing 'been': had + -ing instead of had been + -ing", color: "orange", examples: ["✗ She had working → ✓ She had been working", "✗ He had running → ✓ He had been running"] },
            { label: "Wrong -ing spelling", color: "violet", examples: ["✗ runing → ✓ running (double n)", "✗ makeing → ✓ making (drop e)", "✗ siting → ✓ sitting (double t)"] },
            { label: "for vs since confusion", color: "sky", examples: ["✗ working since 3 hours → ✓ working for 3 hours", "✗ working for Monday → ✓ working since Monday"] },
          ].map(({ label, color, examples }) => {
            const borderMap: Record<string, string> = {
              red: "border-red-200 bg-red-50/50",
              orange: "border-orange-200 bg-orange-50/50",
              violet: "border-violet-200 bg-violet-50/50",
              sky: "border-sky-200 bg-sky-50/50",
            };
            const badgeMap: Record<string, string> = {
              red: "bg-red-100 text-red-800 border-red-200",
              orange: "bg-orange-100 text-orange-800 border-orange-200",
              violet: "bg-violet-100 text-violet-800 border-violet-200",
              sky: "bg-sky-100 text-sky-800 border-sky-200",
            };
            return (
              <div key={label} className={`rounded-xl border p-4 ${borderMap[color]}`}>
                <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-black mb-2 ${badgeMap[color]}`}>{label}</span>
                <div className="space-y-1">
                  {examples.map((ex) => (
                    <Ex key={ex} en={ex} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="font-black mb-1">⚠ Stative verbs — never use PPC</div>
        <p>Verbs like <b>know, believe, understand, want, love, need</b> cannot be used in continuous form. Use Past Perfect: <b>She had known him</b> (not &ldquo;had been knowing&rdquo;).</p>
      </div>
    </div>
  );
}
