import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "@/test-utils/mockMatchMedia";
import { HeroCup } from "./HeroCup";

const { gsapTo, tweenKill } = vi.hoisted(() => {
  const tweenKill = vi.fn();
  const gsapTo = vi.fn(() => ({ kill: tweenKill }));
  return { gsapTo, tweenKill };
});

vi.mock("gsap", () => ({
  gsap: { to: gsapTo },
}));

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

describe("HeroCup", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    gsapTo.mockClear();
    tweenKill.mockClear();
  });

  it("links to the featured product", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    render(<HeroCup />);

    expect(screen.getByRole("link", { name: /See it/ })).toHaveAttribute(
      "href",
      "/menu/iced-cold-brew",
    );
  });

  it("cannot be selected or dragged", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    render(<HeroCup />);

    const link = screen.getByRole("link", { name: /See it/ });
    expect(link.className).toContain("select-none");
    expect(screen.getByAltText("Iced coffee in a to-go cup")).toHaveAttribute(
      "draggable",
      "false",
    );
  });

  it("starts below its resting position and animates up to it", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    render(<HeroCup />);

    const link = screen.getByRole("link", { name: /See it/ });
    expect(link.getAttribute("style")).toContain("translateY(208px)");

    expect(gsapTo).toHaveBeenCalledTimes(1);
    const [target, vars] = gsapTo.mock.calls[0] as unknown as [
      unknown,
      Record<string, unknown>,
    ];
    expect(target).toBe(link);
    expect(vars.y).toBe(48);
    expect(vars.duration).toBe(0.8);
    expect(vars.ease).toBe("power3.out");
  });

  it("skips the animation under reduced motion and rests in its final position", () => {
    mockMatchMedia({ [REDUCED_MOTION]: true });
    render(<HeroCup />);

    const link = screen.getByRole("link", { name: /See it/ });
    expect(link.className).toContain("translate-y-[48px]");
    expect(gsapTo).not.toHaveBeenCalled();
  });

  it("kills the tween on unmount", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    const { unmount } = render(<HeroCup />);

    unmount();

    expect(tweenKill).toHaveBeenCalledTimes(1);
  });
});
