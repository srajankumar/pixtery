import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pixtery",
  description: "Draw and guess pixel art with friends and family.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`text-secondary ${inter.className}`}>
        <main>{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
