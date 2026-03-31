import type { Metadata } from "next";
import PpVsPpcPastClient from "./PpVsPpcPastClient";

export const metadata: Metadata = {
  title: "Past Perfect vs Past Perfect Continuous | English Nerd",
  description:
    "Practice choosing between Past Perfect (had done) and Past Perfect Continuous (had been doing). 40 questions on result vs duration, stative verbs, and context clues.",
  alternates: { canonical: "/tenses/past-perfect-continuous/pp-vs-ppc-past" },
};

export default function Page() {
  return <PpVsPpcPastClient />;
}
