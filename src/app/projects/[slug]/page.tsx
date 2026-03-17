import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllProjects } from "@/lib/content";
import { mdxComponents } from "@/components/MDXComponents";
import type { Metadata } from "next";

function getProjectBySlug(slug: string) {
  return getAllProjects().find((p) => p.slug === slug) ?? null;
}

export async function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.frontmatter.title,
    description: project.frontmatter.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const { content } = await compileMDX({
    source: project.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        format: "md",
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

  return (
    <article className="mx-auto max-w-4xl px-6 pt-16 pb-20">
      <Link
        href="/projects"
        className="font-ui text-sm font-medium text-text-muted hover:text-accent transition-colors inline-flex items-center gap-1 mb-10"
      >
        &larr; Back to projects
      </Link>

      <header className="mb-12 max-w-2xl">
        <h1 className="font-headline text-4xl sm:text-5xl font-medium leading-[1.15] tracking-tight text-text mb-4">
          {project.frontmatter.title}
        </h1>

        <p className="text-lg text-text-secondary leading-relaxed">
          {project.frontmatter.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          {project.frontmatter.url && (
            <a
              href={project.frontmatter.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui text-sm font-medium text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-1.5"
            >
              View project
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
          )}
          {project.frontmatter.tags?.length > 0 && (
            <>
              {project.frontmatter.url && (
                <span className="text-border">|</span>
              )}
              <div className="flex flex-wrap gap-2">
                {project.frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-ui text-xs font-medium text-text-muted bg-bg-secondary px-2.5 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      <div className="border-t border-border mb-12" />

      <div className="prose mx-auto">{content}</div>

      <div className="border-t border-border mt-16 pt-8">
        <Link
          href="/projects"
          className="font-ui text-sm font-medium text-text-muted hover:text-accent transition-colors"
        >
          &larr; Back to all projects
        </Link>
      </div>
    </article>
  );
}
