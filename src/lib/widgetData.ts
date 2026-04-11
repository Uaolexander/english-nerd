export interface WidgetQuestion {
  q: string;
  options: string[];
  answer: number; // index of correct option
}

export interface WidgetData {
  slug: string;
  title: string;
  level: string;
  lessonUrl: string;
  color: string; // tailwind bg class for accent
  questions: WidgetQuestion[];
}

export const WIDGETS: Record<string, WidgetData> = {
  "to-be": {
    slug: "to-be",
    title: "To Be (am / is / are)",
    level: "A1",
    lessonUrl: "/grammar/a1/to-be-am-is-are",
    color: "#10b981",
    questions: [
      { q: "I ___ a student.", options: ["am", "is", "are", "be"], answer: 0 },
      { q: "She ___ from Spain.", options: ["am", "is", "are", "be"], answer: 1 },
      { q: "They ___ happy today.", options: ["am", "is", "are", "be"], answer: 2 },
      { q: "___ you ready?", options: ["Am", "Is", "Are", "Be"], answer: 2 },
      { q: "The book ___ on the table.", options: ["am", "are", "be", "is"], answer: 3 },
    ],
  },

  "present-simple": {
    slug: "present-simple",
    title: "Present Simple",
    level: "A1",
    lessonUrl: "/grammar/a1/present-simple-i-you-we-they",
    color: "#10b981",
    questions: [
      { q: "She ___ to school every day.", options: ["go", "goes", "going", "gone"], answer: 1 },
      { q: "I ___ coffee in the morning.", options: ["drink", "drinks", "drinking", "drank"], answer: 0 },
      { q: "He ___ live in London.", options: ["don't", "doesn't", "isn't", "aren't"], answer: 1 },
      { q: "___ they speak English?", options: ["Does", "Is", "Do", "Are"], answer: 2 },
      { q: "My sister ___ cats.", options: ["love", "loves", "loving", "is love"], answer: 1 },
    ],
  },

  "past-simple": {
    slug: "past-simple",
    title: "Past Simple",
    level: "A2",
    lessonUrl: "/grammar/a2/past-simple-regular",
    color: "#f59e0b",
    questions: [
      { q: "She ___ the book yesterday.", options: ["finish", "finishes", "finished", "finishing"], answer: 2 },
      { q: "They ___ to the beach last summer.", options: ["go", "goes", "went", "gone"], answer: 2 },
      { q: "I ___ watch TV last night.", options: ["don't", "doesn't", "didn't", "wasn't"], answer: 2 },
      { q: "___ he call you?", options: ["Do", "Does", "Did", "Was"], answer: 2 },
      { q: "We ___ pizza for dinner.", options: ["have", "has", "had", "having"], answer: 2 },
    ],
  },

  "present-perfect": {
    slug: "present-perfect",
    title: "Present Perfect",
    level: "A2",
    lessonUrl: "/grammar/a2/present-perfect-intro",
    color: "#f59e0b",
    questions: [
      { q: "I ___ never eaten sushi.", options: ["have", "has", "had", "am"], answer: 0 },
      { q: "She ___ just arrived.", options: ["have", "has", "had", "is"], answer: 1 },
      { q: "They ___ finished their homework.", options: ["have", "has", "had", "are"], answer: 0 },
      { q: "___ you ever been to Paris?", options: ["Have", "Has", "Had", "Did"], answer: 0 },
      { q: "He ___ lost his keys.", options: ["have", "has", "had", "is"], answer: 1 },
    ],
  },

  "articles": {
    slug: "articles",
    title: "Articles (a / an / the)",
    level: "A1",
    lessonUrl: "/grammar/a2/articles-the",
    color: "#10b981",
    questions: [
      { q: "She is ___ engineer.", options: ["a", "an", "the", "—"], answer: 1 },
      { q: "I have ___ dog. ___ dog is very friendly.", options: ["a / The", "the / The", "a / A", "an / The"], answer: 0 },
      { q: "He plays ___ guitar.", options: ["a", "an", "the", "—"], answer: 2 },
      { q: "This is ___ umbrella.", options: ["a", "an", "the", "—"], answer: 1 },
      { q: "___ sun rises in the east.", options: ["A", "An", "The", "—"], answer: 2 },
    ],
  },

  "second-conditional": {
    slug: "second-conditional",
    title: "Second Conditional",
    level: "B1",
    lessonUrl: "/grammar/b1/second-conditional",
    color: "#8b5cf6",
    questions: [
      { q: "If I ___ rich, I would travel the world.", options: ["am", "was", "were", "be"], answer: 2 },
      { q: "She would buy a car if she ___ enough money.", options: ["has", "have", "had", "would have"], answer: 2 },
      { q: "If it ___ sunny, we would go to the beach.", options: ["is", "was", "were", "would be"], answer: 2 },
      { q: "I would call him if I ___ his number.", options: ["know", "knew", "known", "would know"], answer: 1 },
      { q: "If you ___ harder, you would pass.", options: ["study", "studied", "studies", "would study"], answer: 1 },
    ],
  },

  "passive-present": {
    slug: "passive-present",
    title: "Present Passive",
    level: "B1",
    lessonUrl: "/grammar/b1/passive-present",
    color: "#8b5cf6",
    questions: [
      { q: "English ___ all over the world.", options: ["speak", "speaks", "is spoken", "are spoken"], answer: 2 },
      { q: "The report ___ every month.", options: ["writes", "is written", "are written", "write"], answer: 1 },
      { q: "These cars ___ in Germany.", options: ["makes", "make", "is made", "are made"], answer: 3 },
      { q: "The mail ___ at 9 a.m. every day.", options: ["delivers", "is delivered", "are delivered", "deliver"], answer: 1 },
      { q: "Millions of emails ___ sent every minute.", options: ["is", "are", "be", "been"], answer: 1 },
    ],
  },

  "modal-verbs": {
    slug: "modal-verbs",
    title: "Modal Verbs (can / must / should)",
    level: "A2",
    lessonUrl: "/grammar/a2/should-shouldnt",
    color: "#f59e0b",
    questions: [
      { q: "You ___ smoke here. It's forbidden.", options: ["can", "must", "can't", "should"], answer: 2 },
      { q: "She ___ speak three languages.", options: ["must", "can", "should", "has to"], answer: 1 },
      { q: "You ___ see a doctor. You look pale.", options: ["can", "must", "should", "would"], answer: 2 },
      { q: "Students ___ wear a uniform at this school.", options: ["can", "should", "must", "might"], answer: 2 },
      { q: "I ___ swim when I was five.", options: ["must", "can", "could", "should"], answer: 2 },
    ],
  },

  "adverbs-frequency": {
    slug: "adverbs-frequency",
    title: "Adverbs of Frequency",
    level: "A1",
    lessonUrl: "/grammar/a1/adverbs-frequency",
    color: "#10b981",
    questions: [
      { q: "She ___ goes to bed early — every night.", options: ["always", "never", "sometimes", "often"], answer: 0 },
      { q: "I ___ eat broccoli — maybe once a year.", options: ["always", "usually", "often", "hardly ever"], answer: 3 },
      { q: "Which is correct?", options: ["I usually get up at 7.", "I get usually up at 7.", "Usually I get up at 7 always.", "I get up usually at 7."], answer: 0 },
      { q: "He ___ watches TV before bed, but not every day.", options: ["never", "always", "sometimes", "always"], answer: 2 },
      { q: "Where do adverbs go with the verb 'to be'?", options: ["Before 'to be'", "After 'to be'", "At the end", "At the start"], answer: 1 },
    ],
  },

  "relative-clauses": {
    slug: "relative-clauses",
    title: "Relative Clauses",
    level: "B1",
    lessonUrl: "/grammar/b1/relative-clauses-defining",
    color: "#8b5cf6",
    questions: [
      { q: "The woman ___ lives next door is a doctor.", options: ["which", "who", "whom", "whose"], answer: 1 },
      { q: "The book ___ I bought is very interesting.", options: ["who", "whose", "which", "whom"], answer: 2 },
      { q: "The city ___ I was born is beautiful.", options: ["which", "who", "where", "whose"], answer: 2 },
      { q: "The man ___ car was stolen called the police.", options: ["who", "which", "that", "whose"], answer: 3 },
      { q: "That's the restaurant ___ we had dinner.", options: ["which", "who", "where", "that"], answer: 2 },
    ],
  },
};

export function getWidget(slug: string): WidgetData | null {
  return WIDGETS[slug] ?? null;
}

export function getAllWidgets(): WidgetData[] {
  return Object.values(WIDGETS);
}
