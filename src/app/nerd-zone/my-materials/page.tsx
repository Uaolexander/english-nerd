import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import MaterialsClient from "./MaterialsClient";

export const metadata: Metadata = {
  title: "My Materials — Nerd Zone — English Nerd",
  description: "PDF materials for learning English — speaking games, grammar guides, irregular verbs and more, curated by Oleksandr.",
  alternates: { canonical: "/nerd-zone/my-materials" },
};

export default async function MyMaterialsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-[#FAFAFA]">

      {/* Hero band */}
      <div className="bg-white border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400">
            {[["Home", "/"], ["Nerd Zone", "/nerd-zone"]].map(([label, href]) => (
              <span key={href} className="flex items-center gap-1.5">
                <a href={href} className="hover:text-slate-700 transition">{label}</a>
                <svg className="h-3 w-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </span>
            ))}
            <span className="text-slate-700 font-medium">My Materials</span>
          </nav>

          {/* Title */}
          <div className="mt-5">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">PDF</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              My{" "}
              <span className="relative inline-block">
                Materials
                <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/70" />
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-[15px] text-slate-500 leading-relaxed">
              Handpicked PDF resources — games, grammar guides and speaking activities. All yours to download and use.
            </p>
          </div>

        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-6 py-8">

        <MaterialsClient isLoggedIn={!!user} />

        {/* Bottom nav */}
        <div className="mt-10 border-t border-slate-100 pt-6">
          <a
            href="/nerd-zone"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Back to Nerd Zone
          </a>
        </div>

      </div>
    </main>
  );
}
