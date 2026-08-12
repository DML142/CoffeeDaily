import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "@/stores/useCartStore";
import { useLocationStore } from "@/stores/useLocationStore";
import { Header } from "./Header";

beforeEach(() => {
  useLocationStore.setState({
    selectedLocationId: null,
    recentLocationIds: [],
  });
  useCartStore.setState({ lines: [] });
});

describe("Header", () => {
  it("shows the nav links and a prompt to choose a location", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Menu" })).toHaveAttribute(
      "href",
      "/menu",
    );
    expect(
      screen.getByRole("link", { name: "Choose location" }),
    ).toBeInTheDocument();
  });

  it("shows the selected location name once one is chosen", () => {
    useLocationStore.getState().selectLocation("loc_fulton-market");
    render(<Header />);
    expect(
      screen.getByRole("link", { name: "Fulton Market" }),
    ).toBeInTheDocument();
  });

  it("shows a cart count badge only once the cart has lines", () => {
    const { rerender } = render(<Header />);
    expect(screen.queryByText("2")).not.toBeInTheDocument();

    act(() => {
      useCartStore.getState().addLine({
        productId: "prod_iced-cold-brew",
        locationId: "loc_fulton-market",
        vessel: "glass",
        size: "m",
        extras: [],
        unitPriceMinor: 450,
        quantity: 2,
      });
    });
    rerender(<Header />);

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("sweeps an inverted-color overlay over the location and cart links, skipped under reduced motion", () => {
    render(<Header />);
    const cart = screen.getByRole("link", { name: "Cart" });
    const overlay = cart.querySelector('[aria-hidden="true"]');

    expect(overlay).not.toBeNull();
    expect(overlay?.className).toContain("-translate-x-full");
    expect(overlay?.className).toContain("group-hover:translate-x-0");
    expect(overlay?.className).toContain("motion-reduce:transition-none");
    expect(overlay?.className).toContain("bg-cd-cream");
    expect(overlay?.className).toContain("text-cd-orange");
  });
});
