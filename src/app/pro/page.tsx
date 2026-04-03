import type { Metadata } from "next";
import Image from "next/image";
import PromoCodeModal from "@/components/PromoCodeModal";

export const metadata: Metadata = {
  title: "English Nerd PRO — Unlock All Features & Learn Faster",
  description:
    "Go PRO and unlock SpeedRound games, printable PDF worksheets, certificates, exclusive exercises, and an ad-free experience. The smartest investment in your English.",
  alternates: { canonical: "/pro" },
  openGraph: {
    title: "English Nerd PRO — Unlock All Features & Learn Faster",
    description:
      "SpeedRound games, PDF worksheets, certificates, exclusive exercises and no ads — everything you need to level up your English.",
    url: "https://englishnerd.cc/pro",
    type: "website",
  },
};

const proSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "English Nerd PRO",
  description:
    "Premium English learning subscription with SpeedRound games, PDF worksheets, certificates, exclusive exercises, progress tracking, and ad-free experience.",
  brand: { "@type": "Brand", name: "English Nerd" },
  offers: [
    {
      "@type": "Offer",
      name: "Monthly",
      price: "4.99",
      priceCurrency: "USD",
      billingIncrement: "P1M",
      url: "https://englishnerd.cc/pro",
    },
    {
      "@type": "Offer",
      name: "Annual",
      price: "29.99",
      priceCurrency: "USD",
      billingIncrement: "P1Y",
      url: "https://englishnerd.cc/pro",
    },
  ],
};

/* ─── Data ───────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: "⚡",
    title: "SpeedRound Game",
    desc: "A fast-paced 4-option quiz built into every Grammar lesson. 20 questions, live score, instant feedback — train your brain to answer without thinking.",
    tag: "40 lessons",
    image: "/pro/feature-speedround.png",
    imageFallback: "bg-gradient-to-br from-amber-500/20 to-yellow-600/10",
    accent: "text-amber-400",
    border: "border-amber-500/20",
  },
  {
    icon: "📄",
    title: "PDF Worksheets",
    desc: "Download print-ready A4 worksheets for every grammar lesson — 4 graded exercises plus a full answer key. Study offline, print and practice.",
    tag: "40+ PDFs",
    image: "/pro/feature-pdf.png",
    imageFallback: "bg-gradient-to-br from-sky-500/20 to-blue-600/10",
    accent: "text-sky-400",
    border: "border-sky-500/20",
  },
  {
    icon: "🔗",
    title: "Related Topics",
    desc: "Unlock the bonus exercise cards on every Tense page — comparisons, contrasts and advanced drills that connect grammar points together.",
    tag: "13 tenses",
    image: "/pro/feature-related-topics.png",
    imageFallback: "bg-gradient-to-br from-violet-500/20 to-purple-600/10",
    accent: "text-violet-400",
    border: "border-violet-500/20",
  },
  {
    icon: "🎬",
    title: "Watch & Learn",
    desc: "Interactive vocabulary exercises built around real films and TV shows. Fill-in-the-blank, Word Match and Quick-Fire Quiz for The Lion King, Toy Story, Bluey and more.",
    tag: "Growing library",
    image: "/pro/feature-watch-learn.png",
    imageFallback: "bg-gradient-to-br from-emerald-500/20 to-green-600/10",
    accent: "text-emerald-400",
    border: "border-emerald-500/20",
  },
];

const CHECKLIST = [
  { free: true,  pro: true,  label: "All Grammar A1 & A2 lessons (40 topics)" },
  { free: true,  pro: true,  label: "Tenses: quiz, fill-in-blank, sentence builder" },
  { free: true,  pro: true,  label: "Vocabulary tests & placement test" },
  { free: true,  pro: true,  label: "Reading & Listening sections" },
  { free: false, pro: true,  label: "SpeedRound game on every grammar lesson" },
  { free: false, pro: true,  label: "PDF worksheets with answer keys" },
  { free: false, pro: true,  label: "Related Topics exercises on all tenses" },
  { free: false, pro: true,  label: "Watch & Learn interactive exercises" },
  { free: false, pro: true,  label: "Downloadable certificates of completion" },
  { free: false, pro: true,  label: "Progress statistics in your dashboard" },
  { free: false, pro: true,  label: "Ad-free experience" },
  { free: false, pro: true,  label: "PRO crown badge on your profile" },
];

const PRO_LIST = [
  "SpeedRound on all lessons",
  "PDF worksheets + answer keys",
  "Related Topics unlocked",
  "Watch & Learn exercises",
  "Downloadable certificates",
  "Progress statistics",
  "Ad-free · PRO badge",
];

const FAQS = [
  {
    q: "What exactly is English Nerd PRO?",
    a: "PRO unlocks the premium layer of English Nerd — SpeedRound games, printable PDF worksheets, downloadable certificates, exclusive Related Topics exercises, Watch & Learn drills, progress tracking and an ad-free experience. Free content stays free forever.",
  },
  {
    q: "Can I use a promo code instead of paying?",
    a: "Yes! Go to your Account page → Profile tab and enter your promo code. Codes give you 30-day or 365-day PRO access instantly — no payment required.",
  },
  {
    q: "What happens when my PRO ends?",
    a: "Your account stays active and all free content remains accessible. PRO features become locked again until you renew.",
  },
  {
    q: "Is there a student discount?",
    a: "Yes — we have special promo codes for students. Reach out via the contact page and we'll sort you out.",
  },
  {
    q: "How do I cancel?",
    a: "Cancel any time from your Account settings. You keep PRO access until the end of your billing period — no surprise charges.",
  },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ProPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0D] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(proSchema) }}
      />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-28 pt-24 text-center md:pb-36 md:pt-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#F5DA20]/8 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-[300px] w-[400px] rounded-full bg-amber-500/4 blur-[100px]" />

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#F5DA20]/20 bg-[#F5DA20]/10 px-4 py-1.5 text-sm font-black text-[#F5DA20]">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" />
            </svg>
            English Nerd PRO
          </div>

          <h1 className="text-5xl font-black leading-[1.06] tracking-tight md:text-7xl">
            Learn smarter.
            <br />
            <span className="text-[#F5DA20]">Go PRO.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-white/55 leading-relaxed md:text-xl">
            Unlock every game, worksheet, certificate and exercise on English Nerd —
            for less than a coffee per month.
          </p>

          {/* Trust signals */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-white/25">
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-emerald-400/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Cancel any time
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-emerald-400/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Promo codes accepted
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-emerald-400/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Secure payment
            </span>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-8 py-4 text-base font-black text-black shadow-[0_0_40px_rgba(245,218,32,0.3)] transition hover:bg-[#ffe033] hover:shadow-[0_0_60px_rgba(245,218,32,0.45)]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" />
              </svg>
              Get PRO — from $2.50/mo
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-8 py-4 text-base font-semibold text-white/60 transition hover:border-white/20 hover:text-white"
            >
              See what&apos;s included ↓
            </a>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" className="px-6 pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[#F5DA20]/60">What you unlock</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Four ways PRO accelerates you</h2>
            <p className="mt-3 text-white/35 max-w-md mx-auto">Every feature designed to make grammar stick faster and study sessions more effective.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`group overflow-hidden rounded-2xl border bg-white/[0.03] ${f.border} transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50`}
              >
                {/* Screenshot area */}
                <div className={`relative h-52 w-full overflow-hidden ${f.imageFallback}`}>
                  <Image
                    src={f.image}
                    alt={`${f.title} — English Nerd PRO feature screenshot`}
                    fill
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                  />
                  {/* Gradient fade at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0B0B0D]/80 to-transparent" />
                  {/* Tag */}
                  <span className={`absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-sm ${f.accent}`}>
                    {f.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">{f.icon}</span>
                    <h3 className="text-lg font-black text-white">{f.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-white/50">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Extra PRO perks strip */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: "🏆", title: "Certificates", desc: "Download proof of completion for every course you finish." },
              { icon: "📊", title: "Progress stats", desc: "Track your streaks, scores and progress in your personal dashboard." },
              { icon: "🚫", title: "No ads", desc: "Study without distractions — a fully clean, ad-free experience." },
            ].map((p) => (
              <div key={p.title} className="flex gap-4 rounded-2xl border border-white/6 bg-white/[0.03] p-5">
                <span className="mt-0.5 shrink-0 text-2xl">{p.icon}</span>
                <div>
                  <div className="font-black text-white text-sm">{p.title}</div>
                  <div className="mt-1 text-xs text-white/40 leading-relaxed">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ─────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[#F5DA20]/60">Free vs PRO</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Everything, side by side</h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-white/8 px-6 py-4">
              <div className="text-xs font-black uppercase tracking-widest text-white/25">Feature</div>
              <div className="text-center text-xs font-black uppercase tracking-widest text-white/25">Free</div>
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F5DA20] px-3 py-0.5 text-xs font-black text-black">
                  <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z"/></svg>
                  PRO
                </span>
              </div>
            </div>

            {CHECKLIST.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 items-center px-6 py-3.5 transition ${
                  !row.free && row.pro
                    ? "bg-[#F5DA20]/[0.04]"
                    : i % 2 === 0
                    ? "bg-white/[0.015]"
                    : ""
                }`}
              >
                <span className={`text-sm ${!row.free && row.pro ? "font-semibold text-white" : "text-white/50"}`}>
                  {row.label}
                </span>
                <div className="flex justify-center">
                  {row.free ? (
                    <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <svg className="h-4 w-4 text-white/15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  )}
                </div>
                <div className="flex justify-center">
                  {row.pro ? (
                    <svg className="h-5 w-5 text-[#F5DA20]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <svg className="h-4 w-4 text-white/15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="px-6 pb-28">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[#F5DA20]/60">Simple pricing</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">One plan. Everything included.</h2>
            <p className="mt-3 text-white/35">Choose monthly or save 50% with annual. Cancel any time.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Monthly */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-8">
              <div className="mb-6">
                <div className="text-sm font-black uppercase tracking-widest text-white/35">Monthly</div>
                <div className="mt-3 flex items-end gap-1.5">
                  <span className="text-5xl font-black text-white">$4.99</span>
                  <span className="mb-2 text-sm text-white/30">/ month</span>
                </div>
                <p className="mt-2 text-sm text-white/25">Billed monthly · Cancel any time</p>
              </div>

              <ul className="mb-8 space-y-3">
                {PRO_LIST.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-white/55">
                    <svg className="h-4 w-4 shrink-0 text-[#F5DA20]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="/account"
                className="block w-full rounded-xl border border-white/12 bg-white/6 py-3.5 text-center text-sm font-black text-white transition hover:bg-white/10"
              >
                Get Monthly
              </a>
            </div>

            {/* Annual — Most Popular */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#F5DA20]/50 bg-gradient-to-br from-[#F5DA20]/10 to-amber-600/5 p-8 shadow-[0_0_60px_rgba(245,218,32,0.14)]">
              {/* Most Popular badge */}
              <div className="absolute -right-8 top-5 rotate-45 bg-[#F5DA20] px-10 py-0.5 text-[10px] font-black text-black tracking-widest uppercase shadow-lg">
                Most Popular
              </div>

              <div className="mb-6">
                <div className="text-sm font-black uppercase tracking-widest text-[#F5DA20]/70">Annual</div>

                {/* Crossed-out original price */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-base font-semibold text-white/25 line-through">$4.99/mo</span>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-black text-emerald-400">Save 50%</span>
                </div>

                {/* Big price */}
                <div className="mt-1 flex items-end gap-1.5">
                  <span className="text-5xl font-black text-white">$2.50</span>
                  <span className="mb-2 text-sm text-white/40">/ month</span>
                </div>

                <p className="mt-1.5 text-sm text-white/35">
                  That&apos;s just <span className="font-black text-white/70">$29.99</span> billed annually
                </p>
              </div>

              <ul className="mb-8 space-y-3">
                {PRO_LIST.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-white/80">
                    <svg className="h-4 w-4 shrink-0 text-[#F5DA20]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="/account"
                className="block w-full rounded-xl bg-[#F5DA20] py-3.5 text-center text-sm font-black text-black shadow-[0_4px_24px_rgba(245,218,32,0.28)] transition hover:bg-[#ffe033] hover:shadow-[0_4px_36px_rgba(245,218,32,0.45)]"
              >
                Get Annual — Best Deal
              </a>

              {/* Guarantee note */}
              <p className="mt-3 text-center text-xs text-white/25">
                🛡️ 7-day money-back guarantee
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <PromoCodeModal />
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/6 px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[#F5DA20]/60">FAQ</p>
            <h2 className="mt-2 text-3xl font-black">Common questions</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-white/8 bg-white/[0.03] px-6 py-5">
                <h3 className="mb-2 font-black text-white">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-white/40">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="px-6 pb-28">
        <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#F5DA20]/20 bg-gradient-to-br from-[#F5DA20]/10 to-transparent px-8 py-16 text-center shadow-[0_0_100px_rgba(245,218,32,0.07)]">
          <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-72 -translate-x-1/2 rounded-full bg-[#F5DA20]/12 blur-[70px]" />

          <div className="relative">
            <div className="mb-5 text-5xl">👑</div>
            <h2 className="text-3xl font-black leading-tight md:text-4xl">
              Ready to be a{" "}
              <span className="text-[#F5DA20]">real Nerd?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-white/40 leading-relaxed">
              Games, worksheets, certificates, exclusive exercises — all for less than a cup of coffee per month.
            </p>

            {/* Mini price reminder */}
            <div className="mx-auto mt-6 flex w-fit items-center gap-3 rounded-2xl border border-[#F5DA20]/15 bg-[#F5DA20]/5 px-6 py-3">
              <div className="text-left">
                <div className="text-xs text-white/30 line-through">$59.88/yr</div>
                <div className="text-lg font-black text-white">$29.99<span className="text-sm font-semibold text-white/40">/year</span></div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-black text-emerald-400">Save 50%</span>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-8 py-4 text-sm font-black text-black shadow-[0_0_40px_rgba(245,218,32,0.3)] transition hover:bg-[#ffe033]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" />
                </svg>
                Get PRO — $29.99/year
              </a>
              <PromoCodeModal />
            </div>

            <p className="mt-5 text-xs text-white/20">🛡️ 7-day money-back guarantee · Cancel any time</p>
          </div>
        </div>
      </section>

      {/* ── STICKY BOTTOM CTA (mobile) ───────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/8 bg-[#0B0B0D]/95 px-4 py-3 backdrop-blur-md sm:hidden">
        <a
          href="#pricing"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5DA20] py-3.5 text-sm font-black text-black shadow-[0_0_30px_rgba(245,218,32,0.25)]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" />
          </svg>
          Get PRO — $29.99/year · Save 50%
        </a>
      </div>
    </main>
  );
}
