import { redirect } from "next/navigation";

export const metadata = {
  title: "A2 Listening Exercises — English Nerd",
  description: "A2 elementary English listening exercises. Coming soon — everyday situations with comprehension tasks.",
  alternates: { canonical: "/listening/a2" },
};

export default function ListeningA2Page() {
  redirect("/listening");
}
