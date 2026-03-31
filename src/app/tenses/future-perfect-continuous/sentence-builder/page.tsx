import type { Metadata } from "next";
import SentenceBuilderClient from "./SentenceBuilderClient";

export const metadata: Metadata = {
  title: "Future Perfect Continuous Sentence Builder — English Nerd",
  description:
    "Arrange tiles to build Future Perfect Continuous sentences. Practice will have been + verb-ing structures. Free C1 English interactive exercise.",
  alternates: { canonical: "/tenses/future-perfect-continuous/sentence-builder" },
};

export default function Page() {
  return <SentenceBuilderClient />;
}
