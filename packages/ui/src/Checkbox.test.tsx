import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("toggles when clicked, including via the custom box and label text", async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Vegan" checked={false} onChange={onChange} />);

    await userEvent.click(screen.getByLabelText("Vegan"));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("is reachable by keyboard and toggles on space", async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Dairy-free" checked={false} onChange={onChange} />);

    await userEvent.tab();
    expect(screen.getByLabelText("Dairy-free")).toHaveFocus();

    await userEvent.keyboard(" ");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("reflects the checked state on the real input for form semantics", () => {
    render(<Checkbox label="Gluten-free" checked readOnly />);
    expect(screen.getByLabelText("Gluten-free")).toBeChecked();
  });

  it("cannot be interacted with while disabled", async () => {
    const onChange = vi.fn();
    render(
      <Checkbox label="Decaf" checked={false} onChange={onChange} disabled />,
    );

    const checkbox = screen.getByLabelText("Decaf");
    expect(checkbox).toBeDisabled();

    await userEvent.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });
});
