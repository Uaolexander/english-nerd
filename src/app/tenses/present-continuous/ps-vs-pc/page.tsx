import type { Metadata } from "next";
import PsVsPcClient from "./PsVsPcClient";

export const metadata: Metadata = {
  title: "Present Simple vs Continuous — English Nerd",
  description:
    "Practice choosing between Present Simple and Present Continuous. Habits vs now, stative vs active, time expressions. 40 MCQ questions.",
  alternates: { canonical: "/tenses/present-continuous/ps-vs-pc" },
};

export default function Page() {
  return <PsVsPcClient />;
}
