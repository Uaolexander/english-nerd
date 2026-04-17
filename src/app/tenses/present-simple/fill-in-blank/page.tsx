import type { Metadata } from "next";
import FillInBlankClient from "./FillInBlankClient";

export const metadata: Metadata = {
  title: "Present Simple Fill in the Blank — English Nerd",
  description:
    "Practice Present Simple by typing the correct verb form. Affirmative, negative and question forms. Free A1 English writing exercise with instant feedback.",
  alternates: { canonical: "/tenses/present-simple/fill-in-blank" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ room?: string }> }) {
  const { room } = await searchParams;
  return <FillInBlankClient roomId={room ?? null} />;
}
