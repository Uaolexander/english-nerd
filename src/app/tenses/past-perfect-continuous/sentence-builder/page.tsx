import type { Metadata } from "next";
import SentenceBuilderClient from "./SentenceBuilderClient";

export const metadata: Metadata = {
  title: "Past Perfect Continuous Sentence Builder | English Nerd",
  description:
    "Rearrange word tiles to build correct Past Perfect Continuous sentences. 30 exercises covering had been + -ing, negative, questions, and time expressions.",
  alternates: { canonical: "/tenses/past-perfect-continuous/sentence-builder" },
};

export default function Page() {
  return <SentenceBuilderClient />;
}
