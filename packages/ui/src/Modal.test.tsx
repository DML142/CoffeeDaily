import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

function ControlledModal() {
  const [open, setOpen] = useState(true);
  return (
    <Modal open={open} onOpenChange={setOpen} title="Change location">
      Body content
    </Modal>
  );
}

describe("Modal", () => {
  it("renders title and content while open", () => {
    render(<ControlledModal />);
    expect(
      screen.getByRole("dialog", { name: "Change location" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("closes when the close button is activated", async () => {
    render(<ControlledModal />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onOpenChange(false) on escape", async () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange} title="Params">
        Content
      </Modal>,
    );

    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders a description when given one", () => {
    render(
      <Modal
        open
        onOpenChange={() => {}}
        title="Params"
        description="Upload a PDF or TXT."
      >
        Content
      </Modal>,
    );
    expect(screen.getByText("Upload a PDF or TXT.")).toBeInTheDocument();
  });
});
