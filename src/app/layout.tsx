import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import CookieBanner from "@/components/CookieBanner";
import SessionGuard from "@/components/SessionGuard";
import ProgressToast from "@/components/ProgressToast";
import LessonProgressBar from "@/components/LessonProgressBar";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#0B0B0D] text-white antialiased`}
      >
        <Header />
        {children}
        <Footer />
        <BackToTop />
        <CookieBanner />
        <SessionGuard />
        <LessonProgressBar />
        <ProgressToast />
      </body>
    </html>
  );
}
