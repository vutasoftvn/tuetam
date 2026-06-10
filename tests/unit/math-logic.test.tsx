import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MathLogicPage from "@/app/toan-logic/page";

const speakMock = vi.fn();
const cancelMock = vi.fn();

beforeEach(() => {
  speakMock.mockClear();
  cancelMock.mockClear();
  Object.defineProperty(window, "speechSynthesis", {
    configurable: true,
    value: {
      cancel: cancelMock,
      speak: speakMock,
    },
  });
  Object.defineProperty(window, "SpeechSynthesisUtterance", {
    configurable: true,
    value: vi.fn(function SpeechSynthesisUtterance(this: SpeechSynthesisUtterance, text: string) {
      this.text = text;
    }),
  });
});

describe("math logic page", () => {
  it("organizes preschool math activities by topic instead of age group", () => {
    render(<MathLogicPage />);

    expect(screen.getByRole("heading", { name: "Làm Quen Với Toán" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "3-4 tuổi" })).not.toBeInTheDocument();
    const topicNav = screen.getByRole("navigation", { name: "Chủ đề toán" });
    expect(within(topicNav).getByRole("button", { name: "Đọc số" })).toBeInTheDocument();
    expect(within(topicNav).getByRole("button", { name: "Hình dạng" })).toHaveStyle({ color: "#17834e" });
    expect(within(topicNav).getByRole("button", { name: "So sánh" })).toHaveStyle({ color: "#0f6b8f" });
    expect(within(topicNav).getByRole("button", { name: "Quy luật" })).toHaveStyle({ color: "#9f5f00" });
    expect(within(topicNav).getByRole("button", { name: "Vị trí" })).toHaveStyle({ color: "#7c3aed" });
    expect(within(topicNav).queryByText("Nhìn số, nghe số, gắn với đồ vật thật.")).not.toBeInTheDocument();
    expect(within(topicNav).queryByText("Tròn, vuông, tam giác, chữ nhật.")).not.toBeInTheDocument();
    expect(screen.getByText("Học cùng bé")).toBeInTheDocument();
    expect(screen.getByText("Số 1")).toBeInTheDocument();
    expect(screen.getByText("Số 10")).toBeInTheDocument();
    expect(screen.queryByText("1 quả táo")).not.toBeInTheDocument();
    expect(screen.queryByText("2 quả cam")).not.toBeInTheDocument();
    expect(screen.queryByText("2 quả táo")).not.toBeInTheDocument();
    expect(screen.queryByText("10 quả thanh long")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1 quả táo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2 quả cam" })).toBeInTheDocument();
    expect(screen.getAllByRole("img", { name: "táo" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("img", { name: "cam" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("img", { name: "thanh long" }).length).toBeGreaterThan(0);
    expect(document.querySelector("img")).not.toBeInTheDocument();
    expect(screen.getByText("Bài tập")).toBeInTheDocument();
  });

  it("switches topics and only shows selection questions in the exercise area", async () => {
    render(<MathLogicPage />);

    await userEvent.click(screen.getByRole("button", { name: "Hình dạng" }));
    expect(screen.getByText("Hình tròn")).toBeInTheDocument();
    expect(screen.getByText("Hình vuông")).toBeInTheDocument();
    expect(screen.getByText("Chọn hình tròn màu đỏ.")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Tròn đỏ" }));
    expect(screen.getByText("Đúng rồi!")).toBeInTheDocument();
  });

  it("speaks the selected lesson and exercise when a sound icon is clicked", async () => {
    render(<MathLogicPage />);

    await userEvent.click(screen.getByRole("button", { name: "Nghe bài học: Số 1" }));

    expect(cancelMock).toHaveBeenCalledTimes(1);
    expect(speakMock).toHaveBeenCalledTimes(1);
    expect(speakMock.mock.calls[0][0]).toMatchObject({
      lang: "vi-VN",
      rate: 0.9,
      text: expect.stringContaining("Số một. Một quả táo."),
    });

    await userEvent.click(screen.getByRole("button", { name: "Nghe bài học: Số 2" }));
    expect(speakMock.mock.calls[1][0]).toMatchObject({
      lang: "vi-VN",
      rate: 0.9,
      text: expect.stringContaining("Số hai. Hai quả cam."),
    });

    await userEvent.click(screen.getByRole("button", { name: "Nghe bài học: Số 10" }));
    expect(speakMock.mock.calls[2][0]).toMatchObject({
      lang: "vi-VN",
      rate: 0.9,
      text: expect.stringContaining("Số mười. Mười quả thanh long."),
    });

    await userEvent.click(screen.getByRole("button", { name: "Nghe bài tập: Đếm quả táo" }));
    expect(cancelMock).toHaveBeenCalledTimes(4);
    expect(speakMock).toHaveBeenCalledTimes(4);
    expect(speakMock.mock.calls[3][0]).toMatchObject({
      lang: "vi-VN",
      rate: 0.9,
      text: expect.stringContaining("Con hãy chọn nhóm có một quả táo."),
    });
  });
});
