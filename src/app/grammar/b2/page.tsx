import ImageWithFallback from "@/components/ImageWithFallback";

export const metadata = {
  title: "B2 Grammar Lessons & Exercises — English Nerd",
  description:
    "B2 upper-intermediate English grammar lessons with exercises. Topics: third conditional, mixed conditionals, passive advanced, causative, inversion, participle clauses and more. Free interactive practice.",
  alternates: { canonical: "/grammar/b2" },
};

type Topic = {
  slug: string;
  title: string;
  description: string;
  image: string;
};

const TOPICS_B2: Topic[] = [
  {
    slug: "past-perfect-continuous",
    title: "Past Perfect Continuous",
    description: "I had been waiting for an hour — duration of an action before another past event.",
    image: "/topics/b2/past-perfect-continuous.jpg",
  },
  {
    slug: "future-continuous",
    title: "Future Continuous",
    description: "I'll be working at 6pm — actions in progress at a specific future time.",
    image: "/topics/b2/future-continuous.jpg",
  },
  {
    slug: "future-perfect",
    title: "Future Perfect",
    description: "I'll have finished by then — actions completed before a future point.",
    image: "/topics/b2/future-perfect.jpg",
  },
  {
    slug: "passive-advanced",
    title: "Passive Voice: Advanced",
    description: "The report has been written, she is said to be — passive in perfect tenses and reporting structures.",
    image: "/topics/b2/passive-advanced.jpg",
  },
  {
    slug: "causative",
    title: "Causative: have / get",
    description: "I had my hair cut, she got her car fixed — arranging for someone else to do something.",
    image: "/topics/b2/causative.jpg",
  },
  {
    slug: "third-conditional",
    title: "Third Conditional",
    description: "If I had studied harder, I would have passed — hypothetical past situations.",
    image: "/topics/b2/third-conditional.jpg",
  },
  {
    slug: "mixed-conditionals",
    title: "Mixed Conditionals",
    description: "If I had slept more, I wouldn't be tired now — mixing past and present conditional.",
    image: "/topics/b2/mixed-conditionals.jpg",
  },
  {
    slug: "all-conditionals-b2",
    title: "All Conditionals (0–3 + Mixed)",
    description: "Full practice of zero, first, second, third and mixed conditionals.",
    image: "/topics/b2/all-conditionals-b2.jpg",
  },
  {
    slug: "wish-would",
    title: "Wish + Would / Past Perfect",
    description: "I wish you would stop, I wish I had gone — regrets and wishes about the future and past.",
    image: "/topics/b2/wish-would.jpg",
  },
  {
    slug: "modal-perfect",
    title: "Modal Verbs: Perfect",
    description: "must have been, should have done, needn't have — deduction and criticism about the past.",
    image: "/topics/b2/modal-perfect.jpg",
  },
  {
    slug: "gerunds-infinitives",
    title: "Gerunds & Infinitives",
    description: "remember doing vs remember to do — verbs that change meaning with gerund or infinitive.",
    image: "/topics/b2/gerunds-infinitives.jpg",
  },
  {
    slug: "reported-speech-advanced",
    title: "Reported Speech: Advanced",
    description: "He told me to go, she suggested going — reporting commands, suggestions and modals.",
    image: "/topics/b2/reported-speech-advanced.jpg",
  },
  {
    slug: "relative-clauses-advanced",
    title: "Relative Clauses: Advanced",
    description: "the person to whom I spoke, which made her angry — prepositions and reduced relative clauses.",
    image: "/topics/b2/relative-clauses-advanced.jpg",
  },
  {
    slug: "participle-clauses",
    title: "Participle Clauses",
    description: "Having finished the work, she left — replacing adverbial clauses with participles.",
    image: "/topics/b2/participle-clauses.jpg",
  },
  {
    slug: "inversion",
    title: "Inversion",
    description: "Never have I seen, Not only did he lie — formal inversion with negative adverbials.",
    image: "/topics/b2/inversion.jpg",
  },
  {
    slug: "cleft-sentences",
    title: "Cleft Sentences",
    description: "It was John who called, what I need is time — emphasising parts of a sentence.",
    image: "/topics/b2/cleft-sentences.jpg",
  },
  {
    slug: "linking-words",
    title: "Linking Words & Discourse Markers",
    description: "however, moreover, despite, in spite of — connecting ideas in formal and informal writing.",
    image: "/topics/b2/linking-words.jpg",
  },
  {
    slug: "quantifiers-advanced",
    title: "Quantifiers: Advanced",
    description: "each, every, either, neither, both — precise usage of advanced quantifiers.",
    image: "/topics/b2/quantifiers-advanced.jpg",
  },
];

export default function GrammarB2Page() {
  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white">
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-[140px]" />
        <div className="absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-orange-500/10 blur-[160px]" />
        <div className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-[#0B0B0D] to-transparent" />
      </div>

      <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 py-10">

          {/* Breadcrumb */}
          <div className="text-sm text-white/60">
            <a className="hover:text-white" href="/">Home</a>{" "}
            <span className="text-white/35">/</span>{" "}
            <span className="text-white/75">Grammar</span>{" "}
            <span className="text-white/35">/</span>{" "}
            <span className="text-white/90">B2</span>
          </div>

          <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight">
            B2 Grammar Lessons <span className="text-orange-400">&</span> Exercises
          </h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Upper-Intermediate level — advanced tenses, conditionals, causative, inversion, participle clauses and more.
          </p>

          {/* Level switcher */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { lvl: "A1", href: "/grammar/a1", active: false },
              { lvl: "A2", href: "/grammar/a2", active: false },
              { lvl: "B1", href: "/grammar/b1", active: false },
              { lvl: "B2", href: "/grammar/b2", active: true },
              { lvl: "C1", href: "/grammar/c1", active: false },
            ].map(({ lvl, href, active }) => (
              <a
                key={lvl}
                href={href}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold transition ${
                  active
                    ? "bg-orange-400 text-black shadow-sm"
                    : "border border-white/15 text-white/55 hover:border-white/30 hover:text-white/85"
                }`}
              >
                {lvl}
              </a>
            ))}
          </div>

          {/* Layout */}
          <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">

            {/* Left ad */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-4 will-change-transform">
                <div className="text-xs font-semibold text-white/50">ADVERTISEMENT</div>
                <div className="mt-3 h-[600px] rounded-xl border border-white/10 bg-black/30 flex items-center justify-center text-white/20 text-sm">
                  Ad
                </div>
              </div>
            </aside>

            {/* Cards */}
            <section>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
                {TOPICS_B2.map((t) => (
                  <article
                    key={t.slug}
                    className="group relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#121216] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"
                  >
                    <div className="relative aspect-square w-full overflow-hidden border-b border-white/10 bg-black/30">
                      <ImageWithFallback
                        src={t.image}
                        alt={t.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-3 right-3 rounded-full bg-orange-400 px-3 py-1 text-xs font-black text-black shadow-lg">
                        B2
                      </div>
                    </div>

                    <div className="p-5">
                      <h2 className="text-xl font-black leading-snug transition group-hover:text-white">
                        {t.title}
                      </h2>
                      <p className="mt-2 text-sm text-white/70">{t.description}</p>

                      <div className="mt-4 flex items-center justify-between">
                        <a
                          href={`/grammar/b2/${t.slug}`}
                          className="absolute inset-0 z-10"
                          aria-label={t.title}
                        />
                        <button
                          className="relative z-20 inline-flex items-center justify-center rounded-xl bg-orange-400 px-4 py-2 text-sm font-bold text-black hover:opacity-90"
                          type="button"
                        >
                          Start
                        </button>
                        <span className="relative z-20 text-xs text-white/45">B2</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Mobile ad */}
              <div className="mt-8 lg:hidden rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-semibold text-white/50">ADVERTISEMENT</div>
                <div className="mt-3 h-[250px] rounded-xl border border-white/10 bg-black/30 flex items-center justify-center text-white/20 text-sm">
                  Ad
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
