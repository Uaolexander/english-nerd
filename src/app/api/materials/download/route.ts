import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

// Map slug -> storage path inside the "materials" bucket
const FILE_PATHS: Record<string, string> = {
  "speaking-games":    "Speaking games.pdf",
  "common-mistakes":   "100 Most Common English Mistakes.pdf",
  "irregular-verbs":   "Irregular Verbs.pdf",
  "irregular-verbs-50":"50 irregular verbs.pdf",
  "look-think-speak":  "Look, Think, Speak!.pdf",
  "never-have-i-ever": "Never have I ever.pdf",
};

// Where to redirect after login per slug
const RETURN_PAGE: Record<string, string> = {
  "irregular-verbs-50": "/nerd-zone/irregular-verbs",
};

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") ?? "";
  const filePath = FILE_PATHS[slug];

  if (!filePath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", RETURN_PAGE[slug] ?? "/nerd-zone/my-materials");
    return NextResponse.redirect(loginUrl);
  }

  const service = createServiceClient();
  const { data, error } = await service.storage
    .from("materials")
    .createSignedUrl(filePath, 60 * 60); // 1 hour

  if (error || !data?.signedUrl) {
    console.error("[materials/download] signed URL error:", error);
    return NextResponse.json({ error: "Could not generate download link." }, { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl);
}
