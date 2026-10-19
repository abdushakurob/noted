import type { ElementCapture, StyleDiff, StyleDiffEntry } from "@noted/shared";
import { STYLE_KEYS } from "@noted/shared";

export function diffCaptures(
  taskId: string,
  before: ElementCapture,
  after: ElementCapture,
): StyleDiff {
  if (before.notedId !== after.notedId) {
    return {
      taskId,
      entries: [],
      elementFound: false,
      message: "noted id mismatch — re-pick the element",
    };
  }

  const entries: StyleDiffEntry[] = [];
  for (const key of STYLE_KEYS) {
    const b = before.styles[key] ?? null;
    const a = after.styles[key] ?? null;
    if (b === a) continue;
    entries.push({ property: key, before: b, after: a });
  }

  const heightAfter = parseFloat(after.styles.height ?? "0");
  const passedHeight = heightAfter >= 48;

  if (entries.length) {
    const h = entries.find((e) => e.property === "height");
    if (h) h.passed = passedHeight;
  }

  return {
    taskId,
    entries,
    elementFound: true,
    message: entries.length ? undefined : "No style changes detected",
  };
}
