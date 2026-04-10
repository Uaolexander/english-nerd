import ImageWithFallback from "@/components/ImageWithFallback";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";

export const metadata = {
  title: "Nerd Zone — English Nerd",
  description:
    "Your English toolkit. Irregular verbs, phrasal verbs, live phrases, slang, useful websites and recommendations — all in one place.",
  alternates: { canonical: "/nerd-zone" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Nerd Zone on English Nerd?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nerd Zone is a collection of practical English tools: irregular verbs, phrasal verbs, live phrases, slang, useful websites, and film/TV vocabulary sets with interactive exercises.",
      },
    },
    {
      "@type": "Question",
      name: "How can I learn English with films and TV shows?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Watch & Learn section gives you curated vocabulary lists for real films and TV shows grouped by level (A1–C1). Study key words before watching, then do interactive exercises to test your memory.",
      },
    },
    {
      "@type": "Question",
      name: "What level should I start with for English grammar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Take the free English Level Test to find your level instantly. English Nerd covers A1 to C1 across grammar, vocabulary, listening and reading.",
      },
    },
    {
      "@type": "Question",
      name: "What is included in English Nerd Pro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pro unlocks all vocabulary study sets, PDF worksheets for every topic, exercises for all Watch & Learn content, 7 streak freezes per month, and a shareable Certificate of Achievement.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download the English worksheets as PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — Pro members can download printable PDF worksheets for Phrasal Verbs, Live Phrases, English Slang, Irregular Verbs, and Watch & Learn vocabulary sets.",
      },
    },
  ],
};

// ─── Word of the Day ──────────────────────────────────────────────────────────

type Word = {
  word: string;
  phonetic: string;
  level: "A2" | "B1" | "B2" | "C1";
  partOfSpeech: string;
  meaning: string;
  example: string;
};

const WORDS: Word[] = [
  { word: "binge",        phonetic: "/bɪndʒ/",           level: "A2", partOfSpeech: "verb",  meaning: "To do something excessively in a short time",               example: "I binged the whole series in one weekend." },
  { word: "quirky",       phonetic: "/ˈkwɜːrki/",         level: "B1", partOfSpeech: "adj",   meaning: "Unusual and interesting in a charming way",                example: "She has a quirky sense of humour." },
  { word: "serendipity",  phonetic: "/ˌser.ənˈdɪp.ɪ.ti/", level: "B2", partOfSpeech: "noun",  meaning: "Finding something good without looking for it",            example: "It was pure serendipity — I found my dream job." },
  { word: "wanderlust",   phonetic: "/ˈwɒndəlʌst/",       level: "B1", partOfSpeech: "noun",  meaning: "A strong desire to travel and explore the world",          example: "Her wanderlust kicked in every spring." },
  { word: "petrichor",    phonetic: "/ˈpet.rɪ.kɔːr/",     level: "C1", partOfSpeech: "noun",  meaning: "The smell of rain falling on dry earth",                   example: "She opened the window to breathe in the petrichor." },
  { word: "epiphany",     phonetic: "/ɪˈpɪf.ə.ni/",       level: "B2", partOfSpeech: "noun",  meaning: "A sudden moment of deep understanding",                    example: "He had an epiphany at 3am and solved the problem." },
  { word: "nonchalant",   phonetic: "/ˈnɒn.ʃə.lənt/",     level: "B2", partOfSpeech: "adj",   meaning: "Casually calm, as if nothing bothers you",                 example: "He caught the ball with a nonchalant one-handed grab." },
  { word: "ephemeral",    phonetic: "/ɪˈfem.ər.əl/",      level: "C1", partOfSpeech: "adj",   meaning: "Lasting for a very short time",                            example: "Cherry blossom is ephemeral — that's what makes it precious." },
  { word: "cathartic",    phonetic: "/kəˈθɑːr.tɪk/",      level: "B2", partOfSpeech: "adj",   meaning: "Providing emotional release and relief",                   example: "Screaming into a pillow was surprisingly cathartic." },
  { word: "sanguine",     phonetic: "/ˈsæŋ.ɡwɪn/",        level: "C1", partOfSpeech: "adj",   meaning: "Calmly optimistic, especially when things are difficult",   example: "Despite setbacks, she remained sanguine." },
  { word: "quixotic",     phonetic: "/kwɪkˈsɒt.ɪk/",      level: "C1", partOfSpeech: "adj",   meaning: "Extremely idealistic and impractical, but charming",        example: "Her quixotic plan to cycle three continents worked." },
  { word: "melancholy",   phonetic: "/ˈmel.ən.kɒl.i/",    level: "B2", partOfSpeech: "noun",  meaning: "A deep, pensive sadness — bittersweet rather than painful",  example: "There was a gentle melancholy in his voice." },
  { word: "tenacious",    phonetic: "/təˈneɪ.ʃəs/",        level: "B2", partOfSpeech: "adj",   meaning: "Never giving up despite difficulties",                     example: "She was a tenacious negotiator." },
  { word: "laconic",      phonetic: "/ləˈkɒn.ɪk/",        level: "C1", partOfSpeech: "adj",   meaning: "Using very few words — brief but effective",               example: "His laconic reply conveyed three paragraphs of disappointment." },
  { word: "whimsical",    phonetic: "/ˈwɪm.zɪ.kəl/",      level: "B2", partOfSpeech: "adj",   meaning: "Playfully imaginative in a charming, unexpected way",      example: "The café was full of whimsical decorations." },
  { word: "euphoria",     phonetic: "/juːˈfɔː.ri.ə/",      level: "B2", partOfSpeech: "noun",  meaning: "An intense feeling of happiness and excitement",           example: "The euphoria of finishing her last exam lasted for days." },
  { word: "splurge",      phonetic: "/splɜːrdʒ/",          level: "B1", partOfSpeech: "verb",  meaning: "To spend a lot of money on something as a treat",          example: "We splurged on a fancy hotel for our anniversary." },
  { word: "stoic",        phonetic: "/ˈstəʊ.ɪk/",         level: "B2", partOfSpeech: "adj",   meaning: "Enduring difficulty without showing emotion",              example: "He was stoic throughout — never once complaining." },
  { word: "conundrum",    phonetic: "/kəˈnʌn.drəm/",       level: "B2", partOfSpeech: "noun",  meaning: "A confusing problem with no clear answer",                 example: "Christmas dinner seating is the eternal family conundrum." },
  { word: "brazen",       phonetic: "/ˈbreɪ.zən/",         level: "B2", partOfSpeech: "adj",   meaning: "Bold and shameless — doing something without caring",      example: "He made a brazen attempt to claim credit for others' work." },
  { word: "ineffable",    phonetic: "/ɪˈnef.ə.bəl/",      level: "C1", partOfSpeech: "adj",   meaning: "Too great or extreme to be expressed in words",            example: "Standing at the canyon filled her with ineffable awe." },
  { word: "gregarious",   phonetic: "/ɡrɪˈɡeər.i.əs/",    level: "B2", partOfSpeech: "adj",   meaning: "Fond of company — energised by being with people",         example: "Within five minutes she'd made friends with everyone." },
  { word: "visceral",     phonetic: "/ˈvɪs.ər.əl/",        level: "C1", partOfSpeech: "adj",   meaning: "Deeply felt, gut-level — raw and instinctive",             example: "The film's finale provoked a visceral emotional response." },
  { word: "ambivalent",   phonetic: "/æmˈbɪv.ə.lənt/",    level: "B2", partOfSpeech: "adj",   meaning: "Having strong, contradictory feelings about something",    example: "I feel completely ambivalent about moving cities." },
  { word: "furtive",      phonetic: "/ˈfɜː.tɪv/",          level: "C1", partOfSpeech: "adj",   meaning: "Secretive, as if trying not to be noticed",                example: "She cast a furtive glance at his phone." },
  { word: "fastidious",   phonetic: "/fæˈstɪd.i.əs/",     level: "C1", partOfSpeech: "adj",   meaning: "Very attentive to detail; hard to please",                 example: "She was fastidious about grammar in students' essays." },
  { word: "loquacious",   phonetic: "/ləˈkweɪ.ʃəs/",       level: "C1", partOfSpeech: "adj",   meaning: "Tending to talk a great deal",                             example: "Our loquacious guide told us the history of every stone." },
  { word: "equanimity",   phonetic: "/ˌiː.kwəˈnɪm.ɪ.ti/", level: "C1", partOfSpeech: "noun",  meaning: "Calmness and composure in difficult moments",              example: "He accepted the news with remarkable equanimity." },
  { word: "seismic",      phonetic: "/ˈsaɪz.mɪk/",         level: "B2", partOfSpeech: "adj",   meaning: "Of enormous proportions or effect",                        example: "The internet had a seismic impact on communication." },
  { word: "ubiquitous",   phonetic: "/juːˈbɪk.wɪ.təs/",   level: "C1", partOfSpeech: "adj",   meaning: "Found or appearing everywhere",                            example: "Coffee shops have become ubiquitous in every city." },
];

function getDayOfYear(): number {
  const now = new Date();
  return Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
}

function getWordOfDay(): Word {
  return WORDS[getDayOfYear() % WORDS.length];
}

function levelColors(level: string): { badge: string; glow: string } {
  if (level === "A2") return { badge: "bg-emerald-400 text-black",  glow: "bg-emerald-400/15 border-emerald-400/20" };
  if (level === "B1") return { badge: "bg-sky-400 text-black",      glow: "bg-sky-400/15 border-sky-400/20" };
  if (level === "B2") return { badge: "bg-orange-400 text-black",   glow: "bg-orange-400/15 border-orange-400/20" };
  if (level === "C1") return { badge: "bg-violet-400 text-black",   glow: "bg-violet-400/15 border-violet-400/20" };
  return { badge: "bg-white/20 text-white", glow: "bg-white/10 border-white/15" };
}

// ─── Hub sections ─────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    slug: "my-materials",
    icon: "📦",
    label: "Materials",
    title: "My Materials",
    description: "PDFs, books and exclusive study resources curated by Oleksandr.",
    count: "Resources",
    badgeColor: "bg-[#F5DA20]",
  },
  {
    slug: "useful-sites",
    icon: "🌐",
    label: "Tools",
    title: "Useful Websites",
    description: "The best tools serious English learners actually use.",
    count: "6 resources",
    badgeColor: "bg-cyan-400",
  },
  {
    slug: "recommendations",
    icon: "⭐",
    label: "Picks",
    title: "Recommendations",
    description: "Books, podcasts, YouTube channels and films that move the needle.",
    count: "6 picks",
    badgeColor: "bg-amber-400",
  },
  {
    slug: "slang",
    icon: "🔥",
    label: "Informal",
    title: "Slang",
    description: "Modern informal English from social media and everyday speech.",
    count: "8 words",
    badgeColor: "bg-orange-400",
  },
  {
    slug: "live-phrases",
    icon: "💬",
    label: "Speaking",
    title: "Live Phrases",
    description: "Expressions native speakers use every single day.",
    count: "8 phrases",
    badgeColor: "bg-emerald-400",
  },
  {
    slug: "phrasal-verbs",
    icon: "🔗",
    label: "Phrases",
    title: "Phrasal Verbs",
    description: "High-frequency verb + particle combinations with real examples.",
    count: "12 combos",
    badgeColor: "bg-violet-400",
  },
  {
    slug: "irregular-verbs",
    icon: "🔁",
    label: "Verbs",
    title: "Irregular Verbs",
    description: "The 44 most essential verb forms — handle almost any text.",
    count: "44 verbs",
    badgeColor: "bg-sky-400",
  },
];

function SectionCard({ s }: { s: typeof SECTIONS[number] }) {
  return (
    <article className="group relative w-[180px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#121216] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 sm:w-full sm:shrink">
      <a href={`/nerd-zone/${s.slug}`} className="absolute inset-0 z-10" aria-label={s.title} />

      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/10 bg-black/30">
        <ImageWithFallback
          src={`/topics/nerd-zone/${s.slug}.jpg`}
          alt={s.title}
          className="h-full w-full object-cover"
        />
        <div className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-black text-black shadow-lg ${s.badgeColor}`}>
          {s.label}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-base font-black leading-snug text-white sm:text-lg">{s.title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-white/55 line-clamp-2 sm:text-[13px]">
          {s.description}
        </p>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11px] font-medium text-white/50">{s.count}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/55 transition group-hover:border-[#F5DA20]/40 group-hover:bg-[#F5DA20]/10 group-hover:text-[#F5DA20]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function NerdZonePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;

  const word = getWordOfDay();
  const { badge } = levelColors(word.level);

  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#F5DA20]/5 blur-[160px]" />
        <div className="absolute top-1/3 -left-32 h-[400px] w-[400px] rounded-full bg-[#F5DA20]/3 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-[400px] w-[400px] rounded-full bg-amber-500/3 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12">

        {/* Breadcrumb */}
        <div className="text-sm text-white/50">
          <a href="/" className="hover:text-white/80 transition">Home</a>
          <span className="mx-2 text-white/45">/</span>
          <span className="text-white/75">Nerd Zone</span>
        </div>

        {/* Hero + Word of the Day */}
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">

          {/* Left: title + description */}
          <div className="flex-1">
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Nerd{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#F5DA20]">Zone</span>
                <span aria-hidden className="pointer-events-none absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#F5DA20]/30" />
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/65">
              Everything a real English nerd needs — in one place. Pick a section and go deep.
            </p>
          </div>

          {/* Right: Word of the Day card */}
          <div className="relative w-full overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-5 lg:w-72 lg:shrink-0 xl:w-80">
            {/* Subtle glow */}
            <div aria-hidden className="pointer-events-none absolute -top-6 -right-6 h-28 w-28 rounded-full bg-[#F5DA20]/8 blur-2xl" />

            {/* Label */}
            <div className="relative mb-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F5DA20]/20 bg-[#F5DA20]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#F5DA20]">
                <span className="h-1 w-1 rounded-full bg-[#F5DA20] animate-pulse" />
                Word of the day
              </span>
            </div>

            {/* Word */}
            <div className="relative">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="text-2xl font-black text-white">{word.word}</span>
                <span className="font-mono text-xs text-white/45">{word.phonetic}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${badge}`}>{word.level}</span>
                <span className="text-[11px] italic text-white/55">{word.partOfSpeech}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-4 h-px bg-white/8" />

            {/* Meaning + example */}
            <div className="relative space-y-1.5">
              <p className="text-sm font-semibold leading-snug text-white/90">{word.meaning}</p>
              <p className="text-xs italic leading-relaxed text-white/55">&ldquo;{word.example}&rdquo;</p>
            </div>
          </div>

        </div>

        {/* ── Section heading ────────────────────────────────────────── */}
        <div className="mt-14 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F5DA20] shadow-lg" />
            <div>
              <h2 className="text-xl font-black text-white">Explore sections</h2>
              <p className="text-xs text-white/55">Pick a topic and dive in</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-[11px] font-semibold text-black/40">
            <span className="h-1.5 w-1.5 rounded-full bg-black/30 animate-pulse" />
            Updated monthly · new content first for Pro
          </span>
        </div>

        {/* ── Section cards — mobile: carousel | desktop: grid ─────── */}
        <div className="mt-6 flex gap-4 overflow-x-auto pb-3 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 sm:-mx-0 sm:px-0 lg:grid-cols-4">
          {SECTIONS.map((s) => (
            <div key={s.slug} className="snap-start">
              <SectionCard s={s} />
            </div>
          ))}
        </div>

        {/* ── Certificate teaser ─────────────────────────────────────── */}
        <div className="mt-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F5DA20] shadow-lg" />
            <div>
              <h2 className="text-xl font-black text-white">Certificate of Achievement</h2>
              <p className="text-xs text-white/55">Prove your English level with a shareable certificate</p>
            </div>
          </div>

          {isPro ? (
            /* PRO: clear CTA to take the test */
            <div className="relative overflow-hidden rounded-2xl border border-[#F5DA20]/20 bg-[#F5DA20]/5 p-8 sm:p-10">
              <div aria-hidden className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#F5DA20]/10 blur-3xl" />
              <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#F5DA20] shadow-lg">
                    <svg className="h-8 w-8 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <div>
                    <p className="text-lg font-black text-white">You&apos;re PRO — earn your certificate!</p>
                    <p className="mt-1 text-sm text-white/55 max-w-sm">Take the English Level Test to find your level. We&apos;ll generate a shareable PDF certificate you can download and keep.</p>
                  </div>
                </div>
                <a
                  href="/tests"
                  className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black shadow-md transition hover:bg-[#e8cf00] hover:shadow-[0_4px_20px_rgba(245,218,32,0.4)]"
                >
                  Take the English Level Test
                </a>
              </div>
            </div>
          ) : (
            /* Non-PRO: blurred preview + lock overlay */
            <div className="relative overflow-hidden rounded-2xl border border-white/8">
              <div className="blur-[3px] saturate-50 pointer-events-none select-none">
                <div className="bg-white p-8 sm:p-12">
                  <div className="max-w-xl mx-auto border-[3px] border-[#F5DA20] rounded-2xl p-8 relative">
                    <div className="absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 border-[#F5DA20]/60 rounded-tl" />
                    <div className="absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 border-[#F5DA20]/60 rounded-tr" />
                    <div className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-[#F5DA20]/60 rounded-bl" />
                    <div className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-[#F5DA20]/60 rounded-br" />
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
                          <span className="text-[10px] font-black text-[#F5DA20]">EN</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">EnglishNerd.cc</span>
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">This certifies that</p>
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-4" />
                      <div className="h-7 w-48 mx-auto rounded-lg bg-slate-100 mb-4" />
                      <p className="text-xs text-slate-400 mb-1">has successfully demonstrated</p>
                      <div className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-1.5 my-2">
                        <span className="text-sm font-black text-white">B2 Level English</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 mb-4">with a score of 87% · April 2026</p>
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-4" />
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-[#F5DA20] flex items-center justify-center">
                          <svg className="h-3 w-3 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        </div>
                        <span className="text-xs font-bold text-slate-500">Verified by English Nerd</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0E0F13]/80 backdrop-blur-[1px]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5DA20] shadow-xl">
                  <svg className="h-7 w-7 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                </div>
                <div className="text-center px-4">
                  <p className="text-lg font-black text-white">Earn your certificate</p>
                  <p className="mt-1 text-sm text-white/55 max-w-xs">Complete the English Level Test and get a shareable PDF certificate to prove your English level. Pro members only.</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
                  <a
                    href="/pro"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#F5DA20] px-5 py-2.5 text-sm font-black text-black shadow-md transition hover:bg-[#e8cf00] hover:shadow-[0_4px_20px_rgba(245,218,32,0.4)]"
                  >
                    Get Pro — Unlock certificate
                  </a>
                  <a href="/tests" className="text-sm font-semibold text-white/55 hover:text-white/70 transition">
                    Take the test first →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
