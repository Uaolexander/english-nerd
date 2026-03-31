"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Invisible component — sends a heartbeat to keep the session alive.
 *
 * Behaviour:
 * - If the server says the session was deactivated (kicked: true / 401),
 *   the user is redirected to /login with a clear message.
 * - If there is no session token at all (user not tracked yet, or not logged in),
 *   the interval is stopped immediately — no unnecessary requests.
 * - Network errors are silently ignored and retried on the next beat.
 */
export default function SessionGuard() {
  const router = useRouter();

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const beat = async (): Promise<boolean> => {
      try {
        const res = await fetch("/api/session/heartbeat", { method: "POST" });

        if (res.status === 401) {
          const body = await res.json().catch(() => ({}));
          if (body.kicked) {
            router.push(
              "/login?error=" +
                encodeURIComponent(
                  "You were signed out because this account is active on too many devices. Please log in again."
                )
            );
            router.refresh();
            return false; // stop the interval
          }
        }

        if (res.ok) {
          const body = await res.json().catch(() => ({}));
          if (body.noToken) {
            // No session tracking for this user yet — stop heartbeating
            return false;
          }
        }
      } catch {
        // Network error — ignore, will retry next beat
      }
      return true; // keep going
    };

    const start = async () => {
      const shouldContinue = await beat();
      if (!shouldContinue) return;

      intervalId = setInterval(async () => {
        const shouldContinue = await beat();
        if (!shouldContinue && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }, 45_000);
    };

    start();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [router]);

  return null;
}
