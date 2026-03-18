import { getAllPosts, getAllTags } from "@/lib/content";
import { BlogContent } from "@/components/BlogContent";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles about software engineering, design, and building things.",
};

export default function BlogPage() {
  const posts = getAllPosts();
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

      <BlogContent posts={posts} tags={tags} />
    </div>
  );
}
