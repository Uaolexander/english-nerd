export const metadata = {
  title: "About — English Nerd",
  description: "English Nerd is a free English learning platform with grammar lessons, vocabulary tests, and exercises for all levels from A1 to C1.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0D] text-white">

      {/* Background glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#F5DA20]/5 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-16">

        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-white/40">
          <a href="/" className="hover:text-white transition">Home</a>
          <span className="mx-2 text-white/20">/</span>
          <span className="text-white/70">About</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">About us</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Built for learners.<br />
            <span className="text-[#F5DA20]">Free forever.</span>
          </h1>
          <div className="mt-6 h-px bg-white/8" />
        </div>

        {/* Mission */}
        <div className="space-y-8 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-xl font-black text-white mb-3">What is English Nerd?</h2>
            <p>
              English Nerd is a free online platform for learning English grammar and vocabulary. We provide clear grammar lessons, graded exercises with instant feedback, vocabulary tests, and tense references — all in one place, for every level from <strong className="text-white">A1 (Beginner)</strong> to <strong className="text-white">C1 (Advanced)</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">Why we built it</h2>
            <p>
              Good grammar resources are often scattered across dozens of sites, cluttered with ads, or locked behind paywalls. We wanted to create something different — a clean, fast, focused learning experience that works on any device and costs nothing.
            </p>
            <p className="mt-3">
              Every lesson is written to be concise and practical. Exercises are graded from easy to harder so you can build confidence step by step.
            </p>
          </section>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 my-8">
            {[
              { value: "100+", label: "Grammar lessons" },
              { value: "A1 → C1", label: "All levels" },
              { value: "Free", label: "Always" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-center">
                <div className="text-2xl font-black text-[#F5DA20]">{s.value}</div>
                <div className="mt-1 text-xs text-white/40">{s.label}</div>
              </div>
            ))}
          </div>

          <section>
            <h2 className="text-xl font-black text-white mb-3">What we offer</h2>
            <div className="space-y-3">
              {[
                { icon: "📝", title: "Grammar lessons", desc: "From verb to be at A1 to advanced inversion at C1 — every topic explained clearly with exercises." },
                { icon: "📚", title: "Vocabulary tests", desc: "Estimate your vocabulary size with our adaptive word recognition test." },
                { icon: "✅", title: "Placement test", desc: "Find your level in 15 minutes with our 60-question grammar placement test." },
                { icon: "⏱", title: "Tenses reference", desc: "A full guide to all 12 English tenses with structure tables and examples." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div>
                    <div className="font-black text-white text-sm">{item.title}</div>
                    <div className="mt-0.5 text-sm text-white/50">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-white mb-3">Contact</h2>
            <p>
              Have a question, spotted an error, or want to get in touch? We&apos;d love to hear from you.
            </p>
            <a
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition"
            >
              Get in touch →
            </a>
          </section>

        </div>
      </div>
    </main>
  );
}
