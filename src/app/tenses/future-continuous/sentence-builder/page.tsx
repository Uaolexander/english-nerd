import type { Metadata } from "next";
import SentenceBuilderClient from "./SentenceBuilderClient";

export const metadata: Metadata = {
  title: "Future Continuous Sentence Builder — English Nerd",
  description:
    "Build Future Continuous sentences by tapping tiles in the correct order. Practice will be + verb-ing structures. Free B1 English exercise.",
  alternates: { canonical: "/tenses/future-continuous/sentence-builder" },
};

export default function Page() {
  return <SentenceBuilderClient />;
}
