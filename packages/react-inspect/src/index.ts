import type { FrameworkComponent, FrameworkContext } from "@noted/shared";

const MAX_PROPS = 12;
const MAX_STACK = 8;

function fiberKey(node: Element): string | null {
  return Object.keys(node).find((k) => k.startsWith("__reactFiber$")) ?? null;
}

function safeProps(raw: Record<string, unknown> | null | undefined): Record<string, unknown> | undefined {
  if (!raw) return undefined;
  const out: Record<string, unknown> = {};
  let count = 0;
  for (const key of Object.keys(raw)) {
    if (count >= MAX_PROPS) break;
    if (key === "children") continue;
    const val = raw[key];
    const t = typeof val;
    if (t === "string" || t === "number" || t === "boolean" || val === null) {
      out[key] = val;
      count++;
    }
  }
  return Object.keys(out).length ? out : undefined;
}

function displayName(type: unknown): string {
  if (!type) return "Unknown";
  if (typeof type === "string") return type;
  if (typeof type === "function") {
    return (type as { displayName?: string; name?: string }).displayName ?? type.name ?? "Component";
  }
  if (typeof type === "object" && type !== null && "displayName" in type) {
    return String((type as { displayName?: string }).displayName ?? "Component");
  }
  return "Component";
}

function sourceFromFiber(fiber: { _debugSource?: { fileName?: string; lineNumber?: number; columnNumber?: number } }) {
  const s = fiber._debugSource;
  if (!s?.fileName) return undefined;
  return {
    fileName: s.fileName,
    lineNumber: s.lineNumber,
    columnNumber: s.columnNumber,
  };
}

export function inspectReact(element: Element): FrameworkContext {
  const key = fiberKey(element);
  if (!key) {
    return { framework: "unknown", componentStack: [] };
  }
  const fiber = (element as unknown as Record<string, unknown>)[key] as {
    type?: unknown;
    return?: unknown;
    memoizedProps?: Record<string, unknown>;
    _debugSource?: { fileName?: string; lineNumber?: number; columnNumber?: number };
  } | null;

  if (!fiber) {
    return { framework: "unknown", componentStack: [] };
  }

  const stack: FrameworkComponent[] = [];
  let cursor: typeof fiber | null = fiber;
  while (cursor && stack.length < MAX_STACK) {
    const name = displayName(cursor.type);
    if (name !== "Component" && !name.startsWith("_")) {
      stack.push({
        name,
        source: sourceFromFiber(cursor),
        props: safeProps(cursor.memoizedProps),
      });
    }
    cursor = cursor.return as typeof fiber | null;
  }

  return {
    framework: stack.length ? "react" : "unknown",
    componentStack: stack,
  };
}
