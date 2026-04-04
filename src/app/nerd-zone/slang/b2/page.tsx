import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import SlangB2Client from "./SlangB2Client";

export const metadata: Metadata = {
  title: "Slang B2 — Upper-Intermediate English Slang | English Nerd",
  description: "Learn 12 popular B2 Gen Z and internet slang terms used in 2024–2025 English. Download a free printable worksheet with exercises and answer key.",
  keywords: ["English slang B2", "Gen Z slang", "internet slang 2024", "B2 informal English", "modern English slang"],
  alternates: { canonical: "/nerd-zone/slang/b2" },
  openGraph: {
    title: "Slang B2 — Upper-Intermediate English Slang | English Nerd",
    description: "12 popular B2 Gen Z slang terms + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/slang/b2",
    type: "article",
  },
};

export default async function SlangB2Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;
  return <SlangB2Client isPro={isPro} />;
}
