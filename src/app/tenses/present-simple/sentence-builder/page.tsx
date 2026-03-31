import type { Metadata } from "next";
import SentenceBuilderClient from "./SentenceBuilderClient";

export const metadata: Metadata = {
  title: "Present Simple Sentence Builder — English Nerd",
  description:
    "Rearrange scrambled words to build correct Present Simple sentences. Practice affirmative, negative, and question forms. Free A1 interactive English exercise.",
  alternates: { canonical: "/tenses/present-simple/sentence-builder" },
};

export default function Page() {
  return <SentenceBuilderClient />;
}
