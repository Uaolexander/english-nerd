"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { StudentRow, ClassRow, AssignmentRow } from "./page";

// ── Exercise catalogue ────────────────────────────────────────────────────────
type ExerciseEntry = { slug: string; label: string };
type LevelMap = Record<string, ExerciseEntry[]>;

const EXERCISE_CATALOGUE: Record<string, LevelMap | ExerciseEntry[]> = {
  grammar: {
    a1: [
      { slug: "articles-a-an", label: "Articles: a / an" },
      { slug: "countable-uncountable", label: "Countable & Uncountable" },
      { slug: "there-is-there-are", label: "There is / There are" },
      { slug: "can-cant", label: "Can / Can't" },
      { slug: "present-simple-questions", label: "Present Simple – Questions" },
      { slug: "much-many-basic", label: "Much / Many (basic)" },
      { slug: "this-that-these-those", label: "This / That / These / Those" },
      { slug: "present-simple-negative", label: "Present Simple – Negative" },
      { slug: "prepositions-time-in-on-at", label: "Prepositions of Time" },
      { slug: "possessive-adjectives", label: "Possessive Adjectives" },
      { slug: "subject-pronouns", label: "Subject Pronouns" },
      { slug: "present-simple-he-she-it", label: "Present Simple – He/She/It" },
      { slug: "plural-nouns", label: "Plural Nouns" },
      { slug: "have-has-got", label: "Have / Has Got" },
      { slug: "to-be-am-is-are", label: "To Be – Am/Is/Are" },
      { slug: "wh-questions", label: "Wh- Questions" },
      { slug: "present-simple-i-you-we-they", label: "Present Simple – I/You/We/They" },
      { slug: "prepositions-place", label: "Prepositions of Place" },
      { slug: "adverbs-frequency", label: "Adverbs of Frequency" },
      { slug: "some-any", label: "Some / Any" },
    ],
    a2: [
      { slug: "will-future", label: "Will – Future" },
      { slug: "going-to", label: "Going To" },
      { slug: "present-perfect-intro", label: "Present Perfect – Intro" },
      { slug: "have-to", label: "Have To" },
      { slug: "adverbs-manner", label: "Adverbs of Manner" },
      { slug: "should-shouldnt", label: "Should / Shouldn't" },
      { slug: "object-pronouns", label: "Object Pronouns" },
      { slug: "past-simple-regular", label: "Past Simple – Regular" },
      { slug: "verb-infinitive", label: "Verb + Infinitive" },
      { slug: "verb-ing", label: "Verb + -ing" },
      { slug: "present-continuous", label: "Present Continuous" },
      { slug: "time-expressions-past", label: "Time Expressions (Past)" },
      { slug: "past-simple-irregular", label: "Past Simple – Irregular" },
      { slug: "comparative-adjectives", label: "Comparative Adjectives" },
      { slug: "possessive-pronouns", label: "Possessive Pronouns" },
      { slug: "articles-the", label: "Articles: The" },
      { slug: "prepositions-movement", label: "Prepositions of Movement" },
      { slug: "conjunctions", label: "Conjunctions" },
      { slug: "superlative-adjectives", label: "Superlative Adjectives" },
      { slug: "past-simple-negative-questions", label: "Past Simple – Negative & Questions" },
    ],
    b1: [
      { slug: "relative-clauses-defining", label: "Relative Clauses – Defining" },
      { slug: "used-to", label: "Used To" },
      { slug: "so-such", label: "So / Such" },
      { slug: "passive-past", label: "Passive – Past" },
      { slug: "too-enough", label: "Too / Enough" },
      { slug: "present-perfect-continuous", label: "Present Perfect Continuous" },
      { slug: "would-past-habits", label: "Would – Past Habits" },
      { slug: "relative-clauses-non-defining", label: "Relative Clauses – Non-defining" },
      { slug: "past-perfect", label: "Past Perfect" },
      { slug: "modal-deduction", label: "Modal – Deduction" },
      { slug: "reported-questions", label: "Reported Questions" },
      { slug: "second-conditional", label: "Second Conditional" },
      { slug: "all-conditionals", label: "All Conditionals" },
      { slug: "reported-statements", label: "Reported Statements" },
      { slug: "phrasal-verbs", label: "Phrasal Verbs" },
      { slug: "wish-past", label: "Wish + Past" },
      { slug: "passive-present", label: "Passive – Present" },
      { slug: "as-as-comparison", label: "As…as Comparison" },
      { slug: "zero-first-conditional", label: "Zero & First Conditional" },
      { slug: "past-continuous", label: "Past Continuous" },
      { slug: "modal-possibility", label: "Modal – Possibility" },
    ],
    b2: [
      { slug: "causative", label: "Causative Have/Get" },
      { slug: "gerunds-infinitives", label: "Gerunds & Infinitives" },
      { slug: "modal-perfect", label: "Modal Perfect" },
      { slug: "all-conditionals-b2", label: "All Conditionals B2" },
      { slug: "third-conditional", label: "Third Conditional" },
      { slug: "past-perfect-continuous", label: "Past Perfect Continuous" },
      { slug: "mixed-conditionals", label: "Mixed Conditionals" },
      { slug: "linking-words", label: "Linking Words" },
      { slug: "cleft-sentences", label: "Cleft Sentences" },
      { slug: "wish-would", label: "Wish + Would" },
      { slug: "quantifiers-advanced", label: "Quantifiers – Advanced" },
      { slug: "relative-clauses-advanced", label: "Relative Clauses – Advanced" },
      { slug: "passive-advanced", label: "Passive – Advanced" },
      { slug: "inversion", label: "Inversion" },
      { slug: "reported-speech-advanced", label: "Reported Speech – Advanced" },
      { slug: "future-continuous", label: "Future Continuous" },
      { slug: "participle-clauses", label: "Participle Clauses" },
      { slug: "future-perfect", label: "Future Perfect" },
    ],
    c1: [
      { slug: "advanced-modals", label: "Advanced Modals" },
      { slug: "subjunctive", label: "Subjunctive" },
      { slug: "advanced-participle-clauses", label: "Advanced Participle Clauses" },
      { slug: "inverted-conditionals", label: "Inverted Conditionals" },
      { slug: "ellipsis-substitution", label: "Ellipsis & Substitution" },
      { slug: "nominalisation", label: "Nominalisation" },
      { slug: "fronting-emphasis", label: "Fronting & Emphasis" },
      { slug: "hedging-language", label: "Hedging Language" },
      { slug: "concession-contrast", label: "Concession & Contrast" },
      { slug: "extraposition", label: "Extraposition" },
      { slug: "reported-speech-c1", label: "Reported Speech C1" },
      { slug: "advanced-relative-clauses", label: "Advanced Relative Clauses" },
      { slug: "word-formation", label: "Word Formation" },
      { slug: "passive-infinitives", label: "Passive Infinitives" },
      { slug: "advanced-discourse-markers", label: "Advanced Discourse Markers" },
      { slug: "complex-passives", label: "Complex Passives" },
      { slug: "advanced-inversion", label: "Advanced Inversion" },
      { slug: "complex-noun-phrases", label: "Complex Noun Phrases" },
    ],
  },
  reading: {
    a1: [
      { slug: "four-friends", label: "Four Friends" },
      { slug: "my-school-day", label: "My School Day" },
      { slug: "at-the-market", label: "At the Market" },
    ],
    a2: [
      { slug: "city-or-country", label: "City or Country?" },
      { slug: "a-weekend-trip", label: "A Weekend Trip" },
      { slug: "pen-pals", label: "Pen Pals" },
    ],
    b1: [
      { slug: "digital-lives", label: "Digital Lives" },
      { slug: "work-from-home", label: "Work from Home" },
      { slug: "the-slow-travel-movement", label: "The Slow Travel Movement" },
    ],
    b2: [
      { slug: "the-gig-economy", label: "The Gig Economy" },
      { slug: "changing-cities", label: "Changing Cities" },
      { slug: "the-psychology-of-habits", label: "The Psychology of Habits" },
    ],
    c1: [
      { slug: "rethinking-intelligence", label: "Rethinking Intelligence" },
      { slug: "language-and-thought", label: "Language and Thought" },
      { slug: "the-attention-economy", label: "The Attention Economy" },
    ],
  },
  listening: {
    b2: [
      { slug: "work-life-balance", label: "Work-Life Balance" },
    ],
  },
  vocabulary: {
    a1: [
      { slug: "at-the-cafe", label: "At the Café" },
      { slug: "animals", label: "Animals" },
      { slug: "my-body", label: "My Body" },
      { slug: "my-family", label: "My Family" },
    ],
    a2: [
      { slug: "at-the-restaurant", label: "At the Restaurant" },
      { slug: "my-weekend", label: "My Weekend" },
      { slug: "around-the-town", label: "Around the Town" },
      { slug: "clothes-and-shopping", label: "Clothes & Shopping" },
    ],
    b1: [
      { slug: "health-and-fitness", label: "Health & Fitness" },
      { slug: "job-interview", label: "Job Interview" },
      { slug: "city-life", label: "City Life" },
      { slug: "travel-plans", label: "Travel Plans" },
    ],
    b2: [
      { slug: "business-meeting", label: "Business Meeting" },
      { slug: "social-issues", label: "Social Issues" },
      { slug: "environment", label: "Environment" },
      { slug: "media-and-technology", label: "Media & Technology" },
    ],
    c1: [
      { slug: "idioms-and-phrases", label: "Idioms & Phrases" },
      { slug: "formal-english", label: "Formal English" },
      { slug: "economic-challenges", label: "Economic Challenges" },
      { slug: "academic-debate", label: "Academic Debate" },
    ],
  },
  tests: {
    general: [
      { slug: "grammar", label: "Grammar Test" },
      { slug: "tenses", label: "Tenses Test" },
      { slug: "vocabulary", label: "Vocabulary Test" },
    ],
  },
  tenses: {
    "present-simple": [
      { slug: "fill-in-blank", label: "Fill in the Blank" },
      { slug: "spot-the-mistake", label: "Spot the Mistake" },
      { slug: "sentence-builder", label: "Sentence Builder" },
      { slug: "quiz", label: "Quiz" },
      { slug: "do-dont-do-i", label: "Do / Does" },
      { slug: "to-be", label: "To Be" },
      { slug: "ps-vs-pc", label: "PS vs PC" },
      { slug: "ps-pc-advanced", label: "PS/PC Advanced" },
    ],
    "past-continuous": [
      { slug: "fill-in-blank", label: "Fill in the Blank" },
      { slug: "spot-the-mistake", label: "Spot the Mistake" },
      { slug: "sentence-builder", label: "Sentence Builder" },
      { slug: "quiz", label: "Quiz" },
      { slug: "when-while", label: "When / While" },
      { slug: "interrupted-actions", label: "Interrupted Actions" },
      { slug: "was-were-ing", label: "Was/Were + -ing" },
      { slug: "ps-vs-pc", label: "PS vs PC" },
    ],
    "past-perfect": [
      { slug: "fill-in-blank", label: "Fill in the Blank" },
      { slug: "spot-the-mistake", label: "Spot the Mistake" },
      { slug: "sentence-builder", label: "Sentence Builder" },
      { slug: "quiz", label: "Quiz" },
      { slug: "had-past-participle", label: "Had + Past Participle" },
      { slug: "past-perfect-vs-past-simple", label: "PP vs Past Simple" },
      { slug: "sequence-of-events", label: "Sequence of Events" },
      { slug: "irregular-participles", label: "Irregular Participles" },
    ],
    "future-simple": [
      { slug: "fill-in-blank", label: "Fill in the Blank" },
      { slug: "spot-the-mistake", label: "Spot the Mistake" },
      { slug: "sentence-builder", label: "Sentence Builder" },
      { slug: "quiz", label: "Quiz" },
      { slug: "will-vs-going-to", label: "Will vs Going To" },
      { slug: "promises-offers", label: "Promises & Offers" },
      { slug: "will-wont", label: "Will / Won't" },
      { slug: "predictions", label: "Predictions" },
    ],
    "future-continuous": [
      { slug: "fill-in-blank", label: "Fill in the Blank" },
      { slug: "spot-the-mistake", label: "Spot the Mistake" },
      { slug: "sentence-builder", label: "Sentence Builder" },
      { slug: "quiz", label: "Quiz" },
      { slug: "at-future-moment", label: "At a Future Moment" },
      { slug: "polite-questions", label: "Polite Questions" },
      { slug: "will-vs-will-be-ing", label: "Will vs Will be -ing" },
      { slug: "will-be-ing", label: "Will be + -ing" },
    ],
    "future-perfect": [
      { slug: "fill-in-blank", label: "Fill in the Blank" },
      { slug: "spot-the-mistake", label: "Spot the Mistake" },
      { slug: "sentence-builder", label: "Sentence Builder" },
      { slug: "quiz", label: "Quiz" },
      { slug: "irregular-participles", label: "Irregular Participles" },
      { slug: "future-perfect-vs-simple", label: "FP vs Future Simple" },
      { slug: "will-have-past-participle", label: "Will Have + Past Participle" },
      { slug: "by-the-time", label: "By the Time" },
    ],
  },
};

const TENSE_LABELS: Record<string, string> = {
  "present-simple": "Present Simple",
  "past-continuous": "Past Continuous",
  "past-perfect": "Past Perfect",
  "future-simple": "Future Simple",
  "future-continuous": "Future Continuous",
  "future-perfect": "Future Perfect",
};

const LEVEL_LABELS: Record<string, string> = { a1: "A1", a2: "A2", b1: "B1", b2: "B2", c1: "C1", general: "General" };

function buildHref(category: string, level: string, slug: string): string {
  if (category === "tenses") return `/tenses/${level}/${slug}`;
  if (category === "tests") return `/tests/${slug}`;
  return `/${category}/${level}/${slug}`;
}

type Tab = "students" | "classes" | "assignments";

interface Props {
  teacherEmail: string;
  plan: "starter" | "solo" | "plus";
  studentLimit: number;
  isInGracePeriod: boolean;
  subscriptionExpiresAt: string | null;
  students: StudentRow[];
  classes: ClassRow[];
  assignments: AssignmentRow[];
  siteUrl: string;
}

function timeAgo(iso: string | null) {
  if (!iso) return "—";
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

function scoreColor(score: number | null) {
  if (score === null) return "text-slate-400";
  if (score >= 80) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-500";
}

function slugToTitle(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// ── Students Tab ─────────────────────────────────────────────────────────────

function StudentsTab({ students, classes, studentLimit, siteUrl }: {
  students: StudentRow[];
  classes: ClassRow[];
  studentLimit: number;
  siteUrl: string;
}) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteMsg, setInviteMsg] = useState<{ type: "ok" | "err"; text: string; url?: string } | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [localStudents, setLocalStudents] = useState(students);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const activeCount = localStudents.filter((s) => s.status === "active").length;

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    setInviteMsg(null);
    try {
      const res = await fetch("/api/teacher/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });
      const data = await res.json();
      if (!data.ok) { setInviteMsg({ type: "err", text: data.error }); setInviting(false); return; }
      setInviteMsg({
        type: "ok",
        text: data.status === "active" ? "Student added successfully!" : "Invite link created. Share it with the student.",
        url: data.inviteUrl,
      });
      setInviteEmail("");
      window.location.reload();
    } catch {
      setInviteMsg({ type: "err", text: "Something went wrong." });
    }
    setInviting(false);
  }

  async function handleRemove(linkId: string) {
    setRemoving(linkId);
    const res = await fetch("/api/teacher/students", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentLinkId: linkId }),
    });
    if ((await res.json()).ok) {
      setLocalStudents((prev) => prev.filter((s) => s.linkId !== linkId));
    }
    setRemoving(null);
  }

  function copyInvite(token: string) {
    const url = `${siteUrl}/teacher/join?token=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Invite form */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">Invite a Student</h2>
          <span className="text-sm text-slate-500">
            <span className={activeCount >= studentLimit ? "text-red-500 font-bold" : "text-slate-700 font-semibold"}>{activeCount}</span>
            <span className="text-slate-400"> / {studentLimit} students</span>
          </span>
        </div>
        <form onSubmit={handleInvite} className="flex gap-3">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="student@email.com"
            required
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
          <button
            type="submit"
            disabled={inviting || activeCount >= studentLimit}
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-50"
          >
            {inviting ? "Inviting…" : "Invite"}
          </button>
        </form>
        {inviteMsg && (
          <div className={`mt-3 rounded-xl p-3 text-sm ${inviteMsg.type === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
            {inviteMsg.text}
            {inviteMsg.url && (
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 truncate rounded-lg bg-white border border-emerald-200 px-2 py-1 text-xs text-slate-600">
                  {inviteMsg.url}
                </code>
                <button
                  onClick={() => { navigator.clipboard.writeText(inviteMsg.url!); }}
                  className="rounded-lg bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-200 transition"
                >
                  Copy
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Students list */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Students</h2>
        </div>
        {localStudents.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-400">
            No students yet. Invite your first student above.
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {localStudents.map((s) => (
              <div key={s.linkId} className="flex items-center gap-4 px-6 py-4">
                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-black text-violet-600">
                  {s.email.slice(0, 2).toUpperCase()}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{s.email}</p>
                  <p className="text-xs text-slate-400">
                    {s.status === "active" ? (
                      <>Active · Last: {timeAgo(s.lastActivity)}</>
                    ) : s.status === "declined" ? (
                      <span className="text-red-500 font-semibold">Declined invitation</span>
                    ) : (
                      <span className="text-amber-500 font-semibold">Waiting for confirmation</span>
                    )}
                  </p>
                </div>
                {/* Stats */}
                {s.status === "active" && (
                  <div className="hidden sm:flex items-center gap-6 text-center">
                    <div>
                      <p className="text-base font-black text-slate-800">{s.totalCompleted}</p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Done</p>
                    </div>
                    <div>
                      <p className={`text-base font-black ${scoreColor(s.avgScore)}`}>
                        {s.avgScore !== null ? `${s.avgScore}%` : "—"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Avg</p>
                    </div>
                  </div>
                )}
                {/* Actions */}
                <div className="flex items-center gap-2">
                  {s.status === "active" && s.studentId && (
                    <Link
                      href={`/teacher/students/${s.studentId}`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      View
                    </Link>
                  )}
                  {s.status === "pending" && (
                    <button
                      onClick={() => copyInvite(s.inviteToken)}
                      className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600 transition hover:bg-violet-100"
                    >
                      {copiedToken === s.inviteToken ? "Copied!" : "Copy link"}
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(s.linkId)}
                    disabled={removing === s.linkId}
                    className="rounded-lg px-2 py-1.5 text-xs text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                  >
                    {removing === s.linkId ? "…" : "Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Classes Tab ───────────────────────────────────────────────────────────────

function ClassesTab({ classes, students }: { classes: ClassRow[]; students: StudentRow[] }) {
  const [newClassName, setNewClassName] = useState("");
  const [creating, setCreating] = useState(false);
  const [localClasses, setLocalClasses] = useState(classes);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [addingStudent, setAddingStudent] = useState<string | null>(null);

  const activeStudents = students.filter((s) => s.status === "active" && s.studentId);

  async function handleCreateClass(e: React.FormEvent) {
    e.preventDefault();
    if (!newClassName.trim()) return;
    setCreating(true);
    const res = await fetch("/api/teacher/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newClassName.trim() }),
    });
    const data = await res.json();
    if (data.ok) {
      setLocalClasses((prev) => [{ ...data.class, memberIds: [], createdAt: data.class.created_at }, ...prev]);
      setNewClassName("");
    }
    setCreating(false);
  }

  async function handleDeleteClass(classId: string) {
    if (!confirm("Delete this class? Students won't be removed from your list.")) return;
    const res = await fetch(`/api/teacher/classes?classId=${classId}`, { method: "DELETE" });
    if ((await res.json()).ok) {
      setLocalClasses((prev) => prev.filter((c) => c.id !== classId));
    }
  }

  async function handleAddToClass(classId: string, studentId: string) {
    setAddingStudent(studentId);
    const res = await fetch("/api/teacher/classes/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId, studentId }),
    });
    if ((await res.json()).ok) {
      setLocalClasses((prev) => prev.map((c) =>
        c.id === classId ? { ...c, memberIds: [...c.memberIds, studentId] } : c
      ));
    }
    setAddingStudent(null);
  }

  async function handleRemoveFromClass(classId: string, studentId: string) {
    const res = await fetch(`/api/teacher/classes/members?classId=${classId}&studentId=${studentId}`, { method: "DELETE" });
    if ((await res.json()).ok) {
      setLocalClasses((prev) => prev.map((c) =>
        c.id === classId ? { ...c, memberIds: c.memberIds.filter((id) => id !== studentId) } : c
      ));
    }
  }

  return (
    <div className="space-y-4">
      {/* Create class form */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-slate-800">Create a Class</h2>
        <form onSubmit={handleCreateClass} className="flex gap-3">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="e.g. Morning Group A"
            required
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-50"
          >
            {creating ? "Creating…" : "Create"}
          </button>
        </form>
      </div>

      {/* Classes list */}
      {localClasses.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-sm text-slate-400 shadow-sm">
          No classes yet. Create your first class above.
        </div>
      ) : (
        localClasses.map((cls) => {
          const members = activeStudents.filter((s) => cls.memberIds.includes(s.studentId!));
          const nonMembers = activeStudents.filter((s) => !cls.memberIds.includes(s.studentId!));
          const isExpanded = expandedClass === cls.id;

          return (
            <div key={cls.id} className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                  <svg className="h-4 w-4 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{cls.name}</p>
                  <p className="text-xs text-slate-400">{members.length} student{members.length !== 1 ? "s" : ""}</p>
                </div>
                <button
                  onClick={() => setExpandedClass(isExpanded ? null : cls.id)}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition"
                >
                  {isExpanded ? "Collapse" : "Manage"}
                </button>
                <button
                  onClick={() => handleDeleteClass(cls.id)}
                  className="rounded-lg px-2 py-1.5 text-xs text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                >
                  Delete
                </button>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-50 px-6 py-4 space-y-4">
                  {/* Current members */}
                  {members.length > 0 && (
                    <div>
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">Members</p>
                      <div className="space-y-2">
                        {members.map((s) => (
                          <div key={s.studentId} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5">
                            <span className="text-sm text-slate-700">{s.email}</span>
                            <button
                              onClick={() => handleRemoveFromClass(cls.id, s.studentId!)}
                              className="text-xs text-slate-400 hover:text-red-500 transition"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add students */}
                  {nonMembers.length > 0 && (
                    <div>
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">Add to class</p>
                      <div className="space-y-2">
                        {nonMembers.map((s) => (
                          <div key={s.studentId} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5">
                            <span className="text-sm text-slate-700">{s.email}</span>
                            <button
                              onClick={() => handleAddToClass(cls.id, s.studentId!)}
                              disabled={addingStudent === s.studentId}
                              className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition disabled:opacity-40"
                            >
                              {addingStudent === s.studentId ? "Adding…" : "Add"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {members.length === 0 && nonMembers.length === 0 && (
                    <p className="text-sm text-slate-400">No active students to add yet.</p>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// ── Assignments Tab ───────────────────────────────────────────────────────────

function AssignmentsTab({ assignments, students, classes }: {
  assignments: AssignmentRow[];
  students: StudentRow[];
  classes: ClassRow[];
}) {
  const [localAssignments, setLocalAssignments] = useState(assignments);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "grammar",
    level: "b1",
    slug: ((EXERCISE_CATALOGUE["grammar"] as LevelMap)["b1"]?.[0]?.slug) ?? "",
    exerciseNo: "",
    dueDate: "",
    targetType: "student" as "student" | "class",
    targetId: "",
  });
  const [saving, setSaving] = useState(false);

  const activeStudents = students.filter((s) => s.status === "active" && s.studentId);

  // Derive available level/tense keys and exercise slugs from the catalogue
  const levelKeys = useMemo<string[]>(() => {
    const cat = EXERCISE_CATALOGUE[form.category];
    if (!cat) return [];
    return Array.isArray(cat) ? [] : Object.keys(cat);
  }, [form.category]);

  const exerciseOptions = useMemo<ExerciseEntry[]>(() => {
    const cat = EXERCISE_CATALOGUE[form.category];
    if (!cat) return [];
    if (Array.isArray(cat)) return cat;
    return (cat as LevelMap)[form.level] ?? [];
  }, [form.category, form.level]);

  // Auto-select first valid level when category changes
  function handleCategoryChange(newCat: string) {
    const cat = EXERCISE_CATALOGUE[newCat];
    const keys = cat && !Array.isArray(cat) ? Object.keys(cat) : [];
    const defaultLevel = keys[0] ?? "";
    const exercises = cat && !Array.isArray(cat) ? (cat as LevelMap)[defaultLevel] ?? [] : [];
    setForm((f) => ({ ...f, category: newCat, level: defaultLevel, slug: exercises[0]?.slug ?? "" }));
  }

  function handleLevelChange(newLevel: string) {
    const cat = EXERCISE_CATALOGUE[form.category];
    const exercises = cat && !Array.isArray(cat) ? (cat as LevelMap)[newLevel] ?? [] : [];
    setForm((f) => ({ ...f, level: newLevel, slug: exercises[0]?.slug ?? "" }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const targets = form.targetId
      ? [form.targetType === "student" ? { studentId: form.targetId } : { classId: form.targetId }]
      : [];

    const res = await fetch("/api/teacher/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        category: form.category,
        level: form.level || undefined,
        slug: form.slug,
        exerciseNo: form.exerciseNo ? parseInt(form.exerciseNo) : undefined,
        dueDate: form.dueDate || undefined,
        targets,
      }),
    });
    const data = await res.json();
    if (data.ok) {
      setShowForm(false);
      setForm({ title: "", category: "grammar", level: "b1", slug: ((EXERCISE_CATALOGUE["grammar"] as LevelMap)["b1"]?.[0]?.slug) ?? "", exerciseNo: "", dueDate: "", targetType: "student", targetId: "" });
      window.location.reload();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this assignment?")) return;
    const res = await fetch(`/api/teacher/assignments?assignmentId=${id}`, { method: "DELETE" });
    if ((await res.json()).ok) {
      setLocalAssignments((prev) => prev.filter((a) => a.id !== id));
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{localAssignments.length} assignment{localAssignments.length !== 1 ? "s" : ""}</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-700"
        >
          {showForm ? "Cancel" : "+ New assignment"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Form header */}
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="font-black text-slate-800">New Assignment</h2>
            <p className="mt-0.5 text-xs text-slate-400">Choose a category, pick an exercise, and assign it to a student or class</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Past Continuous – Fill in the Blank"
                required className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            </div>

            {/* Category cards */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Category</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {[
                  { id: "grammar",    label: "Grammar",    color: "violet", icon: (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                  )},
                  { id: "tenses",     label: "Tenses",     color: "sky", icon: (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  )},
                  { id: "vocabulary", label: "Vocabulary",  color: "amber", icon: (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  )},
                  { id: "reading",    label: "Reading",    color: "emerald", icon: (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                  )},
                  { id: "listening",  label: "Listening",  color: "rose", icon: (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                    </svg>
                  )},
                  { id: "tests",      label: "Tests",      color: "orange", icon: (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                  )},
                ].map(({ id, label, color, icon }) => {
                  const isSelected = form.category === id;
                  const colorMap: Record<string, string> = {
                    violet:  isSelected ? "border-violet-500 bg-violet-50 text-violet-700 shadow-md shadow-violet-100"  : "border-slate-200 bg-slate-50 text-slate-500 hover:border-violet-300 hover:bg-violet-50/50",
                    sky:     isSelected ? "border-sky-500 bg-sky-50 text-sky-700 shadow-md shadow-sky-100"              : "border-slate-200 bg-slate-50 text-slate-500 hover:border-sky-300 hover:bg-sky-50/50",
                    amber:   isSelected ? "border-amber-500 bg-amber-50 text-amber-700 shadow-md shadow-amber-100"      : "border-slate-200 bg-slate-50 text-slate-500 hover:border-amber-300 hover:bg-amber-50/50",
                    emerald: isSelected ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-100" : "border-slate-200 bg-slate-50 text-slate-500 hover:border-emerald-300 hover:bg-emerald-50/50",
                    rose:    isSelected ? "border-rose-500 bg-rose-50 text-rose-700 shadow-md shadow-rose-100"          : "border-slate-200 bg-slate-50 text-slate-500 hover:border-rose-300 hover:bg-rose-50/50",
                    orange:  isSelected ? "border-orange-500 bg-orange-50 text-orange-700 shadow-md shadow-orange-100"  : "border-slate-200 bg-slate-50 text-slate-500 hover:border-orange-300 hover:bg-orange-50/50",
                  };
                  return (
                    <button key={id} type="button" onClick={() => handleCategoryChange(id)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-center transition ${colorMap[color]}`}>
                      {icon}
                      <span className="text-[10px] font-black leading-none tracking-wide">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level / Tense pills */}
            {levelKeys.length > 0 && (
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">
                  {form.category === "tenses" ? "Tense" : form.category === "tests" ? "Type" : "Level"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {levelKeys.map((k) => (
                    <button key={k} type="button" onClick={() => handleLevelChange(k)}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                        form.level === k
                          ? "bg-slate-800 text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                      }`}>
                      {form.category === "tenses" ? TENSE_LABELS[k] ?? k : LEVEL_LABELS[k] ?? k.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Exercise */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">Exercise</label>
              <select value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
                {exerciseOptions.length === 0 && <option value="">— no exercises available —</option>}
                {exerciseOptions.map((ex) => (
                  <option key={ex.slug} value={ex.slug}>{ex.label}</option>
                ))}
              </select>
            </div>

            {/* Bottom row: due date + assign */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">Due date</label>
                <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">Assign to</label>
                <select value={form.targetType} onChange={(e) => setForm({ ...form, targetType: e.target.value as "student" | "class", targetId: "" })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
                  <option value="student">Individual student</option>
                  <option value="class">Class</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">
                  {form.targetType === "student" ? "Student" : "Class"}
                </label>
                <select value={form.targetId} onChange={(e) => setForm({ ...form, targetId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100">
                  <option value="">Everyone</option>
                  {form.targetType === "student"
                    ? activeStudents.map((s) => <option key={s.studentId} value={s.studentId!}>{s.email}</option>)
                    : classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)
                  }
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-6 py-4">
            <button type="submit" disabled={saving}
              className="w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-50">
              {saving ? "Creating…" : "Create Assignment"}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {localAssignments.length === 0 && !showForm ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-sm text-slate-400 shadow-sm">
          No assignments yet. Create your first assignment above.
        </div>
      ) : (
        <div className="space-y-3">
          {localAssignments.map((a) => {
            const isOverdue = a.dueDate && new Date(a.dueDate) < new Date();
            const href = buildHref(a.category, a.level ?? "", a.slug);
            return (
              <div key={a.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-6 py-4 shadow-sm">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white ${
                  a.category === "grammar" ? "bg-violet-500" :
                  a.category === "tenses" ? "bg-sky-500" :
                  a.category === "vocabulary" ? "bg-amber-500" :
                  a.category === "reading" ? "bg-emerald-500" :
                  a.category === "listening" ? "bg-rose-500" :
                  a.category === "tests" ? "bg-orange-500" : "bg-slate-400"
                }`}>
                  {(a.level ?? "—").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-semibold text-slate-800">{a.title}</p>
                  <p className="text-xs text-slate-400">
                    {slugToTitle(a.slug)}{a.exerciseNo ? ` · Ex. ${a.exerciseNo}` : ""}
                    {a.dueDate && (
                      <span className={` · Due ${new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}${isOverdue ? " (overdue)" : ""}`}
                        style={{ color: isOverdue ? "#ef4444" : undefined }}>
                      </span>
                    )}
                  </p>
                </div>
                <a href={href} target="_blank" rel="noopener noreferrer"
                  className="hidden sm:flex rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition">
                  Open
                </a>
                <button onClick={() => handleDelete(a.id)}
                  className="rounded-lg px-2 py-1.5 text-xs text-slate-400 hover:bg-red-50 hover:text-red-500 transition">
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function TeacherDashboard({ teacherEmail, plan, studentLimit, isInGracePeriod, subscriptionExpiresAt, students, classes, assignments, siteUrl }: Props) {
  const [tab, setTab] = useState<Tab>("students");

  const activeStudents = students.filter((s) => s.status === "active").length;
  const pendingStudents = students.filter((s) => s.status === "pending" || s.status === "pending_student").length;

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "students", label: "Students", count: activeStudents },
    { id: "classes", label: "Classes", count: classes.length },
    { id: "assignments", label: "Assignments", count: assignments.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100">
              <svg className="h-6 w-6 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">Teacher Dashboard</h1>
              <p className="text-sm text-slate-500">
                {teacherEmail} ·{" "}
                <span className="font-semibold text-violet-600">
                  {plan === "plus" ? "Teacher Plus" : plan === "starter" ? "Teacher Starter" : "Teacher Solo"}
                </span>
                {" "}· {activeStudents}/{studentLimit} students
                {pendingStudents > 0 && <span className="ml-2 text-amber-500">({pendingStudents} pending)</span>}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* Grace period warning */}
        {isInGracePeriod && subscriptionExpiresAt && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
              <p className="font-bold text-amber-800">Your subscription has expired</p>
              <p className="mt-0.5 text-sm text-amber-700">
                Your subscription expired on {new Date(subscriptionExpiresAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
                You have a 7-day grace period — all your students and data are safe.
                Renew your subscription to restore full access.
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-2xl bg-slate-100 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition ${
                tab === t.id ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  tab === t.id ? "bg-violet-100 text-violet-700" : "bg-slate-200 text-slate-500"
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "students" && (
          <StudentsTab students={students} classes={classes} studentLimit={studentLimit} siteUrl={siteUrl} />
        )}
        {tab === "classes" && (
          <ClassesTab classes={classes} students={students} />
        )}
        {tab === "assignments" && (
          <AssignmentsTab assignments={assignments} students={students} classes={classes} />
        )}
      </div>
    </div>
  );
}
