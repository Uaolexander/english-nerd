import type { Metadata } from "next";
import SpotTheMistakeClient from "./SpotTheMistakeClient";

export const metadata: Metadata = {
  title: "Present Perfect Continuous Spot the Mistake — English Nerd",
  description:
    "Find and correct grammar mistakes in Present Perfect Continuous sentences. Practice have/has been + verb-ing errors, stative verbs, and wrong auxiliaries.",
  alternates: { canonical: "/tenses/present-perfect-continuous/spot-the-mistake" },
};

export default function Page() {
  return <SpotTheMistakeClient />;
}
