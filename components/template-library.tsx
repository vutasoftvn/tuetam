"use client";

import { Apple, BookOpen, BriefcaseBusiness, Car, Cat, CloudSun, FolderHeart, Flower2, Leaf, ToyBrick, Utensils } from "lucide-react";
import type { ColoringTemplate, TemplateCategoryId } from "@/lib/types";
import { categories } from "@/lib/templates/builtin";

const categoryIcons = {
  hoa: Flower2,
  la: Leaf,
  qua: Apple,
  "con-vat": Cat,
  "do-choi": ToyBrick,
  "phuong-tien": Car,
  "nghe-nghiep": BriefcaseBusiness,
  "thuc-an": Utensils,
  "thien-nhien": CloudSun,
  "hoc-tap": BookOpen,
  parent: FolderHeart,
} satisfies Record<TemplateCategoryId, typeof Flower2>;

const categoryThemes = {
  hoa: { active: "bg-[#ffe1ec] ring-[#ff7aaa]", inactive: "bg-[#fff5f8]", color: "#e83e7b" },
  la: { active: "bg-[#dff8d8] ring-[#6fd35f]", inactive: "bg-[#f4fff1]", color: "#2f9e44" },
  qua: { active: "bg-[#ffe7bd] ring-[#ffb23f]", inactive: "bg-[#fff8ea]", color: "#f97316" },
  "con-vat": { active: "bg-[#dff2ff] ring-[#5fc3f3]", inactive: "bg-[#f1faff]", color: "#1687c7" },
  "do-choi": { active: "bg-[#e7ddff] ring-[#9b7af7]", inactive: "bg-[#f7f2ff]", color: "#7c3aed" },
  "phuong-tien": { active: "bg-[#dbeafe] ring-[#60a5fa]", inactive: "bg-[#eff6ff]", color: "#2563eb" },
  "nghe-nghiep": { active: "bg-[#fce7f3] ring-[#f472b6]", inactive: "bg-[#fff1f7]", color: "#db2777" },
  "thuc-an": { active: "bg-[#fee2e2] ring-[#fb7185]", inactive: "bg-[#fff5f5]", color: "#e11d48" },
  "thien-nhien": { active: "bg-[#dcfce7] ring-[#4ade80]", inactive: "bg-[#f0fdf4]", color: "#16a34a" },
  "hoc-tap": { active: "bg-[#fef3c7] ring-[#fbbf24]", inactive: "bg-[#fffbeb]", color: "#ca8a04" },
  parent: { active: "bg-[#ffe5c7] ring-[#f59e0b]", inactive: "bg-[#fff7eb]", color: "#d97706" },
} satisfies Record<TemplateCategoryId, { active: string; inactive: string; color: string }>;

function applyThumbnailFills(svg: string): string {
  return svg.replace(/data-region-id="([^"]+)"/g, (_match, regionId: string) => {
    return `data-region-id="${regionId}" fill="#ffffff"`;
  });
}

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
    <aside className="template-sidebar flex h-full w-56 shrink-0 flex-col gap-3 overflow-hidden border-r border-[#e4d8c4] bg-[#fffaf0] p-3">
      <div className="template-category-grid grid shrink-0 grid-cols-2 gap-2">
        {categories.map((category) => {
          const Icon = categoryIcons[category.id];
          const theme = categoryThemes[category.id];
          const selected = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              aria-label={category.label}
              onClick={() => onCategoryChange(category.id)}
              className={`template-category-button flex min-h-16 items-center justify-center rounded-2xl px-2 shadow-sm ring-4 transition-transform active:scale-95 ${
                selected ? `${theme.active} ring-offset-1` : `${theme.inactive} ring-transparent`
              }`}
            >
              <Icon
                aria-hidden="true"
                className="template-category-icon"
                data-testid={`category-icon-${category.id}`}
                data-icon-color={theme.color}
                color={theme.color}
                size={34}
                strokeWidth={2.7}
              />
            </button>
          );
        })}
      </div>

      <div className="template-grid grid min-h-0 flex-1 content-start grid-cols-2 gap-x-4 gap-y-6 overflow-y-auto overscroll-contain pb-24 pr-1">
        {visible.length === 0 ? (
          <div className="col-span-2 rounded-2xl bg-white p-4 text-center text-sm font-bold text-[#6f6658]">
            Chưa có mẫu nào
          </div>
        ) : null}
        {visible.map((template) => (
          <button
            key={template.id}
            type="button"
            aria-label={`${template.title} ${template.regionIds.length} vùng tô`}
            onClick={() => onTemplateSelect(template.id)}
            className={`aspect-square overflow-hidden rounded-2xl border-4 bg-white p-1 shadow-sm transition-transform active:scale-95 ${
              template.id === activeTemplateId ? "border-[#38bdf8]" : "border-transparent"
            }`}
          >
            {template.svg ? (
              <span
                className="pointer-events-none block h-full w-full [&_svg]:h-full [&_svg]:w-full [&_svg]:rounded-2xl [&_svg]:bg-[#fffdf8] [&_svg]:p-0"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: applyThumbnailFills(template.thumbnail) }}
              />
            ) : (
              <span
                className="block h-full w-full rounded-2xl bg-center bg-contain bg-no-repeat"
                aria-hidden="true"
                style={{ backgroundImage: `url(${template.thumbnail})` }}
              />
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
