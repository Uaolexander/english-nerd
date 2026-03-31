import type { Metadata } from "next";
import AllFutureTensesClient from "./AllFutureTensesClient";

export const metadata: Metadata = {
  title: "All Future Tenses — English Nerd",
  description:
    "40 questions to master all 5 future forms: will, going to, Future Continuous, Future Perfect, and Future Perfect Continuous. Free C1 English exercise.",
  alternates: { canonical: "/tenses/future-perfect-continuous/all-future-tenses" },
};

export default function Page() {
  return <AllFutureTensesClient />;
}
