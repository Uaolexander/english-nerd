import type { Metadata } from "next";
import PpVsPpcClient from "./PpVsPpcClient";

export const metadata: Metadata = {
  title: "Present Perfect vs Present Perfect Continuous — English Nerd",
  description:
    "Understand when to use Present Perfect (I have done) versus Present Perfect Continuous (I have been doing). 40 multiple-choice questions covering completed results, ongoing processes, and stative verbs.",
  alternates: { canonical: "/tenses/present-perfect-continuous/pp-vs-ppc" },
};

export default function Page() {
  return <PpVsPpcClient />;
}
