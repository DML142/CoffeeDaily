import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TermsPage from "./page";

describe("TermsPage", () => {
  it("renders the terms heading", () => {
    render(<TermsPage />);
    expect(
      screen.getByRole("heading", { name: "Terms of service" }),
    ).toBeInTheDocument();
  });
});
