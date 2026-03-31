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
    title: "Exercise 1 — Mixed forms: will be / won't be / Will…?",
    instructions:
      "Choose the correct Future Continuous form. Each sentence needs either affirmative (will be + -ing), negative (won't be + -ing), or question form (Will + subject + be + -ing?). Watch the context clues.",
    questions: [
      {
        id: "1-1",
        prompt: "This time tomorrow, I ___ flying to Paris.",
        options: ["will be", "won't be", "will", "am going to"],
        correctIndex: 0,
        explanation: "Affirmative: 'will be + -ing'. The context is a planned future action in progress.",
      },
      {
        id: "1-2",
        prompt: "She ___ working tonight — she has the evening off.",
        options: ["will be", "won't be", "will", "is going to be"],
        correctIndex: 1,
        explanation: "Negative: 'won't be + -ing'. 'She has the evening off' confirms it's negative.",
      },
      {
        id: "1-3",
        prompt: "___ he be waiting for us at the station?",
        options: ["Won't", "Will", "Does", "Is"],
        correctIndex: 1,
        explanation: "Question: 'Will + subject + be + -ing?' Future Continuous questions use 'Will'.",
      },
      {
        id: "1-4",
        prompt: "Don't call at 9 PM — they ___ having dinner.",
        options: ["won't be", "will be", "are", "have been"],
        correctIndex: 1,
        explanation: "Affirmative: 'will be + -ing'. The request not to call implies they will be busy.",
      },
      {
        id: "1-5",
        prompt: "We ___ staying at that hotel again — it was terrible.",
        options: ["will be", "won't be", "are", "will"],
        correctIndex: 1,
        explanation: "Negative: 'won't be + -ing'. 'It was terrible' clearly signals a negative decision.",
      },
      {
        id: "1-6",
        prompt: "___ you be using the printer this afternoon?",
        options: ["Are", "Do", "Will", "Won't"],
        correctIndex: 2,
        explanation: "Question: 'Will + subject + be + -ing?' This is a polite Future Continuous question.",
      },
      {
        id: "1-7",
        prompt: "At 6 AM tomorrow, the team ___ setting up the exhibition.",
        options: ["won't be", "will be", "sets up", "will"],
        correctIndex: 1,
        explanation: "Affirmative: 'will be + -ing'. The time marker 'At 6 AM tomorrow' signals an action in progress.",
      },
      {
        id: "1-8",
        prompt: "I ___ going to the party — I've already said no.",
        options: ["will be", "won't be", "am not", "will not"],
        correctIndex: 1,
        explanation: "Negative: 'won't be + -ing'. 'I've already said no' confirms the negative.",
      },
      {
        id: "1-9",
        prompt: "___ she be presenting at the conference next week?",
        options: ["Is", "Does", "Will", "Has"],
        correctIndex: 2,
        explanation: "Question: 'Will + subject + be + -ing?' — Will she be presenting…?",
      },
      {
        id: "1-10",
        prompt: "By the time you wake up, I ___ already running in the park.",
        options: ["won't be", "will be", "am", "run"],
        correctIndex: 1,
        explanation: "Affirmative: 'will be + -ing'. The action (running) will be in progress at that future moment.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — -ing spelling in Future Continuous",
    instructions:
      "Each sentence uses Future Continuous. Choose the correct -ing spelling. Remember the rules: drop -e (make→making), double CVC (run→running), -ie→-ying (die→dying), most others just add -ing.",
    questions: [
      {
        id: "2-1",
        prompt: "She'll be ___ (run) for the bus at this time tomorrow.",
        options: ["runing", "runeing", "running", "runned"],
        correctIndex: 2,
        explanation: "run → running. Short vowel + single consonant (CVC): double the final consonant.",
      },
      {
        id: "2-2",
        prompt: "They won't be ___ (make) noise after 10 PM.",
        options: ["makeing", "makking", "maked", "making"],
        correctIndex: 3,
        explanation: "make → making. Drop the final -e, then add -ing.",
      },
      {
        id: "2-3",
        prompt: "Will you be ___ (sit) next to me at the ceremony?",
        options: ["siting", "siteing", "sitten", "sitting"],
        correctIndex: 3,
        explanation: "sit → sitting. Short CVC verb: double the final consonant.",
      },
      {
        id: "2-4",
        prompt: "He'll be ___ (lie) on the sofa when we arrive.",
        options: ["lieing", "lyeing", "lying", "lie-ing"],
        correctIndex: 2,
        explanation: "lie → lying. Verbs ending in -ie: change -ie to -y, then add -ing.",
      },
      {
        id: "2-5",
        prompt: "We won't be ___ (swim) — the pool is closed.",
        options: ["swiming", "swimeing", "swimming", "swimmed"],
        correctIndex: 2,
        explanation: "swim → swimming. Short CVC verb: double the final consonant.",
      },
      {
        id: "2-6",
        prompt: "Will she be ___ (drive) the car this evening?",
        options: ["driveing", "drivving", "driven", "driving"],
        correctIndex: 3,
        explanation: "drive → driving. Drop the final -e, then add -ing.",
      },
      {
        id: "2-7",
        prompt: "At noon I'll be ___ (write) my final exam.",
        options: ["writeing", "writting", "writing", "writed"],
        correctIndex: 2,
        explanation: "write → writing. Drop the final -e, then add -ing.",
      },
      {
        id: "2-8",
        prompt: "She won't be ___ (cut) her hair this week.",
        options: ["cuting", "cuteing", "cutting", "cuted"],
        correctIndex: 2,
        explanation: "cut → cutting. Short CVC verb: double the final consonant.",
      },
      {
        id: "2-9",
        prompt: "Will they be ___ (travel) by train or by plane?",
        options: ["travling", "traveling", "travleing", "travelling"],
        correctIndex: 3,
        explanation: "travel → travelling (UK English). Double the -l before -ing.",
      },
      {
        id: "2-10",
        prompt: "He'll be ___ (dance) at the wedding all night.",
        options: ["danceing", "dansing", "dancing", "danccing"],
        correctIndex: 2,
        explanation: "dance → dancing. Drop the final -e, then add -ing.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions and short answers",
    instructions:
      "Choose the correct question form or short answer for Future Continuous. Questions: Will + subject + be + -ing? Short answers: Yes, [subject] will. / No, [subject] won't.",
    questions: [
      {
        id: "3-1",
        prompt: "\"Will she be working late?\" — \"Yes, ___\"",
        options: ["she is.", "she will be working.", "she will.", "she does."],
        correctIndex: 2,
        explanation: "Short affirmative answer: Yes, she will. (just the modal, no need to repeat be + -ing)",
      },
      {
        id: "3-2",
        prompt: "\"Will they be attending the meeting?\" — \"No, ___\"",
        options: ["they won't.", "they aren't.", "they don't.", "they won't be attending."],
        correctIndex: 0,
        explanation: "Short negative answer: No, they won't.",
      },
      {
        id: "3-3",
        prompt: "___ he be joining us for dinner tonight?",
        options: ["Does", "Is", "Will", "Has"],
        correctIndex: 2,
        explanation: "Future Continuous question starts with 'Will': Will he be joining us?",
      },
      {
        id: "3-4",
        prompt: "\"Will you be using the gym tomorrow?\" — \"Yes, ___\"",
        options: ["I am.", "I will.", "I do.", "I'll be."],
        correctIndex: 1,
        explanation: "Short affirmative: Yes, I will.",
      },
      {
        id: "3-5",
        prompt: "Will ___ be waiting outside when I finish?",
        options: ["they", "them", "their", "theirs"],
        correctIndex: 0,
        explanation: "Will + subject + be + -ing: Will they be waiting? Subject pronouns follow 'Will'.",
      },
      {
        id: "3-6",
        prompt: "\"Will the boss be checking our reports?\" — \"No, ___\"",
        options: ["he won't be checking.", "he isn't.", "he won't.", "he doesn't."],
        correctIndex: 2,
        explanation: "Short negative answer: No, he won't.",
      },
      {
        id: "3-7",
        prompt: "___ she be coming to the event or not?",
        options: ["Does", "Is", "Will", "Would"],
        correctIndex: 2,
        explanation: "Future Continuous question: Will + subject + be + -ing?",
      },
      {
        id: "3-8",
        prompt: "\"Will you be staying for the second half?\" — \"Yes, ___\"",
        options: ["I am staying.", "I stay.", "I will.", "I'd be."],
        correctIndex: 2,
        explanation: "Short affirmative: Yes, I will.",
      },
      {
        id: "3-9",
        prompt: "\"Will we be needing umbrellas?\" — \"No, ___\"",
        options: ["we don't.", "we won't.", "we aren't.", "we haven't."],
        correctIndex: 1,
        explanation: "Short negative answer: No, we won't.",
      },
      {
        id: "3-10",
        prompt: "Will the children ___ sleeping by 8 PM?",
        options: ["are", "be", "been", "being"],
        correctIndex: 1,
        explanation: "Will + subject + be + -ing: Will the children be sleeping?",
      },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — All forms + Future Continuous vs Future Simple",
    instructions:
      "Mixed exercise: some gaps need Future Continuous (will be + -ing — ongoing at a future moment), others need Future Simple (will + base — a single future action or decision). Read carefully.",
    questions: [
      {
        id: "4-1",
        prompt: "I ___ call you as soon as the meeting ends. (single action)",
        options: ["will be calling", "won't be calling", "will call", "am calling"],
        correctIndex: 2,
        explanation: "Future Simple: 'will call' for a single future action/promise, not ongoing.",
      },
      {
        id: "4-2",
        prompt: "At 3 PM tomorrow, she ___ presenting her project to the board. (in progress)",
        options: ["will present", "will be presenting", "won't be presenting", "presents"],
        correctIndex: 1,
        explanation: "Future Continuous: 'will be presenting' — action in progress at a specific future time.",
      },
      {
        id: "4-3",
        prompt: "Don't worry — I ___ late. I know how important it is. (negative promise)",
        options: ["will be", "won't be", "will", "am going to be"],
        correctIndex: 1,
        explanation: "Future Continuous negative: 'won't be' + -ing (late) — a reassurance about an ongoing state.",
      },
      {
        id: "4-4",
        prompt: "They ___ arrive at 7 PM — their train is on schedule. (single event)",
        options: ["will be arriving", "won't arrive", "will arrive", "are arriving"],
        correctIndex: 2,
        explanation: "Future Simple: 'will arrive' for a single predicted event at a specific time.",
      },
      {
        id: "4-5",
        prompt: "This time next Monday, we ___ relaxing on the beach. (in progress)",
        options: ["will relax", "will be relaxing", "won't be relaxing", "are going to relax"],
        correctIndex: 1,
        explanation: "Future Continuous: 'will be relaxing' — action in progress at a specific future time.",
      },
      {
        id: "4-6",
        prompt: "___ you be needing the car tomorrow, or can I borrow it?",
        options: ["Are", "Do", "Will", "Have"],
        correctIndex: 2,
        explanation: "Future Continuous question: Will + subject + be + -ing? — polite enquiry about plans.",
      },
      {
        id: "4-7",
        prompt: "She ___ finish the report by noon if she starts now. (completion)",
        options: ["will be finishing", "will finish", "won't finish", "is finishing"],
        correctIndex: 1,
        explanation: "Future Simple: 'will finish' emphasises completing the task, not being in progress.",
      },
      {
        id: "4-8",
        prompt: "When you arrive, they ___ still rehearsing the play. (in progress)",
        options: ["will rehearse", "are rehearsing", "will be rehearsing", "won't be rehearsing"],
        correctIndex: 2,
        explanation: "Future Continuous: 'will be rehearsing' — action in progress when another occurs.",
      },
      {
        id: "4-9",
        prompt: "I ___ be needing any help, thanks — I can manage on my own.",
        options: ["will", "won't", "am going to", "will be"],
        correctIndex: 1,
        explanation: "Future Continuous negative: 'won't be needing' — politely declining help.",
      },
      {
        id: "4-10",
        prompt: "The store ___ open until 9 PM tomorrow night. (single fact)",
        options: ["will be opening", "will open", "won't open", "opens"],
        correctIndex: 1,
        explanation: "Future Simple: 'will open' for a planned/expected single event — store opening hours.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Mixed forms",
  2: "-ing spelling",
  3: "Questions",
  4: "FC vs Simple",
};

export default function WillBeIngClient() {
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
          <a className="hover:text-slate-900 transition" href="/tenses/future-continuous">Future Continuous</a><span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">will be + -ing</span>
        </div>
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Future Continuous <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">will be + -ing</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">B1</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">40 questions to master will be + -ing: form, use, and contrast with simple will.</p>
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
          <a href="/tenses/future-continuous" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Future Continuous exercises</a>
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
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "will be", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I will be working.  ·  She will be sleeping.  ·  They will be travelling." />
            <Ex en="Contractions: I'll be, you'll be, he'll be, she'll be, we'll be, they'll be" />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "won't be", color: "red" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I won't be working tomorrow.  ·  She won't be joining us." />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "be", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you be working tonight?  ·  Will she be coming?" />
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will be is the SAME for all subjects</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Affirmative</th>
                <th className="px-4 py-2.5 font-black text-red-700">Negative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I", "will be working", "won't be working"],
                ["You", "will be working", "won't be working"],
                ["He / She / It ★", "will be working", "won't be working"],
                ["We / They", "will be working", "won't be working"],
              ].map(([subj, aff, neg], i) => (
                <tr key={i} className={i === 2 ? "bg-amber-50 font-bold" : "bg-white"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm">{aff}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-sm">{neg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Key rule:</span> &quot;will be&quot; never changes — same for ALL subjects (no -s for he/she/it!)
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">Common mistakes to avoid</div>
        <div className="space-y-1.5 mt-2 text-xs text-amber-700">
          <div>✅ She will be <b>working</b> tomorrow. &nbsp;|&nbsp; ❌ She will <b>work</b> tomorrow. (that&apos;s Future Simple)</div>
          <div>✅ They will be <b>sleeping</b>. &nbsp;|&nbsp; ❌ They will be <b>sleep</b>. (base form after &apos;be&apos;)</div>
          <div>✅ Will you be <b>coming</b>? &nbsp;|&nbsp; ❌ Will you <b>coming</b>? (missing &apos;be&apos;)</div>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">-ing spelling rules</div>
        <div className="space-y-2">
          {[
            { rule: "Most verbs → add -ing", ex: "work → working · play → playing · read → reading" },
            { rule: "Ends in -e → drop the -e, add -ing", ex: "make → making · drive → driving · write → writing" },
            { rule: "Short verb (CVC) → double the final consonant", ex: "run → running · sit → sitting · swim → swimming" },
            { rule: "Ends in -ie → change to -y, add -ing", ex: "die → dying · lie → lying · tie → tying" },
          ].map(({ rule, ex }) => (
            <div key={rule} className="rounded-xl bg-white border border-black/10 px-4 py-3">
              <div className="text-sm font-black text-slate-800">{rule}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-mono">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">FC vs Future Simple — at a glance</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Future Continuous</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Future Simple</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Action in progress at a future time", "Single action / decision / promise"],
                ["At 9 PM I'll be watching TV.", "I'll call you at 9 PM."],
                ["This time tomorrow, she'll be flying.", "She'll land at noon."],
              ].map((row, i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs">{row[0]}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-xs">{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions for Future Continuous</div>
        <div className="flex flex-wrap gap-2">
          {["at this time tomorrow", "this time next week", "at 8 PM tomorrow", "when you arrive", "when you call", "all day tomorrow", "by midnight", "this time next year"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
