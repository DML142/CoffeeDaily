import { locations } from "@coffee-daily/mocks";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { useCartStore } from "@/stores/useCartStore";
import { CheckoutForm } from "./CheckoutForm";

const fultonMarket = locations.find(
  (location) => location.id === "loc_fulton-market",
)!;

const baseLine = {
  productId: "prod_iced-cold-brew",
  locationId: "loc_fulton-market",
  vessel: "glass" as const,
  size: "m" as const,
  extras: [],
  unitPriceMinor: 450,
};

beforeEach(() => {
  useCartStore.setState({ lines: [] });
});

describe("CheckoutForm", () => {
  it("shows a message and a link back to cart when there is nothing to check out", () => {
    render(<CheckoutForm location={fultonMarket} />);
    expect(screen.getByText(/Nothing to check out/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to cart" })).toHaveAttribute(
      "href",
      "/cart",
    );
  });

  it("renders the order review with the subtotal", () => {
    useCartStore.getState().addLine({ ...baseLine, quantity: 2 });
    render(<CheckoutForm location={fultonMarket} />);

    expect(screen.getByText("Iced Cold Brew")).toBeInTheDocument();
    expect(screen.getAllByText("$9.00").length).toBeGreaterThan(0);
  });

  it("shows validation errors when submitting empty required fields", async () => {
    useCartStore.getState().addLine(baseLine);
    render(<CheckoutForm location={fultonMarket} />);

    await userEvent.click(screen.getByRole("button", { name: /Pay/ }));

    expect(
      await screen.findByText("Phone number is required"),
    ).toBeInTheDocument();
    expect(screen.getByText("Full name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("rejects an invalid phone number", async () => {
    useCartStore.getState().addLine(baseLine);
    render(<CheckoutForm location={fultonMarket} />);

    await userEvent.type(screen.getByPlaceholderText("Phone number"), "123");
    await userEvent.click(screen.getByRole("button", { name: /Pay/ }));

    expect(
      await screen.findByText("Enter a valid 10-digit phone number"),
    ).toBeInTheDocument();
  });

  it("completes checkout, clears the cart, and shows a receipt", async () => {
    useCartStore.getState().addLine(baseLine);
    render(<CheckoutForm location={fultonMarket} />);

    await userEvent.type(
      screen.getByPlaceholderText("Phone number"),
      "3125551234",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Full name"),
      "Jamie Rivera",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "jamie@example.com",
    );
    await userEvent.click(screen.getByRole("button", { name: /Pay/ }));

    expect(await screen.findByText("Order confirmed")).toBeInTheDocument();
    expect(useCartStore.getState().lines).toHaveLength(0);
    expect(
      screen.getByRole("link", { name: "Track this order" }),
    ).toBeInTheDocument();
  });
});
