import type { Metadata } from "next";
import PastPerfectVsPastSimpleClient from "./PastPerfectVsPastSimpleClient";

export const metadata: Metadata = {
  title: "Past Perfect vs Past Simple — English Nerd",
  description:
    "When must you use Past Perfect, and when is Past Simple enough? 40 multiple-choice questions on sequence, 'when' ambiguity, already/just/never, and mixed contexts.",
  alternates: { canonical: "/tenses/past-perfect/past-perfect-vs-past-simple" },
};

export default function Page() {
  return <PastPerfectVsPastSimpleClient />;
}
