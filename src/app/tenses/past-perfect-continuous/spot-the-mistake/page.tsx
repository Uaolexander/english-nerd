import type { Metadata } from "next";
import SpotTheMistakeClient from "./SpotTheMistakeClient";

export const metadata: Metadata = {
  title: "Past Perfect Continuous Spot the Mistake | English Nerd",
  description:
    "Find and correct errors in Past Perfect Continuous sentences: missing 'been', wrong auxiliary, wrong verb form, and tense confusion. 40 error-correction exercises.",
  alternates: { canonical: "/tenses/past-perfect-continuous/spot-the-mistake" },
};

export default function Page() {
  return <SpotTheMistakeClient />;
}
