import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "@/test-utils/mockMatchMedia";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

const { create, kill, scrollTo } = vi.hoisted(() => {
  const kill = vi.fn();
  const scrollTo = vi.fn();
  const create = vi.fn(() => ({ kill, scrollTo }));
  return { create, kill, scrollTo };
});

vi.mock("gsap", () => ({
  gsap: { registerPlugin: vi.fn() },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

vi.mock("gsap/ScrollSmoother", () => ({
  ScrollSmoother: { create },
}));

const POINTER_FINE = "(pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

describe("SmoothScrollProvider", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    create.mockClear();
    kill.mockClear();
    scrollTo.mockClear();
  });

  it("renders children regardless of guard state", () => {
    mockMatchMedia({ [POINTER_FINE]: false, [REDUCED_MOTION]: false });

    render(
      <SmoothScrollProvider>
        <p>page content</p>
      </SmoothScrollProvider>,
    );

    expect(screen.getByText("page content")).toBeInTheDocument();
  });

  it("creates ScrollSmoother on pointer-fine devices with motion allowed", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });

    render(
      <SmoothScrollProvider>
        <p>content</p>
      </SmoothScrollProvider>,
    );

    expect(create).toHaveBeenCalledTimes(1);
  });

  it("skips ScrollSmoother on touch devices", () => {
    mockMatchMedia({ [POINTER_FINE]: false, [REDUCED_MOTION]: false });

    render(
      <SmoothScrollProvider>
        <p>content</p>
      </SmoothScrollProvider>,
    );

    expect(create).not.toHaveBeenCalled();
  });

  it("skips ScrollSmoother when reduced motion is preferred", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: true });

    render(
      <SmoothScrollProvider>
        <p>content</p>
      </SmoothScrollProvider>,
    );

    expect(create).not.toHaveBeenCalled();
  });

  it("kills the smoother on unmount", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });

    const { unmount } = render(
      <SmoothScrollProvider>
        <p>content</p>
      </SmoothScrollProvider>,
    );

    unmount();

    expect(kill).toHaveBeenCalledTimes(1);
  });

  it("scrolls an off-screen element into view when it receives focus", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });

    render(
      <SmoothScrollProvider>
        <button type="button">off-screen</button>
      </SmoothScrollProvider>,
    );

    const button = screen.getByText("off-screen");
    vi.spyOn(button, "getBoundingClientRect").mockReturnValue({
      top: 2000,
      bottom: 2040,
      left: 0,
      right: 100,
      width: 100,
      height: 40,
      x: 0,
      y: 2000,
      toJSON: () => "",
    });

    button.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

    expect(scrollTo).toHaveBeenCalledWith(button, true);
  });

  it("does not scroll when a visible element receives focus", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });

    render(
      <SmoothScrollProvider>
        <button type="button">visible</button>
      </SmoothScrollProvider>,
    );

    const button = screen.getByText("visible");
    vi.spyOn(button, "getBoundingClientRect").mockReturnValue({
      top: 10,
      bottom: 50,
      left: 0,
      right: 100,
      width: 100,
      height: 40,
      x: 0,
      y: 10,
      toJSON: () => "",
    });

    button.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("stops listening for focus after unmount", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });

    const { unmount } = render(
      <SmoothScrollProvider>
        <button type="button">off-screen</button>
      </SmoothScrollProvider>,
    );

    const button = screen.getByText("off-screen");
    vi.spyOn(button, "getBoundingClientRect").mockReturnValue({
      top: 2000,
      bottom: 2040,
      left: 0,
      right: 100,
      width: 100,
      height: 40,
      x: 0,
      y: 2000,
      toJSON: () => "",
    });

    unmount();
    document.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

    expect(scrollTo).not.toHaveBeenCalled();
  });
});
