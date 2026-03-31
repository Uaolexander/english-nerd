import type { Metadata } from "next";
import PredictionsClient from "./PredictionsClient";

export const metadata: Metadata = {
  title: "Future Simple: Predictions & Opinions — English Nerd",
  description:
    "Practice using will for predictions and opinions with 40 multiple-choice questions. Learn opinion markers (I think, I believe), probability adverbs (probably, definitely), and how to express future predictions in English. Free A2–B1 exercise.",
  alternates: { canonical: "/tenses/future-simple/predictions" },
};

export default function Page() {
  return <PredictionsClient />;
}
