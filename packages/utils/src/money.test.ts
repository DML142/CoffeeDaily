import { describe, expect, it } from "vitest";
import { formatMoney } from "./money";

describe("formatMoney", () => {
  it("formats whole dollar amounts", () => {
    expect(formatMoney(1600)).toBe("$16.00");
  });

  it("formats amounts with cents", () => {
    expect(formatMoney(450)).toBe("$4.50");
  });

  it("formats zero", () => {
    expect(formatMoney(0)).toBe("$0.00");
  });

  it("rejects fractional minor units by truncating like Intl does", () => {
    expect(formatMoney(101)).toBe("$1.01");
  });
});
