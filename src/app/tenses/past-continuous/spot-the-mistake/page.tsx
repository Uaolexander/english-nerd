import type { Metadata } from "next";
import SpotTheMistakeClient from "./SpotTheMistakeClient";

export const metadata: Metadata = {
  title: "Past Continuous Spot the Mistake — English Nerd",
  description:
    "Find and fix grammar mistakes in Past Continuous sentences. Practice was/were + verb-ing error correction. Free A2 interactive English exercise.",
  alternates: { canonical: "/tenses/past-continuous/spot-the-mistake" },
};

export default function Page() {
  return <SpotTheMistakeClient />;
}
