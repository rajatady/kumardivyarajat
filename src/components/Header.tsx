"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();

  if (pathname?.startsWith("/cms")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-headline text-xl font-medium tracking-tight text-text transition-colors hover:text-accent"
        >
          KDR
        </Link>

        <ul className="flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`font-ui text-sm font-medium tracking-wide transition-colors ${
                  pathname === link.href || pathname?.startsWith(link.href + "/")
                    ? "text-accent"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
