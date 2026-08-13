import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children and responds to click", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Add to cart</Button>);

    const button = screen.getByRole("button", { name: "Add to cart" });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("disables interaction while loading", async () => {
    const onClick = vi.fn();
    render(
      <Button isLoading onClick={onClick}>
        Pay
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Pay" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("stays keyboard reachable and shows a focus outline class", () => {
    render(<Button>Checkout</Button>);
    const button = screen.getByRole("button", { name: "Checkout" });
    button.focus();
    expect(button).toHaveFocus();
    expect(button.className).toContain("focus-visible:outline");
  });

  it("inverts its two tones on hover instead of just darkening", () => {
    render(<Button>Pay</Button>);
    const button = screen.getByRole("button", { name: "Pay" });
    expect(button.className).toContain("hover:bg-cd-cream");
    expect(button.className).toContain("hover:text-cd-orange");
  });
});
