"use client";

import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/lib/useProgress";
import AdUnit from "@/components/AdUnit";

type MCQ = { id: string; prompt: string; options: string[]; correctIndex: number; explanation: string };
type InputQ = { id: string; prompt: string; correct: string; explanation: string };
type ExerciseSet =
  | { type: "mcq"; title: string; instructions: string; questions: MCQ[] }
  | { type: "input"; title: string; instructions: string; questions: InputQ[] };

function normalize(s: string) { return s.trim().toLowerCase(); }

export default function FrontingEmphasisLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — Emphatic do/does/did",
      instructions: "The emphatic auxiliary do/does/did adds stress or contrast to an affirmative sentence. Choose the correct emphatic form.",
      questions: [
        { id: "e1q1", prompt: "\"You never listen to me.\" \"I ___ listen — you just don't notice!\"", options: ["do", "am", "did"], correctIndex: 0, explanation: "Emphatic 'do' + bare infinitive for present simple: I DO listen." },
        { id: "e1q2", prompt: "\"She doesn't care about the project.\" \"She ___ care — she's been working on it all weekend.\"", options: ["is", "does", "did"], correctIndex: 1, explanation: "Emphatic 'does' for third person singular present: She DOES care." },
        { id: "e1q3", prompt: "\"He didn't apologise.\" \"He ___ apologise — I heard him myself.\"", options: ["does", "did", "do"], correctIndex: 1, explanation: "Emphatic 'did' for past tense: He DID apologise." },
        { id: "e1q4", prompt: "I know it's late, but I ___ want to finish this tonight.", options: ["do", "am", "have"], correctIndex: 0, explanation: "Emphatic 'do' adds emphasis to want: I DO want to." },
        { id: "e1q5", prompt: "She rarely complains, but she ___ find the commute exhausting.", options: ["does", "is", "has"], correctIndex: 0, explanation: "Emphatic 'does' + bare infinitive: she DOES find it exhausting." },
        { id: "e1q6", prompt: "We tried to warn them. We ___ try — they simply refused to listen.", options: ["did", "do", "have"], correctIndex: 0, explanation: "Emphatic 'did' + bare infinitive (past): We DID try." },
        { id: "e1q7", prompt: "\"You've never met her.\" \"I ___ meet her — at the conference last year.\"", options: ["did", "do", "have"], correctIndex: 0, explanation: "Emphatic 'did' refers to a specific past event: I DID meet her." },
        { id: "e1q8", prompt: "I must admit, he ___ make a compelling argument.", options: ["does", "is", "has"], correctIndex: 0, explanation: "Emphatic 'does' = I concede he makes a strong argument." },
        { id: "e1q9", prompt: "\"You forgot to lock the door.\" \"I ___ lock it — I remember clearly.\"", options: ["do", "did", "have"], correctIndex: 1, explanation: "Past action → emphatic 'did' + bare infinitive." },
        { id: "e1q10", prompt: "Although he rarely shows it, he ___ love his family deeply.", options: ["does", "is", "has"], correctIndex: 0, explanation: "Emphatic 'does' with present meaning: concession + emphasis." },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — Fronted adverbials & object fronting",
      instructions: "Fronting moves an element to the start of a sentence for emphasis. Note: fronting an adverb/adverbial does NOT always require inversion; fronting a negative adverbial DOES. Choose the correct form.",
      questions: [
        { id: "e2q1", prompt: "___ did I realise how serious the situation was. (only then)", options: ["Only then", "Only then I", "Then only"], correctIndex: 0, explanation: "Only then + subject-auxiliary inversion: Only then DID I realise." },
        { id: "e2q2", prompt: "His honesty ___ admire. (that quality — object fronting)", options: ["I do", "do I", "I truly"], correctIndex: 0, explanation: "Object fronting: 'His honesty I do admire' — the object is fronted but no inversion is required." },
        { id: "e2q3", prompt: "___ the proposal was met with enthusiasm. (surprisingly)", options: ["Surprising,", "Surprisingly,", "Surprised,"], correctIndex: 1, explanation: "Fronted adverb: 'Surprisingly, the proposal was met…' — no inversion needed after a manner adverb." },
        { id: "e2q4", prompt: "___ stood a magnificent oak tree. (at the top of the hill)", options: ["At the top of the hill", "There at the top", "On the top of the hill there"], correctIndex: 0, explanation: "Locative fronting: 'At the top of the hill stood…' — inversion (subject-verb) after fronted place expression." },
        { id: "e2q5", prompt: "The patience required for this job — that ___ underestimated.", options: ["is what most people", "most people", "most people do"], correctIndex: 1, explanation: "Topicalisation: 'The patience… — that most people underestimate.' The fronted element is followed by a pronoun + clause." },
        { id: "e2q6", prompt: "___ would I betray my principles for money. (under no circumstances)", options: ["Under no circumstances I", "Under no circumstances", "Under no circumstances would"], correctIndex: 2, explanation: "Under no circumstances + auxiliary-subject inversion: would I." },
        { id: "e2q7", prompt: "___ the palace, surrounded by formal gardens. (beyond the gate)", options: ["Lay beyond the gate", "Beyond the gate lay", "Beyond the gate lied"], correctIndex: 1, explanation: "Locative fronting + inversion: 'Beyond the gate lay the palace' (lay = past of lie, intransitive)." },
        { id: "e2q8", prompt: "___ I spoke to the director. (not once during the entire project)", options: ["Not once during the entire project", "Not once did I speak", "Not once during the entire project did"], correctIndex: 2, explanation: "Not once + fronted adverbial + inversion: 'Not once during the entire project did I speak to the director.'" },
        { id: "e2q9", prompt: "The design of the building, its symmetry, its scale — all ___ impressed.", options: ["of it deeply", "deeply", "of this has"], correctIndex: 1, explanation: "Fronted list followed by 'all deeply impressed' — the fronted elements are summarised by 'all'." },
        { id: "e2q10", prompt: "___ in the doorway stood an elderly man in a dark coat.", options: ["There", "Here", "Silently"], correctIndex: 2, explanation: "'Silently in the doorway stood an elderly man' = fronted adverb of manner + locative + inversion (literary style)." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Cleft sentences for emphasis",
      instructions: "It-clefts (It was X that/who…) and wh-clefts (What I need is…) isolate one element for emphasis. Choose the correct cleft form.",
      questions: [
        { id: "e3q1", prompt: "___ that finally convinced the committee. (the new evidence)", options: ["It was the new evidence", "What was the new evidence", "The new evidence it was"], correctIndex: 0, explanation: "It-cleft: It was + focused element + that + clause." },
        { id: "e3q2", prompt: "___ is more investment in public transport. (what this city needs)", options: ["What this city needs", "It is what this city needs", "That this city needs"], correctIndex: 0, explanation: "Wh-cleft: What + subject clause + is + focused element." },
        { id: "e3q3", prompt: "It was ___ who reported the irregularities, not the auditors.", options: ["the internal staff", "the internal staff that", "the internal staff which"], correctIndex: 0, explanation: "It-cleft with who: It was + person + who (not 'that' or 'which' for people, though 'that' is also acceptable)." },
        { id: "e3q4", prompt: "What surprised us most ___ how quickly the situation escalated.", options: ["it was", "was", "is that"], correctIndex: 1, explanation: "Wh-cleft: What surprised us most + was + that-clause or noun phrase." },
        { id: "e3q5", prompt: "It's not ___ that bothers me — it's the lack of communication.", options: ["the decision itself", "the decision itself which", "that the decision itself"], correctIndex: 0, explanation: "It-cleft with contrast: It's not X that… it's Y. No second relative pronoun needed before the focused noun." },
        { id: "e3q6", prompt: "All ___ is a clear explanation. (the thing I want)", options: ["that I want", "I want", "what I want"], correctIndex: 0, explanation: "All-cleft: All + that + subject + need/want + is + focused element." },
        { id: "e3q7", prompt: "___ I regret most is not spending more time with my family.", options: ["It is what", "That", "What"], correctIndex: 2, explanation: "Wh-cleft: What I regret most is… (not 'That' as the subject of a cleft)." },
        { id: "e3q8", prompt: "It was ___ that the treaty was finally signed. (in 1648)", options: ["in 1648", "at 1648", "on 1648"], correctIndex: 0, explanation: "It-cleft focusing on time: It was + in 1648 + that + clause." },
        { id: "e3q9", prompt: "___ I really want to do is take a long holiday.", options: ["What", "It is what", "That which"], correctIndex: 0, explanation: "Wh-cleft: What I really want to do is…" },
        { id: "e3q10", prompt: "It was ___ he insulted that caused the scandal, not what he said.", options: ["who", "whom", "Both are correct"], correctIndex: 2, explanation: "Both 'who' and 'whom' are acceptable after the focused person in an it-cleft. 'Whom' is more formal." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Rewrite using the structure in brackets",
      instructions: "Rewrite each sentence using fronting, emphatic do, or a cleft structure as shown. Write the full rewritten sentence (lowercase).",
      questions: [
        { id: "e4q1", prompt: "I really do enjoy travelling. (emphatic do — add stress)", correct: "i do enjoy travelling", explanation: "Emphatic do: I DO enjoy travelling — stresses the verb." },
        { id: "e4q2", prompt: "The music was outstanding. That's what I loved most about the concert. (wh-cleft)", correct: "what i loved most about the concert was the music", explanation: "Wh-cleft: What I loved most about the concert was + focused element." },
        { id: "e4q3", prompt: "The report was on the table. (locative fronting)", correct: "on the table was the report", explanation: "Fronted locative + inversion: On the table was the report." },
        { id: "e4q4", prompt: "She told me the truth eventually. (it-cleft, focus on 'eventually')", correct: "it was eventually that she told me the truth", explanation: "It-cleft focusing on the time adverb: It was eventually that…" },
        { id: "e4q5", prompt: "He finally understood the gravity of the situation after the meeting. (only after the meeting — fronting)", correct: "only after the meeting did he finally understand the gravity of the situation", explanation: "Only after + fronted element + inversion: did he finally understand." },
        { id: "e4q6", prompt: "I've never seen such dedication before. (never — fronting with inversion)", correct: "never before have i seen such dedication", explanation: "Never before + have + subject + past participle = inversion." },
        { id: "e4q7", prompt: "The persistent rain ruined the harvest. That's what caused the shortage. (it-cleft, focus on the subject)", correct: "it was the persistent rain that ruined the harvest and caused the shortage", explanation: "It-cleft: It was + cause + that + result clause." },
        { id: "e4q8", prompt: "I want an honest answer. Nothing else. (all-cleft)", correct: "all i want is an honest answer", explanation: "All-cleft: All + subject + want + is + focused element." },
        { id: "e4q9", prompt: "A tall figure in a long coat appeared at the gate. (locative fronting — 'at the gate')", correct: "at the gate appeared a tall figure in a long coat", explanation: "Locative fronting + inversion: At the gate appeared + subject." },
        { id: "e4q10", prompt: "He did apologise eventually, but she still wasn't satisfied. (emphatic did)", correct: "he did apologise eventually, but she still wasn't satisfied", explanation: "Emphatic did: He DID apologise — the sentence is already correct but stress is on 'did'." },
      ],
    },
  }), []);

  const current = sets[exNo];

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
        <span className="text-slate-700 font-medium">Fronting &amp; Emphasis</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Fronting &amp;{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Emphasis</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 border border-cyan-200">C1</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        English uses several devices to highlight key information: <b>emphatic do/does/did</b> (<i>I DO care</i>), <b>fronting</b> (moving an element to sentence-initial position: <i>On the table lay the answer</i>), and <b>cleft sentences</b> (<i>It was the rain that ruined it / What I need is time</i>). These structures are common in formal writing, speeches, and literary prose.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">
        <AdUnit variant="sidebar-dark" />

        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3">
            <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
            <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Explanation</button>
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
                            <div className="font-bold text-slate-900 whitespace-pre-line">{q.prompt}</div>
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

        <AdUnit variant="sidebar-dark" />
      </div>

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/c1" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All C1 topics</a>
        <a href="/grammar/c1/advanced-inversion" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">Next: Advanced Inversion →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Fronting &amp; Emphasis (C1)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          { title: "Emphatic do/does/did", body: "Add do/does/did before a main verb in an affirmative sentence to add stress, contradict, or concede.", ex: "I DO care. / She DOES listen. / We DID warn them. / He did eventually apologise." },
          { title: "Locative fronting + inversion", body: "Front a place expression; invert subject and intransitive verb (literary/formal).", ex: "At the top of the hill stood a lighthouse. / Beyond the gate lay the palace gardens." },
          { title: "Object fronting (topicalisation)", body: "Move the object to sentence-initial position for emphasis. No inversion required.", ex: "His honesty I truly admire. / That decision I will never understand." },
          { title: "Negative adverbial fronting + inversion", body: "Negative/restrictive adverbials at the start REQUIRE subject-auxiliary inversion.", ex: "Not once did I see him hesitate. / Never before have I witnessed such courage. / Only then did she realise." },
          { title: "It-cleft: It was X that/who…", body: "Isolate any sentence element (subject, object, adverb) for focus.", ex: "It was the CEO who resigned. / It was in 1969 that humans first walked on the moon. / It was the noise that woke me." },
          { title: "Wh-cleft: What + clause + be + focused element", body: "Focus on a noun phrase or clause; subject = what-clause.", ex: "What I need is more time. / What surprised us most was the speed of the response." },
          { title: "All-cleft: All + that + clause + be…", body: "Restricts focus to one thing only.", ex: "All I want is the truth. / All that remains is to sign the papers." },
        ].map(({ title, body, ex }) => (
          <div key={title} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="font-black text-cyan-700 text-sm mb-1">{title}</div>
            <div className="text-slate-600 text-sm mb-2">{body}</div>
            <div className="italic text-slate-700 text-sm">{ex}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-cyan-50 p-5">
        <div className="text-sm font-black text-slate-800 mb-2">Key rule: inversion or not?</div>
        <div className="text-sm text-slate-700 space-y-1">
          <div><b>Fronted negative/restrictive adverbials</b> (Never, Not once, Only then, Under no circumstances, Rarely) → ALWAYS invert: <i>Never have I…</i></div>
          <div><b>Fronted place/direction expressions</b> + intransitive verb → invert: <i>Here comes the train.</i></div>
          <div><b>Fronted objects or adjective complements</b> → NO inversion: <i>His honesty I admire.</i></div>
        </div>
      </div>
    </div>
  );
}
