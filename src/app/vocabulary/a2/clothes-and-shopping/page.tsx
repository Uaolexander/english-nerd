import type { Metadata } from "next";
import ClothesShoppingClient from "./ClothesShoppingClient";

export const metadata: Metadata = {
  title: "Clothes & Shopping — A2 Vocabulary — English Nerd",
  description:
    "A2 vocabulary exercises about clothes and shopping. Three activities: multiple choice, choose the correct word, and fill in the blanks.",
  alternates: { canonical: "/vocabulary/a2/clothes-and-shopping" },
};

export default function ClothesShoppingPage() {
  return <ClothesShoppingClient />;
}
