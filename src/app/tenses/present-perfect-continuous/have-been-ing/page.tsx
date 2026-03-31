import type { Metadata } from "next";
import HaveBeenIngClient from "./HaveBeenIngClient";

export const metadata: Metadata = {
  title: "Present Perfect Continuous: have been + -ing — English Nerd",
  description:
    "Master the core structure of the Present Perfect Continuous: have/has been + -ing. Practise affirmative, negative, and question forms with 40 interactive multiple-choice questions.",
  alternates: { canonical: "/tenses/present-perfect-continuous/have-been-ing" },
};

export default function Page() {
  return <HaveBeenIngClient />;
}
