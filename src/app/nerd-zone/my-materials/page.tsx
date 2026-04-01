import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Materials — Nerd Zone — English Nerd",
  description: "PDFs, books and exclusive study resources curated by Oleksandr Vdovychenko.",
  alternates: { canonical: "/nerd-zone/my-materials" },
};

export default function MyMaterialsPage() {
  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#F5DA20]/5 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16">
        <div className="text-sm text-white/50">
          <a href="/" className="hover:text-white/80 transition">Home</a>
          <span className="mx-2 text-white/25">/</span>
          <a href="/nerd-zone" className="hover:text-white/80 transition">Nerd Zone</a>
          <span className="mx-2 text-white/25">/</span>
          <span className="text-white/75">My Materials</span>
        </div>

        <div className="mt-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F5DA20]/15 border border-[#F5DA20]/25 text-4xl">
            📦
          </div>
          <h1 className="text-4xl font-black tracking-tight">My Materials</h1>
          <p className="mt-4 text-white/50 leading-relaxed max-w-md mx-auto">
            PDFs, books and exclusive study resources curated by Oleksandr. This section is coming soon.
          </p>
          <div className="mt-8">
            <a
              href="/nerd-zone"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/60 hover:border-white/30 hover:text-white transition"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M5 12l7-7M5 12l7 7"/></svg>
              Back to Nerd Zone
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
