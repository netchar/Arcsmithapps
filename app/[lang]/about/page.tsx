import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);

  return {
    title: dict.about.title,
    description: dict.about.paragraphs[0],
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-glow/40 to-transparent" />
        <div className="relative mx-auto max-w-[1200px] px-6 pt-24 pb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary">
            {dict.about.heroHeadline}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-16">
        <div className="space-y-6 text-text-secondary text-lg leading-relaxed">
          {dict.about.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            {dict.about.contact.heading}
          </h2>
          <div className="space-y-2 text-text-secondary">
            <a
              href={`mailto:${dict.about.contact.email}`}
              className="inline-flex items-center gap-2 hover:text-text-primary transition-colors"
            >
              <Mail size={16} />
              {dict.about.contact.email}
            </a>
            <p>{dict.about.contact.entity}</p>
            <p className="text-text-muted text-sm">{dict.about.contact.nip}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
