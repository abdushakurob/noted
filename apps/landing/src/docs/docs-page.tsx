import SiteFooter from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { DEMO_PATH, GITHUB_URL } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { useEffect, type ReactNode } from "react";

const pages = [
  { href: "/docs", label: "Overview" },
  { href: "/docs/install", label: "Install" },
  { href: "/docs/capture", label: "Capture" },
  { href: "/docs/model", label: "Local model" },
  { href: "/docs/cursor", label: "Cursor" },
  { href: "/docs/limits", label: "Not built yet" },
] as const;

function Code({ children }: { children: string }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-[13px] leading-6 text-foreground">
      {children}
    </pre>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-[15px] leading-7 text-muted-foreground">{children}</p>;
}

function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mt-12 scroll-mt-24 text-2xl text-foreground first:mt-0">
      {children}
    </h2>
  );
}

const articles: Record<string, { title: string; body: ReactNode }> = {
  "/docs": {
    title: "Overview",
    body: (
      <>
        <P>
          note’d turns “fix this” into a task with the real size of the thing you pointed at. The
          measurement stays on your computer. Cursor reads the task from there.
        </P>
        <P>There are two ways in.</P>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15px] leading-7 text-muted-foreground">
          <li>
            <a className="text-foreground underline decoration-border underline-offset-4" href={DEMO_PATH}>
              Try the demo
            </a>{" "}
            in the browser. No install.
          </li>
          <li>
            <a className="text-foreground underline decoration-border underline-offset-4" href="/docs/install">
              Install it
            </a>{" "}
            and run the capture on your own page, then approve the task for Cursor.
          </li>
        </ol>
        <H2>The loop</H2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15px] leading-7 text-muted-foreground">
          <li>Point at an element and say what should change.</li>
          <li>note’d records the size, whether it is on screen, and the contrast.</li>
          <li>You approve the task on this computer.</li>
          <li>Cursor reads it and changes the page. You can measure the element again.</li>
        </ol>
        <H2>Where a model fits</H2>
        <P>
          The note is a sentence. The size is a fact. A model on your computer can read both and
          write the task. That step is optional.{" "}
          <a className="text-foreground underline decoration-border underline-offset-4" href="/docs/model">
            Local model
          </a>
          .
        </P>
      </>
    ),
  },
  "/docs/install": {
    title: "Install",
    body: (
      <>
        <P>
          You install from the repository. There is no npm package. You need Node 20 or newer, pnpm,
          and git.
        </P>
        <H2>Get the code</H2>
        <Code>{`git clone https://github.com/abdushakurob/noted.git
cd noted
pnpm install
pnpm build`}</Code>
        <H2>Terminal 1, leave it open</H2>
        <P>Without a local model:</P>
        <Code>{`$env:NOTED_SYNTHESIS = "agent"
pnpm noted`}</Code>
        <P>
          With Gemma on this computer, install{" "}
          <a className="text-foreground underline decoration-border underline-offset-4" href="https://ollama.com/download" target="_blank" rel="noreferrer">
            Ollama
          </a>
          , run <code className="text-foreground">ollama pull gemma2:2b</code>, and start with{" "}
          <code className="text-foreground">pnpm noted</code> only. Do not set the agent line.
        </P>
        <H2>Terminal 2</H2>
        <Code>pnpm dev:stack</Code>
        <ul className="mt-4 space-y-2 text-[15px] leading-7 text-muted-foreground">
          <li>Sample page: http://localhost:5180</li>
          <li>Approve tasks: http://localhost:5174</li>
          <li>Health: http://127.0.0.1:3737/health</li>
        </ul>
        <P>
          On PowerShell 5, put each command on its own line. If port 3737 is taken, run{" "}
          <code className="text-foreground">pnpm noted:kill</code> and then{" "}
          <code className="text-foreground">pnpm noted</code>.
        </P>
        <P>
          <a className="text-foreground underline decoration-border underline-offset-4" href={GITHUB_URL} target="_blank" rel="noreferrer">
            Repository
          </a>
        </P>
      </>
    ),
  },
  "/docs/capture": {
    title: "Capture",
    body: (
      <>
        <P>Open the sample page, click Start capture, then click the element you mean.</P>
        <H2>What is recorded</H2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-7 text-muted-foreground">
          <li>Width and height in pixels</li>
          <li>Whether it is on screen or below the fold</li>
          <li>Text contrast, when it can be measured</li>
          <li>The element’s place in the page</li>
          <li>On a React or Vue page, the component name</li>
        </ul>
        <P>
          This is not a screenshot. A picture hides the number. The size is stored as a number on
          this computer.
        </P>
        <H2>Then approve it</H2>
        <P>
          Open http://localhost:5174, open the task, and choose Approve — send to Cursor. Alt+Shift+N
          also starts a capture. If the keys do nothing, use the button.
        </P>
        <P>
          The{" "}
          <a className="text-foreground underline decoration-border underline-offset-4" href={DEMO_PATH}>
            public demo
          </a>{" "}
          lets you practice the same point-and-note step without the local server.
        </P>
      </>
    ),
  },
  "/docs/model": {
    title: "Local model",
    body: (
      <>
        <P>
          “Too small” does not say how small. The measurement does. The model’s job is to read your
          sentence next to that measurement and write a task: what to change, and a size you can
          check.
        </P>
        <H2>Gemma on this computer</H2>
        <Code>{`ollama pull gemma2:2b
pnpm noted`}</Code>
        <P>
          The default model is <code className="text-foreground">gemma2:2b</code>. It runs through
          Ollama. The page is not uploaded for that step. Set{" "}
          <code className="text-foreground">NOTED_OLLAMA_MODEL</code> if you want a different local
          model.
        </P>
        <H2>Skip the model</H2>
        <Code>{`$env:NOTED_SYNTHESIS = "agent"
pnpm noted`}</Code>
        <P>
          You still get the measurement. You approve it, and Cursor writes the change from those
          facts. Use this when Ollama is not installed. A doctor check that says Ollama failed is
          expected in this mode.
        </P>
        <P>
          The public demo writes the task in the browser from the measurement, so you can see the
          step without installing a model.
        </P>
      </>
    ),
  },
  "/docs/cursor": {
    title: "Cursor",
    body: (
      <>
        <P>
          Cursor talks to the local server. Approve a task in the panel first, or there is nothing
          to read.
        </P>
        <H2 id="setup">Add the connection</H2>
        <P>
          In Cursor’s MCP settings, point <code className="text-foreground">node</code> at{" "}
          <code className="text-foreground">packages/mcp-server/dist/index.js</code> inside your
          checkout. Use the full path on your machine.
        </P>
        <Code>{`{
  "mcpServers": {
    "noted": {
      "command": "node",
      "args": ["C:/path/to/noted/packages/mcp-server/dist/index.js"],
      "env": {
        "NOTED_DAEMON_URL": "http://127.0.0.1:3737"
      }
    }
  }
}`}</Code>
        <P>Build the repo first so that file exists. The local server must still be running.</P>
        <H2>What Cursor can do</H2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-7 text-muted-foreground">
          <li>List tasks that are ready</li>
          <li>Read one task, including the measurement and your note</li>
          <li>Mark it in progress or done</li>
          <li>Check the element on the open page after the change</li>
        </ul>
      </>
    ),
  },
  "/docs/limits": {
    title: "Not built yet",
    body: (
      <>
        <P>The site describes a larger product. This is what you can use today.</P>
        <H2>You can</H2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-7 text-muted-foreground">
          <li>Try the demo in the browser</li>
          <li>Capture an element on a page running on your machine</li>
          <li>Keep the note and the measurement on that machine</li>
          <li>Let Gemma write the task locally, or skip the model</li>
          <li>Hand the approved task to Cursor</li>
        </ul>
        <H2>You cannot, yet</H2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-7 text-muted-foreground">
          <li>Share your localhost with a client through a preview link</li>
          <li>Buy Pro, Team, or Enterprise. Those prices are a proposal</li>
          <li>Install note’d from npm. Clone the repository</li>
          <li>Connect Claude Code or Codex. Cursor is the connection that is set up</li>
        </ul>
        <P>
          <a className="text-foreground underline decoration-border underline-offset-4" href="/docs/install">
            Install from the repository
          </a>
        </P>
      </>
    ),
  },
};

export function DocsPage({ path }: { path: string }) {
  const current = articles[path] ? path : "/docs";
  const article = articles[current];
  const index = pages.findIndex((page) => page.href === current);
  const previous = index > 0 ? pages[index - 1] : null;
  const next = index < pages.length - 1 ? pages[index + 1] : null;

  useEffect(() => {
    document.title = `${article.title} — note’d docs`;
  }, [article.title]);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col lg:flex-row">
        <aside className="border-b border-border lg:sticky lg:top-16 lg:h-[calc(100dvh-4rem)] lg:w-56 lg:shrink-0 lg:overflow-auto lg:border-r lg:border-b-0">
          <nav className="flex gap-1 overflow-x-auto px-4 py-3 lg:flex-col lg:px-4 lg:py-8" aria-label="Docs">
            {pages.map((page) => (
              <a
                key={page.href}
                href={page.href}
                aria-current={page.href === current ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-sm lg:rounded-md",
                  page.href === current ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {page.label}
              </a>
            ))}
          </nav>
        </aside>
        <article className="min-w-0 flex-1 px-5 py-12 sm:px-10">
          <p className="text-[13px] font-medium tracking-[0.08em] text-muted-foreground uppercase">Docs</p>
          <h1 className="mt-3 text-[2.25rem] text-foreground">{article.title}</h1>
          <div className="mt-6 max-w-[640px]">{article.body}</div>
          <nav className="mt-16 flex max-w-[640px] justify-between gap-4 border-t border-border pt-6 text-sm" aria-label="Pages">
            {previous ? (
              <a href={previous.href} className="text-muted-foreground hover:text-foreground">
                ← {previous.label}
              </a>
            ) : (
              <span />
            )}
            {next ? (
              <a href={next.href} className="text-foreground hover:underline">
                {next.label} →
              </a>
            ) : null}
          </nav>
        </article>
      </div>
      <SiteFooter />
    </div>
  );
}
