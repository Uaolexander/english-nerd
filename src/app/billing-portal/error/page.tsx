import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing Portal Error — English Nerd",
  robots: { index: false, follow: false },
};

export default function BillingPortalError() {
  return (
    <main className="relative min-h-screen bg-[#0E0F13] text-white flex items-center justify-center overflow-hidden px-6">

      {/* Background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-red-500/6 blur-[160px]" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-[#F5DA20]/4 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">

        {/* Icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
          <svg className="h-10 w-10 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>

        <h1 className="text-2xl font-black tracking-tight">
          Couldn&apos;t connect to billing
        </h1>
        <p className="mt-3 text-sm text-white/50 leading-relaxed">
          We couldn&apos;t fetch your billing portal link from LemonSqueezy. This is usually a temporary issue — please try again in a moment.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <a
            href="/billing-portal"
            className="inline-flex items-center gap-2 rounded-xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black transition hover:opacity-90"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.31"/>
            </svg>
            Try again
          </a>
          <a
            href="/account"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Back to account
          </a>
        </div>

        {/* Help text */}
        <p className="mt-8 text-xs text-white/25 leading-relaxed">
          If the problem persists, you can manage your subscription directly at{" "}
          <a href="https://app.lemonsqueezy.com" target="_blank" rel="noopener noreferrer" className="text-[#F5DA20]/60 hover:text-[#F5DA20] transition underline">
            app.lemonsqueezy.com
          </a>
        </p>

      </div>
    </main>
  );
}
