import type { Metadata } from "next";
import HadBeenIngClient from "./HadBeenIngClient";

export const metadata: Metadata = {
  title: "Past Perfect Continuous: had been + -ing Structure | English Nerd",
  description:
    "Master the structure of Past Perfect Continuous: had/hadn't/Had + been + verb-ing. 40 multiple-choice questions on form, -ing spelling, and PPC vs Past Continuous.",
  alternates: { canonical: "/tenses/past-perfect-continuous/had-been-ing" },
};

export default function Page() {
  return <HadBeenIngClient />;
}
