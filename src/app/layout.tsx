import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PassGate",
  description: "This is a simple authentication app.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black`}
      >
        <div className="min-h-screen w-full max-w-3xl py-6 px-12 bg-white dark:bg-black space-y-7">
          <header className="w-full">
            <Navbar />
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
