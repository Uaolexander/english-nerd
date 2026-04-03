import type { Metadata } from "next";

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Learn English with Films and TV Shows",
  description: "Curated vocabulary sets and interactive exercises for films and TV series, grouped by English level A1 to C1.",
  provider: {
    "@type": "Organization",
    name: "English Nerd",
    sameAs: "https://englishnerd.cc",
  },
  educationalLevel: "A1, A2, B1, B2, C1",
  inLanguage: "en",
  url: "https://englishnerd.cc/nerd-zone/recommendations",
  hasCourseInstance: [
    { "@type": "CourseInstance", courseMode: "online", name: "A2 Elementary", description: "The Lion King, Toy Story, Bluey — simple vocabulary and clear speech." },
    { "@type": "CourseInstance", courseMode: "online", name: "B1 Intermediate", description: "The Office, Friends, Forrest Gump — natural everyday English." },
    { "@type": "CourseInstance", courseMode: "online", name: "B2 Upper-Intermediate", description: "Breaking Bad, The Crown, The Social Network — complex vocabulary." },
    { "@type": "CourseInstance", courseMode: "online", name: "C1 Advanced", description: "House of Cards, Oppenheimer, The King's Speech — sophisticated English." },
  ],
};

export const metadata: Metadata = {
  title: "Watch & Learn — English Media by Level | English Nerd",
  description: "Films, TV series and YouTube channels hand-picked for your English level — A1 to C1. Build your listening and comprehension with content you'll actually enjoy.",
  keywords: ["learn English with films", "English TV shows by level", "English YouTube channels", "watch English A1 B1 B2 C1", "English listening practice"],
  alternates: { canonical: "/nerd-zone/recommendations" },
  openGraph: {
    title: "Watch & Learn — English Media by Level | English Nerd",
    description: "Films, series and YouTube channels for A1, B1, B2 and C1 English learners.",
    url: "https://englishnerd.cc/nerd-zone/recommendations",
    type: "article",
  },
};

type Category = "Film" | "TV Show" | "YouTube";

type Rec = {
  image: string;
  category: Category;
  title: string;
  meta: string;
  description: string;
  watchLink: string;
  vocabularySlug?: string;
  pro?: boolean;
};

const CATEGORY_BADGE: Record<Category, string> = {
  "Film":     "bg-black/65 text-white",
  "TV Show":  "bg-violet-600/90 text-white",
  "YouTube":  "bg-red-600/90 text-white",
};

const A2: Rec[] = [
  {
    image: "lion-king.jpg",
    category: "Film",
    title: "The Lion King",
    meta: "1994 · Disney",
    description: "Simple vocabulary, emotional storytelling and iconic songs — the perfect first English film for absolute beginners.",
    watchLink: "https://www.imdb.com/title/tt0110357/",
    vocabularySlug: "lion-king",
  },
  {
    image: "mrbeast.jpg",
    category: "YouTube",
    title: "MrBeast",
    meta: "MrBeast · YouTube",
    description: "The world's biggest YouTuber — ultra-simple American English, short punchy sentences and irresistible energy.",
    watchLink: "https://www.youtube.com/@MrBeast",
    pro: true,
  },
  {
    image: "bluey.jpg",
    category: "TV Show",
    title: "Bluey",
    meta: "Ludo Studio · ABC Kids",
    description: "A charming Australian animated series with natural, warm family conversations — surprisingly engaging for adult learners too.",
    watchLink: "https://www.imdb.com/title/tt7678620/",
    vocabularySlug: "bluey",
    pro: true,
  },
  {
    image: "english-with-lucy.jpg",
    category: "YouTube",
    title: "English with Lucy",
    meta: "Lucy Earl · YouTube",
    description: "Clear pronunciation lessons at a comfortable pace — ideal for building your first vocabulary and getting used to British English.",
    watchLink: "https://www.youtube.com/@EnglishwithLucy",
    pro: true,
  },
  {
    image: "bbc-learning-english.jpg",
    category: "YouTube",
    title: "BBC Learning English",
    meta: "BBC · YouTube",
    description: "Official beginner lessons from the world's most trusted broadcaster — vocabulary, grammar and pronunciation all in one place.",
    watchLink: "https://www.youtube.com/@bbclearningenglish",
    pro: true,
  },
  {
    image: "toy-story.jpg",
    category: "Film",
    title: "Toy Story",
    meta: "1995 · Pixar",
    description: "A timeless Pixar classic with very clear dialogue — simple emotional story and characters you'll never forget.",
    watchLink: "https://www.imdb.com/title/tt0114709/",
    vocabularySlug: "toy-story",
    pro: true,
  },
];

const B1: Rec[] = [
  {
    image: "the-office.jpg",
    category: "TV Show",
    title: "The Office",
    meta: "2005–2013 · NBC",
    description: "Natural workplace conversations and mockumentary humour — an immersive window into American office culture and everyday speech.",
    watchLink: "https://www.imdb.com/title/tt0386676/",
    vocabularySlug: "the-office",
  },
  {
    image: "friends.jpg",
    category: "TV Show",
    title: "Friends",
    meta: "1994–2004 · NBC",
    description: "The ultimate B1 series — everyday American English, natural humour and cultural references you'll hear for the rest of your life.",
    watchLink: "https://www.imdb.com/title/tt0108778/",
    vocabularySlug: "friends",
    pro: true,
  },
  {
    image: "the-simpsons.jpg",
    category: "TV Show",
    title: "The Simpsons",
    meta: "1989– · FOX",
    description: "Classic American English packed with pop culture references — early seasons are a goldmine for everyday vocabulary and humour.",
    watchLink: "https://www.imdb.com/title/tt0096697/",
    vocabularySlug: "the-simpsons",
    pro: true,
  },
  {
    image: "ted-ed.jpg",
    category: "YouTube",
    title: "TED-Ed",
    meta: "TED · YouTube",
    description: "Short animated lessons on science, history and philosophy — clear academic English with excellent vocabulary in just 5 minutes.",
    watchLink: "https://www.youtube.com/@TEDEd",
  },
  {
    image: "forrest-gump.jpg",
    category: "Film",
    title: "Forrest Gump",
    meta: "1994 · Robert Zemeckis",
    description: "An iconic American story told in warm, clear language — great for Southern American English, cultural history and emotional vocabulary.",
    watchLink: "https://www.imdb.com/title/tt0109830/",
    vocabularySlug: "forrest-gump",
    pro: true,
  },
  {
    image: "ellen-show.jpg",
    category: "YouTube",
    title: "The Ellen DeGeneres Show",
    meta: "Warner Bros. · YouTube",
    description: "Warm, conversational American English — celebrity interviews and games at a comfortable pace that's easy to follow and enjoy.",
    watchLink: "https://www.youtube.com/@TheEllenShow",
  },
];

const B2: Rec[] = [
  {
    image: "breaking-bad.jpg",
    category: "TV Show",
    title: "Breaking Bad",
    meta: "2008–2013 · AMC",
    description: "Complex characters, layered dialogue and shifting registers — from chemistry class to street slang. One of the best written shows ever.",
    watchLink: "https://www.imdb.com/title/tt0903747/",
    vocabularySlug: "breaking-bad",
  },
  {
    image: "the-crown.jpg",
    category: "TV Show",
    title: "The Crown",
    meta: "2016–2023 · Netflix",
    description: "Formal British English at its finest — aristocratic vocabulary, diplomatic language and rich historical context across every episode.",
    watchLink: "https://www.imdb.com/title/tt4786824/",
    vocabularySlug: "the-crown",
    pro: true,
  },
  {
    image: "tonight-show.jpg",
    category: "YouTube",
    title: "The Tonight Show with Jimmy Fallon",
    meta: "NBC · YouTube",
    description: "Fast, witty American late-night humour — celebrity banter, current slang and cultural references delivered at full speed.",
    watchLink: "https://www.youtube.com/@FallonTonight",
  },
  {
    image: "kurzgesagt.jpg",
    category: "YouTube",
    title: "Kurzgesagt – In a Nutshell",
    meta: "Kurzgesagt · YouTube",
    description: "Complex scientific and philosophical topics explained with stunning clarity — a goldmine for academic vocabulary and structured thinking.",
    watchLink: "https://www.youtube.com/@kurzgesagt",
  },
  {
    image: "social-network.jpg",
    category: "Film",
    title: "The Social Network",
    meta: "2010 · David Fincher",
    description: "Razor-sharp, rapid-fire dialogue — perhaps the best screenplay for learning contemporary American English and intellectual banter.",
    watchLink: "https://www.imdb.com/title/tt1285016/",
    vocabularySlug: "social-network",
    pro: true,
  },
  {
    image: "the-martian.jpg",
    category: "Film",
    title: "The Martian",
    meta: "2015 · Ridley Scott",
    description: "Modern scientific vocabulary mixed with sharp humour — a masterclass in natural American English and problem-solving language.",
    watchLink: "https://www.imdb.com/title/tt3659388/",
    vocabularySlug: "the-martian",
    pro: true,
  },
];

const C1: Rec[] = [
  {
    image: "house-of-cards.jpg",
    category: "TV Show",
    title: "House of Cards",
    meta: "2013–2018 · Netflix",
    description: "Sophisticated political rhetoric and manipulation — every scene is a lesson in persuasion, power and the nuance of formal English.",
    watchLink: "https://www.imdb.com/title/tt1856010/",
    vocabularySlug: "house-of-cards",
    pro: true,
  },
  {
    image: "black-mirror.jpg",
    category: "TV Show",
    title: "Black Mirror",
    meta: "2011– · Netflix",
    description: "Dark, cerebral and conceptually demanding — advanced vocabulary, philosophical themes and complex moral arguments in every episode.",
    watchLink: "https://www.imdb.com/title/tt2085059/",
    vocabularySlug: "black-mirror",
    pro: true,
  },
  {
    image: "late-show-colbert.jpg",
    category: "YouTube",
    title: "The Late Show with Stephen Colbert",
    meta: "CBS · YouTube",
    description: "Political satire at its sharpest — wit, irony, cultural commentary and sophisticated humour that demands full comprehension.",
    watchLink: "https://www.youtube.com/@colbertlateshow",
  },
  {
    image: "lex-fridman.jpg",
    category: "YouTube",
    title: "Lex Fridman Podcast",
    meta: "Lex Fridman · YouTube",
    description: "Long-form intellectual conversations with scientists, philosophers and engineers — demanding academic English at its most authentic.",
    watchLink: "https://www.youtube.com/@lexfridman",
  },
  {
    image: "kings-speech.jpg",
    category: "Film",
    title: "The King's Speech",
    meta: "2010 · Tom Hooper",
    description: "Formal British English and powerful oratory — a masterclass in the beauty of well-chosen words and eloquent speechmaking.",
    watchLink: "https://www.imdb.com/title/tt1504320/",
    vocabularySlug: "kings-speech",
    pro: true,
  },
  {
    image: "oppenheimer.jpg",
    category: "Film",
    title: "Oppenheimer",
    meta: "2023 · Christopher Nolan",
    description: "Complex scientific vocabulary, philosophical debates and moral arguments — Nolan's most dialogue-rich film. Essential for C1 learners.",
    watchLink: "https://www.imdb.com/title/tt15398776/",
    vocabularySlug: "oppenheimer",
    pro: true,
  },
];

const SECTIONS: {
  id: string;
  label: string;
  sublabel: string;
  badge: string;
  subtitle: string;
  items: Rec[];
}[] = [
  {
    id: "a1",
    label: "A2",
    sublabel: "Elementary",
    badge: "bg-emerald-500 text-white",
    subtitle: "Slow, clear speech and simple vocabulary — build your listening confidence from day one",
    items: A2,
  },
  {
    id: "b1",
    label: "B1",
    sublabel: "Intermediate",
    badge: "bg-violet-500 text-white",
    subtitle: "Natural conversations and everyday humour — the sweet spot for intermediate learners",
    items: B1,
  },
  {
    id: "b2",
    label: "B2",
    sublabel: "Upper-Intermediate",
    badge: "bg-orange-500 text-white",
    subtitle: "Complex dialogue and varied registers — start watching like a native",
    items: B2,
  },
  {
    id: "c1",
    label: "C1",
    sublabel: "Advanced",
    badge: "bg-sky-500 text-white",
    subtitle: "Sophisticated language, nuanced humour and intellectual depth — for the serious learner",
    items: C1,
  },
];

export default function RecommendationsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]" style={{ scrollBehavior: "smooth" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          {[["Home", "/"], ["Nerd Zone", "/nerd-zone"]].map(([label, href]) => (
            <span key={href} className="flex items-center gap-1.5">
              <a href={href} className="hover:text-slate-700 transition">{label}</a>
              <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          ))}
          <span className="text-slate-700 font-medium">Watch & Learn</span>
        </nav>

        {/* Hero */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-amber-100 px-3 py-0.5 text-[11px] font-black text-amber-700">Watch & Learn</span>
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">A2 · B1 · B2 · C1</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
            Watch &{" "}
            <span className="relative inline-block">
              Learn
              <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] text-slate-500 leading-relaxed">
            Films, series and YouTube channels hand-picked for your English level. Real content you'll actually enjoy — no textbook exercises.
          </p>
        </div>

        {/* Level quick nav */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <a href="#a1" className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-black text-white shadow-sm transition hover:opacity-85">A2</a>
          <a href="#b1" className="rounded-xl bg-violet-500 px-5 py-2 text-sm font-black text-white shadow-sm transition hover:opacity-85">B1</a>
          <a href="#b2" className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-black text-white shadow-sm transition hover:opacity-85">B2</a>
          <a href="#c1" className="rounded-xl bg-sky-500 px-5 py-2 text-sm font-black text-white shadow-sm transition hover:opacity-85">C1</a>
        </div>

        {/* Level sections */}
        {SECTIONS.map(({ id, label, sublabel, badge, subtitle, items }, si) => (
          <section key={id} id={id} className={`scroll-mt-6 ${si === 0 ? "mt-12" : "mt-16 border-t border-slate-100 pt-12"}`}>

            {/* Section header */}
            <div className="flex flex-wrap items-start gap-3 mb-6">
              <span className={`rounded-xl ${badge} px-4 py-1.5 text-sm font-black shadow-sm`}>{label}</span>
              <div>
                <div className="text-base font-black text-slate-900">{sublabel}</div>
                <div className="text-sm text-slate-400 leading-snug mt-0.5">{subtitle}</div>
              </div>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((rec) => (
                <div key={rec.title} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col">

                  {/* Cover image */}
                  <div className="relative h-44 overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={`/topics/nerd-zone/recommendations/${rec.image}`}
                      alt={rec.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                    />
                    <span className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-black backdrop-blur-sm ${CATEGORY_BADGE[rec.category]}`}>
                      {rec.category}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-5">
                    <div className="text-base font-black text-slate-900 leading-tight">{rec.title}</div>
                    <div className="mt-0.5 text-xs text-slate-400">{rec.meta}</div>
                    <p className="mt-2.5 text-sm text-slate-500 leading-relaxed flex-1">{rec.description}</p>

                    {/* Action buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">

                      {/* Watch button — always shown */}
                      <a
                        href={rec.watchLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700 transition"
                      >
                        {rec.category === "YouTube" ? (
                          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        ) : (
                          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        )}
                        {rec.category === "YouTube" ? "YouTube" : "IMDb"}
                      </a>

                      {/* Key Vocabulary button — only for films and TV shows */}
                      {rec.vocabularySlug && (
                        <a
                          href={`/nerd-zone/recommendations/${rec.vocabularySlug}`}
                          className="relative inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#F5DA20] px-3 py-2 text-xs font-bold text-black hover:bg-[#edd800] transition"
                        >
                          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                          Study & Practice
                          {rec.pro && (
                            <span className="absolute -top-2 -right-1.5 inline-flex items-center gap-0.5 rounded-full bg-black px-1.5 py-0.5 text-[9px] font-black text-[#F5DA20] shadow">
                              <svg className="h-2 w-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                              PRO
                            </span>
                          )}
                        </a>
                      )}

                    </div>
                  </div>

                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Bottom nav */}
        <div className="mt-16 border-t border-slate-100 pt-6">
          <a href="/nerd-zone" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Back to Nerd Zone
          </a>
        </div>

      </div>
    </div>
  );
}
