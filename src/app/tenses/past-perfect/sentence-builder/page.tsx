import type { Metadata } from "next";
import SentenceBuilderClient from "./SentenceBuilderClient";

export const metadata: Metadata = {
  title: "Past Perfect Sentence Builder | English Nerd",
  description:
    "Build Past Perfect sentences by arranging word tiles in the correct order. 30 interactive exercises covering affirmative, negative, and question forms.",
  alternates: { canonical: "/tenses/past-perfect/sentence-builder" },
};

export default function Page() {
  return <SentenceBuilderClient />;
}
