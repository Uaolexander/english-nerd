import type { Metadata } from "next";
import SequenceOfEventsClient from "./SequenceOfEventsClient";

export const metadata: Metadata = {
  title: "Past Perfect: Sequence of Events — English Nerd",
  description:
    "Practice expressing which past action happened first using Past Perfect. Before, after, when, by the time — 40 interactive multiple-choice questions.",
  alternates: { canonical: "/tenses/past-perfect/sequence-of-events" },
};

export default function Page() {
  return <SequenceOfEventsClient />;
}
