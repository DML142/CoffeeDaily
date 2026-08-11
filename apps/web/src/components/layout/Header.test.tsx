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
});
