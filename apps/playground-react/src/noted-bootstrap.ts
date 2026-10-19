/** Daemon API (capture POST, WebSocket). Same host as panel docs. */
export const NOTED_DAEMON = "http://127.0.0.1:3737";

/** In dev, Vite proxies this to the daemon so the script loads same-origin. */
const NOTED_SCRIPT = import.meta.env.DEV ? "/__noted/noted.js" : `${NOTED_DAEMON}/noted.js`;

export type NotedBootstrapState = "loading" | "ready" | "error";

let state: NotedBootstrapState = "loading";
let pendingToggle = false;
const listeners = new Set<(s: NotedBootstrapState) => void>();

export function getNotedBootstrapState(): NotedBootstrapState {
  return state;
}

export function onNotedBootstrapState(fn: (s: NotedBootstrapState) => void): () => void {
  listeners.add(fn);
  fn(state);
  return () => listeners.delete(fn);
}

function setState(s: NotedBootstrapState) {
  state = s;
  for (const fn of listeners) fn(s);
}

function initNoted() {
  if (!window.Noted?.init) {
    setState("error");
    return;
  }
  window.Noted.init({ baseUrl: NOTED_DAEMON });
  setState("ready");
  if (pendingToggle) {
    pendingToggle = false;
    window.Noted.toggle();
  }
}

function loadScript() {
  setState("loading");
  document.querySelector('script[data-noted-bootstrap="1"]')?.remove();

  const script = document.createElement("script");
  script.src = NOTED_SCRIPT;
  script.async = true;
  script.dataset.notedBootstrap = "1";
  script.onload = () => initNoted();
  script.onerror = () => {
    console.error(
      "note'd: could not load capture script. No browser extension needed — start the daemon:",
      "pnpm noted:restart then open",
      `${NOTED_DAEMON}/health`,
    );
    setState("error");
    pendingToggle = false;
  };
  document.head.appendChild(script);
}

export function bootstrapNoted(): void {
  if (window.Noted?.init) {
    initNoted();
    return;
  }
  const existing = document.querySelector('script[data-noted-bootstrap="1"]');
  if (existing) return;
  loadScript();
}

export function toggleCapture(): void {
  if (state === "error") {
    pendingToggle = true;
    loadScript();
    return;
  }
  if (!window.Noted?.toggle || state === "loading") {
    pendingToggle = true;
    bootstrapNoted();
    return;
  }
  window.Noted.toggle();
}

declare global {
  interface Window {
    Noted?: { init: (o?: { baseUrl?: string }) => void; toggle: () => void };
  }
}
