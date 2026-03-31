import type { Metadata } from "next";
import SentenceBuilderClient from "./SentenceBuilderClient";

export const metadata: Metadata = {
  title: "Present Perfect Sentence Builder — English Nerd",
  description:
    "Arrange word tiles to build correct Present Perfect sentences. Practice have/has + past participle, questions, short answers, and time expressions. Free B1 English exercise.",
  alternates: { canonical: "/tenses/present-perfect/sentence-builder" },
};

export default function Page() {
  return <SentenceBuilderClient />;
}
