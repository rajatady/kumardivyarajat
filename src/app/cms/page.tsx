import Link from "next/link";
import { getContentList } from "@/lib/github";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const dynamic = "force-dynamic";

export default async function CMSDashboard() {
  const [articles, projects] = await Promise.all([
    getContentList("blog"),
    getContentList("projects"),
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Articles Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline text-2xl font-medium tracking-tight text-text">
            Articles
          </h2>
          <Link
            href="/cms/articles/new"
            className="font-ui text-sm font-medium px-4 py-2 rounded bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            New Article
          </Link>
        </div>

        {articles.length === 0 ? (
          <p className="font-ui text-sm text-text-muted py-8 text-center border border-border rounded-lg">
            No articles yet. Create your first one.
          </p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-bg-secondary">
                  <th className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted text-left px-4 py-3">
                    Title
                  </th>
                  <th className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted text-left px-4 py-3">
                    Date
                  </th>
                  <th className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted text-left px-4 py-3">
                    Status
                  </th>
                  <th className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted text-right px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr
                    key={article.slug}
                    className="border-b border-border-light last:border-0 hover:bg-bg-secondary/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-headline text-base font-medium text-text">
                        {(article.frontmatter.title as string) || article.slug}
                      </span>
                      <div className="flex gap-1.5 mt-1">
                        {(
                          (article.frontmatter.tags as string[]) || []
                        ).map((tag) => (
                          <span
                            key={tag}
                            className="font-ui text-xs text-text-muted bg-bg-secondary px-1.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-ui text-sm text-text-muted">
                      {article.frontmatter.date
                        ? formatDate(article.frontmatter.date as string)
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 font-ui text-xs font-medium ${
                          article.frontmatter.published
                            ? "text-emerald-600"
                            : "text-text-muted"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            article.frontmatter.published
                              ? "bg-emerald-500"
                              : "bg-text-muted/40"
                          }`}
                        />
                        {article.frontmatter.published
                          ? "Published"
                          : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/cms/articles/edit/${article.slug}`}
                          className="font-ui text-xs font-medium text-text-muted hover:text-accent transition-colors"
                        >
                          Edit
                        </Link>
                        <a
                          href={`/blog/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-ui text-xs font-medium text-text-muted hover:text-text transition-colors"
                        >
                          View
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline text-2xl font-medium tracking-tight text-text">
            Projects
          </h2>
          <Link
            href="/cms/projects/new"
            className="font-ui text-sm font-medium px-4 py-2 rounded bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="font-ui text-sm text-text-muted py-8 text-center border border-border rounded-lg">
            No projects yet. Add your first one.
          </p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-bg-secondary">
                  <th className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted text-left px-4 py-3">
                    Title
                  </th>
                  <th className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted text-left px-4 py-3">
                    URL
                  </th>
                  <th className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted text-left px-4 py-3">
                    Status
                  </th>
                  <th className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted text-right px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.slug}
                    className="border-b border-border-light last:border-0 hover:bg-bg-secondary/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-headline text-base font-medium text-text">
                        {(project.frontmatter.title as string) || project.slug}
                      </span>
                      <div className="flex gap-1.5 mt-1">
                        {(
                          (project.frontmatter.tags as string[]) || []
                        ).map((tag) => (
                          <span
                            key={tag}
                            className="font-ui text-xs text-text-muted bg-bg-secondary px-1.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-ui text-sm text-text-muted truncate max-w-48">
                      {(project.frontmatter.url as string) || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 font-ui text-xs font-medium ${
                          project.frontmatter.featured
                            ? "text-accent"
                            : "text-text-muted"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            project.frontmatter.featured
                              ? "bg-accent"
                              : "bg-text-muted/40"
                          }`}
                        />
                        {project.frontmatter.featured
                          ? "Featured"
                          : "Standard"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/cms/projects/edit/${project.slug}`}
                        className="font-ui text-xs font-medium text-text-muted hover:text-accent transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
