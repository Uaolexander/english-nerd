import type { Metadata } from "next";
import WillVsGoingToClient from "./WillVsGoingToClient";

export const metadata: Metadata = {
  title: "Be Going To: will vs going to — English Nerd",
  description:
    "Master the difference between will and be going to from the going to perspective — plans, intentions, evidence-based predictions vs spontaneous decisions and opinion predictions. 40 multiple-choice questions. Free B1 interactive English exercise.",
  alternates: { canonical: "/tenses/be-going-to/will-vs-going-to" },
};

export default function Page() {
  return <WillVsGoingToClient />;
}
