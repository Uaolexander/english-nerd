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
  const [show, setShow] = useState(false);

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
          requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
        })
        .subscribe();
    }

    subscribe();
    return () => { if (channel) supabase.removeChannel(channel); };
  }, [isStudent]);

  if (!visible || !invite) return null;

  function dismiss() {
    setShow(false);
    setTimeout(() => { setVisible(false); setInvite(null); }, 280);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}
        onClick={dismiss}
      />

      {/* Card */}
      <div
        className={`relative w-full max-w-[360px] transition-all duration-300 ease-out ${show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-3"}`}
      >
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_24px_64px_-8px_rgba(0,0,0,0.28)] ring-1 ring-black/[0.05]">

          {/* Top illustration area */}
          <div className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-violet-50 to-white px-6 pb-6 pt-8">
            {/* Concentric rings */}
            <div className="absolute h-40 w-40 rounded-full border border-violet-100" />
            <div className="absolute h-28 w-28 rounded-full border border-violet-150 animate-ping opacity-20 [animation-duration:2.5s]" />
            <div className="absolute h-24 w-24 rounded-full border border-violet-200 animate-ping opacity-25 [animation-duration:2.5s] [animation-delay:0.4s]" />

            {/* Icon */}
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-600/25">
              <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>

            {/* Label above */}
            <div className="mt-5 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
              </span>
              <p className="text-[11px] font-bold uppercase tracking-widest text-violet-500">Live Invitation</p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 pt-4">
            <h2 className="text-center text-[18px] font-black leading-snug text-slate-900">
              Your teacher is inviting<br />you to an exercise
            </h2>

            {/* Exercise tile */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                <svg className="h-4 w-4 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>
              <p className="flex-1 truncate text-sm font-bold text-slate-800">{invite.title}</p>
            </div>

            {/* CTA */}
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={invite.url}
                onClick={dismiss}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3.5 text-sm font-black text-white shadow-sm shadow-violet-600/20 transition-all duration-150 hover:bg-violet-500 active:scale-[0.98]"
              >
                Open Exercise
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </a>
              <button
                onClick={dismiss}
                className="w-full cursor-pointer rounded-2xl py-2.5 text-sm font-semibold text-slate-400 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-600"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
