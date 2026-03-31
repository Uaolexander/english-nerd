import { NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/turnstile";

export async function POST(request: Request) {
  try {
    const { token } = await request.json() as { token?: string };

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Missing CAPTCHA token." },
        { status: 400 }
      );
    }

    const valid = await verifyTurnstile(token);

    if (!valid) {
      return NextResponse.json(
        { ok: false, error: "CAPTCHA verification failed. Please try again." },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}
