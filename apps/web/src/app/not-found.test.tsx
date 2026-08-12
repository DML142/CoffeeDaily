import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "./not-found";

describe("NotFound", () => {
  it("links back home", () => {
    render(<NotFound />);
    expect(screen.getByRole("link", { name: "Back home" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
