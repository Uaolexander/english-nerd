"use client";

import { useMemo, useState, useEffect } from "react";
import { useLiveSync } from "@/lib/useLiveSync";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import TenseRecommendations from "@/components/TenseRecommendations";
import { PS_SPEED_QUESTIONS, PS_PDF_CONFIG } from "../psSharedData";

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
    title: "Exercise 1 — Simply add -ed",
    instructions:
      "Most regular verbs just add -ed: walk → walked, talk → talked, watch → watched. The past form is the same for all subjects.",
    questions: [
      { id: "1-1", prompt: "She ___ to school yesterday.", options: ["walk", "walked", "walkked", "walking"], correctIndex: 1, explanation: "Regular verb, just add -ed: walk → walked." },
      { id: "1-2", prompt: "They ___ football last Saturday.", options: ["played", "plaied", "playyed", "play"], correctIndex: 0, explanation: "Ends in -y after a vowel: play → played (no change to y)." },
      { id: "1-3", prompt: "He ___ the door and came in.", options: ["open", "openned", "opened", "openeed"], correctIndex: 2, explanation: "Just add -ed: open → opened." },
      { id: "1-4", prompt: "We ___ TV last night.", options: ["watched", "watch", "watchhed", "watcheed"], correctIndex: 0, explanation: "Just add -ed: watch → watched." },
      { id: "1-5", prompt: "I ___ my friend yesterday.", options: ["call", "callled", "calling", "called"], correctIndex: 3, explanation: "Ends in double consonant (ll), just add -ed: call → called." },
      { id: "1-6", prompt: "She ___ her homework at 7pm.", options: ["finish", "finishs", "finishing", "finished"], correctIndex: 3, explanation: "Just add -ed: finish → finished." },
      { id: "1-7", prompt: "He ___ a new book last week.", options: ["start", "startted", "started", "startes"], correctIndex: 2, explanation: "Just add -ed: start → started." },
      { id: "1-8", prompt: "They ___ to music all evening.", options: ["listen", "listenned", "listened", "listens"], correctIndex: 2, explanation: "Just add -ed: listen → listened." },
      { id: "1-9", prompt: "I ___ him to stop, but he didn't.", options: ["ask", "asked", "askked", "asking"], correctIndex: 1, explanation: "Just add -ed: ask → asked." },
      { id: "1-10", prompt: "The cat ___ over the fence.", options: ["jumped", "jumppped", "jump", "jumpd"], correctIndex: 0, explanation: "Ends in two consonants (mp), just add -ed: jump → jumped." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Double the final consonant + -ed",
    instructions:
      "If a verb has ONE syllable and ends consonant-vowel-consonant (CVC), double the final consonant before adding -ed: stop → stopped, jog → jogged, plan → planned.",
    questions: [
      { id: "2-1", prompt: "The taxi ___ right outside our hotel.", options: ["stoped", "stopped", "stoppped", "stopting"], correctIndex: 1, explanation: "CVC (st-o-p), one syllable → double p: stop → stopped." },
      { id: "2-2", prompt: "We ___ the whole trip before leaving.", options: ["planed", "planned", "planeed", "planing"], correctIndex: 1, explanation: "CVC (pl-a-n) → double n: plan → planned." },
      { id: "2-3", prompt: "She ___ five kilometres this morning.", options: ["joged", "jogging", "jogged", "jogd"], correctIndex: 2, explanation: "CVC (j-o-g) → double g: jog → jogged." },
      { id: "2-4", prompt: "He ___ his phone on the floor.", options: ["droped", "dropped", "droppped", "dropd"], correctIndex: 1, explanation: "CVC (dr-o-p) → double p: drop → dropped." },
      { id: "2-5", prompt: "She ___ and said she understood.", options: ["noded", "nodded", "nodedd", "nodeing"], correctIndex: 1, explanation: "CVC (n-o-d) → double d: nod → nodded." },
      { id: "2-6", prompt: "He ___ his bag and ran.", options: ["grabed", "grabbed", "grabbing", "grabs"], correctIndex: 1, explanation: "CVC (gr-a-b) → double b: grab → grabbed." },
      { id: "2-7", prompt: "The scientists ___ the ocean floor.", options: ["maped", "mapped", "mappped", "mapping"], correctIndex: 1, explanation: "CVC (m-a-p) → double p: map → mapped." },
      { id: "2-8", prompt: "She ___ him not to leave.", options: ["beged", "begged", "begging", "begd"], correctIndex: 1, explanation: "CVC (b-e-g) → double g: beg → begged." },
      { id: "2-9", prompt: "The child ___ down the path.", options: ["skiped", "skipped", "skipping", "skipd"], correctIndex: 1, explanation: "CVC (sk-i-p) → double p: skip → skipped." },
      { id: "2-10", prompt: "He ___ to stay home that evening.", options: ["prefered", "preferred", "preferring", "prefers"], correctIndex: 1, explanation: "Two syllables, stress on last syllable (pre-FER) → double the r: prefer → preferred." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Drop the silent -e + -ed",
    instructions:
      "Verbs ending in a silent -e: drop the -e and add -d: dance → danced, hope → hoped, love → loved.",
    questions: [
      { id: "3-1", prompt: "She ___ all night at the party.", options: ["danceed", "danced", "dancde", "dancing"], correctIndex: 1, explanation: "Drop the silent -e and add -d: dance → danced." },
      { id: "3-2", prompt: "They ___ for good weather.", options: ["hopeed", "hopd", "hoped", "hoping"], correctIndex: 2, explanation: "Drop the silent -e and add -d: hope → hoped." },
      { id: "3-3", prompt: "He ___ that old car.", options: ["loveed", "loved", "lovd", "loveing"], correctIndex: 1, explanation: "Drop the silent -e and add -d: love → loved." },
      { id: "3-4", prompt: "She ___ when she heard the news.", options: ["smileed", "smiled", "smilede", "smilling"], correctIndex: 1, explanation: "Drop the silent -e and add -d: smile → smiled." },
      { id: "3-5", prompt: "I ___ to live near here.", options: ["useed", "used", "usde", "useded"], correctIndex: 1, explanation: "Drop the silent -e and add -d: use → used." },
      { id: "3-6", prompt: "We ___ at the hotel at midnight.", options: ["arriveed", "arrived", "arrivd", "arriveing"], correctIndex: 1, explanation: "Drop the silent -e and add -d: arrive → arrived." },
      { id: "3-7", prompt: "She ___ to quit her job.", options: ["decideed", "decided", "decidd", "deciding"], correctIndex: 1, explanation: "Drop the silent -e and add -d: decide → decided." },
      { id: "3-8", prompt: "He ___ the meal very much.", options: ["likeed", "liked", "likkd", "liking"], correctIndex: 1, explanation: "Drop the silent -e and add -d: like → liked." },
      { id: "3-9", prompt: "They ___ their plans at the last minute.", options: ["changeed", "changed", "changd", "changing"], correctIndex: 1, explanation: "Drop the silent -e and add -d: change → changed." },
      { id: "3-10", prompt: "She ___ the window before leaving.", options: ["closeed", "closed", "closd", "closing"], correctIndex: 1, explanation: "Drop the silent -e and add -d: close → closed." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — consonant + y → ied",
    instructions:
      "If a verb ends in consonant + y, change y to i and add -ed: study → studied, try → tried, carry → carried. But if it ends in vowel + y, just add -d: play → played, enjoy → enjoyed.",
    questions: [
      { id: "4-1", prompt: "He ___ very hard for the test.", options: ["studyed", "studied", "studdied", "studying"], correctIndex: 1, explanation: "Consonant + y → change y to i and add -ed: study → studied." },
      { id: "4-2", prompt: "She ___ to open the window.", options: ["tryed", "tried", "tryied", "trying"], correctIndex: 1, explanation: "Consonant + y → change y to i and add -ed: try → tried." },
      { id: "4-3", prompt: "He ___ the boxes upstairs.", options: ["carryed", "carried", "caried", "carrying"], correctIndex: 1, explanation: "Consonant + y → change y to i and add -ed: carry → carried." },
      { id: "4-4", prompt: "The baby ___ all night.", options: ["cryed", "cried", "criyed", "crying"], correctIndex: 1, explanation: "Consonant + y → change y to i and add -ed: cry → cried." },
      { id: "4-5", prompt: "She ___ the eggs in butter.", options: ["fryed", "fried", "friyed", "frying"], correctIndex: 1, explanation: "Consonant + y → change y to i and add -ed: fry → fried." },
      { id: "4-6", prompt: "We ___ chess after dinner.", options: ["plaied", "played", "playyed", "playing"], correctIndex: 1, explanation: "Vowel + y (ay): just add -d: play → played." },
      { id: "4-7", prompt: "They ___ the concert.", options: ["enjoied", "enjoyed", "enjoyyed", "enjoying"], correctIndex: 1, explanation: "Vowel + y (oy): just add -d: enjoy → enjoyed." },
      { id: "4-8", prompt: "We ___ at a hotel near the beach.", options: ["staied", "stayed", "stayyed", "staying"], correctIndex: 1, explanation: "Vowel + y (ay): just add -d: stay → stayed." },
      { id: "4-9", prompt: "She ___ to my email immediately.", options: ["replyed", "replied", "replyied", "replying"], correctIndex: 1, explanation: "Consonant + y → change y to i and add -ed: reply → replied." },
      { id: "4-10", prompt: "We ___ to catch the bus.", options: ["hurryed", "hurried", "hurryied", "hurrying"], correctIndex: 1, explanation: "Consonant + y → change y to i and add -ed: hurry → hurried." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Add -ed",
  2: "Double CVC",
  3: "Drop -e",
  4: "y → ied",
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

export default function RegularPastClient() {
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
    try { await generateLessonPDF(PS_PDF_CONFIG); } finally { setPdfLoading(false); }
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
          <a className="hover:text-slate-900 transition" href="/tenses/past-simple">Past Simple</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Regular Verbs</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Past Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Regular Verbs</span>
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">Elementary</span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 border border-slate-200">A2</span>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          Regular past forms follow <b>four spelling rules</b>. 40 MCQ questions across four sets to master{" "}
          <b>walk→walked</b>, <b>stop→stopped</b>, <b>study→studied</b>, and <b>dance→danced</b>.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left column */}
          {isPro ? (
            <div className=""><SpeedRound gameId="ps-regular" subject="Past Simple" questions={PS_SPEED_QUESTIONS} variant="sidebar" /></div>
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
            <TenseRecommendations tense="past-simple" />
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}
        </div>

        {/* Mobile ad */}
        <AdUnit variant="mobile-dark" />

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a
            href="/tenses/past-simple"
            className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition"
          >
            ← Past Simple
          </a>
          <a
            href="/tenses/past-simple/irregular-past-simple"
            className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm"
          >
            Next: Irregular Verbs →
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
        <h2 className="text-2xl font-black text-slate-900 mb-1">Regular Past Simple — Spelling Rules</h2>
        <p className="text-slate-500 text-sm">Four rules to master — learn the pattern, then practise.</p>
      </div>

      {/* 3 gradient cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✅</span>
            <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Most verbs: add -ed</span>
          </div>
          <Formula parts={[
            { text: "verb", color: "yellow" }, { dim: true, text: "+" },
            { text: "+ -ed", color: "green" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="walk → walked" />
            <Ex en="watch → watched" />
            <Ex en="open → opened" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">2×</span>
            <span className="text-sm font-black text-red-600 uppercase tracking-widest">CVC: double + -ed</span>
          </div>
          <Formula parts={[
            { text: "CVC verb", color: "yellow" }, { dim: true, text: "+" },
            { text: "double consonant", color: "red" }, { dim: true, text: "+" },
            { text: "+ -ed", color: "green" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="stop → stopped" />
            <Ex en="plan → planned" />
            <Ex en="jog → jogged" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-b from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✂</span>
            <span className="text-sm font-black text-sky-700 uppercase tracking-widest">Silent -e &amp; y → ied</span>
          </div>
          <Formula parts={[
            { text: "verb + -e", color: "yellow" }, { dim: true, text: "+" },
            { text: "drop -e + -d", color: "violet" },
          ]} />
          <div className="mt-3 space-y-2">
            <Ex en="dance → danced" />
            <Ex en="hope → hoped" />
            <Ex en="study → studied" />
          </div>
        </div>
      </div>

      {/* Rules table */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5DA20] text-sm font-black">!</span>
          <h3 className="font-black text-slate-900">The -ed spelling rules</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Rule</th>
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Condition</th>
                <th className="text-left font-black text-slate-500 pb-2">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Add -ed", "default", "walk → walked"],
                ["Double + -ed", "CVC + stressed last", "stop → stopped, prefer → preferred"],
                ["Drop -e + -d", "ends in silent -e", "dance → danced"],
                ["y → ied", "consonant + y", "study → studied"],
                ["y + -d", "vowel + y", "play → played"],
              ].map(([rule, condition, example]) => (
                <tr key={rule}>
                  <td className="py-2 pr-4 font-black text-slate-700">{rule}</td>
                  <td className="py-2 pr-4 text-slate-600">{condition}</td>
                  <td className="py-2 font-mono text-slate-800">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Amber warning */}
        <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <b>⚠ The past form is the same for ALL subjects — no he/she/it change!</b><br />
          <span className="font-mono">He walked, She walked, I walked</span> ✅ (NOT{" "}
          <span className="font-mono">He walkeds</span> ❌)
        </div>
      </div>

      {/* Pronunciation note */}
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sm">🔊</span>
          <h3 className="font-black text-slate-900">Pronunciation of -ed</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="text-left font-black text-slate-500 pb-2 pr-4">Sound</th>
                <th className="text-left font-black text-slate-500 pb-2 pr-4">After</th>
                <th className="text-left font-black text-slate-500 pb-2">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["/t/", "voiceless consonants (k, p, s, ch, sh, f)", "walked, stopped, watched"],
                ["/d/", "voiced sounds (b, g, l, m, n, r, v, vowels)", "played, called, listened"],
                ["/ɪd/", "after t or d", "started, needed, decided"],
              ].map(([sound, after, examples]) => (
                <tr key={sound}>
                  <td className="py-2 pr-4 font-mono font-black text-violet-700">{sound}</td>
                  <td className="py-2 pr-4 text-slate-600 text-xs">{after}</td>
                  <td className="py-2 font-mono text-slate-800 text-xs">{examples}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
