"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useIsStudent } from "@/lib/StudentContext";

interface Invite {
  url: string;
  title: string;
  path: string;
}

export default function ExerciseInviteListener() {
  const isStudent = useIsStudent();
  const [invite, setInvite] = useState<Invite | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isStudent) return;

    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function subscribe() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase.channel(`exercise-invite:${user.id}`);
      channel
        .on("broadcast", { event: "invite" }, ({ payload }) => {
          const p = payload as Invite;
          setInvite(p);
          setVisible(true);
        })
        .subscribe();
    }

    subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [isStudent]);

  if (!visible || !invite) return null;

  function dismiss() {
    setVisible(false);
    setTimeout(() => setInvite(null), 300);
  }

  return (
    <div
      className={`fixed bottom-20 left-1/2 z-50 -translate-x-1/2 lg:bottom-6 transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      style={{ width: "min(calc(100vw - 32px), 400px)" }}
    >
      <div className="rounded-2xl bg-white shadow-2xl shadow-black/20 ring-1 ring-black/[0.06] overflow-hidden">
        {/* Top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-purple-500" />

        <div className="flex items-start gap-3 p-4">
          {/* Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100">
            <svg className="h-5 w-5 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide">Your teacher sent you an exercise</p>
            <p className="mt-0.5 text-sm font-black text-slate-900 leading-snug truncate">{invite.title}</p>
            <p className="mt-0.5 text-[11px] text-slate-400 truncate">{invite.url.replace(/^https?:\/\/[^/]+/, "")}</p>
          </div>

          {/* Close */}
          <button
            onClick={dismiss}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-4 pb-4">
          <a
            href={invite.url}
            onClick={dismiss}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-black text-white shadow-sm hover:bg-violet-500 transition"
          >
            Open Exercise
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
          <button
            onClick={dismiss}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 transition"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
