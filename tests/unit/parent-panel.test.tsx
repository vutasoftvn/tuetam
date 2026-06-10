import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ParentPanel } from "@/components/parent-panel";

describe("ParentPanel", () => {
  it("accepts SVG upload and reports it to caller", async () => {
    const onTemplateCreate = vi.fn();
    render(<ParentPanel onTemplateCreate={onTemplateCreate} />);
    const file = new File([`<svg><path data-region-id="a" d="M1 1 H9 V9 H1Z"/></svg>`], "flower.svg", {
      type: "image/svg+xml",
    });
    await userEvent.upload(screen.getByLabelText("Tải mẫu SVG/PNG"), file);
    expect(await screen.findByText("Đã thêm mẫu flower")).toBeInTheDocument();
    expect(onTemplateCreate).toHaveBeenCalled();
  });
});
