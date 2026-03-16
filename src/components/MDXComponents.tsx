import type { MDXComponents as MDXComponentsType } from "mdx/types";

function Callout({
  children,
  type = "info",
}: {
  children: React.ReactNode;
  type?: "info" | "warning" | "tip";
}) {
  const styles = {
    info: "border-accent/40 bg-accent/5",
    warning: "border-yellow-600/40 bg-yellow-50",
    tip: "border-emerald-600/40 bg-emerald-50",
  };

  return (
    <div
      className={`border-l-3 rounded-r-md px-5 py-4 my-6 ${styles[type]}`}
    >
      <div className="text-text-secondary text-base leading-relaxed [&>p]:mb-0">
        {children}
      </div>
    </div>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <aside className="my-12 py-8 border-t border-b border-border">
      <blockquote className="font-headline text-2xl font-light italic leading-relaxed text-text-secondary text-center max-w-xl mx-auto">
        {children}
      </blockquote>
    </aside>
  );
}

export const mdxComponents: MDXComponentsType = {
  Callout,
  PullQuote,
  h1: (props) => (
    <h1
      className="font-headline text-4xl font-medium leading-tight tracking-tight mt-12 mb-4"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="font-headline text-2xl font-medium leading-snug tracking-tight mt-10 mb-3"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="font-headline text-xl font-medium leading-snug mt-8 mb-2"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="text-accent underline underline-offset-3 decoration-1 hover:text-accent-hover transition-colors"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-l-3 border-accent pl-6 my-8 italic text-text-secondary text-lg leading-relaxed"
      {...props}
    />
  ),
  Emphasis: ({ children }: { children: React.ReactNode }) => (
    <em className="not-italic font-headline font-medium text-text bg-accent/8 px-2 py-0.5 rounded-sm mb-2 inline-block">
      {children}
    </em>
  ),
};
