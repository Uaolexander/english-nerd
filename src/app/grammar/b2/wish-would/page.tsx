import LessonSchema from "@/components/LessonSchema";
import WishWouldLessonClient from "./WishWouldLessonClient";

export const metadata = {
  title: "Wish + Would / Past Perfect — B2 Grammar — English Nerd",
  description:
    "Learn advanced wish structures in English: wish + would, wish + past perfect. B2 grammar covering wishes about habits, regrets about the past, and if only. 4 exercises.",
  alternates: { canonical: "/grammar/b2/wish-would" },
};

export default function WishWouldPage() {
  return <WishWouldLessonClient />;
}
