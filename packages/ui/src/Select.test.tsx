import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Select } from "./Select";

describe("Select", () => {
  it("changes value on selection", async () => {
    render(
      <Select aria-label="City">
        <option value="">All cities</option>
        <option value="chicago">Chicago</option>
      </Select>,
    );

    const select = screen.getByLabelText("City");
    await userEvent.selectOptions(select, "chicago");

    expect(select).toHaveValue("chicago");
  });

  it("marks itself invalid when hasError is set", () => {
    render(
      <Select aria-label="Sort" hasError>
        <option value="a">A</option>
      </Select>,
    );
    expect(screen.getByLabelText("Sort")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
