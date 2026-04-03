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
    title: "Exercise 1 — for or since: choose the correct time word",
    instructions:
      "Choose 'for' or 'since' to complete each Future Perfect Continuous sentence. Remember: 'for' = duration period; 'since' = starting point.",
    questions: [
      {
        id: "1-1",
        prompt: "By June, I will have been working here ___ 10 years.",
        options: ["for", "since", "during", "while"],
        correctIndex: 0,
        explanation: "'for' + period of time: for 10 years — a span of duration, not a starting point.",
      },
      {
        id: "1-2",
        prompt: "By June, I will have been working here ___ 2014.",
        options: ["for", "since", "from", "by"],
        correctIndex: 1,
        explanation: "'since' + year/starting point: since 2014 — the moment the action began.",
      },
      {
        id: "1-3",
        prompt: "How long will they have been waiting ___ the time we arrive?",
        options: ["since", "for", "until", "by"],
        correctIndex: 3,
        explanation: "'by the time' is the future reference point — 'by' introduces the deadline.",
      },
      {
        id: "1-4",
        prompt: "She will have been studying piano ___ she was seven years old.",
        options: ["for", "during", "while", "since"],
        correctIndex: 3,
        explanation: "'since' + past moment: since she was seven — a specific starting point in time.",
      },
      {
        id: "1-5",
        prompt: "By 2030, they ___ living in this city ___ over twenty years.",
        options: ["will have been / for", "will be / since", "have been / for", "will have / since"],
        correctIndex: 0,
        explanation: "FPC: will have been living + 'for' + period (over twenty years = duration).",
      },
      {
        id: "1-6",
        prompt: "He won't have been sleeping ___ long — he only went to bed an hour ago.",
        options: ["since", "by", "for", "during"],
        correctIndex: 2,
        explanation: "'for long' = for a long period. Negative FPC + for long.",
      },
      {
        id: "1-7",
        prompt: "By next spring, she will have been teaching at this school ___ September.",
        options: ["for", "since", "during", "from"],
        correctIndex: 1,
        explanation: "'since' + month as starting point: since September — when she started.",
      },
      {
        id: "1-8",
        prompt: "Will you have been playing in the team ___ three seasons by the final?",
        options: ["since", "for", "by", "until"],
        correctIndex: 1,
        explanation: "'for' + number of seasons — a countable duration period.",
      },
      {
        id: "1-9",
        prompt: "By next month, the construction crew will have been working on the bridge ___ early 2022.",
        options: ["for", "by", "since", "during"],
        correctIndex: 2,
        explanation: "'since' + point in time (early 2022) = when work started.",
      },
      {
        id: "1-10",
        prompt: "They won't have been dating ___ very long when they get married.",
        options: ["since", "by", "while", "for"],
        correctIndex: 3,
        explanation: "'for' + duration: for very long — a period, not a starting point.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Choose the correct time expression",
    instructions:
      "Given a complete Future Perfect Continuous sentence, choose the most appropriate 'for' or 'since' time expression from the four options.",
    questions: [
      {
        id: "2-1",
        prompt: "By tomorrow morning, she will have been studying ___.",
        options: ["since all night", "for all night", "since morning", "for eight hours"],
        correctIndex: 3,
        explanation: "'for eight hours' = a duration period. 'Since morning' would also work grammatically but here the best answer is 'for eight hours'.",
      },
      {
        id: "2-2",
        prompt: "By the time he retires, he will have been working at the firm ___.",
        options: ["for he was 22", "since he was 22", "for graduating", "since many years"],
        correctIndex: 1,
        explanation: "'since he was 22' — a specific past starting point introduced by 'since'.",
      },
      {
        id: "2-3",
        prompt: "By graduation day, I will have been living in this city ___.",
        options: ["since four years", "for 2019", "for four years", "since four years ago"],
        correctIndex: 2,
        explanation: "'for four years' — a duration period. 'Since four years' is incorrect; 'for' is used with periods.",
      },
      {
        id: "2-4",
        prompt: "Will they have been arguing about this ___?",
        options: ["for since yesterday", "for yesterday", "since yesterday", "by yesterday"],
        correctIndex: 2,
        explanation: "'since yesterday' — yesterday is a specific past point, so 'since' is correct.",
      },
      {
        id: "2-5",
        prompt: "By 2040, the company will have been operating ___.",
        options: ["for a century", "since a century", "for 1940", "by a century"],
        correctIndex: 0,
        explanation: "'for a century' — a century is a length of time (duration), so 'for' is used.",
      },
      {
        id: "2-6",
        prompt: "She won't have been waiting ___— she only just arrived.",
        options: ["since long", "for she arrived", "since hours", "for long"],
        correctIndex: 3,
        explanation: "'for long' = for a long time. Standard negative FPC collocation.",
      },
      {
        id: "2-7",
        prompt: "By his birthday, he will have been learning the guitar ___.",
        options: ["since six months", "for January", "for six months", "since six months ago"],
        correctIndex: 2,
        explanation: "'for six months' — six months is a duration period. 'Since six months' is ungrammatical.",
      },
      {
        id: "2-8",
        prompt: "How long will you have been living here ___ you move out?",
        options: ["since", "for", "by the time", "until"],
        correctIndex: 2,
        explanation: "'by the time you move out' — this establishes the future reference point for the FPC.",
      },
      {
        id: "2-9",
        prompt: "By the end of the year, the team will have been developing the app ___.",
        options: ["for eighteen months", "since eighteen months", "by January", "for January"],
        correctIndex: 0,
        explanation: "'for eighteen months' — a span of time. 'Since eighteen months' is wrong.",
      },
      {
        id: "2-10",
        prompt: "They will have been married ___ 2010 by their next anniversary.",
        options: ["for", "during", "since", "by"],
        correctIndex: 2,
        explanation: "'since 2010' — a specific year as starting point. 'Since' + point in time.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — How long…? questions and responses",
    instructions:
      "Complete 'How long will you have been…?' questions and their short responses. Mix of questions and answer options.",
    questions: [
      {
        id: "3-1",
        prompt: "How long ___ you have been studying at this university by graduation?",
        options: ["have", "are", "would", "will"],
        correctIndex: 3,
        explanation: "How long will you have been…? — 'will' forms the future perfect continuous question.",
      },
      {
        id: "3-2",
        prompt: "'How long will she have been teaching here by June?' — 'She ___ for fifteen years.'",
        options: ["will have been teaching", "will be teaching", "will have taught", "teaches"],
        correctIndex: 0,
        explanation: "Full answer repeats the FPC: will have been teaching for fifteen years.",
      },
      {
        id: "3-3",
        prompt: "How long will they have been ___ by the time the album is released?",
        options: ["record", "recorded", "recording", "records"],
        correctIndex: 2,
        explanation: "will have been + recording: present participle required after 'have been'.",
      },
      {
        id: "3-4",
        prompt: "'How long will you have been waiting?' — '___, I will have been waiting for over an hour.'",
        options: ["By noon", "Since noon", "For noon", "Until noon"],
        correctIndex: 0,
        explanation: "'By noon' introduces the future point of reference in the FPC answer.",
      },
      {
        id: "3-5",
        prompt: "How long ___ the engineers have been working on this problem by the deadline?",
        options: ["will", "have", "do", "are"],
        correctIndex: 0,
        explanation: "Will the engineers have been working…? — 'will' in How long will… question.",
      },
      {
        id: "3-6",
        prompt: "'How long will he have been driving?' — 'He will have been driving ___ six o'clock this morning.'",
        options: ["since", "for", "by", "until"],
        correctIndex: 0,
        explanation: "'since six o'clock' — a specific time as starting point.",
      },
      {
        id: "3-7",
        prompt: "By the time we finish this course, how long ___ we have been studying together?",
        options: ["have", "are", "will", "do"],
        correctIndex: 2,
        explanation: "Will we have been studying? — FPC question form with 'by the time'.",
      },
      {
        id: "3-8",
        prompt: "'How long will you have been living abroad by next year?' — 'I will have been living abroad ___ exactly three years.'",
        options: ["since", "by", "for", "during"],
        correctIndex: 2,
        explanation: "'for exactly three years' — a duration period.",
      },
      {
        id: "3-9",
        prompt: "How long will the restaurant have been ___ by its fiftieth anniversary?",
        options: ["operate", "operated", "operating", "operates"],
        correctIndex: 2,
        explanation: "will have been + operating: present participle form after 'have been'.",
      },
      {
        id: "3-10",
        prompt: "'How long will they have been arguing by the time we intervene?' — 'They ___ arguing for at least two hours.'",
        options: ["will have been", "will be", "will have", "are"],
        correctIndex: 0,
        explanation: "FPC full answer: will have been arguing for two hours — duration up to intervention.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Full FPC with duration: all forms mixed",
    instructions:
      "Complete sentences with the correct Future Perfect Continuous form (affirmative, negative, or question) and the correct duration word (for/since). Varied forms throughout.",
    questions: [
      {
        id: "4-1",
        prompt: "By the end of December, she ___ running her own café since the spring.",
        options: ["will have been", "will be", "will have", "has been"],
        correctIndex: 0,
        explanation: "Affirmative FPC: will have been running — duration from spring to December end.",
      },
      {
        id: "4-2",
        prompt: "He ___ exercising long enough to see results — he just started last week.",
        options: ["will have been", "will be", "won't have been", "has been"],
        correctIndex: 2,
        explanation: "Negative FPC: won't have been exercising long enough — only started last week.",
      },
      {
        id: "4-3",
        prompt: "___ the scientists have been researching this for over a decade by 2035?",
        options: ["Have", "Are", "Will", "Do"],
        correctIndex: 2,
        explanation: "Question: Will the scientists have been researching…? — FPC question form.",
      },
      {
        id: "4-4",
        prompt: "By their silver wedding anniversary, they ___ married for 25 years.",
        options: ["will have been", "will be", "are", "have been"],
        correctIndex: 0,
        explanation: "Affirmative FPC: will have been married for 25 years — duration up to anniversary.",
      },
      {
        id: "4-5",
        prompt: "She ___ sleeping for long when the alarm goes off — she only just fell asleep.",
        options: ["won't have been", "will have been", "will be", "had been"],
        correctIndex: 0,
        explanation: "Negative FPC: won't have been sleeping for long — she just fell asleep.",
      },
      {
        id: "4-6",
        prompt: "By next autumn, ___ she have been living in France for five years?",
        options: ["has", "is", "would", "will"],
        correctIndex: 3,
        explanation: "Question: Will she have been living…? — inverted FPC question structure.",
      },
      {
        id: "4-7",
        prompt: "By the time the new manager arrives, the team ___ working without leadership for six months.",
        options: ["will have been", "will be", "has been", "will have"],
        correctIndex: 0,
        explanation: "Affirmative FPC: will have been working without leadership for six months.",
      },
      {
        id: "4-8",
        prompt: "Don't worry — they ___ waiting very long by the time we get there.",
        options: ["will have been", "will be", "won't have been", "are"],
        correctIndex: 2,
        explanation: "Negative FPC: won't have been waiting very long — reassurance.",
      },
      {
        id: "4-9",
        prompt: "How long ___ the volunteers have been collecting donations by the end of the campaign?",
        options: ["have", "are", "will", "do"],
        correctIndex: 2,
        explanation: "How long will the volunteers have been collecting…? — FPC question.",
      },
      {
        id: "4-10",
        prompt: "By 2050, this bridge ___ standing since 1950 — a full century.",
        options: ["will have been", "will be", "will have", "has been"],
        correctIndex: 0,
        explanation: "Affirmative FPC with 'since': will have been standing since 1950 — a century of duration.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "for or since",
  2: "Time Expressions",
  3: "How long…?",
  4: "All Forms Mixed",
};

export default function ForDurationFutureClient() {
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
          <a className="hover:text-slate-900 transition" href="/tenses/future-perfect-continuous">Future Perfect Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Duration Up to a Future Point</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            FPC <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Duration Up to a Future Point</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 border border-rose-200">Hard</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">C1</span>
        </div>

        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions about using <b>for</b> and <b>since</b> with Future Perfect Continuous to express how long an action will have been going on by a specific future point.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {/* Left ad */}
          <AdUnit variant="sidebar-dark" />

          {/* Main content */}
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <div className="ml-auto hidden sm:flex items-center gap-2">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]}
                    className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
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
                          className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
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
        <div className="mt-10 flex items-center gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-perfect-continuous" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Future Perfect Continuous exercises</a>
        </div>
      </div>
    </div>
  );
}

/* ─── Explanation helpers ────────────────────────────────────────────────── */

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
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">for — duration period</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "will have been", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: "for", color: "violet" },
            { text: "[length of time]", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="By June, I will have been working here for 10 years." />
            <Ex en="She will have been studying for three hours by the time the exam starts." />
            <Ex en="They won't have been waiting for long when we arrive." />
          </div>
          <div className="text-xs text-emerald-700 font-semibold">for + 10 years / for 3 hours / for ages / for a long time / for long</div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">since — starting point</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "will have been", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: "since", color: "violet" },
            { text: "[point in time]", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="By June, I will have been working here since 2014." />
            <Ex en="She will have been teaching since she was 24 by retirement." />
            <Ex en="They will have been living there since March by the time they move." />
          </div>
          <div className="text-xs text-sky-700 font-semibold">since + 2014 / since 9am / since Monday / since she started</div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-violet-50 to-white border border-violet-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-violet-500 px-3 py-1 text-xs font-black text-white">? How long will…?</span>
          <Formula parts={[
            { text: "How long", color: "violet" },
            { text: "will", color: "yellow" },
            { text: "subject", color: "sky" },
            { text: "have been", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: "by [time]?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="How long will you have been working here by next December?" />
            <Ex en="How long will they have been building the stadium by the opening ceremony?" />
          </div>
        </div>
      </div>

      {/* for vs since comparison table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">for vs since — key difference</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-emerald-700">for + period</th>
                <th className="px-4 py-2.5 font-black text-sky-700">since + point</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["for 10 years", "since 2014"],
                ["for 3 hours", "since 9am"],
                ["for ages", "since last Monday"],
                ["for a long time", "since I started"],
                ["for six months", "since June"],
              ].map(([f, s], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm">{f}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-sm">{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">Common mistake:</span> Do not say "since three years" — it should be <b>"for three years"</b>. 'Since' needs a specific point in time, not a duration.
        </div>
      </div>

      {/* PPC vs FPC comparison */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Present Perfect Continuous vs Future Perfect Continuous</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Tense</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Form</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Present Perfect Continuous", "have/has been + -ing", "I have been working here for 3 years. (up to now)"],
                ["Future Perfect Continuous", "will have been + -ing", "I will have been working here for 10 years by 2030. (up to future point)"],
              ].map(([tense, form, ex], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{tense}</td>
                  <td className="px-4 py-2.5 text-violet-700 font-mono text-xs">{form}</td>
                  <td className="px-4 py-2.5 text-slate-600 text-xs">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signal words */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Key signal phrases with FPC</div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "Future reference point", examples: ["by June", "by 2030", "by the time you arrive", "by next year"] },
            { label: "Duration (use for)", examples: ["for 10 years", "for three hours", "for ages", "for a long time"] },
            { label: "Starting point (use since)", examples: ["since 2014", "since 9am", "since last Monday", "since I started"] },
            { label: "Question structure", examples: ["How long will…?", "Will … have been…?", "By when will…?"] },
          ].map((cat, i) => (
            <div key={i} className="rounded-xl bg-slate-50 border border-black/8 p-3">
              <div className="text-xs font-black text-slate-500 mb-2">{cat.label}</div>
              <div className="flex flex-wrap gap-1.5">
                {cat.examples.map((e) => (
                  <span key={e} className="rounded-lg bg-white border border-black/10 px-2 py-1 text-xs font-semibold text-slate-700">{e}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
