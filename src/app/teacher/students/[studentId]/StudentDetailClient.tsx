"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProgressRow, AnswerRow } from "./page";

interface Props {
  studentEmail: string;
  studentId: string;
  progress: ProgressRow[];
  answers: AnswerRow[];
}

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-500";
}

function scoreBg(score: number) {
  if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (score >= 50) return "bg-amber-50 text-amber-700 border-amber-100";
  return "bg-red-50 text-red-700 border-red-100";
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
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const LEVEL_BADGE: Record<string, string> = {
  a1: "bg-emerald-500", a2: "bg-sky-500", b1: "bg-violet-500", b2: "bg-amber-500", c1: "bg-rose-500",
};

export default function StudentDetailClient({ studentEmail, studentId, progress, answers }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");

  const totalCompleted = progress.length;
  const avgScore = totalCompleted
    ? Math.round(progress.reduce((s, r) => s + r.score, 0) / totalCompleted)
    : null;
  const bestScore = totalCompleted ? Math.max(...progress.map((r) => r.score)) : null;
  const topicsMastered = (() => {
    const best: Record<string, number> = {};
    for (const r of progress) {
      const k = `${r.category}:${r.level}:${r.slug}`;
      best[k] = Math.max(best[k] ?? 0, r.score);
    }
    return Object.values(best).filter((s) => s >= 80).length;
  })();

  const answersByProgress = answers.reduce<Record<string, AnswerRow[]>>((acc, a) => {
    (acc[a.progressId] ??= []).push(a);
    return acc;
  }, {});

  const filtered = progress.filter((r) => {
    if (filterCategory !== "all" && r.category !== filterCategory) return false;
    if (filterLevel !== "all" && r.level !== filterLevel) return false;
    return true;
  });

  const categories = Array.from(new Set(progress.map((r) => r.category)));
  const levels = Array.from(new Set(progress.map((r) => r.level).filter(Boolean))) as string[];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <Link href="/teacher" className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-slate-600 transition">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Teacher Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-base font-black text-violet-600">
              {studentEmail.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">{studentEmail}</h1>
              <p className="text-sm text-slate-500">{totalCompleted} exercises completed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Completed", value: totalCompleted },
            { label: "Avg Score", value: avgScore !== null ? `${avgScore}%` : "—" },
            { label: "Best Score", value: bestScore !== null ? `${bestScore}%` : "—" },
            { label: "Mastered", value: topicsMastered },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm text-center">
              <p className={`text-2xl font-black ${stat.label === "Avg Score" ? scoreColor(avgScore ?? 0) : "text-slate-800"}`}>
                {stat.value}
              </p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400">
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400">
            <option value="all">All levels</option>
            {levels.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>
          <span className="ml-auto self-center text-sm text-slate-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Progress list */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-white border border-slate-100 p-12 text-center text-sm text-slate-400 shadow-sm">
            No exercises completed yet.
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((row) => {
              const rowAnswers = answersByProgress[row.id] ?? [];
              const isExpanded = expandedId === row.id;
              const href = `/${row.category}${row.level ? `/${row.level}` : ""}/${row.slug}`;

              return (
                <div key={row.id} className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-4">
                    {/* Level badge */}
                    {row.level && (
                      <span className={`hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[10px] font-black text-white ${LEVEL_BADGE[row.level] ?? "bg-slate-400"}`}>
                        {row.level.toUpperCase()}
                      </span>
                    )}
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-semibold text-slate-800">
                        {slugToTitle(row.slug)}
                        {row.exerciseNo && <span className="text-slate-400"> · Ex. {row.exerciseNo}</span>}
                      </p>
                      <p className="text-xs text-slate-400">
                        {row.category} · {timeAgo(row.completedAt)}
                        {row.questionsTotal && ` · ${row.questionsTotal} questions`}
                      </p>
                    </div>
                    {/* Score */}
                    <span className={`rounded-xl border px-3 py-1 text-sm font-black ${scoreBg(row.score)}`}>
                      {row.score}%
                    </span>
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <a href={href} target="_blank" rel="noopener noreferrer"
                        className="hidden sm:flex rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition">
                        Open
                      </a>
                      {rowAnswers.length > 0 && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : row.id)}
                          className="rounded-lg border border-violet-200 bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600 hover:bg-violet-100 transition"
                        >
                          {isExpanded ? "Hide" : "Details"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Detailed answers */}
                  {isExpanded && rowAnswers.length > 0 && (
                    <div className="border-t border-slate-50 px-5 py-4">
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        Answers ({rowAnswers.filter((a) => a.isCorrect).length}/{rowAnswers.length} correct)
                      </p>
                      <div className="space-y-2">
                        {rowAnswers.map((a) => (
                          <div key={a.questionIndex} className={`flex items-start gap-3 rounded-xl px-4 py-3 ${a.isCorrect ? "bg-emerald-50" : "bg-red-50"}`}>
                            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white ${a.isCorrect ? "bg-emerald-500" : "bg-red-400"}`}>
                              {a.isCorrect ? "✓" : "✗"}
                            </span>
                            <div className="flex-1 min-w-0">
                              {a.questionText && (
                                <p className="text-sm font-semibold text-slate-700 mb-1">{a.questionText}</p>
                              )}
                              <div className="flex flex-wrap gap-3 text-xs">
                                {a.userAnswer && (
                                  <span className={`font-semibold ${a.isCorrect ? "text-emerald-700" : "text-red-600"}`}>
                                    Student: {a.userAnswer}
                                  </span>
                                )}
                                {!a.isCorrect && a.correctAnswer && (
                                  <span className="text-emerald-700 font-semibold">
                                    Correct: {a.correctAnswer}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
