import type { Metadata } from "next";
import CanCantLessonClient from "./CanCantLessonClient";

export const metadata: Metadata = {
  title: "Can / Can't (Ability & Permission) — A1 Grammar — English Nerd",
  description:
    "Learn to use can and can't in English for ability and permission. A1 grammar lesson with affirmative, negative and question forms plus exercises.",
  alternates: { canonical: "/grammar/a1/can-cant" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 text-black">
      <CanCantLessonClient />
    </main>
  );
}