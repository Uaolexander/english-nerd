"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF, type LessonPDFConfig } from "@/lib/generateLessonPDF";
import GrammarRecommended, { type GrammarRec } from "@/components/GrammarRecommended";

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Complex Passives", href: "/grammar/c1/complex-passives", level: "C1", badge: "bg-sky-600", reason: "Both deal with advanced passive structures at C1 level" },
  { title: "Advanced Modals", href: "/grammar/c1/advanced-modals", level: "C1", badge: "bg-sky-600" },
  { title: "Reported Speech C1", href: "/grammar/c1/reported-speech-c1", level: "C1", badge: "bg-sky-600" },
];

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "Passive infinitive structure:", options: ["to be + past participle", "to have + past participle", "being + pp", "to be + gerund"], answer: 0 },
  { q: "She wants ___ promoted.", options: ["to be", "to have been", "being", "to get"], answer: 0 },
  { q: "Perfect passive infinitive:", options: ["to have been + pp", "to be + pp", "having + pp", "been + pp"], answer: 0 },
  { q: "He seems ___ the winner.", options: ["to have been declared", "to be declared", "being declared", "declared"], answer: 0 },
  { q: "They expected ___ on time.", options: ["to be paid", "to pay", "being paid", "paid"], answer: 0 },
  { q: "She was pleased ___ chosen.", options: ["to have been", "to be", "having been", "to been"], answer: 0 },
  { q: "He deserves ___ recognised.", options: ["to be", "to have been", "being", "being have"], answer: 0 },
  { q: "She claims ___ unfairly treated.", options: ["to have been", "to be", "being", "been"], answer: 0 },
  { q: "The house needs ___ repainted.", options: ["to be", "to have been", "being", "been"], answer: 0 },
  { q: "They appear ___ the project.", options: ["to have been given", "to be given", "being given", "given"], answer: 0 },
  { q: "Passive inf. after 'want' = ___.", options: ["Subject's wish to receive", "Subject does action", "Object's wish", "Both active"], answer: 0 },
  { q: "He was said ___ a genius.", options: ["to be", "to have been", "being", "been"], answer: 0 },
  { q: "She seems ___ the award.", options: ["to have been given", "to be given", "being given", "having given"], answer: 0 },
  { q: "The report is understood ___ wrong.", options: ["to have been", "to be", "being", "been"], answer: 0 },
  { q: "It needs ___ carefully.", options: ["to be handled", "to have handled", "being handle", "handling"], answer: 0 },
  { q: "He was relieved ___ chosen.", options: ["to have been", "to be", "being", "been"], answer: 0 },
  { q: "She hoped ___ promoted soon.", options: ["to be", "to have been", "being", "to been"], answer: 0 },
  { q: "Passive inf. after 'seem/appear':", options: ["to be / to have been", "being", "having been", "been"], answer: 0 },
  { q: "He is believed ___ escaped.", options: ["to have", "to be", "having", "been"], answer: 0 },
  { q: "They expect ___ invited.", options: ["to be", "to have been", "being", "been"], answer: 0 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Passive Infinitives",
  subtitle: "to be + pp and to have been + pp structures",
  level: "C1",
  keyRule: "Passive inf: to be + pp (present); to have been + pp (past).",
  exercises: [
    {
      number: 1,
      title: "Simple Passive Infinitive",
      difficulty: "Easy",
      instruction: "Choose the correct passive infinitive.",
      questions: [
        "She wants ___ promoted.",
        "He deserves ___ recognised.",
        "She hoped ___ selected.",
        "They expected ___ invited.",
        "The house needs ___ repainted.",
        "He was said ___ a genius.",
        "She was pleased ___ chosen.",
        "It needs ___ carefully handled.",
        "They want ___ informed first.",
        "He was relieved ___ accepted.",
      ],
      hint: "to be promoted / to be recognised",
    },
    {
      number: 2,
      title: "Perfect Passive Infinitive",
      difficulty: "Medium",
      instruction: "Choose the correct perfect passive infinitive.",
      questions: [
        "She claims ___ unfairly treated.",
        "He seems ___ the winner.",
        "Report understood ___ wrong.",
        "She appears ___ the job.",
        "He is believed ___ escaped.",
        "They seem ___ a warning.",
        "She was pleased ___ chosen.",
        "He was relieved ___ cleared.",
        "They claim ___ deceived.",
        "She seems ___ the award.",
      ],
      hint: "to have been treated / to have been declared",
    },
    {
      number: 3,
      title: "Passive Infinitive in Context",
      difficulty: "Hard",
      instruction: "Choose to be or to have been.",
      questions: [
        "She wants ___ promoted. (future wish)",
        "She claims ___ treated unfairly. (past)",
        "He deserves ___ recognised. (now)",
        "He is believed ___ escaped. (past)",
        "Report needs ___ filed today.",
        "She seems ___ given a choice. (past)",
        "They expect ___ promoted next year.",
        "He appears ___ the best candidate.",
        "She was glad ___ included. (past)",
        "The issue needs ___ resolved. (now)",
      ],
      hint: "to be (present/future) / to have been (past)",
    },
    {
      number: 4,
      title: "Rewrite Using Passive Infinitive",
      difficulty: "Very Hard",
      instruction: "Rewrite using a passive infinitive structure.",
      questions: [
        "She wants promotion.",
        "He deserves recognition.",
        "Someone treated her unfairly. (claim)",
        "Someone declared him the winner.",
        "Someone gave them a warning.",
        "She hoped they'd select her.",
        "He believed they'd clear him.",
        "Someone invited them. (expect)",
        "She wanted them to paint house.",
        "They believe he escaped. (is)",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Simple Passive Infinitive", answers: ["to be promoted", "to be recognised", "to be selected", "to be invited", "to be repainted", "to be", "to have been chosen", "to be handled", "to be informed", "to have been accepted"] },
    { exercise: 2, subtitle: "Perfect Passive Infinitive", answers: ["to have been treated", "to have been declared", "to have been written", "to have been offered", "to have escaped", "to have been given", "to have been chosen", "to have been cleared", "to have been deceived", "to have been given"] },
    { exercise: 3, subtitle: "Passive Infinitive in Context", answers: ["to be", "to have been", "to be", "to have", "to be", "to have been", "to be", "to be", "to have been", "to be"] },
    { exercise: 4, subtitle: "Rewrite Using Passive Infinitive", answers: ["She wants to be promoted.", "He deserves to be recognised.", "She claims to have been treated unfairly.", "He seems to have been declared the winner.", "They seem to have been given a warning.", "She hoped to be selected.", "He was relieved to have been cleared.", "They expected to be invited.", "She wanted the house to be painted.", "He is believed to have escaped."] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function PassiveInfinitivesLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — It is said that… / Subject + is said to…",
      instructions: "Two patterns report what people think or say: 'It is said that + clause' and 'Subject + is said + to-infinitive'. Choose the correct form.",
      questions: [
        { id: "e1q1", prompt: "___ that the CEO will resign this week.", options: ["It is said", "He is said", "It says"], correctIndex: 0, explanation: "It is said that + clause = impersonal passive reporting." },
        { id: "e1q2", prompt: "The CEO ___ resign this week.", options: ["is said to", "is said that", "is saying to"], correctIndex: 0, explanation: "Subject + is said + to-infinitive = personal passive reporting." },
        { id: "e1q3", prompt: "She ___ be the most influential scientist of her generation.", options: ["is considered to", "is considered that", "considers to"], correctIndex: 0, explanation: "Subject + is considered + to-infinitive." },
        { id: "e1q4", prompt: "___ that the ancient library was destroyed in a fire.", options: ["It is believed", "They believe", "It believes"], correctIndex: 0, explanation: "It is believed that + clause = formal impersonal passive." },
        { id: "e1q5", prompt: "The treatment ___ effective in over 80% of cases.", options: ["is known to be", "is known that be", "is known being"], correctIndex: 0, explanation: "Subject + is known + to be = present reference." },
        { id: "e1q6", prompt: "___ that he holds several offshore accounts.", options: ["He is alleged", "It is alleged", "It alleges"], correctIndex: 1, explanation: "It is alleged that + clause = formal/legal impersonal passive." },
        { id: "e1q7", prompt: "The ruins ___ date back to the 3rd century BC.", options: ["are thought to", "are thought that", "thought to"], correctIndex: 0, explanation: "Subject + are thought + to-infinitive = personal passive." },
        { id: "e1q8", prompt: "___ that the negotiations are close to a breakthrough.", options: ["It is reported", "They are reported", "It reported"], correctIndex: 0, explanation: "It is reported that + clause = impersonal passive (used in news)." },
        { id: "e1q9", prompt: "The ambassador ___ leave the country by midnight.", options: ["is understood to", "understands to", "is understood that"], correctIndex: 0, explanation: "Subject + is understood + to-infinitive." },
        { id: "e1q10", prompt: "The virus ___ originated in a wet market.", options: ["is believed to have", "is believed that have", "believed to have"], correctIndex: 0, explanation: "Subject + is believed + to have + pp = past reference (personal impersonal passive)." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Present vs past infinitive in passive reporting",
      instructions: "Choose between the present infinitive (to be) and the perfect infinitive (to have + pp). Present = current; perfect = before the reporting time.",
      questions: [
        { id: "e2q1", prompt: "He is thought ___ the country yesterday. (left in the past)", options: ["to leave", "to have left", "having left"], correctIndex: 1, explanation: "to have left = past event relative to the reporting time." },
        { id: "e2q2", prompt: "She is believed ___ one of the wealthiest people in the city. (still true)", options: ["to have been", "to be", "being"], correctIndex: 1, explanation: "to be = present reference (she is still wealthy)." },
        { id: "e2q3", prompt: "The documents are said ___ forged by a government official.", options: ["to be", "to have been", "being"], correctIndex: 1, explanation: "to have been + pp = the forgery happened before the reporting." },
        { id: "e2q4", prompt: "The suspects are known ___ in the area at the time of the crime.", options: ["to be", "to have been", "to being"], correctIndex: 1, explanation: "to have been = past reference (they were there at a specific past time)." },
        { id: "e2q5", prompt: "She is reported ___ in a critical condition. (currently, right now)", options: ["to have been", "to be", "being"], correctIndex: 1, explanation: "to be = current state at the time of reporting." },
        { id: "e2q6", prompt: "The company is alleged ___ millions in tax. (past evasion)", options: ["to evade", "to have evaded", "evading"], correctIndex: 1, explanation: "to have evaded = the act happened before the current allegation." },
        { id: "e2q7", prompt: "He is understood ___ working on a new novel. (currently)", options: ["to have been", "to be", "to have"], correctIndex: 1, explanation: "to be = current ongoing activity." },
        { id: "e2q8", prompt: "The asteroid is estimated ___ approximately 65 million years ago.", options: ["to strike", "to have struck", "striking"], correctIndex: 1, explanation: "to have struck = a specific event in the past." },
        { id: "e2q9", prompt: "The prime minister is expected ___ a statement this afternoon.", options: ["to have made", "to make", "making"], correctIndex: 1, explanation: "to make = future event (it hasn't happened yet — expected to do something)." },
        { id: "e2q10", prompt: "Several officials are believed ___ bribed by the contractor.", options: ["to be", "to have been", "having been"], correctIndex: 1, explanation: "to have been + pp = passive + past reference: the bribery preceded the reporting." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Transform: active → passive reporting",
      instructions: "Choose the correct passive reporting transformation. Both 'It is…' and personal passive forms are tested.",
      questions: [
        { id: "e3q1", prompt: "People say she is the best candidate. → She ___.", options: ["is said to be the best candidate.", "is said that she is the best candidate.", "says to be the best candidate."], correctIndex: 0, explanation: "She is said + to be = personal passive reporting (present)." },
        { id: "e3q2", prompt: "People believe he stole the painting. → It ___.", options: ["is believed he stole the painting.", "is believed that he stole the painting.", "believes he stole the painting."], correctIndex: 1, explanation: "It is believed that + clause = impersonal passive." },
        { id: "e3q3", prompt: "People believe he stole the painting. → He ___.", options: ["is believed to steal the painting.", "is believed to have stolen the painting.", "is believed having stolen the painting."], correctIndex: 1, explanation: "He is believed + to have stolen = personal passive + past reference." },
        { id: "e3q4", prompt: "People expect the president to resign. → The president ___.", options: ["is expected to resign.", "is expected that resign.", "expects to resign."], correctIndex: 0, explanation: "Subject + is expected + to-infinitive = personal passive (future/expected)." },
        { id: "e3q5", prompt: "People know that the company has been losing money. → It ___.", options: ["is known the company has been losing money.", "is known that the company has been losing money.", "knows the company is losing money."], correctIndex: 1, explanation: "It is known that + full clause." },
        { id: "e3q6", prompt: "People report that the fire started in the kitchen. → The fire ___.", options: ["is reported to start in the kitchen.", "is reported to have started in the kitchen.", "is reported starting in the kitchen."], correctIndex: 1, explanation: "Subject + is reported + to have started = personal passive + past reference." },
        { id: "e3q7", prompt: "Experts think the building was constructed in the 16th century. → The building ___.", options: ["is thought to be constructed in the 16th century.", "is thought to have been constructed in the 16th century.", "is thought that constructed in the 16th century."], correctIndex: 1, explanation: "Personal passive + passive infinitive + past: to have been + pp." },
        { id: "e3q8", prompt: "People allege the minister accepted bribes. → The minister ___.", options: ["is alleged to have accepted bribes.", "is alleged to accept bribes.", "is alleged accepting bribes."], correctIndex: 0, explanation: "Subject + is alleged + to have + pp = past reference." },
        { id: "e3q9", prompt: "People say the economy is recovering. → It ___.", options: ["is said the economy recovers.", "is said that the economy is recovering.", "says that the economy is recovering."], correctIndex: 1, explanation: "It is said that + clause. The tense stays the same." },
        { id: "e3q10", prompt: "People claim that she has been living abroad for years. → She ___.", options: ["is claimed to have been living abroad for years.", "is claimed to live abroad for years.", "is claimed having lived abroad for years."], correctIndex: 0, explanation: "She is claimed + to have been + -ing = passive reporting + perfect continuous infinitive." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Rewrite using passive reporting",
      instructions: "Rewrite each sentence using the structure shown in brackets. Write the complete rewritten sentence (lowercase).",
      questions: [
        { id: "e4q1", prompt: "People say she is the most talented surgeon in the country. (It…)", correct: "it is said that she is the most talented surgeon in the country", explanation: "It is said that + clause." },
        { id: "e4q2", prompt: "People say she is the most talented surgeon in the country. (She…)", correct: "she is said to be the most talented surgeon in the country", explanation: "She is said + to be (present reference)." },
        { id: "e4q3", prompt: "People believe he fled the country last night. (He…)", correct: "he is believed to have fled the country last night", explanation: "He is believed + to have + pp (past reference)." },
        { id: "e4q4", prompt: "People think the artifact was stolen from the museum. (It…)", correct: "it is thought that the artifact was stolen from the museum", explanation: "It is thought that + clause (past tense preserved)." },
        { id: "e4q5", prompt: "People think the artifact was stolen from the museum. (The artifact…)", correct: "the artifact is thought to have been stolen from the museum", explanation: "Subject + is thought + to have been + pp = passive infinitive + past reference." },
        { id: "e4q6", prompt: "People expect the results to be announced tomorrow. (The results…)", correct: "the results are expected to be announced tomorrow", explanation: "Subject + are expected + to be + pp = future passive." },
        { id: "e4q7", prompt: "People claim he has been embezzling funds for years. (He…)", correct: "he is claimed to have been embezzling funds for years", explanation: "Subject + is claimed + to have been + -ing = passive reporting with perfect continuous." },
        { id: "e4q8", prompt: "People report that three people were injured in the blast. (It…)", correct: "it is reported that three people were injured in the blast", explanation: "It is reported that + clause." },
        { id: "e4q9", prompt: "Experts consider her to be the leading authority on the subject. (She…)", correct: "she is considered to be the leading authority on the subject", explanation: "She is considered + to be = present state." },
        { id: "e4q10", prompt: "People allege the company concealed the safety data. (The company…)", correct: "the company is alleged to have concealed the safety data", explanation: "Subject + is alleged + to have + pp = past reference." },
      ],
    },
  }), []);

  const current = sets[exNo];

  const { save } = useProgress();
  const isPro = useIsPro();

  async function handleDownloadPDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(PDF_CONFIG); } catch (e) { console.error(e); } finally { setPdfLoading(false); }
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
    const total = current.questions.length;
    if (current.type === "mcq") {
      for (const q of current.questions) { if (mcqAnswers[q.id] === q.correctIndex) correct++; }
    } else {
      for (const q of current.questions) {
        const a = normalize(inputAnswers[q.id] ?? "");
        if (a && a === normalize(q.correct)) correct++;
      }
    }
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
  }, [checked, current, mcqAnswers, inputAnswers]);

  function resetExercise() { setChecked(false); setMcqAnswers({}); setInputAnswers({}); }
  function switchExercise(n: 1 | 2 | 3 | 4) { setExNo(n); setChecked(false); setMcqAnswers({}); setInputAnswers({}); }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/grammar/c1">Grammar C1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Passive: Infinitives &amp; Reporting</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Passive:{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Infinitives &amp; Reporting</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-200">C1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Passive reporting structures allow you to report what people think or say without identifying who. Two main patterns: <b>It is said that + clause</b> (impersonal) and <b>She is said to be…</b> (personal). The choice between <i>to be</i> and <i>to have been</i> depends on whether the reference is present or past.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24">
          {isPro ? (
            <SpeedRound gameId="grammar-c1-passive-infinitives" subject="Passive Infinitives" questions={SPEED_QUESTIONS} variant="sidebar" />
          ) : (
            <AdUnit variant="sidebar-dark" />
          )}
        </div>

        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
            <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
            <PDFButton onDownload={handleDownloadPDF} loading={pdfLoading} />
            <div className="ml-auto hidden sm:flex items-center gap-2 text-sm text-slate-600">
              Exercises:
              {([1, 2, 3, 4] as const).map((n) => (
                <button key={n} onClick={() => switchExercise(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {tab === "exercises" ? (
              <>
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-black text-slate-900">{current.title}</h2>
                  <p className="text-slate-700">{current.instructions}</p>
                  <div className="mt-2 flex sm:hidden items-center gap-2 text-sm text-slate-600">
                    <span>Exercises:</span>
                    {([1, 2, 3, 4] as const).map((n) => (
                      <button key={n} onClick={() => switchExercise(n)} className={`h-9 w-9 rounded-xl border border-black/10 font-bold transition ${exNo === n ? "bg-[#F5DA20] text-black" : "bg-white text-slate-800 hover:bg-black/5"}`}>{n}</button>
                    ))}
                  </div>
                </div>
                <div className="mt-8 space-y-5">
                  {current.type === "mcq" ? current.questions.map((q, idx) => {
                    const chosen = mcqAnswers[q.id] ?? null;
                    const isCorrect = checked && chosen === q.correctIndex;
                    const isWrong = checked && chosen !== null && chosen !== q.correctIndex;
                    const noAnswer = checked && chosen === null;
                    return (
                      <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                          <div className="flex-1">
                            <div className="font-bold text-slate-900">{q.prompt}</div>
                            <div className="mt-3 grid gap-2 sm:grid-cols-3">
                              {q.options.map((opt, oi) => (
                                <label key={oi} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition ${chosen === oi ? "border-[#F5DA20] bg-[#F5DA20]/20" : "border-black/10 bg-white hover:bg-black/5"} ${checked ? "cursor-default" : ""}`}>
                                  <input type="radio" name={q.id} disabled={checked} checked={chosen === oi} onChange={() => setMcqAnswers((p) => ({ ...p, [q.id]: oi }))} />
                                  <span className="text-slate-900">{opt}</span>
                                </label>
                              ))}
                            </div>
                            {checked && (
                              <div className="mt-3 text-sm">
                                {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                {isWrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                <div className="mt-2 text-slate-700"><b className="text-slate-900">Correct:</b> {q.options[q.correctIndex]} — {q.explanation}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }) : current.questions.map((q, idx) => {
                    const val = inputAnswers[q.id] ?? "";
                    const answered = normalize(val) !== "";
                    const isCorrect = checked && answered && normalize(val) === normalize(q.correct);
                    const wrong = checked && answered && !isCorrect;
                    const noAnswer = checked && !answered;
                    return (
                      <div key={q.id} className="rounded-2xl border border-black/10 bg-white p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm font-black text-slate-700">{idx + 1}</div>
                          <div className="flex-1">
                            <div className="font-bold text-slate-900">{q.prompt}</div>
                            <div className="mt-3">
                              <input value={val} disabled={checked} onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))} placeholder="Type here…" className="w-full max-w-lg rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]" />
                            </div>
                            {checked && (
                              <div className="mt-3 text-sm">
                                {isCorrect && <div className="text-emerald-700 font-semibold">✅ Correct</div>}
                                {wrong && <div className="text-red-700 font-semibold">❌ Wrong</div>}
                                {noAnswer && <div className="text-amber-700 font-semibold">⚠ No answer</div>}
                                <div className="mt-2 text-slate-700"><b className="text-slate-900">Correct:</b> {q.correct} — {q.explanation}</div>
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
                      <button onClick={resetExercise} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-black/5 transition">Try Again</button>
                    )}
                    {checked && exNo < 4 && (
                      <button onClick={() => switchExercise((exNo + 1) as 1 | 2 | 3 | 4)} className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-black/5 transition">Next Exercise →</button>
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
                      <div className="mt-2 text-xs text-slate-500">{score.percent >= 80 ? "Excellent! You can move to the next exercise." : score.percent >= 50 ? "Good effort! Try once more to improve your score." : "Keep practising — review the Explanation tab and try again."}</div>
                    </div>
                  )}
                </div>
              </>
            ) : <Explanation />}
          </div>
        </section>

        {isPro ? (
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/c1" allLabel="All C1 topics" />
        ) : (
          <div className="sticky top-24">
            <AdUnit variant="sidebar-dark" />
          </div>
        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-c1-passive-infinitives" subject="Passive Infinitives" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/c1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All C1 topics</a>
        <a href="/grammar/c1/complex-passives" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Complex Passives →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Passive: Infinitives &amp; Reporting (C1)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { pattern: "It is said / believed / thought / reported / known / alleged / claimed + that + clause", ex: "It is believed that the company concealed the data. / It is reported that three people were injured." },
          { pattern: "Subject + is said / believed / thought / reported / known / alleged / expected / considered + to-infinitive (present)", ex: "She is considered to be the leading expert. / He is expected to resign." },
          { pattern: "Subject + is said / believed / thought + to have + pp (past reference)", ex: "He is believed to have left the country. / She is thought to have known about it." },
          { pattern: "Subject + is said + to have been + pp (passive + past)", ex: "The document is believed to have been forged. / The funds are alleged to have been misused." },
          { pattern: "Subject + is said + to have been + -ing (perfect continuous)", ex: "She is claimed to have been working for the opposition." },
        ].map(({ pattern, ex }) => (
          <div key={pattern} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="font-black text-cyan-700 text-sm mb-2">{pattern}</div>
            <div className="italic text-slate-700 text-sm">{ex}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-cyan-50 p-5">
        <div className="text-sm text-slate-800 space-y-1">
          <div><span className="font-black">to be</span> = current state / present reference</div>
          <div><span className="font-black">to have + pp</span> = action completed before the reporting time</div>
          <div><span className="font-black">to have been + pp</span> = passive past infinitive</div>
          <div><span className="font-black">to have been + -ing</span> = continuous action before the reporting time</div>
        </div>
      </div>
    </div>
  );
}
