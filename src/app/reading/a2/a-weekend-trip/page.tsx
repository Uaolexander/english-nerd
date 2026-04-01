import type { Metadata } from "next";
import AWeekendTripClient from "./AWeekendTripClient";

export const metadata: Metadata = {
  title: "A Weekend Trip — A2 Reading — English Nerd",
  description:
    "A2 reading exercise. Read about Sofia's weekend trip to the mountains and answer comprehension questions.",
  alternates: { canonical: "/reading/a2/a-weekend-trip" },
};

export default function AWeekendTripPage() {
  return <AWeekendTripClient />;
}
