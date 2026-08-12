import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("links to the legal pages", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute(
      "href",
      "/legal/privacy",
    );
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute(
      "href",
      "/legal/terms",
    );
  });

  it("links back to the top of the page", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Back to top" })).toHaveAttribute(
      "href",
      "#top",
    );
  });

  it("duplicates the marquee text for a seamless loop but hides the copy from screen readers", () => {
    render(<Footer />);
    const copies = screen.getAllByText(/Beyond your expectations/);
    expect(copies).toHaveLength(2);
    expect(copies[1]).toHaveAttribute("aria-hidden", "true");
  });
});
