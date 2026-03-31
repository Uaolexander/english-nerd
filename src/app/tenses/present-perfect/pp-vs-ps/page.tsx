import type { Metadata } from "next";
import PpVsPsClient from "./PpVsPsClient";

export const metadata: Metadata = {
  title: "Present Perfect vs Past Simple — English Nerd",
  description:
    "Practise choosing between Present Perfect and Past Simple: unfinished time vs finished time, ever/never/just/already/yet vs yesterday/ago/last year. 40 interactive multiple-choice questions.",
  alternates: { canonical: "/tenses/present-perfect/pp-vs-ps" },
};

export default function Page() {
  return <PpVsPsClient />;
}
