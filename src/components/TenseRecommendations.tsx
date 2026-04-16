"use client";

type Rec = { title: string; href: string; img: string; level: string; badge: string; reason?: string };

const RECS: Record<string, { items: Rec[]; allHref: string; allLabel: string }> = {
  "past-simple": {
    allHref: "/tenses/past-simple",
    allLabel: "All Past Simple exercises",
    items: [
      { title: "Regular Past Simple", href: "/tenses/past-simple/regular-past-simple", img: "/topics/exercises/regular-past-simple.jpg", level: "A2", badge: "bg-teal-500" },
      { title: "Irregular Past Simple", href: "/tenses/past-simple/irregular-past-simple", img: "/topics/exercises/irregular-past-simple.jpg", level: "A2", badge: "bg-teal-500", reason: "Essential verbs to memorise" },
      { title: "Past Simple Quiz", href: "/tenses/past-simple/quiz", img: "/topics/exercises/quiz.jpg", level: "A2", badge: "bg-teal-500" },
    ],
  },
  "past-continuous": {
    allHref: "/tenses/past-continuous",
    allLabel: "All Past Continuous exercises",
    items: [
      { title: "Was / Were + -ing", href: "/tenses/past-continuous/was-were-ing", img: "/topics/exercises/was-were-ing.jpg", level: "B1", badge: "bg-blue-500" },
      { title: "When / While", href: "/tenses/past-continuous/when-while", img: "/topics/exercises/when-while.jpg", level: "B1", badge: "bg-blue-500", reason: "Key linking words" },
      { title: "Past Continuous Quiz", href: "/tenses/past-continuous/quiz", img: "/topics/exercises/quiz.jpg", level: "B1", badge: "bg-blue-500" },
    ],
  },
  "present-perfect": {
    allHref: "/tenses/present-perfect",
    allLabel: "All Present Perfect exercises",
    items: [
      { title: "Have / Has + Past Participle", href: "/tenses/present-perfect/have-has", img: "/topics/exercises/have-has.jpg", level: "B1", badge: "bg-blue-500" },
      { title: "For / Since", href: "/tenses/present-perfect/for-since", img: "/topics/exercises/for-since.jpg", level: "B1", badge: "bg-blue-500", reason: "Very common in IELTS & B2" },
      { title: "Present Perfect Quiz", href: "/tenses/present-perfect/quiz", img: "/topics/exercises/quiz.jpg", level: "B1", badge: "bg-blue-500" },
    ],
  },
  "past-perfect": {
    allHref: "/tenses/past-perfect",
    allLabel: "All Past Perfect exercises",
    items: [
      { title: "Had + Past Participle", href: "/tenses/past-perfect/had-past-participle", img: "/topics/exercises/had-past-participle.jpg", level: "B2", badge: "bg-violet-500" },
      { title: "Past Perfect vs Past Simple", href: "/tenses/past-perfect/past-perfect-vs-past-simple", img: "/topics/exercises/past-perfect-vs-past-simple.jpg", level: "B2", badge: "bg-violet-500", reason: "Most confusing distinction" },
      { title: "Past Perfect Quiz", href: "/tenses/past-perfect/quiz", img: "/topics/exercises/quiz.jpg", level: "B2", badge: "bg-violet-500" },
    ],
  },
  "past-perfect-continuous": {
    allHref: "/tenses/past-perfect-continuous",
    allLabel: "All Past Perfect Continuous exercises",
    items: [
      { title: "Had Been + -ing", href: "/tenses/past-perfect-continuous/had-been-ing", img: "/topics/exercises/had-been-ing.jpg", level: "C1", badge: "bg-rose-500" },
      { title: "For / Since (Past)", href: "/tenses/past-perfect-continuous/for-since-past", img: "/topics/exercises/for-since-past.jpg", level: "C1", badge: "bg-rose-500" },
      { title: "PPC Quiz", href: "/tenses/past-perfect-continuous/quiz", img: "/topics/exercises/quiz.jpg", level: "C1", badge: "bg-rose-500" },
    ],
  },
  "future-simple": {
    allHref: "/tenses/future-simple",
    allLabel: "All Future Simple exercises",
    items: [
      { title: "Will / Won't", href: "/tenses/future-simple/will-wont", img: "/topics/exercises/will-wont.jpg", level: "B1", badge: "bg-blue-500" },
      { title: "Predictions", href: "/tenses/future-simple/predictions", img: "/topics/exercises/predictions.jpg", level: "B1", badge: "bg-blue-500" },
      { title: "Future Simple Quiz", href: "/tenses/future-simple/quiz", img: "/topics/exercises/quiz.jpg", level: "B1", badge: "bg-blue-500" },
    ],
  },
  "future-continuous": {
    allHref: "/tenses/future-continuous",
    allLabel: "All Future Continuous exercises",
    items: [
      { title: "Will Be + -ing", href: "/tenses/future-continuous/will-be-ing", img: "/topics/exercises/will-be-ing.jpg", level: "B2", badge: "bg-violet-500" },
      { title: "Polite Questions", href: "/tenses/future-continuous/polite-questions", img: "/topics/exercises/polite-questions.jpg", level: "B2", badge: "bg-violet-500", reason: "Great for formal English" },
      { title: "Future Continuous Quiz", href: "/tenses/future-continuous/quiz", img: "/topics/exercises/quiz.jpg", level: "B2", badge: "bg-violet-500" },
    ],
  },
  "future-perfect": {
    allHref: "/tenses/future-perfect",
    allLabel: "All Future Perfect exercises",
    items: [
      { title: "Will Have + Past Participle", href: "/tenses/future-perfect/will-have-past-participle", img: "/topics/exercises/will-have-past-participle.jpg", level: "C1", badge: "bg-rose-500" },
      { title: "By the Time", href: "/tenses/future-perfect/by-the-time", img: "/topics/exercises/by-the-time.jpg", level: "C1", badge: "bg-rose-500", reason: "Classic C1 connector" },
      { title: "Future Perfect Quiz", href: "/tenses/future-perfect/quiz", img: "/topics/exercises/quiz.jpg", level: "C1", badge: "bg-rose-500" },
    ],
  },
  "be-going-to": {
    allHref: "/tenses/be-going-to",
    allLabel: "All Be Going To exercises",
    items: [
      { title: "Am / Is / Are Going To", href: "/tenses/be-going-to/am-is-are-going-to", img: "/topics/exercises/am-is-are-going-to.jpg", level: "B1", badge: "bg-blue-500" },
      { title: "Plans & Intentions", href: "/tenses/be-going-to/plans-intentions", img: "/topics/exercises/plans-intentions.jpg", level: "B1", badge: "bg-blue-500" },
      { title: "Be Going To Quiz", href: "/tenses/be-going-to/quiz", img: "/topics/exercises/quiz.jpg", level: "B1", badge: "bg-blue-500" },
    ],
  },
  "future-perfect-continuous": {
    allHref: "/tenses/future-perfect-continuous",
    allLabel: "All Future Perfect Continuous exercises",
    items: [
      { title: "Will Have Been + -ing", href: "/tenses/future-perfect-continuous/will-have-been-ing", img: "/topics/exercises/will-have-been-ing.jpg", level: "C1", badge: "bg-rose-500" },
      { title: "For Duration (Future)", href: "/tenses/future-perfect-continuous/for-duration-future", img: "/topics/exercises/for-duration-future.jpg", level: "C1", badge: "bg-rose-500" },
      { title: "FPC Quiz", href: "/tenses/future-perfect-continuous/quiz", img: "/topics/exercises/quiz.jpg", level: "C1", badge: "bg-rose-500" },
    ],
  },
  "present-perfect-continuous": {
    allHref: "/tenses/present-perfect-continuous",
    allLabel: "All Present Perfect Continuous exercises",
    items: [
      { title: "Have Been + -ing", href: "/tenses/present-perfect-continuous/have-been-ing", img: "/topics/exercises/have-been-ing.jpg", level: "B2", badge: "bg-violet-500" },
      { title: "For / Since Duration", href: "/tenses/present-perfect-continuous/for-since-duration", img: "/topics/exercises/for-since-duration.jpg", level: "B2", badge: "bg-violet-500" },
      { title: "PPC Quiz", href: "/tenses/present-perfect-continuous/quiz", img: "/topics/exercises/quiz.jpg", level: "B2", badge: "bg-violet-500" },
    ],
  },
};

export default function TenseRecommendations({ tense }: { tense: string }) {
  const data = RECS[tense];
  if (!data) return null;

  return (
    <aside className="flex flex-col gap-3">
      <p className="px-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">Recommended for you</p>
      {data.items.map((rec) => (
        <a
          key={rec.href}
          href={rec.href}
          className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="relative h-32 w-full overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={rec.img}
              alt={rec.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md ${rec.badge}`}>
              {rec.level}
            </span>
          </div>
          <div className="px-4 py-3">
            <p className="text-sm font-bold leading-snug text-slate-800 transition group-hover:text-slate-900">{rec.title}</p>
            {rec.reason && (
              <p className="mt-1 text-[11px] font-semibold leading-snug text-amber-600">{rec.reason}</p>
            )}
          </div>
        </a>
      ))}
      <a
        href={data.allHref}
        className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
      >
        {data.allLabel}
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </a>
    </aside>
  );
}
