"use client";

import { useState, useEffect, useRef } from "react";

const TRANSCRIPT: { speaker: "I" | "D"; text: string }[] = [
  { speaker: "I", text: "Welcome back to the podcast. Today I'm speaking with Daniel, who recently made a big change in his career. Daniel, thanks for joining us." },
  { speaker: "D", text: "Thanks for having me. Happy to be here." },
  { speaker: "I", text: "So, tell us — why did you leave your previous job? Was it simply that you were bored?" },
  { speaker: "D", text: "No, not at all. I was actually very engaged with the work itself. The reason I left was burnout. I was completely exhausted — mentally and physically." },
  { speaker: "I", text: "How many hours were you working back then?" },
  { speaker: "D", text: "On a typical day, I'd be working eleven or twelve hours. Some days even longer. And that was just the office part." },
  { speaker: "I", text: "Was it purely the number of hours, then?" },
  { speaker: "D", text: "No, that wasn't the only issue. The culture itself was toxic. My boss would text me late at night — sometimes at eleven o'clock — and there was an unspoken expectation that you had to respond quickly." },
  { speaker: "I", text: "Did you ever try to push back — set some boundaries?" },
  { speaker: "D", text: "I tried. But it never worked. In that company, how fast you replied was seen as proof of how dedicated you were. If you didn't reply within twenty minutes, people noticed." },
  { speaker: "I", text: "So how long did you stay before deciding to quit?" },
  { speaker: "D", text: "Longer than I should have. I didn't make a snap decision. I spent several months in therapy, tried different strategies to cope, and only after all that did I finally hand in my notice." },
  { speaker: "I", text: "And where did you end up?" },
  { speaker: "D", text: "I joined a much smaller company — around twenty people. The difference is enormous." },
  { speaker: "I", text: "In what way?" },
  { speaker: "D", text: "When I close my laptop at six o'clock, that's it. No emails, no messages. Nobody expects me to be available in the evening. I leave my phone in my bag after work." },
  { speaker: "I", text: "And how has your personal life changed?" },
  { speaker: "D", text: "Completely. I exercise regularly now — running three or four times a week. I cook proper meals. I spend quality time with my family. Things that just weren't possible before. I feel like I've reclaimed my life." },
  { speaker: "I", text: "Any advice for listeners who are struggling with the same thing?" },
  { speaker: "D", text: "Don't wait as long as I did. Your job should work around your life, not the other way around. And if a company's culture makes healthy boundaries impossible, no salary is worth it." },
];

const QUESTIONS = [
  { id: 1, text: "Daniel left his job mainly because he was bored.", answer: false },
  { id: 2, text: "He used to work more than 10 hours a day.", answer: true },
  { id: 3, text: "The main problem was only the amount of work.", answer: false },
  { id: 4, text: "His boss sometimes contacted him late at night.", answer: true },
  { id: 5, text: "Daniel successfully set clear boundaries at work.", answer: false },
  { id: 6, text: "In his company, quick replies showed commitment.", answer: true },
  { id: 7, text: "Daniel quit his job immediately after feeling exhausted.", answer: false },
  { id: 8, text: "He found a job in a smaller company.", answer: true },
  { id: 9, text: "In his new job, he still checks emails after work.", answer: false },
  { id: 10, text: "Daniel now has more time for personal activities.", answer: true },
];

const VOCAB = [
  { word: "burnout", pos: "n.", def: "complete mental or physical exhaustion from prolonged stress" },
  { word: "boundary", pos: "n.", def: "a personal limit that protects your time or wellbeing" },
  { word: "commitment", pos: "n.", def: "dedication and loyalty shown through consistent behaviour" },
  { word: "snap decision", pos: "phr.", def: "a choice made instantly, without careful thought" },
  { word: "hand in one's notice", pos: "phr.", def: "to formally resign from a job" },
  { word: "reclaim", pos: "v.", def: "to take back something lost, such as time or freedom" },
];

export default function WorkLifeBalanceClient() {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [checked, setChecked] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  const questionsTopRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLButtonElement>(null);

  const answeredCount = QUESTIONS.filter((q) => answers[q.id] != null).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const correctCount = checked
    ? QUESTIONS.reduce((n, q) => n + (answers[q.id] === q.answer ? 1 : 0), 0)
    : null;
  const percent = correctCount !== null ? Math.round((correctCount / QUESTIONS.length) * 100) : null;

  function pick(id: number, val: boolean) {
    if (checked) return;
    setAnswers((p) => ({ ...p, [id]: val }));
  }

  function scrollToRef(ref: React.RefObject<HTMLElement | null>, offset = 80) {
    if (!ref.current) return;
    const top = ref.current.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function check() {
    if (!allAnswered) return;
    setChecked(true);
    setTimeout(() => scrollToRef(questionsTopRef, 80), 50);
  }

  function reset() {
    setAnswers({});
    setChecked(false);
  }

  useEffect(() => {
    if (!checked || percent === null) return;
    fetch("/api/progress/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "listening", level: "b2", slug: "work-life-balance", exerciseNo: 1, score: percent, questionsTotal: QUESTIONS.length }),
    }).catch(() => {});
  }, [checked, percent]);

  const grade =
    percent === null ? null :
    percent >= 80 ? "great" :
    percent >= 60 ? "ok" : "low";

  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white">

      {/* Background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#F5DA20]/12 blur-[150px]" />
        <div className="absolute top-1/2 -left-40 h-[400px] w-[400px] rounded-full bg-[#F5DA20]/6 blur-[160px]" />
        <div className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-[#0B0B0D] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-white/40">
          {[["Home", "/"], ["Listening", "/listening"], ["B2", "/listening/b2"]].map(([label, href]) => (
            <span key={href} className="flex items-center gap-1.5">
              <a href={href} className="hover:text-white transition">{label}</a>
              <svg className="h-3 w-3 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          ))}
          <span className="text-white/70 font-medium">Work-Life Balance</span>
        </nav>

        {/* Hero */}
        <div className="mt-7">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="rounded-full bg-orange-400 px-3 py-0.5 text-[11px] font-black text-black">B2</span>
            <span className="rounded-full border border-white/15 px-3 py-0.5 text-[11px] font-semibold text-white/40">Dialogue</span>
            <span className="rounded-full border border-white/15 px-3 py-0.5 text-[11px] font-semibold text-white/40">~4 min</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.05]">
            Work-Life <span className="text-[#F5DA20]">Balance</span>
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-white/45 leading-relaxed">
            Daniel talks about burnout, toxic work culture, and how changing jobs gave him his life back.
            Watch the video, then test your comprehension.
          </p>
        </div>

        {/* How-to steps */}
        <div className="mt-7 flex flex-wrap gap-3">
          {[
            { n: "1", label: "Watch the video", sub: "once, without pausing" },
            { n: "2", label: "Answer 10 questions", sub: "True or False" },
            { n: "3", label: "Check your answers", sub: "then read the transcript" },
          ].map(({ n, label, sub }) => (
            <div key={n} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#F5DA20] text-xs font-black text-black">{n}</div>
              <div>
                <div className="text-sm font-bold text-white/85">{label}</div>
                <div className="text-xs text-white/30">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 3-col grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr_240px]">

          {/* Left ad */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/20">Advertisement</p>
              <div className="flex h-[600px] items-center justify-center rounded-2xl border border-white/8 bg-white/3 text-xs text-white/15">
                300 × 600
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="min-w-0 space-y-5">

            {/* Video */}
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
              <div className="relative aspect-video bg-black">
                <iframe
                  src="https://www.youtube.com/embed/VONZpE3eghQ"
                  title="Work-Life Balance — B2 Listening"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>

            {/* Scroll anchor — sits above score panel */}
            <div ref={questionsTopRef} />

            {/* Score panel */}
            {checked && percent !== null && (
              <div className={`flex items-center gap-5 rounded-2xl border px-6 py-5 ${
                grade === "great" ? "border-emerald-500/30 bg-emerald-500/10" :
                grade === "ok"   ? "border-amber-400/30 bg-amber-400/10" :
                                   "border-red-500/30 bg-red-500/10"
              }`}>
                <div className={`text-5xl font-black tabular-nums ${
                  grade === "great" ? "text-emerald-400" :
                  grade === "ok"   ? "text-amber-400" :
                                     "text-red-400"
                }`}>
                  {percent}<span className="text-2xl">%</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white/70">
                    {correctCount} out of {QUESTIONS.length} correct
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        grade === "great" ? "bg-emerald-400" :
                        grade === "ok"   ? "bg-amber-400" :
                                           "bg-red-400"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-white/35">
                    {grade === "great" ? "Excellent comprehension — you're ready for the next level." :
                     grade === "ok"   ? "Good effort. Watch once more and try again." :
                                        "Review the transcript carefully, then try again."}
                  </p>
                </div>
              </div>
            )}

            {/* Questions card */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#16171C]">

              {/* Card header */}
              <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
                <div>
                  <h2 className="text-[15px] font-black text-white">True / False Questions</h2>
                  <p className="text-xs text-white/30 mt-0.5">Choose the correct answer for each statement.</p>
                </div>
                {!checked ? (
                  <div className="flex items-center gap-2.5">
                    <div className="h-1.5 w-24 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
                        style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-white/30 tabular-nums">{answeredCount}/{QUESTIONS.length}</span>
                  </div>
                ) : (
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${
                    grade === "great" ? "bg-emerald-500/20 text-emerald-400" :
                    grade === "ok"   ? "bg-amber-400/20 text-amber-400" :
                                       "bg-red-500/20 text-red-400"
                  }`}>
                    {correctCount}/{QUESTIONS.length}
                  </span>
                )}
              </div>

              {/* Questions */}
              <div className="divide-y divide-white/5">
                {QUESTIONS.map((q, idx) => {
                  const chosen = answers[q.id];
                  const isCorrect = checked && chosen === q.answer;
                  const isWrong   = checked && chosen != null && chosen !== q.answer;

                  return (
                    <div
                      key={q.id}
                      className={`px-6 py-5 transition-colors duration-200 ${
                        isCorrect ? "bg-emerald-500/8" :
                        isWrong   ? "bg-red-500/8" :
                        ""
                      }`}
                    >
                      <div className="flex gap-4">
                        {/* Number bubble */}
                        <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black transition-all ${
                          isCorrect          ? "bg-emerald-500 text-white" :
                          isWrong            ? "bg-red-500 text-white" :
                          chosen != null     ? "bg-[#F5DA20] text-black" :
                                              "bg-white/8 text-white/30"
                        }`}>
                          {checked
                            ? isCorrect ? "✓" : "✗"
                            : String(idx + 1).padStart(2, "0")}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] text-white/85 leading-snug font-medium">{q.text}</p>

                          {/* T / F buttons */}
                          <div className="mt-3.5 grid grid-cols-2 gap-2">
                            {([true, false] as const).map((val) => {
                              const sel    = chosen === val;
                              const ok     = checked && sel && val === q.answer;
                              const bad    = checked && sel && val !== q.answer;
                              const reveal = checked && !sel && val === q.answer;

                              return (
                                <button
                                  key={String(val)}
                                  onClick={() => pick(q.id, val)}
                                  disabled={checked}
                                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all duration-150
                                    ${ok     ? "bg-emerald-500 text-white shadow-lg shadow-emerald-900/30" :
                                      bad    ? "bg-red-500 text-white shadow-lg shadow-red-900/30" :
                                      reveal ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-400" :
                                      sel    ? "bg-[#F5DA20] text-black shadow-lg shadow-yellow-900/20" :
                                      checked ? "border border-white/8 bg-white/4 text-white/20" :
                                      "border border-white/12 bg-white/5 text-white/60 hover:border-[#F5DA20]/50 hover:bg-[#F5DA20]/10 hover:text-[#F5DA20] active:scale-[0.97]"
                                    }`}
                                >
                                  {val
                                    ? <><svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>True</>
                                    : <><svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>False</>
                                  }
                                </button>
                              );
                            })}
                          </div>

                          {checked && (
                            <p className={`mt-2 text-xs font-medium ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                              {isCorrect
                                ? "Correct!"
                                : `Incorrect — the answer is ${q.answer ? "True" : "False"}.`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Card footer */}
              <div className="flex items-center gap-3 border-t border-white/8 bg-white/3 px-6 py-4">
                {!checked ? (
                  <>
                    <button
                      onClick={check}
                      disabled={!allAnswered}
                      className="rounded-xl bg-[#F5DA20] px-6 py-2.5 text-sm font-black text-black transition hover:opacity-90 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Check Answers
                    </button>
                    {!allAnswered && (
                      <span className="text-xs text-white/25">
                        {QUESTIONS.length - answeredCount} question{QUESTIONS.length - answeredCount !== 1 ? "s" : ""} remaining
                      </span>
                    )}
                  </>
                ) : (
                  <button
                    onClick={reset}
                    className="rounded-xl border border-white/12 bg-white/5 px-5 py-2.5 text-sm font-bold text-white/60 hover:bg-white/10 hover:text-white transition"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>

            {/* Transcript accordion */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#16171C]">
              <button
                ref={transcriptRef}
                onClick={() => {
                  const opening = !transcriptOpen;
                  setTranscriptOpen(opening);
                  if (opening) {
                    setTimeout(() => scrollToRef(transcriptRef, 80), 50);
                  }
                }}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-white/4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">Full Transcript</div>
                    <div className="text-xs text-white/30">Read the dialogue to check your understanding</div>
                  </div>
                </div>
                <svg className={`h-4 w-4 text-white/25 transition-transform duration-300 ${transcriptOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              {transcriptOpen && (
                <div className="border-t border-white/8 px-6 py-4 space-y-0">
                  {TRANSCRIPT.map((line, i) => (
                    <div key={i} className={`flex gap-5 py-3.5 ${i < TRANSCRIPT.length - 1 ? "border-b border-white/5" : ""}`}>
                      <span className={`w-16 shrink-0 text-right pt-0.5 text-[11px] font-black uppercase tracking-wider ${
                        line.speaker === "D" ? "text-[#F5DA20]" : "text-white/20"
                      }`}>
                        {line.speaker === "D" ? "Daniel" : "Int."}
                      </span>
                      <p className="flex-1 text-sm text-white/65 leading-relaxed">{line.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom nav */}
            <div className="flex items-center justify-between pt-4 border-t border-white/8">
              <a
                href="/listening/b2"
                className="flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/50 hover:bg-white/10 hover:text-white transition"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
                All B2 Listening
              </a>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">

              {/* Vocabulary */}
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#16171C]">
                <div className="border-b border-white/8 px-4 py-3">
                  <p className="text-xs font-black text-white uppercase tracking-wide">Key Vocabulary</p>
                  <p className="text-[11px] text-white/25 mt-0.5">Words from the dialogue</p>
                </div>
                <div className="px-4 py-3 space-y-4">
                  {VOCAB.map(({ word, pos, def }) => (
                    <div key={word}>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-black text-[#F5DA20]">{word}</span>
                        <span className="text-[10px] text-white/20 font-semibold italic">{pos}</span>
                      </div>
                      <p className="mt-0.5 text-[12px] text-white/40 leading-snug">{def}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tip */}
              <div className="rounded-2xl border border-[#F5DA20]/20 bg-[#F5DA20]/6 px-4 py-4">
                <p className="text-xs font-black text-[#F5DA20] uppercase tracking-wide mb-2">B2 Tip</p>
                <p className="text-xs text-white/40 leading-relaxed">
                  At B2 level, focus on <span className="font-semibold text-white/65">implied meaning</span>. Speakers often suggest something without saying it directly — pay attention to hesitations and tone.
                </p>
              </div>

              {/* Ad */}
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/20">Advertisement</p>
                <div className="flex h-[250px] items-center justify-center rounded-2xl border border-white/8 bg-white/3 text-xs text-white/15">
                  300 × 250
                </div>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
