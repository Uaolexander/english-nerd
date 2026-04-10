"use client";

import { useIsPro } from "@/lib/ProContext";
import ImageWithFallback from "@/components/ImageWithFallback";

type Exercise = {
  slug: string;
  imageSlug?: string;
  title: string;
  label: string;
  description: string;
  difficulty: string;
  difficultyColor: string;
};

function LockedCard({ ex, basePath }: { ex: Exercise; basePath: string }) {
  return (
    <article className="group relative w-[200px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#121216] sm:w-full sm:shrink">
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden border-b border-white/10 bg-black/30">
        <ImageWithFallback
          src={`/topics/exercises/${ex.imageSlug ?? ex.slug}.jpg`}
          alt={ex.title}
          className="h-full w-full object-cover opacity-30 blur-[1px]"
        />
        <div className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-black text-black shadow-lg sm:top-3 sm:right-3 sm:px-3 sm:py-1 sm:text-xs ${ex.difficultyColor} opacity-40`}>
          {ex.difficulty}
        </div>
        {/* Lock overlay */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F5DA20] shadow-xl shadow-black/40 ring-2 ring-black/15">
            <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
          </div>
          <span className="rounded-full bg-[#F5DA20] px-2.5 py-0.5 text-[10px] font-black text-black">PRO</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5">
        <h3 className="text-sm font-black leading-snug text-white/55 sm:text-xl">{ex.title}</h3>
        <p className="mt-1 text-[11px] text-white/45 leading-relaxed sm:mt-2 sm:text-sm">{ex.description}</p>

        <div className="mt-3 sm:mt-4">
          <a
            href="/pro"
            className="absolute inset-0 z-10"
            aria-label={`Unlock ${ex.title} — PRO feature`}
          />
          <code className="relative z-20 mb-3 block rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-mono text-white/50 sm:rounded-lg sm:px-2.5 sm:text-[11px]">
            {ex.label}
          </code>
          <button
            className="relative z-20 inline-flex items-center gap-1.5 justify-center rounded-lg bg-[#F5DA20] px-3 py-1.5 text-xs font-bold text-black hover:opacity-90 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
            type="button"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            Unlock PRO
          </button>
        </div>
      </div>
    </article>
  );
}

function UnlockedCard({ ex, basePath }: { ex: Exercise; basePath: string }) {
  return (
    <article className="group relative w-[200px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#121216] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 sm:w-full sm:shrink">
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden border-b border-white/10 bg-black/30">
        <ImageWithFallback
          src={`/topics/exercises/${ex.imageSlug ?? ex.slug}.jpg`}
          alt={ex.title}
          className="h-full w-full object-cover"
        />
        <div className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-black text-black shadow-lg sm:top-3 sm:right-3 sm:px-3 sm:py-1 sm:text-xs ${ex.difficultyColor}`}>
          {ex.difficulty}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5">
        <h3 className="text-sm font-black leading-snug text-white sm:text-xl">{ex.title}</h3>
        <p className="mt-1 text-[11px] text-white/55 leading-relaxed sm:mt-2 sm:text-sm">{ex.description}</p>

        <div className="mt-3 sm:mt-4">
          <a
            href={`${basePath}/${ex.slug}`}
            className="absolute inset-0 z-10"
            aria-label={ex.title}
          />
          <code className="relative z-20 mb-3 block rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-mono text-white/50 sm:rounded-lg sm:px-2.5 sm:text-[11px]">
            {ex.label}
          </code>
          <button
            className="relative z-20 inline-flex items-center justify-center rounded-lg bg-[#F5DA20] px-3 py-1.5 text-xs font-bold text-black hover:opacity-90 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
            type="button"
          >
            Start
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ProRelatedTopics({
  exercises,
  basePath,
}: {
  exercises: Exercise[];
  basePath: string;
}) {
  const isPro = useIsPro();

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-lg" />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white">Related Topics</h2>
            {!isPro && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F5DA20] px-2.5 py-0.5 text-[10px] font-black text-black">
                <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                PRO
              </span>
            )}
          </div>
          <p className="text-xs text-white/50">Key grammar points and comparisons</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 sm:-mx-0 sm:px-0 lg:grid-cols-4">
        {exercises.map((ex) => (
          <div key={ex.slug} className="snap-start">
            {isPro ? (
              <UnlockedCard ex={ex} basePath={basePath} />
            ) : (
              <LockedCard ex={ex} basePath={basePath} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
