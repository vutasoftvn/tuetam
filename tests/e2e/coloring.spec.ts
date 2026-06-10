import { expect, test } from "@playwright/test";

test("child can color and reset a region on tablet", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Bé Tập Tô Màu" })).toBeVisible();
  const region = page.getByTestId("region-petal_1");
  await region.click();
  await expect(region).toHaveAttribute("fill", "#ef4444");
  await page.getByRole("button", { name: "Tô lại" }).click();
  await expect(page.getByTestId("region-petal_1")).toHaveAttribute("fill", "#ffffff");
});
