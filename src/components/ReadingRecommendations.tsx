"use client";

type Rec = { title: string; href: string; img: string; level: string; badge: string; type: string };

const ALL_RECS: Record<string, Rec> = {
  "four-friends":           { title: "Four Friends",              href: "/reading/a1/four-friends",              img: "/topics/reading/a1/four-friends.jpg",              level: "A1", badge: "bg-emerald-500", type: "True / False" },
  "my-school-day":          { title: "My School Day",             href: "/reading/a1/my-school-day",             img: "/topics/reading/a1/my-school-day.jpg",             level: "A1", badge: "bg-emerald-500", type: "True / False" },
  "at-the-market":          { title: "At the Market",             href: "/reading/a1/at-the-market",             img: "/topics/reading/a1/at-the-market.jpg",             level: "A1", badge: "bg-emerald-500", type: "Fill in Blank" },
  "city-or-country":        { title: "City or Country?",          href: "/reading/a2/city-or-country",           img: "/topics/reading/a2/city-or-country.jpg",           level: "A2", badge: "bg-teal-500",    type: "Fill in Blank" },
  "a-weekend-trip":         { title: "A Weekend Trip",            href: "/reading/a2/a-weekend-trip",            img: "/topics/reading/a2/a-weekend-trip.jpg",            level: "A2", badge: "bg-teal-500",    type: "True / False" },
  "pen-pals":               { title: "Pen Pals",                  href: "/reading/a2/pen-pals",                  img: "/topics/reading/a2/pen-pals.jpg",                  level: "A2", badge: "bg-teal-500",    type: "Multiple Choice" },
  "digital-lives":          { title: "Digital Lives",             href: "/reading/b1/digital-lives",             img: "/topics/reading/b1/digital-lives.jpg",             level: "B1", badge: "bg-blue-500",    type: "True / False" },
  "work-from-home":         { title: "Work from Home",            href: "/reading/b1/work-from-home",            img: "/topics/reading/b1/work-from-home.jpg",            level: "B1", badge: "bg-blue-500",    type: "Multiple Choice" },
  "the-slow-travel-movement": { title: "Slow Travel Movement",    href: "/reading/b1/the-slow-travel-movement",  img: "/topics/reading/b1/the-slow-travel-movement.jpg",  level: "B1", badge: "bg-blue-500",    type: "Fill in Blank" },
  "the-gig-economy":        { title: "The Gig Economy",           href: "/reading/b2/the-gig-economy",           img: "/topics/reading/b2/the-gig-economy.jpg",           level: "B2", badge: "bg-violet-500",  type: "Fill in Blank" },
  "changing-cities":        { title: "Changing Cities",           href: "/reading/b2/changing-cities",           img: "/topics/reading/b2/changing-cities.jpg",           level: "B2", badge: "bg-violet-500",  type: "Multiple Choice" },
  "the-psychology-of-habits": { title: "Psychology of Habits",   href: "/reading/b2/the-psychology-of-habits",  img: "/topics/reading/b2/the-psychology-of-habits.jpg",  level: "B2", badge: "bg-violet-500",  type: "True / False" },
  "rethinking-intelligence":{ title: "Rethinking Intelligence",   href: "/reading/c1/rethinking-intelligence",   img: "/topics/reading/c1/rethinking-intelligence.jpg",   level: "C1", badge: "bg-rose-500",    type: "True / False" },
  "language-and-thought":   { title: "Language and Thought",      href: "/reading/c1/language-and-thought",      img: "/topics/reading/c1/language-and-thought.jpg",      level: "C1", badge: "bg-rose-500",    type: "Multiple Choice" },
  "the-attention-economy":  { title: "The Attention Economy",     href: "/reading/c1/the-attention-economy",     img: "/topics/reading/c1/the-attention-economy.jpg",     level: "C1", badge: "bg-rose-500",    type: "Fill in Blank" },
};

const LEVEL_GROUPS: Record<string, string[]> = {
  a1: ["four-friends", "my-school-day", "at-the-market"],
  a2: ["city-or-country", "a-weekend-trip", "pen-pals"],
  b1: ["digital-lives", "work-from-home", "the-slow-travel-movement"],
  b2: ["the-gig-economy", "changing-cities", "the-psychology-of-habits"],
  c1: ["rethinking-intelligence", "language-and-thought", "the-attention-economy"],
};

const ALL_HREF: Record<string, string> = {
  a1: "/reading/a1", a2: "/reading/a2", b1: "/reading/b1", b2: "/reading/b2", c1: "/reading/c1",
};

const ALL_LABEL: Record<string, string> = {
  a1: "All A1 reading", a2: "All A2 reading", b1: "All B1 reading", b2: "All B2 reading", c1: "All C1 reading",
};

export default function ReadingRecommendations({ level, currentSlug }: { level: string; currentSlug: string }) {
  const lvl = level.toLowerCase();
  const group = LEVEL_GROUPS[lvl] ?? [];
  // Show up to 3 recs: prefer same level (excluding current), then next level
  const sameLevel = group.filter((s) => s !== currentSlug);
  const nextLevels: Record<string, string> = { a1: "a2", a2: "b1", b1: "b2", b2: "c1", c1: "b2" };
  const nextGroup = LEVEL_GROUPS[nextLevels[lvl]] ?? [];
  const candidates = [...sameLevel, ...nextGroup].slice(0, 3);

  if (candidates.length === 0) return null;

  return (
    <aside className="flex flex-col gap-3">
      <p className="px-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">More reading</p>
      {candidates.map((slug) => {
        const rec = ALL_RECS[slug];
        if (!rec) return null;
        return (
          <a
            key={slug}
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md ${rec.badge}`}>
                {rec.level}
              </span>
              <span className="absolute bottom-2 right-2.5 rounded-full bg-black/50 px-2 py-0.5 text-[9px] font-bold text-white/90">
                {rec.type}
              </span>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm font-bold leading-snug text-slate-800 transition group-hover:text-slate-900">{rec.title}</p>
            </div>
          </a>
        );
      })}
      <a
        href={ALL_HREF[lvl] ?? "/reading"}
        className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
      >
        {ALL_LABEL[lvl] ?? "All reading"}
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </a>
    </aside>
  );
}
