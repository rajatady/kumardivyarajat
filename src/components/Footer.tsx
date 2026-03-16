"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/cms")) return null;

  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-6">
            <Link
              href="/feed.xml"
              className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted transition-colors hover:text-accent"
            >
              RSS
            </Link>
            <a
              href="https://github.com/rajatady"
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted transition-colors hover:text-accent"
            >
              GitHub
            </a>
            <a
              href="https://x.com/Rajat225"
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui text-xs font-medium uppercase tracking-widest text-text-muted transition-colors hover:text-accent"
            >
              X
            </a>
          </div>

          <p className="font-ui text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Kumar Divya Rajat
          </p>
        </div>
      </div>
    </footer>
  );
}
