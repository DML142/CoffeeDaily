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

function layer() {
  return document.querySelector('[aria-hidden="true"]')!;
}

function appendTarget(tag: string, attributes: Record<string, string> = {}) {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  document.body.appendChild(element);
  return element;
}

describe("Cursor", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    quickTo.mockClear();
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

  it("tracks the pointer with a single lerped layer", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });
    render(<Cursor />);
    expect(quickTo).toHaveBeenCalledTimes(2);
    const [, , vars] = quickTo.mock.calls[0] as unknown as [
      unknown,
      string,
      { duration: number },
    ];
    expect(vars.duration).toBe(0.3);
  });

  it("stays invisible until the first pointer position lands", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });
    render(<Cursor />);

    expect(layer().className).toContain("opacity-0");
    dispatchPointerMove();
    expect(layer().className).toContain("opacity-100");
  });

  it("leaves the native cursor alone", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });
    render(<Cursor />);
    dispatchPointerMove();

    expect(document.body.style.cursor).toBe("");
    expect(document.body.className).not.toContain("cursor-hidden");
  });

  it("stays a small dot with nothing hovered", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });
    render(<Cursor />);

    expect(layer().getAttribute("style")).toContain("width: 6px");
  });

  it("grows into a translucent circle over a link", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });
    render(<Cursor />);
    const anchor = appendTarget("a", { href: "/menu" });

    dispatchPointerOver(anchor);

    expect(layer().getAttribute("style")).toContain("width: 48px");
    expect(layer().className).toContain("bg-cd-cream/40");

    anchor.remove();
  });

  it("grows into a translucent circle over a button", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });
    render(<Cursor />);
    const button = appendTarget("button");

    dispatchPointerOver(button);

    expect(layer().getAttribute("style")).toContain("width: 48px");

    button.remove();
  });

  it("grows further and shows the label over a labelled target", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });
    render(<Cursor />);
    const link = appendTarget("a", {
      href: "/menu/iced-cold-brew",
      "data-cursor-label": "Enter",
    });

    dispatchPointerOver(link);

    expect(layer().getAttribute("style")).toContain("width: 88px");
    expect(screen.getByText("Enter")).toBeInTheDocument();

    link.remove();
  });

  it("ignores a text input, which keeps its native caret", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });
    render(<Cursor />);
    const input = appendTarget("input", { type: "text" });

    dispatchPointerOver(input);

    expect(layer().getAttribute("style")).toContain("width: 6px");

    input.remove();
  });

  it("collapses back to the dot once the pointer leaves the target", () => {
    mockMatchMedia({ [POINTER_FINE]: true, [REDUCED_MOTION]: false });
    render(<Cursor />);
    const link = appendTarget("a", {
      href: "/menu",
      "data-cursor-label": "Enter",
    });

    dispatchPointerOver(link);
    dispatchPointerOut(link, document.body);

    expect(layer().getAttribute("style")).toContain("width: 6px");
    expect(screen.queryByText("Enter")).not.toBeInTheDocument();

    link.remove();
  });
});
