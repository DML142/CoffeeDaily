import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "@/stores/useCartStore";
import CartPage from "./page";

const baseLine = {
  productId: "prod_iced-cold-brew",
  vessel: "glass" as const,
  size: "m" as const,
  extras: [],
  unitPriceMinor: 450,
};

beforeEach(() => {
  useCartStore.setState({ lines: [] });
});

describe("CartPage", () => {
  it("shows an empty state linking to the menu when the cart has no lines", () => {
    render(<CartPage />);
    expect(screen.getByText(/Your cart is empty/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Browse the menu" }),
    ).toHaveAttribute("href", "/menu");
  });

  it("groups lines by location, each with its own checkout link", () => {
    useCartStore
      .getState()
      .addLine({ ...baseLine, locationId: "loc_fulton-market" });
    useCartStore
      .getState()
      .addLine({ ...baseLine, locationId: "loc_wicker-park" });
    render(<CartPage />);

    expect(screen.getByText("Fulton Market")).toBeInTheDocument();
    expect(screen.getByText("Wicker Park")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Checkout Fulton Market" }),
    ).toHaveAttribute("href", "/checkout/loc_fulton-market");
  });

  it("increments and decrements quantity", async () => {
    useCartStore
      .getState()
      .addLine({ ...baseLine, locationId: "loc_fulton-market" });
    render(<CartPage />);

    await userEvent.click(
      screen.getByRole("button", { name: "Increase quantity" }),
    );
    expect(useCartStore.getState().lines[0]?.quantity).toBe(2);

    await userEvent.click(
      screen.getByRole("button", { name: "Decrease quantity" }),
    );
    expect(useCartStore.getState().lines[0]?.quantity).toBe(1);
  });

  it("removes a line entirely, leaving the empty state when it was the last one", async () => {
    useCartStore
      .getState()
      .addLine({ ...baseLine, locationId: "loc_fulton-market" });
    render(<CartPage />);

    await userEvent.click(screen.getByRole("button", { name: "Remove item" }));
    expect(screen.getByText(/Your cart is empty/)).toBeInTheDocument();
  });

  it("decrementing to zero removes the line", async () => {
    useCartStore
      .getState()
      .addLine({ ...baseLine, locationId: "loc_fulton-market", quantity: 1 });
    render(<CartPage />);

    await userEvent.click(
      screen.getByRole("button", { name: "Decrease quantity" }),
    );
    expect(useCartStore.getState().lines).toHaveLength(0);
  });
});
