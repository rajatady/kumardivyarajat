import Link from "next/link";
import { getAllPosts, getFeaturedProjects } from "@/lib/content";
import { ArticleCard } from "@/components/ArticleCard";
import { ProjectCard } from "@/components/ProjectCard";

export default function Home() {
  const posts = getAllPosts().slice(0, 3);
  const projects = getFeaturedProjects();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Kumar Divya Rajat",
      url: "https://kumardivyarajat.com",
      description:
        "Personal blog and portfolio. Writing about software engineering, design, and building things.",
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Kumar Divya Rajat",
      url: "https://kumardivyarajat.com",
      sameAs: [
        "https://github.com/rajatady",
        "https://x.com/Rajat225",
      ],
      jobTitle: "Software Engineer",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="pt-20 pb-16 border-b border-border">
        <div>
          <p className="font-ui text-sm font-medium uppercase tracking-widest text-text-muted mb-6">
            Software Engineer &amp; Writer
          </p>
          <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight text-text mb-6">
            Kumar Divya
            <br />
            <span className="italic font-light text-accent">Rajat</span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-lg">
            Building software, writing about the process, and sharing what I
            learn along the way. Currently exploring React Native, developer
            tools, and the craft of simple code.
          </p>
        </div>
      </section>

      {/* Recent Writing */}
      <section className="pt-16 pb-12">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-headline text-2xl font-medium tracking-tight text-text">
            Recent Writing
          </h2>
          <Link
            href="/blog"
            className="font-ui text-sm font-medium text-text-muted hover:text-accent transition-colors"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="flex flex-col gap-8">
          {posts.map((post, i) => (
            <ArticleCard key={post.slug} post={post} featured={i === 0} />
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="pt-8 pb-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-headline text-2xl font-medium tracking-tight text-text">
              Featured Projects
            </h2>
            <Link
              href="/projects"
              className="font-ui text-sm font-medium text-text-muted hover:text-accent transition-colors"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
