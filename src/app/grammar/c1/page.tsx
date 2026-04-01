import ImageWithFallback from "@/components/ImageWithFallback";

export const metadata = {
  title: "C1 Grammar Lessons & Exercises — English Nerd",
  description:
    "C1 advanced English grammar lessons with exercises. Topics: subjunctive, inverted conditionals, nominalisation, ellipsis, advanced passives, fronting and more. Free interactive practice.",
  alternates: { canonical: "/grammar/c1" },
};

type Topic = {
  slug: string;
  title: string;
  description: string;
  image: string;
};

const TOPICS_C1: Topic[] = [
  {
    slug: "subjunctive",
    title: "Subjunctive Mood",
    description: "It's essential that he be on time, I suggest she go — formal subjunctive in that-clauses.",
    image: "/topics/c1/subjunctive.jpg",
  },
  {
    slug: "inverted-conditionals",
    title: "Inverted Conditionals",
    description: "Were I to go, Had she known, Should you need help — formal inversion instead of if.",
    image: "/topics/c1/inverted-conditionals.jpg",
  },
  {
    slug: "advanced-modals",
    title: "Advanced Modal Expressions",
    description: "would rather she stayed, it's time he left, be supposed to, had better — complex modal patterns.",
    image: "/topics/c1/advanced-modals.jpg",
  },
  {
    slug: "passive-infinitives",
    title: "Passive: Infinitives & Reporting",
    description: "She is thought to have left, He is believed to be — passive with reporting verbs and infinitives.",
    image: "/topics/c1/passive-infinitives.jpg",
  },
  {
    slug: "complex-passives",
    title: "Complex Passives",
    description: "She had her bag stolen, He was made to wait — causative passive and two-object passives.",
    image: "/topics/c1/complex-passives.jpg",
  },
  {
    slug: "ellipsis-substitution",
    title: "Ellipsis & Substitution",
    description: "so do I, neither did she, I did too, do so — avoiding repetition in formal and informal English.",
    image: "/topics/c1/ellipsis-substitution.jpg",
  },
  {
    slug: "nominalisation",
    title: "Nominalisation",
    description: "the increase in prices, a reduction in costs — turning verbs and adjectives into noun phrases.",
    image: "/topics/c1/nominalisation.jpg",
  },
  {
    slug: "fronting-emphasis",
    title: "Fronting & Emphasis",
    description: "What I need is rest, Not once did she apologise — moving elements to the front for emphasis.",
    image: "/topics/c1/fronting-emphasis.jpg",
  },
  {
    slug: "advanced-inversion",
    title: "Advanced Inversion",
    description: "Little did I know, Rarely has he been seen, Under no circumstances — extending inversion patterns.",
    image: "/topics/c1/advanced-inversion.jpg",
  },
  {
    slug: "extraposition",
    title: "Extraposition (it-clauses)",
    description: "It is important that..., It seems unlikely that..., It was decided to — placing clauses after it.",
    image: "/topics/c1/extraposition.jpg",
  },
  {
    slug: "advanced-relative-clauses",
    title: "Relative Clauses: C1",
    description: "whereby, the reason why, whoever, whatever — advanced relative and nominal relative clauses.",
    image: "/topics/c1/advanced-relative-clauses.jpg",
  },
  {
    slug: "advanced-participle-clauses",
    title: "Participle Clauses: Advanced",
    description: "Having been told, Not knowing what to do, Given the situation — passive and negative participles.",
    image: "/topics/c1/advanced-participle-clauses.jpg",
  },
  {
    slug: "complex-noun-phrases",
    title: "Complex Noun Phrases",
    description: "a rapidly growing company, the decision to leave early — pre- and post-modification of nouns.",
    image: "/topics/c1/complex-noun-phrases.jpg",
  },
  {
    slug: "reported-speech-c1",
    title: "Reported Speech: C1",
    description: "He denied having done it, She urged him to stay, They warned us against — advanced reporting verbs.",
    image: "/topics/c1/reported-speech-c1.jpg",
  },
  {
    slug: "concession-contrast",
    title: "Concession & Contrast",
    description: "albeit, whereas, even so, much as I like him — advanced ways to express contrast and concession.",
    image: "/topics/c1/concession-contrast.jpg",
  },
  {
    slug: "hedging-language",
    title: "Hedging Language",
    description: "It seems that, it would appear, tends to, is thought to — being tentative and cautious in academic writing.",
    image: "/topics/c1/hedging-language.jpg",
  },
  {
    slug: "word-formation",
    title: "Word Formation: Advanced",
    description: "mis-, under-, over-, -ity, -ness, -tion — prefixes, suffixes and compound formation at C1 level.",
    image: "/topics/c1/word-formation.jpg",
  },
  {
    slug: "advanced-discourse-markers",
    title: "Discourse Markers: Advanced",
    description: "notwithstanding, by the same token, in so far as — high-level connectors for formal writing.",
    image: "/topics/c1/advanced-discourse-markers.jpg",
  },
];

export default function GrammarC1Page() {
  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white">
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#F5DA20]/15 blur-[140px]" />
        <div className="absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-[#F5DA20]/8 blur-[160px]" />
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
            <span className="text-white/90">C1</span>
          </div>

          <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight">
            C1 Grammar Lessons <span className="text-[#F5DA20]">&</span> Exercises
          </h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Advanced level — subjunctive, inverted conditionals, nominalisation, ellipsis, complex passives and more.
          </p>

          {/* Level switcher */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { lvl: "A1", href: "/grammar/a1", active: false },
              { lvl: "A2", href: "/grammar/a2", active: false },
              { lvl: "B1", href: "/grammar/b1", active: false },
              { lvl: "B2", href: "/grammar/b2", active: false },
              { lvl: "C1", href: "/grammar/c1", active: true },
            ].map(({ lvl, href, active }) => (
              <a
                key={lvl}
                href={href}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold transition ${
                  active
                    ? "bg-cyan-400 text-black shadow-sm"
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
                {TOPICS_C1.map((t) => (
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
                      <div className="absolute top-3 right-3 rounded-full bg-cyan-400 px-3 py-1 text-xs font-black text-black shadow-lg">
                        C1
                      </div>
                    </div>

                    <div className="p-5">
                      <h2 className="text-xl font-black leading-snug transition group-hover:text-white">
                        {t.title}
                      </h2>
                      <p className="mt-2 text-sm text-white/70">{t.description}</p>

                      <div className="mt-4 flex items-center justify-between">
                        <a
                          href={`/grammar/c1/${t.slug}`}
                          className="absolute inset-0 z-10"
                          aria-label={t.title}
                        />
                        <button
                          className="relative z-20 inline-flex items-center justify-center rounded-xl bg-[#F5DA20] px-4 py-2 text-sm font-bold text-black hover:opacity-90"
                          type="button"
                        >
                          Start
                        </button>
                        <span className="relative z-20 text-xs text-white/45">C1</span>
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
