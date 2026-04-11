"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordClient() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-white/10 bg-[#121216] p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/10 text-2xl">
              ✅
            </div>
            <h2 className="text-xl font-black text-white">Password updated</h2>
            <p className="mt-2 text-sm text-white/55">
              Your password has been changed successfully.
            </p>
            <a
              href="/login"
              className="mt-6 block rounded-xl bg-[#F5DA20] py-3 text-sm font-black text-black hover:opacity-90 transition"
            >
              Log in
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-white/10 bg-[#121216] p-8">
          <h1 className="text-2xl font-black text-white">New password</h1>
          <p className="mt-1 text-sm text-white/55">
            Choose a new password for your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-white/50 uppercase tracking-wider">
                New password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#F5DA20] focus:ring-1 focus:ring-[#F5DA20] transition"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-white/50 uppercase tracking-wider">
                Confirm password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your new password"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#F5DA20] focus:ring-1 focus:ring-[#F5DA20] transition"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#F5DA20] py-3 text-sm font-black text-black transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Saving…" : "Save password"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
