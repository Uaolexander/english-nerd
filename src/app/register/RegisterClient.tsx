"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import TurnstileWidget from "@/components/TurnstileWidget";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

export default function RegisterClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [agreed, setAgreed] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const widgetRef = useRef<TurnstileInstance | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: { marketing_consent: marketingConsent },
      },
    });

    if (error) {
      setError(error.message);
      setCaptchaToken("");
      widgetRef.current?.reset();
      setLoading(false);
      return;
    }

    // Supabase doesn't return an error for duplicate emails —
    // instead it returns a user with an empty identities array.
    if (data.user && data.user.identities?.length === 0) {
      setError("This email is already registered. Try logging in instead.");
      setCaptchaToken("");
      widgetRef.current?.reset();
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
              ✉️
            </div>
            <h2 className="text-xl font-black text-white">Check your email</h2>
            <p className="mt-2 text-sm text-white/40">
              We sent a confirmation link to <span className="text-white/70 font-semibold">{email}</span>.
              Click it to activate your account.
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
          <h1 className="text-2xl font-black text-white">Create account</h1>
          <p className="mt-1 text-sm text-white/40">Start free. Upgrade to Pro anytime.</p>

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

            <div>
              <label className="mb-1.5 block text-xs font-bold text-white/50 uppercase tracking-wider">
                Password
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
                Repeat password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#F5DA20] focus:ring-1 focus:ring-[#F5DA20] transition"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#F5DA20] cursor-pointer"
              />
              <span className="text-xs text-white/40 leading-relaxed">
                I agree to the{" "}
                <a href="/terms" target="_blank" className="text-[#F5DA20] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy-policy" target="_blank" className="text-[#F5DA20] hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#F5DA20] cursor-pointer"
              />
              <span className="text-xs text-white/40 leading-relaxed">
                Send me helpful tips, new content and occasional offers from English Nerd.
                You can unsubscribe at any time.
              </span>
            </label>

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
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/40">
            Already have an account?{" "}
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
