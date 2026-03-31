import type { Metadata } from "next";
import SpotTheMistakeClient from "./SpotTheMistakeClient";

export const metadata: Metadata = {
  title: "Be Going To — Spot the Mistake — English Nerd",
  description:
    "Find and fix grammar mistakes in 'be going to' sentences. Click the wrong word and type the correction, or rewrite the full sentence.",
  alternates: { canonical: "/tenses/be-going-to/spot-the-mistake" },
};

export default function Page() {
  return <SpotTheMistakeClient />;
}
