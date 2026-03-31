import type { Metadata } from "next";
import SentenceBuilderClient from "./SentenceBuilderClient";

export const metadata: Metadata = {
  title: "Future Perfect Sentence Builder — English Nerd",
  description:
    "Build Future Perfect sentences by arranging word tiles in the correct order. Practice will have + past participle. Free B2 interactive English exercise.",
  alternates: { canonical: "/tenses/future-perfect/sentence-builder" },
};

export default function Page() {
  return <SentenceBuilderClient />;
}
