import ImageWithFallback from "@/components/ImageWithFallback";
import ProRelatedTopics from "@/components/ProRelatedTopics";
import AdUnit from "@/components/AdUnit";

export const metadata = {
  title: "Future Perfect Continuous Exercises — Practice English Grammar | English Nerd",
  description:
    "Practise the Future Perfect Continuous tense with multiple choice, fill-in-the-blank, spot-the-mistake, and sentence-builder exercises. Learn will have been + -ing, duration up to a future point, and the difference between Future Perfect and Future Perfect Continuous.",
  keywords: [
    "future perfect continuous exercises",
    "future perfect continuous practice",
    "will have been ing grammar",
    "duration future perfect continuous",
    "future perfect vs future perfect continuous",
    "english grammar C1",
  ],
};

type Exercise = {
  slug: string;
  imageSlug?: string;
  title: string;
  label: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  difficultyColor: string;
};

const EXERCISES: Exercise[] = [
  {
    slug: "quiz",
    title: "Multiple Choice",
    label: "Quiz",
    description: "Choose the correct Future Perfect Continuous form from four options.",
    difficulty: "Medium",
    difficultyColor: "bg-[#F5DA20]",
  },
  {
    slug: "fill-in-blank",
    title: "Fill in the Blank",
    label: "Writing",
    description: "Type the correct will have been + -ing form to complete the sentence.",
    difficulty: "Hard",
    difficultyColor: "bg-rose-400",
  },
  {
    slug: "spot-the-mistake",
    title: "Spot the Mistake",
    label: "Sharp eye",
    description: "Find the error: missing 'been', wrong auxiliary chain, or wrong verb form.",
    difficulty: "Hard",
    difficultyColor: "bg-rose-400",
  },
  {
    slug: "sentence-builder",
    imageSlug: "sentence-builder-future-perfect-continuous",
    title: "Sentence Builder",
    label: "Order",
    description: "Rearrange the words to build a correct Future Perfect Continuous sentence.",
    difficulty: "Hard",
    difficultyColor: "bg-rose-400",
  },
];

const RELATED: Exercise[] = [
  {
    slug: "will-have-been-ing",
    title: "will have been + -ing",
    label: "Structure",
    description: "Form the tense step by step: will + have + been + verb-ing.",
    difficulty: "Medium",
    difficultyColor: "bg-[#F5DA20]",
  },
  {
    slug: "for-duration-future",
    title: "Duration Up to a Future Point",
    label: "Time",
    description: "By June, I will have been working here for 10 years. Measuring ongoing duration.",
    difficulty: "Hard",
    difficultyColor: "bg-rose-400",
  },
  {
    slug: "fp-vs-fpc",
    title: "Future Perfect vs Continuous",
    label: "Comparison",
    description: "I will have written vs I will have been writing. Completion vs ongoing effort.",
    difficulty: "Hard",
    difficultyColor: "bg-rose-400",
  },
  {
    slug: "all-future-tenses",
    title: "All Future Tenses",
    label: "Advanced",
    description: "will, going to, Continuous, Perfect, Perfect Continuous — choose the right one.",
    difficulty: "Hard",
    difficultyColor: "bg-rose-400",
  },
];

function ExerciseCard({ ex, basePath }: { ex: Exercise; basePath: string }) {
  return (
    <article className="group relative w-[200px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#121216] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 sm:w-full sm:shrink">
      <div className="relative aspect-square w-full overflow-hidden border-b border-white/10 bg-black/30">
        <ImageWithFallback src={`/topics/exercises/${ex.imageSlug ?? ex.slug}.jpg`} alt={ex.title} className="h-full w-full object-cover" />
        <div className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-black text-black shadow-lg sm:top-3 sm:right-3 sm:px-3 sm:py-1 sm:text-xs ${ex.difficultyColor}`}>{ex.difficulty}</div>
      </div>
      <div className="p-3 sm:p-5">
        <h3 className="text-sm font-black leading-snug text-white sm:text-xl">{ex.title}</h3>
        <p className="mt-1 text-[11px] text-white/55 leading-relaxed sm:mt-2 sm:text-sm">{ex.description}</p>
        <div className="mt-3 sm:mt-4">
          <a href={`${basePath}/${ex.slug}`} className="absolute inset-0 z-10" aria-label={ex.title} />
          <code className="relative z-20 mb-3 block rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-mono text-white/50 sm:rounded-lg sm:px-2.5 sm:text-[11px]">{ex.label}</code>
          <button className="relative z-20 inline-flex items-center justify-center rounded-lg bg-[#F5DA20] px-3 py-1.5 text-xs font-bold text-black hover:opacity-90 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm" type="button">Start</button>
        </div>
      </div>
    </article>
  );
}

function CardGroup({ label, sublabel, dotColor, exercises, basePath }: { label: string; sublabel: string; dotColor: string; exercises: Exercise[]; basePath: string }) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${dotColor} shadow-lg`} />
        <div><h2 className="text-xl font-black text-white">{label}</h2><p className="text-xs text-white/35">{sublabel}</p></div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 sm:-mx-0 sm:px-0 lg:grid-cols-4">
        {exercises.map((ex) => <div key={ex.slug} className="snap-start"><ExerciseCard ex={ex} basePath={basePath} /></div>)}
      </div>
    </div>
  );
}

export default function FuturePerfectContinuousPage() {
  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/6 blur-[150px]" />
        <div className="absolute top-1/3 -left-32 h-[400px] w-[400px] rounded-full bg-cyan-400/5 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-[400px] w-[400px] rounded-full bg-orange-400/4 blur-[120px]" />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        <div className="text-sm text-white/40">
          <a href="/" className="hover:text-white transition">Home</a><span className="mx-2 text-white/20">/</span>
          <a href="/tenses" className="hover:text-white transition">Tenses</a><span className="mx-2 text-white/20">/</span>
          <span className="text-white/70">Future Perfect Continuous</span>
        </div>
        <div className="mt-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-cyan-400 px-3 py-0.5 text-[11px] font-black text-black">C1</span>
            <span className="text-xs font-bold uppercase tracking-widest text-white/25">Future</span>
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Future Perfect <span className="relative inline-block">
              <span className="relative z-10 text-cyan-400">Continuous</span>
              <span aria-hidden className="pointer-events-none absolute -bottom-1 left-0 h-1 w-full rounded-full bg-cyan-400/30" />
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-white/45 text-base leading-relaxed">Duration of an action up to a specific future moment. Choose an exercise and start practising.</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {[{ label: "+", example: "By June, she will have been working here for a year." }, { label: "−", example: "He won't have been sleeping." }, { label: "?", example: "Will they have been waiting long?" }].map(({ label, example }) => (
            <div key={label} className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2">
              <span className="text-[10px] font-black text-white/25">{label}</span>
              <code className="text-[13px] font-mono text-white/60">{example}</code>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-14">
          <CardGroup label="Exercises" sublabel="Practice Future Perfect Continuous with different task types" dotColor="bg-cyan-400" exercises={EXERCISES} basePath="/tenses/future-perfect-continuous" />
          <AdUnit variant="inline-light" />
          <ProRelatedTopics exercises={RELATED} basePath="/tenses/future-perfect-continuous" />
        </div>
      </div>
    </main>
  );
}
