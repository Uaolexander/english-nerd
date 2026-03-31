import type { Metadata } from "next";
import ForSinceDurationClient from "./ForSinceDurationClient";

export const metadata: Metadata = {
  title: "Present Perfect Continuous: for vs since (Duration) — English Nerd",
  description:
    "Learn to use for and since with the Present Perfect Continuous to express duration. Practise with 40 multiple-choice questions covering time expressions, How long questions, and full PPC sentences.",
  alternates: { canonical: "/tenses/present-perfect-continuous/for-since-duration" },
};

export default function Page() {
  return <ForSinceDurationClient />;
}
