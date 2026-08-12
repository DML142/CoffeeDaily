import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "@/test-utils/mockMatchMedia";
import { useFilterStore } from "@/stores/useFilterStore";
import { useLocationStore } from "@/stores/useLocationStore";
import MenuPage from "./page";

const replaceMock = vi.fn();
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => "/menu",
  useSearchParams: () => searchParams,
}));

const { gsapTo, gsapFromTo } = vi.hoisted(() => {
  const gsapTo = vi.fn(
    (_targets: unknown, vars: { onComplete?: () => void }) => {
      vars.onComplete?.();
      return {};
    },
  );
  const gsapFromTo = vi.fn(() => ({}));
  return { gsapTo, gsapFromTo };
});

vi.mock("gsap", () => ({
  gsap: { to: gsapTo, fromTo: gsapFromTo, set: vi.fn() },
}));

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

beforeEach(() => {
  replaceMock.mockClear();
  gsapTo.mockClear();
  gsapFromTo.mockClear();
  searchParams = new URLSearchParams();
  useLocationStore.setState({
    selectedLocationId: null,
    recentLocationIds: [],
  });
  useFilterStore.getState().reset();
});

describe("MenuPage", () => {
  it("shows the no-location banner and every product when nothing is filtered", () => {
    render(<MenuPage />);
    expect(
      screen.getByText("No location selected — stock unknown"),
    ).toBeInTheDocument();
    expect(screen.getByText("Iced Cold Brew")).toBeInTheDocument();
    expect(screen.getByText("Ceramic Mug")).toBeInTheDocument();
  });

  it("filters by category tab and updates the URL", async () => {
    render(<MenuPage />);
    await userEvent.click(screen.getByRole("button", { name: "Beans" }));

    expect(screen.getByText("House Blend, 12oz")).toBeInTheDocument();
    expect(screen.queryByText("Iced Cold Brew")).not.toBeInTheDocument();
    expect(replaceMock).toHaveBeenLastCalledWith("/menu?category=beans", {
      scroll: false,
    });
  });

  it("filters by dietary tag", async () => {
    render(<MenuPage />);
    await userEvent.click(screen.getByLabelText("Vegan"));

    expect(screen.getByText("Oat Milk Latte")).toBeInTheDocument();
    expect(screen.getByText("Avocado Toast")).toBeInTheDocument();
    expect(screen.queryByText("Iced Cold Brew")).not.toBeInTheDocument();
  });

  it("sorts by price ascending", async () => {
    render(<MenuPage />);
    await userEvent.click(screen.getByLabelText("Sort by"));
    await userEvent.click(
      screen.getByRole("option", { name: "Price low to high" }),
    );

    const names = screen
      .getAllByText(/./, { selector: "p.text-display-m" })
      .map((node) => node.textContent);
    expect(names[0]).toBe("Blueberry Muffin");
  });

  it("dims and disables out-of-stock items once a location is selected", () => {
    useLocationStore.setState({
      selectedLocationId: "loc_fulton-market",
      recentLocationIds: [],
    });
    render(<MenuPage />);

    expect(
      screen.queryByText("No location selected — stock unknown"),
    ).not.toBeInTheDocument();
    const outOfStock = screen.queryAllByText("Out of stock at this location");
    expect(outOfStock.length).toBeGreaterThan(0);
  });

  it("reads initial filters from the URL on mount", () => {
    searchParams = new URLSearchParams("category=tea");
    render(<MenuPage />);

    expect(screen.getByText("Matcha Latte")).toBeInTheDocument();
    expect(screen.queryByText("Iced Cold Brew")).not.toBeInTheDocument();
  });

  it("blurs the grid out before swapping to the new filtered set, unless reduced motion is on", async () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    render(<MenuPage />);

    await userEvent.click(screen.getByRole("button", { name: "Beans" }));

    expect(gsapTo).toHaveBeenCalledTimes(1);
    const [, vars] = gsapTo.mock.calls[0] as unknown as [
      unknown,
      Record<string, unknown>,
    ];
    expect(vars.filter).toBe("blur(10px)");
    expect(vars.scale).toBe(0.94);
    expect(typeof vars.onComplete).toBe("function");
    expect(screen.getByText("House Blend, 12oz")).toBeInTheDocument();
  });
});
