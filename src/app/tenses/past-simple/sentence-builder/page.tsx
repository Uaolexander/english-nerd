import type { Metadata } from "next";
import SentenceBuilderClient from "./SentenceBuilderClient";

export const metadata: Metadata = {
  title: "Past Simple Sentence Builder — English Nerd",
  description:
    "Build Past Simple sentences by tapping word tiles in the correct order. Practice regular verbs, irregular verbs, negatives, and questions. Free A2 interactive English exercise.",
  alternates: { canonical: "/tenses/past-simple/sentence-builder" },
};

export default function Page() {
  return <SentenceBuilderClient />;
}
