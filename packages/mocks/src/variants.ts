import type { Size, Variant, Vessel } from "@coffee-daily/types";
import { products } from "./products";

const DRINK_CATEGORY_IDS = new Set(["cat_coffee", "cat_tea"]);

const VESSELS: Vessel[] = ["glass", "plastic", "paper", "ceramic"];
const SIZES: Size[] = ["s", "m", "l"];

const SIZE_DELTA_MINOR: Record<Size, number> = { s: 0, m: 75, l: 150 };
const VESSEL_DELTA_MINOR: Record<Vessel, number> = {
  glass: 0,
  plastic: 0,
  paper: 0,
  ceramic: 0,
};

function buildDrinkVariants(productId: string): Variant[] {
  return VESSELS.flatMap((vessel) =>
    SIZES.map((size) => ({
      id: `var_${productId}_${vessel}_${size}`,
      productId,
      vessel,
      size,
      priceDeltaMinor: VESSEL_DELTA_MINOR[vessel] + SIZE_DELTA_MINOR[size],
      sku: `${productId}-${vessel}-${size}`.toUpperCase(),
    })),
  );
}

function buildSingleVariant(productId: string): Variant[] {
  return [
    {
      id: `var_${productId}_default`,
      productId,
      vessel: "paper",
      size: "m",
      priceDeltaMinor: 0,
      sku: `${productId}-DEFAULT`.toUpperCase(),
    },
  ];
}

export const variants: Variant[] = products.flatMap((product) =>
  DRINK_CATEGORY_IDS.has(product.categoryId)
    ? buildDrinkVariants(product.id)
    : buildSingleVariant(product.id),
);

export function isDrinkProduct(categoryId: string) {
  return DRINK_CATEGORY_IDS.has(categoryId);
}
