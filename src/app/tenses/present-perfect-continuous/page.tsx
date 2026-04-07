import ImageWithFallback from "@/components/ImageWithFallback";
import RelatedTopics from "@/components/RelatedTopics";
import AdUnit from "@/components/AdUnit";

export const metadata = {
  title: "Present Perfect Continuous Exercises — Practice English Grammar | English Nerd",
  description:
    "Practise the Present Perfect Continuous tense with multiple choice, fill-in-the-blank, spot-the-mistake, and sentence-builder exercises. Learn have/has been + -ing, for vs since, and the difference between Present Perfect and Present Perfect Continuous.",
  keywords: [
    "present perfect continuous exercises",
    "present perfect continuous practice",
    "have been ing exercises",
    "for vs since grammar",
    "present perfect vs present perfect continuous",
    "english grammar B1 B2",
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
    description: "Choose the correct Present Perfect Continuous form from four options.",
    difficulty: "Easy",
    difficultyColor: "bg-emerald-400",
  },
  {
    slug: "fill-in-blank",
    title: "Fill in the Blank",
    label: "Writing",
    description: "Type the correct have/has been + -ing form to complete the sentence.",
    difficulty: "Medium",
    difficultyColor: "bg-[#F5DA20]",
  },
  {
    slug: "spot-the-mistake",
    title: "Spot the Mistake",
    label: "Sharp eye",
    description: "Find the error: wrong auxiliary, missing 'been', or wrong verb form.",
    difficulty: "Medium",
    difficultyColor: "bg-[#F5DA20]",
  },
  {
    slug: "sentence-builder",
    imageSlug: "sentence-builder-present-perfect-continuous",
    title: "Sentence Builder",
    label: "Order",
    description: "Put the words in the right order to build a correct sentence.",
    difficulty: "Hard",
    difficultyColor: "bg-rose-400",
  },
];

const RELATED: Exercise[] = [
  {
    slug: "have-been-ing",
    title: "have / has been + -ing",
    label: "Structure",
    description: "Form the tense correctly — auxiliary + been + -ing verb.",
    difficulty: "Easy",
    difficultyColor: "bg-emerald-400",
  },
  {
    slug: "for-since-duration",
    title: "for vs since (Duration)",
    label: "Time",
    description: "I've been waiting for 2 hours vs since 3 o'clock. Know the difference.",
    difficulty: "Medium",
    difficultyColor: "bg-[#F5DA20]",
  },
  {
    slug: "pp-vs-ppc",
    title: "Perfect vs Perfect Continuous",
    label: "Comparison",
    description: "I've read the book vs I've been reading. Result vs duration.",
    difficulty: "Hard",
    difficultyColor: "bg-rose-400",
  },
  {
    slug: "all-present-tenses",
    title: "All Present Tenses",
    label: "Advanced",
    description: "Simple, Continuous, Perfect, Perfect Continuous — choose the right one.",
    difficulty: "Hard",
    difficultyColor: "bg-rose-400",
  },
];

function ExerciseCard({ ex, basePath }: { ex: Exercise; basePath: string }) {
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
          <a href={`${basePath}/${ex.slug}`} className="absolute inset-0 z-10" aria-label={ex.title} />
          <code className="relative z-20 mb-3 block rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-mono text-white/50 sm:rounded-lg sm:px-2.5 sm:text-[11px]">
            {ex.label}
          </code>
          <button className="relative z-20 inline-flex items-center justify-center rounded-lg bg-[#F5DA20] px-3 py-1.5 text-xs font-bold text-black hover:opacity-90 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm" type="button">
            Start
          </button>
        </div>
      </div>
    </article>
  );
}

function CardGroup({ label, sublabel, dotColor, exercises, basePath }: {
  label: string; sublabel: string; dotColor: string; exercises: Exercise[]; basePath: string;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${dotColor} shadow-lg`} />
        <div>
          <h2 className="text-xl font-black text-white">{label}</h2>
          <p className="text-xs text-white/35">{sublabel}</p>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 sm:-mx-0 sm:px-0 lg:grid-cols-4">
        {exercises.map((ex) => (
          <div key={ex.slug} className="snap-start">
            <ExerciseCard ex={ex} basePath={basePath} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PresentPerfectContinuousPage() {
  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-500/6 blur-[150px]" />
        <div className="absolute top-1/3 -left-32 h-[400px] w-[400px] rounded-full bg-indigo-400/5 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-[400px] w-[400px] rounded-full bg-violet-500/4 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">

        <div className="text-sm text-white/40">
          <a href="/" className="hover:text-white transition">Home</a>
          <span className="mx-2 text-white/20">/</span>
          <a href="/tenses" className="hover:text-white transition">Tenses</a>
          <span className="mx-2 text-white/20">/</span>
          <span className="text-white/70">Present Perfect Continuous</span>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-indigo-400 px-3 py-0.5 text-[11px] font-black text-black">B1–B2</span>
            <span className="text-xs font-bold uppercase tracking-widest text-white/25">Present</span>
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Present Perfect{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-indigo-400">Continuous</span>
              <span aria-hidden className="pointer-events-none absolute -bottom-1 left-0 h-1 w-full rounded-full bg-indigo-400/30" />
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-white/45 text-base leading-relaxed">
            Actions that started in the past and are still ongoing. Choose an exercise and start practising.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { label: "+", example: "She has been working here for years." },
            { label: "−", example: "He hasn't been sleeping well." },
            { label: "?", example: "Have they been waiting long?" },
          ].map(({ label, example }) => (
            <div key={label} className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2">
              <span className="text-[10px] font-black text-white/25">{label}</span>
              <code className="text-[13px] font-mono text-white/60">{example}</code>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-14">
          <CardGroup
            label="Exercises"
            sublabel="Practice Present Perfect Continuous with different task types"
            dotColor="bg-indigo-400"
            exercises={EXERCISES}
            basePath="/tenses/present-perfect-continuous"
          />
          <AdUnit variant="inline-light" />
          <RelatedTopics exercises={RELATED} basePath="/tenses/present-perfect-continuous" />
        </div>

      </div>
    </main>
  );
}
