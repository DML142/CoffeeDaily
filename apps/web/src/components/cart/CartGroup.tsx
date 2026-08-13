import type { CartLine } from "@coffee-daily/types";
import { formatMoney } from "@coffee-daily/utils/money";
import Link from "next/link";
import { CartLineRow } from "@/components/cart/CartLineRow";

export type CartGroupProps = {
  locationId: string;
  locationName: string;
  lines: CartLine[];
  onIncrement: (lineId: string) => void;
  onDecrement: (lineId: string) => void;
  onRemove: (lineId: string) => void;
};

export function CartGroup({
  locationId,
  locationName,
  lines,
  onIncrement,
  onDecrement,
  onRemove,
}: CartGroupProps) {
  const subtotalMinor = lines.reduce(
    (sum, line) => sum + line.unitPriceMinor * line.quantity,
    0,
  );

  return (
    <div className="bg-cd-paper-warm p-6 sm:p-8">
      <div className="mb-6 flex items-start justify-between">
        <p className="text-display-m">{locationName}</p>
        <Link
          href="/locations"
          className="text-body-s underline transition-colors duration-200 hover:text-cd-orange"
        >
          Change location
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-cd-line">
        {lines.map((line) => (
          <CartLineRow
            key={line.id}
            line={line}
            onIncrement={() => onIncrement(line.id)}
            onDecrement={() => onDecrement(line.id)}
            onRemove={() => onRemove(line.id)}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-cd-line pt-6 sm:flex-row sm:items-center">
        <p className="text-body">
          Subtotal{" "}
          <span className="ml-2 font-mono text-display-m">
            {formatMoney(subtotalMinor)}
          </span>
        </p>
        <Link
          href={`/checkout/${locationId}`}
          className="w-full bg-cd-orange px-6 py-3 text-center text-body-s text-cd-cream transition-colors duration-200 hover:bg-cd-orange-deep sm:w-auto"
        >
          Checkout {locationName}
        </Link>
      </div>
    </div>
  );
}
