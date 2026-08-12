import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useLocationStore } from "@/stores/useLocationStore";
import { LocationBar } from "./LocationBar";

beforeEach(() => {
  useLocationStore.setState({
    selectedLocationId: null,
    recentLocationIds: [],
  });
});

describe("LocationBar", () => {
  it("prompts to choose a location when none is selected", () => {
    render(<LocationBar />);
    expect(screen.getByText("No location selected")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Choose a location" }),
    ).toBeInTheDocument();
  });

  it("shows the selected location and a change link", () => {
    useLocationStore.getState().selectLocation("loc_wicker-park");
    render(<LocationBar />);

    expect(screen.getByText("Wicker Park")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Change location" }),
    ).toBeInTheDocument();
  });
});
