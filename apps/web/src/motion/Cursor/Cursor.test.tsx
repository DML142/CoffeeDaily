import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "@/test-utils/mockMatchMedia";
import { Cursor } from "./Cursor";

const { quickTo } = vi.hoisted(() => {
  const quickTo = vi.fn(() => vi.fn());
  return { quickTo };
});

vi.mock("gsap", () => ({
  gsap: { quickTo },
}));

const POINTER_FINE = "(pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function dispatchPointerMove() {
  act(() => {
    document.dispatchEvent(
      new PointerEvent("pointermove", { clientX: 10, clientY: 10 }),
    );
  });
}

function dispatchPointerOver(target: Element, related: Element | null = null) {
  act(() => {
    target.dispatchEvent(
      new PointerEvent("pointerover", {
        bubbles: true,
        relatedTarget: related,
      }),
    );
  });
}

function dispatchPointerOut(target: Element, related: Element | null = null) {
  act(() => {
    target.dispatchEvent(
      new PointerEvent("pointerout", {
        bubbles: true,
        relatedTarget: related,
      }),
    );
  });
}

describe("Cursor", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    quickTo.mockClear();
    document.body.style.removeProperty("cursor");
  });

  it("renders nothing on touch devices", () => {
    mockMatchMedia({ [POINTER_FINE]: false, [REDUCED_MOTION]: false });
    const { container } = render(<Cursor />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing under reduced motion", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: true });
    const { container } = render(<Cursor />);
    expect(container).toBeEmptyDOMElement();
  });

  it("mounts dot and ring layers on pointer-fine devices with motion allowed", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });
    render(<Cursor />);
    expect(quickTo).toHaveBeenCalledTimes(4);
  });

  it("hides the native cursor only after the first pointer position is confirmed", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });
    render(<Cursor />);

    expect(document.body.style.cursor).not.toBe("none");
    dispatchPointerMove();
    expect(document.body.style.cursor).toBe("none");
  });

  it("switches to the button variant over a data-cursor=button element", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });
    render(<Cursor />);
    const button = document.createElement("button");
    button.setAttribute("data-cursor", "button");
    document.body.appendChild(button);

    dispatchPointerOver(button);

    const ring = document.querySelectorAll('[aria-hidden="true"]')[1]!;
    expect(ring.className).toContain("bg-cd-orange");

    document.body.removeChild(button);
  });

  it("falls back to the link variant for a plain anchor", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });
    render(<Cursor />);
    const anchor = document.createElement("a");
    anchor.href = "/menu";
    document.body.appendChild(anchor);

    dispatchPointerOver(anchor);

    const ring = document.querySelectorAll('[aria-hidden="true"]')[1]!;
    expect(ring.getAttribute("style")).toContain("width: 56px");

    document.body.removeChild(anchor);
  });

  it("shows the label text for a data-cursor=label element", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });
    render(<Cursor />);
    const link = document.createElement("a");
    link.setAttribute("data-cursor", "label");
    link.setAttribute("data-cursor-label", "See it");
    document.body.appendChild(link);

    dispatchPointerOver(link);

    expect(screen.getByText("See it")).toBeInTheDocument();

    document.body.removeChild(link);
  });

  it("resets to the default variant once the pointer leaves the target", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });
    render(<Cursor />);
    const button = document.createElement("button");
    button.setAttribute("data-cursor", "button");
    document.body.appendChild(button);

    dispatchPointerOver(button);
    dispatchPointerOut(button, document.body);

    const ring = document.querySelectorAll('[aria-hidden="true"]')[1]!;
    expect(ring.className).not.toContain("bg-cd-orange");

    document.body.removeChild(button);
  });

  it("restores the native cursor on unmount", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });
    const { unmount } = render(<Cursor />);
    dispatchPointerMove();
    expect(document.body.style.cursor).toBe("none");

    unmount();

    expect(document.body.style.cursor).toBe("");
  });
});
