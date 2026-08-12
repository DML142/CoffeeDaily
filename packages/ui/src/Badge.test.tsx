import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its label", () => {
    render(<Badge>Open</Badge>);
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("applies the danger tone class", () => {
    render(<Badge tone="danger">Closed</Badge>);
    expect(screen.getByText("Closed")).toHaveClass("text-cd-danger");
  });
});
