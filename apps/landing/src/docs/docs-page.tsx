import SiteFooter from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { DEMO_PATH, GITHUB_URL, GUIDE_URL, START_URL } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export function DocsPage() {
  useEffect(() => {
    document.title = "Docs — note’d";
  }, []);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[720px] flex-1 px-5 py-16 sm:px-8">
        <p className="text-[13px] font-medium tracking-[0.08em] text-muted-foreground uppercase">Docs</p>
        <h1 className="mt-3 text-[2.25rem] text-foreground">Use it on your machine.</h1>
        <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
          The public demo needs no install. The full loop runs locally: you point at your page, the
          measurement stays on this computer, and Cursor reads the task from here.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={DEMO_PATH} className={cn(buttonVariants({ variant: "accent" }))}>
            Try the demo
          </a>
          <a href={GITHUB_URL} className={cn(buttonVariants({ variant: "outline" }))} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>

        <h2 className="mt-16 text-2xl text-foreground">Two terminals</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Install once with <code className="text-foreground">pnpm install</code> and{" "}
          <code className="text-foreground">pnpm build</code>. Then leave the first window open.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 text-sm leading-6">
          {`$env:NOTED_SYNTHESIS = "agent"
pnpm noted`}
        </pre>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          <code className="text-foreground">agent</code> skips the local model. Leave that line out when Ollama
          is running <code className="text-foreground">gemma2:2b</code>, and the model writes the task on this
          computer.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 text-sm leading-6">
          {`pnpm dev:stack`}
        </pre>
        <ul className="mt-4 space-y-2 text-sm leading-6">
          <li>Sample page: http://localhost:5180 — Start capture, then click the button.</li>
          <li>Approve the task: http://localhost:5174</li>
          <li>Health check: http://127.0.0.1:3737/health</li>
        </ul>

        <h2 id="cursor" className="mt-16 scroll-mt-24 text-2xl text-foreground">Cursor</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Point MCP at <code className="text-foreground">packages/mcp-server/dist/index.js</code> and set{" "}
          <code className="text-foreground">NOTED_DAEMON_URL</code> to{" "}
          <code className="text-foreground">http://127.0.0.1:3737</code>. Approve a task in the panel first.
        </p>

        <h2 className="mt-16 text-2xl text-foreground">If it stalls</h2>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
          <li>Port 3737 already in use: <code className="text-foreground">pnpm noted:kill</code>, then <code className="text-foreground">pnpm noted</code>.</li>
          <li>Doctor says Ollama failed and you are not using a local model: set <code className="text-foreground">NOTED_SYNTHESIS=agent</code>.</li>
          <li>Alt+Shift+N does nothing: use Start capture.</li>
        </ul>

        <p className="mt-10 text-sm leading-6">
          <a href={START_URL} className="underline decoration-border underline-offset-4" target="_blank" rel="noreferrer">
            Full install notes
          </a>
          <span className="text-muted-foreground"> · </span>
          <a href={GUIDE_URL} className="underline decoration-border underline-offset-4" target="_blank" rel="noreferrer">
            User guide
          </a>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
