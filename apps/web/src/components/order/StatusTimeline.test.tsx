import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusTimeline } from "./StatusTimeline";

describe("StatusTimeline", () => {
  it("renders every happy-path step", () => {
    render(<StatusTimeline status="preparing" />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByText("Accepted")).toBeInTheDocument();
    expect(screen.getByText("Preparing")).toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("highlights the current step", () => {
    render(<StatusTimeline status="preparing" />);
    expect(screen.getByText("Preparing")).toHaveClass("text-cd-orange");
  });
});
