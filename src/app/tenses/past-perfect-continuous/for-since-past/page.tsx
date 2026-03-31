import type { Metadata } from "next";
import ForSincePastClient from "./ForSincePastClient";

export const metadata: Metadata = {
  title: "for vs since with Past Perfect Continuous | English Nerd",
  description:
    "Practice using 'for' and 'since' with the Past Perfect Continuous tense. 40 questions on duration in the past: for 3 hours, since morning, since 2018.",
  alternates: { canonical: "/tenses/past-perfect-continuous/for-since-past" },
};

export default function Page() {
  return <ForSincePastClient />;
}
