import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("accepts typed input", async () => {
    render(<Input aria-label="Email" />);
    const input = screen.getByLabelText("Email");

    await userEvent.type(input, "you@example.com");

    expect(input).toHaveValue("you@example.com");
  });

  it("marks itself invalid when hasError is set", () => {
    render(<Input aria-label="Phone" hasError />);
    expect(screen.getByLabelText("Phone")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
