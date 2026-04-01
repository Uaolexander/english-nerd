import type { Metadata } from "next";
import CityOrCountryClient from "./CityOrCountryClient";

export const metadata: Metadata = {
  title: "City or Country? — A2 Reading — English Nerd",
  description:
    "A2 reading exercise. Read about city and country life and fill in the missing words.",
  alternates: { canonical: "/reading/a2/city-or-country" },
};

export default function CityOrCountryPage() {
  return <CityOrCountryClient />;
}
