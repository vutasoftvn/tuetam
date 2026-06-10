"use client";

import { FolderHeart, Upload } from "lucide-react";
import { useState } from "react";
import { sanitizeSvgTemplate, validateSvgTemplate } from "@/lib/svg";
import { basicPalette } from "@/lib/templates/builtin";
import type { ParentTemplate } from "@/lib/types";

function titleFromFileName(name: string): string {
  return name.replace(/\.[^.]+$/, "");
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ParentPanel({ onTemplateCreate }: { onTemplateCreate?: (template: ParentTemplate) => void }) {
  const [message, setMessage] = useState("SVG tô theo vùng tốt nhất. PNG cần nét viền rõ và nền sáng.");

  async function handleUpload(file: File | undefined) {
    if (!file) return;
    const title = titleFromFileName(file.name);
    const id = `parent-${Date.now()}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
      const rawSvg = await readFileAsText(file);
      const validation = validateSvgTemplate(rawSvg);
      if (!validation.ok) {
        setMessage(validation.reason);
        return;
      }
      const svg = sanitizeSvgTemplate(rawSvg);
      onTemplateCreate?.({
        id,
        title,
        category: "parent",
        sourceType: "svg",
        thumbnail: svg,
        svg,
        suggestedColors: basicPalette,
        regionIds: validation.regionIds,
        createdAt: new Date().toISOString(),
      });
      setMessage(`Đã thêm mẫu ${title}`);
      return;
    }

    if (file.type === "image/png" || file.name.toLowerCase().endsWith(".png")) {
      const imageDataUrl = await readFileAsDataUrl(file);
      onTemplateCreate?.({
        id,
        title,
        category: "parent",
        sourceType: "png",
        thumbnail: imageDataUrl,
        imageDataUrl,
        suggestedColors: basicPalette,
        regionIds: [],
        createdAt: new Date().toISOString(),
      });
      setMessage(`Đã thêm mẫu ${title}. PNG sẽ tô bằng flood fill.`);
      return;
    }

    setMessage("Chỉ hỗ trợ SVG hoặc PNG.");
  }

  return (
    <div role="group" aria-label="Ba mẹ" className="relative">
      <details className="rounded-2xl bg-white shadow-sm">
        <summary className="flex h-12 w-14 cursor-pointer list-none items-center justify-center rounded-2xl bg-[#fff1c7] text-[#d97706] transition-transform active:scale-95 [&::-webkit-details-marker]:hidden">
          <FolderHeart aria-hidden="true" size={26} strokeWidth={3} />
        </summary>
        <div className="absolute right-0 top-14 z-20 grid w-64 gap-3 rounded-3xl bg-white p-3 text-sm shadow-xl">
          <label className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#222] px-4 font-black text-white" htmlFor="template-upload">
            <Upload size={20} /> Tải mẫu SVG/PNG
          </label>
          <input
            id="template-upload"
            className="sr-only"
            type="file"
            accept=".svg,.png,image/svg+xml,image/png"
            onChange={(event) => void handleUpload(event.target.files?.[0])}
          />
          <p className="rounded-2xl bg-[#fff7e8] p-3 font-bold text-[#5f5648]">{message}</p>
        </div>
      </details>
    </div>
  );
}
