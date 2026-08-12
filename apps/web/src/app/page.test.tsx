import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useLocationStore } from "@/stores/useLocationStore";
import HomePage from "./page";

beforeEach(() => {
  useLocationStore.setState({
    selectedLocationId: null,
    recentLocationIds: [],
  });
});

describe("HomePage", () => {
  it("renders the hero headline and hero link to the featured product", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { name: "Your Daily Coffee" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /See it/ })).toHaveAttribute(
      "href",
      "/menu/iced-cold-brew",
    );
  });

  it("renders featured drinks pulled from the mock catalog", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("link", { name: /Iced Cold Brew/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Oat Milk Latte/ }),
    ).toBeInTheDocument();
  });

  it("renders category tiles linking to filtered menu views", () => {
    render(<HomePage />);
    expect(screen.getByRole("link", { name: /Coffee/ })).toHaveAttribute(
      "href",
      "/menu?category=coffee",
    );
  });

  it("renders a locations teaser with real mock locations", () => {
    render(<HomePage />);
    expect(screen.getAllByText("Fulton Market").length).toBeGreaterThan(0);
  });

  it("shows the location bar prompting to choose a location", () => {
    render(<HomePage />);
    expect(screen.getByText("No location selected")).toBeInTheDocument();
  });
});
