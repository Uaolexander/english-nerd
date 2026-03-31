import type { Metadata } from "next";
import StativeVerbsClient from "./StativeVerbsClient";

export const metadata: Metadata = {
  title: "Present Continuous: Stative Verbs — English Nerd",
  description:
    "Learn which verbs are never used in the continuous form. Know, want, love, hate, believe — practice identifying stative verbs. 40 MCQ questions.",
  alternates: { canonical: "/tenses/present-continuous/stative-verbs" },
};

export default function Page() {
  return <StativeVerbsClient />;
}
