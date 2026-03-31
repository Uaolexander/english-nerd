"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";

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
    title: "Exercise 1 — Single event vs ongoing action",
    instructions:
      "Choose 'will + base verb' for a single future action/decision/promise, or 'will be + -ing' for an action in progress at a future moment. Mix of both — read the context carefully.",
    questions: [
      {
        id: "1-1",
        prompt: "I ___ call you as soon as I land. (single action, promise)",
        options: ["will be calling", "will call", "am calling", "call"],
        correctIndex: 1,
        explanation: "'will call' — Future Simple for a single future action/promise.",
      },
      {
        id: "1-2",
        prompt: "At 10 PM tonight, she ___ still working on her essay. (in progress at that time)",
        options: ["will work", "works", "will be working", "worked"],
        correctIndex: 2,
        explanation: "'will be working' — Future Continuous for an ongoing action at a specific future moment.",
      },
      {
        id: "1-3",
        prompt: "Don't worry — I ___ the door when you arrive. (single action)",
        options: ["will be opening", "will open", "am opening", "open"],
        correctIndex: 1,
        explanation: "'will open' — Future Simple for a single action (opening the door once).",
      },
      {
        id: "1-4",
        prompt: "This time next week, we ___ surfing on the coast. (in progress)",
        options: ["will surf", "will be surfing", "surf", "surfed"],
        correctIndex: 1,
        explanation: "'will be surfing' — Future Continuous for an action in progress at a future point in time.",
      },
      {
        id: "1-5",
        prompt: "I think she ___ the competition — she's really talented. (prediction, single outcome)",
        options: ["will be winning", "is winning", "will win", "wins"],
        correctIndex: 2,
        explanation: "'will win' — Future Simple for a predicted single outcome.",
      },
      {
        id: "1-6",
        prompt: "When you get home, the dog ___ waiting at the door as always. (in progress)",
        options: ["will wait", "will be waiting", "waits", "waited"],
        correctIndex: 1,
        explanation: "'will be waiting' — Future Continuous for an action in progress when another occurs.",
      },
      {
        id: "1-7",
        prompt: "He ___ finish the report by 5 PM if he focuses. (completion)",
        options: ["will be finishing", "will finish", "is finishing", "finishes"],
        correctIndex: 1,
        explanation: "'will finish' — Future Simple for completing a task at/by a time.",
      },
      {
        id: "1-8",
        prompt: "I ___ probably cooking dinner when you ring. (in progress at that moment)",
        options: ["will cook", "will be cooking", "cook", "am going to cook"],
        correctIndex: 1,
        explanation: "'will be cooking' — Future Continuous for an action in progress at the time of the call.",
      },
      {
        id: "1-9",
        prompt: "They ___ meet us at the station at 6. (single arranged event)",
        options: ["will be meeting", "are meeting", "will meet", "meet"],
        correctIndex: 2,
        explanation: "'will meet' — Future Simple for a single arranged event.",
      },
      {
        id: "1-10",
        prompt: "At midnight on New Year's Eve, millions of people ___ celebrating worldwide. (in progress)",
        options: ["will celebrate", "celebrate", "will be celebrating", "celebrated"],
        correctIndex: 2,
        explanation: "'will be celebrating' — Future Continuous for an ongoing action at a specific future moment.",
      },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Result vs in-progress at a moment",
    instructions:
      "Choose 'will finish / will complete / will arrive' (result at a future point) vs 'will be working / will be travelling' (in progress at that moment). Pay attention to whether the emphasis is on completion or ongoing action.",
    questions: [
      {
        id: "2-1",
        prompt: "By 5 PM she ___ the whole presentation — she started early. (result/completion)",
        options: ["will be finishing", "will finish", "finishes", "finished"],
        correctIndex: 1,
        explanation: "'will finish' — Future Simple for reaching a completion point.",
      },
      {
        id: "2-2",
        prompt: "At 5 PM, she ___ the final slide — she's always working late. (in progress at 5 PM)",
        options: ["will finish", "finishes", "will be finishing", "has finished"],
        correctIndex: 2,
        explanation: "'will be finishing' — Future Continuous: she'll still be in the process of finishing at 5 PM.",
      },
      {
        id: "2-3",
        prompt: "The train ___ at platform 3 in ten minutes. (single event, arrival)",
        options: ["will be arriving", "will arrive", "arrives", "arrived"],
        correctIndex: 1,
        explanation: "'will arrive' — Future Simple for a single scheduled event.",
      },
      {
        id: "2-4",
        prompt: "At this time tomorrow, we ___ somewhere over the Atlantic. (in progress)",
        options: ["will fly", "flew", "fly", "will be flying"],
        correctIndex: 3,
        explanation: "'will be flying' — Future Continuous for an action in progress at a future moment.",
      },
      {
        id: "2-5",
        prompt: "I promise I ___ my side of the deal. (commitment to complete)",
        options: ["will be keeping", "will keep", "keep", "am keeping"],
        correctIndex: 1,
        explanation: "'will keep' — Future Simple for a promise/commitment.",
      },
      {
        id: "2-6",
        prompt: "Don't call at 8 — I ___ my gym session then. (in progress at 8)",
        options: ["will complete", "completed", "complete", "will be completing"],
        correctIndex: 3,
        explanation: "'will be completing' — Future Continuous for an action in progress at 8 PM.",
      },
      {
        id: "2-7",
        prompt: "He ___ the project on time — he always does. (single prediction)",
        options: ["will be delivering", "delivers", "will deliver", "delivered"],
        correctIndex: 2,
        explanation: "'will deliver' — Future Simple for a single predicted future event.",
      },
      {
        id: "2-8",
        prompt: "At midnight, the team ___ still debugging the software. (in progress at midnight)",
        options: ["will debug", "debugs", "will be debugging", "debugged"],
        correctIndex: 2,
        explanation: "'will be debugging' — Future Continuous for an ongoing action at midnight.",
      },
      {
        id: "2-9",
        prompt: "She ___ the race in under two hours — she's in great form. (single completion)",
        options: ["will be finishing", "will finish", "finishes", "is finishing"],
        correctIndex: 1,
        explanation: "'will finish' — Future Simple for a single predicted completion.",
      },
      {
        id: "2-10",
        prompt: "When you pop by at 3, I ___ my afternoon run. (in progress at 3 PM)",
        options: ["will do", "do", "will be doing", "did"],
        correctIndex: 2,
        explanation: "'will be doing' — Future Continuous: the run will be in progress when you visit.",
      },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Most natural form in context",
    instructions:
      "Choose the most natural form: 'will + base' or 'will be + -ing'. Both may be grammatically possible, but one is more natural given the context clue.",
    questions: [
      {
        id: "3-1",
        prompt: "\"The phone is ringing!\" — \"Don't worry, I ___ it.\" (spontaneous decision)",
        options: ["will be getting", "will get", "am getting", "get"],
        correctIndex: 1,
        explanation: "'will get' — spontaneous decision/offer uses Future Simple.",
      },
      {
        id: "3-2",
        prompt: "I can't meet at 2 — I ___ in an interview then. (in progress at 2)",
        options: ["will sit", "sat", "will be sitting", "sit"],
        correctIndex: 2,
        explanation: "'will be sitting' — the interview will be in progress at 2 PM.",
      },
      {
        id: "3-3",
        prompt: "I've made up my mind — I ___ that job offer. (decision just made)",
        options: ["will be taking", "will take", "am taking", "take"],
        correctIndex: 1,
        explanation: "'will take' — Future Simple for a decision just made in the moment.",
      },
      {
        id: "3-4",
        prompt: "This time next Saturday, she ___ her driving test. (in progress at that time)",
        options: ["will take", "will be taking", "takes", "took"],
        correctIndex: 1,
        explanation: "'will be taking' — Future Continuous for an action in progress at a specific future moment.",
      },
      {
        id: "3-5",
        prompt: "He ___ be late — he always is. (prediction about habitual behaviour)",
        options: ["will be being", "will", "is going to", "will be"],
        correctIndex: 1,
        explanation: "'will' — Future Simple for a prediction based on known habits. ('He will be late' = simple prediction.)",
      },
      {
        id: "3-6",
        prompt: "At 3 AM, the baby ___ crying again — she always wakes up then. (in progress)",
        options: ["will cry", "cries", "will be crying", "cried"],
        correctIndex: 2,
        explanation: "'will be crying' — Future Continuous for an expected ongoing action at 3 AM.",
      },
      {
        id: "3-7",
        prompt: "I ___ help you carry those bags. (spontaneous offer)",
        options: ["will be helping", "will help", "help", "am helping"],
        correctIndex: 1,
        explanation: "'will help' — spontaneous offer/decision uses Future Simple.",
      },
      {
        id: "3-8",
        prompt: "By the time you read this, I ___ probably on the plane. (in progress)",
        options: ["will sit", "will be sitting", "sit", "sat"],
        correctIndex: 1,
        explanation: "'will be sitting' — Future Continuous for an action in progress at a future point.",
      },
      {
        id: "3-9",
        prompt: "I expect it ___ a lot tomorrow — look at those clouds. (prediction based on evidence)",
        options: ["will be raining", "will rain", "rains", "rained"],
        correctIndex: 1,
        explanation: "'will rain' is most natural for a simple prediction; both 'will rain' and 'will be raining' work, but 'will rain' is more standard here.",
      },
      {
        id: "3-10",
        prompt: "Don't disturb her at 4 — she ___ her piano practice then. (in progress at 4 PM)",
        options: ["will do", "does", "will be doing", "did"],
        correctIndex: 2,
        explanation: "'will be doing' — Future Continuous: piano practice will be in progress at 4 PM.",
      },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Meaning difference: both possible but different meanings",
    instructions:
      "Each pair of sentences uses 'will' and 'will be + -ing'. Choose the sentence that matches the meaning given in brackets.",
    questions: [
      {
        id: "4-1",
        prompt: "Which expresses an action in progress at a future time? (not a single event)",
        options: [
          "I will write the email tonight.",
          "I will be writing emails all evening.",
          "I am writing the email now.",
          "I wrote the email last night.",
        ],
        correctIndex: 1,
        explanation: "'will be writing emails all evening' — Future Continuous stresses an ongoing action during a future period.",
      },
      {
        id: "4-2",
        prompt: "Which expresses a spontaneous decision in response to a request?",
        options: [
          "I will be making coffee in a moment.",
          "I'll make you a coffee.",
          "I am making coffee.",
          "I have made coffee.",
        ],
        correctIndex: 1,
        explanation: "'I'll make you a coffee.' — Future Simple for a spontaneous decision/offer.",
      },
      {
        id: "4-3",
        prompt: "Which sentence implies the meeting will still be happening at 3 PM (not over)?",
        options: [
          "The meeting will start at 3.",
          "The meeting will finish at 3.",
          "The meeting will be running at 3.",
          "The meeting ended at 3.",
        ],
        correctIndex: 2,
        explanation: "'The meeting will be running at 3.' — Future Continuous implies it's in progress at 3 PM.",
      },
      {
        id: "4-4",
        prompt: "Which expresses a firm promise to do something (single action)?",
        options: [
          "I will be returning your call this evening.",
          "I will return your call this evening.",
          "I am returning your call now.",
          "I return your call.",
        ],
        correctIndex: 1,
        explanation: "'I will return your call.' — Future Simple is the most direct promise.",
      },
      {
        id: "4-5",
        prompt: "Which implies polite enquiry about someone's plans (not a direct request)?",
        options: [
          "Will you come to the wedding?",
          "Are you going to the wedding?",
          "Will you be coming to the wedding?",
          "Do you come to the wedding?",
        ],
        correctIndex: 2,
        explanation: "'Will you be coming?' — Future Continuous polite question enquires about plans without putting pressure.",
      },
      {
        id: "4-6",
        prompt: "Which emphasises she will be in the middle of cooking at 7 PM?",
        options: [
          "She will cook dinner at 7.",
          "She will be cooking dinner at 7.",
          "She cooked dinner at 7.",
          "She cooks dinner at 7.",
        ],
        correctIndex: 1,
        explanation: "'She will be cooking dinner at 7.' — Future Continuous: the cooking will be in progress at 7 PM.",
      },
      {
        id: "4-7",
        prompt: "Which sentence is a prediction about a single outcome (not an ongoing state)?",
        options: [
          "She will be becoming the manager.",
          "She will become the manager.",
          "She is becoming the manager.",
          "She is going to be becoming the manager.",
        ],
        correctIndex: 1,
        explanation: "'She will become the manager.' — Future Simple for a single future outcome/prediction.",
      },
      {
        id: "4-8",
        prompt: "Which sentence suggests the action (revising) will still be going on at midnight?",
        options: [
          "He will revise at midnight.",
          "He revised at midnight.",
          "He will be revising at midnight.",
          "He revises at midnight.",
        ],
        correctIndex: 2,
        explanation: "'He will be revising at midnight.' — Future Continuous stresses the action is in progress at midnight.",
      },
      {
        id: "4-9",
        prompt: "Which expresses a decision made right now (not a plan already in place)?",
        options: [
          "I'll be having the salad.",
          "I'll have the salad.",
          "I have the salad.",
          "I am having the salad.",
        ],
        correctIndex: 1,
        explanation: "'I'll have the salad.' — Future Simple for a spontaneous decision (e.g., ordering food).",
      },
      {
        id: "4-10",
        prompt: "Which sentence is more natural when describing what you'll be doing when the guests arrive?",
        options: [
          "I will cook when the guests arrive.",
          "I will be cooking when the guests arrive.",
          "I cook when the guests arrive.",
          "I cooked when the guests arrived.",
        ],
        correctIndex: 1,
        explanation: "'I will be cooking when the guests arrive.' — Future Continuous for an action in progress when another happens.",
      },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Single vs ongoing",
  2: "Result vs in progress",
  3: "Most natural",
  4: "Meaning difference",
};

export default function WillVsWillBeIngClient() {
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
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a><span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a><span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/future-continuous">Future Continuous</a><span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">will vs will be doing</span>
        </div>
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Future Continuous <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">will vs will be doing</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">B1</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">40 questions contrasting will + base verb (single actions) with will be + -ing (ongoing at a future moment). Mixed answers throughout.</p>
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
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">will + base verb (Future Simple)</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "will", color: "yellow" },
            { text: "base verb", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I'll call you tonight. (promise / single action)" />
            <Ex en="She'll win the race. (prediction about a result)" />
            <Ex en="I'll get the door! (spontaneous decision)" />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">will be + -ing (Future Continuous)</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "will be", color: "yellow" },
            { text: "verb-ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="At 9 PM, I'll be watching TV. (ongoing at a future moment)" />
            <Ex en="This time next week, she'll be surfing. (in progress at a future time)" />
            <Ex en="When you call, I'll be cooking. (in progress when another event occurs)" />
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Comparison table</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Use</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">will + base</th>
                <th className="px-4 py-2.5 font-black text-sky-700">will be + -ing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Future event/promise", "I'll call you.", "—"],
                ["Spontaneous decision", "I'll get the door.", "—"],
                ["Prediction (single outcome)", "She'll win.", "—"],
                ["In progress at a future moment", "—", "At 9 PM I'll be watching TV."],
                ["In progress when another event occurs", "—", "When you arrive, I'll be cooking."],
                ["Polite enquiry about plans", "—", "Will you be using the car?"],
              ].map(([use, simple, cont], i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2.5 font-semibold text-slate-700 text-xs">{use}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs">{simple}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-xs">{cont}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">Common trap: both can sound similar but mean different things</div>
        <div className="space-y-2 mt-2 text-xs text-amber-700">
          <div>✅ &quot;I&apos;ll ring you at 8.&quot; — single call at 8</div>
          <div>✅ &quot;I&apos;ll be ringing you all evening.&quot; — calling repeatedly/continuously during the evening</div>
          <div className="mt-2">✅ &quot;She will finish the work.&quot; — she will complete it</div>
          <div>✅ &quot;She will be finishing the work at 6.&quot; — she&apos;ll still be in the process of finishing at 6</div>
        </div>
      </div>

      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Trigger words</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-emerald-700">Future Simple triggers</th>
                <th className="px-4 py-2.5 font-black text-sky-700">Future Continuous triggers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["promise / offer / prediction", "at this time tomorrow"],
                ["I think… / I expect… / probably", "when you arrive / call / get home"],
                ["soon / tomorrow / next week (single event)", "this time next week / month / year"],
                ["by [time] (completion)", "at [specific time] (in progress)"],
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
    </div>
  );
}
