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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog — Kumar Divya Rajat",
    description: "Articles about software engineering, design, and building things.",
    url: "https://kumardivyarajat.com/blog",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://kumardivyarajat.com/blog/${post.slug}`,
        name: post.frontmatter.title,
      })),
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-6 pt-16 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
