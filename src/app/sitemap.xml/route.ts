const BASE = "https://englishnerd.cc";

const GRAMMAR_TOPICS: string[] = [
  // A1
  "a1/adverbs-frequency", "a1/prepositions-place", "a1/present-simple-i-you-we-they",
  "a1/wh-questions", "a1/to-be-am-is-are", "a1/have-has-got", "a1/plural-nouns",
  "a1/present-simple-he-she-it", "a1/subject-pronouns", "a1/possessive-adjectives",
  "a1/prepositions-time-in-on-at", "a1/present-simple-negative", "a1/this-that-these-those",
  "a1/much-many-basic", "a1/some-any", "a1/present-simple-questions", "a1/can-cant",
  "a1/there-is-there-are", "a1/countable-uncountable", "a1/articles-a-an",
  // A2
  "a2/past-simple-negative-questions", "a2/superlative-adjectives", "a2/conjunctions",
  "a2/prepositions-movement", "a2/articles-the", "a2/possessive-pronouns",
  "a2/comparative-adjectives", "a2/past-simple-irregular", "a2/time-expressions-past",
  "a2/present-continuous", "a2/verb-ing", "a2/verb-infinitive", "a2/past-simple-regular",
  "a2/object-pronouns", "a2/should-shouldnt", "a2/adverbs-manner", "a2/have-to",
  "a2/present-perfect-intro", "a2/going-to", "a2/will-future",
  // B1
  "b1/modal-possibility", "b1/past-continuous", "b1/zero-first-conditional",
  "b1/as-as-comparison", "b1/passive-present", "b1/wish-past", "b1/phrasal-verbs",
  "b1/reported-statements", "b1/all-conditionals", "b1/second-conditional",
  "b1/reported-questions", "b1/modal-deduction", "b1/past-perfect",
  "b1/relative-clauses-non-defining", "b1/would-past-habits", "b1/present-perfect-continuous",
  "b1/too-enough", "b1/passive-past", "b1/so-such", "b1/used-to",
  "b1/relative-clauses-defining",
  // B2
  "b2/future-perfect", "b2/participle-clauses", "b2/future-continuous",
  "b2/reported-speech-advanced", "b2/inversion", "b2/passive-advanced",
  "b2/relative-clauses-advanced", "b2/quantifiers-advanced", "b2/wish-would",
  "b2/cleft-sentences", "b2/linking-words", "b2/mixed-conditionals",
  "b2/past-perfect-continuous", "b2/third-conditional", "b2/all-conditionals-b2",
  "b2/modal-perfect", "b2/gerunds-infinitives", "b2/causative",
  // C1
  "c1/complex-noun-phrases", "c1/advanced-inversion", "c1/complex-passives",
  "c1/advanced-discourse-markers", "c1/passive-infinitives", "c1/word-formation",
  "c1/advanced-relative-clauses", "c1/reported-speech-c1", "c1/extraposition",
  "c1/concession-contrast", "c1/hedging-language", "c1/fronting-emphasis",
  "c1/nominalisation", "c1/ellipsis-substitution", "c1/inverted-conditionals",
  "c1/advanced-participle-clauses", "c1/subjunctive", "c1/advanced-modals",
];

const VOCAB_SLUGS: string[] = [
  "lion-king", "toy-story", "bluey", "friends", "the-office",
  "the-simpsons", "forrest-gump", "breaking-bad", "the-crown",
  "social-network", "the-martian", "house-of-cards", "black-mirror",
  "kings-speech", "oppenheimer",
];

const VOCABULARY_TOPICS: string[] = [
  "a1/animals", "a1/at-the-cafe", "a1/my-body", "a1/my-family",
  "a2/around-the-town", "a2/at-the-restaurant", "a2/clothes-and-shopping", "a2/my-weekend",
  "b1/city-life", "b1/health-and-fitness", "b1/job-interview", "b1/travel-plans",
  "b2/business-meeting", "b2/environment", "b2/media-and-technology", "b2/social-issues",
  "c1/academic-debate", "c1/economic-challenges", "c1/formal-english", "c1/idioms-and-phrases",
];

const READING_ARTICLES: string[] = [
  "a1/four-friends", "a1/at-the-market", "a1/my-school-day",
  "a2/a-weekend-trip", "a2/city-or-country", "a2/pen-pals",
  "b1/digital-lives", "b1/the-slow-travel-movement", "b1/work-from-home",
  "b2/the-gig-economy", "b2/changing-cities", "b2/the-psychology-of-habits",
  "c1/rethinking-intelligence", "c1/language-and-thought", "c1/the-attention-economy",
];

const TENSES_EXERCISES: [string, string[]][] = [
  ["present-simple",            ["to-be", "do-dont-do-i", "fill-in-blank", "quiz", "sentence-builder", "spot-the-mistake", "ps-vs-pc", "ps-pc-advanced"]],
  ["present-continuous",        ["ing-forms", "stative-verbs", "fill-in-blank", "quiz", "sentence-builder", "spot-the-mistake", "ps-vs-pc", "ps-pc-advanced"]],
  ["present-perfect",           ["have-has", "for-since", "irregular-participles", "fill-in-blank", "quiz", "sentence-builder", "spot-the-mistake", "pp-vs-ps"]],
  ["present-perfect-continuous",["have-been-ing", "for-since-duration", "fill-in-blank", "quiz", "sentence-builder", "spot-the-mistake", "pp-vs-ppc", "all-present-tenses"]],
  ["past-simple",               ["regular-past-simple", "irregular-past-simple", "did-didnt", "fill-in-blank", "quiz", "sentence-builder", "spot-the-mistake", "ps-vs-pc"]],
  ["past-continuous",           ["was-were-ing", "when-while", "interrupted-actions", "fill-in-blank", "quiz", "sentence-builder", "spot-the-mistake", "ps-vs-pc"]],
  ["past-perfect",              ["had-past-participle", "irregular-participles", "sequence-of-events", "fill-in-blank", "quiz", "sentence-builder", "spot-the-mistake", "past-perfect-vs-past-simple"]],
  ["past-perfect-continuous",   ["had-been-ing", "for-since-past", "fill-in-blank", "quiz", "sentence-builder", "spot-the-mistake", "pp-vs-ppc-past", "all-past-tenses"]],
  ["future-simple",             ["will-wont", "will-vs-going-to", "predictions", "promises-offers", "fill-in-blank", "quiz", "sentence-builder", "spot-the-mistake"]],
  ["be-going-to",               ["am-is-are-going-to", "evidence-predictions", "plans-intentions", "will-vs-going-to", "fill-in-blank", "quiz", "sentence-builder", "spot-the-mistake"]],
  ["future-continuous",         ["will-be-ing", "at-future-moment", "polite-questions", "will-vs-will-be-ing", "fill-in-blank", "quiz", "sentence-builder", "spot-the-mistake"]],
  ["future-perfect",            ["will-have-past-participle", "by-the-time", "irregular-participles", "future-perfect-vs-simple", "fill-in-blank", "quiz", "sentence-builder", "spot-the-mistake"]],
  ["future-perfect-continuous",  ["will-have-been-ing", "for-duration-future", "fp-vs-fpc", "all-future-tenses", "fill-in-blank", "quiz", "sentence-builder", "spot-the-mistake"]],
];

function entry(
  path: string,
  priority: number,
  changefreq: string,
  today: string,
): string {
  return `  <url>\n    <loc>${BASE}${path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export function GET() {
  const today = new Date().toISOString().split("T")[0];

  const u = (path: string, p: number, cf = "monthly") => entry(path, p, cf, today);

  const lines: string[] = [
    // Core pages
    u("/",               1.0, "weekly"),
    u("/nerd-zone",      0.9, "weekly"),
    u("/grammar",        0.9, "weekly"),
    u("/about",          0.5, "yearly"),
    u("/contact",        0.4, "yearly"),
    u("/terms",          0.3, "yearly"),
    u("/privacy-policy", 0.3, "yearly"),

    // Grammar level hubs
    u("/grammar/a1", 0.85),
    u("/grammar/a2", 0.85),
    u("/grammar/b1", 0.85),
    u("/grammar/b2", 0.85),
    u("/grammar/c1", 0.85),

    // Grammar topics
    ...GRAMMAR_TOPICS.map((t) => u(`/grammar/${t}`, 0.75)),

    // Nerd Zone sections
    u("/nerd-zone/recommendations",       0.85, "weekly"),
    u("/nerd-zone/slang",                 0.8),
    u("/nerd-zone/slang/b1",              0.75),
    u("/nerd-zone/slang/b2",              0.75),
    u("/nerd-zone/slang/c1",              0.75),
    u("/nerd-zone/live-phrases",          0.8),
    u("/nerd-zone/live-phrases/b1",       0.75),
    u("/nerd-zone/live-phrases/b2",       0.75),
    u("/nerd-zone/live-phrases/c1",       0.75),
    u("/nerd-zone/phrasal-verbs",         0.8),
    u("/nerd-zone/phrasal-verbs/b1",      0.75),
    u("/nerd-zone/phrasal-verbs/b2",      0.75),
    u("/nerd-zone/phrasal-verbs/c1",      0.75),
    u("/nerd-zone/irregular-verbs",       0.8),
    u("/nerd-zone/useful-sites",          0.75),

    // Watch & Learn vocabulary pages
    ...VOCAB_SLUGS.map((slug) => u(`/nerd-zone/recommendations/${slug}`, 0.8)),

    // Vocabulary hub + level hubs + topics
    u("/vocabulary",    0.9, "weekly"),
    u("/vocabulary/a1", 0.8),
    u("/vocabulary/a2", 0.8),
    u("/vocabulary/b1", 0.8),
    u("/vocabulary/b2", 0.8),
    u("/vocabulary/c1", 0.8),
    ...VOCABULARY_TOPICS.map((t) => u(`/vocabulary/${t}`, 0.75)),

    // Tenses hub + tense hubs + exercises
    u("/tenses", 0.9, "weekly"),
    ...TENSES_EXERCISES.flatMap(([tense, exercises]) => [
      u(`/tenses/${tense}`, 0.8),
      ...exercises.map((ex) => u(`/tenses/${tense}/${ex}`, 0.7)),
    ]),

    // Reading hub + level hubs + articles
    u("/reading",    0.85, "weekly"),
    u("/reading/a1", 0.75),
    u("/reading/a2", 0.75),
    u("/reading/b1", 0.75),
    u("/reading/b2", 0.75),
    u("/reading/c1", 0.75),
    ...READING_ARTICLES.map((a) => u(`/reading/${a}`, 0.7)),

    // Listening hub + level hubs + content
    u("/listening",    0.8, "weekly"),
    u("/listening/a1", 0.65),
    u("/listening/a2", 0.65),
    u("/listening/b1", 0.65),
    u("/listening/b2", 0.7),
    u("/listening/c1", 0.65),
    u("/listening/b2/work-life-balance", 0.65),

    // Tests hub + individual tests
    u("/tests",            0.85, "weekly"),
    u("/tests/grammar",    0.8),
    u("/tests/tenses",     0.8),
    u("/tests/vocabulary", 0.8),

    // PRO page
    u("/pro", 0.9, "weekly"),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Vary": "Accept-Encoding",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
