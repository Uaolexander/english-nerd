import type { Metadata } from "next";
import WillVsGoingToClient from "./WillVsGoingToClient";

export const metadata: Metadata = {
  title: "Future Simple: will vs going to — English Nerd",
  description:
    "Master the difference between will and be going to with 40 multiple-choice questions. Practise spontaneous vs planned decisions, evidence-based vs opinion predictions. Free B1 interactive English exercise.",
  alternates: { canonical: "/tenses/future-simple/will-vs-going-to" },
};

export default function Page() {
  return <WillVsGoingToClient />;
}
