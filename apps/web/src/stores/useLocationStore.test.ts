import { beforeEach, describe, expect, it } from "vitest";
import { useLocationStore } from "./useLocationStore";

beforeEach(() => {
  useLocationStore.setState({
    selectedLocationId: null,
    recentLocationIds: [],
  });
});

describe("useLocationStore", () => {
  it("selects a location", () => {
    useLocationStore.getState().selectLocation("loc_fulton-market");
    expect(useLocationStore.getState().selectedLocationId).toBe(
      "loc_fulton-market",
    );
  });

  it("tracks recent locations, most recent first, deduped", () => {
    const { selectLocation } = useLocationStore.getState();
    selectLocation("loc_fulton-market");
    selectLocation("loc_wicker-park");
    selectLocation("loc_fulton-market");

    expect(useLocationStore.getState().recentLocationIds).toEqual([
      "loc_fulton-market",
      "loc_wicker-park",
    ]);
  });

  it("caps recent locations at 3", () => {
    const { selectLocation } = useLocationStore.getState();
    selectLocation("a");
    selectLocation("b");
    selectLocation("c");
    selectLocation("d");

    expect(useLocationStore.getState().recentLocationIds).toEqual([
      "d",
      "c",
      "b",
    ]);
  });

  it("clears the selected location without touching recents", () => {
    useLocationStore.getState().selectLocation("loc_fulton-market");
    useLocationStore.getState().clearLocation();

    expect(useLocationStore.getState().selectedLocationId).toBeNull();
    expect(useLocationStore.getState().recentLocationIds).toEqual([
      "loc_fulton-market",
    ]);
  });
});
