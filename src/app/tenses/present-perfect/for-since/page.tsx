import type { Metadata } from "next";
import ForSinceClient from "./ForSinceClient";

export const metadata: Metadata = {
  title: "Present Perfect: for vs since — English Nerd",
  description:
    "Master for and since with Present Perfect: for a period of time, since a point in time, How long questions, and mixed practice. 40 interactive multiple-choice questions.",
  alternates: { canonical: "/tenses/present-perfect/for-since" },
};

export default function Page() {
  return <ForSinceClient />;
}
