"use client";

import { locations } from "@coffee-daily/mocks";
import Link from "next/link";
import { CartGroup } from "@/components/cart/CartGroup";
import { groupCartLinesByLocation, useCartStore } from "@/stores/useCartStore";

export default function CartPage() {
  const lines = useCartStore((state) => state.lines);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeLine = useCartStore((state) => state.removeLine);

  const groups = groupCartLinesByLocation(lines);
  const locationIds = Object.keys(groups);

  return (
    <>
      <section className="flex min-h-[calc(100vh-var(--cd-header-h))] flex-col justify-center bg-cd-paper-warm px-4 sm:px-6 lg:px-10">
        <div className="container">
          <p className="mb-6 text-label text-cd-ink-mute">[ Cart ]</p>
          <h1 className="text-display-xl text-cd-ink">Your cart</h1>
        </div>
      </section>

      <section className="bg-cd-paper px-4 pb-16 sm:px-6 lg:px-10">
        <div className="container flex flex-col gap-8">
          {locationIds.length === 0 ? (
            <p className="text-body text-cd-ink-mute">
              Your cart is empty.{" "}
              <Link href="/menu" className="underline">
                Browse the menu
              </Link>
              .
            </p>
          ) : (
            locationIds.map((locationId) => {
              const locationName =
                locations.find((location) => location.id === locationId)
                  ?.name ?? "Location";
              const groupLines = groups[locationId] ?? [];

              return (
                <CartGroup
                  key={locationId}
                  locationId={locationId}
                  locationName={locationName}
                  lines={groupLines}
                  onIncrement={(lineId) => {
                    const line = groupLines.find(
                      (candidate) => candidate.id === lineId,
                    );
                    if (line) setQuantity(lineId, line.quantity + 1);
                  }}
                  onDecrement={(lineId) => {
                    const line = groupLines.find(
                      (candidate) => candidate.id === lineId,
                    );
                    if (line) setQuantity(lineId, line.quantity - 1);
                  }}
                  onRemove={(lineId) => removeLine(lineId)}
                />
              );
            })
          )}
        </div>
      </section>
    </>
  );
}
