import type { Metadata } from "next";
import SpotTheMistakeClient from "./SpotTheMistakeClient";

export const metadata: Metadata = {
  title: "Future Perfect Spot the Mistake — English Nerd",
  description:
    "Find and fix grammar mistakes in Future Perfect sentences. Practice will have + past participle error correction. Free B2 English exercise.",
  alternates: { canonical: "/tenses/future-perfect/spot-the-mistake" },
};

export default function Page() {
  return <SpotTheMistakeClient />;
}
