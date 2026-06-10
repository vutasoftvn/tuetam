# Kids Coloring Next.js Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a tablet-first Next.js coloring web app for children aged 3 to 6 with region-based coloring, built-in templates, parent SVG/PNG uploads, local saving, and reset.

**Architecture:** Use Next.js App Router with a single child-facing coloring studio as the first screen. SVG templates use region IDs and fill maps; PNG uploads use a canvas fill layer with flood fill. State is local-first with IndexedDB and React client components.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, lucide-react, IndexedDB via a small local wrapper, Vitest, Testing Library, Playwright.

---

## File Structure

- Create `package.json`: scripts and dependencies.
- Create `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, `playwright.config.ts`: project configuration.
- Create `app/layout.tsx`, `app/page.tsx`, `app/globals.css`: Next.js shell and tablet studio page.
- Create `components/template-library.tsx`: left template category and thumbnail browser.
- Create `components/coloring-canvas.tsx`: SVG/PNG coloring surface and pointer handling.
- Create `components/tool-bar.tsx`: color swatches, brush size, undo, reset, save indicator.
- Create `components/parent-panel.tsx`: upload SVG/PNG and parent template management.
- Create `lib/types.ts`: shared template, progress, and tool types.
- Create `lib/templates/builtin.ts`: built-in flower, leaf, fruit, animal, and toy SVG templates.
- Create `lib/storage/index.ts`: IndexedDB persistence for progress, uploads, and preferences.
- Create `lib/svg/index.ts`: SVG validation, sanitization, region normalization helpers.
- Create `lib/png/index.ts`: PNG validation, contrast check, and flood-fill helpers.
- Create `lib/coloring/reducer.ts`: state reducer for coloring, undo, reset, and template selection.
- Create `tests/unit/*.test.ts`: unit tests for reducer, storage fallback, SVG validation, PNG flood fill.
- Create `tests/e2e/coloring.spec.ts`: Playwright coverage for the main tablet workflow.

## Task 1: Scaffold Next.js App

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`

- [ ] **Step 1: Create project configuration**

Create `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "lucide-react": "latest",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@playwright/test": "latest",
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "eslint": "latest",
    "eslint-config-next": "latest",
    "jsdom": "latest",
    "tailwindcss": "latest",
    "typescript": "latest",
    "vitest": "latest"
  }
}
```

Create `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `postcss.config.mjs`:

```js
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
```

Create `eslint.config.mjs`:

```js
import next from "eslint-config-next";

export default [...next];
```

Create `vitest.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
});
```

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    ...devices["iPad Pro 11"],
  },
});
```

- [ ] **Step 2: Create the app shell**

Create `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Be Tap To Mau",
  description: "Tablet coloring studio for young children.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
```

Create `app/page.tsx`:

```tsx
export default function HomePage() {
  return <main className="min-h-screen bg-[#fbf7ef] text-[#222]">Be Tap To Mau</main>;
}
```

Create `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

* {
  box-sizing: border-box;
}

html,
body {
  min-height: 100%;
  margin: 0;
  overscroll-behavior: none;
}

body {
  font-family: Arial, Helvetica, sans-serif;
}

button,
input {
  font: inherit;
}
```

- [ ] **Step 3: Install dependencies**

Run: `npm install`

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 4: Verify scaffold**

Run: `npm run build`

Expected: build completes successfully.

## Task 2: Shared Types And Built-In Templates

**Files:**
- Create: `lib/types.ts`
- Create: `lib/templates/builtin.ts`
- Create: `tests/unit/templates.test.ts`

- [ ] **Step 1: Write template tests**

Create `tests/unit/templates.test.ts`:

```ts
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
      "parent",
    ]);
  });

  it("ships multiple colorable SVG templates", () => {
    expect(builtinTemplates.length).toBeGreaterThanOrEqual(10);
    for (const template of builtinTemplates) {
      expect(template.sourceType).toBe("svg");
      expect(template.regionIds.length).toBeGreaterThan(0);
      expect(template.svg).toContain("data-region-id");
      expect(template.suggestedColors.length).toBeGreaterThanOrEqual(5);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/templates.test.ts`

Expected: FAIL because `@/lib/templates/builtin` does not exist.

- [ ] **Step 3: Add shared types**

Create `lib/types.ts`:

```ts
export type TemplateCategoryId = "hoa" | "la" | "qua" | "con-vat" | "do-choi" | "parent";

export type SourceType = "svg" | "png";

export type BrushSize = "medium" | "large";

export type ColoringTemplate = {
  id: string;
  title: string;
  category: TemplateCategoryId;
  sourceType: SourceType;
  thumbnail: string;
  svg?: string;
  imageDataUrl?: string;
  suggestedColors: string[];
  regionIds: string[];
};

export type ColoringProgress = {
  templateId: string;
  fills?: Record<string, string>;
  rasterFillDataUrl?: string;
  updatedAt: string;
};

export type ParentTemplate = ColoringTemplate & {
  createdAt: string;
};
```

- [ ] **Step 4: Add built-in templates**

Create `lib/templates/builtin.ts` with category metadata, a reusable SVG builder, and at least ten templates:

```ts
import type { ColoringTemplate, TemplateCategoryId } from "@/lib/types";

export const categories: Array<{ id: TemplateCategoryId; label: string }> = [
  { id: "hoa", label: "Hoa" },
  { id: "la", label: "La" },
  { id: "qua", label: "Qua" },
  { id: "con-vat", label: "Con vat" },
  { id: "do-choi", label: "Do choi" },
  { id: "parent", label: "Mau cua ba me" },
];

const palette = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#38bdf8", "#a78bfa", "#f472b6"];

function makeTemplate(
  id: string,
  title: string,
  category: TemplateCategoryId,
  body: string,
  regionIds: string[],
): ColoringTemplate {
  const svg = `<svg viewBox="0 0 400 400" role="img" aria-label="${title}" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="#fffdf8"/>
    <g fill="#ffffff" stroke="#202020" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
      ${body}
    </g>
  </svg>`;

  return {
    id,
    title,
    category,
    sourceType: "svg",
    thumbnail: svg,
    svg,
    suggestedColors: palette,
    regionIds,
  };
}

export const builtinTemplates: ColoringTemplate[] = [
  makeTemplate("flower-01", "Bong hoa", "hoa", `
    <circle data-region-id="center" cx="200" cy="200" r="38"/>
    <ellipse data-region-id="petal_1" cx="200" cy="110" rx="45" ry="72"/>
    <ellipse data-region-id="petal_2" cx="290" cy="200" rx="72" ry="45"/>
    <ellipse data-region-id="petal_3" cx="200" cy="290" rx="45" ry="72"/>
    <ellipse data-region-id="petal_4" cx="110" cy="200" rx="72" ry="45"/>
  `, ["center", "petal_1", "petal_2", "petal_3", "petal_4"]),
  makeTemplate("tulip-01", "Hoa tulip", "hoa", `
    <path data-region-id="flower_head" d="M145 170 C140 90 180 110 200 145 C220 110 260 90 255 170 C250 235 150 235 145 170Z"/>
    <path data-region-id="stem" d="M190 230 H210 V340 H190Z"/>
    <path data-region-id="leaf_left" d="M190 280 C120 250 100 310 185 320Z"/>
  `, ["flower_head", "stem", "leaf_left"]),
  makeTemplate("leaf-01", "Chiec la", "la", `
    <path data-region-id="leaf_body" d="M85 220 C150 70 290 70 325 220 C250 300 150 300 85 220Z"/>
    <path data-region-id="stem" d="M190 250 H210 V350 H190Z"/>
  `, ["leaf_body", "stem"]),
  makeTemplate("branch-01", "Canh la", "la", `
    <path data-region-id="branch" d="M195 70 H215 V340 H195Z"/>
    <ellipse data-region-id="leaf_1" cx="150" cy="130" rx="42" ry="72" transform="rotate(-35 150 130)"/>
    <ellipse data-region-id="leaf_2" cx="260" cy="190" rx="42" ry="72" transform="rotate(35 260 190)"/>
    <ellipse data-region-id="leaf_3" cx="145" cy="255" rx="42" ry="72" transform="rotate(-35 145 255)"/>
  `, ["branch", "leaf_1", "leaf_2", "leaf_3"]),
  makeTemplate("apple-01", "Qua tao", "qua", `
    <path data-region-id="apple_body" d="M120 185 C90 110 170 90 200 130 C230 90 310 110 280 185 C320 285 245 335 200 300 C155 335 80 285 120 185Z"/>
    <path data-region-id="leaf" d="M205 110 C230 65 280 85 260 130 C235 135 220 130 205 110Z"/>
    <path data-region-id="stem" d="M190 70 H210 V125 H190Z"/>
  `, ["apple_body", "leaf", "stem"]),
  makeTemplate("watermelon-01", "Dua hau", "qua", `
    <path data-region-id="rind" d="M80 230 C120 330 280 330 320 230Z"/>
    <path data-region-id="inside" d="M110 230 C145 300 255 300 290 230Z"/>
    <circle data-region-id="seed_1" cx="175" cy="255" r="10"/>
    <circle data-region-id="seed_2" cx="225" cy="255" r="10"/>
  `, ["rind", "inside", "seed_1", "seed_2"]),
  makeTemplate("cat-01", "Meo con", "con-vat", `
    <circle data-region-id="head" cx="200" cy="185" r="85"/>
    <path data-region-id="ear_left" d="M130 125 L145 55 L185 115Z"/>
    <path data-region-id="ear_right" d="M270 125 L255 55 L215 115Z"/>
    <circle data-region-id="body" cx="200" cy="305" r="65"/>
  `, ["head", "ear_left", "ear_right", "body"]),
  makeTemplate("fish-01", "Ca nho", "con-vat", `
    <ellipse data-region-id="body" cx="190" cy="205" rx="110" ry="70"/>
    <path data-region-id="tail" d="M290 205 L350 145 V265Z"/>
    <circle data-region-id="eye" cx="150" cy="185" r="12"/>
    <path data-region-id="fin" d="M195 205 L230 245 L160 245Z"/>
  `, ["body", "tail", "eye", "fin"]),
  makeTemplate("teddy-01", "Gau bong", "do-choi", `
    <circle data-region-id="head" cx="200" cy="145" r="70"/>
    <circle data-region-id="ear_left" cx="135" cy="90" r="32"/>
    <circle data-region-id="ear_right" cx="265" cy="90" r="32"/>
    <ellipse data-region-id="body" cx="200" cy="270" rx="85" ry="95"/>
    <circle data-region-id="belly" cx="200" cy="285" r="42"/>
  `, ["head", "ear_left", "ear_right", "body", "belly"]),
  makeTemplate("toy-car-01", "Xe do choi", "do-choi", `
    <path data-region-id="car_body" d="M80 230 H320 V285 H80Z"/>
    <path data-region-id="car_top" d="M135 230 L170 170 H250 L285 230Z"/>
    <circle data-region-id="wheel_left" cx="140" cy="290" r="32"/>
    <circle data-region-id="wheel_right" cx="270" cy="290" r="32"/>
  `, ["car_body", "car_top", "wheel_left", "wheel_right"]),
];
```

- [ ] **Step 5: Verify template tests pass**

Run: `npm test -- tests/unit/templates.test.ts`

Expected: PASS.

## Task 3: Coloring State Reducer

**Files:**
- Create: `lib/coloring/reducer.ts`
- Create: `tests/unit/coloring-reducer.test.ts`

- [ ] **Step 1: Write reducer tests**

Create `tests/unit/coloring-reducer.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { applyRegionFill, createInitialColoringState, resetActiveTemplate, selectTemplate, undoFill } from "@/lib/coloring/reducer";
import { builtinTemplates } from "@/lib/templates/builtin";

describe("coloring reducer helpers", () => {
  it("selects a template and starts with suggested color", () => {
    const state = createInitialColoringState(builtinTemplates);
    const next = selectTemplate(state, "apple-01");
    expect(next.activeTemplateId).toBe("apple-01");
    expect(next.selectedColor).toBe(builtinTemplates.find((item) => item.id === "apple-01")?.suggestedColors[0]);
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/coloring-reducer.test.ts`

Expected: FAIL because reducer helpers do not exist.

- [ ] **Step 3: Implement reducer helpers**

Create `lib/coloring/reducer.ts`:

```ts
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
  const nextHistory = history.slice(0, -1);
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
      [state.activeTemplateId]: nextHistory,
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
```

- [ ] **Step 4: Verify reducer tests pass**

Run: `npm test -- tests/unit/coloring-reducer.test.ts`

Expected: PASS.

## Task 4: SVG And PNG Helpers

**Files:**
- Create: `lib/svg/index.ts`
- Create: `lib/png/index.ts`
- Create: `tests/unit/svg.test.ts`
- Create: `tests/unit/png.test.ts`

- [ ] **Step 1: Write SVG validation tests**

Create `tests/unit/svg.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { sanitizeSvgTemplate, validateSvgTemplate } from "@/lib/svg";

describe("svg helpers", () => {
  it("accepts safe SVG with colorable regions", () => {
    const result = validateSvgTemplate(`<svg viewBox="0 0 10 10"><path data-region-id="a" d="M1 1 H9 V9 H1Z"/></svg>`);
    expect(result.ok).toBe(true);
  });

  it("rejects unsafe script content", () => {
    const result = validateSvgTemplate(`<svg><script>alert(1)</script><path data-region-id="a" d="M1 1 H9 V9 H1Z"/></svg>`);
    expect(result.ok).toBe(false);
  });

  it("sanitizes event handlers", () => {
    const clean = sanitizeSvgTemplate(`<svg><path data-region-id="a" onclick="x()" d="M1 1 H9 V9 H1Z"/></svg>`);
    expect(clean).not.toContain("onclick");
  });
});
```

- [ ] **Step 2: Write PNG helper tests**

Create `tests/unit/png.test.ts`:

```ts
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
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test -- tests/unit/svg.test.ts tests/unit/png.test.ts`

Expected: FAIL because helpers do not exist.

- [ ] **Step 4: Implement SVG helpers**

Create `lib/svg/index.ts`:

```ts
export type ValidationResult = { ok: true; regionIds: string[] } | { ok: false; reason: string };

export function sanitizeSvgTemplate(svg: string): string {
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/\son[a-z]+='[^']*'/gi, "");
}

export function validateSvgTemplate(svg: string): ValidationResult {
  if (!svg.trim().startsWith("<svg")) {
    return { ok: false, reason: "File nay khong phai SVG hop le." };
  }
  if (/<script[\s\S]*?>/i.test(svg)) {
    return { ok: false, reason: "SVG khong duoc chua script." };
  }
  const regionIds = Array.from(svg.matchAll(/data-region-id=["']([^"']+)["']/g)).map((match) => match[1]);
  if (regionIds.length === 0) {
    return { ok: false, reason: "File nay chua co vung to ro rang." };
  }
  return { ok: true, regionIds: Array.from(new Set(regionIds)) };
}
```

- [ ] **Step 5: Implement PNG helpers**

Create `lib/png/index.ts`:

```ts
type Rgba = [number, number, number, number];

export function hasEnoughLineContrast(pixels: Uint8ClampedArray): boolean {
  let min = 255;
  let max = 0;
  for (let index = 0; index < pixels.length; index += 4) {
    const brightness = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
    min = Math.min(min, brightness);
    max = Math.max(max, brightness);
  }
  return max - min >= 80;
}

function isBoundary(pixels: Uint8ClampedArray, index: number): boolean {
  const brightness = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
  return brightness < 80;
}

export function floodFillPixels({
  pixels,
  width,
  height,
  x,
  y,
  color,
}: {
  pixels: Uint8ClampedArray;
  width: number;
  height: number;
  x: number;
  y: number;
  color: Rgba;
}): Uint8ClampedArray {
  const output = new Uint8ClampedArray(pixels);
  const start = (y * width + x) * 4;
  if (isBoundary(output, start)) return output;

  const queue: Array<[number, number]> = [[x, y]];
  const seen = new Set<string>();

  while (queue.length > 0) {
    const [cx, cy] = queue.shift()!;
    const key = `${cx}:${cy}`;
    if (seen.has(key) || cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
    seen.add(key);
    const index = (cy * width + cx) * 4;
    if (isBoundary(output, index)) continue;
    output[index] = color[0];
    output[index + 1] = color[1];
    output[index + 2] = color[2];
    output[index + 3] = color[3];
    queue.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
  }

  return output;
}
```

- [ ] **Step 6: Verify helper tests pass**

Run: `npm test -- tests/unit/svg.test.ts tests/unit/png.test.ts`

Expected: PASS.

## Task 5: Local Storage

**Files:**
- Create: `lib/storage/index.ts`
- Create: `tests/unit/storage.test.ts`

- [ ] **Step 1: Write storage tests**

Create `tests/unit/storage.test.ts`:

```ts
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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/storage.test.ts`

Expected: FAIL because storage module does not exist.

- [ ] **Step 3: Implement storage wrapper**

Create `lib/storage/index.ts`:

```ts
import type { ColoringProgress, ParentTemplate } from "@/lib/types";

export type ColoringStore = {
  loadProgress(): Promise<Record<string, ColoringProgress>>;
  saveProgress(progress: ColoringProgress): Promise<void>;
  resetProgress(templateId: string): Promise<void>;
  loadParentTemplates(): Promise<ParentTemplate[]>;
  saveParentTemplate(template: ParentTemplate): Promise<void>;
  deleteParentTemplate(templateId: string): Promise<void>;
};

export function createMemoryColoringStore(): ColoringStore {
  let progress: Record<string, ColoringProgress> = {};
  let parentTemplates: ParentTemplate[] = [];
  return {
    async loadProgress() {
      return progress;
    },
    async saveProgress(item) {
      progress = { ...progress, [item.templateId]: item };
    },
    async resetProgress(templateId) {
      const next = { ...progress };
      delete next[templateId];
      progress = next;
    },
    async loadParentTemplates() {
      return parentTemplates;
    },
    async saveParentTemplate(template) {
      parentTemplates = [...parentTemplates.filter((item) => item.id !== template.id), template];
    },
    async deleteParentTemplate(templateId) {
      parentTemplates = parentTemplates.filter((item) => item.id !== templateId);
    },
  };
}

export function createBrowserColoringStore(): ColoringStore {
  if (typeof indexedDB === "undefined") {
    return createMemoryColoringStore();
  }
  return createMemoryColoringStore();
}
```

- [ ] **Step 4: Verify storage tests pass**

Run: `npm test -- tests/unit/storage.test.ts`

Expected: PASS.

## Task 6: React Studio UI

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Create: `components/template-library.tsx`
- Create: `components/tool-bar.tsx`
- Create: `components/coloring-canvas.tsx`
- Create: `components/parent-panel.tsx`
- Create: `tests/unit/studio.test.tsx`

- [ ] **Step 1: Write studio tests**

Create `tests/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Create `tests/unit/studio.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("coloring studio", () => {
  it("renders tablet library, canvas, and toolbar", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: "Be Tap To Mau" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hoa" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "But vua" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "But to" })).toBeInTheDocument();
  });

  it("colors an SVG region when tapped", async () => {
    render(<HomePage />);
    const region = screen.getByTestId("region-petal_1");
    await userEvent.click(region);
    expect(region).toHaveAttribute("fill", "#ef4444");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/studio.test.tsx`

Expected: FAIL because studio components do not exist.

- [ ] **Step 3: Implement components and page**

Implement components with these contracts:

```tsx
// components/template-library.tsx
"use client";

import type { ColoringTemplate, TemplateCategoryId } from "@/lib/types";
import { categories } from "@/lib/templates/builtin";

export function TemplateLibrary({
  templates,
  activeTemplateId,
  activeCategory,
  onCategoryChange,
  onTemplateSelect,
}: {
  templates: ColoringTemplate[];
  activeTemplateId: string;
  activeCategory: TemplateCategoryId;
  onCategoryChange: (category: TemplateCategoryId) => void;
  onTemplateSelect: (templateId: string) => void;
}) {
  const visible = templates.filter((template) => template.category === activeCategory);
  return (
    <aside className="flex h-full w-52 shrink-0 flex-col gap-3 border-r border-[#eadfcb] bg-[#fffaf0] p-3">
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => (
          <button key={category.id} type="button" onClick={() => onCategoryChange(category.id)} className="min-h-12 rounded-xl bg-white px-2 text-base font-bold shadow-sm">
            {category.label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 overflow-auto">
        {visible.map((template) => (
          <button key={template.id} type="button" onClick={() => onTemplateSelect(template.id)} className={`rounded-2xl border-4 bg-white p-2 ${template.id === activeTemplateId ? "border-[#38bdf8]" : "border-transparent"}`}>
            <span className="block text-base font-bold">{template.title}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
```

```tsx
// components/tool-bar.tsx
"use client";

import { RotateCcw, Save, Undo2 } from "lucide-react";
import type { BrushSize } from "@/lib/types";

export function ToolBar({
  colors,
  selectedColor,
  brushSize,
  onColorChange,
  onBrushSizeChange,
  onUndo,
  onReset,
}: {
  colors: string[];
  selectedColor: string;
  brushSize: BrushSize;
  onColorChange: (color: string) => void;
  onBrushSizeChange: (size: BrushSize) => void;
  onUndo: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex min-h-24 items-center gap-3 rounded-t-3xl bg-white px-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
      <div className="flex gap-2">
        {colors.map((color) => (
          <button key={color} type="button" aria-label={`Mau ${color}`} onClick={() => onColorChange(color)} className="h-14 w-14 rounded-2xl border-4" style={{ background: color, borderColor: selectedColor === color ? "#222" : "#fff" }} />
        ))}
      </div>
      <button type="button" aria-label="But vua" onClick={() => onBrushSizeChange("medium")} className={`h-14 rounded-2xl px-5 font-bold ${brushSize === "medium" ? "bg-[#222] text-white" : "bg-[#f2ead8]"}`}>Vua</button>
      <button type="button" aria-label="But to" onClick={() => onBrushSizeChange("large")} className={`h-14 rounded-2xl px-5 font-bold ${brushSize === "large" ? "bg-[#222] text-white" : "bg-[#f2ead8]"}`}>To</button>
      <button type="button" aria-label="Hoan tac" onClick={onUndo} className="h-14 w-14 rounded-2xl bg-[#f2ead8]"><Undo2 className="mx-auto" /></button>
      <button type="button" aria-label="To lai" onClick={onReset} className="h-14 w-14 rounded-2xl bg-[#f2ead8]"><RotateCcw className="mx-auto" /></button>
      <div className="ml-auto flex items-center gap-2 text-sm font-bold text-[#4b8063]"><Save size={20} /> Da luu</div>
    </div>
  );
}
```

```tsx
// components/coloring-canvas.tsx
"use client";

import type { ColoringTemplate } from "@/lib/types";

export function ColoringCanvas({
  template,
  fills,
  onRegionFill,
}: {
  template: ColoringTemplate;
  fills: Record<string, string>;
  onRegionFill: (regionId: string) => void;
}) {
  const html = (template.svg ?? "").replace(/data-region-id="([^"]+)"/g, (_match, regionId: string) => {
    const fill = fills[regionId] ?? "#ffffff";
    return `data-region-id="${regionId}" data-testid="region-${regionId}" fill="${fill}"`;
  });

  return (
    <section className="flex flex-1 items-center justify-center p-5">
      <div
        className="aspect-square h-full max-h-[calc(100vh-8rem)] rounded-[2rem] bg-white p-5 shadow-xl"
        onClick={(event) => {
          const target = event.target as HTMLElement;
          const regionId = target.dataset.regionId;
          if (regionId) onRegionFill(regionId);
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}
```

```tsx
// components/parent-panel.tsx
"use client";

export function ParentPanel() {
  return (
    <details className="absolute right-4 top-4 rounded-2xl bg-white px-4 py-3 shadow-lg">
      <summary className="cursor-pointer font-bold">Ba me</summary>
      <div className="mt-3 grid gap-2 text-sm">
        <label className="font-bold" htmlFor="template-upload">Tai mau SVG/PNG</label>
        <input id="template-upload" type="file" accept=".svg,.png,image/svg+xml,image/png" />
        <p>SVG ho tro to theo vung tot nhat. PNG can net vien ro va nen sang.</p>
      </div>
    </details>
  );
}
```

```tsx
// app/page.tsx
"use client";

import { useMemo, useState } from "react";
import { ColoringCanvas } from "@/components/coloring-canvas";
import { ParentPanel } from "@/components/parent-panel";
import { TemplateLibrary } from "@/components/template-library";
import { ToolBar } from "@/components/tool-bar";
import { applyRegionFill, createInitialColoringState, resetActiveTemplate, selectTemplate, setBrushSize, setSelectedColor, undoFill } from "@/lib/coloring/reducer";
import { builtinTemplates } from "@/lib/templates/builtin";
import type { TemplateCategoryId } from "@/lib/types";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<TemplateCategoryId>("hoa");
  const [state, setState] = useState(() => createInitialColoringState(builtinTemplates));
  const activeTemplate = useMemo(() => state.templates.find((template) => template.id === state.activeTemplateId) ?? state.templates[0], [state.activeTemplateId, state.templates]);
  const fills = state.progress[activeTemplate.id]?.fills ?? {};

  return (
    <main className="relative flex h-screen overflow-hidden bg-[#fbf7ef] text-[#222]">
      <TemplateLibrary templates={state.templates} activeTemplateId={state.activeTemplateId} activeCategory={activeCategory} onCategoryChange={setActiveCategory} onTemplateSelect={(id) => setState((current) => selectTemplate(current, id))} />
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center px-6">
          <h1 className="text-3xl font-black">Be Tap To Mau</h1>
        </header>
        <ColoringCanvas template={activeTemplate} fills={fills} onRegionFill={(regionId) => setState((current) => applyRegionFill(current, regionId))} />
        <ToolBar colors={activeTemplate.suggestedColors} selectedColor={state.selectedColor} brushSize={state.brushSize} onColorChange={(color) => setState((current) => setSelectedColor(current, color))} onBrushSizeChange={(size) => setState((current) => setBrushSize(current, size))} onUndo={() => setState(undoFill)} onReset={() => setState(resetActiveTemplate)} />
      </section>
      <ParentPanel />
    </main>
  );
}
```

- [ ] **Step 4: Verify studio tests pass**

Run: `npm test -- tests/unit/studio.test.tsx`

Expected: PASS.

## Task 7: Parent Upload Flow

**Files:**
- Modify: `components/parent-panel.tsx`
- Modify: `app/page.tsx`
- Create: `tests/unit/parent-panel.test.tsx`

- [ ] **Step 1: Write upload tests**

Create `tests/unit/parent-panel.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ParentPanel } from "@/components/parent-panel";

describe("ParentPanel", () => {
  it("accepts SVG upload and reports it to caller", async () => {
    const onTemplateCreate = vi.fn();
    render(<ParentPanel onTemplateCreate={onTemplateCreate} />);
    const file = new File([`<svg><path data-region-id="a" d="M1 1 H9 V9 H1Z"/></svg>`], "flower.svg", { type: "image/svg+xml" });
    await userEvent.upload(screen.getByLabelText("Tai mau SVG/PNG"), file);
    expect(await screen.findByText("Da them mau flower")).toBeInTheDocument();
    expect(onTemplateCreate).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/parent-panel.test.tsx`

Expected: FAIL because `ParentPanel` does not accept `onTemplateCreate`.

- [ ] **Step 3: Implement upload parsing**

Modify `components/parent-panel.tsx` to accept `onTemplateCreate`, read SVG text, validate it, and create a parent template. PNG files should be read as data URLs and accepted with a parent warning message.

- [ ] **Step 4: Wire parent templates into page state**

Modify `app/page.tsx` so `onTemplateCreate` appends the uploaded template and switches to category `parent`.

- [ ] **Step 5: Verify upload tests pass**

Run: `npm test -- tests/unit/parent-panel.test.tsx`

Expected: PASS.

## Task 8: Persistence

**Files:**
- Modify: `lib/storage/index.ts`
- Modify: `app/page.tsx`
- Create: `tests/unit/persistence.test.ts`

- [ ] **Step 1: Write persistence tests**

Create `tests/unit/persistence.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createMemoryColoringStore } from "@/lib/storage";

describe("persistence contract", () => {
  it("stores parent templates", async () => {
    const store = createMemoryColoringStore();
    await store.saveParentTemplate({
      id: "parent-1",
      title: "Mau moi",
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
```

- [ ] **Step 2: Run test**

Run: `npm test -- tests/unit/persistence.test.ts`

Expected: PASS using the existing memory store.

- [ ] **Step 3: Add browser local persistence**

Modify `lib/storage/index.ts` so `createBrowserColoringStore` stores JSON in IndexedDB when available. Use object stores `progress` and `parentTemplates`.

- [ ] **Step 4: Wire persistence into page**

Modify `app/page.tsx` to load progress and parent templates on mount, save progress after region fills, save parent templates after upload, and reset stored progress after reset.

- [ ] **Step 5: Verify unit tests pass**

Run: `npm test`

Expected: PASS.

## Task 9: E2E And Visual Verification

**Files:**
- Create: `tests/e2e/coloring.spec.ts`

- [ ] **Step 1: Write e2e test**

Create `tests/e2e/coloring.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("child can color and reset a region on tablet", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Be Tap To Mau" })).toBeVisible();
  const region = page.getByTestId("region-petal_1");
  await region.click();
  await expect(region).toHaveAttribute("fill", "#ef4444");
  await page.getByRole("button", { name: "To lai" }).click();
  await expect(region).toHaveAttribute("fill", "#ffffff");
});
```

- [ ] **Step 2: Run full checks**

Run:

```bash
npm test
npm run build
npm run test:e2e
```

Expected: all checks pass.

- [ ] **Step 3: Start dev server for user review**

Run: `npm run dev`

Expected: local app is available at `http://localhost:3000`.

## Self-Review Notes

- Spec coverage: tablet layout, left library, SVG/PNG uploads, region coloring, two brush sizes, local save, reset, and tests are all covered.
- Known MVP tradeoff: IndexedDB wrapper starts simple; memory fallback is tested first, browser persistence is added after UI is working.
- No account, cloud sync, advanced PNG cleanup, stickers, lessons, or gamification are included.
