export type Vessel = "glass" | "plastic" | "paper" | "ceramic";
export type Size = "s" | "m" | "l";

export type Variant = {
  id: string;
  productId: string;
  vessel: Vessel;
  size: Size;
  priceDeltaMinor: number;
  sku: string;
};
