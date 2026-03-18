import { getAllProjects } from "@/lib/content";
import { ProjectCard } from "@/components/ProjectCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built and contributed to.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const sorted = [
    ...projects.filter((p) => p.frontmatter.featured),
    ...projects.filter((p) => !p.frontmatter.featured),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects — Kumar Divya Rajat",
    description: "Things I've built and contributed to.",
    url: "https://kumardivyarajat.com/projects",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: sorted.map((project, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://kumardivyarajat.com/projects/${project.slug}`,
        name: project.frontmatter.title,
      })),
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-6 pt-16 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-12">
        <h1 className="font-headline text-4xl font-medium tracking-tight text-text mb-3">
          Projects
        </h1>
        <p className="text-text-secondary leading-relaxed">
          Things I&apos;ve built, contributed to, and am currently working on.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sorted.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
