import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentItem } from "@/lib/github";
import { ContentEditor } from "@/components/cms/ArticleEditor";
import { saveArticle } from "@/app/cms/actions";
import type { ArticleFrontmatter } from "@/components/cms/FrontmatterForm";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getContentItem("blog", slug);

  if (!item) notFound();

  const frontmatter: ArticleFrontmatter = {
    title: (item.frontmatter.title as string) ?? "",
    description: (item.frontmatter.description as string) ?? "",
    date: (item.frontmatter.date as string) ?? "",
    tags: (item.frontmatter.tags as string[]) ?? [],
    published: (item.frontmatter.published as boolean) ?? false,
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/cms"
          className="font-ui text-sm text-text-muted hover:text-text transition-colors"
          aria-label="Back to dashboard"
        >
          &larr;
        </Link>
        <h1 className="font-headline text-2xl font-medium tracking-tight text-text">
          Edit Article
        </h1>
      </div>
      <ContentEditor
        type="article"
        initialFrontmatter={frontmatter}
        initialContent={item.content}
        initialSlug={slug}
        initialSha={item.sha}
        saveAction={saveArticle}
      />
    </div>
  );
}
