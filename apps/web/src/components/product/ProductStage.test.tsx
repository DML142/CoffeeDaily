import { products } from "@coffee-daily/mocks";
import { act, render, screen, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockMatchMedia } from "@/test-utils/mockMatchMedia";
import { ProductStage } from "./ProductStage";

vi.mock("@/components/product/CupPreview", () => ({
  CupPreview: ({
    vessel,
    size,
    isActive,
    onReady,
  }: {
    vessel: string;
    size: string;
    isActive: boolean;
    onReady: () => void;
  }) => {
    useEffect(() => {
      onReady();
    }, [onReady]);
    return (
      <div data-testid="cup-canvas" data-active={isActive}>
        {vessel}-{size}
      </div>
    );
  },
}));

const icedColdBrew = products.find(
  (product) => product.slug === "iced-cold-brew",
)!;

function allowMotion() {
  mockMatchMedia({ "(prefers-reduced-motion: reduce)": false });
}

function stubCanvasContext(value: unknown) {
  HTMLCanvasElement.prototype.getContext = vi.fn(
    () => value,
  ) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}

beforeEach(() => {
  stubCanvasContext({});
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("ProductStage", () => {
  it("shows the product photo and no canvas before any option changes", () => {
    allowMotion();
    render(
      <ProductStage
        product={icedColdBrew}
        vessel="glass"
        size="m"
        canPreview
      />,
    );

    expect(screen.getByAltText(icedColdBrew.name)).toBeInTheDocument();
    expect(screen.queryByTestId("cup-preview")).not.toBeInTheDocument();
  });

  it("mounts the preview when the option changes and hides it after the window", async () => {
    allowMotion();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { rerender } = render(
      <ProductStage
        product={icedColdBrew}
        vessel="glass"
        size="m"
        canPreview
      />,
    );

    rerender(
      <ProductStage
        product={icedColdBrew}
        vessel="ceramic"
        size="m"
        canPreview
      />,
    );

    const canvas = await screen.findByTestId("cup-canvas");
    await waitFor(() => expect(canvas).toHaveAttribute("data-active", "true"));

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByTestId("cup-canvas")).toHaveAttribute(
      "data-active",
      "false",
    );
  });

  it("stays on the photo for products without vessel options", () => {
    allowMotion();
    const { rerender } = render(
      <ProductStage
        product={icedColdBrew}
        vessel="glass"
        size="m"
        canPreview={false}
      />,
    );

    rerender(
      <ProductStage
        product={icedColdBrew}
        vessel="ceramic"
        size="m"
        canPreview={false}
      />,
    );

    expect(screen.queryByTestId("cup-preview")).not.toBeInTheDocument();
  });

  it("stays on the photo under reduced motion", () => {
    mockMatchMedia({ "(prefers-reduced-motion: reduce)": true });
    const { rerender } = render(
      <ProductStage
        product={icedColdBrew}
        vessel="glass"
        size="m"
        canPreview
      />,
    );

    rerender(
      <ProductStage
        product={icedColdBrew}
        vessel="ceramic"
        size="m"
        canPreview
      />,
    );

    expect(screen.queryByTestId("cup-preview")).not.toBeInTheDocument();
  });

  it("stays on the photo when the browser has no WebGL", () => {
    allowMotion();
    stubCanvasContext(null);
    const { rerender } = render(
      <ProductStage
        product={icedColdBrew}
        vessel="glass"
        size="m"
        canPreview
      />,
    );

    rerender(
      <ProductStage
        product={icedColdBrew}
        vessel="ceramic"
        size="m"
        canPreview
      />,
    );

    expect(screen.queryByTestId("cup-preview")).not.toBeInTheDocument();
  });
});
