import { redirect } from "next/navigation";

export const metadata = {
  title: "B1 Listening Exercises — English Nerd",
  description: "B1 intermediate English listening exercises. Coming soon — natural-speed conversations and short podcasts.",
  alternates: { canonical: "/listening/b1" },
};

export default function ListeningB1Page() {
  redirect("/listening");
}
