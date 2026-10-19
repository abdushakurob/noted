import { CaptureOverlay } from "./overlay.js";
import { RuntimeMonitor } from "./runtime-monitor.js";

export type NotedInit = {
  baseUrl?: string;
  onTaskCreated?: (payload: { taskId: string; summary: string; ms: number }) => void;
};

const DEFAULT_BASE = "http://127.0.0.1:3737";

let overlay: CaptureOverlay | null = null;
let monitor: RuntimeMonitor | null = null;
let ws: WebSocket | null = null;
let keyHandler: ((e: KeyboardEvent) => void) | null = null;

function baseUrl(init?: NotedInit): string {
  return (init?.baseUrl ?? DEFAULT_BASE).replace(/\/$/, "");
}

function connectWs(url: string, o: CaptureOverlay): void {
  ws?.close();
  try {
    ws = new WebSocket(`${url.replace(/^http/, "ws")}/v1/ws`);
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(String(ev.data)) as {
          type: string;
          taskId?: string;
          notedId?: string;
        };
        if (msg.type === "verify" && msg.taskId && msg.notedId) {
          void o.verifyCapture(msg.notedId, msg.taskId);
        }
      } catch {
        /* ignore malformed */
      }
    };
    ws.onclose = () => {
      ws = null;
    };
  } catch {
    ws = null;
  }
}

export function init(init: NotedInit = {}): void {
  dispose();
  const url = baseUrl(init);
  monitor = new RuntimeMonitor();
  overlay = new CaptureOverlay({
    baseUrl: url,
    monitor,
    onTaskCreated: init.onTaskCreated,
  });

  keyHandler = (e: KeyboardEvent) => {
    if (!e.altKey || !e.shiftKey) return;
    const isN = e.code === "KeyN" || e.key.toLowerCase() === "n";
    if (!isN) return;
    e.preventDefault();
    overlay?.toggle();
  };
  document.addEventListener("keydown", keyHandler);
  connectWs(url, overlay);
}

export function dispose(): void {
  overlay?.destroy();
  overlay = null;
  monitor = null;
  ws?.close();
  ws = null;
  if (keyHandler) {
    document.removeEventListener("keydown", keyHandler);
    keyHandler = null;
  }
}

export function toggle(): void {
  overlay?.toggle();
}

declare global {
  interface Window {
    Noted?: { init: typeof init; dispose: typeof dispose; toggle: typeof toggle };
  }
}

window.Noted = { init, dispose, toggle };
