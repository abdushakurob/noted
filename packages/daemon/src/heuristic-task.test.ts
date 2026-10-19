import { describe, expect, it } from "vitest";

import type { ElementCapture } from "@noted/shared";

import { heuristicTask } from "./heuristic-task.js";

const baseCapture = {
  notedId: "1",
  fingerprint: "abc",
  selectorPath: "button.cta-primary",
  page: { url: "http://localhost", path: "/", title: "t" },
  dom: { tag: "button" },
  layout: {
    rect: { x: 0, y: 800, width: 100, height: 32, top: 800, left: 0, bottom: 832, right: 100 },
    scrollY: 0,
    aboveFold: false,
    belowFold: true,
    viewportWidth: 390,
    viewportHeight: 844,
    breakpoint: "sm",
    tapTargetPx: 32,
  },
  styles: { height: "32px", color: "#e8dfd0", "background-color": "#c4a574" },
  contrastRatio: 2.1,
  a11y: { focusable: true, landmarkChain: [] },
  consoleErrors: [],
  failedRequests: [],
  framework: { framework: "react", componentStack: [{ name: "App" }] },
  capturedAt: new Date().toISOString(),
} satisfies ElementCapture;

describe("heuristicTask", () => {
  it("suggests height and contrast fixes quickly", () => {
    const task = heuristicTask(baseCapture, "too small and hard to find");
    expect(task.suggested_changes.length).toBeGreaterThan(0);
    expect(task.acceptance_criteria.some((c) => c.includes("48px"))).toBe(true);
    expect(task.assumptions[0]).toContain("Heuristic");
  });
});
