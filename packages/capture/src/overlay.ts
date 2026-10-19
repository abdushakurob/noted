import type { ElementCapture } from "@noted/shared";

import { captureElement, findByNotedId } from "./serializer.js";
import type { RuntimeMonitor } from "./runtime-monitor.js";

type OverlayOptions = {
  baseUrl: string;
  monitor: RuntimeMonitor;
  onTaskCreated?: (payload: { taskId: string; summary: string; ms: number }) => void;
};

export class CaptureOverlay {
  private active = false;
  private locked: Element | null = null;
  private highlight: HTMLDivElement | null = null;
  private root: HTMLDivElement | null = null;
  private abort = new AbortController();
  private onMove: ((e: MouseEvent) => void) | null = null;
  private onClick: ((e: MouseEvent) => void) | null = null;
  private onKey: ((e: KeyboardEvent) => void) | null = null;

  constructor(private opts: OverlayOptions) {}

  toggle(): void {
    if (this.active) this.destroy();
    else this.mount();
  }

  isActive(): boolean {
    return this.active;
  }

  async verifyCapture(notedId: string, taskId: string): Promise<ElementCapture | null> {
    const el = findByNotedId(notedId);
    if (!el) return null;
    const snap = this.opts.monitor.snapshot();
    const capture = captureElement(el);
    capture.consoleErrors = snap.consoleErrors;
    capture.failedRequests = snap.failedRequests;
    await fetch(`${this.opts.baseUrl}/v1/tasks/${taskId}/verify-capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ capture }),
      signal: this.abort.signal,
    });
    return capture;
  }

  private mount(): void {
    if (this.active) return;
    this.active = true;
    this.abort = new AbortController();
    this.opts.monitor.start();

    this.highlight = document.createElement("div");
    Object.assign(this.highlight.style, {
      position: "fixed",
      pointerEvents: "none",
      border: "2px solid #d4843a",
      background: "rgba(212,132,58,0.12)",
      zIndex: "2147483646",
      borderRadius: "4px",
      transition: "all 60ms linear",
      display: "none",
    });
    document.body.appendChild(this.highlight);

    this.root = document.createElement("div");
    this.root.setAttribute("data-noted-overlay", "1");
    Object.assign(this.root.style, {
      position: "fixed",
      top: "12px",
      right: "12px",
      width: "min(360px, calc(100vw - 24px))",
      maxHeight: "calc(100vh - 24px)",
      overflow: "auto",
      zIndex: "2147483647",
      background: "#f9f7f2",
      color: "#1a1f2e",
      border: "1px solid #ddd6c8",
      borderRadius: "12px",
      boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
      fontFamily: "system-ui,sans-serif",
      fontSize: "13px",
      padding: "12px",
    });
    this.root.innerHTML = `
      <p style="margin:0 0 8px;font-weight:600">note'd capture</p>
      <p style="margin:0 0 8px;color:#5c6478">Hover an element, click to lock, then describe the change.</p>
      <p id="noted-target" style="margin:0 0 8px;font-family:monospace;font-size:11px;color:#5c6478">No selection</p>
      <textarea id="noted-comment" rows="3" placeholder="What should change?" style="width:100%;box-sizing:border-box;margin-bottom:8px;padding:8px;border-radius:8px;border:1px solid #ddd6c8"></textarea>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button type="button" id="noted-submit" disabled style="flex:1;padding:8px 12px;border:0;border-radius:8px;background:#d4843a;color:#1a1208;font-weight:600;cursor:pointer">Submit</button>
        <button type="button" id="noted-close" style="padding:8px 12px;border:1px solid #ddd6c8;border-radius:8px;background:#fff;cursor:pointer">Close</button>
      </div>
      <p id="noted-status" style="margin:8px 0 0;font-size:11px;color:#5c6478"></p>
    `;
    document.body.appendChild(this.root);

    const submitBtn = this.root.querySelector<HTMLButtonElement>("#noted-submit")!;
    const closeBtn = this.root.querySelector<HTMLButtonElement>("#noted-close")!;
    closeBtn.addEventListener("click", () => this.destroy(), { signal: this.abort.signal });
    submitBtn.addEventListener("click", () => void this.submit(), { signal: this.abort.signal });

    this.onMove = (e) => {
      if (this.locked) return;
      const t = e.target as Element | null;
      if (!t || this.isOverlayNode(t)) return;
      this.moveHighlight(t);
    };
    this.onClick = (e) => {
      const t = e.target as Element | null;
      if (!t || this.isOverlayNode(t)) return;
      e.preventDefault();
      e.stopPropagation();
      this.locked = t;
      this.moveHighlight(t);
      const label = this.root?.querySelector("#noted-target");
      if (label) label.textContent = t.tagName.toLowerCase() + (t.id ? `#${t.id}` : "");
      submitBtn.disabled = false;
    };
    this.onKey = (e) => {
      const isN = e.code === "KeyN" || e.key.toLowerCase() === "n";
      if (e.altKey && e.shiftKey && isN) {
        e.preventDefault();
        this.destroy();
      }
    };

    document.addEventListener("mousemove", this.onMove, { capture: true, signal: this.abort.signal });
    document.addEventListener("click", this.onClick, { capture: true, signal: this.abort.signal });
    document.addEventListener("keydown", this.onKey, { signal: this.abort.signal });
  }

  private async submit(): Promise<void> {
    if (!this.locked || !this.root) return;
    const comment = this.root.querySelector<HTMLTextAreaElement>("#noted-comment")?.value.trim();
    const status = this.root.querySelector("#noted-status");
    if (!comment) {
      if (status) status.textContent = "Add a comment first.";
      return;
    }
    const t0 = performance.now();
    if (status) status.textContent = "Capturing…";
    const snap = this.opts.monitor.snapshot();
    const capture = captureElement(this.locked);
    capture.consoleErrors = snap.consoleErrors;
    capture.failedRequests = snap.failedRequests;

    try {
      const res = await fetch(`${this.opts.baseUrl}/v1/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capture, comment }),
        signal: this.abort.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as {
        taskId: string;
        source?: string;
        agentTask?: { summary?: string } | null;
        timingMs?: number;
      };
      const ms = Math.round(performance.now() - t0);
      if (status) {
        if (data.agentTask?.summary) {
          status.textContent = `${data.agentTask.summary} · approve in panel (${ms}ms)`;
        } else if (data.source === "none") {
          status.textContent = `Saved ${data.taskId} — start Ollama or click Run Gemma in panel`;
        } else if (data.source === "agent") {
          status.textContent = `Capture ${ms}ms — approve in panel, then noted_get_task in Cursor`;
        } else {
          status.textContent = `Task ${data.taskId} · ${ms}ms · check panel`;
        }
      }
      this.opts.onTaskCreated?.({
        taskId: data.taskId,
        summary: data.agentTask?.summary ?? "",
        ms,
      });
    } catch (err) {
      if (status) status.textContent = `Failed: ${err instanceof Error ? err.message : "unknown"}`;
    }
  }

  private isOverlayNode(el: Element): boolean {
    return Boolean(el.closest("[data-noted-overlay]") || el.closest("[data-noted-ui]"));
  }

  private moveHighlight(el: Element): void {
    if (!this.highlight) return;
    const r = el.getBoundingClientRect();
    Object.assign(this.highlight.style, {
      display: "block",
      left: `${r.left}px`,
      top: `${r.top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
    });
  }

  destroy(): void {
    if (!this.active) return;
    this.active = false;
    this.abort.abort();
    this.opts.monitor.stop();
    this.highlight?.remove();
    this.root?.remove();
    this.highlight = null;
    this.root = null;
    this.locked = null;
    this.onMove = null;
    this.onClick = null;
    this.onKey = null;
  }
}
