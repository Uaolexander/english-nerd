import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import CookieBanner from "@/components/CookieBanner";
import SessionGuard from "@/components/SessionGuard";
import ProgressToast from "@/components/ProgressToast";
import AssignmentBanner from "@/components/AssignmentBanner";
import { Suspense } from "react";
import { ProProvider } from "@/lib/ProContext";
import { StudentProvider } from "@/lib/StudentContext";
import { TeacherProvider } from "@/lib/TeacherContext";
import { createClient } from "@/lib/supabase/server";
import { getIsPro } from "@/lib/getIsPro";
import { getStudentStatus } from "@/lib/getStudentStatus";
import { getTeacherStatus } from "@/lib/getTeacherStatus";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://englishnerd.cc"),
  title: {
    default: "English Nerd — Free English Grammar Lessons & Exercises",
    template: "%s — English Nerd",
  },
  description: "Free English grammar lessons, vocabulary tests, and exercises for all levels A1 to C1. Practice grammar with interactive exercises and instant feedback.",
  keywords: ["English grammar", "grammar exercises", "learn English", "A1 grammar", "A2 grammar", "English lessons", "grammar practice"],
  openGraph: {
    siteName: "English Nerd",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [isPro, studentStatus, teacherStatus] = await Promise.all([
    user ? getIsPro(supabase, user.id) : Promise.resolve(false),
    user ? getStudentStatus(supabase, user.id) : Promise.resolve({ isStudent: false, teacherIds: [] }),
    user ? getTeacherStatus(supabase, user.id) : Promise.resolve({ isTeacher: false, plan: null, studentLimit: 0, activeStudentCount: 0, isActive: false, isInGracePeriod: false, subscriptionExpiresAt: null }),
  ]);

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#0B0B0D] text-white antialiased`}
      >
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2015658649191943"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <ProProvider isPro={isPro || studentStatus.isStudent || teacherStatus.isTeacher}>
          <StudentProvider isStudent={studentStatus.isStudent}>
            <TeacherProvider isTeacher={teacherStatus.isTeacher}>
              <Header />
              <Suspense><AssignmentBanner /></Suspense>
              {children}
              <Footer />
              <BackToTop />
              <CookieBanner />
              <SessionGuard />
              <ProgressToast />
            </TeacherProvider>
          </StudentProvider>
        </ProProvider>
      </body>
    </html>
  );
}
