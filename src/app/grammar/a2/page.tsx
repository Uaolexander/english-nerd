import ImageWithFallback from "@/components/ImageWithFallback";
import AdUnit from "@/components/AdUnit";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";

export const metadata = {
  title: "A2 Grammar Lessons & Exercises — English Nerd",
  description:
    "A2 elementary English grammar lessons with exercises. Topics: past simple, present continuous, comparatives, modal verbs and more. Free interactive practice.",
  alternates: { canonical: "/grammar/a2" },
};

type Topic = {
  slug: string;
  title: string;
  description: string;
  image: string;
};

const TOPICS_A2: Topic[] = [
  {
    slug: "past-simple-regular",
    title: "Past Simple: regular verbs",
    description: "walked, played, visited — -ed endings and spelling rules.",
    image: "/topics/a2/past-simple-regular.jpg",
  },
  {
    slug: "past-simple-irregular",
    title: "Past Simple: irregular verbs",
    description: "went, saw, got, came — the most common irregular forms.",
    image: "/topics/a2/past-simple-irregular.jpg",
  },
  {
    slug: "past-simple-negative-questions",
    title: "Past Simple: negatives & questions",
    description: "didn't go, Did you see…? — forming negatives and questions.",
    image: "/topics/a2/past-simple-negative-questions.jpg",
  },
  {
    slug: "present-continuous",
    title: "Present Continuous",
    description: "I am working, she is watching — actions happening now.",
    image: "/topics/a2/present-continuous.jpg",
  },
  {
    slug: "going-to",
    title: "Going to (future plans)",
    description: "I'm going to travel — plans and intentions.",
    image: "/topics/a2/going-to.jpg",
  },
  {
    slug: "will-future",
    title: "Will (future)",
    description: "I'll help you — predictions, offers and instant decisions.",
    image: "/topics/a2/will-future.jpg",
  },
  {
    slug: "comparative-adjectives",
    title: "Comparative adjectives",
    description: "bigger, more expensive, better — comparing two things.",
    image: "/topics/a2/comparative-adjectives.jpg",
  },
  {
    slug: "superlative-adjectives",
    title: "Superlative adjectives",
    description: "the biggest, the most expensive, the best.",
    image: "/topics/a2/superlative-adjectives.jpg",
  },
  {
    slug: "articles-the",
    title: "Articles: a / an / the / zero",
    description: "When to use the, when to drop the article completely.",
    image: "/topics/a2/articles-the.jpg",
  },
  {
    slug: "object-pronouns",
    title: "Object pronouns",
    description: "me / you / him / her / it / us / them.",
    image: "/topics/a2/object-pronouns.jpg",
  },
  {
    slug: "possessive-pronouns",
    title: "Possessive pronouns",
    description: "mine / yours / his / hers / ours / theirs.",
    image: "/topics/a2/possessive-pronouns.jpg",
  },
  {
    slug: "have-to",
    title: "Have to / Don't have to",
    description: "Obligation and lack of obligation — you have to study!",
    image: "/topics/a2/have-to.jpg",
  },
  {
    slug: "should-shouldnt",
    title: "Should / Shouldn't",
    description: "Advice and recommendations — you should try this.",
    image: "/topics/a2/should-shouldnt.jpg",
  },
  {
    slug: "adverbs-manner",
    title: "Adverbs of manner",
    description: "quickly, slowly, well, badly — how you do something.",
    image: "/topics/a2/adverbs-manner.jpg",
  },
  {
    slug: "verb-ing",
    title: "Verb + -ing (like / enjoy / hate)",
    description: "I like swimming, she enjoys reading — verbs followed by -ing.",
    image: "/topics/a2/verb-ing.jpg",
  },
  {
    slug: "verb-infinitive",
    title: "Verb + to infinitive (want / need / hope)",
    description: "I want to go, he needs to study — verbs followed by to + verb.",
    image: "/topics/a2/verb-infinitive.jpg",
  },
  {
    slug: "conjunctions",
    title: "Conjunctions: because / so / but / although",
    description: "Join ideas and sentences — I was tired but I went.",
    image: "/topics/a2/conjunctions.jpg",
  },
  {
    slug: "time-expressions-past",
    title: "Time expressions: past",
    description: "yesterday, last week, two days ago, in 2020.",
    image: "/topics/a2/time-expressions-past.jpg",
  },
  {
    slug: "present-perfect-intro",
    title: "Present Perfect (intro)",
    description: "I have seen, she has been — life experience and recent events.",
    image: "/topics/a2/present-perfect-intro.jpg",
  },
  {
    slug: "prepositions-movement",
    title: "Prepositions of movement",
    description: "into / out of / along / through / past — describing movement.",
    image: "/topics/a2/prepositions-movement.jpg",
  },
];

export default async function GrammarA2Page() {
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
            <span className="text-white/90">A2</span>
          </div>

          <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight">
            A2 Grammar Lessons <span className="text-[#F5DA20]">&</span> Exercises
          </h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Elementary level — past simple, continuous tenses, comparatives, modals and more.
          </p>

          {/* Level switcher */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { lvl: "A1", href: "/grammar/a1", active: false },
              { lvl: "A2", href: "/grammar/a2", active: true },
              { lvl: "B1", href: "/grammar/b1", active: false },
              { lvl: "B2", href: "/grammar/b2", active: false },
              { lvl: "C1", href: "/grammar/c1", active: false },
            ].map(({ lvl, href, active }) => (
              <a
                key={lvl}
                href={href}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold transition ${
                  active
                    ? "bg-emerald-400 text-black shadow-sm"
                    : "border border-white/15 text-white/55 hover:border-white/30 hover:text-white/85"
                }`}
              >
                {lvl}
              </a>
            ))}
          </div>

          {/* Layout */}
          {!isPro ? (
            <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">

              <AdUnit variant="sidebar-dark" />

              {/* Cards */}
              <section>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
                  {TOPICS_A2.map((t) => (
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
                        <div className="absolute top-3 right-3 rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-black shadow-lg">
                          A2
                        </div>
                      </div>

                      <div className="p-5">
                        <h2 className="text-xl font-black leading-snug transition group-hover:text-white">
                          {t.title}
                        </h2>
                        <p className="mt-2 text-sm text-white/70">{t.description}</p>

                        <div className="mt-4 flex items-center justify-between">
                          <a
                            href={`/grammar/a2/${t.slug}`}
                            className="absolute inset-0 z-10"
                            aria-label={t.title}
                          />
                          <a href={`/grammar/a2/${t.slug}`} className="relative z-20 inline-flex items-center justify-center rounded-xl bg-[#F5DA20] px-4 py-2 text-sm font-bold text-black hover:opacity-90">
                              Start
                            </a>
                          <span className="relative z-20 text-xs text-white/45">A2</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <AdUnit variant="mobile-dark" />

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
          ) : (
            <section className="mt-10">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
                {TOPICS_A2.map((t) => (
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
                      <div className="absolute top-3 right-3 rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-black shadow-lg">
                        A2
                      </div>
                    </div>

                    <div className="p-5">
                      <h2 className="text-xl font-black leading-snug transition group-hover:text-white">
                        {t.title}
                      </h2>
                      <p className="mt-2 text-sm text-white/70">{t.description}</p>

                      <div className="mt-4 flex items-center justify-between">
                        <a
                          href={`/grammar/a2/${t.slug}`}
                          className="absolute inset-0 z-10"
                          aria-label={t.title}
                        />
                        <a href={`/grammar/a2/${t.slug}`} className="relative z-20 inline-flex items-center justify-center rounded-xl bg-[#F5DA20] px-4 py-2 text-sm font-bold text-black hover:opacity-90">
                              Start
                            </a>
                        <span className="relative z-20 text-xs text-white/45">A2</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

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
          )}
        </div>
      </div>
    </main>
  );
}
