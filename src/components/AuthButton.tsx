"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useIsPro } from "@/lib/ProContext";
import { useIsTeacher } from "@/lib/TeacherContext";
import { useIsStudent } from "@/lib/StudentContext";

function userInitials(name: string, email: string) {
  if (name.trim()) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

// PRO crown
function ProBadge() {
  return (
    <span className="absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-[#F5DA20] to-amber-500 ring-2 ring-[#0B0B0D] shadow-sm" title="PRO">
      <svg aria-hidden="true" className="h-2.5 w-2.5 text-amber-900" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" />
      </svg>
    </span>
  );
}

// Teacher graduation cap
function TeacherBadge() {
  return (
    <span className="absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-700 ring-2 ring-[#0B0B0D] shadow-sm" title="Teacher">
      <svg aria-hidden="true" className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
      </svg>
    </span>
  );
}

// Student book
function StudentBadge() {
  return (
    <span className="absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 ring-2 ring-[#0B0B0D] shadow-sm" title="Student">
      <svg aria-hidden="true" className="h-2.5 w-2.5 text-amber-900" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
      </svg>
    </span>
  );
}

export default function AuthButton({
  className,
  variant = "button",
  onAction,
}: {
  className?: string;
  variant?: "button" | "avatar" | "drawer";
  onAction?: () => void;
}) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const isPro = useIsPro();
  const isTeacher = useIsTeacher();
  const isStudent = useIsStudent();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Loading placeholder
  if (user === undefined) {
    if (variant === "avatar") {
      return <span className="h-11 w-11 rounded-full bg-white/10 animate-pulse" />;
    }
    return <span className={className} style={{ opacity: 0, pointerEvents: "none" }}>Log in</span>;
  }

  if (user) {
    const avatarUrl = (user.user_metadata?.custom_avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture) as string | undefined;
    const name = (user.user_metadata?.full_name as string) ?? "";
    const initials = userInitials(name, user.email ?? "");

    // Badge priority: teacher > student > pro
    const ringClass = isTeacher
      ? "ring-violet-500/70 hover:ring-violet-500"
      : isStudent
      ? "ring-[#F5DA20]/70 hover:ring-[#F5DA20]"
      : isPro
      ? "ring-[#F5DA20]/70 pro-avatar-ring hover:ring-[#F5DA20]"
      : "ring-white/20 hover:ring-[#F5DA20]/60";

    const accountTitle = isTeacher ? "My Account — Teacher" : isPro ? "My Account — PRO" : "My Account";
    const accountHref = "/account";

    if (variant === "avatar") {
      const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = "/";
      };

      return (
        <div className="flex items-center gap-1.5">
          <Link
            href={accountHref}
            className={`group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-2 transition ${ringClass}`}
            title={accountTitle}
          >
            <div className="relative h-full w-full overflow-hidden rounded-full">
              {avatarUrl ? (
                <>
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-500 text-xs font-black text-white absolute inset-0">
                    {initials}
                  </div>
                  <img src={avatarUrl} alt={name || "Avatar"} referrerPolicy="no-referrer" className="h-full w-full object-cover relative" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-500 text-xs font-black text-white">
                  {initials}
                </div>
              )}
            </div>
            {isTeacher ? <TeacherBadge /> : isStudent ? <StudentBadge /> : isPro ? <ProBadge /> : null}
          </Link>

          {/* Sign out — small, subtle */}
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/20 transition hover:bg-white/8 hover:text-white/50"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      );
    }

    if (variant === "drawer") {
      const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = "/";
      };

      return (
        <div className="flex flex-col gap-2">
          <Link
            href={accountHref}
            onClick={onAction}
            className="flex w-full items-center justify-center rounded-xl bg-[#F5DA20] px-4 py-3 text-sm font-bold text-black hover:opacity-90"
          >
            Account
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </div>
      );
    }

    return (
      <Link href={accountHref} className={className}>
        Account
      </Link>
    );
  }

  if (variant === "drawer") {
    return (
      <Link
        href="/login"
        onClick={onAction}
        className="flex w-full items-center justify-center rounded-xl bg-[#F5DA20] px-4 py-3 text-sm font-bold text-black hover:opacity-90"
      >
        Log in
      </Link>
    );
  }

  return (
    <Link href="/login" className={className}>
      Log in
    </Link>
  );
}
