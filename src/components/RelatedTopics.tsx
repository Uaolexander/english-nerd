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

function RelatedCard({ ex, basePath }: { ex: Exercise; basePath: string }) {
  return (
    <article className="group relative w-[200px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#121216] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 sm:w-full sm:shrink">
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
          <a
            href={`${basePath}/${ex.slug}`}
            className="relative z-20 inline-flex items-center justify-center rounded-lg bg-[#F5DA20] px-3 py-1.5 text-xs font-bold text-black hover:opacity-90 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
          >
            Start
          </a>
        </div>
      </div>
    </article>
  );
}

export default function RelatedTopics({
  exercises,
  basePath,
}: {
  exercises: Exercise[];
  basePath: string;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-lg" />
        <div>
          <h2 className="text-xl font-black text-white">Related Topics</h2>
          <p className="text-xs text-white/50">Key grammar points and comparisons</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 sm:-mx-0 sm:px-0 lg:grid-cols-4">
        {exercises.map((ex) => (
          <div key={ex.slug} className="snap-start">
            <RelatedCard ex={ex} basePath={basePath} />
          </div>
        ))}
      </div>
    </div>
  );
}
