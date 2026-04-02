import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getLegalDoc, getAllLegalPaths } from "@/lib/mdx";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ app: string; doc: string }>;
}

export async function generateStaticParams() {
  return getAllLegalPaths();
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { app, doc } = await params;
  const legalDoc = getLegalDoc(app, doc);
  if (!legalDoc) return { title: "Not Found" };

  return {
    title: `${legalDoc.frontmatter.title} — ${legalDoc.frontmatter.appName}`,
    description: `${legalDoc.frontmatter.title} for ${legalDoc.frontmatter.appName}`,
  };
}

export default async function LegalPage({ params }: PageProps) {
  const { app, doc } = await params;
  const legalDoc = getLegalDoc(app, doc);
  if (!legalDoc) notFound();

  const { content, frontmatter } = legalDoc;

  return (
    <div className="mx-auto max-w-3xl px-6 pt-20 pb-20">
      <Link
        href={`/${app}`}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Back to {frontmatter.appName}
      </Link>

      <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
        {frontmatter.title}
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Last updated: {frontmatter.lastUpdated}
      </p>

      <article className="prose mt-10 max-w-none">
        <MDXRemote source={content} />
      </article>
    </div>
  );
}
