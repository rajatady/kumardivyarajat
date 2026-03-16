"use server";

import { auth } from "@/lib/auth";
import {
  createContent,
  updateContent,
  serializeMDX,
  type ContentType,
} from "@/lib/github";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

async function saveContent(
  contentType: ContentType,
  data: {
    slug: string;
    frontmatter: Record<string, unknown>;
    content: string;
    sha?: string;
  }
) {
  await requireAuth();

  const fileContent = serializeMDX(data.frontmatter, data.content);
  const title = (data.frontmatter.title as string) || data.slug;

  try {
    let result;
    if (data.sha) {
      result = await updateContent(
        contentType,
        data.slug,
        fileContent,
        data.sha,
        `Update ${contentType}: ${title}`
      );
    } else {
      result = await createContent(
        contentType,
        data.slug,
        fileContent,
        `Add ${contentType}: ${title}`
      );
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);
    revalidatePath("/projects");
    revalidatePath("/");

    return { success: true, sha: result.sha };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save content";

    if (message.includes("409")) {
      return {
        success: false,
        error:
          "This content was modified since you started editing. Please refresh and try again.",
      };
    }

    return { success: false, error: message };
  }
}

export async function saveArticle(data: {
  slug: string;
  frontmatter: Record<string, unknown>;
  content: string;
  sha?: string;
}) {
  return saveContent("blog", data);
}

export async function saveProject(data: {
  slug: string;
  frontmatter: Record<string, unknown>;
  content: string;
  sha?: string;
}) {
  return saveContent("projects", data);
}
