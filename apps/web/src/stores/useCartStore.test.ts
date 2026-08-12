import { beforeEach, describe, expect, it } from "vitest";
import {
  cartLineTotalMinor,
  groupCartLinesByLocation,
  migrateCartStorage,
  useCartStore,
} from "./useCartStore";

beforeEach(() => {
  useCartStore.setState({ lines: [] });
});

const baseLine = {
  productId: "prod_iced-cold-brew",
  locationId: "loc_fulton-market",
  vessel: "glass" as const,
  size: "m" as const,
  extras: [],
  unitPriceMinor: 450,
};

describe("useCartStore", () => {
  it("adds a new line with a generated id and default quantity 1", () => {
    useCartStore.getState().addLine(baseLine);
    const [line] = useCartStore.getState().lines;

    expect(line?.id).toBeTruthy();
    expect(line?.quantity).toBe(1);
  });

  it("merges quantity into an identical existing line instead of duplicating it", () => {
    useCartStore.getState().addLine(baseLine);
    useCartStore.getState().addLine(baseLine);

    expect(useCartStore.getState().lines).toHaveLength(1);
    expect(useCartStore.getState().lines[0]?.quantity).toBe(2);
  });

  it("keeps lines with different options separate", () => {
    useCartStore.getState().addLine(baseLine);
    useCartStore.getState().addLine({ ...baseLine, size: "l" });

    expect(useCartStore.getState().lines).toHaveLength(2);
  });

  it("removes a line and setting quantity to 0 also removes it", () => {
    useCartStore.getState().addLine(baseLine);
    const lineId = useCartStore.getState().lines[0]!.id;

    useCartStore.getState().setQuantity(lineId, 0);
    expect(useCartStore.getState().lines).toHaveLength(0);
  });

  it("clears only the lines for one location, leaving others intact", () => {
    useCartStore.getState().addLine(baseLine);
    useCartStore
      .getState()
      .addLine({ ...baseLine, locationId: "loc_wicker-park" });

    useCartStore.getState().clearLocation("loc_fulton-market");

    const remaining = useCartStore.getState().lines;
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.locationId).toBe("loc_wicker-park");
  });
});

describe("migrateCartStorage", () => {
  it("drops any stale shape and returns an empty cart rather than crashing", () => {
    expect(migrateCartStorage()).toEqual({ lines: [] });
  });

  it("recovers from a stale localStorage payload end to end", async () => {
    localStorage.setItem(
      "cd-cart",
      JSON.stringify({
        state: { lines: [{ shape: "from-a-previous-schema" }] },
        version: 0,
      }),
    );

    await useCartStore.persist.rehydrate();

    expect(useCartStore.getState().lines).toEqual([]);
  });
});

describe("groupCartLinesByLocation", () => {
  it("groups lines by locationId", () => {
    const lines = [
      { ...baseLine, id: "1", quantity: 1 },
      { ...baseLine, id: "2", quantity: 1, locationId: "loc_wicker-park" },
    ];

    const groups = groupCartLinesByLocation(lines);

    expect(Object.keys(groups)).toEqual([
      "loc_fulton-market",
      "loc_wicker-park",
    ]);
    expect(groups["loc_fulton-market"]).toHaveLength(1);
  });
});

describe("cartLineTotalMinor", () => {
  it("multiplies unit price by quantity", () => {
    expect(cartLineTotalMinor({ ...baseLine, id: "1", quantity: 3 })).toBe(
      1350,
    );
  });
});
