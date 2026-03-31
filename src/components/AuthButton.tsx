"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

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
      return <span className="h-9 w-9 rounded-full bg-white/10 animate-pulse" />;
    }
    return <span className={className} style={{ opacity: 0, pointerEvents: "none" }}>Log in</span>;
  }

  if (user) {
    const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
    const name = (user.user_metadata?.full_name as string) ?? "";
    const initials = userInitials(name, user.email ?? "");

    if (variant === "avatar") {
      return (
        <Link
          href="/account"
          className="group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-2 ring-white/20 transition hover:ring-[#F5DA20]/60 overflow-hidden"
          title="My Account"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={name || "Avatar"} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-500 text-[11px] font-black text-white">
              {initials}
            </div>
          )}
        </Link>
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
