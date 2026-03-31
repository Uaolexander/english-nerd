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
    title: "Exercise 1 — Mixed will / won't / Will",
    instructions:
      "Choose the correct Future Simple form to complete each sentence. The options include will (affirmative), won't (negative), Will (question start), and distractors. Correct answers are deliberately mixed.",
    questions: [
      { id: "1-1", prompt: "I ___ call you as soon as I land.", options: ["will", "won't", "Will I?", "am going to"], correctIndex: 0, explanation: "Affirmative promise: I will call you." },
      { id: "1-2", prompt: "She ___ be at the party — she has a prior commitment.", options: ["will", "won't", "Will she?", "is going to"], correctIndex: 1, explanation: "Negative prediction: She won't be at the party." },
      { id: "1-3", prompt: "___ you help me carry these boxes?", options: ["Do", "Won't", "Will", "Are"], correctIndex: 2, explanation: "Question form: Will you help me?" },
      { id: "1-4", prompt: "They ___ finish the report by Friday, I'm sure.", options: ["won't", "Will they?", "going to", "will"], correctIndex: 3, explanation: "Affirmative prediction: They will finish the report." },
      { id: "1-5", prompt: "It ___ snow in the desert — it never does.", options: ["won't", "Will it?", "will", "is going to"], correctIndex: 0, explanation: "Negative prediction: It won't snow in the desert." },
      { id: "1-6", prompt: "___ he remember to bring the keys?", options: ["Does", "Will", "Won't", "Is"], correctIndex: 1, explanation: "Question form: Will he remember?" },
      { id: "1-7", prompt: "We ___ leave without you — don't worry.", options: ["will", "going to", "Will we?", "won't"], correctIndex: 3, explanation: "Negative promise: We won't leave without you." },
      { id: "1-8", prompt: "The concert ___ start at 8 PM sharp.", options: ["won't", "Will it?", "will", "is"], correctIndex: 2, explanation: "Affirmative fact about the future: The concert will start at 8 PM." },
      { id: "1-9", prompt: "___ they accept our offer, do you think?", options: ["Will", "Won't", "Do", "Are"], correctIndex: 0, explanation: "Question form: Will they accept our offer?" },
      { id: "1-10", prompt: "I ___ let you down — I give you my word.", options: ["will", "won't", "Will I?", "am not going to"], correctIndex: 1, explanation: "Negative promise: I won't let you down." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Contractions & short answers",
    instructions:
      "Choose the correct contracted form or short answer. Options include I'll, He won't, Will she?, Yes/No short answers, and common mistakes. Answers are mixed across the set.",
    questions: [
      { id: "2-1", prompt: "\"___ open the window for you.\" (spontaneous offer)", options: ["I'm going to", "I'll", "I will be", "Shall I"], correctIndex: 1, explanation: "Spontaneous offer: I'll (= I will) open the window." },
      { id: "2-2", prompt: "\"Will she join us for dinner?\" — \"No, ___.\"", options: ["she doesn't", "she isn't", "she won't", "she can't"], correctIndex: 2, explanation: "Short negative answer with won't: No, she won't." },
      { id: "2-3", prompt: "___ be late — traffic is terrible right now.", options: ["They'll", "They're going to", "They will be", "They won't"], correctIndex: 0, explanation: "Contracted affirmative: They'll (= They will) be late." },
      { id: "2-4", prompt: "\"Will you be home tonight?\" — \"Yes, ___.\"", options: ["I do", "I am", "I will", "I can"], correctIndex: 2, explanation: "Short affirmative answer: Yes, I will." },
      { id: "2-5", prompt: "___ forget to call her — he promised.", options: ["He'll", "He won't", "He's going to", "He will be"], correctIndex: 1, explanation: "Negative contracted form: He won't forget." },
      { id: "2-6", prompt: "\"Will they win the match?\" — \"Yes, ___.\"", options: ["they do", "they are", "they will", "they can"], correctIndex: 2, explanation: "Short affirmative answer: Yes, they will." },
      { id: "2-7", prompt: "___ try our best — that's all we can do.", options: ["We won't", "We're going to", "We'll", "We will be"], correctIndex: 2, explanation: "Contracted affirmative: We'll (= We will) try our best." },
      { id: "2-8", prompt: "\"Will he pass the exam?\" — \"No, ___.\"", options: ["he doesn't", "he won't", "he isn't", "he can't"], correctIndex: 1, explanation: "Short negative answer: No, he won't." },
      { id: "2-9", prompt: "___ probably rain later — bring an umbrella.", options: ["It won't", "It'll", "It's going to", "It will be"], correctIndex: 1, explanation: "Contracted affirmative prediction: It'll probably rain." },
      { id: "2-10", prompt: "\"Will we need to pay in advance?\" — \"No, ___.\"", options: ["we don't", "we aren't", "we won't", "we can't"], correctIndex: 2, explanation: "Short negative answer: No, we won't." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Negative contexts with mixed answers",
    instructions:
      "Most of these sentences need 'won't', but some need 'will' or 'Will'. Read each context carefully and choose the correct form.",
    questions: [
      { id: "3-1", prompt: "I promise I ___ be late to the meeting.", options: ["won't", "will", "Will I?", "am going to"], correctIndex: 0, explanation: "Negative promise: I won't be late." },
      { id: "3-2", prompt: "I'm sure she ___ love the surprise gift.", options: ["won't", "will", "Will she?", "is going to"], correctIndex: 1, explanation: "Affirmative prediction: She will love the surprise." },
      { id: "3-3", prompt: "He ___ reveal the secret — you can trust him.", options: ["will", "isn't going to", "won't", "Will he?"], correctIndex: 2, explanation: "Negative promise: He won't reveal the secret." },
      { id: "3-4", prompt: "___ she forgive him after what happened?", options: ["Does", "Won't", "Is", "Will"], correctIndex: 3, explanation: "Question form: Will she forgive him?" },
      { id: "3-5", prompt: "The new policy ___ affect current employees.", options: ["won't", "is going to", "Will it?", "will"], correctIndex: 0, explanation: "Negative prediction: The policy won't affect current employees." },
      { id: "3-6", prompt: "I think they ___ accept the conditions — they look interested.", options: ["won't", "will", "Will they?", "are going to"], correctIndex: 1, explanation: "Affirmative prediction: They will accept the conditions." },
      { id: "3-7", prompt: "She ___ tell anyone about this — she keeps secrets.", options: ["will", "Will she?", "isn't", "won't"], correctIndex: 3, explanation: "Negative prediction: She won't tell anyone." },
      { id: "3-8", prompt: "___ the new manager make a difference?", options: ["Will", "Won't", "Does", "Is"], correctIndex: 0, explanation: "Question form: Will the new manager make a difference?" },
      { id: "3-9", prompt: "The kids ___ eat the vegetables — they hate them.", options: ["won't", "will", "Won't they?", "are going to"], correctIndex: 0, explanation: "Negative prediction: The kids won't eat the vegetables." },
      { id: "3-10", prompt: "I believe things ___ get better soon.", options: ["won't", "will", "Will they?", "are going to"], correctIndex: 1, explanation: "Affirmative prediction: Things will get better soon." },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — All forms mixed: dialogues & sentences",
    instructions:
      "Complete these dialogues and sentences using will, won't, or Will (question form). Correct answers are spread across all options — read context carefully.",
    questions: [
      { id: "4-1", prompt: "\"The doorbell just rang.\" \"Don't worry, I ___ get it.\"", options: ["will", "won't", "am going to", "Would I"], correctIndex: 0, explanation: "Spontaneous decision: I will (I'll) get it." },
      { id: "4-2", prompt: "___ you lend me your dictionary for the exam?", options: ["Do", "Will", "Won't", "Are"], correctIndex: 1, explanation: "Question form request: Will you lend me...?" },
      { id: "4-3", prompt: "\"I ___ do it — it's against my values.\"", options: ["will", "am going to", "Will I?", "won't"], correctIndex: 3, explanation: "Negative refusal: I won't do it." },
      { id: "4-4", prompt: "I think the new café ___ be really popular.", options: ["won't", "will", "Will it?", "is going to"], correctIndex: 1, explanation: "Affirmative opinion-based prediction: It will be popular." },
      { id: "4-5", prompt: "\"___ she mind if we leave early?\"", options: ["Will", "Does", "Won't", "Is"], correctIndex: 0, explanation: "Question form: Will she mind?" },
      { id: "4-6", prompt: "I promise the secret ___ go any further.", options: ["will", "won't", "Will it?", "isn't"], correctIndex: 1, explanation: "Negative promise: The secret won't go further." },
      { id: "4-7", prompt: "\"You look tired.\" \"Yes, I think I ___ go to bed early.\"", options: ["won't", "Will I?", "am going to", "will"], correctIndex: 3, explanation: "Spontaneous decision: I will go to bed early." },
      { id: "4-8", prompt: "They ___ be there — they've already said no.", options: ["will", "won't", "Won't they?", "are going to"], correctIndex: 1, explanation: "Negative prediction: They won't be there." },
      { id: "4-9", prompt: "___ it be warm enough to swim this weekend?", options: ["Does", "Won't", "Is", "Will"], correctIndex: 3, explanation: "Question form: Will it be warm enough?" },
      { id: "4-10", prompt: "She ___ regret this decision — mark my words.", options: ["won't", "Will she?", "will", "is going to"], correctIndex: 2, explanation: "Affirmative prediction: She will regret this." },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Mixed forms",
  2: "Contractions",
  3: "Negatives",
  4: "Dialogues",
};

export default function WillWontClient() {
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
          <span className="text-slate-700 font-medium">will / won&apos;t / Will I?</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Future Simple{" "}
            <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">will / won&apos;t / Will I?</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200">Easy</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">A2</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions to master <b>will</b>, <b>won&apos;t</b>, and <b>Will I?</b> across affirmative, negative, and question forms.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          {/* Left ad */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-4">
              <div className="text-xs font-semibold text-slate-500">ADVERTISEMENT</div>
              <div className="mt-3 h-[600px] rounded-xl border border-black/10 bg-white flex items-center justify-center text-slate-400 text-sm">300 × 600</div>
            </div>
          </aside>

          {/* Main */}
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
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "will", color: "yellow" },
            { text: "verb (base form)", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I will work.  ·  She will go.  ·  They will be ready." />
            <Ex en="Contracted: I'll work.  ·  She'll go.  ·  They'll be ready." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "won't", color: "red" },
            { text: "verb (base form)", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I won't come.  ·  He won't be there.  ·  They won't forget." />
            <Ex en="won't = will not (the only contracted negative form)" />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Will", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "verb (base form)", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Will you help me?  ·  Will she come?  ·  Will they be ready?" />
            <Ex en="Short answers: Yes, I will. / No, she won't." />
          </div>
        </div>
      </div>

      {/* All persons table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">will is the same for ALL subjects</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Affirmative</th>
                <th className="px-4 py-2.5 font-black text-red-700">Negative</th>
                <th className="px-4 py-2.5 font-black text-sky-700">Question</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I", "I will / I'll", "I won't", "Will I?"],
                ["You", "You will / You'll", "You won't", "Will you?"],
                ["He / She / It", "She will / She'll", "She won't", "Will she?"],
                ["We", "We will / We'll", "We won't", "Will we?"],
                ["They", "They will / They'll", "They won't", "Will they?"],
              ].map(([subj, aff, neg, q], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm">{aff}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-sm">{neg}</td>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-sm">{q}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contractions grid */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Contractions</div>
        <div className="flex flex-wrap gap-2">
          {["I → I'll", "you → you'll", "he → he'll", "she → she'll", "it → it'll", "we → we'll", "they → they'll", "will not → won't"].map((c) => (
            <span key={c} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{c}</span>
          ))}
        </div>
      </div>

      {/* Amber warning */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-2">After will / won&apos;t: ALWAYS use the base form of the verb!</div>
        <div className="space-y-1 text-sm text-amber-900">
          <div>She will <b>go</b> ✅ &nbsp;|&nbsp; She will <b>goes</b> ❌ &nbsp;|&nbsp; She will <b>going</b> ❌</div>
          <div>He won&apos;t <b>be</b> late ✅ &nbsp;|&nbsp; He won&apos;t <b>is</b> late ❌</div>
        </div>
      </div>

      {/* Short answers table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Short answers</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Question</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Yes answer</th>
                <th className="px-4 py-2.5 font-black text-red-700">No answer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Will you…?", "Yes, I will.", "No, I won't."],
                ["Will he/she…?", "Yes, he will.", "No, she won't."],
                ["Will they…?", "Yes, they will.", "No, they won't."],
                ["Will it…?", "Yes, it will.", "No, it won't."],
              ].map(([q, yes, no], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2.5 text-sky-700 font-mono text-sm">{q}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm">{yes}</td>
                  <td className="px-4 py-2.5 text-red-700 font-mono text-sm">{no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time expressions */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Common time expressions with will</div>
        <div className="flex flex-wrap gap-2">
          {["tomorrow", "next week", "next month", "next year", "soon", "later", "tonight", "in the future", "one day", "someday", "eventually", "in 5 years"].map((t) => (
            <span key={t} className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
