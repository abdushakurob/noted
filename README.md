# note'd

**Client points at the UI. You get a clear task in Cursor. Everything stays on your machine.**

Open-source for freelance developers. Structured page measurements — not screenshots — plus optional **free local AI** ([Ollama](https://ollama.com) + Gemma) and a **Cursor** connection.

📖 **[User guide (plain English)](docs/USER-GUIDE.md)** · **[5-minute install](docs/GETTING-STARTED.md)**

## Try it

The product page includes a demo. No account.

```powershell
pnpm dev:landing
```

Open the URL Vite prints (usually http://localhost:5173) and choose **Start for free** or go to http://localhost:5173/demo. Click **Upgrade** on the sample page, write what should change, and save. The request keeps the element’s size and whether it was on screen. It stays in this browser.

The local capture loop (daemon, playground, panel, Cursor) is the full install:

```powershell
pnpm install && pnpm build
$env:NOTED_SYNTHESIS = "agent"   # skip this if Ollama + gemma2:2b is installed
pnpm noted                       # Terminal 1 — leave open
pnpm dev:stack                   # Terminal 2
```

Open http://localhost:5180 → **Start capture** → approve in http://localhost:5174.

Landing site (product page): `pnpm dev:landing` → see terminal for URL (usually http://localhost:5173).

## Why not screenshots?

Screenshots make the model guess sizes and colors. note'd records what DevTools would show — height, contrast, selector, React/Vue hints — in a small JSON bundle on **127.0.0.1**.

## Local open AI (optional)

| Mode | What happens |
|------|----------------|
| **Ollama + Gemma** | Your laptop turns the comment into acceptance criteria before Cursor codes |
| **Agent** (`NOTED_SYNTHESIS=agent`) | You approve; Cursor interprets the measurements |

No OpenAI bill for the brief when Ollama runs locally.

## Cursor

Add the MCP server in Cursor settings (`@noted/mcp-server`). Tools: list tasks, get task, mark status, verify.

Details: [docs/GETTING-STARTED.md](docs/GETTING-STARTED.md).

## Monorepo

| Part | Role |
|------|------|
| `packages/capture` | Overlay script (`noted.js`) |
| `packages/daemon` | Local server + SQLite log |
| `packages/mcp-server` | Cursor bridge |
| `apps/panel` | Approve & verify tasks |
| `apps/playground-react` | Demo site |
| `apps/landing` | Marketing site |

MIT License.
