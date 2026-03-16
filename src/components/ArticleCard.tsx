import Link from "next/link";
import type { Post } from "@/lib/content";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ArticleCard({
  post,
  featured = false,
}: {
  post: Post;
  featured?: boolean;
}) {
  return (
    <article
      className={`group ${featured ? "border-b border-border pb-10" : "border-b border-border-light pb-8"}`}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="flex items-center gap-3 mb-3">
          <time className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted">
            {formatDate(post.frontmatter.date)}
          </time>
          <span className="text-border">—</span>
          <span className="font-ui text-xs font-medium text-text-muted">
            {post.readingTime}
          </span>
        </div>

        <h2
          className={`font-headline font-medium leading-tight tracking-tight text-text transition-colors group-hover:text-accent ${
            featured ? "text-3xl mb-3" : "text-2xl mb-2"
          }`}
        >
          {post.frontmatter.title}
        </h2>

        <p className="text-text-secondary leading-relaxed mb-4 max-w-2xl">
          {post.frontmatter.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {post.frontmatter.tags?.map((tag) => (
            <span
              key={tag}
              className="font-ui text-xs font-medium text-text-muted bg-bg-secondary px-2.5 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </article>
  );
}
