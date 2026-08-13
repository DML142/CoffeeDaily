import type { Size, Vessel } from "@coffee-daily/types";

export type CupSlide = {
  id: number;
  vessel: Vessel;
  size: Size;
};

export function advanceSlides(slides: CupSlide[], next: CupSlide): CupSlide[] {
  const current = slides[slides.length - 1];
  if (!current) return [next];
  if (current.vessel === next.vessel && current.size === next.size) {
    return slides;
  }
  return [current, next];
}

export function dropSlide(slides: CupSlide[], id: number): CupSlide[] {
  if (slides.length < 2) return slides;
  const remaining = slides.filter((slide) => slide.id !== id);
  return remaining.length === slides.length ? slides : remaining;
}
