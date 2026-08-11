import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutPage from "./page";

describe("AboutPage", () => {
  it("renders the hero heading", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("heading", {
        name: "Built around the roast, not the brand",
      }),
    ).toBeInTheDocument();
  });

  it("renders every story section", () => {
    render(<AboutPage />);
    expect(
      screen.getByText("A shop before it was a chain"),
    ).toBeInTheDocument();
    expect(screen.getByText("Direct trade, named farms")).toBeInTheDocument();
    expect(screen.getByText("Small batches, every week")).toBeInTheDocument();
    expect(
      screen.getByText("Baristas first, everything else second"),
    ).toBeInTheDocument();
  });

  it("links to the locations page", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("link", { name: "See all locations" }),
    ).toHaveAttribute("href", "/locations");
  });
});
