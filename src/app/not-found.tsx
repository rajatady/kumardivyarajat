import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-32 pb-20 text-center">
      <p className="font-ui text-sm font-medium uppercase tracking-widest text-text-muted mb-4">
        404
      </p>
      <h1 className="font-headline text-5xl sm:text-6xl font-light tracking-tight text-text mb-6">
        Page not <span className="italic text-accent">found</span>
      </h1>
      <p className="text-text-secondary text-lg leading-relaxed max-w-md mx-auto mb-10">
        The page you&apos;re looking for doesn&apos;t exist, or it may have been moved.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/"
          className="font-ui text-sm font-medium px-5 py-2.5 rounded bg-accent text-white hover:bg-accent-hover transition-colors"
        >
          Go home
        </Link>
        <Link
          href="/blog"
          className="font-ui text-sm font-medium px-5 py-2.5 rounded border border-border text-text hover:border-accent hover:text-accent transition-colors"
        >
          Read the blog
        </Link>
      </div>
    </div>
  );
}
