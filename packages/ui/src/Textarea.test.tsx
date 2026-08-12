import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("accepts typed input", async () => {
    render(<Textarea aria-label="Notes" />);
    const textarea = screen.getByLabelText("Notes");

    await userEvent.type(textarea, "Leave at the counter");

    expect(textarea).toHaveValue("Leave at the counter");
  });
});
