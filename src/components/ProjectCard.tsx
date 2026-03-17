import Link from "next/link";
import type { Project } from "@/lib/content";

export function ProjectCard({ project }: { project: Project }) {
  const isFeatured = project.frontmatter.featured;

  return (
    <Link href={`/projects/${project.slug}`}>
      <article
        className={`group rounded-lg p-6 transition-all hover:shadow-sm ${
          isFeatured
            ? "border-2 border-accent/20 bg-accent/[0.02] hover:border-accent/40"
            : "border border-border hover:border-accent/30"
        }`}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-headline text-xl font-medium text-text group-hover:text-accent transition-colors">
            {project.frontmatter.title}
          </h3>
          <div className="flex items-center gap-2 shrink-0 mt-1">
            {isFeatured && (
              <span className="font-ui text-[10px] font-semibold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">
                Featured
              </span>
            )}
            {project.frontmatter.url && (
              <span
                className="text-text-muted group-hover:text-accent transition-colors"
                aria-label={`View ${project.frontmatter.title} source`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </span>
            )}
          </div>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          {project.frontmatter.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.frontmatter.tags?.map((tag) => (
            <span
              key={tag}
              className="font-ui text-xs font-medium text-text-muted bg-bg-secondary px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
