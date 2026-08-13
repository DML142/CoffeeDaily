import { describe, expect, it } from "vitest";
import { advanceSlides, dropSlide } from "./cupSlides";

const glassM = { id: 0, vessel: "glass" as const, size: "m" as const };

describe("advanceSlides", () => {
  it("keeps the previous slide alongside the new one", () => {
    const next = { id: 1, vessel: "ceramic" as const, size: "m" as const };
    expect(advanceSlides([glassM], next)).toEqual([glassM, next]);
  });

  it("drops an already exiting slide when a third option arrives", () => {
    const second = { id: 1, vessel: "ceramic" as const, size: "m" as const };
    const third = { id: 2, vessel: "paper" as const, size: "l" as const };
    expect(advanceSlides([glassM, second], third)).toEqual([second, third]);
  });

  it("ignores a repeat of the current option", () => {
    const slides = [glassM];
    expect(advanceSlides(slides, { id: 1, vessel: "glass", size: "m" })).toBe(
      slides,
    );
  });

  it("starts from empty", () => {
    expect(advanceSlides([], glassM)).toEqual([glassM]);
  });
});

describe("dropSlide", () => {
  it("removes a finished slide", () => {
    const second = { id: 1, vessel: "ceramic" as const, size: "m" as const };
    expect(dropSlide([glassM, second], 0)).toEqual([second]);
  });

  it("never empties the list", () => {
    const slides = [glassM];
    expect(dropSlide(slides, 0)).toBe(slides);
  });

  it("returns the same list for an unknown id", () => {
    const second = { id: 1, vessel: "ceramic" as const, size: "m" as const };
    const slides = [glassM, second];
    expect(dropSlide(slides, 99)).toBe(slides);
  });
});
