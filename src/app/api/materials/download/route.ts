import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const URLS: Record<string, string> = {
  "speaking-games":
    "https://kxeypnaqdbgtfzfuskmq.supabase.co/storage/v1/object/sign/materials/Speaking%20games.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMDJjNjhjMS0yYjg5LTRjOTgtYWY0Mi1jZjY5ODg3NzNkYTAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbHMvU3BlYWtpbmcgZ2FtZXMucGRmIiwiaWF0IjoxNzc1MDc4OTY1LCJleHAiOjE5MzI3NTg5NjV9.2yFIgGqN1mK9BlXBb43cFCbsIdr3F2BfUtWJxs_gPrc",
  "common-mistakes":
    "https://kxeypnaqdbgtfzfuskmq.supabase.co/storage/v1/object/sign/materials/100%20Most%20Common%20English%20Mistakes.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMDJjNjhjMS0yYjg5LTRjOTgtYWY0Mi1jZjY5ODg3NzNkYTAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbHMvMTAwIE1vc3QgQ29tbW9uIEVuZ2xpc2ggTWlzdGFrZXMucGRmIiwiaWF0IjoxNzc1MDc4ODIyLCJleHAiOjE5MzI3NTg4MjJ9.j7L0e1uHbb7kfFUCK3VZBceYUoAbEC6sQp8v3Z3js4I",
  "irregular-verbs":
    "https://kxeypnaqdbgtfzfuskmq.supabase.co/storage/v1/object/sign/materials/Irregular%20Verbs.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMDJjNjhjMS0yYjg5LTRjOTgtYWY0Mi1jZjY5ODg3NzNkYTAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbHMvSXJyZWd1bGFyIFZlcmJzLnBkZiIsImlhdCI6MTc3NTA3OTQ0OSwiZXhwIjoxOTMyNzU5NDQ5fQ.XF3xF8BRNO0OvzlWEdCVTqaH_NcN_uN5knRlJI-A41E",
  "irregular-verbs-50":
    "https://kxeypnaqdbgtfzfuskmq.supabase.co/storage/v1/object/sign/materials/50%20irregulat%20verbs.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMDJjNjhjMS0yYjg5LTRjOTgtYWY0Mi1jZjY5ODg3NzNkYTAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbHMvNTAgaXJyZWd1bGF0IHZlcmJzLnBkZiIsImlhdCI6MTc3NTEyNzYxOSwiZXhwIjoxOTMyODA3NjE5fQ.YguXQ1UNsSyNtTDTWpTzD_PjpS8E8DKGaPrq6OOs62M",
  "look-think-speak":
    "https://kxeypnaqdbgtfzfuskmq.supabase.co/storage/v1/object/sign/materials/Look,%20Think,%20Speak!.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMDJjNjhjMS0yYjg5LTRjOTgtYWY0Mi1jZjY5ODg3NzNkYTAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbHMvTG9vaywgVGhpbmssIFNwZWFrIS5wZGYiLCJpYXQiOjE3NzUwNzk0NzYsImV4cCI6MTkzMjc1OTQ3Nn0.q9luvGZfdTxGz6WuHOXEXqpAEd0P6f34H81eXP9mlRY",
  "never-have-i-ever":
    "https://kxeypnaqdbgtfzfuskmq.supabase.co/storage/v1/object/sign/materials/Never%20have%20I%20ever.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMDJjNjhjMS0yYjg5LTRjOTgtYWY0Mi1jZjY5ODg3NzNkYTAiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbHMvTmV2ZXIgaGF2ZSBJIGV2ZXIucGRmIiwiaWF0IjoxNzc1MDc5NDk3LCJleHAiOjE5MzI3NTk0OTd9.wZ0NBiEayuxsqhxpohO7hZpsUkmorM878A2gOnWKnsw",
};

// Where to redirect after login per slug
const RETURN_PAGE: Record<string, string> = {
  "irregular-verbs-50": "/nerd-zone/irregular-verbs",
};

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") ?? "";
  const url = URLS[slug];

  if (!url) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", RETURN_PAGE[slug] ?? "/nerd-zone/my-materials");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(url);
}
