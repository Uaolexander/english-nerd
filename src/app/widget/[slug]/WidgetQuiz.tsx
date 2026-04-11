"use client";

import { useState } from "react";
import type { WidgetData } from "@/lib/widgetData";

export default function WidgetQuiz({ widget }: { widget: WidgetData }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = widget.questions[current];
  const total = widget.questions.length;
  const isCorrect = selected === q.answer;

  function pick(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answer) setScore((s) => s + 1);
  }

  function next() {
    if (current + 1 >= total) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }

  const accent = widget.color;

  if (done) {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[99999] gap-5 px-6 text-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-white text-2xl font-black"
          style={{ background: accent }}
        >
          {pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "📚"}
        </div>
        <div>
          <p className="text-2xl font-black text-slate-900">{score}/{total} correct</p>
          <p className="text-sm text-slate-500 mt-1">{pct >= 80 ? "Excellent work!" : pct >= 60 ? "Good effort!" : "Keep practising!"}</p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <a
            href={`https://englishnerd.cc${widget.lessonUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-xl py-3 text-sm font-black text-white text-center transition hover:opacity-90"
            style={{ background: accent }}
          >
            Full lesson on English Nerd →
          </a>
          <button
            onClick={restart}
            className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-white z-[99999]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-black px-2 py-0.5 rounded-full text-white"
            style={{ background: accent }}
          >
            {widget.level}
          </span>
          <span className="text-sm font-bold text-slate-700 truncate max-w-[180px]">{widget.title}</span>
        </div>
        <span className="text-xs text-slate-400 font-medium shrink-0">{current + 1}/{total}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-slate-100">
        <div
          className="h-1 transition-all duration-300"
          style={{ width: `${((current) / total) * 100}%`, background: accent }}
        />
      </div>

      {/* Question */}
      <div className="flex-1 px-5 py-5 flex flex-col gap-4">
        <p className="text-base font-bold text-slate-900 leading-snug">{q.q}</p>

        <div className="flex flex-col gap-2">
          {q.options.map((opt, i) => {
            let cls = "w-full rounded-xl border px-4 py-2.5 text-sm font-semibold text-left transition ";
            if (selected === null) {
              cls += "border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50";
            } else if (i === q.answer) {
              cls += "border-emerald-500 bg-emerald-50 text-emerald-700";
            } else if (i === selected) {
              cls += "border-red-400 bg-red-50 text-red-700";
            } else {
              cls += "border-slate-100 text-slate-400";
            }
            return (
              <button key={i} className={cls} onClick={() => pick(i)}>
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {isCorrect ? "✓ Correct!" : `✗ Correct answer: ${q.options[q.answer]}`}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 flex items-center justify-between gap-3">
        <a
          href={`https://englishnerd.cc${widget.lessonUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-400 hover:text-slate-600 transition font-medium"
        >
          englishnerd.cc
        </a>
        {selected !== null && (
          <button
            onClick={next}
            className="rounded-xl px-5 py-2.5 text-sm font-black text-white transition hover:opacity-90"
            style={{ background: accent }}
          >
            {current + 1 >= total ? "See results →" : "Next →"}
          </button>
        )}
      </div>
    </div>
  );
}
