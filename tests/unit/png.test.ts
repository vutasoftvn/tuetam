import { describe, expect, it } from "vitest";
import { floodFillPixels, hasEnoughLineContrast } from "@/lib/png";

describe("png helpers", () => {
  it("detects line contrast", () => {
    expect(hasEnoughLineContrast(new Uint8ClampedArray([0, 0, 0, 255, 255, 255, 255, 255]))).toBe(true);
    expect(hasEnoughLineContrast(new Uint8ClampedArray([200, 200, 200, 255, 220, 220, 220, 255]))).toBe(false);
  });

  it("flood fills white area without crossing black boundary", () => {
    const pixels = new Uint8ClampedArray([
      0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255,
      0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255,
      0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255,
    ]);
    const filled = floodFillPixels({ pixels, width: 3, height: 3, x: 1, y: 1, color: [255, 0, 0, 255] });
    expect(Array.from(filled.slice(16, 20))).toEqual([255, 0, 0, 255]);
    expect(Array.from(filled.slice(0, 4))).toEqual([0, 0, 0, 255]);
  });
});
