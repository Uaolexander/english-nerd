import type { Metadata } from "next";
import PromoCodeModal from "@/components/PromoCodeModal";
import TeacherPlans from "@/components/TeacherPlans";
import ProPlans from "@/components/ProPlans";

export const metadata: Metadata = {
  title: "English Nerd PRO — Unlock All Features & Learn Faster",
  description:
    "Go PRO and unlock SpeedRound games, printable PDF worksheets, certificates, exclusive exercises, and an ad-free experience. The fastest way to real English fluency — from $2.50/month.",
  alternates: { canonical: "/pro" },
  openGraph: {
    title: "English Nerd PRO — Unlock All Features & Learn Faster",
    description:
      "SpeedRound games, PDF worksheets, certificates, exclusive exercises and no ads — everything you need to master English. From $2.50/month.",
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
    { "@type": "Offer", name: "PRO Monthly",      price: "4.99",  priceCurrency: "USD", billingIncrement: "P1M", url: "https://englishnerd.cc/pro" },
    { "@type": "Offer", name: "PRO Annual",       price: "29.99", priceCurrency: "USD", billingIncrement: "P1Y", url: "https://englishnerd.cc/pro" },
    { "@type": "Offer", name: "Teacher Starter",  price: "6.99",  priceCurrency: "USD", billingIncrement: "P1M", description: "Up to 5 students. Annual: $59/yr.", url: "https://englishnerd.cc/contact" },
    { "@type": "Offer", name: "Teacher Solo",     price: "9.99",  priceCurrency: "USD", billingIncrement: "P1M", description: "Up to 15 students. Annual: $79/yr.", url: "https://englishnerd.cc/contact" },
    { "@type": "Offer", name: "Teacher Plus",     price: "15.99", priceCurrency: "USD", billingIncrement: "P1M", description: "Up to 40 students. Annual: $129/yr.", url: "https://englishnerd.cc/contact" },
  ],
};

/* ─── Static data ─────────────────────────────────────────────────────────── */

const FEATURES = [
  { icon: "⚡", title: "SpeedRound Game",  tag: "40 lessons",      gradient: "from-amber-500/25 to-yellow-600/10",   accent: "text-amber-400",  border: "border-amber-500/20",  desc: "Train your brain to answer grammar questions without thinking. 20 rapid-fire questions, instant feedback — build reflexes, not just rules." },
  { icon: "📄", title: "PDF Worksheets",   tag: "40+ worksheets",  gradient: "from-sky-500/25 to-blue-600/10",       accent: "text-sky-400",    border: "border-sky-500/20",    desc: "Download and print any grammar lesson as a 4-exercise worksheet with a full answer key. Study anywhere — no screen needed." },
  { icon: "🔗", title: "Related Topics",   tag: "13 tenses",       gradient: "from-violet-500/25 to-purple-600/10",  accent: "text-violet-400", border: "border-violet-500/20", desc: "Unlock bonus comparison exercises on every tense page — the contrast drills that make grammar finally click and stick." },
  { icon: "🎬", title: "Watch & Learn",    tag: "Growing library", gradient: "from-emerald-500/25 to-green-600/10",  accent: "text-emerald-400",border: "border-emerald-500/20",desc: "Interactive vocabulary exercises built around real films and TV shows. Fill-in-blank, word match, quick-fire quiz." },
];

const CHECKLIST = [
  { free: true,  label: "All Grammar lessons A1–C1" },
  { free: true,  label: "Tenses: quiz, fill-in, sentence builder" },
  { free: true,  label: "Vocabulary tests & placement test" },
  { free: true,  label: "Reading & Listening sections" },
  { free: false, label: "SpeedRound game on every lesson" },
  { free: false, label: "PDF worksheets + answer keys" },
  { free: false, label: "Related Topics on all tenses" },
  { free: false, label: "Watch & Learn exercises" },
  { free: false, label: "Downloadable certificates" },
  { free: false, label: "Progress statistics dashboard" },
  { free: false, label: "Ad-free experience" },
  { free: false, label: "PRO crown badge" },
];



const FAQS = [
  { q: "What exactly is English Nerd PRO?", a: "PRO unlocks the premium layer of English Nerd — SpeedRound games, printable PDF worksheets, downloadable certificates, exclusive Related Topics exercises, Watch & Learn drills, progress tracking and an ad-free experience. Free content stays free forever." },
  { q: "Can I cancel any time?", a: "Yes. Cancel from your Account settings any time. You keep PRO access until the end of your billing period — no surprise charges, no questions asked." },
  { q: "Is there a 7-day money-back guarantee?", a: "Yes. If you're not happy, reach out within 7 days of your first payment and we'll refund you in full. No questions asked." },
  { q: "Can I use a promo code instead of paying?", a: "Absolutely. Go to your Account page → Profile tab and enter your code. Promo codes give instant PRO access for 30 or 365 days with no payment required." },
  { q: "What happens when my PRO subscription ends?", a: "Your account stays active and all free content remains fully accessible. PRO features become locked again until you renew." },
  { q: "How do teacher plans work?", a: "Teacher Starter ($6.99/mo or $59/yr) supports up to 5 students. Teacher Solo ($9.99/mo or $79/yr) supports up to 15 students. Teacher Plus ($15.99/mo or $129/yr) supports up to 40 students with class groups and priority support. Annual plans save up to 34%. Access is provided via voucher code — contact us to get started." },
  { q: "Is there a student discount?", a: "Yes. We offer special promo codes for students. Reach out via the contact page and we'll take care of you." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

/* ─── Small SVG helpers ───────────────────────────────────────────────────── */

function Check({ cls }: { cls?: string }) {
  return (
    <svg className={`h-4 w-4 shrink-0 ${cls ?? "text-[#F5DA20]"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function X() {
  return (
    <svg className="h-4 w-4 text-white/15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function ProPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0D] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(proSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── 1. HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-28 pt-24 text-center md:pb-36 md:pt-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#F5DA20]/8 blur-[140px]" />
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#F5DA20]/25 bg-[#F5DA20]/10 px-4 py-1.5 text-sm font-black text-[#F5DA20]">
            ★ Trusted by English learners worldwide
          </div>
          <h1 className="text-5xl font-black leading-[1.06] tracking-tight md:text-7xl">
            The fastest way to{" "}
            <span className="text-[#F5DA20]">real English fluency.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/50 md:text-xl">
            PRO gives you every game, worksheet, certificate and exercise — for less than a cup of coffee per month.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href="#pricing" className="inline-flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-8 py-4 text-base font-black text-black shadow-[0_0_40px_rgba(245,218,32,0.3)] transition hover:bg-[#ffe033]">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" /></svg>
              Get PRO — from $2.50/mo
            </a>
            <a href="#features" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-8 py-4 text-base font-semibold text-white/55 transition hover:border-white/20 hover:text-white">
              See what&apos;s included ↓
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-white/30">
            {["Cancel any time", "7-day guarantee", "Promo codes accepted"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-emerald-400/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. PAIN → GAIN ────────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl grid gap-5 sm:grid-cols-3">
          {[
            { before: "Forgetting grammar rules after each lesson", after: "SpeedRound games train instant recall" },
            { before: "No materials to practice offline", after: "40+ print-ready PDF worksheets" },
            { before: "No proof of your progress", after: "Downloadable certificates for every course" },
          ].map((item) => (
            <div key={item.before} className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]">
              <div className="flex items-start gap-3 border-b border-white/6 bg-red-500/[0.06] px-5 py-4">
                <span className="mt-0.5">❌</span>
                <p className="text-sm leading-snug text-white/45">{item.before}</p>
              </div>
              <div className="flex items-start gap-3 bg-emerald-500/[0.06] px-5 py-4">
                <span className="mt-0.5">✅</span>
                <p className="text-sm font-semibold leading-snug text-white/80">{item.after}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. FEATURES ───────────────────────────────────────────────────── */}
      <section id="features" className="px-6 pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[#F5DA20]/60">What PRO unlocks</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Four ways PRO accelerates you</h2>
            <p className="mx-auto mt-3 max-w-md text-white/35">Every feature designed to make grammar stick faster and study sessions more productive.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className={`group overflow-hidden rounded-2xl border bg-white/[0.03] ${f.border} transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50`}>
                <div className={`flex h-44 w-full items-center justify-center bg-gradient-to-br ${f.gradient} relative`}>
                  <span className="text-7xl opacity-80 transition-transform duration-300 group-hover:scale-110">{f.icon}</span>
                  <span className={`absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-sm ${f.accent}`}>{f.tag}</span>
                </div>
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
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: "🏆", title: "Certificates", desc: "Download proof of completion for every course you finish." },
              { icon: "📊", title: "Progress Stats", desc: "Track streaks, scores, and growth in your personal dashboard." },
              { icon: "🚫", title: "No Ads", desc: "Study without distractions. A clean, fully ad-free experience." },
            ].map((p) => (
              <div key={p.title} className="flex gap-4 rounded-2xl border border-white/6 bg-white/[0.03] p-5">
                <span className="mt-0.5 shrink-0 text-2xl">{p.icon}</span>
                <div>
                  <div className="text-sm font-black text-white">{p.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-white/40">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. VALUE ANCHOR ───────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-2xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.04] px-8 py-12 text-center">
            <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-[#F5DA20]/8 blur-[60px]" />
            <div className="relative">
              <p className="text-lg font-semibold text-white/50 md:text-xl">
                A private English tutor costs <span className="font-black text-white/80">$40–$80 per hour.</span>
              </p>
              <p className="mt-4 text-3xl font-black md:text-4xl">
                PRO costs <span className="text-[#F5DA20]">$2.50 per month.</span>
              </p>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/40">
                That&apos;s less than one minute of tutoring — for a full year of games, worksheets, certificates and exercises.
              </p>
              <a href="#pricing" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-8 py-4 text-sm font-black text-black transition hover:bg-[#ffe033]">
                Get PRO for $29.99/year →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. COMPARISON TABLE ───────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[#F5DA20]/60">Free vs PRO</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Everything, side by side</h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]">
            <div className="grid grid-cols-3 border-b border-white/8 px-6 py-4">
              <div className="text-xs font-black uppercase tracking-widest text-white/25">Feature</div>
              <div className="text-center text-xs font-black uppercase tracking-widest text-white/25">Free</div>
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F5DA20] px-3 py-0.5 text-xs font-black text-black">
                  <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" /></svg>
                  PRO
                </span>
              </div>
            </div>
            {CHECKLIST.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-3 items-center px-6 py-3.5 ${!row.free ? "bg-[#F5DA20]/[0.04]" : i % 2 === 0 ? "bg-white/[0.015]" : ""}`}>
                <span className={`text-sm ${!row.free ? "font-semibold text-white" : "text-white/50"}`}>{row.label}</span>
                <div className="flex justify-center">{row.free ? <Check cls="text-emerald-400" /> : <X />}</div>
                <div className="flex justify-center"><Check /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. PRICING ────────────────────────────────────────────────────── */}
      <section id="pricing" className="px-6 pb-28">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[#F5DA20]/60">Pricing</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Simple, honest pricing.</h2>
            <p className="mt-3 text-white/40">Everything included. No hidden fees.</p>
          </div>
          <ProPlans />
          <div className="mt-8 flex justify-center">
            <PromoCodeModal />
          </div>
        </div>
      </section>

      {/* ── 7. FOR TEACHERS ───────────────────────────────────────────────── */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm font-black text-white/60">
              🏫 For Teachers
            </span>
          </div>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black md:text-4xl">
              Manage your students.{" "}
              <span className="text-[#F5DA20]">Assign work. Track progress.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg leading-relaxed text-white/40">
              English Nerd Teacher gives you a full classroom management system built directly into the platform.
            </p>
          </div>
          <TeacherPlans />
        </div>
      </section>

      {/* ── 8. FAQ (CSS-only accordion via details/summary) ───────────────── */}
      <section className="border-t border-white/6 px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[#F5DA20]/60">FAQ</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Common questions</h2>
            <p className="mt-3 text-sm text-white/35">Everything you need to know before going PRO.</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] open:border-[#F5DA20]/25 open:bg-[#F5DA20]/[0.04]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-black text-white/75 group-open:text-white [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <svg className="h-4 w-4 shrink-0 text-white/40 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <p className="px-6 pb-5 text-sm leading-relaxed text-white/50">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FINAL CTA ──────────────────────────────────────────────────── */}
      <section className="px-6 pb-28">
        <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#F5DA20]/20 bg-gradient-to-br from-[#F5DA20]/10 to-transparent px-8 py-16 text-center">
          <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-72 -translate-x-1/2 rounded-full bg-[#F5DA20]/12 blur-[70px]" />
          <div className="relative">
            <div className="mb-5 text-5xl">👑</div>
            <h2 className="text-3xl font-black leading-tight md:text-4xl">Ready to level up?</h2>
            <p className="mx-auto mt-4 max-w-sm leading-relaxed text-white/40">
              Join learners who stopped guessing and started mastering English with PRO.
            </p>
            <div className="mx-auto mt-6 flex w-fit items-center gap-4 rounded-2xl border border-[#F5DA20]/15 bg-[#F5DA20]/5 px-6 py-3">
              <div className="text-left">
                <div className="text-[11px] text-white/30">per month</div>
                <div className="text-xl font-black text-white">$2.50 <span className="text-sm font-semibold text-white/40">· $29.99/year</span></div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-400">Save 50%</span>
            </div>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a href="#pricing" className="inline-flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-8 py-4 text-sm font-black text-black shadow-[0_0_40px_rgba(245,218,32,0.3)] transition hover:bg-[#ffe033]">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" /></svg>
                Get PRO Now →
              </a>
              <PromoCodeModal />
            </div>
            <p className="mt-5 text-xs text-white/25">🛡 7-day guarantee · Cancel any time</p>
          </div>
        </div>
      </section>

      {/* ── 10. STICKY MOBILE BAR ─────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/8 bg-[#0B0B0D]/95 px-4 py-3 backdrop-blur-md sm:hidden">
        <a href="#pricing" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5DA20] py-3.5 text-sm font-black text-black shadow-[0_0_30px_rgba(245,218,32,0.25)]">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" /></svg>
          Get PRO — $29.99/year · Save 50%
        </a>
      </div>
    </main>
  );
}
