import type { Metadata } from "next";
import SlowTravelClient from "./SlowTravelClient";

export const metadata: Metadata = {
  title: "The Slow Travel Movement | B1 Reading | English Nerd",
  description:
    "B1 reading exercise. Read the article about slow travel and answer comprehension questions.",
  alternates: { canonical: "/reading/b1/the-slow-travel-movement" },
};

export default function SlowTravelPage() {
  return <SlowTravelClient />;
}
