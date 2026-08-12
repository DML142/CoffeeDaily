import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OrderLookupPage from "./page";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

beforeEach(() => {
  pushMock.mockClear();
});

describe("OrderLookupPage", () => {
  it("navigates to the order detail page on a matching receipt and phone", async () => {
    render(<OrderLookupPage />);

    await userEvent.type(
      screen.getByPlaceholderText("Receipt number"),
      "CD-10482",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Phone number"),
      "3125550142",
    );
    await userEvent.click(screen.getByRole("button", { name: "Look up" }));

    expect(pushMock).toHaveBeenCalledWith("/order/CD-10482");
  });

  it("shows an error when the receipt and phone don't match", async () => {
    render(<OrderLookupPage />);

    await userEvent.type(
      screen.getByPlaceholderText("Receipt number"),
      "CD-99999",
    );
    await userEvent.type(
      screen.getByPlaceholderText("Phone number"),
      "5555550000",
    );
    await userEvent.click(screen.getByRole("button", { name: "Look up" }));

    expect(
      screen.getByText("No order found for that receipt number and phone."),
    ).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
