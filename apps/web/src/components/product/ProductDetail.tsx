"use client";

import {
  categories,
  inventory,
  isDrinkProduct,
  variants,
} from "@coffee-daily/mocks";
import type { Product, Size, Vessel } from "@coffee-daily/types";
import { Badge } from "@coffee-daily/ui/Badge";
import { Button } from "@coffee-daily/ui/Button";
import { useToast } from "@coffee-daily/ui/Toast";
import { formatMoney } from "@coffee-daily/utils/money";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SizePicker } from "@/components/product/SizePicker";
import { VesselPicker } from "@/components/product/VesselPicker";
import { useCartStore } from "@/stores/useCartStore";
import { useLocationStore } from "@/stores/useLocationStore";

const VESSEL_ORDER: Vessel[] = ["glass", "plastic", "paper", "ceramic"];
const SIZE_ORDER: Size[] = ["s", "m", "l"];

export type ProductDetailProps = {
  product: Product;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const toast = useToast();
  const selectedLocationId = useLocationStore(
    (state) => state.selectedLocationId,
  );
  const addLine = useCartStore((state) => state.addLine);

  const isDrink = isDrinkProduct(product.categoryId);
  const productVariants = useMemo(
    () => variants.filter((variant) => variant.productId === product.id),
    [product.id],
  );

  const [vessel, setVessel] = useState<Vessel>(
    productVariants[0]?.vessel ?? "paper",
  );
  const [size, setSize] = useState<Size>(productVariants[0]?.size ?? "m");

  const availableVariantIds = useMemo(() => {
    if (!selectedLocationId) return null;
    const ids = new Set<string>();
    for (const item of inventory) {
      if (item.locationId === selectedLocationId && item.isAvailable) {
        ids.add(item.variantId);
      }
    }
    return ids;
  }, [selectedLocationId]);

  function isVariantAvailable(candidateVessel: Vessel, candidateSize: Size) {
    if (!availableVariantIds) return true;
    const variant = productVariants.find(
      (candidate) =>
        candidate.vessel === candidateVessel &&
        candidate.size === candidateSize,
    );
    return variant ? availableVariantIds.has(variant.id) : false;
  }

  const disabledVessels = new Set(
    VESSEL_ORDER.filter(
      (candidateVessel) =>
        !SIZE_ORDER.some((candidateSize) =>
          isVariantAvailable(candidateVessel, candidateSize),
        ),
    ),
  );
  const disabledSizes = new Set(
    SIZE_ORDER.filter(
      (candidateSize) => !isVariantAvailable(vessel, candidateSize),
    ),
  );

  const selectedVariant = productVariants.find(
    (candidate) => candidate.vessel === vessel && candidate.size === size,
  );
  const priceMinor =
    product.basePriceMinor + (selectedVariant?.priceDeltaMinor ?? 0);
  const canAddToCart =
    Boolean(selectedLocationId) && isVariantAvailable(vessel, size);

  const categoryName = categories.find(
    (category) => category.id === product.categoryId,
  )?.name;

  function handleAddToCart() {
    if (!selectedLocationId) return;
    addLine({
      productId: product.id,
      locationId: selectedLocationId,
      vessel,
      size,
      extras: [],
      unitPriceMinor: priceMinor,
    });
    toast(`${product.name} added to cart`, "success");
  }

  return (
    <section className="bg-cd-paper px-4 pb-16 sm:px-6 lg:px-10">
      <div className="container grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="aspect-square max-h-[60vh] w-full bg-cd-line lg:aspect-auto lg:max-h-none" />

        <div>
          {categoryName ? (
            <Badge tone="neutral" className="mb-4">
              {categoryName}
            </Badge>
          ) : null}
          <h1 className="mb-4 text-display-xl text-cd-ink">{product.name}</h1>
          <p className="mb-6 font-mono text-body-l text-cd-orange">
            {formatMoney(priceMinor)}
          </p>
          <p className="mb-10 text-body text-cd-ink-mute">
            {product.description}
          </p>

          {isDrink ? (
            <>
              <div className="mb-8">
                <p className="mb-3 text-label text-cd-ink-mute">Vessel</p>
                <VesselPicker
                  vessels={VESSEL_ORDER}
                  value={vessel}
                  onChange={setVessel}
                  disabledVessels={disabledVessels}
                />
              </div>

              <div className="mb-10">
                <p className="mb-3 text-label text-cd-ink-mute">Size</p>
                <SizePicker
                  sizes={SIZE_ORDER}
                  value={size}
                  onChange={setSize}
                  disabledSizes={disabledSizes}
                />
              </div>
            </>
          ) : null}

          {selectedLocationId ? (
            <Button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className="w-full sm:w-auto"
            >
              {canAddToCart ? "Add to cart" : "Out of stock at this location"}
            </Button>
          ) : (
            <p className="text-body-s text-cd-ink-mute">
              <Link href="/locations" className="underline">
                Choose a location
              </Link>{" "}
              to add this to your cart.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
