import { Octokit } from "@octokit/rest";
import matter from "gray-matter";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = process.env.GITHUB_REPO_OWNER!;
const repo = process.env.GITHUB_REPO_NAME!;

export type ContentType = "blog" | "projects";

function contentPath(type: ContentType): string {
  return `content/${type}`;
}

export interface ContentListItem {
  slug: string;
  name: string;
  sha: string;
  path: string;
  frontmatter: Record<string, unknown>;
}

export interface ContentItem {
  slug: string;
  sha: string;
  frontmatter: Record<string, unknown>;
  content: string;
}

export async function getContentList(
  type: ContentType
): Promise<ContentListItem[]> {
  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: contentPath(type),
  });

  if (!Array.isArray(data)) return [];

  const mdxFiles = data.filter(
    (f) => f.type === "file" && f.name.endsWith(".mdx")
  );

  const items = await Promise.all(
    mdxFiles.map(async (file) => {
      const slug = file.name.replace(/\.mdx$/, "");
      try {
        const { data: fileData } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: file.path,
        });

        if ("content" in fileData && typeof fileData.content === "string") {
          const decoded = Buffer.from(fileData.content, "base64").toString(
            "utf-8"
          );
          const { data: frontmatter } = matter(decoded);
          return {
            slug,
            name: file.name,
            sha: fileData.sha,
            path: file.path,
            frontmatter,
          };
        }
      } catch {
        // skip files that can't be read
      }
      return null;
    })
  );

  return items.filter((item): item is ContentListItem => item !== null);
}

export async function getContentItem(
  type: ContentType,
  slug: string
): Promise<ContentItem | null> {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: `${contentPath(type)}/${slug}.mdx`,
    });

    if ("content" in data && typeof data.content === "string") {
      const decoded = Buffer.from(data.content, "base64").toString("utf-8");
      const { data: frontmatter, content } = matter(decoded);
      return {
        slug,
        sha: data.sha,
        frontmatter,
        content,
      };
    }
  } catch {
    return null;
  }
  return null;
}

export async function createContent(
  type: ContentType,
  slug: string,
  fileContent: string,
  message: string
): Promise<{ sha: string }> {
  const { data } = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: `${contentPath(type)}/${slug}.mdx`,
    message,
    content: Buffer.from(fileContent).toString("base64"),
  });

  return { sha: data.content?.sha ?? "" };
}

export async function updateContent(
  type: ContentType,
  slug: string,
  fileContent: string,
  sha: string,
  message: string
): Promise<{ sha: string }> {
  const { data } = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: `${contentPath(type)}/${slug}.mdx`,
    message,
    content: Buffer.from(fileContent).toString("base64"),
    sha,
  });

  return { sha: data.content?.sha ?? "" };
}

export function serializeMDX(
  frontmatter: Record<string, unknown>,
  body: string
): string {
  return matter.stringify(body, frontmatter);
}
