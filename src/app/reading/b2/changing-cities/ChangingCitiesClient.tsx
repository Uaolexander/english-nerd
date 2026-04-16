"use client";

import { useState, useEffect, useRef } from "react";
import AdUnit from "@/components/AdUnit";
import { useIsPro } from "@/lib/ProContext";
import ReadingRecommendations from "@/components/ReadingRecommendations";
import PDFButton from "@/components/PDFButton";
import { generateReadingPDF, type ReadingPDFConfig } from "@/lib/generateReadingPDF";

type Planner = {
  name: string;
  role: string;
  city: string;
  color: string;
  bgColor: string;
  borderColor: string;
  text: string;
};

const PLANNERS: Planner[] = [
  {
    name: "Dr. Rivera",
    role: "Urban Planner",
    city: "Barcelona",
    color: "text-violet-500",
    bgColor: "bg-violet-500/8",
    borderColor: "border-violet-500",
    text:
      "The 15-minute city concept represents one of the most promising shifts in modern urban thinking. When residents can reach essential services such as schools, healthcare, shops and workplaces within 15 minutes on foot or by bicycle, car dependency falls substantially. Barcelona has already begun implementing this model through its superblock programme, which reclaims street space for pedestrians and cyclists. In addition to reducing emissions, the introduction of green spaces within these redesigned districts has demonstrated measurable improvements in residents' mental health and social cohesion. However, I must caution that urban renewal projects rarely benefit all communities equally. Gentrification tends to follow investment, pushing lower-income residents out of improved neighbourhoods. Any policy that ignores this risk is incomplete.",
  },
  {
    name: "Prof. Chen",
    role: "Architect",
    city: "Singapore",
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/8",
    borderColor: "border-emerald-500",
    text:
      "Singapore has demonstrated conclusively that density and sustainability are not mutually exclusive. Our vertical green buildings, sky gardens and rooftop parks integrate nature directly into the urban fabric, providing ecological corridors for wildlife while reducing the urban heat island effect. The Jewel at Changi Airport and the Parkroyal on Pickering are internationally recognised examples of what biophilic architecture can achieve at scale. That said, I am concerned by a tendency in many cities to prioritise aesthetic innovation over practical necessity. Spectacular green facades attract investment and tourism, but if affordable housing is not kept at the centre of planning decisions, we risk creating beautiful cities that only the wealthy can afford to inhabit.",
  },
  {
    name: "Ms. Thompson",
    role: "City Councillor",
    city: "London",
    color: "text-sky-600",
    bgColor: "bg-sky-500/8",
    borderColor: "border-sky-500",
    text:
      "Mixed-use zoning has transformed several of London's most challenging neighbourhoods. When residential, commercial and recreational spaces are integrated rather than separated, communities become more vibrant and resilient. In the areas I oversee, we have observed a meaningful reduction in crime rates since redevelopment introduced active frontages, better lighting and community spaces. What concerns me most, however, is the continued reliance on road-building as a solution to congestion. Evidence consistently shows that new roads generate additional traffic rather than reducing it. Investment in reliable, affordable public transport is far more effective at reducing congestion and improving air quality. Cities that keep building roads are postponing the difficult decisions they ultimately cannot avoid.",
  },
  {
    name: "Mr. Okafor",
    role: "Urban Development Consultant",
    city: "Lagos",
    color: "text-orange-500",
    bgColor: "bg-orange-500/8",
    borderColor: "border-orange-500",
    text:
      "African cities are expanding faster than any other urban region in the world, and the planning frameworks being applied to them are frequently borrowed wholesale from Western contexts where they do not belong. Lagos alone adds hundreds of thousands of residents each year. In this environment, demolishing informal settlements and replacing them with formal housing projects has repeatedly failed, displacing communities without genuinely improving their lives. A far more effective approach is to upgrade existing settlements by providing clean water, sanitation, paved roads and legal tenure. Residents invest in their own homes when they feel secure. Western planners often underestimate the ingenuity and social organisation already present in these communities. Listening to residents rather than imposing external models is not optional; it is essential.",
  },
];

type Statement = {
  id: number;
  text: string;
  answer: boolean;
  planner: string;
};

const STATEMENTS: Statement[] = [
  {
    id: 1,
    text: "Dr. Rivera believes that the 15-minute city concept eliminates car use entirely.",
    answer: false,
    planner: "Dr. Rivera",
  },
  {
    id: 2,
    text: "Dr. Rivera warns that urban renewal can lead to gentrification.",
    answer: true,
    planner: "Dr. Rivera",
  },
  {
    id: 3,
    text: "Prof. Chen argues that Singapore proves dense cities can be sustainable.",
    answer: true,
    planner: "Prof. Chen",
  },
  {
    id: 4,
    text: "Prof. Chen believes most cities currently focus too much on affordable housing.",
    answer: false,
    planner: "Prof. Chen",
  },
  {
    id: 5,
    text: "Ms. Thompson has observed that mixed-use zoning contributed to lower crime rates.",
    answer: true,
    planner: "Ms. Thompson",
  },
  {
    id: 6,
    text: "Ms. Thompson thinks building new roads is the most effective way to reduce congestion.",
    answer: false,
    planner: "Ms. Thompson",
  },
  {
    id: 7,
    text: "Mr. Okafor argues that informal settlements should be upgraded rather than demolished.",
    answer: true,
    planner: "Mr. Okafor",
  },
  {
    id: 8,
    text: "Mr. Okafor suggests that Western planning models are well suited to African cities.",
    answer: false,
    planner: "Mr. Okafor",
  },
];

export default function ChangingCitiesClient() {
  const isPro = useIsPro();
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [checked, setChecked] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  async function downloadPDF() {
    setPdfLoading(true);
    try {
      const config: ReadingPDFConfig = {
        title: "Changing Cities",
        level: "B2",
        filename: "EnglishNerd_Changing-Cities_B2.pdf",
        passages: PLANNERS.map((p) => ({
          speaker: p.name,
          speakerSub: `${p.role} · ${p.city}`,
          text: p.text,
        })),
        trueFalse: STATEMENTS.map((s) => ({ text: s.text, answer: s.answer })),
      };
      await generateReadingPDF(config);
    } finally {
      setPdfLoading(false);
    }
  }

  const answeredCount = STATEMENTS.filter((s) => answers[s.id] != null).length;
  const allAnswered = answeredCount === STATEMENTS.length;

  const correctCount = checked
    ? STATEMENTS.reduce((n, s) => n + (answers[s.id] === s.answer ? 1 : 0), 0)
    : null;
  const percent =
    correctCount !== null
      ? Math.round((correctCount / STATEMENTS.length) * 100)
      : null;

  function pick(id: number, val: boolean) {
    if (checked) return;
    setAnswers((prev) => ({ ...prev, [id]: val }));
  }

  function check() {
    if (!allAnswered) return;
    setChecked(true);
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
  }

  useEffect(() => {
    if (!checked || percent === null) return;
    fetch("/api/progress/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: "reading",
        level: "b2",
        slug: "changing-cities",
        exerciseNo: 1,
        score: percent,
        questionsTotal: 8,
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
        <a className="hover:text-slate-900 transition" href="/reading/b2">B2</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-medium">Changing Cities</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          Changing Cities
        </h1>
        <span className="mt-2 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 border border-violet-200">
          B2
        </span>
      </div>

      <p className="mt-3 max-w-3xl text-slate-700">
        Read the article and choose the best answer for each question.
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

            {/* Planners grid */}
            <div className="grid gap-5 sm:grid-cols-2">
              {PLANNERS.map((p) => (
                <div
                  key={p.name}
                  className={`rounded-2xl border border-slate-200 border-l-4 ${p.borderColor} ${p.bgColor} bg-white shadow-sm p-6`}
                >
                  <div className="flex items-baseline gap-2">
                    <h2 className={`text-base font-black ${p.color}`}>{p.name}</h2>
                    <span className="text-xs text-slate-400 font-medium">
                      {p.role}, {p.city}
                    </span>
                  </div>
                  <p className="mt-3 text-slate-700 leading-relaxed text-base">{p.text}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                <span>Progress</span>
                <span>{answeredCount} / {STATEMENTS.length}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#F5DA20] transition-all duration-300"
                  style={{ width: `${(answeredCount / STATEMENTS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Statements */}
            <div ref={resultsRef} className="mt-6 flex flex-col gap-4">
              {STATEMENTS.map((s) => {
                const chosen = answers[s.id];
                const isCorrect = checked ? chosen === s.answer : null;

                return (
                  <div
                    key={s.id}
                    className={`rounded-2xl border bg-white shadow-sm p-5 transition ${
                      checked && isCorrect === true
                        ? "border-emerald-400 bg-emerald-50"
                        : checked && isCorrect === false
                        ? "border-red-400 bg-red-50"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <p
                        className={`font-semibold text-base ${
                          checked && isCorrect === true
                            ? "text-emerald-700"
                            : checked && isCorrect === false
                            ? "text-red-700"
                            : "text-slate-800"
                        }`}
                      >
                        <span className="mr-2 text-slate-400 font-normal text-sm">
                          {s.id}.
                        </span>
                        {s.text}
                      </p>

                      <div className="flex gap-2 shrink-0">
                        {(["TRUE", "FALSE"] as const).map((label) => {
                          const val = label === "TRUE";
                          const selected = chosen === val;
                          let btnClass =
                            "rounded-xl border px-4 py-2 text-sm font-bold transition select-none ";

                          if (!checked) {
                            btnClass += selected
                              ? "bg-[#F5DA20] border-[#F5DA20] text-black"
                              : "border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700 cursor-pointer";
                          } else {
                            const isThisCorrect = val === s.answer;
                            if (selected && isThisCorrect) {
                              btnClass += "bg-emerald-400 border-emerald-400 text-white";
                            } else if (selected && !isThisCorrect) {
                              btnClass += "bg-red-400 border-red-400 text-white";
                            } else if (!selected && isThisCorrect) {
                              btnClass += "bg-emerald-100 border-emerald-400 text-emerald-700";
                            } else {
                              btnClass += "border-slate-200 text-slate-300";
                            }
                          }

                          return (
                            <button
                              key={label}
                              type="button"
                              className={btnClass}
                              onClick={() => pick(s.id, val)}
                              disabled={checked}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {checked && (
                      <div className="mt-2 text-sm">
                        {isCorrect ? (
                          <span className="text-emerald-600 font-semibold">
                            Correct! The statement is {s.answer ? "True" : "False"}.
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">
                            Wrong. The correct answer is{" "}
                            <span className="uppercase font-black">
                              {s.answer ? "True" : "False"}
                            </span>
                            .
                          </span>
                        )}
                      </div>
                    )}
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
                  {allAnswered ? "Check Answers" : `Answer all ${STATEMENTS.length} questions`}
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
                    {correctCount} / {STATEMENTS.length}
                  </p>
                  <p className="mt-1 text-slate-500 text-sm">{percent}% correct</p>
                  <p className="mt-3 text-slate-700 font-semibold">
                    {grade === "great"
                      ? "Excellent work! Your reading comprehension is strong."
                      : grade === "ok"
                      ? "Good effort. Review the planners' texts to understand any mistakes."
                      : "Keep practising. Reread the texts carefully and try again."}
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
          <ReadingRecommendations level="b2" currentSlug="changing-cities" />
        ) : (
          <AdUnit variant="sidebar-dark" />
        )}
      </div>
    </div>
  );
}
