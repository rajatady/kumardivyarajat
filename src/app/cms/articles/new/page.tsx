import Link from "next/link";
import { getContentList } from "@/lib/github";
import { ContentEditor } from "@/components/cms/ArticleEditor";
import { saveArticle } from "@/app/cms/actions";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const articles = await getContentList("blog");

  const availablePosts = articles.map((a) => ({
    slug: a.slug,
    title: (a.frontmatter.title as string) || a.slug,
  }));

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
          New Article
        </h1>
      </div>
      <ContentEditor
        type="article"
        availablePosts={availablePosts}
        saveAction={saveArticle}
      />
    </div>
  );
}
