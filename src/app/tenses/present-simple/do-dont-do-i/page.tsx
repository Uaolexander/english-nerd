import type { Metadata } from "next";
import DoDoesClient from "./DoDoesClient";

export const metadata: Metadata = {
  title: "Present Simple: do / does — English Nerd",
  description:
    "Master do, does, don't and doesn't in Present Simple. Practice questions, negatives and short answers. Free A1 interactive English exercise.",
  alternates: { canonical: "/tenses/present-simple/do-dont-do-i" },
};

export default function Page() {
  return <DoDoesClient />;
}
