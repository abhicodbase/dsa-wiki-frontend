import type { Metadata } from "next";
import { Playfair_Display, Libre_Baskerville, Source_Code_Pro, UnifrakturMaguntia } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const libre = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-libre",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const sourceCode = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code",
  weight: ["400", "500"],
});

const unifraktur = UnifrakturMaguntia({
  subsets: ["latin"],
  variable: "--font-unifraktur",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "DSA Practice Hub — The Algorithm Times",
  description:
    "A curated practice journal fetching C++ solutions directly from GitHub. newspaper-style learning journal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${libre.variable} ${sourceCode.variable} ${unifraktur.variable}`}>
      <body>
        <Navbar />
        <main>
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
