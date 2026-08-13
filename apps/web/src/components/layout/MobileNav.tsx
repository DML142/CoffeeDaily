"use client";

import { Drawer } from "@coffee-daily/ui/Drawer";
import { locations } from "@coffee-daily/mocks";
import Link from "next/link";
import { useLocationStore } from "@/stores/useLocationStore";
import { useUiStore } from "@/stores/useUiStore";

const LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
];

export function MobileNav() {
  const isOpen = useUiStore((state) => state.isMobileNavOpen);
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const selectedLocationId = useLocationStore(
    (state) => state.selectedLocationId,
  );

  const selectedLocation = locations.find(
    (location) => location.id === selectedLocationId,
  );

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setMobileNavOpen}
      title="Menu"
      side="right"
    >
      <nav className="flex flex-col gap-4">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-body-l transition-colors hover:text-cd-orange"
            onClick={() => setMobileNavOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/locations"
          className="mt-4 border border-cd-ink px-4 py-2 text-center text-body-s transition-colors hover:bg-cd-ink hover:text-cd-cream"
          onClick={() => setMobileNavOpen(false)}
        >
          {selectedLocation ? selectedLocation.name : "Choose location"}
        </Link>
      </nav>
    </Drawer>
  );
}
