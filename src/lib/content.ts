import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const contentDirectory = path.join(process.cwd(), "content");

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  coverImage?: string;
  published: boolean;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
}

export interface ProjectFrontmatter {
  title: string;
  description: string;
  url?: string;
  tags: string[];
  coverImage?: string;
  featured: boolean;
}

export interface Project {
  slug: string;
  frontmatter: ProjectFrontmatter;
  content: string;
}

function getMDXFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.endsWith(".mdx"));
}

export function getAllPosts(): Post[] {
  const dir = path.join(contentDirectory, "blog");
  const files = getMDXFiles(dir);

  const posts = files
    .map((filename) => {
      const filePath = path.join(dir, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);
      const slug = filename.replace(/\.mdx$/, "");
      const stats = readingTime(content);

      return {
        slug,
        frontmatter: data as PostFrontmatter,
        content,
        readingTime: stats.text,
      };
    })
    .filter((post) => post.frontmatter.published !== false)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(contentDirectory, "blog", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
    readingTime: stats.text,
  };
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach((post) => {
    post.frontmatter.tags?.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

export function getAllProjects(): Project[] {
  const dir = path.join(contentDirectory, "projects");
  const files = getMDXFiles(dir);

  return files.map((filename) => {
    const filePath = path.join(dir, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const slug = filename.replace(/\.mdx$/, "");

    return {
      slug,
      frontmatter: data as ProjectFrontmatter,
      content,
    };
  });
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.frontmatter.featured);
}
