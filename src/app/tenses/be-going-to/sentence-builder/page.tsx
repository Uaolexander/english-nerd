import type { Metadata } from "next";
import SentenceBuilderClient from "./SentenceBuilderClient";

export const metadata: Metadata = {
  title: "Be Going To — Sentence Builder — English Nerd",
  description:
    "Tap the tiles in the correct order to build 'be going to' sentences. Practice affirmative, negative, and question forms.",
  alternates: { canonical: "/tenses/be-going-to/sentence-builder" },
};

export default function Page() {
  return <SentenceBuilderClient />;
}
