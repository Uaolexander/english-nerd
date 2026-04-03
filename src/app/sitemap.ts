import type { MetadataRoute } from "next";

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

function url(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly"): MetadataRoute.Sitemap[number] {
  return { url: `${BASE}${path}`, lastModified: new Date(), changeFrequency, priority };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Core pages
    url("/",              1.0, "weekly"),
    url("/nerd-zone",     0.9, "weekly"),
    url("/grammar",       0.9, "weekly"),
    url("/about",         0.5, "yearly"),
    url("/contact",       0.4, "yearly"),
    url("/terms",         0.3, "yearly"),
    url("/privacy-policy",0.3, "yearly"),

    // Grammar level hubs
    url("/grammar/a1",    0.85, "monthly"),
    url("/grammar/a2",    0.85, "monthly"),
    url("/grammar/b1",    0.85, "monthly"),
    url("/grammar/b2",    0.85, "monthly"),
    url("/grammar/c1",    0.85, "monthly"),

    // Grammar topics
    ...GRAMMAR_TOPICS.map((t) => url(`/grammar/${t}`, 0.75, "monthly")),

    // Nerd Zone sections
    url("/nerd-zone/recommendations",          0.85, "weekly"),
    url("/nerd-zone/slang",                    0.8,  "monthly"),
    url("/nerd-zone/slang/b1",                 0.75, "monthly"),
    url("/nerd-zone/slang/b2",                 0.75, "monthly"),
    url("/nerd-zone/slang/c1",                 0.75, "monthly"),
    url("/nerd-zone/live-phrases",             0.8,  "monthly"),
    url("/nerd-zone/live-phrases/b1",          0.75, "monthly"),
    url("/nerd-zone/live-phrases/b2",          0.75, "monthly"),
    url("/nerd-zone/live-phrases/c1",          0.75, "monthly"),
    url("/nerd-zone/phrasal-verbs",            0.8,  "monthly"),
    url("/nerd-zone/phrasal-verbs/b1",         0.75, "monthly"),
    url("/nerd-zone/phrasal-verbs/b2",         0.75, "monthly"),
    url("/nerd-zone/phrasal-verbs/c1",         0.75, "monthly"),
    url("/nerd-zone/irregular-verbs",          0.8,  "monthly"),
    url("/nerd-zone/useful-sites",             0.75, "monthly"),

    // Watch & Learn vocabulary pages
    ...VOCAB_SLUGS.map((slug) =>
      url(`/nerd-zone/recommendations/${slug}`, 0.8, "monthly")
    ),
  ];
}
