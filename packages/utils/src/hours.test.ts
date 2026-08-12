import { describe, expect, it } from "vitest";
import { isLocationOpenNow } from "./hours";

const hours = {
  weekday: { open: "06:00", close: "19:00" },
  weekend: { open: "07:00", close: "18:00" },
};

describe("isLocationOpenNow", () => {
  it("is open during weekday hours", () => {
    const monday10am = new Date("2026-08-10T10:00:00");
    expect(isLocationOpenNow(hours, monday10am)).toBe(true);
  });

  it("is closed before weekday opening", () => {
    const monday5am = new Date("2026-08-10T05:00:00");
    expect(isLocationOpenNow(hours, monday5am)).toBe(false);
  });

  it("is closed after weekday closing", () => {
    const mondayEvening = new Date("2026-08-10T19:30:00");
    expect(isLocationOpenNow(hours, mondayEvening)).toBe(false);
  });

  it("uses weekend hours on saturday", () => {
    const saturday630am = new Date("2026-08-15T06:30:00");
    expect(isLocationOpenNow(hours, saturday630am)).toBe(false);
  });

  it("is open during weekend hours", () => {
    const saturdayNoon = new Date("2026-08-15T12:00:00");
    expect(isLocationOpenNow(hours, saturdayNoon)).toBe(true);
  });
});
