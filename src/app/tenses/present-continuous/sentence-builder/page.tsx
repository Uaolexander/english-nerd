import type { Metadata } from "next";
import SentenceBuilderClient from "./SentenceBuilderClient";

export const metadata: Metadata = {
  title: "Present Continuous Sentence Builder — English Nerd",
  description:
    "Rearrange scrambled words to build correct Present Continuous sentences. Practice affirmative, negative, and question forms. Free A2 interactive English exercise.",
  alternates: { canonical: "/tenses/present-continuous/sentence-builder" },
};

export default function Page() {
  return <SentenceBuilderClient />;
}
