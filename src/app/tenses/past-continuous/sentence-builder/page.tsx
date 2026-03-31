import type { Metadata } from "next";
import SentenceBuilderClient from "./SentenceBuilderClient";

export const metadata: Metadata = {
  title: "Past Continuous Sentence Builder — English Nerd",
  description:
    "Build Past Continuous sentences by arranging word tiles. Practice was/were + verb-ing in affirmative, negative, and question forms. Free A2 English exercise.",
  alternates: { canonical: "/tenses/past-continuous/sentence-builder" },
};

export default function Page() {
  return <SentenceBuilderClient />;
}
