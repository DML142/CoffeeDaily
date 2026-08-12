import type { DietaryTag } from "@coffee-daily/types";
import { create } from "zustand";

export type MenuSort =
  "name-asc" | "name-desc" | "price-asc" | "price-desc" | "popularity";
export type PriceRange = "0-5" | "5-10" | "10+";

type FilterState = {
  category: string | null;
  sort: MenuSort;
  priceRange: PriceRange | null;
  dietaryTags: DietaryTag[];
  setCategory: (category: string | null) => void;
  setSort: (sort: MenuSort) => void;
  setPriceRange: (range: PriceRange | null) => void;
  toggleDietaryTag: (tag: DietaryTag) => void;
  reset: () => void;
};

const DEFAULT_FILTERS = {
  category: null,
  sort: "name-asc" as MenuSort,
  priceRange: null,
  dietaryTags: [] as DietaryTag[],
};

export const useFilterStore = create<FilterState>((set) => ({
  ...DEFAULT_FILTERS,
  setCategory: (category) => set({ category }),
  setSort: (sort) => set({ sort }),
  setPriceRange: (priceRange) => set({ priceRange }),
  toggleDietaryTag: (tag) =>
    set((state) => ({
      dietaryTags: state.dietaryTags.includes(tag)
        ? state.dietaryTags.filter((t) => t !== tag)
        : [...state.dietaryTags, tag],
    })),
  reset: () => set(DEFAULT_FILTERS),
}));
