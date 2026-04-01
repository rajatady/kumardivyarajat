---
name: project-context
description: >
  Architecture, design decisions, and institutional knowledge for kumardivyarajat.com.
  Load this when working on the site, CMS, content system, styling, or when you need
  to understand why something was built a certain way. Also load when the user asks
  about the project history, decisions, or architecture.
user-invocable: true
---

# kumardivyarajat.com — Project Context

You are working on a personal blog and portfolio for Kumar Divya Rajat.
Read the codebase for current file structure and implementation — this document captures
**decisions, rationale, and institutional knowledge** that the code alone cannot convey.

---

## Identity & Links

- **Owner**: Kumar Divya Rajat
- **GitHub**: github.com/rajatady
- **X**: @Rajat225
- **Email**: rajat.ady@gmail.com
- **Domain**: kumardivyarajat.com
- **Repo**: github.com/rajatady/kumardivyarajat (same repo as website)

---

## What This Project Is

A personal blog + portfolio + in-app CMS. Three systems in one repo:

1. **Public site** — statically generated pages (home, blog, projects, about)
2. **Content system** — MDX files in `/content/blog/` and `/content/projects/` parsed at build time
3. **CMS** — web-based editor at `/cms` that commits MDX files to GitHub via the Contents API, triggering Vercel rebuilds

---

## Design Direction

**Aesthetic**: Editorial / magazine. Think literary journal, not SaaS landing page.

**Typography choices and why**:
- **Newsreader** (headlines) — elegant variable serif, gives editorial gravitas
- **Source Serif 4** (body) — refined reading font optimized for long-form
- **DM Sans** (UI/meta) — clean sans-serif for navigation, tags, dates, buttons

**Color palette and why**:
- Warm cream background (#FDFBF7) — softer than pure white, easier on eyes for reading
- Deep charcoal text (#1A1A1A) — high contrast without the harshness of pure black
- Terracotta accent (#C45D3E) — warm, editorial, distinctive without being flashy
- The palette was chosen to feel like a printed magazine, not a screen-native app

**Layout principles**:
- Max-width 720px for article body (optimal reading line length ~65-75 chars)
- Generous vertical spacing (editorial breathing room)
- Large hero typography on home page
- Subtle grain overlay for texture (CSS SVG filter, not an image)

---

## Content System Decisions

### Why MDX files in the repo (not a database or headless CMS)?

- **Simplicity**: No database, no external service, no API keys for reading
- **Version control**: Every edit is a git commit with full history
- **Portability**: Content is plain files, trivially migrable
- **Cost**: Zero — no CMS subscription, just Vercel free tier
- **Developer experience**: Write in any editor, preview locally with `npm run dev`

### Why two content types have different compilation modes

- **Blog posts** use standard MDX compilation — they may contain JSX components like `<Emphasis>`, `<Callout>`, `<PullQuote>`
- **Project pages** use `format: "md"` in compileMDX — because project READMEs often contain angle brackets in plain text (like `<->`, `<think>`) that MDX would try to parse as JSX and fail. The `format: "md"` flag tells the compiler to treat content as plain markdown, no JSX parsing.

### Content frontmatter schemas

**Blog posts** (`/content/blog/*.mdx`):
- `title`, `description`, `date`, `tags[]`, `published` (boolean), optional `coverImage`
- `published: false` hides from public listing but still accessible by direct URL

**Projects** (`/content/projects/*.mdx`):
- `title`, `description`, `url` (external link), `tags[]`, `featured` (boolean)
- `featured: true` shows on home page and gets accent border + badge on projects page
- Body content renders on `/projects/[slug]` detail page

### The `<Emphasis>` component

A custom MDX component used in blog posts for highlighted callout text. Renders as a styled `<em>` with accent background. Defined in `src/components/MDXComponents.tsx`. Only works in blog posts (MDX mode), not project pages (md mode).

---

## CMS Architecture Decisions

### Why GitHub OAuth (not simple password)?

- The user wanted proper auth, not security-through-obscurity
- GitHub OAuth gives identity verification — only the repo owner (rajatady) can access
- Auth.js v5 (next-auth beta) handles PKCE, CSRF, session management
- Access restricted via `signIn` callback checking `profile.login === CMS_ALLOWED_GITHUB_ID`

### Why a separate GitHub PAT for commits (not the OAuth token)?

- Fine-grained PAT with only "Contents: read/write" on the single repo
- The OAuth token from login has broader permissions than needed for file operations
- Separation of concerns: auth token for identity, PAT for content operations
- Set in `GITHUB_TOKEN` env var

### Why the CMS reads/writes via GitHub API, not the filesystem?

- The app runs on Vercel — there is no persistent filesystem in production
- GitHub API works identically in local dev and production
- After a commit via the API, Vercel webhook triggers a rebuild (~30s)
- The CMS dashboard always shows fresh content from GitHub, not stale build-time data

### Why no delete in the CMS?

- User explicitly requested create and edit only
- Deletion is destructive and irreversible in the content model
- If needed, delete via git directly (more deliberate)

### CMS layout vs public site layout

- Header and Footer components check `pathname.startsWith("/cms")` and return null
- CMS has its own layout (`src/app/cms/layout.tsx`) with CMSHeader, auth gate, accent top bar
- No route group refactor was done — existing files stay in place, no moves/deletes
- This was a deliberate choice: the user did not want existing files moved

---

## Known Technical Gotchas

### MD editor cursor sync issue (RESOLVED)

**Problem**: `@uiw/react-md-editor` uses a transparent `<textarea>` overlaid on a `<pre>` element. If you set a proportional font (like Source Serif) on `.w-md-editor`, the character widths differ between textarea and pre, causing the cursor to land at the wrong character position.

**Fix**: Do NOT override `font-family` on `.w-md-editor` or `.w-md-editor-text-*` elements. Let the editor use its default monospace font. Only the preview pane (`.w-md-editor-preview .wmde-markdown`) gets the serif font.

**Also**: Dirty tracking used `useState` + `useEffect` with `content` as a dependency, causing an extra React re-render on every keystroke. This was changed to `useRef` to avoid re-renders that could desync the editor's internal state. If you ever see cursor issues again, check for unnecessary re-renders in the editor component.

### Tags input comma issue (RESOLVED)

**Problem**: Tags were stored as `string[]` but displayed via `value.join(", ")`. On every keystroke, `onChange` split by comma, trimmed, and filtered empty strings — so typing a comma immediately removed the empty string after it, jumping the cursor.

**Fix**: Tags input uses local `raw` string state while focused. Only parses to `string[]` on blur.

### Code blocks — dark theme for code, light text for ASCII art

- `rehype-pretty-code` with Monokai theme gives syntax-highlighted code a dark background
- Plain text code blocks (no language tag, like ASCII diagrams) get `color: #E3E1DC` via `.prose pre` CSS so they're readable against the dark background
- The syntax highlighter overrides this color for language-tagged blocks, so it only affects plain blocks

### remark-gfm is required for tables

- Both blog and project detail pages include `remarkGfm` in their `compileMDX` options
- Without it, pipe-delimited markdown tables render as raw text
- Table styles are in `.prose table/th/td` in globals.css

---

## Environment Variables

```
AUTH_SECRET          — openssl rand -base64 32
AUTH_GITHUB_ID       — GitHub OAuth App client ID
AUTH_GITHUB_SECRET   — GitHub OAuth App client secret
GITHUB_TOKEN         — Fine-grained PAT (Contents read/write on this repo)
GITHUB_REPO_OWNER    — rajatady
GITHUB_REPO_NAME     — kumardivyarajat
CMS_ALLOWED_GITHUB_ID — rajatady
```

GitHub OAuth App callback: `https://kumardivyarajat.com/api/auth/callback/github`
(and `http://localhost:3000/api/auth/callback/github` for local dev)

---

## Deployment

- **Hosting**: Vercel, connected to the GitHub repo
- **Build trigger**: Every push to `main` triggers a Vercel rebuild
- **CMS workflow**: User edits in CMS → commits to GitHub via API → Vercel rebuilds → site updates in ~30s
- **Static generation**: Blog posts and project pages are statically generated at build time via `generateStaticParams`
- **Dynamic routes**: CMS pages, auth routes, and blog listing (for tag filtering) are server-rendered on demand

---

## For Future Sessions: How to Maintain This Document

### What to capture

- **Architectural decisions** — especially "why" something was chosen over alternatives
- **Gotchas and bugs** — with root cause and fix, so the same mistake isn't repeated
- **User preferences** — things the user explicitly asked for or rejected
- **Constraints** — things that limit implementation choices (e.g., "no delete", "don't move files")

### What NOT to capture (look at the code instead)

- File paths and directory structure — run `find` or `glob`
- Current component props or function signatures — read the source
- Current CSS values — read globals.css
- Git history — use `git log`

### When to append

- A new feature is added with non-obvious design decisions
- A bug is fixed where the root cause was surprising
- The user expresses a strong preference about how things should work

### When to update/replace

- An existing decision is reversed (e.g., "we now DO support delete")
- A gotcha is no longer relevant (e.g., library was replaced)
- Information is factually outdated

### When to remove

- A section describes something that no longer exists in the codebase
- A gotcha was for a library version that's been upgraded past the issue

### How to decide

Ask: "Would a future me, reading only the code, miss this information?" If yes, capture it. If the code makes it obvious, skip it.
