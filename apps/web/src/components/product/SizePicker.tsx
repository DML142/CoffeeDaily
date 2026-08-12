import type { Size } from "@coffee-daily/types";

const SIZE_LABELS: Record<Size, string> = {
  s: "S",
  m: "M",
  l: "L",
};

export type SizePickerProps = {
  sizes: Size[];
  value: Size;
  onChange: (size: Size) => void;
  disabledSizes: Set<Size>;
};

export function SizePicker({
  sizes,
  value,
  onChange,
  disabledSizes,
}: SizePickerProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {sizes.map((size) => {
        const isSelected = size === value;
        const isDisabled = disabledSizes.has(size);
        return (
          <button
            key={size}
            type="button"
            disabled={isDisabled}
            onClick={() => onChange(size)}
            className={`border px-4 py-2 text-body-s disabled:cursor-not-allowed disabled:opacity-40 ${
              isSelected
                ? "border-cd-ink bg-cd-ink text-cd-cream"
                : "border-cd-line"
            }`}
          >
            {SIZE_LABELS[size]}
          </button>
        );
      })}
    </div>
  );
}
