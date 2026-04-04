import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import SlangA1Client from "./SlangA1Client";

export const metadata: Metadata = {
  title: "Slang A1 — Basic Informal English | English Nerd",
  description: "Learn 24 essential A1-A2 informal English words and expressions used every day. Download a free printable fill-in-the-blank worksheet with answer key.",
  keywords: ["English slang A1", "basic informal English", "everyday informal English", "beginner English slang", "informal English expressions"],
  alternates: { canonical: "/nerd-zone/slang" },
  openGraph: {
    title: "Slang A1 — Basic Informal English | English Nerd",
    description: "24 essential A1-A2 informal words + free printable worksheet with exercises and answer key.",
    url: "https://englishnerd.cc/nerd-zone/slang",
    type: "article",
  },
};

export default async function SlangA1Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isPro = user ? await getIsPro(supabase, user.id) : false;
  return <SlangA1Client isPro={isPro} />;
}
