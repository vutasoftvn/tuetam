"use client";

export function ToolBar({
  colors,
  selectedColor,
  onColorChange,
}: {
  colors: string[];
  selectedColor: string;
  onColorChange: (color: string) => void;
}) {
  return (
    <div
      data-testid="toolbar"
      className="flex min-h-24 w-full flex-col gap-3 rounded-t-[2rem] bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]"
    >
      <div
        data-testid="color-palette"
        className="color-palette-grid grid w-full gap-2"
        aria-label="Bảng màu"
      >
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Màu ${color}`}
            data-testid="color-swatch"
            onClick={() => onColorChange(color)}
            className="h-14 w-full min-w-0 rounded-2xl border-4 shadow-sm transition-transform active:scale-95"
            style={{ background: color, borderColor: selectedColor === color ? "#1f2937" : "#fff" }}
          />
        ))}
      </div>
    </div>
  );
}
