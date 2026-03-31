import type { Metadata } from "next";
import IrregularPastClient from "./IrregularPastClient";

export const metadata: Metadata = {
  title: "Past Simple: Irregular Verbs — English Nerd",
  description:
    "Practice the 60 most essential irregular past forms. go→went, see→saw, have→had, make→made. 40 MCQ questions in four sets.",
  alternates: { canonical: "/tenses/past-simple/irregular-past-simple" },
};

export default function Page() {
  return <IrregularPastClient />;
}
