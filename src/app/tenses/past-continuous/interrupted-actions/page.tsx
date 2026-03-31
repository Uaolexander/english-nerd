import type { Metadata } from "next";
import InterruptedActionsClient from "./InterruptedActionsClient";

export const metadata: Metadata = {
  title: "Past Continuous: Interrupted Actions — English Nerd",
  description:
    "Master the interrupted action pattern: was/were + -ing (background) + when + Past Simple (event). 40 MCQ questions for B1 level.",
  alternates: { canonical: "/tenses/past-continuous/interrupted-actions" },
};

export default function Page() {
  return <InterruptedActionsClient />;
}
