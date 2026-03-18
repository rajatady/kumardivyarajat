import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { mdxComponents } from "@/components/MDXComponents";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const ogUrl = `https://kumardivyarajat.com/og?title=${encodeURIComponent(post.frontmatter.title)}&description=${encodeURIComponent(post.frontmatter.description)}&date=${encodeURIComponent(new Date(post.frontmatter.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }))}`;

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: {
      canonical: `https://kumardivyarajat.com/blog/${slug}`,
    },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
      url: `https://kumardivyarajat.com/blog/${slug}`,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: post.frontmatter.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: [ogUrl],
    },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: "monokai",
              keepBackground: true,
            },
          ],
        ],
      },
    },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    author: {
      "@type": "Person",
      name: "Kumar Divya Rajat",
      url: "https://kumardivyarajat.com/about",
    },
    publisher: {
      "@type": "Person",
      name: "Kumar Divya Rajat",
    },
    url: `https://kumardivyarajat.com/blog/${slug}`,
    keywords: post.frontmatter.tags,
  };

  return (
    <article className="mx-auto max-w-4xl px-6 pt-16 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Back link */}
      <Link
        href="/blog"
        className="font-ui text-sm font-medium text-text-muted hover:text-accent transition-colors inline-flex items-center gap-1 mb-10"
      >
        &larr; Back to blog
      </Link>

      {/* Article header */}
      <header className="mb-12 max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <time className="font-ui text-sm font-medium uppercase tracking-widest text-text-muted">
            {formatDate(post.frontmatter.date)}
          </time>
          <span className="text-border">—</span>
          <span className="font-ui text-sm font-medium text-text-muted">
            {post.readingTime}
          </span>
        </div>

        <h1 className="font-headline text-4xl sm:text-5xl font-medium leading-[1.15] tracking-tight text-text mb-4">
          {post.frontmatter.title}
        </h1>

        <p className="text-lg text-text-secondary leading-relaxed">
          {post.frontmatter.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-6">
          {post.frontmatter.tags?.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="font-ui text-xs font-medium text-text-muted bg-bg-secondary px-2.5 py-1 rounded hover:text-accent transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </header>

      {/* Divider */}
      <div className="border-t border-border mb-12" />

      {/* Article body */}
      <div className="prose mx-auto">
        {content}
      </div>

      {/* Footer divider */}
      <div className="border-t border-border mt-16 pt-8">
        <Link
          href="/blog"
          className="font-ui text-sm font-medium text-text-muted hover:text-accent transition-colors"
        >
          &larr; Back to all articles
        </Link>
      </div>
    </article>
  );
}
