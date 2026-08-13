import type { Product } from "@coffee-daily/types";
import { formatMoney } from "@coffee-daily/utils/money";
import Image from "next/image";
import Link from "next/link";

const DIETARY_LABELS: Record<string, string> = {
  vegan: "Vegan",
  "dairy-free": "Dairy-free",
  "gluten-free": "Gluten-free",
  decaf: "Decaf",
};

export type ProductCardProps = {
  product: Product;
  categoryName: string;
  isAvailable: boolean;
};

export function ProductCard({
  product,
  categoryName,
  isAvailable,
}: ProductCardProps) {
  const tags = [
    categoryName,
    ...product.dietaryTags.map((tag) => DIETARY_LABELS[tag] ?? tag),
  ];

  if (!isAvailable) {
    return (
      <div
        className="bg-cd-paper-warm p-4 opacity-50"
        aria-label={`${product.name}, out of stock`}
      >
        <div className="relative mb-4 aspect-square overflow-hidden bg-cd-line">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>
        <p className="mb-1 text-display-m text-cd-orange">{product.name}</p>
        <p className="mb-3 text-body-s text-cd-ink-mute">
          Out of stock at this location
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-cd-line bg-cd-paper-warm px-3 py-1 text-label"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/menu/${product.slug}`}
      data-cursor-label="Enter"
      className="bg-cd-paper-warm p-4 transition-colors duration-200 hover:bg-cd-line"
    >
      <div className="relative mb-4 aspect-square overflow-hidden bg-cd-line">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <p className="mb-1 text-display-m text-cd-orange">{product.name}</p>
      <p className="mb-3 font-mono text-body-s text-cd-ink-mute">
        {formatMoney(product.basePriceMinor)}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-cd-line bg-cd-paper-warm px-3 py-1 text-label"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
