import { act, render, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "@/test-utils/mockMatchMedia";
import { PageTransitionProvider, usePageTransition } from "./PageTransition";

const { fromToMock, pushMock, usePathnameMock, useSearchParamsMock } =
  vi.hoisted(() => ({
    fromToMock: vi.fn(
      (_target: unknown, _from: unknown, to: { onComplete?: () => void }) => {
        to.onComplete?.();
        return {};
      },
    ),
    pushMock: vi.fn(),
    usePathnameMock: vi.fn(() => "/"),
    useSearchParamsMock: vi.fn(() => new URLSearchParams()),
  }));

vi.mock("gsap", () => ({
  gsap: { fromTo: fromToMock },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => usePathnameMock(),
  useSearchParams: () => useSearchParamsMock(),
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

describe("PageTransitionProvider", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    fromToMock.mockClear();
    pushMock.mockClear();
    usePathnameMock.mockReturnValue("/");
    useSearchParamsMock.mockReturnValue(new URLSearchParams());
    window.history.replaceState(null, "", "/");
  });

  it("renders a hidden full-screen overlay and its children", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    render(
      <PageTransitionProvider>
        <p>page content</p>
      </PageTransitionProvider>,
    );

    expect(overlay().className).toContain("scale-0");
    expect(overlay().className).toContain("bg-cd-ink");
  });

  it("intercepts a click on an internal link, plays the close animation anchored bottom-left, then navigates", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    render(<PageTransitionProvider>{null}</PageTransitionProvider>);

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
    const { rerender } = render(
      <PageTransitionProvider>{null}</PageTransitionProvider>,
    );

    clickAnchor({ href: "/menu" });
    fromToMock.mockClear();

    usePathnameMock.mockReturnValue("/menu");
    rerender(<PageTransitionProvider>{null}</PageTransitionProvider>);

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

  it("plays the open animation when only the search params change, e.g. a category filter link", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    usePathnameMock.mockReturnValue("/menu");
    const { rerender } = render(
      <PageTransitionProvider>{null}</PageTransitionProvider>,
    );

    clickAnchor({ href: "/menu?category=coffee" });
    fromToMock.mockClear();

    useSearchParamsMock.mockReturnValue(new URLSearchParams("category=coffee"));
    rerender(<PageTransitionProvider>{null}</PageTransitionProvider>);

    expect(fromToMock).toHaveBeenCalledTimes(1);
    const [, , to] = fromToMock.mock.calls[0] as unknown as [
      unknown,
      Record<string, unknown>,
      Record<string, unknown>,
    ];
    expect(to.rotate).toBe(12);
    expect(to.scale).toBe(0);
  });

  it("does not play the open animation on a pathname change it did not trigger itself", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    const { rerender } = render(
      <PageTransitionProvider>{null}</PageTransitionProvider>,
    );

    usePathnameMock.mockReturnValue("/about");
    rerender(<PageTransitionProvider>{null}</PageTransitionProvider>);

    expect(fromToMock).not.toHaveBeenCalled();
  });

  it("ignores external links", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    render(<PageTransitionProvider>{null}</PageTransitionProvider>);

    const event = clickAnchor({ href: "https://example.com" });

    expect(event.defaultPrevented).toBe(false);
    expect(fromToMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("ignores links opening in a new tab", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    render(<PageTransitionProvider>{null}</PageTransitionProvider>);

    const event = clickAnchor({ href: "/menu", target: "_blank" });

    expect(event.defaultPrevented).toBe(false);
    expect(fromToMock).not.toHaveBeenCalled();
  });

  it("stops the anchor's own click handler from also firing, e.g. next/link's internal navigation", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    render(<PageTransitionProvider>{null}</PageTransitionProvider>);

    const anchor = document.createElement("a");
    anchor.setAttribute("href", "/menu");
    const nativeHandler = vi.fn();
    anchor.addEventListener("click", nativeHandler);
    document.body.appendChild(anchor);

    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    act(() => {
      anchor.dispatchEvent(event);
    });
    anchor.remove();

    expect(nativeHandler).not.toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledTimes(1);
  });

  it("ignores a link to the current page", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    render(<PageTransitionProvider>{null}</PageTransitionProvider>);

    const event = clickAnchor({ href: "/" });

    expect(event.defaultPrevented).toBe(false);
    expect(fromToMock).not.toHaveBeenCalled();
  });

  it("does not intercept clicks under reduced motion", () => {
    mockMatchMedia({ [REDUCED_MOTION]: true });
    render(<PageTransitionProvider>{null}</PageTransitionProvider>);

    const event = clickAnchor({ href: "/menu" });

    expect(event.defaultPrevented).toBe(false);
    expect(fromToMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("exposes navigate through usePageTransition for programmatic navigation, e.g. after choosing a location", () => {
    mockMatchMedia({ [REDUCED_MOTION]: false });
    const { result } = renderHook(() => usePageTransition(), {
      wrapper: ({ children }) => (
        <PageTransitionProvider>{children}</PageTransitionProvider>
      ),
    });

    act(() => {
      result.current.navigate("/menu");
    });

    expect(fromToMock).toHaveBeenCalledTimes(1);
    const [, from] = fromToMock.mock.calls[0] as unknown as [
      unknown,
      Record<string, unknown>,
    ];
    expect(from.transformOrigin).toBe("0% 100%");
    expect(pushMock).toHaveBeenCalledWith("/menu");
  });

  it("throws when usePageTransition is called outside the provider", () => {
    const { result } = renderHook(() => {
      try {
        usePageTransition();
        return null;
      } catch (error) {
        return error;
      }
    });

    expect(result.current).toBeInstanceOf(Error);
  });
});
