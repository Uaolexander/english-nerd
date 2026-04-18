"use client";

import { useState, useEffect } from "react";
import AdUnit from "@/components/AdUnit";
import SpeedRound from "@/components/games/SpeedRound";
import type { SRQuestion } from "@/components/games/SpeedRound";
import PDFButton from "@/components/PDFButton";
import { useIsPro } from "@/lib/ProContext";
import { generateLessonPDF } from "@/lib/generateLessonPDF";
import type { LessonPDFConfig } from "@/lib/generateLessonPDF";
import VocabRecommendations from "@/components/VocabRecommendations";
import { useLiveSync } from "@/lib/useLiveSync";

const SPEED_QUESTIONS: SRQuestion[] = [
  { q: "A social media ___ decides which content you see.", options: ["algorithm", "profile", "advert", "filter"], answer: 0 },
  { q: "Likes, shares and comments are forms of ___.", options: ["clickbait", "engagement", "streaming", "hacking"], answer: 1 },
  { q: "A misleading headline designed to attract clicks is called ___.", options: ["fake news", "clickbait", "viral content", "streaming"], answer: 1 },
  { q: "When a video spreads very quickly online it is described as ___.", options: ["streamed", "viral", "offline", "encrypted"], answer: 1 },
  { q: "An ___ promotes products to their social media followers.", options: ["editor", "influencer", "analyst", "developer"], answer: 1 },
  { q: "Live delivery of content over the internet is called ___.", options: ["streaming", "blogging", "printing", "uploading"], answer: 0 },
  { q: "False or misleading information presented as news is called ___.", options: ["clickbait", "satire", "fake news", "blogging"], answer: 2 },
  { q: "An ___ bubble shows you only views that reinforce your own.", options: ["echo", "filter", "online", "empty"], answer: 0 },
  { q: "Checking where information comes from means verifying your ___.", options: ["sources", "followers", "grammar", "photos"], answer: 0 },
  { q: "A journalist's supervisor who oversees content is called an ___.", options: ["editor", "influencer", "blogger", "analyst"], answer: 0 },
  { q: "Content that is only available to paying users is called ___.", options: ["premium", "viral", "clickbait", "streamed"], answer: 0 },
  { q: "A ___ is a regularly updated website with personal commentary.", options: ["blog", "stream", "algorithm", "source"], answer: 0 },
  { q: "Data protection rules are part of digital ___.", options: ["privacy", "algorithm", "engagement", "clickbait"], answer: 0 },
  { q: "A ___ is a false or misleading story spread on social media.", options: ["hoax", "podcast", "stream", "blog"], answer: 0 },
  { q: "A ___ is an audio programme available for download.", options: ["podcast", "tweet", "stream", "hashtag"], answer: 0 },
  { q: "The ___ is the total number of people who follow an account.", options: ["following", "engagement", "reach", "algorithm"], answer: 2 },
  { q: "To ___ content means to remove it for violating guidelines.", options: ["moderate", "stream", "curate", "upload"], answer: 0 },
  { q: "A ___ is a word or phrase preceded by # used to index content.", options: ["hashtag", "clickbait", "thread", "caption"], answer: 0 },
  { q: "Content created by users rather than companies is called ___.", options: ["user-generated content", "editorial", "advertising", "streaming"], answer: 0 },
  { q: "The practice of tracking users' online behaviour is called ___.", options: ["data tracking", "streaming", "engagement", "blogging"], answer: 0 },
];

const PDF_CONFIG: LessonPDFConfig = {
  title: "Media & Technology",
  subtitle: "B2 digital media vocabulary — dialogue",
  level: "B2",
  keyRule: "Digital media vocabulary: algorithm · engagement · clickbait · viral · influencer · streaming · fake news",
  exercises: [
    {
      number: 1, title: "Dialogue Exercise", difficulty: "Upper-Intermediate",
      instruction: "Choose the correct word for each gap.",
      questions: [
        "Anna is discussing digital media trends with her ___. (editor / neighbour / baker)",
        "How do social media ___ decide which content people see? (algorithms / windows / colours)",
        "Many posts are designed to maximise ___ — likes, shares, and comments. (engagement / furniture / weather)",
        "Some websites use ___ headlines to get more clicks. (clickbait / honest / boring)",
        "When a video becomes ___, it spreads very quickly online. (viral / offline / private)",
        "Many brands now work with ___ who have millions of followers. (influencers / politicians / athletes)",
        "News is now ___ in real time — we can follow events as they happen. (streamed / printed / posted)",
        "The rise of ___ journalism is worrying — many stories are not verified. (fake news / good news / local news)",
        "Social media can create an ___ bubble where you only see opinions you agree with. (echo / empty / online)",
        "We must always check our ___ before publishing any story. (sources / grammar / photos)",
      ],
    },
  ],
  answerKey: [
    { exercise: 1, subtitle: "Dialogue Exercise", answers: ["editor", "algorithms", "engagement", "clickbait", "viral", "influencers", "streamed", "fake news", "echo", "sources"] },
  ],
};

/*
  Dialogue: "Media & Technology"
  Anna (journalist), Editor (Tom), Narrator
*/
type Question = {
  id: number;
  before: string;
  after: string;
  options: string[];
  correct: string;
  explanation: string;
  speaker?: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    speaker: "Narrator",
    before: "Anna is discussing digital media trends with her",
    after: ".",
    options: ["editor", "neighbour", "baker"],
    correct: "editor",
    explanation: "A journalist discusses trends with their editor — the person responsible for overseeing the content. A neighbour or baker would not be involved in a media discussion.",
  },
  {
    id: 2,
    speaker: "Tom",
    before: "How do social media",
    after: "decide which content people see?",
    options: ["algorithms", "windows", "colours"],
    correct: "algorithms",
    explanation: "Algorithms are sets of rules used by social media platforms to determine which content is shown to users. Windows and colours are unrelated to content curation.",
  },
  {
    id: 3,
    speaker: "Anna",
    before: "Many posts are designed to maximise",
    after: "— likes, shares, and comments.",
    options: ["engagement", "furniture", "weather"],
    correct: "engagement",
    explanation: "Engagement refers to interactions with content such as likes, shares, and comments. Furniture and weather have no relevance to social media metrics.",
  },
  {
    id: 4,
    speaker: "Tom",
    before: "Some websites use",
    after: "headlines to get more clicks.",
    options: ["clickbait", "honest", "boring"],
    correct: "clickbait",
    explanation: "Clickbait refers to sensational or misleading headlines designed to attract clicks. Honest and boring are adjectives that describe opposite qualities.",
  },
  {
    id: 5,
    speaker: "Anna",
    before: "When a video becomes",
    after: ", it spreads very quickly online.",
    options: ["viral", "offline", "private"],
    correct: "viral",
    explanation: "When content goes viral, it spreads rapidly across the internet. Offline means not connected to the internet, and private means restricted — both are the opposite of widespread sharing.",
  },
  {
    id: 6,
    speaker: "Tom",
    before: "Many brands now work with",
    after: "who have millions of followers.",
    options: ["influencers", "politicians", "athletes"],
    correct: "influencers",
    explanation: "Influencers are people who use social media to promote brands to their followers. While politicians and athletes may also have followers, influencers is the specific term for this type of brand partnership.",
  },
  {
    id: 7,
    speaker: "Anna",
    before: "News is now",
    after: "in real time — we can follow events as they happen.",
    options: ["streamed", "printed", "posted"],
    correct: "streamed",
    explanation: "Streaming refers to delivering content live over the internet in real time. Printed refers to physical newspapers, and posted is too vague for live delivery.",
  },
  {
    id: 8,
    speaker: "Tom",
    before: "The rise of",
    after: "journalism is worrying — many stories are not verified.",
    options: ["fake news", "good news", "local news"],
    correct: "fake news",
    explanation: "Fake news refers to false or misleading information presented as real journalism. Good news and local news do not convey the concern about unverified stories.",
  },
  {
    id: 9,
    speaker: "Anna",
    before: "Social media can create an",
    after: "bubble where you only see opinions you agree with.",
    options: ["echo", "empty", "online"],
    correct: "echo",
    explanation: "An echo chamber or echo bubble is a situation where a person encounters only views that reinforce their own. Empty and online do not form this well-known collocation.",
  },
  {
    id: 10,
    speaker: "Tom",
    before: "We must always check our",
    after: "before publishing any story.",
    options: ["sources", "grammar", "photos"],
    correct: "sources",
    explanation: "Checking sources means verifying where information comes from before publishing. While grammar and photos matter, checking sources is the most critical editorial process for accuracy.",
  },
];

const VOCAB_FOCUS = [
  { word: "algorithm", def: "a set of rules a computer follows to decide what content to show" },
  { word: "engagement", def: "interactions with content such as likes, shares, and comments" },
  { word: "clickbait", def: "misleading headlines designed to attract clicks" },
  { word: "viral", def: "spreading very quickly and widely across the internet" },
  { word: "influencer", def: "a person who promotes products or ideas to their social media followers" },
];

export default function MediaTechnologyClient() {
  const isPro = useIsPro();
  const [tab, setTab] = useState<"exercises" | "explanation">("exercises");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [checked, setChecked] = useState(false);

  const { isLive, broadcast } = useLiveSync((payload) => {
    setAnswers(payload.answers as Record<number, string | null>);
    setChecked(payload.checked as boolean);
  });

  async function handlePDF() {
    setPdfLoading(true);
    try { await generateLessonPDF(PDF_CONFIG); } finally { setPdfLoading(false); }
  }

  const answeredCount = QUESTIONS.filter((q) => answers[q.id] != null).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const correctCount = checked
    ? QUESTIONS.reduce((n, q) => n + (answers[q.id] === q.correct ? 1 : 0), 0)
    : null;
  const percent = correctCount !== null ? Math.round((correctCount / QUESTIONS.length) * 100) : null;

  function pick(id: number, val: string) {
    if (checked) return;
    setAnswers((p) => { const n = { ...p, [id]: val }; broadcast({ answers: n, checked: false, exNo: 1 }); return n; });
  }

  function check() {
    if (!allAnswered) return;
    setChecked(true);
    broadcast({ answers, checked: true, exNo: 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      body: JSON.stringify({ category: "vocabulary", level: "b2", slug: "media-and-technology", exerciseNo: 1, score: percent, questionsTotal: QUESTIONS.length }),
    }).catch(() => {});
  }, [checked, percent]);

  const grade =
    percent === null ? null :
    percent >= 80 ? "great" :
    percent >= 60 ? "ok" : "low";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        {[["Home", "/"], ["Vocabulary", "/vocabulary"], ["B2", "/vocabulary/b2"]].map(([label, href]) => (
          <span key={href} className="flex items-center gap-1.5">
            <a href={href} className="hover:text-slate-700 transition">{label}</a>
            <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </span>
        ))}
        <span className="text-slate-700 font-medium">Media &amp; Technology</span>
      </nav>

      {/* Hero */}
      <div className="mt-6 flex flex-wrap items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-orange-400 px-3 py-0.5 text-[11px] font-black text-black">B2</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Dialogue</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">10 questions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.05]">
            Media &amp;{" "}
            <span className="relative inline-block">
              Technology
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/60" />
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-slate-500 leading-relaxed">
            Anna and her editor discuss trends in digital media. Read the dialogue and choose the correct
            word for each gap. Think about digital media vocabulary!
          </p>
        </div>
      </div>

      {/* How-to */}
      <div className="mt-6 flex flex-wrap gap-3">
        {[
          { n: "1", label: "Read the sentence", sub: "understand the situation" },
          { n: "2", label: "Choose the word", sub: "that fits the context" },
          { n: "3", label: "Check your answers", sub: "and read the explanations" },
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

      {/* 3-col grid */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[300px_1fr_300px]">

        {/* Left column */}
        {isPro ? (
          <div className=""><SpeedRound gameId="vocab-media-technology" subject="Media & Technology Vocabulary" questions={SPEED_QUESTIONS} variant="sidebar" /></div>
        ) : (
          <AdUnit variant="sidebar-dark" />
        )}

        {/* Main */}
        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">

          {/* Tab bar */}
          <div className="flex items-center gap-2 border-b border-black/10 bg-white/60 p-3 flex-wrap">
            <button onClick={() => setTab("exercises")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "exercises" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Exercises</button>
            <button onClick={() => setTab("explanation")} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === "explanation" ? "bg-[#F5DA20] text-black" : "text-slate-700 hover:bg-black/5"}`}>Vocabulary</button>
            <PDFButton onDownload={handlePDF} loading={pdfLoading} />
          </div>

          <div className="p-6 md:p-8">
          {tab === "explanation" ? <MediaTechnologyExplanation /> : (
          <div className="space-y-5">

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
                <div className="text-sm font-semibold text-slate-700">{correctCount} out of {QUESTIONS.length} correct</div>
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
                  {grade === "great" ? "Excellent! Your digital media vocabulary is impressive." :
                   grade === "ok"   ? "Good effort! Read the explanations and try again." :
                                      "Keep practising! Review the explanations below to improve."}
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
                <h2 className="text-[15px] font-black text-slate-900">Choose the correct word</h2>
                <p className="text-xs text-slate-400 mt-0.5">Read each sentence and select the word that fits best.</p>
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

            {/* Questions list */}
            <div className="divide-y divide-slate-50">
              {QUESTIONS.map((q, idx) => {
                const chosen = answers[q.id];
                const isCorrect = checked && chosen === q.correct;
                const isWrong   = checked && chosen != null && chosen !== q.correct;

                return (
                  <div
                    key={q.id}
                    className={`px-6 py-6 transition-colors duration-200 ${
                      isCorrect ? "bg-emerald-50/60" :
                      isWrong   ? "bg-red-50/60" : ""
                    }`}
                  >
                    <div className="flex gap-4">

                      {/* Number */}
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all ${
                        isCorrect      ? "bg-emerald-500 text-white" :
                        isWrong        ? "bg-red-500 text-white" :
                        chosen != null ? "bg-[#F5DA20] text-black" :
                                        "bg-slate-100 text-slate-400"
                      }`}>
                        {checked
                          ? isCorrect
                            ? <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                            : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                          : String(idx + 1).padStart(2, "0")}
                      </div>

                      <div className="flex-1 min-w-0">

                        {/* Speaker label */}
                        {q.speaker && (
                          <div className={`mb-1.5 text-[11px] font-black uppercase tracking-wider ${
                            q.speaker === "Narrator" ? "text-slate-300" :
                            q.speaker === "Anna"     ? "text-orange-500" :
                            q.speaker === "Tom"      ? "text-violet-500" :
                            "text-orange-500"
                          }`}>
                            {q.speaker}
                          </div>
                        )}

                        {/* Sentence with gap */}
                        <p className="text-[16px] text-slate-800 leading-relaxed font-medium">
                          {q.before}{" "}
                          <span className={`inline-block min-w-[80px] rounded-lg px-3 py-0.5 text-center font-black transition-all ${
                            isCorrect ? "bg-emerald-100 text-emerald-700" :
                            isWrong   ? "bg-red-100 text-red-600 line-through" :
                            chosen    ? "bg-[#F5DA20]/30 text-slate-800" :
                            "border-2 border-dashed border-slate-200 text-slate-300"
                          }`}>
                            {chosen ?? "???"}
                          </span>
                          {" "}{q.after}
                        </p>

                        {/* Corrected word if wrong */}
                        {isWrong && (
                          <p className="mt-1 text-sm font-semibold text-emerald-600">
                            ✓ Correct answer: <span className="font-black">{q.correct}</span>
                          </p>
                        )}

                        {/* Options */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {q.options.map((opt) => {
                            const sel     = chosen === opt;
                            const ok      = checked && sel && opt === q.correct;
                            const bad     = checked && sel && opt !== q.correct;
                            const reveal  = checked && !sel && opt === q.correct;

                            return (
                              <button
                                key={opt}
                                onClick={() => pick(q.id, opt)}
                                disabled={checked}
                                className={`rounded-xl px-5 py-2 text-sm font-bold transition-all duration-150
                                  ${ok     ? "bg-emerald-500 text-white shadow-sm" :
                                    bad    ? "bg-red-500 text-white shadow-sm" :
                                    reveal ? "border-2 border-emerald-300 bg-emerald-50 text-emerald-700" :
                                    sel    ? "bg-[#F5DA20] text-black shadow-sm" :
                                    checked ? "border border-slate-100 bg-slate-50 text-slate-300" :
                                    "border border-slate-200 bg-white text-slate-700 hover:border-[#F5DA20] hover:bg-[#F5DA20]/10 hover:text-slate-900 active:scale-95"
                                  }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {checked && (
                          <div className={`mt-3 rounded-xl px-4 py-3 text-sm leading-relaxed ${
                            isCorrect ? "bg-emerald-50 border border-emerald-100 text-emerald-800" :
                                        "bg-slate-50 border border-slate-100 text-slate-600"
                          }`}>
                            <span className="font-bold">{isCorrect ? "✓ Correct! " : "Explanation: "}</span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
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

          {/* Bottom nav */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <a
              href="/vocabulary/b2"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
              All B2 Exercises
            </a>
          </div>
        </div>
        )}
          </div>
        </section>

        {/* Right column */}
        {isPro ? (
          <VocabRecommendations level="b2" />
        ) : (
          <AdUnit variant="sidebar-light" />
        )}

      </div>
    </div>
  );
}

function MediaTechnologyExplanation() {
  const words = [
    ["algorithm", "алгоритм — rules a platform uses to decide what content to show"],
    ["engagement", "залученість — likes, shares, comments and other interactions"],
    ["clickbait", "клікбейт — misleading headlines designed to attract clicks"],
    ["viral", "вірусний — spreading very quickly across the internet"],
    ["influencer", "інфлюенсер — a person who promotes brands to their social media followers"],
    ["streaming", "стримінг — delivering live audio/video content over the internet"],
    ["fake news", "фейкові новини — false or misleading information presented as fact"],
    ["echo chamber", "ехо-камера — an environment where you only hear views you agree with"],
    ["source", "джерело — the origin or provider of information"],
    ["editor", "редактор — a person who oversees and approves content"],
    ["podcast", "подкаст — an audio programme available for download or streaming"],
    ["hashtag", "хештег — a word preceded by # used to categorise content"],
    ["blog", "блог — a regularly updated website with personal commentary"],
    ["hoax", "містифікація — a false story spread to deceive people"],
    ["reach", "охоплення — the total number of people exposed to content"],
    ["moderate", "модерувати — to review and remove content that breaks rules"],
    ["premium content", "преміум-контент — exclusive content available to paying subscribers"],
    ["data tracking", "відстеження даних — monitoring users' online behaviour"],
    ["user-generated content", "контент від користувачів — media created by ordinary users"],
    ["digital literacy", "цифрова грамотність — the ability to use digital tools critically"],
  ];
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-slate-900">Media & Technology — Vocabulary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {words.map(([en, ua]) => (
          <div key={en} className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm flex gap-2">
            <span className="font-bold text-slate-900 min-w-[120px]">{en}</span>
            <span className="text-slate-500">{ua}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <div className="text-sm font-black text-amber-800 mb-1">B2 Tip</div>
        <p className="text-xs text-amber-700 leading-relaxed">
          Media vocabulary changes quickly. Learn <strong>collocations</strong> like "go viral", "fake news story", and "social media algorithm" as fixed phrases. Understanding digital media language is essential for reading English-language news and journalism at B2 level.
        </p>
      </div>
    </div>
  );
}
