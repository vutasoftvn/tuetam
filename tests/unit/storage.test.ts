import { describe, expect, it } from "vitest";
import { createMemoryColoringStore } from "@/lib/storage";

describe("memory coloring store", () => {
  it("saves and resets template progress", async () => {
    const store = createMemoryColoringStore();
    await store.saveProgress({ templateId: "flower-01", fills: { petal_1: "#ef4444" }, updatedAt: "now" });
    expect((await store.loadProgress())["flower-01"].fills?.petal_1).toBe("#ef4444");
    await store.resetProgress("flower-01");
    expect((await store.loadProgress())["flower-01"]).toBeUndefined();
  });

  it("stores parent templates", async () => {
    const store = createMemoryColoringStore();
    await store.saveParentTemplate({
      id: "parent-1",
      title: "Mẫu mới",
      category: "parent",
      sourceType: "svg",
      thumbnail: "<svg />",
      svg: "<svg />",
      suggestedColors: ["#ef4444"],
      regionIds: ["a"],
      createdAt: "now",
    });
    expect((await store.loadParentTemplates())[0].id).toBe("parent-1");
  });
});
