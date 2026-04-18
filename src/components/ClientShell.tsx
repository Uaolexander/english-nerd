"use client";

import dynamic from "next/dynamic";

const CookieBanner             = dynamic(() => import("@/components/CookieBanner"),             { ssr: false });
const MobileProBanner          = dynamic(() => import("@/components/MobileProBanner"),          { ssr: false });
const TeacherHintBanner        = dynamic(() => import("@/components/TeacherHintBanner"),        { ssr: false });
const TeacherLiveShare         = dynamic(() => import("@/components/TeacherLiveShare"),         { ssr: false });
const ExerciseInviteListener   = dynamic(() => import("@/components/ExerciseInviteListener"),   { ssr: false });
const BackToTop                = dynamic(() => import("@/components/BackToTop"),                { ssr: false });
const FeedbackWidget           = dynamic(() => import("@/components/FeedbackWidget"),           { ssr: false });
const GlobalLiveSessionBanner  = dynamic(() => import("@/components/GlobalLiveSessionBanner"),  { ssr: false });

export default function ClientShell({
  user,
  plan,
}: {
  user: { email: string } | null;
  plan: "PRO" | "Teacher" | "Student" | "Free";
}) {
  return (
    <>
      <GlobalLiveSessionBanner />
      <CookieBanner />
      <MobileProBanner />
      <TeacherHintBanner />
      <TeacherLiveShare />
      <ExerciseInviteListener />
      {user ? (
        <FeedbackWidget email={user.email} plan={plan} />
      ) : (
        <BackToTop />
      )}
    </>
  );
}
