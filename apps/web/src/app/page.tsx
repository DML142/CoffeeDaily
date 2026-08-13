import { locations, products } from "@coffee-daily/mocks";
import Link from "next/link";
import { HeroCup } from "@/components/landing/HeroCup";
import { LocationBar } from "@/components/layout/LocationBar";
import { Reveal } from "@/motion/Reveal";

const FEATURED_SLUGS = [
  "iced-cold-brew",
  "oat-milk-latte",
  "matcha-latte",
  "butter-croissant",
];

const CATEGORY_TILES = [
  { slug: "coffee", label: "Coffee" },
  { slug: "food", label: "Food" },
  { slug: "beans", label: "Beans" },
  { slug: "merch", label: "Merch" },
];

const featuredProducts = FEATURED_SLUGS.map((slug) =>
  products.find((product) => product.slug === slug),
).filter((product) => product !== undefined);

const teaserLocations = locations.slice(0, 3);

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[calc(100vh-var(--cd-header-h))] overflow-visible bg-cd-paper-warm">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[60%] h-[min(600px,90vw)] w-[min(600px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cd-orange-hot opacity-[0.15] blur-[120px]"
        />

        <div className="grid min-h-[calc(100vh-var(--cd-header-h))] grid-rows-[1fr] justify-items-center pt-24 sm:pt-32">
          <h1 className="col-start-1 row-start-1 self-start px-4 text-center text-display-xl text-cd-ink">
            Your Daily Coffee
          </h1>

          <HeroCup />
        </div>
      </section>

      <LocationBar />

      <section className="bg-cd-paper px-4 py-16 sm:px-6 lg:px-10">
        <div className="container">
          <p className="mb-8 text-label text-cd-ink-mute">
            [ Featured Drinks ]
          </p>
          <Reveal stagger className="flex snap-x gap-6 overflow-x-auto pb-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/menu/${product.slug}`}
                className="w-64 shrink-0 snap-start rounded-lg bg-cd-paper-warm p-4 transition-colors duration-200 hover:bg-cd-line"
              >
                <div className="mb-4 aspect-square rounded-lg bg-cd-line" />
                <p className="mb-2 text-display-m text-cd-orange">
                  {product.name}
                </p>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-cd-paper px-4 pb-16 sm:px-6 lg:px-10">
        <Reveal
          stagger
          className="container grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {CATEGORY_TILES.map((tile) => (
            <Link
              key={tile.slug}
              href={`/menu?category=${tile.slug}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-cd-ink transition-colors duration-200 hover:bg-cd-ink-2"
            >
              <span className="absolute bottom-4 left-4 text-display-m text-cd-cream">
                {tile.label}
              </span>
              <span className="absolute bottom-4 right-4 text-cd-cream transition-transform group-hover:translate-x-1">
                ↗
              </span>
            </Link>
          ))}
        </Reveal>
      </section>

      <section className="bg-cd-paper px-4 py-16 sm:px-6 lg:px-10">
        <Reveal className="container grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="aspect-[4/5] rounded-lg bg-cd-paper-warm" />
          <div>
            <p className="mb-4 text-label text-cd-ink-mute">[ Our Story ]</p>
            <p className="mb-6 text-display-l">
              Roasted daily, served without compromise
            </p>
            <p className="mb-6 text-body text-cd-ink-mute">
              Every batch is roasted in small runs and pulled the same week
              it&apos;s poured. No shortcuts, no syrups pretending to be flavor.
            </p>
            <Link
              href="/about"
              className="text-body-s underline transition-colors duration-200 hover:text-cd-orange"
            >
              Read more about us
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="bg-cd-paper px-4 pb-16 sm:px-6 lg:px-10">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-label text-cd-ink-mute">[ Our Locations ]</p>
            <Link
              href="/locations"
              className="text-body-s underline transition-colors duration-200 hover:text-cd-orange"
            >
              See all locations
            </Link>
          </div>
          <Reveal stagger className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {teaserLocations.map((location) => (
              <Link
                key={location.id}
                href="/locations"
                className="rounded-lg bg-cd-paper-warm p-6 transition-colors duration-200 hover:bg-cd-line"
              >
                <p className="mb-2 text-display-m">{location.name}</p>
                <p className="text-body-s text-cd-ink-mute">
                  {location.address}
                </p>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-cd-ink px-4 py-16 text-cd-cream sm:px-6 lg:px-10">
        <Reveal className="container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-display-l">Get the weekly roast</p>
            <p className="text-body text-cd-ink-mute">
              New drinks, new locations, no spam.
            </p>
          </div>
          <form className="flex w-full max-w-md gap-3">
            <label className="w-full">
              <span className="sr-only">Email</span>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-full border border-white/20 bg-transparent px-4 py-3 text-body-s text-cd-cream placeholder:text-cd-ink-mute"
              />
            </label>
            <button
              type="submit"
              className="shrink-0 rounded-full bg-cd-orange px-6 py-3 text-body-s text-cd-cream transition-colors duration-200 hover:bg-cd-orange-deep"
            >
              Subscribe
            </button>
          </form>
        </Reveal>
      </section>
    </>
  );
}
