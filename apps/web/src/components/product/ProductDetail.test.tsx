import { products } from "@coffee-daily/mocks";
import { ToastProvider } from "@coffee-daily/ui/Toast";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "@/stores/useCartStore";
import { useLocationStore } from "@/stores/useLocationStore";
import { ProductDetail } from "./ProductDetail";

const icedColdBrew = products.find(
  (product) => product.slug === "iced-cold-brew",
)!;
const butterCroissant = products.find(
  (product) => product.slug === "butter-croissant",
)!;

function renderProductDetail(product: typeof icedColdBrew) {
  return render(
    <ToastProvider>
      <ProductDetail product={product} />
    </ToastProvider>,
  );
}

beforeEach(() => {
  useLocationStore.setState({
    selectedLocationId: null,
    recentLocationIds: [],
  });
  useCartStore.setState({ lines: [] });
});

describe("ProductDetail", () => {
  it("shows vessel and size pickers for drink products", () => {
    renderProductDetail(icedColdBrew);
    expect(screen.getByText("Vessel")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Glass" })).toBeInTheDocument();
  });

  it("hides pickers for non-drink products", () => {
    renderProductDetail(butterCroissant);
    expect(screen.queryByText("Vessel")).not.toBeInTheDocument();
  });

  it("recalculates price when size changes", async () => {
    renderProductDetail(icedColdBrew);
    expect(screen.getByText("$4.50")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "L" }));
    expect(screen.getByText("$6.00")).toBeInTheDocument();
  });

  it("prompts to choose a location instead of showing add to cart", () => {
    renderProductDetail(icedColdBrew);
    expect(
      screen.getByRole("link", { name: "Choose a location" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add to cart" }),
    ).not.toBeInTheDocument();
  });

  it("adds the selected combination to the cart once a location is chosen", async () => {
    useLocationStore.setState({
      selectedLocationId: "loc_fulton-market",
      recentLocationIds: [],
    });
    renderProductDetail(icedColdBrew);

    await userEvent.click(screen.getByRole("button", { name: "M" }));
    await userEvent.click(screen.getByRole("button", { name: "Add to cart" }));

    const [line] = useCartStore.getState().lines;
    expect(line?.productId).toBe(icedColdBrew.id);
    expect(line?.vessel).toBe("glass");
    expect(line?.size).toBe("m");
  });

  it("disables an out-of-stock combination at the selected location", () => {
    useLocationStore.setState({
      selectedLocationId: "loc_fulton-market",
      recentLocationIds: [],
    });
    renderProductDetail(icedColdBrew);

    expect(screen.getByRole("button", { name: "S" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Out of stock at this location" }),
    ).toBeDisabled();
  });
});
