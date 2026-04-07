/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import SubmitRating from "@/components/SubmitRating";

describe("SubmitRating", () => {
  it("renders submit button", () => {
    render(<SubmitRating />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});