import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing Portal Error — English Nerd",
  robots: { index: false, follow: false },
};

export default async function BillingPortalError({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const isVoucher = reason === "not-found";

  if (isVoucher) {
    return (
      <main className="relative min-h-screen bg-[#0E0F13] text-white flex items-center justify-center overflow-hidden px-6">

        {/* Background glows */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-[#F5DA20]/6 blur-[160px]" />
          <div className="absolute bottom-0 left-1/2 h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-amber-500/4 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-md">

          {/* Icon */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F5DA20]/10 border border-[#F5DA20]/20">
            <svg className="h-10 w-10 text-[#F5DA20]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12V22H4V12"/>
              <path d="M22 7H2v5h20V7z"/>
              <path d="M12 22V7"/>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
            </svg>
          </div>

          <h1 className="text-2xl font-black tracking-tight">
            Promo subscription active
          </h1>
          <p className="mt-3 text-sm text-white/50 leading-relaxed">
            Your plan was activated via a promo code or voucher. Promo subscriptions don&apos;t have a self-service billing portal — your access is fully managed.
          </p>

          <div className="mt-6 w-full rounded-2xl border border-[#F5DA20]/15 bg-[#F5DA20]/5 px-5 py-4 text-sm text-white/60 leading-relaxed text-left">
            <p className="font-semibold text-white/80 mb-1">Need to make changes?</p>
            Contact support and we&apos;ll sort it out for you manually.
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <a
              href="mailto:hello@englishnerd.cc"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black transition hover:opacity-90"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Contact support
            </a>
            <a
              href="/account"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-white/70 transition hover:border-white/30 hover:text-white"
            >
              Back to account
            </a>
          </div>

        </div>
      </main>
    );
  }

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
