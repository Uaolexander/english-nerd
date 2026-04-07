"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Message = {
  id: string;
  content: string;
  is_owner_reply: boolean;
  is_read: boolean;
  created_at: string;
};

type Props = {
  email: string;
  plan: "PRO" | "Teacher" | "Student" | "Free";
};

export default function FeedbackWidget({ email, plan }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const [sendError, setSendError] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Track scroll position for mobile back-to-top mode
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/feedback");
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages ?? []);
      setUnread(data.unread ?? 0);
    } catch { /* ignore */ }
  }, []);

  const markRead = useCallback(async () => {
    try {
      await fetch("/api/feedback", { method: "PATCH" });
      setUnread(0);
      setMessages((prev) => prev.map((m) => (m.is_owner_reply ? { ...m, is_read: true } : m)));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    fetchMessages();
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(fetchMessages, open ? 5000 : 25000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [open, fetchMessages]);

  useEffect(() => {
    if (open) { markRead(); setTimeout(() => textareaRef.current?.focus(), 150); }
  }, [open, markRead]);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const content = input.trim();
    setInput("");
    setSending(true);
    setSendError(false);

    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [...prev, { id: tempId, content, is_owner_reply: false, is_read: true, created_at: new Date().toISOString() }]);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, plan, page: window.location.pathname }),
      });
      if (!res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setSendError(true);
        setInput(content);
        setTimeout(() => setSendError(false), 3000);
      } else {
        await fetchMessages();
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setSendError(true);
      setInput(content);
      setTimeout(() => setSendError(false), 3000);
    } finally {
      setSending(false);
    }
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div ref={panelRef} className="fixed bottom-[68px] right-4 z-40 flex flex-col items-end gap-3 lg:bottom-6 lg:right-6">

      {open && (
        <div
          className="w-[320px] max-w-[calc(100vw-32px)] overflow-hidden rounded-3xl"
          style={{
            animation: "fb-up 0.22s cubic-bezier(0.34,1.4,0.64,1) both",
            background: "#ffffff",
            boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <div>
              <p className="text-[15px] font-black text-gray-900 tracking-tight">Feedback</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{email}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div
            className="overflow-y-auto px-4 space-y-2"
            style={{ maxHeight: 240, minHeight: messages.length ? 80 : 0 }}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-5 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5DA20]">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M2 2.5h14a.5.5 0 01.5.5v9a.5.5 0 01-.5.5H5.5L2 15.5V3a.5.5 0 010-1z" stroke="#000" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M5.5 7h7M5.5 10h4.5" stroke="#000" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="text-[13px] font-semibold text-gray-700">Got something to say?</p>
                <p className="text-[11px] text-gray-400 leading-relaxed max-w-[180px]">Bug, idea, or just a hi — we read everything.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.is_owner_reply ? "justify-start" : "justify-end"}`}>
                  <div
                    className="max-w-[220px] px-3.5 py-2.5 text-[12.5px] leading-relaxed break-words"
                    style={msg.is_owner_reply
                      ? { background: "#f3f4f6", color: "#111827", borderRadius: "18px 18px 18px 4px" }
                      : { background: "#F5DA20", color: "#000", borderRadius: "18px 18px 4px 18px" }}
                  >
                    {msg.is_owner_reply && (
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">English Nerd</p>
                    )}
                    {msg.content}
                    <p className={`mt-1 text-[9px] ${msg.is_owner_reply ? "text-gray-400" : "text-black/40"}`}>
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="px-4 pb-4 pt-3">
            {sendError && <p className="mb-2 text-center text-[11px] text-red-500">Failed to send. Try again.</p>}
            <form onSubmit={handleSend} className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                placeholder="Write a message…"
                maxLength={1000}
                rows={1}
                disabled={sending}
                className="fb-input flex-1 resize-none rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[12.5px] text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#F5DA20] focus:bg-white focus:ring-2 focus:ring-[#F5DA20]/20 disabled:opacity-50"
                style={{ maxHeight: 80 }}
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#F5DA20] transition hover:bg-[#e8cf1a] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Send"
              >
                {sending ? (
                  <svg className="animate-spin" width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <circle cx="6.5" cy="6.5" r="5" stroke="#000" strokeWidth="1.6" strokeDasharray="15.7" strokeDashoffset="7.85" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M12.5 1.5L6.5 7.5M12.5 1.5L8.5 12.5L6.5 7.5M12.5 1.5L1.5 5.5L6.5 7.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Trigger — on mobile + scrolled: back-to-top; otherwise: open chat */}
      <button
        onClick={() => {
          if (scrolled && !open && window.innerWidth < 1024) {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            setOpen((v) => !v);
          }
        }}
        aria-label={scrolled && !open ? "Back to top" : "Open feedback"}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#F5DA20] transition-all duration-200 hover:scale-105 active:scale-95"
        style={{ boxShadow: "0 4px 20px rgba(245,218,32,0.5), 0 2px 8px rgba(0,0,0,0.2)" }}
      >
        <span
          className="absolute inset-0 flex items-center justify-center transition-all duration-200"
          style={{ opacity: open ? 1 : 0, transform: open ? "scale(1)" : "scale(0.7)" }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M2 2l11 11M13 2L2 13" stroke="#000" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </span>
        <span
          className="absolute inset-0 items-center justify-center transition-all duration-200 lg:flex"
          style={{ opacity: !open && !scrolled ? 1 : 0, transform: !open && !scrolled ? "scale(1)" : "scale(0.7)", display: !open && !scrolled ? "flex" : "none" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2.5h14a.5.5 0 01.5.5v9a.5.5 0 01-.5.5H5.5L2 15.5V3a.5.5 0 010-1z" stroke="#000" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M5.5 7h7M5.5 10h4.5" stroke="#000" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center transition-all duration-200 lg:hidden"
          style={{ opacity: !open && scrolled ? 1 : 0, transform: !open && scrolled ? "scale(1)" : "scale(0.7)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 13V3M3 8l5-5 5 5" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>

        {unread > 0 && !open && !scrolled && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white" style={{ border: "2px solid #0B0B0D" }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <style>{`
        @keyframes fb-up {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
