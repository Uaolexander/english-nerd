import ImageWithFallback from "@/components/ImageWithFallback";
import AdUnit from "@/components/AdUnit";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";

export const metadata = {
  title: "B1 Grammar Lessons & Exercises — English Nerd",
  description:
    "B1 intermediate English grammar lessons with exercises. Topics: past continuous, passive voice, reported speech, conditionals, relative clauses and more. Free interactive practice.",
  alternates: { canonical: "/grammar/b1" },
};

type Topic = {
  slug: string;
  title: string;
  description: string;
  image: string;
};

const TOPICS_B1: Topic[] = [
  {
    slug: "past-continuous",
    title: "Past Continuous",
    description: "I was working, they were waiting — actions in progress in the past.",
    image: "/topics/b1/past-continuous.jpg",
  },
  {
    slug: "past-perfect",
    title: "Past Perfect",
    description: "I had finished before she arrived — the earlier of two past actions.",
    image: "/topics/b1/past-perfect.jpg",
  },
  {
    slug: "present-perfect-continuous",
    title: "Present Perfect Continuous",
    description: "I've been working all day — how long an ongoing action has lasted.",
    image: "/topics/b1/present-perfect-continuous.jpg",
  },
  {
    slug: "used-to",
    title: "Used to",
    description: "I used to play football — past habits and states that no longer exist.",
    image: "/topics/b1/used-to.jpg",
  },
  {
    slug: "would-past-habits",
    title: "Would (past habits)",
    description: "We would visit every summer — repeated past actions and routines.",
    image: "/topics/b1/would-past-habits.jpg",
  },
  {
    slug: "passive-present",
    title: "Passive Voice: Present",
    description: "The letter is written — present simple passive and when to use it.",
    image: "/topics/b1/passive-present.jpg",
  },
  {
    slug: "passive-past",
    title: "Passive Voice: Past",
    description: "The car was stolen — past simple passive and by + agent.",
    image: "/topics/b1/passive-past.jpg",
  },
  {
    slug: "reported-statements",
    title: "Reported Speech: Statements",
    description: "She said she was tired — reporting what someone said.",
    image: "/topics/b1/reported-statements.jpg",
  },
  {
    slug: "reported-questions",
    title: "Reported Speech: Questions",
    description: "He asked where I lived — reporting questions and commands.",
    image: "/topics/b1/reported-questions.jpg",
  },
  {
    slug: "modal-possibility",
    title: "Modals: Possibility",
    description: "It might rain, she could be right — expressing possibility.",
    image: "/topics/b1/modal-possibility.jpg",
  },
  {
    slug: "modal-deduction",
    title: "Modals: Deduction",
    description: "He must be tired, she can't be serious — logical conclusions.",
    image: "/topics/b1/modal-deduction.jpg",
  },
  {
    slug: "zero-first-conditional",
    title: "Zero & First Conditional",
    description: "If water reaches 100°C, it boils. If it rains, I'll stay in — facts and real future situations.",
    image: "/topics/b1/zero-first-conditional.jpg",
  },
  {
    slug: "second-conditional",
    title: "Second Conditional",
    description: "If I had more time, I would travel — hypothetical and unreal situations.",
    image: "/topics/b1/second-conditional.jpg",
  },
  {
    slug: "all-conditionals",
    title: "All Conditionals (0 / 1 / 2)",
    description: "Mixed practice — choose between zero, first and second conditionals.",
    image: "/topics/b1/all-conditionals.jpg",
  },
  {
    slug: "relative-clauses-defining",
    title: "Relative Clauses: Defining",
    description: "The man who called, the book that I read — essential information.",
    image: "/topics/b1/relative-clauses-defining.jpg",
  },
  {
    slug: "relative-clauses-non-defining",
    title: "Relative Clauses: Non-defining",
    description: "My sister, who lives in Paris, is a teacher — extra information.",
    image: "/topics/b1/relative-clauses-non-defining.jpg",
  },
  {
    slug: "too-enough",
    title: "Too & Enough",
    description: "too hot to eat, not enough time — expressing limits and sufficiency.",
    image: "/topics/b1/too-enough.jpg",
  },
  {
    slug: "so-such",
    title: "So & Such",
    description: "so tired, such a good film — intensifying adjectives and nouns.",
    image: "/topics/b1/so-such.jpg",
  },
  {
    slug: "as-as-comparison",
    title: "Comparison: as...as",
    description: "as tall as, not as fast as — comparing things of equal or unequal degree.",
    image: "/topics/b1/as-as-comparison.jpg",
  },
  {
    slug: "wish-past",
    title: "Wish + Past Simple",
    description: "I wish I knew, I wish I had more money — regrets about the present.",
    image: "/topics/b1/wish-past.jpg",
  },
  {
    slug: "phrasal-verbs",
    title: "Phrasal Verbs",
    description: "give up, look after, turn on — the most common phrasal verbs.",
    image: "/topics/b1/phrasal-verbs.jpg",
  },
];

export default async function GrammarB1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;

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
            <span className="text-white/90">B1</span>
          </div>

          <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight">
            B1 Grammar Lessons <span className="text-[#F5DA20]">&</span> Exercises
          </h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Intermediate level — past tenses, passive voice, reported speech, conditionals, relative clauses and more.
          </p>

          {/* Level switcher */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { lvl: "A1", href: "/grammar/a1", active: false },
              { lvl: "A2", href: "/grammar/a2", active: false },
              { lvl: "B1", href: "/grammar/b1", active: true },
              { lvl: "B2", href: "/grammar/b2", active: false },
              { lvl: "C1", href: "/grammar/c1", active: false },
            ].map(({ lvl, href, active }) => (
              <a
                key={lvl}
                href={href}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold transition ${
                  active
                    ? "bg-violet-400 text-black shadow-sm"
                    : "border border-white/15 text-white/55 hover:border-white/30 hover:text-white/85"
                }`}
              >
                {lvl}
              </a>
            ))}
          </div>

{/* Layout: sidebar ad (non-PRO) + topic cards */}
          <div className={`mt-10 ${!isPro ? "grid gap-8 lg:grid-cols-[320px_1fr]" : ""}`}>
            {!isPro && <AdUnit variant="sidebar-dark" />}

            <section>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
                {TOPICS_B1.map((t) => (
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
                      <div className="absolute top-3 right-3 rounded-full bg-violet-400 px-3 py-1 text-xs font-black text-black shadow-lg">
                        B1
                      </div>
                    </div>

                    <div className="p-5">
                      <h2 className="text-xl font-black leading-snug transition group-hover:text-white">
                        {t.title}
                      </h2>
                      <p className="mt-2 text-sm text-white/70">{t.description}</p>

                      <div className="mt-4 flex items-center justify-between">
                        <a
                          href={`/grammar/b1/${t.slug}`}
                          className="absolute inset-0 z-10"
                          aria-label={t.title}
                        />
                        <a href={`/grammar/b1/${t.slug}`} className="relative z-20 inline-flex items-center justify-center rounded-xl bg-[#F5DA20] px-4 py-2 text-sm font-bold text-black hover:opacity-90">
                          Start
                        </a>
                        <span className="relative z-20 text-xs text-white/45">B1</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {!isPro && <AdUnit variant="mobile-dark" />}

              {/* More coming soon */}
              <div className="mt-8 flex items-center gap-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8 text-white/40">
                  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white/60">More exercises coming soon</p>
                  <p className="text-xs text-white/30 mt-0.5">New topics are added regularly — check back soon.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
