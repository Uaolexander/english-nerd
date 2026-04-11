"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import TurnstileWidget from "@/components/TurnstileWidget";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(searchParams.get("error") ?? null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [captchaToken, setCaptchaToken] = useState("");
  const widgetRef = useRef<TurnstileInstance | null>(null);
  const pendingLoginRef = useRef(false);

  async function doLogin(token: string) {
    setLoading(true);

    const captchaRes = await fetch("/api/auth/verify-captcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Invalid email or password.");
      setCaptchaToken("");
      widgetRef.current?.reset();
      setLoading(false);
      return;
    }
    await fetch("/api/session/create", { method: "POST" });
    router.push(next);
    router.refresh();
  }

  function handleToken(token: string) {
    setCaptchaToken(token);
    if (pendingLoginRef.current && token) {
      pendingLoginRef.current = false;
      doLogin(token);
    }
  }

  function handleCaptchaError() {
    if (pendingLoginRef.current) {
      pendingLoginRef.current = false;
      setError("Security check failed. Please try again.");
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}` },
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (captchaToken) {
      await doLogin(captchaToken);
      return;
    }

    // Token not ready yet — wait for Turnstile onSuccess, then doLogin fires automatically
    setLoading(true);
    pendingLoginRef.current = true;
  }

  return (
    <div className="flex min-h-screen bg-[#0B0B0D] text-white">

      {/* ── Left panel (desktop only) ───────────────────────────── */}
      <div className="relative hidden lg:flex w-[42%] flex-col justify-between overflow-hidden border-r border-white/8 p-12">
        {/* Glows */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F5DA20]/10 blur-[140px]" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-500/8 blur-[120px]" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <a href="/" className="flex items-center gap-3">
            <span className="text-xl font-black tracking-tight">
              English <span className="text-[#F5DA20]">Nerd</span>
            </span>
          </a>
        </div>

        {/* Headline */}
        <div className="relative z-10">
          <h2 className="text-4xl font-black leading-tight text-white">
            Learn English.<br />
            Think in English.<br />
            <span className="text-[#F5DA20]">Be English.</span>
          </h2>
          <p className="mt-5 text-base text-white/55 leading-relaxed max-w-xs">
            Grammar, vocabulary, tenses and tests — everything in one place, designed for real progress.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {[
              { icon: "📚", text: "100+ grammar topics from A1 to C1" },
              { icon: "🧠", text: "Exercises that adapt to your level" },
              { icon: "📊", text: "Tests to find your exact weak spots" },
              { icon: "✨", text: "Word of the Day and live phrase library" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm text-white/55">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer quote */}
        <div className="relative z-10">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
            <p className="text-sm italic text-white/50 leading-relaxed">
              &ldquo;The limits of my language mean the limits of my world.&rdquo;
            </p>
            <p className="mt-2 text-xs text-white/45">— Ludwig Wittgenstein</p>
          </div>
        </div>
      </div>

      {/* ── Right panel ─────────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <a href="/" className="mb-10 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5DA20] text-xs font-black text-black">EN</div>
            <span className="text-lg font-black">English <span className="text-[#F5DA20]">Nerd</span></span>
          </a>

          <h1 className="text-3xl font-black text-white">Welcome back</h1>
          <p className="mt-1.5 text-sm text-white/55">Log in to continue learning.</p>

          {/* Error banner */}
          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-500/25 bg-red-500/8 px-4 py-3.5">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 text-sm font-bold text-white transition hover:bg-white/8 hover:border-white/20 disabled:opacity-50 active:scale-[0.99]"
          >
            {googleLoading ? (
              <svg className="h-4 w-4 animate-spin text-white/50" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/8" />
            <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">or</span>
            <div className="h-px flex-1 bg-white/8" />
          </div>

          {/* Email / password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/55">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#F5DA20]/60 focus:ring-2 focus:ring-[#F5DA20]/20"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-white/55">
                  Password
                </label>
                <a href="/forgot-password" className="text-xs text-white/50 hover:text-[#F5DA20] transition">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-12 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#F5DA20]/60 focus:ring-2 focus:ring-[#F5DA20]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 hover:text-white/60 transition"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-2xl bg-[#F5DA20] py-3.5 text-sm font-black text-black transition hover:opacity-90 disabled:opacity-50 active:scale-[0.99]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  Logging in…
                </span>
              ) : "Log in"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-white/50">
            Don&apos;t have an account?{" "}
            <a href="/register" className="font-bold text-[#F5DA20] hover:underline">
              Create one — it&apos;s free
            </a>
          </p>

          <TurnstileWidget onToken={handleToken} onError={handleCaptchaError} widgetRef={widgetRef} />
        </div>
      </div>
    </div>
  );
}
