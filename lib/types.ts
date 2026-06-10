export type TemplateCategoryId =
  | "hoa"
  | "la"
  | "qua"
  | "con-vat"
  | "do-choi"
  | "phuong-tien"
  | "nghe-nghiep"
  | "thuc-an"
  | "thien-nhien"
  | "hoc-tap"
  | "parent";

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
