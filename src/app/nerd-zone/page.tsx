import ImageWithFallback from "@/components/ImageWithFallback";

export const metadata = {
  title: "Nerd Zone — English Nerd",
  description:
    "Your English toolkit. Irregular verbs, phrasal verbs, live phrases, slang, useful websites and recommendations — all in one place.",
  alternates: { canonical: "/nerd-zone" },
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
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-4xl opacity-20 select-none transition group-hover:opacity-30">
          {s.icon}
        </div>
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
          <span className="text-[11px] font-medium text-white/35">{s.count}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 transition group-hover:border-[#F5DA20]/40 group-hover:bg-[#F5DA20]/10 group-hover:text-[#F5DA20]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NerdZonePage() {
  const word = getWordOfDay();
  const { badge, glow } = levelColors(word.level);

  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white">
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
          <span className="mx-2 text-white/25">/</span>
          <span className="text-white/75">Nerd Zone</span>
        </div>

        {/* Hero */}
        <div className="mt-6">
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Nerd{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#F5DA20]">Zone</span>
              <span aria-hidden className="pointer-events-none absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#F5DA20]/30" />
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/65">
            Everything a real English nerd needs — in one place. Pick a section and go deep.
          </p>
        </div>

        {/* ── Word of the Day ─────────────────────────────────────── */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-[#F5DA20]/25 bg-gradient-to-br from-[#F5DA20]/8 via-[#F5DA20]/4 to-transparent">
          {/* Header */}
          <div className="flex items-center gap-2.5 border-b border-[#F5DA20]/12 px-5 py-3">
            <span className="text-sm">✨</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#F5DA20]/80">Word of the day</span>
            <span className="ml-auto text-[10px] font-medium text-white/40">Changes every day</span>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:gap-8">
            {/* Word block */}
            <div className="shrink-0">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white sm:text-4xl">{word.word}</span>
                <span className="font-mono text-sm text-white/55">{word.phonetic}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${badge}`}>
                  {word.level}
                </span>
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold text-white/70 ${glow}`}>
                  {word.partOfSpeech}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden h-14 w-px bg-[#F5DA20]/15 sm:block shrink-0" />
            <div className="h-px bg-[#F5DA20]/12 sm:hidden" />

            {/* Meaning + example */}
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-base font-semibold leading-snug text-white">{word.meaning}</p>
              <p className="text-sm italic leading-relaxed text-white/60">&ldquo;{word.example}&rdquo;</p>
            </div>
          </div>
        </div>

        {/* ── Section heading ────────────────────────────────────────── */}
        <div className="mt-14 flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F5DA20] shadow-lg" />
          <div>
            <h2 className="text-xl font-black text-white">Explore sections</h2>
            <p className="text-xs text-white/40">Pick a topic and dive in</p>
          </div>
        </div>

        {/* ── Section cards — mobile: carousel | desktop: grid ─────── */}
        <div className="mt-6 flex gap-4 overflow-x-auto pb-3 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 sm:-mx-0 sm:px-0 lg:grid-cols-4">
          {SECTIONS.map((s) => (
            <div key={s.slug} className="snap-start">
              <SectionCard s={s} />
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
