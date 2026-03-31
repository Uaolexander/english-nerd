export const metadata = {
  title: "Contact — English Nerd",
  description: "Get in touch with the English Nerd team. Report errors, ask questions, or send feedback.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0D] text-white">

      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#F5DA20]/5 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-6 py-16">

        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-white/40">
          <a href="/" className="hover:text-white transition">Home</a>
          <span className="mx-2 text-white/20">/</span>
          <span className="text-white/70">Contact</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Contact</div>
          <h1 className="text-4xl font-black tracking-tight">Get in touch</h1>
          <p className="mt-3 text-white/50">
            Spotted a mistake? Have a suggestion? Just want to say hi? We read every message.
          </p>
          <div className="mt-6 h-px bg-white/8" />
        </div>

        {/* Contact options */}
        <div className="space-y-4 mb-12">
          <a
            href="mailto:hello@englishnerd.cc"
            className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-[#F5DA20]/30 hover:bg-white/[0.06] group"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F5DA20]/10 border border-[#F5DA20]/15 text-xl">
              ✉️
            </div>
            <div>
              <div className="font-black text-white text-sm">Email us</div>
              <div className="mt-0.5 text-sm text-[#F5DA20]">hello@englishnerd.cc</div>
            </div>
          </a>
        </div>

        {/* What to write about */}
        <div>
          <h2 className="text-lg font-black text-white mb-4">What can you write about?</h2>
          <div className="space-y-3">
            {[
              { icon: "🐛", title: "Report an error", desc: "Found a wrong answer, typo, or broken exercise? Let us know." },
              { icon: "💡", title: "Suggest a topic", desc: "Missing a grammar topic you need? We add new content regularly." },
              { icon: "🤝", title: "Partnerships", desc: "Interested in collaborating or advertising? Get in touch." },
              { icon: "💬", title: "General feedback", desc: "Anything else — we appreciate hearing from learners." },
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
        </div>

        <div className="mt-12 rounded-2xl border border-white/8 bg-white/[0.03] p-6 text-center">
          <div className="text-sm text-white/40">We typically respond within <strong className="text-white/70">1–3 business days</strong>.</div>
        </div>

      </div>
    </main>
  );
}
