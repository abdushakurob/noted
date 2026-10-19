# Hacktoberfest Week 2 — Side Hustle submission notes

## What we built

**note'd** — freelancers run local **Gemma (Ollama)** on structured DOM/style captures (no screenshots), emit **MCP tasks** for Cursor, and show **ms timings** in the panel.

## Why open-source AI wins here

| Closed API | note'd (open / local) |
|------------|------------------------|
| Vision $ + latency | Text context → **Gemma 2B** on CPU |
| Client HTML on vendor servers | **127.0.0.1** daemon + optional heuristic fallback |
| Lock-in | **MCP** + swappable models |

## Partner tracks

- **Gemma** — default `NOTED_OLLAMA_MODEL=gemma2:2b`
- **GitHub / Cursor** — MCP tools documented in README
- **Sentry** (optional) — trace agent runs in your DEV post

## Demo script for DEV post

1. `pnpm build && pnpm noted` + `pnpm dev:panel` + `pnpm dev:playground`
2. Alt+Shift+N → click **Order now** → comment *too small and hard to find*
3. Screenshot panel timing + JSON task + MCP fix + verify diff

Tags: `#devchallenge` `#hf26challenge`
