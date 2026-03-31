"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function AuthButton({ className }: { className?: string }) {
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined = loading

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Loading — render an invisible placeholder so layout doesn't shift
  if (user === undefined) {
    return <span className={className} style={{ opacity: 0, pointerEvents: "none" }}>Log in</span>;
  }

  if (user) {
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
