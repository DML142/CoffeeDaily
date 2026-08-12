import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivacyPage from "./page";

describe("PrivacyPage", () => {
  it("renders the privacy heading", () => {
    render(<PrivacyPage />);
    expect(
      screen.getByRole("heading", { name: "Privacy policy" }),
    ).toBeInTheDocument();
  });
});
