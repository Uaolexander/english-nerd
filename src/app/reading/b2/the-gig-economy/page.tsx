import type { Metadata } from "next";
import GigEconomyClient from "./GigEconomyClient";

export const metadata: Metadata = {
  title: "The Gig Economy — B2 Reading — English Nerd",
  description:
    "B2 reading exercise. Read the opinion piece about gig economy workers and fill in the missing words.",
  alternates: { canonical: "/reading/b2/the-gig-economy" },
};

export default function GigEconomyPage() {
  return <GigEconomyClient />;
}
