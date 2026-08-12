import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLocationStore } from "@/stores/useLocationStore";
import LocationsPage from "./page";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

beforeEach(() => {
  pushMock.mockClear();
  useLocationStore.setState({
    selectedLocationId: null,
    recentLocationIds: [],
  });
});

describe("LocationsPage", () => {
  it("lists every mock location by default", () => {
    render(<LocationsPage />);
    expect(screen.getByText("Fulton Market")).toBeInTheDocument();
    expect(screen.getByText("River North")).toBeInTheDocument();
  });

  it("filters by search query across name and address", async () => {
    render(<LocationsPage />);
    await userEvent.type(
      screen.getByPlaceholderText("Search by name or street"),
      "Armitage",
    );

    expect(screen.getByText("Lincoln Park")).toBeInTheDocument();
    expect(screen.queryByText("Fulton Market")).not.toBeInTheDocument();
  });

  it("filters to drive-through locations only", async () => {
    render(<LocationsPage />);
    await userEvent.click(screen.getByLabelText("Drive-through"));

    expect(screen.getByText("Logan Square")).toBeInTheDocument();
    expect(screen.getByText("River North")).toBeInTheDocument();
    expect(screen.queryByText("Fulton Market")).not.toBeInTheDocument();
  });

  it("shows an empty state when no location matches", async () => {
    render(<LocationsPage />);
    await userEvent.type(
      screen.getByPlaceholderText("Search by name or street"),
      "nowhere",
    );

    expect(
      screen.getByText("No locations match those filters."),
    ).toBeInTheDocument();
  });

  it("selects the location and navigates to the menu on choose", async () => {
    render(<LocationsPage />);
    const [firstChooseButton] = screen.getAllByRole("button", {
      name: "Choose",
    });

    await userEvent.click(firstChooseButton!);

    expect(useLocationStore.getState().selectedLocationId).toBeTruthy();
    expect(pushMock).toHaveBeenCalledWith("/menu");
  });
});
