import fs from "fs";
import path from "path";
import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";
import { fromHtml } from "hast-util-from-html";

const chartsDir = path.join(process.cwd(), "content", "blog", "charts");
const codeDir = path.join(process.cwd(), "content", "blog", "code");

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function langLabel(filename: string): string {
  const ext = path.extname(filename).slice(1);
  const map: Record<string, string> = {
    py: "python",
    js: "javascript",
    ts: "typescript",
    json: "json",
    sh: "shell",
    yaml: "yaml",
    yml: "yaml",
    md: "markdown",
    txt: "text",
  };
  return map[ext] || ext;
}

export function rehypeChart() {
  return (tree: Root) => {
    visit(tree, "mdxJsxFlowElement", (node: any, index, parent) => {
      if (!parent || typeof index !== "number") return;

      // Handle <Chart src="..." />
      if (node.name === "Chart") {
        const srcAttr = node.attributes?.find(
          (a: any) => a.type === "mdxJsxAttribute" && a.name === "src"
        );
        if (!srcAttr?.value) return;

        const filePath = path.resolve(chartsDir, srcAttr.value);
        if (!fs.existsSync(filePath)) {
          console.warn(`[rehype-chart] File not found: ${filePath}`);
          return;
        }

        const html = fs.readFileSync(filePath, "utf-8");
        const fragment = fromHtml(html, { fragment: true });

        const wrapper: Element = {
          type: "element",
          tagName: "div",
          properties: { className: ["chart-embed"] },
          children: fragment.children as Element[],
        };

        (parent as any).children[index] = wrapper;
      }

      // Handle <Code src="..." title="..." collapsed />
      if (node.name === "Code") {
        const srcAttr = node.attributes?.find(
          (a: any) => a.type === "mdxJsxAttribute" && a.name === "src"
        );
        if (!srcAttr?.value) return;

        const titleAttr = node.attributes?.find(
          (a: any) => a.type === "mdxJsxAttribute" && a.name === "title"
        );
        const collapsedAttr = node.attributes?.find(
          (a: any) => a.type === "mdxJsxAttribute" && a.name === "collapsed"
        );

        const filePath = path.resolve(codeDir, srcAttr.value);
        if (!fs.existsSync(filePath)) {
          console.warn(`[rehype-code] File not found: ${filePath}`);
          return;
        }

        const raw = fs.readFileSync(filePath, "utf-8");
        const escaped = escapeHtml(raw);
        const title = titleAttr?.value || srcAttr.value;
        const lang = langLabel(srcAttr.value);
        const lineCount = raw.split("\n").length;
        const collapsed = collapsedAttr !== undefined;
        const downloadName = path.basename(srcAttr.value);

        // Build the HTML for the code viewer
        const html = `
<details class="code-embed my-6 group"${collapsed ? "" : " open"}>
  <summary style="cursor:pointer;user-select:none;display:flex;align-items:center;gap:8px;padding:10px 16px;background:#1e1e1e;color:#d4d4d4;border-radius:8px 8px 0 0;font-size:13px;font-family:ui-monospace,monospace;border:1px solid #333;border-bottom:none;transition:background 0.15s" onmouseover="this.style.background='#252525'" onmouseout="this.style.background='#1e1e1e'">
    <span style="color:#8B8680;font-size:11px;transition:transform 0.15s" class="code-arrow">&#9654;</span>
    <span style="color:#8B8680;font-size:10px;text-transform:uppercase;letter-spacing:0.05em">${lang}</span>
    <span style="color:#ccc">${escapeHtml(title)}</span>
    <span style="margin-left:auto;display:flex;gap:6px;align-items:center">
      <span style="color:#666;font-size:11px">${lineCount} lines</span>
      <button onclick="navigator.clipboard.writeText(this.closest('details').querySelector('code').textContent);this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',1500)" style="padding:2px 8px;font-size:11px;font-family:ui-monospace,monospace;background:#2d2d2d;border:1px solid #444;border-radius:4px;color:#999;cursor:pointer;transition:all 0.15s" onmouseover="this.style.borderColor='#C45D3E';this.style.color='#C45D3E'" onmouseout="this.style.borderColor='#444';this.style.color='#999'">Copy</button>
      <button onclick="const b=new Blob([this.closest('details').querySelector('code').textContent],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='${downloadName}';a.click()" style="padding:2px 8px;font-size:11px;font-family:ui-monospace,monospace;background:#2d2d2d;border:1px solid #444;border-radius:4px;color:#999;cursor:pointer;transition:all 0.15s" onmouseover="this.style.borderColor='#C45D3E';this.style.color='#C45D3E'" onmouseout="this.style.borderColor='#444';this.style.color='#999'">Download</button>
    </span>
  </summary>
  <div style="overflow:auto;max-height:500px;background:#1e1e1e;border:1px solid #333;border-radius:0 0 8px 8px">
    <pre style="padding:16px;font-size:13px;line-height:1.6;margin:0"><code style="color:#d4d4d4;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre">${escaped}</code></pre>
  </div>
</details>`;

        const fragment = fromHtml(html, { fragment: true });
        const wrapper: Element = {
          type: "element",
          tagName: "div",
          properties: { className: ["code-embed-wrapper"] },
          children: fragment.children as Element[],
        };

        (parent as any).children[index] = wrapper;
      }
    });
  };
}
