/**
 * Simple profanity filter for user display names.
 * Checks for common slurs and offensive words in EN / UK / RU.
 */

const BLOCKED: string[] = [
  // ── English ──────────────────────────────────────────────────────────────
  "fuck", "fucker", "fucking", "fuck you", "motherfucker", "mf",
  "shit", "bullshit",
  "bitch", "bitches",
  "cunt", "cunts",
  "ass", "asshole", "arsehole",
  "dick", "dicks", "dickhead",
  "cock", "cocks", "cocksucker",
  "pussy", "pussies",
  "whore", "whores", "slut", "sluts",
  "nigger", "nigga", "faggot", "fag",
  "retard", "retarded",
  "bastard", "bastards",
  "piss", "pissed",
  "twat", "wanker",

  // ── Ukrainian ─────────────────────────────────────────────────────────────
  "хуй", "хуйня", "хуєвий", "схуй", "похуй",
  "пизда", "пиздець", "пиздатий",
  "єбать", "йобать", "єбаний", "йобаний", "йоб",
  "блядь", "бляд", "шльондра",
  "сука", "суки",
  "підарас", "педик", "пидор",
  "мудак", "мудила",
  "залупа", "залупон",
  "срань", "сранина",
  "ублюдок",
  "курва",
  "мразь",

  // ── Russian ───────────────────────────────────────────────────────────────
  "хуй", "хуйло", "хуёвый",
  "пизда", "пиздец",
  "ёбать", "ебать", "ёбаный", "ебаный",
  "блядь", "блядина",
  "сука",
  "пидор", "пидорас",
  "мудак", "мудила",
  "залупа",
  "урод",
  "ублюдок",
  "сволочь",
  "тварь",
  "мразь",
  "падла",
  "ёб", "еб",
];

// Normalize: lowercase, collapse spaces, remove common substitutions
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[0@]/g, "o")
    .replace(/[1!|]/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/\$/g, "s")
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function containsProfanity(input: string): boolean {
  const n = normalize(input);
  return BLOCKED.some((word) => {
    const nw = normalize(word);
    // Match whole word or as substring (for compound words)
    const re = new RegExp(`(^|\\s|[^а-яёіїєa-z])${nw}([^а-яёіїєa-z]|\\s|$)`, "i");
    return re.test(n) || n === nw || n.includes(nw);
  });
}
