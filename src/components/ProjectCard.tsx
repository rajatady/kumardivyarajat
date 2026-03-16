import type { Project } from "@/lib/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group border border-border rounded-lg p-6 transition-all hover:border-accent/30 hover:shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-headline text-xl font-medium text-text group-hover:text-accent transition-colors">
          {project.frontmatter.title}
        </h3>
        {project.frontmatter.url && (
          <a
            href={project.frontmatter.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-ui text-xs font-medium text-text-muted hover:text-accent transition-colors shrink-0 mt-1"
            aria-label={`View ${project.frontmatter.title} on GitHub`}
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
          </a>
        )}
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
  );
}
