"use client";

import Image from "next/image";

type Rec = { title: string; href: string; img: string; level: string; badge: string; reason?: string };

const LEVEL_RECS: Record<string, { items: Rec[]; allHref: string; allLabel: string }> = {
  a1: {
    allHref: "/vocabulary/a1",
    allLabel: "All A1 vocabulary",
    items: [
      { title: "Animals", href: "/vocabulary/a1/animals", img: "/topics/vocabulary/a1/animals.jpg", level: "A1", badge: "bg-emerald-500" },
      { title: "My Body", href: "/vocabulary/a1/my-body", img: "/topics/vocabulary/a1/my-body.jpg", level: "A1", badge: "bg-emerald-500", reason: "Essential for everyday conversations" },
      { title: "My Family", href: "/vocabulary/a1/my-family", img: "/topics/vocabulary/a1/my-family.jpg", level: "A1", badge: "bg-emerald-500" },
    ],
  },
  a2: {
    allHref: "/vocabulary/a2",
    allLabel: "All A2 vocabulary",
    items: [
      { title: "Around the Town", href: "/vocabulary/a2/around-the-town", img: "/topics/vocabulary/a2/around-the-town.jpg", level: "A2", badge: "bg-teal-500" },
      { title: "At the Restaurant", href: "/vocabulary/a2/at-the-restaurant", img: "/topics/vocabulary/a2/at-the-restaurant.jpg", level: "A2", badge: "bg-teal-500", reason: "Great for real-life situations" },
      { title: "Clothes & Shopping", href: "/vocabulary/a2/clothes-and-shopping", img: "/topics/vocabulary/a2/clothes-and-shopping.jpg", level: "A2", badge: "bg-teal-500" },
    ],
  },
  b1: {
    allHref: "/vocabulary/b1",
    allLabel: "All B1 vocabulary",
    items: [
      { title: "City Life", href: "/vocabulary/b1/city-life", img: "/topics/vocabulary/b1/city-life.jpg", level: "B1", badge: "bg-blue-500" },
      { title: "Health & Fitness", href: "/vocabulary/b1/health-and-fitness", img: "/topics/vocabulary/b1/health-and-fitness.jpg", level: "B1", badge: "bg-blue-500", reason: "Very common in B1 exams" },
      { title: "Job Interview", href: "/vocabulary/b1/job-interview", img: "/topics/vocabulary/b1/job-interview.jpg", level: "B1", badge: "bg-blue-500" },
    ],
  },
  b2: {
    allHref: "/vocabulary/b2",
    allLabel: "All B2 vocabulary",
    items: [
      { title: "Business Meeting", href: "/vocabulary/b2/business-meeting", img: "/topics/vocabulary/b2/business-meeting.jpg", level: "B2", badge: "bg-violet-500" },
      { title: "Environment", href: "/vocabulary/b2/environment", img: "/topics/vocabulary/b2/environment.jpg", level: "B2", badge: "bg-violet-500", reason: "Key topic in B2 & IELTS" },
      { title: "Media & Technology", href: "/vocabulary/b2/media-and-technology", img: "/topics/vocabulary/b2/media-and-technology.jpg", level: "B2", badge: "bg-violet-500" },
    ],
  },
  c1: {
    allHref: "/vocabulary/c1",
    allLabel: "All C1 vocabulary",
    items: [
      { title: "Academic Debate", href: "/vocabulary/c1/academic-debate", img: "/topics/vocabulary/c1/academic-debate.jpg", level: "C1", badge: "bg-rose-500" },
      { title: "Formal English", href: "/vocabulary/c1/formal-english", img: "/topics/vocabulary/c1/formal-english.jpg", level: "C1", badge: "bg-rose-500", reason: "Essential for professional contexts" },
      { title: "Idioms & Phrases", href: "/vocabulary/c1/idioms-and-phrases", img: "/topics/vocabulary/c1/idioms-and-phrases.jpg", level: "C1", badge: "bg-rose-500" },
    ],
  },
};

export default function VocabRecommendations({ level }: { level: string }) {
  const data = LEVEL_RECS[level.toLowerCase()];
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
            <Image
              src={rec.img}
              alt={rec.title}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover transition duration-300 group-hover:scale-105"
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
