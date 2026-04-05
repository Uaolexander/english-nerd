"use client";

import { useState } from "react";
import Link from "next/link";

export default function TeacherRedeemClient({ email }: { email: string }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/teacher/redeem-voucher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    setResult({ ok: data.ok, message: data.message ?? data.error });
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">
            <svg className="h-8 w-8 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
        </div>

        <h1 className="mb-1 text-center text-2xl font-black text-slate-900">
          Activate Teacher Access
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          Signed in as <strong className="text-slate-700">{email}</strong>
        </p>

        {result?.ok ? (
          <div className="space-y-4">
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center">
              <p className="text-2xl mb-2">🎉</p>
              <p className="font-bold text-emerald-800">{result.message}</p>
            </div>
            <Link
              href="/teacher"
              className="block w-full rounded-xl bg-violet-600 py-3 text-center text-sm font-bold text-white transition hover:bg-violet-700"
            >
              Go to Teacher Dashboard
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Voucher code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="TCH-XXXX-XXXX"
                required
                spellCheck={false}
                autoComplete="off"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-lg font-black tracking-widest text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 uppercase"
              />
            </div>

            {result && !result.ok && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-center text-sm text-red-700">
                {result.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-50"
            >
              {loading ? "Activating…" : "Activate"}
            </button>

            <p className="text-center text-xs text-slate-400">
              Teacher access is valid for 30 days and can be renewed monthly with the same code.
            </p>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/account" className="text-xs text-slate-400 hover:text-slate-600 transition">
            Back to Account
          </Link>
        </div>
      </div>
    </main>
  );
}
