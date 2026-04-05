import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "DSA Practice Hub",
  description:
    "Curated Data Structures & Algorithms problems with C++ solutions, visual diagrams, and complexity analysis. Ideal for interview prep at top tech companies.",
  keywords: ["DSA", "algorithms", "data structures", "interview", "C++", "competitive programming"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
