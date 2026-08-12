import { orders } from "@coffee-daily/mocks";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReceiptCard } from "./ReceiptCard";

const order = orders[0]!;

describe("ReceiptCard", () => {
  it("renders the receipt number, location, items, and total", () => {
    render(<ReceiptCard order={order} />);

    expect(screen.getByText("Receipt CD-10482")).toBeInTheDocument();
    expect(screen.getByText("Fulton Market")).toBeInTheDocument();
    expect(screen.getByText("Iced Cold Brew")).toBeInTheDocument();
    expect(screen.getByText("Oat Milk Latte")).toBeInTheDocument();
    expect(screen.getByText("$15.00")).toBeInTheDocument();
  });

  it("shows a disabled download button until receipts ship with the backend", () => {
    render(<ReceiptCard order={order} />);
    expect(
      screen.getByRole("button", { name: "Download receipt PDF" }),
    ).toBeDisabled();
  });
});
