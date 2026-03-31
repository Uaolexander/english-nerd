import type { Metadata } from "next";
import SpotTheMistakeClient from "./SpotTheMistakeClient";

export const metadata: Metadata = {
  title: "Past Perfect Spot the Mistake | English Nerd",
  description:
    "Find and correct mistakes in Past Perfect sentences. Click the wrong word, type the correction, or rewrite the full sentence. 40 error-correction exercises.",
  alternates: { canonical: "/tenses/past-perfect/spot-the-mistake" },
};

export default function Page() {
  return <SpotTheMistakeClient />;
}
