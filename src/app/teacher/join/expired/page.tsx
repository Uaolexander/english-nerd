import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Invitation Expired — English Nerd",
  robots: { index: false, follow: false },
};

export default function ExpiredInvitePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl text-center">
        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <svg className="h-8 w-8 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Invitation expired</h1>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          This invitation link has expired (links are valid for 7 days). Please ask your teacher to send a new invitation.
        </p>
        <Link
          href="/"
          className="block w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
        >
          Go to English Nerd
        </Link>
      </div>
    </main>
  );
}
