#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";

import { checkOllama, config, main } from "@noted/daemon";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const daemonUrl = (process.env.NOTED_DAEMON_URL ?? "http://127.0.0.1:3737").replace(
  /\/$/,
  "",
);

async function checkDaemon(): Promise<boolean> {
  try {
    const res = await fetch(`${daemonUrl}/health`, { signal: AbortSignal.timeout(3000) });
    const body = (await res.json()) as {
      ok?: boolean;
      service?: string;
      notedJs?: boolean;
      notedJsPath?: string;
    };
    if (!res.ok || body.service !== "noted-daemon") {
      console.log(`✗ Nothing on ${daemonUrl} (wrong app on :3737?)`);
      console.log("  Fix: pnpm noted:restart  (PowerShell: one line at a time, or pnpm noted:restart)");
      return false;
    }
    console.log(`✓ Daemon ${daemonUrl}`);
    if (body.notedJs === false) {
      console.log("✗ noted.js missing at:", body.notedJsPath ?? "(unknown path)");
      console.log("  Run: pnpm --filter @noted/capture build   then pnpm noted:restart");
      return false;
    }
    console.log("✓ noted.js available");
    return true;
  } catch {
    console.log(`✗ Daemon not reachable at ${daemonUrl}`);
    console.log("  Fix: cd repo → $env:NOTED_SYNTHESIS='agent' → pnpm noted:restart");
    return false;
  }
}

async function doctor() {
  console.log("NOTED_SYNTHESIS:", config.synthesis);
  const daemonOk = await checkDaemon();
  if (!daemonOk) process.exit(1);

  if (config.synthesis === "agent") {
    console.log("✓ Agent mode — Ollama optional. Playground → Start capture → panel approve → MCP.");
    process.exit(0);
  }
  console.log("Synthesis: ollama (Gemma on capture). Require approval:", config.requireApproval);
  const result = await checkOllama(config.ollamaUrl, config.ollamaModel);
  console.log(result.ok ? "✓" : "✗", result.detail);
  if (!result.ok) {
    console.log("  Or use agent mode: $env:NOTED_SYNTHESIS='agent' then restart daemon");
  }
  process.exit(result.ok ? 0 : 1);
}

function start() {
  process.env.NOTED_CAPTURE_JS ??= path.resolve(
    __dirname,
    "../../capture/dist/noted.js",
  );
  main();
}

const cmd = process.argv[2] ?? "start";
if (cmd === "doctor") void doctor();
else if (cmd === "start") start();
else {
  console.error("Usage: noted start | noted doctor");
  process.exit(1);
}
