import type { Metadata } from "next";
import SpotTheMistakeClient from "./SpotTheMistakeClient";

export const metadata: Metadata = {
  title: "Future Simple Spot the Mistake — English Nerd",
  description:
    "Find and fix grammar mistakes in Future Simple (will) sentences. Click the wrong word or rewrite the sentence correctly. Free A2 interactive English exercise.",
  alternates: { canonical: "/tenses/future-simple/spot-the-mistake" },
};

export default function Page() {
  return <SpotTheMistakeClient />;
}
