---
name: write-blog
description: >
  Write a blog post matching the author's voice. Use when creating new blog content,
  drafting posts, or editing existing posts for tone and structure. Automatically invoked
  when asked to write, draft, or edit a blog post.
user-invocable: true
---

# Blog Writing Guide for kumardivyarajat.com

You are writing for Kumar Divya Rajat's research blog. Before writing, read at least
two existing posts in `content/blog/` to absorb the current voice. The style evolves -
always check what's live.

## Voice & Tone

**First person, conversational, direct.** Not academic, not casual. The tone of a
researcher talking to a smart colleague over coffee. Honest about uncertainty.

Key patterns from existing posts:

- Lead with the observation, not the background. "I was thinking about X" not "In recent years, X has emerged as..."
- Short declarative sentences for key insights. Long sentences only when building an argument.
- Admit what you don't know. "I could be completely wrong." "I don't know how to do that yet."
- Report negative results and failures alongside positive ones.
- Use "I" not "we" unless there were actual collaborators.
- End sections with the implication, not a summary.

## Formatting Rules

**Never use em dashes.** Use hyphens surrounded by spaces instead: " - "

**Frontmatter** (required fields):
```yaml
---
title: 'Title in sentence case'
description: >-
  One to three sentences. This appears below the title and in social cards.
date: 'YYYY-MM-DD'
tags:
  - tag-one
  - tag-two
published: true
relatedPosts:
  - slug-of-related-post
---
```

**Structure pattern** (most posts follow this):
1. Opening observation or question (no heading)
2. `## Context` - what led to this
3. `## The experiment / The setup` - what was done
4. `## Results` - charts, tables, data
5. `## What this means` - interpretation (careful, hedged)
6. `## What I got wrong` or `## Limitations` - honest failures
7. `## What's next` - open questions

**MDX Components available:**

- `<Emphasis>key insight text</Emphasis>` - highlighted callout, use for the 2-3 most important sentences per post
- `<Callout type="info|warning|tip">text</Callout>` - boxed callout
- `<PullQuote>text</PullQuote>` - centered pull quote
- `<Chart src="filename.svg" />` - inline SVG chart from `content/blog/charts/`
- `<DataView title="name" lang="json|python" collapsed>` - collapsible code viewer

**Tables** - use standard markdown tables with GFM. Keep them readable:
```
| Condition | Result | Notes |
|---|---|---|
| baseline | 92% | - |
```

**Images** - hosted on Vercel blob storage:
```
![description](https://xqajxza5bt4r8kvb.public.blob.vercel-storage.com/filename.png)
```

**Inline code** - fenced blocks with language tags for short snippets. Inline code for single terms: `requires_grad = False`.

**Links** - always verified. See `/add-citations` skill for academic references.

## Sharing Experiment Code & Results

The blog supports embedding full experiment files inline via the rehype plugin.
Files live in `content/blog/code/` and are referenced with:

```mdx
<Code src="grokking_ablation.py" title="grokking_ablation.py" collapsed />
```

This renders a collapsible dark code viewer with Copy and Download buttons.
The file is read at build time - no external hosting needed.

**Rules for sharing code:**

1. **Never share raw experiment files directly.** Always create a cleaned copy in
   `content/blog/code/`. The original may have hardcoded paths, API keys, debug prints,
   or messy formatting that shouldn't be public.

2. **Always confirm with the user** before adding any code file. Ask: "I'll create a
   cleaned version of X for the blog - want to review before I add it?"

3. **Never share proprietary data.** No HuggingFace tokens, SSH keys, server IPs,
   internal paths, or dataset credentials. Grep the file for common patterns:
   `token`, `key`, `secret`, `password`, `/home/`, `/Users/`, `ssh`, `@`.

4. **Clean the code for readability:**
   - Remove dead code, commented-out experiments, debug prints
   - Add a docstring at the top explaining what it does and how to run it
   - Keep the logic faithful to what actually ran - don't refactor
   - Include the device setup (MPS/CUDA/CPU) so readers can reproduce

5. **For JSON results:** Don't dump raw experiment JSONs. They often contain
   internal paths, timestamps, or excessive trajectory data. Instead, create a
   summary table in markdown or extract the key numbers inline.

6. **For notebooks:** Convert to a clean `.py` script. Notebooks contain output
   cells, execution counts, and kernel metadata that clutters the code viewer.
   If the user specifically wants a notebook, confirm first.

7. **Use `collapsed` by default** so code blocks don't break reading flow.
   The reader can expand if interested.

8. **Naming:** Match the original filename when possible. Put in
   `content/blog/code/` with a descriptive name: `grokking_ablation.py`,
   not `experiment.py` or `code.py`.

**Linking to external code** (alternative to inline):
Only link to a GitHub repo if the user has explicitly provided the URL. Never guess
or construct a GitHub URL. If no repo URL is provided, don't link to one - just use
`<Code>` to embed the file inline.

## What NOT to Do

- **NEVER hallucinate URLs.** Do not construct GitHub links, arXiv links, or any URL unless the user has explicitly provided it or you have verified it exists. If you don't have a link, don't create one. This is non-negotiable.
- No em dashes. Ever. Use " - " instead.
- No "In this blog post, we will..." introductions.
- No "In conclusion..." summaries.
- No trailing summary of what was just done.
- No emojis unless the user explicitly asks.
- Don't over-hedge. One "I think" per paragraph max.
- Don't add features, components, or code the user didn't ask for.
- Don't create README files or documentation unless asked.

## Before Publishing Checklist

1. Frontmatter complete with date, tags, description
2. All `<Chart src="...">` files exist in `content/blog/charts/`
3. All `<Code src="...">` files exist in `content/blog/code/`
4. Code files are clean - no tokens, keys, internal paths, raw data
5. All links are verified (run them)
6. Citations use `[[N]](#ref-N)` format with anchored `## References` section
7. Related posts slugs match actual files
8. No em dashes in the entire file
9. Read it aloud - does it sound like the author?
