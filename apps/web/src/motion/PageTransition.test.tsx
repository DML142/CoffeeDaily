import { act, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "@/test-utils/mockMatchMedia";
import { PageTransition } from "./PageTransition";

const { fromToMock, pushMock, usePathnameMock } = vi.hoisted(() => ({
  fromToMock: vi.fn(
    (_target: unknown, _from: unknown, to: { onComplete?: () => void }) => {
      to.onComplete?.();
      return {};
    },
  ),
  pushMock: vi.fn(),
  usePathnameMock: vi.fn(() => "/"),
}));

vi.mock("gsap", () => ({
  gsap: { fromTo: fromToMock },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => usePathnameMock(),
}));

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function overlay() {
  return document.querySelector('[aria-hidden="true"]')!;
}

function clickAnchor(attributes: Record<string, string> = { href: "/menu" }) {
  const anchor = document.createElement("a");
  for (const [name, value] of Object.entries(attributes)) {
    anchor.setAttribute(name, value);
  }
  document.body.appendChild(anchor);

  const event = new MouseEvent("click", { bubbles: true, cancelable: true });
  act(() => {
    anchor.dispatchEvent(event);
  });

  anchor.remove();
  return event;
}

describe("PageTransition", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    fromToMock.mockClear();
    pushMock.mockClear();
    usePathnameMock.mockReturnValue("/");
    window.history.replaceState(null, "", "/");
  });

  it("renders a hidden full-screen overlay", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    render(<PageTransition />);

    expect(overlay().className).toContain("scale-0");
    expect(overlay().className).toContain("bg-cd-ink");
  });

  it("intercepts a click on an internal link, plays the close animation anchored bottom-left, then navigates", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    render(<PageTransition />);

    const event = clickAnchor({ href: "/menu" });

    expect(event.defaultPrevented).toBe(true);
    expect(fromToMock).toHaveBeenCalledTimes(1);
    const [, from, to] = fromToMock.mock.calls[0] as unknown as [
      unknown,
      Record<string, unknown>,
      Record<string, unknown>,
    ];
    expect(from.transformOrigin).toBe("0% 100%");
    expect(to.rotate).toBe(0);
    expect(to.scale).toBe(1);
    expect(pushMock).toHaveBeenCalledWith("/menu");
  });

  it("plays the open animation anchored top-right once the new page mounts", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    const { rerender } = render(<PageTransition />);

    clickAnchor({ href: "/menu" });
    fromToMock.mockClear();

    usePathnameMock.mockReturnValue("/menu");
    rerender(<PageTransition />);

    expect(fromToMock).toHaveBeenCalledTimes(1);
    const [, from, to] = fromToMock.mock.calls[0] as unknown as [
      unknown,
      Record<string, unknown>,
      Record<string, unknown>,
    ];
    expect(from.transformOrigin).toBe("100% 0%");
    expect(to.rotate).toBe(12);
    expect(to.scale).toBe(0);
  });

  it("does not play the open animation on a pathname change it did not trigger itself", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    const { rerender } = render(<PageTransition />);

    usePathnameMock.mockReturnValue("/about");
    rerender(<PageTransition />);

    expect(fromToMock).not.toHaveBeenCalled();
  });

  it("ignores external links", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    render(<PageTransition />);

    const event = clickAnchor({ href: "https://example.com" });

    expect(event.defaultPrevented).toBe(false);
    expect(fromToMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("ignores links opening in a new tab", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    render(<PageTransition />);

    const event = clickAnchor({ href: "/menu", target: "_blank" });

    expect(event.defaultPrevented).toBe(false);
    expect(fromToMock).not.toHaveBeenCalled();
  });

  it("ignores a link to the current page", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    render(<PageTransition />);

    const event = clickAnchor({ href: "/" });

    expect(event.defaultPrevented).toBe(false);
    expect(fromToMock).not.toHaveBeenCalled();
  });

  it("does not intercept clicks under reduced motion", () => {
    mockMatchMedia({ [REDUCED_MOTION]: true });
    render(<PageTransition />);

    const event = clickAnchor({ href: "/menu" });

    expect(event.defaultPrevented).toBe(false);
    expect(fromToMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
