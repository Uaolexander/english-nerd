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

export default function QuantifiersAdvancedLessonClient() {
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [exNo, setExNo] = useState<1 | 2 | 3 | 4>(1);
  const [checked, setChecked] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number | null>>({});
  const [inputAnswers, setInputAnswers] = useState<Record<string, string>>({});

  const sets: Record<1 | 2 | 3 | 4, ExerciseSet> = useMemo(() => ({
    1: {
      type: "mcq",
      title: "Exercise 1 (Easy) — each, every, both, either, neither",
      instructions: "Choose the correct quantifier. Pay attention to singular/plural verb and the number of items involved.",
      questions: [
        { id: "e1q1", prompt: "___ student in the class passed the exam.", options: ["Every", "Each of", "Both"], correctIndex: 0, explanation: "Every + singular noun = all members of a group (general/collective). Every student." },
        { id: "e1q2", prompt: "___ of the two candidates gave an impressive speech.", options: ["Every", "Both", "Neither"], correctIndex: 1, explanation: "Both = the two together (positive). Both of the candidates." },
        { id: "e1q3", prompt: "___ candidate was interviewed for 30 minutes.", options: ["Each", "Both", "Either"], correctIndex: 0, explanation: "Each = individually, one by one. Each candidate was interviewed." },
        { id: "e1q4", prompt: "I've read ___ of her novels. They were all excellent.", options: ["either", "every", "all"], correctIndex: 2, explanation: "All = the entire group (more than two). All of her novels." },
        { id: "e1q5", prompt: "___ of the two options is acceptable to us.", options: ["Both", "Either", "Every"], correctIndex: 1, explanation: "Either = one or the other (two options, both acceptable). Either option is fine." },
        { id: "e1q6", prompt: "___ of the solutions worked. We had to start again.", options: ["Neither", "Either", "None"], correctIndex: 0, explanation: "Neither = not one and not the other (two options, both rejected). Neither of the solutions." },
        { id: "e1q7", prompt: "She visits her parents ___ weekend.", options: ["each", "every", "both are correct"], correctIndex: 2, explanation: "Both 'each weekend' and 'every weekend' are correct for regular frequency — every is slightly more natural here." },
        { id: "e1q8", prompt: "___ of the three reports contained errors.", options: ["Neither", "None", "Either"], correctIndex: 1, explanation: "None = not any (three or more items). Neither is only for two items." },
        { id: "e1q9", prompt: "The twins looked at ___ other across the room.", options: ["every", "each", "both"], correctIndex: 1, explanation: "Each other = reciprocal pronoun. They looked at each other." },
        { id: "e1q10", prompt: "___ side of the river has its own distinct character.", options: ["Every", "Either", "Both"], correctIndex: 1, explanation: "Either side = each of the two sides individually. (Also: each side = both correct, but either is the classic choice here.)" },
      ],
    },
    2: {
      type: "mcq",
      title: "Exercise 2 (Medium) — all, whole, every, no, none",
      instructions: "Choose the correct quantifier. Focus on the difference between all/whole, every/each, and no/none.",
      questions: [
        { id: "e2q1", prompt: "She spent ___ day in the library.", options: ["all the", "the whole", "both are correct"], correctIndex: 2, explanation: "All the day and the whole day are both correct — both mean 'the entire day'." },
        { id: "e2q2", prompt: "___ the students had submitted their assignments by Friday.", options: ["All of", "Every", "Each of"], correctIndex: 0, explanation: "All of the students = the complete group. Every/each require a singular noun directly after." },
        { id: "e2q3", prompt: "He ate ___ the cake. Nothing was left.", options: ["all", "the whole", "both are correct"], correctIndex: 2, explanation: "He ate all the cake / the whole cake — both natural." },
        { id: "e2q4", prompt: "There is ___ parking near the station.", options: ["no", "none", "neither"], correctIndex: 0, explanation: "No + noun: no parking, no time, no reason. 'None' is a pronoun (no noun after it)." },
        { id: "e2q5", prompt: "I asked five people, but ___ of them knew the answer.", options: ["no", "neither", "none"], correctIndex: 2, explanation: "None of them = not one of the five. 'Neither' is only for two." },
        { id: "e2q6", prompt: "___ time I see her, she looks happier.", options: ["Every", "Each", "All"], correctIndex: 0, explanation: "Every time = each occasion in a sequence. Natural fixed phrase." },
        { id: "e2q7", prompt: "The ___ family attended the funeral.", options: ["all", "every", "whole"], correctIndex: 2, explanation: "The whole family = the entire family unit (whole + singular noun). NOT 'the all family'." },
        { id: "e2q8", prompt: "___ of the budget was spent on marketing.", options: ["All", "Every", "Whole"], correctIndex: 0, explanation: "All of the budget = the entire budget (all of + noun phrase)." },
        { id: "e2q9", prompt: "He has ___ idea what to do.", options: ["no", "none", "not any"], correctIndex: 0, explanation: "No idea = a fixed phrase meaning 'not a clue'. 'None' and 'not any idea' are less idiomatic here." },
        { id: "e2q10", prompt: "___ single seat in the auditorium was taken.", options: ["Every", "All", "Each"], correctIndex: 0, explanation: "Every single = emphatic: not one empty seat. 'Every single' is a common intensifier." },
      ],
    },
    3: {
      type: "mcq",
      title: "Exercise 3 (Harder) — Quantifiers with of, verb agreement, and common errors",
      instructions: "Some questions test verb agreement (singular/plural). Others test 'of' usage or common confusions.",
      questions: [
        { id: "e3q1", prompt: "Each of the students ___ expected to submit a report.", options: ["are", "is", "were"], correctIndex: 1, explanation: "Each of + plural noun → singular verb: each is considered individually." },
        { id: "e3q2", prompt: "Neither of the managers ___ available for comment.", options: ["are", "is", "both are correct"], correctIndex: 2, explanation: "Neither of + plural noun → singular verb in formal English; plural is increasingly accepted in informal speech." },
        { id: "e3q3", prompt: "Both of the reports ___ been reviewed.", options: ["has", "have", "is"], correctIndex: 1, explanation: "Both of + plural noun → plural verb: both reports have been reviewed." },
        { id: "e3q4", prompt: "Every one of the applicants ___ been contacted.", options: ["have", "has", "are"], correctIndex: 1, explanation: "Every one of = formal, emphatic. Singular verb: every one has." },
        { id: "e3q5", prompt: "None of the information ___ accurate.", options: ["were", "is", "are"], correctIndex: 1, explanation: "None of + uncountable noun → singular verb: none of the information is." },
        { id: "e3q6", prompt: "None of the employees ___ satisfied with the new system.", options: ["is", "are", "both are correct"], correctIndex: 2, explanation: "None of + countable plural → both singular (formal) and plural (informal) are accepted." },
        { id: "e3q7", prompt: "'Either of the routes takes about the same time.' Is this correct?", options: ["Yes", "No — should be 'neither'", "No — should be 'both'"], correctIndex: 0, explanation: "Either of the routes = one or the other. With a positive meaning, this is correct." },
        { id: "e3q8", prompt: "She has read ___ the books on the list.", options: ["all of", "every of", "each of"], correctIndex: 0, explanation: "All of the books = the entire list. 'Every of' and 'each of' are NOT followed by 'the' directly — you need all of." },
        { id: "e3q9", prompt: "I need ___ your help and his advice.", options: ["either", "both", "neither"], correctIndex: 1, explanation: "Both X and Y = the two together. Either = one or the other. Neither = not either." },
        { id: "e3q10", prompt: "'Every students must register.' Is this correct?", options: ["Yes", "No — every + singular noun required", "No — should be 'all students'"], correctIndex: 1, explanation: "Every + SINGULAR noun: every student (not students). 'All students' is also correct." },
      ],
    },
    4: {
      type: "input",
      title: "Exercise 4 (Hardest) — Complete with the correct quantifier",
      instructions: "Write the correct quantifier word or phrase (1–3 words). Be precise: check singular/plural verb and whether 'of' is needed.",
      questions: [
        { id: "e4q1", prompt: "___ of the two proposals was accepted. They were both rejected.", correct: "neither", explanation: "Neither of the two = not one and not the other." },
        { id: "e4q2", prompt: "She read ___ single page of the contract before signing.", correct: "every", explanation: "Every single page = emphatic: she read all of it, page by page." },
        { id: "e4q3", prompt: "___ of the students passed — over half failed.", correct: "not all", explanation: "Not all of the students = some did, some didn't." },
        { id: "e4q4", prompt: "I looked in ___ corner of the room but couldn't find it.", correct: "every", explanation: "Every corner = all corners, one by one (exhaustive search)." },
        { id: "e4q5", prompt: "The twins couldn't stop staring at ___ other.", correct: "each", explanation: "Each other = reciprocal pronoun (two people)." },
        { id: "e4q6", prompt: "___ of the advice was useful. I ignored all of it.", correct: "none", explanation: "None of the advice = not any of it (uncountable → singular)." },
        { id: "e4q7", prompt: "They gave ___ guest a personalised welcome card.", correct: "each", explanation: "Each guest = individually, one by one." },
        { id: "e4q8", prompt: "___ sides of the argument have merit.", correct: "both", explanation: "Both sides = the two sides together (positive)." },
        { id: "e4q9", prompt: "___ the team worked overtime to meet the deadline.", correct: "the whole", explanation: "The whole team = every single member of the team (whole + singular noun)." },
        { id: "e4q10", prompt: "You can take ___ road — they both lead to the city centre.", correct: "either", explanation: "Either road = one or the other (both options are acceptable)." },
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
        <a className="hover:text-slate-900 transition" href="/grammar/b2">Grammar B2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Quantifiers: Advanced</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Quantifiers:{" "}
          <span className="whitespace-nowrap rounded-xl bg-[#F5DA20] px-3 py-0.5">Advanced</span>
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700 border border-orange-200">B2</span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        At B2 level, precise quantifier use matters. Learn the differences between <b>each</b> and <b>every</b>, when to use <b>both / either / neither</b>, how <b>all</b> differs from <b>whole</b>, and how quantifiers affect <b>verb agreement</b>.
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

        <AdUnit variant="sidebar-dark" />
      </div>

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/8 pt-8">
        <a href="/grammar/b2" className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-black/5 transition">← All B2 topics</a>
        <a href="/grammar/c1" className="flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-5 py-3 text-sm font-black text-black hover:opacity-90 transition shadow-sm">C1 Grammar →</a>
      </div>
    </div>
  );
}

function Explanation() {
  return (
    <div className="prose max-w-none prose-slate">
      <h2>Quantifiers: Advanced (B2)</h2>
      <div className="not-prose mt-4 space-y-3">
        {[
          {
            q: "each",
            use: "Individual members, one by one. Can be used for two or more.",
            ex: "Each student received a certificate. / Each of the two options has advantages.",
            verb: "Singular verb",
          },
          {
            q: "every",
            use: "All members as a group (3+). Emphasises totality. NOT used for two.",
            ex: "Every student passed. / Every single seat was taken.",
            verb: "Singular verb",
          },
          {
            q: "both",
            use: "The two together (positive). Both = two items, all true.",
            ex: "Both candidates were qualified. / Both of them agreed.",
            verb: "Plural verb",
          },
          {
            q: "either",
            use: "One or the other (two options, both acceptable).",
            ex: "Either route will get you there. / Either of the plans is fine.",
            verb: "Singular verb",
          },
          {
            q: "neither",
            use: "Not one and not the other (two options, both rejected).",
            ex: "Neither candidate was suitable. / Neither of the solutions worked.",
            verb: "Singular verb (formal); plural also accepted",
          },
          {
            q: "all",
            use: "The entire group/amount (2+). All of + noun phrase.",
            ex: "All the students passed. / All of the information was correct.",
            verb: "Plural (countable) / Singular (uncountable)",
          },
          {
            q: "whole",
            use: "The complete unit (singular noun). The whole + singular noun.",
            ex: "The whole team was present. / She spent the whole day there.",
            verb: "Matches the noun",
          },
          {
            q: "none",
            use: "Not any (3+). None of + noun phrase.",
            ex: "None of the answers was correct. / None of the advice helped.",
            verb: "Singular (formal); plural also accepted",
          },
        ].map(({ q, use, ex, verb }) => (
          <div key={q} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-black text-orange-700 text-sm">{q}</span>
              <span className="text-xs text-slate-500">— {use}</span>
            </div>
            <div className="italic text-slate-700 text-sm">{ex}</div>
            <div className="mt-1 text-xs text-slate-400">{verb}</div>
          </div>
        ))}
      </div>
      <div className="not-prose mt-4 rounded-2xl border border-black/10 bg-[#F5DA20]/25 p-5">
        <div className="text-sm text-slate-800 space-y-1">
          <div><span className="font-black">each vs every:</span> <i>each</i> = individually (one by one); <i>every</i> = as a collective total. Both take singular nouns and singular verbs.</div>
          <div><span className="font-black">no vs none:</span> <i>no</i> + noun (<i>no money</i>); <i>none</i> alone or <i>none of</i> + noun phrase (<i>none of the money</i>).</div>
          <div><span className="font-black">either / neither</span> = only for two items. For three or more use <i>any / none</i>.</div>
        </div>
      </div>
    </div>
  );
}
