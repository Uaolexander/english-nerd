import type { Metadata } from "next";

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
};

const CATEGORY_BADGE: Record<Category, string> = {
  "Film":     "bg-black/65 text-white",
  "TV Show":  "bg-violet-600/90 text-white",
  "YouTube":  "bg-red-600/90 text-white",
};

const A1: Rec[] = [
  {
    image: "lion-king.jpg",
    category: "Film",
    title: "The Lion King",
    meta: "1994 · Disney",
    description: "Simple vocabulary, emotional storytelling and iconic songs — the perfect first English film for absolute beginners.",
  },
  {
    image: "mrbeast.jpg",
    category: "YouTube",
    title: "MrBeast",
    meta: "MrBeast · YouTube",
    description: "The world's biggest YouTuber — ultra-simple American English, short punchy sentences and irresistible energy.",
  },
  {
    image: "bluey.jpg",
    category: "TV Show",
    title: "Bluey",
    meta: "Ludo Studio · ABC Kids",
    description: "A charming Australian animated series with natural, warm family conversations — surprisingly engaging for adult learners too.",
  },
  {
    image: "english-with-lucy.jpg",
    category: "YouTube",
    title: "English with Lucy",
    meta: "Lucy Earl · YouTube",
    description: "Clear pronunciation lessons at a comfortable pace — ideal for building your first vocabulary and getting used to British English.",
  },
  {
    image: "bbc-learning-english.jpg",
    category: "YouTube",
    title: "BBC Learning English",
    meta: "BBC · YouTube",
    description: "Official beginner lessons from the world's most trusted broadcaster — vocabulary, grammar and pronunciation all in one place.",
  },
  {
    image: "toy-story.jpg",
    category: "Film",
    title: "Toy Story",
    meta: "1995 · Pixar",
    description: "A timeless Pixar classic with very clear dialogue — simple emotional story and characters you'll never forget.",
  },
];

const B1: Rec[] = [
  {
    image: "friends.jpg",
    category: "TV Show",
    title: "Friends",
    meta: "1994–2004 · NBC",
    description: "The ultimate B1 series — everyday American English, natural humour and cultural references you'll hear for the rest of your life.",
  },
  {
    image: "the-office.jpg",
    category: "TV Show",
    title: "The Office",
    meta: "2005–2013 · NBC",
    description: "Natural workplace conversations and mockumentary humour — an immersive window into American office culture and everyday speech.",
  },
  {
    image: "the-simpsons.jpg",
    category: "TV Show",
    title: "The Simpsons",
    meta: "1989– · FOX",
    description: "Classic American English packed with pop culture references — early seasons are a goldmine for everyday vocabulary and humour.",
  },
  {
    image: "ted-ed.jpg",
    category: "YouTube",
    title: "TED-Ed",
    meta: "TED · YouTube",
    description: "Short animated lessons on science, history and philosophy — clear academic English with excellent vocabulary in just 5 minutes.",
  },
  {
    image: "forrest-gump.jpg",
    category: "Film",
    title: "Forrest Gump",
    meta: "1994 · Robert Zemeckis",
    description: "An iconic American story told in warm, clear language — great for Southern American English, cultural history and emotional vocabulary.",
  },
  {
    image: "ellen-show.jpg",
    category: "YouTube",
    title: "The Ellen DeGeneres Show",
    meta: "Warner Bros. · YouTube",
    description: "Warm, conversational American English — celebrity interviews and games at a comfortable pace that's easy to follow and enjoy.",
  },
];

const B2: Rec[] = [
  {
    image: "breaking-bad.jpg",
    category: "TV Show",
    title: "Breaking Bad",
    meta: "2008–2013 · AMC",
    description: "Complex characters, layered dialogue and shifting registers — from chemistry class to street slang. One of the best written shows ever.",
  },
  {
    image: "the-crown.jpg",
    category: "TV Show",
    title: "The Crown",
    meta: "2016–2023 · Netflix",
    description: "Formal British English at its finest — aristocratic vocabulary, diplomatic language and rich historical context across every episode.",
  },
  {
    image: "tonight-show.jpg",
    category: "YouTube",
    title: "The Tonight Show with Jimmy Fallon",
    meta: "NBC · YouTube",
    description: "Fast, witty American late-night humour — celebrity banter, current slang and cultural references delivered at full speed.",
  },
  {
    image: "kurzgesagt.jpg",
    category: "YouTube",
    title: "Kurzgesagt – In a Nutshell",
    meta: "Kurzgesagt · YouTube",
    description: "Complex scientific and philosophical topics explained with stunning clarity — a goldmine for academic vocabulary and structured thinking.",
  },
  {
    image: "social-network.jpg",
    category: "Film",
    title: "The Social Network",
    meta: "2010 · David Fincher",
    description: "Razor-sharp, rapid-fire dialogue — perhaps the best screenplay for learning contemporary American English and intellectual banter.",
  },
  {
    image: "the-martian.jpg",
    category: "Film",
    title: "The Martian",
    meta: "2015 · Ridley Scott",
    description: "Modern scientific vocabulary mixed with sharp humour — a masterclass in natural American English and problem-solving language.",
  },
];

const C1: Rec[] = [
  {
    image: "house-of-cards.jpg",
    category: "TV Show",
    title: "House of Cards",
    meta: "2013–2018 · Netflix",
    description: "Sophisticated political rhetoric and manipulation — every scene is a lesson in persuasion, power and the nuance of formal English.",
  },
  {
    image: "black-mirror.jpg",
    category: "TV Show",
    title: "Black Mirror",
    meta: "2011– · Netflix",
    description: "Dark, cerebral and conceptually demanding — advanced vocabulary, philosophical themes and complex moral arguments in every episode.",
  },
  {
    image: "late-show-colbert.jpg",
    category: "YouTube",
    title: "The Late Show with Stephen Colbert",
    meta: "CBS · YouTube",
    description: "Political satire at its sharpest — wit, irony, cultural commentary and sophisticated humour that demands full comprehension.",
  },
  {
    image: "lex-fridman.jpg",
    category: "YouTube",
    title: "Lex Fridman Podcast",
    meta: "Lex Fridman · YouTube",
    description: "Long-form intellectual conversations with scientists, philosophers and engineers — demanding academic English at its most authentic.",
  },
  {
    image: "kings-speech.jpg",
    category: "Film",
    title: "The King's Speech",
    meta: "2010 · Tom Hooper",
    description: "Formal British English and powerful oratory — a masterclass in the beauty of well-chosen words and eloquent speechmaking.",
  },
  {
    image: "oppenheimer.jpg",
    category: "Film",
    title: "Oppenheimer",
    meta: "2023 · Christopher Nolan",
    description: "Complex scientific vocabulary, philosophical debates and moral arguments — Nolan's most dialogue-rich film. Essential for C1 learners.",
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
    label: "A1",
    sublabel: "Beginner",
    badge: "bg-[#F5DA20] text-black",
    subtitle: "Slow, clear speech and simple vocabulary — build your listening confidence from day one",
    items: A1,
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
    <div className="min-h-screen bg-[#FAFAFA]">
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
            <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">A1 · B1 · B2 · C1</span>
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
          <a href="#a1" className="rounded-xl bg-[#F5DA20] px-5 py-2 text-sm font-black text-black shadow-sm transition hover:opacity-85">A1</a>
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
                <div key={rec.title} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">

                  {/* Cover image */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
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
                  <div className="p-5">
                    <div className="text-base font-black text-slate-900 leading-tight">{rec.title}</div>
                    <div className="mt-0.5 text-xs text-slate-400">{rec.meta}</div>
                    <p className="mt-2.5 text-sm text-slate-500 leading-relaxed">{rec.description}</p>
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
