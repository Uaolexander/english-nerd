"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import ProWelcomeModal from "@/components/ProWelcomeModal";

function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-16 sm:pt-24"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-[#141416] border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-[#F5DA20] via-amber-400 to-[#F5DA20]" />
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-white/50 transition hover:bg-white/15"
          aria-label="Close"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

export default function PromoCodeModal() {
  const [open, setOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
    });
  }, [open]);

  async function handleRedeem(e: React.FormEvent) {
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
      const data = await res.json() as { ok: boolean; message?: string; error?: string };
      if (data.ok) {
        setCode("");
        setOpen(false);
        setShowWelcome(true);
      } else {
        setMsg({ type: "err", text: data.error ?? "Invalid code. Please try again." });
      }
    } catch {
      setMsg({ type: "err", text: "Could not reach the server. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {showWelcome && (
        <ProWelcomeModal onClose={() => { setShowWelcome(false); window.location.href = "/account"; }} />
      )}

      <button
        onClick={() => { setOpen(true); setMsg(null); setCode(""); }}
        className="text-sm font-semibold text-white/35 transition hover:text-white/65 underline underline-offset-4"
      >
        Or redeem a promo code →
      </button>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <div className="px-7 pb-8 pt-6">
            {/* Icon */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F5DA20] to-amber-500 shadow-lg shadow-[#F5DA20]/20">
              <svg className="h-6 w-6 text-amber-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>

            <h2 className="text-xl font-black text-white">Redeem Promo Code</h2>
            <p className="mt-1 text-sm text-white/40">Activate PRO for free with a valid code</p>

            {loggedIn === null && (
              <div className="mt-6 flex justify-center">
                <svg className="h-6 w-6 animate-spin text-[#F5DA20]/50" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              </div>
            )}

            {loggedIn === false && (
              <div className="mt-6">
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-sm text-amber-300">
                  You need to be signed in to redeem a promo code.
                </div>
                <div className="mt-4 flex flex-col gap-2.5">
                  <a
                    href="/login"
                    className="flex w-full items-center justify-center rounded-xl bg-[#F5DA20] py-3 text-sm font-black text-black transition hover:bg-[#ffe033]"
                  >
                    Sign in to redeem
                  </a>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-sm text-white/30 transition hover:text-white/60"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {loggedIn === true && (
              <form onSubmit={handleRedeem} className="mt-6">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => { setCode(e.target.value.toUpperCase()); setMsg(null); }}
                  placeholder="e.g. YKO-STAR"
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={20}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm uppercase text-white placeholder-white/20 outline-none transition focus:border-[#F5DA20]/50 focus:ring-2 focus:ring-[#F5DA20]/15"
                />

                {msg && (
                  <div className={`mt-3 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold ${
                    msg.type === "ok"
                      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                      : "border-red-500/25 bg-red-500/10 text-red-400"
                  }`}>
                    {msg.type === "ok"
                      ? <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    }
                    {msg.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !code.trim()}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5DA20] py-3.5 text-sm font-black text-black transition hover:bg-[#ffe033] disabled:opacity-40"
                >
                  {loading ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : "Activate PRO"}
                </button>
              </form>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
