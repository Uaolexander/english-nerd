"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  token: string;
  inviteEmail: string;
  isLoggedIn: boolean;
  currentUserEmail: string | null;
}

export default function TeacherJoinClient({ token, inviteEmail, isLoggedIn, currentUserEmail }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [declined, setDeclined] = useState(false);

  const emailMatches = currentUserEmail?.toLowerCase() === inviteEmail.toLowerCase();

  async function handleAccept() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/teacher/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error); setLoading(false); return; }
      router.push("/account?joined=1");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleDecline() {
    setDeclining(true);
    setError(null);
    try {
      const res = await fetch("/api/teacher/invite/decline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error); setDeclining(false); return; }
      setDeclined(true);
    } catch {
      setError("Something went wrong. Please try again.");
      setDeclining(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
            <svg className="h-8 w-8 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
        </div>

        <h1 className="mb-2 text-center text-2xl font-black text-slate-900">
          You've been invited!
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          Your teacher has added <strong className="text-slate-700">{inviteEmail}</strong> to their class on EnglishNerd.
        </p>

        {!isLoggedIn ? (
          <div className="space-y-3">
            <p className="text-center text-sm text-slate-600">
              Please log in or create an account with <strong>{inviteEmail}</strong> to accept the invitation.
            </p>
            <Link
              href={`/login?next=${encodeURIComponent(`/teacher/join?token=${token}`)}`}
              className="block w-full rounded-xl bg-violet-600 py-3 text-center text-sm font-bold text-white transition hover:bg-violet-700"
            >
              Log in to accept
            </Link>
            <Link
              href={`/register?next=${encodeURIComponent(`/teacher/join?token=${token}`)}`}
              className="block w-full rounded-xl border border-slate-200 py-3 text-center text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Create account
            </Link>
          </div>
        ) : !emailMatches ? (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-center">
            <p className="text-sm text-amber-800">
              You're logged in as <strong>{currentUserEmail}</strong>, but this invite is for <strong>{inviteEmail}</strong>.
            </p>
            <p className="mt-2 text-sm text-amber-700">Please log out and sign in with the correct account.</p>
          </div>
        ) : declined ? (
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 text-center">
            <p className="text-sm font-semibold text-slate-700">Invitation declined</p>
            <p className="mt-1 text-xs text-slate-400">Your teacher has been notified. You can close this page.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-center text-sm text-red-700">
                {error}
              </div>
            )}
            <button
              onClick={handleAccept}
              disabled={loading || declining}
              className="w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-60"
            >
              {loading ? "Joining…" : "Accept invitation"}
            </button>
            <button
              onClick={handleDecline}
              disabled={loading || declining}
              className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 disabled:opacity-60"
            >
              {declining ? "Declining…" : "Decline"}
            </button>
            <p className="text-center text-xs text-slate-400">
              By accepting, your teacher will be able to see your exercise progress.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
