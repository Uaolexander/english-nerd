import type { Metadata } from "next";
import CityLifeClient from "./CityLifeClient";

export const metadata: Metadata = {
  title: "City Life — B1 Vocabulary — English Nerd",
  description:
    "B1 vocabulary exercises about city and urban life. Three activities: multiple choice, choose the correct word, and fill in the blanks.",
  alternates: { canonical: "/vocabulary/b1/city-life" },
};

export default function CityLifePage() {
  return <CityLifeClient />;
}
