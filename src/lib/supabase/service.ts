import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses RLS.
 * Use ONLY in server-side code (API routes, server actions).
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the client.
 */
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
