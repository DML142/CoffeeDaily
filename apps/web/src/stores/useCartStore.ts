import type { CartLine } from "@coffee-daily/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type NewCartLine = Omit<CartLine, "id" | "quantity"> & { quantity?: number };

type CartState = {
  lines: CartLine[];
  addLine: (line: NewCartLine) => void;
  removeLine: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clearLocation: (locationId: string) => void;
};

function isSameLine(a: NewCartLine, b: CartLine) {
  return (
    a.productId === b.productId &&
    a.locationId === b.locationId &&
    a.vessel === b.vessel &&
    a.size === b.size &&
    JSON.stringify(a.extras) === JSON.stringify(b.extras)
  );
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addLine: (line) =>
        set((state) => {
          const quantity = line.quantity ?? 1;
          const existing = state.lines.find((candidate) =>
            isSameLine(line, candidate),
          );

          if (existing) {
            return {
              lines: state.lines.map((candidate) =>
                candidate.id === existing.id
                  ? { ...candidate, quantity: candidate.quantity + quantity }
                  : candidate,
              ),
            };
          }

          return {
            lines: [
              ...state.lines,
              { ...line, id: crypto.randomUUID(), quantity },
            ],
          };
        }),
      removeLine: (lineId) =>
        set((state) => ({
          lines: state.lines.filter((line) => line.id !== lineId),
        })),
      setQuantity: (lineId, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((line) => line.id !== lineId)
              : state.lines.map((line) =>
                  line.id === lineId ? { ...line, quantity } : line,
                ),
        })),
      clearLocation: (locationId) =>
        set((state) => ({
          lines: state.lines.filter((line) => line.locationId !== locationId),
        })),
    }),
    {
      name: "cd-cart",
      version: 1,
      migrate: migrateCartStorage,
      storage: createJSONStorage(() => window.localStorage),
    },
  ),
);

export function migrateCartStorage(): { lines: CartLine[] } {
  return { lines: [] };
}

export function groupCartLinesByLocation(lines: CartLine[]) {
  return lines.reduce<Record<string, CartLine[]>>((groups, line) => {
    const group = groups[line.locationId] ?? [];
    group.push(line);
    groups[line.locationId] = group;
    return groups;
  }, {});
}

export function cartLineTotalMinor(line: CartLine) {
  return line.unitPriceMinor * line.quantity;
}
