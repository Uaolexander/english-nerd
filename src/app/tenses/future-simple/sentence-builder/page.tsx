import type { Metadata } from "next";
import SentenceBuilderClient from "./SentenceBuilderClient";

export const metadata: Metadata = {
  title: "Future Simple Sentence Builder — English Nerd",
  description:
    "Build Future Simple (will) sentences by tapping word tiles in the correct order. Three sets — affirmative & negative, questions, and mixed with contractions. Free A2 interactive English exercise.",
  alternates: { canonical: "/tenses/future-simple/sentence-builder" },
};

export default function Page() {
  return <SentenceBuilderClient />;
}
