const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("[turnstile] TURNSTILE_SECRET_KEY is not set");
    return false;
  }

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(5000),
    });

    const data = await res.json() as { success: boolean; "error-codes"?: string[] };

    if (!data.success) {
      console.error("[turnstile] verification failed:", data["error-codes"]);
    }

    return data.success === true;
  } catch (err) {
    console.error("[turnstile] fetch error:", err);
    return false;
  }
}
