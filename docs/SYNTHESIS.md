# How tasks get interpreted

## Default: `NOTED_SYNTHESIS=agent` (no Ollama required)

1. Browser sends **structured capture** + client comment to the daemon.
2. Daemon stores the task and returns an **interpretation brief** (facts + instructions).
3. **Cursor / Claude** reads `noted_get_task` via MCP and turns comment + JSON into code changes.

The moat is **capture quality**, not a second local model. Context window size is irrelevant to *whether* you need Ollama — your agent already has a large window.

## Optional: `NOTED_SYNTHESIS=ollama`

Run Gemma locally on capture (Hacktoberfest Gemma track, air-gapped machines, no cloud agent). POST `/v1/tasks/:id/synthesize` to retry later.

## Deprecated path: `NOTED_HEURISTIC_FALLBACK=1`

Hardcoded if/else rules when Ollama fails. **Off by default.** Not the product story.

## Why a dev might still choose Ollama

- Client HTML never touches **any** cloud model (only local Gemma).
- Demos / HF **Gemma** prize category.
- Laptop with no Cursor subscription — local model only.

## Why most devs won't

- They already pay for a strong agent in the IDE.
- note'd's job is to **replace screenshots with measured JSON** and **MCP the bundle** — not run duplicate inference.
