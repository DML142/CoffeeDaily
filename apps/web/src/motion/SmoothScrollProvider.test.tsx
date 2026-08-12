import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "@/test-utils/mockMatchMedia";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

const { create, kill } = vi.hoisted(() => {
  const kill = vi.fn();
  const create = vi.fn(() => ({ kill }));
  return { create, kill };
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
  afterEach(() => {
    vi.unstubAllGlobals();
    create.mockClear();
    kill.mockClear();
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
});
