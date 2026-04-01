import type { Metadata } from "next";
import FourFriendsClient from "./FourFriendsClient";

export const metadata: Metadata = {
  title: "Four Friends — A1 Reading — English Nerd",
  description:
    "A1 reading exercise. Read short profiles of four friends and decide if the statements are true or false.",
  alternates: { canonical: "/reading/a1/four-friends" },
};

export default function FourFriendsPage() {
  return <FourFriendsClient />;
}
