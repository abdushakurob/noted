import path from "node:path";

export const config = {
  host: process.env.NOTED_HOST ?? "127.0.0.1",
  port: Number(process.env.NOTED_PORT ?? 3737),
  ollamaUrl: process.env.OLLAMA_URL ?? "http://127.0.0.1:11434",
  ollamaModel: process.env.NOTED_OLLAMA_MODEL ?? "gemma2:2b",
  dbPath: process.env.NOTED_DB_PATH ?? path.join(process.cwd(), "noted.db"),
  captureScriptPath:
    process.env.NOTED_CAPTURE_JS ??
    path.resolve(import.meta.dirname, "../../capture/dist/noted.js"),
  allowedOrigins: (process.env.NOTED_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  /** ollama = Gemma on capture (demo/product default). agent = MCP-only interpretation. */
  synthesis: (process.env.NOTED_SYNTHESIS ?? "ollama") as "agent" | "ollama",
  requireApproval: process.env.NOTED_REQUIRE_APPROVAL !== "0",
  /** Off by default — avoids hardcoded rule tasks when Ollama fails. */
  heuristicFallback: process.env.NOTED_HEURISTIC_FALLBACK === "1",
};
