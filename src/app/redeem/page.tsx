"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProWelcomeModal from "@/components/ProWelcomeModal";
import TeacherWelcomeModal from "@/components/TeacherWelcomeModal";

export default function RedeemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(() => searchParams.get("code") ?? "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [showPro, setShowPro] = useState(false);
  const [showTeacher, setShowTeacher] = useState(false);
  const [teacherPlan, setTeacherPlan] = useState<"starter" | "solo" | "plus">("solo");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || loading) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/redeem-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json() as { ok: boolean; message?: string; error?: string; isTeacher?: boolean; plan?: string };
      if (data.ok) {
        setCode("");
        if (data.isTeacher) {
          setTeacherPlan((data.plan as "starter" | "solo" | "plus") ?? "solo");
          setShowTeacher(true);
        } else {
          setShowPro(true);
        }
      } else {
        setMsg({ type: "err", text: data.error ?? "Something went wrong." });
      }
    } catch {
      setMsg({ type: "err", text: "Could not reach the server. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0E0F13] flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#F5DA20]/6 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo link */}
        <div className="mb-8 text-center">
          <a href="/" className="inline-block">
            <span className="text-xl font-black text-[#F5DA20]">English Nerd</span>
          </a>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm shadow-2xl">
          {/* Top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-[#F5DA20] via-amber-400 to-[#F5DA20]" />

          <div className="px-8 py-10">
            {/* Icon */}
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5DA20]/15 mx-auto">
              <svg className="h-7 w-7 text-[#F5DA20]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
                <line x1="9" y1="12" x2="15" y2="12"/>
              </svg>
            </div>

            <h1 className="text-center text-2xl font-black text-white">Redeem Your Code</h1>
            <p className="mt-2 text-center text-sm text-white/45 leading-relaxed">
              Enter your promo code or teacher voucher below to activate your access instantly.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-3">
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setMsg(null); }}
                placeholder="ENTER-CODE-HERE"
                autoFocus
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center text-lg font-black text-white tracking-widest placeholder-white/20 outline-none focus:border-[#F5DA20]/50 focus:ring-2 focus:ring-[#F5DA20]/15 transition"
              />

              {msg && (
                <div className="space-y-3">
                  <div className={`rounded-xl px-4 py-3 text-sm font-semibold text-center ${msg.type === "ok" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                    {msg.text}
                  </div>
                  {msg.type === "err" && msg.text.toLowerCase().includes("signed in") && (
                    <div className="flex gap-2">
                      <a
                        href={`/login?next=${encodeURIComponent(code.trim() ? `/redeem?code=${encodeURIComponent(code.trim())}` : "/redeem")}`}
                        className="flex-1 rounded-2xl border border-white/15 bg-white/5 py-3 text-sm font-black text-white text-center transition hover:bg-white/10"
                      >
                        Log in
                      </a>
                      <a
                        href={`/register?next=${encodeURIComponent(code.trim() ? `/redeem?code=${encodeURIComponent(code.trim())}` : "/redeem")}`}
                        className="flex-1 rounded-2xl bg-[#F5DA20] py-3 text-sm font-black text-black text-center transition hover:bg-[#ffe033]"
                      >
                        Create account
                      </a>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="w-full rounded-2xl bg-[#F5DA20] py-4 text-sm font-black text-black transition hover:bg-[#ffe033] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Activating…" : "Activate →"}
              </button>
            </form>

            <div className="mt-6 border-t border-white/8 pt-5 text-center space-y-2">
              <p className="text-xs text-white/50">
                Don&apos;t have a code?{" "}
                <a href="/pro" className="text-[#F5DA20]/70 underline underline-offset-2 hover:text-[#F5DA20] transition">See plans →</a>
              </p>
              <p className="text-xs text-white/20">
                Need help?{" "}
                <a href="/contact" className="underline underline-offset-2 hover:text-white/55 transition">Contact us</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showPro && <ProWelcomeModal onClose={() => { setShowPro(false); router.push("/account"); }} />}
      {showTeacher && <TeacherWelcomeModal plan={teacherPlan} onClose={() => { setShowTeacher(false); router.push("/account"); }} />}
    </main>
  );
}
