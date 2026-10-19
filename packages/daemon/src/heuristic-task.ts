import type { AgentTask, ElementCapture } from "@noted/shared";

/** Fast fallback when Ollama is slow/unavailable — no network wait. */
export function heuristicTask(capture: ElementCapture, comment: string): AgentTask {
  const h = capture.layout.rect.height;
  const contrast = capture.contrastRatio;
  const changes: AgentTask["suggested_changes"] = [];
  const criteria: string[] = [];

  if (h < 48) {
    criteria.push("Interactive target height at least 48px on mobile");
    changes.push({
      kind: "css",
      target: capture.selectorPath,
      detail: `Increase min-height/height from ${Math.round(h)}px to >= 48px`,
    });
  }
  if (contrast != null && contrast < 4.5) {
    criteria.push("Text/background contrast at least 4.5:1 (WCAG AA)");
    changes.push({
      kind: "css",
      target: capture.selectorPath,
      detail: `Improve contrast from ${contrast.toFixed(1)}:1 — adjust color or background-color`,
    });
  }
  if (capture.layout.belowFold && capture.layout.viewportWidth < 640) {
    criteria.push("Primary action visible above the fold at 390–640px width");
    changes.push({
      kind: "other",
      target: capture.selectorPath,
      detail: "Move CTA higher in the layout or reduce hero spacing on small viewports",
    });
  }
  if (!changes.length) {
    changes.push({
      kind: "other",
      target: capture.selectorPath,
      detail: comment,
    });
    criteria.push("Change addresses the client comment with a verifiable UI outcome");
  }

  return {
    summary: `Address feedback on ${capture.selectorPath}: ${comment.slice(0, 80)}`,
    intent: h < 48 || (contrast != null && contrast < 4.5) ? "a11y" : "visual",
    acceptance_criteria: criteria,
    suggested_changes: changes,
    confidence: 0.55,
    assumptions: ["Heuristic fallback — Ollama unavailable or timed out"],
  };
}
