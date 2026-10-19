import { spawn } from "node:child_process";

const BASE = "http://127.0.0.1:3737";

async function probeDaemon() {
  try {
    const res = await fetch(`${BASE}/health`, { signal: AbortSignal.timeout(2000) });
    const body = await res.json().catch(() => ({}));
    const ready = res.ok && body?.service === "noted-daemon" && body?.notedJs === true;
    return { ready, portOpen: res.ok, body };
  } catch {
    return { ready: false, portOpen: false, body: null };
  }
}

const { ready, portOpen, body } = await probeDaemon();
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

const children = [];

function run(label, args) {
  const child = spawn(pnpm, args, { stdio: "inherit", shell: true });
  children.push(child);
  child.on("exit", (code) => {
    if (code && code !== 0) process.exitCode = code;
  });
}

if (ready) {
  console.log("note'd: daemon ready on :3737 — panel + playground only\n");
} else if (portOpen) {
  console.log(
    "note'd: port :3737 is up but capture is not ready (notedJs=false or old daemon).",
  );
  console.log("  In another terminal: $env:NOTED_SYNTHESIS='agent'; pnpm noted:restart");
  console.log("  Then refresh playground. Starting panel + playground only.\n");
} else {
  console.log("note'd: starting daemon + panel + playground\n");
  run("daemon", ["noted"]);
}

run("panel", ["dev:panel"]);
run("playground", ["dev:playground"]);

function shutdown() {
  for (const c of children) c.kill("SIGTERM");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
