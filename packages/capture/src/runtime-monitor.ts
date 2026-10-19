import type { ConsoleError, FailedRequest } from "@noted/shared";

const MAX = 8;

export class RuntimeMonitor {
  private active = false;
  private consoleErrors: ConsoleError[] = [];
  private failedRequests: FailedRequest[] = [];
  private originalError: typeof console.error | null = null;
  private originalFetch: typeof fetch | null = null;

  start(): void {
    if (this.active) return;
    this.active = true;
    this.consoleErrors = [];
    this.failedRequests = [];

    this.originalError = console.error;
    console.error = (...args: unknown[]) => {
      const message = args
        .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
        .join(" ")
        .slice(0, 500);
      this.pushError(message);
      this.originalError?.apply(console, args);
    };

    this.originalFetch = globalThis.fetch.bind(globalThis);
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const res = await this.originalFetch!(input, init);
      if (!res.ok) {
        const url =
          typeof input === "string"
            ? input
            : input instanceof URL
              ? input.href
              : input.url;
        this.pushFailed({
          url: url.slice(0, 200),
          status: res.status,
          method: init?.method ?? "GET",
          timestamp: Date.now(),
        });
      }
      return res;
    };
  }

  stop(): void {
    if (!this.active) return;
    if (this.originalError) console.error = this.originalError;
    if (this.originalFetch) globalThis.fetch = this.originalFetch;
    this.originalError = null;
    this.originalFetch = null;
    this.active = false;
    this.consoleErrors = [];
    this.failedRequests = [];
  }

  snapshot(): { consoleErrors: ConsoleError[]; failedRequests: FailedRequest[] } {
    return {
      consoleErrors: [...this.consoleErrors],
      failedRequests: [...this.failedRequests],
    };
  }

  private pushError(message: string): void {
    this.consoleErrors.push({ message, timestamp: Date.now() });
    if (this.consoleErrors.length > MAX) this.consoleErrors.shift();
  }

  private pushFailed(entry: FailedRequest): void {
    this.failedRequests.push(entry);
    if (this.failedRequests.length > MAX) this.failedRequests.shift();
  }
}
