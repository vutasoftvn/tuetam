import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ColoringStudio } from "@/components/coloring-studio";

describe("coloring studio", () => {
  it("renders tablet library, canvas, and toolbar", () => {
    render(<ColoringStudio />);
    expect(screen.getByRole("heading", { name: "Bé Tập Tô Màu" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hoa" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Lá" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Quả" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Con vật" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Đồ chơi" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Phương tiện" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nghề nghiệp" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Thức ăn" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Thiên nhiên" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Đồ dùng học tập" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mẫu của ba mẹ" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Bút vừa" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Bút to" })).not.toBeInTheDocument();
    expect(screen.getAllByTestId("color-swatch")).toHaveLength(16);
  });

  it("shows visual icons for every child-facing category", () => {
    render(<ColoringStudio />);
    for (const category of [
      "hoa",
      "la",
      "qua",
      "con-vat",
      "do-choi",
      "phuong-tien",
      "nghe-nghiep",
      "thuc-an",
      "thien-nhien",
      "hoc-tap",
      "parent",
    ]) {
      expect(screen.getByTestId(`category-icon-${category}`)).toBeInTheDocument();
    }
  });

  it("uses icon-only category buttons while keeping accessible names", () => {
    render(<ColoringStudio />);
    const categoryLabels = [
      "Hoa",
      "Lá",
      "Quả",
      "Con vật",
      "Đồ chơi",
      "Phương tiện",
      "Nghề nghiệp",
      "Thức ăn",
      "Thiên nhiên",
      "Đồ dùng học tập",
      "Mẫu của ba mẹ",
    ];
    for (const label of categoryLabels) {
      const button = screen.getByRole("button", { name: label });
      expect(button).toBeInTheDocument();
      expect(button).not.toHaveTextContent(label);
    }
  });

  it("uses colorful category buttons instead of a dark active background", () => {
    render(<ColoringStudio />);
    const categoryLabels = [
      "Hoa",
      "Lá",
      "Quả",
      "Con vật",
      "Đồ chơi",
      "Phương tiện",
      "Nghề nghiệp",
      "Thức ăn",
      "Thiên nhiên",
      "Đồ dùng học tập",
      "Mẫu của ba mẹ",
    ];
    for (const label of categoryLabels) {
      const button = screen.getByRole("button", { name: label });
      expect(button.className).not.toContain("bg-[#222]");
      expect(button.querySelector("svg")).toHaveAttribute("data-icon-color");
    }
  });

  it("shows template choices as thumbnail-only buttons", () => {
    render(<ColoringStudio />);
    const templateButton = screen.getByRole("button", { name: "Bông hoa 5 vùng tô" });
    expect(templateButton).toHaveAttribute("aria-label", "Bông hoa 5 vùng tô");
    expect(templateButton).not.toHaveTextContent("Bông hoa");
    expect(templateButton).not.toHaveTextContent("5 vùng tô");
    expect(templateButton.querySelector("svg")).toBeInTheDocument();
    expect(templateButton.className).toContain("p-1");
    expect(templateButton.className).toContain("rounded-2xl");
    expect(templateButton.parentElement?.className).toContain("gap-x-4");
    expect(templateButton.parentElement?.className).toContain("gap-y-6");
    expect(templateButton.querySelector("span")?.className).toContain("[&_svg]:p-0");
    const firstRegion = templateButton.querySelector("[data-region-id]");
    expect(firstRegion).toBeInTheDocument();
    expect(firstRegion).toHaveAttribute("fill", "#ffffff");
  });

  it("keeps the thumbnail list scrollable without clipping on short tablet screens", () => {
    render(<ColoringStudio />);
    const templateButton = screen.getByRole("button", { name: "Bông hoa 5 vùng tô" });
    const thumbnailGrid = templateButton.parentElement;
    const sidebar = thumbnailGrid?.parentElement;

    expect(sidebar?.className).toContain("overflow-hidden");
    expect(thumbnailGrid?.className).toContain("min-h-0");
    expect(thumbnailGrid?.className).toContain("flex-1");
    expect(thumbnailGrid?.className).toContain("overflow-y-auto");
    expect(thumbnailGrid?.className).toContain("content-start");
    expect(thumbnailGrid?.className).toContain("template-grid");
    expect(thumbnailGrid?.className).toContain("pb-24");
  });

  it("stretches the coloring area and color picker across the main workspace", () => {
    render(<ColoringStudio />);
    expect(screen.getByTestId("coloring-app").className).toContain("h-dvh");
    expect(screen.getByTestId("coloring-app").className).toContain("coloring-app");
    expect(screen.getByTestId("coloring-workspace").className).toContain("overflow-hidden");
    expect(screen.getByTestId("coloring-canvas-shell").className).toContain("w-full");
    expect(screen.getByTestId("coloring-canvas-shell").className).toContain("coloring-canvas-shell");
    expect(screen.getByTestId("coloring-stage").className).toContain("overflow-hidden");
    expect(screen.getByTestId("coloring-stage").className).not.toContain("aspect-square");
    expect(screen.getByTestId("coloring-artboard").className).toContain("aspect-square");
    expect(screen.getByTestId("coloring-artboard").className).toContain("max-w-full");
    expect(screen.getByTestId("coloring-artboard").className).toContain("max-h-full");
    expect(screen.getByTestId("toolbar").className).toContain("w-full");
    expect(screen.getByTestId("toolbar").className).toContain("flex-col");
    expect(screen.getByTestId("toolbar").className).toContain("coloring-toolbar");
    expect(screen.getByTestId("color-palette").className).toContain("w-full");
    expect(screen.getByTestId("color-palette").className).not.toContain("flex-1");
  });

  it("places undo reset save and parent controls as icon-only header actions", () => {
    render(<ColoringStudio />);
    const headerActions = screen.getByTestId("header-actions");
    for (const label of ["Hoàn tác", "Tô lại", "Đã lưu", "Ba mẹ"]) {
      const control = screen.getByRole(label === "Ba mẹ" ? "group" : "button", { name: label });
      expect(headerActions).toContainElement(control);
      expect(control).not.toHaveTextContent(label);
    }
    expect(screen.getByTestId("toolbar")).not.toContainElement(screen.getByRole("button", { name: "Hoàn tác" }));
    expect(screen.getByTestId("toolbar")).not.toContainElement(screen.getByRole("button", { name: "Tô lại" }));
  });

  it("colors an SVG region when tapped", async () => {
    render(<ColoringStudio />);
    const region = screen.getByTestId("region-petal_1");
    await userEvent.click(region);
    expect(region).toHaveAttribute("fill", "#ef4444");
  });
});
