"use client";

import { locations } from "@coffee-daily/mocks";
import Link from "next/link";
import { useLocationStore } from "@/stores/useLocationStore";

export function LocationBar() {
  const selectedLocationId = useLocationStore(
    (state) => state.selectedLocationId,
  );
  const selectedLocation = locations.find(
    (location) => location.id === selectedLocationId,
  );

  return (
    <div className="sticky top-20 z-40 border-b border-cd-line bg-cd-paper">
      <div className="container flex items-center justify-between py-5">
        <p className="text-body-s text-cd-ink-mute">
          {selectedLocation ? selectedLocation.name : "No location selected"}
        </p>
        <Link
          href="/locations"
          className="text-body-s underline transition-colors hover:text-cd-orange"
        >
          {selectedLocation ? "Change location" : "Choose a location"}
        </Link>
      </div>
    </div>
  );
}
