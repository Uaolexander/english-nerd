import type { Metadata } from "next";
import SpotTheMistakeClient from "./SpotTheMistakeClient";

export const metadata: Metadata = {
  title: "Past Simple Spot the Mistake — English Nerd",
  description:
    "Find and fix grammar mistakes in Past Simple sentences. Click the wrong word or rewrite the sentence correctly. Free A2 interactive English error correction exercise.",
  alternates: { canonical: "/tenses/past-simple/spot-the-mistake" },
};

export default function Page() {
  return <SpotTheMistakeClient />;
}
