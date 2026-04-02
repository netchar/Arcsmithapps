import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ArcSmith Apps",
    template: "%s — ArcSmith Apps",
  },
  description: "Independent Android apps crafted with care.",
  metadataBase: new URL("https://arcsmithapps.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Header />
        <main className="pt-14">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
