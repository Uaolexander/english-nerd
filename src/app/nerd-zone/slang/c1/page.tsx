import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import SlangC1Client from "./SlangC1Client";

export const metadata: Metadata = {
  title: "Slang C1 — Advanced Cultural English Slang | English Nerd",
  description: "Master 12 sophisticated C1 slang terms that describe cultural and social phenomena. Download a free printable worksheet with exercises and answer key.",
  keywords: ["English slang C1", "advanced cultural slang", "C1 informal English", "social media vocabulary", "contemporary English terms"],
  alternates: { canonical: "/nerd-zone/slang/c1" },
  openGraph: {
    title: "Slang C1 — Advanced Cultural English Slang | English Nerd",
    description: "12 sophisticated C1 cultural slang terms + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/slang/c1",
    type: "article",
  },
};

export default async function SlangC1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;
  return <SlangC1Client isPro={isPro} />;
}
