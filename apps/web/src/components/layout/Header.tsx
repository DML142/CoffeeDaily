"use client";

import { locations } from "@coffee-daily/mocks";
import Link from "next/link";
import { useCartStore } from "@/stores/useCartStore";
import { useLocationStore } from "@/stores/useLocationStore";
import { useUiStore } from "@/stores/useUiStore";

const NAV_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
];

export function Header() {
  const selectedLocationId = useLocationStore(
    (state) => state.selectedLocationId,
  );
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const cartCount = useCartStore((state) =>
    state.lines.reduce((sum, line) => sum + line.quantity, 0),
  );

  const selectedLocation = locations.find(
    (location) => location.id === selectedLocationId,
  );

  return (
    <header
      id="top"
      className="sticky top-0 z-50 border-b border-cd-line bg-cd-paper-warm"
    >
      <div className="container grid h-20 grid-cols-3 items-center">
        <Link href="/" className="text-display-m justify-self-start">
          Coffee Daily
        </Link>

        <nav className="hidden items-center gap-8 justify-self-center md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-body hover:text-cd-orange"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-3">
          <Link
            href="/locations"
            className="hidden border border-cd-ink px-4 py-2 text-body-s sm:inline-block"
          >
            {selectedLocation ? selectedLocation.name : "Choose location"}
          </Link>
          <Link
            href="/cart"
            className="relative bg-cd-orange px-4 py-2 text-body-s text-cd-cream"
          >
            Cart
            {cartCount > 0 ? (
              <span
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-cd-ink text-[10px] text-cd-cream"
                aria-hidden="true"
              >
                {cartCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="text-body-s md:hidden"
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}
