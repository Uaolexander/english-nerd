"use client";

import { useState } from "react";

export default function LetterboxSection() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "unauth">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || status === "sending") return;

    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, page: "englishnerd.cc" }),
      });

      if (res.ok) {
        setStatus("sent");
        setMessage("");
      } else if (res.status === 401) {
        setStatus("unauth");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="px-6 pb-28">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] px-8 py-12 md:px-16">

          {/* Glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F5DA20]/4 blur-3xl" />

          {/* Corner decorations */}
          <div className="pointer-events-none absolute top-0 left-0 h-24 w-24 rounded-tl-3xl border-t-2 border-l-2 border-[#F5DA20]/15" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-24 w-24 rounded-br-3xl border-b-2 border-r-2 border-[#F5DA20]/15" />

          <div className="relative text-center">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F5DA20]/20 bg-[#F5DA20]/10 px-4 py-1.5 text-xs font-bold text-[#F5DA20]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5DA20]" />
              We read every message
            </div>

            <h2 className="text-3xl font-black md:text-4xl">
              Got something to say?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/55">
              Suggest a topic, report an error, share feedback, or just say hi. We&apos;d love to hear from you.
            </p>

            {status === "sent" ? (
              <div className="mt-8 flex flex-col items-center gap-3">
                <div className="text-4xl">📬</div>
                <div className="text-lg font-black text-white">Message sent!</div>
                <p className="text-sm text-white/55">Thanks for writing. We&apos;ll read it soon.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-2 text-xs text-white/50 hover:text-white/60 transition underline"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8">
                <label htmlFor="feedback-message" className="sr-only">Your message</label>
                <textarea
                  id="feedback-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message here…"
                  maxLength={1000}
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder:text-white/45 outline-none focus:border-[#F5DA20]/40 focus:bg-white/8 transition"
                />
                <div className="mt-1 text-right text-xs text-white/50">{message.length}/1000</div>
                <div className="mt-3 flex justify-center">
                  <button
                    type="submit"
                    disabled={!message.trim() || status === "sending"}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#F5DA20] px-6 py-3 text-sm font-black text-black transition hover:opacity-90 shadow-lg shadow-[#F5DA20]/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? "Sending…" : "Send message"}
                  </button>
                </div>
                {status === "error" && (
                  <p className="mt-3 text-xs text-red-400">Something went wrong. Please try again.</p>
                )}
                {status === "unauth" && (
                  <p className="mt-3 text-xs text-white/60">
                    Please{" "}
                    <a href="/login" className="font-bold text-[#F5DA20] hover:underline">log in</a>
                    {" "}or{" "}
                    <a href="/register" className="font-bold text-[#F5DA20] hover:underline">create a free account</a>
                    {" "}to send a message.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
