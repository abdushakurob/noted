const DEFAULT_MAX_BYTES = 40_000;

export function truncateJson<T>(value: T, maxBytes = DEFAULT_MAX_BYTES): { value: T; truncated: boolean } {
  let serialized = JSON.stringify(value);
  if (serialized.length <= maxBytes) {
    return { value, truncated: false };
  }
  const ratio = maxBytes / serialized.length;
  const walk = (obj: unknown): unknown => {
    if (obj === null || typeof obj !== "object") {
      if (typeof obj === "string" && obj.length > 200) {
        return obj.slice(0, 200) + "…";
      }
      return obj;
    }
    if (Array.isArray(obj)) {
      const maxItems = Math.max(1, Math.floor(obj.length * ratio));
      return obj.slice(0, maxItems).map(walk);
    }
    const record = obj as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(record)) {
      out[key] = walk(record[key]);
    }
    return out;
  };
  const trimmed = walk(value) as T;
  serialized = JSON.stringify(trimmed);
  if (serialized.length > maxBytes) {
    return {
      value: { ...(trimmed as object), _truncated: true } as T,
      truncated: true,
    };
  }
  return { value: trimmed, truncated: true };
}
