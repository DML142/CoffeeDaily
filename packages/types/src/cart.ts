import type { Size, Vessel } from "./variant";

export type CartLine = {
  id: string;
  productId: string;
  locationId: string;
  vessel: Vessel;
  size: Size;
  extras: Array<{ id: string; value: string }>;
  quantity: number;
  unitPriceMinor: number;
};
