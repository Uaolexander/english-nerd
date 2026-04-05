"use client";

export interface GrammarRec {
  title: string;
  href: string;
  img?: string;      // optional override; auto-derived from href if omitted
  level: string;
  badge: string;     // Tailwind bg class, e.g. "bg-violet-500"
  reason?: string;
}

interface Props {
  recommendations: GrammarRec[];
  allHref: string;
  allLabel: string;
}

// A handful of A1 folders have image filenames that differ from the folder name
const FOLDER_IMG_MAP: Record<string, string> = {
  "adverbs-frequency": "adverbs-of-frequency",
  "much-many-basic": "much-many",
  "prepositions-place": "prepositions-of-place",
  "prepositions-time-in-on-at": "prepositions-of-time-in-on-at",
};

function deriveImg(rec: GrammarRec): string {
  if (rec.img) return rec.img;
  // href = "/grammar/a1/can-cant"  →  "/topics/a1/can-cant.jpg"
  const parts = rec.href.split("/").filter(Boolean); // ["grammar","a1","can-cant"]
  if (parts.length < 3) return "";
  const level = parts[1];
  const folder = parts[2];
  const filename = FOLDER_IMG_MAP[folder] ?? folder;
  return `/topics/${level}/${filename}.jpg`;
}

export default function GrammarRecommended({ recommendations, allHref, allLabel }: Props) {
  return (
    <aside className="sticky top-24 flex flex-col gap-3">
      <p className="px-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
        Recommended for you
      </p>

      {recommendations.map((rec) => {
        const imgSrc = deriveImg(rec);
        return (
          <a
            key={rec.href}
            href={rec.href}
            className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative h-28 w-full overflow-hidden bg-slate-100">
              <img
                src={imgSrc}
                alt={rec.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <span
                className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-md ${rec.badge}`}
              >
                {rec.level}
              </span>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm font-bold leading-snug text-slate-800 transition group-hover:text-slate-900">
                {rec.title}
              </p>
              {rec.reason && (
                <p className="mt-1 text-[11px] font-semibold leading-snug text-amber-600">
                  {rec.reason}
                </p>
              )}
            </div>
          </a>
        );
      })}

      <a
        href={allHref}
        className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
      >
        {allLabel}
        <svg
          className="h-3 w-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </a>
    </aside>
  );
}
