import { expect, test } from "@playwright/test";

test("browse, choose a location, add to cart, and check out to a mock success screen", async ({
  page,
}) => {
  await page.goto("/locations");
  await page.getByRole("button", { name: "Choose" }).first().click();
  await expect(page).toHaveURL("/menu");

  await page.getByRole("link", { name: /Iced Cold Brew/ }).click();
  await expect(page).toHaveURL("/menu/iced-cold-brew");

  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByText("Iced Cold Brew added to cart")).toBeVisible();

  await page.getByRole("link", { name: "Cart" }).click();
  await expect(page).toHaveURL("/cart");

  await page.getByRole("link", { name: "Checkout Fulton Market" }).click();
  await expect(page).toHaveURL("/checkout/loc_fulton-market");

  await page.getByPlaceholder("Phone number").fill("3125551234");
  await page.getByPlaceholder("Full name").fill("Jamie Rivera");
  await page.getByPlaceholder("Email").fill("jamie@example.com");
  await page.getByRole("button", { name: /Pay/ }).click();

  await expect(page.getByText("Order confirmed")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Track this order" }),
  ).toBeVisible();
});
