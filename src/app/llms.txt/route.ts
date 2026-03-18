import { getAllPosts, getAllProjects } from "@/lib/content";

const SITE_URL = "https://kumardivyarajat.com";

export async function GET() {
  const posts = getAllPosts();
  const projects = getAllProjects();

  const lines = [
    "# kumardivyarajat.com",
    "",
    "## About",
    "Personal blog and portfolio of Kumar Divya Rajat, a software engineer.",
    "Topics: software engineering, AI/ML, React Native, developer tools, system design.",
    "",
    "## Blog Posts",
    ...posts.map(
      (post) =>
        `- [${post.frontmatter.title}](${SITE_URL}/blog/${post.slug}): ${post.frontmatter.description}`
    ),
    "",
    "## Projects",
    ...projects.map(
      (project) =>
        `- [${project.frontmatter.title}](${SITE_URL}/projects/${project.slug}): ${project.frontmatter.description}`
    ),
    "",
    "## Links",
    `- Blog: ${SITE_URL}/blog`,
    `- Projects: ${SITE_URL}/projects`,
    `- About: ${SITE_URL}/about`,
    `- RSS: ${SITE_URL}/feed.xml`,
    `- GitHub: https://github.com/rajatady`,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
