import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing Portal — English Nerd",
  robots: { index: false, follow: false },
};

export default async function BillingPortalPage() {
  // 1. Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/billing-portal");
  }

  // 2. Find active LemonSqueezy subscription (PRO or Teacher)
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
    redirect("/pro");
  }

  // 3. Fetch customer portal URL from LemonSqueezy
  const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
  if (!apiKey) {
    redirect("/pro");
  }

  const res = await fetch(
    `https://api.lemonsqueezy.com/v1/subscriptions/${sub.subscription_id}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.api+json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    redirect("/billing-portal/error");
  }

  const json = await res.json();
  const portalUrl = json?.data?.attributes?.urls?.customer_portal;

  if (!portalUrl) {
    redirect("/billing-portal/error");
  }

  redirect(portalUrl);
}
