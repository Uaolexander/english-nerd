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
    title: "Exercise 1 — Opinion markers with will",
    instructions:
      "Choose the correct option to complete each prediction. Opinion markers like 'I think', 'I believe', 'I doubt' are followed by will or won't. Correct answers are mixed across the set.",
    questions: [
      { id: "1-1", prompt: "I think ___ rain tomorrow — the sky is getting dark.", options: ["it will", "it is going to", "it won't", "it rains"], correctIndex: 0, explanation: "'I think' + will expresses a personal prediction/opinion." },
      { id: "1-2", prompt: "I doubt she ___ pass the exam — she hasn't studied at all.", options: ["will", "is going to", "passes", "won't"], correctIndex: 3, explanation: "'I doubt' is followed by won't (= I doubt she will pass = she probably won't pass)." },
      { id: "1-3", prompt: "I believe the new policy ___ help reduce costs.", options: ["won't", "is going to", "will", "helps"], correctIndex: 2, explanation: "'I believe' + will for an opinion-based prediction." },
      { id: "1-4", prompt: "I don't think he ___ accept the offer.", options: ["will", "won't", "is going to", "accepts"], correctIndex: 0, explanation: "'I don't think he will' — the negative is placed with 'think', not with 'will'." },
      { id: "1-5", prompt: "I'm sure they ___ love the surprise.", options: ["will", "won't", "are going to", "love"], correctIndex: 0, explanation: "'I'm sure' + will for a confident positive prediction." },
      { id: "1-6", prompt: "I doubt the weather ___ improve before the weekend.", options: ["will", "won't", "is going to", "improves"], correctIndex: 1, explanation: "'I doubt' expresses a negative prediction — won't is appropriate here." },
      { id: "1-7", prompt: "I think the team ___ win tonight — they've been training hard.", options: ["won't", "is going to", "will", "wins"], correctIndex: 2, explanation: "Opinion-based affirmative prediction with 'I think + will'." },
      { id: "1-8", prompt: "I'm not sure it ___ be ready in time.", options: ["will", "won't", "is going to", "is"], correctIndex: 0, explanation: "'I'm not sure it will' — the negative is placed on 'sure', not on 'will'." },
      { id: "1-9", prompt: "I doubt she ___ be at the office — she usually works from home.", options: ["will", "is going to", "is", "won't"], correctIndex: 3, explanation: "'I doubt she will be' = she probably won't be = won't." },
      { id: "1-10", prompt: "I believe the new restaurant ___ become very popular.", options: ["won't", "will", "is going to", "becomes"], correctIndex: 1, explanation: "'I believe + will' for a positive opinion-based prediction." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Probability adverbs: probably, definitely, maybe",
    instructions:
      "Choose the correct probability adverb or the correct will/won't form. Remember: 'probably/definitely' come after 'will' but before 'won't'.",
    questions: [
      { id: "2-1", prompt: "She'll ___ be late — traffic is always bad on Mondays.", options: ["probably", "definitely", "maybe", "likely"], correctIndex: 0, explanation: "probably = fairly likely. It goes after will: She'll probably be late." },
      { id: "2-2", prompt: "It ___ rain tomorrow — the forecast says 95% chance.", options: ["will probably", "will maybe", "will definitely", "won't probably"], correctIndex: 2, explanation: "'Definitely' expresses near-certainty (95%). will definitely rain." },
      { id: "2-3", prompt: "I'm not sure — I ___ come to the party, I haven't decided.", options: ["will definitely", "might", "will probably", "won't definitely"], correctIndex: 1, explanation: "'might' expresses real uncertainty (about 50%). Different from 'probably'." },
      { id: "2-4", prompt: "They ___ finish on time — they're already two days behind.", options: ["will definitely", "will probably", "probably won't", "definitely won't"], correctIndex: 3, explanation: "'Definitely won't' — adverb goes before won't: They definitely won't finish on time." },
      { id: "2-5", prompt: "She'll ___ get the job — she has the best qualifications.", options: ["probably", "maybe", "likely", "definitely"], correctIndex: 3, explanation: "'Definitely' after will for very high confidence: She'll definitely get the job." },
      { id: "2-6", prompt: "He ___ be at the meeting — he mentioned it briefly.", options: ["will probably", "probably won't", "will definitely", "might not"], correctIndex: 0, explanation: "Moderate positive prediction: He will probably be at the meeting." },
      { id: "2-7", prompt: "I ___ know the answer — I haven't studied this topic.", options: ["will definitely", "will probably", "probably won't", "definitely won't"], correctIndex: 2, explanation: "Negative prediction with 'probably': I probably won't know the answer." },
      { id: "2-8", prompt: "The film ___ be great — everyone is raving about it.", options: ["will definitely", "probably won't", "will maybe", "won't probably"], correctIndex: 0, explanation: "'will definitely' for strong positive prediction: The film will definitely be great." },
      { id: "2-9", prompt: "___, they'll find a solution — they always do.", options: ["Definitely", "Likely", "Probably", "Maybe"], correctIndex: 3, explanation: "'Maybe' at the start of a sentence expresses some uncertainty about the prediction." },
      { id: "2-10", prompt: "He ___ come — he said he was too tired.", options: ["will probably", "will definitely", "probably won't", "definitely won't"], correctIndex: 3, explanation: "'definitely won't' for a strong negative prediction: He definitely won't come." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Predict from context",
    instructions:
      "Read the situation and choose the best future prediction. Some sentences need 'will', some 'won't', and some need 'is going to' (evidence-based). Read carefully!",
    questions: [
      { id: "3-1", prompt: "\"I think the economy ___ improve next year,\" said the expert.", options: ["will", "is going to", "won't", "improves"], correctIndex: 0, explanation: "Opinion-based prediction (I think): will improve." },
      { id: "3-2", prompt: "Look at those storm clouds! It ___ pour down any minute.", options: ["will", "won't", "is going to", "pours"], correctIndex: 2, explanation: "Visible evidence (storm clouds): is going to (evidence-based prediction)." },
      { id: "3-3", prompt: "She's been studying for months — I'm sure she ___ pass.", options: ["won't", "will", "is going to", "passes"], correctIndex: 1, explanation: "Opinion-based positive prediction: I'm sure she will pass." },
      { id: "3-4", prompt: "He hasn't eaten all day. He ___ faint if he doesn't eat soon.", options: ["will", "won't", "faints", "is going to"], correctIndex: 3, explanation: "Evidence-based prediction (physical state): He's going to faint." },
      { id: "3-5", prompt: "\"I don't think he ___ be promoted — he's been underperforming.\"", options: ["will", "won't", "is going to", "is"], correctIndex: 0, explanation: "'I don't think he will be' — the negative goes with 'think', not 'will'." },
      { id: "3-6", prompt: "I believe technology ___ solve many of today's problems.", options: ["won't", "will", "is going to", "solves"], correctIndex: 1, explanation: "Opinion-based positive prediction with 'I believe': will solve." },
      { id: "3-7", prompt: "She's heading straight for the glass door — she ___ walk into it!", options: ["will", "won't", "is going to", "walks"], correctIndex: 2, explanation: "Visible evidence (heading towards door): She's going to walk into it." },
      { id: "3-8", prompt: "I doubt the match ___ start on time — the pitch is flooded.", options: ["will", "won't", "is going to", "starts"], correctIndex: 1, explanation: "'I doubt + won't' is redundant — 'I doubt it will start' means won't start." },
      { id: "3-9", prompt: "\"___ AI change the way we work?\" \"I think it will, yes.\"", options: ["Is", "Won't", "Does", "Will"], correctIndex: 3, explanation: "Future Simple question about prediction: Will AI change...?" },
      { id: "3-10", prompt: "I'm confident the project ___ succeed with this team.", options: ["won't", "is going to", "will", "succeeds"], correctIndex: 2, explanation: "Confident positive opinion-based prediction: will succeed." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed predictions: will / won't + adverbs",
    instructions:
      "Complete the sentences with the best prediction form. Mix of will/won't, probability adverbs, and opinion markers. Answers vary throughout the set.",
    questions: [
      { id: "4-1", prompt: "I think it ___ be a beautiful day tomorrow.", options: ["won't", "probably won't", "will", "is going to"], correctIndex: 2, explanation: "Positive opinion-based prediction: I think it will be a beautiful day." },
      { id: "4-2", prompt: "She'll ___ be disappointed — she was really hoping for that role.", options: ["definitely", "probably", "maybe", "not"], correctIndex: 0, explanation: "'Definitely' for strong certainty: She'll definitely be disappointed." },
      { id: "4-3", prompt: "I doubt they ___ arrive before midnight.", options: ["won't", "will", "are going to", "arrive"], correctIndex: 1, explanation: "'I doubt they will arrive' = they probably won't arrive. 'Will' after 'doubt'." },
      { id: "4-4", prompt: "He ___ probably change his mind — he's very stubborn.", options: ["will", "won't", "is going to", "does"], correctIndex: 1, explanation: "Negative prediction with 'probably' before won't: won't probably → He probably won't change his mind. Here 'won't' is the correct option." },
      { id: "4-5", prompt: "I'm certain the results ___ surprise everyone.", options: ["won't", "are going to", "will", "surprise"], correctIndex: 2, explanation: "Strong positive prediction: I'm certain they will surprise everyone." },
      { id: "4-6", prompt: "___, I'll check the forecast and tell you if the picnic is still on.", options: ["Definitely", "Probably", "Maybe", "Likely"], correctIndex: 2, explanation: "'Maybe' at the start of the sentence expresses uncertainty about whether it is on." },
      { id: "4-7", prompt: "They probably ___ finish the renovation before summer.", options: ["will", "won't", "are going to", "finish"], correctIndex: 1, explanation: "Negative prediction: They probably won't finish in time." },
      { id: "4-8", prompt: "I believe she ___ make an excellent leader.", options: ["won't", "probably won't", "will", "is going to"], correctIndex: 2, explanation: "Opinion-based positive prediction: I believe she will make a good leader." },
      { id: "4-9", prompt: "He ___ definitely be surprised — nobody has told him yet.", options: ["won't", "will", "is going to", "is"], correctIndex: 1, explanation: "Strong positive prediction: He will definitely be surprised." },
      { id: "4-10", prompt: "I don't think it ___ take long — it's a small job.", options: ["will", "won't", "is going to", "takes"], correctIndex: 0, explanation: "'I don't think it will take long' — negative with 'think', not with 'will'." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Opinion markers",
  2: "Adverbs",
  3: "From context",
  4: "Mixed",
};

export default function PredictionsClient() {
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
          <a className="hover:text-slate-900 transition" href="/tenses/future-simple">Future Simple</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Predictions &amp; Opinions</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Predictions &amp; Opinions</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2–B1</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions to practise <b>will</b> for predictions and opinions — opinion markers (I think, I believe), probability adverbs (definitely, probably, maybe), and choosing the right prediction form.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
            </div>
          </aside>

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
                          <div>
                            <div className={`text-3xl font-black ${score.percent >= 80 ? "text-emerald-700" : score.percent >= 50 ? "text-amber-700" : "text-red-700"}`}>{score.percent}%</div>
                            <div className="mt-0.5 text-sm text-slate-600">{score.correct} out of {score.total} correct</div>
                          </div>
                          <div className="text-3xl">{score.percent >= 80 ? "🎉" : score.percent >= 50 ? "💪" : "📖"}</div>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                          <div className={`h-2 rounded-full transition-all duration-500 ${score.percent >= 80 ? "bg-emerald-500" : score.percent >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${score.percent}%` }} />
                        </div>
                        <div className="mt-2 text-xs text-slate-500">{score.percent >= 80 ? "Excellent! Move on to the next exercise." : score.percent >= 50 ? "Good effort! Review the wrong answers and try once more." : "Keep practising — check the Explanation tab and try again."}</div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Explanation />
              )}
            </div>
          </section>

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
            </div>
          </aside>
        </div>

        <div className="mt-8 lg:hidden rounded-2xl border border-black/10 bg-white/60 p-4">
          <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
          <div className="mt-3 h-[90px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">320 × 90</div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/future-simple" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Future Simple exercises</a>
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
      {/* 3 gradient formula cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">Positive prediction</span>
          <Formula parts={[
            { text: "I think / I believe / I'm sure", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "will", color: "yellow" },
            { text: "verb", color: "green" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I think it will rain tomorrow." />
            <Ex en="I believe she will win the competition." />
            <Ex en="I'm sure they will love the gift." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">Negative prediction</span>
          <Formula parts={[
            { text: "I don't think", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "will", color: "yellow" },
            { text: "verb", color: "green" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I don't think it will rain. (NOT: I think it won't rain)" />
            <Ex en="I doubt he will be there. (doubt already = negative)" />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">With probability adverbs</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "will", color: "yellow" },
            { text: "definitely / probably", color: "orange" },
            { text: "verb", color: "green" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="She'll definitely pass. (very certain)" />
            <Ex en="He'll probably be late. (fairly certain)" />
            <Ex en="She probably won't come. (probably before won't)" />
          </div>
        </div>
      </div>

      {/* Opinion markers table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Opinion markers</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Marker</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Meaning</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I think", "personal opinion, moderate confidence", "I think he'll pass."],
                ["I believe", "stronger personal opinion", "I believe it will work."],
                ["I'm sure", "high confidence", "I'm sure she'll be fine."],
                ["I doubt", "negative opinion (use 'will' after!)", "I doubt he will come."],
                ["I don't think", "negative opinion (better than 'I think ... won't')", "I don't think it will rain."],
              ].map(([m, def, ex], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2.5 font-semibold text-violet-700 font-mono text-sm">{m}</td>
                  <td className="px-4 py-2.5 text-slate-600 text-xs">{def}</td>
                  <td className="px-4 py-2.5 text-slate-700 font-mono text-sm italic">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Probability adverbs */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Probability adverbs — order matters!</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Adverb</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Probability</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">After will (+)</th>
                <th className="px-4 py-2.5 font-black text-red-700">Before won't (−)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["definitely", "~95%", "will definitely come", "definitely won't come"],
                ["certainly", "~90%", "will certainly pass", "certainly won't pass"],
                ["probably", "~70%", "will probably rain", "probably won't rain"],
                ["perhaps / maybe", "~50%", "will perhaps try", "perhaps won't try"],
              ].map(([adv, prob, pos, neg], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2.5 font-semibold text-orange-700 font-mono text-sm">{adv}</td>
                  <td className="px-4 py-2.5 text-slate-500 text-xs">{prob}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-xs">{pos}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-xs">{neg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">Key rule:</span> &apos;probably&apos; and &apos;definitely&apos; come <b>after</b> will but <b>before</b> won&apos;t.<br />
          <span className="text-xs">She&apos;ll <b>probably</b> come ✅ &nbsp;|&nbsp; She <b>probably</b> won&apos;t come ✅ &nbsp;|&nbsp; She won&apos;t probably come ❌</span>
        </div>
      </div>

      {/* will vs going to for predictions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will vs be going to for predictions</div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-gradient-to-b from-yellow-50 to-white border border-yellow-200 p-4 space-y-2">
            <div className="text-sm font-black text-yellow-800">will — opinion / guess</div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>• No visible evidence right now</div>
              <div>• Based on knowledge or feeling</div>
              <div>• After I think / I believe / I'm sure</div>
            </div>
            <Ex en="I think it will rain tomorrow." />
            <Ex en="I believe prices will rise." />
          </div>
          <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-200 p-4 space-y-2">
            <div className="text-sm font-black text-sky-800">be going to — visible evidence</div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>• You can see/feel it happening now</div>
              <div>• Physical or observable signs</div>
              <div>• After Look! / Watch out! / He&apos;s about to…</div>
            </div>
            <Ex en="Look at those clouds — it's going to rain!" />
            <Ex en="He looks pale. He's going to faint." />
          </div>
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Time expressions for predictions</div>
        <div className="flex flex-wrap gap-2">
          {["tomorrow", "next year", "in the future", "one day", "soon", "by 2030", "eventually", "in my lifetime", "in the next decade"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
