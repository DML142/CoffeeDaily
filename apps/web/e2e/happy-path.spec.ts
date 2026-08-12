import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";

// GSAP ScrollSmoother intercepts native scrollIntoView, so any element that
// might sit below the fold needs a focus-then-click: SmoothScrollProvider's
// focusin handler is what actually scrolls it into view, the same path a
// keyboard user relies on.
async function focusAndClick(locator: Locator) {
  await locator.focus();
  await locator.click();
}

test("browse, choose a location, add to cart, and check out to a mock success screen", async ({
  page,
}) => {
  await page.goto("/locations");
  // Fulton Market is the first location in the mock fixtures.
  await focusAndClick(page.getByRole("button", { name: "Choose" }).first());
  await expect(page).toHaveURL("/menu");

  await focusAndClick(page.getByRole("link", { name: /Iced Cold Brew/ }));
  await expect(page).toHaveURL("/menu/iced-cold-brew");

  await focusAndClick(page.getByRole("button", { name: "M", exact: true }));
  await focusAndClick(page.getByRole("button", { name: "Add to cart" }));
  await expect(page.getByText("Iced Cold Brew added to cart")).toBeVisible();

  await focusAndClick(page.getByRole("link", { name: "Cart" }));
  await expect(page).toHaveURL("/cart");

  await focusAndClick(
    page.getByRole("link", { name: "Checkout Fulton Market" }),
  );
  await expect(page).toHaveURL("/checkout/loc_fulton-market");

  await page.getByPlaceholder("Phone number").fill("3125551234");
  await page.getByPlaceholder("Full name").fill("Jamie Rivera");
  await page.getByPlaceholder("Email").fill("jamie@example.com");
  await focusAndClick(page.getByRole("button", { name: /Pay/ }));

  await expect(page.getByText("Order confirmed")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Track this order" }),
  ).toBeVisible();
});
