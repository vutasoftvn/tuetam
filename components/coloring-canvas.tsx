"use client";

import type { ColoringTemplate } from "@/lib/types";

function applySvgFills(svg: string, fills: Record<string, string>): string {
  return svg.replace(/data-region-id="([^"]+)"/g, (_match, regionId: string) => {
    const fill = fills[regionId] ?? "#ffffff";
    return `data-region-id="${regionId}" data-testid="region-${regionId}" fill="${fill}"`;
  });
}

export function ColoringCanvas({
  template,
  fills,
  selectedColor,
  onRegionFill,
}: {
  template: ColoringTemplate;
  fills: Record<string, string>;
  selectedColor: string;
  onRegionFill: (regionId: string) => void;
}) {
  const html = template.sourceType === "svg" && template.svg ? applySvgFills(template.svg, fills) : "";
  function fillTarget(target: EventTarget | null) {
    const element = target as SVGElement | null;
    const regionId = element?.dataset.regionId;
    if (regionId && element) {
      element.setAttribute("fill", selectedColor);
      onRegionFill(regionId);
    }
  }

  return (
    <section
      data-testid="coloring-canvas-shell"
      className="flex min-h-0 w-full flex-1 items-stretch justify-stretch p-4"
    >
      <div
        data-testid="coloring-stage"
        className="coloring-stage flex h-full w-full touch-none items-center justify-center overflow-hidden rounded-[2rem] bg-white p-5 shadow-xl"
        onPointerDown={(event) => fillTarget(event.target)}
        onClick={(event) => fillTarget(event.target)}
      >
        {template.sourceType === "svg" ? (
          <div
            data-testid="coloring-artboard"
            className="coloring-artboard flex aspect-square h-full max-h-full max-w-full items-center justify-center [&_svg]:h-full [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div
            data-testid="coloring-artboard"
            className="coloring-artboard flex aspect-square h-full max-h-full max-w-full items-center justify-center"
          >
            <img
              alt={template.title}
              className="max-h-full max-w-full object-contain"
              src={template.imageDataUrl}
            />
          </div>
        )}
      </div>
    </section>
  );
}
