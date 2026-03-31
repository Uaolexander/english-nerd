export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#050505] px-6 text-white">

      <div className="flex flex-col items-center text-center">
        <video
          src="/404.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-64 rounded-3xl md:w-80"
        />

        <h1 className="mt-6 text-5xl font-black md:text-7xl">404</h1>
        <p className="mt-3 text-base text-white/45 md:text-lg">
          This page doesn&apos;t exist or was moved.
        </p>

        <a
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-7 py-3.5 text-sm font-black text-black transition hover:opacity-90"
        >
          ← Back to Home
        </a>
      </div>

      {/* Quick navigation */}
      <div className="mt-14 w-full max-w-xl">
        <p className="mb-4 text-center text-xs font-bold uppercase tracking-widest text-white/25">
          Maybe you were looking for
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: "Grammar A1", href: "/grammar/a1", badge: "A1" },
            { label: "Grammar B1", href: "/grammar/b1", badge: "B1" },
            { label: "Grammar C1", href: "/grammar/c1", badge: "C1" },
            { label: "Grammar Test", href: "/tests/grammar", badge: "Test" },
            { label: "Tenses Test", href: "/tests/tenses", badge: "Test" },
            { label: "All Tenses", href: "/tenses", badge: "Tenses" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center justify-between gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/70 transition hover:border-[#F5DA20]/30 hover:bg-white/[0.06] hover:text-white"
            >
              <span>{item.label}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-black text-[#F5DA20]">
                {item.badge}
              </span>
            </a>
          ))}
        </div>
      </div>

    </main>
  );
}
