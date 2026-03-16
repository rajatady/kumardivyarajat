"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/cms", label: "Dashboard", exact: true },
  { href: "/cms/articles/new", label: "New Article" },
  { href: "/cms/projects/new", label: "New Project" },
];

export function CMSHeader({ onSignOut }: { onSignOut: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="h-1 bg-accent" />
      <header className="border-b border-border bg-bg">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link
              href="/cms"
              className="font-headline text-lg font-medium tracking-tight text-text"
            >
              CMS
            </Link>

            <ul className="flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = link.exact
                  ? pathname === link.href
                  : pathname?.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`font-ui text-sm font-medium transition-colors ${
                        isActive
                          ? "text-accent"
                          : "text-text-muted hover:text-text"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui text-xs font-medium text-text-muted hover:text-text transition-colors"
            >
              View Site &rarr;
            </a>
            <button
              onClick={onSignOut}
              className="font-ui text-xs font-medium text-text-muted hover:text-accent transition-colors"
            >
              Sign Out
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
