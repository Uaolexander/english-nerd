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
  { q: "Reported speech: 'I am tired' → ?", options: ["She said she am tired", "She said she was tired", "She said she is tired", "She said she been tired"], answer: 1 },
  { q: "Tense backshift: present → ?", options: ["Future", "Past", "Present perfect", "No change"], answer: 1 },
  { q: "'I have finished' → reported is?", options: ["She said she has finished", "She said she had finished", "She said she finished", "She said she would finish"], answer: 1 },
  { q: "'I will help you' → reported is?", options: ["She said she will help me", "She said she would help me", "She said she helps me", "She said she helped me"], answer: 1 },
  { q: "'Could you help me?' → reported question?", options: ["She asked could I help her", "She asked if I could help her", "She asked me could help her", "She asked whether help her"], answer: 1 },
  { q: "Reporting a command: 'Leave!' → ?", options: ["He said to leave", "He told me leave", "He told me to leave", "He said leaving"], answer: 2 },
  { q: "Reporting a request: 'Please wait' → ?", options: ["He told me to wait", "He asked me to wait", "He said me to wait", "He requested I waited"], answer: 1 },
  { q: "Which verb reports a refusal?", options: ["asked", "denied", "refused", "wondered"], answer: 2 },
  { q: "'I didn't do it' → reported denial?", options: ["She said she didn't do it", "She denied having done it", "She denied to do it", "She refused having done it"], answer: 1 },
  { q: "Reporting a suggestion: 'Why don't we go?' → ?", options: ["She said why don't we go", "She suggested going", "She suggested to go", "She asked to go"], answer: 1 },
  { q: "Tense backshift: 'was doing' → ?", options: ["had been doing", "was doing", "is doing", "would do"], answer: 0 },
  { q: "Tense backshift: 'had done' → ?", options: ["has done", "had done (no change)", "did", "would have done"], answer: 1 },
  { q: "'She told me ___' — what follows?", options: ["to do it (command)", "that she do it", "she does it", "do it"], answer: 0 },
  { q: "Reporting 'I might go' → ?", options: ["He said he may go", "He said he might go (no change)", "He said he could go", "He said he went"], answer: 1 },
  { q: "'Where do you live?' → reported question?", options: ["She asked where do I live", "She asked where I lived", "She asked where I live", "She asked where did I live"], answer: 1 },
  { q: "Reporting a complaint: 'You never listen!' → ?", options: ["She said I always listen", "She complained that I never listened", "She complained I didn't listen never", "She said I never listened always"], answer: 1 },
  { q: "When does tense NOT shift?", options: ["Always shifts", "When reporting general/still true facts", "When reporting questions", "When using 'told'"], answer: 1 },
  { q: "Reporting 'Don't touch that' → ?", options: ["She said not touch that", "She told me not to touch that", "She asked not touching that", "She warned don't touch"], answer: 1 },
  { q: "'Are you coming?' → reported?", options: ["She asked was I coming", "She asked if I was coming", "She asked am I coming", "She asked whether coming"], answer: 1 },
  { q: "Which verb reports an accusation?", options: ["suggested", "admitted", "accused (someone of)", "denied"], answer: 2 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Advanced Reported Speech",
  subtitle: "Backshift, reporting verbs, questions",
  level: "B2",
  keyRule: "Shift tenses back; use correct reporting verb + infinitive or gerund.",
  exercises: [
    {
      number: 1,
      title: "Backshift the tense",
      difficulty: "easy" as const,
      instruction: "Report the statement using correct backshift.",
      questions: [
        "'I am tired.' She said she ___.",
        "'I work here.' He said he ___.",
        "'We have finished.' They said they ___.",
        "'It will rain.' She said it ___.",
        "'I was waiting.' He said he ___.",
        "'I can help.' She said she ___.",
        "'I didn't sleep.' He said he ___.",
        "'She may leave.' He said she ___.",
        "'We are going.' They said they ___.",
        "'I have been working.' She said she ___.",
      ],
    },
    {
      number: 2,
      title: "Report the question",
      difficulty: "medium" as const,
      instruction: "Change the direct question to reported speech.",
      questions: [
        "'Where do you live?' She asked ___.",
        "'Are you coming?' He asked ___.",
        "'Have you eaten?' She wanted to know ___.",
        "'What time did it start?' He asked ___.",
        "'Did she call you?' She asked ___.",
        "'Why are you crying?' He asked ___.",
        "'Can you drive?' She asked ___.",
        "'What will you do?' He asked ___.",
        "'Who broke the window?' She asked ___.",
        "'How long have you waited?' He asked ___.",
      ],
    },
    {
      number: 3,
      title: "Choose the reporting verb",
      difficulty: "hard" as const,
      instruction: "Choose the best reporting verb.",
      questions: [
        "'I'll do it later.' He ___ to do it later.",
        "'Don't touch that!' She ___ me not to touch it.",
        "'I didn't steal it.' He ___ stealing it.",
        "'Why don't we go for a walk?' She ___ going.",
        "'I'm sorry I was late.' She ___ being late.",
        "'You never listen!' She ___ I never listened.",
        "'Could you open the window?' He ___ me to open it.",
        "'You lied to me!' She ___ him of lying.",
        "'I'll definitely be there.' He ___ to be there.",
        "'Let's start.' She ___ starting.",
      ],
    },
    {
      number: 4,
      title: "Full reported speech practice",
      difficulty: "hard" as const,
      instruction: "Report the sentence fully.",
      questions: [
        "'I have never been to Rome.' She said ___.",
        "'Leave immediately!' He told me ___.",
        "'Are you free tomorrow?' She asked me ___.",
        "'I might come to the party.' He said ___.",
        "'We didn't know the answer.' They said ___.",
        "'Please don't make noise.' She asked me ___.",
        "'I was working all night.' He explained ___.",
        "'Stop complaining!' She told him ___.",
        "'Have you met her before?' He asked ___.",
        "'I'll never do that again.' She promised ___.",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Backshifted statements", answers: ["was tired", "worked there", "had finished", "would rain", "had been waiting", "could help", "hadn't slept", "might leave", "were going", "had been working"] },
    { exercise: 2, subtitle: "Reported questions", answers: ["where I lived", "if/whether I was coming", "if/whether I had eaten", "what time it had started", "if/whether she had called me", "why I was crying", "if/whether I could drive", "what I would do", "who had broken the window", "how long I had waited"] },
    { exercise: 3, subtitle: "Reporting verbs", answers: ["promised", "warned/told", "denied", "suggested", "apologised for", "complained that", "asked/requested", "accused", "promised", "suggested"] },
    { exercise: 4, subtitle: "Full reported speech", answers: ["she had never been to Rome", "to leave immediately", "if/whether I was free the next day", "he might come to the party", "they hadn't known the answer", "not to make noise", "that he had been working all night", "to stop complaining", "if/whether I had met her before", "never to do that again"] },
  ],
};

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

const RECOMMENDATIONS: GrammarRec[] = [
  { title: "Advanced Relative Clauses", href: "/grammar/b2/relative-clauses-advanced", level: "B2", badge: "bg-orange-500", reason: "Complex clause structures build on reported speech" },
  { title: "Advanced Passive", href: "/grammar/b2/passive-advanced", level: "B2", badge: "bg-orange-500", reason: "Passive voice frequently appears in reported speech" },
  { title: "Cleft Sentences", href: "/grammar/b2/cleft-sentences", level: "B2", badge: "bg-orange-500" },
];

export default function ReportedSpeechAdvancedLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});
  const [pdfLoading, setPdfLoading] = useState(false);

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Reporting verbs: choose the right pattern",
      instructions: "Choose the correct reporting verb pattern. Focus on the structure after the verb: + to-infinitive, + gerund, or + that-clause.",
      questions: [
        { id: "e1q1", prompt: "\"You should see a doctor,\" she said to me. → She ___ me to see a doctor.", options: ["suggested", "advised", "told"], correctIndex: 1, explanation: "advise + object + to-infinitive: advised me to see." },
        { id: "e1q2", prompt: "\"I'll help you with the report,\" he said. → He ___ to help me.", options: ["offered", "suggested", "admitted"], correctIndex: 0, explanation: "offer + to-infinitive: offered to help." },
        { id: "e1q3", prompt: "\"Let's go for a walk,\" she said. → She ___ going for a walk.", options: ["told", "suggested", "offered"], correctIndex: 1, explanation: "suggest + gerund: suggested going." },
        { id: "e1q4", prompt: "\"Don't touch that!\" he said to the child. → He ___ the child not to touch it.", options: ["warned", "suggested", "admitted"], correctIndex: 0, explanation: "warn + object + not to-infinitive: warned the child not to." },
        { id: "e1q5", prompt: "\"I stole the money,\" she said. → She ___ stealing the money.", options: ["denied", "admitted", "offered"], correctIndex: 1, explanation: "admit + gerund: admitted stealing." },
        { id: "e1q6", prompt: "\"I didn't take the file,\" he said. → He ___ taking the file.", options: ["admitted", "denied", "warned"], correctIndex: 1, explanation: "deny + gerund: denied taking." },
        { id: "e1q7", prompt: "\"Please don't leave!\" she said. → She ___ him not to leave.", options: ["suggested", "urged", "offered"], correctIndex: 1, explanation: "urge + object + not to-infinitive: urged him not to leave." },
        { id: "e1q8", prompt: "\"You broke my vase!\" she said to him. → She ___ him of breaking her vase.", options: ["denied", "warned", "accused"], correctIndex: 2, explanation: "accuse + object + of + gerund: accused him of breaking." },
        { id: "e1q9", prompt: "\"I'm sorry I was rude,\" he said. → He ___ being rude.", options: ["suggested", "denied", "apologised for"], correctIndex: 2, explanation: "apologise for + gerund: apologised for being." },
        { id: "e1q10", prompt: "\"You must submit the form by Friday,\" she said. → She ___ me to submit the form by Friday.", options: ["warned", "reminded", "offered"], correctIndex: 1, explanation: "remind + object + to-infinitive: reminded me to submit." },
      ],
    },
    2: {
      type: "input",
      title: "Exercise 2 (Medium) — Report the sentence using the verb in brackets",
      instructions: "Rewrite as reported speech using the reporting verb given. Write only the reported clause (starting from the reporting verb).",
      questions: [
        { id: "e2q1", prompt: "\"You should apply for the scholarship,\" my teacher said to me. (encourage)", correct: "encouraged me to apply for the scholarship", explanation: "encourage + object + to-infinitive." },
        { id: "e2q2", prompt: "\"Let's order takeaway tonight,\" she said. (suggest)", correct: "suggested ordering takeaway that night", explanation: "suggest + gerund; 'tonight' → 'that night'." },
        { id: "e2q3", prompt: "\"I didn't cheat in the exam,\" he said. (deny)", correct: "denied cheating in the exam", explanation: "deny + gerund." },
        { id: "e2q4", prompt: "\"Don't sign anything before reading it,\" the lawyer said to her. (warn)", correct: "warned her not to sign anything before reading it", explanation: "warn + object + not to-infinitive." },
        { id: "e2q5", prompt: "\"I broke the window,\" the boy said. (admit)", correct: "admitted breaking the window", explanation: "admit + gerund." },
        { id: "e2q6", prompt: "\"You stole my idea!\" she said to him. (accuse)", correct: "accused him of stealing her idea", explanation: "accuse + object + of + gerund; 'my' → 'her'." },
        { id: "e2q7", prompt: "\"I'll give you a lift to the airport,\" he said. (offer)", correct: "offered to give me a lift to the airport", explanation: "offer + to-infinitive." },
        { id: "e2q8", prompt: "\"Please, please come with us!\" she said to him. (beg)", correct: "begged him to come with them", explanation: "beg + object + to-infinitive; 'us' → 'them'." },
        { id: "e2q9", prompt: "\"I'm sorry I forgot your birthday,\" he said. (apologise for)", correct: "apologised for forgetting her birthday", explanation: "apologise for + gerund." },
        { id: "e2q10", prompt: "\"You really must try the local food,\" she said to us. (urge)", correct: "urged us to try the local food", explanation: "urge + object + to-infinitive." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Impersonal passive reporting",
      instructions: "These sentences use impersonal passive structures: 'It is said that…' / 'He is believed to have…'. Choose the correct form.",
      questions: [
        { id: "e3q1", prompt: "People say he is the richest man in the city. → ___ the richest man in the city.", options: ["It is said he is", "He is said to be", "He said to be"], correctIndex: 1, explanation: "He is said + to-infinitive = impersonal passive with personal subject." },
        { id: "e3q2", prompt: "People believe she discovered the formula first. → ___ the formula first.", options: ["She is believed to have discovered", "It is believed she discovers", "She believed to discover"], correctIndex: 0, explanation: "She is believed + to have + pp = past reference with personal subject." },
        { id: "e3q3", prompt: "People think the company lost millions. → ___ millions.", options: ["The company thinks to lose", "The company is thought to have lost", "It thinks the company lost"], correctIndex: 1, explanation: "The company is thought + to have + pp = impersonal passive (past)." },
        { id: "e3q4", prompt: "People know he was involved in the scandal. → ___ in the scandal.", options: ["He is known to have been involved", "It is known that he involves", "He knows to be involved"], correctIndex: 0, explanation: "He is known + to have been + pp = past passive + personal subject." },
        { id: "e3q5", prompt: "People expect the CEO to resign next week. → ___ next week.", options: ["The CEO is expected to resign", "It expects the CEO resigns", "The CEO expects resigning"], correctIndex: 0, explanation: "The CEO is expected + to-infinitive = impersonal passive with present/future reference." },
        { id: "e3q6", prompt: "People report that there was a fire at the factory. → ___ at the factory.", options: ["It is reported that there was a fire", "There reports a fire", "It reports a fire was"], correctIndex: 0, explanation: "It is reported that + clause = impersonal passive with 'it' subject." },
        { id: "e3q7", prompt: "People believe he has been living abroad for years. → ___ abroad for years.", options: ["He believes to live", "He is believed to have been living", "It believes he lived"], correctIndex: 1, explanation: "He is believed + to have been + -ing = past continuous reference." },
        { id: "e3q8", prompt: "People allege that she accepted a bribe. → ___ a bribe.", options: ["She is alleged to have accepted", "She alleges to accept", "It alleges she accepted"], correctIndex: 0, explanation: "She is alleged + to have + pp = formal impersonal passive (past)." },
        { id: "e3q9", prompt: "People consider him to be the best surgeon in the country. → ___ the best surgeon.", options: ["He considers to be", "He is considered to be", "It considers him be"], correctIndex: 1, explanation: "He is considered + to be = impersonal passive (present reference)." },
        { id: "e3q10", prompt: "People assume that the project will be delayed. → ___ delayed.", options: ["The project is assumed to be", "It assumes the project is", "The project assumes being"], correctIndex: 0, explanation: "The project is assumed + to be = impersonal passive with future reference." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Mixed reporting: write the full reported sentence",
      instructions: "Report each sentence using the verb in brackets. Write the complete reported sentence.",
      questions: [
        { id: "e4q1", prompt: "\"Why don't you take a gap year?\" she said to him. (encourage)", correct: "she encouraged him to take a gap year", explanation: "encourage + object + to-infinitive." },
        { id: "e4q2", prompt: "\"I'll cover your shift on Friday,\" she said. (offer)", correct: "she offered to cover my shift on friday", explanation: "offer + to-infinitive; backshift pronouns." },
        { id: "e4q3", prompt: "\"I didn't spread the rumour,\" he said. (deny)", correct: "he denied spreading the rumour", explanation: "deny + gerund." },
        { id: "e4q4", prompt: "\"You cheated on the test!\" the teacher said to him. (accuse)", correct: "the teacher accused him of cheating on the test", explanation: "accuse + object + of + gerund." },
        { id: "e4q5", prompt: "\"Please don't tell anyone,\" she said to me. (beg)", correct: "she begged me not to tell anyone", explanation: "beg + object + not to-infinitive." },
        { id: "e4q6", prompt: "People say the castle was built in the 12th century. → (It / say)", correct: "it is said that the castle was built in the 12th century", explanation: "It is said that + clause = impersonal passive." },
        { id: "e4q7", prompt: "People believe he escaped through the back door. → (He / believe)", correct: "he is believed to have escaped through the back door", explanation: "He is believed + to have + pp = personal impersonal passive (past)." },
        { id: "e4q8", prompt: "\"I'm sorry for causing so much trouble,\" she said. (apologise for)", correct: "she apologised for causing so much trouble", explanation: "apologise for + gerund." },
        { id: "e4q9", prompt: "\"Don't use your phone while driving!\" the instructor said to her. (warn)", correct: "the instructor warned her not to use her phone while driving", explanation: "warn + object + not to-infinitive." },
        { id: "e4q10", prompt: "People expect her to win the election. → (She / expect)", correct: "she is expected to win the election", explanation: "She is expected + to-infinitive = impersonal passive." },
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
        <span className="text-slate-700 font-medium">Reported Speech: Advanced</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Reported Speech:{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Advanced</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        At B2 level, reported speech goes beyond <i>said/told</i> to include complex reporting verbs: <b>advise, warn, urge, accuse, deny, admit, suggest, offer</b> — each with its own grammatical pattern. You also learn impersonal passive structures: <i>It is said that… / She is believed to have…</i>
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <div className="sticky top-24">
          {isPro ? (
            <SpeedRound gameId="grammar-b2-reported-speech-advanced" subject="Advanced Reported Speech" questions={SPEED_QUESTIONS} variant="sidebar" />
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
          <GrammarRecommended recommendations={RECOMMENDATIONS} allHref="/grammar/b2" allLabel="All B2 topics" />
        ) : (
          <div className="sticky top-24">
            <AdUnit variant="sidebar-dark" />
          </div>
        )}
      </div>

      {!isPro && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
          <div className="hidden lg:block" />
          <SpeedRound gameId="grammar-b2-reported-speech-advanced" subject="Advanced Reported Speech" questions={SPEED_QUESTIONS} />
          <div className="hidden lg:block" />
        </div>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B2 topics</a>
        <a href="/grammar/b2" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">All B2 Topics →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Reported Speech: Advanced (B2)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { verb: "advise + obj + to-inf", ex: "She advised me to see a doctor." },
          { verb: "tell + obj + to-inf", ex: "He told her to wait outside." },
          { verb: "warn + obj + (not) to-inf", ex: "He warned us not to touch the wire." },
          { verb: "urge + obj + to-inf", ex: "She urged him to apply for the grant." },
          { verb: "encourage + obj + to-inf", ex: "My teacher encouraged me to study abroad." },
          { verb: "beg + obj + (not) to-inf", ex: "She begged him not to leave." },
          { verb: "remind + obj + to-inf", ex: "He reminded me to lock the door." },
          { verb: "offer + to-inf", ex: "She offered to help with the project." },
          { verb: "suggest + gerund", ex: "He suggested taking a different route." },
          { verb: "admit + gerund", ex: "She admitted taking the money." },
          { verb: "deny + gerund", ex: "He denied stealing the documents." },
          { verb: "accuse + obj + of + gerund", ex: "She accused him of lying to the board." },
          { verb: "apologise for + gerund", ex: "He apologised for being late." },
        ].map(({ verb, ex }) => (
          <div key={verb} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="font-black text-orange-700 text-sm mb-1">{verb}</div>
            <div className="italic text-slate-700 text-sm">{ex}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm font-black text-slate-800 mb-2">Impersonal passive reporting</div>
        <div className="text-sm text-slate-700 space-y-1">
          <div><b>It is said / believed / thought / reported that + clause</b></div>
          <div><i>It is believed that she left the country.</i></div>
          <div className="mt-2"><b>Subject + is said / believed / thought + to-infinitive (present) or to have + pp (past)</b></div>
          <div><i>She is believed to have left the country.</i></div>
          <div><i>He is said to be the richest man in the city.</i></div>
        </div>
      </div>
    </div>
  );
}
