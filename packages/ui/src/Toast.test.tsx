import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
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
  afterEach(() => {
    vi.useRealTimers();
  });

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

  it("auto-dismisses a toast after the timeout", () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <TriggerToast />
      </ToastProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Add" }));
    });
    expect(screen.getByRole("status")).toHaveTextContent("Added to cart");

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.queryByText("Added to cart")).not.toBeInTheDocument();
  });

  it("throws when useToast is used outside a provider", () => {
    function Broken() {
      useToast();
      return null;
    }

    expect(() => render(<Broken />)).toThrow(/ToastProvider/);
  });
});
