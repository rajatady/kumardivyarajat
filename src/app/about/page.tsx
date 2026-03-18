import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Kumar Divya Rajat — software engineer and writer.",
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "Kumar Divya Rajat",
      url: "https://kumardivyarajat.com",
      jobTitle: "Software Engineer",
      email: "rajat.ady@gmail.com",
      sameAs: [
        "https://github.com/rajatady",
        "https://x.com/Rajat225",
      ],
      image: "https://kumardivyarajat.com/icon-512.png",
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-6 pt-16 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-2xl">
        <h1 className="font-headline text-4xl font-medium tracking-tight text-text mb-8">
          About
        </h1>

        <div className="space-y-6 text-text-secondary leading-relaxed text-lg">
          <p>
            I&apos;m Kumar Divya Rajat, a software engineer who cares deeply
            about craft. I build things for the web and mobile, with a
            particular interest in React Native, developer tooling, and
            making complex systems feel simple.
          </p>

          <p>
            I believe the best software comes from understanding the problem
            deeply before writing a single line of code. I write about
            engineering, design, and the philosophy of building things that
            last.
          </p>

          <p>
            This site is my corner of the internet — a place to share ideas,
            document what I&apos;m learning, and think in public. It&apos;s
            built with Next.js and uses GitHub as a CMS, because the best
            tools are often the simplest ones.
          </p>
        </div>

        <div className="border-t border-border mt-12 pt-12">
          <h2 className="font-headline text-2xl font-medium tracking-tight text-text mb-6">
            Connect
          </h2>

          <div className="flex flex-col gap-4">
            <a
              href="https://github.com/rajatady"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 py-3 border-b border-border-light"
            >
              <span className="font-ui text-sm font-medium text-text group-hover:text-accent transition-colors">
                GitHub
              </span>
              <span className="text-text-muted text-sm">
                @rajatady
              </span>
            </a>

            <a
              href="https://x.com/Rajat225"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 py-3 border-b border-border-light"
            >
              <span className="font-ui text-sm font-medium text-text group-hover:text-accent transition-colors">
                X (Twitter)
              </span>
              <span className="text-text-muted text-sm">
                @Rajat225
              </span>
            </a>

            <a
              href="mailto:rajat.ady@gmail.com"
              className="group flex items-center gap-4 py-3 border-b border-border-light"
            >
              <span className="font-ui text-sm font-medium text-text group-hover:text-accent transition-colors">
                Email
              </span>
              <span className="text-text-muted text-sm">
                rajat.ady@gmail.com
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
