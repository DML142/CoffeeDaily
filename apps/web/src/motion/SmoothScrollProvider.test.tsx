import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "@/test-utils/mockMatchMedia";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

const { LenisMock, destroy, on, raf, tickerAdd, tickerRemove } = vi.hoisted(
  () => {
    const destroy = vi.fn();
    const on = vi.fn();
    const raf = vi.fn();
    const tickerAdd = vi.fn();
    const tickerRemove = vi.fn();
    const LenisMock = vi.fn(function LenisStub() {
      return { destroy, on, raf };
    });
    return { LenisMock, destroy, on, raf, tickerAdd, tickerRemove };
  },
);

vi.mock("gsap", () => ({
  gsap: {
    registerPlugin: vi.fn(),
    ticker: { add: tickerAdd, remove: tickerRemove },
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: { update: vi.fn() },
}));

vi.mock("lenis", () => ({ default: LenisMock }));

const POINTER_FINE = "(pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

describe("SmoothScrollProvider", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    LenisMock.mockClear();
    destroy.mockClear();
    on.mockClear();
    raf.mockClear();
    tickerAdd.mockClear();
    tickerRemove.mockClear();
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

  it("starts Lenis on pointer-fine devices with motion allowed", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });

    render(
      <SmoothScrollProvider>
        <p>content</p>
      </SmoothScrollProvider>,
    );

    expect(LenisMock).toHaveBeenCalledTimes(1);
    expect(LenisMock).toHaveBeenCalledWith({ autoRaf: false });
    expect(tickerAdd).toHaveBeenCalledTimes(1);
  });

  it("drives Lenis from the gsap ticker in milliseconds", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });

    render(
      <SmoothScrollProvider>
        <p>content</p>
      </SmoothScrollProvider>,
    );

    const update = tickerAdd.mock.calls[0]![0] as (time: number) => void;
    update(2);

    expect(raf).toHaveBeenCalledWith(2000);
  });

  it("keeps ScrollTrigger in sync with Lenis scroll", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });

    render(
      <SmoothScrollProvider>
        <p>content</p>
      </SmoothScrollProvider>,
    );

    expect(on).toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("skips Lenis on touch devices", () => {
    mockMatchMedia({ [POINTER_FINE]: false, [REDUCED_MOTION]: false });

    render(
      <SmoothScrollProvider>
        <p>content</p>
      </SmoothScrollProvider>,
    );

    expect(LenisMock).not.toHaveBeenCalled();
  });

  it("skips Lenis when reduced motion is preferred", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: true });

    render(
      <SmoothScrollProvider>
        <p>content</p>
      </SmoothScrollProvider>,
    );

    expect(LenisMock).not.toHaveBeenCalled();
  });

  it("destroys Lenis and detaches the ticker on unmount", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });

    const { unmount } = render(
      <SmoothScrollProvider>
        <p>content</p>
      </SmoothScrollProvider>,
    );

    unmount();

    expect(destroy).toHaveBeenCalledTimes(1);
    expect(tickerRemove).toHaveBeenCalledTimes(1);
  });

  it("adds no wrapper element around its children", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });

    const { container } = render(
      <SmoothScrollProvider>
        <p>content</p>
      </SmoothScrollProvider>,
    );

    expect(container.firstChild).toBe(screen.getByText("content"));
  });
});
