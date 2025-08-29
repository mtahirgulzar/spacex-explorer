import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./global.css";
import QueryProvider from "@/providers/QueryProvider";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "SpaceX Explorer | Discover Space Missions",
  description: "Explore SpaceX launches, rockets, and missions. Track upcoming launches and dive deep into space exploration data.",
  keywords: ["SpaceX", "rockets", "launches", "space exploration", "Falcon 9", "Dragon"],
  authors: [{ name: "SpaceX Explorer Team" }],
  openGraph: {
    title: "SpaceX Explorer | Discover Space Missions",
    description: "Explore SpaceX launches, rockets, and missions. Track upcoming launches and dive deep into space exploration data.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">
          <QueryProvider>{children}</QueryProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
