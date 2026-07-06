import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
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
  title: "ParkLog — track every coaster you ride",
  description:
    "The social network for thoosies. Rate parks and rides, log your credits, follow other riders, and build lists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line py-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-xs text-faint">
            <span>ParkLog — the social network for thoosies.</span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              <span className="inline-block h-2 w-2 rounded-full bg-go" />
              <span className="inline-block h-2 w-2 rounded-full bg-lift" />
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
