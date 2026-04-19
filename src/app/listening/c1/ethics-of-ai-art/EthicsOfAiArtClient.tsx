"use client";

import { useState, useEffect, useRef } from "react";
import AdUnit from "@/components/AdUnit";
import { useLiveSync } from "@/lib/useLiveSync";
import PDFButton from "@/components/PDFButton";
import { generateReadingPDF } from "@/lib/generateReadingPDF";
import { useIsPro } from "@/lib/ProContext";

const TRANSCRIPT: { speaker: "M" | "C"; text: string }[] = [
  { speaker: "M", text: "Chloe, I've been meaning to pick your brain about something that's been eating away at me for weeks. A guy I went to art school with just won a rather prestigious digital art competition — and it turns out he generated the whole piece with an AI model. He barely even tweaked it." },
  { speaker: "C", text: "Ah, I was wondering when this topic would come up between us. I take it you're not exactly thrilled about it?" },
  { speaker: "M", text: "Thrilled? I'm livid, honestly. I spent the better part of a decade honing my craft — sketching until my wrist ached, studying anatomy, colour theory, composition. And now someone types a few clever prompts into a machine and walks away with the prize money? It's a slap in the face." },
  { speaker: "C", text: "I hear you, and I'm not going to dismiss your frustration out of hand. But I think you might be framing this in slightly black-and-white terms. The history of art is, in many ways, the history of technological disruption. When photography emerged in the nineteenth century, portrait painters were up in arms — they genuinely believed their profession was finished." },
  { speaker: "M", text: "That's a false equivalence, though, isn't it? A photographer still has to compose the shot, understand lighting, develop an eye. With AI, the machine does the heavy lifting. You're outsourcing creativity itself." },
  { speaker: "C", text: "Are you, though? I'd argue that crafting a genuinely original prompt — one that yields something visually striking rather than generic — requires a surprisingly refined aesthetic sensibility. The best AI artists I've encountered tend to have backgrounds in traditional media. They know what they're reaching for." },
  { speaker: "M", text: "Maybe, but here's what really gets under my skin: these models were trained on billions of images scraped from the internet, including work by artists like me who never consented to any of it. My style, my linework, my years of effort — all quietly digested into some dataset and regurgitated on demand. It feels like a form of theft, frankly." },
  { speaker: "C", text: "Now that is a legitimate grievance, and I won't try to sugar-coat it. The copyright situation is a genuine mess, and the legal system hasn't caught up. Several lawsuits are currently making their way through the courts, and I suspect the landscape will look very different in five years' time." },
  { speaker: "M", text: "Five years is an eternity when your livelihood is on the line. I've already lost two commercial clients this year because they've started generating concept art in-house." },
  { speaker: "C", text: "That's a bitter pill to swallow, and I'm sorry. But can I play devil's advocate for a moment? Perhaps the role of the human artist is shifting rather than vanishing. Curation, narrative, emotional resonance — these are things a machine can't authentically provide. A viewer can tell, even if only subconsciously, when there's no lived experience behind the image." },
  { speaker: "M", text: "You think so? I'm not convinced the average consumer can tell the difference, or even cares to." },
  { speaker: "C", text: "Perhaps not in a fleeting glance on social media. But in a gallery context, where people are invited to sit with a piece and interrogate it, AI work tends to fall flat rather quickly. It's technically impressive but emotionally hollow. Like a beautifully constructed sentence with nothing to say." },
  { speaker: "M", text: "I'd like to believe that. I really would. But I worry we're approaching a point where \"good enough\" will simply eclipse \"genuinely meaningful\" — because it's cheaper, faster, and the market rewards efficiency." },
  { speaker: "C", text: "That's a concern worth taking seriously. But I'd push back gently and say that every generation of artists has felt this way about something. The despair feels universal and timeless, and yet meaningful art keeps finding its audience. Perhaps the task now is to articulate, more clearly than ever, what human creativity uniquely offers." },
  { speaker: "M", text: "Easier said than done when you're staring at a stack of unpaid bills." },
  { speaker: "C", text: "Fair point. I won't pretend I have all the answers. But for what it's worth, the gallery I curate for has explicitly decided not to exhibit purely AI-generated work — not out of Luddism, but because we want to champion the human hand. There's still an appetite for that, Martin. Don't lose sight of it." },
  { speaker: "M", text: "Thanks, Chloe. That actually does help, a bit. I suppose I needed to vent more than anything else." },
  { speaker: "C", text: "Any time. And listen — let's grab a proper coffee next week and I'll introduce you to a collector who's specifically looking for traditionally illustrated work. Small steps." },
];

const QUESTIONS = [
  { id: 1,  text: "Martin is upset because his former classmate won a competition using AI-generated art with minimal modifications.", answer: true },
  { id: 2,  text: "Chloe immediately agrees with Martin that AI art is unfair to traditional artists.", answer: false },
  { id: 3,  text: "Chloe compares the rise of AI art to the emergence of photography in the nineteenth century.", answer: true },
  { id: 4,  text: "Martin believes that using AI requires the same level of skill as photography.", answer: false },
  { id: 5,  text: "Martin is concerned that AI models were trained on artists' work without their consent.", answer: true },
  { id: 6,  text: "Chloe claims that the legal issues around AI-generated art have already been fully resolved.", answer: false },
  { id: 7,  text: "Martin has lost commercial clients this year because they started generating concept art internally.", answer: true },
  { id: 8,  text: "Chloe argues that human artists might need to adapt their role rather than disappear entirely.", answer: true },
  { id: 9,  text: "Chloe believes that AI-generated art holds up well when viewers examine it closely in a gallery.", answer: false },
  { id: 10, text: "The gallery where Chloe works has decided to exhibit both AI-generated and traditional art equally.", answer: false },
  { id: 11, text: "Chloe offers to introduce Martin to a collector interested in traditionally illustrated work.", answer: true },
  { id: 12, text: "Martin feels completely reassured by the end of the conversation and no longer has any worries.", answer: false },
];

const VOCAB = [
  { word: "eating away at", pos: "phr.", def: "to worry or bother someone persistently" },
  { word: "honing", pos: "v.", def: "to sharpen or develop a skill through repeated practice" },
  { word: "slap in the face", pos: "phr.", def: "something deeply offensive or insulting" },
  { word: "false equivalence", pos: "phr.", def: "an incorrect comparison that treats unequal things as equal" },
  { word: "grievance", pos: "n.", def: "a sense of resentment over something felt to be unfair" },
  { word: "regurgitate", pos: "v.", def: "to reproduce information or content without originality" },
  { word: "livelihood", pos: "n.", def: "means of earning income and supporting oneself" },
  { word: "emotionally hollow", pos: "phr.", def: "technically accomplished but lacking genuine feeling or depth" },
];

export default function EthicsOfAiArtClient() {
  const isPro = useIsPro();
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [checked, setChecked] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      await generateReadingPDF({
        title: "The Ethics of AI-Generated Art",
        level: "C1",
        filename: "EnglishNerd_Ethics-of-AI-Art_C1.pdf",
        passages: TRANSCRIPT.map((line) => ({
          speaker: line.speaker === "M" ? "Martin" : "Chloe",
          text: line.text,
        })),
        trueFalse: QUESTIONS.map((q) => ({ text: q.text, answer: q.answer })),
      });
    } finally {
      setPdfLoading(false);
    }
  }

  const { broadcast } = useLiveSync((payload) => {
    setAnswers(payload.answers as Record<number, boolean | null>);
    setChecked(payload.checked as boolean);
  });

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
    setAnswers((p) => { const n = { ...p, [id]: val }; broadcast({ answers: n, checked: false, exNo: 1 }); return n; });
  }

  function scrollToRef(ref: React.RefObject<HTMLElement | null>, offset = 80) {
    if (!ref.current) return;
    const top = ref.current.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function check() {
    if (!allAnswered) return;
    setChecked(true);
    broadcast({ answers, checked: true, exNo: 1 });
    setTimeout(() => scrollToRef(questionsTopRef, 80), 50);
  }

  function reset() {
    setAnswers({});
    setChecked(false);
    broadcast({ answers: {}, checked: false, exNo: 1 });
  }

  useEffect(() => {
    if (!checked || percent === null) return;
    fetch("/api/progress/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "listening", level: "c1", slug: "ethics-of-ai-art", exerciseNo: 1, score: percent, questionsTotal: QUESTIONS.length }),
    }).catch(() => {});
  }, [checked, percent]);

  const grade =
    percent === null ? null :
    percent >= 80 ? "great" :
    percent >= 60 ? "ok" : "low";

  return (
    <main className="min-h-screen bg-[#FAFAFA]">

      {/* Hero band */}
      <div className="bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400">
            {[["Home", "/"], ["Listening", "/listening"], ["C1", "/listening/c1"]].map(([label, href]) => (
              <span key={href} className="flex items-center gap-1.5">
                <a href={href} className="hover:text-slate-700 transition">{label}</a>
                <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </span>
            ))}
            <span className="text-slate-700 font-medium">The Ethics of AI-Generated Art</span>
          </nav>

          {/* Title row */}
          <div className="mt-5">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-full bg-sky-400 px-3 py-0.5 text-[11px] font-black text-black">C1</span>
              <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Dialogue</span>
              <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">~6 min</span>
              <PDFButton onDownload={downloadPDF} loading={pdfLoading} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.05]">
              The Ethics of{" "}
              <span className="relative inline-block">
                AI-Generated Art
                <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-[15px] text-slate-500 leading-relaxed">
              Martin, an illustrator, and Chloe, a gallery curator, debate creativity, copyright, and the impact of AI on the art world.
              Watch the video, then test your comprehension.
            </p>
          </div>

          {/* How-to steps */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { n: "1", label: "Watch the video", sub: "once, without pausing" },
              { n: "2", label: "Answer 12 questions", sub: "True or False" },
              { n: "3", label: "Check your answers", sub: "then read the transcript" },
            ].map(({ n, label, sub }) => (
              <div key={n} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#F5DA20] text-xs font-black text-black shadow-sm">{n}</div>
                <div>
                  <div className="text-sm font-bold text-slate-800">{label}</div>
                  <div className="text-xs text-slate-400">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr_240px]">

          {/* Left ad */}
          <AdUnit variant="sidebar-light" />

          {/* Main */}
          <div className="min-w-0 space-y-5">

            {/* Video */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
              <div className="relative aspect-video bg-black">
                <iframe
                  src="https://www.youtube.com/embed/o9X3YrdfORY"
                  title="The Ethics of AI-Generated Art — C1 Listening"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>

            {/* Scroll anchor */}
            <div ref={questionsTopRef} />

            {/* Score panel */}
            {checked && percent !== null && (
              <div className={`flex items-center gap-5 rounded-2xl border px-6 py-5 ${
                grade === "great" ? "border-emerald-200 bg-emerald-50" :
                grade === "ok"   ? "border-amber-200 bg-amber-50" :
                                   "border-red-200 bg-red-50"
              }`}>
                <div className={`text-5xl font-black tabular-nums leading-none ${
                  grade === "great" ? "text-emerald-600" :
                  grade === "ok"   ? "text-amber-600" :
                                     "text-red-600"
                }`}>
                  {percent}<span className="text-2xl">%</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-700">
                    {correctCount} out of {QUESTIONS.length} correct
                  </div>
                  <div className="mt-2.5 h-2 w-full rounded-full bg-black/8 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        grade === "great" ? "bg-emerald-500" :
                        grade === "ok"   ? "bg-amber-400" :
                                           "bg-red-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {grade === "great" ? "Excellent comprehension — outstanding C1 listening!" :
                     grade === "ok"   ? "Good effort. Watch once more and try again." :
                                        "Review the transcript carefully, then try again."}
                  </p>
                </div>
                <div className="text-4xl">{grade === "great" ? "🎉" : grade === "ok" ? "💪" : "📖"}</div>
              </div>
            )}

            {/* Questions card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]">

              {/* Card header */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
                <div>
                  <h2 className="text-[15px] font-black text-slate-900">True / False Questions</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Choose the correct answer for each statement.</p>
                </div>
                {!checked ? (
                  <div className="flex items-center gap-2.5">
                    <div className="h-1.5 w-24 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
                        style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-400 tabular-nums">{answeredCount}/{QUESTIONS.length}</span>
                  </div>
                ) : (
                  <span className={`rounded-full px-3 py-1 text-xs font-black border ${
                    grade === "great" ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                    grade === "ok"   ? "border-amber-200 bg-amber-50 text-amber-700" :
                                       "border-red-200 bg-red-50 text-red-700"
                  }`}>
                    {correctCount}/{QUESTIONS.length}
                  </span>
                )}
              </div>

              {/* Questions */}
              <div className="divide-y divide-slate-50">
                {QUESTIONS.map((q, idx) => {
                  const chosen = answers[q.id];
                  const isCorrect = checked && chosen === q.answer;
                  const isWrong   = checked && chosen != null && chosen !== q.answer;

                  return (
                    <div
                      key={q.id}
                      className={`px-6 py-5 transition-colors duration-200 ${
                        isCorrect ? "bg-emerald-50/60" :
                        isWrong   ? "bg-red-50/60" : ""
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all ${
                          isCorrect          ? "bg-emerald-500 text-white" :
                          isWrong            ? "bg-red-500 text-white" :
                          chosen != null     ? "bg-[#F5DA20] text-black" :
                                              "bg-slate-100 text-slate-400"
                        }`}>
                          {checked
                            ? isCorrect
                              ? <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                              : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            : String(idx + 1).padStart(2, "0")}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] text-slate-800 leading-snug font-medium">{q.text}</p>

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
                                    ${ok     ? "bg-emerald-500 text-white shadow-sm" :
                                      bad    ? "bg-red-500 text-white shadow-sm" :
                                      reveal ? "border-2 border-emerald-300 bg-emerald-50 text-emerald-700" :
                                      sel    ? "bg-[#F5DA20] text-black shadow-sm" :
                                      checked ? "border border-slate-100 bg-slate-50 text-slate-300" :
                                      "border border-slate-200 bg-white text-slate-700 hover:border-[#F5DA20] hover:bg-[#F5DA20]/10 hover:text-slate-900 active:scale-[0.97]"
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
                            <p className={`mt-2 text-xs font-semibold ${isCorrect ? "text-emerald-600" : "text-red-600"}`}>
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
              <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                {!checked ? (
                  <>
                    <button
                      onClick={check}
                      disabled={!allAnswered}
                      className="rounded-xl bg-[#F5DA20] px-6 py-2.5 text-sm font-black text-black transition hover:opacity-90 shadow-sm disabled:opacity-35 disabled:cursor-not-allowed"
                    >
                      Check Answers
                    </button>
                    {!allAnswered && (
                      <span className="text-xs text-slate-400">
                        {QUESTIONS.length - answeredCount} question{QUESTIONS.length - answeredCount !== 1 ? "s" : ""} remaining
                      </span>
                    )}
                  </>
                ) : (
                  <button
                    onClick={reset}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>

            {/* Transcript accordion */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
              <button
                ref={transcriptRef}
                onClick={() => {
                  const opening = !transcriptOpen;
                  setTranscriptOpen(opening);
                  if (opening) setTimeout(() => scrollToRef(transcriptRef, 80), 50);
                }}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">Full Transcript</div>
                    <div className="text-xs text-slate-400">Read the dialogue to check your understanding</div>
                  </div>
                </div>
                <svg className={`h-4 w-4 text-slate-300 transition-transform duration-300 ${transcriptOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              {transcriptOpen && (
                <div className="border-t border-slate-100 px-6 py-2">
                  {TRANSCRIPT.map((line, i) => (
                    <div key={i} className={`flex gap-5 py-4 ${i < TRANSCRIPT.length - 1 ? "border-b border-slate-50" : ""}`}>
                      <span className={`w-16 shrink-0 text-right pt-0.5 text-[11px] font-black uppercase tracking-wider ${
                        line.speaker === "M" ? "text-sky-500" : "text-orange-500"
                      }`}>
                        {line.speaker === "M" ? "Martin" : "Chloe"}
                      </span>
                      <p className="flex-1 text-sm text-slate-700 leading-relaxed">{line.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom nav */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <a
                href="/listening/c1"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
                All C1 Listening
              </a>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">

              {/* Vocabulary */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                  <p className="text-xs font-black text-slate-700 uppercase tracking-wide">Key Vocabulary</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Words from the dialogue</p>
                </div>
                <div className="px-4 py-3 space-y-4">
                  {VOCAB.map(({ word, pos, def }) => (
                    <div key={word}>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-black text-[#b8a200]">{word}</span>
                        <span className="text-[10px] text-slate-300 font-semibold italic">{pos}</span>
                      </div>
                      <p className="mt-0.5 text-[12px] text-slate-500 leading-snug">{def}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* C1 Tip */}
              <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-4">
                <p className="text-xs font-black text-sky-600 uppercase tracking-wide mb-2">C1 Tip</p>
                <p className="text-xs text-sky-900/60 leading-relaxed">
                  At C1 level, pay attention to <span className="font-semibold text-sky-900/80">attitude and stance</span>. Notice how speakers soften disagreement, use hedging language, and signal concession — these subtleties carry the argument.
                </p>
              </div>

              {/* Ad */}
              <AdUnit variant="inline-light" />

            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
