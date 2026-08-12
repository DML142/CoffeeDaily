import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Error from "./error";

describe("Error", () => {
  it("calls reset when Try again is activated", async () => {
    const reset = vi.fn();
    render(<Error error={new globalThis.Error("boom")} reset={reset} />);

    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledOnce();
  });

  it("links back home", () => {
    render(<Error error={new globalThis.Error("boom")} reset={() => {}} />);
    expect(screen.getByRole("link", { name: "Back home" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
