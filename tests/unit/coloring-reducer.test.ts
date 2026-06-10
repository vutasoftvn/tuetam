import { describe, expect, it } from "vitest";
import {
  applyRegionFill,
  createInitialColoringState,
  resetActiveTemplate,
  selectTemplate,
  undoFill,
} from "@/lib/coloring/reducer";
import { builtinTemplates } from "@/lib/templates/builtin";

describe("coloring reducer helpers", () => {
  it("selects a template and starts with suggested color", () => {
    const state = createInitialColoringState(builtinTemplates);
    const next = selectTemplate(state, "apple-01");
    expect(next.activeTemplateId).toBe("apple-01");
    expect(next.selectedColor).toBe(
      builtinTemplates.find((item) => item.id === "apple-01")?.suggestedColors[0],
    );
  });

  it("applies fill and supports undo", () => {
    const state = selectTemplate(createInitialColoringState(builtinTemplates), "flower-01");
    const filled = applyRegionFill(state, "petal_1", "#ef4444");
    expect(filled.progress["flower-01"].fills?.petal_1).toBe("#ef4444");
    const undone = undoFill(filled);
    expect(undone.progress["flower-01"]?.fills?.petal_1).toBeUndefined();
  });

  it("resets only the active template", () => {
    const state = selectTemplate(createInitialColoringState(builtinTemplates), "flower-01");
    const flower = applyRegionFill(state, "petal_1", "#ef4444");
    const apple = applyRegionFill(selectTemplate(flower, "apple-01"), "apple_body", "#22c55e");
    const reset = resetActiveTemplate(apple);
    expect(reset.progress["apple-01"]).toBeUndefined();
    expect(reset.progress["flower-01"].fills?.petal_1).toBe("#ef4444");
  });
});
