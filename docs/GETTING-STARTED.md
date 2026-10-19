# Get started in 5 minutes

No browser extension. No account. A local server + two web pages on your machine.

---

## 1. Install

```powershell
cd "C:\Users\st\Desktop\projects\note'd"
pnpm install
pnpm build
```

Run `pnpm noted:doctor` anytime. With Ollama optional:

```powershell
$env:NOTED_SYNTHESIS = "agent"
pnpm noted:doctor
```

You want: **Daemon OK**, **noted.js available**.

---

## 2. Two terminals

### Terminal 1 — local server (keep open)

**Without Ollama (easiest):**

```powershell
$env:NOTED_SYNTHESIS = "agent"
pnpm noted
```

**With free local AI (Gemma via Ollama):**

Install [Ollama](https://ollama.com/download), then:

```powershell
ollama pull gemma2:2b
pnpm noted
```

You should see the server URL and **agent** or **ollama** mode. The prompt must **not** return immediately — leave this window open.

Restart if needed:

```powershell
pnpm noted:restart
```

(PowerShell 5.x: run commands on separate lines, not `&&`.)

### Terminal 2 — panel + demo site

```powershell
pnpm dev:stack
```

| What | URL |
|------|-----|
| Task inbox (approve here) | http://localhost:5174 |
| Demo bakery site | http://localhost:5180 |
| Server health | http://127.0.0.1:3737/health |

---

## 3. Try one capture

1. Open http://localhost:5180 → **Ctrl+Shift+R**
2. Click **Start capture** (top bar)
3. Click **Order now** → e.g. *too small and hard to find* → submit
4. Open http://localhost:5174 → select the task → **Approve for agent**
5. In Cursor (with note'd MCP configured), fetch the task and fix the button in the playground app

---

## Connect Cursor

Point MCP at `packages/mcp-server/dist/index.js` with:

`NOTED_DAEMON_URL=http://127.0.0.1:3737`

See [USER-GUIDE.md](./USER-GUIDE.md) for the full JSON snippet.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Red bar “Daemon not reachable” | Terminal 1: `pnpm noted:restart`, refresh playground |
| `noted.js` missing | `pnpm build` then restart server |
| Port 3737 in use | `pnpm noted:kill` then `pnpm noted` |
| Doctor: Ollama fetch failed | Normal without Ollama — use `NOTED_SYNTHESIS=agent` |
| Capture submit failed | Update repo (fetch fix), `pnpm --filter @noted/capture build`, refresh |
| Alt+Shift+N ignored | Use **Start capture**; click the page, not DevTools |

---

## Next

Read **[USER-GUIDE.md](./USER-GUIDE.md)** for privacy, local AI, and what’s coming later.
