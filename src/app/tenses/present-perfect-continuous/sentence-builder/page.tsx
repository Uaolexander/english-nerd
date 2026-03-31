import type { Metadata } from "next";
import SentenceBuilderClient from "./SentenceBuilderClient";

export const metadata: Metadata = {
  title: "Present Perfect Continuous Sentence Builder — English Nerd",
  description:
    "Build Present Perfect Continuous sentences by tapping word tiles in the correct order. Practice have/has been + verb-ing with for/since, negatives, questions, and stative verbs.",
  alternates: { canonical: "/tenses/present-perfect-continuous/sentence-builder" },
};

export default function Page() {
  return <SentenceBuilderClient />;
}
