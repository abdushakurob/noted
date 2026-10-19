# note'd — plain-English guide

**What it is:** A small app on your computer that turns “fix this button” into a clear job for **Cursor** (or any MCP-compatible coding assistant). **No browser extension.** **No uploading screenshots.**

**Who it’s for:** Freelancers and small studios tired of vague revision emails and lost context after Zoom calls.

---

## What you need

| Thing | Why |
|--------|-----|
| **Node 22+** | Runs the local server |
| **pnpm** | Installs the project |
| **Cursor** (optional but ideal) | Reads tasks via MCP |
| **Ollama** (optional) | Free **local** AI (Gemma) that turns comments into a structured brief on your machine |

---

## Words we avoid

| Instead of… | We say… |
|-------------|---------|
| MCP | “Connect Cursor” / “assistant tools” |
| Daemon | “Local server” (runs at `127.0.0.1:3737`) |
| Synthesis | “Turn comment into a task” |
| Capture payload | “What we measured on the page” |
| Agent mode | “Cursor writes the task” (no Ollama) |
| Ollama mode | “Gemma on your laptop writes the task” |

---

## The flow (30 seconds)

1. **Demo or client site** — Click **Start capture** (or Alt+Shift+N), click the element, type what’s wrong.
2. **Panel** (`http://localhost:5174`) — Review the task, click **Approve for agent**.
3. **Cursor** — Fetch the task, change the code, save.
4. **Panel** — **Request verify** to compare before/after on the live page.

Everything stays on **your** machine unless you later use a hosted review link (coming soon).

---

## Two ways to use local AI

### A. Gemma via Ollama (recommended for demos)

1. Install [Ollama](https://ollama.com/download).
2. Run: `ollama pull gemma2:2b`
3. Start the server **without** agent override (default uses Ollama).

Gemma reads the measurements + comment and writes acceptance criteria **locally**. Nothing is sent to OpenAI for that step.

### B. Cursor only (simplest install)

```powershell
$env:NOTED_SYNTHESIS = "agent"
pnpm noted
```

Capture still records measurements; **you approve**, then Cursor interprets the task. Good when Ollama isn’t installed yet.

---

## Windows tips

- Run commands from the project folder: `cd "C:\Users\st\Desktop\projects\note'd"`
- PowerShell 5.x: **one command per line** (no `&&`), or use `pnpm noted:restart`
- **Terminal 1:** `pnpm noted` — **leave it open**
- **Terminal 2:** `pnpm dev:stack`
- Check health: http://127.0.0.1:3737/health → `"notedJs": true`

Full commands: [GETTING-STARTED.md](./GETTING-STARTED.md).

---

## Privacy in one sentence

We measure DOM and styles — not pixels — and the default server only listens on **127.0.0.1** on your laptop.

---

## What’s not built yet (honest)

- Shareable client review link (like ngrok for feedback)
- “Resolved” badge on the client’s live page during a call
- Hosted relay for non-technical clients

The open-source core — capture, panel, local AI, Cursor — is what you run today.
