"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  content: string;
  image_url: string | null;
  is_owner_reply: boolean;
  is_read: boolean;
  created_at: string;
};

type Props = {
  email: string;
  plan: "PRO" | "Teacher" | "Student" | "Free";
};

async function compressToJpeg(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const blobUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(blobUrl);
      const MAX = 1200;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
        else { width = Math.round(width * MAX / height); height = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg", 0.85);
    };
    img.onerror = () => { URL.revokeObjectURL(blobUrl); resolve(file); };
    img.src = blobUrl;
  });
}

export default function FeedbackWidget({ email, plan }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const [sendError, setSendError] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  async function handleImageFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 8 * 1024 * 1024) { setSendError(true); setTimeout(() => setSendError(false), 3000); return; }
    setImageUploading(true);
    try {
      const compressed = await compressToJpeg(file);
      const supabase = createClient();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      const { error } = await supabase.storage.from("feedback-images").upload(path, compressed, {
        contentType: "image/jpeg",
        upsert: false,
      });
      if (!error) {
        const { data } = supabase.storage.from("feedback-images").getPublicUrl(path);
        setPendingImage(data.publicUrl);
      }
    } catch { /* ignore */ }
    setImageUploading(false);
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    handleImageFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    // Only clear if leaving the panel itself (not a child)
    if (!panelRef.current?.contains(e.relatedTarget as Node)) setDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const hasText = !!input.trim();
    const hasImage = !!pendingImage;
    if (!hasText && !hasImage) return;
    if (sending) return;

    const content = input.trim();
    const imageUrl = pendingImage;
    setInput("");
    setPendingImage(null);
    setSending(true);
    setSendError(false);

    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [...prev, {
      id: tempId,
      content,
      image_url: imageUrl,
      is_owner_reply: false,
      is_read: true,
      created_at: new Date().toISOString(),
    }]);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, plan, page: window.location.pathname, imageUrl }),
      });
      if (!res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setSendError(true);
        setInput(content);
        setPendingImage(imageUrl);
        setTimeout(() => setSendError(false), 3000);
      } else {
        await fetchMessages();
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setSendError(true);
      setInput(content);
      setPendingImage(imageUrl);
      setTimeout(() => setSendError(false), 3000);
    } finally {
      setSending(false);
    }
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div ref={panelRef} className="fixed bottom-[80px] right-4 z-40 flex flex-col items-end gap-3 lg:bottom-6 lg:right-6">

      {open && (
        <div
          className="relative w-[320px] max-w-[calc(100vw-32px)] overflow-hidden rounded-3xl"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            animation: "fb-up 0.22s cubic-bezier(0.34,1.4,0.64,1) both",
            background: "#ffffff",
            boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.15)",
            outline: dragOver ? "2px dashed #F5DA20" : "none",
            outlineOffset: "0px",
          }}
        >
          {/* Drag overlay */}
          {dragOver && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-3xl bg-white/90 backdrop-blur-sm pointer-events-none">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="6" width="28" height="20" rx="4" stroke="#F5DA20" strokeWidth="2"/>
                <circle cx="11" cy="13" r="3" stroke="#F5DA20" strokeWidth="2"/>
                <path d="M2 22l7-7 5 5 5-6 11 9" stroke="#F5DA20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-[13px] font-bold text-gray-700">Drop image here</p>
            </div>
          )}
          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-5 pb-3">
            <div>
              <p className="text-[15px] font-black text-gray-900 tracking-tight">Send feedback</p>
              <p className="text-[11px] text-gray-400 mt-0.5">We reply within 1–3 days</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition mt-0.5"
              aria-label="Close"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Messages thread */}
          {messages.length > 0 && (
            <div className="overflow-y-auto px-4 space-y-3 pb-1" style={{ maxHeight: 240 }}>
              {messages.map((msg) => (
                <div key={msg.id} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    {msg.is_owner_reply ? (
                      <span className="text-[9px] font-black uppercase tracking-widest text-violet-500">English Nerd</span>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">You</span>
                    )}
                    <span className="text-[9px] text-gray-300">·</span>
                    <span className="text-[9px] text-gray-300">{formatTime(msg.created_at)}</span>
                  </div>
                  <div className={`rounded-xl overflow-hidden ${msg.is_owner_reply ? "bg-violet-50" : "bg-gray-50"}`}>
                    {msg.image_url && (
                      <a href={msg.image_url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={msg.image_url}
                          alt="Image"
                          className="w-full max-h-[180px] object-cover"
                        />
                      </a>
                    )}
                    {msg.content && (
                      <p className={`text-[12.5px] leading-relaxed break-words px-3 py-2 ${msg.is_owner_reply ? "text-gray-800" : "text-gray-700"}`}>
                        {msg.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Empty state */}
          {messages.length === 0 && (
            <div className="px-5 pb-1">
              <p className="text-[12px] text-gray-400 leading-relaxed">
                Bug, idea, or just a hi — write anything. We read everything and reply personally.
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="mx-4 my-3 border-t border-gray-100" />

          {/* Image preview */}
          {(pendingImage || imageUploading) && (
            <div className="px-4 pb-2">
              <div className="relative inline-block">
                {imageUploading ? (
                  <div className="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                  </div>
                ) : pendingImage ? (
                  <>
                    <img src={pendingImage} alt="" className="h-16 w-16 rounded-xl object-cover border border-gray-200" />
                    <button
                      onClick={() => setPendingImage(null)}
                      className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-900 transition"
                      aria-label="Remove image"
                    >
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                        <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="px-4 pb-4">
            {sendError && <p className="mb-2 text-[11px] text-red-500">Failed to send. Try again.</p>}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
            <form onSubmit={handleSend} className="flex flex-col gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                placeholder={pendingImage ? "Add a caption… (optional)" : "Write your message…"}
                maxLength={1000}
                rows={3}
                disabled={sending}
                className="fb-input w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[12.5px] text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#F5DA20] focus:bg-white focus:ring-2 focus:ring-[#F5DA20]/20 disabled:opacity-50"
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={sending || imageUploading}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition disabled:opacity-30"
                  aria-label="Attach image"
                  title="Attach image"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                    <circle cx="5.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M1 11l3.5-3.5L7 10l3-3 5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  type="submit"
                  disabled={(!input.trim() && !pendingImage) || sending || imageUploading}
                  className="flex items-center gap-1.5 rounded-xl bg-[#F5DA20] px-3.5 py-1.5 text-[12px] font-bold text-black transition hover:bg-[#e8cf1a] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Send"
                >
                  {sending ? (
                    <svg className="animate-spin" width="11" height="11" viewBox="0 0 13 13" fill="none">
                      <circle cx="6.5" cy="6.5" r="5" stroke="#000" strokeWidth="1.6" strokeDasharray="15.7" strokeDashoffset="7.85" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                      <path d="M12.5 1.5L6.5 7.5M12.5 1.5L8.5 12.5L6.5 7.5M12.5 1.5L1.5 5.5L6.5 7.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => {
          if (scrolled && !open) {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            setOpen((v) => !v);
          }
        }}
        aria-label={scrolled && !open ? "Back to top" : "Open feedback"}
        title={scrolled && !open ? "Back to top" : "Send feedback"}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#F5DA20] transition-all duration-200 hover:scale-105 active:scale-95"
        style={{ boxShadow: "0 4px 20px rgba(245,218,32,0.5), 0 2px 8px rgba(0,0,0,0.2)" }}
      >
        <span className="absolute inset-0 flex items-center justify-center transition-all duration-200"
          style={{ opacity: open ? 1 : 0, transform: open ? "scale(1)" : "scale(0.6)" }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M2 2l11 11M13 2L2 13" stroke="#000" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </span>
        <span className="absolute inset-0 flex items-center justify-center transition-all duration-200"
          style={{ opacity: !open && !scrolled ? 1 : 0, transform: !open && !scrolled ? "scale(1)" : "scale(0.6)" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2.5h14a.5.5 0 01.5.5v9a.5.5 0 01-.5.5H5.5L2 15.5V3a.5.5 0 010-1z" stroke="#000" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M5.5 7h7M5.5 10h4.5" stroke="#000" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </span>
        <span className="absolute inset-0 flex items-center justify-center transition-all duration-200"
          style={{ opacity: !open && scrolled ? 1 : 0, transform: !open && scrolled ? "scale(1)" : "scale(0.6)" }}>
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
