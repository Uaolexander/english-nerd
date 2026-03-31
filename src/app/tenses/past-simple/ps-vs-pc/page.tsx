import type { Metadata } from "next";
import PsVsPcPastClient from "./PsVsPcPastClient";

export const metadata: Metadata = {
  title: "Past Simple vs Past Continuous — English Nerd",
  description:
    "Practice choosing between Past Simple and Past Continuous. Completed actions vs actions in progress at a past moment. when and while. 40 MCQ questions.",
  alternates: { canonical: "/tenses/past-simple/ps-vs-pc" },
};

export default function Page() {
  return <PsVsPcPastClient />;
}
