"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/cms", label: "Dashboard", exact: true },
  { href: "/cms/articles/new", label: "New Article" },
  { href: "/cms/projects/new", label: "New Project" },
];

export function CMSHeader({ onSignOut }: { onSignOut: () => void }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="h-1 bg-accent" />
      <header className="border-b border-border bg-bg">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link
              href="/cms"
              className="font-headline text-lg font-medium tracking-tight text-text"
            >
              CMS
            </Link>

            {/* Desktop nav */}
            <ul className="hidden sm:flex items-center gap-6">
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

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline font-ui text-xs font-medium text-text-muted hover:text-text transition-colors"
            >
              View Site &rarr;
            </a>
            <button
              onClick={onSignOut}
              className="hidden sm:inline font-ui text-xs font-medium text-text-muted hover:text-accent transition-colors"
            >
              Sign Out
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden p-1.5 text-text-muted hover:text-text transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="sm:hidden border-t border-border px-4 py-3 space-y-1 bg-bg">
            {navLinks.map((link) => {
              const isActive = link.exact
                ? pathname === link.href
                : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block font-ui text-sm font-medium py-2 transition-colors ${
                    isActive
                      ? "text-accent"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-border-light flex items-center justify-between">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-ui text-xs font-medium text-text-muted hover:text-text transition-colors py-2"
              >
                View Site &rarr;
              </a>
              <button
                onClick={onSignOut}
                className="font-ui text-xs font-medium text-text-muted hover:text-accent transition-colors py-2"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
