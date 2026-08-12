import type { Inventory } from "@coffee-daily/types";
import { locations } from "./locations";
import { variants } from "./variants";

const UPDATED_AT = "2026-08-11T00:00:00.000Z";

export const inventory: Inventory[] = locations.flatMap(
  (location, locationIndex) =>
    variants.map((variant, variantIndex) => ({
      locationId: location.id,
      variantId: variant.id,
      isAvailable: (locationIndex + variantIndex) % 7 !== 0,
      updatedAt: UPDATED_AT,
    })),
);
