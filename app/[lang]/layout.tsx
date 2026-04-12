import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getDictionary, hasLocale, locales, type Locale } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin", "latin-ext", "cyrillic"] });

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    title: {
      default: "ArcSmith Apps",
      template: "%s — ArcSmith Apps",
    },
    description: dict.hero.tagline,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, l === "en" ? "/" : `/${l}`])
      ),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <html lang={lang} className={inter.className}>
      <body className="bg-bg-primary text-text-primary antialiased">
        <Header lang={lang as Locale} dict={dict} />
        <main className="pt-14">{children}</main>
        <Footer dict={dict} />
      </body>
    </html>
  );
}
