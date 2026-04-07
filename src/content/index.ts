export type SearchItem = {
  title: string;
  keywords: string[];
  href: string;
  badge?: string;
};

export const searchIndex: SearchItem[] = [

  // ─── Quick Actions ────────────────────────────────────────────────────────
  { title: "Enter Promo / Voucher Code", keywords: ["promo code", "voucher", "redeem", "code", "enter code", "activate", "coupon", "discount", "ввести", "промо", "teacher voucher", "teacher code", "teacher access", "redeem teacher", "activate teacher", "вчитель", "ваучер", "промокод"], href: "/redeem", badge: "Action" },
  { title: "Upgrade to PRO", keywords: ["pro", "upgrade", "premium", "subscription", "unlock", "buy", "plan", "paid"], href: "/pro", badge: "Action" },
  { title: "My Account & Dashboard", keywords: ["account", "dashboard", "my account", "profile", "progress", "stats", "streak", "my page"], href: "/account", badge: "Action" },
  { title: "Teacher Dashboard", keywords: ["teacher dashboard", "teacher", "students", "classes", "assignments", "teacher account", "invite students"], href: "/account", badge: "Action" },
  { title: "Contact Us", keywords: ["contact", "support", "help", "email", "message", "feedback"], href: "/contact", badge: "Action" },
  { title: "About English Nerd", keywords: ["about", "who we are", "english nerd", "team"], href: "/about", badge: "Action" },
  { title: "Sign In / Log In", keywords: ["login", "sign in", "log in", "signin", "log", "enter account"], href: "/login", badge: "Action" },
  { title: "Create Account / Register", keywords: ["register", "sign up", "create account", "signup", "new account"], href: "/register", badge: "Action" },

  // ─── Tests ────────────────────────────────────────────────────────────────
  { title: "All Tests Overview", keywords: ["tests", "all tests", "placement", "level check"], href: "/tests", badge: "Test" },
  { title: "Grammar Level Test", keywords: ["grammar test", "placement", "cefr", "level test", "grammar", "test", "placement test"], href: "/tests/grammar", badge: "Test" },
  { title: "Vocabulary Size Test", keywords: ["vocabulary test", "vocab test", "words", "size test", "word knowledge", "test", "how many words"], href: "/tests/vocabulary", badge: "Test" },
  { title: "English Tenses Test", keywords: ["tenses test", "tenses", "test", "12 tenses", "all tenses", "tense test"], href: "/tests/tenses", badge: "Test" },

  // ─── Grammar overview pages ───────────────────────────────────────────────
  { title: "Grammar — All Levels", keywords: ["grammar", "overview", "all levels", "a1 a2 b1 b2 c1"], href: "/grammar", badge: "Grammar" },
  { title: "Grammar A1 — Lessons & Exercises", keywords: ["a1", "grammar", "beginner", "lessons", "exercises", "a1 grammar"], href: "/grammar/a1", badge: "A1" },
  { title: "Grammar A2 — Lessons & Exercises", keywords: ["a2", "grammar", "elementary", "lessons", "exercises", "a2 grammar"], href: "/grammar/a2", badge: "A2" },
  { title: "Grammar B1 — Lessons & Exercises", keywords: ["b1", "grammar", "intermediate", "lessons", "exercises", "b1 grammar"], href: "/grammar/b1", badge: "B1" },
  { title: "Grammar B2 — Lessons & Exercises", keywords: ["b2", "grammar", "upper intermediate", "lessons", "exercises", "b2 grammar"], href: "/grammar/b2", badge: "B2" },
  { title: "Grammar C1 — Lessons & Exercises", keywords: ["c1", "grammar", "advanced", "lessons", "exercises", "c1 grammar"], href: "/grammar/c1", badge: "C1" },

  // ─── A1 Grammar ───────────────────────────────────────────────────────────
  { title: "To be (am / is / are)", keywords: ["to be", "am", "is", "are", "verb to be", "a1"], href: "/grammar/a1/to-be-am-is-are", badge: "A1" },
  { title: "Subject Pronouns", keywords: ["subject pronouns", "i", "he", "she", "they", "a1"], href: "/grammar/a1/subject-pronouns", badge: "A1" },
  { title: "Possessive Adjectives", keywords: ["possessive adjectives", "my", "your", "his", "her", "a1"], href: "/grammar/a1/possessive-adjectives", badge: "A1" },
  { title: "Plural Nouns", keywords: ["plural nouns", "plurals", "nouns", "a1"], href: "/grammar/a1/plural-nouns", badge: "A1" },
  { title: "This, That, These, Those", keywords: ["this that these those", "demonstratives", "a1"], href: "/grammar/a1/this-that-these-those", badge: "A1" },
  { title: "Articles: a / an", keywords: ["articles", "a", "an", "indefinite article", "a1"], href: "/grammar/a1/articles-a-an", badge: "A1" },
  { title: "There is / There are", keywords: ["there is", "there are", "existence", "a1"], href: "/grammar/a1/there-is-there-are", badge: "A1" },
  { title: "Present Simple (I / you / we / they)", keywords: ["present simple", "a1", "present tense"], href: "/grammar/a1/present-simple-i-you-we-they", badge: "A1" },
  { title: "Present Simple (he / she / it)", keywords: ["present simple", "third person", "he she it", "a1"], href: "/grammar/a1/present-simple-he-she-it", badge: "A1" },
  { title: "Present Simple Negative", keywords: ["present simple negative", "don't", "doesn't", "a1"], href: "/grammar/a1/present-simple-negative", badge: "A1" },
  { title: "Present Simple Questions", keywords: ["present simple questions", "do", "does", "questions", "a1"], href: "/grammar/a1/present-simple-questions", badge: "A1" },
  { title: "WH-Questions", keywords: ["wh questions", "what", "where", "when", "who", "why", "how", "a1"], href: "/grammar/a1/wh-questions", badge: "A1" },
  { title: "Can / Can't", keywords: ["can", "can't", "ability", "modal", "a1"], href: "/grammar/a1/can-cant", badge: "A1" },
  { title: "Have / Has got", keywords: ["have got", "has got", "possession", "a1"], href: "/grammar/a1/have-has-got", badge: "A1" },
  { title: "Prepositions of Place", keywords: ["prepositions", "place", "in on under", "a1"], href: "/grammar/a1/prepositions-place", badge: "A1" },
  { title: "Prepositions of Time (in / on / at)", keywords: ["prepositions time", "in on at", "a1"], href: "/grammar/a1/prepositions-time-in-on-at", badge: "A1" },
  { title: "Some / Any", keywords: ["some", "any", "countable uncountable", "a1"], href: "/grammar/a1/some-any", badge: "A1" },
  { title: "Countable & Uncountable Nouns", keywords: ["countable", "uncountable", "nouns", "a1"], href: "/grammar/a1/countable-uncountable", badge: "A1" },
  { title: "Much / Many (Basic)", keywords: ["much", "many", "quantifiers", "a1"], href: "/grammar/a1/much-many-basic", badge: "A1" },
  { title: "Adverbs of Frequency", keywords: ["adverbs frequency", "always", "usually", "sometimes", "never", "a1"], href: "/grammar/a1/adverbs-frequency", badge: "A1" },

  // ─── A2 Grammar ───────────────────────────────────────────────────────────
  { title: "Present Continuous", keywords: ["present continuous", "am going", "is going", "are going", "a2"], href: "/grammar/a2/present-continuous", badge: "A2" },
  { title: "Past Simple — Regular Verbs", keywords: ["past simple", "regular verbs", "ed", "a2"], href: "/grammar/a2/past-simple-regular", badge: "A2" },
  { title: "Past Simple — Irregular Verbs", keywords: ["past simple", "irregular verbs", "went", "a2"], href: "/grammar/a2/past-simple-irregular", badge: "A2" },
  { title: "Past Simple — Negatives & Questions", keywords: ["past simple", "didn't", "did you", "questions", "a2"], href: "/grammar/a2/past-simple-negative-questions", badge: "A2" },
  { title: "Present Perfect (intro)", keywords: ["present perfect", "have", "has", "a2"], href: "/grammar/a2/present-perfect-intro", badge: "A2" },
  { title: "Will — Future Simple", keywords: ["will", "future", "future simple", "a2"], href: "/grammar/a2/will-future", badge: "A2" },
  { title: "Be Going To", keywords: ["going to", "future plans", "intentions", "a2"], href: "/grammar/a2/going-to", badge: "A2" },
  { title: "Comparative Adjectives", keywords: ["comparative", "adjectives", "more", "-er", "than", "a2"], href: "/grammar/a2/comparative-adjectives", badge: "A2" },
  { title: "Superlative Adjectives", keywords: ["superlative", "adjectives", "most", "-est", "the best", "a2"], href: "/grammar/a2/superlative-adjectives", badge: "A2" },
  { title: "Should / Shouldn't", keywords: ["should", "shouldn't", "advice", "modal", "a2"], href: "/grammar/a2/should-shouldnt", badge: "A2" },
  { title: "Have to / Don't have to", keywords: ["have to", "don't have to", "obligation", "necessity", "a2"], href: "/grammar/a2/have-to", badge: "A2" },
  { title: "Object Pronouns", keywords: ["object pronouns", "me", "him", "her", "them", "a2"], href: "/grammar/a2/object-pronouns", badge: "A2" },
  { title: "Possessive Pronouns", keywords: ["possessive pronouns", "mine", "yours", "hers", "a2"], href: "/grammar/a2/possessive-pronouns", badge: "A2" },
  { title: "Articles: the", keywords: ["article", "the", "definite article", "a2"], href: "/grammar/a2/articles-the", badge: "A2" },
  { title: "Adverbs of Manner", keywords: ["adverbs manner", "quickly", "carefully", "well", "a2"], href: "/grammar/a2/adverbs-manner", badge: "A2" },
  { title: "Conjunctions", keywords: ["conjunctions", "and", "but", "because", "so", "although", "a2"], href: "/grammar/a2/conjunctions", badge: "A2" },
  { title: "Prepositions of Movement", keywords: ["prepositions movement", "into", "out of", "across", "a2"], href: "/grammar/a2/prepositions-movement", badge: "A2" },
  { title: "Time Expressions (Past)", keywords: ["time expressions", "yesterday", "last week", "ago", "a2"], href: "/grammar/a2/time-expressions-past", badge: "A2" },
  { title: "Verb + Infinitive", keywords: ["verb infinitive", "want to", "need to", "to-infinitive", "a2"], href: "/grammar/a2/verb-infinitive", badge: "A2" },
  { title: "Verb + -ing", keywords: ["verb ing", "enjoy", "like", "love", "gerund", "a2"], href: "/grammar/a2/verb-ing", badge: "A2" },

  // ─── B1 Grammar ───────────────────────────────────────────────────────────
  { title: "Past Continuous", keywords: ["past continuous", "was going", "were going", "past progressive", "b1"], href: "/grammar/b1/past-continuous", badge: "B1" },
  { title: "Past Perfect", keywords: ["past perfect", "had done", "had been", "before", "b1"], href: "/grammar/b1/past-perfect", badge: "B1" },
  { title: "Present Perfect Continuous", keywords: ["present perfect continuous", "have been doing", "has been", "b1"], href: "/grammar/b1/present-perfect-continuous", badge: "B1" },
  { title: "Used to", keywords: ["used to", "past habits", "past states", "didn't use to", "b1"], href: "/grammar/b1/used-to", badge: "B1" },
  { title: "Would — Past Habits", keywords: ["would", "past habits", "repeated actions past", "b1"], href: "/grammar/b1/would-past-habits", badge: "B1" },
  { title: "Passive Voice — Present", keywords: ["passive", "passive voice", "present passive", "is made", "are done", "b1"], href: "/grammar/b1/passive-present", badge: "B1" },
  { title: "Passive Voice — Past", keywords: ["passive", "passive voice", "past passive", "was made", "were done", "b1"], href: "/grammar/b1/passive-past", badge: "B1" },
  { title: "Reported Statements", keywords: ["reported speech", "reported statements", "indirect speech", "said that", "b1"], href: "/grammar/b1/reported-statements", badge: "B1" },
  { title: "Reported Questions", keywords: ["reported questions", "indirect questions", "asked", "wanted to know", "b1"], href: "/grammar/b1/reported-questions", badge: "B1" },
  { title: "Modal Verbs — Possibility", keywords: ["modal verbs", "possibility", "might", "may", "could", "b1"], href: "/grammar/b1/modal-possibility", badge: "B1" },
  { title: "Modal Verbs — Deduction", keywords: ["modal deduction", "must be", "can't be", "might be", "deduction", "b1"], href: "/grammar/b1/modal-deduction", badge: "B1" },
  { title: "Zero & First Conditional", keywords: ["zero conditional", "first conditional", "if clause", "if sentences", "b1"], href: "/grammar/b1/zero-first-conditional", badge: "B1" },
  { title: "Second Conditional", keywords: ["second conditional", "if i were", "would", "hypothetical", "unreal", "b1"], href: "/grammar/b1/second-conditional", badge: "B1" },
  { title: "All Conditionals (0, 1, 2)", keywords: ["all conditionals", "zero first second conditional", "mixed conditionals", "b1"], href: "/grammar/b1/all-conditionals", badge: "B1" },
  { title: "Relative Clauses — Defining", keywords: ["relative clauses", "defining", "who", "which", "that", "whose", "b1"], href: "/grammar/b1/relative-clauses-defining", badge: "B1" },
  { title: "Relative Clauses — Non-defining", keywords: ["relative clauses", "non-defining", "non defining", "who", "which", "commas", "b1"], href: "/grammar/b1/relative-clauses-non-defining", badge: "B1" },
  { title: "Too & Enough", keywords: ["too", "enough", "too many", "too much", "not enough", "b1"], href: "/grammar/b1/too-enough", badge: "B1" },
  { title: "So & Such", keywords: ["so", "such", "so that", "such a", "intensifiers", "b1"], href: "/grammar/b1/so-such", badge: "B1" },
  { title: "As…as Comparisons", keywords: ["as as", "as big as", "not as", "comparison", "as much as", "b1"], href: "/grammar/b1/as-as-comparison", badge: "B1" },
  { title: "Wish + Past Simple", keywords: ["wish", "wish past", "i wish i had", "if only", "regrets", "b1"], href: "/grammar/b1/wish-past", badge: "B1" },
  { title: "Phrasal Verbs", keywords: ["phrasal verbs", "give up", "look after", "pick up", "carry on", "b1"], href: "/grammar/b1/phrasal-verbs", badge: "B1" },

  // ─── B2 Grammar ───────────────────────────────────────────────────────────
  { title: "Past Perfect Continuous", keywords: ["past perfect continuous", "had been doing", "duration past", "b2"], href: "/grammar/b2/past-perfect-continuous", badge: "B2" },
  { title: "Future Continuous", keywords: ["future continuous", "will be doing", "in progress future", "b2"], href: "/grammar/b2/future-continuous", badge: "B2" },
  { title: "Future Perfect", keywords: ["future perfect", "will have done", "before future", "b2"], href: "/grammar/b2/future-perfect", badge: "B2" },
  { title: "Passive Voice: Advanced", keywords: ["passive advanced", "has been done", "is said to be", "perfect passive", "b2"], href: "/grammar/b2/passive-advanced", badge: "B2" },
  { title: "Causative: have / get", keywords: ["causative", "have something done", "get fixed", "had my hair cut", "b2"], href: "/grammar/b2/causative", badge: "B2" },
  { title: "Third Conditional", keywords: ["third conditional", "if i had", "would have", "past hypothetical", "b2"], href: "/grammar/b2/third-conditional", badge: "B2" },
  { title: "Mixed Conditionals", keywords: ["mixed conditionals", "third second mixed", "if i had slept", "b2"], href: "/grammar/b2/mixed-conditionals", badge: "B2" },
  { title: "All Conditionals (0–3 + Mixed)", keywords: ["all conditionals b2", "zero first second third mixed", "b2"], href: "/grammar/b2/all-conditionals-b2", badge: "B2" },
  { title: "Wish + Would / Past Perfect", keywords: ["wish would", "wish past perfect", "i wish i had gone", "regrets", "b2"], href: "/grammar/b2/wish-would", badge: "B2" },
  { title: "Modal Verbs: Perfect", keywords: ["modal perfect", "must have been", "should have done", "needn't have", "b2"], href: "/grammar/b2/modal-perfect", badge: "B2" },
  { title: "Gerunds & Infinitives", keywords: ["gerunds infinitives", "remember doing", "remember to do", "verb patterns", "b2"], href: "/grammar/b2/gerunds-infinitives", badge: "B2" },
  { title: "Reported Speech: Advanced", keywords: ["reported speech advanced", "told me to go", "suggested going", "commands", "b2"], href: "/grammar/b2/reported-speech-advanced", badge: "B2" },
  { title: "Relative Clauses: Advanced", keywords: ["relative clauses advanced", "to whom", "which made", "reduced relative", "b2"], href: "/grammar/b2/relative-clauses-advanced", badge: "B2" },
  { title: "Participle Clauses", keywords: ["participle clauses", "having finished", "reduced adverbial", "b2"], href: "/grammar/b2/participle-clauses", badge: "B2" },
  { title: "Inversion", keywords: ["inversion", "never have i", "not only did", "negative adverbials", "formal", "b2"], href: "/grammar/b2/inversion", badge: "B2" },
  { title: "Cleft Sentences", keywords: ["cleft sentences", "it was john who", "what i need is", "emphasis", "b2"], href: "/grammar/b2/cleft-sentences", badge: "B2" },
  { title: "Linking Words & Discourse Markers", keywords: ["linking words", "discourse markers", "however", "moreover", "despite", "in spite of", "b2"], href: "/grammar/b2/linking-words", badge: "B2" },
  { title: "Quantifiers: Advanced", keywords: ["quantifiers advanced", "each every", "either neither", "both", "b2"], href: "/grammar/b2/quantifiers-advanced", badge: "B2" },

  // ─── C1 Grammar ───────────────────────────────────────────────────────────
  { title: "Subjunctive Mood", keywords: ["subjunctive", "it's essential that", "i suggest she go", "formal", "c1"], href: "/grammar/c1/subjunctive", badge: "C1" },
  { title: "Inverted Conditionals", keywords: ["inverted conditionals", "were i to", "had she known", "should you need", "formal if", "c1"], href: "/grammar/c1/inverted-conditionals", badge: "C1" },
  { title: "Advanced Modal Expressions", keywords: ["advanced modals", "would rather", "it's time", "be supposed to", "had better", "c1"], href: "/grammar/c1/advanced-modals", badge: "C1" },
  { title: "Passive: Infinitives & Reporting", keywords: ["passive infinitives", "is thought to have", "is believed to be", "reporting passive", "c1"], href: "/grammar/c1/passive-infinitives", badge: "C1" },
  { title: "Complex Passives", keywords: ["complex passives", "had her bag stolen", "was made to wait", "two object passive", "c1"], href: "/grammar/c1/complex-passives", badge: "C1" },
  { title: "Ellipsis & Substitution", keywords: ["ellipsis", "substitution", "so do i", "neither did she", "do so", "c1"], href: "/grammar/c1/ellipsis-substitution", badge: "C1" },
  { title: "Nominalisation", keywords: ["nominalisation", "noun phrases", "increase in prices", "reduction in", "c1"], href: "/grammar/c1/nominalisation", badge: "C1" },
  { title: "Fronting & Emphasis", keywords: ["fronting", "emphasis", "what i need is", "not once did", "c1"], href: "/grammar/c1/fronting-emphasis", badge: "C1" },
  { title: "Advanced Inversion", keywords: ["advanced inversion", "little did i know", "rarely has", "under no circumstances", "c1"], href: "/grammar/c1/advanced-inversion", badge: "C1" },
  { title: "Extraposition (it-clauses)", keywords: ["extraposition", "it is important that", "it seems unlikely", "it was decided", "c1"], href: "/grammar/c1/extraposition", badge: "C1" },
  { title: "Relative Clauses: C1", keywords: ["relative clauses c1", "whereby", "whoever", "whatever", "nominal relative", "c1"], href: "/grammar/c1/advanced-relative-clauses", badge: "C1" },
  { title: "Participle Clauses: Advanced", keywords: ["participle clauses advanced", "having been told", "not knowing", "given the situation", "c1"], href: "/grammar/c1/advanced-participle-clauses", badge: "C1" },
  { title: "Complex Noun Phrases", keywords: ["complex noun phrases", "pre-modification", "post-modification", "noun phrase", "c1"], href: "/grammar/c1/complex-noun-phrases", badge: "C1" },
  { title: "Reported Speech: C1", keywords: ["reported speech c1", "denied having done", "urged him to", "warned against", "c1"], href: "/grammar/c1/reported-speech-c1", badge: "C1" },
  { title: "Concession & Contrast", keywords: ["concession", "contrast", "albeit", "whereas", "even so", "much as", "c1"], href: "/grammar/c1/concession-contrast", badge: "C1" },
  { title: "Hedging Language", keywords: ["hedging", "it seems that", "would appear", "tends to", "academic writing", "c1"], href: "/grammar/c1/hedging-language", badge: "C1" },
  { title: "Word Formation: Advanced", keywords: ["word formation", "prefixes suffixes", "mis- under- over-", "compound nouns", "c1"], href: "/grammar/c1/word-formation", badge: "C1" },
  { title: "Discourse Markers: Advanced", keywords: ["discourse markers advanced", "notwithstanding", "by the same token", "in so far as", "c1"], href: "/grammar/c1/advanced-discourse-markers", badge: "C1" },

  // ─── Tenses ───────────────────────────────────────────────────────────────
  { title: "Tenses — All Topics", keywords: ["tenses", "all tenses", "overview", "12 tenses", "english tenses"], href: "/tenses", badge: "Tenses" },
  { title: "Present Simple", keywords: ["present simple", "tense", "a1 a2"], href: "/tenses/present-simple", badge: "A1–A2" },
  { title: "Present Continuous", keywords: ["present continuous", "tense", "a1 a2"], href: "/tenses/present-continuous", badge: "A1–A2" },
  { title: "Past Simple", keywords: ["past simple", "tense", "a2"], href: "/tenses/past-simple", badge: "A2" },
  { title: "Past Continuous", keywords: ["past continuous", "tense", "a2 b1"], href: "/tenses/past-continuous", badge: "A2–B1" },
  { title: "Present Perfect", keywords: ["present perfect", "have has", "tense", "b1"], href: "/tenses/present-perfect", badge: "B1" },
  { title: "Present Perfect Continuous", keywords: ["present perfect continuous", "have been", "has been", "duration", "tense", "b1"], href: "/tenses/present-perfect-continuous", badge: "B1–B2" },
  { title: "Past Perfect", keywords: ["past perfect", "had", "before", "tense", "b1"], href: "/tenses/past-perfect", badge: "B1–B2" },
  { title: "Past Perfect Continuous", keywords: ["past perfect continuous", "had been", "tense", "b2"], href: "/tenses/past-perfect-continuous", badge: "B2" },
  { title: "Future Simple (will)", keywords: ["future simple", "will", "future", "tense", "a2"], href: "/tenses/future-simple", badge: "A2" },
  { title: "Be Going To", keywords: ["going to", "future plans", "tense", "a2"], href: "/tenses/be-going-to", badge: "A2" },
  { title: "Future Continuous", keywords: ["future continuous", "will be", "tense", "b2"], href: "/tenses/future-continuous", badge: "B2" },
  { title: "Future Perfect", keywords: ["future perfect", "will have", "tense", "b2 c1"], href: "/tenses/future-perfect", badge: "B2–C1" },

  // ─── Vocabulary overview pages ────────────────────────────────────────────
  { title: "Vocabulary — All Topics", keywords: ["vocabulary", "all topics", "overview", "words", "vocab"], href: "/vocabulary", badge: "Vocab" },
  { title: "Vocabulary A1 — Beginner", keywords: ["vocabulary a1", "beginner words", "a1 vocab"], href: "/vocabulary/a1", badge: "A1" },
  { title: "Vocabulary A2 — Elementary", keywords: ["vocabulary a2", "elementary words", "a2 vocab"], href: "/vocabulary/a2", badge: "A2" },
  { title: "Vocabulary B1 — Intermediate", keywords: ["vocabulary b1", "intermediate words", "b1 vocab"], href: "/vocabulary/b1", badge: "B1" },
  { title: "Vocabulary B2 — Upper-Intermediate", keywords: ["vocabulary b2", "upper intermediate words", "b2 vocab"], href: "/vocabulary/b2", badge: "B2" },
  { title: "Vocabulary C1 — Advanced", keywords: ["vocabulary c1", "advanced words", "c1 vocab"], href: "/vocabulary/c1", badge: "C1" },

  // ─── Vocabulary Topics ────────────────────────────────────────────────────
  { title: "Animals", keywords: ["animals", "vocabulary", "a1"], href: "/vocabulary/a1/animals", badge: "A1" },
  { title: "At the Café", keywords: ["cafe", "coffee", "food", "vocabulary", "a1"], href: "/vocabulary/a1/at-the-cafe", badge: "A1" },
  { title: "My Body", keywords: ["body", "parts", "health", "vocabulary", "a1"], href: "/vocabulary/a1/my-body", badge: "A1" },
  { title: "My Family", keywords: ["family", "relatives", "vocabulary", "a1"], href: "/vocabulary/a1/my-family", badge: "A1" },
  { title: "Around the Town", keywords: ["town", "city", "places", "vocabulary", "a2"], href: "/vocabulary/a2/around-the-town", badge: "A2" },
  { title: "At the Restaurant", keywords: ["restaurant", "food", "menu", "vocabulary", "a2"], href: "/vocabulary/a2/at-the-restaurant", badge: "A2" },
  { title: "Clothes and Shopping", keywords: ["clothes", "shopping", "fashion", "vocabulary", "a2"], href: "/vocabulary/a2/clothes-and-shopping", badge: "A2" },
  { title: "My Weekend", keywords: ["weekend", "free time", "hobbies", "vocabulary", "a2"], href: "/vocabulary/a2/my-weekend", badge: "A2" },
  { title: "City Life", keywords: ["city", "urban", "life", "vocabulary", "b1"], href: "/vocabulary/b1/city-life", badge: "B1" },
  { title: "Health and Fitness", keywords: ["health", "fitness", "exercise", "vocabulary", "b1"], href: "/vocabulary/b1/health-and-fitness", badge: "B1" },
  { title: "Job Interview", keywords: ["job", "interview", "work", "career", "vocabulary", "b1"], href: "/vocabulary/b1/job-interview", badge: "B1" },
  { title: "Travel Plans", keywords: ["travel", "plans", "holiday", "trip", "vocabulary", "b1"], href: "/vocabulary/b1/travel-plans", badge: "B1" },
  { title: "Business Meeting", keywords: ["business", "meeting", "work", "professional", "vocabulary", "b2"], href: "/vocabulary/b2/business-meeting", badge: "B2" },
  { title: "Environment", keywords: ["environment", "nature", "climate", "ecology", "vocabulary", "b2"], href: "/vocabulary/b2/environment", badge: "B2" },
  { title: "Media and Technology", keywords: ["media", "technology", "internet", "social media", "vocabulary", "b2"], href: "/vocabulary/b2/media-and-technology", badge: "B2" },
  { title: "Social Issues", keywords: ["social", "issues", "society", "problems", "vocabulary", "b2"], href: "/vocabulary/b2/social-issues", badge: "B2" },
  { title: "Academic Debate", keywords: ["academic", "debate", "argue", "opinion", "vocabulary", "c1"], href: "/vocabulary/c1/academic-debate", badge: "C1" },
  { title: "Economic Challenges", keywords: ["economic", "economy", "finance", "vocabulary", "c1"], href: "/vocabulary/c1/economic-challenges", badge: "C1" },
  { title: "Formal English", keywords: ["formal", "professional", "writing", "vocabulary", "c1"], href: "/vocabulary/c1/formal-english", badge: "C1" },
  { title: "Idioms and Phrases", keywords: ["idioms", "phrases", "expressions", "vocabulary", "c1"], href: "/vocabulary/c1/idioms-and-phrases", badge: "C1" },

  // ─── Reading ─────────────────────────────────────────────────────────────
  { title: "Reading — All Levels", keywords: ["reading", "articles", "overview", "texts", "comprehension"], href: "/reading", badge: "Reading" },
  { title: "Reading A1", keywords: ["reading a1", "beginner reading", "a1 texts", "simple stories"], href: "/reading/a1", badge: "A1" },
  { title: "Reading A2", keywords: ["reading a2", "elementary reading", "a2 texts"], href: "/reading/a2", badge: "A2" },
  { title: "Reading B1", keywords: ["reading b1", "intermediate reading", "b1 texts"], href: "/reading/b1", badge: "B1" },
  { title: "Reading B2", keywords: ["reading b2", "upper intermediate reading", "b2 texts"], href: "/reading/b2", badge: "B2" },
  { title: "Reading C1", keywords: ["reading c1", "advanced reading", "c1 texts"], href: "/reading/c1", badge: "C1" },
  { title: "At the Market", keywords: ["reading", "market", "shopping", "a1", "story"], href: "/reading/a1/at-the-market", badge: "A1" },
  { title: "Four Friends", keywords: ["reading", "friends", "story", "a1"], href: "/reading/a1/four-friends", badge: "A1" },
  { title: "My School Day", keywords: ["reading", "school", "routine", "day", "a1"], href: "/reading/a1/my-school-day", badge: "A1" },
  { title: "A Weekend Trip", keywords: ["reading", "weekend", "trip", "travel", "a2"], href: "/reading/a2/a-weekend-trip", badge: "A2" },
  { title: "City or Country?", keywords: ["reading", "city", "country", "lifestyle", "comparison", "a2"], href: "/reading/a2/city-or-country", badge: "A2" },
  { title: "Pen Pals", keywords: ["reading", "pen pals", "letters", "friends", "a2"], href: "/reading/a2/pen-pals", badge: "A2" },
  { title: "Digital Lives", keywords: ["reading", "digital", "technology", "internet", "b1"], href: "/reading/b1/digital-lives", badge: "B1" },
  { title: "The Slow Travel Movement", keywords: ["reading", "travel", "slow travel", "tourism", "b1"], href: "/reading/b1/the-slow-travel-movement", badge: "B1" },
  { title: "Work From Home", keywords: ["reading", "work from home", "remote work", "wfh", "b1"], href: "/reading/b1/work-from-home", badge: "B1" },
  { title: "Changing Cities", keywords: ["reading", "cities", "urban", "change", "development", "b2"], href: "/reading/b2/changing-cities", badge: "B2" },
  { title: "The Gig Economy", keywords: ["reading", "gig economy", "jobs", "freelance", "work", "b2"], href: "/reading/b2/the-gig-economy", badge: "B2" },
  { title: "The Psychology of Habits", keywords: ["reading", "habits", "psychology", "behaviour", "b2"], href: "/reading/b2/the-psychology-of-habits", badge: "B2" },
  { title: "Language and Thought", keywords: ["reading", "language", "thought", "linguistics", "c1"], href: "/reading/c1/language-and-thought", badge: "C1" },
  { title: "Rethinking Intelligence", keywords: ["reading", "intelligence", "iq", "mind", "c1"], href: "/reading/c1/rethinking-intelligence", badge: "C1" },
  { title: "The Attention Economy", keywords: ["reading", "attention", "media", "technology", "focus", "c1"], href: "/reading/c1/the-attention-economy", badge: "C1" },

  // ─── Listening ────────────────────────────────────────────────────────────
  { title: "Listening — All Levels", keywords: ["listening", "audio", "overview", "comprehension", "exercises"], href: "/listening", badge: "Listening" },
  { title: "Listening B2", keywords: ["listening b2", "upper intermediate listening", "b2 audio"], href: "/listening/b2", badge: "B2" },
  { title: "Work-Life Balance (Listening)", keywords: ["listening", "work life balance", "b2", "audio", "podcast"], href: "/listening/b2/work-life-balance", badge: "B2" },

  // ─── Nerd Zone ────────────────────────────────────────────────────────────
  { title: "Nerd Zone — Bonus Content", keywords: ["nerd zone", "extras", "bonus", "pro content", "extra content"], href: "/nerd-zone", badge: "PRO" },
  { title: "Irregular Verbs List", keywords: ["irregular verbs", "verb list", "go went gone", "irregular", "verb forms", "nerd zone"], href: "/nerd-zone/irregular-verbs", badge: "PRO" },
  { title: "Phrasal Verbs (Nerd Zone)", keywords: ["phrasal verbs", "give up", "look after", "extra", "nerd zone"], href: "/nerd-zone/phrasal-verbs", badge: "PRO" },
  { title: "Phrasal Verbs B1", keywords: ["phrasal verbs b1", "intermediate phrasal verbs"], href: "/nerd-zone/phrasal-verbs/b1", badge: "B1" },
  { title: "Phrasal Verbs B2", keywords: ["phrasal verbs b2", "upper intermediate phrasal verbs"], href: "/nerd-zone/phrasal-verbs/b2", badge: "B2" },
  { title: "Phrasal Verbs C1", keywords: ["phrasal verbs c1", "advanced phrasal verbs"], href: "/nerd-zone/phrasal-verbs/c1", badge: "C1" },
  { title: "Live Phrases", keywords: ["live phrases", "natural phrases", "everyday english", "collocations", "nerd zone"], href: "/nerd-zone/live-phrases", badge: "PRO" },
  { title: "Live Phrases B1", keywords: ["live phrases b1", "natural english b1"], href: "/nerd-zone/live-phrases/b1", badge: "B1" },
  { title: "Live Phrases B2", keywords: ["live phrases b2", "natural english b2"], href: "/nerd-zone/live-phrases/b2", badge: "B2" },
  { title: "Live Phrases C1", keywords: ["live phrases c1", "natural english c1"], href: "/nerd-zone/live-phrases/c1", badge: "C1" },
  { title: "English Slang", keywords: ["slang", "informal english", "colloquial", "nerd zone"], href: "/nerd-zone/slang", badge: "PRO" },
  { title: "Slang B1", keywords: ["slang b1", "informal b1", "colloquial b1"], href: "/nerd-zone/slang/b1", badge: "B1" },
  { title: "Slang B2", keywords: ["slang b2", "informal b2", "colloquial b2"], href: "/nerd-zone/slang/b2", badge: "B2" },
  { title: "Slang C1", keywords: ["slang c1", "informal c1", "colloquial c1"], href: "/nerd-zone/slang/c1", badge: "C1" },
  { title: "Movie & TV Recommendations", keywords: ["recommendations", "movies", "tv shows", "series", "films", "watch", "english", "nerd zone"], href: "/nerd-zone/recommendations", badge: "PRO" },
  { title: "Useful English Learning Sites", keywords: ["useful sites", "resources", "links", "websites", "english learning", "nerd zone"], href: "/nerd-zone/useful-sites", badge: "PRO" },
  { title: "My Materials (Downloads)", keywords: ["my materials", "downloads", "pdf", "worksheets", "saved", "nerd zone"], href: "/nerd-zone/my-materials", badge: "PRO" },
];

type Category = "test" | "grammar" | "tense" | "vocab" | "reading" | "listening" | "nerd" | "action" | "other";

export function getSearchCategory(item: SearchItem): Category {
  if (item.href.startsWith("/tests")) return "test";
  if (item.href.startsWith("/tenses")) return "tense";
  if (item.href.startsWith("/grammar")) return "grammar";
  if (item.href.startsWith("/vocabulary")) return "vocab";
  if (item.href.startsWith("/reading")) return "reading";
  if (item.href.startsWith("/listening")) return "listening";
  if (item.href.startsWith("/nerd-zone")) return "nerd";
  if (item.badge === "Action" || item.href === "/pro" || item.href === "/account" || item.href === "/contact" || item.href === "/about" || item.href === "/login" || item.href === "/register") return "action";
  return "other";
}

export function searchContent(query: string): SearchItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return searchIndex.slice(0, 8);

  return searchIndex
    .map((it) => {
      const hay = [it.title, ...it.keywords].join(" ").toLowerCase();
      const score =
        (it.title.toLowerCase().includes(q) ? 3 : 0) +
        (hay.includes(q) ? 2 : 0) +
        (it.keywords.some((k) => k.toLowerCase().startsWith(q)) ? 1 : 0);
      return { it, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 14)
    .map((x) => x.it);
}
