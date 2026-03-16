import { getAllProjects } from "@/lib/content";
import { ProjectCard } from "@/components/ProjectCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built and contributed to.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="mx-auto max-w-4xl px-6 pt-16 pb-12">
      <div className="mb-12">
        <h1 className="font-headline text-4xl font-medium tracking-tight text-text mb-3">
          Projects
        </h1>
        <p className="text-text-secondary leading-relaxed">
          Things I&apos;ve built, contributed to, and am currently working on.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
