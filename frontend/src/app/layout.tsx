import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        <img src="/tl.svg" className="fixed -z-10 top-0 left-0" alt="" />
        <img src="/br.svg" className="fixed -z-10 bottom-0 right-0" alt="" />
        <main>{children}</main>
      </body>
    </html>
  );
}
