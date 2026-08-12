import { beforeEach, describe, expect, it } from "vitest";
import { useUiStore } from "./useUiStore";

beforeEach(() => {
  useUiStore.setState({ isMobileNavOpen: false, activeModal: null });
});

describe("useUiStore", () => {
  it("toggles mobile nav open state", () => {
    useUiStore.getState().setMobileNavOpen(true);
    expect(useUiStore.getState().isMobileNavOpen).toBe(true);
  });

  it("opens and closes a named modal", () => {
    useUiStore.getState().openModal("change-location");
    expect(useUiStore.getState().activeModal).toBe("change-location");

    useUiStore.getState().closeModal();
    expect(useUiStore.getState().activeModal).toBeNull();
  });
});
