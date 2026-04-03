"use client";
import { useState } from "react";
import AdUnit from "@/components/AdUnit";

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
    title: "Set 1 — Wrong auxiliary (have/has instead of had)",
    instructions:
      "Each sentence has the wrong auxiliary verb. Click the wrong word, then type the correct one.",
    questions: [
      {
        mode: "click",
        id: "s1-1",
        sentence: "She have already left when I arrived.",
        wrongWord: "have",
        correction: ["had"],
        explanation: "Past Perfect requires 'had' for all subjects, not 'have'.",
      },
      {
        mode: "click",
        id: "s1-2",
        sentence: "They has finished the project before the deadline.",
        wrongWord: "has",
        correction: ["had"],
        explanation: "'Has' is Present Perfect. Use 'had' for Past Perfect.",
      },
      {
        mode: "click",
        id: "s1-3",
        sentence: "By the time he called, I have eaten dinner.",
        wrongWord: "have",
        correction: ["had"],
        explanation: "'By the time' with a past verb requires Past Perfect: had eaten.",
      },
      {
        mode: "click",
        id: "s1-4",
        sentence: "We have never seen anything like it before that day.",
        wrongWord: "have",
        correction: ["had"],
        explanation: "Reference to a past moment requires Past Perfect: had never seen.",
      },
      {
        mode: "click",
        id: "s1-5",
        sentence: "He has lived in Paris for three years before he moved.",
        wrongWord: "has",
        correction: ["had"],
        explanation: "'Before he moved' is a past reference — use 'had lived', not 'has lived'.",
      },
      {
        mode: "click",
        id: "s1-6",
        sentence: "The children has gone to bed before their parents came home.",
        wrongWord: "has",
        correction: ["had"],
        explanation: "Past Perfect is 'had' for all subjects. 'Has' is third-person Present Perfect.",
      },
      {
        mode: "click",
        id: "s1-7",
        sentence: "She told me she has already heard the news.",
        wrongWord: "has",
        correction: ["had"],
        explanation: "In reported speech, Present Perfect backshifts to Past Perfect: had heard.",
      },
      {
        mode: "click",
        id: "s1-8",
        sentence: "By 2010, he have written three novels.",
        wrongWord: "have",
        correction: ["had"],
        explanation: "'By 2010' is a past deadline — Past Perfect needed: had written.",
      },
      {
        mode: "click",
        id: "s1-9",
        sentence: "I have just finished packing when the taxi arrived.",
        wrongWord: "have",
        correction: ["had"],
        explanation: "'When the taxi arrived' is past context — Past Perfect: had just finished.",
      },
      {
        mode: "click",
        id: "s1-10",
        sentence: "After she has read the letter, she started to cry.",
        wrongWord: "has",
        correction: ["had"],
        explanation: "Both actions are in the past; the reading came first: had read.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Set 2 — Wrong past participle form",
    instructions:
      "Each sentence uses the wrong form of the main verb. Click the wrong word, then type the correct past participle.",
    questions: [
      {
        mode: "click",
        id: "s2-1",
        sentence: "He had went to the store before it closed.",
        wrongWord: "went",
        correction: ["gone"],
        explanation: "Past participle of 'go' is 'gone', not 'went' (which is Past Simple).",
      },
      {
        mode: "click",
        id: "s2-2",
        sentence: "She had wrote the email before the meeting.",
        wrongWord: "wrote",
        correction: ["written"],
        explanation: "Past participle of 'write' is 'written', not 'wrote'.",
      },
      {
        mode: "click",
        id: "s2-3",
        sentence: "By the time we arrived, they had ate all the food.",
        wrongWord: "ate",
        correction: ["eaten"],
        explanation: "Past participle of 'eat' is 'eaten', not 'ate'.",
      },
      {
        mode: "click",
        id: "s2-4",
        sentence: "He had drank three cups of coffee before noon.",
        wrongWord: "drank",
        correction: ["drunk"],
        explanation: "Past participle of 'drink' is 'drunk', not 'drank'.",
      },
      {
        mode: "click",
        id: "s2-5",
        sentence: "She told me she had saw that film before.",
        wrongWord: "saw",
        correction: ["seen"],
        explanation: "Past participle of 'see' is 'seen', not 'saw'.",
      },
      {
        mode: "click",
        id: "s2-6",
        sentence: "They had swam in that lake before the storm.",
        wrongWord: "swam",
        correction: ["swum"],
        explanation: "Past participle of 'swim' is 'swum', not 'swam'.",
      },
      {
        mode: "click",
        id: "s2-7",
        sentence: "I had forgot to bring my passport.",
        wrongWord: "forgot",
        correction: ["forgotten"],
        explanation: "Past participle of 'forget' is 'forgotten', not 'forgot'.",
      },
      {
        mode: "click",
        id: "s2-8",
        sentence: "Had they spoke to the manager before the meeting?",
        wrongWord: "spoke",
        correction: ["spoken"],
        explanation: "Past participle of 'speak' is 'spoken', not 'spoke'.",
      },
      {
        mode: "click",
        id: "s2-9",
        sentence: "She had wore that dress only once before.",
        wrongWord: "wore",
        correction: ["worn"],
        explanation: "Past participle of 'wear' is 'worn', not 'wore'.",
      },
      {
        mode: "click",
        id: "s2-10",
        sentence: "By the time he retired, he had rose through the ranks.",
        wrongWord: "rose",
        correction: ["risen"],
        explanation: "Past participle of 'rise' is 'risen', not 'rose'.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Set 3 — Wrong tense (rewrite the sentence)",
    instructions:
      "Each sentence uses the wrong tense. Rewrite the full sentence correctly, changing Past Simple to Past Perfect or vice versa where needed.",
    questions: [
      {
        mode: "rewrite",
        id: "s3-1",
        sentence: "I told him the news after he already left.",
        wrongWord: "left",
        correct: ["I told him the news after he had already left."],
        explanation: "'Already left' happened before 'told' — Past Perfect needed: had already left.",
      },
      {
        mode: "rewrite",
        id: "s3-2",
        sentence: "When we arrived, the concert started.",
        wrongWord: "started",
        correct: [
          "When we arrived, the concert had started.",
          "When we arrived, the concert had already started.",
        ],
        explanation: "The concert started before the arrival — Past Perfect: had started.",
      },
      {
        mode: "rewrite",
        id: "s3-3",
        sentence: "She was tired because she didn't sleep well.",
        wrongWord: "didn't sleep",
        correct: [
          "She was tired because she hadn't slept well.",
          "She was tired because she had not slept well.",
        ],
        explanation: "The lack of sleep happened before being tired — Past Perfect: hadn't slept.",
      },
      {
        mode: "rewrite",
        id: "s3-4",
        sentence: "He said he finished the report.",
        wrongWord: "finished",
        correct: ["He said he had finished the report."],
        explanation: "Reported speech backshift: finished → had finished.",
      },
      {
        mode: "rewrite",
        id: "s3-5",
        sentence: "By the time the doctor arrived, the patient lost consciousness.",
        wrongWord: "lost",
        correct: ["By the time the doctor arrived, the patient had lost consciousness."],
        explanation: "'By the time' signals that the loss of consciousness happened before the arrival.",
      },
      {
        mode: "rewrite",
        id: "s3-6",
        sentence: "After we discussed it, we had made a decision.",
        wrongWord: "had made",
        correct: ["After we had discussed it, we made a decision."],
        explanation: "The discussion happened first (Past Perfect), then the decision (Past Simple).",
      },
      {
        mode: "rewrite",
        id: "s3-7",
        sentence: "I wished I studied harder for the exam.",
        wrongWord: "studied",
        correct: ["I wished I had studied harder for the exam."],
        explanation: "'Wish' about a past situation requires Past Perfect: had studied.",
      },
      {
        mode: "rewrite",
        id: "s3-8",
        sentence: "Before she moved to London, she never visited England.",
        wrongWord: "visited",
        correct: ["Before she moved to London, she had never visited England."],
        explanation: "Action before another past action — Past Perfect: had never visited.",
      },
      {
        mode: "rewrite",
        id: "s3-9",
        sentence: "They didn't recognise him because he changed a lot.",
        wrongWord: "changed",
        correct: [
          "They didn't recognise him because he had changed a lot.",
          "They didn't recognize him because he had changed a lot.",
        ],
        explanation: "The change happened before the recognition failure — Past Perfect: had changed.",
      },
      {
        mode: "rewrite",
        id: "s3-10",
        sentence: "We were late because we missed the bus.",
        wrongWord: "missed",
        correct: [
          "We were late because we had missed the bus.",
          "We were late because we'd missed the bus.",
        ],
        explanation: "Missing the bus happened before being late — Past Perfect: had missed.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Set 4 — Mixed errors (rewrite the sentence)",
    instructions:
      "Each sentence contains a mixed error: word order, hadn't + base form, double auxiliary, or wrong tense. Rewrite each sentence correctly.",
    questions: [
      {
        mode: "rewrite",
        id: "s4-1",
        sentence: "She had already left already when I arrived.",
        wrongWord: "already",
        correct: ["She had already left when I arrived."],
        explanation: "'Already' appears twice. It belongs only once, between had and the past participle.",
      },
      {
        mode: "rewrite",
        id: "s4-2",
        sentence: "He hadn't eat anything before the meeting.",
        wrongWord: "eat",
        correct: ["He hadn't eaten anything before the meeting."],
        explanation: "After hadn't, use the past participle: hadn't eaten, not hadn't eat.",
      },
      {
        mode: "rewrite",
        id: "s4-3",
        sentence: "Had they had finished before you arrived?",
        wrongWord: "had",
        correct: ["Had they finished before you arrived?"],
        explanation: "Past Perfect question: Had + subject + past participle. No double auxiliary.",
      },
      {
        mode: "rewrite",
        id: "s4-4",
        sentence: "By the time she called, I had already packed just.",
        wrongWord: "just",
        correct: [
          "By the time she called, I had just packed.",
          "By the time she called, I had already packed.",
        ],
        explanation: "'Just' goes between had and the past participle: had just packed.",
      },
      {
        mode: "rewrite",
        id: "s4-5",
        sentence: "They hadn't never seen such a big crowd before.",
        wrongWord: "never",
        correct: [
          "They had never seen such a big crowd before.",
          "They hadn't seen such a big crowd before.",
        ],
        explanation: "Double negative: hadn't + never is incorrect. Use 'had never' or 'hadn't … before'.",
      },
      {
        mode: "rewrite",
        id: "s4-6",
        sentence: "I just had arrived when the argument started.",
        wrongWord: "just",
        correct: ["I had just arrived when the argument started."],
        explanation: "Word order: 'just' goes between had and the past participle: had just arrived.",
      },
      {
        mode: "rewrite",
        id: "s4-7",
        sentence: "She hadn't to finish the report by then.",
        wrongWord: "to",
        correct: ["She hadn't finished the report by then."],
        explanation: "'Hadn't to finish' is wrong. Negative Past Perfect is: hadn't + past participle.",
      },
      {
        mode: "rewrite",
        id: "s4-8",
        sentence: "Before the match begun, the referee explained the rules.",
        wrongWord: "begun",
        correct: ["Before the match began, the referee explained the rules."],
        explanation: "'Begun' is a past participle; 'began' is the Past Simple. Use Past Simple here: began.",
      },
      {
        mode: "rewrite",
        id: "s4-9",
        sentence: "He had been gone to the gym before work.",
        wrongWord: "been",
        correct: ["He had gone to the gym before work."],
        explanation: "Double auxiliary: had been gone is incorrect. Use had gone (Past Perfect of 'go').",
      },
      {
        mode: "rewrite",
        id: "s4-10",
        sentence: "They already had spoken when I walked in.",
        wrongWord: "already",
        correct: ["They had already spoken when I walked in."],
        explanation: "Word order: 'already' goes after 'had': had already spoken.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Wrong Auxiliary",
  2: "Wrong Participle",
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
          <a className="hover:text-slate-900 transition" href="/tenses/past-perfect">Past Perfect</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Spot the Mistake</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">
              Spot the Mistake
            </span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">
            Medium
          </span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">
            B1–B2
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          Find and correct the mistake in each sentence. Click the wrong word and type the
          correction, or rewrite the full sentence. 40 error-correction exercises across four sets.
        </p>

        {/* Layout */}
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

                  <div className="mt-8 flex flex-wrap gap-3 items-center">
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setClickStates({});
                        setRewriteStates({});
                      }}
                      className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition"
                    >
                      Reset Set
                    </button>
                    {exNo < 4 && (
                      <button
                        onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)}
                        className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition"
                      >
                        Next Exercise →
                      </button>
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

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/past-perfect/fill-in-blank"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← Fill in the Blank
          </a>
          <a
            href="/tenses/past-perfect/sentence-builder"
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
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {parts.map((p, i) => (
        <span
          key={i}
          className={`rounded-lg px-2.5 py-1 text-xs font-black border ${colors[p.color ?? "slate"]}`}
        >
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

function Explanation() {
  return (
    <div className="space-y-8">
      {/* 3 gradient cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">
            + Affirmative
          </span>
          <Formula
            parts={[
              { text: "Subject", color: "sky" },
              { text: "had", color: "yellow" },
              { text: "past participle", color: "green" },
              { text: ".", color: "slate" },
            ]}
          />
          <Ex en="She had left before he arrived.  ·  They had eaten.  ·  It had happened before." />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">
            − Negative
          </span>
          <Formula
            parts={[
              { text: "Subject", color: "sky" },
              { text: "hadn't", color: "red" },
              { text: "past participle", color: "green" },
              { text: ".", color: "slate" },
            ]}
          />
          <Ex en="He hadn't seen it before.  ·  We hadn't met yet.  ·  She hadn't finished." />
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">
            ? Question
          </span>
          <Formula
            parts={[
              { text: "Had", color: "violet" },
              { text: "subject", color: "sky" },
              { text: "past participle", color: "green" },
              { text: "?", color: "slate" },
            ]}
          />
          <Ex en="Had they finished?  ·  Had she ever been there?  ·  Had it started?" />
        </div>
      </div>

      {/* Common errors */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
          Common Mistakes to Avoid
        </div>
        <div className="space-y-3">
          {[
            {
              label: "Using 'have/has' instead of 'had'",
              color: "red",
              examples: [
                "✗ She have already left. → ✓ She had already left.",
                "✗ He has finished before noon. → ✓ He had finished before noon.",
              ],
            },
            {
              label: "Using Past Simple participle as past participle",
              color: "violet",
              examples: [
                "✗ He had went to the store. → ✓ He had gone to the store.",
                "✗ She had wrote the email. → ✓ She had written the email.",
                "✗ They had ate the food. → ✓ They had eaten the food.",
              ],
            },
            {
              label: "Wrong word order with already / just / never",
              color: "sky",
              examples: [
                "✗ She had left already when I arrived. → ✓ She had already left.",
                "✗ I just had arrived. → ✓ I had just arrived.",
              ],
            },
            {
              label: "Double negative with hadn't + never",
              color: "yellow",
              examples: [
                "✗ They hadn't never seen it. → ✓ They had never seen it.",
                "✗ She hadn't eaten nothing. → ✓ She hadn't eaten anything.",
              ],
            },
          ].map(({ label, color, examples }) => {
            const borderMap: Record<string, string> = {
              red: "border-red-200 bg-red-50/50",
              violet: "border-violet-200 bg-violet-50/50",
              sky: "border-sky-200 bg-sky-50/50",
              yellow: "border-amber-200 bg-amber-50/50",
            };
            const badgeMap: Record<string, string> = {
              red: "bg-red-100 text-red-800 border-red-200",
              violet: "bg-violet-100 text-violet-800 border-violet-200",
              sky: "bg-sky-100 text-sky-800 border-sky-200",
              yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
            };
            return (
              <div key={label} className={`rounded-xl border p-4 ${borderMap[color]}`}>
                <span
                  className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-black mb-2 ${badgeMap[color]}`}
                >
                  {label}
                </span>
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

      {/* PP vs Past Simple */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
          Past Perfect vs Past Simple
        </div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5">
                <th className="px-4 py-2.5 font-black text-left text-violet-700">Past Perfect</th>
                <th className="px-4 py-2.5 font-black text-left text-red-700">Past Simple</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Action before another past event", "Action at a specific time in the past"],
                ["By the time, before, after, when + sequence needed", "Yesterday, last week, in 2020, at 5pm"],
                ["She had left before I arrived.", "She left at 8am."],
                ["By the time he called, she had finished.", "She finished and then he called."],
                ["I wish I had known.", "I knew it then."],
              ].map(([pp, ps], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-violet-800 font-mono text-xs">{pp}</td>
                  <td className="px-4 py-2.5 text-red-800 font-mono text-xs">{ps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
          Key words for Past Perfect
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "already",
            "just",
            "never",
            "ever",
            "by the time",
            "before",
            "after",
            "when",
            "as soon as",
            "until",
            "by 5pm",
            "by then",
          ].map((t) => (
            <span
              key={t}
              className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
