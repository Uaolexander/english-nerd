import type { Metadata } from "next";
import ImageWithFallback from "@/components/ImageWithFallback";

export const metadata: Metadata = {
  title: "About — English Nerd",
  description: "English Nerd was created by Oleksandr Vdovychenko, an English teacher with 8+ years of experience who has lived across Europe and North America.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0D] text-white">

      {/* Background glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#F5DA20]/5 blur-[140px]" />
        <div className="absolute top-1/2 -right-40 h-[400px] w-[400px] rounded-full bg-[#F5DA20]/4 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-16">

        {/* Breadcrumb */}
        <div className="mb-10 text-sm text-white/40">
          <a href="/" className="hover:text-white transition">Home</a>
          <span className="mx-2 text-white/35">/</span>
          <span className="text-white/70">About</span>
        </div>

        {/* Hero — photo + name */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-10 mb-14">
          <div className="shrink-0">
            <div className="relative h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-3xl border-2 border-[#F5DA20]/25 shadow-2xl shadow-black/40">
              <ImageWithFallback
                src="/oleksandr.JPG"
                alt="Oleksandr Vdovychenko"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">The person behind English Nerd</p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Oleksandr<br />
              <span className="text-[#F5DA20]">Vdovychenko</span>
            </h1>
            <p className="mt-3 text-white/50 text-sm leading-relaxed">
              English teacher · 8+ years · 27 y.o. · Polyglot · Traveller
            </p>
            <a
              href="https://www.instagram.com/alexvdovych?igsh=N2RqYjlyNnhucDV3&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/50 hover:text-white hover:border-white/20 transition"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
              @alexvdovych
            </a>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-10 text-white/65 leading-relaxed">

          <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 sm:p-8">
            <h2 className="text-lg font-black text-white mb-4">Hi, I am Oleksandr</h2>
            <div className="space-y-4 text-sm sm:text-base">
              <p>
                I have been teaching English for over eight years, and honestly, I love it just as much today as I did on day one. English is my third language, and it started as a hobby long before it became a profession. I speak five languages in total, and languages have always been my real passion. Something about the way they open doors, connect people, and change the way you think has had me hooked for as long as I can remember.
              </p>
              <p>
                I love travelling, meeting new people, and trying new things. Over the years I have lived in 7 countries and visited 18 in total. That is about 9% of the world, so there is still plenty left to explore. Each place taught me something different about how people actually use language in real life, not the textbook version, but the version that flows naturally in a busy cafe or a market conversation.
              </p>
              <p>
                That experience shaped the way I teach. I help people learn English the way I learned languages myself: with genuine curiosity, with pleasure, and with love for the process. There is no shortcut, but there is a way to make it enjoyable, and that is what I try to bring to every lesson.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-4">Why I built this site</h2>
            <div className="space-y-4 text-sm sm:text-base">
              <p>
                One of my other hobbies is IT. At some point I realised I could bring my two passions together: teaching and building things. So I made this website myself, from scratch, with my own hands.
              </p>
              <p>
                I made it for you. So you can learn English and love it the same way I do. Language learning does not have to feel like a chore. It can be something you genuinely enjoy, and I hope this site helps you get there.
              </p>
              <p className="text-white/80 font-semibold">
                I hope you use it to the fullest.
              </p>
            </div>
          </section>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "8+", label: "Years teaching" },
              { value: "5", label: "Languages" },
              { value: "18", label: "Countries visited" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-center">
                <div className="text-2xl font-black text-[#F5DA20]">{s.value}</div>
                <div className="mt-1 text-xs text-white/40">{s.label}</div>
              </div>
            ))}
          </div>

          {/* What the site offers */}
          <section>
            <h2 className="text-lg font-black text-white mb-4">What you will find here</h2>
            <div className="space-y-3">
              {[
                { icon: "📝", title: "Grammar lessons", desc: "From the basics at A1 to advanced structures at C1, explained the way a teacher would." },
                { icon: "📚", title: "Vocabulary exercises", desc: "Topic-based exercises for every level, because words matter as much as grammar." },
                { icon: "✅", title: "Placement tests", desc: "Find your level in minutes. Grammar, vocabulary, tenses." },
                { icon: "🎧", title: "Listening practice", desc: "Real audio, real comprehension questions. Train your ear at the right level." },
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

          {/* CTA */}
          <section className="flex flex-col sm:flex-row gap-3">
            <a
              href="/tests/grammar"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black hover:opacity-90 transition"
            >
              Take the placement test
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/70 hover:border-white/30 hover:text-white transition"
            >
              Get in touch
            </a>
          </section>

        </div>
      </div>
    </main>
  );
}
