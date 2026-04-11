import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session so it doesn't expire while the user is active
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Single-session enforcement on /account ────────────────────────────────
  if (user && request.nextUrl.pathname.startsWith("/account")) {
    const sessionToken = request.cookies.get("app_session_token")?.value;

    if (sessionToken) {
      const service = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data } = await service
        .from("user_sessions")
        .select("is_active")
        .eq("session_token", sessionToken)
        .single();

      if (!data || !data.is_active) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set(
          "error",
          "You were signed out because this account is active on too many devices. Please log in again."
        );
        const redirect = NextResponse.redirect(url);
        redirect.cookies.delete("app_session_token");
        return redirect;
      }
    }
    // No token yet (first login before this system was deployed) — let through
    // SessionGuard heartbeat will enforce on client side
  }

  // ── Route guards ──────────────────────────────────────────────────────────

  // Protect /account — redirect to /login if not logged in
  if (!user && request.nextUrl.pathname.startsWith("/account")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from /login and /register
  // BUT preserve ?next= so deep links (e.g. teacher invite) still work
  if (
    user &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register")
  ) {
    const next = request.nextUrl.searchParams.get("next");
    const url = request.nextUrl.clone();
    url.pathname = next && next.startsWith("/") ? next : "/account";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/account/:path*", "/login", "/register"],
};
