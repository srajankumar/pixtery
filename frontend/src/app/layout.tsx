import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import BgMusic from "@/components/BgMusic";
import Loading from "@/components/Loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pixtery",
  description: "Conquer the territory by coloring pixels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`text-secondary ${inter.className}`}>
        <Loading />
        <BgMusic />
        <main>{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
