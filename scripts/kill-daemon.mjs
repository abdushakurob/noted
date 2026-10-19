import { execSync } from "node:child_process";

const port = String(process.env.NOTED_PORT ?? "3737");

function killWindows() {
  let out = "";
  try {
    out = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8", shell: true });
  } catch {
    console.log(`No listener on port ${port}.`);
    return;
  }
  const pids = new Set();
  for (const line of out.split(/\r?\n/)) {
    if (!/LISTENING/i.test(line)) continue;
    const parts = line.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (/^\d+$/.test(pid)) pids.add(pid);
  }
  if (!pids.size) {
    console.log(`No listener on port ${port}.`);
    return;
  }
  for (const pid of pids) {
    console.log(`Stopping PID ${pid} on port ${port}...`);
    execSync(`taskkill /PID ${pid} /F`, { stdio: "inherit", shell: true });
  }
  console.log("Done.");
}

function killUnix() {
  try {
    const out = execSync(`lsof -ti :${port}`, { encoding: "utf8" });
    const pids = out.trim().split(/\s+/).filter(Boolean);
    if (!pids.length) {
      console.log(`No listener on port ${port}.`);
      return;
    }
    for (const pid of pids) {
      console.log(`Stopping PID ${pid} on port ${port}...`);
      execSync(`kill -9 ${pid}`);
    }
    console.log("Done.");
  } catch {
    console.log(`No listener on port ${port}.`);
  }
}

if (process.platform === "win32") killWindows();
else killUnix();
