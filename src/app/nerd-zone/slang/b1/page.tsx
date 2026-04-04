import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import SlangB1Client from "./SlangB1Client";

export const metadata: Metadata = {
  title: "Slang B1 — Intermediate Informal English | English Nerd",
  description: "Master 12 essential B1 English slang words used in social media and everyday conversation. Download a free printable worksheet with exercises and answer key.",
  keywords: ["English slang B1", "intermediate slang", "social media English slang", "B1 informal English", "common internet slang"],
  alternates: { canonical: "/nerd-zone/slang/b1" },
  openGraph: {
    title: "Slang B1 — Intermediate Informal English | English Nerd",
    description: "12 essential B1 slang words + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/slang/b1",
    type: "article",
  },
};

export default async function SlangB1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;
  return <SlangB1Client isPro={isPro} />;
}
