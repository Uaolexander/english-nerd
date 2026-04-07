import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createServiceClient } from "@/lib/supabase/service";
import { sendProGainedEmail, sendProExpiredEmail } from "@/lib/email";

// Required: Node.js runtime for crypto and Supabase admin API
export const runtime = "nodejs";

// Validate env vars at request time — deferred to avoid build failures
function validateEnv() {
  const REQUIRED_ENV = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "LEMON_SQUEEZY_WEBHOOK_SECRET",
  ] as const;

  for (const key of REQUIRED_ENV) {
    const val = process.env[key];
    if (!val) {
      throw new Error(`[webhook] Missing env var: ${key}`);
    }
    if (!/^[\x20-\x7E]+$/.test(val)) {
      throw new Error(
        `[webhook] Env var ${key} contains non-ASCII characters. Re-paste it from the source.`
      );
    }
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface LemonAttributes {
  status: string;
  customer_id: number;
  order_id?: number;
  product_id?: number;
  variant_id?: number;
  renews_at?: string | null;
  ends_at?: string | null;
  trial_ends_at?: string | null;
  user_email?: string;
  first_order_item?: {
    product_id: number;
    variant_id: number;
    order_id: number;
  };
}

interface LemonMeta {
  event_name: string;
  webhook_id?: string;
  custom_data?: Record<string, unknown>;
}

interface LemonData {
  id: string;
  type: string;
  attributes: LemonAttributes;
}

interface LemonPayload {
  meta: LemonMeta;
  data: LemonData;
}

// ─── Handled events ───────────────────────────────────────────────────────────

const HANDLED_EVENTS = new Set([
  "order_created",
  "subscription_created",
  "subscription_updated",
  "subscription_cancelled",
  "subscription_resumed",
  "subscription_expired",
  "subscription_paused",
  "subscription_unpaused",
  "subscription_payment_success",
  "subscription_payment_failed",
  "subscription_payment_recovered",
  "subscription_payment_refunded",
  "subscription_plan_changed",
]);

// ─── Pro logic ────────────────────────────────────────────────────────────────

// "paid" = one-time or initial payment confirmed by LS
// "on_trial" = LS trial status (alternative to "trialing")
const PRO_STATUSES = new Set(["active", "trialing", "on_trial", "paid", "past_due"]);

function deriveIsPro(
  eventName: string,
  status: string,
  endsAt: string | null
): boolean {
  // Refund → revoke immediately
  if (eventName === "subscription_payment_refunded") return false;

  // Cancelled → keep access until ends_at (paid billing period)
  if (status === "cancelled" && endsAt) {
    return new Date(endsAt) > new Date();
  }

  // expired / paused → no access
  if (status === "expired" || status === "paused") return false;

  // active / trialing / past_due (payment_failed grace period) → access
  return PRO_STATUSES.has(status);
}

// ─── Signature verification ───────────────────────────────────────────────────

async function verifySignature(req: Request, rawBody: string): Promise<boolean> {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] LEMON_SQUEEZY_WEBHOOK_SECRET is not set");
    return false;
  }
  const signature = req.headers.get("x-signature");
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// PostgreSQL error code 23505 = unique_violation.
// We additionally check the constraint name so we only swallow conflicts
// on webhook_id — not on subscription_id or any other unique column.
function isWebhookIdConflict(error: { code?: string; message?: string }): boolean {
  if (error.code !== "23505") return false;
  // Supabase surfaces the constraint name inside the message when details aren't exposed
  return (
    error.message?.includes("subscriptions_webhook_id_key") === true
  );
}

function extractEmail(attrs: LemonAttributes): string | null {
  if (attrs.user_email) return attrs.user_email.toLowerCase().trim();
  return null;
}

function extractIds(data: LemonData) {
  const attrs = data.attributes;
  const customerId = String(attrs.customer_id ?? "");
  const subscriptionId = data.type === "subscriptions" ? data.id : null;
  const orderId = attrs.order_id
    ? String(attrs.order_id)
    : attrs.first_order_item?.order_id
      ? String(attrs.first_order_item.order_id)
      : null;
  const productId = attrs.product_id
    ? String(attrs.product_id)
    : attrs.first_order_item?.product_id
      ? String(attrs.first_order_item.product_id)
      : null;
  const variantId = attrs.variant_id
    ? String(attrs.variant_id)
    : attrs.first_order_item?.variant_id
      ? String(attrs.first_order_item.variant_id)
      : null;
  return { customerId, subscriptionId, orderId, productId, variantId };
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  validateEnv();
  const rawBody = await req.text();

  // 1. Verify HMAC signature
  const valid = await verifySignature(req, rawBody);
  if (!valid) {
    console.warn("[webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // 2. Parse payload
  let payload: LemonPayload;
  try {
    payload = JSON.parse(rawBody) as LemonPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = payload.meta?.event_name;
  const webhookId = payload.meta?.webhook_id ?? null;

  console.log(`[webhook] event=${eventName} webhookId=${webhookId}`);

  // 3. Skip unhandled events — return 200 so LS doesn't retry
  if (!HANDLED_EVENTS.has(eventName)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const supabase = createServiceClient();

  // 4. Idempotency — unique index on webhook_id handles concurrent races,
  //    this check avoids unnecessary DB work on known duplicates
  if (webhookId) {
    const { data: dup } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("webhook_id", webhookId)
      .maybeSingle();
    if (dup) {
      console.log(`[webhook] Duplicate webhookId=${webhookId}, skipping`);
      return NextResponse.json({ ok: true, duplicate: true });
    }
  }

  // 5. Extract fields
  const attrs = payload.data.attributes;
  const { customerId, subscriptionId, orderId, productId, variantId } = extractIds(payload.data);
  const customerEmail = extractEmail(attrs);

  if (!customerEmail) {
    console.error("[webhook] Missing customer email", JSON.stringify(attrs));
    return NextResponse.json({ error: "Missing customer email" }, { status: 422 });
  }

  const status      = attrs.status ?? "unknown";
  const endsAt      = attrs.ends_at ?? null;
  const renewsAt    = attrs.renews_at ?? null;
  const trialEndsAt = attrs.trial_ends_at ?? null;
  const isPro       = deriveIsPro(eventName, status, endsAt);

  // 6. Resolve user_id by email — O(1) via SQL function (see subscriptions.sql)
  let userId: string | null = null;
  const { data: lookedUpId, error: userLookupError } = await supabase.rpc(
    "get_user_id_by_email",
    { lookup_email: customerEmail }
  );

  if (userLookupError) {
    console.error("[webhook] User lookup error:", userLookupError);
    return NextResponse.json({ error: "User lookup failed" }, { status: 500 });
  }

  if (lookedUpId) {
    userId = lookedUpId as string;
  } else {
    // User hasn't registered yet — subscription saved with user_id = null.
    // The DB trigger (link_subscription_on_signup) will link it when they register.
    console.warn(`[webhook] No registered user for email=${customerEmail}, will link on signup`);
  }

  // 7. Upsert subscription row
  if (subscriptionId) {
    // Recurring subscription — upsert on unique subscription_id
    const { error } = await supabase.from("subscriptions").upsert(
      {
        subscription_id: subscriptionId,
        user_id:         userId,
        customer_id:     customerId,
        order_id:        orderId,
        product_id:      productId,
        variant_id:      variantId,
        customer_email:  customerEmail,
        status,
        is_pro:          isPro,
        renews_at:       renewsAt,
        ends_at:         endsAt,
        trial_ends_at:   trialEndsAt,
        last_event_name: eventName,
        webhook_id:      webhookId,
        updated_at:      new Date().toISOString(),
      },
      { onConflict: "subscription_id", ignoreDuplicates: false }
    );
    if (error) {
      if (isWebhookIdConflict(error)) {
        console.log(`[webhook] Race: duplicate webhook_id=${webhookId}, skipping`);
        return NextResponse.json({ ok: true, duplicate: true });
      }
      console.error("[webhook] Upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    // One-time order — plain insert (no Pro granted in subscription SaaS model)
    const { error } = await supabase.from("subscriptions").insert({
      user_id:         userId,
      customer_id:     customerId,
      order_id:        orderId,
      product_id:      productId,
      variant_id:      variantId,
      customer_email:  customerEmail,
      status:          "paid",
      is_pro:          false,
      last_event_name: eventName,
      webhook_id:      webhookId,
      updated_at:      new Date().toISOString(),
    });
    if (error) {
      if (isWebhookIdConflict(error)) {
        console.log(`[webhook] Race: duplicate webhook_id=${webhookId}, skipping`);
        return NextResponse.json({ ok: true, duplicate: true });
      }
      console.error("[webhook] Insert (order) error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // 8. Sync is_pro to user_metadata — merge with existing fields to avoid data loss
  if (userId) {
    // Fetch current metadata first so we don't overwrite other fields
    const { data: currentUserData, error: fetchError } =
      await supabase.auth.admin.getUserById(userId);

    if (fetchError) {
      console.error("[webhook] Failed to fetch user for metadata merge:", fetchError);
    } else {
      const existingMeta = currentUserData?.user?.user_metadata ?? {};
      const { error: metaError } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { ...existingMeta, is_pro: isPro },
      });
      if (metaError) {
        // Non-fatal — subscriptions table is the source of truth
        console.error("[webhook] Failed to update user metadata:", metaError);
      }
    }
  }

  // ── Send PRO status emails (fire-and-forget) ─────────────────────────────
  if (userId && customerEmail) {
    void (async () => {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", userId)
          .maybeSingle();
        const name = (profile?.full_name as string | null) ?? null;

        const gainEvents = new Set(["subscription_created", "subscription_resumed", "subscription_payment_recovered"]);
        const loseEvents = new Set(["subscription_expired", "subscription_payment_refunded"]);

        if (isPro && gainEvents.has(eventName)) {
          await sendProGainedEmail(customerEmail, name, endsAt ?? renewsAt);
        } else if (!isPro && loseEvents.has(eventName)) {
          await sendProExpiredEmail(customerEmail, name);
        }
      } catch (e) {
        console.error("[webhook] email error:", e);
      }
    })();
  }

  console.log(
    `[webhook] OK event=${eventName} email=${customerEmail} userId=${userId} status=${status} isPro=${isPro}`
  );

  return NextResponse.json({ ok: true });
}
