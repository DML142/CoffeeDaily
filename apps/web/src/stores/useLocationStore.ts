import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const MAX_RECENT_LOCATIONS = 3;

type LocationState = {
  selectedLocationId: string | null;
  recentLocationIds: string[];
  selectLocation: (locationId: string) => void;
  clearLocation: () => void;
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      selectedLocationId: null,
      recentLocationIds: [],
      selectLocation: (locationId) => {
        const recentLocationIds = [
          locationId,
          ...get().recentLocationIds.filter((id) => id !== locationId),
        ].slice(0, MAX_RECENT_LOCATIONS);
        set({ selectedLocationId: locationId, recentLocationIds });
      },
      clearLocation: () => set({ selectedLocationId: null }),
    }),
    {
      name: "cd-location",
      version: 1,
      storage: createJSONStorage(() => window.localStorage),
    },
  ),
);
