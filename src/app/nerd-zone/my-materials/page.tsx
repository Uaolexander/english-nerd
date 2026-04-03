import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import MaterialsClient from "./MaterialsClient";

export const metadata: Metadata = {
  title: "My Materials — Nerd Zone — English Nerd",
  description: "PDF materials for learning English — speaking games, grammar guides, irregular verbs and more, curated by Oleksandr.",
  alternates: { canonical: "/nerd-zone/my-materials" },
};

export default async function MyMaterialsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">

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

      {/* Hero */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="rounded-full bg-[#F5DA20] px-3 py-0.5 text-[11px] font-black text-black">PDF</span>
          <span className="rounded-full border border-slate-200 px-3 py-0.5 text-[11px] font-semibold text-slate-400">Download & print</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.05] md:text-6xl">
          My{" "}
          <span className="relative inline-block">
            Materials
            <span aria-hidden className="absolute -bottom-1 left-0 h-[5px] w-full rounded-full bg-[#F5DA20]/60" />
          </span>
        </h1>
        <p className="mt-3 max-w-xl text-[15px] text-slate-500 leading-relaxed">
          Handpicked PDF resources — speaking games, grammar guides and classroom activities.
          Free to download for registered users.
        </p>
      </div>

      {/* How-to steps */}
      <div className="mt-6 flex flex-wrap gap-3">
        {[
          { n: "1", label: "Pick a material", sub: "browse the collection below" },
          { n: "2", label: "Click to download", sub: "PDF opens instantly" },
          { n: "3", label: "Print or use digitally", sub: "ready to use straight away" },
        ].map(({ n, label, sub }) => (
          <div key={n} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#F5DA20] text-xs font-black text-black shadow-sm">{n}</div>
            <div>
              <div className="text-sm font-bold text-slate-800">{label}</div>
              <div className="text-xs text-slate-400">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Cards */}
      <MaterialsClient isLoggedIn={!!user} isPro={isPro} />

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
  );
}
