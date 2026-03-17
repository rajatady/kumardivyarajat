"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import dynamic from "next/dynamic";
import {
  ArticleFrontmatterForm,
  ProjectFrontmatterForm,
  type ArticleFrontmatter,
  type ProjectFrontmatter,
} from "./FrontmatterForm";
import { PublishBanner } from "./PublishBanner";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type ContentType = "article" | "project";

interface ArticleEditorProps {
  type: "article";
  initialFrontmatter?: ArticleFrontmatter;
  initialContent?: string;
  initialSlug?: string;
  initialSha?: string;
  saveAction: (data: {
    slug: string;
    frontmatter: Record<string, unknown>;
    content: string;
    sha?: string;
  }) => Promise<{ success: boolean; sha?: string; error?: string }>;
}

interface ProjectEditorProps {
  type: "project";
  initialFrontmatter?: ProjectFrontmatter;
  initialContent?: string;
  initialSlug?: string;
  initialSha?: string;
  saveAction: (data: {
    slug: string;
    frontmatter: Record<string, unknown>;
    content: string;
    sha?: string;
  }) => Promise<{ success: boolean; sha?: string; error?: string }>;
}

type EditorProps = ArticleEditorProps | ProjectEditorProps;

const defaultArticleFrontmatter: ArticleFrontmatter = {
  title: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  tags: [],
  published: false,
};

const defaultProjectFrontmatter: ProjectFrontmatter = {
  title: "",
  description: "",
  url: "",
  tags: [],
  featured: false,
};

export function ContentEditor(props: EditorProps) {
  const {
    type,
    initialContent = "",
    initialSlug = "",
    initialSha,
    saveAction,
  } = props;

  const [articleFm, setArticleFm] = useState<ArticleFrontmatter>(
    type === "article"
      ? (props.initialFrontmatter as ArticleFrontmatter) ??
          defaultArticleFrontmatter
      : defaultArticleFrontmatter
  );
  const [projectFm, setProjectFm] = useState<ProjectFrontmatter>(
    type === "project"
      ? (props.initialFrontmatter as ProjectFrontmatter) ??
          defaultProjectFrontmatter
      : defaultProjectFrontmatter
  );

  const [content, setContent] = useState(initialContent);
  const [slug, setSlug] = useState(initialSlug);
  const [sha, setSha] = useState(initialSha);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const isEditing = !!initialSlug;

  // Track dirty state
  useEffect(() => {
    setIsDirty(true);
  }, [articleFm, projectFm, content, slug]);

  // beforeunload warning
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const handleSave = useCallback(
    (publish?: boolean) => {
      if (!slug.trim()) {
        setStatus("error");
        setErrorMessage("Slug is required.");
        return;
      }

      const frontmatter: Record<string, unknown> =
        type === "article"
          ? {
              ...articleFm,
              published: publish !== undefined ? publish : articleFm.published,
            }
          : {
              ...projectFm,
              featured: projectFm.featured,
            };

      setStatus("saving");

      startTransition(async () => {
        const result = await saveAction({
          slug,
          frontmatter,
          content,
          sha: sha ?? undefined,
        });

        if (result.success) {
          setStatus("saved");
          setIsDirty(false);
          if (result.sha) setSha(result.sha);
          if (type === "article" && publish !== undefined) {
            setArticleFm((prev) => ({ ...prev, published: publish }));
          }
        } else {
          setStatus("error");
          setErrorMessage(result.error ?? "Failed to save.");
        }
      });
    },
    [type, articleFm, projectFm, content, slug, sha, saveAction]
  );

  return (
    <div className="max-w-5xl mx-auto">
      {status === "saved" && (
        <PublishBanner
          message={
            isEditing
              ? "Content updated successfully."
              : "Content created successfully."
          }
          onDismiss={() => setStatus("idle")}
        />
      )}

      {status === "error" && (
        <div className="border-l-3 border-red-500 bg-red-50 rounded-r-md px-5 py-4 mb-6">
          <p className="font-ui text-sm font-medium text-red-800">
            {errorMessage}
          </p>
        </div>
      )}

      {/* Frontmatter */}
      <div className="border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 bg-bg">
        <h2 className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted mb-4">
          Metadata
        </h2>
        {type === "article" ? (
          <ArticleFrontmatterForm
            frontmatter={articleFm}
            slug={slug}
            isEditing={isEditing}
            onChange={setArticleFm}
            onSlugChange={setSlug}
          />
        ) : (
          <ProjectFrontmatterForm
            frontmatter={projectFm}
            slug={slug}
            isEditing={isEditing}
            onChange={setProjectFm}
            onSlugChange={setSlug}
          />
        )}
      </div>

      {/* Editor */}
      <div className="border border-border rounded-lg overflow-hidden mb-4 sm:mb-6" data-color-mode="light">
        {/* Show split preview on desktop, edit-only on mobile */}
        <div className="hidden sm:block">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val ?? "")}
            height={500}
            preview="live"
            visibleDragbar={false}
          />
        </div>
        <div className="sm:hidden">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val ?? "")}
            height={350}
            preview="edit"
            visibleDragbar={false}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pb-4">
        {type === "article" && (
          <>
            <button
              onClick={() => handleSave(false)}
              disabled={isPending}
              className="font-ui text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 rounded border border-border text-text hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Draft"}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={isPending}
              className="font-ui text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 rounded bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {isPending ? "Publishing..." : "Publish"}
            </button>
          </>
        )}
        {type === "project" && (
          <button
            onClick={() => handleSave()}
            disabled={isPending}
            className="font-ui text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 rounded bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Project"}
          </button>
        )}
      </div>
    </div>
  );
}
