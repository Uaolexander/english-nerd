"use client";

import { useMemo, useState } from "react";

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
    title: "Exercise 1 — Common irregular verbs in Future Perfect",
    instructions:
      "Choose the correct past participle to complete each Future Perfect sentence. All sentences use 'will have + past participle'. Common irregular verbs: go, see, do, make, take, eat, come, write, know, have.",
    questions: [
      {
        id: "1-1",
        prompt: "By then, she will have ___ (go) home already.",
        options: ["went", "go", "gone", "been going"],
        correctIndex: 2,
        explanation: "go → gone. Irregular past participle.",
      },
      {
        id: "1-2",
        prompt: "By the time you arrive, I will have ___ (see) the doctor.",
        options: ["saw", "seen", "see", "seeing"],
        correctIndex: 1,
        explanation: "see → seen. Irregular past participle.",
      },
      {
        id: "1-3",
        prompt: "By Friday, he will have ___ (do) all his chores.",
        options: ["did", "done", "do", "doing"],
        correctIndex: 1,
        explanation: "do → done. Irregular past participle.",
      },
      {
        id: "1-4",
        prompt: "By next month, they will have ___ (make) a final decision.",
        options: ["maked", "made", "make", "making"],
        correctIndex: 1,
        explanation: "make → made. Irregular past participle.",
      },
      {
        id: "1-5",
        prompt: "By her birthday, she will have ___ (take) her driving test.",
        options: ["took", "take", "taking", "taken"],
        correctIndex: 3,
        explanation: "take → taken. Irregular past participle.",
      },
      {
        id: "1-6",
        prompt: "By the time dinner starts, the children will have ___ (eat) their snacks.",
        options: ["ate", "eat", "eaten", "eating"],
        correctIndex: 2,
        explanation: "eat → eaten. Irregular past participle.",
      },
      {
        id: "1-7",
        prompt: "By the time you call, she will have ___ (come) back from her trip.",
        options: ["came", "come", "coming", "comes"],
        correctIndex: 1,
        explanation: "come → come. Same form as base verb — past participle of 'come' is 'come'.",
      },
      {
        id: "1-8",
        prompt: "By the end of the year, he will have ___ (write) his memoir.",
        options: ["wrote", "write", "written", "writing"],
        correctIndex: 2,
        explanation: "write → written. Irregular past participle.",
      },
      {
        id: "1-9",
        prompt: "By then, everyone will have ___ (know) the results for days.",
        options: ["knew", "know", "knowing", "known"],
        correctIndex: 3,
        explanation: "know → known. Irregular past participle.",
      },
      {
        id: "1-10",
        prompt: "By the time the presentation starts, we will have ___ (have) three meetings.",
        options: ["had", "have", "has", "having"],
        correctIndex: 0,
        explanation: "have → had. Irregular past participle.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — The -en / -n group in Future Perfect",
    instructions:
      "Choose the correct -en/-n past participle in each Future Perfect sentence. Verbs: break, fall, choose, drive, speak, steal, wear, rise, give, take.",
    questions: [
      {
        id: "2-1",
        prompt: "By morning, the fever will have ___ (break).",
        options: ["broke", "breaked", "broken", "breaking"],
        correctIndex: 2,
        explanation: "break → broken. Irregular: -en ending.",
      },
      {
        id: "2-2",
        prompt: "By the time she gets home, the snow will have ___ (fall) for six hours.",
        options: ["fell", "fallen", "fall", "falling"],
        correctIndex: 1,
        explanation: "fall → fallen. Irregular: -en ending.",
      },
      {
        id: "2-3",
        prompt: "By Friday, the committee will have ___ (choose) a winner.",
        options: ["chose", "choosed", "choose", "chosen"],
        correctIndex: 3,
        explanation: "choose → chosen. Irregular: -en ending.",
      },
      {
        id: "2-4",
        prompt: "By midnight, he will have ___ (drive) for twelve hours straight.",
        options: ["drove", "driven", "drive", "drived"],
        correctIndex: 1,
        explanation: "drive → driven. Irregular: -en ending.",
      },
      {
        id: "2-5",
        prompt: "By the end of the tour, she will have ___ (speak) to thousands of fans.",
        options: ["spoke", "speaked", "spoken", "speaking"],
        correctIndex: 2,
        explanation: "speak → spoken. Irregular: -en ending.",
      },
      {
        id: "2-6",
        prompt: "By the time police arrive, the thief will have ___ (steal) everything.",
        options: ["stole", "stolen", "steal", "stealed"],
        correctIndex: 1,
        explanation: "steal → stolen. Irregular: -en ending.",
      },
      {
        id: "2-7",
        prompt: "By the end of the trip, she will have ___ (wear) that dress four times.",
        options: ["wore", "worn", "wear", "weared"],
        correctIndex: 1,
        explanation: "wear → worn. Irregular: -n ending.",
      },
      {
        id: "2-8",
        prompt: "By sunrise, the temperature will have ___ (rise) by five degrees.",
        options: ["rose", "risen", "rise", "rised"],
        correctIndex: 1,
        explanation: "rise → risen. Irregular: -en ending.",
      },
      {
        id: "2-9",
        prompt: "By the time the host calls her name, she will have ___ (give) her speech a hundred times in her head.",
        options: ["gave", "give", "given", "giving"],
        correctIndex: 2,
        explanation: "give → given. Irregular: -en ending.",
      },
      {
        id: "2-10",
        prompt: "By next summer, he will have ___ (take) every advanced class available.",
        options: ["took", "taking", "take", "taken"],
        correctIndex: 3,
        explanation: "take → taken. Irregular: -en ending.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — The -ought/-aught and -ound/-eld group",
    instructions:
      "Choose the correct past participle. Focus on -ought/-aught (buy, bring, catch, think, teach) and -ound/-eld (find, hold, build) verbs in Future Perfect sentences.",
    questions: [
      {
        id: "3-1",
        prompt: "By next week, she will have ___ (buy) all her school supplies.",
        options: ["buyed", "buyed", "bought", "buy"],
        correctIndex: 2,
        explanation: "buy → bought. Irregular: -ought ending.",
      },
      {
        id: "3-2",
        prompt: "By the time I need it, he will have ___ (bring) the files.",
        options: ["bringed", "brung", "bringing", "brought"],
        correctIndex: 3,
        explanation: "bring → brought. Irregular: -ought ending.",
      },
      {
        id: "3-3",
        prompt: "By then, the police will have ___ (catch) the suspect.",
        options: ["catched", "cought", "caught", "catching"],
        correctIndex: 2,
        explanation: "catch → caught. Irregular: -aught ending.",
      },
      {
        id: "3-4",
        prompt: "By the end of the course, she will have ___ (teach) over 500 students.",
        options: ["teached", "tought", "taught", "teaching"],
        correctIndex: 2,
        explanation: "teach → taught. Irregular: -aught ending.",
      },
      {
        id: "3-5",
        prompt: "By the time the meeting ends, I will have ___ (think) of a solution.",
        options: ["thinked", "thinking", "thought", "think"],
        correctIndex: 2,
        explanation: "think → thought. Irregular: -ought ending.",
      },
      {
        id: "3-6",
        prompt: "By the deadline, they will have ___ (find) a suitable candidate.",
        options: ["finded", "finding", "founded", "found"],
        correctIndex: 3,
        explanation: "find → found. Irregular: -ound ending.",
      },
      {
        id: "3-7",
        prompt: "By next spring, the company will have ___ (build) a new warehouse.",
        options: ["builded", "building", "built", "build"],
        correctIndex: 2,
        explanation: "build → built. Irregular: -uilt ending.",
      },
      {
        id: "3-8",
        prompt: "By the time she retires, she will have ___ (hold) that position for twenty years.",
        options: ["holded", "holded", "held", "holding"],
        correctIndex: 2,
        explanation: "hold → held. Irregular: -eld ending.",
      },
      {
        id: "3-9",
        prompt: "By the end of the season, they will have ___ (sell) over a million tickets.",
        options: ["selled", "selling", "sold", "sell"],
        correctIndex: 2,
        explanation: "sell → sold. Irregular: -old ending.",
      },
      {
        id: "3-10",
        prompt: "By the ceremony, the team will have ___ (fight) through months of challenges.",
        options: ["fighted", "fought", "fighting", "fight"],
        correctIndex: 1,
        explanation: "fight → fought. Irregular: -ought ending.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Same-form verbs + tricky irregular participles",
    instructions:
      "Choose the correct past participle. Focus on same-form verbs (put→put, cut→cut, let→let, hit→hit, set→set) and tricky ones (fly→flown, grow→grown, throw→thrown, show→shown, know→known).",
    questions: [
      {
        id: "4-1",
        prompt: "By then, she will have ___ (put) the children to bed.",
        options: ["putted", "putting", "put", "puts"],
        correctIndex: 2,
        explanation: "put → put. Same-form verb: base = past simple = past participle.",
      },
      {
        id: "4-2",
        prompt: "By the time you see it, someone will have ___ (cut) the grass.",
        options: ["cutted", "cutting", "cuts", "cut"],
        correctIndex: 3,
        explanation: "cut → cut. Same-form verb.",
      },
      {
        id: "4-3",
        prompt: "By midnight, he will have ___ (fly) over three continents.",
        options: ["flied", "flew", "fly", "flown"],
        correctIndex: 3,
        explanation: "fly → flown. Irregular: -own ending.",
      },
      {
        id: "4-4",
        prompt: "By harvest, the farmer will have ___ (grow) enough vegetables for winter.",
        options: ["growed", "grew", "grow", "grown"],
        correctIndex: 3,
        explanation: "grow → grown. Irregular: -own ending.",
      },
      {
        id: "4-5",
        prompt: "By the time the coach arrives, she will have ___ (hit) 100 balls.",
        options: ["hitted", "hitting", "hits", "hit"],
        correctIndex: 3,
        explanation: "hit → hit. Same-form verb.",
      },
      {
        id: "4-6",
        prompt: "By then, the researchers will have ___ (show) that the method works.",
        options: ["showed", "showing", "shown", "show"],
        correctIndex: 2,
        explanation: "show → shown. Irregular: -own ending (though 'showed' is also accepted in some dialects, 'shown' is the standard past participle).",
      },
      {
        id: "4-7",
        prompt: "By the end of the game, the pitcher will have ___ (throw) over 100 pitches.",
        options: ["throwed", "threw", "throwing", "thrown"],
        correctIndex: 3,
        explanation: "throw → thrown. Irregular: -own ending.",
      },
      {
        id: "4-8",
        prompt: "By graduation, the students will have ___ (let) go of many fears.",
        options: ["letted", "letting", "let", "lets"],
        correctIndex: 2,
        explanation: "let → let. Same-form verb.",
      },
      {
        id: "4-9",
        prompt: "By the end of his career, he will have ___ (set) dozens of records.",
        options: ["setted", "setting", "sets", "set"],
        correctIndex: 3,
        explanation: "set → set. Same-form verb.",
      },
      {
        id: "4-10",
        prompt: "By the time her book is published, everyone will have ___ (forget) the controversy.",
        options: ["forgot", "forgotten", "forgetted", "forgetting"],
        correctIndex: 1,
        explanation: "forget → forgotten. Irregular: -otten ending.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Common verbs",
  2: "-en / -n group",
  3: "-ought / -aught",
  4: "Same-form + tricky",
};

export default function IrregularParticiplesClient() {
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
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a><span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a><span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/future-perfect">Future Perfect</a><span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Irregular Participles</span>
        </div>
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Future Perfect <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Irregular Participles</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Upper-intermediate</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">B2</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">40 questions practising irregular past participles in Future Perfect context. Master gone/seen/done, -en group, -ought/-aught group, and same-form verbs.</p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <aside className="hidden lg:block"><div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4"><div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div><div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div></div></aside>
          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <div className="ml-auto hidden sm:flex items-center gap-2">
                <span className="text-slate-400 text-xs">Set:</span>
                {([1, 2, 3, 4] as const).map((n) => (
                  <button key={n} onClick={() => switchSet(n)} title={SET_LABELS[n]} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
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
                        <button key={n} onClick={() => switchSet(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
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
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => setAnswers((p) => ({ ...p, [q.id]: oi }))} className="accent-[#F5DA20]" />
                                    <span className="text-sm text-slate-900">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              {checked && (
                                <div className="mt-3 text-sm">
                                  {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                  {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                  {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                  <div className="mt-1.5 text-slate-600"><b className="text-slate-900">Correct answer:</b> {q.options[q.correctIndex]} — {q.explanation}</div>
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
                        <button onClick={() => { setChecked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
                      ) : (
                        <button onClick={reset} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">Try Again</button>
                      )}
                      {checked && exNo < 4 && (
                        <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">Next Exercise →</button>
                      )}
                    </div>
                    {score && (
                      <div className={`rounded-2xl border p-4 ${score.percent >= 80 ? "border-emerald-200 bg-emerald-50" : score.percent >= 50 ? "border-amber-200 bg-amber-50" : "border-red-200 bg-red-50"}`}>
                        <div className="flex items-center justify-between">
                          <div><div className={`text-3xl font-black ${score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"}`}>{score.percent}%</div><div className="mt-0.5 text-sm text-slate-600">{score.correct} out of {score.total} correct</div></div>
                          <div className="text-3xl">{score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}</div>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden"><div className={`h-2 rounded-full transition-all duration-500 ${score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${score.percent}%` }} /></div>
                        <div className="mt-2 text-xs text-slate-500">{score.percent >= 80 ? "Excellent! Move on to the next exercise." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}</div>
                      </div>
                    )}
                  </div>
                </>
              ) : (<Explanation />)}
            </div>
          </section>
          <aside className="hidden lg:block"><div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4"><div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div><div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div></div></aside>
        </div>
        <div className="mt-8 lg:hidden rounded-2xl border border-black/10 bg-white/60 p-4"><div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div><div className="mt-3 h-[90px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">320 × 90</div></div>
        <div className="mt-10 flex items-center gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-perfect" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Future Perfect exercises</a>
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
      <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
        <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">Reminder: Future Perfect formula</span>
        <Formula parts={[
          { text: "Subject", color: "sky" },
          { text: "will have", color: "yellow" },
          { text: "past participle", color: "green" },
          { text: "by [deadline]", color: "violet" },
        ]} />
        <div className="space-y-1.5">
          <Ex en="By then, she will have gone home." />
          <Ex en="By Friday, he will have written the report." />
          <Ex en="By 2030, they will have built the station." />
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">Key reminder: use the PAST PARTICIPLE (3rd form)</div>
        <div className="text-xs text-amber-700 space-y-1 mt-2">
          <div>✅ She will have <b>gone</b>. &nbsp;|&nbsp; ❌ She will have <b>went</b>. (past simple, not participle)</div>
          <div>✅ He will have <b>written</b>. &nbsp;|&nbsp; ❌ He will have <b>wrote</b>. (past simple)</div>
          <div>✅ They will have <b>made</b>. &nbsp;|&nbsp; ❌ They will have <b>make</b>. (base form)</div>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Group 1 — Common verbs</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Base</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Past Simple</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Past Participle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["go", "went", "gone"],
                ["see", "saw", "seen"],
                ["do", "did", "done"],
                ["make", "made", "made"],
                ["take", "took", "taken"],
                ["eat", "ate", "eaten"],
                ["come", "came", "come"],
                ["write", "wrote", "written"],
                ["know", "knew", "known"],
                ["have", "had", "had"],
              ].map(([base, past, pp], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 font-semibold text-slate-700 font-mono text-sm">{base}</td>
                  <td className="px-4 py-2.5 text-slate-500 font-mono text-sm">{past}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-black font-mono text-sm">{pp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Group 2 — The -en / -n group</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Base</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Past Participle</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Base</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Past Participle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["break", "broken", "fall", "fallen"],
                ["choose", "chosen", "drive", "driven"],
                ["speak", "spoken", "steal", "stolen"],
                ["wear", "worn", "rise", "risen"],
                ["give", "given", "take", "taken"],
              ].map((row, i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 font-semibold text-slate-700 font-mono text-sm">{row[0]}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-black font-mono text-sm">{row[1]}</td>
                  <td className="px-4 py-2.5 font-semibold text-slate-700 font-mono text-sm">{row[2]}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-black font-mono text-sm">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Group 3 — -ought / -aught / -ound / -eld</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Base</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Past Participle</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Base</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Past Participle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["buy", "bought", "catch", "caught"],
                ["bring", "brought", "teach", "taught"],
                ["think", "thought", "fight", "fought"],
                ["find", "found", "hold", "held"],
                ["build", "built", "sell", "sold"],
              ].map((row, i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 font-semibold text-slate-700 font-mono text-sm">{row[0]}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-black font-mono text-sm">{row[1]}</td>
                  <td className="px-4 py-2.5 font-semibold text-slate-700 font-mono text-sm">{row[2]}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-black font-mono text-sm">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Group 4 — Same-form + -own group</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Base</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Past Participle</th>
                <th className="px-4 py-2.5 font-black text-violet-700">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["put", "put", "same form (base = pp)"],
                ["cut", "cut", "same form"],
                ["let", "let", "same form"],
                ["hit", "hit", "same form"],
                ["set", "set", "same form"],
                ["fly", "flown", "-own ending"],
                ["grow", "grown", "-own ending"],
                ["throw", "thrown", "-own ending"],
                ["show", "shown", "-own ending"],
                ["forget", "forgotten", "-otten ending"],
              ].map(([base, pp, note], i) => (
                <tr key={i} className={i < 5 ? "bg-amber-50" : "bg-white"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700 font-mono text-sm">{base}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-black font-mono text-sm">{pp}</td>
                  <td className="px-4 py-2.5 text-slate-500 text-xs italic">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
