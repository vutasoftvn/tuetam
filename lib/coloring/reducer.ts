import type { BrushSize, ColoringProgress, ColoringTemplate } from "@/lib/types";

export type ColoringState = {
  templates: ColoringTemplate[];
  activeTemplateId: string;
  selectedColor: string;
  brushSize: BrushSize;
  progress: Record<string, ColoringProgress>;
  history: Record<string, Array<Record<string, string>>>;
};

export function createInitialColoringState(templates: ColoringTemplate[]): ColoringState {
  const activeTemplate = templates[0];
  return {
    templates,
    activeTemplateId: activeTemplate.id,
    selectedColor: activeTemplate.suggestedColors[0],
    brushSize: "medium",
    progress: {},
    history: {},
  };
}

export function selectTemplate(state: ColoringState, templateId: string): ColoringState {
  const template = state.templates.find((item) => item.id === templateId);
  if (!template) return state;
  return {
    ...state,
    activeTemplateId: template.id,
    selectedColor: template.suggestedColors[0] ?? state.selectedColor,
  };
}

export function setSelectedColor(state: ColoringState, color: string): ColoringState {
  return { ...state, selectedColor: color };
}

export function setBrushSize(state: ColoringState, brushSize: BrushSize): ColoringState {
  return { ...state, brushSize };
}

export function applyRegionFill(state: ColoringState, regionId: string, color = state.selectedColor): ColoringState {
  const current = state.progress[state.activeTemplateId]?.fills ?? {};
  const nextFills = { ...current, [regionId]: color };
  const currentHistory = state.history[state.activeTemplateId] ?? [];
  return {
    ...state,
    progress: {
      ...state.progress,
      [state.activeTemplateId]: {
        templateId: state.activeTemplateId,
        fills: nextFills,
        updatedAt: new Date().toISOString(),
      },
    },
    history: {
      ...state.history,
      [state.activeTemplateId]: [...currentHistory, current],
    },
  };
}

export function undoFill(state: ColoringState): ColoringState {
  const history = state.history[state.activeTemplateId] ?? [];
  if (history.length === 0) return state;
  const previous = history[history.length - 1];
  return {
    ...state,
    progress: {
      ...state.progress,
      [state.activeTemplateId]: {
        templateId: state.activeTemplateId,
        fills: previous,
        updatedAt: new Date().toISOString(),
      },
    },
    history: {
      ...state.history,
      [state.activeTemplateId]: history.slice(0, -1),
    },
  };
}

export function resetActiveTemplate(state: ColoringState): ColoringState {
  const nextProgress = { ...state.progress };
  delete nextProgress[state.activeTemplateId];
  return {
    ...state,
    progress: nextProgress,
    history: {
      ...state.history,
      [state.activeTemplateId]: [],
    },
  };
}

export function addTemplate(state: ColoringState, template: ColoringTemplate): ColoringState {
  return {
    ...state,
    templates: [...state.templates.filter((item) => item.id !== template.id), template],
    activeTemplateId: template.id,
    selectedColor: template.suggestedColors[0] ?? state.selectedColor,
  };
}

export function hydrateState(
  state: ColoringState,
  progress: Record<string, ColoringProgress>,
  templates: ColoringTemplate[],
): ColoringState {
  return {
    ...state,
    templates: [...state.templates, ...templates.filter((template) => !state.templates.some((item) => item.id === template.id))],
    progress,
  };
}
