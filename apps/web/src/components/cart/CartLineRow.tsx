import { products } from "@coffee-daily/mocks";
import type { CartLine, Size, Vessel } from "@coffee-daily/types";
import { formatMoney } from "@coffee-daily/utils/money";

const VESSEL_LABELS: Record<Vessel, string> = {
  glass: "Glass",
  plastic: "Plastic",
  paper: "Paper cup",
  ceramic: "Ceramic mug",
};

const SIZE_LABELS: Record<Size, string> = {
  s: "S",
  m: "M",
  l: "L",
};

export type CartLineRowProps = {
  line: CartLine;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
};

export function CartLineRow({
  line,
  onIncrement,
  onDecrement,
  onRemove,
}: CartLineRowProps) {
  const product = products.find((candidate) => candidate.id === line.productId);
  const lineTotalMinor = line.unitPriceMinor * line.quantity;

  return (
    <div className="flex flex-wrap items-center gap-4 py-4">
      <div className="flex min-w-[200px] flex-1 items-center gap-4">
        <div className="h-20 w-20 shrink-0 bg-cd-line" />
        <div className="flex-1">
          <p className="mb-1 text-body">{product?.name ?? "Item"}</p>
          <p className="text-body-s text-cd-ink-mute">
            {VESSEL_LABELS[line.vessel]}, {SIZE_LABELS[line.size]}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={onDecrement}
            className="h-8 w-8 border border-cd-line text-body-s transition-colors hover:bg-cd-paper"
          >
            −
          </button>
          <span className="w-4 text-center text-body-s">{line.quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={onIncrement}
            className="h-8 w-8 border border-cd-line text-body-s transition-colors hover:bg-cd-paper"
          >
            +
          </button>
        </div>
        <p className="w-16 text-right font-mono text-body-s">
          {formatMoney(lineTotalMinor)}
        </p>
        <button
          type="button"
          aria-label="Remove item"
          onClick={onRemove}
          className="text-body-s text-cd-ink-mute hover:text-cd-danger"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
