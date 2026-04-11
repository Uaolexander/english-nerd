"use client";

import { useState } from "react";
import type { WidgetData } from "@/lib/widgetData";

const LEVEL_COLOR: Record<string, string> = {
  A1: "bg-emerald-100 text-emerald-700",
  A2: "bg-amber-100 text-amber-700",
  B1: "bg-violet-100 text-violet-700",
  B2: "bg-blue-100 text-blue-700",
  C1: "bg-rose-100 text-rose-700",
};

function EmbedCodeBox({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const code = `<iframe\n  src="https://englishnerd.cc/widget/${slug}"\n  width="380"\n  height="480"\n  style="border:none;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.10);"\n  title="English Grammar Quiz"\n  loading="lazy"\n></iframe>`;

  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-4">
      <pre className="rounded-xl bg-slate-900 text-slate-100 text-xs p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap break-all">
        {code}
      </pre>
      <button
        onClick={copy}
        className="mt-2 w-full rounded-xl py-2.5 text-sm font-black text-white transition"
        style={{ background: copied ? "#10b981" : "#6366f1" }}
      >
        {copied ? "✓ Copied!" : "Copy embed code"}
      </button>
    </div>
  );
}

export default function WidgetGalleryClient({ widgets }: { widgets: WidgetData[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-bold text-violet-700 mb-5">
          Free Embeddable Widgets
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4">
          Add grammar quizzes<br />to your website
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto">
          Copy one line of code and embed an interactive English grammar quiz on your blog, school website, or Notion page — completely free.
        </p>
      </div>

      {/* Widget cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {widgets.map((w) => (
          <div
            key={w.slug}
            className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
          >
            {/* Preview iframe */}
            <div className="relative bg-slate-50 border-b border-slate-100" style={{ height: 280 }}>
              {preview === w.slug ? (
                <iframe
                  src={`/widget/${w.slug}`}
                  className="w-full h-full border-none"
                  title={w.title}
                />
              ) : (
                <button
                  onClick={() => setPreview(w.slug)}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 hover:bg-slate-100 transition"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                    style={{ background: w.color }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-600">Preview quiz</span>
                </button>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-slate-900 text-sm">{w.title}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLOR[w.level] ?? "bg-slate-100 text-slate-600"}`}>
                  {w.level}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">{w.questions.length} questions</p>

              <button
                onClick={() => setSelected(selected === w.slug ? null : w.slug)}
                className="w-full rounded-xl border border-slate-200 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                {selected === w.slug ? "Hide code ▲" : "Get embed code ▼"}
              </button>

              {selected === w.slug && <EmbedCodeBox slug={w.slug} />}
            </div>
          </div>
        ))}
      </div>

      {/* How to use */}
      <div className="mt-16 rounded-2xl bg-slate-50 border border-slate-200 p-8">
        <h2 className="text-xl font-black text-slate-900 mb-6">How to embed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Choose a topic", desc: "Pick the grammar topic that matches your lesson or blog post." },
            { step: "2", title: "Copy the code", desc: "Click \"Get embed code\" and copy the one-line iframe snippet." },
            { step: "3", title: "Paste anywhere", desc: "Works on any website, WordPress, Notion, Webflow, or HTML page." },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white font-black text-sm">
                {item.step}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-400">
          Want the full lesson?{" "}
          <a href="/grammar" className="text-violet-600 font-bold hover:underline">Browse all grammar topics →</a>
        </p>
      </div>
    </div>
  );
}
