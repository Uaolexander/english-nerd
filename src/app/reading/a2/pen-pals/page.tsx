import type { Metadata } from "next";
import PenPalsClient from "./PenPalsClient";

export const metadata: Metadata = {
  title: "Pen Pals — A2 Reading — English Nerd",
  description:
    "A2 reading exercise. Read messages from four pen pals around the world and decide if the statements are true or false.",
  alternates: { canonical: "/reading/a2/pen-pals" },
};

export default function PenPalsPage() {
  return <PenPalsClient />;
}
