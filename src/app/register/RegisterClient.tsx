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
  const [isLikelyTeacher, setIsLikelyTeacher] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const widgetRef = useRef<TurnstileInstance | null>(null);

  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendDone, setResendDone] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  async function handleResend() {
    if (resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    setResendError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setResendLoading(false);
    if (error) {
      setResendError(error.message);
    } else {
      setResendDone(true);
      let secs = 60;
      setResendCooldown(secs);
      const timer = setInterval(() => {
        secs -= 1;
        setResendCooldown(secs);
        if (secs <= 0) clearInterval(timer);
      }, 1000);
    }
  }

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

    // Check if email domain suggests a teacher (school / edu)
    const domain = email.split("@")[1]?.toLowerCase() ?? "";
    const TEACHER_DOMAINS = ["sch", "school", "edu", "gymnasium", "lyceum", "college", "teacher", "npu", "dpu", "kpu", "university", "ac.uk", "k12"];
    const likelyTeacher = TEACHER_DOMAINS.some((w) => domain.includes(w));
    if (likelyTeacher) {
      try { localStorage.setItem("likely_teacher", "1"); } catch { /* ignore */ }
      setIsLikelyTeacher(true);
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm flex flex-col gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#121216] p-8 text-center">
            {/* Envelope icon */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5DA20]/10">
              <svg className="h-8 w-8 text-[#F5DA20]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>

            <h2 className="text-xl font-black text-white">Check your email</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              We sent a confirmation link to{" "}
              <span className="font-semibold text-white/80">{email}</span>.
              Click it to activate your account.
            </p>

            {/* Resend section */}
            <div className="mt-5 border-t border-white/8 pt-5">
              {resendDone ? (
                <div className="flex items-center justify-center gap-2 text-sm text-emerald-400">
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Email resent!{resendCooldown > 0 && <span className="text-white/35"> Resend again in {resendCooldown}s</span>}
                </div>
              ) : (
                <p className="text-xs text-white/35">
                  Didn&apos;t receive it?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading || resendCooldown > 0}
                    className="font-semibold text-[#F5DA20] transition hover:underline disabled:opacity-40 disabled:no-underline"
                  >
                    {resendLoading ? "Sending…" : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend confirmation email"}
                  </button>
                </p>
              )}
              {resendError && (
                <p className="mt-2 text-xs text-red-400">{resendError}</p>
              )}
            </div>

            <a
              href="/login"
              className="mt-4 block rounded-xl border border-white/10 py-3 text-sm font-bold text-white/50 hover:bg-white/5 hover:text-white/70 transition"
            >
              Back to login
            </a>
          </div>

          {/* Teacher hint card — only shown when email domain suggests a teacher */}
          {isLikelyTeacher && (
            <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-[#121216] p-5">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-violet-700 to-purple-400" />
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-700 to-purple-500 text-white">
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor" style={{ height: 18, width: 18 }}>
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-widest text-violet-400">For Teachers</p>
                  <h3 className="mt-0.5 text-sm font-black text-white">Are you an English teacher?</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/45">
                    We noticed you might be a teacher. English Nerd has a special Teacher plan — assign exercises, track student progress, and generate certificates.
                  </p>
                  <a
                    href="/pro#teacher"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-violet-700 px-4 py-2 text-xs font-black text-white transition hover:bg-violet-600"
                  >
                    See Teacher Plans
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-white/10 bg-[#121216] p-8">
          <h1 className="text-2xl font-black text-white">Create account</h1>
          <p className="mt-1 text-sm text-white/55">Start free. Upgrade to Pro anytime.</p>

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
              <span className="text-xs text-white/55 leading-relaxed">
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
              <span className="text-xs text-white/55 leading-relaxed">
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

          <p className="mt-6 text-center text-sm text-white/55">
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
