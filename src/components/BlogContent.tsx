"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, Suspense } from "react";
import { ArticleCard } from "./ArticleCard";
import type { Post } from "@/lib/content";

function BlogContentInner({
  posts,
  tags,
}: {
  posts: Post[];
  tags: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  const filtered = activeTag
    ? posts.filter((p) => p.frontmatter.tags?.includes(activeTag))
    : posts;

  const handleTagClick = useCallback(
    (tag: string | null) => {
      if (tag === activeTag || tag === null) {
        router.push("/blog", { scroll: false });
      } else {
        router.push(`/blog?tag=${encodeURIComponent(tag)}`, { scroll: false });
      }
    },
    [activeTag, router]
  );

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => handleTagClick(null)}
          className={`font-ui text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
            !activeTag
              ? "bg-accent text-white"
              : "bg-bg-secondary text-text-muted hover:text-text"
          }`}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`font-ui text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              activeTag === tag
                ? "bg-accent text-white"
                : "bg-bg-secondary text-text-muted hover:text-text"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        {filtered.length === 0 ? (
          <p className="text-text-muted font-ui text-sm py-12 text-center">
            No articles found for this tag.
          </p>
        ) : (
          filtered.map((post, i) => (
            <ArticleCard key={post.slug} post={post} featured={i === 0} />
          ))
        )}
      </div>
    </>
  );
}

export function BlogContent({
  posts,
  tags,
}: {
  posts: Post[];
  tags: string[];
}) {
  return (
    <Suspense fallback={null}>
      <BlogContentInner posts={posts} tags={tags} />
    </Suspense>
  );
}
