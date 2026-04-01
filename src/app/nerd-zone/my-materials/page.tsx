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
    <main className="relative min-h-screen bg-[#0E0F13] text-white">

      {/* Background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[#F5DA20]/6 blur-[180px]" />
        <div className="absolute top-1/2 -right-40 h-[400px] w-[400px] rounded-full bg-violet-500/4 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12">

        {/* Breadcrumb */}
        <nav className="text-sm text-white/50">
          <a href="/" className="hover:text-white/80 transition">Home</a>
          <span className="mx-2 text-white/25">/</span>
          <a href="/nerd-zone" className="hover:text-white/80 transition">Nerd Zone</a>
          <span className="mx-2 text-white/25">/</span>
          <span className="text-white/75">My Materials</span>
        </nav>

        {/* Hero */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="rounded-full border border-white/15 px-3 py-0.5 text-[11px] font-semibold text-white/40">PDF</span>
            <span className="rounded-full border border-white/15 px-3 py-0.5 text-[11px] font-semibold text-white/40">5 materials</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            My{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#F5DA20]">Materials</span>
              <span aria-hidden className="pointer-events-none absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#F5DA20]/30" />
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/50">
            Handpicked PDF resources — games, grammar guides and speaking activities. All yours to download and use.
          </p>
        </div>

        <MaterialsClient isLoggedIn={!!user} />

        {/* Bottom nav */}
        <div className="mt-10 border-t border-white/8 pt-6">
          <a
            href="/nerd-zone"
            className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/50 hover:bg-white/10 hover:text-white transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
            Back to Nerd Zone
          </a>
        </div>

      </div>
    </main>
  );
}
