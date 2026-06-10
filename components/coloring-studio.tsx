"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, Save, Undo2 } from "lucide-react";
import { ColoringCanvas } from "@/components/coloring-canvas";
import { ParentPanel } from "@/components/parent-panel";
import { TemplateLibrary } from "@/components/template-library";
import { ToolBar } from "@/components/tool-bar";
import {
  addTemplate,
  applyRegionFill,
  createInitialColoringState,
  hydrateState,
  resetActiveTemplate,
  selectTemplate,
  setSelectedColor,
  undoFill,
} from "@/lib/coloring/reducer";
import { createBrowserColoringStore } from "@/lib/storage";
import { builtinTemplates } from "@/lib/templates/builtin";
import type { ParentTemplate, TemplateCategoryId } from "@/lib/types";

export function ColoringStudio() {
  const storeRef = useRef(createBrowserColoringStore());
  const [activeCategory, setActiveCategory] = useState<TemplateCategoryId>("hoa");
  const [state, setState] = useState(() => createInitialColoringState(builtinTemplates));
  const activeTemplate = useMemo(
    () => state.templates.find((template) => template.id === state.activeTemplateId) ?? state.templates[0],
    [state.activeTemplateId, state.templates],
  );
  const fills = state.progress[activeTemplate.id]?.fills ?? {};

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      const [progress, parentTemplates] = await Promise.all([
        storeRef.current.loadProgress(),
        storeRef.current.loadParentTemplates(),
      ]);
      if (!cancelled && (Object.keys(progress).length > 0 || parentTemplates.length > 0)) {
        setState((current) => hydrateState(current, progress, parentTemplates));
      }
    }
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  function fillRegion(regionId: string) {
    setState((current) => {
      const next = applyRegionFill(current, regionId);
      const progress = next.progress[next.activeTemplateId];
      if (progress) void storeRef.current.saveProgress(progress);
      return next;
    });
  }

  function resetTemplate() {
    setState((current) => {
      void storeRef.current.resetProgress(current.activeTemplateId);
      return resetActiveTemplate(current);
    });
  }

  function createParentTemplate(template: ParentTemplate) {
    setActiveCategory("parent");
    setState((current) => addTemplate(current, template));
    void storeRef.current.saveParentTemplate(template);
  }

  return (
    <main className="relative flex h-screen overflow-hidden bg-[#fbf7ef] text-[#222]">
      <TemplateLibrary
        templates={state.templates}
        activeTemplateId={state.activeTemplateId}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onTemplateSelect={(id) => setState((current) => selectTemplate(current, id))}
      />
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 px-6">
          <h1 className="text-3xl font-black">Bé Tập Tô Màu</h1>
          <div data-testid="header-actions" className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Hoàn tác"
              onClick={() => setState(undoFill)}
              className="flex h-12 w-14 items-center justify-center rounded-2xl bg-[#dff5ff] text-[#0f6b8f] shadow-sm transition-transform active:scale-95"
            >
              <Undo2 aria-hidden="true" size={24} strokeWidth={3} />
            </button>
            <button
              type="button"
              aria-label="Tô lại"
              onClick={resetTemplate}
              className="flex h-12 w-14 items-center justify-center rounded-2xl bg-[#ffe2e8] text-[#be2856] shadow-sm transition-transform active:scale-95"
            >
              <RotateCcw aria-hidden="true" size={24} strokeWidth={3} />
            </button>
            <button
              type="button"
              aria-label="Đã lưu"
              className="flex h-12 w-14 items-center justify-center rounded-2xl bg-[#dcfce7] text-[#16824a] shadow-sm"
            >
              <Save aria-hidden="true" size={24} strokeWidth={3} />
            </button>
            <ParentPanel onTemplateCreate={createParentTemplate} />
          </div>
        </header>
        <ColoringCanvas
          template={activeTemplate}
          fills={fills}
          selectedColor={state.selectedColor}
          onRegionFill={fillRegion}
        />
        <ToolBar
          colors={activeTemplate.suggestedColors}
          selectedColor={state.selectedColor}
          onColorChange={(color) => setState((current) => setSelectedColor(current, color))}
        />
      </section>
    </main>
  );
}
