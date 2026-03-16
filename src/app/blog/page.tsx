import { Suspense } from "react";
import { getAllPosts, getAllTags } from "@/lib/content";
import { ArticleCard } from "@/components/ArticleCard";
import { TagFilter } from "@/components/TagFilter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles about software engineering, design, and building things.",
};

function BlogList({ tag }: { tag: string | null }) {
  const allPosts = getAllPosts();
  const posts = tag
    ? allPosts.filter((p) => p.frontmatter.tags?.includes(tag))
    : allPosts;

  return (
    <div className="flex flex-col gap-8">
      {posts.length === 0 ? (
        <p className="text-text-muted font-ui text-sm py-12 text-center">
          No articles found for this tag.
        </p>
      ) : (
        posts.map((post, i) => (
          <ArticleCard key={post.slug} post={post} featured={i === 0} />
        ))
      )}
    </div>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-4xl px-6 pt-16 pb-12">
      <div className="mb-12">
        <h1 className="font-headline text-4xl font-medium tracking-tight text-text mb-3">
          Blog
        </h1>
        <p className="text-text-secondary leading-relaxed">
          Thoughts on software engineering, design, simplicity, and the craft of
          building things.
        </p>
      </div>

      <div className="mb-10">
        <Suspense fallback={null}>
          <TagFilter tags={tags} />
        </Suspense>
      </div>

      <div>
        <BlogList tag={tag ?? null} />
      </div>
    </div>
  );
}
