import type { Metadata } from "next";
import PlansIntentionsClient from "./PlansIntentionsClient";

export const metadata: Metadata = {
  title: "Be Going To: Plans & Intentions — English Nerd",
  description:
    "Practise using be going to for plans and intentions already decided with 40 multiple-choice questions. Learn when to use going to vs will. Free A2–B1 interactive English exercise.",
  alternates: { canonical: "/tenses/be-going-to/plans-intentions" },
};

export default function Page() {
  return <PlansIntentionsClient />;
}
