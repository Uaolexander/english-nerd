"use client";
import { useMemo, useState, useEffect } from "react";
import { useLiveSync } from "@/lib/useLiveSync";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import { PPC_SPEED_QUESTIONS, PPC_PDF_CONFIG } from "../ppcSharedData";
import TenseRecommendations from "@/components/TenseRecommendations";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string; };
type ExSet = { no: 1 | 2 | 3 | 4; title: string; instructions: string; questions: MCQ[]; };

const SETS: Record<1 | 2 | 3 | 4, ExSet> = {
  1: {
    no: 1,
    title: "Exercise 1 — Affirmative: have been or has been?",
    instructions:
      "Choose have been or has been to form the Present Perfect Continuous affirmative. Use have been with I / you / we / they; use has been with he / she / it.",
    questions: [
      { id: "1-1",  prompt: "She ___ working here for three years.",           options: ["have been", "has been", "is being", "was being"],     correctIndex: 1, explanation: "She → has been: She has been working here for three years." },
      { id: "1-2",  prompt: "I ___ studying all morning.",                     options: ["has been", "have been", "am being", "was being"],     correctIndex: 1, explanation: "I → have been: I have been studying all morning." },
      { id: "1-3",  prompt: "They ___ waiting for over an hour.",              options: ["has been", "is being", "have been", "are being"],     correctIndex: 2, explanation: "They → have been: They have been waiting for over an hour." },
      { id: "1-4",  prompt: "He ___ playing football all afternoon.",          options: ["have been", "has been", "had been", "is being"],      correctIndex: 1, explanation: "He → has been: He has been playing football all afternoon." },
      { id: "1-5",  prompt: "We ___ living in this apartment since May.",      options: ["has been", "is being", "are being", "have been"],     correctIndex: 3, explanation: "We → have been: We have been living here since May." },
      { id: "1-6",  prompt: "The dog ___ barking since this morning.",         options: ["have been", "are being", "has been", "is being"],     correctIndex: 2, explanation: "The dog (= it) → has been: The dog has been barking since this morning." },
      { id: "1-7",  prompt: "You ___ working too hard lately.",                options: ["has been", "have been", "had been", "are being"],     correctIndex: 1, explanation: "You → have been: You have been working too hard lately." },
      { id: "1-8",  prompt: "My parents ___ travelling around Europe.",        options: ["has been", "is being", "have been", "are being"],     correctIndex: 2, explanation: "My parents (= they) → have been: They have been travelling around Europe." },
      { id: "1-9",  prompt: "It ___ raining since last night.",                options: ["have been", "are being", "were being", "has been"],   correctIndex: 3, explanation: "It → has been: It has been raining since last night." },
      { id: "1-10", prompt: "The children ___ playing in the garden.",         options: ["has been", "have been", "is being", "are being"],     correctIndex: 1, explanation: "The children (= they) → have been: The children have been playing in the garden." },
    ],
  },
  2: {
    no: 2,
    title: "Exercise 2 — Negative: haven't been or hasn't been + -ing",
    instructions:
      "Negative Present Perfect Continuous: subject + haven't been / hasn't been + -ing verb. Use haven't been with I / you / we / they, and hasn't been with he / she / it.",
    questions: [
      { id: "2-1",  prompt: "She ___ sleeping well lately.",                   options: ["haven't been", "hasn't been", "didn't be", "isn't being"],   correctIndex: 1, explanation: "She → hasn't been: She hasn't been sleeping well lately." },
      { id: "2-2",  prompt: "I ___ feeling well this week.",                   options: ["hasn't been", "didn't be", "haven't been", "wasn't being"],  correctIndex: 2, explanation: "I → haven't been: I haven't been feeling well this week." },
      { id: "2-3",  prompt: "They ___ practising enough.",                     options: ["hasn't been", "didn't be", "aren't being", "haven't been"],  correctIndex: 3, explanation: "They → haven't been: They haven't been practising enough." },
      { id: "2-4",  prompt: "He ___ eating properly since he moved out.",      options: ["haven't been", "hasn't been", "didn't be", "isn't being"],   correctIndex: 1, explanation: "He → hasn't been: He hasn't been eating properly since he moved out." },
      { id: "2-5",  prompt: "We ___ getting much sleep recently.",             options: ["hasn't been", "weren't being", "didn't be", "haven't been"], correctIndex: 3, explanation: "We → haven't been: We haven't been getting much sleep recently." },
      { id: "2-6",  prompt: "It ___ working properly since the update.",       options: ["haven't been", "didn't be", "hasn't been", "wasn't being"],  correctIndex: 2, explanation: "It → hasn't been: It hasn't been working properly since the update." },
      { id: "2-7",  prompt: "You ___ listening to me at all.",                 options: ["hasn't been", "haven't been", "didn't be", "weren't being"], correctIndex: 1, explanation: "You → haven't been: You haven't been listening to me at all." },
      { id: "2-8",  prompt: "My sister ___ coming to class regularly.",        options: ["haven't been", "didn't be", "hasn't been", "isn't being"],   correctIndex: 2, explanation: "My sister (= she) → hasn't been: She hasn't been coming to class regularly." },
      { id: "2-9",  prompt: "The team ___ performing well this season.",       options: ["hasn't been", "weren't being", "haven't been", "aren't being"], correctIndex: 2, explanation: "The team (= it) → hasn't been: The team hasn't been performing well this season." },
      { id: "2-10", prompt: "He ___ taking his medicine as prescribed.",       options: ["haven't been", "hasn't been", "didn't be", "isn't being"],   correctIndex: 1, explanation: "He → hasn't been: He hasn't been taking his medicine as prescribed." },
    ],
  },
  3: {
    no: 3,
    title: "Exercise 3 — Questions: Have / Has + subject + been + -ing?",
    instructions:
      "Form Present Perfect Continuous questions: Have / Has + subject + been + -ing verb + ? Use Have with I / you / we / they, and Has with he / she / it.",
    questions: [
      { id: "3-1",  prompt: "___ she been waiting long?",                      options: ["Have", "Did", "Was", "Has"],                              correctIndex: 3, explanation: "She → Has: Has she been waiting long?" },
      { id: "3-2",  prompt: "___ you been studying all day?",                  options: ["Has", "Did", "Are", "Have"],                              correctIndex: 3, explanation: "You → Have: Have you been studying all day?" },
      { id: "3-3",  prompt: "___ they been arguing again?",                    options: ["Has", "Did", "Have", "Are"],                              correctIndex: 2, explanation: "They → Have: Have they been arguing again?" },
      { id: "3-4",  prompt: '"Have you been crying?" — "Yes, ___.\'',          options: ["I have", "I did", "I has", "I was"],                      correctIndex: 0, explanation: "Short positive answer: Yes, I have." },
      { id: "3-5",  prompt: '"Has he been working late?" — "No, ___.\'',       options: ["he didn't", "he have", "he hasn't", "he isn't"],          correctIndex: 2, explanation: "Short negative answer: No, he hasn't." },
      { id: "3-6",  prompt: "___ it been snowing all night?",                  options: ["Have", "Did", "Was", "Has"],                              correctIndex: 3, explanation: "It → Has: Has it been snowing all night?" },
      { id: "3-7",  prompt: '"Have they been living here long?" — "Yes, ___.\'', options: ["they did", "they have", "they has", "they are"],        correctIndex: 1, explanation: "Short positive answer: Yes, they have." },
      { id: "3-8",  prompt: "___ he been taking English lessons?",             options: ["Have", "Did", "Was", "Has"],                              correctIndex: 3, explanation: "He → Has: Has he been taking English lessons?" },
      { id: "3-9",  prompt: '"Has she been feeling better?" — "No, ___.\'',    options: ["she hasn't", "she haven't", "she didn't", "she isn't"],   correctIndex: 0, explanation: "Short negative with has: No, she hasn't." },
      { id: "3-10", prompt: "___ we been waiting at the right platform?",      options: ["Did", "Was", "Are", "Have"],                              correctIndex: 3, explanation: "We → Have: Have we been waiting at the right platform?" },
    ],
  },
  4: {
    no: 4,
    title: "Exercise 4 — Mixed: all forms + -ing spelling rules",
    instructions:
      "This exercise mixes all forms of the Present Perfect Continuous and tests -ing spelling. Key rules: double the final consonant in short verbs (run → running, sit → sitting); drop the silent -e (make → making, write → writing); keep -y (study → studying).",
    questions: [
      { id: "4-1",  prompt: "She has been ___ (run) for half an hour.",        options: ["runing", "running", "runned", "runs"],                    correctIndex: 1, explanation: "Short vowel + single consonant: double the n → running." },
      { id: "4-2",  prompt: "They ___ been making a lot of noise.",            options: ["hasn't", "have", "has", "haven't"],                       correctIndex: 1, explanation: "They → have: They have been making a lot of noise." },
      { id: "4-3",  prompt: "He has been ___ (write) emails all morning.",     options: ["writting", "writing", "writed", "writeing"],              correctIndex: 1, explanation: "Drop silent -e before -ing: write → writing." },
      { id: "4-4",  prompt: "___ she been sitting here the whole time?",       options: ["Have", "Did", "Was", "Has"],                              correctIndex: 3, explanation: "She → Has: Has she been sitting here the whole time?" },
      { id: "4-5",  prompt: "I haven't been ___ (swim) in years.",             options: ["swiming", "swimming", "swimmed", "swimmng"],              correctIndex: 1, explanation: "Short vowel + single consonant: double the m → swimming." },
      { id: "4-6",  prompt: "We have been ___ (study) together since Monday.", options: ["studing", "studying", "studied", "studyed"],              correctIndex: 1, explanation: "Verb ending in -y: just add -ing → studying." },
      { id: "4-7",  prompt: "Has it been ___ (rain) since yesterday?",         options: ["rainning", "rained", "raineing", "raining"],              correctIndex: 3, explanation: "rain ends in a vowel + n; no doubling needed → raining." },
      { id: "4-8",  prompt: "He ___ been lying about his whereabouts.",        options: ["have", "hasn't", "haven't", "are"],                       correctIndex: 1, explanation: "He → hasn't: He hasn't been lying about his whereabouts." },
      { id: "4-9",  prompt: "You have been ___ (sit) in the same position all day.", options: ["siting", "sitting", "sitted", "sits"],             correctIndex: 1, explanation: "Short vowel + single consonant t: double it → sitting." },
      { id: "4-10", prompt: "___ they been trying to contact you?",            options: ["Has", "Did", "Was", "Have"],                              correctIndex: 3, explanation: "They → Have: Have they been trying to contact you?" },
    ],
  },
};

const SET_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Affirmative",
  2: "Negative",
  3: "Questions",
  4: "Mixed",
};

export default function HaveBeenIngClient() {
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

  async function handlePDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(PPC_PDF_CONFIG); } finally { setPdfLoading(false); }
  }

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

  function reset() { window.scrollTo({ top: 0, behavior: "smooth" }); setChecked(false); setAnswers({}); broadcast({ answers: {}, checked: false, exNo }); }
  function switchSet(n: 1 | 2 | 3 | 4) { window.scrollTo({ top: 0, behavior: "smooth" }); setExNo(n); setChecked(false); setAnswers({}); broadcast({ answers: {}, checked: false, exNo: n }); }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <a className="hover:text-slate-900 transition" href="/">Home</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses">Tenses</a>
          <span className="text-slate-300">/</span>
          <a className="hover:text-slate-900 transition" href="/tenses/present-perfect-continuous">Present Perfect Continuous</a>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">have / has been + -ing</span>
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            PPC <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">have been + -ing</span>
          </h1>
          <span className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 border border-amber-200">Medium</span>
          <span className="mt-2 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700 border border-sky-200">B1</span>
        </div>
        <p className="mt-3 max-w-3xl text-slate-700">
          40 questions to master the structure <b>have/has been + -ing</b> across affirmative, negative, and question forms, including -ing spelling rules.
        </p>

        {/* Three-column grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

          {isPro ? (
            <div className=""><SpeedRound gameId="ppc-have-been-ing" subject="Have/Has Been -ing" questions={PPC_SPEED_QUESTIONS} variant="sidebar" /></div>
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}

          <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
            <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
              <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
              <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
              <PDFButton onDownload={handlePDF} loading={pdfLoading} />
              <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
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
                                    <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => { const newAnswers = { ...answers, [q.id]: oi }; setAnswers(newAnswers); broadcast({ answers: newAnswers, checked, exNo }); }} className="accent-[#F5DA20]" />
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
                        <button onClick={() => { setChecked(true); broadcast({ answers, checked: true, exNo }); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Check Answers</button>
                      ) : (
                        <button onClick={reset} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">Try Again</button>
                      )}
                      {checked && exNo < 4 && (
                        <button onClick={() => switchSet((exNo + 1) as 1 | 2 | 3 | 4)}
                          className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">Next Exercise →</button>
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

          {isPro ? (
            <TenseRecommendations tense="present-perfect-continuous" />
          ) : (
            <AdUnit variant="sidebar-light" />
          )}
        </div>

        {!isPro && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
            <div className="hidden lg:block" />
            <SpeedRound gameId="ppc-have-been-ing" subject="Have/Has Been -ing" questions={PPC_SPEED_QUESTIONS} />
            <div className="hidden lg:block" />
          </div>
        )}

        <AdUnit variant="mobile-dark" />

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
          <a href="/tenses/present-perfect-continuous" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All Present Perfect Continuous exercises</a>
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

      {/* 3 gradient cards */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-3 py-1 text-xs font-black text-white">+ Affirmative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "have / has", color: "yellow" },
            { text: "been", color: "orange" },
            { text: "verb + -ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I have been working.  ·  She has been studying.  ·  They have been waiting." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-red-500 px-3 py-1 text-xs font-black text-white">− Negative</span>
          <Formula parts={[
            { text: "Subject", color: "sky" },
            { text: "haven't / hasn't", color: "red" },
            { text: "been", color: "orange" },
            { text: "verb + -ing", color: "green" },
            { text: ".", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="I haven't been sleeping well.  ·  He hasn't been eating properly.  ·  They haven't been practising." />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-5 space-y-3">
          <span className="inline-flex items-center rounded-xl bg-sky-500 px-3 py-1 text-xs font-black text-white">? Question</span>
          <Formula parts={[
            { text: "Have / Has", color: "violet" },
            { text: "subject", color: "sky" },
            { text: "been", color: "orange" },
            { text: "verb + -ing", color: "green" },
            { text: "?", color: "slate" },
          ]} />
          <div className="space-y-1.5">
            <Ex en="Have you been waiting long?  ·  Has she been feeling better?  ·  Have they been arguing?" />
          </div>
        </div>
      </div>

      {/* have been vs has been table */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">have been vs has been</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Subject</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">Auxiliary</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["I / You / We / They", "have been", "I have been working.  ·  They have been waiting."],
                ["He / She / It ★", "has been", "She has been studying.  ·  It has been raining."],
              ].map(([subj, aux, ex], i) => (
                <tr key={i} className={i === 1 ? "bg-amber-50 font-bold" : "bg-white"}>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">{subj}</td>
                  <td className="px-4 py-2.5 text-emerald-700 font-mono text-sm font-black">{aux}</td>
                  <td className="px-4 py-2.5 text-slate-600 font-mono text-xs">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <span className="font-black">★ Key rule:</span> He / She / It always use <b>has been</b>, never <b>have been</b>.<br />
          <span className="text-xs">She <b>has been</b> working ✅ &nbsp; She <b>have been</b> working ❌</span>
        </div>
      </div>

      {/* -ing spelling rules */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">-ing spelling rules</div>
        <div className="rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left">
                <th className="px-4 py-2.5 font-black text-slate-700">Rule</th>
                <th className="px-4 py-2.5 font-black text-slate-700">Example verb</th>
                <th className="px-4 py-2.5 font-black text-emerald-700">+ -ing form</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                ["Just add -ing (most verbs)", "read / eat / play", "reading / eating / playing"],
                ["Drop silent -e, then add -ing", "make / write / live", "making / writing / living"],
                ["Double consonant (short vowel + single consonant)", "run / sit / swim / get", "running / sitting / swimming / getting"],
                ["Verbs ending in -ie → -y + ing", "lie / die", "lying / dying"],
                ["Verbs ending in -y → just add -ing", "study / play", "studying / playing"],
              ].map(([rule, verb, form], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-2.5 text-slate-700">{rule}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-600 text-xs">{verb}</td>
                  <td className="px-4 py-2.5 font-mono text-emerald-700 font-semibold text-xs">{form}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* When to use PPC */}
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">When to use Present Perfect Continuous</div>
        <div className="space-y-3">
          {[
            { label: "Ongoing action + duration", color: "sky", examples: ["She has been working here for five years.", "We have been waiting since 8 o'clock.", "It has been raining all day."] },
            { label: "Visible result in the present", color: "green", examples: ["You look tired. Have you been working late?", "His hands are dirty — he's been fixing the car.", "She's out of breath — she's been running."] },
            { label: "Recently stopped action with present effect", color: "violet", examples: ["My eyes hurt — I've been reading for hours.", "The ground is wet — it's been raining.", "I'm hungry — I've been cooking all morning!"] },
          ].map(({ label, color, examples }) => {
            const borderMap: Record<string, string> = { sky: "border-sky-200 bg-sky-50/50", green: "border-emerald-200 bg-emerald-50/50", violet: "border-violet-200 bg-violet-50/50" };
            const badgeMap: Record<string, string> = { sky: "bg-sky-100 text-sky-800 border-sky-200", green: "bg-emerald-100 text-emerald-800 border-emerald-200", violet: "bg-violet-100 text-violet-800 border-violet-200" };
            return (
              <div key={label} className={`rounded-xl border p-4 ${borderMap[color]}`}>
                <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-black mb-2 ${badgeMap[color]}`}>{label}</span>
                <div className="space-y-1">
                  {examples.map((ex) => <Ex key={ex} en={ex} />)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
