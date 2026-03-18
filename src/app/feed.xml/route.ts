import RSS from "rss";
import { getAllPosts } from "@/lib/content";

export const revalidate = 3600; // revalidate every hour

const SITE_URL = "https://kumardivyarajat.com";

export async function GET() {
  const feed = new RSS({
    title: "Kumar Divya Rajat",
    description:
      "Writing about software engineering, design, and building things.",
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.xml`,
    language: "en",
  });

  const posts = getAllPosts();

  posts.forEach((post) => {
    feed.item({
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      date: new Date(post.frontmatter.date),
      categories: post.frontmatter.tags || [],
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
