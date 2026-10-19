import { config } from "./config.js";
import { TaskStore } from "./db.js";
import { startServer } from "./server.js";
import { WsHub } from "./ws-hub.js";

export { config, TaskStore, startServer, WsHub };
export { tryOllamaSynthesis, checkOllama } from "./ollama.js";
export { resolveSynthesis } from "./synthesis.js";
export { heuristicTask } from "./heuristic-task.js";
export { diffCaptures } from "./diff.js";

export function main() {
  const store = new TaskStore(config.dbPath);
  const hub = new WsHub();
  const server = startServer(store, hub);
  const synth =
    config.synthesis === "ollama"
      ? `ollama ${config.ollamaModel}`
      : "agent (approve → MCP noted_get_task)";
  console.error(`note'd daemon http://${config.host}:${config.port} · ${synth}`);
  return { store, hub, server };
}
