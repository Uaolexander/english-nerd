import type { Metadata } from "next";
import PsVsPcFromPcClient from "./PsVsPcFromPcClient";

export const metadata: Metadata = {
  title: "Past Simple vs Past Continuous — English Nerd",
  description:
    "Practice choosing between Past Simple and Past Continuous from the Continuous perspective. Background context vs completed events. 40 MCQ questions.",
  alternates: { canonical: "/tenses/past-continuous/ps-vs-pc" },
};

export default function Page() {
  return <PsVsPcFromPcClient />;
}
