---
name: add-citations
description: >
  Add verified citations and references to blog posts. Use when linking to papers,
  referencing prior work, or the user asks to add citations. Ensures all links are
  real and accessible.
user-invocable: true
---

# Citations & Links Guide

All links in blog posts must be verified. No hallucinated URLs.

## Citation Format

**Numbered references with clickable anchor links.** Inline citations use `[[N]](#ref-N)`
which renders as a clickable [N] that jumps to the reference. Full entries go in a
`## References` section at the end of the post, each prefixed with an `<a id="ref-N"></a>` anchor.

**Inline usage:**
```mdx
This was established by Nanda et al. [[2]](#ref-2) and is well-accepted.

Weight decay drives grokking [[1]](#ref-1), [[3]](#ref-3).

Xu et al. [[4]](#ref-4) showed that transferring embeddings eliminates the delay.
```

**References section (at the very end of the post, after all content):**
```mdx
---

## References

<a id="ref-1"></a>1. Power, A., Burda, Y., Edwards, H., Babuschkin, I., & Misra, V. (2022). Grokking: Generalization beyond overfitting on small algorithmic datasets. [arXiv:2201.02177](https://arxiv.org/abs/2201.02177)

<a id="ref-2"></a>2. Nanda, N., Chan, L., Lieberum, T., Smith, J., & Steinhardt, J. (2023). Progress measures for grokking via mechanistic interpretability. [arXiv:2301.05217](https://arxiv.org/abs/2301.05217)
```

**Rules:**
- Number references in the order they first appear in the text
- Inline: `[[N]](#ref-N)` - renders as clickable [N] that jumps down
- Reference anchor: `<a id="ref-N"></a>` on its own line before the entry
- Each reference entry: `N. Authors (Year). Title. [arXiv:ID](URL)`
- Include full author list (or "et al." if many), year, title, and linked arXiv/DOI
- Separate references section from content with a `---` horizontal rule

## When to Cite

- Claiming something is "established" or "known"
- Referencing a specific technique or finding from prior work
- Comparing your results to prior work
- Crediting an idea or method

## When NOT to Cite

- Common knowledge ("transformers use attention")
- Your own experiments (just describe them)
- General concepts that don't need attribution

## Verification Protocol

Before including ANY link:

1. **arXiv papers**: Verify the paper ID exists
   - URL format: `https://arxiv.org/abs/YYMM.NNNNN`
   - Use web search to verify: `"paper title" arxiv`

2. **GitHub repos**: Verify they exist and haven't been deleted

3. **Never guess a URL.** If you can't verify it, cite without a link:
   ```
   This was shown by Nanda et al. [[3]](#ref-3).
   ```
   Then in References:
   ```
   <a id="ref-3"></a>3. Nanda, N., et al. (2023). Progress measures for grokking via mechanistic interpretability.
   ```
   (No arXiv link, but specific enough to find.)

## Links to Own Content

**Cross-referencing blog posts** (use relative paths, these are NOT numbered references):
```mdx
I wrote about this in [the genome hypothesis post](/blog/what-if-pretrained-weights-are-a-genome-not-a-brain).
```

**Linking to code:**
```mdx
All code is available at [github.com/rajatady/Neural-Genome](https://github.com/rajatady/Neural-Genome).
```

These are regular markdown links. Only academic papers go in the References section.

## Related Posts

In frontmatter, use actual slugs that exist:
```yaml
relatedPosts:
  - what-if-pretrained-weights-are-a-genome-not-a-brain
```
Always verify the slug matches an actual file in `content/blog/`.

## Verified Paper References

These have been used in existing posts:

| Paper | arXiv |
|---|---|
| Power et al. 2022 - Grokking | 2201.02177 |
| Nanda et al. 2023 - Progress Measures for Grokking | 2301.05217 |
| Liu et al. 2023 - Omnigrok | 2310.06110 |
| Xu et al. 2025 - Let Me Grok for You | 2504.13292 |
| AlQuabeh et al. 2025 - Grokking from Embedding Layer | 2505.15624 |
| Lyu et al. 2025 - Norm-Separation Delay Law | 2603.13331 |
| Huh et al. 2024 - Platonic Representation Hypothesis | 2405.07987 |

When citing a new paper, add it to this table for future reference.

## Tone

Match the blog's conversational style:

Good: "This aligns with recent work by Xu et al. [[4]](#ref-4), who showed that..."
Bad: "As demonstrated in the seminal work of Xu et al. [[4]](#ref-4), it has been established that..."
