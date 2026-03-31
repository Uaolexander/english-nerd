"use client";

import { useMemo, useState } from "react";

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
    title: "Exercise 1 — Unfinished vs finished time",
    instructions:
      "Choose the correct tense. Present Perfect is used when no specific past time is given, or when the time period is unfinished (today, this week, ever). Past Simple is used with specific finished times (yesterday, last year, in 2020, two days ago).",
    questions: [
      { id: "1-1",  prompt: "I ___ (see) that film last week.",                     options: ["have seen", "saw", "see", "had seen"],              correctIndex: 1, explanation: "Last week = specific finished time → Past Simple: I saw." },
      { id: "1-2",  prompt: "She ___ (never / meet) the president.",                options: ["never met", "has never met", "never has met", "didn't meet"], correctIndex: 1, explanation: "Never without a specific time → Present Perfect: She has never met." },
      { id: "1-3",  prompt: "They ___ (move) to London in 2018.",                   options: ["have moved", "moved", "move", "are moving"],         correctIndex: 1, explanation: "In 2018 = specific finished time → Past Simple: They moved." },
      { id: "1-4",  prompt: "Have you ever ___ (try) paella?",                      options: ["tried", "try", "have tried", "trying"],              correctIndex: 0, explanation: "Ever + Present Perfect: Have you ever tried...? Participle = tried." },
      { id: "1-5",  prompt: "I ___ (lose) my phone this morning.",                  options: ["lost", "have lost", "lose", "had lost"],             correctIndex: 1, explanation: "This morning = unfinished time period (still the same morning) → Present Perfect: I have lost." },
      { id: "1-6",  prompt: "We ___ (visit) Rome three times.",                     options: ["visited", "have visited", "visit", "are visiting"],  correctIndex: 1, explanation: "No specific time given → Present Perfect: We have visited." },
      { id: "1-7",  prompt: "He ___ (call) me yesterday.",                          options: ["has called", "called", "calls", "is calling"],       correctIndex: 1, explanation: "Yesterday = specific finished time → Past Simple: He called." },
      { id: "1-8",  prompt: "I ___ (not finish) my homework yet.",                  options: ["didn't finish", "haven't finished", "don't finish", "hadn't finished"], correctIndex: 1, explanation: "Yet signals Present Perfect: I haven't finished yet." },
      { id: "1-9",  prompt: "___ you ever ___ (be) to Japan?",                      options: ["Did … go", "Have … been", "Have … went", "Did … been"], correctIndex: 1, explanation: "Ever + life experience → Present Perfect: Have you ever been to Japan?" },
      { id: "1-10", prompt: "She ___ (graduate) two years ago.",                    options: ["has graduated", "graduated", "graduate", "is graduating"], correctIndex: 1, explanation: "Two years ago = specific finished time → Past Simple: She graduated." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Time clues: since/for → PP; yesterday/ago → PS",
    instructions:
      "The time expression in each sentence tells you which tense to use. Since and for signal Present Perfect; yesterday, last …, … ago, and specific years signal Past Simple.",
    questions: [
      { id: "2-1",  prompt: "I ___ (live) here since 2015.",                        options: ["lived", "have lived", "was living", "am living"],    correctIndex: 1, explanation: "Since 2015 → Present Perfect: I have lived here since 2015." },
      { id: "2-2",  prompt: "He ___ (leave) for Paris yesterday.",                  options: ["has left", "left", "leaves", "is leaving"],          correctIndex: 1, explanation: "Yesterday → Past Simple: He left." },
      { id: "2-3",  prompt: "They ___ (be) friends for over a decade.",             options: ["were", "have been", "are been", "had been"],          correctIndex: 1, explanation: "For + ongoing → Present Perfect: They have been friends." },
      { id: "2-4",  prompt: "I ___ (meet) her at a conference in 2019.",            options: ["have met", "met", "meet", "was meeting"],            correctIndex: 1, explanation: "In 2019 = specific past → Past Simple: I met her." },
      { id: "2-5",  prompt: "She ___ (work) there for five years.",                 options: ["worked", "has worked", "works", "was working"],       correctIndex: 1, explanation: "For five years (ongoing) → Present Perfect: She has worked there." },
      { id: "2-6",  prompt: "We ___ (not speak) since the argument.",               options: ["didn't speak", "haven't spoken", "don't speak", "hadn't spoken"], correctIndex: 1, explanation: "Since + ongoing → Present Perfect: We haven't spoken since." },
      { id: "2-7",  prompt: "He ___ (buy) a new car last month.",                   options: ["has bought", "bought", "buys", "is buying"],         correctIndex: 1, explanation: "Last month = specific finished time → Past Simple: He bought." },
      { id: "2-8",  prompt: "I ___ (know) her since we were at school.",            options: ["knew", "have known", "know", "had known"],           correctIndex: 1, explanation: "Since we were at school → Present Perfect: I have known her." },
      { id: "2-9",  prompt: "They ___ (finish) the project three days ago.",        options: ["have finished", "finished", "finish", "are finishing"], correctIndex: 1, explanation: "Three days ago = specific finished time → Past Simple: They finished." },
      { id: "2-10", prompt: "I ___ (not see) him for months.",                      options: ["didn't see", "haven't seen", "don't see", "hadn't seen"], correctIndex: 1, explanation: "For months (ongoing gap) → Present Perfect: I haven't seen him for months." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Context sentences",
    instructions:
      "Read the full context carefully. Choose Present Perfect or Past Simple based on all the clues in the sentence.",
    questions: [
      { id: "3-1",  prompt: '"Why are you wet?" — "I ___ (fall) in the river."',    options: ["fell", "have fallen", "had fallen", "fall"],         correctIndex: 1, explanation: "No specific time; present result (still wet) → Present Perfect: I have fallen." },
      { id: "3-2",  prompt: "When ___ (you / move) to this city?",                  options: ["have you moved", "did you move", "you moved", "were you moving"], correctIndex: 1, explanation: "When asks for a specific time → Past Simple: When did you move?" },
      { id: "3-3",  prompt: "I can't find my keys. I think I ___ (lose) them.",     options: ["lost", "have lost", "lose", "was losing"],           correctIndex: 1, explanation: "Present result (can't find them) + no specific time → Present Perfect: I have lost." },
      { id: "3-4",  prompt: "Shakespeare ___ (write) 37 plays.",                    options: ["has written", "wrote", "writes", "had written"],     correctIndex: 1, explanation: "Shakespeare is dead — a finished life → Past Simple: Shakespeare wrote." },
      { id: "3-5",  prompt: "The team ___ (win) six matches so far this season.",   options: ["won", "has won", "wins", "had won"],                 correctIndex: 1, explanation: "So far this season = unfinished time → Present Perfect: The team has won." },
      { id: "3-6",  prompt: "She ___ (work) at Google from 2015 to 2020.",          options: ["has worked", "worked", "works", "was working"],      correctIndex: 1, explanation: "Finished period (from 2015 to 2020) → Past Simple: She worked." },
      { id: "3-7",  prompt: "This is the best pizza I ___ (ever / eat).",           options: ["ever ate", "have ever eaten", "ever have eaten", "ever eat"], correctIndex: 1, explanation: "Best … ever → superlative + Present Perfect: This is the best pizza I have ever eaten." },
      { id: "3-8",  prompt: "Did you enjoy the concert last night? — Yes, it ___ (be) amazing!", options: ["has been", "was", "is", "has been being"], correctIndex: 1, explanation: "Last night = specific finished time → Past Simple: it was amazing." },
      { id: "3-9",  prompt: "I ___ (already / read) that article — don't send it to me.", options: ["already read", "have already read", "did already read", "already have read"], correctIndex: 1, explanation: "Already + no specific time → Present Perfect: I have already read." },
      { id: "3-10", prompt: "How many countries ___ (you / visit) before you were 30?", options: ["have you visited", "did you visit", "you visited", "were you visiting"], correctIndex: 1, explanation: "Before you were 30 = specific finished period → Past Simple: How many countries did you visit?" },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed hard: just/already/yet → PP; specific times → PS",
    instructions:
      "The hardest set. Key markers: just / already / yet / ever / never / since / for → Present Perfect. Yesterday / last … / … ago / in [year] / when / specific time → Past Simple.",
    questions: [
      { id: "4-1",  prompt: "I ___ (just / finish) cooking. Dinner is ready.",      options: ["just finished", "have just finished", "just have finished", "just was finishing"], correctIndex: 1, explanation: "Just → Present Perfect: I have just finished." },
      { id: "4-2",  prompt: "She ___ (already / send) the email before the meeting.", options: ["already sent", "had already sent", "has already sent", "already sended"], correctIndex: 2, explanation: "Already with a result relevant now → Present Perfect: She has already sent." },
      { id: "4-3",  prompt: "Have you packed yet? — No, I ___ (not do) it yet.",    options: ["didn't do", "haven't done", "don't do", "hadn't done"], correctIndex: 1, explanation: "Yet in negative → Present Perfect: I haven't done it yet." },
      { id: "4-4",  prompt: "I ___ (see) him last Tuesday at the gym.",             options: ["have seen", "saw", "see", "had seen"],                correctIndex: 1, explanation: "Last Tuesday = specific finished time → Past Simple: I saw him." },
      { id: "4-5",  prompt: "This is the first time she ___ (ever / fly) business class.", options: ["flew", "has ever flown", "ever flew", "ever has flown"], correctIndex: 1, explanation: "First time + ever → Present Perfect: she has ever flown." },
      { id: "4-6",  prompt: "The match ___ (start) an hour ago.",                   options: ["has started", "started", "starts", "is starting"],   correctIndex: 1, explanation: "An hour ago = specific finished time → Past Simple: The match started." },
      { id: "4-7",  prompt: "They ___ (already / leave) by the time I arrived.",    options: ["have already left", "had already left", "already left", "already have left"], correctIndex: 1, explanation: "Already + before a specific past time → Past Perfect: They had already left." },
      { id: "4-8",  prompt: "I ___ (not eat) anything since breakfast.",            options: ["didn't eat", "haven't eaten", "don't eat", "hadn't eaten"], correctIndex: 1, explanation: "Since + ongoing gap → Present Perfect: I haven't eaten since breakfast." },
      { id: "4-9",  prompt: "He ___ (win) the championship in 2021.",               options: ["has won", "won", "wins", "has winned"],               correctIndex: 1, explanation: "In 2021 = specific finished time → Past Simple: He won." },
      { id: "4-10", prompt: "I ___ (just / hear) the news — it's incredible!",     options: ["just heard", "have just heard", "just have heard", "just was hearing"], correctIndex: 1, explanation: "Just with a present reaction → Present Perfect: I have just heard." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Time markers",
  2: "Since/for vs ago",
  3: "Context",
  4: "Hard mixed",
};

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function PpVsPsClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

  const current = SETS[exNo];

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
          <a className="hover:text-slate-900 transition" href="/tenses/present-perfect">Present Perfect</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Present Perfect vs Past Simple</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Present Perfect{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">vs Past Simple</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700 border border-red-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">B1–B2</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          The most important distinction in English grammar at B1–B2. Learn when to use <b>Present Perfect</b> (no specific time, or with <em>ever / never / just / already / yet / since / for</em>) and when to use <b>Past Simple</b> (specific finished time: <em>yesterday, last week, in 2020, two hours ago</em>). 40 multiple-choice questions.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left ad */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
            </div>
          </aside>

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
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
            </div>
          </aside>
        </div>

        {/* Mobile ad */}
        <div className="mt-8 lg:hidden rounded-2xl border border-black/10 bg-white/60 p-4">
          <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
          <div className="mt-3 h-[90px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">320 × 90</div>
        </div>

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/present-perfect" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Present Perfect exercises</a>
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
          <span className="inline-flex items-center rounded-xl bg-emerald-600 px-3 py-1 text-xs font-black text-white">Present Perfect — use when</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "have / has", color: "yellow" },
            { text: "past participle", color: "green" },
          ]} />
          <p className="text-xs text-slate-600">No specific time is mentioned, OR the time period is still open, OR the result matters <em>now</em>.</p>
          <div className="space-y-1.5">
            <Ex en="I have seen that film. (no specific time)" />
            <Ex en="She has lived here since 2018. (ongoing)" />
            <Ex en="I've lost my keys — I can't get in! (present result)" />
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {["ever", "never", "just", "already", "yet", "since", "for", "recently", "so far", "this week", "today"].map(w => (
              <span key={w} className="rounded-lg bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-xs font-bold text-emerald-800">{w}</span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-600 px-3 py-1 text-xs font-black text-white">Past Simple — use when</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "verb (past)", color: "red" },
          ]} />
          <p className="text-xs text-slate-600">A specific, finished past time is given or implied. The event is completely in the past.</p>
          <div className="space-y-1.5">
            <Ex en="I saw that film last week." />
            <Ex en="She moved to London in 2015." />
            <Ex en="He called me yesterday morning." />
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {["yesterday", "last week", "last year", "in 2020", "two days ago", "at 3 pm", "when I was young", "on Monday"].map(w => (
              <span key={w} className="rounded-lg bg-red-100 border border-red-200 px-2 py-0.5 text-xs font-bold text-red-800">{w}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Side-by-side comparison</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-emerald-700">Present Perfect</th>
                <th className="px-4 py-2.5 font-black text-red-700">Past Simple</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["No specific time: I have seen it.", "Specific time: I saw it last night."],
                ["Unfinished: I've lived here for 5 years.", "Finished: I lived there from 2010 to 2015."],
                ["Result now: She has broken her leg.", "Event only: She broke her leg in 2022."],
                ["Experience: Have you ever tried Thai food?", "Specific occasion: Did you try Thai food in Bangkok?"],
                ["Just / already / yet: He's just left.", "Specific past: He left an hour ago."],
                ["Since / for: I haven't slept since Tuesday.", "Specific time: I didn't sleep on Tuesday night."],
              ].map(([pp, ps], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-emerald-800 font-mono text-xs">{pp}</td>
                  <td className="px-4 py-2.5 text-red-800 font-mono text-xs">{ps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">Key rule:</span> If you can answer &ldquo;When?&rdquo; with a specific finished time → use <b>Past Simple</b>. If there is no specific time, or the time is still open → use <b>Present Perfect</b>.<br />
          <span className="text-xs block mt-1">
            &ldquo;When did you arrive?&rdquo; (PS) vs &ldquo;Have you arrived yet?&rdquo; (PP)<br />
            Note: &ldquo;When have you arrived?&rdquo; ❌ — &ldquo;when&rdquo; always takes Past Simple.
          </span>
        </div>
      </div>

      {/* Special cases */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Special cases</div>
        <div className="space-y-3">
          <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4">
            <span className="inline-flex items-center rounded-lg border border-violet-200 bg-violet-100 px-2.5 py-1 text-xs font-black text-violet-800 mb-2">Dead people</span>
            <p className="text-xs text-slate-600 mb-2">When talking about someone who is no longer alive, always use Past Simple — their life is finished.</p>
            <Ex en="Shakespeare wrote 37 plays. ✅ (not 'has written')" />
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4">
            <span className="inline-flex items-center rounded-lg border border-sky-200 bg-sky-100 px-2.5 py-1 text-xs font-black text-sky-800 mb-2">Superlatives + ever</span>
            <p className="text-xs text-slate-600 mb-2">After superlatives with &ldquo;ever&rdquo;, always use Present Perfect.</p>
            <Ex en="This is the best meal I have ever eaten." />
            <Ex en="That was the worst film I have ever seen." />
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <span className="inline-flex items-center rounded-lg border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-800 mb-2">this morning / today / this week</span>
            <p className="text-xs text-slate-600 mb-2">These can go with <em>either</em> tense depending on whether the period is still open or finished.</p>
            <Ex en="I have written three emails this morning. (morning not over)" />
            <Ex en="I wrote three emails this morning. (morning is over)" />
          </div>
        </div>
      </div>

    </div>
  );
}
