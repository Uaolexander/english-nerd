import type { Metadata } from "next";
import SpotTheMistakeClient from "./SpotTheMistakeClient";

export const metadata: Metadata = {
  title: "Present Perfect Spot the Mistake — English Nerd",
  description:
    "Find and fix grammar mistakes in Present Perfect sentences. Practice have/has, past participles, tense choice, and word order. Free B1 English error correction exercise.",
  alternates: { canonical: "/tenses/present-perfect/spot-the-mistake" },
};

export default function Page() {
  return <SpotTheMistakeClient />;
}
