import type { Metadata } from "next";
import AllPastTensesClient from "./AllPastTensesClient";

export const metadata: Metadata = {
  title: "All 4 Past Tenses — Advanced Practice | English Nerd",
  description:
    "Advanced practice with all four past tenses: Past Simple, Past Continuous, Past Perfect, and Past Perfect Continuous. 40 multiple-choice questions.",
  alternates: { canonical: "/tenses/past-perfect-continuous/all-past-tenses" },
};

export default function Page() {
  return <AllPastTensesClient />;
}
