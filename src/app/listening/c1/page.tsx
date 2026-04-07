import { redirect } from "next/navigation";

export const metadata = {
  title: "C1 Listening Exercises — English Nerd",
  description: "C1 advanced English listening exercises. Coming soon — complex academic and professional audio.",
  alternates: { canonical: "/listening/c1" },
};

export default function ListeningC1Page() {
  redirect("/listening");
}
