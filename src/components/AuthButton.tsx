"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useIsPro } from "@/lib/ProContext";

function userInitials(name: string, email: string) {
  if (name.trim()) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export default function AuthButton({
  className,
  variant = "button",
}: {
  className?: string;
  variant?: "button" | "avatar";
}) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const isPro = useIsPro();

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
    const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
    const name = (user.user_metadata?.full_name as string) ?? "";
    const initials = userInitials(name, user.email ?? "");

    if (variant === "avatar") {
      const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = "/";
      };

      return (
        <div className="flex items-center gap-1.5">
          <Link
            href="/account"
            className={`group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-2 transition ${isPro ? "ring-[#F5DA20]/70 pro-avatar-ring hover:ring-[#F5DA20]" : "ring-white/20 hover:ring-[#F5DA20]/60"}`}
            title={isPro ? "My Account — PRO" : "My Account"}
          >
            <div className="h-full w-full overflow-hidden rounded-full">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name || "Avatar"} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-500 text-xs font-black text-white">
                  {initials}
                </div>
              )}
            </div>
            {isPro && (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gradient-to-br from-[#F5DA20] to-amber-500 ring-2 ring-[#0B0B0D] shadow-sm" title="PRO">
                <svg aria-hidden="true" className="h-2.5 w-2.5 text-amber-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5zm0 2h14v2H5v-2z" />
                </svg>
              </span>
            )}
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

    return (
      <Link href="/account" className={className}>
        Account
      </Link>
    );
  }

  return (
    <Link href="/login" className={className}>
      Log in
    </Link>
  );
}
