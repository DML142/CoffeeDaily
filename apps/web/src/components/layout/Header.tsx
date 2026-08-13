"use client";

import { locations } from "@coffee-daily/mocks";
import Link from "next/link";
import type { ReactNode } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { useLocationStore } from "@/stores/useLocationStore";
import { useUiStore } from "@/stores/useUiStore";

const NAV_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
];

function SweepFill({
  overlayClassName,
  children,
}: {
  overlayClassName: string;
  children: ReactNode;
}) {
  return (
    <>
      <span className="relative">{children}</span>
      <span
        aria-hidden="true"
        className={`absolute inset-0 z-10 flex items-center justify-center [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-[400ms] ease-in-out motion-reduce:transition-none group-hover:[clip-path:inset(0_0_0_0)] ${overlayClassName}`}
      >
        {children}
      </span>
    </>
  );
}

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
            className="group relative isolate hidden border border-cd-ink px-4 py-2 text-body-s text-cd-ink sm:inline-flex sm:items-center"
          >
            <SweepFill overlayClassName="bg-cd-ink text-cd-cream">
              {selectedLocation ? selectedLocation.name : "Choose location"}
            </SweepFill>
          </Link>
          <Link
            href="/cart"
            className="group relative isolate inline-flex items-center bg-cd-orange px-4 py-2 text-body-s text-cd-cream"
          >
            <SweepFill overlayClassName="bg-cd-cream text-cd-orange">
              Cart
            </SweepFill>
            {cartCount > 0 ? (
              <span
                className="absolute -right-2 -top-2 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-cd-ink text-[10px] text-cd-cream"
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
