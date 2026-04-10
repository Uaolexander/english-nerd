import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  // 1. Get logged-in user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL!));
  }

  // 2. Find any active LemonSqueezy subscription for this user
  //    (covers both PRO and Teacher plans)
  const service = createServiceClient();
  const { data: sub } = await service
    .from("subscriptions")
    .select("subscription_id")
    .eq("user_id", user.id)
    .not("subscription_id", "is", null)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!sub?.subscription_id) {
    return NextResponse.redirect(new URL("/pro", process.env.NEXT_PUBLIC_SITE_URL!));
  }

  // 3. Call LemonSqueezy API to get the customer portal URL
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
  if (!apiKey) {
    return NextResponse.redirect(new URL("/pro", process.env.NEXT_PUBLIC_SITE_URL!));
  }

  const res = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${sub.subscription_id}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/vnd.api+json",
    },
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL("/pro", process.env.NEXT_PUBLIC_SITE_URL!));
  }

  const json = await res.json();
  const portalUrl = json?.data?.attributes?.urls?.customer_portal;

  if (!portalUrl) {
    return NextResponse.redirect(new URL("/pro", process.env.NEXT_PUBLIC_SITE_URL!));
  }

  return NextResponse.redirect(portalUrl);
}
