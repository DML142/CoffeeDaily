import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

const OPTIONS = [
  { value: "chicago", label: "Chicago" },
  { value: "denver", label: "Denver" },
];

describe("Select", () => {
  it("shows the label of the current value", () => {
    render(
      <Select
        aria-label="City"
        value="chicago"
        onValueChange={vi.fn()}
        options={OPTIONS}
      />,
    );
    expect(screen.getByRole("combobox", { name: "City" })).toHaveTextContent(
      "Chicago",
    );
  });

  it("opens on click and calls onValueChange when an option is picked", async () => {
    const onValueChange = vi.fn();
    render(
      <Select
        aria-label="City"
        value="chicago"
        onValueChange={onValueChange}
        options={OPTIONS}
      />,
    );

    await userEvent.click(screen.getByRole("combobox", { name: "City" }));
    await userEvent.click(screen.getByRole("option", { name: "Denver" }));

    expect(onValueChange).toHaveBeenCalledWith("denver");
  });

  it("is reachable and operable by keyboard", async () => {
    const onValueChange = vi.fn();
    render(
      <Select
        aria-label="City"
        value="chicago"
        onValueChange={onValueChange}
        options={OPTIONS}
      />,
    );

    await userEvent.tab();
    expect(screen.getByRole("combobox", { name: "City" })).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("option", { name: "Chicago" })).toBeVisible();

    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("denver");
  });

  it("shows a placeholder when nothing is selected", () => {
    render(
      <Select
        aria-label="City"
        value=""
        onValueChange={vi.fn()}
        options={OPTIONS}
        placeholder="All cities"
      />,
    );
    expect(screen.getByRole("combobox", { name: "City" })).toHaveTextContent(
      "All cities",
    );
  });

  it("marks itself invalid when hasError is set", () => {
    render(
      <Select
        aria-label="Sort"
        value="chicago"
        onValueChange={vi.fn()}
        options={OPTIONS}
        hasError
      />,
    );
    expect(screen.getByRole("combobox", { name: "Sort" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("cannot be opened while disabled", async () => {
    render(
      <Select
        aria-label="City"
        value="chicago"
        onValueChange={vi.fn()}
        options={OPTIONS}
        disabled
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "City" });
    expect(trigger).toBeDisabled();

    await userEvent.click(trigger);
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });
});
