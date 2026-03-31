import type { Metadata } from "next";
import SpotTheMistakeClient from "./SpotTheMistakeClient";

export const metadata: Metadata = {
  title: "Future Perfect Continuous Spot the Mistake — English Nerd",
  description:
    "Find and fix grammar mistakes in Future Perfect Continuous sentences. Click the wrong word or rewrite the sentence. Free C1 English exercise.",
  alternates: { canonical: "/tenses/future-perfect-continuous/spot-the-mistake" },
};

export default function Page() {
  return <SpotTheMistakeClient />;
}
