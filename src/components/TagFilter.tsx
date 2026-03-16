"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function TagFilter({ tags }: { tags: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

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
    <div className="flex flex-wrap gap-2">
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
  );
}
