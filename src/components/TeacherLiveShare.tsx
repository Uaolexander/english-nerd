"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useIsTeacher } from "@/lib/TeacherContext";

interface Student {
  id: string;
  name: string;
  avatarUrl: string | null;
}

const SECTION_ROOTS = ["grammar", "tenses", "vocabulary", "reading", "listening"];
const TEST_PAGES = ["/tests/grammar", "/tests/tenses", "/tests/vocabulary"];

function isExercisePage(path: string) {
  // Specific full-page tests
  if (TEST_PAGES.some((t) => path === t || path.startsWith(t + "/"))) return true;
  // Section exercise pages need at least 3 segments: /section/level/slug
  const parts = path.split("/").filter(Boolean);
  return parts.length >= 3 && SECTION_ROOTS.includes(parts[0]);
}

function pathToTitle(path: string): string {
  const parts = path.split("/").filter(Boolean);
  const last = parts[parts.length - 1] ?? "";
  return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function TeacherLiveShare() {
  const isTeacher = useIsTeacher();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    if (loaded) return;
    try {
      const res = await fetch("/api/teacher/live-students");
      const data = await res.json() as { ok: boolean; students?: Student[] };
      if (data.ok) setStudents(data.students ?? []);
    } finally {
      setLoaded(true);
    }
  }, [loaded]);

  useEffect(() => {
    if (open) fetchStudents();
  }, [open, fetchStudents]);

  // Close on route change
  useEffect(() => { setOpen(false); setSent(null); }, [pathname]);

  if (!isTeacher || !isExercisePage(pathname)) return null;

  const exerciseTitle = pathToTitle(pathname);
  const exerciseUrl = typeof window !== "undefined" ? window.location.href : pathname;

  async function sendToStudent(student: Student) {
    setSending(student.id);
    setSendError(null);
    try {
      // 1. Create a live session on the server
      const sessionRes = await fetch("/api/teacher/live-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: student.id, exercisePath: pathname }),
      });
      const sessionData = await sessionRes.json() as { ok: boolean; roomId?: string; error?: string };
      if (!sessionData.ok || !sessionData.roomId) {
        throw new Error(sessionData.error ?? "Failed to create session");
      }

      // 2. Build the live URL with room ID
      const base = typeof window !== "undefined" ? window.location.origin : "";
      const liveUrl = `${base}${pathname}?room=${sessionData.roomId}`;

      // 3. Broadcast invite to student — wait for SUBSCRIBED before sending
      const supabase = createClient();
      const channel = supabase.channel(`exercise-invite:${student.id}`);
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Subscribe timeout")), 6000);
        channel.subscribe((status) => {
          if (status === "SUBSCRIBED") { clearTimeout(timer); resolve(); }
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            clearTimeout(timer); reject(new Error(`Channel ${status}`));
          }
        });
      });
      await channel.send({
        type: "broadcast",
        event: "invite",
        payload: { url: liveUrl, title: exerciseTitle, path: pathname, roomId: sessionData.roomId },
      });
      supabase.removeChannel(channel);

      setSent(student.id);
      // Redirect teacher to the live URL so they also join the session
      setTimeout(() => {
        setSent(null);
        setOpen(false);
        window.location.href = liveUrl;
      }, 1200);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(null);
    }
  }

  return (
    <>
      {/* Teacher share button — bottom-left, separate from all right-side widgets */}
      <div className="fixed bottom-[80px] left-4 lg:bottom-6 lg:left-6 z-40">
        <button
          onClick={() => setOpen(true)}
          className="group flex items-center gap-2.5 rounded-2xl bg-violet-600 py-2.5 pl-3.5 pr-4 shadow-lg shadow-violet-900/30 transition-all hover:bg-violet-500 hover:shadow-violet-900/50 hover:-translate-y-0.5 active:scale-95"
        >
          {/* Icon */}
          <div className="flex h-5 w-5 shrink-0 items-center justify-center">
            <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </div>
          {/* Text — hidden on very small screens */}
          <span className="text-sm font-bold text-white leading-none whitespace-nowrap">
            Send to student
          </span>
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                <svg className="h-4 w-4 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900">Send exercise to student</p>
                <p className="truncate text-xs text-slate-400">{exerciseTitle}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Student list */}
            <div className="max-h-72 overflow-y-auto p-3">
              {!loaded ? (
                <div className="flex items-center justify-center py-10">
                  <svg className="h-5 w-5 animate-spin text-violet-500" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                </div>
              ) : students.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm font-semibold text-slate-500">No active students yet.</p>
                  <a href="/account" className="mt-2 block text-xs font-semibold text-violet-500 hover:underline">Invite students in your account →</a>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {students.map((student) => {
                    const isSending = sending === student.id;
                    const isSent = sent === student.id;
                    return (
                      <button
                        key={student.id}
                        onClick={() => sendToStudent(student)}
                        disabled={!!sending || !!sent}
                        className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition w-full ${isSent ? "bg-emerald-50" : "hover:bg-slate-50"}`}
                      >
                        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-black text-violet-600 overflow-hidden">
                          {student.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={student.avatarUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            student.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="flex-1 text-sm font-bold text-slate-800">{student.name}</span>
                        {isSending && (
                          <svg className="h-4 w-4 animate-spin text-violet-500" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                        )}
                        {isSent && (
                          <div className="flex items-center gap-1 text-emerald-600">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            <span className="text-xs font-bold">Sent!</span>
                          </div>
                        )}
                        {!isSending && !isSent && (
                          <svg className="h-3.5 w-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {sendError && (
              <div className="border-t border-red-50 bg-red-50 px-5 py-3">
                <p className="text-xs text-red-600 text-center font-semibold">{sendError}</p>
              </div>
            )}
            {students.length > 0 && !sent && !sendError && (
              <div className="border-t border-slate-100 px-5 py-3">
                <p className="text-[11px] text-slate-400 text-center">Student receives an instant live notification</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
