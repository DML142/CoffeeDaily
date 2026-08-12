import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { Drawer } from "./Drawer";

function ControlledDrawer() {
  const [open, setOpen] = useState(true);
  return (
    <Drawer open={open} onOpenChange={setOpen} title="Menu">
      <a href="/menu">Menu</a>
    </Drawer>
  );
}

describe("Drawer", () => {
  it("renders as a dialog with the given title", () => {
    render(<ControlledDrawer />);
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
  });

  it("closes on close button activation", async () => {
    render(<ControlledDrawer />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("positions itself on the left when side is left", () => {
    render(
      <Drawer open onOpenChange={() => {}} title="Menu" side="left">
        Content
      </Drawer>,
    );
    expect(screen.getByRole("dialog")).toHaveClass("left-0");
  });
});
