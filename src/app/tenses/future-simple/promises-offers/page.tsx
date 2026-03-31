import type { Metadata } from "next";
import PromisesOffersClient from "./PromisesOffersClient";

export const metadata: Metadata = {
  title: "Future Simple: Promises, Offers & Decisions — English Nerd",
  description:
    "Practise using will for spontaneous decisions, offers (Shall I / Shall we), and promises with 40 multiple-choice questions. Free A2–B1 interactive English exercise.",
  alternates: { canonical: "/tenses/future-simple/promises-offers" },
};

export default function Page() {
  return <PromisesOffersClient />;
}
