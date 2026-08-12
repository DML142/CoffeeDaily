import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ToastProvider, useToast } from "./Toast";

function TriggerToast() {
  const toast = useToast();
  return (
    <button type="button" onClick={() => toast("Added to cart", "success")}>
      Add
    </button>
  );
}

describe("Toast", () => {
  it("shows a toast announced via a live region after triggering", async () => {
    render(
      <ToastProvider>
        <TriggerToast />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Add" }));

    const region = screen.getByRole("status");
    expect(region).toHaveTextContent("Added to cart");
  });

  it("throws when useToast is used outside a provider", () => {
    function Broken() {
      useToast();
      return null;
    }

    expect(() => render(<Broken />)).toThrow(/ToastProvider/);
  });
});
