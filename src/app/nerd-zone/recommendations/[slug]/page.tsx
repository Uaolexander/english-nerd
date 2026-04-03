import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import ExercisesClient from "./ExercisesClient";
import DownloadPDFWrapper from "./DownloadPDFWrapper";

const PRO_SLUGS = new Set([
  "the-simpsons", "forrest-gump",
  "bluey", "toy-story",
  "the-crown", "social-network", "the-martian",
  "house-of-cards", "black-mirror", "kings-speech", "oppenheimer",
]);

// Exercises available to any logged-in user (not Pro-only)
const LOGIN_SLUGS = new Set(["the-office", "lion-king", "breaking-bad"]);

type Word = { word: string; pos: string; meaning: string; example: string };

type VocabPage = {
  title: string;
  meta: string;
  level: "A2" | "B1" | "B2" | "C1";
  category: "Film" | "TV Show";
  image: string;
  imagePosition?: string;
  tip: string;
  words: Word[];
};

const LEVEL_BADGE: Record<string, string> = {
  A2: "bg-emerald-500 text-white",
  B1: "bg-violet-500 text-white",
  B2: "bg-orange-500 text-white",
  C1: "bg-sky-500 text-white",
};

const WORD_ACCENT: Record<string, string> = {
  A2: "text-emerald-700",
  B1: "text-violet-700",
  B2: "text-orange-700",
  C1: "text-sky-700",
};

const DATA: Record<string, VocabPage> = {
  "lion-king": {
    title: "The Lion King",
    meta: "1994 · Disney",
    level: "A2",
    category: "Film",
    image: "lion-king.jpg",
    tip: "Watch with English subtitles. The song lyrics repeat key words — sing along to make them stick!",
    words: [
      { word: "pride",    pos: "n", meaning: "a group of lions / a feeling of satisfaction", example: "The pride gathered at Pride Rock." },
      { word: "cub",      pos: "n", meaning: "a young lion",                                  example: "Simba is a young cub at the start of the film." },
      { word: "heir",     pos: "n", meaning: "someone who will inherit a title or property",  example: "Simba is the rightful heir to the kingdom." },
      { word: "exile",    pos: "n/v", meaning: "forced to leave your home or country",        example: "Simba lives in exile after his father dies." },
      { word: "kingdom",  pos: "n", meaning: "a country or region ruled by a king or queen",  example: "Mufasa rules over a vast kingdom." },
      { word: "destiny",  pos: "n", meaning: "the events that are meant to happen to you",   example: "Simba must accept his destiny as king." },
      { word: "betrayal", pos: "n", meaning: "when someone you trust hurts you",             example: "Scar's betrayal destroyed the pride." },
      { word: "stampede", pos: "n/v", meaning: "when a large group of animals run in panic", example: "The wildebeest stampede is a key scene." },
      { word: "roar",     pos: "n/v", meaning: "the loud sound a lion makes",                example: "The lion let out a powerful roar." },
      { word: "courage",  pos: "n", meaning: "the ability to face fear or danger",           example: "Simba shows real courage in the final battle." },
      { word: "majesty",  pos: "n", meaning: "greatness / used to address a king or queen",  example: "'Your Majesty' is how you address a king." },
      { word: "worthy",   pos: "adj", meaning: "deserving respect or admiration",            example: "Simba must prove he is worthy of the throne." },
    ],
  },
  "toy-story": {
    title: "Toy Story",
    meta: "1995 · Pixar",
    level: "A2",
    category: "Film",
    image: "toy-story.jpg",
    tip: "Great film to watch twice — first with subtitles, then without. The story is simple enough to follow by ear.",
    words: [
      { word: "jealous",    pos: "adj", meaning: "unhappy because someone else has something you want", example: "Woody is jealous of Buzz from the start." },
      { word: "loyal",      pos: "adj", meaning: "always faithful and supportive",                       example: "Woody is a loyal friend to Andy." },
      { word: "rescue",     pos: "v/n", meaning: "to save someone from danger",                         example: "They plan a rescue mission to save Woody." },
      { word: "abandon",    pos: "v", meaning: "to leave someone behind",                               example: "Andy doesn't want to abandon his toys." },
      { word: "pretend",    pos: "v", meaning: "to act as if something is true",                        example: "Buzz doesn't pretend — he really believes he's a Space Ranger." },
      { word: "worthless",  pos: "adj", meaning: "having no value",                                     example: "Woody feels worthless compared to Buzz." },
      { word: "mission",    pos: "n", meaning: "an important task",                                     example: "Buzz is on a mission to defeat the Evil Emperor Zurg." },
      { word: "bully",      pos: "n", meaning: "someone who hurts or threatens weaker people",          example: "Sid is a bully who destroys toys for fun." },
      { word: "infinity",   pos: "n", meaning: "endless space / no limits",                             example: "'To infinity and beyond!' is Buzz's catchphrase." },
      { word: "clumsy",     pos: "adj", meaning: "moving in an awkward, not graceful way",              example: "Buzz is clumsy at first when he arrives." },
      { word: "owner",      pos: "n", meaning: "someone who possesses something",                       example: "Andy is the toys' owner and they love him." },
      { word: "adventure",  pos: "n", meaning: "an exciting or dangerous experience",                   example: "The toys go on an adventure outside the house." },
    ],
  },
  "bluey": {
    title: "Bluey",
    meta: "Ludo Studio · ABC Kids",
    level: "A2",
    category: "TV Show",
    image: "bluey.jpg",
    tip: "Bluey is full of Australian slang. It's great for learning informal vocabulary and how real families actually talk.",
    words: [
      { word: "imaginative", pos: "adj", meaning: "creative and good at thinking of new ideas",           example: "Bluey is a very imaginative dog who invents fun games." },
      { word: "pretend",     pos: "v",   meaning: "to play as if something is true",                      example: "'Let's pretend I'm the doctor!' says Bluey." },
      { word: "exhausted",   pos: "adj", meaning: "extremely tired",                                      example: "Bandit is exhausted after playing all day." },
      { word: "cheeky",      pos: "adj", meaning: "slightly naughty in a funny, likeable way",            example: "That was a very cheeky thing to say!" },
      { word: "backyard",    pos: "n",   meaning: "the garden or outdoor area behind a house",            example: "The kids play in the backyard every afternoon." },
      { word: "reckon",      pos: "v",   meaning: "to think or believe (informal, Australian)",           example: "I reckon we should have lunch now." },
      { word: "grumpy",      pos: "adj", meaning: "bad-tempered and a bit irritable",                    example: "Dad gets grumpy when he doesn't have his coffee." },
      { word: "mate",        pos: "n",   meaning: "friend (Australian informal)",                         example: "'Come on, mate, let's go!' is a classic Aussie phrase." },
      { word: "heaps",       pos: "adv", meaning: "a lot, very much (Australian informal)",              example: "I had heaps of fun today!" },
      { word: "fair",        pos: "adj", meaning: "reasonable and just",                                  example: "'That's not fair — it's my turn!' says Bingo." },
      { word: "settle down", pos: "phr", meaning: "to calm down and be quiet",                           example: "Dad tells the kids to settle down before bed." },
      { word: "tackle",      pos: "v",   meaning: "to deal with something / also: to grab someone",      example: "Bluey tackles every problem with enthusiasm." },
    ],
  },
  "friends": {
    title: "Friends",
    meta: "1994–2004 · NBC",
    level: "B1",
    category: "TV Show",
    image: "friends.jpg",
    tip: "Start with Season 1 Episodes 1–5. The show uses the same characters repeatedly so vocabulary builds naturally over time.",
    words: [
      { word: "sarcastic",   pos: "adj", meaning: "saying the opposite of what you mean, usually mockingly",   example: "'Oh great, another Monday.' — Chandler's sarcasm is constant." },
      { word: "awkward",     pos: "adj", meaning: "uncomfortable and embarrassing",                             example: "The double date was really awkward for everyone." },
      { word: "commitment",  pos: "n",   meaning: "being dedicated to a person or relationship",               example: "Ross has a hard time with commitment." },
      { word: "break up",    pos: "phr", meaning: "to end a romantic relationship",                            example: "Ross and Rachel break up and get back together constantly." },
      { word: "on a break",  pos: "phr", meaning: "temporarily pausing a romantic relationship",              example: "'We were on a break!' is the most famous line in Friends." },
      { word: "blind date",  pos: "n",   meaning: "a romantic meeting with someone you've never met",         example: "Joey sets Ross up on a blind date." },
      { word: "flirt",       pos: "v",   meaning: "to behave as if you're romantically interested in someone", example: "Joey is always flirting with women at Central Perk." },
      { word: "acknowledge", pos: "v",   meaning: "to admit or accept that something is true",                example: "Monica never acknowledges how competitive she is." },
      { word: "roommate",    pos: "n",   meaning: "a person you share an apartment with",                     example: "Monica and Rachel are roommates in the show." },
      { word: "cliffhanger", pos: "n",   meaning: "an ending that leaves you wanting to know what happens",   example: "Friends was famous for its season cliffhangers." },
      { word: "jealous",     pos: "adj", meaning: "upset because someone has what you want",                  example: "Ross gets jealous whenever Rachel talks to other men." },
      { word: "reunion",     pos: "n",   meaning: "when people come together again after a long time",        example: "The Friends reunion special was watched by millions." },
    ],
  },
  "the-office": {
    title: "The Office",
    meta: "2005–2013 · NBC",
    level: "B1",
    category: "TV Show",
    image: "the-office.jpg",
    tip: "The mockumentary style means characters speak directly to the camera. Great for listening to natural, spontaneous English.",
    words: [
      { word: "promotion",          pos: "n",   meaning: "a move to a higher position at work",                      example: "Jim is hoping for a promotion to manager." },
      { word: "deadpan",            pos: "adj", meaning: "expressing humour with no emotion or facial expression",   example: "Jim's deadpan stare at the camera is iconic." },
      { word: "performance review", pos: "n",   meaning: "a formal evaluation of an employee's work",               example: "Michael dreads doing performance reviews." },
      { word: "redundancy",         pos: "n",   meaning: "losing your job because the role is no longer needed",    example: "The staff fear being made redundant." },
      { word: "cringe",             pos: "v/n", meaning: "to feel embarrassed by something",                        example: "Michael's speeches make everyone in the office cringe." },
      { word: "colleague",          pos: "n",   meaning: "a person you work with",                                  example: "Jim and Dwight are reluctant colleagues." },
      { word: "corporate",          pos: "adj", meaning: "relating to a large company or organisation",             example: "Corporate wants to shut down the Scranton branch." },
      { word: "undermine",          pos: "v",   meaning: "to secretly weaken someone's authority",                  example: "Dwight is always trying to undermine Jim." },
      { word: "resignation",        pos: "n",   meaning: "the act of officially quitting your job",                 example: "Dwight writes his resignation letter in a dramatic moment." },
      { word: "incentive",          pos: "n",   meaning: "something that encourages you to do something",           example: "Michael creates strange incentives for the sales team." },
      { word: "morale",             pos: "n",   meaning: "the confidence and happiness of a group",                 example: "Michael thinks his parties improve office morale." },
      { word: "micromanage",        pos: "v",   meaning: "to control every small detail of someone's work",         example: "Michael doesn't micromanage — he just has no idea what he's doing." },
    ],
  },
  "the-simpsons": {
    title: "The Simpsons",
    meta: "1989– · FOX",
    level: "B1",
    category: "TV Show",
    image: "the-simpsons.jpg",
    tip: "Watch Seasons 2–8 for the best language quality. The show is full of idioms, puns and cultural references.",
    words: [
      { word: "satire",      pos: "n",   meaning: "using humour to criticise or expose problems in society",  example: "The Simpsons is a brilliant satire of American family life." },
      { word: "suburban",    pos: "adj", meaning: "relating to a residential area outside a city",            example: "Springfield is the perfect satirical suburban town." },
      { word: "mediocre",    pos: "adj", meaning: "not very good; average",                                   example: "Homer is a mediocre worker at the nuclear plant." },
      { word: "prank",       pos: "n/v", meaning: "a trick played on someone for fun",                       example: "Bart loves to prank Principal Skinner." },
      { word: "detention",   pos: "n",   meaning: "being kept at school as a punishment",                    example: "Bart gets detention almost every episode." },
      { word: "exaggerate",  pos: "v",   meaning: "to describe something as greater than it really is",      example: "Homer always exaggerates his problems dramatically." },
      { word: "catchphrase", pos: "n",   meaning: "a short phrase that someone says repeatedly",             example: "'D'oh!' is Homer's most famous catchphrase." },
      { word: "parody",      pos: "n",   meaning: "an imitation of something, done for comic effect",        example: "The Simpsons parodies celebrities and political figures." },
      { word: "overreact",   pos: "v",   meaning: "to respond to something too strongly",                   example: "Homer overreacts to almost every situation." },
      { word: "gag",         pos: "n",   meaning: "a joke, especially a visual one",                        example: "Every episode opens with a unique couch gag." },
      { word: "principal",   pos: "n",   meaning: "the head teacher of a school",                           example: "Principal Skinner is always frustrated by Bart." },
      { word: "naive",       pos: "adj", meaning: "lacking experience and believing things too easily",      example: "Lisa is idealistic; Homer is naive about politics." },
    ],
  },
  "forrest-gump": {
    title: "Forrest Gump",
    meta: "1994 · Robert Zemeckis",
    level: "B1",
    category: "Film",
    image: "forrest-gump.jpg",
    imagePosition: "object-top",
    tip: "Forrest has a strong Southern American accent. Focus on the rhythm, not every word. Subtitles help a lot here.",
    words: [
      { word: "naive",       pos: "adj", meaning: "simple and trusting; lacking experience of the world",         example: "Forrest is naive but always kind-hearted." },
      { word: "disability",  pos: "n",   meaning: "a physical or mental condition that limits someone",           example: "Forrest has a physical disability as a child." },
      { word: "destiny",     pos: "n",   meaning: "the events that are meant to happen in your life",            example: "'Life is like a box of chocolates' is about destiny." },
      { word: "lieutenant",  pos: "n",   meaning: "a military officer rank",                                      example: "Forrest serves under Lieutenant Dan in Vietnam." },
      { word: "persevere",   pos: "v",   meaning: "to keep going despite difficulties",                          example: "Forrest always perseveres, no matter what happens." },
      { word: "coincidence", pos: "n",   meaning: "two things happening together by chance",                     example: "Forrest keeps meeting famous people — coincidence?" },
      { word: "inspire",     pos: "v",   meaning: "to make someone want to do something great",                  example: "Forrest unknowingly inspires people across America." },
      { word: "consistent",  pos: "adj", meaning: "always behaving in the same way",                            example: "Forrest is consistent — always honest and loyal." },
      { word: "sacrifice",   pos: "n/v", meaning: "giving up something important for someone else",              example: "Bubba's death is the film's greatest sacrifice." },
      { word: "miracle",     pos: "n",   meaning: "an extraordinary and unexpected event",                       example: "Forrest's doctors say his recovery is a miracle." },
      { word: "commitment",  pos: "n",   meaning: "dedication to a person, goal or cause",                      example: "Forrest's commitment to Jenny never wavers." },
      { word: "grief",       pos: "n",   meaning: "deep sadness, especially after loss",                        example: "Forrest runs across America to deal with his grief." },
    ],
  },
  "breaking-bad": {
    title: "Breaking Bad",
    meta: "2008–2013 · AMC",
    level: "B2",
    category: "TV Show",
    image: "breaking-bad.jpg",
    tip: "Every character has a distinct way of speaking. Jesse's slang vs. Walt's academic language is worth analysing deliberately.",
    words: [
      { word: "hubris",        pos: "n",   meaning: "excessive pride that leads to downfall",                        example: "Walt's hubris is his most dangerous quality." },
      { word: "moral compass", pos: "n",   meaning: "a person's inner sense of right and wrong",                   example: "Walt's moral compass breaks down episode by episode." },
      { word: "manipulation",  pos: "n",   meaning: "controlling people using dishonest methods",                   example: "Walt is a master of emotional manipulation." },
      { word: "empire",        pos: "n",   meaning: "a large, powerful organisation under one person's control",   example: "Walt builds a drug empire across the Southwest." },
      { word: "consequence",   pos: "n",   meaning: "the result or effect of an action",                           example: "Walt refuses to accept the consequences of his choices." },
      { word: "DEA",           pos: "n",   meaning: "Drug Enforcement Administration (US law enforcement)",        example: "Hank works for the DEA and investigates Heisenberg." },
      { word: "confession",    pos: "n",   meaning: "admitting you have done something wrong",                     example: "Walt's taped confession is a chilling scene." },
      { word: "chemistry",     pos: "n",   meaning: "the science of substances and reactions / also: connection",  example: "Walt's chemistry knowledge is what starts everything." },
      { word: "rationalise",   pos: "v",   meaning: "to invent logical reasons for something you know is wrong",   example: "Walt rationalises every bad decision he makes." },
      { word: "leverage",      pos: "n",   meaning: "power used to influence or control people",                   example: "Walt uses secrets as leverage over those around him." },
      { word: "deteriorate",   pos: "v",   meaning: "to become progressively worse",                              example: "Walt's relationships deteriorate as the show progresses." },
      { word: "ego",           pos: "n",   meaning: "a person's sense of their own importance",                   example: "Walt's ego grows uncontrollably as Heisenberg." },
    ],
  },
  "the-crown": {
    title: "The Crown",
    meta: "2016–2023 · Netflix",
    level: "B2",
    category: "TV Show",
    image: "the-crown.jpg",
    tip: "All characters speak with RP (received pronunciation) — the clearest and most formal British accent. Perfect for training your ear.",
    words: [
      { word: "abdication",    pos: "n",   meaning: "when a monarch formally gives up the throne",                 example: "Edward VIII's abdication changed the course of history." },
      { word: "constitutional", pos: "adj", meaning: "following or based on a constitution",                      example: "The Queen must be constitutional, never political." },
      { word: "parliament",    pos: "n",   meaning: "the group of elected people who make a country's laws",      example: "The Prime Minister must address parliament weekly." },
      { word: "protocol",      pos: "n",   meaning: "strict rules for formal behaviour on official occasions",    example: "Royal protocol must be followed at all times." },
      { word: "succession",    pos: "n",   meaning: "the order in which someone takes over a title or position",  example: "The succession to the throne is carefully managed." },
      { word: "privilege",     pos: "n",   meaning: "a special advantage available only to certain people",      example: "The Royal Family's privilege is constantly questioned." },
      { word: "statesman",     pos: "n",   meaning: "an experienced and respected political leader",             example: "Churchill is portrayed as a flawed but great statesman." },
      { word: "dignity",       pos: "n",   meaning: "calm, serious and respectful behaviour",                    example: "The Queen always maintains her dignity in public." },
      { word: "deference",     pos: "n",   meaning: "polite respect for someone in authority",                   example: "Everyone shows deference to the Queen in public." },
      { word: "reconcile",     pos: "v",   meaning: "to make two different things compatible / to make peace",   example: "The Queen must reconcile her duty with her personal feelings." },
      { word: "heir",          pos: "n",   meaning: "someone who will inherit a title, property or role",        example: "Charles is the heir to the British throne." },
      { word: "statecraft",    pos: "n",   meaning: "the skill of managing state affairs",                       example: "The show portrays statecraft as exhausting and isolating." },
    ],
  },
  "social-network": {
    title: "The Social Network",
    meta: "2010 · David Fincher",
    level: "B2",
    category: "Film",
    image: "social-network.jpg",
    tip: "The dialogue is extremely fast. Watch once for the plot, then once with subtitles focused on how characters argue and persuade.",
    words: [
      { word: "algorithm",           pos: "n",   meaning: "a set of rules a computer follows to solve a problem",         example: "Mark designs an algorithm that makes Facebook work." },
      { word: "lawsuit",             pos: "n",   meaning: "a legal case brought against someone in court",               example: "Eduardo files a lawsuit against Mark for diluting his shares." },
      { word: "deposition",          pos: "n",   meaning: "formal questioning under oath before a trial",                example: "Much of the film is told through deposition flashbacks." },
      { word: "intellectual property", pos: "n", meaning: "an idea or creation that belongs to you legally",            example: "The Winklevosses claim Mark stole their intellectual property." },
      { word: "co-founder",          pos: "n",   meaning: "one of several people who start a company together",         example: "Eduardo is the co-founder of Facebook." },
      { word: "betrayal",            pos: "n",   meaning: "when someone you trust hurts you",                          example: "Eduardo feels a deep sense of personal betrayal." },
      { word: "dilute",              pos: "v",   meaning: "to reduce the value of someone's shares in a company",      example: "Eduardo's shares are diluted without his knowledge." },
      { word: "venture capital",     pos: "n",   meaning: "money invested in a new company for a share of profits",    example: "Sean Parker brings venture capital connections to Facebook." },
      { word: "exclusive",           pos: "adj", meaning: "available only to a select group of people",               example: "Facebook starts as exclusive to Harvard students." },
      { word: "arrogant",            pos: "adj", meaning: "believing you are better or more important than others",    example: "Mark is portrayed as brilliant but deeply arrogant." },
      { word: "defraud",             pos: "v",   meaning: "to illegally take something from someone using deception",  example: "Eduardo claims Mark defrauded him of his shares." },
      { word: "testimony",           pos: "n",   meaning: "a formal statement given in court or under oath",          example: "The conflicting testimonies reveal the characters' biases." },
    ],
  },
  "the-martian": {
    title: "The Martian",
    meta: "2015 · Ridley Scott",
    level: "B2",
    category: "Film",
    image: "the-martian.jpg",
    tip: "Watney's humour and NASA's technical language sit side by side — great for learning both casual and scientific registers.",
    words: [
      { word: "botanist",     pos: "n",   meaning: "a scientist who studies plants",                                     example: "Watney uses his skills as a botanist to grow potatoes on Mars." },
      { word: "ration",       pos: "n/v", meaning: "a fixed amount of food / to limit supply carefully",               example: "Watney carefully rations his food to survive longer." },
      { word: "improvise",    pos: "v",   meaning: "to create or do something without preparation",                     example: "Watney has to improvise solutions with limited tools." },
      { word: "trajectory",   pos: "n",   meaning: "the path of a moving object through space",                        example: "NASA calculates the exact trajectory for the rescue mission." },
      { word: "habitat",      pos: "n",   meaning: "a place where a person or animal lives",                           example: "The habitat is Watney's only shelter on Mars." },
      { word: "orbit",        pos: "n/v", meaning: "the path of a spacecraft around a planet",                        example: "The crew adjusts their orbit to intercept Watney." },
      { word: "resourceful",  pos: "adj", meaning: "able to find clever solutions to difficult problems",              example: "Watney is incredibly resourceful in every crisis." },
      { word: "morale",       pos: "n",   meaning: "the confidence and spirit of a group",                            example: "Watney's video logs boost the rescue team's morale." },
      { word: "simulate",     pos: "v",   meaning: "to imitate a real situation for testing",                         example: "NASA simulates the rescue mission dozens of times first." },
      { word: "malfunction",  pos: "n/v", meaning: "when a machine stops working properly",                          example: "The MAV antenna malfunction is the original crisis." },
      { word: "calculus",     pos: "n",   meaning: "advanced mathematics involving rates of change",                  example: "Watney needs calculus to work out his survival timeline." },
      { word: "perseverance", pos: "n",   meaning: "continuing despite difficulties",                                 example: "Watney's perseverance is the heart of the film." },
    ],
  },
  "house-of-cards": {
    title: "House of Cards",
    meta: "2013–2018 · Netflix",
    level: "C1",
    category: "TV Show",
    image: "house-of-cards.jpg",
    tip: "Frank Underwood speaks directly to camera. Pause and replay these monologues — they're a masterclass in political rhetoric.",
    words: [
      { word: "manipulation",  pos: "n",   meaning: "controlling people through dishonest, calculating methods",          example: "Frank's manipulation is calculated and utterly ruthless." },
      { word: "rhetoric",      pos: "n",   meaning: "powerful and persuasive use of language",                           example: "Frank uses political rhetoric to justify every move." },
      { word: "leverage",      pos: "n",   meaning: "power to influence a situation, often using secrets",               example: "Frank collects damaging information to use as leverage." },
      { word: "conspiracy",    pos: "n",   meaning: "a secret plan by a group to do something harmful",                  example: "Frank orchestrates a web of political conspiracy." },
      { word: "corruption",    pos: "n",   meaning: "dishonest or illegal behaviour by people in authority",             example: "The show exposes the systemic corruption of Washington." },
      { word: "undermine",     pos: "v",   meaning: "to weaken someone's authority or confidence gradually",             example: "Frank systematically undermines every political rival." },
      { word: "veto",          pos: "n/v", meaning: "the power to stop a decision or legislation",                     example: "The President can veto any bill passed by Congress." },
      { word: "incumbent",     pos: "n/adj", meaning: "the person currently holding an official position",              example: "The incumbent president is losing public support." },
      { word: "machination",   pos: "n",   meaning: "a complex and devious scheme or plot",                             example: "Frank's machinations never stop, even when he wins." },
      { word: "complicit",     pos: "adj", meaning: "involved in or allowing wrongdoing",                               example: "Claire becomes increasingly complicit in Frank's crimes." },
      { word: "ambition",      pos: "n",   meaning: "a strong desire to achieve power, success or status",              example: "Frank's ambition has no moral boundaries whatsoever." },
      { word: "subterfuge",    pos: "n",   meaning: "deception used to achieve an aim",                                 example: "Frank relies on subterfuge to reach the presidency." },
    ],
  },
  "black-mirror": {
    title: "Black Mirror",
    meta: "2011– · Netflix",
    level: "C1",
    category: "TV Show",
    image: "black-mirror.jpg",
    tip: "Each episode is standalone — start with 'Nosedive' (S3E1) or 'The Entire History of You' (S1E3) for rich language and ideas.",
    words: [
      { word: "dystopia",      pos: "n",   meaning: "an imagined society where everything has gone terribly wrong",     example: "Each Black Mirror episode depicts a different near-future dystopia." },
      { word: "surveillance",  pos: "n",   meaning: "close monitoring, especially by governments or corporations",      example: "The episode explores the consequences of total surveillance." },
      { word: "autonomy",      pos: "n",   meaning: "the right and ability to make your own decisions",                example: "Technology in the show slowly erodes human autonomy." },
      { word: "consciousness", pos: "n",   meaning: "the state of being aware and able to think and feel",             example: "Can a digital copy of consciousness truly feel emotions?" },
      { word: "ethics",        pos: "n",   meaning: "moral principles guiding what is right or wrong",                 example: "The show constantly forces us to confront difficult ethics." },
      { word: "addiction",     pos: "n",   meaning: "being unable to stop a harmful behaviour",                       example: "Social media addiction is a recurring Black Mirror theme." },
      { word: "nostalgia",     pos: "n",   meaning: "a sentimental longing for the past",                             example: "One episode weaponises nostalgia to devastating effect." },
      { word: "simulation",    pos: "n",   meaning: "a computer-generated imitation of reality",                      example: "Several episodes ask whether we're living in a simulation." },
      { word: "consent",       pos: "n",   meaning: "permission freely given for something",                          example: "Characters rarely give true informed consent in the show." },
      { word: "complicit",     pos: "adj", meaning: "involved in or allowing wrongdoing",                             example: "Society is shown to be complicit in its own oppression." },
      { word: "immersive",     pos: "adj", meaning: "deeply engaging all of your attention and senses",               example: "The VR technology depicted is fully immersive." },
      { word: "inevitable",    pos: "adj", meaning: "certain to happen and impossible to prevent",                    example: "The show presents technology's dark side as inevitable." },
    ],
  },
  "kings-speech": {
    title: "The King's Speech",
    meta: "2010 · Tom Hooper",
    level: "C1",
    category: "Film",
    image: "kings-speech.jpg",
    tip: "Every speech-preparation scene is a vocabulary lesson. Note how Lionel Logue challenges the formal register of the palace.",
    words: [
      { word: "stammer",      pos: "n/v", meaning: "to speak with involuntary pauses and repetitions",                  example: "King George VI has a severe stammer that affects his confidence." },
      { word: "abdication",   pos: "n",   meaning: "when a monarch formally gives up the throne",                       example: "Edward VIII's abdication forces George to become King." },
      { word: "therapist",    pos: "n",   meaning: "a person who treats psychological or physical problems",            example: "Lionel Logue is the King's unconventional speech therapist." },
      { word: "rhetoric",     pos: "n",   meaning: "the art of effective and persuasive speaking or writing",          example: "The King must master the rhetoric expected of a wartime leader." },
      { word: "sovereignty",  pos: "n",   meaning: "supreme power or authority over a country",                        example: "The coronation is the formal confirmation of his sovereignty." },
      { word: "coronation",   pos: "n",   meaning: "the ceremony of crowning a new king or queen",                    example: "The film builds towards the King's coronation ceremony." },
      { word: "broadcast",    pos: "n/v", meaning: "to transmit a speech or programme over radio or television",      example: "The King must broadcast a live address to the entire nation." },
      { word: "aristocracy",  pos: "n",   meaning: "the highest social class, usually with hereditary titles",        example: "Logue is not part of the aristocracy, which creates tension." },
      { word: "persevere",    pos: "v",   meaning: "to continue doing something difficult despite setbacks",           example: "The King must persevere through humiliation to find his voice." },
      { word: "composure",    pos: "n",   meaning: "calmness and self-control in a difficult situation",               example: "The King struggles to maintain his composure before speaking." },
      { word: "unconventional", pos: "adj", meaning: "not following what is generally done or believed",              example: "Logue's unconventional methods challenge royal tradition." },
      { word: "oratory",      pos: "n",   meaning: "the skill or art of public speaking",                            example: "The film is ultimately a celebration of oratory." },
    ],
  },
  "oppenheimer": {
    title: "Oppenheimer",
    meta: "2023 · Christopher Nolan",
    level: "C1",
    category: "Film",
    image: "oppenheimer.jpg",
    tip: "The film switches between colour (subjective) and black-and-white (objective) sequences. Listen for shifts in register — courtroom vs. academic vs. political speech.",
    words: [
      { word: "physicist",       pos: "n",   meaning: "a scientist who studies matter, energy and the laws of nature",    example: "Oppenheimer is the leading theoretical physicist of his generation." },
      { word: "fission",         pos: "n",   meaning: "splitting an atom to release a massive amount of energy",          example: "Nuclear fission is the scientific principle behind the bomb." },
      { word: "classified",      pos: "adj", meaning: "officially designated as secret by the government",               example: "All information about the Manhattan Project was classified." },
      { word: "testimony",       pos: "n",   meaning: "a formal statement given under oath in a hearing or trial",       example: "Oppenheimer's testimony during the security hearing is pivotal." },
      { word: "moral dilemma",   pos: "n",   meaning: "a situation where every possible choice has ethical consequences", example: "Building the bomb creates an impossible moral dilemma." },
      { word: "legacy",          pos: "n",   meaning: "something left behind for future generations to remember",        example: "Oppenheimer's legacy is both brilliant and deeply troubling." },
      { word: "paranoia",        pos: "n",   meaning: "an irrational and persistent fear of being harmed",              example: "McCarthyism created widespread paranoia about communism." },
      { word: "devastation",     pos: "n",   meaning: "great destruction, damage and emotional suffering",              example: "Oppenheimer is haunted by the devastation the bomb caused." },
      { word: "theoretical",     pos: "adj", meaning: "based on ideas and principles rather than practical application", example: "His theoretical work laid the foundation for nuclear physics." },
      { word: "reckoning",       pos: "n",   meaning: "a moment when past actions are judged or punished",              example: "The hearing is Oppenheimer's professional and moral reckoning." },
      { word: "contradict",      pos: "v",   meaning: "to say or do the opposite of what was previously stated",       example: "Witnesses contradict each other throughout the hearing." },
      { word: "allegiance",      pos: "n",   meaning: "loyalty to a person, country or cause",                        example: "His alleged political allegiances become the core accusation." },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = DATA[slug];
  if (!page) return {};
  return {
    title: `${page.title} — Key Vocabulary | English Nerd`,
    description: `Learn ${page.words.length} essential words for watching ${page.title}. Meanings and examples in context.`,
    alternates: { canonical: `/nerd-zone/recommendations/${slug}` },
  };
}

export default async function VocabularyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = DATA[slug];
  if (!page) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;
  const isProSlug = PRO_SLUGS.has(slug);
  const isLoginSlug = LOGIN_SLUGS.has(slug);

  const levelBadge = LEVEL_BADGE[page.level];
  const wordAccent = WORD_ACCENT[page.level];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 flex-wrap">
          {[["Home", "/"], ["Nerd Zone", "/nerd-zone"], ["Watch & Learn", "/nerd-zone/recommendations"]].map(([label, href]) => (
            <span key={href} className="flex items-center gap-1.5">
              <a href={href} className="hover:text-slate-700 transition">{label}</a>
              <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </span>
          ))}
          <span className="text-slate-700 font-medium">{page.title}</span>
        </nav>

        {/* Banner image with overlay */}
        <div className="relative mt-6 h-56 overflow-hidden rounded-2xl bg-slate-200 sm:h-64">
          <img
            src={`/topics/nerd-zone/recommendations/${page.image}`}
            alt={page.title}
            className={`h-full w-full object-cover ${page.imagePosition ?? "object-center"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent" />
          <div className="absolute bottom-5 left-6">
            <div className="flex items-center gap-2 mb-2">
              <span className={`rounded-full px-3 py-0.5 text-[11px] font-black ${levelBadge}`}>{page.level}</span>
              <span className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-0.5 text-[11px] font-black text-white">{page.category}</span>
            </div>
            <h1 className="text-2xl font-black text-white leading-tight sm:text-3xl">{page.title}</h1>
            <p className="mt-1 text-sm text-white/60">{page.meta}</p>
          </div>
        </div>

        {/* Subtitle + Download */}
        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <p className="text-[15px] text-slate-500 leading-relaxed max-w-lg">
            {page.words.length} key words from <span className="font-semibold text-slate-700">{page.title}</span> — learn them before you watch for a much richer experience.
          </p>
          <DownloadPDFWrapper
            words={page.words}
            level={page.level}
            title={page.title}
            meta={page.meta}
            tip={page.tip}
            isPro={isPro || (isLoginSlug && !!user)}
          />
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-[1.2fr_1.5fr_1.8fr] gap-0 border-b-2 border-slate-200 bg-white">
            <div className="flex items-center gap-2 px-5 py-4">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">Word</span>
            </div>
            <div className="flex items-center gap-2 border-l border-emerald-100 bg-emerald-50/60 px-5 py-4">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Meaning</span>
            </div>
            <div className="flex items-center gap-2 border-l border-sky-100 bg-sky-50/60 px-5 py-4">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-700">Example</span>
            </div>
          </div>

          {/* Rows */}
          <div>
            {page.words.map(({ word, pos, meaning, example }, i) => (
              <div key={word} className={`group grid grid-cols-[1.2fr_1.5fr_1.8fr] gap-0 border-b border-slate-50 transition-colors hover:bg-[#F5DA20]/8 last:border-0 ${i % 2 === 1 ? "bg-slate-50/40" : "bg-white"}`}>
                <div className="flex items-center gap-2 px-5 py-3.5">
                  <span className={`text-sm font-black ${wordAccent}`}>{word}</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">{pos}</span>
                </div>
                <div className="flex items-center border-l border-emerald-50 bg-emerald-50/30 px-5 py-3.5 group-hover:bg-emerald-50/60">
                  <span className="text-sm text-emerald-800 leading-snug">{meaning}</span>
                </div>
                <div className="flex items-center border-l border-sky-50 bg-sky-50/30 px-5 py-3.5 group-hover:bg-sky-50/60">
                  <span className="text-sm italic text-sky-800 leading-snug">{example}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
            <span className="text-xs text-slate-400">{page.words.length} words · {page.level} · {page.category}</span>
          </div>
        </div>

        {/* Study tip */}
        <div className="mt-5 flex gap-4 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-base">💡</div>
          <div>
            <p className="text-sm font-bold text-amber-900">Study tip</p>
            <p className="mt-0.5 text-sm text-amber-800 leading-relaxed">{page.tip}</p>
          </div>
        </div>

        {/* Exercises */}
        <ExercisesClient
          words={page.words}
          level={page.level}
          title={page.title}
          isPro={isPro}
          isProSlug={isProSlug}
          isLoginSlug={isLoginSlug}
          isLoggedIn={!!user}
        />

        {/* Bottom nav */}
        <div className="mt-10 border-t border-slate-100 pt-6">
          <a href="/nerd-zone/recommendations" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Back to Watch & Learn
          </a>
        </div>

      </div>
    </div>
  );
}
