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

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "Passive voice structure is?", options: ["subject + verb + object", "subject + be + pp", "object + have + pp", "subject + pp + be"], answer: 1 },
  { q: "Passive is used when?", options: ["Agent is known and important", "Agent is unknown or unimportant", "Action is ongoing", "Subject is doing the action"], answer: 1 },
  { q: "Passive of 'They built the bridge' is?", options: ["The bridge had built", "The bridge was built", "The bridge has built", "The bridge built"], answer: 1 },
  { q: "'It is said that...' is a type of?", options: ["Active sentence", "Reporting passive", "Modal passive", "Conditional"], answer: 1 },
  { q: "'He is believed to be honest' = ?", options: ["He is honest", "People believe he is honest", "He believes he is honest", "He was believed to be honest"], answer: 1 },
  { q: "Present perfect passive of 'fix'?", options: ["has been fixed", "is fixed", "was fixed", "had been fixed"], answer: 0 },
  { q: "Future passive of 'announce'?", options: ["is announced", "was announced", "will be announced", "has been announced"], answer: 2 },
  { q: "Modal passive structure is?", options: ["modal + been + pp", "modal + be + pp", "modal + pp", "modal + being + pp"], answer: 1 },
  { q: "'The car needs repairing' means?", options: ["I need to repair the car", "The car needs to be repaired", "Repairing the car is needed", "I repaired the car"], answer: 1 },
  { q: "Past perfect passive of 'approve'?", options: ["had approved", "was approved", "had been approved", "has been approved"], answer: 2 },
  { q: "'It was reported that...' — this is?", options: ["Active reporting", "Impersonal passive reporting", "Modal perfect", "Conditional passive"], answer: 1 },
  { q: "Passive continuous: 'The road ___ repaired' (pres.)?", options: ["is repaired", "is being repaired", "is been repaired", "has been repaired"], answer: 1 },
  { q: "Agent in passive is introduced by?", options: ["for", "by", "with", "from"], answer: 1 },
  { q: "'They say she is talented' in passive?", options: ["She is said to be talented", "She says to be talented", "It says she is talented", "She has said to be talented"], answer: 0 },
  { q: "Causative passive differs from standard in?", options: ["It uses 'by'", "It uses have/get + object + pp", "It uses modal", "It doesn't use 'be'"], answer: 1 },
  { q: "Reporting verb + passive infinitive: 'She is known ___'?", options: ["being successful", "to being successful", "to be successful", "of being successful"], answer: 2 },
  { q: "Which is passive perfect continuous?", options: ["has been being built", "is being built", "was built", "had been building"], answer: 0 },
  { q: "Passive of 'could build the bridge'?", options: ["could build the bridge", "could be built the bridge", "the bridge could be built", "the bridge was built"], answer: 2 },
  { q: "'The report must be submitted' is?", options: ["Active modal", "Passive modal", "Active present", "Passive continuous"], answer: 1 },
  { q: "Double passive sentence example is?", options: ["The car was built", "He was said to have been promoted", "The report will be done", "It is believed she left"], answer: 1 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Advanced Passive",
  subtitle: "Passive in all tenses + reporting structures",
  level: "B2",
  keyRule: "subject + be (any tense) + past participle; agent optional with 'by'.",
  exercises: [
    {
      number: 1,
      title: "Choose the correct passive form",
      difficulty: "easy" as const,
      instruction: "Pick the correct passive structure.",
      questions: [
        "The report ___ by tomorrow. (submit)",
        "This building ___ in 1850. (construct)",
        "The results ___ already. (announce)",
        "The road ___ right now. (repair)",
        "The contract ___ next week. (sign)",
        "Several files ___ by the hacker. (access)",
        "The project ___ before we arrived. (complete)",
        "New rules ___ since last month. (introduce)",
        "The decision ___ by the board. (make)",
        "The car ___ every year. (service)",
      ],
    },
    {
      number: 2,
      title: "Reporting passives",
      difficulty: "medium" as const,
      instruction: "Rewrite using impersonal passive reporting.",
      questions: [
        "People believe he is innocent.",
        "They say she earns a lot.",
        "Experts think the economy will grow.",
        "People know they worked hard.",
        "They report that the plan failed.",
        "People consider her very talented.",
        "It seems he has left the company.",
        "They expect prices to rise.",
        "People allege he committed fraud.",
        "Authorities claim the suspect fled.",
      ],
    },
    {
      number: 3,
      title: "Modal passives",
      difficulty: "hard" as const,
      instruction: "Choose the correct modal passive form.",
      questions: [
        "The report ___ by Friday. (must/submit)",
        "These instructions ___ clearly. (should/follow)",
        "Mistakes ___ at all costs. (must/avoid)",
        "The old files ___ before deletion. (should/back up)",
        "Results ___ within 24 hours. (may/release)",
        "A new system ___ next year. (will/implement)",
        "This problem ___ earlier. (could/solve)",
        "The deadline ___ if needed. (can/extend)",
        "The documents ___ in English. (must/write)",
        "The bridge ___ by the end of the year. (should/repair)",
      ],
    },
    {
      number: 4,
      title: "Mixed passive practice",
      difficulty: "hard" as const,
      instruction: "Write the full passive sentence.",
      questions: [
        "build / the stadium / in 1999",
        "announce / the winner / just now",
        "repair / the road / currently",
        "They said / he / be / arrested",
        "The plan / must / approve / first",
        "They know / she / be / talented",
        "inspect / the car / before the trip",
        "The exam / should / reschedule",
        "It is believed / they / escape",
        "translate / the document / into 5 languages",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Passive forms", answers: ["will be submitted", "was constructed", "have already been announced", "is being repaired", "will be signed", "were accessed", "had been completed", "have been introduced", "was made", "is serviced"] },
    { exercise: 2, subtitle: "Reporting passives", answers: ["He is believed to be innocent", "She is said to earn a lot", "The economy is thought to grow", "They are known to have worked hard", "It was reported that the plan failed", "She is considered very talented", "He is said/seems to have left", "Prices are expected to rise", "He is alleged to have committed fraud", "The suspect is claimed to have fled"] },
    { exercise: 3, subtitle: "Modal passives", answers: ["must be submitted", "should be followed", "must be avoided", "should be backed up", "may be released", "will be implemented", "could have been solved", "can be extended", "must be written", "should be repaired"] },
    { exercise: 4, subtitle: "Full passive sentences", answers: ["The stadium was built in 1999", "The winner has just been announced", "The road is currently being repaired", "He was said/reported to have been arrested", "The plan must be approved first", "She is known to be talented", "The car is to be inspected before the trip", "The exam should be rescheduled", "It is believed they have escaped", "The document was translated into 5 languages"] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Causative have/get", href: "/grammar/b2/causative", level: "B2", badge: "bg-orange-500", reason: "Causative is a natural extension of the advanced passive" },
  { title: "Reported Speech Advanced", href: "/grammar/b2/reported-speech-advanced", level: "B2", badge: "bg-orange-500", reason: "Reporting passive structures and complex clauses" },
  { title: "Participle Clauses", href: "/grammar/b2/participle-clauses", level: "B2", badge: "bg-orange-500" },
];

export default function PassiveAdvancedLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Perfect Passive: choose the correct form",
      instructions: "Choose the correct passive form. These sentences use perfect tenses in the passive.",
      questions: [
        { id: "e1q1", prompt: "The report ___ already. You can read it now.", options: ["has written", "has been written", "was written"], correctIndex: 1, explanation: "has been written = Present Perfect Passive (have/has + been + pp)." },
        { id: "e1q2", prompt: "By the time we arrived, the windows ___.", options: ["had broken", "had been broken", "were broken"], correctIndex: 1, explanation: "had been broken = Past Perfect Passive (had + been + pp)." },
        { id: "e1q3", prompt: "The new bridge ___ by next spring.", options: ["will build", "will be built", "will have built"], correctIndex: 1, explanation: "will be built = Future Simple Passive (will + be + pp)." },
        { id: "e1q4", prompt: "Several complaints ___ to the manager this week.", options: ["have made", "have been made", "were made"], correctIndex: 1, explanation: "have been made = Present Perfect Passive." },
        { id: "e1q5", prompt: "The stolen paintings ___ in a warehouse last night.", options: ["were finding", "have been found", "were found"], correctIndex: 2, explanation: "were found = Past Simple Passive (completed last night — specific past time)." },
        { id: "e1q6", prompt: "The decision ___ before the meeting even started.", options: ["had been made", "has been made", "was making"], correctIndex: 0, explanation: "had been made = Past Perfect Passive — before another past event." },
        { id: "e1q7", prompt: "By 2030, the new railway ___ throughout the country.", options: ["will expand", "will be expanded", "will have been expanded"], correctIndex: 2, explanation: "will have been expanded = Future Perfect Passive (will + have + been + pp)." },
        { id: "e1q8", prompt: "A number of errors ___ in the latest report.", options: ["have been found", "have found", "were finding"], correctIndex: 0, explanation: "have been found = Present Perfect Passive." },
        { id: "e1q9", prompt: "The city centre ___ completely since the earthquake.", options: ["has rebuilt", "has been rebuilt", "was rebuilding"], correctIndex: 1, explanation: "has been rebuilt = Present Perfect Passive." },
        { id: "e1q10", prompt: "More than a million tickets ___ before the show even opened.", options: ["have sold", "had been sold", "were selling"], correctIndex: 1, explanation: "had been sold = Past Perfect Passive — before the show opened." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Passive with reporting verbs",
      instructions: "Choose the correct structure with passive reporting verbs (it is said / believed / thought / reported that… OR subject + is said / thought / believed + to-infinitive).",
      questions: [
        { id: "e2q1", prompt: "___ the company is planning to merge with its rival.", options: ["It is said that", "It has said that", "They say"], correctIndex: 0, explanation: "It is said that = formal passive reporting structure." },
        { id: "e2q2", prompt: "The suspect ___ the city on the night of the robbery.", options: ["is believed leaving", "is believed to have left", "was believed leaving"], correctIndex: 1, explanation: "is believed to have left = subject + is believed + to have + pp (past event)." },
        { id: "e2q3", prompt: "___ the new treatment reduces recovery time significantly.", options: ["It reports that", "It has been reported that", "It reported that"], correctIndex: 1, explanation: "It has been reported that = Present Perfect Passive reporting structure." },
        { id: "e2q4", prompt: "The CEO ___ considering a restructure of the company.", options: ["is understood to be", "understands to be", "is understood being"], correctIndex: 0, explanation: "is understood to be = subject + passive reporting verb + to-infinitive (present)." },
        { id: "e2q5", prompt: "Several witnesses ___ the attackers fleeing north.", options: ["are reported seeing", "are reported to have seen", "reported to have seen"], correctIndex: 1, explanation: "are reported to have seen = subject + passive + to have + pp." },
        { id: "e2q6", prompt: "___ the Prime Minister will announce new measures tomorrow.", options: ["It expects that", "It is expected that", "They expect that"], correctIndex: 1, explanation: "It is expected that = formal passive reporting. (Note: 'They expect' is active, not passive.)" },
        { id: "e2q7", prompt: "The ancient temple ___ built over 3,000 years ago.", options: ["is thought to have been", "is thought being", "thinks to have been"], correctIndex: 0, explanation: "is thought to have been built = passive reporting + passive infinitive." },
        { id: "e2q8", prompt: "___ the negotiations will continue into next week.", options: ["It is known that", "It knows that", "They know that"], correctIndex: 0, explanation: "It is known that = passive reporting (formal)." },
        { id: "e2q9", prompt: "The missing hiker ___ sheltering in a cave.", options: ["is thought to be", "thinks to be", "is thought being"], correctIndex: 0, explanation: "is thought to be = subject + passive + to-infinitive (present situation)." },
        { id: "e2q10", prompt: "___ the virus originated in a remote region.", options: ["It believed that", "It is believed that", "It was believed"], correctIndex: 1, explanation: "It is believed that = present passive reporting (current belief)." },
      ],
    },
    3: {
      type: "input",
      title: "Exercise 3 (Harder) — Write the advanced passive form",
      instructions: "Transform the active sentence into a passive using the structure given in brackets.",
      questions: [
        { id: "e3q1", prompt: "Active: They have repaired the road. → Passive (Present Perfect Passive): The road ___.", correct: "has been repaired", explanation: "has been repaired = have + been + past participle." },
        { id: "e3q2", prompt: "Active: Someone had stolen the car before we noticed. → Passive (Past Perfect Passive): The car ___ before we noticed.", correct: "had been stolen", explanation: "had been stolen = had + been + past participle." },
        { id: "e3q3", prompt: "Active: They will have completed the tower by 2026. → Passive (Future Perfect Passive): The tower ___ by 2026.", correct: "will have been completed", explanation: "will have been completed = will + have + been + past participle." },
        { id: "e3q4", prompt: "People believe that she is hiding something. → (It is…): It ___ she is hiding something.", correct: "is believed that", explanation: "It is believed that = passive reporting verb structure." },
        { id: "e3q5", prompt: "People say that he stole the money. → (He is…): He ___ the money.", correct: "is said to have stolen", explanation: "is said to have stolen = subject + is said + to have + pp." },
        { id: "e3q6", prompt: "Reports claim that the fire started in the kitchen. → (It has been…): It ___ the fire started in the kitchen.", correct: "has been reported that", explanation: "has been reported that = Present Perfect Passive reporting." },
        { id: "e3q7", prompt: "Everyone knows that the law will change. → (It is…): It ___ the law will change.", correct: "is known that", explanation: "It is known that = passive reporting." },
        { id: "e3q8", prompt: "Experts think the painting dates from the 15th century. → (The painting is…): The painting ___ from the 15th century.", correct: "is thought to date", explanation: "is thought to date = subject + is thought + to-infinitive (present)." },
        { id: "e3q9", prompt: "They are expected to announce the winner tonight. → (It is…): It ___ the winner will be announced tonight.", correct: "is expected that", explanation: "It is expected that = passive reporting." },
        { id: "e3q10", prompt: "Scientists believe he discovered the vaccine in 1985. → (He is…): He ___ the vaccine in 1985.", correct: "is believed to have discovered", explanation: "is believed to have discovered = subject + is believed + to have + pp (past event)." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Mixed advanced passive",
      instructions: "Write the correct advanced passive form. Mix of perfect passives and reporting structures.",
      questions: [
        { id: "e4q1", prompt: "Active: Workers have built three new hospitals this year. → Passive: Three new hospitals ___ this year.", correct: "have been built", explanation: "have been built = Present Perfect Passive." },
        { id: "e4q2", prompt: "It ___ the suspect left the country the same night.", correct: "has been reported that", explanation: "has been reported that = Present Perfect Passive reporting." },
        { id: "e4q3", prompt: "The ancient city ___ to have been destroyed by a volcanic eruption.", correct: "is believed", explanation: "is believed to have been = passive reporting + passive infinitive (past)." },
        { id: "e4q4", prompt: "By the time we arrived, all the evidence ___.", correct: "had been destroyed", explanation: "had been destroyed = Past Perfect Passive." },
        { id: "e4q5", prompt: "The president ___ to be planning a major announcement.", correct: "is said", explanation: "is said to be = subject + is said + to-infinitive (present activity)." },
        { id: "e4q6", prompt: "It ___ that over 200 species have been affected by the pollution.", correct: "is estimated that", explanation: "is estimated that = passive reporting structure." },
        { id: "e4q7", prompt: "Active: They will have delivered all packages by Friday. → Passive: All packages ___ by Friday.", correct: "will have been delivered", explanation: "will have been delivered = Future Perfect Passive." },
        { id: "e4q8", prompt: "He ___ to have committed the fraud over a period of five years.", correct: "is alleged", explanation: "is alleged to have committed = passive reporting + to have + pp." },
        { id: "e4q9", prompt: "Several new treatments for the disease ___. Doctors are optimistic.", correct: "have been developed", explanation: "have been developed = Present Perfect Passive." },
        { id: "e4q10", prompt: "It ___ the explosion was caused by a gas leak.", correct: "is thought that", explanation: "is thought that = passive reporting (It is thought that)." },
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
        <a className="hover:text-slate-900 transition" href="/grammar/b2">Grammar B2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Passive Voice: Advanced</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Passive Voice:{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Advanced</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        At B2 level, the passive voice extends to <b>perfect tenses</b> (has/have been done, had been done, will have been done) and <b>reporting structures</b> used in news and formal writing: <i>It is believed that… / She is thought to have left…</i>
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24">
          {isPro ? (
            <SpeedRound gameId="grammar-b2-passive-advanced" subject="Advanced Passive" questions={SPEED_QUESTIONS} variant="sidebar" />
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
                  {current.type === "mcq" ? (
                    current.questions.map((q, idx) => {
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
                    })
                  ) : (
                    current.questions.map((q, idx) => {
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
                                <input value={val} disabled={checked} onChange={(e) => setInputAnswers((p) => ({ ...p, [q.id]: e.target.value }))} placeholder="Type here…" className="w-full max-w-sm rounded-xl border border-black/10 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F5DA20]" />
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
                    })
                  )}
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
                      <div className="mt-2 text-xs text-slate-500">
                        {score.percent >= 80 ? "Excellent! You can move to the next exercise." : score.percent >= 50 ? "Good effort! Try once more to improve your score." : "Keep practising — review the Explanation tab and try again."}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : <Explanation />}
          </div>
        </section>

        {isPro ? (
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/b2" allLabel="All B2 topics" />
        ) : (
          <AdUnit variant="sidebar-dark" />

        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-b2-passive-advanced" subject="Advanced Passive" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B2 topics</a>
        <a href="/grammar/b2/causative" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Causative →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Passive Voice: Advanced (B2)</h2>
      <p>At B2 level you need to use the passive across all tenses, and master <b>passive with reporting verbs</b> — structures common in news, academic texts, and formal writing.</p>

      <h3>Perfect Passive Forms</h3>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5">
        <div className="space-y-3">
          {[
            { tense: "Present Perfect Passive", form: "has / have been + pp", ex: "The bridge has been repaired." },
            { tense: "Past Perfect Passive", form: "had been + pp", ex: "The evidence had been destroyed before we arrived." },
            { tense: "Future Simple Passive", form: "will be + pp", ex: "The results will be announced tomorrow." },
            { tense: "Future Perfect Passive", form: "will have been + pp", ex: "By 2030, the law will have been changed." },
          ].map(({ tense, form, ex }) => (
            <div key={tense} className="grid grid-cols-[1fr_1fr] gap-2 rounded-xl border border-black/10 bg-slate-50 p-3 text-sm">
              <div>
                <div className="font-bold text-orange-700">{tense}</div>
                <div className="font-mono text-slate-600 mt-0.5">{form}</div>
              </div>
              <div className="italic text-slate-700 self-center">{ex}</div>
            </div>
          ))}
        </div>
      </div>

      <h3>Passive Reporting Verbs</h3>
      <p>Used in news and formal writing to report what people say, believe, or think — without naming the source.</p>
      <div className="not-prose rounded-2xl border border-black/10 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-xs font-bold text-slate-500 mb-2">STRUCTURE 1: It + passive verb + that-clause</div>
            <div className="space-y-1 text-sm">
              {["It is said that…", "It is believed that…", "It is thought that…", "It is reported that…", "It is expected that…", "It is known that…"].map(s => (
                <div key={s} className="rounded-lg border border-black/10 bg-slate-50 px-3 py-1.5 text-slate-800">{s}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 mb-2">STRUCTURE 2: Subject + passive verb + to-infinitive</div>
            <div className="space-y-2 text-sm">
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-3">
                <div className="font-bold text-orange-700 text-xs mb-1">Present situation</div>
                <div className="italic text-slate-800">He is thought <b>to be</b> hiding.</div>
              </div>
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-3">
                <div className="font-bold text-orange-700 text-xs mb-1">Past event</div>
                <div className="italic text-slate-800">She is believed <b>to have left</b> the country.</div>
              </div>
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-3">
                <div className="font-bold text-orange-700 text-xs mb-1">Past passive event</div>
                <div className="italic text-slate-800">It is thought <b>to have been built</b> in 1850.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800">
          <span className="font-black text-slate-900">💡 Common reporting verbs:</span> say, believe, think, report, know, expect, claim, allege, understand, estimate, consider. They all follow the same two structures above.
        </div>
      </div>
    </div>
  );
}
