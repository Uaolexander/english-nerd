import type { Metadata } from "next";
import AtTheMarketClient from "./AtTheMarketClient";

export const metadata: Metadata = {
  title: "At the Market — A1 Reading — English Nerd",
  description:
    "A1 reading exercise. Read about a weekend market and fill in the missing words.",
  alternates: { canonical: "/reading/a1/at-the-market" },
};

export default function AtTheMarketPage() {
  return <AtTheMarketClient />;
}
