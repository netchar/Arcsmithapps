import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getLegalDoc, getAllLegalPaths } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, locales, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ lang: string; app: string; doc: string }>;
}

export async function generateStaticParams() {
  const paths = getAllLegalPaths();
  return locales.flatMap((lang) =>
    paths.map((p) => ({ lang, app: p.app, doc: p.doc }))
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { app, doc } = await params;
  const legalDoc = getLegalDoc(app, doc, "en");
  if (!legalDoc) return { title: "Not Found" };

  return {
    title: `${legalDoc.frontmatter.title} — ${legalDoc.frontmatter.appName}`,
    description: `${legalDoc.frontmatter.title} for ${legalDoc.frontmatter.appName}`,
  };
}

export default async function LegalPage({ params }: PageProps) {
  const { lang, app, doc } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const legalDoc = getLegalDoc(app, doc, lang);
  if (!legalDoc) notFound();

  const { content, frontmatter } = legalDoc;
  const prefix = lang === "en" ? "" : `/${lang}`;

  return (
    <div className="mx-auto max-w-3xl px-6 pt-20 pb-20">
      <Link
        href={`${prefix}/${app}`}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        {dict.legal.backTo} {frontmatter.appName}
      </Link>

      <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
        {frontmatter.title}
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Last updated: {frontmatter.lastUpdated}
      </p>

      <article className="prose prose-invert mt-10 max-w-none">
        <MDXRemote source={content} />
      </article>
    </div>
  );
}
