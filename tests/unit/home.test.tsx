import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("home page", () => {
  it("shows a feature grid with a coloring card that links to the studio", () => {
    render(<HomePage />);

    const coloringCard = screen.getByRole("link", { name: "TÔ MÀU" });
    expect(coloringCard).toHaveAttribute("href", "/to-mau");
    expect(coloringCard.querySelector("svg")).toBeInTheDocument();
    expect(screen.queryByTestId("coloring-canvas-shell")).not.toBeInTheDocument();
  });

  it("centers the playful home title with larger colorful styling", () => {
    render(<HomePage />);

    const heading = screen.getByRole("heading", { name: "Bé Học Vui" });
    expect(heading.className).toContain("text-center");
    expect(heading.className).toContain("text-6xl");
    expect(heading.className).toContain("text-[#e83e7b]");
  });
});
