export type ValidationResult = { ok: true; regionIds: string[] } | { ok: false; reason: string };

export function sanitizeSvgTemplate(svg: string): string {
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/\son[a-z]+='[^']*'/gi, "");
}

export function validateSvgTemplate(svg: string): ValidationResult {
  const trimmed = svg.trim();
  if (!trimmed.startsWith("<svg")) {
    return { ok: false, reason: "File này không phải SVG hợp lệ." };
  }
  if (/<script[\s\S]*?>/i.test(svg)) {
    return { ok: false, reason: "SVG không được chứa script." };
  }
  const regionIds = Array.from(svg.matchAll(/data-region-id=["']([^"']+)["']/g)).map((match) => match[1]);
  if (regionIds.length === 0) {
    return { ok: false, reason: "File này chưa có vùng tô rõ ràng." };
  }
  return { ok: true, regionIds: Array.from(new Set(regionIds)) };
}
