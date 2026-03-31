"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// ── Types ──────────────────────────────────────────────────────────────────

export type ProgressStats = {
  totalCompleted: number;
  avgScore: number | null;
  topicsMastered: number;
  recentActivity: Array<{
    id: string;
    category: string;
    level: string | null;
    slug: string;
    exercise_no: number | null;
    score: number;
    completed_at: string;
  }>;
  byLevel: Record<string, { completed: number; avgScore: number }>;
  testResults: { grammar?: number; tenses?: number; vocabulary?: number };
};

type Props = {
  email: string;
  fullName: string;
  avatarUrl: string;
  createdAt: string;
  provider: string;
  stats: ProgressStats;
};

type Tab = "profile" | "security" | "progress";

// ── Helpers ────────────────────────────────────────────────────────────────

function initials(name: string, email: string) {
  if (name.trim()) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function memberSince(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function slugToTitle(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const LEVEL_TOTALS: Record<string, number> = {
  a1: 76, // 19 topics × 4
  a2: 80, // 20 topics × 4
  b1: 84, // 21 topics × 4
  b2: 72, // 18 topics × 4
  c1: 72, // 18 topics × 4
};

const LEVEL_LABELS: Record<string, string> = {
  a1: "A1 — Beginner",
  a2: "A2 — Elementary",
  b1: "B1 — Intermediate",
  b2: "B2 — Upper-Int.",
  c1: "C1 — Advanced",
};

const LEVEL_COLORS: Record<string, { bar: string; text: string; bg: string; badge: string }> = {
  a1: { bar: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50", badge: "bg-emerald-500" },
  a2: { bar: "bg-sky-500",     text: "text-sky-700",     bg: "bg-sky-50",     badge: "bg-sky-500"     },
  b1: { bar: "bg-violet-500",  text: "text-violet-700",  bg: "bg-violet-50",  badge: "bg-violet-500"  },
  b2: { bar: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50",   badge: "bg-amber-500"   },
  c1: { bar: "bg-rose-500",    text: "text-rose-700",    bg: "bg-rose-50",    badge: "bg-rose-500"    },
};

// ── Catalogs for recommendations ──────────────────────────────────────────

type TopicRec = {
  slug: string; title: string; img: string; href: string;
  level: string; badge: string; reason?: string;
};

// Level → best-fit tense recommendation
const TENSES_BY_LEVEL: Record<string, { slug: string; title: string; img: string; href: string }> = {
  a1: { slug: "present-simple",    title: "Present Simple",    img: "/topics/tenses/present-simple.jpg",    href: "/tenses/present-simple" },
  a2: { slug: "past-simple",       title: "Past Simple",       img: "/topics/tenses/past-simple.jpg",       href: "/tenses/past-simple" },
  b1: { slug: "present-perfect",   title: "Present Perfect",   img: "/topics/tenses/present-perfect.jpg",   href: "/tenses/present-perfect" },
  b2: { slug: "past-perfect",      title: "Past Perfect",      img: "/topics/tenses/past-perfect.jpg",      href: "/tenses/past-perfect" },
  c1: { slug: "future-perfect",    title: "Future Perfect",    img: "/topics/tenses/future-perfect.jpg",    href: "/tenses/future-perfect" },
};

const VOCAB_BY_LEVEL: Record<string, { href: string; title: string }> = {
  a1: { href: "/vocabulary/a1", title: "A1 Vocabulary" },
  a2: { href: "/vocabulary/a2", title: "A2 Vocabulary" },
  b1: { href: "/vocabulary/b1", title: "B1 Vocabulary" },
  b2: { href: "/vocabulary/b2", title: "B2 Vocabulary" },
  c1: { href: "/vocabulary/c1", title: "C1 Vocabulary" },
};

const GRAMMAR_TOPICS: Record<string, Omit<TopicRec, "level" | "badge" | "reason">[]> = {
  a1: [
    { slug: "to-be-am-is-are",              title: "To Be: am / is / are",        img: "/topics/a1/to-be-am-is-are.jpg",                href: "/grammar/a1/to-be-am-is-are" },
    { slug: "present-simple-i-you-we-they", title: "Present Simple I/You/We",     img: "/topics/a1/present-simple-i-you-we-they.jpg",   href: "/grammar/a1/present-simple-i-you-we-they" },
    { slug: "articles-a-an",                title: "Articles: a / an",            img: "/topics/a1/articles-a-an.jpg",                  href: "/grammar/a1/articles-a-an" },
    { slug: "plural-nouns",                 title: "Plural Nouns",                img: "/topics/a1/plural-nouns.jpg",                   href: "/grammar/a1/plural-nouns" },
    { slug: "subject-pronouns",             title: "Subject Pronouns",            img: "/topics/a1/subject-pronouns.jpg",               href: "/grammar/a1/subject-pronouns" },
    { slug: "there-is-there-are",           title: "There is / There are",        img: "/topics/a1/there-is-there-are.jpg",             href: "/grammar/a1/there-is-there-are" },
    { slug: "adverbs-frequency",            title: "Adverbs of Frequency",        img: "/topics/a1/adverbs-of-frequency.jpg",           href: "/grammar/a1/adverbs-frequency" },
    { slug: "can-cant",                     title: "Can / Can't",                 img: "/topics/a1/can-cant.jpg",                       href: "/grammar/a1/can-cant" },
    { slug: "wh-questions",                 title: "Wh- Questions",               img: "/topics/a1/wh-questions.jpg",                   href: "/grammar/a1/wh-questions" },
    { slug: "some-any",                     title: "Some / Any",                  img: "/topics/a1/some-any.jpg",                       href: "/grammar/a1/some-any" },
    { slug: "possessive-adjectives",        title: "Possessive Adjectives",       img: "/topics/a1/possessive-adjectives.jpg",          href: "/grammar/a1/possessive-adjectives" },
    { slug: "present-simple-he-she-it",     title: "Present Simple He/She/It",    img: "/topics/a1/present-simple-he-she-it.jpg",       href: "/grammar/a1/present-simple-he-she-it" },
    { slug: "this-that-these-those",        title: "This / That / These / Those", img: "/topics/a1/this-that-these-those.jpg",          href: "/grammar/a1/this-that-these-those" },
    { slug: "prepositions-place",           title: "Prepositions of Place",       img: "/topics/a1/prepositions-of-place.jpg",          href: "/grammar/a1/prepositions-place" },
    { slug: "countable-uncountable",        title: "Countable & Uncountable",     img: "/topics/a1/countable-uncountable.jpg",          href: "/grammar/a1/countable-uncountable" },
    { slug: "have-has-got",                 title: "Have Got / Has Got",          img: "/topics/a1/have-has-got.jpg",                   href: "/grammar/a1/have-has-got" },
    { slug: "much-many-basic",              title: "Much / Many",                 img: "/topics/a1/much-many.jpg",                      href: "/grammar/a1/much-many-basic" },
    { slug: "prepositions-time-in-on-at",   title: "Prepositions of Time",        img: "/topics/a1/prepositions-of-time-in-on-at.jpg",  href: "/grammar/a1/prepositions-time-in-on-at" },
    { slug: "present-simple-negative",      title: "Present Simple Negative",     img: "/topics/a1/present-simple-negative.jpg",        href: "/grammar/a1/present-simple-negative" },
    { slug: "present-simple-questions",     title: "Present Simple Questions",    img: "/topics/a1/present-simple-questions.jpg",       href: "/grammar/a1/present-simple-questions" },
  ],
  a2: [
    { slug: "past-simple-regular",              title: "Past Simple (Regular)",       img: "/topics/a2/past-simple-regular.jpg",            href: "/grammar/a2/past-simple-regular" },
    { slug: "past-simple-irregular",            title: "Past Simple (Irregular)",     img: "/topics/a2/past-simple-irregular.jpg",          href: "/grammar/a2/past-simple-irregular" },
    { slug: "present-continuous",               title: "Present Continuous",          img: "/topics/a2/present-continuous.jpg",             href: "/grammar/a2/present-continuous" },
    { slug: "comparative-adjectives",           title: "Comparative Adjectives",      img: "/topics/a2/comparative-adjectives.jpg",         href: "/grammar/a2/comparative-adjectives" },
    { slug: "superlative-adjectives",           title: "Superlative Adjectives",      img: "/topics/a2/superlative-adjectives.jpg",         href: "/grammar/a2/superlative-adjectives" },
    { slug: "going-to",                         title: "Going To",                    img: "/topics/a2/going-to.jpg",                       href: "/grammar/a2/going-to" },
    { slug: "will-future",                      title: "Will / Future",               img: "/topics/a2/will-future.jpg",                    href: "/grammar/a2/will-future" },
    { slug: "articles-the",                     title: "Article: The",                img: "/topics/a2/articles-the.jpg",                   href: "/grammar/a2/articles-the" },
    { slug: "conjunctions",                     title: "Conjunctions",                img: "/topics/a2/conjunctions.jpg",                   href: "/grammar/a2/conjunctions" },
    { slug: "have-to",                          title: "Have To / Don't Have To",     img: "/topics/a2/have-to.jpg",                        href: "/grammar/a2/have-to" },
    { slug: "past-simple-negative-questions",   title: "Past Simple Q & Neg.",        img: "/topics/a2/past-simple-negative-questions.jpg", href: "/grammar/a2/past-simple-negative-questions" },
    { slug: "adverbs-manner",                   title: "Adverbs of Manner",           img: "/topics/a2/adverbs-manner.jpg",                 href: "/grammar/a2/adverbs-manner" },
    { slug: "object-pronouns",                  title: "Object Pronouns",             img: "/topics/a2/object-pronouns.jpg",                href: "/grammar/a2/object-pronouns" },
    { slug: "possessive-pronouns",              title: "Possessive Pronouns",         img: "/topics/a2/possessive-pronouns.jpg",            href: "/grammar/a2/possessive-pronouns" },
    { slug: "prepositions-movement",            title: "Prepositions of Movement",    img: "/topics/a2/prepositions-movement.jpg",          href: "/grammar/a2/prepositions-movement" },
    { slug: "present-perfect-intro",            title: "Present Perfect Intro",       img: "/topics/a2/present-perfect-intro.jpg",          href: "/grammar/a2/present-perfect-intro" },
    { slug: "should-shouldnt",                  title: "Should / Shouldn't",          img: "/topics/a2/should-shouldnt.jpg",                href: "/grammar/a2/should-shouldnt" },
    { slug: "time-expressions-past",            title: "Time Expressions (Past)",     img: "/topics/a2/time-expressions-past.jpg",          href: "/grammar/a2/time-expressions-past" },
    { slug: "verb-infinitive",                  title: "Verb + Infinitive",           img: "/topics/a2/verb-infinitive.jpg",                href: "/grammar/a2/verb-infinitive" },
    { slug: "verb-ing",                         title: "Verb + -ing",                 img: "/topics/a2/verb-ing.jpg",                       href: "/grammar/a2/verb-ing" },
  ],
  b1: [
    { slug: "all-conditionals",             title: "All Conditionals",             img: "/topics/b1/all-conditionals.jpg",              href: "/grammar/b1/all-conditionals" },
    { slug: "as-as-comparison",             title: "As ... As Comparison",         img: "/topics/b1/as-as-comparison.jpg",              href: "/grammar/b1/as-as-comparison" },
    { slug: "modal-deduction",              title: "Modal Verbs: Deduction",       img: "/topics/b1/modal-deduction.jpg",               href: "/grammar/b1/modal-deduction" },
    { slug: "modal-possibility",            title: "Modal Verbs: Possibility",     img: "/topics/b1/modal-possibility.jpg",             href: "/grammar/b1/modal-possibility" },
    { slug: "passive-past",                 title: "Passive (Past)",               img: "/topics/b1/passive-past.jpg",                  href: "/grammar/b1/passive-past" },
    { slug: "passive-present",              title: "Passive (Present)",            img: "/topics/b1/passive-present.jpg",               href: "/grammar/b1/passive-present" },
    { slug: "past-continuous",              title: "Past Continuous",              img: "/topics/b1/past-continuous.jpg",               href: "/grammar/b1/past-continuous" },
    { slug: "past-perfect",                 title: "Past Perfect",                 img: "/topics/b1/past-perfect.jpg",                  href: "/grammar/b1/past-perfect" },
    { slug: "phrasal-verbs",                title: "Phrasal Verbs",                img: "/topics/b1/phrasal-verbs.jpg",                 href: "/grammar/b1/phrasal-verbs" },
    { slug: "present-perfect-continuous",   title: "Present Perfect Continuous",   img: "/topics/b1/present-perfect-continuous.jpg",   href: "/grammar/b1/present-perfect-continuous" },
    { slug: "relative-clauses-defining",    title: "Relative Clauses (Def.)",      img: "/topics/b1/relative-clauses-defining.jpg",     href: "/grammar/b1/relative-clauses-defining" },
    { slug: "relative-clauses-non-defining",title: "Relative Clauses (Non-def.)",  img: "/topics/b1/relative-clauses-non-defining.jpg", href: "/grammar/b1/relative-clauses-non-defining" },
    { slug: "reported-questions",           title: "Reported Questions",           img: "/topics/b1/reported-questions.jpg",            href: "/grammar/b1/reported-questions" },
    { slug: "reported-statements",          title: "Reported Statements",          img: "/topics/b1/reported-statements.jpg",           href: "/grammar/b1/reported-statements" },
    { slug: "second-conditional",           title: "Second Conditional",           img: "/topics/b1/second-conditional.jpg",            href: "/grammar/b1/second-conditional" },
    { slug: "so-such",                      title: "So / Such",                    img: "/topics/b1/so-such.jpg",                       href: "/grammar/b1/so-such" },
    { slug: "too-enough",                   title: "Too / Enough",                 img: "/topics/b1/too-enough.jpg",                    href: "/grammar/b1/too-enough" },
    { slug: "used-to",                      title: "Used To",                      img: "/topics/b1/used-to.jpg",                       href: "/grammar/b1/used-to" },
    { slug: "wish-past",                    title: "Wish (Past)",                  img: "/topics/b1/wish-past.jpg",                     href: "/grammar/b1/wish-past" },
    { slug: "would-past-habits",            title: "Would (Past Habits)",          img: "/topics/b1/would-past-habits.jpg",             href: "/grammar/b1/would-past-habits" },
    { slug: "zero-first-conditional",       title: "Zero & First Conditional",     img: "/topics/b1/zero-first-conditional.jpg",        href: "/grammar/b1/zero-first-conditional" },
  ],
  b2: [
    { slug: "all-conditionals-b2",       title: "All Conditionals (B2)",       img: "/topics/b2/all-conditionals-b2.jpg",         href: "/grammar/b2/all-conditionals-b2" },
    { slug: "causative",                 title: "Causative Have/Get",           img: "/topics/b2/causative.jpg",                   href: "/grammar/b2/causative" },
    { slug: "cleft-sentences",           title: "Cleft Sentences",              img: "/topics/b2/cleft-sentences.jpg",             href: "/grammar/b2/cleft-sentences" },
    { slug: "future-continuous",         title: "Future Continuous",            img: "/topics/b2/future-continuous.jpg",           href: "/grammar/b2/future-continuous" },
    { slug: "future-perfect",            title: "Future Perfect",               img: "/topics/b2/future-perfect.jpg",              href: "/grammar/b2/future-perfect" },
    { slug: "gerunds-infinitives",       title: "Gerunds & Infinitives",        img: "/topics/b2/gerunds-infinitives.jpg",         href: "/grammar/b2/gerunds-infinitives" },
    { slug: "inversion",                 title: "Inversion",                    img: "/topics/b2/inversion.jpg",                   href: "/grammar/b2/inversion" },
    { slug: "linking-words",             title: "Linking Words",                img: "/topics/b2/linking-words.jpg",               href: "/grammar/b2/linking-words" },
    { slug: "mixed-conditionals",        title: "Mixed Conditionals",           img: "/topics/b2/mixed-conditionals.jpg",          href: "/grammar/b2/mixed-conditionals" },
    { slug: "modal-perfect",             title: "Modal Perfect",                img: "/topics/b2/modal-perfect.jpg",               href: "/grammar/b2/modal-perfect" },
    { slug: "participle-clauses",        title: "Participle Clauses",           img: "/topics/b2/participle-clauses.jpg",          href: "/grammar/b2/participle-clauses" },
    { slug: "passive-advanced",          title: "Passive (Advanced)",           img: "/topics/b2/passive-advanced.jpg",            href: "/grammar/b2/passive-advanced" },
    { slug: "past-perfect-continuous",   title: "Past Perfect Continuous",      img: "/topics/b2/past-perfect-continuous.jpg",     href: "/grammar/b2/past-perfect-continuous" },
    { slug: "quantifiers-advanced",      title: "Quantifiers (Advanced)",       img: "/topics/b2/quantifiers-advanced.jpg",        href: "/grammar/b2/quantifiers-advanced" },
    { slug: "relative-clauses-advanced", title: "Relative Clauses (Adv.)",      img: "/topics/b2/relative-clauses-advanced.jpg",   href: "/grammar/b2/relative-clauses-advanced" },
    { slug: "reported-speech-advanced",  title: "Reported Speech (Adv.)",       img: "/topics/b2/reported-speech-advanced.jpg",    href: "/grammar/b2/reported-speech-advanced" },
    { slug: "third-conditional",         title: "Third Conditional",            img: "/topics/b2/third-conditional.jpg",           href: "/grammar/b2/third-conditional" },
    { slug: "wish-would",                title: "Wish + Would",                 img: "/topics/b2/wish-would.jpg",                  href: "/grammar/b2/wish-would" },
  ],
  c1: [
    { slug: "advanced-discourse-markers",  title: "Discourse Markers",          img: "/topics/c1/advanced-discourse-markers.jpg",  href: "/grammar/c1/advanced-discourse-markers" },
    { slug: "advanced-inversion",          title: "Inversion (Advanced)",        img: "/topics/c1/advanced-inversion.jpg",          href: "/grammar/c1/advanced-inversion" },
    { slug: "advanced-modals",             title: "Advanced Modals",             img: "/topics/c1/advanced-modals.jpg",             href: "/grammar/c1/advanced-modals" },
    { slug: "advanced-participle-clauses", title: "Participle Clauses (Adv.)",   img: "/topics/c1/advanced-participle-clauses.jpg", href: "/grammar/c1/advanced-participle-clauses" },
    { slug: "advanced-relative-clauses",   title: "Relative Clauses (Adv.)",     img: "/topics/c1/advanced-relative-clauses.jpg",   href: "/grammar/c1/advanced-relative-clauses" },
    { slug: "complex-noun-phrases",        title: "Complex Noun Phrases",        img: "/topics/c1/complex-noun-phrases.jpg",        href: "/grammar/c1/complex-noun-phrases" },
    { slug: "complex-passives",            title: "Complex Passives",            img: "/topics/c1/complex-passives.jpg",            href: "/grammar/c1/complex-passives" },
    { slug: "concession-contrast",         title: "Concession & Contrast",       img: "/topics/c1/concession-contrast.jpg",         href: "/grammar/c1/concession-contrast" },
    { slug: "ellipsis-substitution",       title: "Ellipsis & Substitution",     img: "/topics/c1/ellipsis-substitution.jpg",       href: "/grammar/c1/ellipsis-substitution" },
    { slug: "extraposition",               title: "Extraposition",               img: "/topics/c1/extraposition.jpg",               href: "/grammar/c1/extraposition" },
    { slug: "fronting-emphasis",           title: "Fronting & Emphasis",         img: "/topics/c1/fronting-emphasis.jpg",           href: "/grammar/c1/fronting-emphasis" },
    { slug: "hedging-language",            title: "Hedging Language",            img: "/topics/c1/hedging-language.jpg",            href: "/grammar/c1/hedging-language" },
    { slug: "inverted-conditionals",       title: "Inverted Conditionals",       img: "/topics/c1/inverted-conditionals.jpg",       href: "/grammar/c1/inverted-conditionals" },
    { slug: "nominalisation",              title: "Nominalisation",              img: "/topics/c1/nominalisation.jpg",              href: "/grammar/c1/nominalisation" },
    { slug: "passive-infinitives",         title: "Passive Infinitives",         img: "/topics/c1/passive-infinitives.jpg",         href: "/grammar/c1/passive-infinitives" },
    { slug: "reported-speech-c1",          title: "Reported Speech (C1)",        img: "/topics/c1/reported-speech-c1.jpg",          href: "/grammar/c1/reported-speech-c1" },
    { slug: "subjunctive",                 title: "Subjunctive",                 img: "/topics/c1/subjunctive.jpg",                 href: "/grammar/c1/subjunctive" },
    { slug: "word-formation",              title: "Word Formation",              img: "/topics/c1/word-formation.jpg",              href: "/grammar/c1/word-formation" },
  ],
};

function getFocusLevel(stats: ProgressStats): string {
  if (stats.totalCompleted === 0) return "a1";
  const levels = ["a1", "a2", "b1", "b2", "c1"] as const;
  for (const lvl of levels) {
    if ((stats.byLevel[lvl]?.completed ?? 0) < LEVEL_TOTALS[lvl]) return lvl;
  }
  return "c1";
}

function getRecommendations(stats: ProgressStats): TopicRec[] {
  const recs: TopicRec[] = [];
  const focusLevel = getFocusLevel(stats);
  const recentSlugs = new Set(stats.recentActivity.map((a) => a.slug));
  const { grammar: grammarScore, tenses: tensesScore, vocabulary: vocabScore } = stats.testResults;

  // ── 1. TENSES rec: if tenses test done (especially low score) ──────────
  if (tensesScore !== undefined) {
    const tense = TENSES_BY_LEVEL[focusLevel] ?? TENSES_BY_LEVEL.a1;
    recs.push({
      slug: tense.slug,
      title: tense.title,
      img: tense.img,
      href: tense.href,
      level: focusLevel.toUpperCase(),
      badge: `bg-violet-500`,
      reason: tensesScore < 70
        ? `Your tenses test score: ${tensesScore}% — let's practise!`
        : `Keep up your tenses streak (${tensesScore}%)`,
    });
  }

  // ── 2. VOCABULARY rec: if vocab test done ─────────────────────────────
  if (vocabScore !== undefined) {
    const vocab = VOCAB_BY_LEVEL[focusLevel] ?? VOCAB_BY_LEVEL.a1;
    recs.push({
      slug: `vocabulary-${focusLevel}`,
      title: vocab.title,
      img: `/topics/vocabulary-${focusLevel}.jpg`,
      href: vocab.href,
      level: focusLevel.toUpperCase(),
      badge: `bg-emerald-500`,
      reason: vocabScore < 70
        ? `Vocabulary test: ${vocabScore}% — build your word bank!`
        : `Great vocab result (${vocabScore}%) — go deeper`,
    });
  }

  // ── 3. GRAMMAR recs: fill remaining slots (up to 3 total) ─────────────
  // If grammar test done and score is low, note it on the first grammar rec
  const grammarNote = grammarScore !== undefined && grammarScore < 70
    ? `Grammar test: ${grammarScore}% — focus here`
    : grammarScore !== undefined
    ? `Based on your grammar test (${grammarScore}%)`
    : undefined;

  const topics = GRAMMAR_TOPICS[focusLevel] ?? [];
  const pool = topics.filter((t) => !recentSlugs.has(t.slug));
  const source = pool.length > 0 ? pool : topics;

  for (const t of source) {
    if (recs.length >= 3) break;
    const isFirst = recs.length === (tensesScore !== undefined ? 1 : 0) + (vocabScore !== undefined ? 1 : 0);
    recs.push({
      ...t,
      level: focusLevel.toUpperCase(),
      badge: LEVEL_COLORS[focusLevel]?.badge ?? "bg-slate-500",
      reason: isFirst && grammarNote ? grammarNote : undefined,
    });
  }

  return recs.slice(0, 3);
}

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-500";
}

function scoreBg(score: number) {
  if (score >= 80) return "bg-emerald-50 border-emerald-100 text-emerald-700";
  if (score >= 50) return "bg-amber-50 border-amber-100 text-amber-700";
  return "bg-red-50 border-red-100 text-red-700";
}

// ── Component ──────────────────────────────────────────────────────────────

export default function AccountClient({ email, fullName, avatarUrl, createdAt, provider, stats }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<Tab>("progress");

  // Profile
  const [name, setName] = useState(fullName);
  const [avatar, setAvatar] = useState(avatarUrl);
  const [avatarPreview, setAvatarPreview] = useState(avatarUrl);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Security
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [securitySaving, setSecuritySaving] = useState(false);
  const [securityMsg, setSecurityMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Logout
  const [loggingOut, setLoggingOut] = useState(false);

  // Reset progress
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    setAvatarUploading(true);
    setProfileMsg(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `avatars/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
    if (uploadError) { setProfileMsg({ type: "err", text: `Upload failed: ${uploadError.message}` }); setAvatarPreview(avatar); setAvatarUploading(false); return; }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const { error: updateError } = await supabase.auth.updateUser({ data: { avatar_url: urlData.publicUrl } });
    if (updateError) { setProfileMsg({ type: "err", text: updateError.message }); } else { setAvatar(urlData.publicUrl); setProfileMsg({ type: "ok", text: "Photo updated." }); }
    setAvatarUploading(false);
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault(); setProfileSaving(true); setProfileMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { full_name: name.trim() } });
    if (error) { setProfileMsg({ type: "err", text: error.message }); } else { setProfileMsg({ type: "ok", text: "Profile saved." }); router.refresh(); }
    setProfileSaving(false);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault(); setSecurityMsg(null);
    if (newPassword !== confirmPassword) { setSecurityMsg({ type: "err", text: "Passwords do not match." }); return; }
    if (newPassword.length < 6) { setSecurityMsg({ type: "err", text: "Password must be at least 6 characters." }); return; }
    setSecuritySaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { setSecurityMsg({ type: "err", text: error.message }); } else { setSecurityMsg({ type: "ok", text: "Password updated successfully." }); setNewPassword(""); setConfirmPassword(""); }
    setSecuritySaving(false);
  }

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/session/logout", { method: "POST" });
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function handleResetProgress() {
    setResetting(true);
    await fetch("/api/progress/reset", { method: "POST" });
    setResetting(false);
    setResetConfirm(false);
    router.refresh();
  }

  const userInitials = initials(name, email);
  const isOAuth = provider !== "email";

  // ── Render ─────────────────────────────────────────────────────────────────

  const recs = getRecommendations(stats);

  return (
    <>
    {/* ── Reset confirmation modal ─────────────────────────────────────── */}
    {resetConfirm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setResetConfirm(false)} />
        <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl ring-1 ring-black/[0.06] p-7">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <svg className="h-7 w-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2 className="text-lg font-black text-slate-900">Reset all progress?</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            This will permanently delete all your completed exercises, scores, and statistics. <span className="font-semibold text-slate-700">This action cannot be undone.</span>
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setResetConfirm(false)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleResetProgress}
              disabled={resetting}
              className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-black text-white transition hover:bg-red-600 disabled:opacity-50"
            >
              {resetting ? "Resetting…" : "Yes, reset"}
            </button>
          </div>
        </div>
      </div>
    )}

    <main className="min-h-screen bg-[#F6F6F7]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">

        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-1.5 text-xs text-slate-400">
          <a href="/" className="hover:text-slate-600 transition">Home</a>
          <span>/</span>
          <span className="text-slate-600">Account</span>
        </div>

        {/* ── 3-column grid ─────────────────────────────────────────── */}
        <div className="grid xl:grid-cols-[220px_1fr_256px] gap-5 items-start">

          {/* ══ LEFT: AdSense ══ */}
          <aside className="hidden xl:block">
            <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-3.5">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-300">Advertisement</p>
              <div className="flex h-[600px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-300">
                300 × 600
              </div>
            </div>
          </aside>

          {/* ══ CENTER ══ */}
          <div className="min-w-0 space-y-4">

        {/* ── Profile header card ─────────────────────────────────────── */}
        <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden">
          {/* Top accent strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#F5DA20] via-amber-300 to-[#F5DA20]" />
          <div className="flex items-center gap-4 px-5 py-5 sm:gap-6 sm:px-7">

            {/* Avatar */}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <div className="shrink-0 h-16 w-16 sm:h-[76px] sm:w-[76px] overflow-hidden rounded-full ring-4 ring-[#F5DA20]/30 shadow-md">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-600 text-xl font-black text-white">
                  {userInitials}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-slate-900 leading-tight sm:text-2xl truncate">
                {name.trim() || <span className="text-slate-400 font-medium italic">No name yet</span>}
              </h1>
              <p className="mt-0.5 text-sm text-slate-400 truncate">{email}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                </span>
                <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Free plan</span>
                <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium text-slate-400">Member since {memberSince(createdAt)}</span>
                {isOAuth && <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">Google</span>}
              </div>
            </div>

            {/* Sign out */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="shrink-0 flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              {loggingOut ? "…" : "Sign out"}
            </button>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────── */}
        <div className="mt-8 flex gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-black/[0.04]">
          {([
            { key: "profile"  as const, label: "Profile",  icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
            { key: "progress" as const, label: "Progress", icon: "M3 3v18h18M18 9l-5 5-4-4-4 4" },
            { key: "security" as const, label: "Security", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition ${
                tab === t.key ? "bg-[#F5DA20] text-black shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={t.icon} />
              </svg>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════ PROFILE TAB ══════════════ */}
        {tab === "profile" && (
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] p-6 sm:p-7">
              <p className="mb-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Profile information</p>
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">Display name</label>
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-300 shadow-sm outline-none transition focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/25"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">Shown across the site.</p>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">Email address</label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <svg className="h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <span className="text-sm text-slate-700 truncate">{email}</span>
                    <span className="ml-auto shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-400">Locked</span>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">Profile photo</label>
                  <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                      {avatarPreview
                        ? <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
                        : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-600 text-sm font-black text-white">{userInitials}</div>
                      }
                    </div>
                    <div>
                      <button type="button" onClick={() => fileRef.current?.click()} disabled={avatarUploading}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40">
                        {avatarUploading ? "Uploading…" : "Change photo"}
                      </button>
                      <p className="mt-1 text-xs text-slate-400">JPG, PNG or WebP · max 5 MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {profileMsg && (
              <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold ${profileMsg.type === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                {profileMsg.type === "ok"
                  ? <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                }
                {profileMsg.text}
              </div>
            )}

            <button type="submit" disabled={profileSaving}
              className="flex items-center gap-2 rounded-xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black shadow-sm transition hover:opacity-90 disabled:opacity-50">
              {profileSaving ? <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving…</> : "Save changes"}
            </button>
          </form>
        )}

        {/* ══════════════ PROGRESS TAB ══════════════ */}
        {tab === "progress" && (
          <div className="space-y-4">

            {stats.totalCompleted === 0 ? (
              /* ── Empty state ── */
              <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] p-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5DA20]/15 text-3xl">📊</div>
                <h2 className="text-lg font-black text-slate-900">No activity yet</h2>
                <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
                  Complete exercises and tests to see your progress, scores, and learning stats here.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a href="/grammar/a1" className="rounded-xl bg-[#F5DA20] px-5 py-2.5 text-sm font-black text-black transition hover:opacity-90">Start Grammar A1</a>
                  <a href="/tenses" className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50">Explore Tenses</a>
                </div>
              </div>
            ) : (
              <>
                {/* ── 4 stat cards ── */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Exercises done",    value: stats.totalCompleted,             suffix: "",  icon: "✅", color: "text-slate-900" },
                    { label: "Average score",     value: stats.avgScore ?? 0,              suffix: "%", icon: "📈", color: scoreColor(stats.avgScore ?? 0) },
                    { label: "Topics mastered",   value: stats.topicsMastered,             suffix: "",  icon: "🏆", color: "text-amber-600" },
                    { label: "Levels active",     value: Object.values(stats.byLevel).filter(l => l.completed > 0).length, suffix: "/5", icon: "🎯", color: "text-violet-600" },
                  ].map(({ label, value, suffix, icon, color }) => (
                    <div key={label} className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] p-4">
                      <div className="text-lg mb-1">{icon}</div>
                      <div className={`text-2xl font-black ${color}`}>{value}{suffix}</div>
                      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</div>
                    </div>
                  ))}
                </div>

                {/* ── Progress by level + Recent activity ── */}
                <div className="grid gap-4 sm:grid-cols-2">

                  {/* By level */}
                  <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] p-5">
                    <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Grammar progress</p>
                    <div className="space-y-3">
                      {(["a1", "a2", "b1", "b2", "c1"] as const).map((lvl) => {
                        const data = stats.byLevel[lvl] ?? { completed: 0, avgScore: 0 };
                        const total = LEVEL_TOTALS[lvl];
                        const pct = Math.min(100, Math.round((data.completed / total) * 100));
                        const colors = LEVEL_COLORS[lvl];
                        return (
                          <a key={lvl} href={`/grammar/${lvl}`} className="block group">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition">{LEVEL_LABELS[lvl]}</span>
                              <span className={`text-[10px] font-black ${data.completed > 0 ? colors.text : "text-slate-300"}`}>
                                {data.completed}/{total}
                              </span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full transition-all duration-700 ${data.completed > 0 ? colors.bar : ""}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent activity */}
                  <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] p-5">
                    <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Recent activity</p>
                    {stats.recentActivity.length === 0 ? (
                      <p className="text-sm text-slate-400">No activity yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {stats.recentActivity.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            {/* Score badge */}
                            <span className={`shrink-0 rounded-lg border px-2 py-0.5 text-[11px] font-black tabular-nums ${scoreBg(item.score)}`}>
                              {item.score}%
                            </span>
                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-slate-800 truncate">
                                {slugToTitle(item.slug)}
                                {item.exercise_no != null && <span className="ml-1 text-slate-400">· Ex {item.exercise_no}</span>}
                              </div>
                              <div className="text-[10px] text-slate-400 capitalize">
                                {item.category}{item.level ? ` · ${item.level.toUpperCase()}` : ""}
                              </div>
                            </div>
                            {/* Time */}
                            <span className="shrink-0 text-[10px] text-slate-300">{timeAgo(item.completed_at)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Best scores banner ── */}
                {stats.recentActivity.some(a => a.score === 100) && (
                  <div className="rounded-2xl bg-gradient-to-r from-[#F5DA20]/20 to-amber-50 border border-[#F5DA20]/40 px-5 py-4 flex items-center gap-3">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="text-sm font-black text-slate-900">Perfect score!</p>
                      <p className="text-xs text-slate-500">You got 100% on at least one exercise. Keep it up!</p>
                    </div>
                  </div>
                )}

                {/* ── Reset progress ── */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => setResetConfirm(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.51"/>
                    </svg>
                    Reset all progress
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ══════════════ SECURITY TAB ══════════════ */}
        {tab === "security" && (
          <div className="space-y-4">

            {/* Login method */}
            <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] p-6 sm:p-7">
              <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Login method</p>
              {isOAuth ? (
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
                    <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Google account</p>
                    <p className="mt-0.5 text-xs text-slate-500">Password is managed by Google. <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Change it there →</a></p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                    <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Email & password</p>
                    <p className="mt-0.5 text-xs text-slate-500 truncate">{email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Change password */}
            {!isOAuth && (
              <form onSubmit={handlePasswordChange}>
                <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] p-6 sm:p-7">
                  <p className="mb-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Change password</p>
                  <div className="space-y-4">
                    {[
                      { label: "New password",     val: newPassword,     set: setNewPassword,     show: showNew,    setShow: setShowNew    },
                      { label: "Confirm password", val: confirmPassword, set: setConfirmPassword, show: showConfirm, setShow: setShowConfirm },
                    ].map(({ label, val, set, show, setShow }) => (
                      <div key={label}>
                        <label className="mb-2 block text-xs font-semibold text-slate-600">{label}</label>
                        <div className="relative">
                          <input
                            type={show ? "text" : "password"} required minLength={6} value={val} onChange={(e) => set(e.target.value)}
                            placeholder="At least 6 characters"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 placeholder-slate-300 shadow-sm outline-none transition focus:border-[#F5DA20] focus:ring-2 focus:ring-[#F5DA20]/25"
                          />
                          <button type="button" onClick={() => setShow(v => !v)} tabIndex={-1} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                            {show
                              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            }
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {securityMsg && (
                  <div className={`mt-4 flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold ${securityMsg.type === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                    {securityMsg.type === "ok"
                      ? <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    }
                    {securityMsg.text}
                  </div>
                )}
                <button type="submit" disabled={securitySaving}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black shadow-sm transition hover:opacity-90 disabled:opacity-50">
                  {securitySaving ? <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving…</> : "Update password"}
                </button>
              </form>
            )}

            {/* Sessions */}
            <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.04] p-6 sm:p-7">
              <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Sessions</p>
              <p className="mt-3 text-sm font-bold text-slate-900">Sign out everywhere</p>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">End all active sessions on every device.</p>
              <button onClick={handleLogout} disabled={loggingOut}
                className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-40">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                {loggingOut ? "Signing out…" : "Sign out of all devices"}
              </button>
            </div>

          </div>
        )}

          </div>
          {/* ══ RIGHT: Recommendations ══ */}
          <aside className="hidden xl:block">
            <div className="sticky top-24 space-y-3">
              <p className="px-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">Recommended for you</p>
              {recs.map((rec) => (
                <a
                  key={rec.slug}
                  href={rec.href}
                  className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="relative h-24 w-full overflow-hidden bg-slate-100">
                    <img
                      src={rec.img}
                      alt={rec.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <span className={`absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow ${rec.badge}`}>
                      {rec.level}
                    </span>
                  </div>
                  <div className="px-3.5 py-3">
                    <p className="text-xs font-bold leading-snug text-slate-800 group-hover:text-slate-900 transition">
                      {rec.title}
                    </p>
                    {rec.reason && (
                      <p className="mt-1 text-[10px] leading-snug text-amber-600 font-semibold">
                        {rec.reason}
                      </p>
                    )}
                  </div>
                </a>
              ))}
              <a
                href="/grammar"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
              >
                Browse all topics
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            </div>
          </aside>

        </div>
      </div>
    </main>
    </>
  );
}
