import type { Metadata } from "next";
import AllPresentTensesClient from "./AllPresentTensesClient";

export const metadata: Metadata = {
  title: "All Four Present Tenses Review — English Nerd",
  description:
    "Review all four present tenses in English: Present Simple, Present Continuous, Present Perfect, and Present Perfect Continuous. 40 multiple-choice questions to master the differences.",
  alternates: { canonical: "/tenses/present-perfect-continuous/all-present-tenses" },
};

export default function Page() {
  return <AllPresentTensesClient />;
}
