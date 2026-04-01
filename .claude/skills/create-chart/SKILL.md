---
name: create-chart
description: >
  Create SVG charts for blog posts. Use when the user needs a visualization,
  chart, graph, or diagram for a blog post. Handles the full flow: design the
  SVG, save to charts directory, reference in MDX.
user-invocable: true
---

# Chart Creation Guide

Charts are hand-crafted SVGs stored in `content/blog/charts/` and embedded in MDX via:
```mdx
<Chart src="my-chart.svg" />
```

The `rehype-chart` plugin (`src/lib/rehype-chart.ts`) reads the file at compile time
and injects the SVG inline into the page. No JS required on the client.

## Before Creating

1. Read existing charts in `content/blog/charts/` for current style
2. Read `grokking-charts.html` in the evolution-theory repo for the full reference set
3. Check the blog's color palette in the project-context skill

## Design System

**Colors** (match the blog's editorial palette):
- Background: `#FDFBF7` (warm cream)
- Primary accent: `#C45D3E` (terracotta)
- Secondary accent: `#D4846A` (lighter terracotta)
- Positive/success: `#2D8B46` (muted green)
- Neutral: `#8B8680` (warm grey)
- Muted data: `#BFBAB3` (light grey)
- Grid lines: `#E8E4DE`
- Text primary: `#1A1A1A`
- Text secondary: `#4A4A4A`

**Typography:**
- Font family: `DM Sans, system-ui, sans-serif` for all chart text
- Axis labels: font-size 10, fill `#8B8680`
- Data labels: font-size 10-11, fill `#4A4A4A`
- Key values: font-weight 600 or 700
- Title: rendered in MDX prose, not inside the SVG

**Layout:**
- ViewBox: typically `0 0 720 [height]` (720 matches blog max-width)
- Style: `width:100%;display:block` on the root SVG
- Background rect with `rx="6"` for rounded corners
- Left margin ~72px for y-axis labels
- Right margin to ~692px
- Top/bottom padding ~32px
- X-axis labels below the plot area

**Grid:**
- Horizontal grid lines: `stroke="#E8E4DE" stroke-width="0.3"`
- Axis lines: `stroke="#E8E4DE" stroke-width="0.5"`
- Dashed reference lines: `stroke-dasharray="3 3"` or `"4 3"`

## Chart Types & Patterns

**Line chart** (trajectories, time series):
```svg
<polyline fill="none" stroke="#C45D3E" stroke-width="2.5" points="x1,y1 x2,y2 ..."/>
```
- Use different stroke colors/styles for each line
- Dashed lines for secondary data: `stroke-dasharray="4 3"`
- Label each line at its endpoint with the final value

**Bar chart** (comparisons):
```svg
<rect x="100" y="150" width="60" height="100" rx="3" fill="#C45D3E"/>
```
- Round corners with `rx="3"` or `rx="4"`
- Use opacity for muted bars: `opacity="0.7"`
- Paired bars: same x position, offset by bar width + gap

**Heatmap / status grid** (like the ablation table):
- Colored rectangles with text overlaid
- Green `#2D8B46` for positive outcomes
- Red/terracotta `#C45D3E` for negative outcomes
- White text on colored backgrounds

**Diagram** (phase diagrams, flow charts):
- Rounded rectangles: `rx="8"`, semi-transparent fill
- Arrows: `<line>` + `<polygon>` for arrowhead
- Section labels in accent colors

## Annotations

- Use `<text>` elements for annotations, not separate labels
- Key insights in bold: `font-weight="600"`
- Use accent color for the most important annotation
- Subtle annotations in `#8B8680`
- Connection lines: thin (0.5-1px), sometimes dashed

## Coordinate Helpers

For plotting data to SVG coordinates:
```
toX(value) = leftMargin + (value - minX) / (maxX - minX) * plotWidth
toY(value) = plotBottom - (value - minY) / (maxY - minY) * plotHeight
```

Typical values: leftMargin=72, plotWidth=620, plotBottom=300-320, plotHeight=268-288

## Workflow

1. Design the SVG (can preview by opening the `.svg` file directly in browser)
2. Save to `content/blog/charts/descriptive-name.svg`
3. In MDX: `<Chart src="descriptive-name.svg" />`
4. Verify in dev server: `http://localhost:3000/blog/[slug]`

## File Naming Convention

Use kebab-case, prefix with the post topic:
- `grok-curve.svg`
- `grok-7k-trajectories.svg`
- `genome-sparsity-sweep.svg`
- `crystal-embedding-convergence.svg`

## Testing

After creating a chart, always verify it renders by checking the dev server.
SVGs with syntax errors will silently fail to render.
