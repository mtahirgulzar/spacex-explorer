import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./global.css";
import QueryProvider from "@/providers/QueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
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
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
