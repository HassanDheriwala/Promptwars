import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CapstoneAI — Final-Year Project Idea & Blueprint Architect",
  description:
    "AI-powered platform helping final-year university students generate practical capstone project ideas based on skills, interests, and constraints with complete technical blueprints, roadmaps, and 3-week MVP plans.",
  keywords: [
    "Capstone Projects",
    "Final Year Engineering Projects",
    "Project Idea Generator",
    "Computer Science Capstone",
    "AI Project Roadmap",
    "MVP Architecture",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-slate-950 text-slate-100"
      >
        {children}
      </body>
    </html>
  );
}
