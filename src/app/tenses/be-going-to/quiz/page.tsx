import type { Metadata } from "next";
import BeGoingToQuizClient from "./BeGoingToQuizClient";

export const metadata: Metadata = {
  title: "Be Going To Quiz — English Nerd",
  description:
    "Practice the 'be going to' future form with 40 multiple-choice questions. Test am/is/are + going to + base form for plans and predictions.",
  alternates: { canonical: "/tenses/be-going-to/quiz" },
};

export default function Page() {
  return <BeGoingToQuizClient />;
}
