import { describe, expect, it } from "vitest";
import { sanitizeSvgTemplate, validateSvgTemplate } from "@/lib/svg";

describe("svg helpers", () => {
  it("accepts safe SVG with colorable regions", () => {
    const result = validateSvgTemplate(
      `<svg viewBox="0 0 10 10"><path data-region-id="a" d="M1 1 H9 V9 H1Z"/></svg>`,
    );
    expect(result.ok).toBe(true);
  });

  it("rejects unsafe script content", () => {
    const result = validateSvgTemplate(
      `<svg><script>alert(1)</script><path data-region-id="a" d="M1 1 H9 V9 H1Z"/></svg>`,
    );
    expect(result.ok).toBe(false);
  });

  it("sanitizes event handlers", () => {
    const clean = sanitizeSvgTemplate(
      `<svg><path data-region-id="a" onclick="x()" d="M1 1 H9 V9 H1Z"/></svg>`,
    );
    expect(clean).not.toContain("onclick");
  });
});
