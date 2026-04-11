import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Wrong Account — English Nerd",
  robots: { index: false, follow: false },
};

export default async function WrongEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; expected?: string; current?: string }>;
}) {
  const { token, expected, current } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl text-center">
        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
            <svg className="h-8 w-8 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-2">Wrong account</h1>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          This invitation was sent to{" "}
          <strong className="text-slate-800">{expected}</strong>, but you&apos;re logged in as{" "}
          <strong className="text-slate-800">{current}</strong>.
        </p>

        <div className="space-y-3">
          <Link
            href={`/login?next=${encodeURIComponent(`/teacher/join?token=${token}`)}`}
            className="block w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
          >
            Sign in with correct account
          </Link>
          <Link
            href="/account"
            className="block w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
          >
            Go to my account
          </Link>
        </div>
      </div>
    </main>
  );
}
