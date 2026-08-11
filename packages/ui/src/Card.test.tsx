import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders its children", () => {
    render(<Card>Fulton Market</Card>);
    expect(screen.getByText("Fulton Market")).toBeInTheDocument();
  });

  it("applies the ink tone class", () => {
    render(<Card tone="ink">Dark card</Card>);
    expect(screen.getByText("Dark card")).toHaveClass("bg-cd-ink");
  });
});
