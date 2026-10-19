import { describe, expect, it } from "vitest";

import { contrastRatio } from "./contrast.js";

describe("contrastRatio", () => {
  it("computes black on white", () => {
    const ratio = contrastRatio("rgb(0,0,0)", "rgb(255,255,255)");
    expect(ratio).toBeGreaterThan(20);
  });

  it("returns null for unknown colors", () => {
    expect(contrastRatio("transparent", "#fff")).toBeNull();
  });
});
