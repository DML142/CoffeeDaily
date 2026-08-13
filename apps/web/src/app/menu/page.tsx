"use client";

import { categories, inventory, products, variants } from "@coffee-daily/mocks";
import { Checkbox } from "@coffee-daily/ui/Checkbox";
import { Select } from "@coffee-daily/ui/Select";
import type { DietaryTag, Product } from "@coffee-daily/types";
import { gsap } from "gsap";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/components/menu/ProductCard";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLocationStore } from "@/stores/useLocationStore";
import {
  type MenuSort,
  type PriceRange,
  useFilterStore,
} from "@/stores/useFilterStore";

const GRID_EXIT_DURATION = 0.2;
const GRID_ENTER_DURATION = 0.4;
const GRID_SCALE_FROM = 0.94;
const GRID_BLUR_PX = 10;
const GRID_STAGGER = 0.03;

const DIETARY_OPTIONS: { value: DietaryTag; label: string }[] = [
  { value: "vegan", label: "Vegan" },
  { value: "dairy-free", label: "Dairy-free" },
  { value: "gluten-free", label: "Gluten-free" },
  { value: "decaf", label: "Decaf" },
];

const PRICE_RANGES: { value: PriceRange; label: string }[] = [
  { value: "0-5", label: "$0 – $5" },
  { value: "5-10", label: "$5 – $10" },
  { value: "10+", label: "$10+" },
];

const SORT_OPTIONS: { value: MenuSort; label: string }[] = [
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "price-asc", label: "Price low to high" },
  { value: "price-desc", label: "Price high to low" },
  { value: "popularity", label: "Popularity" },
];

function matchesPriceRange(basePriceMinor: number, range: PriceRange | null) {
  if (!range) return true;
  const dollars = basePriceMinor / 100;
  if (range === "0-5") return dollars < 5;
  if (range === "5-10") return dollars >= 5 && dollars <= 10;
  return dollars > 10;
}

export default function MenuPage() {
  return (
    <Suspense fallback={null}>
      <MenuPageContent />
    </Suspense>
  );
}

function MenuPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedLocationId = useLocationStore(
    (state) => state.selectedLocationId,
  );
  const filters = useFilterStore();

  useEffect(() => {
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") as MenuSort | null;
    const price = searchParams.get("price") as PriceRange | null;
    const dietary = searchParams.get("dietary");

    useFilterStore.setState({
      category: category ?? null,
      sort: sort ?? "name-asc",
      priceRange: price ?? null,
      dietaryTags: dietary ? (dietary.split(",") as DietaryTag[]) : [],
    });
  }, [searchParams]);

  function syncUrl() {
    const state = useFilterStore.getState();
    const params = new URLSearchParams();
    if (state.category) params.set("category", state.category);
    if (state.sort !== "name-asc") params.set("sort", state.sort);
    if (state.priceRange) params.set("price", state.priceRange);
    if (state.dietaryTags.length > 0)
      params.set("dietary", state.dietaryTags.join(","));

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  const availabilityByProductId = useMemo(() => {
    if (!selectedLocationId) return null;

    const productIdByVariantId = new Map(
      variants.map((variant) => [variant.id, variant.productId]),
    );
    const available = new Set<string>();
    for (const item of inventory) {
      if (item.locationId === selectedLocationId && item.isAvailable) {
        const productId = productIdByVariantId.get(item.variantId);
        if (productId) available.add(productId);
      }
    }
    return available;
  }, [selectedLocationId]);

  const visibleProducts = useMemo(() => {
    let list = products.filter((product) => {
      const matchesCategory =
        !filters.category ||
        categories.find((category) => category.slug === filters.category)
          ?.id === product.categoryId;
      const matchesPrice = matchesPriceRange(
        product.basePriceMinor,
        filters.priceRange,
      );
      const matchesDietary = filters.dietaryTags.every((tag) =>
        product.dietaryTags.includes(tag),
      );

      return matchesCategory && matchesPrice && matchesDietary;
    });

    list = [...list].sort((a, b) => {
      if (filters.sort === "name-asc") return a.name.localeCompare(b.name);
      if (filters.sort === "name-desc") return b.name.localeCompare(a.name);
      if (filters.sort === "price-asc")
        return a.basePriceMinor - b.basePriceMinor;
      if (filters.sort === "price-desc")
        return b.basePriceMinor - a.basePriceMinor;
      return 0;
    });

    return list;
  }, [filters.category, filters.priceRange, filters.dietaryTags, filters.sort]);

  const visibleProductsKey = visibleProducts
    .map((product) => product.id)
    .join(",");

  const [displayedProducts, setDisplayedProducts] =
    useState<Product[]>(visibleProducts);
  const gridRef = useRef<HTMLDivElement>(null);
  const previousKeyRef = useRef(visibleProductsKey);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (previousKeyRef.current === visibleProductsKey) return;
    previousKeyRef.current = visibleProductsKey;

    const grid = gridRef.current;
    if (reducedMotion || !grid || grid.children.length === 0) {
      setDisplayedProducts(visibleProducts);
      return;
    }

    gsap.to(Array.from(grid.children), {
      opacity: 0,
      scale: GRID_SCALE_FROM,
      filter: `blur(${GRID_BLUR_PX}px)`,
      duration: GRID_EXIT_DURATION,
      ease: "power2.inOut",
      stagger: GRID_STAGGER,
      onComplete: () => setDisplayedProducts(visibleProducts),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleProductsKey, reducedMotion]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || reducedMotion) return;

    gsap.fromTo(
      Array.from(grid.children),
      { opacity: 0, scale: GRID_SCALE_FROM, filter: `blur(${GRID_BLUR_PX}px)` },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: GRID_ENTER_DURATION,
        ease: "power3.out",
        stagger: GRID_STAGGER,
        onComplete: () =>
          gsap.set(grid.children, { clearProps: "opacity,filter,transform" }),
      },
    );
  }, [displayedProducts, reducedMotion]);

  return (
    <>
      {!selectedLocationId ? (
        <div className="sticky top-20 z-40 border-b border-cd-line bg-cd-paper">
          <div className="container flex items-center justify-between py-5">
            <p className="text-body-s text-cd-ink-mute">
              No location selected — stock unknown
            </p>
          </div>
        </div>
      ) : null}

      <section className="bg-cd-paper-warm px-4 py-16 sm:px-6 lg:px-10">
        <div className="container">
          <p className="mb-6 text-label text-cd-ink-mute">[ Menu ]</p>
          <h1 className="mb-6 max-w-3xl text-display-xl text-cd-ink">
            Coffee, tea, food, beans, merch
          </h1>
          <p className="max-w-2xl text-body-l text-cd-ink-mute">
            Pick a location to see what&apos;s in stock. Everything shows for
            now.
          </p>
        </div>
      </section>

      <section className="bg-cd-paper px-4 py-8 sm:px-6 lg:px-10">
        <div className="container">
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                useFilterStore.getState().setCategory(null);
                syncUrl();
              }}
              className={`px-4 py-2 text-label transition-colors duration-200 ${
                filters.category === null
                  ? "bg-cd-ink text-cd-cream"
                  : "border border-cd-line hover:border-cd-ink hover:bg-cd-ink hover:text-cd-cream"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  useFilterStore.getState().setCategory(category.slug);
                  syncUrl();
                }}
                className={`px-4 py-2 text-label transition-colors duration-200 ${
                  filters.category === category.slug
                    ? "bg-cd-ink text-cd-cream"
                    : "border border-cd-line hover:border-cd-ink hover:bg-cd-ink hover:text-cd-cream"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="menu-sort" className="w-full max-w-[200px]">
                <span className="sr-only">Sort by</span>
                <Select
                  id="menu-sort"
                  value={filters.sort}
                  onValueChange={(value) => {
                    useFilterStore.getState().setSort(value as MenuSort);
                    syncUrl();
                  }}
                  options={SORT_OPTIONS}
                />
              </label>

              <label
                htmlFor="menu-price-range"
                className="w-full max-w-[200px]"
              >
                <span className="sr-only">Price range</span>
                <Select
                  id="menu-price-range"
                  value={filters.priceRange ?? "any"}
                  onValueChange={(value) => {
                    useFilterStore
                      .getState()
                      .setPriceRange(
                        value === "any" ? null : (value as PriceRange),
                      );
                    syncUrl();
                  }}
                  options={[
                    { value: "any", label: "Any price" },
                    ...PRICE_RANGES,
                  ]}
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {DIETARY_OPTIONS.map((option) => (
                <Checkbox
                  key={option.value}
                  label={option.label}
                  className="border border-cd-line px-3 py-2"
                  checked={filters.dietaryTags.includes(option.value)}
                  onChange={() => {
                    useFilterStore.getState().toggleDietaryTag(option.value);
                    syncUrl();
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cd-paper px-4 pb-16 sm:px-6 lg:px-10">
        <div className="container">
          {displayedProducts.length === 0 ? (
            <p className="text-body text-cd-ink-mute">
              No items match those filters.
            </p>
          ) : (
            <div
              ref={gridRef}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {displayedProducts.map((product) => {
                const categoryName =
                  categories.find(
                    (category) => category.id === product.categoryId,
                  )?.name ?? "";
                const isAvailable =
                  !selectedLocationId ||
                  (availabilityByProductId?.has(product.id) ?? false);

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categoryName={categoryName}
                    isAvailable={isAvailable}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
