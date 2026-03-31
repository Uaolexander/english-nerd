import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Irregular Verbs — Nerd Zone — English Nerd",
  description:
    "44 essential irregular verb forms. Know these and you'll handle almost any English text.",
  alternates: { canonical: "/nerd-zone/irregular-verbs" },
};

const VERBS: [string, string, string][] = [
  ["be", "was / were", "been"],
  ["break", "broke", "broken"],
  ["bring", "brought", "brought"],
  ["build", "built", "built"],
  ["buy", "bought", "bought"],
  ["catch", "caught", "caught"],
  ["choose", "chose", "chosen"],
  ["come", "came", "come"],
  ["do", "did", "done"],
  ["drive", "drove", "driven"],
  ["eat", "ate", "eaten"],
  ["fall", "fell", "fallen"],
  ["feel", "felt", "felt"],
  ["find", "found", "found"],
  ["fly", "flew", "flown"],
  ["forget", "forgot", "forgotten"],
  ["get", "got", "got"],
  ["give", "gave", "given"],
  ["go", "went", "gone"],
  ["grow", "grew", "grown"],
  ["have", "had", "had"],
  ["hear", "heard", "heard"],
  ["know", "knew", "known"],
  ["leave", "left", "left"],
  ["lose", "lost", "lost"],
  ["make", "made", "made"],
  ["mean", "meant", "meant"],
  ["meet", "met", "met"],
  ["pay", "paid", "paid"],
  ["put", "put", "put"],
  ["read", "read", "read"],
  ["run", "ran", "run"],
  ["say", "said", "said"],
  ["see", "saw", "seen"],
  ["send", "sent", "sent"],
  ["sleep", "slept", "slept"],
  ["speak", "spoke", "spoken"],
  ["spend", "spent", "spent"],
  ["take", "took", "taken"],
  ["tell", "told", "told"],
  ["think", "thought", "thought"],
  ["understand", "understood", "understood"],
  ["win", "won", "won"],
  ["write", "wrote", "written"],
];

export default function IrregularVerbsPage() {
  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white">
      {/* Background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#F5DA20]/6 blur-[150px]" />
        <div className="absolute top-1/3 -left-32 h-[400px] w-[400px] rounded-full bg-[#F5DA20]/4 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-[400px] w-[400px] rounded-full bg-amber-500/4 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="text-sm text-white/40">
          <a href="/" className="transition hover:text-white">Home</a>
          <span className="mx-2 text-white/20">/</span>
          <a href="/nerd-zone" className="transition hover:text-white">Nerd Zone</a>
          <span className="mx-2 text-white/20">/</span>
          <span className="text-white/70">Irregular Verbs</span>
        </div>

        {/* Hero */}
        <div className="mt-6">
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            <span className="relative inline-block">
              <span className="relative z-10 text-[#F5DA20]">Irregular</span>
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#F5DA20]/30"
              />
            </span>{" "}
            Verbs
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/45">
            44 essential verb forms. Know these and you&apos;ll handle almost any text.
          </p>
        </div>

        {/* Table */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8 bg-white/[0.03]">
                <th className="px-5 py-3.5 text-left text-[10px] font-black uppercase tracking-widest text-white/40">
                  Base form
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] font-black uppercase tracking-widest text-white/40">
                  Past Simple
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] font-black uppercase tracking-widest text-white/40">
                  Past Participle
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {VERBS.map(([base, past, participle], i) => (
                <tr
                  key={base}
                  className={`transition hover:bg-white/[0.03] ${
                    i % 2 === 1 ? "bg-white/[0.015]" : ""
                  }`}
                >
                  <td className="px-5 py-3 font-black text-white">{base}</td>
                  <td className="px-5 py-3 font-mono text-emerald-300/90">{past}</td>
                  <td className="px-5 py-3 font-mono text-sky-300/90">{participle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
