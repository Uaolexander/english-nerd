"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import TurnstileWidget from "@/components/TurnstileWidget";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [captchaToken, setCaptchaToken] = useState("");
  const widgetRef = useRef<TurnstileInstance | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!captchaToken) {
      setError("Please complete the security check.");
      return;
    }

    setLoading(true);

    // Verify CAPTCHA server-side first
    const captchaRes = await fetch("/api/auth/verify-captcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: captchaToken }),
    });
    const captchaData = await captchaRes.json() as { ok: boolean; error?: string };

    if (!captchaData.ok) {
      setError(captchaData.error ?? "Security check failed. Please try again.");
      setCaptchaToken("");
      widgetRef.current?.reset();
      setLoading(false);
      return;
    }

    const supabase = createClient();
    // We always show the same neutral message regardless of whether
    // the email exists — this prevents email enumeration.
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/reset-password`,
    });

    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-white/10 bg-[#121216] p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-400/10 text-2xl">
              ✉️
            </div>
            <h2 className="text-xl font-black text-white">Check your email</h2>
            <p className="mt-2 text-sm text-white/40">
              If this email exists in our system, we sent a password reset link.
            </p>
            <a
              href="/login"
              className="mt-6 block rounded-xl border border-white/10 py-3 text-sm font-bold text-white/60 hover:bg-white/5 transition"
            >
              Back to login
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
          <h1 className="text-2xl font-black text-white">Reset password</h1>
          <p className="mt-1 text-sm text-white/40">
            Enter your email and we&apos;ll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-white/50 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/40">
            Remembered your password?{" "}
            <a href="/login" className="font-bold text-[#F5DA20] hover:underline">
              Log in
            </a>
          </p>

          {/* Invisible Turnstile — no UI, auto-executes on page load */}
          <TurnstileWidget onToken={setCaptchaToken} widgetRef={widgetRef} />
        </div>
      </div>
    </main>
  );
}
