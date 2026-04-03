// ── Shared recommendation logic (used by /account and /dashboard) ────────────

export type TopicRec = {
  slug: string; title: string; img: string; href: string;
  level: string; badge: string; reason?: string;
};

type ProgressStats = {
  totalCompleted: number;
  recentActivity: Array<{ slug: string }>;
  byLevel: Record<string, { completed: number; avgScore: number }>;
  testResults: { grammar?: number; tenses?: number; vocabulary?: number };
};

const LEVEL_TOTALS: Record<string, number> = {
  a1: 76, a2: 80, b1: 84, b2: 72, c1: 72,
};

const LEVEL_BADGE: Record<string, string> = {
  a1: "bg-emerald-500", a2: "bg-sky-500",
  b1: "bg-violet-500",  b2: "bg-amber-500", c1: "bg-rose-500",
};

const LEVELS = ["a1", "a2", "b1", "b2", "c1"] as const;
type Level = typeof LEVELS[number];
const NEXT_LEVEL: Record<string, Level> = { a1: "a2", a2: "b1", b1: "b2", b2: "c1", c1: "c1" };

function scoreToLevel(score: number): Level {
  if (score >= 90) return "c1";
  if (score >= 75) return "b2";
  if (score >= 60) return "b1";
  if (score >= 40) return "a2";
  return "a1";
}

function grammarFocusLevel(stats: ProgressStats): Level {
  if (stats.totalCompleted === 0) return "a1";
  for (const lvl of LEVELS) {
    if ((stats.byLevel[lvl]?.completed ?? 0) < LEVEL_TOTALS[lvl]) return lvl;
  }
  return "c1";
}

const TENSES_BY_LEVEL: Record<string, { slug: string; title: string; img: string; href: string }> = {
  a1: { slug: "present-simple",  title: "Present Simple",  img: "/topics/tenses/present-simple.jpg",  href: "/tenses/present-simple" },
  a2: { slug: "past-simple",     title: "Past Simple",     img: "/topics/tenses/past-simple.jpg",     href: "/tenses/past-simple" },
  b1: { slug: "present-perfect", title: "Present Perfect", img: "/topics/tenses/present-perfect.jpg", href: "/tenses/present-perfect" },
  b2: { slug: "past-perfect",    title: "Past Perfect",    img: "/topics/tenses/past-perfect.jpg",    href: "/tenses/past-perfect" },
  c1: { slug: "future-perfect",  title: "Future Perfect",  img: "/topics/tenses/future-perfect.jpg",  href: "/tenses/future-perfect" },
};

const VOCAB_BY_LEVEL: Record<string, { href: string; title: string }> = {
  a1: { href: "/vocabulary/a1", title: "A1 Vocabulary" },
  a2: { href: "/vocabulary/a2", title: "A2 Vocabulary" },
  b1: { href: "/vocabulary/b1", title: "B1 Vocabulary" },
  b2: { href: "/vocabulary/b2", title: "B2 Vocabulary" },
  c1: { href: "/vocabulary/c1", title: "C1 Vocabulary" },
};

const GRAMMAR_POOL: Record<string, { slug: string; title: string; img: string; href: string }[]> = {
  a1: [
    { slug: "to-be-am-is-are",              title: "To Be: am / is / are",        img: "/topics/a1/to-be-am-is-are.jpg",                href: "/grammar/a1/to-be-am-is-are" },
    { slug: "present-simple-i-you-we-they", title: "Present Simple I/You/We",     img: "/topics/a1/present-simple-i-you-we-they.jpg",   href: "/grammar/a1/present-simple-i-you-we-they" },
    { slug: "articles-a-an",                title: "Articles: a / an",            img: "/topics/a1/articles-a-an.jpg",                  href: "/grammar/a1/articles-a-an" },
    { slug: "wh-questions",                 title: "Wh- Questions",               img: "/topics/a1/wh-questions.jpg",                   href: "/grammar/a1/wh-questions" },
    { slug: "can-cant",                     title: "Can / Can't",                 img: "/topics/a1/can-cant.jpg",                       href: "/grammar/a1/can-cant" },
  ],
  a2: [
    { slug: "past-simple-regular",    title: "Past Simple (Regular)",  img: "/topics/a2/past-simple-regular.jpg",    href: "/grammar/a2/past-simple-regular" },
    { slug: "present-continuous",     title: "Present Continuous",     img: "/topics/a2/present-continuous.jpg",     href: "/grammar/a2/present-continuous" },
    { slug: "going-to",               title: "Going To",               img: "/topics/a2/going-to.jpg",               href: "/grammar/a2/going-to" },
    { slug: "comparative-adjectives", title: "Comparative Adjectives", img: "/topics/a2/comparative-adjectives.jpg", href: "/grammar/a2/comparative-adjectives" },
    { slug: "present-perfect-intro",  title: "Present Perfect Intro",  img: "/topics/a2/present-perfect-intro.jpg",  href: "/grammar/a2/present-perfect-intro" },
  ],
  b1: [
    { slug: "past-continuous",           title: "Past Continuous",           img: "/topics/b1/past-continuous.jpg",           href: "/grammar/b1/past-continuous" },
    { slug: "second-conditional",        title: "Second Conditional",        img: "/topics/b1/second-conditional.jpg",        href: "/grammar/b1/second-conditional" },
    { slug: "passive-present",           title: "Passive (Present)",         img: "/topics/b1/passive-present.jpg",           href: "/grammar/b1/passive-present" },
    { slug: "reported-statements",       title: "Reported Statements",       img: "/topics/b1/reported-statements.jpg",       href: "/grammar/b1/reported-statements" },
    { slug: "relative-clauses-defining", title: "Relative Clauses (Def.)",   img: "/topics/b1/relative-clauses-defining.jpg", href: "/grammar/b1/relative-clauses-defining" },
  ],
  b2: [
    { slug: "mixed-conditionals",  title: "Mixed Conditionals",  img: "/topics/b2/mixed-conditionals.jpg",  href: "/grammar/b2/mixed-conditionals" },
    { slug: "passive-advanced",    title: "Passive (Advanced)",  img: "/topics/b2/passive-advanced.jpg",    href: "/grammar/b2/passive-advanced" },
    { slug: "gerunds-infinitives", title: "Gerunds & Infinitives",img: "/topics/b2/gerunds-infinitives.jpg", href: "/grammar/b2/gerunds-infinitives" },
    { slug: "modal-perfect",       title: "Modal Perfect",       img: "/topics/b2/modal-perfect.jpg",       href: "/grammar/b2/modal-perfect" },
    { slug: "inversion",           title: "Inversion",           img: "/topics/b2/inversion.jpg",           href: "/grammar/b2/inversion" },
  ],
  c1: [
    { slug: "advanced-modals",       title: "Advanced Modals",       img: "/topics/c1/advanced-modals.jpg",       href: "/grammar/c1/advanced-modals" },
    { slug: "nominalisation",        title: "Nominalisation",        img: "/topics/c1/nominalisation.jpg",        href: "/grammar/c1/nominalisation" },
    { slug: "concession-contrast",   title: "Concession & Contrast", img: "/topics/c1/concession-contrast.jpg",   href: "/grammar/c1/concession-contrast" },
    { slug: "advanced-inversion",    title: "Inversion (Advanced)",  img: "/topics/c1/advanced-inversion.jpg",    href: "/grammar/c1/advanced-inversion" },
    { slug: "subjunctive",           title: "Subjunctive",           img: "/topics/c1/subjunctive.jpg",           href: "/grammar/c1/subjunctive" },
  ],
};

export function getRecommendations(stats: ProgressStats): TopicRec[] {
  const recs: TopicRec[] = [];
  const recentSlugs = new Set(stats.recentActivity.map((a) => a.slug));
  const { grammar: grammarScore, tenses: tensesScore, vocabulary: vocabScore } = stats.testResults;

  // 1. Tenses rec
  if (tensesScore !== undefined) {
    const base = scoreToLevel(tensesScore);
    const target = tensesScore >= 70 ? NEXT_LEVEL[base] : base;
    const tense = TENSES_BY_LEVEL[target] ?? TENSES_BY_LEVEL.a2;
    recs.push({
      slug: tense.slug, title: tense.title, img: tense.img, href: tense.href,
      level: target.toUpperCase(), badge: "bg-violet-500",
      reason: tensesScore < 70 ? `Tenses: ${tensesScore}% — strengthen this` : `Tenses: ${tensesScore}% — next step!`,
    });
  }

  // 2. Vocabulary rec
  if (vocabScore !== undefined) {
    const base = scoreToLevel(vocabScore);
    const target = vocabScore >= 70 ? NEXT_LEVEL[base] : base;
    const vocab = VOCAB_BY_LEVEL[target] ?? VOCAB_BY_LEVEL.a2;
    recs.push({
      slug: `vocabulary-${target}`, title: vocab.title, img: `/topics/vocabulary-${target}.jpg`, href: vocab.href,
      level: target.toUpperCase(), badge: "bg-emerald-500",
      reason: vocabScore < 70 ? `Vocab: ${vocabScore}% — build your word bank` : `Vocab: ${vocabScore}% — explore next level`,
    });
  }

  // 3. Grammar recs (fill to 3)
  let grammarLevel: Level;
  let grammarReason: string | undefined;
  if (grammarScore !== undefined) {
    const base = scoreToLevel(grammarScore);
    grammarLevel = grammarScore >= 70 ? NEXT_LEVEL[base] : base;
    grammarReason = grammarScore < 70 ? `Grammar: ${grammarScore}% — focus here` : `Grammar: ${grammarScore}% — challenge yourself`;
  } else {
    grammarLevel = grammarFocusLevel(stats);
  }

  const pool = (GRAMMAR_POOL[grammarLevel] ?? []).filter((t) => !recentSlugs.has(t.slug));
  const source = pool.length > 0 ? pool : (GRAMMAR_POOL[grammarLevel] ?? []);
  let first = true;
  for (const t of source) {
    if (recs.length >= 3) break;
    recs.push({
      ...t, level: grammarLevel.toUpperCase(),
      badge: LEVEL_BADGE[grammarLevel] ?? "bg-slate-500",
      reason: first ? grammarReason : undefined,
    });
    first = false;
  }

  return recs.slice(0, 3);
}
