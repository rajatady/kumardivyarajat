"use client";

import { useState, useEffect } from "react";

export interface ArticleFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  relatedPosts: string[];
}

export interface ProjectFrontmatter {
  title: string;
  description: string;
  url: string;
  tags: string[];
  featured: boolean;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function TagsInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const [raw, setRaw] = useState(value.join(", "));
  const [focused, setFocused] = useState(false);

  // Sync from parent when not focused (e.g. initial load)
  useEffect(() => {
    if (!focused) {
      setRaw(value.join(", "));
    }
  }, [value, focused]);

  return (
    <div>
      <label className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted block mb-1.5">
        Tags
      </label>
      <input
        type="text"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          const tags = raw
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
          onChange(tags);
          setRaw(tags.join(", "));
        }}
        placeholder="react-native, typescript, design"
        className="w-full px-3 py-2 rounded border border-border bg-bg text-text font-ui text-sm focus:border-accent focus:outline-none transition-colors"
      />
      <p className="font-ui text-xs text-text-muted mt-1">
        Separate tags with commas
      </p>
    </div>
  );
}

export function ArticleFrontmatterForm({
  frontmatter,
  slug,
  isEditing,
  onChange,
  onSlugChange,
  availablePosts,
}: {
  frontmatter: ArticleFrontmatter;
  slug: string;
  isEditing: boolean;
  onChange: (fm: ArticleFrontmatter) => void;
  onSlugChange: (slug: string) => void;
  availablePosts?: { slug: string; title: string }[];
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted block mb-1.5">
          Title
        </label>
        <input
          type="text"
          value={frontmatter.title}
          onChange={(e) => {
            const title = e.target.value;
            onChange({ ...frontmatter, title });
            if (!isEditing) {
              onSlugChange(generateSlug(title));
            }
          }}
          placeholder="Article title"
          className="w-full px-3 py-2.5 rounded border border-border bg-bg text-text font-headline text-xl focus:border-accent focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted block mb-1.5">
          Slug
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          disabled={isEditing}
          placeholder="article-slug"
          className="w-full px-3 py-2 rounded border border-border bg-bg text-text font-ui text-sm focus:border-accent focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted block mb-1.5">
          Description
        </label>
        <textarea
          value={frontmatter.description}
          onChange={(e) =>
            onChange({ ...frontmatter, description: e.target.value })
          }
          rows={2}
          placeholder="A brief description of the article"
          className="w-full px-3 py-2 rounded border border-border bg-bg text-text font-ui text-sm focus:border-accent focus:outline-none transition-colors resize-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted block mb-1.5">
            Date
          </label>
          <input
            type="date"
            value={frontmatter.date}
            onChange={(e) => onChange({ ...frontmatter, date: e.target.value })}
            className="w-full px-3 py-2 rounded border border-border bg-bg text-text font-ui text-sm focus:border-accent focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={frontmatter.published}
              onChange={(e) =>
                onChange({ ...frontmatter, published: e.target.checked })
              }
              className="w-4 h-4 accent-accent"
            />
            <span className="font-ui text-sm font-medium text-text">
              Published
            </span>
          </label>
        </div>
      </div>

      <TagsInput
        value={frontmatter.tags}
        onChange={(tags) => onChange({ ...frontmatter, tags })}
      />

      {/* Related posts selector */}
      {availablePosts && availablePosts.length > 0 && (
        <div>
          <label className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted block mb-1.5">
            Related Posts
          </label>
          <p className="font-ui text-xs text-text-muted mb-2">
            Select manually. Unselected slots auto-fill by tag match.
          </p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto border border-border rounded p-2">
            {availablePosts
              .filter((p) => p.slug !== slug)
              .map((post) => (
                <label
                  key={post.slug}
                  className="flex items-center gap-2 cursor-pointer py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={frontmatter.relatedPosts?.includes(post.slug) ?? false}
                    onChange={(e) => {
                      const current = frontmatter.relatedPosts || [];
                      const updated = e.target.checked
                        ? [...current, post.slug]
                        : current.filter((s) => s !== post.slug);
                      onChange({ ...frontmatter, relatedPosts: updated });
                    }}
                    className="w-3.5 h-3.5 accent-accent"
                  />
                  <span className="font-ui text-sm text-text truncate">
                    {post.title}
                  </span>
                </label>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ProjectFrontmatterForm({
  frontmatter,
  slug,
  isEditing,
  onChange,
  onSlugChange,
}: {
  frontmatter: ProjectFrontmatter;
  slug: string;
  isEditing: boolean;
  onChange: (fm: ProjectFrontmatter) => void;
  onSlugChange: (slug: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted block mb-1.5">
          Title
        </label>
        <input
          type="text"
          value={frontmatter.title}
          onChange={(e) => {
            const title = e.target.value;
            onChange({ ...frontmatter, title });
            if (!isEditing) {
              onSlugChange(generateSlug(title));
            }
          }}
          placeholder="Project name"
          className="w-full px-3 py-2.5 rounded border border-border bg-bg text-text font-headline text-xl focus:border-accent focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted block mb-1.5">
          Slug
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          disabled={isEditing}
          placeholder="project-slug"
          className="w-full px-3 py-2 rounded border border-border bg-bg text-text font-ui text-sm focus:border-accent focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted block mb-1.5">
          Description
        </label>
        <textarea
          value={frontmatter.description}
          onChange={(e) =>
            onChange({ ...frontmatter, description: e.target.value })
          }
          rows={2}
          placeholder="What this project does"
          className="w-full px-3 py-2 rounded border border-border bg-bg text-text font-ui text-sm focus:border-accent focus:outline-none transition-colors resize-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted block mb-1.5">
            URL
          </label>
          <input
            type="url"
            value={frontmatter.url}
            onChange={(e) => onChange({ ...frontmatter, url: e.target.value })}
            placeholder="https://github.com/..."
            className="w-full px-3 py-2 rounded border border-border bg-bg text-text font-ui text-sm focus:border-accent focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={frontmatter.featured}
              onChange={(e) =>
                onChange({ ...frontmatter, featured: e.target.checked })
              }
              className="w-4 h-4 accent-accent"
            />
            <span className="font-ui text-sm font-medium text-text">
              Featured
            </span>
          </label>
        </div>
      </div>

      <TagsInput
        value={frontmatter.tags}
        onChange={(tags) => onChange({ ...frontmatter, tags })}
      />
    </div>
  );
}
