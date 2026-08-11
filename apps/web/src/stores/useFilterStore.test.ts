import { beforeEach, describe, expect, it } from "vitest";
import { useFilterStore } from "./useFilterStore";

beforeEach(() => {
  useFilterStore.getState().reset();
});

describe("useFilterStore", () => {
  it("defaults to name-asc sort and no filters", () => {
    const state = useFilterStore.getState();
    expect(state.sort).toBe("name-asc");
    expect(state.category).toBeNull();
    expect(state.dietaryTags).toEqual([]);
  });

  it("sets category, sort, and price range", () => {
    const { setCategory, setSort, setPriceRange } = useFilterStore.getState();
    setCategory("coffee");
    setSort("price-asc");
    setPriceRange("5-10");

    const state = useFilterStore.getState();
    expect(state.category).toBe("coffee");
    expect(state.sort).toBe("price-asc");
    expect(state.priceRange).toBe("5-10");
  });

  it("toggles dietary tags on and off", () => {
    const { toggleDietaryTag } = useFilterStore.getState();
    toggleDietaryTag("vegan");
    expect(useFilterStore.getState().dietaryTags).toEqual(["vegan"]);

    toggleDietaryTag("vegan");
    expect(useFilterStore.getState().dietaryTags).toEqual([]);
  });

  it("resets every field back to defaults", () => {
    const { setCategory, toggleDietaryTag, reset } = useFilterStore.getState();
    setCategory("tea");
    toggleDietaryTag("decaf");

    reset();

    const state = useFilterStore.getState();
    expect(state.category).toBeNull();
    expect(state.dietaryTags).toEqual([]);
  });
});
