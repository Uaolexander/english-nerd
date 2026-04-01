import type { Metadata } from "next";
import MyFamilyClient from "./MyFamilyClient";

export const metadata: Metadata = {
  title: "My Family — A1 Vocabulary — English Nerd",
  description:
    "A1 vocabulary exercise about family. Anna talks about her family — read the dialogue and choose the correct word for each gap.",
  alternates: { canonical: "/vocabulary/a1/my-family" },
};

export default function MyFamilyPage() {
  return <MyFamilyClient />;
}
