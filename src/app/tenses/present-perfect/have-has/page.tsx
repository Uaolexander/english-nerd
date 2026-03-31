import type { Metadata } from "next";
import HaveHasClient from "./HaveHasClient";

export const metadata: Metadata = {
  title: "Present Perfect: have / has / haven't / hasn't — English Nerd",
  description:
    "Master the auxiliary verb 'have' in Present Perfect: affirmative with have/has, negatives with haven't/hasn't, and questions with Have/Has. 40 interactive multiple-choice questions.",
  alternates: { canonical: "/tenses/present-perfect/have-has" },
};

export default function Page() {
  return <HaveHasClient />;
}
