import { describe, expect, it } from "vitest";
import { builtinTemplates, categories } from "@/lib/templates/builtin";

describe("builtinTemplates", () => {
  it("covers the required child-friendly categories", () => {
    expect(categories.map((category) => category.id)).toEqual([
      "hoa",
      "la",
      "qua",
      "con-vat",
      "do-choi",
      "phuong-tien",
      "nghe-nghiep",
      "thuc-an",
      "thien-nhien",
      "hoc-tap",
      "parent",
    ]);
  });

  it("ships multiple colorable SVG templates", () => {
    expect(builtinTemplates.length).toBeGreaterThanOrEqual(50);
    for (const template of builtinTemplates) {
      expect(template.sourceType).toBe("svg");
      expect(template.regionIds.length).toBeGreaterThan(0);
      expect(template.svg).toContain("data-region-id");
      expect(template.suggestedColors).toHaveLength(16);
    }
  });

  it("includes 15 built-in templates for every child content category", () => {
    for (const category of [
      "hoa",
      "la",
      "qua",
      "con-vat",
      "do-choi",
      "phuong-tien",
      "nghe-nghiep",
      "thuc-an",
      "thien-nhien",
      "hoc-tap",
    ]) {
      expect(builtinTemplates.filter((template) => template.category === category)).toHaveLength(15);
    }
  });

  it("adds at least 5 more detailed templates for every child content category", () => {
    for (const category of [
      "hoa",
      "la",
      "qua",
      "con-vat",
      "do-choi",
      "phuong-tien",
      "nghe-nghiep",
      "thuc-an",
      "thien-nhien",
      "hoc-tap",
    ]) {
      const detailedTemplates = builtinTemplates.filter(
        (template) => template.category === category && template.id.includes("detail") && template.regionIds.length >= 8,
      );
      expect(detailedTemplates).toHaveLength(5);
    }
  });
});
