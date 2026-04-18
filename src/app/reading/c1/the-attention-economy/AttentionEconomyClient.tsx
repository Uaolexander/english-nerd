"use client";

import { useState, useEffect, useRef } from "react";
import AdUnit from "@/components/AdUnit";
import { useIsPro } from "@/lib/ProContext";
import ReadingRecommendations from "@/components/ReadingRecommendations";
import PDFButton from "@/components/PDFButton";
import { generateReadingPDF, type ReadingPDFConfig } from "@/lib/generateReadingPDF";
import { useLiveSync } from "@/lib/useLiveSync";

const TEXT = `The concept of the attention economy rests on a simple but profound premise: in an age of information abundance, human attention has become the scarcest and most valuable resource. Technology companies, media platforms and advertisers compete aggressively for a finite commodity that cannot be manufactured or expanded. The phrase was popularised by psychologist and Nobel laureate Herbert Simon, who observed in 1971 that information consumes the attention of its recipients and that a wealth of information creates a poverty of attention. Economists later extended this insight, arguing that time and cognitive focus are the true bottlenecks in modern information markets, not bandwidth or storage.

The mechanisms by which platforms capture and retain attention have grown increasingly sophisticated. Variable reward schedules, borrowed from behavioural psychology research on gambling, underpin the design of social media feeds. Unpredictable rewards, such as an unexpected like or a surprising post, trigger dopamine release and compel continued engagement more effectively than predictable ones. This architecture is not accidental. Former employees of major tech companies have testified that engagement metrics, rather than user wellbeing, drive product decisions. Push notifications, autoplay features and algorithmically curated feeds are all calibrated to minimise the moments at which a user might choose to disengage, creating what critics describe as frictionless compulsion loops.

The implications extend beyond individual behaviour. Some researchers argue that the commodification of attention has degraded the quality of public discourse by systematically rewarding outrage, simplification and tribal affiliation over nuance and complexity. When emotional arousal reliably generates clicks and shares, content producers — whether journalists, politicians or independent creators — face structural incentives to prioritise provocation over accuracy. Others contend that moral panics about technology are cyclical and that previous innovations, from the printing press to television, generated similar anxieties that ultimately proved overstated. These critics point to evidence that heavy social media users are not uniformly worse informed than non-users, and that the same platforms have been used to organise civic movements and disseminate public health information effectively.

What distinguishes the current moment, proponents of regulation argue, is the unprecedented scale, speed and personalisation of these systems, which may require novel regulatory frameworks rather than analogies to earlier media. Unlike the printing press or broadcast television, modern recommendation engines are not passive distributors of content; they are active architects of individual information environments, adjusting in real time to maximise the probability of continued engagement. Proposals range from mandating algorithmic transparency and data minimisation to introducing legal duties of care requiring platforms to demonstrate that their designs do not cause foreseeable psychological harm.`;

type Question = {
  id: number;
  text: string;
  options: { label: string; text: string }[];
  answer: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "According to Herbert Simon's 1971 observation, what is the consequence of an abundance of information?",
    options: [
      { label: "A", text: "It raises the market value of advertising." },
      { label: "B", text: "It creates a scarcity of human attention." },
      { label: "C", text: "It improves the quality of public discourse." },
    ],
    answer: "B",
  },
  {
    id: 2,
    text: "The text states that variable reward schedules used in social media design are borrowed from research into which field?",
    options: [
      { label: "A", text: "Neuroscience and brain-scanning studies." },
      { label: "B", text: "Behavioural psychology research on gambling." },
      { label: "C", text: "Cognitive science and attention management." },
    ],
    answer: "B",
  },
  {
    id: 3,
    text: "What does the text say primarily drives product decisions at major tech companies, according to former employees?",
    options: [
      { label: "A", text: "User wellbeing and mental health outcomes." },
      { label: "B", text: "Regulatory compliance and legal obligations." },
      { label: "C", text: "Engagement metrics rather than user wellbeing." },
    ],
    answer: "C",
  },
  {
    id: 4,
    text: "According to some researchers cited in the text, how has the commodification of attention affected public discourse?",
    options: [
      { label: "A", text: "It has encouraged nuanced and complex debate." },
      { label: "B", text: "It has degraded discourse by rewarding outrage and simplification." },
      { label: "C", text: "It has had no measurable effect on public conversation." },
    ],
    answer: "B",
  },
  {
    id: 5,
    text: "What is the counterargument presented against concerns about the attention economy?",
    options: [
      { label: "A", text: "Attention is not actually a finite resource and can be expanded through training." },
      { label: "B", text: "Tech companies have already agreed to voluntary regulation." },
      { label: "C", text: "Moral panics about new technologies are recurrent and often prove to have been exaggerated." },
    ],
    answer: "C",
  },
  {
    id: 6,
    text: "According to proponents of regulation, what makes the current situation distinct from earlier media developments?",
    options: [
      { label: "A", text: "The unprecedented scale, speed and personalisation of current systems." },
      { label: "B", text: "The fact that attention was not commodified by previous media." },
      { label: "C", text: "The absence of any historical analogies to draw lessons from." },
    ],
    answer: "A",
  },
];

export default function AttentionEconomyClient() {
  const isPro = useIsPro();
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [checked, setChecked] = useState(false);

  const { isLive, broadcast } = useLiveSync((payload) => {
    setAnswers(payload.answers as Record<number, string | null>);
    setChecked(payload.checked as boolean);
  });

  const [pdfLoading, setPdfLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const answeredCount = QUESTIONS.filter((q) => answers[q.id] != null).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const correctCount = checked
    ? QUESTIONS.reduce((n, q) => n + (answers[q.id] === q.answer ? 1 : 0), 0)
    : null;
  const percent =
    correctCount !== null
      ? Math.round((correctCount / QUESTIONS.length) * 100)
      : null;

  function pick(id: number, label: string) {
    if (checked) return;
    setAnswers((prev) => { const n = { ...prev, [id]: label }; broadcast({ answers: n, checked: false, exNo: 1 }); return n; });
  }

  function check() {
    if (!allAnswered) return;
    setChecked(true);
    broadcast({ answers, checked: true, exNo: 1 });
    setTimeout(() => {
      if (resultsRef.current) {
        const top =
          resultsRef.current.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 50);
  }

  function reset() {
    setAnswers({});
    setChecked(false);
    broadcast({ answers: {}, checked: false, exNo: 1 });
  }

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const config: ReadingPDFConfig = {
        title: "The Attention Economy",
        level: "C1",
        filename: "EnglishNerd_Attention-Economy_C1.pdf",
        passages: [{ text: TEXT }],
        multipleChoiceLetter: QUESTIONS.map((q) => ({
          question: q.text,
          options: q.options,
          answer: q.answer,
        })),
      };
      await generateReadingPDF(config);
    } finally {
      setPdfLoading(false);
    }
  }

  useEffect(() => {
    if (!checked || percent === null) return;
    fetch("/api/progress/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "reading",
        level: "c1",
        slug: "the-attention-economy",
        exerciseNo: 1,
        score: percent,
        questionsTotal: 6,
      }),
    }).catch(() => {});
  }, [checked, percent]);

  const grade =
    percent === null
      ? null
      : percent >= 80
      ? "great"
      : percent >= 60
      ? "ok"
      : "low";

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <a className="hover:text-slate-900 transition" href="/">Home</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/reading">Reading</a>
        <span className="text-slate-300">/</span>
        <a className="hover:text-slate-900 transition" href="/reading/c1">C1</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">The Attention Economy</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          The Attention Economy
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 border border-rose-200">
          C1
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Read the article and fill in the blanks with the correct words from the word bank.
      </p>

      <div className="mt-3 flex items-center gap-3">
        <PDFButton onDownload={downloadPDF} loading={pdfLoading} />
      </div>

      {/* Layout grid */}
      <div className={`mt-10 grid gap-6 ${isPro ? "lg:grid-cols-[1fr_300px]" : "lg:grid-cols-[260px_1fr_260px]"}`}>
        {!isPro && <AdUnit variant="sidebar-dark" />}

        {/* Main content card */}
        <section className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur overflow-hidden">
          <div className="p-6 md:p-8">

        {/* Reading text */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-base font-black text-slate-800 uppercase tracking-wide mb-4">
            Read the text
          </h2>
          <div className="space-y-4">
            {TEXT.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-slate-700 leading-relaxed text-base">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
            <span>Progress</span>
            <span>{answeredCount} / {QUESTIONS.length}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
              style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div ref={resultsRef} className="mt-6 flex flex-col gap-5">
          {QUESTIONS.map((q) => {
            const chosen = answers[q.id];
            const isCorrect = checked ? chosen === q.answer : null;

            return (
              <div
                key={q.id}
                className={`rounded-2xl border bg-white shadow-sm p-5 transition ${
                  checked && isCorrect === true
                    ? "border-emerald-400 bg-emerald-50"
                    : checked && isCorrect === false
                    ? "border-red-400 bg-red-50"
                    : "border-slate-200"
                }`}
              >
                <p
                  className={`font-semibold text-sm leading-relaxed mb-4 ${
                    checked && isCorrect === true
                      ? "text-emerald-700"
                      : checked && isCorrect === false
                      ? "text-red-700"
                      : "text-slate-800"
                  }`}
                >
                  <span className="mr-2 text-slate-400 font-normal text-xs">{q.id}.</span>
                  {q.text}
                </p>

                <div className="flex flex-col gap-2">
                  {q.options.map((opt) => {
                    const selected = chosen === opt.label;
                    const isThisCorrect = opt.label === q.answer;

                    let btnClass =
                      "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold text-left transition ";

                    if (!checked) {
                      btnClass += selected
                        ? "bg-[#F5DA20]/20 border-[#F5DA20] text-slate-800"
                        : "border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50 cursor-pointer";
                    } else {
                      if (selected && isThisCorrect) {
                        btnClass += "bg-emerald-50 border-emerald-400 text-emerald-700";
                      } else if (selected && !isThisCorrect) {
                        btnClass += "bg-red-50 border-red-400 text-red-700";
                      } else if (!selected && isThisCorrect) {
                        btnClass += "bg-emerald-50 border-emerald-300 text-emerald-700";
                      } else {
                        btnClass += "border-slate-200 text-slate-400";
                      }
                    }

                    return (
                      <button
                        key={opt.label}
                        type="button"
                        className={btnClass}
                        onClick={() => pick(q.id, opt.label)}
                        disabled={checked}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black border ${
                            !checked
                              ? selected
                                ? "bg-[#F5DA20] border-[#F5DA20] text-black"
                                : "border-slate-300 text-slate-500"
                              : isThisCorrect
                              ? "bg-emerald-400 border-emerald-400 text-white"
                              : selected
                              ? "bg-red-400 border-red-400 text-white"
                              : "border-slate-300 text-slate-400"
                          }`}
                        >
                          {opt.label}
                        </span>
                        <span>{opt.text}</span>
                        {checked && isThisCorrect && (
                          <span className="ml-auto text-emerald-500 font-black text-base">
                            ✓
                          </span>
                        )}
                        {checked && selected && !isThisCorrect && (
                          <span className="ml-auto text-red-500 font-black text-base">
                            ✗
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Check / score area */}
        <div className="mt-8 flex flex-col items-center gap-4">
          {!checked ? (
            <button
              type="button"
              onClick={check}
              disabled={!allAnswered}
              className={`rounded-2xl px-8 py-3 text-base font-black transition ${
                allAnswered
                  ? "bg-[#F5DA20] text-black hover:opacity-90"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {allAnswered ? "Check Answers" : `Answer all ${QUESTIONS.length} questions`}
            </button>
          ) : (
            <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm p-6 text-center">
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">
                Your score
              </p>
              <p
                className={`mt-1 text-5xl font-black ${
                  grade === "great"
                    ? "text-emerald-500"
                    : grade === "ok"
                    ? "text-[#F5DA20]"
                    : "text-red-500"
                }`}
              >
                {correctCount} / {QUESTIONS.length}
              </p>
              <p className="mt-1 text-slate-500 text-sm">{percent}% correct</p>
              <p className="mt-3 text-slate-700 font-semibold">
                {grade === "great"
                  ? "Outstanding analytical reading. Well done."
                  : grade === "ok"
                  ? "Good effort. Re-read the relevant paragraphs for any questions you missed."
                  : "Keep practising. Read the text carefully, paying attention to how each argument is qualified."}
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-4 rounded-xl border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

          </div>
        </section>

        {isPro ? (
          <ReadingRecommendations level="c1" currentSlug="the-attention-economy" />
        ) : (
          <AdUnit variant="sidebar-dark" />
        )}
      </div>
    </div>
  );
}
