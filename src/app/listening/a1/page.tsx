import { redirect } from "next/navigation";

export const metadata = {
  title: "A1 Listening Exercises — English Nerd",
  description: "A1 beginner English listening exercises. Coming soon — short, slow dialogues with comprehension questions.",
  alternates: { canonical: "/listening/a1" },
};

export default function ListeningA1Page() {
  redirect("/listening");
}
