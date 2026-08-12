import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { useLocationStore } from "@/stores/useLocationStore";
import { useUiStore } from "@/stores/useUiStore";
import { MobileNav } from "./MobileNav";

beforeEach(() => {
  useUiStore.setState({ isMobileNavOpen: false, activeModal: null });
  useLocationStore.setState({
    selectedLocationId: null,
    recentLocationIds: [],
  });
});

describe("MobileNav", () => {
  it("is not in the document while closed", () => {
    render(<MobileNav />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows nav links while open and closes itself when a link is activated", async () => {
    useUiStore.getState().setMobileNavOpen(true);
    render(<MobileNav />);

    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
    const menuLink = screen.getByRole("link", { name: "Menu" });

    await userEvent.click(menuLink);
    expect(useUiStore.getState().isMobileNavOpen).toBe(false);
  });
});
