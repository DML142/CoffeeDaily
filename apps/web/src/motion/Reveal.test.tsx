import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "@/test-utils/mockMatchMedia";
import { Reveal } from "./Reveal";

const { gsapSet, gsapTo, scrollTriggerKill, tweenKill } = vi.hoisted(() => {
  const scrollTriggerKill = vi.fn();
  const tweenKill = vi.fn();
  const gsapSet = vi.fn();
  const gsapTo = vi.fn(() => ({
    scrollTrigger: { kill: scrollTriggerKill },
    kill: tweenKill,
  }));
  return { gsapSet, gsapTo, scrollTriggerKill, tweenKill };
});

vi.mock("gsap", () => ({
  gsap: {
    registerPlugin: vi.fn(),
    set: gsapSet,
    to: gsapTo,
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

describe("Reveal", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    gsapSet.mockClear();
    gsapTo.mockClear();
    scrollTriggerKill.mockClear();
    tweenKill.mockClear();
  });

  it("renders children", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });

    render(
      <Reveal>
        <p>section content</p>
      </Reveal>,
    );

    expect(screen.getByText("section content")).toBeInTheDocument();
  });

  it("animates the container as a single block by default", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });

    const { container } = render(
      <Reveal>
        <p>content</p>
      </Reveal>,
    );

    expect(gsapSet).toHaveBeenCalledWith(container.firstChild, {
      opacity: 0,
      y: 24,
      pointerEvents: "none",
    });
    expect(gsapTo).toHaveBeenCalledTimes(1);
    const [target, vars] = gsapTo.mock.calls[0] as unknown as [
      unknown,
      Record<string, unknown>,
    ];
    expect(target).toBe(container.firstChild);
    expect(vars.stagger).toBe(0);
    expect(vars.duration).toBe(0.8);
    expect(vars.ease).toBe("power3.out");
    expect((vars.scrollTrigger as { start: string; once: boolean }).start).toBe(
      "top 85%",
    );
    expect((vars.scrollTrigger as { start: string; once: boolean }).once).toBe(
      true,
    );
  });

  it("blocks pointer events until the reveal finishes, so a click can't land on a target still sliding into place", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });

    const { container } = render(
      <Reveal>
        <p>content</p>
      </Reveal>,
    );

    const [, vars] = gsapTo.mock.calls[0] as unknown as [
      unknown,
      { onComplete: () => void },
    ];
    gsapSet.mockClear();
    vars.onComplete();

    expect(gsapSet).toHaveBeenCalledWith(container.firstChild, {
      pointerEvents: "auto",
    });
  });

  it("staggers direct children when stagger is set", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });

    render(
      <Reveal stagger>
        <p>one</p>
        <p>two</p>
      </Reveal>,
    );

    const [target, vars] = gsapTo.mock.calls[0] as unknown as [
      unknown[],
      Record<string, unknown>,
    ];
    expect(target).toHaveLength(2);
    expect(vars.stagger).toBe(0.06);
  });

  it("skips the animation under reduced motion", () => {
    mockMatchMedia({ [REDUCED_MOTION]: true });

    render(
      <Reveal>
        <p>content</p>
      </Reveal>,
    );

    expect(gsapSet).not.toHaveBeenCalled();
    expect(gsapTo).not.toHaveBeenCalled();
  });

  it("kills the tween and scroll trigger on unmount", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });

    const { unmount } = render(
      <Reveal>
        <p>content</p>
      </Reveal>,
    );

    unmount();

    expect(tweenKill).toHaveBeenCalledTimes(1);
    expect(scrollTriggerKill).toHaveBeenCalledTimes(1);
  });
});
