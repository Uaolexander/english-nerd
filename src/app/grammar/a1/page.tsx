import ImageWithFallback from "@/components/ImageWithFallback";
import AdUnit from "@/components/AdUnit";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";

export const metadata = {
    title: "A1 Grammar Lessons & Exercises — English Nerd",
    description:
      "A1 beginner English grammar lessons with interactive exercises. Topics: verb to be, present simple, articles, pronouns, modals and more. Free practice.",
    alternates: { canonical: "/grammar/a1" },
  };
  
  type Topic = {
    slug: string;
    title: string;
    description: string;
    image: string; // placeholder path in /public
  };
  
  const TOPICS_A1: Topic[] = [
    {
      slug: "to-be-am-is-are",
      title: "Verb “to be” (am / is / are)",
      description: "Who you are, what you are, where you are — the basics.",
      image: "/topics/a1/to-be-am-is-are.jpg",
    },
    {
      slug: "there-is-there-are",
      title: "There is / There are",
      description: "Talk about things that exist and where they are.",
      image: "/topics/a1/there-is-there-are.jpg",
    },
    {
      slug: "articles-a-an",
      title: "Articles: a / an",
      description: "When to use a/an + common beginner rules.",
      image: "/topics/a1/articles-a-an.jpg",
    },
    {
      slug: "plural-nouns",
      title: "Plural nouns",
      description: "One apple → two apples (and spelling rules).",
      image: "/topics/a1/plural-nouns.jpg",
    },
    {
      slug: "subject-pronouns",
      title: "Subject pronouns",
      description: "I / you / he / she / it / we / they.",
      image: "/topics/a1/subject-pronouns.jpg",
    },
    {
      slug: "possessive-adjectives",
      title: "Possessive adjectives",
      description: "my / your / his / her / its / our / their.",
      image: "/topics/a1/possessive-adjectives.jpg",
    },
    {
      slug: "this-that-these-those",
      title: "This / That / These / Those",
      description: "Point at things near/far, singular/plural.",
      image: "/topics/a1/this-that-these-those.jpg",
    },
    {
      slug: "present-simple-i-you-we-they",
      title: "Present Simple (I/you/we/they)",
      description: "I work, you study — affirmative basics.",
      image: "/topics/a1/present-simple-i-you-we-they.jpg",
    },
    {
      slug: "present-simple-he-she-it",
      title: "Present Simple (he/she/it)",
      description: "She works, he studies — -s endings.",
      image: "/topics/a1/present-simple-he-she-it.jpg",
    },
    {
      slug: "present-simple-negative",
      title: "Present Simple: negative",
      description: "I don’t…, he doesn’t…",
      image: "/topics/a1/present-simple-negative.jpg",
    },
    {
      slug: "present-simple-questions",
      title: "Present Simple: questions",
      description: "Do you…? Does he…? Short answers.",
      image: "/topics/a1/present-simple-questions.jpg",
    },
    {
      slug: "wh-questions",
      title: "Wh-questions",
      description: "What/Where/When/Why/How — ask simple questions.",
      image: "/topics/a1/wh-questions.jpg",
    },
    {
      slug: "can-cant",
      title: "Can / Can’t",
      description: "Ability and simple permission.",
      image: "/topics/a1/can-cant.jpg",
    },
    {
      slug: "have-has-got",
      title: "Have / has got",
      description: "Talk about possession: I’ve got…, He’s got…",
      image: "/topics/a1/have-has-got.jpg",
    },
    {
      slug: "prepositions-place",
      title: "Prepositions of place",
      description: "in / on / under / next to / between…",
      image: "/topics/a1/prepositions-of-place.jpg",
    },
    {
      slug: "prepositions-time-in-on-at",
      title: "Prepositions of time: in / on / at",
      description: "in June, on Monday, at 7 o’clock.",
      image: "/topics/a1/prepositions-of-time-in-on-at.jpg",
    },
    {
      slug: "some-any",
      title: "Some / Any",
      description: "Basic usage in questions/negatives/affirmatives.",
      image: "/topics/a1/some-any.jpg",
    },
    {
      slug: "countable-uncountable",
      title: "Countable / Uncountable (basic)",
      description: "an apple vs. water — intro + simple examples.",
      image: "/topics/a1/countable-uncountable.jpg",
    },
    {
      slug: "much-many-basic",
      title: "Much / Many (basic)",
      description: "many apples, much water (beginner level).",
      image: "/topics/a1/much-many.jpg",
    },
    {
      slug: "adverbs-frequency",
      title: "Adverbs of frequency",
      description: "always / usually / often / sometimes / never.",
      image: "/topics/a1/adverbs-of-frequency.jpg",
    },
  ];
  
  export default async function GrammarA1Page() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isPro = user ? await getIsPro(supabase, user.id) : false;

    return (
      <main className="relative min-h-screen bg-[#0E0F13] text-white">
        {/* Soft gradient background */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Yellow glow */}
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#F5DA20]/20 blur-[140px]" />
          {/* Subtle side glow */}
          <div className="absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-[#F5DA20]/10 blur-[160px]" />
          {/* Bottom dark fade */}
          <div className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-[#0B0B0D] to-transparent" />
        </div>

        {/* Content layer */}
        <div className="relative z-10">
          <div className="mx-auto max-w-6xl px-6 py-10">
            {/* Breadcrumb */}
            <div className="text-sm text-white/60">
              <a className="hover:text-white" href="/">
                Home
              </a>{" "}
              <span className="text-white/35">/</span>{" "}
              <span className="text-white/75">Grammar</span>{" "}
              <span className="text-white/35">/</span>{" "}
              <span className="text-white/90">A1</span>
            </div>
    
            <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight">
              A1 Grammar Lessons <span className="text-[#F5DA20]">&</span> Exercises
            </h1>
            <p className="mt-3 max-w-2xl text-white/70">
              Pick any topic — no strict order. Learn fast with clear explanations and practice.
            </p>

            {/* Level switcher */}
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { lvl: "A1", href: "/grammar/a1", active: true },
                { lvl: "A2", href: "/grammar/a2", active: false },
                { lvl: "B1", href: "/grammar/b1", active: false },
                { lvl: "B2", href: "/grammar/b2", active: false },
                { lvl: "C1", href: "/grammar/c1", active: false },
              ].map(({ lvl, href, active }) => (
                <a
                  key={lvl}
                  href={href}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold transition ${
                    active
                      ? "bg-[#F5DA20] text-black shadow-sm"
                      : "border border-white/15 text-white/55 hover:border-white/30 hover:text-white/85"
                  }`}
                >
                  {lvl}
                </a>
              ))}
            </div>
    
            {/* Layout: Left ad + content */}
            {!isPro ? (
              <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
                <AdUnit variant="sidebar-dark" />

                {/* Cards */}
                <section>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
                    {TOPICS_A1.map((t) => (
                      <article
                        key={t.slug}
                        className="group relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#121216] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"
                      >
                        {/* Image area */}
                        <div className="relative aspect-square w-full overflow-hidden border-b border-white/10 bg-black/30">
                          <ImageWithFallback
                            src={t.image}
                            alt={t.title}
                            className="h-full w-full object-cover"
                          />

                          <div className="absolute top-3 right-3 rounded-full bg-[#F5DA20] px-3 py-1 text-xs font-black text-black shadow-lg">
                            A1
                          </div>
                        </div>

                        <div className="p-5">
                          <h2 className="text-xl font-black leading-snug transition group-hover:text-white">
                            {t.title}
                          </h2>

                          <p className="mt-2 text-sm text-white/70">{t.description}</p>

                          <div className="mt-4 flex items-center justify-between">
                            <a
                              href={`/grammar/a1/${t.slug}`}
                              className="absolute inset-0 z-10"
                              aria-label={t.title}
                            />

                            <button
                              className="relative z-20 inline-flex items-center justify-center rounded-xl bg-[#F5DA20] px-4 py-2 text-sm font-bold text-black hover:opacity-90"
                              type="button"
                            >
                              Start
                            </button>

                            <span className="relative z-20 text-xs text-white/45">A1</span>
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
                  {TOPICS_A1.map((t) => (
                    <article
                      key={t.slug}
                      className="group relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#121216] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"
                    >
                      {/* Image area */}
                      <div className="relative aspect-square w-full overflow-hidden border-b border-white/10 bg-black/30">
                        <ImageWithFallback
                          src={t.image}
                          alt={t.title}
                          className="h-full w-full object-cover"
                        />

                        <div className="absolute top-3 right-3 rounded-full bg-[#F5DA20] px-3 py-1 text-xs font-black text-black shadow-lg">
                          A1
                        </div>
                      </div>

                      <div className="p-5">
                        <h2 className="text-xl font-black leading-snug transition group-hover:text-white">
                          {t.title}
                        </h2>

                        <p className="mt-2 text-sm text-white/70">{t.description}</p>

                        <div className="mt-4 flex items-center justify-between">
                          <a
                            href={`/grammar/a1/${t.slug}`}
                            className="absolute inset-0 z-10"
                            aria-label={t.title}
                          />

                          <button
                            className="relative z-20 inline-flex items-center justify-center rounded-xl bg-[#F5DA20] px-4 py-2 text-sm font-bold text-black hover:opacity-90"
                            type="button"
                          >
                            Start
                          </button>

                          <span className="relative z-20 text-xs text-white/45">A1</span>
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